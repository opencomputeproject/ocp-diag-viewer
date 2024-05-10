import os
from os.path import exists

import unittest
from unittest.mock import Mock, patch

from google.cloud.exceptions import GoogleCloudError
from google.cloud.storage.retry import DEFAULT_RETRY

from viewer.server import storage


@patch("viewer.server.storage.storage", autospec=True)
def testGCSDownloadSuccess(mock_storage):
    mock_gcs_client = mock_storage.Client.return_value
    mock_bucket = Mock()
    mock_bucket.blob.return_value.exists.return_value = True
    mock_bucket.blob.return_value.download_as_text.return_value = (
        "This is a test file"
    )
    mock_gcs_client.bucket.return_value = mock_bucket
    gcsStorage = storage.GCSStorage("")
    assert gcsStorage.download("blob_name") == "This is a test file"
    mock_storage.Client.assert_called_once()
    mock_bucket.blob.assert_called_once_with("blob_name")


@patch("viewer.server.storage.storage", autospec=True)
@patch("viewer.server.storage.abort", autospec=True)
def testGCSDownloadFailure(mock_abort, mock_storage):
    mock_gcs_client = mock_storage.Client.return_value
    mock_bucket = Mock()
    mock_bucket.blob.return_value.exists.return_value = False
    mock_gcs_client.bucket.return_value = mock_bucket
    gcsStorage = storage.GCSStorage("")
    gcsStorage.download("blob_name")
    mock_storage.Client.assert_called_once()
    mock_bucket.blob.assert_called_once_with("blob_name")
    mock_abort.assert_called_once_with(404, "Invalid share id")


@patch("viewer.server.storage.storage", autospec=True)
def testGCSUploadloadSuccess(mock_storage):
    mock_gcs_client = mock_storage.Client.return_value
    mock_bucket = Mock()
    mock_blob = Mock()
    mock_blob.upload_from_string.return_value = ""
    mock_bucket.blob.return_value = mock_blob
    mock_gcs_client.bucket.return_value = mock_bucket
    gcsStorage = storage.GCSStorage("")
    gcsStorage.upload("Test", "file_name")
    mock_storage.Client.assert_called_once()
    mock_bucket.blob.assert_called_once_with("file_name")
    mock_blob.upload_from_string.assert_called_once_with(
        "Test", retry=DEFAULT_RETRY
    )


@patch("viewer.server.storage.storage", autospec=True)
@patch("viewer.server.storage.abort", autospec=True)
def testGCSUploadloadError(mock_abort, mock_storage):
    mock_gcs_client = mock_storage.Client.return_value
    mock_bucket = Mock()
    mock_blob = Mock()
    mock_blob.upload_from_string.side_effect = GoogleCloudError(
        "There is an error"
    )
    mock_bucket.blob.return_value = mock_blob
    mock_gcs_client.bucket.return_value = mock_bucket
    gcsStorage = storage.GCSStorage("")
    gcsStorage.upload("Test", "file_name")
    mock_storage.Client.assert_called_once()
    mock_bucket.blob.assert_called_once_with("file_name")
    mock_blob.upload_from_string.assert_called_once_with(
        "Test", retry=DEFAULT_RETRY
    )
    mock_abort.assert_called_once_with(400, "There is an error")


def testLocalStorageDownload(testdata):
    file_name = "test_file_name"
    local_storage = storage.LocalStorage(testdata)
    path = os.path.join(testdata, file_name)
    with open(path, "w") as file:
        file.write("Test local download")
    response = local_storage.download(file_name)
    assert response == "Test local download"
    os.remove(path)


def testLocalStorageUpload(testdata):
    content = "Test content"
    file_name = "test_file_name"
    local_storage = storage.LocalStorage(testdata)
    local_storage.upload(content, file_name)
    path = os.path.join(testdata, file_name)
    assert exists(path)
    os.remove(path)
