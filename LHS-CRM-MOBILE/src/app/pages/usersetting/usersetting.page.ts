import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DynamicmodalPage } from '../dynamicmodal/dynamicmodal.page';
import { OverlayEventDetail } from '@ionic/core';
import { Router } from '@angular/router';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { AngularMyDatePickerDirective, IAngularMyDpOptions } from 'angular-mydatepicker';
@Component({
  selector: 'app-usersetting',
  templateUrl: './usersetting.page.html',
  styleUrls: ['./usersetting.page.scss'],
})
export class UsersettingPage implements OnInit {
  @ViewChild('dp') myDp: AngularMyDatePickerDirective;
  sideLovarray: any = [];
  refreshBtn: boolean = false;
  otherlist: boolean = false;
  networkInfo: any;
  isAndroid: boolean = true;
  toggleNotification: boolean = false;
  toggleFab: boolean = false;
  selectText = "selectText";
  val : any;
  displayGif = "assets/video/gif1.gif";
  platformValue : any;
  month = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sepr", "Oct", "Nov", "Dec" ];
  myDatePickerOptions: IAngularMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    dateRange: false,
  //   disableDateRanges: [{
  //     begin: {year:2020, month: 12, day: 1}, 
  //     end: {year: 2021, month: 1, day: 31}
  // }]
  minYear:1992,
  maxYear:2050
}
  public appPages = [
    {
      title: 'Location Tracker',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Super',
      url: '/super',
      icon: 'home'
    },
    // {
    //   title: 'List',
    //   url: '/list',
    //   icon: 'list'
    // }
  ];
 
  userDetails: any;
  entity_name: any = "";
  default_entity: any;
  entityCodeStrValList: any = [];
  divCodeStrValList: any = [];
  geoOrgList: any = [];
  keys: any = [];
  notificationMenu: boolean = true;
  fabbuttonMenu: boolean = true;
  selectedPartyName: any;
  selectedPartyCode: any;
  divCode: any = "";
  entityCode: any = "";
  geoOrgCode: any = "";
  entityMap: any = {};
  userValueList: any = [];
  data: any = {};
  selectedModalVal
  appkeyInfo: any = 'N';
  selectedName: any;
  selectedCode: any;
  theme: any;
  refreshDetailsFirstTime: boolean = true;
  fontRange: number;


  appkey: any;
  appArr: any;
  dbName: any;
  dbPassword: any;
  count1: number = 0;
  count2: number = 0;
  loginExpiry: any;
  ddListFlag: boolean = false;
  sidelovarray: any = [];
  toggleSelectText: boolean = false;
  offlineEntrySaveFlag: boolean = false;
  disconnected: boolean = false;
  tempNetworkStatus: boolean = false;
  alertCount: number = 0;
  @Input() flag : boolean = false;
  disableButton = false;
  constructor( public modalCtrl: ModalController, public globalObjects: GlobalObjectsService, private datePicker: DatePicker, public dataService: DataService,public navCtrl:NavController,
    private router: Router, private platform : Platform, private cdr: ChangeDetectorRef) {
    this.userDetails = this.globalObjects.getLocallData('userDetails');
   }

  ngOnInit() {
    if(this.platform.is('android')){
      this.platformValue = 'android';
    }else if(this.platform.is('ios')){
      this.platformValue = 'ios';
    }else{
      this.platformValue = 'browser';
    }
    this.userValueList = this.globalObjects.userValueListfromglobal;
    this.getUserDetails("firstTime");
    this.refreshDetailsFirstTime = false;
    this.ddListFlag = false;
   
  }

  async closePage() {
    this.disableButton = true;
    let flag:boolean = true;
    let str = "";
    for(let data of this.userValueList){
      if((data.prompt_name[data.prompt_name.length -1] =='*' || data.data_required_flag == 'T') && (data.item_name1 == undefined || data.item_name1 == null || !data.item_name1)){
        flag = false;
        str += data.prompt_name + ',';
      }
    }
    if(flag){
      if(!this.flag){
        this.globalObjects.setDataLocally("loginFlag", true);
        this.getAppHeaderData().then(()=>{
          this.disableButton = false;
          this.navCtrl.navigateRoot('super');
          setTimeout(() => {
        
            this.modalCtrl.dismiss();
          }, 300);
        })
      }else{
        this.globalObjects.setDataLocally("loginFlag", true);
        this.getAppHeaderData().then(()=>{
          this.disableButton = false;
          this.gotosuper();
        })
      }
      // this.router.navigate(["/super"]);
    }else{
      alert("Please enter "+ str);
      this.disableButton = false;
    }
  
  }

  async gotosuper() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      location.reload();
    }
    else {
      let url: any = location;
      window.open(String(url).split('super')[0], '_self');
      window.open(String(url).split('appkey-collection')[0], '_self');
      
    }

  }

  getUserDetails(type) {

    this.sidelovarray = this.globalObjects.getLocallData("sidemenulov");
    if (!this.ddListFlag) {
      this.ddListFlag = true;

      let url = "getUserParams";
      let userDetails = this.globalObjects.getLocallData("userDetails");
      let entityCodeStr = this.globalObjects.getLocallData("entity_code_str_appkey");
      let entityCode = this.globalObjects.getLocallData("entity_code_appkey");
      userDetails.entity_code_str_appkey = entityCodeStr;
      userDetails.entity_code_appkey = entityCode;
      this.userDetails = userDetails;
      var data = {
        "parameters": userDetails
      }
      this.dataService.postData(url, data).then(res => {
        let response: any = res;
        if(response.responseData.length<=0){
          this.navCtrl.navigateRoot('super');
          this.modalCtrl.dismiss();
        }else{
        console.log("Userdde: " + JSON.stringify(res));
        if (response) {
          this.userValueList = response.responseData;
          if (this.userValueList.length > 0) {

            for (let obj in this.userDetails) {
              for (let val of this.userValueList) {
                if (obj == val.item_name) {
                  val.item_name1 = this.userDetails[obj];
                  let event = {
                    target: {
                      value: val.item_name1
                    }
                  }
                  this.dropdwnValChng(event, val.item_name, 'getdetails', type)
                }
                if (val.result && val.result.length <= 1 && !val.item_name1) {
                  val.item_name1 = val.result[0].CODE
                }

              }
            }

            for (let val of this.userValueList) {
              if (val.error != null) {
                console.log(JSON.stringify(val.error.query));
                this.globalObjects.presentAlert(JSON.stringify(val.item_name).toUpperCase() + " : " + JSON.stringify(val.error.errMsg));
              }

              
            }

            console.log(this.userValueList)
            this.globalObjects.userValueListfromglobal = this.userValueList;
            this.globalObjects.setsidemenudetail();
            
          }
        }}
      });
    }
  }

  // getDependedntValue(
  //   let e = {};
  //   e
  // }

  dropdwnValChng(event, item_name, from, type) {

    let userDet = this.globalObjects.getLocallData('userDetails');
    userDet[item_name] = (event.target.value ? event.target.value : "").trim();

    this.globalObjects.setDataLocally('userDetails', userDet);
    console.log(JSON.parse(JSON.stringify(this.userDetails)));
    let userDetails = this.globalObjects.getLocallData('userDetails');
    let entityCodeStr = this.globalObjects.getLocallData("entity_code_str_appkey");
    let entityCode = this.globalObjects.getLocallData("entity_code_appkey");
    userDetails.entity_code_str_appkey = entityCodeStr;
    userDetails.entity_code_appkey = entityCode;
    userDetails.item_name = item_name;
    userDetails.apps_frame_seq_id = this.userValueList.length > 0 ? (this.userValueList[0].apps_frame_seq_id ? this.userValueList[0].apps_frame_seq_id : '0') : '0';

    // userDetails[item_name] = (event.detail.value).trim();

    // userDetails.item_name = item_name;
    let url = "getDependentValue";
    var data = {
      "parameters": userDetails
    }

    this.dataService.postData(url, data).then(response => {
      let data: any = response;
      console.log(response)
      let final_data = JSON.parse(JSON.stringify(data));
      if (final_data.responseStatus == 'Success') {
        let dependentVal: any = [];
        dependentVal = final_data.responseData;
        for (let obj of dependentVal) {
          if (obj.result == null) {
            for (var i = 0; i < this.userValueList.length; i++) {
              if (obj.prompt_name == this.userValueList[i].prompt_name) {
                this.userValueList[i].item_name1 = "";
                this.userValueList[i].valueforlov ? this.userValueList[i].valueforlov = "" : "";
                this.userValueList[i].codeforlov ? this.userValueList[i].codeforlov = "" : "";
                if (type != 'firstTime') {
                  this.sidelovarray ? this.sidelovarray[i] = null : "";
                  this.globalObjects.setDataLocally("sidemenulov", this.sidelovarray);
                }
                console.log(this.refreshBtn + "____" + this.refreshDetailsFirstTime)
                this.userValueList[i].result = [{}];
              }
            }
          }
          else if (obj.result.length == 1) {
            for (var i = 0; i < this.userValueList.length; i++) {
              if (obj.prompt_name == this.userValueList[i].prompt_name) {
                this.userValueList[i].item_name1 = obj.result[0].CODE;
                //  this.userValueList[i].result=[];
                this.userValueList[i].result = obj.result;
              }
            }
          } else {
            for (var i = 0; i < this.userValueList.length; i++) {
              if (obj.prompt_name == this.userValueList[i].prompt_name) {
                this.userValueList[i].item_name1 = "";
                this.userValueList[i].valueforlov ? this.userValueList[i].valueforlov = "" : "";
                this.userValueList[i].codeforlov ? this.userValueList[i].codeforlov = "" : "";
                if (type != 'firstTime') {
                  this.sidelovarray ? this.sidelovarray[i] = null : "";
                  this.globalObjects.setDataLocally("sidemenulov", this.sidelovarray);
                }
                console.log(this.refreshBtn + "____" + this.refreshDetailsFirstTime)
                this.userValueList[i].result = obj.result;
              }
            }
          }
        }
        if (this.userDetails[item_name] && from == 'getdetails') {
          for (let obj in this.userDetails) {
            for (let val of this.userValueList) {
              if (obj == val.item_name) {
                val.item_name1 = this.userDetails[obj];
              }
            }
          }
        }
      }
      this.globalObjects.userValueListfromglobal = this.userValueList;
      this.globalObjects.setsidemenudetail();
    });
  }


  
  async openDynamicModal(data) {
    console.log('DynamiCModal', JSON.stringify(data));
    let modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: DynamicmodalPage,
        componentProps: {
          modalData: data
        }
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail) {
        let resData: any = detail.data;
        this.globalObjects.setsidemenudetail();
        // this.globalObjects.getLocallData("sidemenulov").
        this.sideLovarray = this.globalObjects.getLocallData("sidemenulov")


        if (this.userValueList.length > 0) {
          for (let i = 0; i < this.userValueList.length; i++) {
            if (this.userValueList[i].item_name == data.item_name) {
              this.userValueList[i].item_name1 = resData ? resData.CODE : "";
              this.userValueList[i].valueforlov = resData ? resData.VALUE : "";
              this.sideLovarray == null ? this.sideLovarray = [] : this.sideLovarray;
              this.sideLovarray[i] = this.userValueList[i].valueforlov;
              this.userValueList[i].codeforlov = resData ? resData.CODE : "";
            }
          }
        }

        console.log(this.userValueList)
        this.globalObjects.setDataLocally('sidemenulov', this.sideLovarray);
        console.log(this.globalObjects.getLocallData("sidemenulov"))
        this.selectedName = resData ? resData.VALUE : "";
        this.selectedCode = resData ? resData.CODE : "";
        let userDetails = this.globalObjects.getLocallData("userDetails");
        userDetails.item_name = data.item_name;
        userDetails[data.item_name] = resData ? resData.CODE : "";

        this.globalObjects.setDataLocally('userDetails', userDetails);
        console.log(this.globalObjects.userDetails)
        let url = "getDependentValue";
        var obj = {
          "parameters": userDetails
        }
        this.dataService.postData(url, obj).then(response => {
          let data: any = response;
          let final_data = JSON.parse(JSON.stringify(data));
          if (final_data.responseStatus == 'Success') {
            let dependentVal: any = [];
            dependentVal = final_data.responseData;
            for (let obj of dependentVal) {
              if (obj.result == null) {
                for (var i = 0; i < this.userValueList.length; i++) {
                  if (obj.prompt_name == this.userValueList[i].prompt_name) {
                    this.userValueList[i].item_name1 = "";
                    this.userValueList[i].result = [{}];
                  }
                }
              }
              else if (obj.result.length == 1) {
                for (var i = 0; i < this.userValueList.length; i++) {
                  if (obj.prompt_name == this.userValueList[i].prompt_name) {
                    this.userValueList[i].item_name1 = obj.result[0].CODE;
                    //  this.userValueList[i].result=[];
                    this.userValueList[i].result = obj.result;
                  }
                }
              } else {
                for (var i = 0; i < this.userValueList.length; i++) {
                  if (obj.prompt_name == this.userValueList[i].prompt_name) {
                    this.userValueList[i].item_name1 = "";
                    this.userValueList[i].result = obj.result;
                  }
                }
              }
            }
          }
        });
      }
    });
    await modal.present();
  }


  showtimepicker(dateinput) {
      this.datePicker.show({
        date: new Date(),
        mode: 'time',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      }).then(
        date => {
          dateinput.item_name1 = "";
          var dateVal = "";
          dateVal = this.globalObjects.formatDate(date, 'HH:mm:ss');
          dateinput.item_name1 = dateVal;

        },
        err => console.log('Error occurred while getting datetime: ' + err)
      );
  }

  onChange(dateinput) {
    if (dateinput.item_type == 'D' && this.platformValue == 'browser') {
      // dateinput.item_name1="";
      let datevalue;
      if(dateinput.item_name2){
        datevalue=dateinput.item_name2.singleDate.date.day +"-"+ this.month[dateinput.item_name2.singleDate.date.month-1] +"-"+dateinput.item_name2.singleDate.date.year;
        dateinput.item_name1=datevalue;
        // this.dateinput.value = this.globalservice.formatDate(datevalue, "dd-MMM-yyyy");
      }
    }else{
      dateinput.item_name1 = this.globalObjects.formatDate(dateinput.item_name1, "dd-MMM-yyyy");
    }
    // else if (dateinput.item_sub_type == 'T' && this.platformValue == 'browser') {
    //   dateinput.item_name1 = this.globalObjects.formatDate(this.val, "HH:mm:ss");
    // }
    // else if (dateinput.item_sub_type == 'DT' && this.platformValue == 'browser') {
    //   dateinput.item_name1 = this.globalObjects.formatDate(this.val, "dd-MMM-yyyy HH:mm:ss");
    // }
    console.log(dateinput.item_name1);
    if(dateinput.item_name1.indexOf('Sepr')){
     dateinput.item_name1= (dateinput.item_name1).replace('Sepr','Sep')
    
    }
    let event = {
      target: {
        value: dateinput.item_name1
      }
    }
    this.dropdwnValChng(event, dateinput.item_name, 'getdetails', null)
    // this.emitOnChange.emit(JSON.parse(JSON.stringify(this.dateinput)))
  }
  toggleCalendar(dateinput): void {

      this.cdr.detectChanges();
      this.myDp.toggleCalendar();
     
    
   
  }

  getAppHeaderData(){
    return new Promise((resolve, reject) =>{

      let url = 'getAppHeader';
      let userDetails = this.globalObjects.getLocallData("userDetails");
      let reqData = {
        "wslp" : userDetails
      }
      this.dataService.postData(url, reqData).then((res:any)=>{
        if(res.responseStatus == 'success'){
          if(res.responseMsg && res.responseMsg.indexOf('#') > -1){
            let resArr = res.responseMsg.split('#')
            if (resArr[0] == "Q") {
              this.globalObjects.presentAlert(resArr[1]);
            } else if(resArr[0] == "F"){
              this.globalObjects.presentAlert(res.responseMsg);
            }
          }
          let app_disp_header = res.responseData.app_disp_header ? res.responseData.app_disp_header : "";
          userDetails.app_disp_header = app_disp_header;
          this.globalObjects.setDataLocally("userDetails", userDetails);
        }
        resolve("");
      },(err)=>{
        resolve("");
      })
    })
  }
  ionViewDidEnter(){
    
    setTimeout(()=>{
      this.displayGif = "assets/video/gif2.gif";
    },2800)
  }
}
