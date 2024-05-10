import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';

import {ErrorsTableModule} from '../../components/errors_table/errors_table_module';
import {KeyValueTableModule} from '../../components/key_value_table/key_value_table_module';
import {SessionTitleBarModule} from '../../components/session_title_bar/session_title_bar_module';
import {SummaryBarModule} from '../../components/summary_bar/summary_bar_module';

import {DiagnosesComponent} from './diagnoses';
import {MeasurementsComponent} from './measurements';
import {SummaryComponent} from './summary';
import {TestStepViewComponent} from './teststep_view';

@NgModule({
  imports: [
    CommonModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,

    ErrorsTableModule,
    KeyValueTableModule,
    SessionTitleBarModule,
    SummaryBarModule,
  ],
  declarations: [
    DiagnosesComponent,
    MeasurementsComponent,
    SummaryComponent,
    TestStepViewComponent,
  ],
  exports: [TestStepViewComponent],
})
export class TestStepModule {
}
