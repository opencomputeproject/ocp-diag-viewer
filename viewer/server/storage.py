import abc
import os

from flask import abort, current_app
from google.cloud import storage
from google.cloud.exceptions import GoogleCloudError
from google.cloud.storage.retry import DEFAULT_RETRY


class Storage(abc.ABC):
    @abc.abstractmethod
    def download(self, file_name: str) -> str:
        """Downloads a file from storage

        Args:
            file_name: The name of the file to fetch

        Returns:
            The content of the file if it exists.

        Raises:
            Raises abort signal with status 404 if the file does not exist.
        """
        pass

    @abc.abstractmethod
    def upload(self, file_content: str, file_name: str) -> None:
        """Uploads a text file to the storage

        Args:
            file_content: The content to upload
            file_name: The name of the file to save the content to

        Returns:
            NA

        Raises:
            Raises abort signal with status 400 if the upload returns error
        """
        pass


class GCSStorage(Storage):
    def __init__(self, bucket_name: str):
        storage_client = storage.Client()
        self.bucket = storage_client.bucket(bucket_name)

    def download(self, file_name: str):
        blob = self.bucket.blob(file_name)
        if not blob.exists():
            abort(404, "Invalid share id")
        return blob.download_as_text()

    def upload(self, file_content: str, file_name: str):
        blob = self.bucket.blob(file_name)
        try:
            blob.upload_from_string(
                file_content,
                retry=DEFAULT_RETRY,
            )
        except GoogleCloudError as e:
            abort(400, e.message)


class LocalStorage(Storage):
    def __init__(self, folder_path: str):
        self.folder_path = folder_path
        if not os.path.exists(folder_path):
            os.mkdir(folder_path)
        self.folder_path = folder_path

    def download(self, file_name: str):
        with open(os.path.join(self.folder_path, file_name)) as f:
            return f.read()

    def upload(self, file_content: str, file_name: str):
        with open(os.path.join(self.folder_path, file_name), "w") as f:
            f.write(file_content)


storage_backend = None


def get_storage():
    global storage_backend
    if storage_backend:
        return storage_backend

    bucket = current_app.config.get("STORAGE_GCS_BUCKET_NAME", "")
    if bucket:
        storage_backend = GCSStorage(bucket)
    else:
        storage_backend = LocalStorage("testdir")
    return storage_backend
