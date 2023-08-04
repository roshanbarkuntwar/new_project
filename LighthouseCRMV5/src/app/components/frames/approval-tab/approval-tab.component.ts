import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavParams, NavController, ModalController, AlertController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Router } from '@angular/router';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';

@Component({
  selector: 'app-approval-tab',
  templateUrl: './approval-tab.component.html',
  styleUrls: ['./approval-tab.component.scss'],
})
export class ApprovalTabComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() obj_mast:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  noRecordMessage: any;
  listLength: number;
  erpApprDetails: any = [];
  erpApprDetails2: any = [];
  pageinfo: any = {};
  id: number = 0;
  userDetails: any;
  object_mast: any = {};
  wslp: any = {};
  click_events_str;
  l_url = "S2U";
  object_arr: any;
  page_no: number = 0;
  flagforloader: boolean = false;
  l_approvalDetails: any = [];
  level55array = [];
  isModal: any;
  pageNo = 0;
  Details: any = [{ heading: "Sc No", values: "scy19y-20014", head2: "head2", val2: "val2" }, { heading: "Sc No", values: "scy19y-200154" }, { heading: "Sc No", values: "scy19y-200414" }, { heading: "Sc No", values: "scy19y-20014" }];
  items: any = [{ heading: "abc", values: "scy19y-20014" }];
  Add_No: any = [{ heading: "xyz", values: "scy19y-20014" }];
  TandC: any = [{ heading: "abc", values: "scy19y-20014" }];
  Attachment: any = [{ heading: "abcd", values: "123" }];

  hide_appr_buttons: boolean = false;
  whatsAppFlag: any = "M";
  footer: any = [];

  aprroveDataArr:any = [];

  dataStr = "";

  tableRows:any = [];
  developerModeData :any ;
  alertFlag : boolean = false;
  alertMsg :any;

  constructor(private dataService: DataService, private globalObjects: GlobalObjectsService, public modalCtrl: ModalController, public alertController: AlertController) {
    this.wslp = globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    this.getPageInfo();
      
      console.log(this.frame);
    

  }

  selectTab(i) {
    this.flagforloader = false;
    this.id = i;
    this.formatData(i);
    this.pageNo = i;
  }

  closeModal(flag) {
    this.modalCtrl.dismiss(flag);
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


  // getData1() {
  //   this.globalObjects.showLoading();
  //   let wscp = this.wscp;
  //   // wscp.service_type = this.frame.on_frame_load_str;
  //   if (this.wscp.click_events_str.indexOf('~') > -1) {
  //     let data = this.wscp.click_events_str.split('~');
  //     if (data.indexOf('hide_appr_buttons') > -1) {
  //       this.hide_appr_buttons = true;
  //     }
  //   }

  //   wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
  //   wscp.get_tab_count_pages = 'get_tab_count_pages';


  //   let locData: any = {};
  //   locData.wslp = this.wslp;
  //   locData.wscp = wscp;
  //   locData.wsdp = this.wsdp;


  //   this.dataService.postData(this.l_url, locData).then(res => {
  //     let resdata: any = res;
  //     // this.l_approvalDetails = resdata.responseData.Level1;
  //     this.globalObjects.hideLoading();
  //     let objData = this.globalObjects.setPageInfo(resdata.responseData);
  //     this.l_approvalDetails = objData.Level1;

  //     for (let item of this.l_approvalDetails) {
  //       this.erpApprDetails.push(item.APPS_PAGE_FRAME_NAME);
  //     }
  //     this.getFrameData(0);
  //   }).catch(err => {
  //     this.globalObjects.hideLoading();
  //     this.globalObjects.presentToast("get_tab_count_pages Something went wrong please try again later!");
  //     console.log(err);
  //   })
  // }


  getData() {
    this.globalObjects.showLoading();
    this.frame.apps_page_name = "";
    let wscp = this.wscp;
    if (this.wscp.click_events_str.indexOf('~') > -1) {
      let data = this.wscp.click_events_str.split('~');
      if (data.indexOf('hide_appr_buttons') > -1) {
        this.hide_appr_buttons = true;
      }
    }
    wscp.service_type = "APPROVAL_DETAIL";
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.get_tab_count_pages = 'get_tab_count_pages';
    let input_data = {
      "wslp": this.wslp,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    this.dataService.postData(this.l_url, input_data).then((res:any) => {

      let resdata: any = res;
      this.globalObjects.hideLoading();
      console.log(res);

      if (res.responseStatus == "success") {
        // Developer Mode Loging
        let id = res.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? res.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : res.responseData.Level1_Keys.indexOf("same_ws_seqid");
        let wsSewId = id ? res.responseData.Values[0][id] : "";
        this.developerModeData = {
          ws_seq_id: wsSewId,
          frame_seq_id: input_data.wscp.apps_page_frame_seqid
        }
        //Developer Mode Loging

        let objData = this.globalObjects.setPageInfo(resdata.responseData);

        if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
          this.globalObjects.presentAlert(objData.Level1[0].message);
        } else {
          let details = objData.Level1;
          for (let x of details) {
            if (x.frame_type == 'FOOTER') {

            } else {
              this.l_approvalDetails.push(x);
            }
          }
          for (let item of this.l_approvalDetails) {
            this.erpApprDetails.push(item.APPS_PAGE_FRAME_NAME);
          }
          this.getFrameData(0);
        }
      }
    }).catch(err => {
      console.log(' get_tab_count_pages Something went wrong please try again later!', err);
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("get_tab_count_pages Something went wrong please try again later!");
      console.log(err);
    })
  }



  setPageData(dataStr, index ) {
    //----------------------

    let addonArrvalue = [];
    let objData = eval(dataStr);
    for (let Level1 of objData) {
      let strA = Level1;
      let level1Str: any = JSON.parse(JSON.stringify(strA));
      if (strA.STR) {
        // ADDON: "Insurance~0@Freight~0@SGST~102524@UGST~@CGST~102524@IGST~0@TCS~0@Round off~0@
        var str = JSON.parse(JSON.stringify(strA.STR.split('@')));
        let count = 0;
        for (let arr of str) {
          if (arr.split('~')[0]) {
            level1Str[("STR" + count)] = arr.split('~')[1];
            let addonArr: any = {};
            addonArr.key = (arr.split('~')[0]);
            addonArr.value = (arr.split('~')[1]);
            addonArrvalue.push(addonArr);
          }
          count = count + 1;
        }
      }
      // if (this.l_approvalDetails[index].pageDetails) {
      //   this.l_approvalDetails[index].pageDetails.push(level1Str)
      // } else {
      //   this.l_approvalDetails[index].pageDetails = [];
      //   this.l_approvalDetails[index].pageDetails.push(level1Str)
      // }
      // addonArrvalue = level1Str;
    }

    //------------------------------

    let countfortable: number = 0;
    for (let Level2 of this.object_mast.Level2) {

      if (Level2.apps_page_no == this.l_approvalDetails[index].APPS_PAGE_NO) {
        for (let Level3 of Level2.Level3) {
          for (let Level4 of Level3.Level4) {
            for (let leve5 of Level4.Level5) {
              if (leve5.item_name == "STR") {
                let level55array = [];
                let count = 0;
                let myData = [];
                for (let x of addonArrvalue) {
                  let leve55 = JSON.parse(JSON.stringify(leve5));
                  // leve55.item_name = ("STR" + count);
                  leve55.value = x.value;
                  leve55.prompt_name = x.key;
                  leve55.item_visible_flag = 'T';
                  myData.push(leve55);
                }
                Level4.Level5 = JSON.parse(JSON.stringify(myData));
                level55array.push(Level4);

                this.level55array = JSON.parse(JSON.stringify(level55array));

                count = count + 1;

              }
            }
          }
        }
        if (countfortable === 0) {
           this.tableRows = []
          let tableRows = [];
          tableRows.push(this.level55array);

          this.tableRows = this.level55array;

          let framepage = this.frame.tableRows.find(y => y[0][0].apps_page_no == index + 1);

          if(framepage){
            framepage = tableRows
          }else{
            this.frame.tableRows.push(tableRows);
          }


         // this.frame.tableRows = this.level55array;

          this.level55array = [];
          countfortable = countfortable + 1;
        }

      }


    }
    //------------------------------


  }


  getPageInfo() {

    setTimeout(()=>{

      let objData = this.obj_mast;
      let objMast = [];

      for (let x of objData.Level2) {

        for (let y of x.Level3) {
          if (y.apps_frame_type == 'FOOTER') {
            this.footer.push(y)
            // console.log(this.footer[0].level4[0].level5[0]);
          } else {
            objMast.push(x);
          }
        }
      }
      this.object_mast.Level2 = objMast;
      this.getData();
    },50)      

  }

  //  getPageInfo() {
  //   return new Promise((resolve) => {
  //     this.globalObjects.showLoading();
  //     let wscp = JSON.parse(JSON.stringify(this.wscp));
  //     wscp.service_type = "get_object_config";
  //     let reqData: any = {};
  //     reqData = {
  //       "wslp": this.wslp,
  //       "wscp": wscp,
  //       "wsdp": this.wsdp
  //     }

  //     // let l_url =;
  //     this.dataService.postData("S2U", reqData).then(res => {
  //       this.globalObjects.hideLoading();
  //       let data: any = res;
  //       if (data.responseStatus == "success") {
  //         this.object_arr = data.responseData
  //         // this.Object_mast = this.object_arr.Level1[0].Level2[this.page_no];
  //         resolve("success");
  //         // /----------------------

  //         let objData = this.globalObjects.setPageInfo(data.responseData);
  //         let objMast = [];

  //         for (let x of objData.Level1[0].Level2) {

  //           for (let y of x.Level3) {
  //             if (y.apps_frame_type == 'FOOTER') {
  //               this.footer.push(y)
  //               // console.log(this.footer[0].level4[0].level5[0]);
  //             } else {
  //               objMast.push(x);
  //             }
  //           }
  //         }
  //         this.object_mast.Level2 = objMast;
  //         console.log("OBJ: ",objMast);

  //       }
  //     }).catch(err => {
  //       this.globalObjects.hideLoading();
  //       this.globalObjects.presentToast("5 Something went wrong please try again later!");
  //       console.log(err);
  //     })
  //   })

    ///FrameMast--> Level3
    ///ItemGroupMast--> Level4
    ///ItemMastKeys--> Level5Keys
    ///ItemMastValues--> Level5Valuesl

  // }

  setPageInfo() {
    for (let page of this.object_mast.Level2) {
      for (let frame of page.Level3) {
        for (let itemGroup of frame.Level4) {
          let itemMast: any = [];
          for (let item of itemGroup.Level5Values) {
            let item1 = {};
            let count = 0;
            for (let key of itemGroup.Level5Keys) {
              item1[key] = item[count];
              count++;
            }
            itemMast.push(item1);

          }
          itemGroup.Level5 = itemMast;
          delete itemGroup['Level5Keys'];
          delete itemGroup['Level5Values'];
        }
      }
    }
  }

  get_remark(a_message, a_approveFlag) {
    this.presentAlert(a_message, a_approveFlag);
  }



  auto_approval_process(a_appremark, a_approveFlag) {
    let wsdp = [];
    let index = 0;
    let mobileNo: number;
    let sms: string;
    this.globalObjects.showLoading();
    for (let Level3 of this.object_mast.Level2[0].Level3) {
      let dp: any = {};
      for (let Level4 of Level3.Level4) {
        for (let item of Level4.Level5) {
          if (item.item_name == 'VRNO' || item.item_name == 'ENTITY_CODE' || item.item_name == 'TCODE' || item.item_name == 'TNATURE' || item.item_name == 'MOBILENO' || item.item_name == 'SMS_TEXT') {
            // dp[item.item_name] = this.l_approvalDetails[index].pageDetails[item.item_name]
            for (let dataRow of this.frame.tableRows[0]) {
              if (item.apps_item_seqid == dataRow.Level5[0].apps_item_seqid) {
                if (item.item_name == "MOBILENO") {
                  mobileNo = dataRow.Level5[0].value;
                  this.whatsAppFlag = item.flag;
                }
                else if (item.item_name == 'SMS_TEXT') {
                  sms = dataRow.Level5[0].value;
                }
                else {
                  dp[item.item_name] = dataRow.Level5[0].value;
                }
              }
            }
          }
        }
      }
      dp.REMARK = a_appremark;
      dp.APPROVAL_FLAG = a_approveFlag;
      wsdp.push(dp);
    }

    console.log(wsdp)


    let wscp = this.wscp;
    wscp.click_events_str = "send_email_attch";
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.service_type = "APPROVE_REJECT";

    let post_data = {
      "wslp": this.wslp,
      "wscp": wscp,
      "wsdp": wsdp
    }
    this.dataService.postData(this.l_url, post_data).then(res => {
      if (this.whatsAppFlag == 'W') {
        this.globalObjects.shareViaWhatsApp(mobileNo, sms);
      }
      this.globalObjects.hideLoading();
      this.closeModal(true);

    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("5 Something went wrong please try again later!");
      console.log(err);
    })
  }

  getFrameData(index) {

    this.frame.tableRows = [];
   
    let wscp = this.wscp;
    wscp.service_type = "get_all_object_frame_data";
   // wscp.a_page_no = this.l_approvalDetails[index].APPS_PAGE_NO;
    let inner_data = {
      "wslp": this.wslp,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    this.dataService.postData(this.l_url, inner_data).then((res1: any) => {
      let data: any = res1;

      console.log("res tab: ", data);
      if (data.responseStatus == "success") {
        this.flagforloader = true;
        this.noRecordMessage = "";
        let objData = this.globalObjects.setPageInfo(data.responseData);

        if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
          this.globalObjects.presentAlert(objData.Level1[0].message);
        }else{
      //  let tableData : any[] = objData.Level1;
        this.aprroveDataArr = objData;

        this.formatData(index);
        
      }
    }
    }).catch(err => {
      console.log('11 Something went wrong please try again later!', err);
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("11 Something went wrong please try again later!");
      console.log(err);
    })
  }



  formatData(index){
    this.tableRows = [];
   // let tableData : any[] = JSON.parse(JSON.stringify(this.aprroveDataArr.Level1));
    let tableKey = [];
    let tableRows = [];

    this.flagforloader = true;
        
        let datas = [];
        if(index == 0){
          this.dataStr = "this.aprroveDataArr.Level1"
          datas = eval(this.dataStr)
        }else{
          this.dataStr = "this.aprroveDataArr.Level1"
          for(let x = 1 ; x < index + 1; x++){
            this.dataStr = this.dataStr + "[0].Level" + (x + 1);
          }

          datas = eval(this.dataStr);
        }

        if (this.l_approvalDetails[index].APPS_FRAME_TYPE == "STRING") {
          this.frame.frame_type = "STRING";
          this.setPageData(this.dataStr, index);
        } 
       
        if (datas[0]) {
          tableKey = Object.keys(datas[0])
        }
        for (let table of datas) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.object_mast.Level2[index].Level3[0].Level4));
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if (item.item_name.toUpperCase() == key.toUpperCase()) {
                  item.value = table[key]
                }
              }
              if(item.item_name.toUpperCase() == "ALERT_MSG"){
                this.alertFlag = true;
                this.alertMsg = item.value;
              }
            }
          }
          let array = [];
          for (let x of frameLevel4) {
            if (x.Level5[0].value) {
              array.push(x);
            }
          }
          tableRows.push(array);

        }
        if (this.l_approvalDetails[index].APPS_FRAME_TYPE != "STRING") {
          this.tableRows = tableRows;
          let framepage = this.frame.tableRows.find(y => y[0][0].apps_page_no == index + 1);

          if(framepage){
            framepage = tableRows
          }else{
            this.frame.tableRows.push(tableRows);
          }

          this.frame.frame_type = "";
          console.log("this.frame.tableRows", this.frame.tableRows)
          this.listLength = tableRows.length;
        }
        if (this.frame.tableRows) {
          this.noRecordMessage = "Query has no Data..!";
        }
  }

  callObject(item, pageDetails) {
    console.log(item);
    console.log(pageDetails);
  }


  itemClicked(event, i) {
    if (event.item_type == "BT") {
      this.presentAlert(event, i);
    }
  }

  async presentAlert(event, i) {
    let msgText = event.prompt_name;
    if(this.alertFlag){
      msgText = this.alertMsg;
    }
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: '<strong>' + msgText + '</strong>!!!',
      inputs: [
        {
          name: 'remark',
          type: 'text',
          placeholder: 'Remark',
         
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => { //takes the data 
            console.log('ok pressed');
            this.sendDataSuper(alertData.remark, event);
          }
        }
      ]
    });
    await alert.present();
  }

  sendDataSuper(remark, event) {
    event.wsdp = [];
    let col: any = {};
    for (let tableData of this.frame.tableRows) {
      for (let rows of tableData) {
        for (let itemGroup of rows) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              col[item.apps_item_seqid] = item.value;
           /* if (item.item_name == 'VRNO' || item.item_name == 'ENTITY_CODE' || item.item_name == 'TCODE' || item.item_name == 'TNATURE') {
                col[item.item_name] = item.value;
              } */
            }
          }
        }
      }
    }

    col.REMARK = remark;
    event.wsdpcl = [];
    this.wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    this.wscp.service_type = "execute_item_plsql";
    event.wsdpcl.push(col);
    event.wsdp.push(col);
    event.wscp = this.wscp;

    this.emitPass.emit(event);
  }

  async showDeveloperData(){
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData
      }
    });
    return await modal.present();
  }

}
