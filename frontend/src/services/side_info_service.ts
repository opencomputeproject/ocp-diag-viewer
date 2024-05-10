import {EventEmitter, Injectable, Output} from '@angular/core';
import { HardwareInfo, HardwareInfo_V1, SoftwareInfo, SoftwareInfo_V2 } from './results_type';

import {TestRunService} from './testrun_service';

/** Event type for output newSideInfoEvent */
export interface SideInfoEvent {
  title: string;
  subtitle: string;
  info: Array<[string, unknown]>;
}

/**
 * A service that display side info pannel.
 */
@Injectable()
export class SideInfoService {
  @Output() newSideInfoEvent = new EventEmitter<SideInfoEvent>();

  constructor(private readonly testRunService: TestRunService) {}

  isV1HardwareInfo(hw: HardwareInfo): hw is HardwareInfo_V1 {
    return Object.prototype.hasOwnProperty.call(hw, 'fruLocation');
  }

  isV2SoftwareInfo(sw: SoftwareInfo): sw is SoftwareInfo_V2 {
    return Object.prototype.hasOwnProperty.call(sw, 'computerSystem');
  }

  showHardwareInfo(hardwareInfoId: string) {
    const info: Array<[string, unknown]> = [];
    const hw = this.testRunService.get().hardwareInfos[hardwareInfoId];
    const isV1 = this.isV1HardwareInfo(hw);
    info.push(["Name", hw.name]);
    info.push(["Id", hardwareInfoId]);
    info.push(["Arena", hw.arena]);
    info.push(["Manufacturer", hw.manufacturer]);
    info.push(["Part Number", hw.partNumber]);
    info.push(["Part Type", hw.partType]);
    info.push([
      "Mfg Part Number",
      isV1 ? hw.mfgPartNumber : hw.manufacturerPartNumber,
    ]);
    if (isV1) {
      info.push(["Hostname", hw.hostname]);
      info.push(["Fru Location", hw.fruLocation]);
      info.push(["Component Location", hw.componentLocation]);
    } else {
      info.push(["Location", hw.location]);
      info.push(["Computer System", hw.computerSystem]);
      info.push(["Odata Id", hw.odataId]);
      info.push(["Serial Number", hw.serialNumber]);
      info.push(["Manager", hw.manager]);
      info.push(["Version", hw.version]);
      info.push(["Revision", hw.revision]);
    }

    const event:
        SideInfoEvent = {title: hw.name, subtitle: 'HardwareInfo', info};
    this.newSideInfoEvent.emit(event);
    return;
  }

  showSoftwareInfo(softwareInfoId: string) {
    const info: Array<[string, unknown]> = [];
    const sw = this.testRunService.get().softwareInfos[softwareInfoId];
    const isV2 = this.isV2SoftwareInfo(sw);
    info.push(['Name', sw.name]);
    info.push(["Id", softwareInfoId]);
    info.push(['Arena', sw.arena]);
    info.push(['Version', sw.version]);
    if(isV2) {
      info.push(['Computer System', sw.computerSystem]);
      info.push(['Revision', sw.revision]);
      info.push(["Software Type", sw.softwareType]);
    } else {
      info.push(['Hostname', sw.hostname]);
    }

    const event:
        SideInfoEvent = {title: sw.name, subtitle: 'SoftwareInfo', info};
    this.newSideInfoEvent.emit(event);
    return;
  }
}
