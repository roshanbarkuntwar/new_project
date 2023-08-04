import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sub-select-input',
  templateUrl: './sub-select-input.component.html',
  styleUrls: ['./sub-select-input.component.scss'],
})
export class SubSelectInputComponent implements OnInit {
@Input() subselect:any;
@Output() emitPass: EventEmitter<any> = new EventEmitter<any>(); 
  constructor() { }
  // mobInterface: boolean = true;
  // interfaceopt1 = "action-sheet";
  // interfaceopt2 = "popover";
  
    customActionSheetOptions: any = {  
      header: 'Select Options',  
      cssClass: 'my-custom-class',
    };  
  ngOnInit() {}

}
