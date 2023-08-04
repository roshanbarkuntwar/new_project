import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-frame-group-table',
  templateUrl: './frame-group-table.component.html',
  styleUrls: ['./frame-group-table.component.scss'],
})
export class FrameGroupTableComponent implements OnInit {


  @Input() frame: any = {};
  @Input() resforgraph: any = {};
  @Input() wscp: any = {};
  flagtoruncanvasfilter: boolean;  //jsdagysgdfsd
  //frametable: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitForPdf: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  tableRows = [];
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_where_str: any;
  showLoading: boolean = false;
  getcanvasWCP: boolean = false;
  filter: boolean = false;
  userDetails: any;
  cartItem: any = [];

  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
   }

  ngOnInit() {
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
    this.showLoading = true;
    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = String(a_from_row);
    wscp.to_row = String(a_to_row);
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
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

    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
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
      
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);

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
            


            let parentItemMap: Map<any, any> = new Map<any, any>();
            for(let rows of this.tableRows){
              for(let itemGroup of rows){
                for (let item of itemGroup.Level5) {
                  if(item.tool_tip){
                    if(item.tool_tip == 'P'){
                      parentItemMap.set(item.value, item.apps_item_seqid);
                    }
                  }
                }
              }
            }

            let count: number = 0;
            parentItemMap.forEach((value: any, key: any) => {

              for (let item of this.tableRows) {
                for (let obj of item) {
                  if (obj.Level5[0].tool_tip == "P" && obj.Level5[0].value == key) {
              if (this.cartItem[count]) {
                this.cartItem[count].parentName = key;
                this.cartItem[count].items.push(JSON.parse(JSON.stringify(item)));

              } else {
                this.cartItem[count] = [];
                this.cartItem[count].items = []
                this.cartItem[count].parentName = key;
                //  this.parent_cartItemIndex.push(count);

                this.cartItem[count].items.push(JSON.parse(JSON.stringify(item)));
              }
              count++;
            }
          }
        }
            })

            console.log(this.cartItem);
          }
         
        // Developer Mode Loging
       
        //Developer Mode Loging

      } 
    }).catch(err => {
     // this.showLoading = false;
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }

}
