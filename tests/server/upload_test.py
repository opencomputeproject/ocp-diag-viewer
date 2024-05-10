import gzip
import os
from os.path import exists
import shutil

import requests
import pytest
from unittest.mock import patch
from flask import url_for
import html
from werkzeug.exceptions import BadRequest, Forbidden

from viewer.server.upload import (
    calculate_hash,
    fetch,
    is_gzipped_file,
    is_allowed_source,
)


def testCalculateHash():
    hash = calculate_hash("konichiwaaloha".encode("utf-8"))
    assert hash == "FnDy3P5yZriPxuzeoHBClA"


def testUploadFileSuccess(client, testdata, test_dir):
    file_path = os.path.join(testdata, "valid_upload_test.txt")
    file = open(file_path, "rb")
    content = file.read()
    hash = calculate_hash(content)
    uploaded_path = os.path.join(test_dir, hash)

    res = client.post(
        "/upload",
        data={"file": open(file_path, "rb")},
    )
    assert res.status_code == 200
    assert res.get_json() == {"share_id": hash}

    assert exists(uploaded_path)


def testUploadFileError(client, testdata):
    file_path = os.path.join(testdata, "invalid_upload_test.txt")
    file = open(file_path, "rb")
    content = file.read()
    hash = calculate_hash(content)

    response = client.post(
        "/upload",
        data={"file": open(file_path, "rb")},
    )

    data = html.unescape(response.get_data().decode())
    assert response.status_code == 400
    assert (
        "Test result is not of valid JSON format. Current line content: TEST. Line number: 1."
        in data
    )
    assert not exists(os.path.join(testdata, hash))


@patch("viewer.server.upload.get_fetch_uri_allow_list")
def testIsAllowedSourcePass(mock_get_allow_list):
    mock_get_allow_list.return_value = [
        {"scheme": "https", "netloc": "uri.com", "path_regex": r"."}
    ]
    assert is_allowed_source("https://uri.com") == True
    mock_get_allow_list.return_value = [
        {"scheme": "https", "netloc": "uri.com", "path_regex": r"\/allow\/+."}
    ]
    assert is_allowed_source("https://uri.com/allow/xxx") == True


@patch("viewer.server.upload.get_fetch_uri_allow_list")
def testIsAllowedSourceFail(mock_get_allow_list):
    mock_get_allow_list.return_value = [
        {"scheme": "https", "netloc": "uri.com", "path_regex": r"\/allow\/+."}
    ]
    assert is_allowed_source("http://allow.com") == False
    assert is_allowed_source("https://disallow.com") == False
    assert is_allowed_source("http://uri.com@x.com/file") == False
    assert is_allowed_source("https://uri.com/disallow/file") == False
    assert is_allowed_source("https://uri.com/allow/../disallow/file") == False
    assert (
        is_allowed_source("https://uri.com/allow/..%2fdisallow/file") == False
    )


@patch("viewer.server.upload.get_fetch_uri_allow_list")
def testFetchSuccess(mock_get_allow_list, requests_mock):
    mock_get_allow_list.return_value = [
        {"scheme": "https", "netloc": "uri.com", "path_regex": r"."}
    ]
    content = "Content"
    test_request_path = "https://uri.com"
    requests_mock.get(test_request_path, text=content)
    assert fetch(test_request_path).decode() == content


def testFetchInvalidURLError():
    with pytest.raises(BadRequest) as exception:
        fetch("not a uri")
    assert exception.value.code == 400
    assert exception.value.description == "Invalid URL."


@patch("viewer.server.upload.get_fetch_uri_allow_list")
@patch("viewer.server.upload.requests")
def testFetchException(mock_requests, mock_get_allow_list):
    mock_get_allow_list.return_value = [
        {"scheme": "https", "netloc": "uri.com", "path_regex": r"."}
    ]
    mock_requests.get.side_effect = requests.exceptions.ConnectTimeout(
        "Request timeout!"
    )
    test_request_path = "https://uri.com"
    with pytest.raises(BadRequest) as exception:
        fetch(test_request_path)
    assert (
        exception.value.description
        == f"An unexpected error occured while requesting for {test_request_path}. Error message: Request timeout!"
    )


@patch("viewer.server.upload.get_fetch_uri_allow_list")
def testFetchError(mock_get_allow_list, requests_mock):
    mock_get_allow_list.return_value = [
        {"scheme": "https", "netloc": "not-found.com", "path_regex": r"."}
    ]
    test_request_path = "https://not-found.com"
    requests_mock.get(test_request_path, status_code=404, reason="Not Found")
    with pytest.raises(BadRequest) as exception:
        fetch(test_request_path)
    assert exception.value.code == 400
    assert (
        exception.value.description
        == f"Request to fetch {test_request_path} failed. Status code: 404, reason: Not Found."
    )


@patch("viewer.server.upload.get_fetch_uri_allow_list")
def testUploadMeltanResultsByUriSuccess(
    mock_get_allow_list, client, testdata, test_dir, requests_mock
):
    mock_get_allow_list.return_value = [
        {"scheme": "https", "netloc": "uri.com", "path_regex": r"."}
    ]
    test_request_path = "https://uri.com"
    file_path = os.path.join(testdata, "valid_upload_test.txt")
    file = open(file_path, "rb")
    content = file.read()
    requests_mock.get(test_request_path, text=content.decode())
    hash = calculate_hash(content)
    upload_path = os.path.join(test_dir, hash)

    response = client.get("/upload", query_string={"file": test_request_path})
    assert response.status_code == 302
    assert response.headers["Location"] == url_for(
        "view.display_file_share_id", share_id=hash
    )
    assert exists(upload_path)


def testIsGzipFile(testdata):
    text_path = os.path.join(testdata, "valid_upload_test.txt")
    gzip_path = os.path.join(testdata, "valid_upload_test.txt.gz")

    with open(gzip_path, "rb") as gzip_file:
        assert is_gzipped_file(gzip_file.read()) == True
    with open(text_path, "rb") as text_file:
        assert is_gzipped_file(text_file.read()) == False


@patch("viewer.server.upload.get_fetch_uri_allow_list")
def testUploadMeltanResultsByUriGzipFile(
    mock_get_allow_list, client, testdata, test_dir, requests_mock
):
    mock_get_allow_list.return_value = [
        {"scheme": "https", "netloc": "uri.com", "path_regex": r"."}
    ]
    text_path = os.path.join(testdata, "valid_upload_test.txt")
    gzip_path = os.path.join(testdata, "valid_upload_test.txt.gz")

    test_request_path = "https://uri.com"
    gzip_content = open(gzip_path, "rb").read()
    requests_mock.get(test_request_path, content=gzip_content)
    text_file_content = open(text_path, "rb").read()
    hash = calculate_hash(text_file_content)
    upload_path = os.path.join(test_dir, hash)

    response = client.get("/upload", query_string={"file": test_request_path})
    assert response.status_code == 302
    assert response.headers["Location"] == url_for(
        "view.display_file_share_id", share_id=hash
    )
    assert exists(upload_path)


@patch("viewer.server.upload.get_fetch_uri_allow_list")
def testUploadMeltanResultsByUriError(
    mock_get_allow_list, client, testdata, requests_mock
):
    mock_get_allow_list.return_value = [
        {"scheme": "https", "netloc": "uri.com", "path_regex": r"."}
    ]
    file_path = os.path.join(testdata, "invalid_upload_test.txt")
    file = open(file_path, "rb")
    content = file.read()
    test_request_path = "https://uri.com"
    requests_mock.get(test_request_path, text=content.decode())
    hash = calculate_hash(content)
    response = client.get("/upload", query_string={"file": test_request_path})
    data = html.unescape(response.get_data().decode())
    assert response.status_code == 400
    assert (
        "Test result is not of valid JSON format. Current line content: TEST. Line number: 1."
        in data
    )
    assert not exists(os.path.join(testdata, hash))


@patch("viewer.server.upload.get_fetch_uri_allow_list")
def testUploadMeltanResultsByUriDisallowedSourceError(mock_get_allow_list):
    mock_get_allow_list.return_value = [
        {"scheme": "https", "netloc": "uri.com", "path_regex": r"."}
    ]
    test_request_path = "https://not-found.com"
    with pytest.raises(Forbidden) as exception:
        fetch(test_request_path)
    assert exception.value.code == 403
    assert exception.value.description == "Forbidden source."


def testUploadMeltanResultsByUriEmptyFileError(client):
    response = client.get("/upload", query_string={"file": ""})
    data = html.unescape(response.get_data().decode())
    assert response.status_code == 400
    assert "Parameter file cannot be empty" in data
