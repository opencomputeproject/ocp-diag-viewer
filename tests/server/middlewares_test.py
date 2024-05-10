import pytest

from flask import Flask
from flask import session, url_for

from viewer.server.auth import auth_register
from viewer.server.middlewares import login_required


@pytest.fixture
def auth_app_client(app):
    app.config.update(
        {
            "OPENID_CLIENT_ID": "!test",
            "OPENID_CLIENT_SCERET": "!secrete",
            "OPENID_SERVER_META_DATA_URL": "https://example.com/",
            "OPENID_ALLOW_USER_REGEX": "^.+@example.com$",
        }
    )
    auth_register(app)

    @app.route("/noauth")
    def noauth():
        return "pass"

    @app.route("/auth_required")
    @login_required
    def auth_required():
        return "pass"

    with app.test_client() as auth_app_client:
        yield auth_app_client


def test_login_required_noauth(auth_app_client):
    response = auth_app_client.get("/noauth")
    assert response.status_code == 200


def test_login_required_auth(auth_app_client):
    response = auth_app_client.get("/auth_required")
    assert response.status_code == 302
    assert response.headers["Location"] == "/auth/login//auth_required"


def test_login_required_auth_nouser(auth_app_client):
    response = auth_app_client.get("/auth_required")
    assert response.status_code == 302
    assert response.headers["Location"] == "/auth/login//auth_required"


def test_login_requried_auth_valid_user(auth_app_client):
    response = auth_app_client.get("/auth_required")
    with auth_app_client.session_transaction() as session:
        session["user"] = "test@example.com"

    response = auth_app_client.get("/auth_required")
    assert response.status_code == 200


def test_login_requried_auth_invalid_user(auth_app_client):
    response = auth_app_client.get("/auth_required")
    with auth_app_client.session_transaction() as session:
        session["user"] = "test@invalid.com"

    response = auth_app_client.get("/auth_required")
    assert response.status_code == 302
    assert response.headers["Location"] == "/auth/unauthorised"
