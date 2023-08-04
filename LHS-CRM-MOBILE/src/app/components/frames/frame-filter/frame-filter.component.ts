import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-frame-filter',
  templateUrl: './frame-filter.component.html',
  styleUrls: ['./frame-filter.component.scss'],
})
export class FrameFilterComponent implements OnInit {

  @Input() frame: any = [];
  @Input() sFilter: any = [];
  @Input() wscp: any = {};
  @Output() emitFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() emittoframeCanvasFilter: EventEmitter<any> = new EventEmitter<any>();

  selectdate: any;
  l_from_date: Date;
  l_to_date: Date;
  searchText: unknown;

  constructor(private globalObjects: GlobalObjectsService, public event: Events) {
    this.selectdate = 1;
  }

  ngOnInit() {
    for (let itemGroup of this.frame.Level4) {
      for (let item of itemGroup.Level5) {
        item.item_type = item.item_filter_flag;
        if(item.item_filter_flag=='FDT'){
          item.canvasflag=true;
        }
      }
    }
    console.log("Frame Filter: ", this.frame);
    this.event.subscribe("clearalldata",()=>{
      this.clearFilter('flagtoclose')
    })
  }

  filerDataWithoutAliases(flagtoclosefilter) {
    console.log("this is in framefilter of sfilter", this.frame);
    console.log(flagtoclosefilter);
    let wsdp = [];
    let key = {};
    let query;
    let multilevelitemarray = [];
    for (let itemGroup of this.frame.Level4) {

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
        }
        else if (item.item_sub_type == 'BETWEEN_DATE' && (item.from_date) && (item.to_date)) {

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
            if(value){
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
    this.emitFilter.emit(this.frame);
    this.emittoframeCanvasFilter.emit(this.frame);
    console.log("frame filter frame", this.frame)
    

  }
  
  clearFilter(flagtoclosefilter) {
    this.frame.flagtoclosefilter = flagtoclosefilter;
    this.frame.where_str = [];
    this.frame.wsdp = [];
    for(let obj of this.frame){
      for(let item of obj.Level5){
        if(item.value ){
          item.value = null;
          if(item.codeOfValues){
            item.codeOfValues=null;
          }
        }
      }
    }
    this.event.publish("ClearAll","eve");
    this.emitFilter.emit(this.frame);
  }



  filerData() {
    let wsdp = [];
    let key = {};
    let query;
    let multilevelitemarray = [];
    for (let itemGroup of this.frame.Level4) {

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
          query = " and " + item.aliases + "." + colName + item.dateType + " to_date('" + value + "','dd-mon-rrrr')";
        } else if (item.item_sub_type == 'BETWEEN_DATE' && (item.from_date) && (item.to_date)) {
          query = " and " + item.aliases + "." + colName + " between " + "to_date('" + item.from_date + "','dd-mon-rrrr') and to_date('" + item.to_date + "','dd-mon-rrrr')";
        } else if (item.item_sub_type == 'M' && (value)) {
          let valuearr = value.split(",");
          query = " and " + item.aliases + "." + colName + " in (";
          for (let val of valuearr) {
            query = query + "'" + val + "',";
          }
          query = query.substring(0, query.length - 1);
          query = query + ")";
        } else {
          if (value) {
            query = " and " + item.aliases + "." + colName + "=" + "'" + value + "'";
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
    this.emitFilter.emit(this.frame);

  }


  openMike() {
    this.globalObjects.speechdata = '';
    this.globalObjects.startListening().then(res => {
      this.searchText = res;
    });
  }

  openbarcodescanner() {
    this.globalObjects.barcodescanner().then(res => {
      this.searchText = res;
    });
  }


}
