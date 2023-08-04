import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frame-multilevel-table',
  templateUrl: './frame-multilevel-table.component.html',
  styleUrls: ['./frame-multilevel-table.component.scss'],
})
export class FrameMultilevelTableComponent implements OnInit {
  isShown: boolean = false ; // hidden by default
  isShown1: boolean = false ;
  isShown2: boolean = false ;
  constructor() { }

  ngOnInit() {}
 


  toggleShow() {
  
  this.isShown = ! this.isShown;
  }  
  toggleShow1() {
  
    this.isShown1 = ! this.isShown1;
    } 
    toggleShow2() {
  
      this.isShown2 = ! this.isShown2;
      }  
}
