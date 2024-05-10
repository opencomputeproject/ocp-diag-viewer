import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

import {ResultRecordService} from '../../services/result_record_service';
import {SideInfoService} from '../../services/side_info_service';
import {TestRunService} from '../../services/testrun_service';

import {SummaryComponent} from './summary';
import {TestStepModule} from './teststep_module';

describe('Teststep Summary Component', () => {
  const testRunService =
      jasmine.createSpyObj('mockTestRunService', ['getTestStep']);
  let fixture: ComponentFixture<SummaryComponent>;

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
      files: [
        {
          displayName: 'file1',
          outputPath: 'path1',
          description: 'description1',
          contentType: 'text',
          isSnapshot: false,
          tags: [{tag: 'file1'}, {tag: 'gourp1'}]
        },
        {
          displayName: 'file2',
          outputPath: 'path2',
          description: 'description2',
          contentType: 'text',
          isSnapshot: false,
          tags: []
        }
      ],
      extensions: [],
    });

    fixture = TestBed.createComponent(SummaryComponent);
    fixture.componentInstance.testStepId = '0';
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have summary table', () => {
    const summaryEl =
        fixture.debugElement.query(By.css('key-value-table.summary-table'));
    expect(summaryEl.componentInstance.dataSource)
        .toHaveSize(fixture.componentInstance.summary.length);
  });

  it('should have errors table', () => {
    expect(fixture.nativeElement.querySelector('errors-table')).toBeTruthy();
  });

  it('should have files table', () => {
    expect(fixture.nativeElement.querySelector('.files-table')).toBeTruthy();
    // There are 2 rows in table.
    expect(
        fixture.nativeElement.querySelectorAll('.files-table table tbody tr'))
        .toHaveSize(2);
    // Row 1 tags column should be "file1, gourp1".
    expect(fixture.nativeElement
               .querySelectorAll('.files-table td.mat-column-tags')[0]
               .innerText)
        .toBe('file1, gourp1');
  });

  it('should have extentions', () => {
    expect(fixture.nativeElement.querySelector('.extensions')).toBeTruthy();
  });
});
