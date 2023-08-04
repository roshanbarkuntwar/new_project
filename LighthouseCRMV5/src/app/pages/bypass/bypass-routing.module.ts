import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BypassPage } from './bypass.page';

const routes: Routes = [
  {
    path: '',
    component: BypassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BypassPageRoutingModule {}
