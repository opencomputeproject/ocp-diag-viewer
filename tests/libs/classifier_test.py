import json

from viewer.libs.classifier import ResultClassifier
from viewer.libs.meltan_record_builder import MeltanResultRecordBuilder
from viewer.libs.ocp_record_builder import OCPResultRecordBuilder


def test_classifier_empty_result():
    classifier = ResultClassifier()
    assert type(classifier.classify("")) is MeltanResultRecordBuilder


def test_classifier_ocp_result():
    test_str = json.dumps({"schemaVersion": "1.0"})
    classifier = ResultClassifier()
    assert type(classifier.classify(test_str)) is OCPResultRecordBuilder
