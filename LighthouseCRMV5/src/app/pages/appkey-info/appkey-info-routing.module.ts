import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppkeyInfoPage } from './appkey-info.page';

const routes: Routes = [
  {
    path: '',
    component: AppkeyInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppkeyInfoPageRoutingModule {}
