import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SqlLightTranPage } from './sql-light-tran.page';
import { PendingTabPage } from '../pending-tab/pending-tab.page';
import { ExecutedTabPage } from '../executed-tab/executed-tab.page';
import { SuperTabsModule }  from '@ionic-super-tabs/angular';
/* import { PendingTabPageModule } from '../pending-tab/pending-tab.module';
import { ExecutedTabPageModule } from '../executed-tab/executed-tab.module'; */
// const routes: Routes = [
//   {
//     path: '',
//     component: SqlLightTranPage
//   }
// ];
const routes: Routes = [
  {
    path: '',
    component: SqlLightTranPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SuperTabsModule,
/*     PendingTabPageModule,
    ExecutedTabPageModule */
  ],
  // exports: [RouterModule],
  declarations: [],
  entryComponents: []
})
export class SqlLightTranPageModule {}
