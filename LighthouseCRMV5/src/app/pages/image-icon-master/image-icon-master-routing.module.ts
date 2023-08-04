import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageIconMasterPage } from './image-icon-master.page';

const routes: Routes = [
  {
    path: '',
    component: ImageIconMasterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageIconMasterPageRoutingModule {}
