import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-para-text',
  templateUrl: './para-text.component.html',
  styleUrls: ['./para-text.component.scss'],
})
export class ParaTextComponent implements OnInit {
  @Input() itemInput: any;
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();

  obj: any = { "text-align": "right" };
  obj2: any = { "text-align": "center" };

  tableValue:any;

  constructor() { }

  ngOnInit() {
   // console.log(this.itemInput.value.length);
   this.tableValue = this.itemInput.value;
    let obj = this.itemInput.display_setting_str;
    if (this.itemInput.datatype == 'NUMBER') {
      if(this.itemInput.value && this.itemInput.format_mask && !isNaN(parseFloat(this.itemInput.value))){
        let mask = this.itemInput.format_mask.split(",");
        let str = "";
        let val = "";
        let i = 0;
        let value = this.itemInput.value;
        if(value.indexOf(".") > -1){
          value = value.split(".")[0];
        }
        let itmLen = value.length;
        for(let m of mask){
          i++
          if(itmLen > 0){
            let num = mask[mask.length - i].length;
            if(itmLen < mask[mask.length - i].length){
              num = itmLen;
            }
            str =  "(\\d{"+ num +"})" + str;
            if(val == ""){
              val = val + '$'+i;
            }else{
              val = val + ','+'$'+i;
            }
            itmLen = itmLen - mask[mask.length - i].length;
          }
        }
        let finalStr = '/'+str+'/'

        if(this.itemInput.value.indexOf(".") > -1){
          let temp = value.replace(eval(finalStr),val);
          this.tableValue = temp + '.' + this.itemInput.value.split(".")[1];
        }else{
          this.tableValue = this.itemInput.value.replace(eval(finalStr),val);
        }
        this.itemInput.value = this.tableValue;
      }

      if (obj && obj["text-align"]) {
      } else {
        if (obj) {
          obj["text-align"] = "right";
        } else {
          obj = this.obj;
        }
      }
      this.itemInput.display_setting_str = obj;
    }
    if (this.itemInput.datatype == 'DATETIME') {
      if (obj && obj["text-align"]) {
      } else {
        if (obj) {
          obj["text-align"] = "cenetr";
        } else {
          obj = this.obj2;
        }
      }
      this.itemInput.display_setting_str = obj;
    }

  }



  itemClick(event) {
    this.emitPass.emit(this.itemInput);
  }
  valueChange(event) {
    this.emitOnChange.emit(this.itemInput);
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
