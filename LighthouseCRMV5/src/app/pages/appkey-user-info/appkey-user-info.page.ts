import { NavParams, NavController, ModalController,Platform } from '@ionic/angular';
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Device } from '@ionic-native/device/ngx';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { UsersettingPage } from '../usersetting/usersetting.page';
import { Events } from 'src/app/demo-utils/event/events';

@Component({
  selector: 'app-appkey-user-info',
  templateUrl: './appkey-user-info.page.html',
  styleUrls: ['./appkey-user-info.page.scss'],
})
export class AppkeyUserInfoPage implements OnInit {

  thead: any[];
  tablerows: any[];
  tablerowsres: any[];
  searchText: any;
  appKey: string;
  appCode: string;
  public loginValid: any = {};
  paswordToggle: any = "hidetext";
  object_code = "";

  @Input() resData: any;

  constructor(private el: ElementRef, navParam: NavParams, private navCtrl: NavController, private modalctrl: ModalController, private platform:Platform,
    public globalObjects: GlobalObjectsService, private device: Device, private httpClient: HttpClient, private dataService: DataService, private events: Events) {
    let res: any = navParam;
    this.thead = res.data.responseData.HEADING;
    this.tablerows = res.data.responseData.BODY;
    this.appKey = res.data.appKeyDetails.app_key;
    this.appCode = res.data.appKeyDetails.app_code;
    this.tablerowsres = res.data.responseData.BODY;
      this.object_code = res.data.appKeyDetails.calling_object_code;
    console.log(this.tablerowsres);
  }

  ngOnInit() {
  }

  filterTable() {
    this.tablerows = this.tablerowsres.filter((item: any) => {

      if (item.user_code && item.user_code.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item;
      } else if (item.client_name && item.client_name.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item;
      }
      else if (item.password && item.password.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item;
      }
      else if (item.module && item.module.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item;
      }
      else if (item.apps_name && item.apps_name.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item;
      }
    })
  }

  closeModal() {
    this.modalctrl.dismiss({
      'dismissed': true
    });
  }

  showPassword(event) {
    let showCount = this.globalObjects.getLocallData("showCount");
    if (showCount) {
      if (showCount >= 2) {
        //event.srcElement.classList = "";
        this.paswordToggle = ""
        this.globalObjects.setDataLocally("showCount", 0);
      }
      else {
        this.globalObjects.setDataLocally("showCount", showCount + 1);
      }
    }
    else {
      this.globalObjects.setDataLocally("showCount", 1);
    }
    //console.log("Event:", event);
  }

