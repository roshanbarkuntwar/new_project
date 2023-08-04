import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevClickEventsPage } from './dev-click-events.page';

const routes: Routes = [
  {
    path: '',
    component: DevClickEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevClickEventsPageRoutingModule {}
