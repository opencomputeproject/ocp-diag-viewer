/* eslint-disable @typescript-eslint/no-explicit-any */
/** @see core/results/results.proto: ComponentLocation */
export declare interface ComponentLocation {
  devpath: string;
  odataId: string;
  blockpath: string;
  serialNumber: string;
}

export declare type HardwareInfo = HardwareInfo_V1 | HardwareInfo_V2;

declare type HardwareInfoCommon = {
  hardwareInfoId: string;
  arena: string;
  name: string;
  partNumber: string;
  manufacturer: string;
  partType: string;
};

/** @see core/results/results.proto: HardwareInfo */
export declare type HardwareInfo_V1 = HardwareInfoCommon & {
  fruLocation: ComponentLocation;
  mfgPartNumber: string;
  componentLocation: ComponentLocation;
};

/** @see core/results/ocp/data_model/results.proto: HardwareInfo */
export declare type HardwareInfo_V2 = HardwareInfoCommon & {
  location: string;
  computerSystem: string;
  odataId: string;
  serialNumber: string;
  manager: string;
  version: string;
  revision: string;
  manufacturerPartNumber: string;
};

export declare type SoftwareInfo = SoftwareInfo_V1 | SoftwareInfo_V2;

/** @see core/results/results.proto: SoftwareInfo */
export declare type SoftwareInfo_V1 = {
  softwareInfoId: string;
  arena: string;
  name: string;
  version: string;
};

/** @see core/results/ocp/data_model/results.proto: SoftwareInfo */
export declare type SoftwareInfo_V2 = SoftwareInfo_V1 & {
  computerSystem: string;
  revision: string;
  softwareType: SoftwareType;
};

export enum SoftwareType {
  UNSPECIFIED = 0,
  FIRMWARE = 1,
  SYSTEM = 2,
  APPLICATION = 3,
}

/** @see core/results/results.proto: PlatformInfo */
export declare interface PlatformInfo {
  info: string;
}

/** @see core/results/results.proto: DutInfo */
export declare interface DutInfo {
  hostname: string;
  platformInfos: PlatformInfo[];
  hardwareInfos: HardwareInfo[];
  softwareInfos: SoftwareInfo[];
}

/** @see core/results/results.proto: TestRunStart */
export declare interface TestRunStart {
  name: string;
  version: string;
  parameters: object;
  dutInfo: DutInfo[];
}

/** Status of TestRun and TestStep */
export type Status = "UNKNOWN" | "COMPLETE" | "ERROR" | "SKIPPED";

/** Result of TestRun */
export type Result = "NOT_APPLICABLE" | "PASS" | "FAIL";

/** @see core/results/results.proto: TestRunEnd */
export declare interface TestRunEnd {
  name: string;
  status: Status;
  result: Result;
}

/** @see core/results/results.proto: TestStepStart */
export declare interface TestStepStart {
  name: string;
}

/** @see core/results/results.proto: TestStepEnd */
export declare interface TestStepEnd {
  name: string;
  status: Status;
}

/** @see core/results/results.proto: MeasurementInfo */
export declare interface MeasurementInfo {
  name: string;
  unit: string;
  hardwareInfoId: string;
  subcomponent?: Subcomponent; // OCP
  validators?: Validator[]; // OCP
  value?: any; // OCP
  metadata?: object; // OCP
}

/** @see core/results/results.proto: MeasurementElement:Range */
export declare interface MeasurementElementRange {
  maximum: any;
  minimum: any;
}

/** @see core/results/results.proto: MeasurementElement:ValidValues */
export declare interface MeasurementElementValidValues {
  values: any[];
}

/** @see core/results/results.proto: MeasurementElement */
export declare interface MeasurementElement {
  index: number;
  measurementSeriesId: string;
  value: any;
  range?: MeasurementElementRange;
  validValues?: MeasurementElementValidValues;
  timestamp?: string;
  metadata?: object; // OCP
}

/** @see core/results/results.proto: Measurement */
export declare type Measurement = MeasurementInfo & MeasurementElement;

/** @see core/results//ocp/data_model/results.proto: SubcomponentType */
export enum SubcomponentType {
  UNSPECIFIED = "UNSPECIFIED",
  ASIC = "ASIC",
  ASIC_SUBSYSTEM = "ASIC_SUBSYSTEM",
  BUS = "BUS",
  FUNCTION = "FUNCTION",
  CONNECTOR = "CONNECTOR",
}

/** @see core/results//ocp/data_model/results.proto: ValidatorType */
export enum ValidatorType {
  UNSPECIFIED = "UNSPECIFIED",
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
  REGEX_MATCH = "REGEX_MATCH",
  REGEX_NO_MATCH = "REGEX_NO_MATCH",
  IN_SET = "IN_SET",
  NOT_IN_SET = "NOT_IN_SET",
}

/** @see core/results//ocp/data_model/results.proto: Validator */
export declare interface Validator {
  name: string;
  type: ValidatorType;
  value: any;
  metadata: object;
}

/** @see core/results//ocp/data_model/results.proto: Subcomponent */
export declare interface Subcomponent {
  type: SubcomponentType;
  name: string;
  location: string;
  version: string;
  revision: string;
}

/** @see core/results/results.proto: MeasurementSeriesStart */
export declare type MeasurementSeriesStart = {
  measurementSeriesId: string;
} & MeasurementInfo;

/** @see core/results/results.proto: MeasurementSeriesEnd */
export declare interface MeasurementSeriesEnd {
  measurementSeriesId: string;
  totalCount: number;
}

/** @see core/results/results.proto: Diagnosis */
export declare interface Diagnosis {
  verdict: string; // Equivalent to Meltan's symptom
  type: "UNKNOWN" | "PASS" | "FAIL";
  message: string;
  hardwareInfoId: string[];
  subcomponent?: Subcomponent; // OCP
}

/** @see core/results/results.proto: Error */
export declare interface Error {
  symptom: string;
  message: string;
  softwareInfoIds: string[];
}

/** The severity list of meltan result records. */
export const SEVERITIES = [
  "TRACE",
  "DEBUG",
  "INFO",
  "WARNING",
  "ERROR",
  "FATAL",
] as const;

/** The seveirty string union type. */
export type Severity = (typeof SEVERITIES)[number];

/** @see core/results/results.proto: Log */
export declare interface Log {
  severity: Severity;
  text: string;
}

/** @see core/results/results.proto: File */
export declare interface File {
  displayName: string; // Equivalent to uploadAsName
  outputPath: string;
  description: string;
  contentType: string;
  isSnapshot: boolean;
  tags: Tag[];
}

/** @see core/results/results.proto: Tag */
export declare interface Tag {
  tag: string;
}

/** @see core/results/results.proto: ArtifactExtension */
export declare interface ArtifactExtension {
  name: string;
  extension: object;
}

/** @see core/results/results.proto: TestRunArtifact */
export declare interface TestRunArtifact {
  testRunStart?: TestRunStart;
  testRunEnd?: TestRunEnd;
  log?: Log;
  tag?: Tag;
  error?: Error;
}

/** @see core/results/results.proto: TestStepArtifact */
export declare interface TestStepArtifact {
  testStepStart?: TestStepStart;
  testStepEnd?: TestStepEnd;
  measurement?: Measurement;
  measurementSeriesStart?: MeasurementSeriesStart;
  measurementSeriesEnd?: MeasurementSeriesEnd;
  measurementSeriesElement?: MeasurementElement;
  diagnosis?: Diagnosis;
  error?: Error;
  file?: File;
  log?: Log;
  extension?: ArtifactExtension;
  testStepId: string;
}

/** @see core/results/results.proto: OutputArtifact */
export declare interface OutputArtifact {
  testRunArtifact?: TestRunArtifact;
  testStepArtifact?: TestStepArtifact;
  sequenceNumber: number;
  timestamp: string;
}
