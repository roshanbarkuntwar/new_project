import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { SingleSelectLovPage } from 'src/app/pages/single-select-lov/single-select-lov.page';

@Component({
  selector: 'app-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss'],
})
export class RangeFilterComponent implements OnInit {
  range: number = 50;
  @Input() itemData:any;
  @Input() rFilter: any;
 
  @Input() frame_type: any;
  @Input() framedata:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() parentComponent: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  wscp: any = {};
  userDetails:any;
  Vlength: number;
  
  
  current_page_parameter: any = {};
  constructor(private globalObjects: GlobalObjectsService,  public dataService: DataService,public modalCtrl: ModalController) {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
   }

  ngOnInit() {
    console.log("this is rangeFilter calling",this.rFilter);
    this.getrangedata();
  }
  itemClicked(event) {
    this.emitPass.emit(this.rFilter);
  }
  getrangedata(){
    let wsdp = [];
    console.log(this.rFilter)
    if (this.rFilter.item_enable_flag && (!(this.rFilter.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.rFilter.item_enable_flag == 'F'))) {
      return false;
    } else {
    
      let col = {};
      if (this.parentComponent.frame.tableRows) {
        for (let itemGroup of this.parentComponent.frame.tableRows[0]) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues
              } else {
                col[item.apps_item_seqid] = item.value
              }
            }
          }
        }
      } else {
        for (let itemGroup of this.parentComponent.frame) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues
              } else {
                col[item.apps_item_seqid] = item.value
              }
            }
          }
        }
      }
      wsdp.push(col);
    }
    this.getPageInfo(wsdp) 
  }
  


  getPageInfo(wsdp) {
    this.globalObjects.showLoading();
    this.wscp.service_type = "get_lov_data";
    this.wscp.apps_page_no = this.rFilter.apps_page_no;
    this.wscp.apps_page_frame_seqid = this.rFilter.apps_page_frame_seqid;
    this.wscp.apps_item_seqid = this.rFilter.apps_item_seqid;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.userDetails["object_code"] = this.rFilter.object_code;
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": this.wscp,
      "wsdp": wsdp
    }
    // reqData.wsdp = [
    //   {
    //     "apps_item_seqid": "1",
    //     "itemType": "TEXT",
    //     "itemDefaultValue": "Y~Yes#N~No"
    //   }];
    this.dataService.postData("S2U", reqData).then(res => {
      
      this.globalObjects.hideLoading();
      let data: any = res;
      console.log("data in rangefilter",res);
      // if (data.responseStatus == "success") {
      //   this.object_arr = data.responseData
      //   let objData = this.globalObjects.setPageInfo(data.responseData);
      //   this.objectList = objData.Level1;
      //   this.Object_code = objData.Level1[0];
      //   delete this.Object_code['Level2'];
      //   // this.objectList = this.object_arr.Level1;
      //   for (let code in this.Object_code) {
      //     this.keyList.push(code);
      //   }
      // }
    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("4 Something went wrong please try again later!");
    })
  }


  
  async openLov() {
    var data = { message: 'hello world' };
    // if (this.lovinput.item_enable_flag == '') {
    if (this.rFilter.item_enable_flag && (!(this.rFilter.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.rFilter.item_enable_flag == 'F'))) {
      return false;
    } else {
      let wsdp = [];
      let col = {};
      if (this.parentComponent.frame.tableRows) {
        for (let itemGroup of this.parentComponent.frame.tableRows[0]) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues
              } else {
                col[item.apps_item_seqid] = item.value
              }
            }
          }
        }
      } else {
        for (let itemGroup of this.parentComponent.frame) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues
              } else {
                col[item.apps_item_seqid] = item.value
              }
            }
          }
        }
      }
      wsdp.push(col);
      // console.log(wsdp)

      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: SingleSelectLovPage,
          componentProps: { paramValue: this.rFilter, wsdp: wsdp, prompt_name: this.rFilter.prompt_name }
        });
      modal.onDidDismiss().then((detail: OverlayEventDetail) => {
        if (detail) {
          // console.log('The result:', detail.data);
          this.rFilter.codeOfValues = detail.data.codeOfValues;
          this.rFilter.value = detail.data.value;
        }
      });
      await modal.present();
    }

    console.log("sidelist sfilter lov value",this.rFilter);
  }

}
