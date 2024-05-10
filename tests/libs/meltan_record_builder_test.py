import pytest

from viewer.libs import meltan_record_builder
from viewer.libs.meltan_record_builder import (
    MeltanResultRecordBuilder,
    build_testrun_error_record,
    build_testrun_start_record,
    build_teststep_diagnosis_record,
    build_teststep_error_record,
    build_teststep_file_record,
    build_teststep_measurement_record,
    build_teststep_measurement_series_end_record,
    build_teststep_measurement_series_start_record
)
from viewer.libs.record_builder import ArtifactParseError


def test_build_testrun_record():
    testrun = {"testRunStart": {"name": "fake_testrun", "version": "1"}}
    assert meltan_record_builder.build_testrun_record(testrun) == {
        "step_name": "",
        "stage": "Run",
        "category": "Start",
        "message": "fake_testrun - v1",
        "severity": "INFO",
    }


def test_build_testrun_record_unknown_type_failure():
    testrun = {"invalidTestRunArtifact": None}
    with pytest.raises(ArtifactParseError) as excinfo:
        meltan_record_builder.build_testrun_record(testrun)
    assert "Testrun artifact type unknown" in str(excinfo.value)


def test_build_testrun_record_test_run_end():
    testrun = {
        "testRunEnd": {
            "name": "fake_testrun",
            "status": "COMPLETE",
            "result": "PASS",
        }
    }
    assert meltan_record_builder.build_testrun_record(testrun) == {
        "step_name": "",
        "stage": "Run",
        "category": "End",
        "message": "fake_testrun : COMPLETE/PASS",
        "severity": "INFO",
    }


def test_build_testrun_record_log():
    testrun = {"log": {"text": "Fake message.", "severity": "ERROR"}}
    assert meltan_record_builder.build_testrun_record(testrun) == {
        "step_name": "",
        "stage": "Run",
        "category": "Log",
        "message": "Fake message.",
        "severity": "ERROR",
    }


def test_build_testrun_record_error():
    testrun = {
        "error": {
            "symptom": "procedural-error",
            "msg": "Fake error message.",
            "softwareInfoId": ["0"]
        }
    }
    assert meltan_record_builder.build_testrun_record(testrun) == {
        "step_name": "",
        "stage": "Run",
        "category": "Error",
        "message": "procedural-error: Fake error message.",
        "severity": "ERROR",
    }


def test_build_testrun_record_tag():
    testrun = {
        "tag": {
            "tag": "Fake tag.",
        }
    }
    assert meltan_record_builder.build_testrun_record(testrun) == {
        "step_name": "",
        "stage": "Run",
        "category": "Tag",
        "message": "Fake tag.",
        "severity": "INFO",
    }


def test_build_teststep_record_step_name_failure():
    teststep = {"error": None, "testStepId": 0}
    with pytest.raises(
        ArtifactParseError,
    ) as excinfo:
        meltan_record_builder.build_teststep_record(teststep)

    assert (
        "Invalid sequence of teststep. testStepStart should be at the very front of teststep. Current teststep id: 0"
        in str(excinfo.value)
    )


def test_build_teststep_record_unknown_type_failure():
    meltan_record_builder.step_name_table[0] = "fake_test"
    teststep = {"invalidTestStepArtifact": None, "testStepId": 0}
    with pytest.raises(
        ArtifactParseError,
        match="Teststep artifact type unknown",
    ):
        meltan_record_builder.build_teststep_record(teststep)


def test_build_teststep_record():
    teststep = {"testStepStart": {"name": "fake_teststep"}, "testStepId": 0}
    assert meltan_record_builder.build_teststep_record(teststep) == {
        "step_name": "fake_teststep",
        "stage": "Step 0",
        "category": "Start",
        "message": "fake_teststep",
        "severity": "INFO",
    }

    teststep = {
        "error": {"symptom": "procedural-error", "msg": "Error message.", "softwareInfoId": ["0"]},
        "testStepId": 0,
    }
    assert meltan_record_builder.build_teststep_record(teststep) == {
        "step_name": "fake_teststep",
        "stage": "Step 0",
        "category": "Error",
        "message": "procedural-error: Error message.",
        "severity": "ERROR",
    }

def test_build_teststep_record_with_measurement_series_element():
    meltan_record_builder.step_name_table["0"] = "fake_test"
    teststep = {
        "testStepId": "0",
        "measurementElement":{
            "index":0,
            "measurementSeriesId":"0",
            "value":"0"
        }
    }
    meltan_record_builder.build_teststep_record(teststep)
    assert teststep["measurementSeriesElement"] == {"index":0,"measurementSeriesId":"0","value":"0"}

def test_build_record_artifact_type_unknown():
    meltan_result = {"sequenceNumber": 0, "timestamp": "a_timestamp"}

    with pytest.raises(
        ArtifactParseError,
        match="Cannot found valid artifact type in meltan result",
    ):
        MeltanResultRecordBuilder().build_record(meltan_result)


def test_build_record_testrun():
    meltan_result = {
        "testRunArtifact": {
            "log": {"text": "Fake test message.", "severity": "INFO"}
        },
        "sequenceNumber": 0,
        "timestamp": "timestamp 1",
    }

    assert MeltanResultRecordBuilder().build_record(meltan_result) == {
        "stage": "Run",
        "step_name": "",
        "category": "Log",
        "message": "Fake test message.",
        "severity": "INFO",
        "sequenceNumber": 0,
        "timestamp": "timestamp 1",
        "raw": meltan_result,
    }


def test_build_record_teststep():
    meltan_result = {
        "testStepArtifact": {
            "testStepStart": {"name": "Fake test step"},
            "testStepId": "0",
        },
        "sequenceNumber": 1,
        "timestamp": "timestamp 2",
    }

    assert MeltanResultRecordBuilder().build_record(meltan_result) == {
        "step_name": "Fake test step",
        "stage": "Step 0",
        "category": "Start",
        "message": "Fake test step",
        "severity": "INFO",
        "sequenceNumber": 1,
        "timestamp": "timestamp 2",
        "raw": meltan_result,
    }


def test_build_testrun_start_record():
    testrun_start = {
        "dutInfo": [
            {
                "hardwareComponents": [
                    {
                        "name": "myHardwareName",
                    },
                ],
            }
        ],
        "name": "myTest",
        "version": "399701328",
    }
    build_testrun_start_record(testrun_start)
    dutInfo = testrun_start["dutInfo"][0]["hardwareInfos"]
    assert dutInfo == [
        {
            "name": "myHardwareName",
        }
    ]


def test_build_error_record():
    test_error = {
        "msg": "demo error message.",
        "softwareInfoId": ["0"],
        "symptom": "demo-testrun-error-symptom",
    }
    error_obj = build_testrun_error_record(test_error)
    assert (
        error_obj["message"]
        == "demo-testrun-error-symptom: demo error message."
    )
    assert test_error["message"] == test_error["msg"]

    test_error = {
        "msg": "another demo error message.",
        "softwareInfoId": ["0"],
        "symptom": "demo-testrun-error-symptom",
    }
    error_obj = build_teststep_error_record(test_error)
    assert (
        error_obj["message"]
        == "demo-testrun-error-symptom: another demo error message."
    )
    assert test_error["message"] == test_error["msg"]


def test_build_teststep_diagnosis_record():
    test_diagnosis = {
        "symptom": "symptom_pass",
        "type": "PASS",
        "msg": "Pass message",
        "hardwareInfoId": ["0"],
    }
    build_teststep_diagnosis_record(test_diagnosis)
    assert test_diagnosis["verdict"] == test_diagnosis["symptom"]
    assert test_diagnosis["message"] == test_diagnosis["msg"]


def test_build_teststep_file_record():
    test_file = {
        "contentType": "text/plain",
        "description": "This is a test file :)",
        "isSnapshot": "false",
        "outputPath": "simple_meltan_test_file.txt",
        "tags": [{"tag": "meltan_example"}],
        "uploadAsName": "test_file",
    }
    build_teststep_file_record(test_file)
    assert test_file["displayName"] == test_file["uploadAsName"]

def test_build_teststep_measurement_record():
    teststep_measurement = {
        'info': {
            'name': 'name'
        },
        'element': {
            'index': 0,
            'dutTimestamp': "2023-03-12T02:47:37.803558655Z",
            'value': 'value'
        }
    }
    record = build_teststep_measurement_record(teststep_measurement)
    assert teststep_measurement['name'] == 'name'
    assert teststep_measurement['index'] == 0
    assert teststep_measurement['timestamp'] == "2023-03-12T02:47:37.803558655Z"
    assert record['message'] == 'name=value'

def test_build_teststep_measurement_record_missing_dutTimestamp():
    teststep_measurement = {
        'info': {
            'name': 'name'
        },
        'element': {
            'index': 0,
            'value': 'value'
        }
    }
    record = build_teststep_measurement_record(teststep_measurement)
    assert teststep_measurement['timestamp'] == ""

def test_build_teststep_measurement_series_start_record():
    teststep_measurement_series_start = {
        "measurementSeriesId":"0",
        "info": {
            "name": "name"
        }
    }
    build_teststep_measurement_series_start_record(teststep_measurement_series_start)
    assert teststep_measurement_series_start["name"] == "name"

def test_build_teststep_measurement_series_end_record():
    teststep_measurement_series_end = {
        "measurementSeriesId":"0",
        "totalMeasurementCount":1
    }
    build_teststep_measurement_series_end_record(teststep_measurement_series_end)
    assert teststep_measurement_series_end["totalCount"] == 1
