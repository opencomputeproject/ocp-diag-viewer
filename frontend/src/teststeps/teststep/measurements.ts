import {Component, Input, OnInit} from '@angular/core';
import {Sort} from '@angular/material/sort';

import {
  MeasurementElementRange,
  MeasurementElementValidValues,
  Validator,
  ValidatorType,
} from "../../services/results_type";
import { SideInfoService } from "../../services/side_info_service";
import {
  Measurement,
  TestRunService,
  TestStep,
} from "../../services/testrun_service";

interface MeasurementSeriesOption {
  text: string;
  measurementSeriesId: string;
}

function compare<T>(a: T, b: T, isAsc: boolean) {
  if (a === b) {
    return 0;
  }
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

/**
 *  The Teststep measurements tab.
 */
@Component({
  selector: "teststeps-teststep-measurements",
  templateUrl: "measurements.ng.html",
  styleUrls: ["measurements.css"],
})
export class MeasurementsComponent implements OnInit {
  @Input() dataSource: Measurement[] = [];
  @Input() showSeries = false;
  teststep!: TestStep;
  measurementsDataSource: Measurement[] = [];
  measurementSeriesOptions: MeasurementSeriesOption[] = [];
  displayedColumns = [
    "name",
    "value",
    "unit",
    "hardwareInfo",
    "validIcon",
    "validValues",
  ];
  selectedSeriesId = "";
  sort!: Sort;

  constructor(
    private readonly testrunService: TestRunService,
    readonly sideInfoService: SideInfoService
  ) {}

  ngOnInit() {
    if (this.showSeries) {
      this.displayedColumns = ["id", "index"].concat(this.displayedColumns);
    }
    this.measurementsDataSource = this.dataSource.slice();
    this.initMeasurementSeriesOptions(this.dataSource);
  }

  private initMeasurementSeriesOptions(dataSource: Measurement[]) {
    this.measurementSeriesOptions = [];
    for (const measurement of dataSource) {
      if (measurement.index === 0) {
        this.measurementSeriesOptions.push({
          text: `${measurement.measurementSeriesId}:
              ${measurement.name}`,
          measurementSeriesId: measurement.measurementSeriesId,
        });
      }
    }
  }

  getHardwareInfoName(hardwareId: string) {
    return this.testrunService.getHardwareComponent(hardwareId).name;
  }

  loadMeasurementsComponent() {
    const data = this.dataSource.slice();
    if (!this.selectedSeriesId) {
      this.measurementsDataSource = data;
    } else {
      this.measurementsDataSource = data.filter(
        (m) => m.measurementSeriesId === this.selectedSeriesId
      );
    }

    if (!this.sort) {
      return;
    }

    if (!this.sort.active || this.sort.direction === "") {
      this.measurementsDataSource = data;
      return;
    }
    this.measurementsDataSource.sort((a, b) => {
      const isAsc = this.sort.direction === "asc";
      switch (this.sort.active) {
        case "id":
          return compare(a.measurementSeriesId, b.measurementSeriesId, isAsc);
        case "index":
          return compare(a.index, b.index, isAsc);
        case "name":
          return compare(a.name, b.name, isAsc);
        case "validIcon":
          return compare(a.valid, b.valid, isAsc);
        default:
          return 0;
      }
    });
  }

  sortMeasurementsComponent(sort: Sort) {
    this.sort = sort;
    this.loadMeasurementsComponent();
  }

  renderElementRange(element: {
    range?: MeasurementElementRange;
    validValues?: MeasurementElementValidValues;
    validators?: Validator[];
  }): string {
    if (element?.validValues) {
      return JSON.stringify(element.validValues.values);
    }
    if (element?.range) {
      return `${element.range.minimum} - ${element.range.maximum}`;
    }
    if (element?.validators) {
      return this.formatValidatorsRange(element.validators);
    }
    return "";
  }

  formatValidatorsRange(validators: Validator[]) {
    const conditions = [];
    for (const validator of validators) {
      switch (validator.type) {
        case ValidatorType.UNSPECIFIED:
          continue;
        case ValidatorType.EQUAL:
          conditions.push(`= ${validator.value}`);
          continue;
        case ValidatorType.NOT_EQUAL:
          conditions.push(`!= ${validator.value}`);
          continue;
        case ValidatorType.LESS_THAN:
          conditions.push(`< ${validator.value}`);
          continue;
        case ValidatorType.LESS_THAN_OR_EQUAL:
          conditions.push(`<= ${validator.value}`);
          continue;
        case ValidatorType.GREATER_THAN:
          conditions.push(`> ${validator.value}`);
          continue;
        case ValidatorType.GREATER_THAN_OR_EQUAL:
          conditions.push(`>= ${validator.value}`);
          continue;
        case ValidatorType.REGEX_MATCH:
          conditions.push(`[${validator.value}]`);
          continue;
        case ValidatorType.REGEX_NO_MATCH:
          conditions.push(`[^${validator.value}]`);
          continue;
        case ValidatorType.IN_SET:
          conditions.push(`IN ${validator.value}`);
          continue;
        case ValidatorType.NOT_IN_SET:
          conditions.push(`NOT IN ${validator.value}`);
          continue;
      }
    }
    return conditions.join(", ");
  }
}
