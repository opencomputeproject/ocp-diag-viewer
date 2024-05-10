import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ResultRecordService } from '../services/result_record_service';
import { TestRunService } from '../services/testrun_service';

import { PlatformInfosTableComponent } from './platform_infos';
import { TestrunModule } from './testrun_module';

describe('PlatformInfosTableComponent Component', () => {
  const testRunService = jasmine.createSpyObj('mockTestRunService', ['get']);

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlatformInfosTableComponent],
      imports: [
        TestrunModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
      providers: [
        ResultRecordService,
        { provide: TestRunService, useValue: testRunService },
      ],
    });
  });

  it('should be created', () => {
    testRunService.get.and.returnValue({ softwareInfos: {} });

    const fixture = TestBed.createComponent(PlatformInfosTableComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show 2 items', () => {
    testRunService.get.and.returnValue({
      platformInfos: [{
        info: 'info 1'
      }, {
        info: 'info 2'
      }]
    });

    const fixture = TestBed.createComponent(PlatformInfosTableComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('table tbody tr'))
      .toHaveSize(2);
  });

  it('should have one row if no data', () => {
    testRunService.get.and.returnValue({
      platformInfos: []
    });

    const fixture = TestBed.createComponent(PlatformInfosTableComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('table tbody tr'))
      .toHaveSize(1);
  });
});
