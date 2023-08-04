import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AppkeyCollectionPage } from './appkey-collection.page';

const routes: Routes = [
  {
    path: '',
    component: AppkeyCollectionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppkeyCollectionPage]
})
export class AppkeyCollectionPageModule {}
