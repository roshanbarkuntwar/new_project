import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExecuteQueryPageRoutingModule } from './execute-query-routing.module';

import { ExecuteQueryPage } from './execute-query.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExecuteQueryPageRoutingModule
  ],
  declarations: []
})
export class ExecuteQueryPageModule {}
