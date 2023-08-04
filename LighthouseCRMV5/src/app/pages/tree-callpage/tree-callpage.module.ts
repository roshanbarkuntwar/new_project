import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TreeCallpagePageRoutingModule } from './tree-callpage-routing.module';

import { TreeCallpagePage } from './tree-callpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TreeCallpagePageRoutingModule
  ],
  declarations: []
})
export class TreeCallpagePageModule {}
