import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {TestBed} from '@angular/core/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatExpansionPanelHarness} from '@angular/material/expansion/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {ResultRecordService} from '../services/result_record_service';
import {TestRunService} from '../services/testrun_service';

import {HardwareComponentsTableComponent} from './hardware_components';
import {TestrunModule} from './testrun_module';

describe('HardwareComponentsTableComponent Component', () => {
  const testRunService =
      jasmine.createSpyObj('mockResultRecordService', ['get']);

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HardwareComponentsTableComponent],
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
    testRunService.get.and.returnValue({hardwareInfos: {}});

    const fixture = TestBed.createComponent(HardwareComponentsTableComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show 2 items', () => {
    testRunService.get.and.returnValue({
      hardwareInfos: {
        '0': {
          hardwareInfoId: '0',
          name: 'CPU1',
        },
        '1': {
          hardwareInfoId: '1',
          name: 'DIMM1',
        }
      }
    });

    const fixture = TestBed.createComponent(HardwareComponentsTableComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('table tbody tr'))
        .toHaveSize(2);
  });

  it('should filter by keywords', async () => {
    testRunService.get.and.returnValue({
      hardwareInfos: {
        '0': {
          hardwareInfoId: '0',
          name: 'CPU1',
        },
        '1': {
          hardwareInfoId: '1',
          name: 'DIMM1',
        },
        '2': {
          hardwareInfoId: '2',
          name: 'DIMM2',
        },
      }
    });
    const fixture = TestBed.createComponent(HardwareComponentsTableComponent);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const input = await loader.getHarness(MatInputHarness);

    await input.setValue('dimm');

    // There are 2 dimm in hardware components.
    expect(fixture.nativeElement.querySelectorAll('table tbody tr'))
        .toHaveSize(2);
  });

  it('should expand/collapse', async () => {
    testRunService.get.and.returnValue({
      hardwareInfos: {
        '0': {
          hardwareInfoId: '0',
          name: 'CPU1',
        },
        '1': {
          hardwareInfoId: '1',
          name: 'DIMM1',
        },
        '2': {
          hardwareInfoId: '2',
          name: 'DIMM2',
        },
      }
    });
    const fixture = TestBed.createComponent(HardwareComponentsTableComponent);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const button = await loader.getHarness(MatButtonHarness);
    const panel = await loader.getHarness(MatExpansionPanelHarness);

    expect(await button.getText()).toBe('Expand All');
    expect(await panel.isExpanded()).toBe(false);

    await button.click();

    expect(await button.getText()).toBe('Collapse All');
    expect(await panel.isExpanded()).toBe(true);
  });

  it("should identify V1/V2 hardware info correctly", async () => {
    testRunService.get.and.returnValue({
      hardwareInfos: {
        "0": {
          hardwareInfoId: "0",
          name: "CPU1",
        },
      },
    });
    let hardwareComponents = new HardwareComponentsTableComponent(
      testRunService
    );
    expect(hardwareComponents.isV2).toBe(false);

    testRunService.get.and.returnValue({
      hardwareInfos: {
        "0": {
          hardwareInfoId: "0",
          name: "CPU1",
          computerSystem: "TestSystem",
        },
      },
    });
    hardwareComponents = new HardwareComponentsTableComponent(testRunService);
    expect(hardwareComponents.isV2).toBe(true);
  });
});
