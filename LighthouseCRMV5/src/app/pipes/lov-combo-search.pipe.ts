import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lovComboSearch'
})
export class LovComboSearchPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      // console.log("it is it",it)
      for (let k in it) {
        if (it[k]) {
          if (it[k].toString().toLowerCase().includes(searchText)) {
            return it
          }
        }
      }
    });
  }

}
