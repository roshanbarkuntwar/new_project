import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageIconMasterPageRoutingModule } from './image-icon-master-routing.module';

import { ImageIconMasterPage } from './image-icon-master.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageIconMasterPageRoutingModule
  ],
  declarations: []
})
export class ImageIconMasterPageModule {}
