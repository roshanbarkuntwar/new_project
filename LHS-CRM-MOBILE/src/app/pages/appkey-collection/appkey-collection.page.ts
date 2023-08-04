import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Router } from '@angular/router';
import { MenuController, AlertController, ModalController, Platform, Events, NavController } from '@ionic/angular';
import { UsersettingPage } from '../usersetting/usersetting.page';
import { BackgroundService } from 'src/app/services/background.service';
import { DataService } from 'src/app/services/data.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserauthenticationService } from 'src/app/services/userauthentication.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';

@Component({
  selector: 'app-appkey-collection',
  templateUrl: './appkey-collection.page.html',
  styleUrls: ['./appkey-collection.page.scss'],
})
export class AppkeyCollectionPage implements OnInit {
  appData: any = [];
  isProcessing: boolean = false;
  loginCredentials: any;
  online: boolean = true;
  public loginValid: any = {};
  OTPCode: any;
  constructor(private navCtrl: NavController, public globalObjects: GlobalObjectsService, private modalCtrl: ModalController, public platform: Platform, private backgroundService: BackgroundService,
    public alertController: AlertController, private router: Router, public menuCtrl: MenuController, private location: Location, public dataService: DataService,
    private events: Events, public userAuth:UserauthenticationService, private sqlServ: SqlLiteService) {
  }

  ngOnInit() {
    //this.menuCtrl.enable(false);
    this.appData = this.globalObjects.getLocallData('appData');
    console.log("appdata ..>>", this.appData)
  }

  ngOnDestroy() {
    //this.menuCtrl.enable(true); nitesh
  }
  ionViewWillEnter() {
    this.ngOnInit();
  }


  addApp() {
    // this.navCtrl.push("AppkeyValidationPage");
    this.router.navigate(['appkey-validation']);
  }

