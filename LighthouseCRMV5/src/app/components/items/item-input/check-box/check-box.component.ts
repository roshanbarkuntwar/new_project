import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
})
export class CheckBoxComponent implements OnInit {
  @Input() checkBox: any = {};
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  // checkBoxVal: any ;
  constructor() { }

  ngOnInit() {
   
   }

  itemClick(event) {
   
  //  console.log(this.checkBoxVal);
    // console.log(event);
    this.checkBox.isValid = this.checkBox.isChecked;
    if (!this.checkBox.isChecked) {
      this.checkBox.isValid = true;
      this.checkBox.value = "Y";
      
    } else {
      this.checkBox.isValid = false;
      this.checkBox.value = "N";
    }
    console.log(this.checkBox);
    this.emitPass.emit(this.checkBox);
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
