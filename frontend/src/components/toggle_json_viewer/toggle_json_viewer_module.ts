import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {NgxJsonViewerModule} from 'ngx-json-viewer';

import {ToggleJsonViewerComponent} from './toggle_json_viewer';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    NgxJsonViewerModule,
  ],
  declarations: [ToggleJsonViewerComponent],
  exports: [ToggleJsonViewerComponent]
})
export class ToggleJsonViewerModule {
}
