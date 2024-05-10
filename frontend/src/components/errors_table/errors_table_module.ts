import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

import {ErrorsTableComponent} from './errors_table';

@NgModule({
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
  ],
  declarations: [ErrorsTableComponent],
  exports: [ErrorsTableComponent]
})
export class ErrorsTableModule {
}
