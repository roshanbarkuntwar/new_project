import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultiLevelTabPageRoutingModule } from './multi-level-tab-routing.module';

import { MultiLevelTabPage } from './multi-level-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultiLevelTabPageRoutingModule
  ],
  declarations: []
})
export class MultiLevelTabPageModule {}
