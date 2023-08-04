import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PipesModule } from 'src/app/pipes/pipes.module';



const routes: Routes = [
  {
    path: ''
    // component: MultiLevelTabPage
  }
];

@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),PipesModule ],
  // declarations: [MultiLevelTabPage]
   declarations: [],
   exports: [
    
]
})
export class MultiLevelTabPageModule {}
