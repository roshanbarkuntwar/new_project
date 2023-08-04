import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import {  ModalController } from '@ionic/angular';
import { Events } from 'src/app/demo-utils/event/events';
import { DataService } from 'src/app/services/data.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';

@Component({
  selector: 'app-frame-table-vertical',
  templateUrl: './frame-table-vertical.component.html',
  styleUrls: ['./frame-table-vertical.component.scss'],
})
export class FrameTableVerticalComponent implements OnInit {
  @Input() frame: any = {};
  //frametable: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  current_page_parameter: any = {};
  thead: any = {};
  userDetails: any;
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_where_str: any;
  searchText: any;
  tableRows = [];
  barcodedata: any;

  filterFormData: any = [];

  setStrIndex: any = { "width": "20px", "max-width": "20px", "min-width": "15px" };
  disSetId: any;

  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;

  loading: boolean = true;

  loadMoreFlag: string;
  summaryRow: any[];

  addRowBtn: any;
  deleteRowBtn: any;
  developerModeData: any;
  footerRowFlag: boolean = false;

  calculate: boolean = false;

  colSpan: number = 0;
  subscribeRefreshFlag = false;


  constructor(private globalObjects: GlobalObjectsService, private events: Events, private dataService: DataService,
    public modalController: ModalController, private sqlServ: SqlLiteService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");


    console.log(this.frame);

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
            this.tableRows = [];
            this.frame.tableRows = [];
            this.frame.verticalTable = [];

            this.loading = true;
            this.ngOnInit();
          }
        }
      });
      this.subscribeRefreshFlag = true;
    }
    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    this.wscp_send_input.apps_working_mode = this.wscp_send_input.apps_working_mode;
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }

        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        ) { } else {

          if (itemMast.item_type == "ADD_ROW_BT" || itemMast.item_type == "DELETE_ROW_BT" || itemMast.item_type == "BT") { }
          else {
            /*   let head = {
                prompt_name: itemMast.prompt_name,
                column_width: JSON.parse(itemMast.column_width)
              } */
            theaddata.push(itemMast.prompt_name);
          }
        }

        if (itemMast.item_type == 'ADD_ROW_BT') {
          this.addRowBtn = itemMast;
        }
        if (itemMast.item_type == "DELETE_ROW_BT") {
          this.deleteRowBtn = itemMast;
        }

        itemMast.indexCount = 0;
      }

      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }
    }

    this.frame.tableRows = [];
    let tableRows = []
    tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
    this.frame.tableRows = this.globalObjects.transpose(tableRows);
    this.thead = theaddata;
    this.paginate(1);
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


  itemValueChange(event, rowindex) {
    if (event.dependent_column_str) {
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
      if (event.dependent_column_sql) {
        this.getDependentData(event, rowindex).then(res => {
          if (res === "success") {
            if (event.post_text_validate_plsql) {
              this.PostTextValidatePlsql(event, rowindex);
            }
          }
        });
      } else if (event.post_text_validate_plsql) {
        this.PostTextValidatePlsql(event, rowindex);
      }

    }

    if (this.calculate) {
      this.calculateData();
    }
  }

  getDependentData(event, rowindex) {
    return new Promise((resolve, reject) => {
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
      this.globalObjects.showLoading();
      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {
        this.globalObjects.hideLoading();
        let data: any = res;
        console.log(data)

        if (data.responseStatus == "success") {
          let objData = this.globalObjects.setPageInfo(data.responseData)
          if (objData && (objData.Level1.length > 0) && (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q")) {
            if (objData.Level1[0].message) {
              this.globalObjects.presentAlert(objData.Level1[0].message);
            }
          }
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
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": event.wsdp
    }

    this.globalObjects.showLoading();

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      this.globalObjects.hideLoading();
      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let keyValue = data.responseData;

        if (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q") {
          if (objData.Level1[0].message) {
            this.globalObjects.presentAlert(objData.Level1[0].message);
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
          this.globalObjects.presentAlert(objData.Level1[0].message);
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
        }
      }
    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.9 Something went wrong please try again later!");
      console.log(err);
    })
    // }
  }

  paginate(a_current_page: number = 1) {
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

    this.getData(l_from_row, l_to_row, a_current_page);
  }

  getData(a_from_row: number, a_to_row: number, a_currentPage: number) {
    this.loading = true;
    this.globalObjects.showLoading();
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = String(a_from_row);
    wscp.to_row = String(a_to_row);
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    this.userDetails["object_code"] = this.frame.object_code;

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

    if (!this.globalObjects.networkStatus) {

      let objectKey = this.userDetails.object_code + "_ENT_TBL_" + wscp.apps_page_frame_seqid;
      if (this.userDetails.object_code && this.wscp_send_input.apps_working_mode === 'I') {
        this.loading = false;

        this.sqlServ.getById(objectKey, 'frame_master').then(data => {

          if (data.resStatus == 'Success') {
            let objData: any = JSON.parse(data.resData.frameData);
            let tableData = objData.Level1;
            this.formatTableData(tableData);
            this.frame.tableRows = this.tableRows;

            this.l_current_page = a_currentPage;
            if (this.l_current_page == 1) {
              this.c_to_row = Math.ceil(this.l_total_rows / (this.l_total_rows / this.frame.no_of_records));
              this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
              this.c_from_row = Math.ceil((this.c_to_row - this.frame.no_of_records)) + 1;
              this.loadMoreFlag = "false";
            }
          }
        }, err => this.globalObjects.presentAlert('ERR PDB: ' + err))
      }
    }
    else {
      this.dataService.postData(l_url, reqData).then(res => {
        this.globalObjects.hideLoading();

        let data: any = res;
        if (data.responseStatus == "success") {

          // let tableRows = []; 
          // let tableData = data.responseData.Level1;
          // let tableKey = Object.keys(tableData[0])
          // Developer Mode Loging
          if (data.responseData.Level1_Keys.length > 0) {
            let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
            let wsSewId = id ? data.responseData.Values[0][id] : "";
            this.developerModeData = {
              ws_seq_id: wsSewId,
              frame_seq_id: reqData.wscp.apps_page_frame_seqid
            }
          }

          //Developer Mode Loging

          let objData = this.globalObjects.setPageInfo(data.responseData);
          let tableData = objData.Level1;

          //---------OFFLINE ENTRY PAGE CODE

          let offlineObjectCode: any;
          if (objData && this.wscp_send_input.apps_working_mode == 'I') {
            if (reqData.wslp) {
              if (reqData.wslp.object_code) {
                offlineObjectCode = reqData.wslp.object_code + "_ENT_TBL_" + reqData.wscp.apps_page_frame_seqid;
              }
            }
            let pouchObjectKey = offlineObjectCode;
            var temp: any = {};
            //var id = pouchObjectKey;

            this.sqlServ.getById(pouchObjectKey, 'frame_master').then((localData: any) => {
              temp.objData = JSON.stringify(objData);
              temp.id = pouchObjectKey;

              if (localData.resStatus == 'Success') {
                temp.rev = localData.resData._rev;
                this.sqlServ.updateObjMast(temp, 'frame_master').then(() => { })
              } else {
                this.sqlServ.postDataSql(temp, 'frame_master');
              }
            })
          }

          this.formatTableData(tableData);

          if (this.tableRows.length > 0) {
            this.frame.tableRows = this.globalObjects.transpose(this.tableRows);
          }

          /*    if(this.frame.apps_frame_type == 'ENTRY_TABLE_VERTICAL'){
               let verticle = this.globalObjects.transpose(this.frame.tableRows);
               this.frame.tableRows = verticle;
               console.log(verticle);
             }
    */

          this.loading = false;
          // this.frame.tableRows =.push(tableRows);

          this.l_current_page = a_currentPage;
          if (this.l_current_page == 1) {
            this.c_to_row = Math.ceil(this.l_total_rows / (this.l_total_rows / this.frame.no_of_records));
            this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
            this.c_from_row = Math.ceil((this.c_to_row - this.frame.no_of_records)) + 1;
            this.loadMoreFlag = "false";
          }
        } else {

          this.loading = false;
        }
      }).catch(err => {
        this.globalObjects.hideLoading();
        this.globalObjects.presentToast("2 Something went wrong please try again later!");
        console.log(err);
      })
    }
  }

  formatTableData(tableData) {
    if (tableData && tableData.length > 0) {
      let tableKey = Object.keys(tableData[0])
      this.l_total_rows = tableData[0].TOTAL_ROWS;
      for (let table of tableData) {
        let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
        for (let itemGroup of frameLevel4) {
          for (let item of itemGroup.Level5) {
            for (let key of tableKey) {
              if (item.item_name.toUpperCase() == key.toUpperCase()) {
                item.value = table[key]
              }
            }
          }
        }
        this.tableRows.push(frameLevel4);
      }
      this.calculateData();
      this.calculate = true;
    }
  }

  calculateData() {
    var lastRow: any = [];
    var maxMinNum = [];
    var avg = [];
    this.footerRowFlag = false;
    this.colSpan = 0;
    for (let i = 0; i < this.thead.length; i++) {
      for (let itemDataArr of this.tableRows) {
        for (let item of itemDataArr) {
          if (item.Level5[0].summary_flag) {
            let flag: any;
            let deci: any;
            if (item.Level5[0].summary_flag.indexOf('#') > -1) {
              let summ = item.Level5[0].summary_flag.split('#');
              flag = summ[0];
              deci = summ[1];
            } else {
              flag = item.Level5[0].summary_flag;
            }
            if (flag == 'S' || flag == 'C' || flag == 'A' || flag == 'X' || flag == 'M') {
              this.footerRowFlag = true;
              if (typeof (item.Level5[0].value) == "number") {
                item.Level5[0].value = JSON.stringify(item.Level5[0].value)
              }
              if (flag == 'S' && item.Level5[0].prompt_name == this.thead[i] && item.Level5[0].value) {
                if (lastRow[i]) {
                  lastRow[i] = (parseFloat(lastRow[i]) + parseFloat(item.Level5[0].value.replace(/,/g, ''))).toFixed(deci);
                }
                else {
                  lastRow[i] = parseFloat(item.Level5[0].value.replace(/,/g, '')).toFixed(deci);
                }
              }
              else if (flag == 'A' && item.Level5[0].prompt_name == this.thead[i] && item.Level5[0].value) {
                if (item.Level5[0].value) {
                  avg.push(parseFloat(item.Level5[0].value.replace(/,/g, '')));
                  // lastRow[i] = Math.max.apply(null,maxMinNum);
                  var sum = 0;
                  for (var j = 0; j < avg.length; j++) {
                    sum += parseInt(avg[j], 10); //don't forget to add the base
                  }
                  lastRow[i] = (sum / avg.length).toFixed(deci);
                }
              }
              else if (flag == 'C' && item.Level5[0].prompt_name == this.thead[i] && item.Level5[0].value) {
                if (lastRow[i]) {
                  lastRow[i] = (Math.round(parseFloat(lastRow[i].replace(/,/g, ''))) + 1).toFixed(deci);
                }
                else {
                  lastRow[i] = 1;
                }
              }
              else if (flag == 'M' && item.Level5[0].prompt_name == this.thead[i] && item.Level5[0].value) {
                if (item.Level5[0].value) {
                  maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, '')));
                  lastRow[i] = (Math.min.apply(null, maxMinNum)).toFixed(deci);
                }
              }
            } else if (flag == 'X' && item.Level5[0].prompt_name == this.thead[i] && item.Level5[0].value) {
              if (item.Level5[0].value) {
                maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, '')));
                lastRow[i] = Math.max.apply(null, maxMinNum).toFixed(deci);
              }
            }
          }
          else {
            if (lastRow[i]) {

            }
            else {
              this.colSpan = i - 1;
            }
          }
        }
      }
    }
    this.summaryRow = lastRow;
  }

  itemClicked(event, i) {
    event.wsdp = [];
    let col = {};
    if (this.frame.tableRows.length > 0) {
      for (let itemGroup of this.frame.tableRows[i]) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            col[item.apps_item_seqid] = item.value
            if (item.session_hold_flag == 'T') {
              if (this.sessionObj) {
                this.sessionObj[item.item_name] = item.value
              } else {
                this.sessionObj = {};
                this.sessionObj[item.item_name] = item.value
              }
            }
          }
        }
      }
    }
    event.sessionObj = this.sessionObj;
    event.frameSeqNo = this.frame.apps_page_frame_seqid;
    event.wsdp.push(col);
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    event.itemIndex = i;
    this.emitPass.emit(event);
  }

  //-------table order by start

  getFilterParameter(event) {
    this.l_where_str = event.where_str;
    this.paginate(1);
  }

  deleteRows(i) {
    if (this.frame.tableRows.length > 1) {
      this.frame.tableRows.splice(i, 1);
    } else {
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
      this.frame.tableRows[0] = frameLevel4;
    }
  }

  /*  async showDeveloperData() {
     const modal = await this.modalController.create({
       component: DeveloperModeLogPage,
       cssClass: 'my-custom-class',
       componentProps: {
         data: this.developerModeData
       }
     });
     return await modal.present();
 
   } */


}
