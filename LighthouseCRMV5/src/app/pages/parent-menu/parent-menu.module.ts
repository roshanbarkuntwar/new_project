import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParentMenuPageRoutingModule } from './parent-menu-routing.module';

import { ParentMenuPage } from './parent-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParentMenuPageRoutingModule
  ],
  declarations: []
})
export class ParentMenuPageModule {}
