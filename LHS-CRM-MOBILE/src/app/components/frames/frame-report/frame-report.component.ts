import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Events, ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PouchDBService } from 'src/app/services/pouch-db.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';

@Component({
  selector: 'app-frame-report',
  templateUrl: './frame-report.component.html',
  styleUrls: ['./frame-report.component.scss'],
})
export class FrameReportComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;

  current_page_parameter: any = {};
  thead: any = {};
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

  scrollClass = "";

  constructor(private globalObjects: GlobalObjectsService, private events: Events, private dataService: DataService,
    private pouchDBService: PouchDBService, public modalController: ModalController, private sqlServ: SqlLiteService) {
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
            this.wscp_send_input = res.wscp;
            this.wsdp = res.wsdp;
            this.tableRows = [];
            this.frame.tableRows = [];
            this.frame.verticalTable = [];

            this.loading = true;
            this.summaryRow = [];
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

          if (itemMast.item_type == "BT" || itemMast.item_type == "BT") { }
          else {
            theaddata.push(itemMast.prompt_name);
          }
        }

        itemMast.indexCount = 0;
      }

      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }
    }

    let frameFilterFlag = this.frame.frame_filter_flag;

    if (frameFilterFlag && frameFilterFlag.indexOf("TABLE_SCROLL") > -1) {
      this.scrollClass = "table-scroll";
    }

    this.frame.tableRows = [];
    if (this.frame.Level4.length > 0) {

      this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
    }
    this.thead = theaddata;
    this.frame.tHead = this.thead;
    this.paginate(1);
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
    wscp.orignal_apps_item_seqid = this.wscp_send_input.orignal_apps_item_seqid;
    wscp.origin_apps_item_seqid = this.wscp_send_input.origin_apps_item_seqid;
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

      this.dataService.postData(l_url, reqData).then(res => {
        this.globalObjects.hideLoading();

        let data: any = res;
        if (data.responseStatus == "success") {

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

          this.formatTableData(tableData);

          this.frame.tableRows = this.tableRows;

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

}
