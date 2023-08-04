import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevObjectMastEditorPageRoutingModule } from './dev-object-mast-editor-routing.module';

import { DevObjectMastEditorPage } from './dev-object-mast-editor.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevObjectMastEditorPageRoutingModule
  ],
  declarations: []
})
export class DevObjectMastEditorPageModule {}
