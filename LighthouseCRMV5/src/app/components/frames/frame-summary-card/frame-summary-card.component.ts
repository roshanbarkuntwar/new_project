import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/demo-utils/event/events';
import { ModalController } from '@ionic/angular';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';

@Component({
  selector: 'app-frame-summary-card',
  templateUrl: './frame-summary-card.component.html',
  styleUrls: ['./frame-summary-card.component.scss'],
})
export class FrameSummaryCardComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() resforgraph: any = {};
  flagtoruncanvasfilter: boolean;
  userDetails: any;
  current_page_parameter: any = {};
  filterFormData: any = [];
  resData: any;
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_where_str: any;
  tableRows = [];
  thead: any = {};
  callingObjectArr: any = [];
  displayTableRow: any = [];
  flagforgraph: boolean = false;

  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;

  loadMoreFlag: string;
  summaryRow: any[];
  pdfHeading: any;
  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  graphFlag: any = false;
  searchFlag: any = false;
  pdfFlag: any = false;
  getcanvasWCP: boolean = false;
  tablerowsfilter: any;

  filter: boolean = false;
  toggleFilter: boolean = false;
  colSize: any = [];
  developerModeData: any;
  subscribeRefreshFlag = false;
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, private events: Events, public modalController: ModalController) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {

    let name = "refreshFrame" + ((this.frame.apps_page_frame_seqid).toString().replace(/-/g,"_"));
    if(!this.subscribeRefreshFlag){
    this.events.subscribe(name, res => {
      for (let f of res.refreshFrame) {
        if (f.key == this.frame.apps_page_frame_seqid && f.val == 'T') {
          f.val = 'F';
          this.wscp_send_input = res.wscp;
          this.wsdp = res.wsdp;
          this.ngOnInit();
        }
      }
    })
    this.subscribeRefreshFlag = true;
  }

    this.events.subscribe("skipFilter", () => {
      this.filter = false;
      this.toggleFilter = false;
      this.paginate(1);
    });

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
      if (frameFilterFlag.indexOf("C") > -1 || frameFilterFlag.indexOf("J") > -1 || frameFilterFlag.indexOf("A") > -1) {
        this.filter = true;
      }
    }

    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;

    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }
        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        ) { } else {
          theaddata.push(itemMast.prompt_name);
        }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }
    }
    this.thead = theaddata;
    this.paginate(1);
    // this.getData();
  }

  /* getData() {
 
     let wscp: any = {};
     //wscp.service_type = "get_populate_data";
     wscp.service_type = this.frame.on_frame_load_str;
     wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
 
     var data = {
       "wslp": this.userDetails,
       "wscp": wscp,
       "wsdp": this.wsdp
     }
 
     let l_url = "S2U";
     this.dataService.postData(l_url, data).then(res => {
       let data: any = res;
 
       if (data.responseStatus == "success") {
         this.resData = data.responseData;
         let objData = this.globalObjects.setPageInfo(data.responseData);
         // For Getting *CALLING_OBJECT_CODE* from Frame //
         this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
         // For Getting *CALLING_OBJECT_CODE* from Frame //
         let tableData = objData.Level1;
         if (tableData && tableData.length > 0) {
           let tableKey = Object.keys(tableData[0])
           for (let table of tableData) {
             let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
             for (let itemGroup of frameLevel4) {
               for (let item of itemGroup.Level5) {
                 for (let key of tableKey) {
                   if (item.item_name.toUpperCase() == key.toUpperCase()) {
                     item.value = table[key];
                   }
                 }
               }
             }
             this.tableRows.push(frameLevel4);
           }
           let finalDisplayTable = []
 
           for (let data of this.tableRows) {
             let finalTableRow: any = [];
             let finalDataRow = [];
             for (let temp of data) {
               if (temp.Level5) {
                 finalDataRow.push(temp.Level5);
               }
             }
             finalTableRow = finalDataRow;
             finalDisplayTable.push(finalTableRow);
           }
           this.frame.tableRows = finalDisplayTable;
         }
         // console.log("Summery card table rows", this.frame.tableRows);
       }
     })
   }*/

  filterToggle() {
    if (this.show_filter == 'show') {
      this.show_filter = 'dontshow';
    }
    else {
      this.show_filter = 'show';
      let frameFilterFlag = this.frame.frame_filter_flag;
      if (frameFilterFlag) {

        if (frameFilterFlag.indexOf("C") > -1 || frameFilterFlag.indexOf("J") > -1 || frameFilterFlag.indexOf("A") > -1) {
          this.toggleFilter = true;
        }

      }
    }
  }

  getdataFromcanvasFilter(event) {
    this.getcanvasWCP = true;
    let array = [];
    this.filter = false;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;

    array = event.where_str;

    this.l_where_str = [];
    if (array.length > 0) {
      for (let data of array) {
        console.log(data)

        this.l_where_str += data + "  ";
      }
    }
    else {
      this.l_where_str = "";
    }
    this.frame.l_where_str = this.l_where_str;
    console.log("array concate", this.l_where_str)
    this.paginate(1);
  }


  getFilterParameter(event) {
    console.log(event.where_str)
    this.l_where_str = event.where_str;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;
    //this.getData();
    this.getdataFromcanvasFilter(event);
    //this.paginate(1);
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
    this.globalObjects.showLoading();
    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = String(a_from_row);
    wscp.to_row = String(a_to_row);
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;

    if (this.l_where_str && this.getcanvasWCP) {
      wscp.where_str = this.l_where_str;
    } else if (this.l_where_str && this.filter) {
      wscp.where_str = this.l_where_str.join(" ");
    } else if (this.l_where_str && this.flagtoruncanvasfilter) {
      wscp.where_str = this.l_where_str;
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
          }
        }
        //Developer Mode Loging

        // let tableRows = []; 
        // let tableData = data.responseData.Level1;
        // let tableKey = Object.keys(tableData[0])


        let objData = this.globalObjects.setPageInfo(data.responseData);

        // For Getting *CALLING_OBJECT_CODE* from Frame //
        this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
        // For Getting *CALLING_OBJECT_CODE* from Frame //

        let tableData = objData.Level1;
        if (tableData && tableData.length > 0) {
          let tableKey = Object.keys(tableData[0])
          this.l_total_rows = tableData[0].TOTAL_ROWS;
          for (let table of tableData) {
            let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
            for (let itemGroup of frameLevel4) {
              for (let item of itemGroup.Level5) {
                for (let key of tableKey) {
                  if (item.item_name.toUpperCase() == key.toUpperCase()) {
                    item.value = table[key];
                  }
                }
              }
            }
            this.tableRows.push(frameLevel4);
          }

          if (this.frame.flagtoclosefilter) {
            this.show_filter = "show";
            this.filterToggle();
          }

          var lastRow: any = [];
          var maxMinNum = [];
          var avg = [];
          for (let i = 0; i < this.thead.length; i++) {
            for (let itemDataArr of this.tableRows) {
              for (let item of itemDataArr) {
                if (item.Level5[0].summary_flag == 'SUM' || item.Level5[0].summary_flag == 'COUNT' || item.Level5[0].summary_flag == 'AVG' || item.Level5[0].summary_flag == 'MAX' || item.Level5[0].summary_flag == 'MIN') {
                  if (item.Level5[0].summary_flag == 'SUM' && item.Level5[0].prompt_name == this.thead[i]) {
                    if (lastRow[i]) {
                      lastRow[i] = "Sum : " + (parseFloat(lastRow[i].split(":")[1]) + parseFloat(item.Level5[0].value)).toFixed(2);
                    }
                    else {
                      lastRow[i] = "Sum : " + parseFloat(item.Level5[0].value);
                    }
                  }
                  else if (item.Level5[0].summary_flag == 'AVG' && item.Level5[0].prompt_name == this.thead[i]) {
                    if (item.Level5[0].value) {
                      avg.push(parseFloat(item.Level5[0].value));
                      // lastRow[i] = Math.max.apply(null,maxMinNum);
                      var sum = 0;
                      for (var j = 0; j < avg.length; j++) {
                        sum += parseInt(avg[j], 10); //don't forget to add the base
                      }
                      lastRow[i] = "Average: " + sum / avg.length;
                    }
                  }
                  else if (item.Level5[0].summary_flag == 'COUNT' && item.Level5[0].prompt_name == this.thead[i]) {
                    if (lastRow[i]) {
                      lastRow[i] = "Count : " + Math.round(parseFloat(lastRow[i].split(":")[1])) + parseFloat(item.Level5[0].value);
                    }
                    else {
                      lastRow[i] = "Count :" + 1;
                    }
                  }
                  else if (item.Level5[0].summary_flag == 'MAX' && item.Level5[0].prompt_name == this.thead[i]) {
                    if (item.Level5[0].value) {
                      maxMinNum.push(parseFloat(item.Level5[0].value));
                      lastRow[i] = "Max : " + Math.max.apply(null, maxMinNum);
                    }
                  }
                  else if (item.Level5[0].summary_flag == 'MIN' && item.Level5[0].prompt_name == this.thead[i]) {
                    if (item.Level5[0].value) {
                      maxMinNum.push(parseFloat(item.Level5[0].value));
                      lastRow[i] = "Min : " + Math.min.apply(null, maxMinNum);
                    }
                  }
                }
                else {
                  if (lastRow[i]) {

                  }
                  else {
                    lastRow[i] = "";
                  }

                }
              }
            }
          }
          this.summaryRow = lastRow;
        }
        // else {
        //   this.l_total_rows=null;
        //   this.frame.no_of_records=null;
        //   this.c_to_row=null;
        // }




        // -----------------Ranjeet coding for sorting----------------
        let finalDisplayTable = []

        for (let data of this.tableRows) {
          let finalTableRow: any = [];
          let finalDataRow = [];
          for (let temp of data) {
            if (temp.Level5) {
              for (let d of temp.Level5) {
                if (d.item_visible_flag == 'F' && d.item_name != "ROWNUMBER") {
                }
                else {
                  finalDataRow.push(temp.Level5);
                }
              }
            }
          }
          finalTableRow = finalDataRow;
          finalDisplayTable.push(finalTableRow);
        }
        this.frame.tableRows = finalDisplayTable;
        this.events.publish("tablerows", this.frame.tableRows);
        // ---------------------------------------------------------------


        // this.frame.tableRows =.push(tableRows);
        this.verticaldata();
        this.pdfHeading = this.frame.apps_page_frame_name;

        this.l_current_page = a_currentPage;
        // vijay if current page =1 then 
        if (this.l_current_page == 1) {
          this.c_to_row = Math.ceil(this.l_total_rows / (this.l_total_rows / this.frame.no_of_records));
          // this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
          if (this.frame.no_of_records > 0) {
            this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
          } else {
            this.l_total_remain_pages = 1;
          }
          this.c_from_row = Math.ceil((this.c_to_row - this.frame.no_of_records)) + 1;
          this.loadMoreFlag = "false";
        }
      }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }

  goToLast(lastRow, l_current_page) {
    this.l_current_page = l_current_page;
    this.tableRows = [];
    this.getData(1, lastRow, l_current_page);
  }


  verticaldata() {
    this.frame.verticalTable = this.globalObjects.transpose(this.frame.tableRows);
  }

  itemClicked(event, rowsdata, i) {
    event.callingObjectArr = this.callingObjectArr;
    event.wsdp = [];
    let col = {};

    var rowindex;
    for (let dataRow of rowsdata) {
      if (dataRow[0].item_name == "ROWNUMBER") {
        rowindex = dataRow[0].value - 1;
      }
    }
    if (!rowindex) {
      rowindex = i;
    }
    //  rowindex = i;


    for (let itemGroup of this.frame.tableRows[i]) {
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
