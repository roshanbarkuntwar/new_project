import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BypassPageRoutingModule } from './bypass-routing.module';

import { BypassPage } from './bypass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BypassPageRoutingModule
  ],
  declarations: [BypassPage]
})
export class BypassPageModule {}
