import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingController } from '@ionic/angular';
import { Events } from 'src/app/demo-utils/event/events';

@Component({
  selector: 'app-frame-advance-filter',
  templateUrl: './frame-advance-filter.component.html',
  styleUrls: ['./frame-advance-filter.component.scss'],
})

export class FrameAdvanceFilterComponent implements OnInit {

  @Input() frame: any = {};
  @Output() passdataToframetable: EventEmitter<any> = new EventEmitter<any>();
  @Output() passdataToframeDepen: EventEmitter<any> = new EventEmitter<any>();
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  userDetails: any;
  advanceData : any = [];
  filterRows = [];
  filterRowIndex : any = 0;
  itemDataArr = [];
  globalArray = [];
  filterValue ;
  ValuesSelect = [];
  selectedValues: any = [];
  selectedkey: any = [];
  mainData: [];

  tablerowsfilter: any;
   
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService,
    public loadingController: LoadingController ,public event:Events) {
   this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {

    this.event.subscribe("clearA", () => {
      this.resetFilter();
    })


  this.getData();
  this.advanceData = [];
        
        let itemfilterData = JSON.parse(JSON.stringify(this.frame.Level4))

        for (let x of itemfilterData) {
          if (x.Level5[0].item_filter_flag) {
            x.Level5[0].item_type = x.Level5[0].item_filter_flag;
            this.advanceData.push(x);
          }
        }

        this.filterValue = this.advanceData[0].Level5[0].item_name;
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
      let data: any = res;
      if (data.responseStatus == "success") {
        let tableRows = [];
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
 
    let strgArr = this.advanceData;
  
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
    
    let tableKey = [];
    if (tableData.length > 0) {
      tableKey = Object.keys(tableData[0]);
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
        if (f.Level5[0].item_filter_flag) {
          f.Level5[0].item_type = f.Level5[0].item_filter_flag;
          frLevel4.push(f);
        }
      }
      tableDependentRows.push(frLevel4);
    }
    this.filterRows = tableDependentRows;
    /* for (let x of this.advanceData) {
      x.tableDependentRows = tableDependentRows
    } */
  //  console.log("it is in canvas..", this.advanceData)
    this.onClick(this.filterValue ,this.filterRowIndex);
  }


  onClick(f, i){
    this.filterRowIndex = i;
    this.itemDataArr = [];
    this.ValuesSelect = [];
    this.filterValue = f;

    let itemfilterData = JSON.parse(JSON.stringify(this.filterRows))
    let mainData = [];
   for(let x of itemfilterData){
     for(let y of x){
      if(y.Level5[0].item_name == this.filterValue  && y.Level5[0].value){
         let dataObj = {
           key : y.Level5[0].item_name,
           value : y.Level5[0].value
         }
         mainData.push(dataObj);
       }
     }
   }
   let finalList = [];
   mainData.forEach(m => {
    if(!finalList.find(f => m.value == f.value)){
      finalList.push(m);
    }
    this.itemDataArr = finalList;
   })

   let globArr = this.globalArray;
   let globKey = globArr.find(k => k.key == this.itemDataArr[0].key);
   if(globKey){
    if( globKey.itemValue){
      this.itemDataArr = globKey.itemValue;
    }
    if(globKey.event){
      this.advanceData[this.filterRowIndex].Level5[0].query = globKey.query;
      this.advanceData[this.filterRowIndex].Level5[0].value =  globKey.value;
      this.advanceData[this.filterRowIndex].Level5[0].codeOfValues =  globKey.codeOfValues;
    
      globKey.event.forEach(a => {
        let clickVal = this.itemDataArr.find(c => a.value == c.value);
         if(clickVal){
           clickVal.clickedElement = a.clickedElement;
           clickVal.isChecked = a.isChecked;
           this.ValuesSelect.push(clickVal);
         }
      })
     
     }
    } 

    
  }


  onSelect(event,val,i){
  
    let valSelect = this.ValuesSelect.find(x => x.value == val.value);
    if(!valSelect){

    this.ValuesSelect.push(val)
  }else{

  }

    console.log(" this.ValuesSelect  ", this.ValuesSelect);
    let dataObjValues : any = {};
    let keyChecked = [];
    let datakey = [];
    let datavalue = [];
    for (let x of this.ValuesSelect) {
      if (x.isChecked) {
        datakey.push(x.value);
        datavalue.push(x.value);
        keyChecked.push(x)
        if(dataObjValues.query){
          dataObjValues.query += "|| a." + x.key + " == '" + x.value +"'";
        }else{
         
          dataObjValues.query = "a." + x.key + " == '" + x.value +"'";
        }
      }
    }
     let j = this.filterRowIndex;
    this.selectedkey = datakey.toString();
    this.selectedValues = datavalue.toString();
    this.advanceData[j].Level5[0].value = this.selectedkey;
    this.advanceData[j].Level5[0].codeOfValues = this.selectedValues;
    this.advanceData[j].Level5[0].query = dataObjValues.query;
 
   let globArr = this.globalArray;
   let globKey = globArr.find(a => a.key == this.ValuesSelect[0].key);

   globArr.forEach(g => {
     if(g.key != val.key){
      delete g.itemValue;
     }
   })

   if(globKey){
    globKey.itemValue = this.itemDataArr;
    globKey.query = this.advanceData[j].Level5[0].query;
    globKey.event = keyChecked;
    globKey.value =  this.advanceData[j].Level5[0].value;
    globKey.codeOfValues = this.advanceData[j].Level5[0].codeOfValues;
  }else{
    let obj = {
      key : this.ValuesSelect[0].key,
      itemValue : this.itemDataArr,
      query : this.advanceData[j].Level5[0].query,
      event : keyChecked,
      value : this.advanceData[j].Level5[0].value,
      codeOfValues : this.advanceData[j].Level5[0].codeOfValues
    }
     globArr.push(obj);
   }
   this.fiteredData();
   // this.emitfilterParam.emit();
  }


  sendFilteredData(){
    let wsdp = [];
    let key = {};
    let query;
    let multilevelitemarray = [];
    for (let itemGroup of this.advanceData) {

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
        } else if (item.item_sub_type == 'BETWEEN_DATE' && (item.from_date) && (item.to_date)) {
          query = " and " + colName + " between " + "to_date('" + item.from_date + "','dd-mon-rrrr') and to_date('" + item.to_date + "','dd-mon-rrrr')";
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
    this.frame.where_str = multilevelitemarray;
    this.frame.wsdp = multilevelitemarray;
 //   this.emitFilter.emit(this.frame);
    this.passdataToframeDepen.emit(this.frame);
  }

  resetFilter(){
    this.itemDataArr = [];
    this.globalArray = [];
    this.filterValue = this.advanceData[0].Level5[0].item_name;
    
    this.sendDataInput(this.mainData);

  }


}
