import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

import {ResultRecordService} from '../../services/result_record_service';
import {SideInfoService} from '../../services/side_info_service';
import {TestRunService} from '../../services/testrun_service';

import {DiagnosesComponent} from './diagnoses';
import {TestStepModule} from './teststep_module';

describe('Teststep Diagnosis Component', () => {
  const testRunService = jasmine.createSpyObj(
      'mockTestRunService', ['getHardwareComponent', 'getTestStep']);
  let fixture: ComponentFixture<DiagnosesComponent>;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        TestStepModule, RouterTestingModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
      providers: [
        ResultRecordService,
        {provide: TestRunService, useValue: testRunService},
        SideInfoService,
      ],
    });

    testRunService.getTestStep.and.returnValue({
      testStepId: "0",
      name: "step1",
      startTime: "2021-10-12T14:09:43.548764032Z",
      endTime: "2021-10-12T14:09:53.548764032Z",
      status: "COMPLETE",
      diagnoses: [
        {
          verdict: "symptom_pass",
          type: "PASS",
          message: "Pass message",
          hardwareInfoId: ["0"],
        },
        {
          verdict: "symptom_fail",
          type: "FAIL",
          message: "Fail message",
          hardwareInfoId: ["0"],
        },
      ],
    });

    testRunService.getHardwareComponent.and.returnValue({
      name: 'myHardware',
    });

    fixture = TestBed.createComponent(DiagnosesComponent);
    fixture.componentInstance.testStepId = '0';
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should be 2 records', () => {
    expect(fixture.nativeElement.querySelectorAll('table tbody tr'))
        .toHaveSize(2);
  });
});
