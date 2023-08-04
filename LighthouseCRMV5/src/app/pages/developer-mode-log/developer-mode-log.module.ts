import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeveloperModeLogPageRoutingModule } from './developer-mode-log-routing.module';

import { DeveloperModeLogPage } from './developer-mode-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeveloperModeLogPageRoutingModule
  ],
  declarations: []
})
export class DeveloperModeLogPageModule {}
