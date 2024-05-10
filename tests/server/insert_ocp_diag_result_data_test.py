from bs4 import BeautifulSoup
import pytest

from viewer.server.insert_ocp_diag_result_data import insert_ocp_diag_result_data


@pytest.fixture()
def index_file_path(tmp_path):
    test_file = tmp_path / "index.html"
    test_file.write_text("<body><script src='/static/scripts.js'></script></body>")

    return test_file


def testInsertOcpDiagResultData(index_file_path):
    insert_ocp_diag_result_data(index_file_path)
    # check that after calling the util, the ocp result variable exists
    soup = BeautifulSoup(index_file_path.read_text(), "html.parser")
    scripts = soup.find_all("script")
    ocp_tag = filter(
        lambda script: script.string.strip() == "{{ ocp_diag_test_data | safe }}",
        scripts,
    )
    assert len(list(ocp_tag)) == 1
    # the old src /static/scripts.js should be gone
    old_script_tag = soup.find("script", attrs={"src": "/static/scripts.js"})
    assert old_script_tag == None
