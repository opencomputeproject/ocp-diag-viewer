import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LogsViewComponent} from '../logs/logs_view';
import {TestRunViewComponent} from '../testrun/testrun_view';
import {TestStepViewComponent} from '../teststeps/teststep/teststep_view';
import {TestStepsViewComponent} from '../teststeps/teststeps_view';

const routes: Routes = [
  {path: '', component: TestRunViewComponent},
  {path: 'teststeps', component: TestStepsViewComponent},
  {path: 'teststeps/:testStepId', component: TestStepViewComponent},
  {path: 'logs', component: LogsViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
