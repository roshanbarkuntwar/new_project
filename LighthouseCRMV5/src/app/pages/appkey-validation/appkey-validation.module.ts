import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppkeyValidationPageRoutingModule } from './appkey-validation-routing.module';

import { AppkeyValidationPage } from './appkey-validation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppkeyValidationPageRoutingModule
  ],
  declarations: [AppkeyValidationPage]
})
export class AppkeyValidationPageModule {}
