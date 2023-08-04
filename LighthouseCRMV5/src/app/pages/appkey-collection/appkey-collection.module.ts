import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppkeyCollectionPageRoutingModule } from './appkey-collection-routing.module';

import { AppkeyCollectionPage } from './appkey-collection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppkeyCollectionPageRoutingModule
  ],
  declarations: [AppkeyCollectionPage]
})
export class AppkeyCollectionPageModule {}
