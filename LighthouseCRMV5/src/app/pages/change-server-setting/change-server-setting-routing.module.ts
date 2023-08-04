import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeServerSettingPage } from './change-server-setting.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeServerSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeServerSettingPageRoutingModule {}
