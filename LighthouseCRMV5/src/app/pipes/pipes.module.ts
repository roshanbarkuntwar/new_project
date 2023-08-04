import { NgModule } from '@angular/core';

import { TableSearchPipe } from './table-search.pipe';
import { SearchfilterPipe } from './searchfilter.pipe';
import { MultileveltabsearchPipe } from './multileveltabsearch.pipe';
import { ApexSearchPipe } from './apex-search.pipe';
import { CanvasItemSearchPipe } from './canvas-item-search.pipe';
import { LovComboSearchPipe } from './lov-combo-search.pipe';


@NgModule({
  declarations: [TableSearchPipe,SearchfilterPipe, MultileveltabsearchPipe,ApexSearchPipe, CanvasItemSearchPipe, LovComboSearchPipe],
  imports: [
    
  ],
  exports:[TableSearchPipe,SearchfilterPipe,MultileveltabsearchPipe,ApexSearchPipe,CanvasItemSearchPipe,LovComboSearchPipe]
})
export class PipesModule { }
