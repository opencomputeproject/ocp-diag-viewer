import {TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

import {ResultRecordService} from '../services/result_record_service';
import {TestRunService} from '../services/testrun_service';

import {TestStepsListComponent} from './teststeps_list';
import {TestStepsModule} from './teststeps_module';

describe('TestStepsListComponent Component', () => {
  const testRunService = jasmine.createSpyObj('mockTestRunService', ['get']);

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestStepsListComponent],
      imports: [
        RouterTestingModule, TestStepsModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
      providers: [
        ResultRecordService,
        {provide: TestRunService, useValue: testRunService},
      ],
    });
  });

  it('should be created', () => {
    testRunService.get.and.returnValue({steps: {}});

    const fixture = TestBed.createComponent(TestStepsListComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should list 2 tests', () => {
    testRunService.get.and.returnValue({
      steps: {
        '0': {
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
          failure: false,
        },
        '1': {
          testStepId: '1',
          name: 'step2',
          startTime: '2021-10-12T14:09:43.548764032Z',
          endTime: '2021-10-12T14:09:53.548764032Z',
          status: 'ERROR',
          diagnoses: [],
          measurements: [],
          measurementSeriesInfos: {},
          measurementSeriesElements: [],
          errors: [],
          failure: false,
        },
        '2': {
          testStepId: '2',
          name: 'step3',
          startTime: '2021-10-12T14:09:43.548764032Z',
          endTime: '2021-10-12T14:09:53.548764032Z',
          status: 'COMPLETE',
          diagnoses: [],
          measurements: [],
          measurementSeriesInfos: {},
          measurementSeriesElements: [],
          errors: [],
          failure: true,
        }
      }
    });

    const fixture = TestBed.createComponent(TestStepsListComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('table tbody tr'))
        .toHaveSize(3);
    expect(fixture.nativeElement.querySelectorAll('table tbody tr td mat-icon'))
        .toHaveSize(3);
    expect(
        fixture.nativeElement.querySelectorAll('table tbody tr td mat-icon')[0]
            .innerText)
        .toBe('check_circle');
    expect(
        fixture.nativeElement.querySelectorAll('table tbody tr td mat-icon')[1]
            .innerText)
        .toBe('report_problem');
    expect(
        fixture.nativeElement.querySelectorAll('table tbody tr td mat-icon')[2]
            .innerText)
        .toBe('report');
  });
});
