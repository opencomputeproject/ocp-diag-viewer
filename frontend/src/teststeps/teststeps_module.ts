import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {RouterModule} from '@angular/router';

import {SummaryBarModule} from '../components/summary_bar/summary_bar_module';

import {TestStepsListComponent} from './teststeps_list';
import {TestStepsViewComponent} from './teststeps_view';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    RouterModule,

    SummaryBarModule,
  ],
  declarations: [
    TestStepsViewComponent,
    TestStepsListComponent,
  ],
  exports: [TestStepsViewComponent],
})
export class TestStepsModule {
}
