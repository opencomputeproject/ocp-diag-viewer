import re
from typing import Any, Dict

from flask import current_app


def form_source_location_info(log: Dict[str, Any]) -> Dict[str, Any]:
    """Returns dict of sourceLocation and sourceLocationLink."""

    if "sourceLocation" not in log:
        return {}

    source_location_obj = log["sourceLocation"]
    if "file" not in source_location_obj:
        return {}

    file = source_location_obj["file"]
    line = source_location_obj["line"] if "line" in source_location_obj else 0

    try:
        for map in current_app.config.get("SOURCE_LOCATION_MAPS", []):
            if re.search(map["match_regex"], file):
                # if multiple matches are present, return the first match
                return {
                    "sourceLocation": "{}:{}".format(file, line),
                    "sourceLocationLink": map["link_format"].format(
                        file=file, line=line
                    ),
                }
    except RuntimeError:
        pass

    # no match in config, only show the source, no link
    return {
        "sourceLocation": "{}:{}".format(file, line),
    }
