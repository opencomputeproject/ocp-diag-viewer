import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

/** A component wrapps ngx-json-viewer withi an expandable toggle. */
@Component({
  selector: 'toggle-json-viewer',
  templateUrl: './toggle_json_viewer.ng.html',
  styleUrls: ['./toggle_json_viewer.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ToggleJsonViewerComponent implements OnInit {
  renderState = false;
  @Input() json: object = {};
  @Input() openPanel = false;

  ngOnInit() {
    // do nothing
  }
}
