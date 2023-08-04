import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FreezecolumnPage } from './freezecolumn.page';

const routes: Routes = [
  {
    path: '',
    component: FreezecolumnPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreezecolumnPageRoutingModule {}
