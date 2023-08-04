import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TreeCallpagePage } from './tree-callpage.page';

const routes: Routes = [
  {
    path: '',
    component: TreeCallpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreeCallpagePageRoutingModule {}
