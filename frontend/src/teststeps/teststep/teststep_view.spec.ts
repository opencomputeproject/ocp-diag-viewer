import {TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

import {ResultRecordService} from '../../services/result_record_service';
import {SideInfoService} from '../../services/side_info_service';
import {TestRunService} from '../../services/testrun_service';

import {TestStepModule} from './teststep_module';
import {TestStepViewComponent} from './teststep_view';

describe('TeststepViewComponent Component', () => {
  const testRunService =
      jasmine.createSpyObj('mockTestRunService', ['getTestStep']);

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
      testStepId: '0',
      name: 'step1',
      startTime: '2021-10-12T14:09:43.548764032Z',
      endTime: '2021-10-12T14:09:53.548764032Z',
      status: 'COMPLETE',
      diagnoses: [],
      measurements: [],
      measurementSeriesInfos: {},
      measurementSeriesElements: [],
      errors: [],
      extensions: [],
    });
  }));

  it('should be created', () => {
    const fixture = TestBed.createComponent(TestStepViewComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
