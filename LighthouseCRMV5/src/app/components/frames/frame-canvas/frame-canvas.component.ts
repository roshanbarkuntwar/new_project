
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, Directive, HostListener } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { Events } from 'src/app/demo-utils/event/events';
import { NewsScrollComponent } from '../../items/item-display/news-scroll/news-scroll.component';
import { async } from '@angular/core/testing';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { FileHandle } from 'src/app/directives/drag-drop.directive';
// import { SpeechRecognitionService } from '@kamiazya/ngx-speech-recognition';
import { LhsLibService } from 'src/app/services/lhs-lib.service';



@Directive({
  selector: "[focusDir]"
})
export class FocusDirective {
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
  selector: 'app-frame-canvas',
  templateUrl: './frame-canvas.component.html',
  styleUrls: ['./frame-canvas.component.scss'],
})
export class FrameCanvasComponent implements OnInit {


  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  showFrame: boolean = true;
  item_slno_count: number = 1;
  current_page_parameter: any = {};
  wscp: any = {};
  callingObjectArr: any = [];
  tableData: any;
  colSize: any = [];
  checkCardItem = false;
  firstEmptyframe: any;
  developerModeData: any;
  subscribeRefreshFlag = false;
  searchText: any;
  jsonTableData = [];
  tableRows = [];
  month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sepr", "Oct", "Nov", "Dec"];
    files: any = []; 
    searchFlag: any = false;
    
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService,private lhs_lib : LhsLibService,
    private cdr: ChangeDetectorRef, public platform: Platform,
    public loadingController: LoadingController, private events: Events, public modalController: ModalController) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");

  }

  ngAfterViewChecked() {
    // if (this.globalObjects.fontype == "") { } else {
    //   this.globalObjects.increFont('', this.globalObjects.fontype);
    //   this.cdr.detectChanges();
    // }

    if (this.globalObjects.fontype == "") { } else {
      // console.log("q")
      if(this.globalObjects.fontype){

        this.globalObjects.changeFont(this.globalObjects.fontype);
      }
      this.cdr.detectChanges();
    }
    if (this.globalObjects.fontSize > 0.9) {

      this.globalObjects.increFontsize(this.globalObjects.fontSize);
      this.cdr.detectChanges();
    }
  }
  ngOnInit() {
    let name = "refreshFrame" + ((this.frame.apps_page_frame_seqid).toString().replace(/-/g, "_")) + this.globalObjects.refreshId;
    if (!this.subscribeRefreshFlag) {
      this.events.subscribe(name, res => {
        for (let f of res.refreshFrame) {
          if (f.key == this.frame.apps_page_frame_seqid && f.val == 'T') {
            f.val = 'F';
            this.wscp_send_input = res.wscp;
            this.wsdp = res.wsdp;
            this.tableRows = [];
            this.frame.tableRows = [];

            this.ngOnInit();
          }
        }
      })
      this.subscribeRefreshFlag = true;
    }
    console.log("previous wsdp", this.wsdp)
    console.log("from frame", this.frame);
    this.current_page_parameter = this.globalObjects.current_page_parameter;

    let frameFilterFlag = this.frame.frame_filter_flag ? this.frame.frame_filter_flag.split("#") : [];
    for (let x of frameFilterFlag) {
      if (x === 'S') {
        this.searchFlag = true;
      }
    }


    let parentSeqIdArr = [];
    for (let itemGroup of this.frame.Level4) {
      for (let item of itemGroup.Level5) {
        if ((Object.keys(this.globalObjects.devItemName).length > 0) && this.globalObjects.devItemName[item.item_name]) {
          item.value = this.globalObjects.devItemName[item.item_name];
        }
        let childItem = [];
        if (item.popup_parent_item_seqid) {
          item.item_visible_flag = 'F';

          let par = parentSeqIdArr.find(x => x.parentKey == item.popup_parent_item_seqid);

          if (par) {
            childItem = par.childItems
            childItem.push(item);
            par.childItems = childItem;
          } else {
            childItem.push(item);
            let obj = {
              parentKey: item.popup_parent_item_seqid,
              childItems: childItem
            }
            parentSeqIdArr.push(obj);
          }

        }

      }

      itemGroup.groupCol = [];
      if (itemGroup.design_control_type) {
        itemGroup.groupCol = itemGroup.design_control_type.split('-');
        this.colSize = itemGroup.groupCol;
      }


    }

    for (let itemGroup of this.frame.Level4) {
      for (let item of itemGroup.Level5) {
        for (let p of parentSeqIdArr) {
          if (p.parentKey == item.apps_item_seqid) {
            item.childItems = p.childItems
          }
        }
      }
    }

    console.log(parentSeqIdArr);
   

    this.frame.checkCardItem = 'F';
    this.getData();
   // this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
    // if (this.frame.on_frame_load_str == 'frame_json_populate_data') {
    //   this.populateDataFromJson();
    // } else {
    //   this.getData();
    // }
  //  this.globalObjects.mirrorItems({itemIndex:0});
  }


  getData() {
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_working_mode = this.wscp_send_input.apps_working_mode;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.orignal_apps_item_seqid = this.wscp_send_input.orignal_apps_item_seqid;
    wscp.origin_apps_item_seqid = this.wscp_send_input.origin_apps_item_seqid;
    this.wscp = wscp;
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
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
      "wsdpcl": this.wsdpcl
    }

    let l_url = "S2U";
    let tableData: any;

    

    if (this.frame.on_frame_load_str) {
      this.dataService.postData(l_url, reqData).then(res => {
        let data: any = res;

        if (data.responseStatus == "success") {
          let tableRows = [];
          let objData = this.globalObjects.setPageInfo(data.responseData);

          // Developer Mode Loging
          let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
          let wsSewId = id ? data.responseData.Values[0][id] : "";
          this.developerModeData = {
            ws_seq_id: wsSewId,
            frame_seq_id: reqData.wscp.apps_page_frame_seqid
          }
          //Developer Mode Loging

          // For Getting *CALLING_OBJECT_CODE* from Frame //
          this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
          // For Getting *CALLING_OBJECT_CODE* from Frame //

          tableData = objData.Level1;
          this.tableData = tableData;
          // let countFrame = 0;

          for (let name of this.tableData) {
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
          if (this.frame.apps_frame_type == 'CANVAS-KPI') {
            this.getDataCanvasKpi(tableData);
          } else {
            let tableKey = [];
            if (tableData.length > 0) {
              tableKey = Object.keys(tableData[0]);
            }
            let indexcount: number = -1;
            for (let table of tableData) {
              this.checkCardItem = false;
              indexcount++;
              let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))

              for (let itemGroup of frameLevel4) {
                for (let item of itemGroup.Level5) {
                  for (let key of tableKey) {
                    if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                      item.value = table[key]
                    }
                  }
                  item.indexcount = JSON.parse(JSON.stringify(indexcount));

                  if (this.wscp.apps_working_mode == 'I') { } else {
                    if (table["ROWNUMBER"]) {
                      item.local_Item_Seq_Id = item.apps_item_seqid + table["ROWNUMBER"];
                    }
                  }
                }
              }
              tableRows.push(frameLevel4);
            }
            this.frame.tableRows = tableRows;


            for (let name of this.tableData) {
              if (name['ITEM_VISIBLE_FLAG']) {
                if (name["ITEM_VISIBLE_FLAG"].indexOf("~") > -1) {
                  let itemsArr = name["ITEM_VISIBLE_FLAG"].split("~");
                  for (let itemGroup of this.frame.tableRows[0]) {
                    for (let item of itemGroup.Level5) {
                      for (let i of itemsArr) {
                        if (item.item_name.toUpperCase() == i.split("=")[0].toUpperCase()) {
                          item.item_visible_flag = i.split("=")[1];
                        }
                      }
                    }
                  }
                } else {
                  for (let itemGroup of this.frame.tableRows[0]) {
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
                  for (let itemGroup of this.frame.tableRows[0]) {
                    for (let item of itemGroup.Level5) {
                      for (let i of itemsArr) {
                        if (item.item_name.toUpperCase() == i.split("=")[0].toUpperCase()) {
                          item.item_enable_flag = i.split("=")[1];
                        }
                      }
                    }
                  }
                } else {
                  for (let itemGroup of this.frame.tableRows[0]) {
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
                  for (let itemGroup of this.frame.tableRows[0]) {
                    for (let item of itemGroup.Level5) {
                      for (let i of itemsArr) {
                        if (item.item_name.toUpperCase() == i.split("=")[0].toUpperCase()) {
                          item.data_required_flag = i.split("=")[1];
                        }
                      }
                    }
                  }
                } else {
                  for (let itemGroup of this.frame.tableRows[0]) {
                    for (let item of itemGroup.Level5) {
                      if (item.item_name.toUpperCase() == name['DATA_REQUIRED_FLAG'].split("=")[0]) {
                        item.data_required_flag = name['DATA_REQUIRED_FLAG'].split("=")[1];
                      }
                    }
                  }
                }
              }

            }
            if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
              this.globalObjects.presentAlert(objData.Level1[0].message);
            }
            // if (tableData.length <= 0) {
            //   this.frame.tableRows = [];
            //   this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
            // }
            console.log("Frame Canvas Data", this.frame)
          }
        }
        this.populateDataFromJson();
        this.showFrame = true;
        this.autoClickItem();
      }).catch(err => {
        this.populateDataFromJson();
        this.showFrame = true;
        this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
        console.log(err);
      })
    } else {

     

      this.populateDataFromJson();
      this.autoClickItem();

    }

  }

  getDataCanvasKpi(tableData) {
    let itemData: any;
    let tableRows = [];
    for (let itemGrp of this.frame.Level4) {
      for (let item of itemGrp.Level5) {
        if (item.item_sub_type == 'KPI_PROMPT') {
          itemData = itemGrp;
        }
      }
    }
    let tableKey = [];
    if (tableData.length > 0) {
      tableKey = Object.keys(tableData[0]);
    }
    for (let table of tableData) {
      let kpiValue;
      let kpiItem = itemData.Level5[0];
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
      for (let itemGroup of frameLevel4) {
        for (let item of itemGroup.Level5) {
          for (let key of tableKey) {
            if ((item.item_sub_type == 'KPI_PROMPT' || item.item_sub_type == 'KPI_VALUE' || item.item_sub_type == 'KPI_MESSAGE') && item.item_visible_flag == 'T') {
              if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                if (kpiValue) {
                  kpiValue += "@" + table[key];
                  kpiItem.value = kpiValue;
                } else {
                  kpiValue = table[key];
                  kpiItem.value = kpiValue;
                }
              }
            } else {
              if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase()) && item.item_visible_flag == 'T') {
                item.value = table[key]
              }
            }
          }
        }
      }
      let framelvl4Arr = [];
      for (let itemGroup of frameLevel4) {
        for (let item of itemGroup.Level5) {
          if (item.value) {
            framelvl4Arr.push(itemGroup);
          }
        }
      }
      tableRows.push(framelvl4Arr);
    }
    let i = tableRows.length - 1;
    tableRows[i].push(itemData);

    let finalRows = [];
    let level5 = [];
    let count = 0;
    let rowsLength = 0;
    let itemCount = 0;
    let newTabRows = [];
    let f = JSON.parse(JSON.stringify(tableRows));
    for (let x of f) {
      rowsLength++;
      for (let itemGroup of x) {
        itemCount++;
        for (let z of itemGroup.Level5) {
          if (z.item_sub_type == "KPI_PROMPT") {
            count++;
            newTabRows.push(z);
            if (count == this.colSize.length || (rowsLength == tableRows.length && itemCount == x.length)) {
              itemGroup.Level5 = newTabRows;
              finalRows.push(itemGroup);
              newTabRows = [];
              count = 0;
            }
          }
        }
      }
      itemCount = 0;
    }
    
    this.frame.tableRows = [];
    this.frame.tableRows[0] = finalRows;
    console.log(this.frame.tableRows);
    console.log(finalRows[0].level5[0]);
    this.showFrame = true;
  }

  itemClickedKpi(event, i, x) {
    let z = 0;
    for (let y of this.colSize) {
      z += i;
    }
    let rowindex = z + x;
    let tableRows = [];
    let tableKey = [];
    if (this.tableData.length > 0) {
      tableKey = Object.keys(this.tableData[0]);
    }
    for (let table of this.tableData) {

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
    let wsdp = [];
    let wsdpcl = [];
    let col = {};
    for (let itemGroup of tableRows[rowindex]) {
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
    wsdp.push(col);
    wsdpcl.push(col);
    event.wsdpcl = wsdpcl;
    event.wsdp = wsdp;
    event.callingObjectArr = this.callingObjectArr;
    event.itemIndex = rowindex;
    /*  event.click_events_str = this.wscp_send_input.service_type;
     this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
     event.wscp = this.wscp_send_input; */
    this.emitPass.emit(event);
  }

  itemValueChange(event, rowindex) {
    return new Promise((resolve, reject) => {
      //  console.log("itemValueChange" + JSON.stringify(event));

      if(event.postEvent){
        this.itemClicked1(event,rowindex)
      }

      if (event.on_blur) {
        this.onItemBlur(event, rowindex);
      }
     

      //////  for change super events /////
      if (!event.click_events_str) {
          let newEvent = JSON.parse(JSON.stringify(event))
          newEvent.changeEvent = true;
          newEvent.tabRows = this.frame.tableRows[rowindex];
          this.emitPass.emit(newEvent);
  
        }
        ////*******/////////  */

      
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
                  if(item.item_type == 'DD'){
                    let evName = "testDD"+item.apps_item_seqid;
                    this.events.publish(evName);
                  }
                }
                if (item.formula_str) {
                  console.log(item.formula_str + " ---> " + item.prompt_name)
                  item.value = this.globalObjects.autoCalculation(item.formula_str, this.frame.tableRows[rowindex]);
                  console.log(item.value);
                }
                if (item.pre_event_plsql_text) {
                  console.log(item.pre_event_plsql_text + " ---> " + item.prompt_name)
                  item.value = this.globalObjects.setValueOnCondition(item.pre_event_plsql_text, this.frame.tableRows[rowindex]);
                  console.log(item.value);
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
        if ((event.dependent_column_sql && event.value) || (event.item_type == 'BT' && event.dependent_column_sql)) {
          this.getDependentData(event, rowindex).then(res => {
            if (res === "success") {
              if (event.post_text_validate_plsql) {
                this.PostTextValidatePlsql(event, rowindex);
              }
            }
            resolve("");
          });
        } else if (event.post_text_validate_plsql && event.value) {
          this.PostTextValidatePlsql(event, rowindex);
          resolve("");
        } else {
          resolve("");
        }
      } else {
        resolve("");
      }
    })
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
      if (this.wsdp.length > 0 && event.wsdp.length > 0) {
        newWsdp.push(Object.assign(this.wsdp[0], event.wsdp[0]));
      } else {
        if (this.wsdp.length > 0) {
          newWsdp = this.wsdp
        } if (event.wsdp.length > 0) {
          newWsdp = event.wsdp
        }
      }

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": newWsdp
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
                  if (item.item_name == "PHOTO") {
                    this.events.publish("DISPLAY_PHOTO", "LHS")
                  }
                  if (item.item_type == 'D' && item.item_sub_type == "D" && !(this.platform.is('android') || this.platform.is('ios'))) {
                    let d = this.globalObjects.formatDate(item.value, 'yyyy-MM-dd');
                    item.Dvalue = { isRange: false, singleDate: { jsDate: new Date(d) } };
                    item.value = item.Dvalue.singleDate.date.day + "-" + this.month[item.Dvalue.singleDate.date.month - 1] + "-" + item.Dvalue.singleDate.date.year;

                    if (item.value.indexOf('Sepr')) {
                      item.value = (item.value).replace('Sepr', 'Sep')

                    }


                  }
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
      console.log("this.frame canvas err");
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.7 Something went wrong please try again later!");
      console.log(err);
    })

  }

  itemClicked(event, i) {
    this.itemValueChange(event, i).then(res => {
      this.itemClicked1(event, i);
    })
  }

  itemClicked1(event, i) {
    // alert("valid--> " + valid)
    console.log(this.sessionObj);
    var rowindex;

    rowindex = i;
    event.callingObjectArr = this.callingObjectArr;
    event.itemIndex = rowindex;

    let isValid = true;



    if ((event.click_events_str && event.click_events_str.indexOf("addItem") > -1) || (event.click_events_str && event.click_events_str.indexOf("addMirrorItem") > -1))  {
      let frameLevel4: any = JSON.parse(JSON.stringify(this.frame.tableRows[rowindex]));
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

            if (item.item_type != "BT") {
              if(item.click_events_str && (item.click_events_str.indexOf("EDITABLE") > -1 || item.click_events_str.indexOf("editable") > -1)){	
              }else{	
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
        this.globalObjects.clickedbutton = false;
        this.globalObjects.presentAlert("Please correct all the errors and enter valid input")
       } 
      else {
        if (event.click_events_str.indexOf("checkValidFrame") > -1) {
          let arr = event.click_events_str.split("#");
          arr.splice([event.click_events_str.indexOf("checkValidFrame")], 1);
          event.click_events_str = arr.join("#");
        }
      }
      
      if(isValid){
          if(event.click_events_str.indexOf('itemAddFrom') > -1) {}else{
            this.frame.tableRows[rowindex] = JSON.parse(JSON.stringify(this.frame.Level4))
          }
          for (let itemGroup of this.frame.tableRows[rowindex]) {
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
          event.tHead = theaddata;
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
                } else if (item.value) {
                  value = item.value
                } else {
                  value = ""
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
                } else if (item.value) {
                  wsdpcl[item.apps_item_seqid] = item.value
                } else {
                  wsdpcl[item.apps_item_seqid] = ""
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
              } else if (item.value) {
                col[item.apps_item_seqid] = item.value
              } else {
                col[item.apps_item_seqid] = ""
              }
              if (item.isValid !== undefined && !item.isValid) {
                isValid = item.isValid
              }
            }
          }
        }
        event.wsdp.push(col);
      }

      /*   let checkValidFrame = false;
        if (event.click_events_str && event.click_events_str.indexOf("checkValidFrame") > -1) {
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
          this.globalObjects.clickedbutton = false;
          this.globalObjects.presentAlert("Please correct all the errors and enter valid input")
        } else {
  
        } */
      this.emitPass.emit(event);
    }
  }

  onSubmit(form) {
    this.globalObjects.presentAlert(form.form.valid)
  }

  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: null,
      frame_seq_id: this.frame.apps_page_frame_seqid
    }
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData
      }
    });
    return await modal.present();
  }

  onItemBlur(event, rowindex) {
    if (event.on_blur) {

      if (this.frame.tableRows) {
        this.globalObjects.onBlurEvent(event, event.on_blur, this.frame.tableRows[rowindex]);
      }
      console.log("ITEM " + rowindex);
    }
  }
  closeMods() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    this.globalObjects.popoverFlag = 'M';
    this.globalObjects.breadCrumpsArray.pop();
  }
  openMods() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    // this.ngOnInit();
  }

  filesDropped(files: FileHandle[]): void {
    this.files = files;
    //this.closeMods();
  }

  openMike() {
    this.globalObjects.speechdata = '';
    this.globalObjects.startListening().then(res => {
      this.searchText = res;
    });
  }

  sppeak() {
    //this.service.start();
  }

  autoClickItem(){
    let itemList = this.globalObjects.autoClickItem;
    if(itemList ){
      setTimeout(() => {
        if(this.frame.tableRows.length > 0){
  
          for(let rows of this.frame.tableRows){
            for(let row of rows){
              for(let item of row.Level5){
                for(let itemSeq of itemList){
                  if(itemSeq.indexOf(".") > -1){
                    let itemAlias = itemSeq.split(".")[0];
                    let itemSeqId = itemSeq.split(".")[1];
                    if(itemAlias == item.aliases){
                      if(itemSeqId == item.apps_item_seqid){
                        this.itemClicked(item, 0);
                      }
                    }
                  }else{
                    if(itemSeq == item.apps_item_seqid){
                      this.itemClicked(item, 0);
                    }
                  }
                }
              }
            }
            
          }
        }else{
          for(let rows of this.frame.Level4){
            for(let item of rows.Level5){
              for(let itemSeq of itemList){
                if(itemSeq.indexOf(".") > -1){
                  let itemAlias = itemSeq.split(".")[0];
                  let itemSeqId = itemSeq.split(".")[1];
                  if(itemAlias == item.aliases){
                    if(itemSeqId == item.apps_item_seqid){
                      this.itemClicked(item, 0);
                    }
                  }
                }else{
                  if(itemSeq == item.apps_item_seqid){
                    this.itemClicked(item, 0);
                  }
                }
              }
            }
            
          }
        }
      }, 2000);
    }
  }


  async populateDataFromJson() {


    if(this.globalObjects.allFrameJsonData.length > 0){
      for (let g of this.globalObjects.allFrameJsonData) {
        if((g.frame_name == this.frame.apps_page_frame_seqid || g.frame_name == this.frame.frame_alias)){
          for (let p of g.paraData) {

            

            if(p.paraType == 'IV'){
              for(let i of p.frameData){
                let str = "";
                let val = [];
                let rowIndex = i.key ? i.key-1 : 0;

                for(let im of i.items){
                  str = str + im.item_name + ",";
                  val.push(im.para_value);
                }

                let valObj = {
                  rowData:val,
                  pageNo:this.frame.apps_page_no
                }
                let itemName = g.frame_name + "[" + str + "]";
                this.lhs_lib.set_row_values(itemName,valObj,rowIndex);

              }
            }

            if(p.paraType == 'SC'){
              for(let i of p.frameData ){
                this.lhs_lib.set_rows_source_config(g.frame_name,i.items,0);
              }
            }


          }
        }
      }
    }

  //   if(this.frame.apps_page_frame_seqid.indexOf("PARA") > -1){
  //     this.events.publish("setVal");
  //  }
    // let tableData = [];
    // for (let g of this.globalObjects.allFrameJsonData) {
    //   if (g.paraType == 'IV') {
    //     for (let p of g.paraData) {
    //       if ((this.frame.apps_page_frame_seqid == p.frame_name) || (this.frame.frame_alias == p.frame_name)) {
    //         tableData = p.frameData;
    //         this.jsonTableData = p.frameData;
    //       }
    //     }
    //   }
    // }
    // if(tableData.length > 0){

    //   for (let t of tableData) {
    //     let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    //     for (let itemGroup of frameLevel4) {
    //       for (let item of itemGroup.Level5) {
  
    //         for (let i of t.items) {
    //           if (item.item_name.toUpperCase() == i.item_name.toUpperCase()) {
    //             item.value = i.para_value
    //           }
    //         }
    //       }
    //     }
    //     this.tableRows.push(frameLevel4);
    //   }
    //   this.frame.tableRows = this.tableRows;
    //   console.log(tableData);
    // }

    //this.events.publish("setVal");

    if (!this.frame.tableRows || this.frame.tableRows.length <= 0) {
      this.showFrame = true;
      let indexcount: number = -1;
      let tableRows = [];
      indexcount++;
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));

      for (let itemGroup of frameLevel4) {
        for (let item of itemGroup.Level5) {
          item.indexcount = JSON.parse(JSON.stringify(indexcount));
        }
      }
      tableRows.push(frameLevel4);

      this.frame.tableRows = tableRows;
    }
   
  }
 
}
