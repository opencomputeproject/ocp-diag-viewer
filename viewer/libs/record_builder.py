import abc
from typing import Any, Dict


class ArtifactParseError(Exception):
    pass


class RecordBuilder(abc.ABC):
    @abc.abstractmethod
    def build_record(self, result: Dict[str, Any]) -> Dict[str, str]:
        """Builds record from a result.
        Args:
            result: JSON object representing a test result record
        """
        pass
