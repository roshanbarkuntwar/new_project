import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppkeyInfoPageRoutingModule } from './appkey-info-routing.module';

import { AppkeyInfoPage } from './appkey-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppkeyInfoPageRoutingModule
  ],
  declarations: [AppkeyInfoPage]
})
export class AppkeyInfoPageModule {}
