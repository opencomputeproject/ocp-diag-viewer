import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Measurement, TestRunService, TestStep} from '../../services/testrun_service';

/**
 *  The Teststep view page
 *
 *  Example:
 *  <teststeps-teststep-view></teststeps-teststep-view>
 */
@Component({
  selector: 'teststeps-teststep-view',
  templateUrl: 'teststep_view.ng.html',
  styleUrls: ['teststep_view.css']
})
export class TestStepViewComponent implements OnInit {
  testStepId = '';
  teststep?: TestStep;
  measurementsDataSource: Measurement[] = [];
  measurementSeriesDataSource: Measurement[] = [];
  errorsCount = 0;
  diagnosesFailCount = 0;
  measuremntsInvalidCount = 0;
  measurementSeriesInvalidCount = 0;

  constructor(
      private readonly route: ActivatedRoute,
      private readonly testrunService: TestRunService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('testStepId');
    if (id != null) {
      this.testStepId = id;
      const teststep = this.testrunService.getTestStep(this.testStepId);
      this.teststep = teststep;
      this.measurementsDataSource = teststep.measurements.slice();
      this.measurementSeriesDataSource =
          teststep.measurementSeriesElements.slice();

      this.errorsCount = teststep.errors.length;
      this.diagnosesFailCount =
          teststep.diagnoses.filter(n => n.type === 'FAIL').length;
      this.measuremntsInvalidCount =
          teststep.measurements.filter(n => !n.valid).length;
      this.measurementSeriesInvalidCount =
          teststep.measurementSeriesElements.filter(n => !n.valid).length;
    }
  }
}
