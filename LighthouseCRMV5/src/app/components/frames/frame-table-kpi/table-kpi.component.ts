import { Component, OnInit, Input, Output, EventEmitter, ɵConsole } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { ModalController } from '@ionic/angular';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { Events } from 'src/app/demo-utils/event/events';

@Component({
  selector: 'app-frame-table-kpi',
  templateUrl: './table-kpi.component.html',
  styleUrls: ['./table-kpi.component.scss'],
})
export class FrameTableKPIComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  getcanvasWCP: boolean = false;
  userDetails: any;
  current_page_parameter: any = {};
  filterFormData: any = [];

  resData: any;
  l_where_str: any;
  tableRows = [];
  jsFilter:any;
  advanceFilter:any;
  thead: any = {};
  flagforgraph:boolean=false;
  canvasfilter:any=false;
  show_filter:any='dontshow';
  callingObjectArr : any = [];

  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  
  searchText: any;
  
  loadMoreFlag: string;
  summaryRow: any[];
  pdfHeading: any;

  graphFlag: any = false;
  searchFlag: any = false;
  pdfFlag: any = false;
  excelFlag: any = false;
  filter: boolean = false;
  toggleFilter: boolean = false;
  developerModeData :any ;

  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, private events: Events,public modalController: ModalController) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");

  }

  ngOnInit() {
    this.events.subscribe("skipFilter", () => {
      this.filter = false;
      this.toggleFilter = false;
      this.paginate(1);
    });
    
    let frameFilterFlag = this.frame.frame_filter_flag;
    if (frameFilterFlag) {
      if (frameFilterFlag.indexOf("S") > -1) {
        this.searchFlag = true;
      }
      if (frameFilterFlag.indexOf("G") > -1) {
        this.graphFlag = true;
      }
      if (frameFilterFlag.indexOf("P") > -1) {
        this.pdfFlag = true;
      }
      if (frameFilterFlag.indexOf("E") > -1) {
        this.excelFlag = true;
      }
      if (frameFilterFlag.indexOf("C") > -1 || frameFilterFlag.indexOf("J") > -1 || frameFilterFlag.indexOf("A") > -1 || frameFilterFlag.indexOf("D&D") > -1) {
        this.filter = true;
      }
    }
    /*   console.log("from table kpi wsdp ----->" , this.wsdpcl);
      console.log("from table kpi wscp_send_input ----->" , this.wscp_send_input);  */
    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }


        // console.log(itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
        //   (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        // )
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

    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;

    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
      let data: any = res;

      

      if (data.responseStatus == "success") {
        this.resData = data.responseData;

        // Developer Mode Loging
        if(data.responseData.Level1_Keys.length > 0){
          let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
          let wsSewId = id ? data.responseData.Values[0][id] : "";
          this.developerModeData = {
            ws_seq_id: wsSewId,
            frame_seq_id: reqData.wscp.apps_page_frame_seqid
          }
        }
      //Developer Mode Loging

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
        //  console.log("this is response", this.resData.Level1_Keys[0])
        /*  this.keys = [];
         let arrData = [];
         for(let i = 4; i<8 ; i++){
             let key = this.resData.Level1_Keys[i].replace(/_/g,' ');
             this.keys.push(key);
           for(let j; this.resData.Values.length > 0 ; j++){
             let val = this.resData.Values[j];
             console.log(val);
           }    
         }
         */

      }

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
    })
    console.log(this.frame);

  }


  itemClicked(event,rowsdata, i){
    let col = {};
    for (let itemGroup of this.frame.tableRows[i]) {
      if (itemGroup) {
        for (let item of itemGroup) {
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

    var rowindex;
    for (let dataRow of rowsdata) {
      if (dataRow[0].item_name == "ROWNUMBER") {
        rowindex = dataRow[0].value - 1;
      }
    }
    if(!rowindex){
      rowindex = i;
    }

    event.wsdp = [];
      let cols = {};
      for (let itemGroup of this.frame.tableRows[rowindex]) {
        if (itemGroup) {
          for (let item of itemGroup) {
            if (item.codeOfValues) {
              cols[item.apps_item_seqid] = item.codeOfValues
            } else {
              cols[item.apps_item_seqid] = item.value
            }
          }
        }
      }

      event.wsdp.push(cols);
    event.callingObjectArr = this.callingObjectArr;
    event.itemIndex = rowindex;
    this.emitPass.emit(event);
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
  
  async showDeveloperData(){
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
