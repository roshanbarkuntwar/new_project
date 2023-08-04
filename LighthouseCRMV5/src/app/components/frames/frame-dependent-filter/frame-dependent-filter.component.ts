import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingController } from '@ionic/angular';
import { Events } from 'src/app/demo-utils/event/events';


@Component({
  selector: 'app-frame-dependent-filter',
  templateUrl: './frame-dependent-filter.component.html',
  styleUrls: ['./frame-dependent-filter.component.scss'],
})
export class FrameDependentFilterComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() passdataToframeDepen: EventEmitter<any> = new EventEmitter<any>();
  
  @Output() passdataToframetable: EventEmitter<any> = new EventEmitter<any>();
  userDetails: any;

  frameDate: [];
  itemData: any = [];

  mainData: any = [];
  colSize:any = [];
  queryMap: any = {};

  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService,
    public loadingController: LoadingController, public event: Events) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    this.event.subscribe("clearJ", () => {
      this.clearAll();
    })
    this.globalObjects.dependFilterData = [];
    this.getData();
    console.log(this.frame);

    if (this.frame.Level4) {
      for (let itemGroup of this.frame.Level4) {
        if (itemGroup.design_control_type) {
          itemGroup.groupCol = [];
          itemGroup.groupCol = itemGroup.design_control_type.split('-');
          this.colSize = itemGroup.groupCol;
        }
      }
    }
  }
 
  getData() {

    let wscp: any = {};
    let wsdp: any = []
    //wscp.service_type = "get_populate_data";
    // if (this.frame.on_frame_load_str) {
    wscp.service_type = 'get_frame_filter_all_json';

    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.object_code = this.frame.object_code;

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      console.log(res);
      let data: any = res;
      if (data.responseStatus == "success") {

        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        this.mainData = tableData;
        this.sendDataInput(tableData)
      }
      // this.showFrame = true;
    }).catch(err => {
      console.log("this.frame canvas err");
      //  this.showFrame = true;
      // this.globalObjects.hideLoading();
      //   this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
      console.log(err);
    })
    // }
  }

  fiteredData() {
 
    let strgArr = this.itemData;
  
    let queryStr: any;
    for (let itemGroup of strgArr) {

      for(let f of itemGroup.Level5){
        if(f.query){
          if (queryStr) {
            queryStr += " && " + f.query;
          } else {
            queryStr = f.query;
          } 
        }
      }
      //   strgArr.push()
    }
   if(!queryStr){
    queryStr = {};
   }
  
    console.log(queryStr);

    let tblData = this.mainData.filter(a => eval(queryStr));
// let tblData = this.mainData.filter(a => a.BANK_CODE=="ICIC");
   this.sendDataInput(tblData);
  }


  sendDataInput(tableData) {
  
    let tableDependentRows = [];
    this.itemData = [];
    let tableKey = [];
    if (tableData.length > 0) {
      tableKey = Object.keys(tableData[0]);
    }

    let itemfilterData = JSON.parse(JSON.stringify(this.frame.Level4))

    for (let x of itemfilterData) {
      let flag:boolean = true;
      for(let d of x.Level5){
        if (d.item_filter_flag) {
          d.item_type = d.item_filter_flag;
          if(flag){
            this.itemData.push(x);
            flag = false;
          }
        }
      }
    }
    for (let table of tableData) {
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))

      for (let itemGroup of frameLevel4) {

        for (let item of itemGroup.Level5) {
          for (let key of tableKey) {
            if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
              item.value = table[key]
            }
          }
        }
      }
      let frLevel4 = [];

      for (let f of frameLevel4) {
        for(let d of f.Level5){
          if (d.item_filter_flag) {
            d.item_type = d.item_filter_flag;
            frLevel4.push(f);
          }
        }
      }
      tableDependentRows.push(frLevel4);
    }
    this.frame.tableDependentRows = tableDependentRows;
    for (let x of this.itemData) {
      x.tableDependentRows = tableDependentRows
    }
    console.log("it is in canvas..", this.itemData)

  }

  sendData(flagtoclosefilter){

    let wsdp = [];
    let key = {};
    let query;
    let multilevelitemarray = [];
    for (let itemGroup of this.itemData) {

      for (let item of itemGroup.Level5) {
        query = null;

        let value;
        if (item.codeOfValues) {
          key[item.apps_item_seqid] = item.codeOfValues;
          value = item.codeOfValues
        } else if (item.value) {
          key[item.apps_item_seqid] = item.value;
          value = item.value
        }

        let colName: any = "";

        if (item.item_db_name) {
          colName = item.item_db_name
        } else {
          colName = item.item_name
        }

        //------------------------------------
        if (item.item_sub_type == 'ASON_DATE' && (value)) {
          query = " and " + colName + item.dateType + " to_date('" + value + "','dd-mon-rrrr')";
        }
        if (item.item_sub_type == 'ASON_TEXT' && (value)) {
          query = " and " + colName + item.dateType + "'" + value + "'";
        } else if (item.item_sub_type == 'BETWEEN_DATE' && (item.from_date) && (item.to_date)) {
          if(item.aliases){
            query = " and " + item.aliases + "." + colName + " between " + "to_date('" + item.from_date + "','dd-mon-rrrr') and to_date('" + item.to_date + "','dd-mon-rrrr')";
          }else{
          query = " and " + colName + " between " + "to_date('" + item.from_date + "','dd-mon-rrrr') and to_date('" + item.to_date + "','dd-mon-rrrr')";
          } 
      } else if (item.item_sub_type == 'M' && (value)) {
          let valuearr = value.split(",");
          query = " and  " + item.aliases + "." + colName + " in (";
          for (let val of valuearr) {
            query = query + "'" + val + "',";
          }
          query = query.substring(0, query.length - 1);
          query = query + ")";
        }else if (!item.item_sub_type && (value) && item.aliases){
          query = " and  " + item.aliases + "." + colName + " in (";
         
          query = query + "'" + value + "',";
        
          query = query.substring(0, query.length - 1);
          query = query + ")";
        } else {
          if (value) {
            query = " and " + colName + "=" + "'" + value + "'";
          }
        }
        if (query) {
          multilevelitemarray.push(query);
        }
        //------------------------------------
      }
    }
    wsdp.push(key);
    this.frame.flagtoclosefilter = flagtoclosefilter;
    this.frame.where_str = multilevelitemarray;
    this.frame.wsdp = multilevelitemarray;
 //   this.emitFilter.emit(this.frame);
    this.passdataToframeDepen.emit(this.frame);
    console.log("frame filter frame", this.frame)

  }

  SkipFilter(){
    this.event.publish("closeDepFilter");
   }

   clearAll(){
    this.globalObjects.dependFilterData = [];
    this.getData();
    
   }

}

