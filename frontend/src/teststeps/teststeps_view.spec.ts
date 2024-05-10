import {TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

import {ResultRecordService} from '../services/result_record_service';
import {TestRunService} from '../services/testrun_service';

import {TestStepsModule} from './teststeps_module';
import {TestStepsViewComponent} from './teststeps_view';

describe('TestStepsViewComponent Component', () => {
  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        TestStepsModule, RouterTestingModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
      providers: [
        ResultRecordService,
        TestRunService,
      ],
    });
  }));

  it('should be created', () => {
    const fixture = TestBed.createComponent(TestStepsViewComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('teststeps-list')).toBeTruthy();
  });
});
