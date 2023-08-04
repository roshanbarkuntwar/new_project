import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleSelectLovPage } from './single-select-lov.page';

const routes: Routes = [
  {
    path: '',
    component: SingleSelectLovPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleSelectLovPageRoutingModule {}
