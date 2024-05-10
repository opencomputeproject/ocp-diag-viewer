import importlib.resources as pkg_resources

from bs4 import BeautifulSoup

from viewer.server import templates


def insert_ocp_diag_result_data(
    file_path=pkg_resources.path(templates, "index.html")
):
    """Inserts the placeholder for the Meltan result data object passed by the user."""
    soup = BeautifulSoup(file_path.read_text(), "html.parser")
    # the scripts.js in the index.html copied from frontend folder is the placeholder for the OCP diag test result data
    # we do not need it anymore since we are injecting real data into it
    soup.find("script", attrs={"src": "/static/scripts.js"}).extract()
    ocp_diag_test_data_tag = soup.new_tag("script")
    ocp_diag_test_data_tag.string = "{{ ocp_diag_test_data | safe }}"
    soup.find("body").append(ocp_diag_test_data_tag)
    file_path.write_text(soup.prettify())
