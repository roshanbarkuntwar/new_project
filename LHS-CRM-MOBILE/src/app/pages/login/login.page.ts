import { Component, Directive, HostListener, OnInit } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MenuController, NavController, AlertController, Events, Platform, ModalController } from '@ionic/angular';
import { BackgroundService } from 'src/app/services/background.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { UsersettingPage } from '../usersetting/usersetting.page';
import { OverlayEventDetail } from '@ionic/core';
import { UserauthenticationService } from 'src/app/services/userauthentication.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
// import {GooglePlus} from '@ionic-native/google-plus/ngx';
// import { AngularFireModule } from '@angular/fire';
// import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
// import * as firebase from 'firebase/app';

declare var SMSReceive: any;

@Directive({
  selector: "[focusDir]"
})
export class FocusDirectiveLogin {
  constructor() { }

  @HostListener("keyup.enter") onKeyupEnter() {
    var nextEl = this.findNextTabStop(document.activeElement);
    nextEl.focus();
    // or try for ionic 4:
    // nextEl.setFocus();
  }

  findNextTabStop(el) {
    var universe = document.querySelectorAll(
      "input,select,textarea"
    );
    var list = Array.prototype.filter.call(universe, function (item) {
      return item.tabIndex >= "0";
    });
    var index = list.indexOf(el);
    return list[index + 1] || list[0];
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginCredentials: any = {};
  // s_url: string;
  flagForDisableLoginButton = 0;
  public loginValid: any = {};
  online: boolean = true;
  isProcessing: boolean = false;
  public shouldHeight: any
  logoentity: any;
  upd_flag: any;
  OTPCode: any;
  userprofile: any = null;
  userDetails: any;
  appDataArr = [];
  constructor(private navCtrl: NavController, public globalObjects: GlobalObjectsService, private events: Events,
    private alertCtrl: AlertController, public dataService: DataService, private router: Router,
    private iab: InAppBrowser,
    private modalCtrl: ModalController, public userAuth: UserauthenticationService,
    public menuCtrl: MenuController, public platform: Platform, private backgroundService: BackgroundService) {

    this.shouldHeight = document.body.clientHeight + 'px';

  }


  ionViewWillEnter() {
    this.loginCredentials = {};
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.menuCtrl.enable(false)
    this.checkForgetPasswordConf();
  }

  doLogin() {

    this.isProcessing = true;
    let deviceValidation = this.globalObjects.getLocallData("device_validation");
    let token = this.globalObjects.getLocallData("device_token");
    let appKey = "";
    if (this.globalObjects.simpleLoginProcess) {
      appKey = this.globalObjects.getLocallData("appKey");
    } else {
      appKey = this.globalObjects.getLocallData("parentAppkey");
    }

    this.appDataArr = this.globalObjects.getLocallData("appData");
    if (this.appDataArr) {
      this.globalObjects.destroyLocalData("appData")
    }
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


    var loginFlag: any = "";
    let entityCodeStr = "";
    let url = "";
    if (this.globalObjects.simpleLoginProcess) {
      url = 'login?userId=' + (this.loginCredentials.user_code).trim() + '&password=' + encodeURIComponent(this.loginCredentials.password) +
        '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
        + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
        + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
        + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
        + "&location=" + encodeURIComponent(JSON.stringify(loc_address));
    } else {
      url = 'validateUser?userId=' + (this.loginCredentials.user_code).trim() + '&password=' + encodeURIComponent(this.loginCredentials.password) +
        '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
        + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
        + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
        + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
        + "&location=" + encodeURIComponent(JSON.stringify(loc_address));
    }

    if (this.online) {
      this.dataService.getData(url).then((data: any) => {
        this.loginValid = data;

        if (this.globalObjects.simpleLoginProcess) {
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

          }
          else {
            this.flagForDisableLoginButton = 0;
            let resArr = this.loginValid.responseMsg.split('#')
            if (resArr[0] == "Q") {
              this.globalObjects.presentAlert(resArr[1]);
            }
          }
        }
        else if (data.responseStatus == 'success') {

          this.flagForDisableLoginButton = 0;
          let resArr = data.responseMsg.split('#')
          if (resArr[0] == "Q") {
            this.globalObjects.presentAlert(resArr[1]);
          }
          else {
            let user = {
              user_code: (this.loginCredentials.user_code).trim(),
              password: this.loginCredentials.password
            }
            this.globalObjects.setDataLocally("tempUser", user);
            this.getAppkeyCollection();
          }


        } else {
          this.flagForDisableLoginButton = 0;
          let resArr = data.responseMsg.split('#')
          if (resArr[0] == "Q") {
            this.globalObjects.presentAlert(resArr[1]);
          } else {
            this.globalObjects.presentAlert(data.responseMsg);
          }
        }
        this.isProcessing = false;
      }, err => {
        console.log(err);
        this.globalObjects.presentAlert("Server error, URl not found....");
        this.isProcessing = false;
      })
    } else {
      this.isProcessing = false;
      this.globalObjects.displayCordovaToast("Please Check Internet Connectivity..");
    }
  }

  getAppkeyCollection() {
    this.isProcessing = true;
    let platform;
    if (this.platform.is('ios')) {
      platform = "ios";

    } else if (this.platform.is('android')) {
      platform = "android";
    } else {
      platform = "browser"
    }
    let url = "getAppkeyCollection?userCode=" + (this.loginCredentials.user_code).trim();
    this.dataService.getData(encodeURI(url)).then((data: any) => {
      if (data.responseStatus == "success") {
        let appKeyColl = data.responseData;
        let appDataMain = this.globalObjects.getLocallData("appDataMain")
        let appData = [];
        let i = 1;
        for (let appkey of appKeyColl) {
          for (let data of appDataMain) {
            if (data.appkey.toLowerCase() == appkey.toLowerCase()) {
              appData.push(data);
            }
          }
          if (i == appKeyColl.length) {
            this.globalObjects.setDataLocally("appData", appData);
            if (appData.length <= 0) {
              this.globalObjects.destroyLocalData("tempUser");
              alert("Parent appkey not configured for " + this.loginCredentials.user_code)
            }
            else if (appData.length == 1) {
              for (let appkey of appKeyColl) {
                if (appData[0].appkey.toLowerCase() == appkey.toLowerCase()) {
                  this.userAuth.selectAppkey(appData[0]);
                }
              }
            }
            else {
              this.router.navigate(['appkey-collection']);
            }
          }
          i++;
        }
        //  console.log(appKeyColl)
      } else {
        this.globalObjects.presentAlert(data.responseMsg);
      }
    }, (error) => {
      this.isProcessing = false
    });
  }

  validatePlatform(loginFlag) {
    this.userAuth.loginValid = this.loginValid;
    this.userAuth.loginCredentials = this.loginCredentials;
    if (this.platform.is('android')) {
      if (this.loginValid.responseData.android_access != 'N' || this.loginValid.responseData.android_access == 'Y') {
        if (loginFlag == 'Y') {
          this.validateOTP("");

        } else if (loginFlag == 'M') {
          this.validateMobile();
        } else {
          this.userAuth.login();
        }
      }
      else {
        this.globalObjects.presentAlert("You do not have access rights for an android device.");
      }
    }
    else if (this.platform.is('ios')) {
      if (this.loginValid.responseData.ios_access != 'N' || this.loginValid.responseData.ios_access == 'Y') {
        if (loginFlag == 'Y') {
          this.validateOTP("");

        } else if (loginFlag == 'M') {
          this.validateMobile();
        } else {
          this.userAuth.login();
        }
      }
      else {
        this.globalObjects.presentAlert("You do not have access rights for an ios device.");
      }
    } else {
      if (this.loginValid.responseData.web_access != 'N' || this.loginValid.responseData.web_access == 'Y') {
        if (loginFlag == 'Y') {
          this.validateOTP("");

        } else if (loginFlag == 'M') {
          this.validateMobile();
        } else {
          this.userAuth.login();
        }
      }
      else {
        this.globalObjects.presentAlert("You do not have rights to access web app.");
      }
    }
  }

  changeSetting() {
    this.router.navigate(['appkey-validation']);
  }

  inputType = 'password';
  iconName = 'eye-off';

  hideShowPassword() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
    this.iconName = this.iconName === 'eye-off' ? 'eye' : 'eye-off';
  }

  proceed(event){
    if(this.loginCredentials.user_code && this.loginCredentials.password){
      if(event.keyCode == 13){
        this.doLogin();
      }
    }
  }

  forgotPassword() {
    let url = "validateForgotPassword"
    this.dataService.getData(url).then(async (data:any)=>{
      if(data.status == 'success'){
        if(data.message.indexOf('Q') <= -1) {
          this.router.navigate(['forgot-password']);
        } else{
          alert(data.message.split('#')[1]);
        }
      }else{
        alert(data.message.split('#')[1]);
      }
    })
  }

  async validateOTP(otpCode) {
    let alert = await this.alertCtrl.create({
      header: 'OTP Verification',
      message: 'We have sent you an OTP(one time password), please check and enter OTP)',
      inputs: [
        {
          name: 'user_otp',
          placeholder: 'Enter OTP ',
          value: otpCode
        }
      ],
      buttons: [
        {
          text: 'Resend OTP',
          handler: data => {
            this.userAuth.login();
          }
        },
        {
          text: 'OK',
          handler: data => {
            console.log("dataotp....", data);
            if (data.user_otp == this.loginValid.responseData.otp.otp
            ) {
              this.userAuth.login();
            } else {
              this.globalObjects.displayCordovaToast("Please enter valid OTP");
              return false;
            }
          }
        },
      ]
    });
    await alert.present();

  }
  async validateMobile() {
    let alert = await this.alertCtrl.create({
      header: 'Mobile No Verification',
      message: 'Enter your mobile no for verification',
      inputs: [
        {
          name: 'user_no',
          placeholder: 'Enter Mobile No'
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: data => {

            if (this.loginValid.mobileNo != null && this.loginValid.mobileNo.indexOf(",")) {
              var mobarr = [];
              let countMob: number = 0;
              mobarr = this.loginValid.mobileNo.split(",");
              for (var i = 0; i < mobarr.length; i++) {
                if (mobarr[i] == data.user_no) {
                  countMob = 0;
                  this.userAuth.login();
                  break;
                } else {
                  countMob++;
                }

              }
              if (countMob > 0) {
                this.globalObjects.displayCordovaToast("Please enter valid Number");
              }

            } else {
              if (this.loginValid.mobileNo == data.user_no) {
                this.userAuth.login();
              } else {
                this.globalObjects.displayCordovaToast("Please enter valid Number");
                return false;
              }
            }
          }
        },
      ]
    });
    await alert.present();

    //  let results=await alert.onDidDismiss(data => {
    //   this.flagForDisableLoginButton = 0;
    // })

  }



  // login() {
  //   if (this.loginValid.responseStatus === "success") {
  //     this.globalObjects.setDataLocally('licExp', 1);

  //     this.loginValid.responseData.password = this.loginCredentials.password

  //     this.loginValid.responseData.appkey = this.globalObjects.getLocallData("appKey");
  //     if (this.platform.is('ios')) {
  //       this.loginValid.responseData.platform = 'ios';
  //     }
  //     else if (this.platform.is('android')) {
  //       this.loginValid.responseData.platform = 'android';
  //     } else {
  //       this.loginValid.responseData.platform = 'browser';
  //     }
  //     this.loginValid.responseData.login_device_id = this.globalObjects.device.uuid;
  //     this.loginValid.responseData.login_device_model = this.globalObjects.device.model;
  //     this.loginValid.responseData.first_login_time = new Date().getTime();
  //     this.globalObjects.setDataLocally("userDetails", this.loginValid.responseData);


  //     this.globalObjects.setDataLocally("apptype", this.loginValid.responseData.module);

  //     this.dataService.userStatuses();
  //     var appData: any = {};
  //     appData.app_name = this.loginValid.responseData.app_name ? this.loginValid.responseData.app_name : "";
  //     appData.appkey = this.loginValid.responseData.appkey ? this.loginValid.responseData.appkey : "";
  //     appData.loginFlag = this.loginValid.responseData.loginFlag ? this.loginValid.responseData.loginFlag : "";

  //     appData.resData = this.loginValid.responseData;
  //     var appArr: any = this.globalObjects.getLocallData("appData");
  //     if (appArr) {
  //       let isExsist = false;
  //       for (let app of appArr) {
  //         if (app.appkey.toUpperCase() == this.loginValid.responseData.appkey) {
  //           app = JSON.parse(JSON.stringify(appData));
  //           isExsist = true;
  //         }
  //       }
  //       if (!isExsist) {
  //         appArr.push(appData);
  //       }
  //       this.globalObjects.setDataLocally("appData", appArr);
  //     } else {
  //       appArr = [];
  //       for(let app of this.appDataArr){
  //         if(this.loginValid.responseData.appkey.toLowerCase() ==  app.appkey.toLowerCase()){
  //           appData.resData.icon_img = app.resData.icon_img;
  //           appArr.push(appData);
  //         }
  //       }
  //       this.globalObjects.setDataLocally("appData", appArr);
  //     }

  //    this.events.publish("GET_SIDE_MENU_DATA", "LHS");
  //    this.dataService.userStatuses();
  //     let pcnt = this.loginValid.responseData.global_parameter_page_cnt ? this.loginValid.responseData.global_parameter_page_cnt : 0;

  //     if(parseInt(pcnt)>0){
  //       this.popoveruser().then(() => { 
  //       });
  //     }else{
  //       setTimeout(() => {
  //         this.userAuth.getAppHeaderData().then(()=>{
  //           this.navCtrl.navigateRoot('super');
  //         })
  //       }, 1000);
  //     }

  //   }
  // }
  onImgError(event) {
    event.target.src = './assets/imgs/no_image.png'
  }
  start() {
    return new Promise((resolve, reject) => {
      SMSReceive.startWatch(
        () => {
          document.addEventListener('onSMSArrive', (e: any) => {
            var IncomingSMS = e.data;
            // this.processSMS(IncomingSMS);
            const message = IncomingSMS.body;
            // alert(message);
            if (message && message.indexOf('LHSapp') != -1) {
              this.OTPCode = IncomingSMS.body.slice(0, 6);
              resolve(this.OTPCode)
              // this.stop();
            }
          });
        },
        () => { console.log('watch start failed') }
      )
    })
  }

  stop() {
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
  }

  processSMS(data) {
    const message = data.body;
    if (message && message.indexOf('LHSapp') != -1) {
      this.OTPCode = data.body.slice(0, 6);
      this.stop();
    }
  }

  // async popoveruser() {
  //   let popUp = await this.modalCtrl.create({
  //     component: UsersettingPage,
  //     componentProps: {
  //       userValueList: this.globalObjects.userValueListfromglobal,
  //       flag: false
  //     },
  //     backdropDismiss: true
  //   });
  //   popUp.present();
  //   popUp.onDidDismiss().then((details: OverlayEventDetail) => {
  //     console.log("page");
  //   })

  // }

  openWebapp() {
    let link = this.globalObjects.getLocallData("webapplink");
    if (link) {
      window.open(link, '_system', 'location=yes');
    } else {
      this.globalObjects.presentAlert("Webapp link not found...")
    }
  }

  checkForgetPasswordConf(){
    
  }


  
  open(){
    this.iab.create('http://192.168.100.23:8282/lhsOpo/register/UC_161' ).show();

    
  }

  onShow() {
    
    // this.platform.ready().then(() => {

    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'no'
  };
    this.iab.create('http://122.185.123.106:8888/A1Cust/register', '_self', options);

// });


  // this.iab.create('https://google.com/').show();
    // this.iab.create('https://www.youtube.com/');
  }

}