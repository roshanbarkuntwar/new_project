import { Component, OnInit, Input, Output, EventEmitter, HostListener, Directive } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { PouchDBService } from 'src/app/services/pouch-db.service';
import { Events, LoadingController, ModalController, Platform } from '@ionic/angular';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { DatePipe } from "@angular/common";
import { LhsLibService } from 'src/app/services/lhs-lib.service';

@Directive({
  selector: "[focusDir]"
})
export class FocusDirectiveEntryTable {
  constructor() { }

  @HostListener("keyup.enter") onKeyupEnter() {
    var nextEl = this.findNextTabStop(document.activeElement);
    nextEl.focus();
    // or try for ionic 4:
    // nextEl.setFocus();
  }

  findNextTabStop(el) {
    var universe = document.querySelectorAll(
      "input,select,textarea"
    );
    var list = Array.prototype.filter.call(universe, function (item) {
      return item.tabIndex >= "0";
    });
    var index = list.indexOf(el);
    return list[index + 1] || list[0];
  }
}

@Component({
  selector: 'app-frame-table2',
  templateUrl: './frame-table2.component.html',
  styleUrls: ['./frame-table2.component.scss'],
})
export class FrameTable2Component implements OnInit {
  @Input() frame: any = {};
  //frametable: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  flagtoruncanvasfilter: boolean;
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
  excelRows: any[];


  addRowBtn: any;
  deleteRowBtn: any;
  cB: any;
  developerModeData: any;
  footerRowFlag: boolean = false;

  calculate: boolean = false;

  colSpan: number = 0;
  subscribeRefreshFlag = false;

  scrollClass = "";
  item_slno_count: number = 1;
  displayDataLen = 50;

  tableData = [];

  filterAbleData = [];

  searchFlag: boolean = false;
  graphFlag: boolean = false;
  pdfFlag: boolean = false;
  excelFlag: boolean = false;
  enablefunnel: boolean = false;
  canvasfilter: any = false;
  jsFilter: any;
  advanceFilter: any;
  excelheads: any = {};
  pdfHeading: any;
  getcanvasWCP: boolean = false;
  filter: boolean = false;
  tab: any;
  jsonTableData = [];
  loadingCount = 0;
  showFlag: boolean = true;
  plt = 'browser';
  increamentColspan = 0;

  constructor(private globalObjects: GlobalObjectsService, private events: Events, private dataService: DataService, private datePipe: DatePipe, private lhs_lib: LhsLibService,
    private pouchDBService: PouchDBService, private platform: Platform, public modalController: ModalController, private sqlServ: SqlLiteService, private pipemy: SearchfilterPipe,
    private lhsLib: LhsLibService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");

    console.log(this.frame);

  }

  ngOnInit() {
    let name = "refreshFrame" + ((this.frame.apps_page_frame_seqid).toString().replace(/-/g, "_") + this.globalObjects.refreshId);
    if (!this.subscribeRefreshFlag) {
      this.events.subscribe(name, res => {
        for (let f of res.refreshFrame) {
          if (f.key == this.frame.apps_page_frame_seqid && f.val == 'T') {
            f.val = 'F';
            // this.globalObjects.ShowLoadingNew();
            this.wscp_send_input = res.wscp;
            this.wsdp = res.wsdp;
            this.wsdpcl = res.wsdpcl;
            this.tableRows = [];
            this.frame.tableRows = [];
            this.frame.verticalTable = [];
            this.tableData = [];
            this.l_total_rows = 0;
            this.loading = true;
            this.summaryRow = [];
            this.ngOnInit();
          }
        }
      });
      this.subscribeRefreshFlag = true;
    }

    let adName = "addEvent_" + this.frame.apps_page_frame_seqid;
    this.events.unsubscribe(adName);
    this.events.subscribe(adName, res => {
      if (res.flag == "T") {
        res.flag = "F";
        this.tableRows = this.frame.tableRows;
        this.thead = this.frame.tHead
        if (this.frame.Level4 && this.frame.Level4.length > 0) {
          if (this.frame.Level4[0].Level5 && this.frame.Level4[0].Level5.length > 0) {
            this.increamentColspan = this.frame.Level4[0].Level5.length;
          }
        }
        this.calculateData(this.tableRows,this.thead);
      }
    })

    let theaddata: any = [];
    let exelHeads: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    this.wscp_send_input.apps_working_mode = this.wscp_send_input.apps_working_mode;

    this.tab = this.frame.apps_page_frame_seqid;
    let itmGroup = [];

    this.pdfHeading = this.frame.apps_page_frame_name;

    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }

        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        ) { } else {

          if (itemMast.item_type == "ADD_ROW_BT" || itemMast.item_type == "DELETE_ROW_BT") { }
          else {
            /*   let head = {
                prompt_name: itemMast.prompt_name,
                column_width: JSON.parse(itemMast.column_width)
              } */
            if (itemMast.item_type == 'CB') {
              theaddata.push(itemMast.prompt_name);
            } else {
              theaddata.push(itemMast.prompt_name);
            }
          }
          if (itemMast.item_type == 'BT' || itemMast.item_type == 'DISPLAY_PHOTO' || itemMast.item_type == 'DOWNLOAD_DOC') {

          } else {
            exelHeads.push(itemMast.prompt_name);
          }
        }

        if (itemMast.item_type == 'ADD_ROW_BT') {
          this.addRowBtn = itemMast;
        }
        if (itemMast.item_type == "DELETE_ROW_BT") {
          this.deleteRowBtn = itemMast;
        }
        if (itemMast.item_type == "CB" && itemMast.item_sub_type == 'SELECT_ALL') {
          this.cB = itemMast;
        }

        itemMast.indexCount = 0;

        if (itemMast.item_default_value == 'INDEX') {
          itemMast.value = 1;
        }

        if (itemMast.mirror_item_seqid) {
          let val = this.lhsLib.get_item_value(itemMast.mirror_item_seqid, 0);
          itemMast.value = val;
        }
        if (itemMast.item_default_value) {
          let obj = {
            frame: this.frame,
            wscp_send_input: this.wscp_send_input
          };

          this.globalObjects.setItemDefaultValue(itemMast, obj);
          // itemMast.value = itemMast.item_default_value;
        }
      }


      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }
    }

    // let frameFilterFlag = this.frame.frame_filter_flag;
    let frameFilterFlag = this.frame.frame_filter_flag ? this.frame.frame_filter_flag.split("#") : [];
    if (frameFilterFlag && frameFilterFlag.indexOf("TABLE_SCROLL") > -1) {
      this.scrollClass = "table-scroll";
    }
    if (frameFilterFlag) {
      for (let x of frameFilterFlag) {
        if (x === 'S') {
          this.searchFlag = true;
        }
        if (x === 'G') {
          this.graphFlag = true;
        }
        if (x === 'P') {
          this.pdfFlag = true;
        }
        if (x === 'E') {
          this.excelFlag = true;
        }
        if (x === 'C' || x === 'J' || x === 'A' || x == 'D&D' || x == 'ACTION') {
          // this.filter=true;
          this.enablefunnel = true;
        }

      }
    }

    if (this.platform.is('ios')) {
      this.plt = 'ios'
    } else if (this.platform.is('android')) {
      this.plt = 'android';
    }

    // this.frame.no_of_records = this.frame.no_of_records ? this.frame.no_of_records : this.displayDataLen;

    this.excelheads = exelHeads;
    this.thead = theaddata;
    this.frame.tHead = this.thead;
    this.paginate(1);
  }

  onSwitch(ev) {
    this.frame.apps_frame_type = 'CARD'
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

  cbEvent() {
    console.log(this.cB.isChecked)
    for (let tableData of this.frame.tableRows) {
      for (let itemGroup of tableData) {
        for (let item of itemGroup.Level5) {
          if (item.item_type == 'CB') {
            item.touched = true;
            item.isChecked = this.cB.isChecked;
            if (item.isChecked) {
              item.value = "Y";
              item.isValid = true;
            } else {
              item.value = 'N'
              item.isValid = false;
            }
          }
        }
      }
    }
  }


  itemValueChange(event, rowindex) {

    if (event.on_blur) {
      this.onItemBlur(event, rowindex);
    }
    if (event.dependent_column_str && (event.value || event.value == 0)) {
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
    for (let itemGroup of this.frame.tableRows[rowindex]) {
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          if (item.apps_item_seqid == event.apps_item_seqid) {
            item.value = event.value
          }
        }
      }
    }

    if (this.calculate) {
      this.calculateData(this.frame.tableRows,this.thead);
    }

    if (event.click_events_str && (event.click_events_str.indexOf("addItem") > -1)) {
      if (event.value) {

        this.itemClicked(event, this.frame.tableRows[rowindex], rowindex, rowindex);
      }
    }
  }


  onItemBlur(event, rowindex) {
    if (event.on_blur) {

      if (this.frame.tableRows) {
        this.globalObjects.onBlurEvent(event, event.on_blur, this.frame.tableRows[rowindex]);
      }
      console.log("ITEM " + rowindex);
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
        // if (objData.Level1[0].status == "F") {
        //   alert(objData.Level1[0].message);
        //   for (let itemGroup of this.frame.tableRows[rowindex]) {
        //     if (itemGroup.Level5) {
        //       for (let item of itemGroup.Level5) {
        //         if (objData.Level1[0].item_name == item.item_name) {
        //           item.value = "";
        //           item.codeOfValues = "";
        //         }
        //       }
        //     }
        //   }
        // }
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

    let to = this.displayDataLen * a_current_page;
    let from = to - this.displayDataLen;
    if (this.tableData.length >= to) {
      this.loadingCount = 0;
      this.formatTableData(from, to, a_current_page);
    } else {


      this.getData(l_from_row, l_to_row, a_current_page);

    }
  }

  getData(a_from_row: number, a_to_row: number, a_currentPage: number) {
    this.loading = true;
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = String(a_from_row);
    wscp.to_row = String(a_to_row);
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.orignal_apps_item_seqid = this.wscp_send_input.orignal_apps_item_seqid;
    this.userDetails["object_code"] = this.frame.object_code;



    let wsdp = [];

    if (this.l_where_str) {
      wscp.where_str = this.l_where_str.join(" ");
    } else {
      wscp.where_str = null;
    }
    if (wscp.service_type == "execute_query") {

      wsdp = this.globalObjects.getWsdp("").wsdp;
    } else {
      wsdp = this.wsdp;
    }
    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
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
            this.loadingCount = 0;
            this.formatTableData(a_from_row, a_to_row, tableData);
            this.frame.tableRows = this.tableRows;

            // this.frame.tableRows =.push(tableRows);

            this.l_current_page = a_currentPage;
            if (this.l_current_page == 1) {
              this.c_to_row = Math.ceil(this.l_total_rows / (this.l_total_rows / this.frame.no_of_records));
              this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
              this.l_total_remain_pages = isNaN(this.l_total_remain_pages) ? 1 : this.l_total_remain_pages;
              this.c_from_row = Math.ceil((this.c_to_row - this.frame.no_of_records)) + 1;
              this.loadMoreFlag = "false";
            }
          } else {
            this.populateDataFromJson();
          }
        }, err => this.globalObjects.presentAlert('ERR PDB: ' + err))
      }
    }
    else {
      this.dataService.postData(l_url, reqData).then(res => {
        // this.globalObjects.hideLoading();

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

          if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
            this.globalObjects.presentAlert(objData.Level1[0].message);
          }

          let tableData = objData.Level1;
          this.tableData = tableData;
          if (tableData.length > 5) {
            // this.globalObjects.ShowLoadingNew();
          }
          for (let name of tableData) {
            if (name['APPS_PAGE_NAME']) {
              let obj = {
                object_code: this.frame.object_code,
                pageName: name['APPS_PAGE_NAME']
              }
              this.events.publish('pageName', obj);
            } if (name['APPS_PAGE_FRAME_NAME']) {
              this.frame.apps_page_frame_name = name['APPS_PAGE_FRAME_NAME'];
            }

            if (name['ITEM_VISIBLE_FLAG']) {
              if (name["ITEM_VISIBLE_FLAG"].indexOf("~") > -1) {
                let itemsArr = name["ITEM_VISIBLE_FLAG"].split("~");
                for (let itemGroup of this.frame.Level4) {
                  for (let item of itemGroup.Level5) {
                    for (let i of itemsArr) {
                      if (item.item_name.toUpperCase() == i.split("=")[0].toUpperCase()) {
                        item.item_visible_flag = i.split("=")[1];
                      }

                    }
                  }
                }
              } else {
                for (let itemGroup of this.frame.Level4) {
                  for (let item of itemGroup.Level5) {
                    if (item.item_name.toUpperCase() == name['ITEM_VISIBLE_FLAG'].split("=")[0]) {
                      item.item_visible_flag = name['ITEM_VISIBLE_FLAG'].split("=")[1];
                    }

                  }
                }
              }
            }

            if (name['ITEM_ENABLE_FLAG']) {
              if (name["ITEM_ENABLE_FLAG"].indexOf("~") > -1) {
                let itemsArr = name["ITEM_ENABLE_FLAG"].split("~");
                for (let itemGroup of this.frame.Level4) {
                  for (let item of itemGroup.Level5) {
                    for (let i of itemsArr) {
                      if (item.item_name.toUpperCase() == i.split("=")[0].toUpperCase()) {
                        item.item_enable_flag = i.split("=")[1];
                      }
                    }
                  }
                }
              } else {
                for (let itemGroup of this.frame.Level4) {
                  for (let item of itemGroup.Level5) {
                    if (item.item_name.toUpperCase() == name['ITEM_ENABLE_FLAG'].split("=")[0]) {
                      item.item_enable_flag = name['ITEM_ENABLE_FLAG'].split("=")[1];
                    }
                  }
                }
              }
            }

            if (name['DATA_REQUIRED_FLAG']) {
              if (name["DATA_REQUIRED_FLAG"].indexOf("~") > -1) {
                let itemsArr = name["DATA_REQUIRED_FLAG"].split("~");
                for (let itemGroup of this.frame.Level4) {
                  for (let item of itemGroup.Level5) {
                    for (let i of itemsArr) {
                      if (item.item_name.toUpperCase() == i.split("=")[0].toUpperCase()) {
                        item.data_required_flag = i.split("=")[1];
                      }
                    }
                  }
                }
              } else {
                for (let itemGroup of this.frame.Level4) {
                  for (let item of itemGroup.Level5) {
                    if (item.item_name.toUpperCase() == name['DATA_REQUIRED_FLAG'].split("=")[0]) {
                      item.data_required_flag = name['DATA_REQUIRED_FLAG'].split("=")[1];
                    }
                  }
                }
              }
            }

          }

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


          //    if(tableData.length > this.displayDataLen){
          let to = this.displayDataLen * a_currentPage;
          let from = to - this.displayDataLen;
          //  this.displayDataLen(from,to,a_currentPage);
          // }else{
          this.loadingCount = 0;
          this.formatTableData(from, to, a_currentPage);
          //  }



          this.loading = false;
          // this.frame.tableRows =.push(tableRows);

          this.l_current_page = a_currentPage;
          if (this.l_current_page == 1 && this.frame.no_of_records) {
            this.c_to_row = Math.ceil(this.l_total_rows / (this.l_total_rows / this.frame.no_of_records));
            this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
            this.l_total_remain_pages = isNaN(this.l_total_remain_pages) ? 1 : this.l_total_remain_pages;
            this.c_from_row = Math.ceil((this.c_to_row - this.frame.no_of_records)) + 1;
            this.loadMoreFlag = "false";
          }
          // if (this.l_current_page == 1) {
          //   this.c_to_row = Math.ceil(this.l_total_rows / (this.l_total_rows / this.displayDataLen));
          //   this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.displayDataLen);
          //   this.l_total_remain_pages = isNaN(this.l_total_remain_pages) ? 1 : this.l_total_remain_pages;
          //   this.c_from_row = Math.ceil((this.c_to_row - this.displayDataLen)) + 1;
          //   this.loadMoreFlag = "false";
          // }
        } else {

          this.loading = false;
        }

        // if (this.tableData.length <= 0) {
        //   if(!this.frame.tableRows || this.frame.tableRows.length <= 0){
        //     this.frame.tableRows = []
        //     this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
        //   }
        // }

        this.populateDataFromJson();
      }).catch(err => {

        // if (!this.frame.tableRows || this.frame.tableRows.length == 0) {
        //   this.frame.tableRows = [];
        //   if (this.frame.Level4.length > 0) {
        //     let flag = true;
        //     if (this.frame.Level4.length <= 2) {
        //       for (let itemGroup of this.frame.Level4) {
        //         for (let itemMast of itemGroup.Level5) {
        //           if (itemMast.item_type == "DELETE_ROW_BT") {
        //             flag = false;
        //           }
        //         }
        //       }
        //     }
        //     if (flag) {
        //       this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
        //     }
        //   }
        // }

        this.populateDataFromJson();
        this.globalObjects.hideLoading();
        this.globalObjects.presentToast("2 Something went wrong please try again later!");
        console.log(err);
      })
    }
  }

  formatTableData(from, to, a_currentPage) {

    if (this.tableData && this.tableData.length > 0) {
      let tableKey = Object.keys(this.tableData[0])
      this.l_total_rows = parseInt(this.tableData[0].TOTAL_ROWS);

      let data;

      if (this.filterAbleData.length > 0) {
        data = this.filterAbleData
      } else {
        data = this.tableData;
      }

      if (to > data.length) {
        to = data.length;
      }
      for (let i = from; i < to; i++) {
        let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
        let tHead = [];
        for (let itemGroup of frameLevel4) {
          for (let item of itemGroup.Level5) {
            for (let key of tableKey) {
              if (item.item_name.toUpperCase() == key.toUpperCase()) {
                item.value = data[i][key]
              }

            }


            if (item.item_visible_flag == "T") {
              if (item.item_type == "ADD_ROW_BT" || item.item_type == "DELETE_ROW_BT") { }
              else {
                if (item.item_type == 'CB') {
                  tHead.push(item.prompt_name);
                } else {
                  tHead.push(item.prompt_name);
                }
              }
            }
            if ((item.item_type == 'T' || item.item_type == 'N' || item.item_type == 'L') && item.item_visible_flag == 'T') {
              this.loadingCount++;
            }

            this.frame.tHead = tHead;
            item.indexcount = i;
          }
        }


        this.tableRows.push(frameLevel4);
      }
      this.l_current_page = a_currentPage;
      
      this.frame.tableRows = this.tableRows;
      this.calculateData(this.frame.tableRows,this.thead);
      this.calculate = true;
    }
    // setTimeout(() => {
    //   this.globalObjects.hideLoadingNew();
    //   this.showFlag = true;
    // }, this.loadingCount*130);
  }


  searchAllData() {
    this.frame.tableRows = [];
    this.tableRows = [];
    let vals = this.pipemy.transform(this.tableData, this.searchText);
    if (vals) {
      this.filterAbleData = vals;
    }

    if (vals.length == this.l_total_rows) {
      this.l_current_page = 1;
    }
    this.loadingCount = 0;
    // setTimeout(() => {
    //   if(this.showFlag){
    //     this.globalObjects.ShowLoadingNew();
    //     this.showFlag = false;
    //   }
    // },500);
    this.formatTableData(0, this.displayDataLen, 1);
  }





  calculateData(tableRows,head) {
    var lastRow: any = [];
    var maxMinNum = [];
    var avg = [];
    this.footerRowFlag = false;
    

 

    for (let i = 0; i < head.length; i++) {
      lastRow[i] = "";
    }

    for (let itemDataArr of tableRows) {
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
            if (!item.Level5[0].value) {
              item.Level5[0].value = "";
            }
            if (typeof (item.Level5[0].value) == "number") {
              item.Level5[0].value = JSON.stringify(item.Level5[0].value)
            }
            if (flag == 'S' && head.indexOf(item.Level5[0].prompt_name) > -1 && item.Level5[0].value) {
              if (lastRow[head.indexOf(item.Level5[0].prompt_name)]) {
                lastRow[head.indexOf(item.Level5[0].prompt_name)] = (parseFloat(lastRow[head.indexOf(item.Level5[0].prompt_name)]) + parseFloat(item.Level5[0].value.replace(/,/g, ''))).toFixed(deci);
              }
              else {
                lastRow[head.indexOf(item.Level5[0].prompt_name)] = parseFloat(item.Level5[0].value.replace(/,/g, '')).toFixed(deci);
              }
            }
            else if (flag == 'A' && head.indexOf(item.Level5[0].prompt_name) > -1 && item.Level5[0].value) {
              if (item.Level5[0].value) {
                avg.push(parseFloat(item.Level5[0].value.replace(/,/g, '')));
                lastRow[head.indexOf(item.Level5[0].prompt_name)] = Math.max.apply(null, maxMinNum);
                var sum = 0;
                for (var j = 0; j < avg.length; j++) {
                  sum += parseInt(avg[j], 10); //don't forget to add the base
                }
                lastRow[head.indexOf(item.Level5[0].prompt_name)] = (sum / avg.length).toFixed(deci);
              }
            }
            else if (flag == 'C' && head.indexOf(item.Level5[0].prompt_name) > -1 && item.Level5[0].value) {
              if (lastRow[head.indexOf(item.Level5[0].prompt_name)]) {
                lastRow[head.indexOf(item.Level5[0].prompt_name)] = (Math.round(parseFloat(lastRow[head.indexOf(item.Level5[0].prompt_name)].replace(/,/g, ''))) + 1).toFixed(deci);
              }
              else {
                lastRow[head.indexOf(item.Level5[0].prompt_name)] = 1;
              }
            }
            else if (flag == 'M' && head.indexOf(item.Level5[0].prompt_name) > -1 && item.Level5[0].value) {
              if (item.Level5[0].value) {
                maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, '')));
                lastRow[head.indexOf(item.Level5[0].prompt_name)] = (Math.min.apply(null, maxMinNum)).toFixed(deci);
              }
            }
          } else if (flag == 'X' && head.indexOf(item.Level5[0].prompt_name) > -1 && item.Level5[0].value) {
            if (item.Level5[0].value) {
              maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, '')));
              lastRow[head.indexOf(item.Level5[0].prompt_name)] = Math.max.apply(null, maxMinNum).toFixed(deci);
            }
          }
        }
      }
    }

    lastRow.shift();
    if (this.excelFlag) {
      this.excelRows = lastRow;
    } else {
      this.summaryRow = lastRow;
    }
  }


  itemClicked(event, rowsdata, i, j) {

    let isValid = true;
    var rowindex;
    let itemPKey = "";


    if (typeof (rowsdata) != "number") {
      for (let dataRow of rowsdata) {
        for (let r of dataRow.Level5) {
          if (r.item_name == "DB_TABLE_PKEY") {
            itemPKey = r.value;
          }
        }
      }
    }

    if (this.frame.frame_alias == 'LOV') {
      let data = [];
      for (let dataRow of rowsdata) {
        for (let r of dataRow.Level5) {
          if (r.item_type == "CB" && r.item_visible_flag == 'T') {
          } else {
            let obj = {
              key: this.frame.frame_alias + '.' + r.item_name,
              value: r.value
            }
            data.push(obj);
          }
        }
      }
      event.lovData = data;
      this.emitPass.emit(event);
      // let lovCloseFlag: boolean = true;

      // if (this.globalObjects.lovType && this.globalObjects.lovType == 'M') {
      //   lovCloseFlag = false;
      // }

      // if (lovCloseFlag) {
      //   event.lovData = data;
      //   let obj = {
      //     values: data[1].value,
      //     codeOfValues: data[0].value
      //   }
      //   this.globalObjects.lovObjData[0] = obj;
      //   this.emitPass.emit(event);
      // } else {
      //   let obj = {
      //     values: data[1].value,
      //     codeOfValues: data[0].value
      //   }
      //   let finObj = {
      //     value : obj,
      //     apps_item_seqid : ""
      //   }

      //   let glob = this.globalObjects.lovObjData.find(x => x.codeOfValues == data[0].value);

      //   if (glob) { } else {
      //     this.globalObjects.lovObjData.push(obj);
      //   }
      // }
    }


    if (rowindex == undefined || this.frame.calenderflag) {
      rowindex = j;
    }
    if ((event.click_events_str && event.click_events_str.indexOf("addItem") > -1) || (event.click_events_str && event.click_events_str.indexOf("addMirrorItem") > -1)) {
      let frameLevel4: any = JSON.parse(JSON.stringify(rowsdata));
      let theaddata: any = [];
      for (let itemGroup of frameLevel4) {

        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            item.item_default_value = "";
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

            let temp_click_event_str = item.click_events_str;
            item.click_events_str = "";
            item.temp_click_event_str = temp_click_event_str;

            if (item.item_type != "BT") {
              if (temp_click_event_str && (temp_click_event_str.indexOf("EDITABLE") > -1 || temp_click_event_str.indexOf("editable") > -1)) {
              } else {
                item.item_type = "TEXT";
              }
            }


            if (item.item_name == "SLNO") {
              item.value = this.item_slno_count;
              this.item_slno_count = this.item_slno_count + 1;
            }
            if (item.value) {

              item.isValid = true;
            }
            if (item.isValid !== undefined && !item.isValid) {
              isValid = item.isValid;
            }

            if (item.session_hold_flag == 'T') {
              if (this.sessionObj) {
                this.sessionObj[item.item_name] = item.value
              } else {
                this.sessionObj = {};
                this.sessionObj[item.item_name] = item.value
              }
            }
            if (item.item_visible_flag == 'T') {
              theaddata.push(item.prompt_name);
            }
          }
        }
      }

      let checkValidFrame = false;
      if (event.click_events_str && event.click_events_str.indexOf("checkValidFrame") > -1) {
        let arr = event.click_events_str.split("#");
        let frmseq = arr[event.click_events_str.indexOf("checkValidFrame")].split("~")[1];
        if (this.frame.apps_page_frame_seqid == frmseq) {
          checkValidFrame = true;
        }
      }
      if (checkValidFrame && !isValid) {
        for (let itemGroup of rowsdata) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.isValid !== undefined && !item.isValid) {
                item.touched = true;
              }
            }
          }
        }
        this.globalObjects.clickedbutton = false;

        this.globalObjects.presentAlert("Please correct all the errors and enter valid input")
      }
      else {
        if (event.click_events_str && event.click_events_str.indexOf("checkValidFrame") > -1) {
          let arr = event.click_events_str.split("#");
          arr.splice([event.click_events_str.indexOf("checkValidFrame")], 1);
          event.click_events_str = arr.join("#");
        }
      }
      //this.frame.tableRows[rowindex] = JSON.parse(JSON.stringify(this.frame.Level4));
      for (let itemGroup of rowsdata) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.session_hold_flag == 'T') {
              if (this.sessionObj) {
                item.value = this.sessionObj[item.item_name];
              }
            }
          }
        }
      }
      if (isValid) {

        event.tHead = theaddata;
        event.ADD_ITEM = frameLevel4;
        // this.emitPass.emit(event);
      }

    }


    ///////////////////////////////////////////////////////


    if (event.click_events_str && (event.click_events_str.indexOf("editItem") > -1) || event.click_events_str == "deleteItem") {
      rowindex = j;
    }

    let col = {};
    if (this.frame.tableRows.length > 0) {
      for (let itemGroup of rowsdata) {
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
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
    event.wscp = this.wscp_send_input;

    if (event.click_events_str && (event.click_events_str.indexOf("editItem") > -1)) {
      let frameLevel4 = JSON.parse(JSON.stringify(rowsdata))
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
            item.item_type = item.temp_item_type;
            let temp_click_event_str = item.temp_click_event_str;
            item.temp_click_event_str = "";
            item.click_event_str = temp_click_event_str;
          }
        }
      }
      this.frame.tableRows.splice(rowindex, 1);
      event.EDIT_ITEM = frameLevel4;
      this.emitPass.emit(event);
    } else if (event.click_events_str == "deleteItem") {
      if (this.frame.tableRows && this.frame.tableRows.length > 1) {
        this.frame.tableRows.splice(rowindex, 1);
      } else {
        if (this.frame.tableRows) {
          for (let itemGroup of this.frame.tableRows[0]) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                item.value = "";
              }
            }
          }
        }
      }
    }
    else {
      event.wsdp = [];
      let col = {};
      if (this.frame.tableRows.length > 0) {
        for (let itemGroup of rowsdata) {
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
    }

    if (this.frame.tableRows.length > 0) {
      for (let itemGroup of rowsdata) {
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

    if (event.click_events_str && event.click_events_str.indexOf("checkValidRow") > -1) {
      let checkValidFrame = true;

      for (let itemGroup of rowsdata) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            // if ((!item.isValid && item.item_visible_flag != 'F')) {
            //   isValid = false
            //   item.touched = true;
            // }

            if ((item.isValid !== undefined && !item.isValid && item.item_visible_flag != 'F')) {
              isValid = item.isValid;
              item.touched = true;
            }
          }
        }
      }

      // this.globalObjects.clickedbutton = false;

      if (!isValid) {
        this.globalObjects.presentAlert("Please correct all the errors and enter valid input")
      } else { }

      // let arr = event.click_events_str.split("#");
      // arr.splice([event.click_events_str.indexOf("checkValidRow")], 1);
      // event.click_events_str = arr.join("#");
    }


    if (isValid) {
      event.sessionObj = this.sessionObj;
      event.itemIndex = rowindex;
      event.itemPKey = itemPKey;
      // event.itemIndex = i;
      this.emitPass.emit(event);
    }

  }

  // itemClicked(event, i) {
  //   event.wsdp = [];
  //   let col = {};
  //   if (this.frame.tableRows.length > 0) {
  //     for (let itemGroup of this.frame.tableRows[i]) {
  //       if (itemGroup.Level5) {
  //         for (let item of itemGroup.Level5) {
  //           col[item.apps_item_seqid] = item.value
  //           if (item.session_hold_flag == 'T') {
  //             if (this.sessionObj) {
  //               this.sessionObj[item.item_name] = item.value
  //             } else {
  //               this.sessionObj = {};
  //               this.sessionObj[item.item_name] = item.value
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   event.sessionObj = this.sessionObj;
  //   event.frameSeqNo = this.frame.apps_page_frame_seqid;
  //   event.wsdp.push(col);
  //   event.wsdpcl = [];
  //   event.wsdpcl.push(col);
  //   event.itemIndex = i;
  //   this.emitPass.emit(event);
  // }

  //-------table order by start

  getFilterParameter(event) {
    this.l_where_str = event.where_str;
    this.paginate(1);
  }

  deleteRows(i) {
    if (this.frame.tableRows.length > 1) {
      this.frame.tableRows.splice(i, 1);
      let j = 0;
      for (let frameLevel4 of this.frame.tableRows) {
        for (let itemGroup of frameLevel4) {
          for (let itemMast of itemGroup.Level5) {
            itemMast.indexcount = j

          }
        }
        j++;
      }
    } else {
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
      let flag = true;
      if (frameLevel4.length <= 2) {
        for (let itemGroup of frameLevel4) {
          for (let itemMast of itemGroup.Level5) {
            if (itemMast.item_type == "DELETE_ROW_BT") {
              flag = false;
            }

          }
        }
      }
      if (flag) {
        this.frame.tableRows[0] = frameLevel4;
      } else {
        this.frame.tableRows.splice(i, 1);
      }
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


  populateDataFromJson() {

    if (this.globalObjects.allFrameJsonData.length > 0) {
      for (let g of this.globalObjects.allFrameJsonData) {
        if ((g.frame_name == this.frame.apps_page_frame_seqid || g.frame_name == this.frame.frame_alias)) {
          for (let p of g.paraData) {



            if (p.paraType == 'IV') {
              for (let i of p.frameData) {
                let str = "";
                let val = [];
                let rowIndex = i.key ? i.key - 1 : 0;

                for (let im of i.items) {
                  str = str + im.item_name + ",";
                  val.push(im.para_value);
                }

                let valObj = {
                  rowData: val,
                  pageNo: this.frame.apps_page_no
                }
                let itemName = g.frame_name + "[" + str + "]";
                this.lhs_lib.set_row_values(itemName, valObj, rowIndex);

              }
            }

            if (p.paraType == 'SC') {
              for (let i of p.frameData) {
                this.lhs_lib.set_rows_source_config(g.frame_name, i.items, 0);
              }
            }


          }
        }
      }
    }

    if (this.globalObjects.callingPara.length > 0) {
      for (let glob of this.globalObjects.callingPara) {
        if (glob.objectCode == this.frame.object_code && (glob.frameName && (glob.frameName == this.frame.frame_seq_id || glob.frameName == this.frame.frame_alias)) && glob.rowIndex) {
          if (this.frame.tableRows && this.frame.tableRows[glob.rowIndex]) {
            for (let itemGroup of this.frame.tableRows[glob.rowIndex]) {
              for (let item of itemGroup.Level5) {

                for (let i of glob.itmData) {
                  let itemName = i.split(":=");
                  if (item.item_name.toUpperCase() == itemName[0].toUpperCase()) {
                    item.value = itemName[1];
                  }
                }
              }
            }
          }
        }
      }
    }

    this.loading = false;

    if (this.frame.tableRows) {
      if (!this.frame.tableRows || this.frame.tableRows.length == 0) {
        this.frame.tableRows = [];
        if (this.frame.Level4.length > 0) {
          let flag = true;
          if (this.frame.Level4.length <= 2) {
            for (let itemGroup of this.frame.Level4) {
              for (let itemMast of itemGroup.Level5) {
                if (itemMast.item_type == "DELETE_ROW_BT") {
                  flag = false;
                }
              }
            }
          }
          if (flag) {
            this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
            if (this.globalObjects.callingPara.length > 0) {
              for (let glob of this.globalObjects.callingPara) {
                if (glob.objectCode == this.frame.object_code) {
                  if (this.frame.tableRows && this.frame.tableRows[0]) {
                    for (let itemGroup of this.frame.tableRows[0]) {
                      for (let item of itemGroup.Level5) {
                        if (item.item_visible_flag != 'T') {
                          for (let i of glob.itmData) {
                            let itemName = i.split(":=");
                            if (item.item_name.toUpperCase() == itemName[0].toUpperCase()) {
                              item.value = itemName[1];
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      if (!this.frame.tableRows || this.frame.tableRows.length == 0) {
        this.frame.tableRows = [];
        if (this.frame.Level4.length > 0) {
          let flag = true;
          if (this.frame.Level4.length <= 2) {
            for (let itemGroup of this.frame.Level4) {
              for (let itemMast of itemGroup.Level5) {
                if (itemMast.item_type == "DELETE_ROW_BT") {
                  flag = false;
                }
              }
            }
          }
          if (flag) {
            this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
            if (this.globalObjects.callingPara.length > 0) {
              for (let glob of this.globalObjects.callingPara) {
                if (glob.objectCode == this.frame.object_code) {
                  if (this.frame.tableRows && this.frame.tableRows[0]) {
                    for (let itemGroup of this.frame.tableRows[0]) {
                      for (let item of itemGroup.Level5) {
                        if (item.item_visible_flag != 'T') {
                          for (let i of glob.itmData) {
                            let itemName = i.split(":=");
                            if (item.item_name.toUpperCase() == itemName[0].toUpperCase()) {
                              item.value = itemName[1];
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      // this.frame.tableRows = [];
      // this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
    }
  }

  getDataForGraph(fileType, shareType) {
    let grapgRows = [];
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = "1";
    wscp.to_row = "1000000";
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
    wscp.file_download_type = fileType;

    if (this.l_where_str && this.getcanvasWCP) {
      wscp.where_str = this.l_where_str;
    } else if (this.l_where_str && this.filter) {
      wscp.where_str = this.l_where_str.join(" ");
    } else if (this.l_where_str && this.flagtoruncanvasfilter) {
      wscp.where_str = this.l_where_str;
    } else {
      wscp.where_str = null;
    }

    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    var data = {
      wslp: this.userDetails,
      wscp: wscp,
      wsdp: this.wsdp,
      wsdpcl: this.wsdpcl
    };

    if (this.frame.on_frame_load_str) {

      let l_url = "S2U";
      // this.dataService.postData(l_url, data).then(res => {
      //   let data: any = res;
      //   if (data.responseStatus == "success") {
      //     let objData = this.globalObjects.setPageInfo(data.responseData);
      //     let tableData = objData.Level1;
      //     if (tableData && tableData.length > 0) {
      //       let tableKey = Object.keys(tableData[0]);
      //       this.l_total_rows = tableData[0].TOTAL_ROWS;
      //       for (let table of tableData) {
      //         let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
      //         for (let itemGroup of frameLevel4) {
      //           for (let item of itemGroup.Level5) {
      //             for (let key of tableKey) {
      //               if (item.item_name.toUpperCase() == key.toUpperCase()) {
      //                 item.value = table[key];
      //               }
      //             }
      //           }
      //         }
      //         grapgRows.push(frameLevel4);
      //       }
      //     }
      //   }
      // }).then(() => {
      if (this.tableData && this.tableData.length > 0) {
        let tableKey = Object.keys(this.tableData[0]);
        this.l_total_rows = this.tableData[0].TOTAL_ROWS;
        for (let table of this.tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if (item.item_name.toUpperCase() == key.toUpperCase()) {
                  item.value = table[key];
                }
              }
            }
          }
          grapgRows.push(frameLevel4);
        }
      }
      this.excelFlag = true;
      this.calculateData(grapgRows, this.excelheads);
      this.excelFlag = false;
      if (fileType == "pdf") {
        this.downloadPDF(grapgRows, shareType, this.excelRows);
      } else if (fileType == "excel") {
        this.downloadExcel(grapgRows);
      } else if (fileType == "print") {

        window.frames["print_frame"].document.write('<html><head><title>Table Contents</title>');
        window.frames["print_frame"].document.write('<style> body{font-family: Arial;font-size: 10pt;} table{border: 1px solid #ccc;border-collapse: collapse;} table thead{background: #5e656d !important;}');
        window.frames["print_frame"].document.write('table thead th{background: #5e656d !important;font-weight: bold;color:#000;border: 1px solid #ccc;font-size:17px;padding:5px;text-align:center;}  table tbody tr td{font-size:15px;color: #423f3f;padding: 4px 6px 10px 2px;text-align:center;border: 1px solid #ccc;} table tbody tr:nth-child(even){background-color: #f2f2f2;}</style>');
        window.frames["print_frame"].document.write('</head>');
        window.frames["print_frame"].document.write('<body>');
        window.frames["print_frame"].document.body.innerHTML = document.getElementById(this.tab).innerHTML;
        window.frames["print_frame"].document.write('<body>');
        window.frames["print_frame"].document.write('</html>');
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();

      }

      // });
    } else {
      grapgRows = this.frame.tableRows;
      if (fileType == "pdf") {

        this.downloadPDF(grapgRows, shareType, this.summaryRow);
      } else if (fileType == "excel") {
        this.downloadExcel(grapgRows);
      } else if (fileType == "print") {

        window.frames["print_frame"].document.write('<html><head><title>Table Contents</title>');
        window.frames["print_frame"].document.write('<style> body{font-family: Arial;font-size: 10pt;} table{border: 1px solid #ccc;border-collapse: collapse;} table thead{background: #5e656d !important;}');
        window.frames["print_frame"].document.write('table thead th{background: #5e656d !important;font-weight: bold;color:#000;border: 1px solid #ccc;font-size:17px;padding:5px;text-align:center;}  table tbody tr td{font-size:15px;color: #423f3f;padding: 4px 6px 10px 2px;text-align:center;border: 1px solid #ccc;} table tbody tr:nth-child(even){background-color: #f2f2f2;}</style>');
        window.frames["print_frame"].document.write('</head>');
        window.frames["print_frame"].document.write('<body>');
        window.frames["print_frame"].document.body.innerHTML = document.getElementById(this.tab).innerHTML;
        window.frames["print_frame"].document.write('<body>');
        window.frames["print_frame"].document.write('</html>');
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();

      }
    }


  }

  excelCol: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ', 'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DI', 'DJ', 'DK', 'DL', 'DM', 'DN', 'DO', 'DP', 'DQ', 'DR', 'DS', 'DT', 'DU', 'DV', 'DW', 'DX', 'DY', 'DZ', 'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI', 'EJ', 'EK', 'EL', 'EM', 'EN', 'EO', 'EP', 'EQ', 'ER', 'ES', 'ET', 'EU', 'EV', 'EW', 'EX', 'EY', 'EZ', 'FA', 'FB', 'FC', 'FD', 'FE', 'FF', 'FG', 'FH', 'FI', 'FJ', 'FK', 'FL', 'FM', 'FN', 'FO', 'FP', 'FQ', 'FR', 'FS', 'FT', 'FU', 'FV', 'FW', 'FX', 'FY', 'FZ', 'GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GJ', 'GK', 'GL', 'GM', 'GN', 'GO', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GV', 'GW', 'GX', 'GY', 'GZ', 'HA', 'HB', 'HC', 'HD', 'HE', 'HF', 'HG', 'HH', 'HI', 'HJ', 'HK', 'HL', 'HM', 'HN', 'HO', 'HP', 'HQ', 'HR', 'HS', 'HT', 'HU', 'HV', 'HW', 'HX', 'HY', 'HZ', 'IA', 'IB', 'IC', 'ID', 'IE', 'IF', 'IG', 'IH', 'II', 'IJ', 'IK', 'IL', 'IM', 'IN', 'IO', 'IP', 'IQ', 'IR', 'IS', 'IT', 'IU', 'IV', 'IW', 'IX', 'IY', 'IZ', 'JA', 'JB', 'JC', 'JD', 'JE', 'JF', 'JG', 'JH', 'JI', 'JJ', 'JK', 'JL', 'JM', 'JN', 'JO', 'JP', 'JQ', 'JR', 'JS', 'JT', 'JU', 'JV', 'JW', 'JX', 'JY', 'JZ', 'KA', 'KB', 'KC', 'KD', 'KE', 'KF', 'KG', 'KH', 'KI', 'KJ', 'KK', 'KL', 'KM', 'KN', 'KO', 'KP', 'KQ', 'KR', 'KS', 'KT', 'KU', 'KV', 'KW', 'KX', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LD', 'LE', 'LF', 'LG', 'LH', 'LI', 'LJ', 'LK', 'LL', 'LM', 'LN', 'LO', 'LP', 'LQ', 'LR', 'LS', 'LT', 'LU', 'LV', 'LW', 'LX', 'LY', 'LZ', 'MA', 'MB', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MI', 'MJ', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NB', 'NC', 'ND', 'NE', 'NF', 'NG', 'NH', 'NI', 'NJ', 'NK', 'NL', 'NM', 'NN', 'NO', 'NP', 'NQ', 'NR', 'NS', 'NT', 'NU', 'NV', 'NW', 'NX', 'NY', 'NZ', 'OA', 'OB', 'OC', 'OD', 'OE', 'OF', 'OG', 'OH', 'OI', 'OJ', 'OK', 'OL', 'OM', 'ON', 'OO', 'OP', 'OQ', 'OR', 'OS', 'OT', 'OU', 'OV', 'OW', 'OX', 'OY', 'OZ', 'PA', 'PB', 'PC', 'PD', 'PE', 'PF', 'PG', 'PH', 'PI', 'PJ', 'PK', 'PL', 'PM', 'PN', 'PO', 'PP', 'PQ', 'PR', 'PS', 'PT', 'PU', 'PV', 'PW', 'PX', 'PY', 'PZ', 'QA', 'QB', 'QC', 'QD', 'QE', 'QF', 'QG', 'QH', 'QI', 'QJ', 'QK', 'QL', 'QM', 'QN', 'QO', 'QP', 'QQ', 'QR', 'QS', 'QT', 'QU', 'QV', 'QW', 'QX', 'QY', 'QZ', 'RA', 'RB', 'RC', 'RD', 'RE', 'RF', 'RG', 'RH', 'RI', 'RJ', 'RK', 'RL', 'RM', 'RN', 'RO', 'RP', 'RQ', 'RR', 'RS', 'RT', 'RU', 'RV', 'RW', 'RX', 'RY', 'RZ', 'SA', 'SB', 'SC', 'SD', 'SE', 'SF', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SQ', 'SR', 'SS', 'ST', 'SU', 'SV', 'SW', 'SX', 'SY', 'SZ', 'TA', 'TB', 'TC', 'TD', 'TE', 'TF', 'TG', 'TH', 'TI', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TP', 'TQ', 'TR', 'TS', 'TT', 'TU', 'TV', 'TW', 'TX', 'TY', 'TZ', 'UA', 'UB', 'UC', 'UD', 'UE', 'UF', 'UG', 'UH', 'UI', 'UJ', 'UK', 'UL', 'UM', 'UN', 'UO', 'UP', 'UQ', 'UR', 'US', 'UT', 'UU', 'UV', 'UW', 'UX', 'UY', 'UZ', 'VA', 'VB', 'VC', 'VD', 'VE', 'VF', 'VG', 'VH', 'VI', 'VJ', 'VK', 'VL', 'VM', 'VN', 'VO', 'VP', 'VQ', 'VR', 'VS', 'VT', 'VU', 'VV', 'VW', 'VX', 'VY', 'VZ', 'WA', 'WB', 'WC', 'WD', 'WE', 'WF', 'WG', 'WH', 'WI', 'WJ', 'WK', 'WL', 'WM', 'WN', 'WO', 'WP', 'WQ', 'WR', 'WS', 'WT', 'WU', 'WV', 'WW', 'WX', 'WY', 'WZ', 'XA', 'XB', 'XC', 'XD', 'XE', 'XF', 'XG', 'XH', 'XI', 'XJ', 'XK', 'XL', 'XM', 'XN', 'XO', 'XP', 'XQ', 'XR', 'XS', 'XT', 'XU', 'XV', 'XW', 'XX', 'XY', 'XZ', 'YA', 'YB', 'YC', 'YD', 'YE', 'YF', 'YG', 'YH', 'YI', 'YJ', 'YK', 'YL', 'YM', 'YN', 'YO', 'YP', 'YQ', 'YR', 'YS', 'YT', 'YU', 'YV', 'YW', 'YX', 'YY', 'YZ', 'ZA', 'ZB', 'ZC', 'ZD', 'ZE', 'ZF', 'ZG', 'ZH', 'ZI', 'ZJ', 'ZK', 'ZL', 'ZM', 'ZN', 'ZO', 'ZP', 'ZQ', 'ZR', 'ZS', 'ZT', 'ZU', 'ZV', 'ZW', 'ZX', 'ZY', 'ZZ']

  // downloadPDF(grapgRows, shareType, footer) {
  //   let data: any = [];
  //   let count: number = 0;
  //   let array: any = [];
  //   array[0] = [];
  //   array[0] = JSON.parse(JSON.stringify(this.thead));
  //   for (let trows of grapgRows) {
  //     count++;
  //     for (let trows2 of trows) {
  //       if (trows2.Level5[0].item_visible_flag == "T") {
  //         data.push(trows2.Level5[0].value);
  //       }
  //     }
  //     array[count] = [];
  //     array[count] = JSON.parse(JSON.stringify(data));
  //     data = [];
  //   }

  //   let headerdata: any;

  //   headerdata = JSON.parse(JSON.stringify(array));
  //   let foot;
  //   if (this.footerRowFlag) {
  //     foot = JSON.parse(JSON.stringify(this.summaryRow));
  //   }
  //   if (shareType) {
  //     this.globalObjects.emailSendOfTableData(shareType, headerdata, this.pdfHeading, foot);
  //   } else {

  //     this.globalObjects.downloadPdf('', headerdata, this.pdfHeading, foot);
  //   }

  //   console.log(this.thead);
  // }

  downloadPDF(grapgRows, shareType, footer) {
    let data: any = [];
    let count: number = 0;
    let array: any = [];
    array[0] = [];
    array[0] = JSON.parse(JSON.stringify(this.thead));
    let imageURlArr = [];
    for (let trows of grapgRows) {
      count++;
      for (let trows2 of trows) {
        if (trows2.Level5[0].item_visible_flag == "T") {
          if (trows2.Level5[0].item_type == "DISPLAY_PHOTO") {
            if (trows2.Level5[0].value) {
              imageURlArr.push(trows2.Level5[0].value)
            } else {
              imageURlArr.push("");
            }
          } else {
            if (trows2.Level5[0].value && trows2.Level5[0].value.indexOf("~") > -1) {
              let bg = trows2.Level5[0].value.split("~")[1]
              let bgcolor = {};
              try {
                bgcolor = JSON.parse(bg);
              } catch (error) {
                bgcolor["background-color"] = "";
              }
              let obj = { text: trows2.Level5[0].value.split("~")[0], fillColor: bgcolor["background-color"] };
              data.push(obj);
            } else {
              data.push(trows2.Level5[0].value);
            }
          }
        }
      }

      array[count] = [];
      array[count] = JSON.parse(JSON.stringify(data));
      data = [];
    }

    console.log(imageURlArr);

    let headerdata: any;

    headerdata = JSON.parse(JSON.stringify(array));
    let foot;
    if (this.footerRowFlag) {
      foot = JSON.parse(JSON.stringify(this.summaryRow));
    }
    let fileName = this.frame.apps_page_frame_name ? this.frame.apps_page_frame_name : this.pdfHeading;
    if (shareType) {
      this.globalObjects.emailSendOfTableData(shareType, headerdata, fileName, foot);
    } else {
      if (imageURlArr.length > 0) {
        this.getImages(imageURlArr, headerdata, fileName, foot);
      } else {
        this.globalObjects.downloadPdf('', headerdata, fileName, foot);
      }
    }
    console.log(this.thead);
  }

  async getImages(imgArr, headerdata, frame_name, foot) {
    let temp1 = [];
    for (let i of imgArr) {
      if (i) {
        let url = 'getItemImage?query=' + encodeURIComponent(i);
        await this.dataService.getData(url)
          .then(res => {
            console.log(res);
            var data: any = res;
            if (data.status == 'success') {
              temp1.push({
                image: 'data:image/png;base64,' + data.img, width: 100,
                height: 100
              });
            } else {
              temp1.push("");
            }
          }, err => {
            console.log("ImgDataErr " + JSON.stringify(err));
            temp1.push("");
          })
      } else {
        temp1.push("");
      }
    }
    let count = 1;
    for (let obj of temp1) {
      headerdata[count].push(obj);
      count++;
    }

    console.log(headerdata);
    if (imgArr.length == temp1.length) {
      this.globalObjects.downloadPdf('', headerdata, frame_name, foot);
    }
  }


  downloadExcel(grapgRows) {
    console.log("Excel", grapgRows);
    let tableData = [];
    for (let trows of grapgRows) {
      let data = [];
      for (let trows2 of trows) {
        if (trows2.Level5) {
          for (let item of trows2.Level5) {
            if (item.item_visible_flag == "T") {
              if (item.item_type == 'BT' || item.item_type == 'DISPLAY_PHOTO' || item.item_type == 'DOWNLOAD_DOC') {
              } else {
                data.push(item.value + "~" + item.datatype);
              }
            }
          }
        }
      }
      tableData.push(data);
    }
    const workbook = new Excel.Workbook();
    workbook.creator = "lhsapp";
    workbook.lastModifiedBy = "lhsapp";
    const worksheet = workbook.addWorksheet("Sheet1", {
      horizontalCentered: true,
      verticalCentered: true,
      paperSize: 9,
      orientation: "portrait",

      margins: { left: 0.3149606, right: 0.3149606, top: 0.3543307 }
    });
    worksheet.addRow([]);
    let titleRow = worksheet.addRow([this.pdfHeading]);
    titleRow.font = { size: 16, bold: true };
    titleRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: " 29a3a3" }
        // bgColor: { argb: 'FF0000FF' }
      };
      cell.font = {
        name: 'Arial',
        color: { argb: '000' },
        size: 16,
        bold: true
      };

    });
    let subTitleRow = worksheet.addRow([
      "Date : " + this.datePipe.transform(new Date(), "medium")
    ]);
    subTitleRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffffff" }
        // bgColor: { argb: 'FF0000FF' }
      };


    });

    let headerRow = worksheet.addRow(this.excelheads);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffff99" }
        // bgColor: { argb: 'FF0000FF' }
      };
      cell.font = {
        name: 'Arial',
        color: { argb: '000' },

        size: 14,
      };
      // cell.border = {
      //   top: { style: "dotted" },
      //   left: { style: "dotted" },
      //   bottom: { style: "dotted" },
      //   right: { style: "dotted" }
      // };
    });

    let rowIndex = 1;
    tableData.forEach(d => {
      let row = worksheet.addRow(d);
      if (rowIndex % 2 === 0) {
        row.eachCell((cell, number) => {

          if (cell.value.toString().split("~")[1] == "NUMBER") {
            cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
          } else {
            cell.value = (cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "";
          }
          // if (isNaN(cell.value)) {

          // } else {
          //   cell.value = parseFloat(cell.value);
          // }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ffffff" }

            // pattern: v,
            // fgColor: { argb: "" }
            // bgColor: { argb: 'FFFF0000' }
          };
          // cell.border = {
          //   top: { style: "dotted" },
          //   left: { style: "dotted" },
          //   bottom: { style: "dotted" },
          //   right: { style: "dotted" }
          // };
        });
      } else {
        row.eachCell((cell, number) => {

          if (cell.value.toString().split("~")[1] == "NUMBER") {
            cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
          } else {
            cell.value = (cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "";
          }

          // if (isNaN(cell.value)) {  
          // } else {
          //   cell.value = parseFloat(cell.value);
          // }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ffffff" }
            // type: v,
            // pattern: "solid",
            // fgColor: { argb: "" }
            // bgColor: { argb: '' }
          };
          // cell.border = {
          //   top: { style: "dotted" },
          //   left: { style: "dotted" },
          //   bottom: { style: "dotted" },
          //   right: { style: "dotted" }
          // };
        });
      }
      rowIndex++;
    });
    if (this.footerRowFlag) {
      let f = JSON.parse(JSON.stringify(this.summaryRow));
      let footerrow = worksheet.addRow(f);
      footerrow.eachCell((cell, number) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffff99" }
          // bgColor: { argb: 'FF0000FF' }
        };
      })
    }
    //   worksheet.eachRow({ includeEmpty: true },function(row, rowNumber){
    //     row.eachCell( function(cell, colNumber){
    //         if( rowNumber<tableData.length){
    //           row.getCell(colNumber).border = {
    //           top: { style: "dotted" },
    //           left: { style: "dotted" },
    //           bottom: { style: "dotted" },
    //           right: { style: "dotted" }
    //         };

    //         }

    //     });
    // });
    for (let i = 4; i <= (tableData.length + 4); i++) {
      for (let l = 0; l < this.excelheads.length; l++) {

        worksheet.getCell(this.excelCol[l] + i).border = {
          top: { style: "dotted" },
          left: { style: "dotted" },
          bottom: { style: "dotted" },
          right: { style: "dotted" },

        };

        // Excel.ValueType.Number
      }
    }
    // worksheet.columns.forEach(column => {
    //   column.border = {
    //     top: { style: "thick" },
    //     left: { style: "thick" },
    //     bottom: { style: "thick" },
    //     right: { style: "thick" }
    //   };
    // });

    let fileName = this.frame.apps_page_frame_name ? this.frame.apps_page_frame_name : ""
    workbook.xlsx.writeBuffer().then(data => {
      this.globalObjects.downloadExcel(data, fileName);
    });
  }

}

