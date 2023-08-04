import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersettingPageRoutingModule } from './usersetting-routing.module';

import { UsersettingPage } from './usersetting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersettingPageRoutingModule
  ],
  declarations: []
})
export class UsersettingPageModule {}
