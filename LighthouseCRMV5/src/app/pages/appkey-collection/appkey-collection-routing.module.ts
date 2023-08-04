import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppkeyCollectionPage } from './appkey-collection.page';

const routes: Routes = [
  {
    path: '',
    component: AppkeyCollectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppkeyCollectionPageRoutingModule {}
