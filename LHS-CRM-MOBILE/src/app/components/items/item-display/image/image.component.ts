import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {

  //  @Input() displayPhoto: any;
  //  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
    // console.log("this.querydata",this.displayPhoto);
  }
 
  itemClick(event) {
    // this.emitPass.emit(this.displayPhoto);
  }

  
}