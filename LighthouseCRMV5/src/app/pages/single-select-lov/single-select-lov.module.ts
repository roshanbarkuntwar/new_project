import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleSelectLovPageRoutingModule } from './single-select-lov-routing.module';

import { SingleSelectLovPage } from './single-select-lov.page';

import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleSelectLovPageRoutingModule,
    PipesModule
  ],
  declarations: [SingleSelectLovPage],
  entryComponents: [
    SingleSelectLovPage
  ],
  providers: [ SearchfilterPipe ]
})
export class SingleSelectLovPageModule {}
