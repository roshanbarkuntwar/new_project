import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BetaVersionPageRoutingModule } from './beta-version-routing.module';

import { BetaVersionPage } from './beta-version.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BetaVersionPageRoutingModule
  ],
  declarations: [BetaVersionPage]
})
export class BetaVersionPageModule {}
