import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-frame-add-to-cart',
  templateUrl: './frame-add-to-cart.component.html',
  styleUrls: ['./frame-add-to-cart.component.scss'],
})
export class FrameAddToCartComponent implements OnInit {
  @Input() frame: any = {};
  //frametable: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  current_page_parameter: any = {};
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
  tablerowsfilter:any;
  barcodedata: any;

  filterFormData: any = [];

  setStrIndex: any = { "width": "20px", "max-width": "20px", "min-width": "15px" };
  disSetId: any;

  summcartArr = [];
  maincartRows = [];
  summCart: boolean = false;

  cartBtn = true;

  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;
  public showAddButton: Boolean = true;
  public showQunatityInput: Boolean = false;

  loadMoreFlag: string;
  summaryRow: any[];

  cartItems:boolean = false;

  subscribeRefreshFlag = false;
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService, private events: Events) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.events.subscribe("same_page", (res) => {
      this.wsdp = res;
      this.paginate(1);
    })

  }

  ngOnInit() {
    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;

    let name = "refreshFrame" + ((this.frame.apps_page_frame_seqid).toString().replace(/-/g, "_") + this.globalObjects.refreshId);
    if (!this.subscribeRefreshFlag) {
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

    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }

       /*  console.log(itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        )
 */
        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        ) { } else {
          let head = {
            prompt_name: itemMast.prompt_name,
            display_setting_str: itemMast.display_setting_str
          }
          theaddata.push(head);
        }if(itemMast.item_default_value){
          itemMast.value = itemMast.item_default_value;
        }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }

    }
    this.thead = theaddata;
    this.paginate(1);

  }


  

  ShowQty(event, tabledata, r) {
    /*  document.getElementById("showAddButton"+ r).style.display="none";
     document.getElementById("showQunatityInput"+ r).style.display="flex"; */
    event.addBtn = false;
   // this.increaseNum(event, tabledata, r);

  }

  addToCartPage(event, tabledata, r) {
    var rowindex;
    for (let dataRow of tabledata) {
      if (dataRow.Level5[0].item_name == "ITEM_NAME") {
        rowindex = dataRow.Level5[0].value;
      }
    }
    if (this.summcartArr.length > 0) {

      let cartObj = this.summcartArr.find(s => s.key == rowindex);
      if (cartObj) {
        if (event.value) {
          cartObj.key = rowindex;
          cartObj.cartRows = tabledata;
          this.globalObjects.cartSummaryPlain = this.summcartArr;
        } else {
          let index = this.summcartArr.indexOf(cartObj);
          this.summcartArr.splice(index, 1);
          this.globalObjects.cartSummaryPlain = this.summcartArr;
         
        }
      } else {
        let summObj = {
          key: rowindex,
          cartRows: tabledata
        }
        this.summcartArr.push(summObj);
        this.globalObjects.cartSummaryPlain = this.summcartArr;
      }
      
    } else {
      if (event.value) {
        let summObj = {
          key: rowindex,
          cartRows: tabledata
        }

        this.summcartArr.push(summObj);
      }
    }
    if(this.frame.apps_page_no == "3"){
      
      this.paginate();
      this.events.publish("showSummary");
      }

  }


  ShowAddButton() {
    document.getElementById("showAddButton").style.display = "block";
    document.getElementById("showQunatityInput").style.display = "none";
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


  itemValueChange(event, tabledata, rowindex) {
   
    if(event.value < 0){
      this.cartBtn = false;
    }else{
      this.cartBtn = true;
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

    this.addToCartPage(event, tabledata, rowindex);

  }
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
    // }

  }

  PostTextValidatePlsql(event, rowindex) {
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
          alert(objData.Level1[0].message);
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
    this.cartItems = false;
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
                  if (item.item_name.toUpperCase() == key.toUpperCase()) {
                    item.value = table[key]
                  }
                  if (item.item_name == 'AQTYORDER'){
                    item.addBtn = true;
                  }
                }
              }
            }
            this.tableRows.push(frameLevel4);
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


        this.frame.tableRows = this.tableRows;

        this.cartItems = true;
        //  console.log(this.tableRows[0][1].Level5[0].item_name);

        // this.frame.tableRows =.push(tableRows);

        this.l_current_page = a_currentPage;
        if (this.l_current_page == 1) {
          this.c_to_row = Math.ceil(this.l_total_rows / (this.l_total_rows / this.frame.no_of_records));
          this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
          this.c_from_row = Math.ceil((this.c_to_row - this.frame.no_of_records)) + 1;
          this.loadMoreFlag = "false";
        }
      } else {
        this.frame.tableRows = [];
        this.cartItems = true;
        if (this.globalObjects.cartSummaryPlain.length > 0) {
          let tableRows = [];
          this.summcartArr = this.globalObjects.cartSummaryPlain;
          for (let row of this.globalObjects.cartSummaryPlain) {
            tableRows.push(row.cartRows)
          }
          this.frame.tableRows = tableRows;
        }

      }
    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }


  itemClicked(event, i) {
    event.wsdp = [];
    let col = {};
    for (let tabledata of this.summcartArr) {
      for (let itemGroup of tabledata.cartRows) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.value) {
              col[item.apps_item_seqid] = item.value;
            }
          }
        }
      }
    }
    event.wsdp.push(col);
    event.wsdpcl = [];
    event.wsdpcl.push(col);

    this.emitPass.emit(event);
  }



  //-------table order by start

  getFilterParameter(event) {
    this.l_where_str = event.where_str;
    this.paginate(1);
  }

  decreaseNum(event, tabledata, i) {
    if (event.value > 1) {
      event.value = parseInt(event.value) - 1;
    } else {
      event.value = "";

    }
    this.itemValueChange(event, tabledata, i);
  }

  increaseNum(event, tabledata, i) {
    if (event.value) {
      event.value = parseInt(event.value) + 1;
    } else {
      event.value = 1;
    }
  this.itemValueChange(event, tabledata, i);
  }

  showSumCart() {
    /* if(!this.summCart){
    this.maincartRows = this.frame.tableRows;
    }
    this.frame.tableRows = []; */
    /*  let tableRows = [];
     for(let row of this.summcartArr){
         tableRows.push(row.cartRows)
     } */
    if (this.summcartArr.length > 0) {
      if (!this.cartBtn) {
        this.globalObjects.presentAlert('Please input correct Value');
      } else {

        this.globalObjects.cartSummaryPlain = this.summcartArr;
        /*  this.summCart= true;  */
        let event: any = {};
        event.click_events_str = "NEXT_PAGE";
      //  event.page_no = "2";

        this.emitPass.emit(event);
      }
    } else {
      this.globalObjects.presentAlert("Please Add Some Item");
    }
  }

  backToCart() {
    this.summCart = false;
    this.frame.tableRows = [];
    this.frame.tableRows = this.maincartRows;

  }

  // goToVoiceSearch()
  // {
  //   // this.navCtrl.setRoot("VoiceSearchPage-list");
  //   // this.router.navigate(['VoiceSearchPage-list']);

  // }

}