  loginByPass(rowData) {
    

    if (this.appKey) {
      // this.destroyLocalData();
      let base_url = "http://203.193.167.118:8888/lhsws/getServerDetails";
      var data = {
        "parameters": {
          "appKey": this.appKey,
          "device_id": this.device.uuid,
          "device_name": this.device.model,
          "platform": this.globalObjects.platformVal
        }
      }
      this.httpClient.post(encodeURI(base_url), data).subscribe(data => {
        var resData: any = data;
        var responseData = resData.responseData;
        var responseMsg = resData.responseMsg;
        if (resData.responseStatus == "success") {
          this.destroyLocalData();
          var msg = responseMsg.split("#");

      
          if ((msg[0] == "T") || (msg[0] == "F") || (responseMsg.charAt(1) != "#")) {
  
            var server_url = "http://" + responseData.serverUrl + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            //  this.validateObjects(server_url, appkey).then((res: any) => {
            // if (res.responseStatus == "Success") {
            //=----------------------------------------------
            /*  if(!this.globalObjects.getLocallData("loginDate")){
               this.globalObjects.setDataLocally("loginDate", new Date());
             } */
            var appData: any = {};
            appData.app_name = resData.responseData.app_name;
            appData.appkey =  this.appKey.toUpperCase();
            appData.loginFlag = resData.responseData.loginFlag;
  
            // alert(appkey.toUpperCase());
            appData.resData = resData.responseData;
            var appArr: any = this.globalObjects.getLocallData("appData");
            if (appArr) {
              let isExsist = false;
              for (let app of appArr) {
                if (app.appkey.toUpperCase() ==  this.appKey.toUpperCase()) {
                  app = JSON.parse(JSON.stringify(appData));
                  isExsist = true;
                }
              }
              if (!isExsist) {
                appArr.push(appData);
              }
              this.globalObjects.setDataLocally("appData", appArr);
            } else {
              appArr = [];
              appArr.push(appData);
              this.globalObjects.setDataLocally("appData", appArr);
            }
            //=----------------------------------------------
            this.globalObjects.setDataLocally("appKey",  this.appKey); 
            
            this.globalObjects.setDataLocally("appCode", responseData.appcode);
            this.globalObjects.setDataLocally("webapplink", responseData.webapplink);
            if(responseData.tenantId){
              this.globalObjects.setDataLocally("tenantId", responseData.tenantId);
            }else{
              this.globalObjects.setDataLocally("tenantId", responseData.dbName);
            }
  
            if(responseData.default_theme){
              this.globalObjects.appTheme = responseData.default_theme;
              this.globalObjects.setDataLocally("theme", responseData.default_theme);
            }
  
            var server_url2 = "http://" + responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            var server_url3 = "http://" + responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            var server_url4 = "http://" + responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            this.globalObjects.setDataLocally("isAppLaunch", true);
            this.globalObjects.setDataLocally("device_validation", responseData.device_validation);
            this.globalObjects.setDataLocally("scopeUrl", server_url);
            this.globalObjects.setDataLocally("server_url1", server_url);
            this.globalObjects.setDataLocally("server_url2", server_url2);
            this.globalObjects.setDataLocally("server_url3", server_url3);
            this.globalObjects.setDataLocally("server_url4", server_url4);
            this.globalObjects.setDataLocally("dbName", responseData.dbName);
            this.globalObjects.setScopeUrl(server_url);
            this.globalObjects.setDataLocally("entity_code_str_appkey", responseData.entity_code_str);
            this.globalObjects.setDataLocally("entity_code_appkey", responseData.entity);
            let dbinitdetails = "?minIdel=" + (responseData.minIdel ? responseData.minIdel : null) 
                                + "&maxIdel=" + (responseData.maxIdel ? responseData.maxIdel : null) 
                                + "&maxTotal=" + (responseData.maxTotal ? responseData.maxTotal : null);
            this.globalObjects.setDataLocally("dbinitdetails", dbinitdetails);
            if (msg[0] == "F") {
              this.globalObjects.presentAlert(msg[1]);
            }
            this.globalObjects.checkAndSetScopeUrl().then(data => {
              this.loginBypass(rowData,responseData);
              // this.router.navigate(['login']);
  
              this.globalObjects.destroyLocalData("appkeyTryCount");
              this.globalObjects.destroyLocalData("appkeyLockTime");
            }, err => { 
              
            })
          }
          else {
           
            this.globalObjects.presentAlert(msg[1]);
          }
          
        } else {
          // this.globalObjects.displayCordovaToast(resData.responseMsg);
          this.globalObjects.presentToastWithOptions(resData.responseMsg, "errorClass");
        }

      }, err => {
        this.globalObjects.displayCordovaToast("Error return from server 203.167.193.118:8888. ");
      })
    }

  }

  loginBypass(rowData, responseData){
    let token = this.globalObjects.getLocallData("device_token");

    let url = 'login?userId=' + (rowData.user_code).trim() + '&password=' + encodeURIComponent(rowData.password) +
    '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
    + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + rowData.app_key + "&appkeyValidationFlag=" + responseData.device_validation + "&OTPFlag=" + ""
    + "&entityCodeStr=" + encodeURIComponent(responseData.entity_code_str) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
    + "&latitude=" + encodeURIComponent(this.globalObjects.latitude1) + "&longitude=" + encodeURIComponent(null) + "&platform=" + encodeURIComponent(this.globalObjects.platformVal)
    + "&location=" + encodeURIComponent(null);

    this.dataService.getData(url).then((data: any) => {
      this.loginValid = data;
     
        if (this.loginValid.responseMsg === "User is authenticated") {

          // if (this.loginValid.responseData.gps_mandatory_flag == 'Y' && (this.platform.is('ios') || this.platform.is('android'))) {
          //   this.globalObjects.checkGPSPermission().then(() => {
          //     this.validatePlatform(loginFlag);
          //   }, (err) => {
          //     this.globalObjects.presentAlert("You can not access app without location permission. Please allow location permission.");
          //   })
          // } else {
          //   this.validatePlatform(loginFlag);
          // }
          this.login(rowData)
          if (this.loginValid.responseData.massege) {
            this.globalObjects.presentAlert(this.loginValid.responseData.massege);
          }

        }
        else {
          this.globalObjects.presentAlert(this.loginValid.responseMsg);
        }
   
    }, err => {
      console.log(err);
      this.globalObjects.presentAlert("Server error, URl not found....");
    })
  }


