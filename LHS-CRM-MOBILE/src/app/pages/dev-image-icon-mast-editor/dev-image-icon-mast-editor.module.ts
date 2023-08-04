import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DevImageIconMastEditorPage } from './dev-image-icon-mast-editor.page';

const routes: Routes = [
  {
    path: '',
    component: DevImageIconMastEditorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class DevImageIconMastEditorPageModule {}
