import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SqlLightTranPageRoutingModule } from './sql-light-tran-routing.module';

import { SqlLightTranPage } from './sql-light-tran.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SqlLightTranPageRoutingModule
  ],
  declarations: []
})
export class SqlLightTranPageModule {}
