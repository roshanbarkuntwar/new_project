import { ChangeDetectorRef, Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IonInput, ModalController, NavParams, Platform, PopoverController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PouchDBService } from 'src/app/services/pouch-db.service';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { SqlLiteService } from 'src/app/services/sql-lite.service';

@Component({
  selector: 'app-single-select-lov',
  templateUrl: './single-select-lov.page.html',
  styleUrls: ['./single-select-lov.page.scss'],
})
export class SingleSelectLovPage implements OnInit {

  @ViewChild('autofocus') searchbar: IonInput;

  searchText: any;
  lovinput: any;
  selectinput: any;
  SelAll: boolean = false;
  object_arr: any = [];
  Object_code: any = [];
  objectList: any[];
  userDetails: any;
  wscp: any = {};
  wsdp: any = [];
  type = "";
  keyList = [];
  lovHead = [];
  itemvalue = {};
  prompt_name;
  prev_wscp: any = {};
  isChecked: boolean;
  orderByParam: any = {};
  noOfRecords :number = 100;
  limitedRecords = [];
  l_current_page:number = 1;
  l_total_remain_pages:any;
  filterableData = [];
  itemNameList = [];

  constructor(private modalCtrl: ModalController, public popoverCtrl: PopoverController, public navParams: NavParams, private pouchDBService: PouchDBService,
    public platform: Platform, private cdr: ChangeDetectorRef, 
    public dataService: DataService, public globalObjects: GlobalObjectsService, private pipemy: SearchfilterPipe, private sqlServ: SqlLiteService) {
    this.lovinput = this.navParams.get('paramValue');
    this.wscp = this.navParams.get('wscp');
    // this.wsdp=this.navParams.get('wsdp');
    // console.log(this.wsdp);
    this.userDetails = this.globalObjects.getLocallData("userDetails");

    if (!this.platform.is('android') && !this.platform.is('ios')) {
      // this.service.onstart = (e) => {
      //   console.log('onstart');
      // };
      // this.service.onresult = (e) => {
      //   this.searchText = e.results[0].item(0).transcript;
      //   console.log('SubComponent:onresult', this.searchText, e);
      // };
    }
  }


  ionViewWillEnter() {
    setTimeout(() => this.searchbar.setFocus(), 300);
  }


  ngOnInit() {
    this.getPageInfo();
  }

  sppeak() {
    //this.service.start();
  }



  setLOVValues(item) {

    let values = ""
    let codeOfValues = ""
    if (values == '' || values == null) {
      values = item[this.keyList[1].key];
      codeOfValues = item[this.keyList[0].key];
    } else {
      values = values + "," + item[this.keyList[1].key];
      codeOfValues = codeOfValues + "," + item[this.keyList[0].key];
    }
    let data = [];
    for(let itemName of this.itemNameList){
      for(let key of this.keyList){
        if(key.key && key.key.indexOf(itemName) > -1){
          let obj:any = {};
            obj.key = itemName;
            obj.value = item[key.key]
            data.push(obj);
          }
        }
  
      }
      console.log(data);
    let result: any = {};
    result.value = values;
    result.codeOfValues = codeOfValues;
    result.data = data;
    let items = item;
    result.item = items;
    if (this.lovinput.item_type == 'LP') {
      this.popoverCtrl.dismiss(result);
      this.popoverCtrl.dismiss(items);
    } else {
      this.modalCtrl.dismiss(result);
      this.modalCtrl.dismiss(items);
    }
  }

  SelectAll() {
    let vals = this.pipemy.transform(this.objectList, this.searchText);
    this.objectList = vals;
    console.log(vals)
    if (this.SelAll == true) {
      for (var i = 0; i < this.objectList.length; i++) {
        this.objectList[i]['checked'] = false;
      }
    }
    if (this.SelAll == false) {
      for (var i = 0; i < this.objectList.length; i++) {
        this.objectList[i]['checked'] = true;
      }
    }
  }

  setmultiLOVvalue(lov) {
    // let values = "";
    let values = [];
    let codeOfValues = [];
    // let codeOfValues = "";
    let items = [];
    for (let item of lov) {
      if (item.checked) {
        values.push(item[this.keyList[1].key]);
        codeOfValues.push(item[this.keyList[0].key]);
        this.isChecked = false;
        // if (values == '' || values == null) {
        //   values = item[this.keyList[1].key];
        //   codeOfValues = item[this.keyList[0].key];
        //   this.isChecked = true;
        // } else {
        //   values = values + "," + item[this.keyList[1].key];
        //   codeOfValues = codeOfValues + "," + item[this.keyList[0].key];
        //   this.isChecked = false;
        // }
        items.push(item);
      }
    }
    let strArr = [];
    for (let l of items) {
      for (let k in l) {
        if (k != "checked" && k != "isChecked" && k != "Level2") {
          if (strArr.length > 0) {
            let glob = strArr.find(x => x.key == k);
            if (glob) {
              glob.value = glob.value + "," + l[glob.key];
            } else {
              let data = {
                key: k,
                value: l[k]
              }
              strArr.push(data);
            }
          } else {
            let data = {
              key: k,
              value: l[k]
            }
            strArr.push(data);
          }
        }
      }
    }

    let sItem = items.length > 0 ? JSON.parse(JSON.stringify(items[0])) : "";
    for (let str of strArr) {
      if (sItem[str.key]) {
        sItem[str.key] = str.value
      }
    }
    let result: any = {};
    result.value = values;
    result.codeOfValues = codeOfValues;
    result.isChecked = this.isChecked;
    result.item = sItem;
    result.Ditems = items;
    if (this.lovinput.item_type == 'LP') {
      this.popoverCtrl.dismiss(result);
    } else {
      this.modalCtrl.dismiss(result);
    }
    // this.setLOVValues(values);
  }

  getPageInfo() {
    if (this.globalObjects.networkStatus) {
      this.globalObjects.showLoading();
    }
    this.wscp.service_type = "get_lov_data";
    this.wscp.apps_page_no = this.lovinput.apps_page_no;
    this.wscp.apps_page_frame_seqid = this.lovinput.apps_page_frame_seqid;
    this.wscp.apps_item_seqid = this.lovinput.apps_item_seqid;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.userDetails["object_code"] = this.lovinput.object_code;
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": this.wscp,
      "wsdp": this.wsdp
    }

    //------------------- Getting OFFLINE LOV SAVE ---------------------------------------------------//

    

    let objectKey = this.userDetails.object_code + "_LOV_" + this.wscp.apps_item_seqid;
    // if (this.userDetails.object_code && appWorkMode == 'I') {
    // if (this.userDetails.object_code && this.wscp.apps_working_mode === 'I') {
    this.sqlServ.getById(objectKey, 'item_master').then(data => {
      if ((data.resStatus == 'Success') && !this.globalObjects.networkStatus) {
        let objData: any = JSON.parse(data.resData.itemData);
        this.objectList = objData.Level1;
        this.Object_code = objData.Level1[0];
        /* for (let code in this.Object_code) {
          let codedata = code.split("~");
          if (codedata[1].toLowerCase() != 'item_visible_flag') {
            this.lovHead.push(codedata[0]);
            this.keyList.push(code);
          }
        } */

        this.generateLov();
      }
      else {
        this.dataService.postData("S2U", reqData).then(res => {
          this.globalObjects.hideLoading();
          let data: any = res;
          console.log("data in lovpage", res);


          if (data.responseStatus == "success") {
            this.object_arr = data.responseData
            let objData = this.globalObjects.setPageInfo(data.responseData);
            this.objectList = objData.Level1;
            this.Object_code = objData.Level1[0];
            delete this.Object_code['Level2'];
            console.log(this.objectList)
            //-------------------OFFLINE LOV SAVE ---------------------------------------------------//


            let offlineObjectCode: any;
            if (objData && this.wscp.apps_working_mode == 'I') {
              if (reqData.wslp) {
                if (reqData.wslp.object_code) {
                  offlineObjectCode = reqData.wslp.object_code + "_LOV_" + reqData.wscp.apps_item_seqid;
                }
              }

              let pouchObjectKey = offlineObjectCode;
              //objData._rev = "";
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

            //-------------------OFFLINE LOV SAVE ---------------------------------------------------//
            // this.objectList = this.object_arr.Level1;


            this.generateLov();

          } else {
            alert(data.responseMsg);
          }
        }).catch(err => {
          this.globalObjects.hideLoading();
          this.globalObjects.presentToast("4 Something went wrong please try again later!");
        })
      }
    }, err => this.globalObjects.presentAlert('ERR PDB: ' + err))
  }



