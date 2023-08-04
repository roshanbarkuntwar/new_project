import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AppkeyValidationPage } from './appkey-validation.page';

const routes: Routes = [
  {
    path: '',
    component: AppkeyValidationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppkeyValidationPage]
})
export class AppkeyValidationPageModule {}
