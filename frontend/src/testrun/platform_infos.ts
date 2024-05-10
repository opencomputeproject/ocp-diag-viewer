import { Component, ViewEncapsulation } from '@angular/core';
import { PlatformInfo } from 'src/services/results_type';
import { TestRunService } from 'src/services/testrun_service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: "testrun-platform-infos",
    templateUrl: "platform_infos.ng.html",
    encapsulation: ViewEncapsulation.None,
})

export class PlatformInfosTableComponent {
    dataSource: MatTableDataSource<PlatformInfo>;
    displayedColumns = ["info"];
    ngOnInit() {
        // do nothing
    }
    constructor(private readonly testrunService: TestRunService) {
        this.dataSource = new MatTableDataSource(this.testrunService.get().platformInfos);
    }
}
