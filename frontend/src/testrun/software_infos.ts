import {AfterViewInit, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {Software, TestRunService} from '../services/testrun_service';

/**
 * Software info table with filter
 */
@Component({
  selector: "testrun-software-infos",
  styleUrls: ["software_infos.css"],
  templateUrl: "software_infos.ng.html",
  encapsulation: ViewEncapsulation.None,
})
export class SoftwareInfosTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "softwareInfoId",
    "hostname",
    "name",
    "arena",
    "version",
  ];
  isV2 = false;
  dataSource: MatTableDataSource<Software>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly testrunService: TestRunService) {
    this.dataSource = new MatTableDataSource<Software>(
      Object.values(this.testrunService.get().softwareInfos)
    );
    this.isV2 =
      !!this.dataSource.data.length &&
      Object.prototype.hasOwnProperty.call(
        this.dataSource.data[0],
        "computerSystem"
      );
    if (this.isV2) {
      this.displayedColumns.push("computerSystem");
      this.displayedColumns.push("revision");
      this.displayedColumns.push("softwareType");
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
