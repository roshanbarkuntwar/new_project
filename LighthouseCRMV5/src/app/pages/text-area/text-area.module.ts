import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TextAreaPageRoutingModule } from './text-area-routing.module';

import { TextAreaPage } from './text-area.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TextAreaPageRoutingModule
  ],
  declarations: []
})
export class TextAreaPageModule {}
