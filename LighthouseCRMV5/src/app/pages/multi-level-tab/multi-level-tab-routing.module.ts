import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultiLevelTabPage } from './multi-level-tab.page';

const routes: Routes = [
  {
    path: '',
    component: MultiLevelTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiLevelTabPageRoutingModule {}
