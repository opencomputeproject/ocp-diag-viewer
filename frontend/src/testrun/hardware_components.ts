import {AfterViewInit, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {Hardware, TestRunService} from '../services/testrun_service';

/**
 * Hardware components table with filter.
 */
@Component({
  selector: "testrun-hardware-components",
  styleUrls: ["hardware_components.css"],
  templateUrl: "hardware_components.ng.html",
  encapsulation: ViewEncapsulation.None,
})
export class HardwareComponentsTableComponent implements AfterViewInit {
  toggleAllPanels = false;
  displayedColumns: string[] = [
    "hardwareInfoId",
    "hostname",
    "name",
    "arena",
    "partNumber",
    "manufacturer",
    "partType",
  ];
  isV2 = false;
  dataSource: MatTableDataSource<Hardware>;

  @ViewChild(MatSort) sort = new MatSort();

  constructor(private readonly testrunService: TestRunService) {
    this.dataSource = new MatTableDataSource<Hardware>(
      Object.values(this.testrunService.get().hardwareInfos)
    );
    this.isV2 =
      !!this.dataSource.data.length &&
      Object.prototype.hasOwnProperty.call(
        this.dataSource.data[0],
        "computerSystem"
      );
    if (this.isV2) {
      this.displayedColumns.push("manufacturerPartNumber");
      this.displayedColumns.push("location");
      this.displayedColumns.push("computerSystem");
      this.displayedColumns.push("odataId");
      this.displayedColumns.push("serialNumber");
      this.displayedColumns.push("manager");
      this.displayedColumns.push("version");
      this.displayedColumns.push("revision");
    } else {
      this.displayedColumns.push("mfgPartNumber");
      this.displayedColumns.push("fruLocation"),
        this.displayedColumns.push("componentLocation");
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
