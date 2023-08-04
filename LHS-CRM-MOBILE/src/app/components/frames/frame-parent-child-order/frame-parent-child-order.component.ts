import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-frame-parent-child-order',
  templateUrl: './frame-parent-child-order.component.html',
  styleUrls: ['./frame-parent-child-order.component.scss'],
})
export class FrameParentChildOrderComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  l_total_rows: any;
  @Input() sessionObj: any = {};
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
  calcItemsArr = [];
  summaryRow:any = [];
  constructor(private globalObjects: GlobalObjectsService, private dataservice: DataService, private events: Events) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {

    let name = "refreshFrame" + ((this.frame.apps_page_frame_seqid).toString().replace(/-/g, "_") + this.globalObjects.refreshId);
    this.events.unsubscribe(name);
    this.events.subscribe(name, res => {
      for (let f of res.refreshFrame) {
        if (f.key == this.frame.apps_page_frame_seqid && f.val == 'T') {
          f.val = 'F'
          this.wscp_send_input = res.wscp;
          this.wsdp = res.wsdp;
          this.tableRows = [];
          this.frame.tableRows = [];
          this.parentRows = [];

          this.getData();

        }
      }
    })


    this.getData();
    let theaddata: any = [];
    for (let itemGroup of this.frame.Level4) {
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_sub_type != 'ONLY_VIEW_PARENT' && itemMast.item_sub_type != 'ONLY_VIEW_COUNT' && itemMast.item_visible_flag == 'T') {

          if (itemMast.display_setting_str) {
            if (typeof (itemMast.display_setting_str) === 'string') {
              try {
                itemMast.display_setting_str = JSON.parse(itemMast.display_setting_str);
              } catch (e) {
                this.globalObjects.presentAlert("Error in display_setting_str format...");
                break;
              }
            }
          }
          if (itemMast.column_width) {
            if (typeof (itemMast.column_width) === 'string') {
              try {
                itemMast.column_width = JSON.parse(itemMast.column_width);
              } catch (e) {
                this.globalObjects.presentAlert("Error in column_width format...");
                break;
              }
            }
          }

          let head = {
            prompt_name: itemMast.prompt_name,
            display_setting_str: itemMast.display_setting_str,
            column_width: itemMast.column_width
          }
          theaddata.push(head);
        } if (itemMast.item_default_value) {
          // itemMast.value = itemMast.item_default_value;
          let obj = {
            frame: this.frame,
            wscp_send_input: this.wscp_send_input
          };

          this.globalObjects.setItemDefaultValue(itemMast, obj);
        }
        if(itemMast.summary_flag){
          if (itemMast.summary_flag.indexOf("S") > -1) {
            this.calcItemsArr.push(itemMast.item_name);
            this.summaryRow.push(JSON.parse(JSON.stringify(itemMast)));
          }
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
    this.scrollFlag = true;
    let wscp: any = {};
    // console.log("framecard getdata", this.frame)
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
    wscp.orignal_apps_item_seqid = this.wscp_send_input.orignal_apps_item_seqid;
    wscp.origin_apps_item_seqid = this.wscp_send_input.origin_apps_item_seqid;
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
      this.scrollFlag = false;
      console.log("res..in frame card...", res)

      let data: any = res;
      this.globalObjects.hideLoading();
      this.frame.tableRows = [];
      if (data.responseStatus == "success") {

        let objData = this.globalObjects.setPageInfo(data.responseData);
        if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
          alert(objData.Level1[0].message);
        }
        else {

          let tableRows = [];

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

                  if (item.display_setting_str) {
                    if (typeof (item.display_setting_str) === 'string') {
                      try {
                        item.display_setting_str = JSON.parse(item.display_setting_str);
                      } catch (e) {
                        this.globalObjects.presentAlert("Error in display_setting_str format...");
                        break;
                      }
                    }
                  }


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

                      itemRowKey.cardRow = frameLevel4;
                    } else {

                      let obj = {
                        parentKey: y.value,
                        showTable: false,
                        cardRow: frameLevel4
                      }
                      this.parentRows.push(obj)
                    }
                  }
                }
              }
              // this.parentRows.push(itemRow);
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

            if (row.length > 0) {
              let tabData = row[0];
              for (let itemGrp of tabData) {
                for (let item of itemGrp.Level5) {
                  if (item.item_visible_flag == 'T') {

                  }
                }
              }
            }

          })
          console.log(this.parentRows);

        }
      }
    }).catch(err => {
      this.scrollFlag = false;
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })

  }

  itemClicked(event, rowsdata, i, j) {
    // event.wsdp = [];
    var rowindex;
    for (let dataRow of rowsdata) {
      if (dataRow.Level5[0].item_name == "ROWNUMBER") {
        rowindex = dataRow.Level5[0].value - 1;
      }
    }
    if (rowindex == undefined || this.frame.calenderflag) {
      rowindex = i;
    }
    if (event.click_events_str == "editItem" || event.click_events_str == "deleteItem") {
      rowindex = j;
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
    // event.wsdp.push(col);
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
    event.wscp = this.wscp_send_input;

    if (event.click_events_str == "editItem") {
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.tableRows[rowindex]))
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
      event.EDIT_ITEM = frameLevel4;
      this.emitPass.emit(event);
    } else if (event.click_events_str == "deleteItem") {
      this.frame.tableRows.splice(rowindex, 1);
    }
    else {
      event.wsdp = [];
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

      event.wsdp.push(col);
    }
    event.itemIndex = rowindex;
    this.emitPass.emit(event);
  }

  showItemTab(p) {
    p.showTable = !p.showTable;
  }


  itemValueChange(event, i, h, rowsdata?) {
    console.log(event);
    if (event.value < 0) {

      this.globalObjects.presentAlert("Please Enter Valid Value....! ")
    } else {

      var rowindex = i;
      /* for (let dataRow of tableData) {
        if (dataRow.Level5[0].item_name == "ROWNUMBER" ) {
          rowindex = dataRow.Level5[0].value - 1;
        }
      }

      if(!rowindex){
        rowindex = i;
      } */

      if (event.dependent_column_str) {
        // this.wsdp = [];
        let wsdp = [];
        let dependent_column_arr = event.dependent_column_str.split("#")
        if (this.frame.tableRows) {
          let col = {};
          for (let itemGroup of rowsdata) {
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
                if (item.formula_str && item.item_sub_type != 'ONLY_VIEW_COUNT') {
                  item.value = this.globalObjects.autoCalculation(item.formula_str, rowsdata)
                  console.log(item);
                }
              }
            }
          }

          // for (let itemGroup of this.frame.tableRows[rowindex]) {
          //   if (itemGroup.Level5) {
          //     for (let item of itemGroup.Level5) {
          //       if (item.codeOfValues) {
          //         col[item.apps_item_seqid] = item.codeOfValues
          //       } else {
          //         col[item.apps_item_seqid] = item.value
          //       }
          //       if (dependent_column_arr.indexOf(item.apps_item_seqid) > -1) {
          //         item.codeOfValues = ""
          //         item.value = ""
          //       }
          //       if (item.formula_str && item.item_sub_type != 'ONLY_VIEW_COUNT') {
          //         item.value = this.globalObjects.autoCalculation(item.formula_str, rowsdata)
          //         console.log(item);
          //       }
          //     }
          //   }
          // }
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
      this.calculateBalance(h);
      this.calculateAllTotal();
      console.log(this.parentRows);
    }

  }

  calculateBalance(i) {
    let formula = "";
    let itmValue = 0;

    for (let c of this.parentRows[i].cardRow) {
      for (let r of c.Level5) {
        if (r.formula_str && r.item_sub_type == 'ONLY_VIEW_COUNT') {
          let formualArr = r.formula_str.split('#');
          formula = formualArr[1];
          let temp = formualArr[2];
          for (let tabData of this.parentRows[i].parentRow) {
            for (let itemGrp of tabData) {
              for (let item of itemGrp.Level5) {
                if (item.item_name == temp && item.value) {
                  itmValue = itmValue + parseFloat(item.value);
                  let value = "";
                  if (r.value.indexOf('/') > -1) {
                    let val = r.value.split("/");
                    value = val[1]
                  } else {
                    value = r.value
                  }
                  if ((parseFloat(value) - itmValue) < 0) {
                    item.value = "";
                    this.globalObjects.presentAlert("Entered quantity should be less than or equal to balance quantity.");
                  }
                }
              }
            }
          }
          let value = "";
          if (r.value.indexOf('/') > -1) {
            let val = r.value.split("/");
            value = val[1]
          } else {
            value = r.value
          }
          let frml = itmValue + "/" + value;
          console.log(frml);
          r.value = frml
        }
      }
    }
  }


  calculateAllTotal() {

    let deci = 0;
    let breaks = false;
    for(let item of this.summaryRow){
      item.value = 0;
    }
    if(this.calcItemsArr.length > 0){
      for (let parentRow of this.parentRows) {
        for (let tabData of parentRow.parentRow) {
          for (let itemGrp of tabData) {
            for (let item of itemGrp.Level5) {
              for(let itm of this.summaryRow){
                if(item.item_name == itm.item_name){
                  if (item.summary_flag.indexOf("#") > -1) {
                    let summ = item.summary_flag.split("#");
                    deci = summ[1];
                  }
                  if(item.value){
                    if(itm.value){
                      itm.value = (parseFloat(itm.value) + parseFloat(item.value)).toFixed(deci);
                    }else{
                      itm.value =  parseFloat(item.value).toFixed(deci);
                    }
                  }

                  if(itm.on_blur){
                    let val = eval(itm.value)
                    let formula = itm.on_blur.replaceAll('QTY_VALIDATION', val );
                    let ret = this.globalObjects.onBlurEvent(itm,formula,tabData);

                    if(ret == 'error'){
                      item.value = "";
                      breaks = true;
                      break;
                    }
                  }
                  
                }
              }
              if(breaks){
                break;
              }
            }
            if(breaks){
              break;
            }
          }
          if(breaks){
            break;
          }
        }
        if(breaks){
          break;
        }
        if(breaks){
          break;
        }
      }
     
    }

    console.log("summery row data>>>>>>>>>>>>",this.summaryRow);
  }

}
