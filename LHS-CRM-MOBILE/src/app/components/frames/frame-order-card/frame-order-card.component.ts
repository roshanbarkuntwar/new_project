import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-frame-order-card',
  templateUrl: './frame-order-card.component.html',
  styleUrls: ['./frame-order-card.component.scss'],
})
export class FrameOrderCardComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  l_total_rows: any;
  sessionObj: any = []
  tableRows = [];
  c_from_row: number;
  c_to_row: number;
  l_current_page: number = 1;
  l_total_remain_pages: number;
  l_totalPage: number;
  l_where_str: any;
  filterFormData: any = [];
  l_card_title: any;
  tablerowsfilter: any;
  wscp: any = {};
  listLength: number;
  loadMoreFlag: boolean;
  searchFlag: any = false;
  canvasfilter: any = false;
  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  scrollFlag: boolean = false;

  flagtoruncanvasfilter: boolean;
  noRecordMessage: any;
  getcanvasWCP: boolean = false;
  cardtitleFlag: boolean = true;

  filter: boolean = false;
  toggleFilter: boolean = false;

  callingObjectArr = [];
  colSize: any = [];
  footer_flag: boolean = false;
  userDetails: any;
  thead: any[];
  parentRows = [];
  summaryCartArr = [];
  loading:boolean = true;
  itmQty:number = 0;

  constructor(private globalObjects: GlobalObjectsService, private dataservice: DataService,private events: Events) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.events.subscribe("same_page", (res) => {
      this.tableRows = [];
      this.parentRows = [];
      this.wsdp = res;
      this.getData();
    })
  }

  ngOnInit() {
    this.getData();
    let theaddata: any = [];
    for (let itemGroup of this.frame.Level4) {
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_sub_type != 'ONLY_VIEW_PARENT' && itemMast.item_sub_type != 'ONLY_VIEW_COUNT' && itemMast.item_visible_flag == 'T') {
          let head = {
            prompt_name: itemMast.prompt_name,
            display_setting_str: itemMast.display_setting_str,
            column_width: JSON.parse(itemMast.column_width)
          }
          theaddata.push(head);
        }
      }
    }
    this.thead = theaddata;
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

  getData() {
    this.loading = true;
    let wscp: any = {};
    // console.log("framecard getdata", this.frame)
    wscp.service_type = this.frame.on_frame_load_str;
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
    if (this.frame.no_of_records) {
      wscp.no_of_record_cards = this.frame.no_of_records
    }
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }
    this.globalObjects.showLoading();

    let l_url = "S2U";
    this.dataservice.postData(l_url, data).then(res => {
      console.log("res..in frame card...", res)

      let data: any = res;
      this.globalObjects.hideLoading();
      this.frame.tableRows = [];
      if (data.responseStatus == "success") {

        let objData = this.globalObjects.setPageInfo(data.responseData);
        if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
          this.globalObjects.presentAlert(objData.Level1[0].message);
        }
        else {

          // For Getting *CALLING_OBJECT_CODE* from Frame //
          this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
          // For Getting *CALLING_OBJECT_CODE* from Frame //

          let tableData = objData.Level1;
          let tableKey = [];
          if (tableData[0]) {
            tableKey = Object.keys(tableData[0])
            this.l_total_rows = parseFloat(tableData[0].TOTAL_ROWS);
          }
          this.noRecordMessage = "";

          if (tableData.length > 0) {
            for (let table of tableData) {

              let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
              for (let itemGroup of frameLevel4) {
                for (let item of itemGroup.Level5) {
                  for (let key of tableKey) {
                    if (item.item_name && item.item_name.toUpperCase() == key.toUpperCase()) {
                      item.value = table[key]
                    }
                  }
                }
              }
              for (let x of frameLevel4) {
                for (let y of x.Level5) {
                  if (y.item_sub_type == 'ONLY_VIEW_PARENT') {
                    let itemRowKey = this.parentRows.find(x => x.parentKey == y.value);
                    if (itemRowKey) {
                      itemRowKey.cardRow = JSON.parse(JSON.stringify(frameLevel4));
                    } else {
                      let obj = {
                        parentKey: y.value,
                        showTable: false,
                        cardRow: frameLevel4,
                        totalQty: 0
                      }
                      this.parentRows.push(obj);
                    }
                  }
                }
              }
              this.tableRows.push(frameLevel4);
            }
          }
          this.frame.tableRows = this.tableRows;

          this.parentRows.forEach(x => {
            let row = [];
            for (let tabData of this.frame.tableRows) {
              for (let itemGrp of tabData) {
                for (let item of itemGrp.Level5) {
                  if (item.item_sub_type == "ONLY_VIEW_PARENT" && item.value == x.parentKey) {
                    row.push(tabData);
                    x.parentRow = row;
                  }
                }
              }
            }
          })
          console.log(this.parentRows);
        }
      }

      if (this.globalObjects.cartSummaryPlain.length > 0) {
        // let tableRows = [];
        this.summaryCartArr = JSON.parse(JSON.stringify(this.globalObjects.cartSummaryPlain));

       
        this.parentRows = this.summaryCartArr;
        this.tableRows = [];

        for (let row of this.globalObjects.cartSummaryPlain) {
          for (let p of row.parentRow) {
            this.tableRows.push(p);
          }
        }
        this.frame.tableRows = this.tableRows;
      }

      this.loading = false;
    }).catch(err => {
      this.loading = false;
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }

  showItemTab(p) {
    p.showTable = !p.showTable;
  }

  itemValueChange(event, i, tableData) {
    console.log(event);
    var rowindex;
    for (let dataRow of tableData) {
      if (dataRow.Level5[0].item_name == "ROWNUMBER") {
        rowindex = dataRow.Level5[0].value - 1;
      }
    }
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
        console.log(event)
      } else if (event.post_text_validate_plsql) {
        console.log(event)
      }
    }
    this.calculateBalance(i,event);
    console.log(this.parentRows);
  }

  calculateBalance(i,event) {
    let itmValue = 0;
    let itmQty = 0;
    for (let c of this.parentRows[i].cardRow) {
      for (let r of c.Level5) {
        if (r.item_name == 'TOTAL') {
          r.value = 0;
          for (let tabData of this.parentRows[i].parentRow) {
            for (let itemGrp of tabData) {
              for (let item of itemGrp.Level5) {
                if (item.item_name == 'TOTAL' && item.value) {
                  itmValue = itmValue + parseFloat(item.value)
                }
               
              }
            }
          }
          r.value = itmValue;
        }
        if (r.item_name == 'AQTYORDER') {
          for (let tabData of this.parentRows[i].parentRow) {
            for (let itemGrp of tabData) {
              for (let item of itemGrp.Level5) {
                if (item.item_name == 'AQTYORDER' && item.value) {
                  itmQty = itmQty + parseFloat(item.value)
                }
               
              }
            }
          }
          this.parentRows[i].totalQty = itmQty;
        }
      }
    }
    let parent:any = JSON.parse(JSON.stringify(this.parentRows[i]));
    let rows = [];
    for (let p of parent.parentRow) {
      for (let itemGroup of p) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.value && item.item_name == 'AQTYORDER') {
              rows.push(p);
            }
          }
        }
      }
    }
    if (rows.length > 0) {
      parent.parentRow = rows;
    }
    let parentKeyExist:any = this.summaryCartArr.find(x => x.parentKey == this.parentRows[i].parentKey);
    if (parentKeyExist) {
        parentKeyExist.cardRow = parent.cardRow;
        parentKeyExist.parentRow = parent.parentRow;
        parentKeyExist.totalQty = parent.totalQty;
    } else {
      this.summaryCartArr.push(parent);
    }
    this.globalObjects.cartSummaryPlain = this.summaryCartArr;
    event.wsdp = [];
    this.emitPass.emit(event);
  }

  itemClicked(event, rowsdata, i, j) {
    var rowindex;
    for (let dataRow of rowsdata) {
      if (dataRow.Level5[0].item_name == "ROWNUMBER") {
        rowindex = dataRow.Level5[0].value - 1;
      }
    }
    if (rowindex == undefined || this.frame.calenderflag) {
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
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
    event.wscp = this.wscp_send_input;
    event.wsdp.push(col);
    event.itemIndex = rowindex;
    this.emitPass.emit(event);
  }

  goCart() {
    this.globalObjects.cartSummaryPlain = this.summaryCartArr;
    if(this.summaryCartArr.length > 0){
      let event: any = {};
      event.click_events_str = "NEXT_PAGE";
      event.page_no = "2";
  
      this.emitPass.emit(event);
    }else{
      alert("Please Add Some Quantity");
    }
  }

}
