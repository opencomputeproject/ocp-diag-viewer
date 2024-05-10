import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatTableDataSource} from '@angular/material/table';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {ResultRecordService} from '../../services/result_record_service';
import {Error} from '../../services/results_type';
import {SideInfoService} from '../../services/side_info_service';
import {TestRunService} from '../../services/testrun_service';

import {ErrorsTableComponent} from './errors_table';
import {ErrorsTableModule} from './errors_table_module';


describe('ErrorsTable Component', () => {
  let fixture: ComponentFixture<ErrorsTableComponent>;
  let component: ErrorsTableComponent;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorsTableComponent],
      imports: [
        ErrorsTableModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
      providers: [
        ResultRecordService,
        TestRunService,
        SideInfoService,
      ]
    });

    fixture = TestBed.createComponent(ErrorsTableComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show 0 raw', () => {
    component.dataSource = new MatTableDataSource<Error>();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveSize(1);
    expect(fixture.nativeElement.querySelectorAll('tbody tr')[0].innerText)
        .toBe('No data available');
  });

  it('should show 2 raw', () => {
    component.dataSource = new MatTableDataSource<Error>([
      {
        symptom: "symptom1",
        message: "msg1",
        softwareInfoIds: [],
      },
      {
        symptom: "symptom2",
        message: "msg2",
        softwareInfoIds: [],
      },
    ]);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveSize(2);
  });
});
