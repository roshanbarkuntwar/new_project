import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OfflineEntryTabsPage } from './offline-entry-tabs.page';
import { OfflineEntryListPage } from '../offline-entry-list/offline-entry-list.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineEntryTabsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
  entryComponents: []
})
export class OfflineEntryTabsPageModule { }
