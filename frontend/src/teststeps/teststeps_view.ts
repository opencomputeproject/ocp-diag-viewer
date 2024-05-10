import {Component} from '@angular/core';

import {TestRun, TestRunService} from '../services/testrun_service';

/**
 *  The Teststeps view page
 *
 *  Example:
 *  <teststeps-view></teststeps-view>
 */
@Component({
  selector: 'teststeps-view',
  templateUrl: './teststeps_view.ng.html',
  styleUrls: ['./teststeps_view.css']
})
export class TestStepsViewComponent {
  testrun: TestRun;

  constructor(private readonly testrunService: TestRunService) {
    this.testrun = this.testrunService.get();
  }
}
