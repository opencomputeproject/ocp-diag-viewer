from typing import Any, Dict

from immutabledict import immutabledict

from viewer.libs.form_source_location_info import form_source_location_info
from viewer.libs.record_builder import ArtifactParseError, RecordBuilder

testresult_severity_mapping = immutabledict(
    {"NOT_APPLICABLE": "WARNING", "PASS": "INFO", "FAIL": "ERROR"}
)


teststatus_severity_mapping = immutabledict(
    {
        "UNKNOWN": "ERROR",
        "COMPLETE": "INFO",
        "ERROR": "ERROR",
        "SKIPPED": "WARNING",
    }
)

step_name_table = {}  # is used to store the mapping between teststep name/id


def build_testrun_start_record(testrun_start: Dict[str, Any]) -> Dict[str, str]:
    """Returns record dict of a testRunStart artifact."""
    # Rename hardwareComponents to hardwareInfo
    if "dutInfo" in testrun_start:
        dutInfos = testrun_start["dutInfo"]
        for dutInfo in dutInfos:
            dutInfo["hardwareInfos"] = dutInfo["hardwareComponents"]
        testrun_start["dutInfo"] = dutInfos
    return {
        "category": "Start",
        "message": f'{testrun_start["name"]} - v{testrun_start["version"]}',
        "severity": "INFO",
    }


def build_testrun_end_record(testrun_end: Dict[str, Any]) -> Dict[str, str]:
    """Returns record dict of a testRunEnd artifact."""
    return {
        "category": "End",
        "message": "{} : {}/{}".format(
            testrun_end["name"], testrun_end["status"], testrun_end["result"]
        ),
        "severity": testresult_severity_mapping[testrun_end["result"]],
    }


def build_testrun_log_record(testrun_log: Dict[str, Any]) -> Dict[str, str]:
    """Returns record dict of a log artifact."""
    return {
        "category": "Log",
        "message": testrun_log["text"],
        "severity": testrun_log["severity"],
        **form_source_location_info(testrun_log),
    }


def build_testrun_error_record(testrun_error: Dict[str, Any]) -> Dict[str, str]:
    """Returns record dict of a error artifact."""
    testrun_error["message"] = testrun_error["msg"]
    testrun_error["softwareInfoIds"] = testrun_error["softwareInfoId"]
    return {
        "category": "Error",
        "message": f'{testrun_error["symptom"]}: {testrun_error["msg"]}',
        "severity": "ERROR",
        **form_source_location_info(testrun_error),
    }


def build_testrun_tag_record(testrun_tag: Dict[str, Any]) -> Dict[str, str]:
    """Returns record dict of a tag artifact."""
    return {
        "category": "Tag",
        "message": testrun_tag["tag"],
        "severity": "INFO",
    }


def build_teststep_start_record(
    teststep_start: Dict[str, Any]
) -> Dict[str, str]:
    """Returns record dict of a testStepStart artifact."""
    return {
        "category": "Start",
        "message": teststep_start["name"],
        "severity": "INFO",
    }


def build_teststep_end_record(teststep_end: Dict[str, Any]) -> Dict[str, str]:
    """Returns record dict of a testStepEnd artifact."""
    return {
        "category": "End",
        "message": f'[{teststep_end["status"]}] {teststep_end["name"]}',
        "severity": teststatus_severity_mapping[teststep_end["status"]],
    }


def build_teststep_log_record(teststep_log: Dict[str, Any]) -> Dict[str, str]:
    """Returns record dict of a log artifact."""
    return {
        "category": "Log",
        "message": teststep_log["text"],
        "severity": teststep_log["severity"],
        **form_source_location_info(teststep_log),
    }


def build_teststep_error_record(
    teststep_error: Dict[str, Any]
) -> Dict[str, str]:
    """Returns record dict of a error artifact."""
    teststep_error["message"] = teststep_error["msg"]
    teststep_error["softwareInfoIds"] = teststep_error["softwareInfoId"]
    return {
        "category": "Error",
        "message": f'{teststep_error["symptom"]}: {teststep_error["msg"]}',
        "severity": "ERROR",
        **form_source_location_info(teststep_error),
    }


