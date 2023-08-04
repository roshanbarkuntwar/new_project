import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';

@Component({
  selector: 'app-frame-addon',
  templateUrl: './frame-addon.component.html',
  styleUrls: ['./frame-addon.component.scss'],
})
export class FrameAddonComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() sessionObj: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  userDetails: any;
  showFrame: boolean = false;
  addonPram: any = [];
  TOTAL_AMT: any;
  loading: boolean = false;
  developerModeData: any;
  // sessionObj: any;
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService,public loadingController: LoadingController,public modalController: ModalController) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }
  ngOnInit() {
    console.log(this.sessionObj)
    let keys
    if (this.sessionObj) {
      keys = Object.keys(this.sessionObj);  // returns ["person", "age"]

    }

    for (let itemGroup of this.frame.Level4) {
      itemGroup.groupCol = [];
      if (itemGroup.design_control_type) {
        itemGroup.groupCol = itemGroup.design_control_type.split('-')
      }
      for (let item of itemGroup.Level5) {
        if (keys.indexOf(item.item_name) > -1) {
          item.value = this.sessionObj[item.item_name];
        }
      }
    }



    this.frame.tableRows = [];
    this.frame.tableRows[0] = this.frame.Level4;
  
    this.getData();
    

  }


  getData() {
    //this.globalObjects.ShowLoadingNew();
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
 
      
      let data: any = res;
      if (data.responseStatus == "success") {

          // Developer Mode Loging
          let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
          let wsSewId = id ? data.responseData.Values[0][id] : "";
          this.developerModeData = {
            ws_seq_id: wsSewId,
            frame_seq_id: reqData.wscp.apps_page_frame_seqid
          }
          //Developer Mode Loging

        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1[0];
        let count = 1;
        for (let i = 1; i < 20; i++) {
          let addon = {};
          if (tableData["ADDONNAME" + i]) {
            addon["ADDONNAME" + i] = tableData["ADDONNAME" + i];
            addon["AFCODE" + i] = tableData["AFCODE" + i];
            addon["AFRATE" + i] = tableData["AFRATE" + i];
            addon["AFRATEI" + i] = tableData["AFRATEI" + i];
            addon["AFRATEIDESC" + i] = tableData["AFRATEIDESC" + i];
            addon["AFLOGIC" + i] = tableData["AFLOGIC" + i];
            addon["AFIELD" + i] = "";
            this.addonPram.push(addon)
            count++;
          }
        }
        this.TOTAL_AMT = tableData.TOTAL_AMT;
        this.globalObjects.hideLoadingNew();
        console.log(this.addonPram);
        console.log(this.TOTAL_AMT);

      // vijay

        this.getAddOnValue();
      }
      this.showFrame = true;

    }).catch(err => {
      console.log("this.frame canvas err");
      this.showFrame = true;
      this.globalObjects.hideLoadingNew();
      this.globalObjects.presentToast("1.1 Something went wrong please try again later!");
      console.log(err);
    })
  }


  getAddOnValue() {
    //this.globalObjects.ShowLoadingNew();
    let wscp: any = {};
    wscp.service_type = "getAddOnValue";
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": []
    }

    
    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      
      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);

        if (objData.Level1[0].status == "F") {
          this.globalObjects.presentAlert(objData.Level1[0].message)
        }
        else if (objData.Level1[0].status == "Q") {
          this.globalObjects.presentAlert(objData.Level1[0].message);
        }
        

        let tableData = objData.Level1[0];
        let i = 1;
        for (let addon of this.addonPram) {
          addon["AFIELD" + i] = tableData["AFIELD" + i];
          i = i + 1;
        }
        this.TOTAL_AMT = tableData.DRAMT;
      }
     // this.globalObjects.hideLoadingNew();
    }).catch(err => {
      this.globalObjects.hideLoadingNew();
      this.globalObjects.presentToast("1.2 Something went wrong please try again later!");
      console.log(err);
    })
  }

  // 
  refreshAddon() {
  
   // this.globalObjects.ShowLoadingNew();
    let wscp: any = {};
    wscp.service_type = "updateAddonFeilds";
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    // let wsdp = [];
    // let dp = {};
    // for (let addon of this.addonPram) {
    //   for (let key in addon) {
    //     if ((key.indexOf("AFIELD") > -1) || (key.indexOf("AFRATE") > -1)) {
    //       dp[key] = addon[key];
    //     }
    //   }
    // }
    // wsdp.push(dp)

    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.addonPram
    }

    console.log(reqData);

   

    let l_url = "S2U";
   // this.loading = true;
   
    this.dataService.postData(l_url, reqData).then(res => {
     
      this.globalObjects.hideLoadingNew();
      let data: any = res;
      if (data.responseStatus == "success") {
        // this.getAddOnValue();

        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1[0];
        let i = 1;
        for (let addon of this.addonPram) {
          addon["AFIELD" + i] = tableData["AFIELD" + i];
          i = i + 1;
        }
        this.TOTAL_AMT = tableData.DRAMT;
      
      
      }
    }).catch(err => {
      this.globalObjects.hideLoadingNew();
      this.globalObjects.presentToast("1.3 Something went wrong please try again later!");
      
      console.log(err);
    })
  }


  itemClicked(event) {
    event.click_events_str = "CLOSE_PAGE"
    this.emitPass.emit(event);
  }

  saveByProcedure() {
    //this.globalObjects.ShowLoadingNew();
    let wscp: any = {};
    wscp.service_type = "insertProcessWebData";
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    let wsdp = [];

    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": wsdp
    }

    console.log(reqData);

    

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
       this.globalObjects.hideLoadingNew();
      let data: any = res;
      if (data.responseStatus == "success") {

        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1[0];
        if (tableData.vrno) {
          let msg = tableData.vrno.split("#");
          if (msg[0] == "T") {
            this.globalObjects.presentAlert("Data saved sucessfully VRNO : " + msg[1])
          } else {
            this.globalObjects.presentAlert(msg[1])
          }

        }
        this.itemClicked(data.responseData);
      }

    }).catch(err => {
       this.globalObjects.hideLoadingNew();
      this.globalObjects.presentToast("1.4 Something went wrong please try again later!");
      console.log(err);
    })
  }

  buttonClick() {
  }


  itemValueChange(event, rowindex) {
    // this.wsdp = [];

    if (this.frame.tableRows) {
      let col = {};
      for (let itemGroup of this.frame.tableRows[rowindex]) {
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
      this.wsdp.push(col);
    }
    // console.log(event.wsdp);
    this.addonPram = [];
    this.getData();

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
