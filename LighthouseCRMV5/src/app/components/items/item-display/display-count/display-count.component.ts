import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-display-count',
  templateUrl: './display-count.component.html',
  styleUrls: ['./display-count.component.scss'],
})
export class DisplayCountComponent implements OnInit {

  @Input() dispCount: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  itemClick(event) {
    this.emitPass.emit(this.dispCount);
  }

  getParsedJson(json) {
    try {
      if (json) {
        return JSON.parse(json)
      } else {
        return {}
      }
    } catch (err) {
      if (typeof json == 'object') {
        return json;
      } else {
        return {}
      }
    }
  }

}
