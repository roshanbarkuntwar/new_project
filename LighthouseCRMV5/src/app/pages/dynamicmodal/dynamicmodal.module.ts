import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DynamicmodalPageRoutingModule } from './dynamicmodal-routing.module';

import { DynamicmodalPage } from './dynamicmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DynamicmodalPageRoutingModule
  ],
  declarations: []
})
export class DynamicmodalPageModule {}
