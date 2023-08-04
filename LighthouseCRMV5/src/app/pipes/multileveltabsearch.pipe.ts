import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multileveltabsearch'
})
export class MultileveltabsearchPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it=>  {
      // console.log("it is it",it)
             for(let x in it){
               if(it.key && (it.key).toLowerCase().includes(searchText)){
                 return it;
           }  
             }
    });
  }

}
