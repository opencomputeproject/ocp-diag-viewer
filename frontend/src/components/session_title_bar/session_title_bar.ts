import {Component, Input} from '@angular/core';

/**
 * SessionTitleBar is a styled title bar with badge.
 */
@Component({
  selector: 'session-title-bar',
  templateUrl: './session_title_bar.ng.html',
  styleUrls: ['session_title_bar.css'],
})
export class SessionTitleBarComponent {
  @Input() badge = 0;
  @Input() title = '';
}
