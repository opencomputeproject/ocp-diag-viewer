import {TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {ResultRecordService} from '../services/result_record_service';
import {TestRunService} from '../services/testrun_service';

import {SoftwareInfosTableComponent} from './software_infos';
import {TestrunModule} from './testrun_module';

describe('SoftwareInfosTableComponent Component', () => {
  const testRunService = jasmine.createSpyObj('mockTestRunService', ['get']);

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoftwareInfosTableComponent],
      imports: [
        TestrunModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
      providers: [
        ResultRecordService,
        {provide: TestRunService, useValue: testRunService},
      ],
    });
  });

  it('should be created', () => {
    testRunService.get.and.returnValue({softwareInfos: {}});

    const fixture = TestBed.createComponent(SoftwareInfosTableComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show 2 items', () => {
    testRunService.get.and.returnValue({
      softwareInfos: {
        '0': {
          softwareInfoId: '0',
          name: 'linux-kernal',
        },
        '1': {
          softwareInfoId: '1',
          name: 'systemd',
        }
      }
    });

    const fixture = TestBed.createComponent(SoftwareInfosTableComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('table tbody tr'))
        .toHaveSize(2);
  });
});
