import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Events } from 'src/app/demo-utils/event/events';
import { BackgroundService } from './background.service';
import { DataService } from './data.service';
import { GlobalObjectsService } from './global-objects.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { UsersettingPage } from '../pages/usersetting/usersetting.page';

@Injectable({
  providedIn: 'root'
})
export class UserauthenticationService {
  appData: any = [];
  isProcessing: boolean = false;
  loginCredentials: any;
  online: boolean = true;
  public loginValid: any = {};
  OTPCode: any;

  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService, private platform: Platform,
    private backgroundService: BackgroundService, private navCtrl: NavController, private router: Router, private modalCtrl: ModalController,
    private events: Events) { }

  selectAppkey(app) {
    if (app && !this.isProcessing) {
      this.isProcessing = true;
      this.globalObjects.setDataLocally("appKey", app.appkey);
      this.globalObjects.setDataLocally("appCode", app.resData.appcode);
      if (app.resData.tenantId) {
        this.globalObjects.setDataLocally("tenantId", app.resData.tenantId);
      } else {
        this.globalObjects.setDataLocally("tenantId", app.resData.dbName);
      }
      if (app.resData.default_theme) {
        this.globalObjects.appTheme = app.resData.default_theme;
        this.globalObjects.setDataLocally("theme", app.resData.default_theme);
      }

      var server_url = "http://" + app.resData.serverUrl + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
      var server_url2 = "http://" + app.resData.server_url2 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
      var server_url3 = "http://" + app.resData.server_url3 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
      var server_url4 = "http://" + app.resData.server_url4 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
      this.globalObjects.setDataLocally("isAppLaunch", true);
      this.globalObjects.setDataLocally("scopeUrl", server_url);
      this.globalObjects.setDataLocally("server_url1", server_url);
      this.globalObjects.setDataLocally("server_url2", server_url2);
      this.globalObjects.setDataLocally("server_url3", server_url3);
      this.globalObjects.setDataLocally("server_url4", server_url4);
      this.globalObjects.setDataLocally("dbName", app.resData.dbName);
      this.globalObjects.setDataLocally("webapplink", app.resData.webapplink);
      this.globalObjects.setScopeUrl(server_url);
      this.globalObjects.setDataLocally("entity_code_str_appkey", app.resData.entity_code_str);
      this.globalObjects.setDataLocally("entity_code_appkey", app.resData.entity);

      this.globalObjects.checkAndSetScopeUrl().then(data => {
        this.doLogin();
      }, err => {
        this.isProcessing = false;
      })
      this.globalObjects.setDataLocally("device_validation", app.resData.device_validation);
    }
  }

  doLogin() {
    this.loginCredentials = this.globalObjects.getLocallData("tempUser");
    let deviceValidation = this.globalObjects.getLocallData("device_validation");
    let token = this.globalObjects.getLocallData("device_token");
    let appKey = this.globalObjects.getLocallData("appKey");
    let entityCodeStr = this.globalObjects.getLocallData("entityCodeStr");
    var appDataArr: any = this.globalObjects.getLocallData("appData");
    let platform;
    if (this.platform.is('ios')) {
      platform = "ios";

    } else if (this.platform.is('android')) {
      platform = "android";
    } else {
      platform = "browser"
    }
    let latitude: any = this.backgroundService.latitude;
    let longitude: any = this.backgroundService.longitude;
    let loc_address: any;
    this.globalObjects.geoCoderLocation(latitude, longitude).then(res => {
      loc_address = res;
    }, (err) => {
      // alert(JSON.stringify(err));
    });

    var loginFlag: any;

    if (appDataArr) {
      for (let app of appDataArr) {
        if (app.appkey.toUpperCase() == appKey.toUpperCase()) {
          loginFlag = app.loginFlag;
        }
      }
    }
    if (loginFlag) {
      loginFlag = loginFlag;
    }
    else {
      loginFlag = "";
    }
    entityCodeStr = entityCodeStr ? entityCodeStr : "";
    //alert('url : '+loc_address);
    let url = 'login?userId=' + (this.loginCredentials.user_code).trim() + '&password=' + encodeURIComponent(this.loginCredentials.password) +
      '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
      + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
      + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
      + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
      + "&location=" + encodeURIComponent(JSON.stringify(loc_address));
    //console.log("url in login....", url)
    if (this.online) {
      this.dataService.getData(url).then(data => {
        this.loginValid = data;
        let otpCodeLoc;
        if (this.OTPCode) {
          otpCodeLoc = this.OTPCode;
        }
        else {
          otpCodeLoc = "";
        }
        console.log("data....>>>>", data)
        if (this.loginValid.responseMsg === "User is authenticated") {

          if (this.loginValid.responseData.gps_mandatory_flag == 'Y' && (this.platform.is('ios') || this.platform.is('android'))) {
            this.globalObjects.checkGPSPermission().then(() => {
              this.validatePlatform();
            }, (err) => {
              this.globalObjects.presentAlert("You can not access app without location permission. Please allow location permission.");
            })
          } else {
            this.validatePlatform();
          }

          if (this.loginValid.responseData.massege) {
            this.globalObjects.presentAlert(this.loginValid.responseData.massege);
          }
          this.globalObjects.destroyLocalData("tempUser");
        }
        else {
          //this.globalObjects.displayCordovaToast(this.loginValid.responseMsg);
          this.globalObjects.destroyLocalData("tempUser");
          this.globalObjects.presentAlert(this.loginValid.responseMsg);
        }

        this.isProcessing = false;
      }, err => {
        console.log(err);
        this.globalObjects.destroyLocalData("tempUser");
        this.globalObjects.presentAlert(JSON.stringify(err));
        this.isProcessing = false;
        this.globalObjects.displayCordovaToast("");
      })
    } else {

      this.isProcessing = false;
      this.globalObjects.displayCordovaToast("Please Check Internet Connectivity..");
    }
  }

  validatePlatform() {
    if (this.platform.is('android')) {
      if (this.loginValid.responseData.android_access != 'N' || this.loginValid.responseData.android_access == 'Y') {
        this.login();
      }
      else {
        this.globalObjects.presentAlert("You do not have access rights for an android device.");
      }
    }
    else if (this.platform.is('ios')) {
      if (this.loginValid.responseData.ios_access != 'N' || this.loginValid.responseData.ios_access == 'Y') {
        this.login();
      }
      else {
        this.globalObjects.presentAlert("You do not have access rights for an ios device.");
      }
    } else {
      if (this.loginValid.responseData.web_access != 'N' || this.loginValid.responseData.web_access == 'Y') {
        this.login();
      }
      else {
        this.globalObjects.presentAlert("You do not have rights to access web app.");
      }
    }
  }

  login() {
    if (this.loginValid.responseStatus === "success") {
      this.globalObjects.setDataLocally('licExp', 1);
      this.loginValid.responseData.password = this.loginCredentials.password
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
      this.globalObjects.setDataLocally("userDetails", this.loginValid.responseData);

      this.globalObjects.setDataLocally("apptype", this.loginValid.responseData.module);

      this.dataService.userStatuses();
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
      this.dataService.userStatuses();
      let pcnt = this.loginValid.responseData.global_parameter_page_cnt ? this.loginValid.responseData.global_parameter_page_cnt : 0;

      if (parseInt(pcnt) > 0) {
        this.popoveruser().then(() => {
        });
      } else {
        this.globalObjects.setDataLocally("loginFlag", true);
        setTimeout(() => {
          this.getAppHeaderData().then(() => {
            this.navCtrl.navigateRoot('super');
          })
        }, 1000);
      }
    }
  }

  async popoveruser() {
    let popUp = await this.modalCtrl.create({
      component: UsersettingPage,
      componentProps: {
        userValueList: this.globalObjects.userValueListfromglobal,
        flag: false
      },
      backdropDismiss: false
    });
    popUp.present();

  }

  getParentAppkeyCollection(appkey) {
    return new Promise((resolve, reject) => {
      let reqData = {
        "parentAppkey": appkey
      }

      let url = "getParentAppkeyCollection";

      this.isProcessing = true;
      this.dataService.postDataLhsServer(url, reqData).then((data1: any) => {
        this.isProcessing = false;
        if (data1.responseStatus == "success") {
          if (data1.responseData) {
            let i = 1;
            for (let resData of data1.responseData) {
              var appData: any = {};
              appData.app_name = resData.app_name ? resData.app_name : "";
              appData.appkey = resData.appkey ? resData.appkey : "";
              appData.loginFlag = resData.loginFlag ? resData.loginFlag : "";

              appData.resData = resData;
              var appArr: any = this.globalObjects.getLocallData("appDataMain");
              if (appArr) {
                let isExsist = false;
                for (let app of appArr) {
                  if (app.appkey.toUpperCase() == resData.appkey) {
                    app = JSON.parse(JSON.stringify(appData));
                    isExsist = true;
                  }
                }
                if (!isExsist) {
                  appArr.push(appData);
                }
                this.globalObjects.setDataLocally("appDataMain", appArr);
              } else {
                appArr = [];
                appArr.push(appData);
                this.globalObjects.setDataLocally("appDataMain", appArr);
              }
              if (i == data1.responseData.length) {
                resolve("");
              }
              i++;
            }
          }
        } else {
          alert(data1.responseMsg)
        }

      }, (error) => {
        this.isProcessing = false;
        this.globalObjects.presentAlert(error);
        reject();
      })
    })

  }

  getAppHeaderData() {
    return new Promise((resolve, reject) => {

      let url = 'getAppHeader';
      let resolveStatus = false;
      let userDetails = this.globalObjects.getLocallData("userDetails");
      let reqData = {
        "wslp": userDetails
      }
      this.dataService.postData(url, reqData).then((res: any) => {
        if (res.responseStatus == 'success') {
          if (res.responseMsg && res.responseMsg.indexOf('#') > -1) {
            let resArr = res.responseMsg.split('#')
            if (resArr[0] == "Q") {
              this.globalObjects.presentAlert(resArr[1]);
            } else if (resArr[0] == "F") {
              this.globalObjects.presentAlert(res.responseMsg);
            }
          }
          let app_disp_header = res.responseData.app_disp_header ? res.responseData.app_disp_header : "";
          userDetails.app_disp_header = app_disp_header;
          this.globalObjects.setDataLocally("userDetails", userDetails);
        }
        if (!resolveStatus) {
          resolveStatus = true;
          resolve("");
        }
      }, (err) => {
        if (!resolveStatus) {
          resolveStatus = true;
          resolve("");
        }
      })

      setTimeout(() => {
        if (!resolveStatus) {
          resolveStatus = true;
          resolve("");
        }
      }, 5000)
    })
  }
}
