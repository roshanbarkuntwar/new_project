import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-column-count',
  templateUrl: './column-count.component.html',
  styleUrls: ['./column-count.component.scss'],
})
export class ColumnCountComponent implements OnInit {

  @Input() colCount: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  itemClick(event) {
    console.log(this.colCount)
    this.emitPass.emit(this.colCount);
  }

}
