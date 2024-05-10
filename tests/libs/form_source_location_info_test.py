import pytest

from viewer.libs.form_source_location_info import form_source_location_info
from viewer.server import create_app


@pytest.fixture
def app():
    app = create_app()
    with app.app_context():
        yield app


def test_get_source_location(app):
    assert form_source_location_info(
        {"sourceLocation": {"file": "file", "line": "1"}}
    ) == {"sourceLocation": "file:1"}
    assert form_source_location_info({}) == {}
    assert form_source_location_info({"sourceLocation": {"line": "0"}}) == {}
    assert form_source_location_info({"sourceLocation": {"file": "file"}}) == {
        "sourceLocation": "file:0"
    }


def test_get_source_location_link_match(app):
    app.config.update(
        {
            "SOURCE_LOCATION_MAPS": [
                {
                    "match_regex": "test.*",
                    "link_format": "https://test.com/search?q={file}:{line}",
                }
            ]
        }
    )
    assert form_source_location_info(
        {"sourceLocation": {"file": "test", "line": "1"}}
    ) == {
        "sourceLocation": "test:1",
        "sourceLocationLink": "https://test.com/search?q=test:1",
    }
    assert form_source_location_info({"sourceLocation": {"file": "test"}}) == {
        "sourceLocation": "test:0",
        "sourceLocationLink": "https://test.com/search?q=test:0",
    }


def test_get_source_location_link_no_match(app):
    app.config.update(
        {
            "SOURCE_LOCATION_MAPS": [
                {
                    "match_regex": "third_party.*",
                    "link_format": "https://test.com/search?q={file}:{line}",
                }
            ]
        }
    )
    assert form_source_location_info(
        {"sourceLocation": {"file": "meltan"}}
    ) == {
        "sourceLocation": "meltan:0",
    }


def test_get_source_location_link_multiple_matches(app):
    app.config.update(
        {
            "SOURCE_LOCATION_MAPS": [
                {
                    "match_regex": "src/.*",
                    "link_format": "https://src.example.com/{file}:{line}",
                },
                {
                    "match_regex": "test/.*",
                    "link_format": "https://test.example.com/{file}:{line}",
                },
            ]
        }
    )
    assert form_source_location_info(
        {"sourceLocation": {"file": "test/file.py", "line": "1"}}
    ) == {
        "sourceLocation": "test/file.py:1",
        "sourceLocationLink": "https://test.example.com/test/file.py:1",
    }
