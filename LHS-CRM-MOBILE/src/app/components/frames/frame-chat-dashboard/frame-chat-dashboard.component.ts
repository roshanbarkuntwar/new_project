import { Component, OnInit, Input, Output, EventEmitter, ɵConsole } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-frame-chat-dashboard',
  templateUrl: './frame-chat-dashboard.component.html',
  styleUrls: ['./frame-chat-dashboard.component.scss'],
})
export class FrameChatDashboardComponent implements OnInit {
  @Input() frame: any = {};
  //frametable: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitForPdf: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  showFrame: boolean = false;
  item_slno_count: number = 1;
  current_page_parameter: any = {};

  constructor(private globalObjects:GlobalObjectsService,private dataService:DataService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
   }

  ngOnInit() {
    this.current_page_parameter = this.globalObjects.current_page_parameter;

    for (let itemGroup of this.frame.Level4) {
      itemGroup.groupCol = [];
      if (itemGroup.design_control_type) {
        itemGroup.groupCol = itemGroup.design_control_type.split('-')
      }
    }

    this.frame.tableRows = [];
    this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
    this.getData();
  }

  

  getData() {

    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    // if (this.frame.on_frame_load_str) {
    wscp.service_type = this.frame.on_frame_load_str;
 
    


    
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }



    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      this.globalObjects.hideLoading();

