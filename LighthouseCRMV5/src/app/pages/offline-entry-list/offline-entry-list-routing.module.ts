import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineEntryListPage } from './offline-entry-list.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineEntryListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineEntryListPageRoutingModule {}
