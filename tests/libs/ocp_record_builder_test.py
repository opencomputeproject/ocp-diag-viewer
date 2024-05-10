from viewer.libs.ocp_record_builder import OCPResultRecordBuilder, build_teststep_diagnosis_record

def test_build_teststep_diagnosis_record():
    test_diagnosis = {
        "verdict": "symptom_pass",
        "type": "PASS",
        "message": "Pass message",
        "hardwareInfoId": "0",
        "subcomponent": {
            type: 1,
            "name": "name",
            "location": "location",
            "version": "0",
            "revision": "0"
        }
    }
    build_teststep_diagnosis_record(test_diagnosis)
    assert test_diagnosis["hardwareInfoId"] == ["0"]

def test_build_teststep_diagnosis_record_missing_hardware_id():
    test_diagnosis = {
        "verdict": "symptom_pass",
        "type": "PASS",
        "message": "Pass message",
        "subcomponent": {
            type: 1,
            "name": "name",
            "location": "location",
            "version": "0",
            "revision": "0"
        }
    }
    build_teststep_diagnosis_record(test_diagnosis)
    assert test_diagnosis["hardwareInfoId"] == []

def test_build_schema_version_log():
    schema_version_log = {"schemaVersion":{"major":2,"minor":0},"sequenceNumber":0,"timestamp":"2023-07-16T01:38:46Z"}
    built_record = OCPResultRecordBuilder().build_record(schema_version_log)
    assert built_record["severity"] == "INFO"