def build_teststep_measurement_record(
    teststep_measurement: Dict[str, Any]
) -> Dict[str, str]:
    """Returns record dict of a measurement artifact."""
    # Flatten out the info and element objects
    teststep_measurement.update(**teststep_measurement["info"])
    teststep_measurement.update(**teststep_measurement["element"])
    teststep_measurement["timestamp"] = ""
    if "dutTimestamp" in teststep_measurement["element"]:
        teststep_measurement["timestamp"] = teststep_measurement["element"][
            "dutTimestamp"
        ]

    return {
        "category": "Measurement",
        "message": "{}={}".format(
            teststep_measurement["info"]["name"],
            teststep_measurement["element"]["value"],
        ),
        "severity": "INFO" if "value" in teststep_measurement else "ERROR",
    }


def build_teststep_measurement_series_start_record(
    teststep_measurement_series_start: Dict[str, Any]
) -> Dict[str, str]:
    """Returns record dict of a measurementSeriesStart artifact."""
    teststep_measurement_series_start.update(
        **teststep_measurement_series_start["info"]
    )

    return {
        "category": "Measurement Series",
        "message": "Series_{} {} Start.".format(
            teststep_measurement_series_start["measurementSeriesId"],
            teststep_measurement_series_start["info"]["name"],
        ),
        "severity": "INFO",
    }


def build_teststep_measurement_element_record(
    teststep_measurement_element: Dict[str, Any]
) -> Dict[str, str]:
    """Returns record dict of a measurementElement artifact."""
    return {
        "category": "Measurement Series",
        "message": "Series_{}[{}: {}".format(
            teststep_measurement_element["measurementSeriesId"],
            teststep_measurement_element["index"],
            teststep_measurement_element["value"],
        ),
        "severity": "INFO"
        if "value" in teststep_measurement_element
        else "ERROR",
    }


def build_teststep_measurement_series_end_record(
    teststep_measurement_series_end: Dict[str, Any]
) -> Dict[str, str]:
    """Returns record dict of a measurementSeriesEnd artifact."""
    teststep_measurement_series_end[
        "totalCount"
    ] = teststep_measurement_series_end["totalMeasurementCount"]
    return {
        "category": "Measurement Series",
        "message": "Series_{} End. totalCount: {}".format(
            teststep_measurement_series_end["measurementSeriesId"],
            teststep_measurement_series_end["totalCount"],
        ),
        "severity": "INFO",
    }


def build_teststep_file_record(teststep_file: Dict[str, Any]) -> Dict[str, str]:
    """Returns record dict of a file artifact."""
    teststep_file["displayName"] = teststep_file["uploadAsName"]
    return {
        "category": "File",
        "message": f'{teststep_file["displayName"]}: {teststep_file["description"]}',
        "severity": "INFO",
    }


def build_teststep_extension_record(
    teststep_extension: Dict[str, Any]
) -> Dict[str, str]:
    """Returns record dict of a extension artifact."""
    return {
        "category": "Extension",
        "message": teststep_extension["name"],
        "severity": "INFO",
    }


def build_teststep_diagnosis_record(
    teststep_diagnosis: Dict[str, Any]
) -> Dict[str, str]:
    """Returns record dict of a diagnosis artifact."""
    teststep_diagnosis["message"] = teststep_diagnosis["msg"]
    teststep_diagnosis["verdict"] = teststep_diagnosis["symptom"]
    return {
        "category": "Diagnosis",
        "message": "[{}] {}: {}".format(
            teststep_diagnosis["type"],
            teststep_diagnosis["symptom"],
            teststep_diagnosis["msg"],
        ),
        "severity": "INFO" if teststep_diagnosis["type"] == "PASS" else "ERROR",
        **form_source_location_info(teststep_diagnosis),
    }


