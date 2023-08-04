import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PopoverPage } from './popover.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  
  ],
  
  declarations: [PopoverPage],
  entryComponents:[
    PopoverPage
  ],
})
export class PopoverPageModule {}
