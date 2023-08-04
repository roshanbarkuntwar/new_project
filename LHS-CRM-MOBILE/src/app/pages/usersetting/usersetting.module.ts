import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
// import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { UsersettingPage } from './usersetting.page';

const routes: Routes = [
  {
    path: '',
   // component: UsersettingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class UsersettingPageModule {}
