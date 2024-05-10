from bs4 import BeautifulSoup
import pytest

from viewer.client.remove_static_path import remove_static_path

@pytest.fixture()
def index_file_path(tmp_path):
    test_file = tmp_path / "index.html"
    test_file.write_text("<body><script src='/static/main.js'></script><link href='/static/styles.css' rel='stylesheet'/></body>")

    return test_file

def testRemoveStaticFolderFromScriptName(index_file_path):
    remove_static_path(index_file_path)
    soup = BeautifulSoup(index_file_path.read_text(), "html.parser")
    scripts = soup.find("script")
    assert scripts["src"] == "/main.js"
    style = soup.find("link", attrs={"rel": "stylesheet"})
    assert style["href"] == "/styles.css"
