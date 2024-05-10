import re
from functools import wraps

from flask import current_app, redirect, request, session, url_for


def login_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        if not current_app.config.get("oauth"):
            # Auth is not required.
            return func(*args, **kwargs)

        user = session.get("user")

        if user is None:
            # No login, login
            return redirect(url_for("auth.login", redirect_path=request.path))

        if not re.match(
            current_app.config.get("OPENID_ALLOW_USER_REGEX", ""), user
        ):
            return redirect(url_for("auth.unauthorised"))

        # Check user name here.
        return func(*args, **kwargs)

    return decorated_function
