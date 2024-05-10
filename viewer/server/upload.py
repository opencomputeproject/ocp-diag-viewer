import base64
import gzip
import hashlib
import json
import os
import re
from urllib.parse import unquote, urlparse

import requests
from flask import Blueprint, abort, current_app, redirect, request, url_for

from viewer.libs.build_ocp_diag_result_data import build_ocp_diag_test_data_js
from viewer.server.storage import get_storage

upload_blueprint = Blueprint("upload", __name__, url_prefix="/upload")


def is_gzipped_file(content: bytes):
    return content[:2] == b"\x1f\x8b"


def get_fetch_uri_allow_list() -> list[dict[str, str]]:
    return current_app.config.get("UPLOAD_ALLOW_URLS", [])


def calculate_hash(content: bytes) -> str:
    digest = hashlib.sha256(content).digest()
    return base64.urlsafe_b64encode(digest[:16]).rstrip(b"=").decode("utf-8")


def is_allowed_source(uri: str):
    allow_list = get_fetch_uri_allow_list()
    parsed_uri = urlparse(uri)

    for allowed_source in allow_list:
        if (
            parsed_uri.scheme == allowed_source["scheme"]
            and parsed_uri.netloc == allowed_source["netloc"]
            and re.search(
                allowed_source["path_regex"],
                os.path.realpath(unquote(parsed_uri.path)),
            )
        ):
            return True
    return False


def is_valid_uri_format(uri: str):
    parsed_uri = urlparse(uri)
    return all([parsed_uri.scheme, parsed_uri.netloc])


def fetch(uri: str) -> bytes:
    """Downloads a file from a web link

    Args:
        uri: The uri of the file to fetch

    Returns:
        The content of the file if it exists.

    Raises:
        Raises abort signal if an error occurs while fetching the file.
    """
    if not is_valid_uri_format(uri):
        abort(400, "Invalid URL.")

    if not is_allowed_source(uri):
        abort(403, "Forbidden source.")

    try:
        response = requests.get(uri, timeout=300)
    except Exception as e:
        abort(
            400,
            f"An unexpected error occured while requesting for {uri}. Error message: {str(e)}",
        )

    if response.status_code != 200:
        abort(
            400,
            f"Request to fetch {uri} failed. Status code: {response.status_code}, reason: {response.reason}.",
        )

    return response.content


def verify_and_upload_content(content: str):
    """Checks if a text is valid Meltan Result. Uploads it to GCS if it is valid and throw exception otherwise

    Args:
        content: the text to verify and upload

    Returns:
        The hash value of the content if it is a valid Meltan Result

    Raises:
        Raise Exception if the content is not a valid JSON, or if it does not conform to Meltan Result schema format
    """
    try:
        build_ocp_diag_test_data_js(content)
    except json.JSONDecodeError as e:
        abort(
            400,
            e.msg,
        )

    except Exception as e:
        raise e

    storage = get_storage()
    hash = calculate_hash(content.encode())
    storage.upload(content, hash)
    return hash


@upload_blueprint.route("/", methods=["POST"], strict_slashes=False)
def upload_meltan_results():
    file = request.files["file"]
    if not file:
        abort(400, "No file received.")

    content = file.read().decode()
    hash = verify_and_upload_content(content)
    return {"share_id": hash}


@upload_blueprint.route("/", methods=["GET"], strict_slashes=False)
def upload_meltan_results_by_uri():
    uri = request.args.get("file", None)
    if not uri:
        abort(400, "Parameter file cannot be empty")
    content = fetch(uri)
    if is_gzipped_file(content):
        content = gzip.decompress(content)

    hash = verify_and_upload_content(content.decode())

    return redirect(url_for("view.display_file_share_id", share_id=hash))
