import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeveloperModePage } from './developer-mode.page';

const routes: Routes = [
  {
    path: '',
    component: DeveloperModePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeveloperModePageRoutingModule {}
