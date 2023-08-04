import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExecutedTabPageRoutingModule } from './executed-tab-routing.module';

import { ExecutedTabPage } from './executed-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExecutedTabPageRoutingModule
  ],
  declarations: []
})
export class ExecutedTabPageModule {}
