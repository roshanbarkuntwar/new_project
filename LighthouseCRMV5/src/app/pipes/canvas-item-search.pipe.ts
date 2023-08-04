import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canvasItemSearch'
})
export class CanvasItemSearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if(!args)return value;

    args = args.toLowerCase();

    return value.filter(function(item){
     
      for(let x of item.Level5){
       if(JSON.stringify(x.prompt_name).toLowerCase().includes(args) || 
          (item.value ? JSON.stringify(x.value).toLowerCase().includes(args) : "")) {
         return item;
       }
      }
       
    });
  }

}
