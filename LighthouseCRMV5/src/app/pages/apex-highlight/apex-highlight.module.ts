import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApexHighlightPageRoutingModule } from './apex-highlight-routing.module';

import { ApexHighlightPage } from './apex-highlight.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApexHighlightPageRoutingModule
  ],
  declarations: []
})
export class ApexHighlightPageModule {}
