import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-text-band4',
  templateUrl: './text-band4.component.html',
  styleUrls: ['./text-band4.component.scss'],
})


export class TextBand4Component implements OnInit {
  @Input() itemInput: any;
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  num:number;
  textbandcolor:any;

  constructor(public globalobject:GlobalObjectsService) {
    // alert("in textband")
    this.num= this.globalobject.colorcount;
    console.log("colorcount...",this.num);
  }
  
    
  
  ngOnInit() { 
    
   console.log("iteminput in textband4...",this.itemInput)   
  }
  itemClick(event) {
    this.emitPass.emit(this.itemInput);
  }


  
    // isOdd(num) {
    //    return num % 2;
    //    console.log("1 is " + isOdd(1));
    // console.log("2 is " + isOdd(2));
    // console.log("3 is " + isOdd(3));
    // console.log("4 is " + isOdd(4));
    //   }
    
  

}