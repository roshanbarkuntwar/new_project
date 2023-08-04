
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { BackgroundService } from 'src/app/services/background.service';
import { PopoverController } from '@ionic/angular';
import { TextAreaPage } from 'src/app/pages/text-area/text-area.page';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements OnInit {
  @Input() textinput: any;
  @Input() frame_type: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  autoPolulateText: any[] = [];
  autoPolulateText1 = ['tte', 'ttr', 'ttw'];
  current_page_parameter: any = {};
  itemval: any;
  hasFired = false;
  constructor(private globalObjects: GlobalObjectsService,
     public popOverCtrl: PopoverController, private backgroundservice: BackgroundService) { }



     
  ishover(e) {
    if (e.click_events_str) {
      return true;
    } else {
      return false;
    }
  }


  ngOnInit() {

    if (this.textinput.data_required_flag != 'F') {
      if (this.textinput.value) {
        this.textinput.isValid = true;
      } else {
        this.textinput.isValid = false;
      }
    }

    this.current_page_parameter = this.globalObjects.current_page_parameter;
    // if (this.textinput.item_default_value=='LATITUDE') {
    //   this.textinput.value = this.backgroundservice.latitude ;
    // }
    // if (this.textinput.item_default_value=='LONGITUDE') {
    //   this.textinput.value = this.backgroundservice.longitude ;
    // }
    if (this.textinput.item_sub_type_child == 'UPPER') {
      let val = new RegExp(/^[A-Z]+$/);
      this.textinput.input_pattern = val;
      this.textinput.tool_tip = "Only Uppercase";
    }
    if (this.textinput.item_sub_type_child == 'LOWER') {
      let val = new RegExp(/^[a-z]+$/);
      this.textinput.input_pattern = val;
      this.textinput.tool_tip = "Only Lowercase Allowed";
    }
    if (this.textinput.item_sub_type_child == 'PHONE') {
      let val = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
      this.textinput.input_pattern = val;
      this.textinput.tool_tip = "Invalid phone number";
    }
    if (this.textinput.item_sub_type_child == 'EMAIL') {
      let val = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      this.textinput.input_pattern = val;
      this.textinput.tool_tip = "Invalid Email address";
    }
    if (this.textinput.item_sub_type == 'TEXT_BOX') {
      this.itemval = this.textinput.value;
      setTimeout(() => {
        document.getElementById("mailbody").addEventListener("keyup", () => {
          this.textinput.value = document.getElementById("mailbody").innerHTML;
          // alert()
        });
      }, 1000)
    }



  }



  onBlur(onChange) {
    if (!this.hasFired) {
      this.hasFired = true;
      var changeValue = this.getParsedJson(this.textinput.display_setting_str);
      console.log(JSON.stringify(changeValue));
      if (changeValue["text-transform"]) {
        if (changeValue["text-transform"] == 'uppercase') {
          this.textinput.value = (this.textinput.value).toUpperCase();
        } if (changeValue["text-transform"] == 'lowercase') {
          this.textinput.value = (this.textinput.value).toLowerCase();
        }
      }

      let item_history = this.globalObjects.getLocallData("item_history");
      let key = this.textinput.item_name;
      if (item_history) {

        if (item_history[key]) {
          let data: any[] = item_history[key];
          let item = data.filter(item => {
            if (this.textinput.value.toLowerCase() === item.toLowerCase()) {
              return item;
            }
          });

          if (this.textinput.value != "" && this.textinput.value != null && item[0] == null || item[0] == "") {
            data.push(this.textinput.value);
          }
          console.log("keyyy:", item_history[key]);
          item_history[key] = data;
          this.globalObjects.setDataLocally("item_history", item_history);
        }
        else {
          let data: any[] = [];
          if (this.textinput.value != "" && this.textinput.value != null) {
            data.push(this.textinput.value);
          }
          item_history[key] = data;
          this.globalObjects.setDataLocally("item_history", item_history);
        }

      } else {
        if (this.textinput.value != "" && this.textinput.value != null) {
          let itemHistory = {};
          let data: any[] = [];
          data.push(this.textinput.value);
          itemHistory[key] = data;
          this.globalObjects.setDataLocally("item_history", itemHistory);
        }
      }


      this.textinput.blurValue = this.textinput.value;
      this.emitOnChange.emit(this.textinput)
    }
  }

  onChange() {
    this.hasFired = false;
  }

  autoPopulate(event) {
    let item_history = this.globalObjects.getLocallData("item_history");
    let key = this.textinput.item_name;
    if (item_history) {

      if (item_history[key]) {
        this.autoPolulateText = item_history[key];
        this.autoPolulateText = this.autoPolulateText.filter(item => {
          if (item.toLowerCase().includes(event.target.value.toLowerCase())) {
            return item;
          }
        })
      }

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

  inputType = 'password';
  iconName = 'eye-off';

  hideShowPassword() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
    this.iconName = this.iconName === 'eye-off' ? 'eye' : 'eye-off';
  }

  doubleClickFun(event) {
    if (this.textinput.item_sub_type == 'TEXT_BOX_POPUP') {
      this.openPop(event)
    }
  }

  async openPop(ev: any) {
    const popover = await this.popOverCtrl.create({
      component: TextAreaPage,
      cssClass: 'my-custom-class',
      componentProps: { value: this.textinput.value },

      backdropDismiss: false,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then(res => {
      this.textinput.value = res.data.value;
    })
    // const { role } = await (await popover.onDidDismiss())
    //  console.log('onDidDismiss resolved with role', role);

  }
}
