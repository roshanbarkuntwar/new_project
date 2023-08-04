import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sliding-list',
  templateUrl: './sliding-list.component.html',
  styleUrls: ['./sliding-list.component.scss'],
})
export class SlidingListComponent implements OnInit {
  @Input() slidelist: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  wsdp: any = [{}];
  frame: any = {};
  newsData: any = [];
  constructor() { }


  ngOnInit() {
    if (this.slidelist.value) {
      this.newsData = this.slidelist.value.split("~");
    }
  }
  itemClick(event) {
    this.emitPass.emit(this.slidelist);
  }

  buttonClick(event) {
    this.emitPass.emit(this.slidelist);
  }

}
