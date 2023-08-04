import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Events } from '@ionic/angular';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-frame-cart-summary',
  templateUrl: './frame-cart-summary.component.html',
  styleUrls: ['./frame-cart-summary.component.scss'],
})
export class FrameCartSummaryComponent implements OnInit {
  @Input() cartdata: any = {};
  @Input() frame: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  userDetails: any;
  current_page_parameter: any;
  constructor(public events: Events,private globalObjects: GlobalObjectsService,private dataService: DataService) { }
  pushFlag: boolean = false;
  summaryCard: any = [];
  totalAmount: number = 0;
  totalQty: number = 0;
  totalItems : number = 0;
  cartdataitem :any =[]
  imageData:any=[];
  headings=[];



  ngOnInit() {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    console.log("this.cartdata", this.cartdata);
    this.cartdataitem= this.cartdata;
    this.headings=this.globalObjects.summaryheadings;
    this.showSummary();
  }
  closePage() {

    this.events.publish("toggle", "hello");

  }

  showSummary() {
    this.summaryCard = [];
  let count :number=-1;
    for (let parentGroup of this.globalObjects.summaryCartdeatail) {
      count ++;
      for (let item of parentGroup.items) {
        for (let obj of item) {
          if (obj.Level5[0].item_name == 'AQTYORDER' && obj.Level5[0].value && (parseFloat(obj.Level5[0].value) > 0 || obj.Level5[0].value != null)) {
            this.totalQty += parseFloat(obj.Level5[0].value);
            this.totalItems += 1;
            
            if(this.summaryCard[count]){
              this.summaryCard[count].items.push(item);
            this.summaryCard[count].parentName=parentGroup.parentName;
            }else{
              this.summaryCard[count]=[];
              this.summaryCard[count].items = [];
              this.summaryCard[count].items.push(item);
              this.summaryCard[count].parentName=parentGroup.parentName;
              this.summaryCard[count].imageData=parentGroup.image;
            }
            
          }
          if (obj.Level5[0].item_name == 'TOTAL' && (obj.Level5[0].value > 0 || obj.Level5[0].value != null)) {
            this.totalAmount += parseFloat(obj.Level5[0].value);
          }
        }
       
      }
    }
    console.log('summary Cards==> ',this.summaryCard)

  }

  showSummaryCal() {
    this.totalItems =0;
    this.totalQty= 0;
    this.totalAmount =0;
    
  let count :number=-1;
    for (let parentGroup of this.summaryCard) {
      count ++;
      for (let item of parentGroup.items) {
        for (let obj of item) {
          if (obj.Level5[0].item_name == 'AQTYORDER' && (obj.Level5[0].value > 0 || obj.Level5[0].value != null)) {
            this.totalQty += parseFloat(obj.Level5[0].value);
            this.totalItems += 1;
          }
          if (obj.Level5[0].item_name == 'TOTAL' && (obj.Level5[0].value > 0 || obj.Level5[0].value != null)) {
            this.totalAmount += parseFloat(obj.Level5[0].value);
          }
        }
       
      }
    }
   
  }
  
  itemValueChange(event, rowindex, tableIndex) {
    if (event.dependent_column_str) {
      // this.wsdp = [];
      let wsdp = [];
      let dependent_column_arr = event.dependent_column_str.split("#")
      if (this.summaryCard[tableIndex]) {
        let col = {};
        for (let itemGroup of this.summaryCard[tableIndex].items[rowindex]) {

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
                item.value = this.globalObjects.autoCalculation(item.formula_str, this.summaryCard[tableIndex].items[rowindex])
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
      this.showSummaryCal();
      if (event.dependent_column_sql) {
        this.getDependentData(event, rowindex,tableIndex).then(res => {
          if (res === "success") {
            if (event.post_text_validate_plsql) {
              // setTimeout(() => this.PostTextValidatePlsql(event, rowindex), 3000);
              this.PostTextValidatePlsql(event, rowindex,tableIndex);
            }
          }
        });
      } else if (event.post_text_validate_plsql) {
        this.PostTextValidatePlsql(event, rowindex,tableIndex);
      }
      this.showSummaryCal();

    }
  }


  getDependentData(event, rowindex,tableIndex) {

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
        console.log("response in frame order entry",res)

        if (data.responseStatus == "success") {
          let objData = this.globalObjects.setPageInfo(data.responseData)
          if (objData && (objData.Level1.length > 0 ) && (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q")) {
            if (objData.Level1[0].message) {
              this.globalObjects.presentAlert(objData.Level1[0].message);
            }}
          resolve("success");
          
          let keyValue = data.responseData;
          for (let itemGroup of this.summaryCard[tableIndex].items[rowindex]) {
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

  PostTextValidatePlsql(event, rowindex,tableIndex) {
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
        //   for (let itemGroup of this.summaryCard[rowindex]) {
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
            this.globalObjects.presentAlert(objData.Level1[0].message);
          }
          this.globalObjects.clickedbutton = false;
          for (let itemGroup of this.summaryCard[tableIndex].items[rowindex]) {
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
          this.globalObjects.presentAlert(objData.Level1[0].message);
          this.globalObjects.clickedbutton = false;
          for (let itemGroup of this.summaryCard[tableIndex].items[rowindex]) {
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
}
