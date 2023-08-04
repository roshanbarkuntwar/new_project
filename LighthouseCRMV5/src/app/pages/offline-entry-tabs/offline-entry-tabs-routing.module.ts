import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineEntryTabsPage } from './offline-entry-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineEntryTabsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineEntryTabsPageRoutingModule {}
