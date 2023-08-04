import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevFrameMastEditorPageRoutingModule } from './dev-frame-mast-editor-routing.module';

import { DevFrameMastEditorPage } from './dev-frame-mast-editor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevFrameMastEditorPageRoutingModule
  ],
  declarations: []
})
export class DevFrameMastEditorPageModule {}
