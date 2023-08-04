import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultiAlertNotificationPage } from './multi-alert-notification.page';

const routes: Routes = [
  {
    path: '',
    component: MultiAlertNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiAlertNotificationPageRoutingModule {}
