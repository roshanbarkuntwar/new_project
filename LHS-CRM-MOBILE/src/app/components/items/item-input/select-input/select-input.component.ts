import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Events, ModalController,Platform } from '@ionic/angular';
// import { SingleSelectLovPage } from 'src/app/pages/single-select-lov/single-select-lov.page';
// import { OverlayEventDetail } from '@ionic/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { PouchDBService } from 'src/app/services/pouch-db.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { MultileveltabsearchPipe } from 'src/app/pipes/multileveltabsearch.pipe';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
})
export class SelectInputComponent implements OnInit {
  @Input() selectinput: any;
  @Input() l_wscp: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() parentComponent: any;
  item_sub_type = '';
  current_page_parameter: any = {};
 autoValue:any;
 developerModeData: any;
  searchText: any;
  //selectinput: any;
  object_arr: any = [];
  Object_code: any = [];
  objectList: any = [];
  userDetails: any;
  wscp: any = {};
  wsdp: any = [];
  keyList = [];
  valuesList = [];
  sessiovalue: any;
  selectModel: any;
  autoCompleteflag:boolean=true;
  fullList:boolean = false;

  constructor(public modalCtrl: ModalController, private pouchDBService: PouchDBService, public events:Events, public plt:Platform,
    public globalObjects: GlobalObjectsService, private dataService: DataService, private sqlServ: SqlLiteService,
    private pipemy:MultileveltabsearchPipe,
    private pipemys:MultileveltabsearchPipe) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    this.selectinput.filterarray=[];
    if (this.selectinput.value && this.selectinput.dropdownList) {     
     this.selectModel = this.selectinput.value;
    }
    if ((this.selectinput.data_required_flag == 'T' || (this.selectinput.prompt_name && this.selectinput.prompt_name[this.selectinput.prompt_name.length -1] == '*')) && !this.selectinput.value){
      this.selectinput.isValid = false;
    }else{
      this.selectinput.isValid = true;
    }
    
    this.getdata();
    console.log("select input...>>", this.selectinput);
    let evName = "testDD"+this.selectinput.apps_item_seqid;
    this.events.unsubscribe(evName);
    this.events.subscribe(evName,()=>{
      this.selectinput.dropdownList=[];
      this.valuesList = [];
      this.selectModel = null;
      this.getdata();
    })
    if(!this.selectModel && this.selectinput.position=='floating' && this.selectinput.item_type != 'DD_BROWSER'){
    let obj={
      "position":"absolute",
      "top":"10px",
      
    }
    
    this.selectinput.labelStyle=obj;
    
      let obj1={
        "margin-top":"25px"
        
      }
      this.selectinput.marginStyle=obj1;
   
  }else if(this.selectinput.item_type != 'DD_BROWSER'){
    let obj={
      "position":"absolute",
      "top":"0px",
      
      
    }
    let obj1={
      "margin-top":"25px"
      
    }
    this.selectinput.marginStyle=obj1;
    this.selectinput.labelStyle=obj;
  }

  }


  arrowkeyLocation = 0;

