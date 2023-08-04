import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApexHighlightPage } from './apex-highlight.page';

const routes: Routes = [
  {
    path: '',
    component: ApexHighlightPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApexHighlightPageRoutingModule {}
