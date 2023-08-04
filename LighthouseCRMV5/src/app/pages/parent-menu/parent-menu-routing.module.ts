import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParentMenuPage } from './parent-menu.page';

const routes: Routes = [
  {
    path: '',
    component: ParentMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentMenuPageRoutingModule {}
