import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { IonInfiniteScroll, Events } from '@ionic/angular';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-frame-order-entry',
  templateUrl: './frame-order-entry.component.html',
  styleUrls: ['./frame-order-entry.component.scss'],
})
export class FrameOrderEntryComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  userDetails: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
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
  cartItem: any = [];
  filterFormData: any = [];
  ItemimageMap: any = [];
  setStrIndex: any = { "width": "20px", "max-width": "20px", "min-width": "15px" };
  disSetId: any;
  cartdata: any = [];
  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;
  flag: boolean = true;
  countforATC: number = 0;
  parent_cartItemIndex: Array<number> = [];
  loadMoreFlag: string;
  summaryRow: any[];
  FinalCartvalue: number;
  ATC: boolean = true;
  btn: boolean = true;
  loading: boolean = true;
  subscribeRefreshFlag = false;

  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService, private events: Events) {
    this.events.subscribe("toggle", () => {
      this.toggle();
    })

    this.events.subscribe("same_page", (res) => {
      this.wsdp = res;
      this.ngOnInit();
    })

   
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
            this.tableRows = [];
            this.frame.tableRows = [];
            this.frame.verticalTable = [];

            this.loading = true;
            this.ngOnInit();

          }
        }
      })
      this.subscribeRefreshFlag = true;
    }

    this.parent_cartItemIndex = [];
    console.log(this.frame)
    this.tableRows = [];
    this.frame.tableRows = [];
    this.cartItem = [];

    this.userDetails = this.globalObjects.getLocallData("userDetails");
    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }


        console.log(itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        )


        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        ) { } else {

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
        }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }

    }
    this.thead = theaddata;
    this.globalObjects.summaryheadings = this.thead;


    console.log("this.thead in order entry", this.cartdata)
    this.paginate(1);

  }

  showBtn(e, h) {
    e.addBtn = false;
  }

  itemValueChange(event, rowindex, tableIndex) {
    if (event.value <= 0) {
      event.value = null;
    }
    console.log(event.value);
    if (event.dependent_column_str) {
      // this.wsdp = [];
      let wsdp = [];
      let dependent_column_arr = event.dependent_column_str.split("#")
      if (this.frame.tableRows[tableIndex]) {
        let col = {};
        for (let itemGroup of this.frame.tableRows[tableIndex].items[rowindex]) {

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
                item.value = this.globalObjects.autoCalculation(item.formula_str, this.frame.tableRows[tableIndex].items[rowindex])
              }
            }
          }

        }
        wsdp.push(col);
        this.cartdata = this.frame.tableRows; // moving data to summary cart
        this.cartdata.thead = [];
        this.cartdata.thead = this.thead
        this.cartdata.apps_frame_type = []
        this.cartdata.apps_frame_type = this.frame.apps_frame_type

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
        this.getDependentData(event, rowindex, tableIndex).then(res => {
          if (res === "success") {
            if (event.post_text_validate_plsql) {
              // setTimeout(() => this.PostTextValidatePlsql(event, rowindex), 3000);
              this.PostTextValidatePlsql(event, rowindex, tableIndex);
            }
          }
        });
      } else if (event.post_text_validate_plsql) {
        this.PostTextValidatePlsql(event, rowindex, tableIndex);
      }

    }

    this.addtoCart(event, rowindex, tableIndex);

  }


  getDependentData(event, rowindex, tableIndex) {

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
        console.log("response in frame order entry", res)

        if (data.responseStatus == "success") {
          let objData = this.globalObjects.setPageInfo(data.responseData)
          if (objData && (objData.Level1.length > 0) && (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q")) {
            if (objData.Level1[0].message) {
              this.globalObjects.presentAlert(objData.Level1[0].message);
            }
          }
          resolve("success");

          let keyValue = data.responseData;
          for (let itemGroup of this.frame.tableRows[tableIndex].items[rowindex]) {
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
    // }

  }

  PostTextValidatePlsql(event, rowindex, tableIndex) {
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
            alert(objData.Level1[0].message);
          }
          this.globalObjects.clickedbutton = false;
          for (let itemGroup of this.frame.tableRows[tableIndex].items[rowindex]) {
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
          alert(objData.Level1[0].message);
          this.globalObjects.clickedbutton = false;
          for (let itemGroup of this.frame.tableRows[tableIndex].items[rowindex]) {
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
    // if (a_current_page!=1){
    //   this.l_total_remain_pages=Math.ceil(this.l_total_rows / this.frame.no_of_records)-(this.c_to_row-this.frame.no_of_records);
    // }
    this.getData(l_from_row, l_to_row, a_current_page);
  }

  getData(a_from_row: number, a_to_row: number, a_currentPage: number) {
    this.globalObjects.showLoading();
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = String(a_from_row);
    wscp.to_row = String(a_to_row);
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;

    if (this.l_where_str) {
      wscp.where_str = this.l_where_str.join(" ");
    } else {
      wscp.where_str = null;
    }
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }
    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      this.globalObjects.hideLoading();

      let data: any = res;
      console.log("res in frame odrder entry", res)
      if (data.responseStatus == "success") {

        // let tableRows = []; 
        // let tableData = data.responseData.Level1;
        // let tableKey = Object.keys(tableData[0])


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
                  if (item.item_name == 'ITEM_PARENT_CODE') {
                  }
                  //   console.log(key+"-----"+item.item_name);

                  if (item.item_name.toUpperCase() == key.toUpperCase()) {
                    item.value = table[key]
                  } if (item.item_type == 'N' && item.item_visible_flag == 'T') {
                    item.addBtn = true;
                  }
                }
              }
            }
            this.tableRows.push(frameLevel4);
          }

        }
        // else {
        //   this.l_total_rows=null;
        //   this.frame.no_of_records=null;
        //   this.c_to_row=null;
        // }
        //card
        //  {
        //    //rows
        //    {
        //     //td 
        //    },},
        //  {}



        let parentItemMap: Map<any, any> = new Map<any, any>();
        //  console.log(this.tableRows);
        // console.log(item)
        for (let item of this.tableRows) {
          for (let obj of item) {
            if (obj.Level5[0]) {
              if (obj.Level5[0].item_name == "ITEM_PARENT_CODE") {
                //  console.log('ITEM_PARENT_CODE',obj);
                parentItemMap.set(obj.Level5[0].value, obj.Level5[0].apps_item_seqid);
              }

              if (obj.Level5[0].item_type == "DISPLAY_PHOTO" && obj.Level5[0].value) {
                //  console.log('ITEM_PARENT_CODE',obj);
                this.ItemimageMap.push(obj.Level5[0]);
              }
            }

          }
        }
        /*    console.log("parentitem map......",parentItemMap)
           console.log('ItemMap.........',this.ItemimageMap); */
        //  console.log("table rows in orderentry",this.tableRows);
        let count: number = 0;
        parentItemMap.forEach((value: any, key: any) => {
          // console.log(key)
          for (let item of this.tableRows) {
            for (let obj of item) {
              if (obj.Level5[0].item_name == "ITEM_PARENT_CODE" && obj.Level5[0].value == key) {
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
              }
            }
          }
          count++;

        });
        if (this.globalObjects.summaryCartdeatail.length > 0) {
          let glob = this.globalObjects.summaryCartdeatail;
          let globParent = glob.find(g => {
            for (let x of this.cartItem) {
              if (g.parentName == x.parentName) {
                x.items = g.items
              }
            }
          });
        }
        this.frame.tableRows = this.cartItem;  //separating groups
        console.log('parent group wise', this.cartItem);

        // this.frame.tableRows =.push(tableRows);

        this.l_current_page = a_currentPage;
        if (this.l_current_page == 1) {
          this.c_to_row = Math.ceil(this.l_total_rows / (this.l_total_rows / this.frame.no_of_records));
          this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
          this.c_from_row = Math.ceil((this.c_to_row - this.frame.no_of_records)) + 1;
          this.loadMoreFlag = "false";
        }
      }
    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
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

  itemClicked(event, i) {
    event.wsdp = [];
    let col = {};
    for (let itemGroup of this.frame.tableRows[i]) {
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          col[item.apps_item_seqid] = item.value
        }
      }
    }
    event.wsdp.push(col);
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    event.itemIndex = i;

    this.emitPass.emit(event);
  }



  //-------table order by start

  getFilterParameter(event) {
    this.l_where_str = event.where_str;
    this.paginate(1);
  }

  toggle() {
    this.flag = !this.flag;
    // let event:any={};
    // event.click_events_str='NEXT_PAGE';
    // event.page_no='2';
    // this.emitPass.emit(event);
  }
  addtoCart(event, row, h) {
    this.parent_cartItemIndex.push(h);
    // this.parent_cartItemIndex.sort();
    console.log("index if ", this.cartdata.indexOf(h))

    console.log('cardata', this.cartdata[h])
    console.log('global items before', this.globalObjects.summaryCartdeatail);

    if (this.cartdata[h] && this.globalObjects.summaryCartdeatail.length > 0) {
      let glob = this.globalObjects.summaryCartdeatail;
      let globParent = glob.find(g => this.cartdata[h].parentName == g.parentName);
      if (globParent) {
        globParent = this.cartdata[h];
      } else {
        this.cartdata[h].image = [];
        this.cartdata[h].image = this.ItemimageMap[h];
        glob.push(this.cartdata[h]);
      }
      console.log('global items after', this.globalObjects.summaryCartdeatail);
    } else {
      this.cartdata[h].image = [];
      this.cartdata[h].image = this.ItemimageMap[h];
      this.globalObjects.summaryCartdeatail.push(this.cartdata[h]);
    }

    console.log('global items first time enter', this.globalObjects.summaryCartdeatail);
    this.FinalCartvalue = this.globalObjects.summaryCartdeatail.length;

    let qty = 0;
    for (let itemGroup of this.frame.tableRows[h].items[row]) {

      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          if (item.item_name == 'AQTYORDER' && item.value) {
            qty = qty + parseFloat(item.value);
          }
        }
      }
    }

    if (qty <= 0) {
      this.deleteCart(h);
    }
  }

  deleteCart(h) {
    this.parent_cartItemIndex.sort();
    this.parent_cartItemIndex.splice(this.parent_cartItemIndex.indexOf(h), 1);

    let glob = this.globalObjects.summaryCartdeatail;
    let globParent = glob.findIndex(g => this.cartdata[h].parentName == g.parentName);
    for (let item of this.cartdata[h].items) {

      let table_rows = item.find(c => c.Level5[0].item_name == 'AQTYORDER' && c.Level5[0].value != null);
      // console.log('deleted rows == > '+table)
      if (table_rows) {
        table_rows.Level5[0].value = '';
      }
    }
    if (glob[globParent]) {
      glob.splice(globParent, 1);
    }

    console.log('global items after', this.globalObjects.summaryCartdeatail);
  }

  decreaseVal(e, row, h) {
    let val = parseInt(e.value);
    let newVal;
    if (val > 1) {
      newVal = val - 1;
    } else {
      newVal = "";
    }
    e.value = newVal;
    this.itemValueChange(e, row, h);
  }

  increaseVal(e, row, h) {
    let val = parseInt(e.value);
    let newVal;
    if (val) {
      newVal = val + 1;
    } else {
      newVal = 1;
    }
    e.value = newVal;
    this.itemValueChange(e, row, h);
  }
}