def build_testrun_record(testrun: Dict[str, Any]) -> Dict[str, str]:
    """Parses and builds record from testRunArtifact.

    Args:
      testrun: testRunArtifact dict object

    Returns:
      Parsed dict object of the testrun meltan result.
    Raises:
      ArtifactParseError: If the type of artifact in testrun is unknown.
    """
    record = {"stage": "Run", "step_name": ""}
    if "testRunStart" in testrun:
        record.update(build_testrun_start_record(testrun["testRunStart"]))
    elif "testRunEnd" in testrun:
        record.update(build_testrun_end_record(testrun["testRunEnd"]))
    elif "log" in testrun:
        record.update(build_testrun_log_record(testrun["log"]))
    elif "error" in testrun:
        record.update(build_testrun_error_record(testrun["error"]))
    elif "tag" in testrun:
        record.update(build_testrun_tag_record(testrun["tag"]))
    else:
        raise ArtifactParseError(
            f"Testrun artifact type unknown. Found: {list(testrun.keys())}. "
            "Expected one of: testRunStart, testRunEnd, log, error, tag."
        )
    return record


def register_step_name_and_id(teststep: Dict[str, Any]) -> None:
    if "testStepStart" in teststep:
        step_name_table[teststep["testStepId"]] = teststep["testStepStart"][
            "name"
        ]


def build_teststep_record(teststep: Dict[str, Any]) -> Dict[str, str]:
    """Parses and builds record from testStepArtifact.

    Args:
      teststep: testStepArtifact dict object

    Returns:
      Parsed dict object of the teststep meltan result.
    Raises:
      ArtifactParseError: If the sequence of teststep info is invalid.
      ArtifactParseError: If the type of artifact in teststep is unknown.
    """
    register_step_name_and_id(teststep)

    test_step_id = teststep["testStepId"]
    if test_step_id not in step_name_table:
        raise ArtifactParseError(
            "Invalid sequence of teststep. testStepStart should be at the very "
            f"front of teststep. Current teststep id: {test_step_id}"
        )
    record = {
        "step_name": step_name_table[test_step_id],
        "stage": f"Step {test_step_id}",
    }

    if "testStepStart" in teststep:
        record.update(build_teststep_start_record(teststep["testStepStart"]))
    elif "testStepEnd" in teststep:
        record.update(build_teststep_end_record(teststep["testStepEnd"]))
    elif "log" in teststep:
        record.update(build_teststep_log_record(teststep["log"]))
    elif "error" in teststep:
        record.update(build_teststep_error_record(teststep["error"]))
    elif "measurement" in teststep:
        record.update(
            build_teststep_measurement_record(teststep["measurement"])
        )
    elif "measurementSeriesStart" in teststep:
        record.update(
            build_teststep_measurement_series_start_record(
                teststep["measurementSeriesStart"]
            )
        )
    elif "measurementElement" in teststep:
        record.update(
            build_teststep_measurement_element_record(
                teststep["measurementElement"]
            )
        )
        teststep["measurementSeriesElement"] = teststep["measurementElement"]
    elif "measurementSeriesEnd" in teststep:
        record.update(
            build_teststep_measurement_series_end_record(
                teststep["measurementSeriesEnd"]
            )
        )
    elif "file" in teststep:
        record.update(build_teststep_file_record(teststep["file"]))
    elif "extension" in teststep:
        record.update(build_teststep_extension_record(teststep["extension"]))
    elif "diagnosis" in teststep:
        record.update(build_teststep_diagnosis_record(teststep["diagnosis"]))
    else:
        raise ArtifactParseError(
            f"Teststep artifact type unknown. Found: {list(teststep.keys())}."
        )
    return record


class MeltanResultRecordBuilder(RecordBuilder):
    def build_record(self, meltan_result: Dict[str, Any]) -> Dict[str, str]:
        """Builds record from `meltan_result`."""
        record = {
            "sequenceNumber": meltan_result["sequenceNumber"],
            "timestamp": meltan_result["timestamp"],
            "raw": meltan_result,
        }
        if "testRunArtifact" in meltan_result:
            record.update(
                build_testrun_record(meltan_result["testRunArtifact"])
            )
        elif "testStepArtifact" in meltan_result:
            record.update(
                build_teststep_record(meltan_result["testStepArtifact"])
            )
        else:
            raise ArtifactParseError(
                "Cannot found valid artifact type in meltan result. Should be either "
                "testRunArtifact or testStepArtifact. "
                f"Found: {list(meltan_result.keys())}."
            )

        return record  # pytype: disable=bad-return-type  # py310-upgrade
