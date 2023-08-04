import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevObjFrameListPageRoutingModule } from './dev-obj-frame-list-routing.module';

import { DevObjFrameListPage } from './dev-obj-frame-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevObjFrameListPageRoutingModule
  ],
  declarations: []
})
export class DevObjFrameListPageModule {}
