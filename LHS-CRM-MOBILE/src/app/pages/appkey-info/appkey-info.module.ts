
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AppkeyInfoPage } from './appkey-info.page';
import { AppkeyUserInfoPage } from '../appkey-user-info/appkey-user-info.page';

const routes: Routes = [
  {
    path: '',
    component: AppkeyInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppkeyInfoPage],
  entryComponents: []
})
export class AppkeyInfoPageModule {}
