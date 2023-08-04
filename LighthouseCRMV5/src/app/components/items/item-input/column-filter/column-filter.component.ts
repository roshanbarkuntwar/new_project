import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/demo-utils/event/events';
import { ModalController } from '@ionic/angular';
import { SingleSelectLovPage } from 'src/app/pages/single-select-lov/single-select-lov.page';
import { OverlayEventDetail } from '@ionic/core';
@Component({
  selector: 'app-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss'],
})
export class ColumnFilterComponent implements OnInit {
  @Input() itemData:any;
  @Input() colFilter: any;
  @Input() frame_type: any;
  @Input() framedata:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  @Input() parentComponent: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitfilterParam : EventEmitter<any> = new EventEmitter<any>();
  keyChecked = [];
  keyValues:any = [];
  itemDataArr : any = [];
  wscp: any = {};
  Vlength:number;
  ValuesSelect: any = [];
  selectedValues: any = [];
  selectedkey:any=[];
  object_arr: any = [];
  objectList: any = [];
  map = new Map();
  userDetails:any;

  dataSet:any=[];
  range:number=0;
  indextoAdd:number=-1;
  constructor(private globalObjects: GlobalObjectsService ,private dataService:DataService,public modalCtrl: ModalController,
    public events:Events) {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
  }

  ngOnInit() { 
    if(this.itemData){
      this.getDepData();
    }else{
      this.getrangedata();
    }
    this.events.subscribe("ClearAll", () => {
      this. clearall(this.dataSet);
     });
  }
  itemClicked(event) {
    this.emitPass.emit(this.colFilter);
  }


  onColumnClick($event: { target: any; },val,i) {
    if(val.key.charAt(0)== " "){
      val.key = val.key.substr(1);
    }
      val.isChecked=!val.isChecked;
    let clickedElement = $event.target;
    if (clickedElement.nodeName === "ION-COL") {
      let elemClasses = (clickedElement as HTMLIonColElement).classList;
      let isActive = elemClasses.contains("activeColumn");
      if (isActive) {

        elemClasses.remove("activeColumn");
        elemClasses.add("inactiveColumn");
      } else {
        clickedElement.className += " activeColumn";
      }
    }
    val.clickedElement=clickedElement;
    val.index=i;
    this.indextoAdd++;
    this.ValuesSelect[this.indextoAdd] = [];
    if (this.ValuesSelect[this.indextoAdd]) {
      this.ValuesSelect[this.indextoAdd] = (val);
    }
    let datakey = [];
    let datavalue = [];
    
    for (let x of this.ValuesSelect) {
      if (x.isChecked) {
        datakey.push(x.key);
        datavalue.push(x.value);
      }
    }
    this.selectedkey=datakey.toString();
    this.selectedValues=datavalue.toString();
    this.colFilter.value=this.selectedValues;
    this.colFilter.codeOfValues = this.selectedkey;
    console.log(this.colFilter);
  }
  clearall(dataSet){

    for (let x of this.ValuesSelect) {
    if(x.clickedElement){
      if (x.clickedElement.nodeName === "ION-COL") {
        let elemClasses = (x.clickedElement as HTMLIonColElement).classList;
        let isActive = elemClasses.contains("activeColumn");
        if (isActive) {
  
          elemClasses.remove("activeColumn");
          elemClasses.add("inactiveColumn");
        } else {
          x.clickedElement.className += " activeColumn";
        }
      }
    }


      if (x.isChecked) {
           x.isChecked=false;
      }
    }
    this.colFilter.value = "";
    this.colFilter.codeOfValues ="";
    this.ValuesSelect=[];
    this.indextoAdd=-1;
    this.range=9;
    if(this.range>this.Vlength){
      this.range=this.Vlength;
    }
    console.log(this.ValuesSelect);
    if(this.itemDataArr.length > 0){
      let globArr = this.globalObjects.dependFilterData;
      let globKey = globArr.find(k => k.key == this.itemDataArr[0].key);
      if(globKey){
        delete globKey.query;
        delete globKey.event;
      }
      this.getDepData();
    }
    this.callAfterclearall(this.dataSet);
   
  }
  getrangedata(){
    let wsdp = [];
    if (this.colFilter.item_enable_flag && (!(this.colFilter.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.colFilter.item_enable_flag == 'F'))) {
      return false;
    } else {
    
      let col = {};
      if (this.parentComponent.frame.tableRows) {
        for (let itemGroup of this.parentComponent.frame.tableRows[0]) {
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
      } else {
        for (let itemGroup of this.parentComponent.frame) {
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
      }
      wsdp.push(col);
    }
    this.getPageInfo(wsdp) 
  }
  
  getPageInfo(wsdp) {
    this.globalObjects.showLoading();
    this.wscp.service_type = "get_lov_data";
    this.wscp.apps_page_no = this.colFilter.apps_page_no;
    this.wscp.apps_page_frame_seqid = this.colFilter.apps_page_frame_seqid;
    this.wscp.apps_item_seqid = this.colFilter.apps_item_seqid;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.userDetails["object_code"] = this.colFilter.object_code;
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": this.wscp,
      "wsdp": wsdp
    }

    this.dataService.postData("S2U", reqData).then(res => {
      
      this.globalObjects.hideLoading();
      let data: any = res;
      this.increaseRange();
      this.callAfterclearall(data); 
    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("4 Something went wrong please try again later!");
    })
  }
  callAfterclearall(data){
    this.dataSet=data;
    if (this.dataSet.responseStatus == "success") {
      this.Vlength =  this.dataSet.responseData.Values.length;
      this.range=10;
      if(this.range>this.Vlength){
        this.range=this.Vlength
      }
      let meatadata = this.dataSet.responseData.Values;
      let indexx = 1;
      for (let x of meatadata) {
        if ( x[1] !=null && x[0] !=null) {
          this.map.set(x[0], x[1]);
          indexx++;
        }
      }
      this.object_arr = data.responseData;
      let objData = this.globalObjects.setPageInfo(data.responseData);
      this.objectList = objData.Level1;
    }
  

}

increaseRange(){
  let globArr = this.globalObjects.dependFilterData;
  let globKey = globArr.find(k => k.key == this.itemDataArr[0].key);

  if(globKey && globKey.range){
    this.range = globKey.range;
  }else{
    this.range =9+ this.range;
  }
    if(this.range > this.Vlength){
      this.range = this.Vlength
    }
  
}

  async openLov() {
    var data = { message: 'hello world' };
    // if (this.lovinput.item_enable_flag == '') {
    if (this.colFilter.item_enable_flag && (!(this.colFilter.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.colFilter.item_enable_flag == 'F'))) {
      return false;
    } else {
      let wsdp = [];
      let col = {};
      if (this.parentComponent.frame.tableRows) {
        for (let itemGroup of this.parentComponent.frame.tableRows[0]) {
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
      } else {
        for (let itemGroup of this.parentComponent.frame) {
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
      }
      wsdp.push(col);
      // console.log(wsdp)

      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: SingleSelectLovPage,
          backdropDismiss: false,
          componentProps: { paramValue: this.colFilter, wsdp: wsdp, prompt_name: this.colFilter.prompt_name,wscp:this.wscp}
        });
      modal.onDidDismiss().then((detail: OverlayEventDetail) => {
        if (detail) {
          // console.log('The result:', detail.data);
          this.colFilter.codeOfValues = detail.data.codeOfValues;
          this.colFilter.value = detail.data.value;
        }
      });
      await modal.present();
    }

  }

  getDepData(){
  
    let itemfilterData = JSON.parse(JSON.stringify(this.itemData))
    let mainData = [];
   for(let x of itemfilterData){
     for(let y of x){
      if(y.Level5[0].item_name == this.colFilter.item_name  && y.Level5[0].value){
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
  
   let globArr = this.globalObjects.dependFilterData;
   let globKey = globArr.find(k => k.key == this.itemDataArr[0].key);
   if(globKey){
    if( globKey.itemValue){
      this.itemDataArr = globKey.itemValue;
    }
    if(globKey.event){
    this.colFilter.query = globKey.query;
    this.colFilter.value =  globKey.value;
    this.colFilter.codeOfValues =  globKey.codeOfValues;
    
      globKey.event.forEach(a => {
        let clickVal = this.itemDataArr.find(c => a.value == c.value);
         if(clickVal){
           clickVal.clickedElement = a.clickedElement;
           clickVal.isChecked = a.isChecked;
           this.ValuesSelect.push(clickVal);
           console.log(this.itemDataArr)
         }
      })
     
     }
      console.log(this.itemDataArr)
    } 
  
    this.Vlength = this.itemDataArr.length;
   this.increaseRange();
  }

  onSelect(event,val,i){
  
    let valSelect = this.ValuesSelect.find(x => x.value == val.value);
  if(!valSelect){
    val.isChecked = !val.isChecked
    let clickedElement = event.target || event.srcElement;
    if (clickedElement.nodeName === "ION-BUTTON") {
      let elemClasses = (clickedElement as HTMLIonButtonElement).classList;
      let isActive = elemClasses.contains("active");
      if (isActive) {
        elemClasses.remove("active");
        elemClasses.add("inactive");
      } else {
        clickedElement.className += " active";
      }
    }
    val.clickedElement = clickedElement;
    val.index = i;
    this.ValuesSelect.push(val);
  }else{
    valSelect.isChecked = !valSelect.isChecked;
  }
   
   
    
    console.log(" this.ValuesSelect  ", this.ValuesSelect);
    let dataObjValues : any = {}
    let dataObjArr = [];
  //  this.keyChecked = [];
  let datakey = [];
  let datavalue = [];
    for (let x of this.ValuesSelect) {
      if (x.isChecked) {
        datakey.push(x.value);
        datavalue.push(x.value);
        this.keyChecked.push(x)
        if(dataObjValues.query){
          dataObjValues.query += "|| a." + x.key + " == '" + x.value +"'";
        }else{

         
          dataObjValues.query = "a." + x.key + " == '" + x.value +"'";
        }
      }
    }
    this.selectedkey = datakey.toString();
    this.selectedValues = datavalue.toString();
    this.colFilter.value = this.selectedkey;
    this.colFilter.codeOfValues = this.selectedValues;
   this.colFilter.query = dataObjValues.query;
 
   let globArr = this.globalObjects.dependFilterData;
   let globKey = globArr.find(a => a.key == this.ValuesSelect[0].key);

   globArr.forEach(g => {
     if(g.key != val.key){
      delete g.itemValue;
     }
   })

   if(globKey){
    globKey.range =this.range
    globKey.itemValue = this.itemDataArr;
    globKey.query = this.colFilter.query;
    globKey.event = this.keyChecked;
    globKey.value =  this.colFilter.value;
    globKey.codeOfValues = this.colFilter.codeOfValues;
  }else{
    let obj = {
      key : this.ValuesSelect[0].key,
      itemValue : this.itemDataArr,
      query : this.colFilter.query,
      event : this.keyChecked,
      value :  this.colFilter.value,
      codeOfValues : this.colFilter.codeOfValues,
      range : this.range
    }
     globArr.push(obj);
   }
    this.emitfilterParam.emit();
  }
}
