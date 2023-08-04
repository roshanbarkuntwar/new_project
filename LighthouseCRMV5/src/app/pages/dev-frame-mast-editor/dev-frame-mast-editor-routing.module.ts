import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevFrameMastEditorPage } from './dev-frame-mast-editor.page';

const routes: Routes = [
  {
    path: '',
    component: DevFrameMastEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevFrameMastEditorPageRoutingModule {}
