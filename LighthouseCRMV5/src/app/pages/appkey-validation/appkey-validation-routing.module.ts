import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppkeyValidationPage } from './appkey-validation.page';

const routes: Routes = [
  {
    path: '',
    component: AppkeyValidationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppkeyValidationPageRoutingModule {}
