import {Component, Input} from '@angular/core';

import {Result, Status} from '../../services/results_type';

/**
 * SummaryBar.
 */
@Component({
  selector: 'summary-bar',
  templateUrl: './summary_bar.ng.html',
  styleUrls: ['summary_bar.css'],
})
export class SummaryBarComponent {
  @Input() name = '';
  @Input() version?: string;
  @Input() startTime = '';
  @Input() status: Status = 'UNKNOWN';
  @Input() result?: Result;

  getStatusIcon() {
    switch (this.status) {
      case 'COMPLETE':
        return 'check_circle';
      case 'ERROR':
        return 'report_problem';
      default:
        return 'error_outline';
    }
  }

  getResultIcon() {
    switch (this.result) {
      case 'PASS':
        return 'check_circle';
      case 'FAIL':
        return 'report_problem';
      default:
        return 'error_outline';
    }
  }
}
