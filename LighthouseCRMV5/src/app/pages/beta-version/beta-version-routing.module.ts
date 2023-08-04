import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BetaVersionPage } from './beta-version.page';

const routes: Routes = [
  {
    path: '',
    component: BetaVersionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BetaVersionPageRoutingModule {}
