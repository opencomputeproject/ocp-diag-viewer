import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatTableModule} from '@angular/material/table';

import {ToggleJsonViewerModule} from '../toggle_json_viewer/toggle_json_viewer_module';

import {KeyValueTableComponent} from './key_value_table';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    ToggleJsonViewerModule,
  ],
  declarations: [KeyValueTableComponent],
  exports: [KeyValueTableComponent]
})
export class KeyValueTableModule {
}
