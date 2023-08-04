import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    // if(!value)return null;
    if(!args)return value;

    args = args.toLowerCase();

    return value.filter(function(item){
     
      for(let x in item){
       if(JSON.stringify(item[x]).toLowerCase().includes(args)) {
         return item;
       }
      }
       
    });
}

}
