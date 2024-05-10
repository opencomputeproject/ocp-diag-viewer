import {Component, Input, ViewEncapsulation} from '@angular/core';

/**
 * A key value table lists key in the left column, and value in the right
 * column. If value is an object, shows it by a json viewer.
 */
@Component({
  selector: 'key-value-table',
  templateUrl: './key_value_table.ng.html',
  styleUrls: ['key_value_table.css'],
  encapsulation: ViewEncapsulation.None,
})
export class KeyValueTableComponent {
  /**
   * The table's source of data, which is an array of key / value tuple.
   * The keys are strings, and values can be primitive data types or Object
   * types.
   */
  @Input() dataSource: Array<[string, unknown]> = [];
  @Input() openAllPanels = false;

  isObject(value: unknown): value is object {
    return typeof value === 'object';
  }
}
