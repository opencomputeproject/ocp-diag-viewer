import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import { ValidatorType } from "src/services/results_type";

import {ResultRecordService} from '../../services/result_record_service';
import {SideInfoService} from '../../services/side_info_service';
import {TestRunService} from '../../services/testrun_service';

import {MeasurementsComponent} from './measurements';
import {TestStepModule} from './teststep_module';

describe('Teststep MeasurementsComponent Component', () => {
  const testRunService =
      jasmine.createSpyObj('mockTestRunService', ['getHardwareComponent']);
  let fixture: ComponentFixture<MeasurementsComponent>;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
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

    testRunService.getHardwareComponent.and.returnValue({
      name: 'myHardware',
    });

    fixture = TestBed.createComponent(MeasurementsComponent);
    fixture.componentInstance.dataSource = [
      {
        valid: true,
        name: "measurement 1",
        unit: "string-unit",
        hardwareInfoId: "0",
        index: 0,
        measurementSeriesId: "NOT_APPLICABLE",
        value: 1,
        range: { maximum: 10, minimum: 0 },
      },
      {
        valid: false,
        name: "measurement 2",
        unit: "array-unit",
        hardwareInfoId: "0",
        index: 0,
        measurementSeriesId: "NOT_APPLICABLE",
        value: [1, 3],
        validValues: {
          values: [
            [1, 2],
            [2, 3],
          ],
        },
      },
    ];
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have 2 rows', () => {
    expect(fixture.nativeElement.querySelectorAll('table tbody tr'))
        .toHaveSize(2);
  });

  it('should have 6 columns', () => {
    // Check texts of cells in row 1
    const rawOneEl =
        fixture.nativeElement.querySelectorAll('table tbody tr')[0];
    expect(rawOneEl).toBeTruthy();
    const rawOneCellEls = rawOneEl.querySelectorAll('td');
    expect(rawOneCellEls).toHaveSize(6);
    expect(rawOneCellEls[0].innerText).toBe('measurement 1');
    expect(rawOneCellEls[1].innerText).toBe('1');
    expect(rawOneCellEls[2].innerText).toBe('string-unit');
    expect(rawOneCellEls[3].innerText).toBe('myHardware');
    expect(rawOneCellEls[4].innerText).toBe('check_circle');
    expect(rawOneCellEls[5].innerText).toBe('0 - 10');

    // Check texts of cells in row 2
    const rawTwoEl =
        fixture.nativeElement.querySelectorAll('table tbody tr')[1];
    expect(rawTwoEl).toBeTruthy();
    const rawTwoCellEls = rawTwoEl.querySelectorAll('td');
    expect(rawTwoCellEls).toHaveSize(6);
    expect(rawTwoCellEls[0].innerText).toBe('measurement 2');
    expect(rawTwoCellEls[1].innerText).toBe('1,3');
    expect(rawTwoCellEls[2].innerText).toBe('array-unit');
    expect(rawTwoCellEls[3].innerText).toBe('myHardware');
    expect(rawTwoCellEls[4].innerText).toBe('report_problem');
    expect(rawTwoCellEls[5].innerText).toBe('[[1,2],[2,3]]');
  });

  it('should be sortable', () => {
    // direction: asc
    fixture.componentInstance.sortMeasurementsComponent(
        {active: 'name', direction: 'asc'});
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table tbody tr')
               .querySelectorAll('td')[0]
               .innerText)
        .toBe('measurement 1');

    // direction: desc
    fixture.componentInstance.sortMeasurementsComponent(
        {active: 'name', direction: 'desc'});
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table tbody tr')
               .querySelectorAll('td')[0]
               .innerText)
        .toBe('measurement 2');

    // direction: empty
    fixture.componentInstance.sortMeasurementsComponent({active: 'name', direction: ''});
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table tbody tr')
               .querySelectorAll('td')[0]
               .innerText)
        .toBe('measurement 1');
  });

  it("should print nothing if validators is empty", () => {
    const measurementComponent = new MeasurementsComponent(
      testRunService,
      new SideInfoService(testRunService)
    );
    expect(measurementComponent.formatValidatorsRange([])).toBe("");
  });

  it("should print validator values correctly", () => {
    const measurementComponent = new MeasurementsComponent(
      testRunService,
      new SideInfoService(testRunService)
    );
    expect(
      measurementComponent.formatValidatorsRange([
        {
          type: ValidatorType.EQUAL,
          value: 2,
          name: "equal",
          metadata: {},
        },
      ])
    ).toBe("= 2");
  });

  it("should print out multiple validators separated by commas", () => {
    const measurementComponent = new MeasurementsComponent(
      testRunService,
      new SideInfoService(testRunService)
    );
    expect(
      measurementComponent.formatValidatorsRange([
        {
          type: ValidatorType.LESS_THAN,
          value: 100,
          name: "less",
          metadata: {},
        },
        {
          type: ValidatorType.GREATER_THAN,
          value: 10,
          name: "more",
          metadata: {},
        },
      ])
    ).toBe("< 100, > 10");
  });
});
