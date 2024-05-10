import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';

import {SummaryBarComponent} from './summary_bar';

@NgModule({
  imports: [
    CommonModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
  ],
  declarations: [SummaryBarComponent],
  exports: [SummaryBarComponent]
})
export class SummaryBarModule {
}
