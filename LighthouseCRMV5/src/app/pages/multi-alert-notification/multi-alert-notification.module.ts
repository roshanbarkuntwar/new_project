import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultiAlertNotificationPageRoutingModule } from './multi-alert-notification-routing.module';

import { MultiAlertNotificationPage } from './multi-alert-notification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultiAlertNotificationPageRoutingModule
  ],
  declarations: [MultiAlertNotificationPage]
})
export class MultiAlertNotificationPageModule {}
