import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExecutedTabPage } from './executed-tab.page';

const routes: Routes = [
  {
    path: '',
    component: ExecutedTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecutedTabPageRoutingModule {}
