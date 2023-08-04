import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { SearchfilterPipe } from '../../pipes/searchfilter.pipe';
import { IonicModule } from '@ionic/angular';

import { SingleSelectLovPage } from './single-select-lov.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';

// const routes: Routes = [
//   {
//     path: '',
//     component: SingleSelectLovPage
//   }
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,PipesModule,
    //RouterModule.forChild(routes)
  ],
  declarations: [SingleSelectLovPage],
  entryComponents: [
    SingleSelectLovPage
  ],
  providers: [ SearchfilterPipe ]
})
export class SingleSelectLovPageModule {}
