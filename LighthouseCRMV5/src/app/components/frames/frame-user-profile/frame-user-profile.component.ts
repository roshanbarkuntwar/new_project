import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { Events } from 'src/app/demo-utils/event/events';

@Component({
  selector: 'app-frame-user-profile',
  templateUrl: './frame-user-profile.component.html',
  styleUrls: ['./frame-user-profile.component.scss'],
})
export class FrameUserProfileComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  thead: any = [];
  thead2: any = [];
  dispalyss: any = { "color": "red", "text-yellow": "pink" };
  userDetails: any;
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_where_str: any;
  filterFormData: any = [];
  l_card_title: any;
  tablerowsfilter: any;
  imgData: any;
  tableRows: any = [];
  searchFlag: any = false;
  canvasfilter: any = false;
  jsFilter: any = false;
  cFilter: any = false;
  jFilter: any = false;
  public show: boolean = false;
  searchText: any;
  loadMoreFlag: boolean;
  l_totalPage: number;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  scrollFlag: boolean = false;
  listLength: number;
  enablefunnel: boolean = false;
  filter: boolean = false;
  getcanvasWCP: boolean = false;
  flagtoruncanvasfilter: boolean;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  noRecordMessage: string = "";
  callingObjectArr: any[];
  toggleFilter: boolean = false;
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService, private events: Events) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");

    this.events.subscribe("clearalldata", () => {
      this.l_where_str = "";
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.events.subscribe("skipFilter", () => {
      this.filter = false;
      this.show_filter = 'dontshow';
      this.toggleFilter = false;
      // this.paginate(1);
    });
    console.log("frame in frame card component..>>", this.frame);
    let frameFilterFlag = this.frame.frame_filter_flag;
    // if (frameFilterFlag) {
    //   if (frameFilterFlag.indexOf("S") > -1) {
    //     this.searchFlag = true;
    //   }
    //   if (frameFilterFlag.indexOf("C") > -1) {
    //     this.canvasfilter = true;
    //   }
    //   if (frameFilterFlag.indexOf("J") > -1) {
    //     this.jsFilter = true;
    //   }
    // }

    if (frameFilterFlag) {
      if (frameFilterFlag.indexOf("S") > -1) {
        this.searchFlag = true;
      }
      // if (frameFilterFlag.indexOf("G") > -1) {
      //       this.graphFlag = true;
      //     }
      //     if (frameFilterFlag.indexOf("P") > -1) {
      //       this.pdfFlag = true;
      //     }
      //     if (frameFilterFlag.indexOf("E") > -1) {
      //       this.excelFlag = true;
      //     }

      if (frameFilterFlag.includes("C") || frameFilterFlag.includes("J") || frameFilterFlag.includes("A")) {
        this.filter = false;
        this.enablefunnel = true;
        var count1 = (frameFilterFlag.match(/J/g) || []).length;
        var count2 = (frameFilterFlag.match(/C/g) || []).length;
        var count3 = (frameFilterFlag.match(/A/g) || []).length;


        if (count1 == 2 || count2 == 2 || count3 == 2) {
          this.filter = true;
          this.enablefunnel = true;
        }
      }

    }


    // this.getData();
    // this.getProfileImg();
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
    this.paginate(1);
  }


  updateModel(value) {
    this.l_card_title = value;
  }


  // filterToggle() {
  //   if (this.show_filter == 'show') {
  //     this.show_filter = 'dontshow';
  //   }
  //   else {
  //     this.show_filter = 'show';
  //   }
  // }


  filterToggle() {
    console.log(this.show_filter)
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
        else {
          this.toggleFilter = true;
        }
      }
    }
  }










  getData(a_from_row: number, a_to_row: number, a_currentPage: number) {
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

    if (this.frame.no_of_records) {
      wscp.no_of_record_cards = this.frame.no_of_records
    }


    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      console.log("res..in frame card...", res)


      let data: any = res;
      this.globalObjects.hideLoading();
      this.frame.tableRows = [];
      if (data.responseStatus == "success") {

        // this.infiniteScroll.disabled = !this.infiniteScroll.disabled;

        let tableRows = [];
        //  let tableData = data.responseData.Level1;
        //  let tableKey = Object.keys(tableData[0])

        let objData = this.globalObjects.setPageInfo(data.responseData);

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

        if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
          alert(objData.Level1[0].message);
        }
        if (tableData.length > 0) {
          let indexcount: number = -1;
          for (let table of tableData) {
            indexcount++;
            let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
            for (let itemGroup of frameLevel4) {
              for (let item of itemGroup.Level5) {
                for (let key of tableKey) {
                  if (item.item_name.toUpperCase() == key.toUpperCase()) {
                    item.value = table[key]
                  }
                  item.indexcount = JSON.parse(JSON.stringify(indexcount));
                }
              }
            }
            this.tableRows.push(frameLevel4);
          }
        } else {
          this.frame.tableRows = [];
        }

        this.frame.tableRows = this.tableRows;
        this.listLength = this.frame.tableRows.length;


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
        }
        if (a_to_row > this.l_total_rows) {
          this.loadMoreFlag = true;
        }
        if (this.frame.no_of_records) { } else { this.loadMoreFlag = true; }
        if (this.frame.tableRows.length > 0) { } else {
          this.noRecordMessage = "Query has no Data..!";

        }
        this.l_total_remain_pages = this.l_total_remain_pages - 1;
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        setTimeout(() => {
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;

        }, 200);


      }
    }).catch(err => {
      console.log('vijay frame-table.component.ts Something went wrong :', err);

      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })

  }


  isInfinite() {
    if (this.l_total_rows && this.frame.no_of_records && (this.l_total_rows > (parseInt(this.frame.no_of_records))) && this.l_total_rows >= this.listLength) {
      return true;
    } else {
      return false;
    }
  }

  itemClicked(event, rowsdata, i) {
    //   console.log("itemClicked vijay card -->" + rowindex, event);
    /*  let col = {};
     for (let itemGroup of this.frame.tableRows[i]) {
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
     event.wscp = this.wscp_send_input; */

    var rowindex;
    for (let dataRow of rowsdata) {
      if (dataRow.Level5[0].item_name == "ROWNUMBER") {
        rowindex = dataRow.Level5[0].value - 1;
      }
    }

    if (!rowindex) {
      rowindex = i;
    }

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
    this.emitPass.emit(event);
  }


  getFilterParameter(event) {
    // console.log(event.where_str);
    // this.l_where_str = event.where_str;
    // // this.getData(l_from_row, l_to_row, a_current_page);
    // this.paginate(1);
    this.l_where_str = event.where_str;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;
    this.getdataFromcanvasFilter(event);
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

  paginate(a_current_page: number) {
    // this.tableRows = [];
    // let l_total_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
    // let L_total_pages = this.l_total_rows / this.frame.no_of_records;

    // if (a_current_page < 1) {
    //   a_current_page = 1;
    //   this.tableRows = [];
    // } else if (a_current_page > l_total_pages) {
    //   a_current_page = l_total_pages;
    // }

    // let l_from_row: number = null;
    // let l_to_row: number = null;

    // if (l_total_pages > 0 && a_current_page == 1) {
    //   this.tableRows = [];
    //   l_to_row = Math.ceil(this.l_total_rows / L_total_pages);
    // }
    // else {
    //   l_to_row = Math.ceil(this.l_total_rows / L_total_pages) * a_current_page;
    // }

    // l_from_row = Math.ceil((l_to_row - this.frame.no_of_records)) + 1;

    // this.c_from_row = l_from_row;
    // this.c_to_row = l_to_row;

    // // if (a_current_page!=1){
    // //   this.l_total_remain_pages=Math.ceil(this.l_total_rows / this.frame.no_of_records)-(this.c_to_row-this.frame.no_of_records);
    // // }
    // this.getData(l_from_row, l_to_row, a_current_page);
    let l_total_pages: number = Math.ceil(this.l_total_rows / parseFloat(this.frame.no_of_records));
    this.l_totalPage = l_total_pages;
    let L_total_pages: number = this.l_total_rows / parseFloat(this.frame.no_of_records);

    if (!a_current_page) {
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

      let newWsdp = [];
      newWsdp.push(Object.assign(this.wsdp[0], event.wsdp[0]));

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": newWsdp
      }

      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {
        // this.globalObjects.hideLoading();
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
        // console.log(data.responseData.Values[0][0] + data.responseData.Values[0][1]);
        // console.log(event.wsdp);
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let keyValue = data.responseData;
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
          // alert(objData.Level1[0].message);
          this.globalObjects.clickedbutton = false;
          // for (let itemGroup of this.frame.tableRows[rowindex]) {
          //   if (itemGroup.Level5) {
          //     for (let item of itemGroup.Level5) {
          //       if (objData.Level1[0].item_name == item.item_name) {
          //         item.value = "";
          //         item.codeOfValues = "";

          //       }
          //     }
          //   }
          // }
        }
      }

    }).catch(err => {
      console.log("this.frame canvas err");

      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.7 Something went wrong please try again later!");
      console.log(err);
    })

  }
  getdataFromcanvasFilter(event) {
    // this.getcanvasWCP = true;
    // let array = [];
    // // this.canvasfilter = false;
    // this.frame.flagtoclosefilter = event.flagtoclosefilter;

    // array = event.event.where_str;

    // this.l_where_str = [];
    // for (let data of array) {
    //   console.log(data)

    //   this.l_where_str += data + "  ";
    // }
    // this.frame.l_where_str = this.l_where_str;
    // console.log("array concate", this.l_where_str)
    // this.paginate(1);

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

  doInfinite(infiniteScroll): Promise<any> {
    this.scrollFlag = true;
    return new Promise(() => {
      setTimeout(() => {
        // this.frame.no_of_records = (parseInt(this.frame.no_of_records) + 10).toString();
        // this.getData();
        this.paginate(this.l_current_page + 1);
      }, 500);
    })
  }

}