  goBack() {
    this.location.back();
  }
  async removeApp(i) {
    const alert = await this.alertController.create({
      header: 'Are you sure want to remove this App!',
      message: 'Remove App ?',

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            alert.dismiss(false);
          }
        }, {
          text: 'Yes',
          handler: (data) => {
            this.appData.splice(i, 1);
            this.globalObjects.setDataLocally('appData', this.appData);
            this.appData = this.globalObjects.getLocallData('appData')
          }
        }
      ]
    });
    await alert.present();
  }



  selectAppkey(app) {
    let userDetails = this.globalObjects.getLocallData("userDetails");
    if(userDetails){
      let user = {
        user_code : userDetails.user_code,
        password : userDetails.password
      }
      this.globalObjects.setDataLocally("tempUser",user);
    }
    this.sqlServ.deleteAllObject();
    this.userAuth.selectAppkey(app);

  
    // if (app && !this.isProcessing) {
    //   this.isProcessing = true;
    //   this.globalObjects.setDataLocally("appKey", app.appkey);
    //   this.globalObjects.setDataLocally("appCode", app.resData.appcode);
    //   if(app.resData.tenantId){
    //     this.globalObjects.setDataLocally("tenantId", app.resData.tenantId);
    //   }else{
    //     this.globalObjects.setDataLocally("tenantId", app.resData.dbName);
    //   }
    //   if (app.resData.default_theme) {
    //     this.globalObjects.appTheme = app.resData.default_theme;
    //     this.globalObjects.setDataLocally("theme", app.resData.default_theme);
    //   }

    //   var server_url = "http://" + app.resData.serverUrl + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
    //   var server_url2 = "http://" + app.resData.server_url2 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
    //   var server_url3 = "http://" + app.resData.server_url3 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
    //   var server_url4 = "http://" + app.resData.server_url4 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
    //   this.globalObjects.setDataLocally("isAppLaunch", true);
    //   this.globalObjects.setDataLocally("scopeUrl", server_url);
    //   this.globalObjects.setDataLocally("server_url1", server_url);
    //   this.globalObjects.setDataLocally("server_url2", server_url2);
    //   this.globalObjects.setDataLocally("server_url3", server_url3);
    //   this.globalObjects.setDataLocally("server_url4", server_url4);
    //   this.globalObjects.setDataLocally("dbName", app.resData.dbName);
    //   this.globalObjects.setDataLocally("webapplink", app.resData.webapplink);
    //   this.globalObjects.setScopeUrl(server_url);
    //   this.globalObjects.setDataLocally("entity_code_str_appkey", app.resData.entity_code_str);
    //   this.globalObjects.setDataLocally("entity_code_appkey", app.resData.entity);


    //   this.globalObjects.checkAndSetScopeUrl().then(data => {
    //     this.userAuth.doLogin();
    //     // this.router.navigate(['super']);
    //   }, err => {
    //     this.isProcessing = false;
    //   })

    //   this.globalObjects.setDataLocally("device_validation", app.resData.device_validation);
    // }
  }

  // Logic for login after appkey selection


  doLogin() {
    this.loginCredentials = this.globalObjects.getLocallData("tempUser");
    if (this.loginCredentials) {
      // var s_url: any = this.globalObjects.getScopeUrl();
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
      let latitude: any = this.globalObjects.latitude;
      let longitude: any = this.globalObjects.longitude;
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
      this.isProcessing = true;
      if (this.online) {
        this.dataService.getData(url).then(data => {

          console.log("from login ....", data)
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
                this.validatePlatform(loginFlag);
              }, (err) => {
                this.globalObjects.presentAlert("You can not access app without location permission. Please allow location permission.");
              })
            } else {
              this.validatePlatform(loginFlag);
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
          this.globalObjects.destroyLocalData("tempUser");
          console.log(err);
          this.globalObjects.presentAlert(JSON.stringify(err));
          this.isProcessing = false;
          this.globalObjects.displayCordovaToast("");
        })
      } else {

        this.isProcessing = false;
        this.globalObjects.displayCordovaToast("Please Check Internet Connectivity..");
      }
    } else {
      this.router.navigate(['login']);
    }

  }

  getAppkeyCollection() {
    let platform;
    if (this.platform.is('ios')) {
      platform = "ios";

    } else if (this.platform.is('android')) {
      platform = "android";
    } else {
      platform = "browser"
    }
    let url = "getAppkeyCollection?userCode=" + this.loginCredentials.user_code;
    this.dataService.getData(url).then((data: any) => {
      if (data.responseStatus == "success") {
        let appKeyColl = data.responseData;
        let url1 = "getListOfServerDetails"
        let reqData = {
          "parameters": {
            "appKey": appKeyColl,
            "device_id": this.globalObjects.device.uuid,
            "device_name": this.globalObjects.device.model,
            "platform": platform
          }
        }
        this.dataService.postDataLhsServer(url1, reqData).then((data1: any) => {
          if (data1.responseStatus == "success") {
            for (let resData of data1.responseData) {


              var appData: any = {};
              appData.app_name = resData.responseData.app_name;
              appData.appkey = resData.responseData.appkey;
              appData.loginFlag = resData.responseData.loginFlag;

              // alert(appkey.toUpperCase());
              appData.resData = resData.responseData;
              var appArr: any = this.globalObjects.getLocallData("appData");
              if (appArr) {
                let isExsist = false;
                for (let app of appArr) {
                  if (app.appkey.toUpperCase() == resData.responseData.appkey) {
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
            }
            this.router.navigate(['appkey-collection']);
          }
        })
      } else {
        this.globalObjects.presentAlert(data.responseMsg);
      }
    })
  }

  validatePlatform(loginFlag) {
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



  changeSetting() {
    this.router.navigate(['ChangeServerSettingPage']);
  }
  // ionViewDidLoad() {
  //   this.menuCtrl.swipeEnable(false);

  //   this.events.subscribe('url:created', (url) => {
  //     s_url = url;
  //   });
  // }

  updateApp() {
    this.globalObjects.presentAlert('Updating App');
  }

  inputType = 'password';
  iconName = 'eye-off';

  hideShowPassword() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
    this.iconName = this.iconName === 'eye-off' ? 'eye' : 'eye-off';
  }
  forgotPassword() {
    // this.navCtrl.navigateRoot('forgot-password');
    this.router.navigate(['forgot-password']);
  }





  login() {
    if (this.loginValid.responseStatus === "success") {
      this.globalObjects.setDataLocally('licExp', 1);
      // let div_code = "";
      // if (this.loginValid.responseData.div_code_str) {
      //   if (this.loginValid.responseData.div_code_str.indexOf(" ") > -1) {
      //     this.loginValid.responseData.div_code = this.loginValid.responseData.div_code_str.split(" ")[0];
      //   }
      //   else if (this.loginValid.responseData.div_code_str.indexOf(",") > -1) {
      //     this.loginValid.responseData.div_code = this.loginValid.responseData.div_code_str.split(",")[0];
      //   }
      //   else if (this.loginValid.responseData.div_code_str.indexOf("#") > -1) {
      //     this.loginValid.responseData.div_code = this.loginValid.responseData.div_code_str.split("#")[0];
      //   } else {
      //     this.loginValid.responseData.div_code = this.loginValid.responseData.div_code_str;
      //   }
      // }
      this.loginValid.responseData.password = this.loginCredentials.password

      // if (this.loginValid.responseData.entity_code_str) {
      //   if (this.loginValid.responseData.entity_code_str.indexOf("#") > -1) {
      //     this.loginValid.responseData.entity_code = this.loginValid.responseData.entity_code_str.split("#")[0];
      //   } else if (this.loginValid.responseData.entity_code_str.indexOf(",") > -1) {
      //     this.loginValid.responseData.entity_code = this.loginValid.responseData.entity_code_str.split(",")[0];
      //   } else if (this.loginValid.responseData.entity_code_str.indexOf(" ") > -1) {
      //     this.loginValid.responseData.entity_code = this.loginValid.responseData.entity_code_str.split(" ")[0];
      //   }
      // }

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

      // this.events.publish("entity_name", this.loginValid.responseData.entity_name);
      // this.events.publish("entity_code_str", this.loginValid.responseData.entity_code_str);

      this.globalObjects.setDataLocally("apptype", this.loginValid.responseData.module);
      // this.globalObjects.setScopeUrl(s_url);
      // this.router.navigate(['super']);

      this.events.publish("GET_SIDE_MENU_DATA", "LHS");
      this.dataService.userStatuses();
      let pcnt = this.loginValid.responseData.global_parameter_page_cnt ? this.loginValid.responseData.global_parameter_page_cnt : 0;
     
      if(parseInt(pcnt)>0){
         
          this.popoveruser().then(() => { 
            
          });
      }else{
       
        this.navCtrl.navigateRoot('super');
      
      }
      // this.popoveruser().then(() => {
      //   this.navCtrl.navigateRoot('super');
      // });
      //this.getAppkeyCollection();
      // const numbers = interval(500);
      // const takeFourNumbers = numbers.pipe(take(2));
      // takeFourNumbers.subscribe(x => {
        // if (x == 1) {
        //   this.events.publish("getsidmenulist", "LHS");
        // }
      // });
    }
  }

  async popoveruser() {
    // this.router.navigate(["/usersetting",{userValueList: this.globalObjects.userValueListfromglobal}], );
    let popUp = await this.modalCtrl.create({
      component: UsersettingPage,
      componentProps: {
        userValueList: this.globalObjects.userValueListfromglobal
      },
      backdropDismiss: true
    });
    popUp.present();
   
  }


}