  generateLov() {
    this.itemNameList = [];
    let checkedKey;
    for (let code in this.Object_code) {
      if (code.indexOf("CB_SELECT") > -1) {
        checkedKey = code;
      }
      // if(this.lovinput.lov_return_column_str){
      let coldata = code.split("#");
      let codedata
      if (coldata) {
        codedata = coldata[0].split("~");
      } else {
        codedata = code[0].split("~");
      }
      this.itemNameList.push(codedata[1]);
      if (codedata[1].toLowerCase() != 'item_visible_flag') {
        let head;
        if (coldata) {
          head = coldata.find(x => x.indexOf("item_visible_flag") > -1);
        }

        if (head) {
          let itmVisi = head.split("~")[1];
          if (itmVisi == 'F') { } else {
            let data = {
              th: codedata[0],
              code: code
            }
            this.lovHead.push(data);
          }
        } else {
          let data = {
            th: codedata[0],
            code: code
          }
          this.lovHead.push(data);
        }

        let val: any = {};

        let wheredataArr = [];
        for (let c of coldata) {
          let k = c.split("~");

          if (k[0] == "display_setting_str" || k[0] == "item_visible_flag" || k[0] == "filter_flag") {
            if (k[0] == "display_setting_str") {
              val.display_setting_str = k[1];
            } else if (k[0] == "item_visible_flag") {
              val.item_visible_flag = k[1];
            } else if (k[0] == "filter_flag") {
              val.filter_flag = k[1];
            }
          } else {
            val.key = code;
          }
        }
        this.keyList.push(val);
      }
    }

    //   if(checkedKey)
    //   for(let object of this.objectList){
    //     if(object[checkedKey].toLowerCase() == "true"){
    //       object['checked'] = true;
    //     }
    //   else{
    //     object['checked'] = false;

    // }
    //   }
    if (this.lovinput.codeOfValues != undefined) {
      var checkInput = this.lovinput.codeOfValues.split(",");
      for (let object of this.objectList) {
        for (let key of this.keyList) {
          for (let checkObject of checkInput) {
            if (checkObject == object[key.key]) {
              object['checked'] = true;
            }
          }
        }
      }
    }
    this.l_current_page = 1;
    this.paginate(this.l_current_page);

  }

  paginate(num){
    if(num == 1){
      this.limitedRecords = [];
    }
    let to = this.noOfRecords * num;
    let from = to - this.noOfRecords;

    let data = [];

    if(this.filterableData.length > 0){
      data = this.filterableData;
    }else{
      data = this.objectList;
    }

    if(to > data.length){
      to = data.length;
    }
    for(let i = from; i < to ; i++){
      this.limitedRecords.push(data[i]);
    }
    this.l_current_page = num;
    this.l_total_remain_pages = Math.ceil((data.length)/this.noOfRecords);
    console.log(this.limitedRecords);
  }


  goToLast(last){
    this.limitedRecords = [];

    let to = this.noOfRecords * last;
    let from = 0;
    for(let i = from; i < to ; i++){
      this.limitedRecords.push(this.objectList[i]);
    }
    this.l_current_page = last;
    this.l_total_remain_pages = Math.ceil((this.objectList.length)/this.noOfRecords);
   // console.log(this.limitedRecords);
  }

  closeLov() {

    if (this.lovinput.item_sub_type == 'M'  || this.lovinput.item_sub_type == 'LIST_COMBO_BOX') {
      this.setmultiLOVvalue(this.objectList);
    } else {

      if (this.lovinput.item_type == 'LP') {
        this.popoverCtrl.dismiss();
      } else {
        this.modalCtrl.dismiss();
      }
    }

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

  //-------table order by start
  thClick(th: string, i) {
    this.orderByParam.th = th;
    this.orderByParam.index = i;
    if (this.orderByParam.direction > 0) {
      this.orderByParam.direction = -1;
    } else {
      this.orderByParam.direction = 1;
    }

    this.objectList = this.objectList.sort((a, b) => {
      let d = a[th];
      // console.log(d);
      a[th] = a[th] ? a[th] : "";
      b[th] = b[th] ? b[th] : "";
      if (a[th] < b[th]) {
        return -1 * this.orderByParam.direction;
      } else if (a[th] > b[th]) {
        return 1 * this.orderByParam.direction;
      } else {
        return 0;
      }

    });
    this.paginate(1);

  }


noChange(val){
  if(val){
    let vals = this.pipemy.transform(this.objectList, this.searchText);
    if(vals){
      this.filterableData = vals;
    }
  }else{
    this.filterableData = [];
  }
  this.paginate(1);

}
  //-------table order by end



}
