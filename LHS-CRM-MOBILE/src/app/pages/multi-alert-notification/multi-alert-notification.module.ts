import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MultiAlertNotificationPage } from './multi-alert-notification.page';

const routes: Routes = [
  {
    path: '',
    component: MultiAlertNotificationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MultiAlertNotificationPage]
})
export class MultiAlertNotificationPageModule {}
