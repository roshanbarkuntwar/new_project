import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevClickEventsPageRoutingModule } from './dev-click-events-routing.module';

import { DevClickEventsPage } from './dev-click-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevClickEventsPageRoutingModule
  ],
  declarations: []
})
export class DevClickEventsPageModule {}
