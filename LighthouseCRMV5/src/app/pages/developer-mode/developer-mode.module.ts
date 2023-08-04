import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeveloperModePageRoutingModule } from './developer-mode-routing.module';

import { DeveloperModePage } from './developer-mode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeveloperModePageRoutingModule
  ],
  declarations: []
})
export class DeveloperModePageModule {}