keyDown(event: KeyboardEvent) {

  if(this.plt.is('android') && this.plt.is('ios')){
   let pipeLength=this.pipemy.transform(this.selectinput.dropdownList,this.autoValue);
   
    if(event.keyCode==38){  //up
      this.arrowkeyLocation--;
    
    }
    if(event.keyCode==40){   //down
      this.arrowkeyLocation++;
      
    }
    if(event.keyCode==13){   //enter


      this.getMode( pipeLength[this.arrowkeyLocation]);
      this.arrowkeyLocation=0;
      this.selectinput.flag=false;
      this.fullList=false;
      
    }
  
  if(this.arrowkeyLocation  > (pipeLength.length-1)){
    
    if(event.keyCode==38){//up
      this.arrowkeyLocation=0;   
    }
    if(event.keyCode==40){
      this.arrowkeyLocation=0;
      
    }
    
  }
  if(this.arrowkeyLocation ==-1){
    
    if(event.keyCode==38){ //up
      this.arrowkeyLocation=pipeLength.length-1;
    }
   
  } 
}
}


  getdata() {
    this.globalObjects.showLoading();
    this.wscp.service_type = "get_lov_data";
    this.wscp.apps_page_no = this.selectinput.apps_page_no;
    this.wscp.apps_page_frame_seqid = this.selectinput.apps_page_frame_seqid;
    this.wscp.apps_item_seqid = this.selectinput.apps_item_seqid;
    this.wscp.apps_working_mode  = this.selectinput.apps_working_mode;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.userDetails["object_code"] = this.selectinput.object_code;
    this.wsdp = [];
    let col = {};
    let rowindex;
    if (this.selectinput.indexcount) {
      rowindex = this.selectinput.indexcount;
    } else {
      rowindex = 0;
    }
    

      if (this.parentComponent.frame.tableRows) {
        for (let itemGroup of this.parentComponent.frame.tableRows[rowindex]) {
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
      this.wsdp.push(col);
    // console.log(wsdp)
    let newWsdp = [];
    if (this.parentComponent.wsdp && this.parentComponent.wsdp.length > 0) {
      newWsdp.push(Object.assign(this.parentComponent.wsdp[0], this.wsdp[0]));
    } else {
      newWsdp = this.wsdp;
    }
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": this.wscp,
      "wsdp": this.wsdp

    }
    // reqData.wsdp = [
    //   {
    //     "itemType": "TEXT",
    //     "itemDefaultValue": "Y~Yes#N~No"
    //   }];

    let objectKey = this.userDetails.object_code + "_DD_" + this.wscp.apps_item_seqid;
    this.sqlServ.getById(objectKey, 'item_master').then(data => {
      if ((data.resStatus == 'Success') && !this.globalObjects.networkStatus) {
        this.globalObjects.hideLoading();
        let objData: any = JSON.parse(data.resData.itemData);
        this.objectList = objData.Level1;
        this.Object_code = objData.Level1;

        for (let x of this.Object_code) {
          let datavalue: any = {};
          let data1: any = [];
          for (let data in x) {
            let c = [];
            if (data != "Level2") {
              c = x[data];
              data1.push(c);
              datavalue.val = (data1[0]);
              datavalue.key = (data1[1]);
            }
          }
          datavalue.item = x;
          this.valuesList.push(datavalue);
          console.log("datavalue.................", datavalue)
        }
        this.selectinput['dropdownList'] = this.valuesList;
        if(this.selectinput.item_type == 'DD_BROWSER' &&  this.valuesList.length == 1){
          this.selectinput.value = this.valuesList[0].val;
          this.selectinput.codeOfValues = this.valuesList[0].key;
        }

        if (this.selectinput.value) {
         
          this.selectModel = this.selectinput.value;
        //  this.selectinput.isValid = true;
          
          if(this.selectinput.item_sub_type=='LIST_COMBO_BOX' || this.selectinput.item_sub_type=='COMBO_BOX'){

            this.func();
          }

          if(this.selectinput.item_sub_type=='CHECKBOX'){
            let arr = this.selectinput.value.split(",");
            
              for(let j=0; j<this.selectinput.dropdownList.length; j++){
                if(arr.indexOf(this.selectinput.dropdownList[j].val) > -1){
                  this.selectinput.dropdownList[j].isChecked =true;
                }
              }
          }

        }
      

      }


      else {
        this.dataService.postData("S2U", reqData).then(res => {
          this.globalObjects.hideLoading();
          let data: any = res;
          console.log("res...>>>>", res)
          if (data.responseStatus == "success") {
            this.object_arr = data.responseData
            let objData = this.globalObjects.setPageInfo(data.responseData);
            this.objectList = objData.Level1;
            this.Object_code = objData.Level1;

            //-------------------OFFLINE DROPDOWN SAVE ---------------------------------------------------//
            let offlineObjectCode: any;
            if (objData && this.l_wscp.apps_working_mode == 'I') {
              if (reqData.wslp) {
                if (reqData.wslp.object_code) {
                  offlineObjectCode = reqData.wslp.object_code + "_DD_" + reqData.wscp.apps_item_seqid;
                }
              }
              let pouchObjectKey = offlineObjectCode;

              var temp: any = {};
              var id = pouchObjectKey;
              this.sqlServ.getById(id, 'item_master').then((localData: any) => {
                temp.objData = JSON.stringify(objData);
                temp.id = id;

                if (localData.resStatus == 'Success') {
                  temp.rev = localData.resData._rev;
                  this.sqlServ.updateObjMast(temp, 'item_master').then(() => { })
                } else {
                  this.sqlServ.postDataSql(temp, 'item_master');
                }
              })
            }

            //-------------------OFFLINE DROPDOWN SAVE ---------------------------------------------------//

            for (let x of this.Object_code) {
              let datavalue: any = {};
              let data1: any = [];
              for (let data in x) {
                let c = [];
                if (data != "Level2") {
                  c = x[data];
                  data1.push(c);
                  datavalue.val = (data1[0]);
                  datavalue.key = (data1[1]);
                }
              }
              datavalue.item = x;
              this.valuesList.push(datavalue);
              console.log("datavalue.................", datavalue)
            }
            this.selectinput['dropdownList'] = this.valuesList;
            if(this.selectinput.item_type == 'DD_BROWSER' &&  this.valuesList.length == 1){
              this.selectinput.value = this.valuesList[0].val;
              this.selectinput.codeOfValues = this.valuesList[0].key
            }
    
            if (this.selectinput.value) {
            
              this.selectModel = this.selectinput.value;
            //  this.selectinput.isValid = true;
              if(this.selectinput.item_sub_type=='LIST_COMBO_BOX' || this.selectinput.item_sub_type=='COMBO_BOX'){
                this.func();
              }

              if(this.selectinput.item_sub_type=='CHECKBOX'){
                let arr = this.selectinput.value.split(",");
                
                  for(let j=0; j<this.selectinput.dropdownList.length; j++){
                    if(arr.indexOf(this.selectinput.dropdownList[j].val) > -1){
                      this.selectinput.dropdownList[j].isChecked =true;
                    }
                  }
              }
    
            }
          } else {
            if (this.selectinput['item_type'] == 'DD' && this.selectinput['item_default_value']) {
              if (this.selectinput['item_default_value'].indexOf('#') > -1) {
                let dropVal: any = [];
                dropVal = this.selectinput['item_default_value'].split('#');
                // alert(dropVal)
                let dropdownList = [];
                for (let y of dropVal) {
                  let c = y.split("~");
                  let dVal: any = {};
                  dVal.key = c[0];
                  dVal.val = c[1];
                  console.log(dVal);
                  dropdownList.push(dVal);
                  this.selectinput['dropdownList'] = dropdownList;

                  if (this.selectinput.value) {
                    this.selectModel = this.selectinput.value;
                  
                  //  this.selectinput.isValid = true;
                    if(this.selectinput.item_sub_type=='LIST_COMBO_BOX' || this.selectinput.item_sub_type=='COMBO_BOX'){

                      this.func();
                    }
                    if(this.selectinput.item_sub_type=='CHECKBOX'){
                      let arr = this.selectinput.value.split(",");
                      
                        for(let j=0; j<this.selectinput.dropdownList.length; j++){
                          if(arr.indexOf(this.selectinput.dropdownList[j].val) > -1){
                            this.selectinput.dropdownList[j].isChecked =true;
                          }
                        }
                    }
                  }
                }
                console.log("dropval--->" + JSON.stringify(dropdownList));
              }
            }
          }

        }).catch(err => {
          this.globalObjects.hideLoading();
          this.globalObjects.presentToast("44 Something went wrong please try again later!");

        })

      }

    })
     
  }

  onChangeFirst(value){
    if(this.fullList){
      this.fullList = false;
      this.selectinput.flag = false;
    }
    let val = this.selectinput.dropdownList.find(x => x.key==value);
    if(val || (this.selectinput.item_sub_type != 'LIST_COMBO_BOX')){
      this.selectinput.blurError = "";
    }
    this.onChange(value);
  }

  onBlur(value){
    setTimeout(() => {
      this.fullList = false;
        this.selectinput.flag = false;
        let val = this.selectinput.dropdownList.find(x => x.key==this.autoValue);
        if(val || (this.selectinput.item_sub_type != 'LIST_COMBO_BOX')){
        }else{
        this.selectinput.blurError = "Please select proper ";
      }
      },1000);
  }

  fullListFun(){
    this.fullList = true;
    this.selectinput.flag = false;
    this.arrowkeyLocation=0;
  }


  onChangeBrowser(event){
    if(event.target.value){
      this.selectinput.value = event.target.value;
    }
  }
  
  onChangeTlist(val, index){
    this.onChange(val);
    this.arrowkeyLocation = index;
  }

  onChange(onChange) {

    if(this.selectinput.item_sub_type == 'T_LIST'){
      this.selectinput.isValid = true;
    }
 

    if(this.selectinput.position=='floating' && this.selectinput.item_type != 'DD_BROWSER'){
  
      let obj={
        "position":"absolute",
        "top":"0px",
        
        
      }
      let obj1={
        "margin-top":"25px"
        
      }
      this.selectinput.marginStyle=obj1;
      this.selectinput.labelStyle=obj;
    }

    if(this.selectinput.item_sub_type == 'CHECKBOX'){
      if(onChange.isChecked == true){
        this.selectinput.value = this.selectinput.value ? this.selectinput.value +","+ onChange.val : onChange.val;
      }else if(this.selectinput.value){
        let valArr = this.selectinput.value.split(",");
        this.selectinput.value = null;
        for(let val of valArr){
          if(val != onChange.val){
            this.selectinput.value = this.selectinput.value ? this.selectinput.value +","+ val : val;
          }
        }
      }
    }else{
      this.selectinput.value = onChange;
    }

    
    let val: any;
    let ddArr = JSON.parse(JSON.stringify(this.selectinput));
    if (typeof (ddArr.value) == 'object') {
      for (let x of ddArr.value) {
        if (val) {
          val = val + ',' + x;
        } else {
          val = x;
        }
      }
    }
    if (val) {

      this.selectinput.value = JSON.parse(JSON.stringify(val));
    
    } else {
      if(this.selectinput.item_sub_type != 'CHECKBOX'){
        this.selectinput.value = onChange;
      }
     
    }
    let itemFlag = [];
    let reqFlag = [];
    let enFlag = [];
    let tablerows = []
    tablerows = this.parentComponent.frame.tableRows;



    for (let d of ddArr.dropdownList) {

      if (d.val == onChange) {
        for (let l in d.item) {
          let coldata;
          if (l.indexOf("#") > -1) {
            coldata = l.split("#")[0];
          } else {
            coldata = l;
          }
          if (coldata.toLowerCase().split("~")[1] == 'item_visible_flag') {
            let item = d.item[l].split('~');
            for (let a of item) {
              let flag = a.split('=');
              let obj = {
                key: flag[0],
                value: flag[1]
              }
              itemFlag.push(obj);
            }
          }

          if (coldata.toLowerCase().split("~")[1] == 'data_required_flag') {
            let item = d.item[l].split('~');
              for (let a of item) {
                let flag = a.split('=');
                let obj = {
                  key: flag[0],
                  value: flag[1]
                }
                reqFlag.push(obj);
              }
            
          }
          if (coldata.toLowerCase().split("~")[1] == 'item_enable_flag') {
            let item = d.item[l].split('~');
              for (let a of item) {
                let flag = a.split('=');
                let obj = {
                  key: flag[0],
                  value: flag[1]
                }
                enFlag.push(obj);
              }
            }
          }

      }
      
     
    }
   if(itemFlag.length > 0){

     this.selectinput.itemFlagForVisible=itemFlag;
   }


    if (ddArr.lov_return_column_str) {
      // let lov_RetArr : any = [];
      let lov_return_key = ddArr.lov_return_column_str.split("#");

      let tablerows = [];
      if (this.parentComponent.frame.apps_frame_type == "ENTRY_TABLE") {
        tablerows[0] = this.parentComponent.frame.tableRows[ddArr.indexCount];
      } else {
        tablerows = this.parentComponent.frame.tableRows;
      }

      if (tablerows) {
        for (let tabledata of tablerows) {
          for (let itemGroup of tabledata) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                for (let lovKey of lov_return_key) {
                  if (item.item_name && lovKey.toUpperCase() == item.item_name.toUpperCase()) {
                    for (let d of ddArr.dropdownList) {
                      if (d.val == onChange) {
                        for (let x in d.item) {
                          let k;
                          if (x.indexOf("#") > -1) {
                            k = x.split("#")[0];
                          } else {
                            k = x
                          }
                          if (item.item_name.toUpperCase() == k.toUpperCase().split("~")[1]) {

                            item.value = d.item[x];
                            if (item.item_type == "L") {
                              item.codeOfValues = d.item[x];
                            }
                          }
                        }
                      }
                    }
                  }
                }
                if (itemFlag.length > 0 || reqFlag.length > 0 || enFlag.length > 0) {
                  for (let f of itemFlag) {
                    if (item.item_name && item.item_name.toUpperCase() == f.key.toUpperCase()) {
                      item.item_visible_flag = f.value;
                    }
                  }

                  for (let e of enFlag) {
                    if (item.item_name && item.item_name.toUpperCase() == e.key.toUpperCase()) {
                      item.item_enable_flag = e.value;
                    }
                  }

                  for (let r of reqFlag) {
                    if (item.item_name && item.item_name.toUpperCase() == r.key.toUpperCase()) {
                      item.data_required_flag = r.value;
                      if (r.value == 'T') {
                        item.isValid = false;
                        if (item.prompt_name && item.prompt_name.indexOf('*') > -1) { } else {
                          item.prompt_name = item.prompt_name + '*'
                        }
                      } else {
                        if (item.prompt_name && item.prompt_name.indexOf('*') > -1) {
                          let str = item.prompt_name.slice(0, item.prompt_name.length - 1);
                          item.prompt_name = str;
                        }
                      }
                    }
                  }

                }
              }
            }
          }
        }

      } else {
        for (let lovKey of lov_return_key) {
          if (ddArr.item_name && lovKey.toUpperCase() == ddArr.item_name.toUpperCase()) {
            for (let d of ddArr.dropdownList) {
              for (let x in d.item) {
                let k;
                if (x.indexOf("#") > -1) {
                  k = x.split("#")[0];
                } else {
                  k = x
                }
                if (ddArr.item_name.toUpperCase() == k.toUpperCase().split("~")[1]) {
                  ddArr.value = d.item[x];
                  ddArr.codeOfValues = d.item[x]
                }
              }
            }
          }
        }
      }
    } else {
      if (itemFlag.length > 0) {
        if (tablerows) {
          for (let tabledata of tablerows) {
            for (let itemGroup of tabledata) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  for (let f of itemFlag) {
                    if (itemFlag.length > 0 || reqFlag.length > 0 || enFlag.length > 0) {
                      for (let f of itemFlag) {
                        if (item.item_name && item.item_name.toUpperCase() == f.key.toUpperCase()) {
                          item.item_visible_flag = f.value;
                        }
                      }
    
                      for (let e of enFlag) {
                        if (item.item_name && item.item_name.toUpperCase() == e.key.toUpperCase()) {
                          item.item_enable_flag = e.value;
                        }
                      }
    
                      for (let r of reqFlag) {
                        if (item.item_name && item.item_name.toUpperCase() == r.key.toUpperCase()) {
                          item.data_required_flag = r.value;
                          if (r.value == 'T') {
                            item.isValid = false;
                            if (item.prompt_name && item.prompt_name.indexOf('*') > -1) { } else {
                              item.prompt_name = item.prompt_name + '*'
                            }
                          } else {
                            if (item.prompt_name && item.prompt_name.indexOf('*') > -1) {
                              let str = item.prompt_name.slice(0, item.prompt_name.length - 1);
                              item.prompt_name = str;
                            }
                          }
                        }
                      }
    
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    console.log(this.selectinput.value);

    if(this.selectinput.value){
      this.selectinput.isValid = true;
    }
    
    this.emitOnChange.emit(this.selectinput);
  }


  getMode(event) {
    
     console.log(event);
     this.autoValue=event.key;
     this.selectinput.flag=false;
     this.fullList = false;
     this.onChangeFirst(event.val); 
   
  }

  myFunction() {
    if(!this.fullList){
      this.selectinput.flag=true;
    }
  }

  serchtextChange(event){
    if(this.selectinput.item_sub_type=='LIST_COMBO_BOX' || this.selectinput.item_sub_type=='COMBO_BOX'){
    if(this.autoCompleteflag){
    this.selectinput.dropdownList.filter(data=>{
      if(event==data.val){
        this.autoValue=data.key;
      }
    })
    console.log(this.autoValue);
    this.onChange(this.autoValue)
    this.autoCompleteflag=false;
  }
}
  //   this.selectinput.filterarray=[];
  //   this.selectinput.flag=true;

  //   if(this.selectinput.flag){
  //   console.log(this.selectinput.dropdownList)
  //   let dropdata=JSON.parse(JSON.stringify( this.selectinput.dropdownList));
  //   let vals = this.pipemys.transform(dropdata,this.selectinput.value);
  //     console.log(vals)
  //     if(vals){
  //       this.selectinput.filterarray=JSON.parse(JSON.stringify(vals));
  //     }
  // }
}

async func(){
  let res=await this.selectinput.dropdownList;
  if(res){
    if(this.selectModel){
      this.serchtextChange(this.selectModel);
    }
  }

}

onClear(){

  this.selectinput.flag=false;
  this.selectinput.value='';
  this.autoValue='';
}

async showDeveloperData() {
  this.developerModeData = {
    ws_seq_id: '',
    frame_seq_id: this.selectinput.apps_page_frame_seqid,
    item_seq_id: this.selectinput.apps_item_seqid
  }
  const modal = await this.modalCtrl.create({
    component: DeveloperModeLogPage,
    cssClass: 'my-custom-class',
    componentProps: {
      data: this.developerModeData
    }
  });
  return await modal.present();
}


}

