/* eslint-disable @angular-eslint/component-class-suffix */

import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

import {SideInfoEvent, SideInfoService} from '../services/side_info_service';

/**
 * The root component.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.ng.html',
  styleUrls: ['./app.css'],
})
export class App implements AfterViewInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  sideInfoEvent: SideInfoEvent = {
    title: '',
    subtitle: '',
    info: [],
  };

  constructor(private readonly sideInfoService: SideInfoService) {}

  ngAfterViewInit() {
    if (this.sidenav == null) {
      return;
    }

    /* eslint-disable-next-line @typescript-eslint/no-this-alias */
    const that = this;

    this.sideInfoService.newSideInfoEvent.subscribe((event: SideInfoEvent) => {
      that.sideInfoEvent = event;
      that.sidenav.toggle();
    });
  }
}
