import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DeveloperModeLogPage } from './developer-mode-log.page';
import { HttpClientModule } from '@angular/common/http';
// import { GlobalObjectsService } from 'src/app/services/global-objects.service';


const routes: Routes = [
  {
    path: '',
    component: DeveloperModeLogPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    RouterModule.forChild(routes),

  ],
  providers: [],
  declarations: []
})
export class DeveloperModeLogPageModule {}
