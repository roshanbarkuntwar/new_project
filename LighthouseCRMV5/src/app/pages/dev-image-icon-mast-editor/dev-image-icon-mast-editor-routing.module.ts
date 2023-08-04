import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevImageIconMastEditorPage } from './dev-image-icon-mast-editor.page';

const routes: Routes = [
  {
    path: '',
    component: DevImageIconMastEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevImageIconMastEditorPageRoutingModule {}
