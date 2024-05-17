import logging
import os
import uuid

import toml
from flask import Flask
from google.cloud import secretmanager


def load_config(app):
    if os.path.isfile("config.toml"):
        file_path = os.path.abspath("config.toml")
        print(f"load config file from {file_path}")
        app.config.from_file(file_path, load=toml.load, text=True)

    elif os.environ.get("GOOGLE_CLOUD_PROJECT", None):
        project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
        secret_name = os.environ.get("GOOGLE_CLOUD_SECRET_NAME")

        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
        payload = client.access_secret_version(name=name).payload.data.decode(
            "UTF-8"
        )
        print(f"load config file from secret manager: {name}")
        app.config.from_mapping(toml.loads(payload))

    else:
        raise Exception(
            "No local config.toml or GOOGLE_CLOUD_PROJECT detected. No secrets found."
        )


def create_app(args={}):
    app = Flask(__name__, **args)

    load_config(app)

    if app.config["TESTING"]:
        app.logger.setLevel(logging.DEBUG)

    from viewer.server.auth import auth_blueprint
    from viewer.server.upload import upload_blueprint
    from viewer.server.view import view_blueprint

    app.register_blueprint(view_blueprint, url_prefix="/view")
    app.register_blueprint(upload_blueprint, url_prefix="/upload")
    app.register_blueprint(auth_blueprint, url_prefix="/auth")

    app.secret_key = app.config.get("SESSION_SECRET", str(uuid.uuid4()))

    return app