      let data: any = res;
      if (data.responseStatus == "success") {

        let tableRows = [];

        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        let tableKey = Object.keys(tableData[0])


        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  item.value = table[key]
                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }
        this.frame.tableRows = tableRows;
      }
      this.showFrame = true;
    }).catch(err => {
      this.showFrame = true;
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
    })
    // }
  }


  itemValueChange(event, rowindex) {
    if (event.dependent_column_str) {
      // this.wsdp = [];
      let wsdp = [];
      let dependent_column_arr = event.dependent_column_str.split("#")
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
              if (dependent_column_arr.indexOf(item.apps_item_seqid) > -1) {
                item.codeOfValues = ""
                item.value = ""
              }
              if (item.formula_str) {
                item.value = this.globalObjects.autoCalculation(item.formula_str, this.frame.tableRows[rowindex])
              }
            }
          }
        }
        wsdp.push(col);
      } else {
        for (let itemGroup of this.frame.Level4) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (dependent_column_arr.indexOf(item.apps_item_seqid) > -1) {
                item.codeOfValues = ""
                item.value = ""
              }
            }
          }
        }
      }
      event.wsdp = wsdp;
      this.getDependentData(event, rowindex);
      this.PostTextValidatePlsql(event, rowindex);


    }
  }


  getDependentData(event, rowindex) {
    let wscp: any = {};
    wscp.service_type = "getDependentColumns";
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
    wscp.apps_item_seqid = event.apps_item_seqid;
    wscp.apps_page_no = event.apps_page_no;
    wscp.object_code = event.object_code;


    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": event.wsdp
    }



    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      this.globalObjects.hideLoading();
      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData)
        if (objData && (objData.Level1.length > 0 ) && (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q")) {
          if (objData.Level1[0].message) {
            this.globalObjects.presentAlert(objData.Level1[0].message);
          }}
        
        let keyValue = data.responseData;
        for (let itemGroup of this.frame.tableRows[rowindex]) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (keyValue.Level1_Keys.indexOf(item.item_name) > -1) {
                item.value = keyValue.Values[0][keyValue.Level1_Keys.indexOf(item.item_name)]
              }
            }
          }
        }
      }
    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.6 Something went wrong please try again later!");
    })
    // }

  }

  PostTextValidatePlsql(event, rowindex) {

    let wscp: any = {};
    wscp.service_type = "PostTextValidatePlsql";
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
    wscp.apps_item_seqid = event.apps_item_seqid;
    wscp.apps_page_no = event.apps_page_no;
    wscp.object_code = event.object_code;

    var inputData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": event.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, inputData).then(res => {
      this.globalObjects.hideLoading();
      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let keyValue = data.responseData;
        if (objData.Level1[0].status == "F") {
          if (objData.Level1[0].message) {
            alert(objData.Level1[0].message);
          }
          for (let itemGroup of this.frame.tableRows[rowindex]) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                if (objData.Level1[0].item_name == item.item_name) {
                  item.value = "";
                  item.codeOfValues = "";
                  
                }
              }
            }
          }
        }
        
      }
      
    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.7 Something went wrong please try again later!");
      console.log(err);
    })

  }
  // itemClicked(event, rowindex) {
  //   this.PostTextValidatePlsql(event, rowindex).then(res => {
  //     if (res == "success") {
  //       this.itemClicked1(event, rowindex);
  //     }
  //   })
  // }

  itemClicked(event, rowindex) {
    // alert("valid--> " + valid)
        let isValid = true;
        if (event.click_events_str.indexOf("addItem") > -1) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.tableRows[rowindex]))
          for (let itemGroup of frameLevel4) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                let temp = item.design_control_type;
                item.design_control_type = item.design_control_type_auto_card;
                item.design_control_type_auto_card = temp;

                temp = item.display_setting_str;
                item.display_setting_str = item.display_setting_str_auto_card;
                item.display_setting_str_auto_card = temp;

                temp = item.item_visible_flag;
                item.item_visible_flag = item.flag_auto_card;
                item.flag_auto_card = temp;

                item.temp_item_type = item.item_type

                if (item.item_type != "BT") {
                  item.item_type = "TEXT";
                }
                if (item.item_name == "SLNO") {
                  item.value = this.item_slno_count;
                  this.item_slno_count = this.item_slno_count + 1;
                }
                if (item.isValid !== undefined && !item.isValid) {
                  isValid = item.isValid;
                }
              }
            }
          }

          let checkValidFrame = false;
          if (event.click_events_str.indexOf("checkValidFrame") > -1) {
            let arr = event.click_events_str.split("#");
            let frmseq = arr[event.click_events_str.indexOf("checkValidFrame")].split("~")[1];
            if (this.frame.apps_page_frame_seqid == frmseq) {
              checkValidFrame = true;
            }
          }

          if (checkValidFrame && !isValid) {
            for (let itemGroup of this.frame.tableRows[rowindex]) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.isValid !== undefined && !item.isValid) {
                    item.touched = true;
                  }
                }
              }
            }
            this.globalObjects.clickedbutton=false;
            this.globalObjects.presentAlert("Please correct all the errors and enter valid input")
          } else {
            if (event.click_events_str.indexOf("checkValidFrame") > -1) {
              let arr = event.click_events_str.split("#");
              arr.splice([event.click_events_str.indexOf("checkValidFrame")], 1);
              event.click_events_str = arr.join("#");
            }
            this.frame.tableRows[rowindex] = JSON.parse(JSON.stringify(this.frame.Level4))
            event.ADD_ITEM = frameLevel4;
            this.emitPass.emit(event);
          }
        } else {
          event.wsdp = [];
          if (this.frame.tableRows) {
            for (let framedata of this.frame.tableRows) {
              let col = {};
              for (let itemGroup of framedata) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    let value;
                    if (item.codeOfValues) {
                      value = item.codeOfValues
                    } else {
                      value = item.value
                    }
                    col[item.apps_item_seqid] = value;
                    if (item.session_hold_flag == 'T') {
                      if (this.sessionObj) {
                        this.sessionObj[item.item_name] = value
                      } else {
                        this.sessionObj = {};
                        this.sessionObj[item.item_name] = value
                      }
                    }
                    if (item.isValid !== undefined && !item.isValid) {
                      isValid = item.isValid;
                    }
                  }
                }
              }
              event.sessionObj = this.sessionObj
              event.wsdp.push(col);
            }
            //--------------------------
            if (this.frame.tableRows.length > 1) {
              let wsdpcl = {};
              for (let itemGroup of this.frame.tableRows[rowindex]) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (item.codeOfValues) {
                      wsdpcl[item.apps_item_seqid] = item.codeOfValues
                    } else {
                      wsdpcl[item.apps_item_seqid] = item.value
                    }
                  }
                }
              }
              event.wsdpcl = [];
              event.wsdpcl.push(wsdpcl);
            }
            //--------------------------
          } else {
            let col = {};
            for (let itemGroup of this.frame.Level4) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.codeOfValues) {
                    col[item.apps_item_seqid] = item.codeOfValues
                  } else {
                    col[item.apps_item_seqid] = item.value
                  }
                  if (item.isValid !== undefined && !item.isValid) {
                    isValid = item.isValid
                  }
                }
              }
            }
            event.wsdp.push(col);
          }

          let checkValidFrame = false;
          if (event.click_events_str.indexOf("checkValidFrame") > -1) {
            let arr = event.click_events_str.split("#");
            let frmseq = arr[event.click_events_str.indexOf("checkValidFrame")].split("~")[1];
            if (this.frame.apps_page_frame_seqid == frmseq) {
              checkValidFrame = true;
            }
          }

          if (checkValidFrame && !isValid) {
            for (let itemGroup of this.frame.tableRows[rowindex]) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.isValid !== undefined && !item.isValid) {
                    item.touched = true;
                  }
                }
              }
            }
            this.globalObjects.clickedbutton=false;
            this.globalObjects.presentAlert("Please correct all the errors and enter valid input")
          } else {
            this.emitPass.emit(event);
          }
        }
      
  }

  onSubmit(form) {
    alert(form.form.valid)
  }

}


