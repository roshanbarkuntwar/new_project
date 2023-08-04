import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevObjFrameListPage } from './dev-obj-frame-list.page';

const routes: Routes = [
  {
    path: '',
    component: DevObjFrameListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevObjFrameListPageRoutingModule {}
