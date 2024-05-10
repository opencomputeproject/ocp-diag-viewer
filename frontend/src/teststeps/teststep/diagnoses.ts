import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {Diagnosis} from '../../services/results_type';
import {SideInfoService} from '../../services/side_info_service';
import {TestRunService, TestStep} from '../../services/testrun_service';

/**
 *  The Teststep diagnoses tab.
 */
@Component({
  selector: 'teststeps-teststep-diagnoses',
  templateUrl: 'diagnoses.ng.html',
  styleUrls: ['diagnoses.css'],
})
export class DiagnosesComponent implements OnInit, AfterViewInit {
  @Input() testStepId = '';
  teststep!: TestStep;
  diagnosesDataSource!: MatTableDataSource<Diagnosis>;
  displayedColumns = [
    'typeIcon',
    'symptom',
    'message',
    'type',
    'hardwareInfo',
  ];

  @ViewChild(MatSort) diagnosesSort!: MatSort;

  constructor(
      private readonly testrunService: TestRunService,
      readonly sideInfoService: SideInfoService) {}

  ngOnInit() {
    this.teststep = this.testrunService.getTestStep(this.testStepId);
    this.diagnosesDataSource = new MatTableDataSource(this.teststep.diagnoses);
    if (
      !!this.teststep.diagnoses.length &&
      !!this.teststep.diagnoses[0].subcomponent
    ) {
      this.displayedColumns.push("subcomponent");
    }
  }

  ngAfterViewInit() {
    this.diagnosesDataSource.sort = this.diagnosesSort;
  }

  getHardwareInfoName(hardwareId: string) {
    return this.testrunService.getHardwareComponent(hardwareId).name;
  }
}
