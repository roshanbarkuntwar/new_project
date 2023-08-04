import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/demo-utils/event/events';
import { LoadingController, ModalController } from '@ionic/angular';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';

@Component({
  selector: 'app-frame-summ-card',
  templateUrl: './frame-summ-card.component.html',
  styleUrls: ['./frame-summ-card.component.scss'],
})

export class FrameSummCardComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  wscp: any = {};
  thead: any = [];
  thead2: any = [];
  dispalyss: any = { "color": "red", "text-yellow": "pink" };
  userDetails: any;
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_where_str: any;
  filterFormData: any = [];
  l_card_title: any;
  tablerowsfilter: any;
  searchFlag: any = false;
  canvasfilter: any = false;
  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  callingObjectArr = [];
  noRecordMessage: any;
  getcanvasWCP: boolean = false;
  jsFilter: boolean = false;
  cFilter: boolean = false;
  jFilter: boolean = false;
  aFilter: boolean = false;
  advanceFilter: boolean = false;
  tableRows: any[];
  loadMoreFlag: boolean;
  colSize: any = [];
  developerModeData: any;
  subscribeRefreshFlag = false;

  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, private modalCtrl: ModalController, private events: Events
  ) {

    this.userDetails = this.globalObjects.getLocallData("userDetails");


  }

  ngOnInit() {

    


    let name = "refreshFrame" + ((this.frame.apps_page_frame_seqid).toString().replace(/-/g,"_"));
    if (!this.subscribeRefreshFlag) {
      this.events.subscribe(name, res => {
        for (let f of res.refreshFrame) {
          if (f.key == this.frame.apps_page_frame_seqid && f.val == 'T') {
            f.val = 'F';
            this.wscp_send_input = res.wscp;
            this.wsdp = res.wsdp;
            this.frame.tableRows = [];
            this.ngOnInit();
          }
        }

      })
      this.subscribeRefreshFlag = true;
    }
    console.log("frame canvas bordered", this.frame);
    for (let itemGroup of this.frame.Level4) {
      itemGroup.groupCol = [];
      if (itemGroup.design_control_type) {
        itemGroup.groupCol = itemGroup.design_control_type.split('-');
        this.colSize = itemGroup.groupCol;
      }

    }
    let frameFilterFlag = this.frame.frame_filter_flag;
    if (frameFilterFlag) {
      if (frameFilterFlag.indexOf("S") > -1) {
        this.searchFlag = true;
      }
      if (frameFilterFlag.indexOf("C") > -1) {
        this.canvasfilter = true;
      }
      if (frameFilterFlag.indexOf("J") > -1) {
        this.jsFilter = true;
      }
      if (frameFilterFlag.indexOf("A") > -1) {
        this.advanceFilter = true;
      }
    }
    // this.getData();
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }
        // console.log(itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
        //   (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        // )

        // if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
        //   (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        // ) { } else {
        //   this.thead.push(itemMast.prompt_name)
        // }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }

    }
    this.paginate(1);
  }

  updateModel(value) {
    this.l_card_title = value;
  }


  filterToggle() {
    if (this.show_filter == 'show') {
      this.show_filter = 'dontshow';
    }
    else {
      this.show_filter = 'show';
    }
  }
  getdataFromcanvasFilter(event) {
    this.getcanvasWCP = true;
    let array = [];
    this.canvasfilter = false;
    this.advanceFilter = false;
    this.jFilter = false;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;

    array = event.event.where_str;

    this.l_where_str = [];
    for (let data of array) {
      console.log(data)

      this.l_where_str += data + "  ";
    }
    this.frame.l_where_str = this.l_where_str;
    console.log("array concate", this.l_where_str)
    this.paginate(1);
  }
  paginate(a_current_page: number = 1) {
    // this.tableRows = [];
    let l_total_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
    let L_total_pages = this.l_total_rows / this.frame.no_of_records;

    if (a_current_page < 1) {
      a_current_page = 1;
      this.tableRows = [];
    } else if (a_current_page > l_total_pages) {
      a_current_page = l_total_pages;
    }

    let l_from_row: number = null;
    let l_to_row: number = null;

    if (l_total_pages > 0 && a_current_page == 1) {
      this.tableRows = [];
      l_to_row = Math.ceil(this.l_total_rows / L_total_pages);
    }
    else {
      l_to_row = Math.ceil(this.l_total_rows / L_total_pages) * a_current_page;
    }

    l_from_row = Math.ceil((l_to_row - this.frame.no_of_records)) + 1;

    this.c_from_row = l_from_row;
    this.c_to_row = l_to_row;

    // if (a_current_page!=1){
    //   this.l_total_remain_pages=Math.ceil(this.l_total_rows / this.frame.no_of_records)-(this.c_to_row-this.frame.no_of_records);
    // }
    this.getData(l_from_row, l_to_row, a_current_page);
  }

  getData(a_from_row: number, a_to_row: number, a_currentPage: number) {
    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = String(a_from_row);
    wscp.to_row = String(a_to_row);
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    if (this.l_where_str) {
      wscp.where_str = this.l_where_str.join(" ");
    } else {
      wscp.where_str = null;
    }
    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then((res: any) => {
      let data: any = res;
      if (data.responseStatus == "success") {
        let tableRows = [];

        // Developer Mode Loging
        let id = res.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? res.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : res.responseData.Level1_Keys.indexOf("same_ws_seqid");
        let wsSewId = id ? res.responseData.Values[0][id] : "";
        this.developerModeData = {
          ws_seq_id: wsSewId,
          frame_seq_id: reqData.wscp.apps_page_frame_seqid
        }
        //Developer Mode Loging

        //  let tableData = data.responseData.Level1;
        //  let tableKey = Object.keys(tableData[0])
        let objData = this.globalObjects.setPageInfo(data.responseData);
        // For Getting *CALLING_OBJECT_CODE* from Frame //
        this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
        // For Getting *CALLING_OBJECT_CODE* from Frame //
        let tableData = objData.Level1;
        let tableKey = Object.keys(tableData[0])
        this.l_total_rows = tableData[0].TOTAL_ROWS;


        if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
          alert(objData.Level1[0].message);
        }

        for (let name of tableData) {
          if (name['APPS_PAGE_NAME']) {
            let obj = {
              object_code: this.frame.object_code,
              pageName: name['APPS_PAGE_NAME']
            }
            this.events.publish('pageName', obj);
          }if(name['APPS_PAGE_FRAME_NAME']) {
            this.frame.apps_page_frame_name = name['APPS_PAGE_FRAME_NAME'];
          }
        }

        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if (item.item_name && item.item_name.toUpperCase() == key.toUpperCase()) {
                  item.value = table[key];
                  if(item.value && item.value.indexOf("@") > -1){
                    item.prompt_name = item.value.split("@")[0];
                    item.value = item.value.split("@")[1];
                  }
                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }
        if (this.frame.flagtoclosefilter) {
          this.filterToggle();
        }
        this.frame.tableRows = tableRows;
        this.l_current_page = a_currentPage;
        if (this.l_current_page == 1) {
          this.c_to_row = Math.ceil(this.l_total_rows / (this.l_total_rows / this.frame.no_of_records));
          // this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
          if (this.frame.no_of_records > 0) {
            this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
          } else {
            this.l_total_remain_pages = 1;
          }
          this.c_from_row = Math.ceil((this.c_to_row - this.frame.no_of_records)) + 1;
        }
        if (a_to_row > this.l_total_rows) {
          this.loadMoreFlag = true;
        }
        if (this.frame.no_of_records) { } else { this.loadMoreFlag = true; }
      }
    }).catch(err => {
      this.globalObjects.presentToast("Something went wrong please try again later!");
      console.log(err);
    })
  }

  // itemClicked(event, rowsdata) {
  //   var rowindex;
  //   for (let dataRow of rowsdata) {
  //     if (dataRow.Level5[0].item_name == "ROWNUMBER") {
  //       rowindex = dataRow.Level5[0].value - 1;
  //     }

  //   }
  //   if (event.click_events_str == "editItem") {
  //     let frameLevel4 = JSON.parse(JSON.stringify(this.frame.tableRows[rowindex]))
  //     for (let itemGroup of frameLevel4) {
  //       if (itemGroup.Level5) {
  //         for (let item of itemGroup.Level5) {
  //           let temp = item.design_control_type_auto_card;
  //           item.design_control_type_auto_card = item.design_control_type;
  //           item.design_control_type = temp;

  //           temp = item.display_setting_str_auto_card;
  //           item.display_setting_str_auto_card = item.display_setting_str;
  //           item.display_setting_str = temp;

  //           temp = item.flag_auto_card;
  //           item.flag_auto_card = item.item_visible_flag;
  //           item.item_visible_flag = temp;

  //           item.item_type = item.temp_item_type

  //         }
  //       }
  //     }
  //     this.frame.tableRows.splice(rowindex, 1);
  //     event.EDIT_ITEM = frameLevel4;
  //     this.emitPass.emit(event);
  //   } else if (event.click_events_str == "deleteItem") {
  //     this.frame.tableRows.splice(rowindex, 1);
  //   }
  //   else {
  //     event.wsdp = [];
  //     let col = {};
  //     for (let itemGroup of this.frame.tableRows[rowindex]) {
  //       if (itemGroup.Level5) {
  //         for (let item of itemGroup.Level5) {
  //           if (item.codeOfValues) {
  //             col[item.apps_item_seqid] = item.codeOfValues
  //           } else {
  //             col[item.apps_item_seqid] = item.value
  //           }
  //         }
  //       }
  //     }

  //     event.wsdp.push(col);
  //   }
  //   this.emitPass.emit(event);
  // }


  itemClicked(event, rowsdata, i) {
    // event.wsdp = [];
    var rowindex;
    for (let dataRow of rowsdata) {
      if (dataRow.Level5[0].item_name == "ROWNUMBER") {
        rowindex = dataRow.Level5[0].value - 1;
      }
    }
    if (rowindex == undefined) {
      rowindex = i;
    }

    event.callingObjectArr = this.callingObjectArr;
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
    // event.wsdp.push(col);
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
    event.wscp = this.wscp_send_input;
    this.wscp = this.wscp_send_input;

    if (event.click_events_str == "editItem") {
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.tableRows[rowindex]))
      for (let itemGroup of frameLevel4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            let temp = item.design_control_type_auto_card;
            item.design_control_type_auto_card = item.design_control_type;
            item.design_control_type = temp;

            temp = item.display_setting_str_auto_card;
            item.display_setting_str_auto_card = item.display_setting_str;
            item.display_setting_str = temp;

            temp = item.flag_auto_card;
            item.flag_auto_card = item.item_visible_flag;
            item.item_visible_flag = temp;

            item.item_type = item.temp_item_type

          }
        }
      }
      this.frame.tableRows.splice(rowindex, 1);
      event.EDIT_ITEM = frameLevel4;
      this.emitPass.emit(event);
    } else if (event.click_events_str == "deleteItem") {
      this.frame.tableRows.splice(rowindex, 1);
    }
    else {
      event.wsdp = [];
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

      event.wsdp.push(col);
    }
    event.itemIndex = rowindex;
    this.emitPass.emit(event);
  }


  itemValueChange(event, rowindex) {
    console.log("itemValueChange" + JSON.stringify(event));
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
                console.log()
                console.log(item.formula_str + " ---> " + item.prompt_name)
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
      console.log(event.wsdp);

      console.log("ITEM " + rowindex);
      if (event.dependent_column_sql && event.value) {
        this.getDependentData(event, rowindex).then(res => {
          if (res === "success") {
            if (event.post_text_validate_plsql) {
              // setTimeout(() => this.PostTextValidatePlsql(event, rowindex), 3000);
              this.PostTextValidatePlsql(event, rowindex);
            }
          }
        });
      } else if (event.post_text_validate_plsql && event.value) {
        this.PostTextValidatePlsql(event, rowindex);
      }
    }
  }

  getDependentData(event, rowindex) {
    return new Promise((resolve, reject) => {
      // this.globalObjects.showLoading();
      let wscp: any = {};
      wscp.service_type = "getDependentColumns";
      wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
      wscp.item_sub_type = this.wscp_send_input.item_sub_type;
      wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      wscp.apps_item_seqid = event.apps_item_seqid;
      wscp.apps_page_no = event.apps_page_no;
      wscp.object_code = event.object_code;

      let newWsdp = [];
      newWsdp.push(Object.assign(this.wsdp[0], event.wsdp[0]));

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": newWsdp
      }

      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {
        // this.globalObjects.hideLoading();
        let data: any = res;
        console.log(data)

        if (data.responseStatus == "success") {
          resolve("success");
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
        console.log("this.frame canvas err");

        this.globalObjects.hideLoading();
        this.globalObjects.presentToast("1.6 Something went wrong please try again later!");
        console.log(err);
      })
    })
    // }

  }

  PostTextValidatePlsql(event, rowindex) {
    this.globalObjects.showLoading();
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
      console.log(data)

      if (data.responseStatus == "success") {
        // console.log(data.responseData.Values[0][0] + data.responseData.Values[0][1]);
        // console.log(event.wsdp);
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let keyValue = data.responseData;
        if (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q") {
          if (objData.Level1[0].message) {
            alert(objData.Level1[0].message);
          }
          this.globalObjects.clickedbutton = false;
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
        } else if (objData.Level1[0].status == "L") {
          sessionStorage.setItem("PLSQL_L", objData.Level1[0].message);
        } else if (objData.Level1[0].status == "T") {
        } else {
          objData.Level1[0].status = "Q";
          // alert(objData.Level1[0].message);
          this.globalObjects.clickedbutton = false;
          // for (let itemGroup of this.frame.tableRows[rowindex]) {
          //   if (itemGroup.Level5) {
          //     for (let item of itemGroup.Level5) {
          //       if (objData.Level1[0].item_name == item.item_name) {
          //         item.value = "";
          //         item.codeOfValues = "";

          //       }
          //     }
          //   }
          // }
        }
      }

    }).catch(err => {
      console.log("this.frame canvas err");

      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.7 Something went wrong please try again later!");
      console.log(err);
    })

  }













  getFilterParameter(event) {
    this.l_where_str = event.where_str;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;
    // this.getData();
    this.paginate(1);
  }

  openMike() {
    this.globalObjects.speechdata = '';
    this.globalObjects.startListening().then(res => {
      this.tablerowsfilter = res;
    });
  }

  async showDeveloperData() {
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
