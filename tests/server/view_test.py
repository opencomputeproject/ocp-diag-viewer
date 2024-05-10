import os
import shutil
import unittest
from unittest import mock

from viewer.server import view


def testDisplayFileShareId(client, testdata, test_dir):
    shutil.copy(
        os.path.join(testdata, "test_share_id.txt"),
        os.path.join(test_dir, "test_share_id.txt"),
    )
    with mock.patch.object(view, "build_ocp_diag_test_data_js") as mock_fn:
        mock_fn.side_effect = lambda text: text
        res = client.get("/view/test_share_id.txt")
        assert "Test text" in str(res.data)
