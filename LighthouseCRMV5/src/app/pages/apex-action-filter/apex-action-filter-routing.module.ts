import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApexActionFilterPage } from './apex-action-filter.page';

const routes: Routes = [
  {
    path: '',
    component: ApexActionFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApexActionFilterPageRoutingModule {}
