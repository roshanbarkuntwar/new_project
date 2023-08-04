import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppkeyUserInfoPageRoutingModule } from './appkey-user-info-routing.module';

import { AppkeyUserInfoPage } from './appkey-user-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppkeyUserInfoPageRoutingModule
  ],
  declarations: []
})
export class AppkeyUserInfoPageModule {}
