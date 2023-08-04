import { Component, OnInit, Input, Output, EventEmitter, NgZone, ChangeDetectorRef } from "@angular/core";
import { GlobalObjectsService } from "src/app/services/global-objects.service";
import { DataService } from "src/app/services/data.service";
import { LoadingController, ModalController,  Platform } from "@ionic/angular";
import { Events } from 'src/app/demo-utils/event/events';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { DatePipe } from "@angular/common";
import { SqlLiteService } from "src/app/services/sql-lite.service";
import { SearchfilterPipe } from "src/app/pipes/searchfilter.pipe";
import { DeveloperModeLogPage } from "src/app/pages/developer-mode-log/developer-mode-log.page";
import { debug } from "console";
// import { SpeechRecognitionService } from "@kamiazya/ngx-speech-recognition";
import { CdkDragDrop, transferArrayItem } from "@angular/cdk/drag-drop";
declare var $:any;

@Component({
  selector: "app-frame-table",
  templateUrl: "./frame-table.component.html",
  styleUrls: ["./frame-table.component.scss"]
})
export class FrameTableComponent implements OnInit {
  mikeStyle: any;
  @Input() frame: any = {};
  @Input() resforgraph: any = {};
  @Input() wscp: any = {};
  flagtoruncanvasfilter: boolean; //jsdagysgdfsd
  //frametable: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitForPdf: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  current_page_parameter: any = {};
  developerModeData: any;
  clickShare: boolean = false;
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
  flagforgraph: boolean = false;

  whereStrFlag: boolean = false;

  filterFormData: any = [];

  mainHead = [];
  tab:any;
  public show: boolean = false;
  public show_filter: any = "dontshow";
  public horizontal_table: any = "Show";
  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;

  loadMoreFlag: string;
  summaryRow: any[];
  pdfHeading: any;

  graphFlag: any = false;
  searchFlag: any = false;
  pdfFlag: any = false;
  excelFlag: any = false;
  canvasfilter: any = false;
  getcanvasWCP: boolean = false;
  filter: boolean = false;
  toggleFilter: boolean = false;
  jsFilter: any;
  advanceFilter: any;
  enablefunnel: boolean = false;
  showLoading: boolean = false;

  footerRowFlag: boolean = false;

  callingObjectArr: any = [];
  decimalhigh: any = [];
  plt = "browser";
  subscribeRefreshFlag = false;
  scrollClass = "";
  switchFlag: boolean = false;
  order_by_str;
  stickyhead: { position: string; top: string; "z-index": string; };

  apexNgStyleFlag: boolean = false;
  apexNgStyle;

  displayFixedRecord: boolean = false;
  displayFixedrecordLength = 50;

  controlBreakFlag: boolean = false;
  controlBreakArr: any = [];
  controlBreakHead: any = [];

  tableData = [];
  showingTabelData = [];
  apexTableRows = [];

  dragedDiv = [];
  parentHead = [];
  groupByFlag: boolean = false;

  groupFlag: boolean = false;
  pivotTable: boolean = false;

  funArr = [];

  filterAbleData = [];

