import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-frame-entry-table',
  templateUrl: './frame-entry-table.component.html',
  styleUrls: ['./frame-entry-table.component.scss'],
})
export class FrameEntryTableComponent implements OnInit {
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
  barcodedata: any;

  filterFormData: any = [];

  setStrIndex: any = { "width": "20px", "max-width": "20px", "min-width": "15px" };
  disSetId: any;

  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;


  loadMoreFlag: string;
  summaryRow: any[];
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
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
          let head = {
            prompt_name: itemMast.prompt_name,
            column_width: JSON.parse(itemMast.column_width)
          }
          theaddata.push(head);
        }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }

    }
    this.thead = theaddata;
    this.paginate(1);

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


  itemValueChange(event, rowindex) {
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

  // goToVoiceSearch()
  // {
  //   // this.navCtrl.setRoot("VoiceSearchPage-list");
  //   // this.router.navigate(['VoiceSearchPage-list']);

  // }





}


