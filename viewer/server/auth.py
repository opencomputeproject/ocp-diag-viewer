from authlib.integrations.flask_client import OAuth
from flask import (
    Blueprint,
    current_app,
    redirect,
    render_template,
    session,
    url_for,
)

auth_blueprint = Blueprint("auth", __name__, url_prefix="/auth")


def auth_register(app):
    client_id = app.config.get("OPENID_CLIENT_ID")
    if not client_id:
        return

    app.logger.info(f"Oauth enabled. client_id: {client_id}")
    oauth = OAuth(app)
    oauth.register(
        name="openid",
        server_metadata_url=app.config["OPENID_SERVER_META_DATA_URL"],
        client_kwargs={"scope": "openid email profile"},
        prompt="consent",
    )
    app.config["oauth"] = oauth.openid


@auth_blueprint.route("/callback", strict_slashes=False)
def callback():
    token = current_app.config["oauth"].authorize_access_token()
    session["user"] = token["userinfo"]["email"]
    return redirect("/" + (session.pop("redirect_path") or ""))


@auth_blueprint.route("/login", strict_slashes=False)
@auth_blueprint.route("/login/<path:redirect_path>", strict_slashes=False)
def login(redirect_path=None):
    redirect_uri = url_for("auth.callback", _external=True)
    session["redirect_path"] = redirect_path
    return current_app.config["oauth"].authorize_redirect(redirect_uri)


@auth_blueprint.route("/unauthorised")
def unauthorised():
    session.pop("user", None)
    return render_template("unauthorised.html")
