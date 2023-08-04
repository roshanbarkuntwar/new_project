import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineEntryTabsPageRoutingModule } from './offline-entry-tabs-routing.module';

import { OfflineEntryTabsPage } from './offline-entry-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineEntryTabsPageRoutingModule
  ],
  declarations: []
})
export class OfflineEntryTabsPageModule {}
