import glob
import os
import pytest

from viewer.server.storage import LocalStorage
from viewer.server import create_app


@pytest.fixture
def testdata():
    curr_dir = os.path.dirname(__file__)
    return os.path.join(curr_dir, "testdata")


@pytest.fixture
def test_dir():
    folder_path = LocalStorage("testdir").folder_path
    files = glob.glob(os.path.join(folder_path, "*"))
    for file in files:
        os.remove(file)
    return LocalStorage("testdir").folder_path


@pytest.fixture
def app(testdata, test_dir):
    flask_app = create_app()
    yield flask_app


@pytest.fixture
def client(app):
    with app.test_client() as client:
        yield client
