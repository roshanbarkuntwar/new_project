import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-frame-sub-select',
  templateUrl: './frame-sub-select.component.html',
  styleUrls: ['./frame-sub-select.component.scss'],
})
export class FrameSubSelectComponent implements OnInit {
  
// data:any[]=[];
//   constructor(public platform:Platform ) {
//     this.platform.ready().then(()=>{
//       this.data=[{id:1,name:"value1"},{id:2,name:"value2"},{id:3,name:"value3"},{id:3,name:"value4"}]

//     })
//   }
mobInterface: boolean = true;
interfaceopt1 = "action-sheet";
interfaceopt2 = "popover";

  customActionSheetOptions: any = {  
    header: 'Select Options',  
    cssClass: 'my-custom-class',
  };  
 ngOnInit() {}

}
