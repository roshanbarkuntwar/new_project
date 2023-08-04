import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevObjectMastEditorPage } from './dev-object-mast-editor.page';

const routes: Routes = [
  {
    path: '',
    component: DevObjectMastEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevObjectMastEditorPageRoutingModule {}
