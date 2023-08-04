import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeveloperModeLogPage } from './developer-mode-log.page';

const routes: Routes = [
  {
    path: '',
    component: DeveloperModeLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeveloperModeLogPageRoutingModule {}
