import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
})
export class NumberInputComponent implements OnInit {
  @Input() numberinput: any;
  @Input() frame_type: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();

  current_page_parameter: any = {};
  hasFired = false;
  constructor(private globalObjects: GlobalObjectsService, private cdr: ChangeDetectorRef,) {
  }

  ngOnInit() {

    if (this.numberinput.data_required_flag != 'F') {
      if (this.numberinput.value) {
        this.numberinput.isValid = true;
      } else {
        this.numberinput.isValid = false;
      }
    }

    this.current_page_parameter = this.globalObjects.current_page_parameter;
  }

  onBlur(onChange, numberInputname) {
    if (!this.hasFired) {
      this.hasFired = true;
      this.numberinput.blurValue = this.numberinput.value;
      this.emitOnChange.emit(this.numberinput)
    }
  }

  onChange(item) {
    this.hasFired = false;
    if (item.item_size) {
      this.cdr.detectChanges();
      if (item.value) {
        let val = item.value.toString();
        if (val.indexOf(".") > -1) {
          let decVal = val.split(".")[0];
          if (decVal.length > item.item_size) {
            decVal = decVal.slice(0, item.item_size);
            val = decVal + '.' + val.split(".")[1]
          }
        } else {
          if (val.length > item.item_size) {
            val = val.slice(0, item.item_size);
          }
        }
        item.value = parseFloat(val);
      }
    }

  }


  cleardata() {
    this.numberinput.value = "";
  }

  validateNumber(beforeDecimal: any, afterDecimal: any, itemValue) {
    if (itemValue) {
      beforeDecimal = beforeDecimal ? beforeDecimal : 0;
      afterDecimal = afterDecimal ? afterDecimal : 0;
      let preDecimal = itemValue.toString().split(".")[0];
      let postDecimal = itemValue.toString().split(".")[1];
      // if (preDecimal.length > beforeDecimal || postDecimal.length > afterDecimal) {
      //   alert("please input data as Proper format");
      //   let numberStr: string = (this.numberinput.value).toString();
      //   let finalStr = numberStr.substring(0, numberStr.length - 1);
      //   this.numberinput.value = finalStr.trim();
      //   console.log(this.numberinput.value);
      // }
    }
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
