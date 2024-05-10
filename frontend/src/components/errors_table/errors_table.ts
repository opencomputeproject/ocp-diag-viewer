import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {Error} from '../../services/results_type';
import {SideInfoService} from '../../services/side_info_service';
import {TestRunService} from '../../services/testrun_service';

/**
 * ErrorsTable can list errors in TestRun / TestStep.
 */
@Component({
  selector: 'errors-table',
  templateUrl: './errors_table.ng.html',
  styleUrls: ['errors_table.css'],
})
export class ErrorsTableComponent implements AfterViewInit {
  @Input() dataSource = new MatTableDataSource<Error>();

  @ViewChild(MatSort) sort = new MatSort();

  constructor(
      private readonly testrunService: TestRunService,
      readonly sideInfoService: SideInfoService) {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getSoftwareInfoName(softwareId: number) {
    return this.testrunService.get().softwareInfos[softwareId].name;
  }
}
