import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DynamicmodalPage } from './dynamicmodal.page';

const routes: Routes = [
  {
    path: '',
    component: DynamicmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicmodalPageRoutingModule {}
