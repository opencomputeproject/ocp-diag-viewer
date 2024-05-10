from flask import Blueprint, render_template

from viewer.libs.build_ocp_diag_result_data import build_ocp_diag_test_data_js
from viewer.server.middlewares import login_required
from viewer.server.storage import get_storage

view_blueprint = Blueprint("view", __name__, url_prefix="/view")


@view_blueprint.route("/<string:share_id>", strict_slashes=False)
@login_required
def display_file_share_id(share_id):
    content = get_storage().download(share_id)
    data = build_ocp_diag_test_data_js(content)
    return render_template("index.html", ocp_diag_test_data=data)