  destroyLocalData() {

    this.globalObjects.destroyLocalData("userDetails");
    this.globalObjects.destroyLocalData("apptype");
    this.globalObjects.destroyLocalData("scopeUrl");
    this.globalObjects.destroyLocalData("valueFormat");
    this.globalObjects.destroyLocalData("partyName");
    this.globalObjects.destroyLocalData("partyCode");
    this.globalObjects.destroyLocalData("tabParam");
    this.globalObjects.destroyLocalData("localNotif");
    this.globalObjects.destroyLocalData("archieve_Data");
    this.globalObjects.destroyLocalData("LoginUserAccCode");
    this.globalObjects.destroyLocalData("app-theme");
    this.globalObjects.destroyLocalData("");
    this.globalObjects.destroyLocalData("clickedItem");
    this.globalObjects.destroyLocalData("sidemenulov");
  }

  login(rowData) {
    if (this.loginValid.responseStatus === "success") {
      this.loginValid.responseData.password = rowData.password
      this.loginValid.responseData.appkey = this.globalObjects.getLocallData("appKey");
      if (this.platform.is('ios')) {
        this.loginValid.responseData.platform = 'ios';
      }
      else if (this.platform.is('android')) {
        this.loginValid.responseData.platform = 'android';
      } else {
        this.loginValid.responseData.platform = 'browser';
      }
      this.loginValid.responseData.login_device_id = this.globalObjects.device.uuid;
      this.loginValid.responseData.login_device_model = this.globalObjects.device.model;
      this.loginValid.responseData.first_login_time = new Date().getTime();
      if(this.globalObjects.bojectBypass){
        this.object_code ? this.loginValid.responseData.homeObjectCode = this.object_code : "";
      }
      this.globalObjects.setDataLocally("userDetails", this.loginValid.responseData);
      this.globalObjects.setDataLocally("apptype", this.loginValid.responseData.module);
       
      var appData: any = {};
      appData.app_name = this.loginValid.responseData.app_name ? this.loginValid.responseData.app_name : "";
      appData.appkey = this.loginValid.responseData.appkey ? this.loginValid.responseData.appkey : "";
      appData.loginFlag = this.loginValid.responseData.loginFlag ? this.loginValid.responseData.loginFlag : "";

      appData.resData = this.loginValid.responseData;
      var appArr: any = this.globalObjects.getLocallData("appData");
      if (appArr) {
        let isExsist = false;
        for (let app of appArr) {
          if (app.appkey.toUpperCase() == this.loginValid.responseData.appkey) {
            app = JSON.parse(JSON.stringify(appData));
            isExsist = true;
          }
        }
        if (!isExsist) {
          appArr.push(appData);
        }
        this.globalObjects.setDataLocally("appData", appArr);
      } else {
        appArr = [];
        appArr.push(appData);
        this.globalObjects.setDataLocally("appData", appArr);
      }

     this.events.publish("GET_SIDE_MENU_DATA", "LHS");
      let pcnt = this.loginValid.responseData.global_parameter_page_cnt ? this.loginValid.responseData.global_parameter_page_cnt : 0;
     
      if(parseInt(pcnt)>0){
        this.popoveruser().then(() => { 
        });
        this.modalctrl.dismiss();
      }else{
        setTimeout(() => {
          this.modalctrl.dismiss();
          this.navCtrl.navigateRoot('super');
          this.events.publish("refreshOnViewChangeBypass");
        }, 1000);
      }

    }
  }

  async popoveruser() {
    // this.router.navigate(["/usersetting",{userValueList: this.globalObjects.userValueListfromglobal}], );
    let popUp = await this.modalctrl.create({
      component: UsersettingPage,
      componentProps: {
        userValueList: this.globalObjects.userValueListfromglobal,
        flag:false
      },
      backdropDismiss: false
    });
    popUp.present();

    popUp.onDidDismiss().then(()=>{
      this.events.publish("refreshOnViewChangeBypass");
    })

  }
}
