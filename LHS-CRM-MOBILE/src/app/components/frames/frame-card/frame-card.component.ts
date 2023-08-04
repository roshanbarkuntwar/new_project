import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, Directive } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { IonInfiniteScroll, Events, ModalController, Platform } from '@ionic/angular';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { TableSearchPipe } from 'src/app/pipes/table-search.pipe';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { resolve } from 'dns';


@Directive({
  selector: "[focusDir]"
})
export class FocusDirectiveCard {
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
  selector: 'app-frame-card',
  templateUrl: './frame-card.component.html',
  styleUrls: ['./frame-card.component.scss'],
})
export class FrameCardComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @Input() sessionObj: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass1: EventEmitter<any> = new EventEmitter<any>();
  listLength: number;
  thead: any = [];
  thead2: any = [];
  dispalyss: any = { "color": "red", "text-yellow": "pink" };
  userDetails: any;
  l_total_rows: number;
  l_current_page: number = 1;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_totalPage: number;
  l_where_str: any;
  filterFormData: any = [];
  l_card_title: any;
  tablerowsfilter: any;
  wscp: any = {};
  loadMoreFlag: boolean;
  searchFlag: any = false;
  canvasfilter: any = false;
  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  scrollFlag: boolean = false;
  tableRows: any = [];
  flagtoruncanvasfilter: boolean;
  noRecordMessage = "";
  getcanvasWCP: boolean = false;
  cardtitleFlag: boolean = true;
  filter: boolean = false;
  toggleFilter: boolean = false;

  callingObjectArr = [];
  colSize: any = [];
  footer_flag: boolean = false;
  enablefunnel: boolean = false;

  headerarr: any = [];
  footerArr: any = [];

  totalData: any = [];
  fromRowLocal: number = 0;
  toRowLocal: number = 50;
  total_Pages: number;
  currentPage: number = 1;
  noOfCard: number = 50;
  developerModeData: any;
  switchFlag: boolean = false;
  mikeStyle: any;

  filterAbleData = [];

  searchText: any;

  displayFixedRecord: boolean = false;
  displayFixedrecordLength = 50;

  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, private events: Events, public modalController: ModalController,
    public tableseach: SearchfilterPipe, public platform: Platform ,private pipemy: SearchfilterPipe
  ) {
    if (!this.platform.is('android') && !this.platform.is('ios')) {
      // this.service.onstart = (e) => {
      //   console.log('onstart');
      // };
      // this.service.onresult = (e) => {
      //   this.tablerowsfilter = e.results[0].item(0).transcript;
      //   console.log('SubComponent:onresult', this.tablerowsfilter, e);
      // };
    }

    this.userDetails = this.globalObjects.getLocallData("userDetails");

    this.events.subscribe('callcardforheaderarray', res => {

      this.cardtitlechange();
    });

  }
  verticaldata1() {
    let frameLevel4 = this.tableseach.transform(this.frame.tableRows, this.tablerowsfilter);
    let headerRow: any = [];
    let footerRow: any = [];
    this.headerarr = [];
    this.footerArr = [];
    for (let itemGroup of frameLevel4) {
      for (let i of itemGroup) {
        let footerGrp: any = [];
        let headerGrp: any = [];
        for (let item of i.Level5) {
          if (item.position == 'CARD_FOOTER' && item.item_visible_flag == 'T') {
            this.footer_flag = true;
            footerGrp.push(i);
          }
          if ((item.item_type == 'CARD_TITLE' || item.position == 'CARD_HEADER') && item.item_visible_flag == 'T') {
            this.cardtitleFlag = true;
            headerGrp.push(i);
          }
        }
        if (footerGrp.length > 0) {
          footerRow.push(footerGrp[0]);
        } if (headerGrp.length > 0) {
          headerRow.push(headerGrp[0]);
        }
      }
      if (footerRow.length > 0) {
        this.footerArr.push(footerRow);
        footerRow = [];
      } if (headerRow.length > 0) {
        this.headerarr.push(headerRow);
        headerRow = [];
      }
    }
  }
  cardtitlechange() {
    let headerRow: any = [];
    let footerRow: any = [];
    this.headerarr = [];
    this.footerArr = [];
    for (let itemGroup of this.frame.tableRows) {
      for (let i of itemGroup) {
        let footerGrp: any = [];
        let headerGrp: any = [];
        for (let item of i.Level5) {
          if (item.position == 'CARD_FOOTER' && item.item_visible_flag == 'T') {
            this.footer_flag = true;
            footerGrp.push(i);
          }
          if ((item.item_type == 'CARD_TITLE' || item.position == 'CARD_HEADER') && item.item_visible_flag == 'T') {
            this.cardtitleFlag = true;
            headerGrp.push(i);
          }
        }
        if (footerGrp.length > 0) {
          footerRow.push(footerGrp[0]);
        } if (headerGrp.length > 0) {
          headerRow.push(headerGrp[0]);
        }
      }
      if (footerRow.length > 0) {
        this.footerArr.push(footerRow);
        footerRow = [];
      } if (headerRow.length > 0) {
        this.headerarr.push(headerRow);
        headerRow = [];
      }
    }
  }
  ngOnInit() {
    let name = "refreshFrame" + ((this.frame.apps_page_frame_seqid).toString().replace(/-/g, "_") + this.globalObjects.refreshId);
    this.events.subscribe(name, res => {
      for (let f of res.refreshFrame) {
        if (f.key == this.frame.apps_page_frame_seqid && f.val == 'T' && this.frame.apps_frame_type == 'CARD') {
          f.val = 'F'
          this.wscp_send_input = res.wscp;
          this.wsdp = res.wsdp;
          this.tableRows = [];
          this.frame.tableRows = [];
          this.headerarr = [];
          this.footerArr = [];
          this.displayFixedRecord = false;
          this.totalData = [];
          this.ngOnInit();
          this.scrollFlag = true;
        }
      }
    })

    if (this.frame.no_of_records) {
      if (this.frame.no_of_records && (parseFloat(this.frame.no_of_records) > (this.displayFixedrecordLength + 1))) {
        this.displayFixedRecord = true;
      }
    } else {
      this.displayFixedRecord = true;
    }

    this.events.subscribe("skipFilter", () => {
      this.filter = false;
      this.toggleFilter = false;
      this.show_filter = 'dontshow';
      // this.paginate(1);
    });

    this.scrollFlag = true;

    // if (this.frame.display_no_of_records) {
    //   this.noOfCard = parseFloat(this.frame.display_no_of_records);
    //   this.toRowLocal = parseFloat(this.frame.display_no_of_records);
    // }

    if (this.frame.Level4) {
      for (let itemGroup of this.frame.Level4) {
        if (itemGroup.design_control_type) {
          itemGroup.groupCol = [];
          itemGroup.groupCol = itemGroup.design_control_type.split('-');
          this.colSize = itemGroup.groupCol;
        }
      }
    }

    if (this.frame.colSize) {
      this.colSize = this.frame.colSize;
    }
    console.log("frame in frame card component..>>", this.frame);
    // let frameFilterFlag = this.frame.frame_filter_flag;

    // if (frameFilterFlag) {
    //   if (frameFilterFlag.indexOf("S") > -1) {
    //     this.searchFlag = true;
    //   }
    //   if (frameFilterFlag.includes("C") || frameFilterFlag.includes("J") || frameFilterFlag.includes("A")) {
    //     this.filter = false;
    //     this.enablefunnel = true;
    //     var count1 = (frameFilterFlag.match(/J/g) || []).length;
    //     var count2 = (frameFilterFlag.match(/C/g) || []).length;
    //     var count3 = (frameFilterFlag.match(/A/g) || []).length;
    //     if (count1 == 2 || count2 == 2 || count3 == 2) {
    //       this.filter = true;
    //       this.enablefunnel = true;
    //     }
    //   }
    // }

    let frameFilterFlag = this.frame.frame_filter_flag ? this.frame.frame_filter_flag.split("#") : [];
    for (let x of frameFilterFlag) {
      if (x === 'S') {
        this.searchFlag = true;
      }

      if (x === 'C' || x === 'J' || x === 'A' || x == 'D&D') {
        // this.filter=true;
        this.enablefunnel = true;
      } if (x === 'STC') {
        this.switchFlag = true;
      }


    }

    // this.getData();
    if (this.frame.Level4) {
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
    }
    // if (this.frame.calenderflag) {
    //   // this.frame.footerrows=this.footerArr;;
    //   // this.frame.headerrows=this.headerarr;
    //  }
    // else {
    //   this.paginate(1);
    // }
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

      // let frameFilterFlag = this.frame.frame_filter_flag;
      // if (frameFilterFlag) {

      //   if (frameFilterFlag.indexOf("C") > -1 || frameFilterFlag.indexOf("J") > -1 || frameFilterFlag.indexOf("A") > -1) {
      //     this.toggleFilter = true;
      //   }

      // }
      let frameFilterFlag = this.frame.frame_filter_flag.split("#");
      for (let x of frameFilterFlag) {

        if (x === 'C' || x === 'J' || x === 'A' || x == 'D&D') {
          // this.filter=true;
          this.toggleFilter = true;
        }


      }
    }
  }

  onSwitch() {
    this.globalObjects.switchTableData = this.totalData;
    this.globalObjects.switchSearchStr = this.tablerowsfilter;
    this.frame.apps_frame_type = 'TABLE';
  }

  getdataFromcanvasFilter(event) {
    this.getcanvasWCP = true;
    let array = [];
    this.tableRows = [];
    this.headerarr = [];
    this.footerArr = [];
    this.frame.tableRows = [];
    this.listLength = 0;
    this.scrollFlag = true;
    this.filter = false;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;

    array = event.where_str;

    this.l_where_str = [];
    if (array.length > 0) {
      for (let data of array) {
        this.l_where_str += data + "  ";
      }
    }
    else {
      this.l_where_str = "";
    }
    this.frame.l_where_str = this.l_where_str;
    console.log("array concate", this.l_where_str);
    this.fromRowLocal = 0;
    this.toRowLocal = this.noOfCard;
    this.paginate(1);
  }

  getData(a_from_row: number, a_to_row: number, a_currentPage: number) {
    

    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    console.log("framecard getdata", this.frame)
    // wscp.service_type='get_frame_filter_all_json';
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = String(a_from_row);
    wscp.to_row = String(a_to_row);
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.orignal_apps_item_seqid = this.wscp_send_input.orignal_apps_item_seqid;
    wscp.origin_apps_item_seqid = this.wscp_send_input.origin_apps_item_seqid;
    if (this.wscp_send_input.calling_parameter_str) {
      let callingParameterStr = this.wscp_send_input.calling_parameter_str.split("~");
      for (let x of callingParameterStr) {
        if (x) {
          let y = x.split("=");
          wscp[y[0].toLowerCase()] = y[1]
        }
      }
    }

    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
    if (this.l_where_str && this.getcanvasWCP) {
      wscp.where_str = this.l_where_str;
    } else if (this.l_where_str && this.filter) {
      wscp.where_str = this.l_where_str.join(" ");
    } else if (this.l_where_str && this.flagtoruncanvasfilter) {
      wscp.where_str = this.l_where_str;
    } else {
      wscp.where_str = null;
    }
    if (this.frame.no_of_records) {
      wscp.no_of_record_cards = this.frame.no_of_records
    }
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    // else {
    //   wscp.no_of_record_cards = "1000000000";
    // }
 // }
 let wsdp 
 if(wscp.service_type == "execute_query"){

   wsdp = this.globalObjects.getWsdp("").wsdp;
 }else{
   wsdp = this.wsdp;
 }


    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
      "wsdpcl": this.wsdpcl
    }
    this.globalObjects.showLoading();
    console.log(this.globalObjects.callingPara)
    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
      console.log("res..in frame card...", res)

      let data: any = res;

      if (data.responseStatus == "success") {
        this.cardtitleFlag = false;

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
        else {
          // For Getting *CALLING_OBJECT_CODE* from Frame //
          this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
          // For Getting *CALLING_OBJECT_CODE* from Frame //
          //    this.tableRows = [];
          let tableData = objData.Level1;
          //  this.totalData = tableData;


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
            this.totalData.push(name);
          }
         

          let tableKey = [];
          if (tableData[0]) {
            tableKey = Object.keys(tableData[0]);
            this.l_total_rows = parseFloat(tableData[0].TOTAL_ROWS);
          }
          this.noRecordMessage = "";
          if (tableData.length > 0) {

            if (this.displayFixedRecord) {
              let to = this.displayFixedrecordLength * a_currentPage;
              let from = to - this.displayFixedrecordLength;
              this.displayData(from, to, a_currentPage)
            } else {
              this.displayData(a_from_row -1, a_to_row, a_currentPage)
            }

          } else {
            this.frame.tableRows = [];
          }
          if (this.frame.flagtoclosefilter) {
            this.show_filter = "show";
            this.filterToggle();
          }
          // if (this.frame.calenderflag) {

          //   this.cardtitlechange();
          // }
          console.log(this.frame.tableRows)
          this.listLength = this.frame.tableRows.length;
          this.l_current_page = a_currentPage;
          // vijay if current page =1 then 

          let index = 0
          for (let name of tableData) {
            if (name['ITEM_VISIBLE_FLAG']) {
              if (name["ITEM_VISIBLE_FLAG"].indexOf("~") > -1) {
                let itemsArr = name["ITEM_VISIBLE_FLAG"].split("~");
                for (let itemGroup of this.frame.tableRows[index]) {
                  for (let item of itemGroup.Level5) {
                    for (let i of itemsArr) {
                      if (item.item_name.toUpperCase() == i.split("=")[0].toUpperCase()) {
                        item.item_visible_flag = i.split("=")[1];
                      }
                    }
                  }
                }
              } else {
                for (let itemGroup of this.frame.tableRows[index]) {
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
                for (let itemGroup of this.frame.tableRows[index]) {
                  for (let item of itemGroup.Level5) {
                    for (let i of itemsArr) {
                      if (item.item_name.toUpperCase() == i.split("=")[0].toUpperCase()) {
                        item.item_enable_flag = i.split("=")[1];
                      }
                    }
                  }
                }
              } else {
                for (let itemGroup of this.frame.tableRows[index]) {
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
                for (let itemGroup of this.frame.tableRows[index]) {
                  for (let item of itemGroup.Level5) {
                    for (let i of itemsArr) {
                      if (item.item_name.toUpperCase() == i.split("=")[0].toUpperCase()) {
                        item.data_required_flag = i.split("=")[1];
                      }
                    }
                  }
                }
              } else {
                for (let itemGroup of this.frame.tableRows[index]) {
                  for (let item of itemGroup.Level5) {
                    if (item.item_name.toUpperCase() == name['DATA_REQUIRED_FLAG'].split("=")[0]) {
                      item.data_required_flag = name['DATA_REQUIRED_FLAG'].split("=")[1];
                    }
                  }
                }
              }
            }
            index++;
          }
          
          if (this.l_current_page == 1) {
            this.c_to_row = Math.ceil(this.l_total_rows / (this.l_total_rows / this.frame.no_of_records));
            // this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
            if (this.frame.no_of_records > 0) {
              this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
            } else {
              this.l_total_remain_pages = 0;
            }
            this.c_from_row = Math.ceil((this.c_to_row - this.frame.no_of_records)) + 1;
          }
          if (a_to_row > this.l_total_rows) {
            this.loadMoreFlag = true;
          }
          if (this.frame.no_of_records) { } else { this.loadMoreFlag = true; }

          //   let objData = this.globalObjects.setPageInfo(data.responseData);
          if (this.frame.tableRows.length <= 0 && !this.frame.calenderflag) {
            this.noRecordMessage = "Query has no Data..!";
          }

          this.total_Pages = Math.ceil(this.l_total_rows / this.noOfCard);
          this.l_total_remain_pages = this.l_total_remain_pages - 1;
          // this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
          // setTimeout(() => {
          //   this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
          // }, 50);
          // if(this.infiniteScroll && this.infiniteScroll.disabled){
          //   setTimeout(() => {
          //     this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
          //   }, 50);
          // }
          console.log(this.globalObjects.callingPara)
        }
      }
      this.scrollFlag = false;
    }).catch(err => {
      this.scrollFlag = false;
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }

  itemClicked(event, rowsdata, i, j) {
    var rowindex;
    for (let dataRow of rowsdata) {
      for (let r of dataRow.Level5) {
        if (r.item_name == "ROWNUMBER") {
          rowindex = r.value - 1;
        }
      }
    }
    if (rowindex == undefined || this.frame.calenderflag) {
      rowindex = j;
    }
    if (event.click_events_str == "editItem" || event.click_events_str == "deleteItem") {
      rowindex = j;
    }

    event.callingObjectArr = this.callingObjectArr;
    let col = {};
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
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
    event.wscp = this.wscp_send_input;

    if (event.click_events_str == "editItem") {
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
            item.item_type = item.temp_item_type
          }
        }
      }
      this.frame.tableRows.splice(rowindex, 1);
      if(this.frame.addTableRows && this.frame.addTableRows.length > 0){
        this.frame.addTableRows.splice(rowindex, 1);
      }
      event.EDIT_ITEM = frameLevel4;
      this.emitPass.emit(event);
    } else if (event.click_events_str == "deleteItem") {
      this.frame.tableRows.splice(rowindex, 1);
      if(this.frame.addTableRows && this.frame.addTableRows.length > 0){
        this.frame.addTableRows.splice(rowindex, 1);
      }
    }
    else {
      event.wsdp = [];
      let col = {};
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
    event.itemIndex = rowindex;
    if (this.frame.calenderflag) {
      this.emitPass1.emit(event);
    } else {
      this.emitPass.emit(event);
    }
  }


  getFilterParameter(event) {
    console.log(event.where_str)
    this.l_where_str = event.where_str;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;
    this.getdataFromcanvasFilter(event);
    //this.paginate(1);
  }

  openMike() {
    this.globalObjects.speechdata = '';
    this.globalObjects.startListening().then(res => {
      this.tablerowsfilter = res;
    });
  }

  openbarcodescanner() {
    this.globalObjects.barcodescanner().then(res => {
      this.tablerowsfilter = res;
    });
  }

  action(flag, index) {
    console.log(flag, index);
  }

  paginate(a_current_page: number) {

    // this.tableRows = [];

    let noOfRecords;
    if (this.displayFixedRecord) {
      noOfRecords = this.displayFixedrecordLength;
    } else {
      noOfRecords = parseInt(this.frame.no_of_records)
    }

    let fromRow;
    let toRow;

    let l_total_pages: number = Math.ceil(this.l_total_rows / noOfRecords);
    this.l_totalPage = l_total_pages;
    let L_total_pages: number = this.l_total_rows / noOfRecords;

    if (!a_current_page) {
      a_current_page = 1;
    } else if (a_current_page > l_total_pages) {
      a_current_page = l_total_pages;
    }

    let l_from_row: number = null;
    let l_to_row: number = null;

    if (l_total_pages > 0 && a_current_page == 1) {
      l_to_row = Math.ceil((this.l_total_rows / L_total_pages));
    }
    else {
      l_to_row = ((this.l_total_rows / L_total_pages) * a_current_page);
    }
    let l_to_row_n = Math.round(l_to_row)
    l_from_row = ((l_to_row_n - noOfRecords));

    this.c_from_row = Math.round(l_from_row);
    this.c_to_row = l_to_row_n;

    // if (a_current_page!=1){
    //   this.l_total_remain_pages=Math.ceil(this.l_total_rows / this.frame.no_of_records)-(this.c_to_row-this.frame.no_of_records);
    // }

    toRow = this.displayFixedrecordLength * a_current_page;
    fromRow = toRow - this.displayFixedrecordLength + 1;

    if (toRow > this.l_total_rows) {
      toRow = this.l_total_rows;
    }


    if (this.globalObjects.switchCardData.length > 0) {
      this.tableRows = [];
      this.frame.tableRows = [];
     this.totalData = this.globalObjects.switchCardData;
     this.tablerowsfilter = this.globalObjects.switchSearchStr;
     this.displayData(0,this.globalObjects.switchCardData.length,1);
    } else {
      if (((this.displayFixedRecord && a_current_page > 1) || (this.displayFixedRecord && this.totalData.length > 0))
        && (this.totalData.length >= toRow)) {
        this.displayData(fromRow, toRow, a_current_page);
      } else {

        if (this.frame.no_of_records) {
          l_from_row = this.totalData.length + 1;
          l_to_row = (this.totalData.length) + parseInt(this.frame.no_of_records);
        }

        this.getData(l_from_row, l_to_row, a_current_page);
      }
    }


    // this.getData(l_from_row, l_to_row_n, a_current_page);
  }

  isInfinite() {
    let toRow;
    if (parseInt(this.frame.no_of_records) && parseInt(this.frame.no_of_records) > 50) {
      toRow = 50;
    } else {
      if (this.frame.no_of_records) {
        toRow = parseInt(this.frame.no_of_records);
      }
    }
    if (this.l_total_rows && this.frame.no_of_records && (this.l_total_rows > toRow) && this.l_total_rows > this.listLength) {
      return true;
    } else {
      return false;
    }
    //  return true;
  }

  // doInfinite(infiniteScroll): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       this.currentPage = this.currentPage + 1;
  //       this.fromRowLocal = this.toRowLocal;
  //       this.toRowLocal = this.toRowLocal + this.noOfCard;
  //       this.total_Pages = Math.ceil(this.l_total_rows / this.noOfCard);
  //       if (this.noOfCard == parseInt(this.frame.no_of_records)) {
  //         this.toRowLocal = this.noOfCard;
  //         this.fromRowLocal = 0;
  //         this.paginate(this.l_current_page + 1);
  //       } else {
  //         this.getDataLocal(this.fromRowLocal, this.toRowLocal);
  //       }
  //       resolve("");
  //       // this.paginate(this.l_current_page);
  //     }, 50);
  //   })
  // }


  loadData(event) {
    setTimeout(() => {

      this.l_current_page = this.l_current_page + 1
      this.paginate(this.l_current_page);
      // App logic to determine if all data is loaded
      // and disable the infinite scroll

    }, 500);
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

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": event.wsdp
      }

      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {
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
          this.globalObjects.clickedbutton = false;
        }
      }
    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.7 Something went wrong please try again later!");
      console.log(err);
    })

  }

  getDataLocal(from, to) {
    if (this.totalData.length > 0) {
      let tableKey = [];
      tableKey = Object.keys(this.totalData[0]);
      let indexcount: number = -1;
      let toRow: number;
      if (to < this.totalData.length) {
        toRow = to + 1;
      } else {
        toRow = this.totalData.length;
      }
      for (let t = from; t < toRow; t++) {
        indexcount++;
        let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
        let footerRow = [];
        let headerRow = [];
        for (let itemGroup of frameLevel4) {
          let footerGrp = [];
          let headerGrp = [];
          for (let item of itemGroup.Level5) {
            for (let key of tableKey) {
              if (item.item_name && item.item_name.toUpperCase() == key.toUpperCase()) {
                item.value = this.totalData[t][key]
              }
            }
            if (item.position == 'CARD_FOOTER' && item.item_visible_flag == 'T') {
              this.footer_flag = true;
              footerGrp.push(itemGroup);
            }
            if ((item.item_type == 'CARD_TITLE' || item.position == 'CARD_HEADER') && item.item_visible_flag == 'T') {
              this.cardtitleFlag = true;
              headerGrp.push(itemGroup);
            }
            item.indexcount = JSON.parse(JSON.stringify(indexcount));
            if (item.item_name && item.item_name.toUpperCase() == 'card_colour'.toUpperCase()) {
              if (item.value)
                frameLevel4.status = item.value;
            }
          }
          if (footerGrp.length > 0) {
            footerRow.push(footerGrp[0]);
          } if (headerGrp.length > 0) {
            headerRow.push(headerGrp[0]);
          }
        }
        if (footerRow.length > 0) {
          this.footerArr.push(footerRow);
        } if (headerRow.length > 0) {
          this.headerarr.push(headerRow);
        }
        this.tableRows.push(frameLevel4);
      }

      if (this.frame.flagtoclosefilter) {
        this.show_filter = "show";
        this.filterToggle();
      }
      this.frame.tableRows = this.tableRows;
      this.listLength = this.frame.tableRows.length;
      if (this.frame.no_of_records) { } else { this.loadMoreFlag = true; }
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
      setTimeout(() => {
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
      }, 50);
    }

    if (this.totalData.length >= this.toRowLocal) {
      this.toRowLocal = this.noOfCard;
      this.fromRowLocal = 0;
      this.paginate(this.l_current_page + 1);
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

  sppeak() {



    //this.service.start();
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        if (stream) {
          this.mikeStyle = "blink_text";
          setTimeout(() => {
            this.mikeStyle = ""
          }, 4000)
        }
      }).catch(err => {

        alert("Mic not detected")

      })
  }


  searchAllData() {
    this.frame.tableRows = [];
    this.tableRows = [];
    let vals = this.pipemy.transform(this.totalData, this.tablerowsfilter);
    if (vals) {
      this.filterAbleData = vals;
    }

    if (vals.length == this.l_total_rows) {
      this.l_current_page = 1;
    }
    this.headerarr = [];
    this.footerArr = [];
    this.displayData(0, this.displayFixedrecordLength, 1);
  }


  displayData(from, to, pageNum) {

    let tableKey = [];


    let tableData = [];
    if(this.filterAbleData.length > 0){
      tableData = this.filterAbleData
    }else{
      tableData = this.totalData;
    }
    let indexcount: number = -1;
    let toRow: number;

    this.globalObjects.switchCardData = [];
    this.globalObjects.switchSearchStr = "";


    tableKey = Object.keys(tableData[0]);

    // if (this.frame.no_of_records && this.toRowLocal < tableData.length) {
    //   toRow = this.toRowLocal;
    // } else {
    //   toRow = tableData.length;
    //   //  this.fromRowLocal = 0;
    //   this.noOfCard = parseInt(this.frame.no_of_records)
    // }
    let toRows;
    if (to >= tableData.length) {
      toRows = tableData.length - 1;
    } else {
      toRows = to
    }

    for (let t = from; t <= toRows; t++) {
      indexcount++;
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
      let footerRow = [];
      let headerRow = [];
      for (let itemGroup of frameLevel4) {
        let footerGrp = [];
        let headerGrp = [];
        for (let item of itemGroup.Level5) {
          for (let key of tableKey) {
            if (item.item_name && item.item_name.toUpperCase() == key.toUpperCase()) {
              item.value = tableData[t][key]
            }
          }
          if (item.position == 'CARD_FOOTER' && item.item_visible_flag == 'T') {
            this.footer_flag = true;
            footerGrp.push(itemGroup);
          }
          if ((item.item_type == 'CARD_TITLE' || item.position == 'CARD_HEADER') && item.item_visible_flag == 'T') {
            this.cardtitleFlag = true;
            headerGrp.push(itemGroup);
          }
          item.indexcount = JSON.parse(JSON.stringify(indexcount));

          if (this.wscp.apps_working_mode == 'I') { } else {
            if (tableData[t]["ROWNUMBER"]) {
              item.local_Item_Seq_Id = item.apps_item_seqid + tableData[t]["ROWNUMBER"];
            }
          }
          if (item.item_name && item.item_name.toUpperCase() == 'card_colour'.toUpperCase()) {
            if (item.value)
              frameLevel4.status = item.value;
          }
        }
        if (footerGrp.length > 0) {
          footerRow.push(footerGrp[0]);
        } if (headerGrp.length > 0) {
          headerRow.push(headerGrp[0]);
        }
      }
      if (footerRow.length > 0) {
        this.footerArr.push(footerRow);
        footerRow = [];
      } if (headerRow.length > 0) {
        this.headerarr.push(headerRow);
        headerRow = [];
      }
      this.tableRows.push(frameLevel4);
    }

    if (this.frame.calenderflag) {
      this.cardtitlechange();
            
    } else {
      this.frame.tableRows = this.tableRows;
    }


    this.scrollFlag = false;
    if(this.infiniteScroll){
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
    this.l_current_page = pageNum;
    this.total_Pages = Math.ceil(this.l_total_rows / this.noOfCard);
    this.l_total_remain_pages = this.l_total_remain_pages - 1;
    if(this.infiniteScroll){
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
  }


}
