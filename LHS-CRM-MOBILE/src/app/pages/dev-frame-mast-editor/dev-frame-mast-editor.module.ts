import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DevFrameMastEditorPage } from './dev-frame-mast-editor.page';

const routes: Routes = [
  {
    path: '',
    component: DevFrameMastEditorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    
  ],
  declarations: []
})
export class DevFrameMastEditorPageModule {}
