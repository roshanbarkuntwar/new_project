import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-frame-terms-conditions',
  templateUrl: './frame-terms-conditions.component.html',
  styleUrls: ['./frame-terms-conditions.component.scss'],
})
export class FrameTermsConditionsComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  developerModeData: any;
  userDetails: any;
  showFrame: boolean = false;
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, public modalController: ModalController) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    for (let itemGroup of this.frame.Level4) {
      itemGroup.groupCol = [];
      if (itemGroup.design_control_type) {
        itemGroup.groupCol = itemGroup.design_control_type.split('-')
      }
    }
    this.frame.tableRows = [];
    this.frame.tableRows[0] = this.frame.Level4;
    this.getData();
  }


  getData() {
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = String(1);
    wscp.to_row = String(10);
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;

    if (this.wscp_send_input.prev_ws_seqid) {
      wscp.prev_ws_seqid = this.wscp_send_input.prev_ws_seqid;
    }

    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
      this.globalObjects.hideLoading();
      let data: any = res;
      if (data.responseStatus == "success") {
        // Start-------------------------------- 

          // Developer Mode Loging
          if(data.responseData.Level1_Keys && data.responseData.Level1_Keys.length > 0){
            let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
            let wsSewId = id ? data.responseData.Values[0][id] : "";
            this.developerModeData = {
              ws_seq_id: wsSewId,
              frame_seq_id: reqData.wscp.apps_page_frame_seqid
            }
          }
          //Developer Mode Loging

        let strArr = [];
        let strArrVal = {};
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;

        if ((objData.Level1.length > 0) && objData.Level1[0].status == "F") {
          this.globalObjects.presentAlert(objData.Level1[0].message)
        }
        else if ((objData.Level1.length > 0) && objData.Level1[0].status == "Q") {
          this.globalObjects.presentAlert(objData.Level1[0].message);
        }

        let tableKey = [];
        if (tableData.length > 0) {
          tableKey = Object.keys(tableData[0]);
        }
     

        for (let Level1 of objData.Level1) {
          let level1Str: any = JSON.parse(JSON.stringify(Level1));
          if (Level1.STR) {
            var str = JSON.parse(JSON.stringify(Level1.STR.split('@')));
            let count = 0;
            for (let arr of str) {
              if (arr.split('~')[0]) {
                strArrVal[("STR" + count)] = arr.split('~')[1];
                strArr.push(arr.split('~')[0]);
              }
              count = count + 1;
            }
          }
        }
        //mid End-------------------------------- 
        let tableRows = [];

        let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
        for (let Level4 of frameLevel4) {
          for (let leve5 of Level4.Level5) {
            let count = 1;
            if (leve5.item_name == "STR") {
              for (let add of strArr) {
                let leve55 = JSON.parse(JSON.stringify(leve5));
                leve55.item_name = ("STR" + count);
                leve55.apps_item_seqid = ("IRFIELD" + count);
                leve55.prompt_name = add;
                leve55.item_visible_flag = 'T';
                leve55.value = strArrVal[leve55.item_name];
                Level4.Level5.push(leve55);
                count = count + 1;
              }
            }
            else if(leve5.item_name == 'PREV_WS_SEQID'){
              leve5.value = this.wscp_send_input.prev_ws_seqid;
            }else{
              for (let key of tableKey) {
                if ((leve5.item_name) && (leve5.item_name.toUpperCase() == key.toUpperCase())) {
                  leve5.value = tableData[0][key];
                }
              }
            }
          }
        }
        tableRows.push(frameLevel4);
        this.frame.tableRows = tableRows;

        //------------------------------
        //end end--------------------

        // let tableRows = [];
        // let objData = this.globalObjects.setPageInfo(data.responseData);
        // let tableData = objData.Level1;
        // let tableKey = Object.keys(tableData[0])

        // for (let table of tableData) {
        //   let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
        //   for (let itemGroup of frameLevel4) {
        //     for (let item of itemGroup.Level5) {
        //       for (let key of tableKey) {
        //         if (item.item_name.toUpperCase() == key.toUpperCase()) {
        //           item.value = table[key]
        //         }
        //       }
        //     }
        //   }
        //   tableRows.push(frameLevel4);
        // }
        // this.frame.tableRows = tableRows;
      }
      
      this.showFrame = true;

    }).catch(err => {
      console.log("this.frame TERMS err");
      this.showFrame = true;
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.12 Something went wrong please try again later!");
      console.log(err);
    })
  }


  itemClicked(event, rowindex) {
    console.log("itemClicked vijay frame-TERMSe.comonent.ts -->", event);
    if (event.click_events_str == "ADD_ITEM") {

      let col = {};
      for (let itemGroup of this.frame.Level4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            col[item.item_name] = JSON.stringify(item.value);
            item.value = "";
          }
        }
      }
      event.ADD_ITEM = col;
      this.emitPass.emit(event);
    } else {
      event.wsdp = [];
      if (this.frame.tableRows) {
        for (let framedata of this.frame.tableRows) {
          let col = {};
          for (let itemGroup of framedata) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                col[item.apps_item_seqid] = item.value
              }
            }
          }
          event.wsdp.push(col);
        }
        //--------------------------
        let wsdpcl = {};
        for (let itemGroup of this.frame.tableRows[rowindex]) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              wsdpcl[item.apps_item_seqid] = item.value
            }
          }
        }
        event.wsdpcl = [];
        event.wsdpcl.push(wsdpcl);
        //--------------------------
      } else {
        let col = {};
        for (let itemGroup of this.frame.Level4) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              col[item.apps_item_seqid] = item.value
            }
          }
        }
        event.wsdp.push(col);
      }
      event.sessionObj = this.sessionObj
      this.emitPass.emit(event);
    }
  }

  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData
      }
    });
    return await modal.present();
  }

}
