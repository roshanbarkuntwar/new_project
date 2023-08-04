import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApexActionFilterPageRoutingModule } from './apex-action-filter-routing.module';

import { ApexActionFilterPage } from './apex-action-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApexActionFilterPageRoutingModule
  ],
  declarations: []
})
export class ApexActionFilterPageModule {}
