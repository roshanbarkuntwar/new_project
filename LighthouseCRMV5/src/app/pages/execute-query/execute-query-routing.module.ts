import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExecuteQueryPage } from './execute-query.page';

const routes: Routes = [
  {
    path: '',
    component: ExecuteQueryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecuteQueryPageRoutingModule {}
