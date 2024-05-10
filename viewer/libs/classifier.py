import json

from viewer.libs.meltan_record_builder import MeltanResultRecordBuilder
from viewer.libs.ocp_record_builder import OCPResultRecordBuilder
from viewer.libs.record_builder import RecordBuilder


class ResultClassifier:
    def classify(self, test_data_content: str) -> RecordBuilder:
        """Decides the framework the result content belongs to.
        Args:
            test_data_content: Raw result content
        Returns:
            The record builder responsible for parsing and validating this content
        """

        lines = test_data_content.splitlines()
        if len(lines) > 0:
            first_line = lines[0]
            try:
                json_record = json.loads(first_line)
            except json.JSONDecodeError as e:
                raise json.JSONDecodeError(
                    f"Test result is not of valid JSON format. Current line content: {first_line}. Line number: 1.",
                    e.doc,
                    e.pos,
                ) from e
            if "schemaVersion" in json_record:
                return OCPResultRecordBuilder()
        return MeltanResultRecordBuilder()
