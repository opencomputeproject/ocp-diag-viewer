import { formatDate } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Error } from '../services/results_type';
import { SideInfoService } from '../services/side_info_service';
import { TestRun, TestRunService } from '../services/testrun_service';
import { timeDiff } from '../utility/utils';

/**
 *  The testrun view page
 *
 *  Example:
 *  <testrun-view></testrun-view>
 */
@Component({
  selector: 'testrun-view',
  templateUrl: './testrun_view.ng.html',
  styleUrls: ['./testrun_view.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TestRunViewComponent implements AfterViewInit, OnInit {
  testrun: TestRun;
  summary: Array<[string, unknown]> = [];
  errorsDataSource: MatTableDataSource<Error>;

  @ViewChild(MatSort) errorsSort!: MatSort;

  ngOnInit() {
    // do nothing
  }

  constructor(
    private readonly testrunService: TestRunService,
    readonly sideInfoService: SideInfoService) {
    this.testrun = this.testrunService.get();
    this.errorsDataSource = new MatTableDataSource(this.testrun.errors);
    this.initSummary();
  }

  ngAfterViewInit() {
    this.errorsDataSource.sort = this.errorsSort;
  }

  getSoftwareInfoName(softwareId: number) {
    return this.testrunService.get().softwareInfos[softwareId].name;
  }

  private initSummary() {
    const testrun = this.testrunService.get();

    this.summary.push(['Name', testrun.name]);
    this.summary.push(['Version', testrun.version]);
    this.summary.push(['Tags', testrun.tags.join(', ')]);
    this.summary.push(['Status', testrun.status]);
    this.summary.push(['Result', testrun.result]);
    this.summary.push(['Host name', this.getHostNames().join(', ')]);
    this.summary.push(
      ['Start Time', formatDate(testrun.startTime, 'full', 'en-us')]);
    this.summary.push(
      ['End Time', formatDate(testrun.endTime, 'full', 'en-us')]);
    this.summary.push(
      ['Duration', timeDiff(testrun.startTime, testrun.endTime)]);
    this.summary.push(['Parameters', testrun.parameters]);
  }

  private getHostNames(): string[] {
    const testrun = this.testrunService.get();
    const hostnames = new Set<string>();

    for (const hw of Object.values(testrun.hardwareInfos)) {
      hostnames.add(hw.hostname);
    }
    for (const sw of Object.values(testrun.softwareInfos)) {
      hostnames.add(sw.hostname);
    }
    return Array.from(hostnames.values()).sort();
  }
}
