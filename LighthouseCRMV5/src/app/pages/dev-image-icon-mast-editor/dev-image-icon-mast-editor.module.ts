import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevImageIconMastEditorPageRoutingModule } from './dev-image-icon-mast-editor-routing.module';

import { DevImageIconMastEditorPage } from './dev-image-icon-mast-editor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevImageIconMastEditorPageRoutingModule
  ],
  declarations: []
})
export class DevImageIconMastEditorPageModule {}
