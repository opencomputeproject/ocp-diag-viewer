import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';

import {SessionTitleBarComponent} from './session_title_bar';

@NgModule({
  imports: [
    CommonModule,
    MatBadgeModule,
  ],
  declarations: [SessionTitleBarComponent],
  exports: [SessionTitleBarComponent]
})
export class SessionTitleBarModule {
}
