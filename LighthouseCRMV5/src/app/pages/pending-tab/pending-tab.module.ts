import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingTabPageRoutingModule } from './pending-tab-routing.module';

import { PendingTabPage } from './pending-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingTabPageRoutingModule
  ],
  declarations: []
})
export class PendingTabPageModule {}
