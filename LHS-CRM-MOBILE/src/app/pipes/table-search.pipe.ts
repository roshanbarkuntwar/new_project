import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableSearch'
})
export class TableSearchPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    console.log(items);
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      // console.log("it is it",it)
      for (let array of it) {
        // console.log("array1",array)
        if (array.Level5) {
          for (let array2 of array.Level5) {
            if (array2.item_visible_flag=='T' && array2.value && array2.value.toLowerCase().includes(searchText)) {
              return array2;
            }
          }
        }
        else {
          for (let array2 of array) {
            if (array2.value && array2.value.toLowerCase().includes(searchText)) {
              return array2
              ;
            }
          }
        }

      }
    });
  }

}
