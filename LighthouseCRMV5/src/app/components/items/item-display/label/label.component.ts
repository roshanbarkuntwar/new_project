import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class LabelComponent implements OnInit {
  @Input() labelInput: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  displysettingstr:any;
  constructor() { }

  ngOnInit() {
    // console.log(this.labelInput);
    /* if(this.labelInput.display_setting_str){
    this.displysettingstr = JSON.parse(this.)
    } */
  }

  itemClick(event) {
    this.emitPass.emit(this.labelInput);
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
