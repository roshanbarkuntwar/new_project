import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeServerSettingPageRoutingModule } from './change-server-setting-routing.module';

import { ChangeServerSettingPage } from './change-server-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeServerSettingPageRoutingModule
  ],
  declarations: [ChangeServerSettingPage]
})
export class ChangeServerSettingPageModule {}
