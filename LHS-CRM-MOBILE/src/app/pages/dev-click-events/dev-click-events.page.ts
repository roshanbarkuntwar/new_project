import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { DevObjFrameListPage } from '../dev-obj-frame-list/dev-obj-frame-list.page';
import { OverlayEventDetail } from '@ionic/core';
@Component({
  selector: 'app-dev-click-events',
  templateUrl: './dev-click-events.page.html',
  styleUrls: ['./dev-click-events.page.scss'],
})
export class DevClickEventsPage implements OnInit {
  @Input() value: any;
  itemData: any = [];
  clickStr: any = "";
  itemsEventStr: any = [];
  itemsEventStrInput: any = [];
  constructor(public popOverCtrl: PopoverController, private dataServ: DataService) { }

  ngOnInit() {
    console.log(this.value);
    this.clickStr = this.value.clickEventString;
    this.itemsEventStr = this.value.clickEventString.split("#");
    for (let obj of this.itemsEventStr) {
      this.itemsEventStrInput.push(obj == undefined ? "" : obj.split("~"));
    }
    this.getData();
  }

  getData() {
    this.dataServ.getDataDev("devClickEvent").then((res: any) => {
      if (res.responseStatus == 'success') {
        this.itemData = res.responseData;
        var i = 1 ;
        for (let data of this.itemData) {
          for (let eventStr of this.itemsEventStrInput) {
            for (let obj of eventStr) {
                if(data.click_event_str_code == obj){
                  data["flag"] = true;
                  var strInputString = this.itemsEventStr[i++].split(/~(.+)/)[1];
                  data["str"] = strInputString == undefined ? '' : "~"+strInputString;
                }
            }
          }
        }
      }
    })
  }

  popDismiss() {
    this.popOverCtrl.dismiss();
  }

  upArrowClick(index) {
    var up = index - 1;
    if (up == -1) {
      up = 0
    }
    var position = this.itemData[index];
    var upPositon = this.itemData[up];

    this.itemData[up] = position;
    this.itemData[index] = upPositon;
  }

  downArrowClick(index) {
    var down = index + 1
    var len = this.itemData.length;
    if (down >= len) {
      down = len - 1;
    }
    var position = this.itemData[index];
    var downPositon = this.itemData[down];

    this.itemData[down] = position;
    this.itemData[index] = downPositon;
  }

  generateStr() {
    this.clickStr = "";
    for (let d of this.itemData) {
      if (d.flag) {
        let strings = d.click_event_str_code + (d.str == undefined ? '' : d.str);
        this.clickStr = this.clickStr + "#" + strings;
      }
    }
    console.log(this.clickStr);
  }

  setClickEvent() {
    console.log(this.clickStr);
    this.popOverCtrl.dismiss(this.clickStr);
  }

  async getFrames(i) {
    if (this.itemData[i].str && this.itemData[i].str != undefined) {
      this.value["item"] = this.itemData[i].str;
    } else {
      this.value["item"] = '';
    }

    let popUp = await this.popOverCtrl.create({
      component: DevObjFrameListPage,
      componentProps: { "objCode": this.value },
      backdropDismiss: false
    });
    popUp.onDidDismiss().then((res: OverlayEventDetail) => {
      console.log(res);
      if ((res.role == 'backdrop') || !res.data) {
        if (res.data == '') {
          this.value["item"] = this.itemData[i].str;
          this.itemData[i].str = res.data;
        }
      } else {
        this.itemData[i].str = res.data;
      }
    })
    return await popUp.present();
  }
}
