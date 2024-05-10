import {Component, Input} from '@angular/core';

import {SideInfoEvent} from '../services/side_info_service';

/** The navigation bar of main page */
@Component({
  selector: 'app-side-info',
  templateUrl: './side_info.ng.html',
  styleUrls: ['./side_info.css']
})
export class SideInfoComponent {
  @Input()
  sideInfo: SideInfoEvent = {
    title: '',
    subtitle: '',
    info: [],
  };
}
