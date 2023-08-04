import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SqlLightTranPage } from './sql-light-tran.page';

const routes: Routes = [
  {
    path: '',
    component: SqlLightTranPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SqlLightTranPageRoutingModule {}