  freezeColArr = [];
  excelheads: any = {};
  filterFlag:boolean = false;
  tableScroll = {};
  pivotTableData = [];
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe, private zone: NgZone, private sqlServ: SqlLiteService,
    public loadingController: LoadingController, public modalCtrl: ModalController,
    private events: Events, public modalController: ModalController,
    private platform: Platform, private pipemy: SearchfilterPipe) {
    if (!this.platform.is('android') && !this.platform.is('ios')) {
      // this.service.onstart = (e) => {
      //   console.log('onstart');
      // };
      // this.service.onresult = (e) => {
      //   this.searchText = e.results[0].item(0).transcript;
      //   console.log('SubComponent:onresult', this.searchText, e);
      // };
    }

    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.tbodyHeight = document.body.clientHeight - 210 + "px";

    if (this.platform.is("ios")) {
      this.plt == "ios";
    }
    if(this.platform.is("android")) {
      this.plt == "android"
    }
   
  }

  sppeak() {
    
    //this.service.start();
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      if(stream){
             this.mikeStyle="blink_text";
            setTimeout(()=>{
              this.mikeStyle=""   
           },4000)
           }
    }).catch(err => {
      
        alert("Mic not detected")
      
    })
  }

  getdataFromcanvasApex(event) {

    console.log(event);
    /* if (event.apex_show_col) {

      this.thead = event.thead;
      this.frame.tableRows = event.apex_show_col;
    } */
    if (event.ngStyle) {
      this.apexNgStyle = event.ngStyle;
      this.apexNgStyleFlag = true
    }
    else if (event.apex_orderBy_str) {
      this.getcanvasWCP = true;
      this.order_by_str = event.apex_orderBy_str;
      this.frame.order_by_str = this.order_by_str;
      this.controlBreakArr = [];
      this.whereStrFlag = true;
      this.paginate(1);
    } else if (event.visibleItems) {
     // this.thead = event.thead;
      this.summaryRow = [];
      this.frame.tableRows = [];
      this.controlBreakArr = [];
      this.generateApexLevel4();
      this.paginate(1);
    }
    // else if (event.apex_where_str) {
    //   this.getcanvasWCP = true;
    //   this.l_where_str = event.apex_where_str;
    //   this.frame.l_where_str = this.l_where_str;
    //   this.controlBreakArr = [];
    //   this.whereStrFlag = true;
    //   this.paginate(1);
    // } 
    else if (event.filteredData) {
      this.summaryRow = [];
      this.frame.tableRows = [];
      this.controlBreakArr = [];
      this.filterAbleData = event.filteredData;
      if(this.filterAbleData.length > 0){
        this.paginate(1);
      }else{
        this.tableRows = [];
        this.frame.tableRows = [];
      }
    }
    else if (event.funArr || event.groupBy) {

      if (event.groupBy) {
        this.funArr = event.groupBy.funArr;
        this.controlBreakFlag = false;
        this.groupFlag = true;

      } else {

        this.funArr = event.funArr;
      }
      this.generateApexLevel4();
      this.paginate(1);
    } else if (event.noOfRecords) {

      if (this.displayFixedRecord) {
        this.displayFixedrecordLength = parseInt(event.noOfRecords);
      } else {
        this.frame.no_of_records = event.noOfRecords;
      }
      this.frame.tableRows = [];
      this.controlBreakArr = [];
      this.paginate(1);
    } else if (event.ctrlBreakArr) {
      if (event.ctrlBreakArr.length > 0) {
        this.controlBreakFlag = true;
        this.groupFlag = false;
      }
      this.controlBreakArr = [];
      this.displayData(0, this.displayFixedrecordLength, 1);
    } else if (event.searchTabData) {
      this.frame.searchTabData = event.searchTabData;
      this.controlBreakArr = [];
      this.displayData(0, this.displayFixedrecordLength, 1);
    } else if (event.clear) {
      // this.frame.searchTabData = event.searchTabData;
      if (event.clear == 'groupBy') {
        this.groupFlag = false;
        this.funArr = [];
        this.frame.tableRows = [];
        this.frame.apexFrameLevel4 = [];
        this.thead = this.mainHead;
        if (event.head) {
          this.thead = event.head;
        }
        this.frame.tableRows = [];
        this.controlBreakArr = [];
        this.paginate(1);
      } if (event.clear == 'All') {
        this.displayFixedrecordLength = 50;
        this.controlBreakFlag = false;
        this.groupFlag = false;
        this.frame.tableRows = [];
        this.frame.controlBreakArr = [];
        this.filterAbleData = [];
        this.frame.apexFrameLevel4 = [];
        this.thead = this.mainHead;
        this.ngOnInit();
      }
      // this.displayData(0, this.displayFixedrecordLength, 1);
    } else if (event.freezeCol) {
      this.freezeColArr = event.freezeCol;
      this.frame.tableRows = [];
      this.frame.controlBreakArr = [];
      this.generateApexLevel4();
      this.paginate(1);
    } else if (event.showPivot) {
      // this.displayFixedrecordLength = 50;
      // this.controlBreakFlag = false;
      // this.groupFlag = false;
      // this.frame.tableRows = [];
      // this.frame.controlBreakArr = [];
      // this.filterAbleData = [];
      // this.frame.apexFrameLevel4 = [];

      this.pivotTable = true;
      
    }

    if (event.headclasses) {
      this.frame.headclasses = event.headclasses;

    }
    if (event.headLength) {
      this.frame.freezLength = event.headLength;
    } else {
      this.frame.freezLength = 0;
      // this.paginate(1);
    }
  }

  generateApexLevel4() {
    let framelevel4 = [];
    this.frame.apexFrameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    framelevel4 = this.frame.apexFrameLevel4;

    let coloumnHead = [];
    let funhead = [];
    let theaddata = [];
    for (let itemGroup of framelevel4) {
      for (let itemMast of itemGroup.Level5) {

        for (let f of this.funArr) {
          if (f.coloumns.item_name == itemMast.item_name) {
            funhead.push(itemMast.prompt_name)
            itemMast.summary_flag = f.fun;
          }
        }

        if (this.frame.ctrlBrkCond) {
          for (let c of this.frame.ctrlBrkCond) {
            if (c.coloumns) {
              if (c.coloumns.item_name == itemMast.item_name) {
                let val = coloumnHead.find(x => x == itemMast.prompt_name);
                if (val) { } else {
                  coloumnHead.push(itemMast.prompt_name);
                }
              }
            } else {
              if (c.itemName == itemMast.item_name) {
                coloumnHead.push(itemMast.prompt_name)
                itemMast.item_visible_flag = 'F';
              }
            }
          }
        }

        if (this.frame.visibleItems) {

          let visible = this.frame.visibleItems.find(x => x.item_name == itemMast.item_name);
          if (visible) {
            itemMast.item_visible_flag = 'T'
          } else {
            itemMast.item_visible_flag = 'F'
          }

        }
        if (this.freezeColArr.length > 0) {
          for (let f of this.freezeColArr) {
            if (itemMast.prompt_name == f.prompt_name) {
              itemMast.freezeColumn = f.style;
            }
          }
        }

        if(itemMast.item_visible_flag == 'T'){
          if(itemMast.freezeColumn){
            let obj = {
              prompt_name:itemMast.prompt_name,
              frezeStyle:itemMast.freezeColumn
            }
            theaddata.push(obj);
          }else{
            theaddata.push(itemMast.prompt_name);
          }
        }

      }
    }
    for (let x of funhead) {
      coloumnHead.push(x);
    }
    this.thead = theaddata;
    this.parentHead = coloumnHead;
    this.controlBreakArr = [];
    this.frame.tableRows = [];
  }


  getParsed(json) {
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

  onSwitch() {
    this.globalObjects.switchCardData = this.tableData;
    this.globalObjects.switchSearchStr = this.searchText;
    this.frame.apps_frame_type = 'CARD'
  }


  ngOnInit() {
    let name = "refreshFrame" + ((this.frame.apps_page_frame_seqid).toString().replace(/-/g, "_") + this.globalObjects.refreshId);
    if (!this.subscribeRefreshFlag) {
      this.events.subscribe(name, res => {
        for (let f of res.refreshFrame) {
          if (f.key == this.frame.apps_page_frame_seqid && f.val == "T") {
            f.val = "F";
            this.wscp_send_input = res.wscp;
            this.wsdp = res.wsdp;
            this.wsdpcl = res.wsdpcl;
            this.tableData = [];
            this.tableRows = [];
            this.frame.tableRows = [];
            this.frame.verticalTable = [];
            this.displayFixedRecord = false;
            this.zone.run(() => {
              this.showLoading = true;
              this.summaryRow = [];
              this.ngOnInit();
            });
          }
        }
      });
      this.subscribeRefreshFlag = true;
    }

    this.events.subscribe("skipFilter", () => {
      this.filter = false;
      this.toggleFilter = false;
      this.show_filter = "dontshow";
      // this.paginate(1);
    });

    console.log("this is from table", this.frame);
    if(this.platform.is('ios')){
      this.plt = 'ios'
    }else if(this.platform.is('android')){
      this.plt = 'android';
    }


    this.frame.tableRows = [];
    this.frame.verticalTable = [];

    this.tab=this.frame.apps_page_frame_seqid;
    let frameFilterFlag = this.frame.frame_filter_flag ? this.frame.frame_filter_flag.split("#") : [];
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
      if (x === 'TABLE_SCROLL') {
        if(this.frame.no_of_records){
          let height = ((450/13) * parseInt(this.frame.no_of_records));
          this.tableScroll = {"max-height" : height.toFixed(0) + "px", "overflow-y" : "scroll"};
        }else{
          this.scrollClass = "table-scroll";
        }
        this.stickyhead = {
          "position": "sticky",
          "top": "-1px",
          "z-index": "9"
        }
      }
      if (x === 'STC') {
        this.switchFlag = true;
      }


    }
    let exelHeads:any=[];
    let theaddata: any = [];
    let apexHeads: any = [];
    let apexAggriHead: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }

        console.log(
          itemMast.item_type.indexOf("WHERE") > -1 ||
          itemMast.item_visible_flag == "F" ||
          (this.current_page_parameter.MODE &&
            itemMast.item_visible_flag &&
            itemMast.item_visible_flag.indexOf(
              this.current_page_parameter.MODE
            ) > -1)
        );
        if (
          itemMast.item_type.indexOf("WHERE") > -1 || itemMast.item_visible_flag == "F" || (this.current_page_parameter.MODE && itemMast.item_visible_flag && itemMast.item_visible_flag.indexOf(
            this.current_page_parameter.MODE
          ) > -1)
        ) {
        } else {


          if (itemMast.display_setting_str) {
            if (typeof (itemMast.display_setting_str) === 'string') {
              try {
                let str = JSON.parse(itemMast.display_setting_str);
              } catch (e) {
                this.globalObjects.presentAlert("Error in display_setting_str format... ( " + itemMast.apps_item_seqid + " )");
                //break;
              }
            }
          }
          if (itemMast.column_width) {
            if (typeof (itemMast.column_width) === 'string') {
              try {
                let str = JSON.parse(itemMast.column_width);
              } catch (e) {
                this.globalObjects.presentAlert("Error in column_width format...");
                break;
              }
            }
          }

             if(itemMast.item_type=='BT' || itemMast.item_type=='DISPLAY_PHOTO' || itemMast.item_type=='DOWNLOAD_DOC'){

             }else{
               exelHeads.push(itemMast.prompt_name);
             }

          theaddata.push(itemMast.prompt_name);
          let obj = {
            prompt_name: itemMast.prompt_name,
            item_name: itemMast.item_name,
            aliases: itemMast.aliases
          }
          apexHeads.push(obj);
          if (itemMast.datatype == 'NUMBER') {
            apexAggriHead.push(obj);
          }
        }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }
    }
    this.excelheads=exelHeads;
    this.thead = theaddata;
    this.mainHead = theaddata;
    this.frame.apexAggriHead = apexAggriHead;
    this.frame.apextheads = this.thead;
    this.frame.apextheaders = apexHeads;
    this.frame.rowsPerPage = this.displayFixedrecordLength;
    this.frame.allTablerows = (JSON.parse(JSON.stringify(this.tableRows)));

    // if (frameFilterFlag) {
    //   if (frameFilterFlag.indexOf("S#") > -1) {
    //     this.searchFlag = true;
    //   }
    //   if (frameFilterFlag.indexOf("G#") > -1 ) {
    //     this.graphFlag = true;
    //   }
    //   if (frameFilterFlag.indexOf("P#") > -1) {
    //     this.pdfFlag = true;
    //   }
    //   if (frameFilterFlag.indexOf("E#") > -1) {
    //     this.excelFlag = true;
    //   }if(frameFilterFlag.indexOf("TABLE_SCROLL") > -1){
    //     this.scrollClass = "table-scroll";
    //   }

    //   if (
    //    ( frameFilterFlag.includes("C#") ||
    //     frameFilterFlag.includes("J#") ||
    //     frameFilterFlag.includes("A#")) 
    //   ) {
    //     this.filter = false;
    //     this.enablefunnel = true;
    //     var count1 = (frameFilterFlag.match(/J#/g) || []).length;
    //     var count2 = (frameFilterFlag.match(/C#/g) || []).length;
    //     var count3 = (frameFilterFlag.match(/A#/g) || []).length;

    //     if (count1 == 2 || count2 == 2 || count3 == 2) {
    //       this.filter = true;
    //       this.enablefunnel = true;
    //     }
    //   }
    // }
    if (this.frame.no_of_records && (parseFloat(this.frame.no_of_records) > (this.displayFixedrecordLength + 1))) {
      this.displayFixedRecord = true;
    }
   
      this.paginate(1);
    
  }

  itemValueChange(event, rowindex) {
    // var rowindex;
    // for(let dataRow of rowsdata){
    //   if(dataRow.Level5[0].item_name=="ROWNUMBER"){
    //      rowindex=dataRow.Level5[0].value - 1;
    //   }
    // }
    if (event.dependent_column_str) {
      let wsdp = [];
      let dependent_column_arr = event.dependent_column_str.split("#");
      if (this.frame.tableRows) {
        let col = {};
        for (let itemGroup of this.frame.tableRows[rowindex]) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues;
              } else {
                col[item.apps_item_seqid] = item.value;
              }
              if (dependent_column_arr.indexOf(item.apps_item_seqid) > -1) {
                item.codeOfValues = "";
                item.value = "";
              }
              if (item.formula_str) {
                item.value = this.globalObjects.autoCalculation(
                  item.formula_str,
                  this.frame.tableRows[rowindex]
                );
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
                item.codeOfValues = "";
                item.value = "";
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
              // setTimeout(() => this.PostTextValidatePlsql(event, rowindex), 3000);
              this.PostTextValidatePlsql(event, rowindex);
            }
          }
        });
      } else if (event.post_text_validate_plsql) {
        this.PostTextValidatePlsql(event, rowindex);
      }
    }
  }

  getDependentData(event, rowindex) {
    //console.log("this is event",event);
    this.globalObjects.showLoading();
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
        wslp: this.userDetails,
        wscp: wscp,
        wsdp: newWsdp
      };

      let l_url = "S2U";
      this.dataService
        .postData(l_url, data)
        .then(res => {
          this.globalObjects.hideLoading();
          let data: any = res;
          // console.log(data);

          if (data.responseStatus == "success") {
            let objData = this.globalObjects.setPageInfo(data.responseData);
            if (
              objData &&
              objData.Level1.length > 0 &&
              (objData.Level1[0].status == "F" ||
                objData.Level1[0].status == "Q")
            ) {
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
                    item.value =
                      keyValue.Values[0][
                      keyValue.Level1_Keys.indexOf(item.item_name)
                      ];
                  }
                }
              }
            }
          }
        })
        .catch(err => {
          console.log("this.frame canvas err");

          this.globalObjects.hideLoading();
          this.globalObjects.presentToast(
            "1.6 Something went wrong please try again later!"
          );
          console.log(err);
        });
    });
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

    var data = {
      wslp: this.userDetails,
      wscp: wscp,
      wsdp: event.wsdp
    };

    let l_url = "S2U";
    this.dataService
      .postData(l_url, data)
      .then(res => {
        this.globalObjects.hideLoading();
        let data: any = res;
        if (data.responseStatus == "success") {
          let objData = this.globalObjects.setPageInfo(data.responseData);
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
          if (
            objData.Level1[0].status == "F" ||
            objData.Level1[0].status == "Q"
          ) {
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
      })
      .catch(err => {
        this.globalObjects.hideLoading();
        this.globalObjects.presentToast("1.11 Something went wrong please try again later!");
      });
  }

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show) this.horizontal_table = "Hide";
    else this.horizontal_table = "Show";
  }

  getParsedJson(json, value) {
    if (json && JSON.parse(json)["background-color"] && JSON.parse(json)["background-color"].indexOf("$") > -1) {
      try {
        let cond = JSON.parse(json)["background-color"].split("$");
        let retVal: any = {};
        for (let c of cond) {
          let val = c.split("~");
          let newStr = "'" + value + "'" + val[0];
          let newVal = eval(newStr);

          if (newVal) {
            retVal["background-color"] = val[1];
          }
        }
        // console.log(retVal);
        return retVal;
      } catch (err) {
        if (typeof json == "object") {
          return json;
        } else {
          return {};
        }
      }
    } else {
      try {
        if (json) {
          return JSON.parse(json);
        } else {
          return {};
        }
      } catch (err) {
        if (typeof json == "object") {
          return json;
        } else {
          return {};
        }
      }
    }
  }

  paginate(a_current_page: number = 1) {
    // this.tableRows = [];
    let noOfRecords;
    if (this.displayFixedRecord) {
      noOfRecords = this.displayFixedrecordLength;
    } else {
      noOfRecords = this.frame.no_of_records
    }
    let fromRow;
    let toRow;

    let l_total_pages = Math.ceil(this.l_total_rows / noOfRecords);
    let L_total_pages = this.l_total_rows / noOfRecords;

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
      this.frame.tableRows = [];
      l_to_row = Math.ceil(this.l_total_rows / L_total_pages);
    } else {
      l_to_row = Math.ceil(this.l_total_rows / L_total_pages) * a_current_page;
    }

    l_from_row = Math.ceil(l_to_row - noOfRecords) + 1;

    this.c_from_row = l_from_row;
    this.c_to_row = l_to_row;

    // if (a_current_page!=1){
    //   this.l_total_remain_pages=Math.ceil(this.l_total_rows / this.frame.no_of_records)-(this.c_to_row-this.frame.no_of_records);
    // }

    if (a_current_page == 1 && this.filterAbleData.length <= 0) {
      this.callingObjectArr = [];
    }

    toRow = this.displayFixedrecordLength * a_current_page;
    fromRow = toRow - this.displayFixedrecordLength;

    if(toRow > this.l_total_rows){
      toRow = this.l_total_rows;
    }

    if(this.globalObjects.switchTableData.length > 0){
      this.tableData = this.globalObjects.switchTableData;
      this.searchText = this.globalObjects.switchSearchStr;
      this.displayData(0,this.globalObjects.switchTableData.length,1);
    }else{

    if (!this.filterFlag && ((this.displayFixedRecord && a_current_page > 1) || (this.displayFixedRecord && this.tableData.length > 0))
     && (this.tableData.length >= toRow)) {
      this.displayData(fromRow, toRow, a_current_page);
    } else {
      if (this.groupFlag) {
        this.controlBreakArr = [];
      }
      
      this.getData(l_from_row, l_to_row, a_current_page);
    }
  }

  }

  getData(a_from_row: number, a_to_row: number, a_currentPage: number) {
    this.whereStrFlag = false;
    this.showLoading = true;

    this.filterFlag = false;

    this.filterAbleData = [];
    
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = String(a_from_row);
    wscp.to_row = String(a_to_row);
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
    wscp.orignal_apps_item_seqid = this.wscp_send_input.orignal_apps_item_seqid;
    wscp.origin_apps_item_seqid = this.wscp_send_input.origin_apps_item_seqid;

    if (this.getcanvasWCP) {
      if (this.l_where_str) {
        wscp.where_str = this.l_where_str;
      } else if (this.order_by_str) {
        wscp.order_by_str = this.order_by_str;
      }
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

    let wsdp 
    if(wscp.service_type == "execute_query"){

      wsdp = this.globalObjects.getWsdp("").wsdp;
    }else{
      wsdp = this.wsdp;
    }
    var reqData = {
      wslp: this.userDetails,
      wscp: wscp,
      wsdp: wsdp,
      wsdpcl: this.wsdpcl
    };  

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
      let data: any = res;
      this.resforgraph = data;
      this.globalObjects.hideLoading();
      this.resforgraph.Level4 = JSON.parse(JSON.stringify(this.frame.Level4));
      this.resforgraph.flag = this.frame.flag;

      if (data.responseStatus == "success") {
        // Developer Mode Loging
        if (data.responseData.Level1_Keys.length > 0) {
          let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
          let wsSewId = id ? data.responseData.Values[0][id] : "";
          this.developerModeData = {
            ws_seq_id: wsSewId,
            frame_seq_id: reqData.wscp.apps_page_frame_seqid
          };
        }
        //Developer Mode Loging

        let count: number = 0;
        let dataofValues = JSON.parse(
          JSON.stringify(data.responseData.Values)
        ); // decimal coding start
        for (let valuesarr of dataofValues) {
          count++;
          let c: number = -1;
          for (let vals of valuesarr) {
            c++;
            if (vals) {
              if (!isNaN(vals)) {
                if (vals.includes(".")) {
                  parseFloat(vals);
                  var deciVal;
                  deciVal = vals.toString().split(".")[1].length || 0;
                  if (this.decimalhigh[c]) {
                    if (deciVal > this.decimalhigh[c]) {
                      this.decimalhigh[c] = deciVal;
                    }
                  } else {
                    this.decimalhigh[c] = [];
                    if (deciVal > this.decimalhigh[c]) {
                      this.decimalhigh[c] = deciVal;
                    }
                  }
                }
              }
            }
          }
        }

        let dataForValue = [];
        for (let valuesarr of data.responseData.Values) {
          let decimalArray = [];
          var cc: number = -1;
          for (let vals of valuesarr) {
            cc++;
            var dec = this.decimalhigh[cc];
            if (!isNaN(vals)) {
              if (this.decimalhigh[cc]) {
                if (vals && vals.includes(",")) {
                } else {
                  if (vals) {
                    vals = parseFloat(vals).toFixed(dec);
                  }
                }
              }
            }
            decimalArray.push(vals);
          }
          dataForValue.push(decimalArray);
        }
        console.log(dataForValue);
        data.responseData.Values = dataForValue; // decimal coding end example .09  to 0.09

        // let tableRows = [];
        // let tableData = data.responseData.Level1;
        // let tableKey = Object.keys(tableData[0])

        let objData = this.globalObjects.setPageInfo(data.responseData);

        //-------------------OFFLINE Table Data SAVE ---------------------------------------------------//
        if (objData && this.frame.apps_working_mode == "I") {
          let pouchObjectKey =
            this.frame.object_code + "_FRAME_" + this.frame.apps_page_frame_seqid;
          var temp: any = {};
          this.sqlServ.getById(pouchObjectKey, "frameData").then((localData: any) => {
            temp.objMast = JSON.stringify(objData);
            temp.id = pouchObjectKey;
            if (data.resStatus == "Success") {
              this.sqlServ.deleteObjMast(pouchObjectKey, "frameData").then(() => {
                this.sqlServ.postDataSql(temp, "frameData");
              });
            } else {
              this.sqlServ.postDataSql(temp, "frameData");
            }
          },
            err => {
              temp.id = pouchObjectKey;
              temp.objMast = JSON.stringify(objData);
              // objData._rev = "";
              this.sqlServ.postDataSql(temp, "frameData");
            }
          );
        }

        //-------------------OFFLINE Table Data SAVE ---------------------------------------------------//

        if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
          this.globalObjects.presentAlert(objData.Level1[0].message);
        } else {
          // For Getting *CALLING_OBJECT_CODE* from Frame //
          let callingObj = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
          for (let c of callingObj) {
            this.callingObjectArr.push(c);
          }

          // For Getting *CALLING_OBJECT_CODE* from Frame //

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

            this.tableData.push(name);
          }
          if (!this.displayFixedRecord) {
            if (tableData.length > (this.displayFixedrecordLength + 1)) {
              this.displayFixedRecord = true;
            }
          }



          // else {
          //   this.l_total_rows=null;
          //   this.frame.no_of_records=null;
          //   this.c_to_row=null;
          // }

          // ----------------- Aamir commented this code for display fixed number of records ----------------

          let pivotVal:any;
          if (this.displayFixedRecord) {
            this.frame.tableRows = [];

            this.frame.tableData = this.tableData;
            if (a_to_row) {
              this.displayData(0, a_to_row, 1);
            } else {

              this.displayData(0, this.displayFixedrecordLength, 1);
            }
          } else {
            this.pivotTableData = [];
            if (tableData && tableData.length > 0) {
              let indexcount: number = -1;
              let tableKey = Object.keys(tableData[0]);
              this.l_total_rows = tableData[0].TOTAL_ROWS;
              let pivotTableHeader :any;
              

              for (let table of tableData) {
                indexcount++;
                let frameLevel4;
                if (this.frame.apexFrameLevel4 && this.frame.apexFrameLevel4.length > 0) {
                  frameLevel4 = JSON.parse(JSON.stringify(this.frame.apexFrameLevel4));
                } else {
                  frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
                }
                let pivotTableItemData = [];
                let header = [];
                let pivotVal1 = [];
                for (let itemGroup of frameLevel4) {
                  for (let item of itemGroup.Level5) {
                    for (let key of tableKey) {
                      if (item.item_name.toUpperCase() == key.toUpperCase()) {
                        item.value = table[key];
                        if(item.item_visible_flag == 'T'){
                          header.push(item.prompt_name);
                          if(item.datatype == 'NUMBER'){
                            pivotVal1.push(item.prompt_name);
                            pivotTableItemData.push(parseFloat(table[key]) == NaN ? 0.00 :  parseFloat(table[key]));
                          }else{
                            pivotTableItemData.push(table[key]);
                          }
                        }
                        if (table[key] && (table[key].indexOf("~") > -1) && (table[key].indexOf("background-color") > -1)) {
                          let val = table[key].split("~");
                          let str = JSON.parse(val[1]);
                          item.value = val[0];
                          if (str["background-color"]) {
                            let obj = {
                              "background-color": str["background-color"]
                            };
                            item.tdStyle = JSON.stringify(obj);
                            delete str["background-color"];
                            item.display_setting_str = JSON.stringify(str);
                          }

                          else {
                            item.display_setting_str = val[1];
                          }
                        } else {
                          item.value = table[key];
                        }
                      }
                      if (item.display_setting_str && JSON.parse(item.display_setting_str)["background-color"] && JSON.parse(item.display_setting_str)["background-color"].indexOf("$") > -1) {

                        let str = JSON.parse(item.display_setting_str)
                        let obj = {
                          "background-color": str["background-color"]
                        };
                        item.tdStyle = JSON.stringify(obj);
                        delete str["background-color"];
                        item.display_setting_str = JSON.stringify(str);

                      }
                      item.indexcount = JSON.parse(JSON.stringify(indexcount));
                    }
                  }
                }
                this.pivotTableData.push(pivotTableItemData);
                pivotTableHeader = header;
                this.tableRows.push(frameLevel4);
                pivotVal = pivotVal1;
              }
              this.pivotTableData.unshift(pivotTableHeader);

              if (this.frame.flagtoclosefilter) {
                this.show_filter = "show";
                this.filterToggle();
              }


              ///----------- Shifted calculation code to below function ----//////

              this.calculateFunction(this.tableRows, this.thead);
              ////------------------///////////////

            }



            let finalDisplayTable = [];

            for (let data of this.tableRows) {
              let finalTableRow: any = [];
              let finalDataRow = [];
              for (let temp of data) {
                if (temp.Level5) {
                  for (let d of temp.Level5) {
                    let arr = [];
                    arr.push(d)
                    finalDataRow.push(arr);
                  }
                }
              }
              finalTableRow = finalDataRow;

              finalDisplayTable.push(finalTableRow);
            }
            console.log(this.frame);
            this.frame.tableRows = finalDisplayTable;
            this.showLoading = false;

            this.verticaldata();
          }
          // -------------------PIVOT TABLE DISPLAY------------------------
          if(this.frame.apps_frame_type == 'PIVOT-TABLE'){
  
            $("#output").pivotUI(
              this.pivotTableData, {
                rows: [this.pivotTableData[0][0]],
                vals: pivotVal,
                aggregatorName: "Sum over Sum",
                rendererName: "Table",
                renderers: $.extend(
                 $.pivotUtilities.renderers, 
                  $.pivotUtilities.plotly_renderers
                )
              });
          }

          //--------------------PIVOT TABLE DISPLAY-------------------------
          // this.frame.tableRows =.push(tableRows);
          this.pdfHeading = this.frame.apps_page_frame_name;

          this.l_current_page = a_currentPage;
          // vijay if current page =1 then
          if (this.l_current_page == 1) {
            this.c_to_row = Math.ceil(
              this.l_total_rows /
              (this.l_total_rows / this.frame.no_of_records)
            );
            // this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
            if (this.displayFixedRecord) {
              if (this.displayFixedrecordLength > 0) {
                this.l_total_remain_pages = Math.ceil(
                  this.l_total_rows / this.displayFixedrecordLength
                );
              } else {
                this.l_total_remain_pages = 1;
              }
            } else {
              if (this.frame.no_of_records > 0) {
                this.l_total_remain_pages = Math.ceil(
                  this.l_total_rows / this.frame.no_of_records
                );
              } else {
                this.l_total_remain_pages = 1;
              }
            }
            this.c_from_row =
              Math.ceil(this.c_to_row - this.frame.no_of_records) + 1;
            this.loadMoreFlag = "false";
          }
        }
      } else {
        this.showLoading = false;
      }
    })
      .catch(err => {
        this.showLoading = false;
        this.globalObjects.presentToast(
          "2 Something went wrong please try again later!"
        );
        console.log(err);
      });

  }


  calculateFunction(tablerows, heads) {

    var lastRow: any = [];
    var maxMinNum = [];
    var avg = [];
    this.footerRowFlag = false;
    let tableRows = [];
    if (tablerows) {
      tableRows = tablerows;
    } else {
      tableRows = this.tableRows;
    }

    let funrow = [];
    let head = heads

    for (let i = 0; i < head.length; i++) {
      for (let itemDataArr of tableRows) {
        for (let item of itemDataArr) {
          if (item.Level5) {
            if (item.Level5.length > 0 && item.Level5[0].summary_flag) {
              let flag: any;
              let deci: any;
              if (item.Level5[0].summary_flag.indexOf("#") > -1) {
                let summ = item.Level5[0].summary_flag.split("#");
                flag = summ[0];
                deci = summ[1];
              } else {
                flag = item.Level5[0].summary_flag;
              }
              if (flag == "S" || flag == "C" || flag == "A" || flag == "X" || flag == "M") {
                this.footerRowFlag = true;
                if (flag == "S" && item.Level5[0].prompt_name == this.thead[i]) {
                  if (item.Level5[0].value) {
                    if (lastRow[i]) {
                      lastRow[i] = (parseFloat(lastRow[i]) + parseFloat(item.Level5[0].value.replace(/,/g, ""))).toFixed(deci);
                    } else {
                      lastRow[i] = parseFloat(item.Level5[0].value.replace(/,/g, "")).toFixed(deci);
                    }
                  }
                }  else if (flag == "X" && item.Level5[0].prompt_name == this.thead[i]) {
                  if (item.Level5[0].value) {
                    maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, "")));
                    lastRow[i] = Math.max.apply(null, maxMinNum).toFixed(deci);
                  }
                }
                else if (flag == "A" && item.Level5[0].prompt_name == this.thead[i]) {
                  if (item.Level5[0].value) {
                    avg.push(parseFloat(item.Level5[0].value.replace(/,/g, "")));
                    // lastRow[i] = Math.max.apply(null,maxMinNum);
                    var sum = 0;
                    for (var j = 0; j < avg.length; j++) {
                      sum += parseInt(avg[j], 10); //don't forget to add the base
                    }
                    lastRow[i] = (sum / avg.length).toFixed(deci);
                  }
                } else if (flag == "C" && item.Level5[0].prompt_name == this.thead[i]) {
                  if (item.Level5[0].value) {
                    if (lastRow[i]) {
                      lastRow[i] = (Math.round(parseFloat(lastRow[i])) + 1).toFixed(deci);
                    } else {
                      lastRow[i] = 1;
                    }
                  }
                } else if (flag == "M" && item.Level5[0].prompt_name == this.thead[i]) {
                  if (item.Level5[0].value) {
                    maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, "")));
                    lastRow[i] = Math.min.apply(null, maxMinNum).toFixed(deci);
                  }
                }
              }
            } else {
              if (lastRow[i]) {
              } else {
                lastRow[i] = "";
              }
            }
          } else {

            if (item.length > 0 && item[0].summary_flag) {
              let flag: any;
              let deci: any;
              if (item[0].summary_flag.indexOf("#") > -1) {
                let summ = item[0].summary_flag.split("#");
                flag = summ[0];
                deci = summ[1];
              } else {
                flag = item[0].summary_flag;
              }
              if (flag == "S" || flag == "C" || flag == "A" || flag == "X" || flag == "M") {
                this.footerRowFlag = true;
                if (flag == "S" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    if (lastRow[i]) {
                      lastRow[i] = (parseFloat(lastRow[i]) + parseFloat(item[0].value.replace(/,/g, ""))).toFixed(deci);
                    } else {
                      lastRow[i] = (parseFloat(item[0].value.replace(/,/g, ""))).toFixed(deci);
                    }
                  }
                } else if (flag == "A" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    avg.push(parseFloat(item[0].value.replace(/,/g, "")));
                    // lastRow[i] = Math.max.apply(null,maxMinNum);
                    var sum = 0;
                    for (var j = 0; j < avg.length; j++) {
                      sum += parseInt(avg[j], 10); //don't forget to add the base
                    }
                    lastRow[i] = (sum / avg.length).toFixed(deci);
                  }
                } else if (flag == "C" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    if (lastRow[i]) {
                      lastRow[i] = (Math.round(parseFloat(lastRow[i])) + 1);
                    } else {
                      lastRow[i] = 1;
                    }
                  }
                } else if (flag == "M" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    let strVal = (item[0].value).toString();
                    if (strVal.indexOf(",")) {
                      item[0].value = strVal.replace(/,/g, "")
                    }
                    maxMinNum.push(parseFloat(item[0].value));
                    lastRow[i] = (Math.min.apply(null, maxMinNum));
                  }
                } else if (flag == "X" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    let strVal = (item[0].value).toString();
                    if (strVal.indexOf(",")) {
                      item[0].value = strVal.replace(/,/g, "")
                    }
                    maxMinNum.push(parseFloat(item[0].value));
                    lastRow[i] = (Math.max.apply(null, maxMinNum));
                  }
                }
              }


            } else {
              if (lastRow[i]) {
              } else {
                lastRow[i] = "";
              }
            }
            if (this.groupFlag) {
              let func = this.funArr.find(x => x.coloumns.item_name == item[0].item_name);
              if (func) {
                let f = funrow.find(x => x.key == item[0].prompt_name);
                if (f) {
                  if (lastRow[i]) {
                    f.key = item[0].prompt_name;
                    f.value = lastRow[i];
                  }
                } else {
                  let obj: any = {};
                  if (lastRow[i]) {
                    obj.key = item[0].prompt_name;
                    obj.value = lastRow[i];
                    funrow.push(obj);
                  } else {
                    obj.key = item[0].prompt_name;
                    obj.value = "0";
                    funrow.push(obj);
                  }
                }
              }
            }
          }
        }
      }
    }
    let row: any = [];
    for (let td of lastRow) {
      let x = td;
      x = x.toString();
      if (x.indexOf(".") > -1) {
        let array = x.split(".");
        x = array[0];

        let lastThree = x.substring(x.length - 3);
        let otherNumbers = x.substring(0, x.length - 3);

        if (otherNumbers != "") lastThree = "," + lastThree;
        let val = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        row.push(val.toString() + "." + array[1]);
      } else {
        let lastThree = x.substring(x.length - 3);
        let otherNumbers = x.substring(0, x.length - 3);

        if (otherNumbers != "") lastThree = "," + lastThree;
        let val = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        row.push(val);
      }
    }

    if (this.frame.apexFrameLevel4 && this.frame.apexFrameLevel4.length > 0 && (this.controlBreakFlag || this.groupFlag) && this.footerRowFlag) {
      let obj: any = {
        summRows: row
      };
      if (this.groupFlag) {
        obj.funrow = funrow
      }
      return obj;
    } else {
      this.summaryRow = row;
    }



  }



  createtableRows(from, to) {
    let tableData;
    if (this.filterAbleData.length > 0) {
      tableData = this.filterAbleData;
    } else {
      tableData = this.tableData;
    }
    let len;
    if(to > tableData.length){
      len = tableData.length;
    }else{
      len = to;
    }
    if (tableData && tableData.length > 0) {
      let indexcount: number = -1;
      let tableKey = Object.keys(tableData[0]);
      this.l_total_rows = tableData[0].TOTAL_ROWS;

      
      
      for (let i = from; i < len; i++) {
        indexcount++;
        let frameLevel4;
        if (this.frame.apexFrameLevel4 && this.frame.apexFrameLevel4.length > 0) {
          frameLevel4 = JSON.parse(JSON.stringify(this.frame.apexFrameLevel4));
        } else {
          frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
        }
        for (let itemGroup of frameLevel4) {
          for (let item of itemGroup.Level5) {
            for (let key of tableKey) {
              if (item.item_name.toUpperCase() == key.toUpperCase()) {
                item.value = tableData[i][key];

                if (tableData[i][key] && (tableData[i][key].indexOf("~") > -1) && (tableData[i][key].indexOf("background-color") > -1)) {
                  let val = tableData[i][key].split("~");
                  let str = JSON.parse(val[1]);
                  item.value = val[0];
                  if (str["background-color"]) {
                    let obj = {
                      "background-color": str["background-color"]
                    };
                    item.tdStyle = JSON.stringify(obj);
                    delete str["background-color"];
                    item.display_setting_str = JSON.stringify(str);
                  }

                  else {
                    item.display_setting_str = val[1];
                  }
                } else {
                  item.value = tableData[i][key];
                }
              }

              if (typeof (item.display_setting_str) == 'object') {
                JSON.stringify(item.display_setting_str);
              }
              if (item.display_setting_str && typeof (item.display_setting_str) == 'string' && JSON.parse(item.display_setting_str)["background-color"] && JSON.parse(item.display_setting_str)["background-color"].indexOf("$") > -1) {

                let str = JSON.parse(item.display_setting_str)
                let obj = {
                  "background-color": str["background-color"]
                };
                item.tdStyle = JSON.stringify(obj);
                delete str["background-color"];
                item.display_setting_str = JSON.stringify(str);

              }
              item.indexcount = JSON.parse(JSON.stringify(indexcount));
            }
          }
        }

        this.tableRows.push(frameLevel4);
      }

      if (this.frame.flagtoclosefilter) {
        this.show_filter = "show";
        this.filterToggle();
      }


      ///----------- Shifted calculation code to below function ----//////

     // this.calculateFunction(this.tableRows, this.thead);
      ////------------------///////////////
     
    }

  }


  verticaldata1() {
    let vals = this.pipemy.transform(this.frame.tableRows, this.searchText);
    this.frame.verticalTable = [];
    this.frame.verticalTable = this.globalObjects.transpose(vals);
  }
  
  verticaldata() {
    this.frame.verticalTable = this.globalObjects.transpose(
      this.frame.tableRows
    );
    console.log(this.frame.verticalTable);
  }


  searchAllData(){
    this.frame.tableRows = [];
    this.controlBreakArr = [];
    let vals = this.pipemy.transform(this.tableData, this.searchText);
    if(vals){
      this.filterAbleData = vals;
    }

    if(vals.length == this.l_total_rows){
      this.l_current_page = 1;
    }
    this.displayData(0,this.displayFixedrecordLength,1);
  }


  /* itemClickedVertical(event, rowsdata, i) {
    let array:any=[];
    let cnt:number=-1;
      for(let data of this.frame.verticalTable){
          array.push(data[i]);
      }
      console.log(array);
  
      event.callingObjectArr = this.callingObjectArr;
      event.wsdp = [];
      let col = {};
  
      var rowindex;
      for (let dataRow of array) {
        for (let r of dataRow) {
          if (r.item_name == "ROWNUMBER") {
            rowindex = r.value - 1;
          }
        }
      }
      if (!rowindex) {
        rowindex = i;
      }
      //  rowindex = i;
  
  
      for (let itemGroup of this.frame.tableRows[rowindex]) {
        if (itemGroup) {
          for (let item of itemGroup) {
            col[item.apps_item_seqid] = item.value
          }
        }
      }
      event.wsdp.push(col);
      event.wsdpcl = [];
      event.wsdpcl.push(col);
      event.itemIndex = rowindex;
  
      this.emitPass.emit(event);
    } */

  // ngAfterViewChecked (){
  //   if(this.globalObjects.fontype == ""){}else{
  //   this.globalObjects.increFont('',this.globalObjects.fontype);
  //   this.cdr.detectChanges();
  //   }
  //   if(this.globalObjects.fontSize>0.9){
  //     console.log("q")
  //     this.globalObjects.increFont(this.globalObjects.fontSize,'');
  //     this.cdr.detectChanges();
  //     }
  // }

  itemClicked(event, rowsdata, i) {
    event.callingObjectArr = this.callingObjectArr;
    event.wsdp = [];
    let col = {};

    var rowindex;
    for (let dataRow of rowsdata) {
      for (let r of dataRow) {
        if (r.item_name == "ROWNUMBER") {
          rowindex = r.value -1;
        }
      }
    }
    if (!rowindex) {
      rowindex = i;
    }
    //  rowindex = i;

    for (let itemGroup of rowsdata) {
      if (itemGroup) {
        for (let item of itemGroup) {
          col[item.apps_item_seqid] = item.value;
        }
      }
    }
    event.wsdp.push(col);
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    event.itemIndex = rowindex;

    this.emitPass.emit(event);
  }

  itemClickedVertical(event, rowsdata, i) {
    let array: any = [];
    let cnt: number = -1;
    for (let data of this.frame.verticalTable) {
      array.push(data[i]);
    }
    console.log(array);

    event.callingObjectArr = this.callingObjectArr;
    event.wsdp = [];
    let col = {};

    var rowindex;
    for (let dataRow of array) {
      for (let r of dataRow) {
        if (r.item_name == "ROWNUMBER") {
          rowindex = r.value - 1;
        }
      }
    }
    if (!rowindex) {
      rowindex = i;
    }
    //  rowindex = i;

    for (let itemGroup of this.frame.tableRows[rowindex]) {
      if (itemGroup) {
        for (let item of itemGroup) {
          col[item.apps_item_seqid] = item.value;
        }
      }
    }
    event.wsdp.push(col);
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    event.itemIndex = rowindex;

    this.emitPass.emit(event);
  }

  filterToggle() {
    if (this.show_filter == "show") {
      this.show_filter = "dontshow";
    } else {
      this.show_filter = "show";
      // let frameFilterFlag = this.frame.frame_filter_flag;
      // if (frameFilterFlag) {
      //   if (
      //     frameFilterFlag.indexOf("C#") > -1 ||
      //     frameFilterFlag.indexOf("J#") > -1 ||
      //     frameFilterFlag.indexOf("A#") > -1
      //   ) {
      //     this.toggleFilter = true;
      //   } else {
      //     this.toggleFilter = true;
      //   }

      // }
      let frameFilterFlag = this.frame.frame_filter_flag.split("#");
      for (let x of frameFilterFlag) {
        if (x === 'C' || x === 'J' || x === 'A' || x === 'ACTION' || x === 'D&D') {
          this.toggleFilter = true;
        } else {
          this.toggleFilter = true;
        }
      }
    }
  }

  //-------table order by start
  thClick(th, i) {
    let headindex = -1;
    for (let x of this.frame.tableRows[0]) {
      headindex++;
      if (th == x[0].prompt_name) {
        break;
      }
    }
    i = headindex;
    console.log(headindex)
    this.orderByParam.th = th;
    this.orderByParam.index = i;
    if (this.orderByParam.direction > 0) {
      this.orderByParam.direction = -1;
    } else {
      this.orderByParam.direction = 1;
    }

    this.frame.tableRows = this.frame.tableRows.sort((a, b) => {
      if (a[i][0].datatype == "NUMBER") {
        let newA;
        let newB
        if (a[i][0].value.includes(',')) {
          newA = JSON.parse(JSON.stringify(parseFloat(a[i][0].value.replace(/,/g, ""))));
          newB = JSON.parse(JSON.stringify(parseFloat(b[i][0].value.replace(/,/g, ""))));
        } else {
          newA = JSON.parse(JSON.stringify(parseFloat(a[i][0].value)));
          newB = JSON.parse(JSON.stringify(parseFloat(b[i][0].value)));
        }

        // newA= parseFloat(a[i][0].value.replace(/,/g, ""));
        // newB= parseFloat(b[i][0].value.replace(/,/g, ""));

        newA = newA ? newA : 0;
        newB = newB ? newB : 0;
        if (parseFloat(newA) < parseFloat(newB)) {
          return -1 * this.orderByParam.direction;
        } else if (parseFloat(newA) > parseFloat(newB)) {
          return 1 * this.orderByParam.direction;
        } else {
          return 0;
        }
      } else {
        a[i][0].value = a[i][0].value ? a[i][0].value : "";
        b[i][0].value = b[i][0].value ? b[i][0].value : "";
        if (a[i][0].value < b[i][0].value) {
          return -1 * this.orderByParam.direction;
        } else if (a[i][0].value > b[i][0].value) {
          return 1 * this.orderByParam.direction;
        } else {
          return 0;
        }
      }
    });
  }
  //-------table order by end

  getFilterParameter(event) {
    console.log(event.where_str);
    this.frame.flagtoclosefilter = event.flagtoclosefilter;
    this.l_where_str = event.where_str;
    this.getdataFromcanvasFilter(event);
    // this.paginate(1);
  }

  updateScroll(scrollOne: HTMLElement, scrollTwo: HTMLElement, scrollThree: HTMLElement, flag: any) {
    // do logic and set
    if (flag === 3) {
      scrollTwo.scrollLeft = scrollThree.scrollLeft;
      scrollOne.scrollLeft = scrollThree.scrollLeft;
    } else if (flag === 2) {
      scrollOne.scrollLeft = scrollTwo.scrollLeft;
      scrollThree.scrollLeft = scrollTwo.scrollLeft;
    } else if (flag === 1) {
      scrollTwo.scrollLeft = scrollOne.scrollLeft;
      scrollThree.scrollLeft = scrollOne.scrollLeft;
    }
  }
  // goToVoiceSearch()
  // {
  //   // this.navCtrl.setRoot("VoiceSearchPage-list");
  //   // this.router.navigate(['VoiceSearchPage-list']);

  // }

  openMike() {
    this.globalObjects.speechdata = "";
    this.globalObjects.startListening().then(res => {
      this.searchText = res;
    });
  }

  openbarcodescanner() {
    this.globalObjects.barcodescanner().then(res => {
      this.searchText = res;
    });
  }

  doInfinite(infiniteScroll): Promise<any> {
    return new Promise(() => {
      setTimeout(() => {
        // this.globalObjects.setDataLocally("pageNo", this.pageNo);
        this.paginate(this.l_current_page + 1);
        infiniteScroll.complete();
      }, 900);
    });
  }

  goToLast(lastRow, l_current_page) {
    this.l_current_page = l_current_page;
    this.tableRows = [];
    this.frame.tableRows = [];
   
    if(this.filterAbleData.length > 0){
      this.displayData(0,lastRow,l_current_page);
    }else{
      this.tableData = [];
      this.getData(1, lastRow, l_current_page);
    }
  }

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

      let im = [];
      for (let trows2 of trows) {
        if (trows2.Level5[0].item_visible_flag == "T") {
          if (trows2.Level5[0].item_type == "DISPLAY_PHOTO") {
            if (trows2.Level5[0].value) {
             // imageURlArr.push(trows2.Level5[0].value);
              im.push(trows2.Level5[0].value);
            } else {
              im.push("");
            //  imageURlArr.push("");
            }
          } else {
            data.push(trows2.Level5[0].value);
          }
        }
      }

      imageURlArr.push(im);
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
    let fileName = this.frame.apps_page_frame_name ? this.frame.apps_page_frame_name  : this.pdfHeading;
    if (shareType) {
      this.globalObjects.emailSendOfTableData(shareType, headerdata, fileName, foot);
    } else {
      if(imageURlArr.length > 0){
        this.getImages(imageURlArr,headerdata, fileName, foot);
      }else{
        this.globalObjects.downloadPdf('', headerdata, fileName, foot);
      }
    }
    console.log(this.thead);
  }

  async getImages(imgArr, headerdata, frame_name, foot) {
    let temp1 = [];
    for (let img of imgArr) {
      let temp2 = []
      for (let i of img) {
        if (i) {
          let url = 'getItemImage?query=' + encodeURIComponent(i);
          await this.dataService.getData(url)
            .then(res => {
              console.log(res);
              var data: any = res;
              if (data.status == 'success') {
                temp2.push({
                  image: 'data:image/png;base64,' + data.img, width: 100,
                  height: 100
                });
              } else {
                temp2.push("");
              }
            }, err => {
              console.log("ImgDataErr " + JSON.stringify(err));
              temp2.push("");
            })
        } else {
          temp2.push("");
        }
      }
      temp1.push(temp2);
    }

    let count = 1;
    for (let obj of temp1) {
      for(let obj1 of obj){
        headerdata[count].push(obj1);
      }
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
        if (trows2.Level5[0].item_visible_flag == "T") {
          if(trows2.Level5[0].item_type=='BT' || trows2.Level5[0].item_type=='DISPLAY_PHOTO' || trows2.Level5[0].item_type=='DOWNLOAD_DOC'){
          }else{
            data.push(trows2.Level5[0].value + "~" + trows2.Level5[0].datatype);
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
         
          if(cell.value.toString().split("~")[1] == "NUMBER"){
            cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
          }else{
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
    var today = new Date();
    let date = this.globalObjects.formatDate(today, "dd-MMM-yyyy")
    var time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
    var dateTime = date + ', ' + time;


    let fileName = this.frame.apps_page_frame_name ? this.frame.apps_page_frame_name + "[" + dateTime + "]" : null;

    workbook.xlsx.writeBuffer().then(data => {
      this.globalObjects.downloadExcel(data, fileName);
    });
  }

  createDOMTable(header, data) {
    console.log("head", header);
    console.log("data", data);
    // return new Promise((resolve,reject)=>{
    let table = document.createElement("table");
    // table.style. = '100px';
    // table.style.color = 'red';
    // table.className="gridtable";
    let thead = document.createElement("thead");
    thead.style.color = "red";
    let tbody = document.createElement("tbody");
    tbody.style.columnWidth = "11";
    tbody.style.borderColor = "green";
    let headRow = document.createElement("tr");

    for (let el of header) {
      let th = document.createElement("th");
      th.appendChild(document.createTextNode(el));
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    for (let el of data) {
      var tr = document.createElement("tr");
      for (var o in el) {
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(el[o]));
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
  }

  s2ab(book) {
    return new Promise((resolve, reject) => {
      let buf = new ArrayBuffer(book.length); //convert s to arrayBuffer
      let view = new Uint8Array(buf); //create uint8array as viewer
      for (let i = 0; i < book.length; i++) view[i] = book.charCodeAt(i) & 0xff; //convert to octet
      resolve(buf);
    });
  }

  opengraph() {
    this.flagforgraph = true;
  }

  getdataFromcanvasFilter(event) {
    if (event.apex) {
      this.getdataFromcanvasApex(event);
    } else {
      this.filterFlag = true;
      this.getcanvasWCP = true;
      this.tableRows = [];
      this.frame.tableRows = [];
      this.tableData = [];
      let array = [];
      this.filter = false;
      this.frame.flagtoclosefilter = event.flagtoclosefilter;

      array = event.where_str;

      this.l_where_str = [];
      if (array.length > 0) {
        for (let data of array) {
          console.log(data);
          this.l_where_str += data + "  ";
        }
      } else {
        this.l_where_str = "";
      }
      this.frame.l_where_str = this.l_where_str;
      this.paginate(1);
      console.log("array concate", this.l_where_str);
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

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        if (tableData && tableData.length > 0) {
          let tableKey = Object.keys(tableData[0]);
          this.l_total_rows = tableData[0].TOTAL_ROWS;
          for (let table of tableData) {
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
      }
    }).then(() => {

      if (fileType == "pdf") {

        this.downloadPDF(grapgRows, shareType, this.summaryRow);
      } else if (fileType == "excel") {
        this.downloadExcel(grapgRows);
      } else if (fileType == "print"){
     
        window.frames["print_frame"].document.write('<html><head><title>Table Contents</title>');
        window.frames["print_frame"].document.write('<style> img{max-width:100%;max-height:100%} body{font-family: Arial;font-size: 10pt;} table{border: 1px solid #ccc;border-collapse: collapse;} table thead{background: #5e656d !important;}');
        window.frames["print_frame"].document.write('table thead th{background: #5e656d !important;font-weight: bold;color:#000;border: 1px solid #ccc;font-size:17px;padding:5px;text-align:center;}  table tbody tr td{font-size:15px;color: #423f3f;padding: 4px 6px 10px 2px;text-align:center;border: 1px solid #ccc;} table tbody tr:nth-child(even){background-color: #f2f2f2;}</style>');
        window.frames["print_frame"].document.write('</head>');
        window.frames["print_frame"].document.write('<body>');
        window.frames["print_frame"].document.body.innerHTML = document.getElementById(this.tab).innerHTML;
        window.frames["print_frame"].document.write('<body>');
        window.frames["print_frame"].document.write('</html>');
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();

      }

    });

  }

  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: "my-custom-class",
      componentProps: {
        data: this.developerModeData
      }
    });
    return await modal.present();
  }

  getShare(event) {
    this.clickShare = false;
    this.getDataForGraph('pdf', event);

  }

  apexCondition(item) {
    if (this.apexNgStyleFlag) {
      if (this.apexNgStyle.condition.itmname == item.item_name) {
        let con = item.value + ' ' + this.apexNgStyle.condition.operator + ' ' + this.apexNgStyle.condition.value;
        if (eval(con)) {
          return this.apexNgStyle.style;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
    return null;
  }

  excelCol: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ', 'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DI', 'DJ', 'DK', 'DL', 'DM', 'DN', 'DO', 'DP', 'DQ', 'DR', 'DS', 'DT', 'DU', 'DV', 'DW', 'DX', 'DY', 'DZ', 'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI', 'EJ', 'EK', 'EL', 'EM', 'EN', 'EO', 'EP', 'EQ', 'ER', 'ES', 'ET', 'EU', 'EV', 'EW', 'EX', 'EY', 'EZ', 'FA', 'FB', 'FC', 'FD', 'FE', 'FF', 'FG', 'FH', 'FI', 'FJ', 'FK', 'FL', 'FM', 'FN', 'FO', 'FP', 'FQ', 'FR', 'FS', 'FT', 'FU', 'FV', 'FW', 'FX', 'FY', 'FZ', 'GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GJ', 'GK', 'GL', 'GM', 'GN', 'GO', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GV', 'GW', 'GX', 'GY', 'GZ', 'HA', 'HB', 'HC', 'HD', 'HE', 'HF', 'HG', 'HH', 'HI', 'HJ', 'HK', 'HL', 'HM', 'HN', 'HO', 'HP', 'HQ', 'HR', 'HS', 'HT', 'HU', 'HV', 'HW', 'HX', 'HY', 'HZ', 'IA', 'IB', 'IC', 'ID', 'IE', 'IF', 'IG', 'IH', 'II', 'IJ', 'IK', 'IL', 'IM', 'IN', 'IO', 'IP', 'IQ', 'IR', 'IS', 'IT', 'IU', 'IV', 'IW', 'IX', 'IY', 'IZ', 'JA', 'JB', 'JC', 'JD', 'JE', 'JF', 'JG', 'JH', 'JI', 'JJ', 'JK', 'JL', 'JM', 'JN', 'JO', 'JP', 'JQ', 'JR', 'JS', 'JT', 'JU', 'JV', 'JW', 'JX', 'JY', 'JZ', 'KA', 'KB', 'KC', 'KD', 'KE', 'KF', 'KG', 'KH', 'KI', 'KJ', 'KK', 'KL', 'KM', 'KN', 'KO', 'KP', 'KQ', 'KR', 'KS', 'KT', 'KU', 'KV', 'KW', 'KX', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LD', 'LE', 'LF', 'LG', 'LH', 'LI', 'LJ', 'LK', 'LL', 'LM', 'LN', 'LO', 'LP', 'LQ', 'LR', 'LS', 'LT', 'LU', 'LV', 'LW', 'LX', 'LY', 'LZ', 'MA', 'MB', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MI', 'MJ', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NB', 'NC', 'ND', 'NE', 'NF', 'NG', 'NH', 'NI', 'NJ', 'NK', 'NL', 'NM', 'NN', 'NO', 'NP', 'NQ', 'NR', 'NS', 'NT', 'NU', 'NV', 'NW', 'NX', 'NY', 'NZ', 'OA', 'OB', 'OC', 'OD', 'OE', 'OF', 'OG', 'OH', 'OI', 'OJ', 'OK', 'OL', 'OM', 'ON', 'OO', 'OP', 'OQ', 'OR', 'OS', 'OT', 'OU', 'OV', 'OW', 'OX', 'OY', 'OZ', 'PA', 'PB', 'PC', 'PD', 'PE', 'PF', 'PG', 'PH', 'PI', 'PJ', 'PK', 'PL', 'PM', 'PN', 'PO', 'PP', 'PQ', 'PR', 'PS', 'PT', 'PU', 'PV', 'PW', 'PX', 'PY', 'PZ', 'QA', 'QB', 'QC', 'QD', 'QE', 'QF', 'QG', 'QH', 'QI', 'QJ', 'QK', 'QL', 'QM', 'QN', 'QO', 'QP', 'QQ', 'QR', 'QS', 'QT', 'QU', 'QV', 'QW', 'QX', 'QY', 'QZ', 'RA', 'RB', 'RC', 'RD', 'RE', 'RF', 'RG', 'RH', 'RI', 'RJ', 'RK', 'RL', 'RM', 'RN', 'RO', 'RP', 'RQ', 'RR', 'RS', 'RT', 'RU', 'RV', 'RW', 'RX', 'RY', 'RZ', 'SA', 'SB', 'SC', 'SD', 'SE', 'SF', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SQ', 'SR', 'SS', 'ST', 'SU', 'SV', 'SW', 'SX', 'SY', 'SZ', 'TA', 'TB', 'TC', 'TD', 'TE', 'TF', 'TG', 'TH', 'TI', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TP', 'TQ', 'TR', 'TS', 'TT', 'TU', 'TV', 'TW', 'TX', 'TY', 'TZ', 'UA', 'UB', 'UC', 'UD', 'UE', 'UF', 'UG', 'UH', 'UI', 'UJ', 'UK', 'UL', 'UM', 'UN', 'UO', 'UP', 'UQ', 'UR', 'US', 'UT', 'UU', 'UV', 'UW', 'UX', 'UY', 'UZ', 'VA', 'VB', 'VC', 'VD', 'VE', 'VF', 'VG', 'VH', 'VI', 'VJ', 'VK', 'VL', 'VM', 'VN', 'VO', 'VP', 'VQ', 'VR', 'VS', 'VT', 'VU', 'VV', 'VW', 'VX', 'VY', 'VZ', 'WA', 'WB', 'WC', 'WD', 'WE', 'WF', 'WG', 'WH', 'WI', 'WJ', 'WK', 'WL', 'WM', 'WN', 'WO', 'WP', 'WQ', 'WR', 'WS', 'WT', 'WU', 'WV', 'WW', 'WX', 'WY', 'WZ', 'XA', 'XB', 'XC', 'XD', 'XE', 'XF', 'XG', 'XH', 'XI', 'XJ', 'XK', 'XL', 'XM', 'XN', 'XO', 'XP', 'XQ', 'XR', 'XS', 'XT', 'XU', 'XV', 'XW', 'XX', 'XY', 'XZ', 'YA', 'YB', 'YC', 'YD', 'YE', 'YF', 'YG', 'YH', 'YI', 'YJ', 'YK', 'YL', 'YM', 'YN', 'YO', 'YP', 'YQ', 'YR', 'YS', 'YT', 'YU', 'YV', 'YW', 'YX', 'YY', 'YZ', 'ZA', 'ZB', 'ZC', 'ZD', 'ZE', 'ZF', 'ZG', 'ZH', 'ZI', 'ZJ', 'ZK', 'ZL', 'ZM', 'ZN', 'ZO', 'ZP', 'ZQ', 'ZR', 'ZS', 'ZT', 'ZU', 'ZV', 'ZW', 'ZX', 'ZY', 'ZZ']







  displayData(from, to, a_currentPage) {

    // if(!this.controlBreakFlag){

    // }

   

    this.l_total_rows = this.tableData[0].TOTAL_ROWS; 

    let noOfRecords;
    if (this.displayFixedRecord) {
      noOfRecords = this.displayFixedrecordLength;
    } else {
      noOfRecords = this.frame.no_of_records
    }

    let l_total_pages = Math.ceil(this.l_total_rows / noOfRecords);

    this.l_total_remain_pages = l_total_pages;

    this.showLoading = true;
    this.globalObjects.switchTableData = [];
    this.globalObjects.switchSearchStr = "";

    if (!this.controlBreakFlag && !this.groupFlag) {
      this.tableRows = [];
      this.createtableRows(from, to);

      let finalDisplayTable = this.frame.tableRows;

      for (let tab of this.tableRows) {
        let finalTableRow: any = [];
        let finalDataRow = [];
        for (let temp of tab) {
          if (temp.Level5) {
            for (let d of temp.Level5) {
              let arr = [];
              arr.push(d)
              finalDataRow.push(arr);
            }
          }
        }
        finalTableRow = finalDataRow;

        finalDisplayTable.push(finalTableRow);
      }

      this.calculateFunction(finalDisplayTable, this.thead);
      console.log(this.frame);
      this.frame.tableRows = finalDisplayTable;
      this.showLoading = false;
     

    }

    if (this.controlBreakFlag || this.groupFlag) {
      this.frame.tableData = this.tableData;
      let cbArr = this.frame.ctrlBrkCond;
      let ctrlStr = "";
      let i = 0;
      for (let c of cbArr) {
        i++;
        let col = c.coloumns.item_name;
        if (c.status == 'Enabled') {
          if (i < cbArr.length) {
            ctrlStr += "item." + col.toUpperCase() + ',';
          } else {
            ctrlStr += "item." + col.toUpperCase();
          }
        }
      }

      // for (let i = from; i < to; i++){
      //   this.showingTabelData.push(this.tableData[i])
      // }

      console.log(ctrlStr);
      let tabdata = [];

      if (this.filterAbleData.length > 0) {
        tabdata = this.filterAbleData;
      } else {
        tabdata = this.tableData;
      }
      // if (this.frame.searchTabData && this.frame.searchTabData.length > 0) {
      //   tabdata = this.frame.searchTabData
      // } else {
      //   tabdata = this.tableData
      // }
      var tabRows = this.groupBy(tabdata, function (item) {
        let str = "[" + ctrlStr + "]";
        let arrStr = eval(str)
        return arrStr;
      });
      let tableKey = Object.keys(tabRows[0].items[0]);

      let levelRows = [];
      for (let t of tabRows) {
        let tableRows = [];
        let tableHead = [];
        for (let table of t.items) {
          let frameLevel4;
          if (this.frame.apexFrameLevel4) {
            frameLevel4 = JSON.parse(JSON.stringify(this.frame.apexFrameLevel4));
          } else {
            frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
          }

          //  frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));

          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if (item.item_name.toUpperCase() == key.toUpperCase()) {
                  item.value = table[key];

                  if (table[key] && (table[key].indexOf("~") > -1) && (table[key].indexOf("background-color") > -1)) {
                    let val = table[key].split("~");
                    let str = JSON.parse(val[1]);
                    item.value = val[0];
                    if (str["background-color"]) {
                      let obj = {
                        "background-color": str["background-color"]
                      };
                      item.tdStyle = JSON.stringify(obj);
                      delete str["background-color"];
                      item.display_setting_str = JSON.stringify(str);
                    }

                    else {
                      item.display_setting_str = val[1];
                    }
                  } else {
                    item.value = table[key];
                  }
                }
                if (item.display_setting_str) {
                  if (typeof (item.display_setting_str) == 'object') {
                    JSON.stringify(item.display_setting_str);
                  }
                  if (JSON.parse(item.display_setting_str)["background-color"] && typeof (item.display_setting_str) == 'string' && JSON.parse(item.display_setting_str)["background-color"].indexOf("$") > -1) {
                    let str = JSON.parse(item.display_setting_str)
                    let obj = {
                      "background-color": str["background-color"]
                    };
                    item.tdStyle = JSON.stringify(obj);
                    delete str["background-color"];
                    item.display_setting_str = JSON.stringify(str);

                  }
                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }
        let obj = {
          key: t.key,
          items: tableRows
        }
        levelRows.push(obj);
        //  t.items = tableRows;
      }

      let finalRows = []
      for (let t of levelRows) {
        let finalDisplayTable = [];
        for (let data of t.items) {
          let finalTableRow: any = [];
          let finalDataRow = [];
          for (let temp of data) {
            if (temp.Level5) {
              for (let d of temp.Level5) {
                let arr = [];
                arr.push(d)
                finalDataRow.push(arr);
              }
            }
          }
          finalTableRow = finalDataRow;

          finalDisplayTable.push(finalTableRow);
        }
        let rows = JSON.parse(JSON.stringify(t));
        rows.items = finalDisplayTable
        finalRows.push(rows);
      }

      let ctrlArr = [];
      for (let c of cbArr) {
        let col = c.coloumns.item_name;
        let fun = {
          itemName: col,
          status: c.status
        }
        ctrlArr.push(fun);
      }
      let grpColumn = [];

      if (this.frame.apexFrameLevel4) {
        for (let c of ctrlArr) {
          for (let itemGroup of this.frame.apexFrameLevel4) {
            for (let itemMast of itemGroup.Level5) {
              if (c.itemName == itemMast.item_name) {
                itemMast.item_visible_flag = 'F';
              }
            }
          }
        }
      }

      for (let f of finalRows) {
        let heads = []
        for (let x of f.items) {
          for (let data1 of x) {
            for (let data2 of data1) {
              for (let c of ctrlArr) {
                if ((c.itemName == data2.item_name) && data2.value) {
                  data2.item_visible_flag = 'F';
                  let grp = heads.find(x => x.value == data2.value);
                  if (grp) {
                  } else {
                    let obj = {
                      key: data2.prompt_name,
                      value: data2.value
                    }
                    heads.push(obj);
                  }
                }
              }
            }
          }
        }
        f.keys = heads
      }
      grpColumn = finalRows
      console.log(grpColumn);
      let head = [];
      for (let itemGroup of grpColumn[0].items[0]) {
        for (let itemMast of itemGroup) {
          if (itemMast.item_visible_flag == 'T') {
            head.push(itemMast.prompt_name)
          }
        }
      }

      let iG = 0;
      let brkflag = false;
      let globFlag = true;
      let globToItemFlag = false;
      for (let g of grpColumn) {
        let itemsArr = [];
        let glob = this.controlBreakArr.find(x => JSON.stringify(x.keys) == JSON.stringify(g.keys));
        for (let i of g.items) {
          if (iG == to) {
            brkflag = true;
            break;
          } else {
            if (iG >= from) {
              if (glob && globFlag) {
                itemsArr = glob.items;
                globFlag = false;
                globToItemFlag = true;
              }
              itemsArr.push(i);
            }
          }
          iG++
        }
        let summaryRow = this.calculateFunction(itemsArr, head);
        if (glob && globToItemFlag) {
          glob.items = itemsArr;
          glob.summRow = summaryRow ? summaryRow.summRows : [];
          glob.funRows = summaryRow ? summaryRow.funrow : [];
          globToItemFlag = false;
        } else {
          if (itemsArr.length > 0) {

            let obj = {
              keys: g.keys,
              items: itemsArr,
              summRow: summaryRow ? summaryRow.summRows : [],
              funRows: summaryRow ? summaryRow.funrow : [],
              rowsFlag: false
            }
            this.controlBreakArr.push(obj);
          }
        }
        if (brkflag) {
          break;
        }
      }

      if (this.groupFlag) {
        for (let c of this.controlBreakArr) {
          let data = [];
          for (let a of c.keys) {
            data.push(a);
          }

          for (let f of c.funRows) {
            data.push(f);
          }
          c.pRHead = data;
        }

      }
      console.log(this.controlBreakArr);
      this.controlBreakHead = head;
      this.dragedDiv = head;
      //  this.controlBreakArr = grpColumn;
    }


    if (this.displayFixedRecord) {
      if (this.displayFixedrecordLength > 0) {
        this.l_total_remain_pages = Math.ceil(
          this.l_total_rows / this.displayFixedrecordLength
        );
      } else {
        this.l_total_remain_pages = 1;
      }
    }
    this.l_current_page = a_currentPage;
    this.showLoading = false;

    this.verticaldata();

  }

  groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      let obj = {
        key: JSON.parse(group),
        items: groups[group]
      }
      return obj;
    })
  }


  drop(event: CdkDragDrop<string[]>) {
    let newHead = this.frame.apextheaders.find(x => x.prompt_name == this.controlBreakHead[event.previousIndex]);
    let obj = {
      coloumns: newHead,
      status: 'Enabled'
    }
    this.frame.ctrlBrkCond.push(obj);
    this.controlBreakArr = [];
    if (this.groupFlag) {
      let even: any = {};
      even.groupBy = {
        funArr: this.funArr
      }
      even.apex = true;
      this.getdataFromcanvasApex(even)
    } else {
      this.displayData(0, this.displayFixedrecordLength, 1);
    }
    console.log(event);
  }

  // showSumm(){
  //   this.showSummary = !this.showSummary;
  // }

  showGroup(c) {
    c.rowsFlag = !c.rowsFlag;
  }
  
  showQueryParam(){
    this.events.publish("openQueryParamObj");
  }

  goFirst(num){
    this.frame.tableRows = [];
    this.controlBreakArr = [];
    this.l_current_page = num;
    this.paginate(num);
  }

  getParsedJsonSimple(json) {
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
}





// for==>wsdp coming
//in super page
//  <div *ngSwitchCase="'TABLE'">
//           <app-frame-table [frame]="frame" [wsdp]="wsdp" (emitPass)="itemClicked($event)"></app-frame-table>
//         </div>

// in frame canvase
//  @Input() wsdp: any = {};

//  var data = {
//       "wslp": this.userDetails,
//       "wscp": wscp,
//       "wsdp": this.wsdp
//     }

// in table
//   @Input() wsdp: any = {};

//   var data = {
//       "wslp": this.userDetails,
//       "wscp": wscp,
//       "wsdp": this.wsdp
//     }
