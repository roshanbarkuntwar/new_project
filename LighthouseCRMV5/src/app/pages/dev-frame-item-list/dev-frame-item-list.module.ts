import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevFrameItemListPageRoutingModule } from './dev-frame-item-list-routing.module';

import { DevFrameItemListPage } from './dev-frame-item-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevFrameItemListPageRoutingModule
  ],
  declarations: []
})
export class DevFrameItemListPageModule {}
