import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController, Platform, AlertController, ModalController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { DatePipe } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoderResult, NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
// import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { File } from '@ionic-native/file/ngx';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Network } from '@ionic-native/network/ngx';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { of } from 'rxjs';
import { saveAs } from 'file-saver';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { error } from 'protractor';
import { SqlLiteService } from './sql-lite.service';
import { Console } from 'console';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { trackByHourSegment } from 'angular-calendar/modules/common/util';
import { environment } from 'src/environments/environment';
import { Events } from 'src/app/demo-utils/event/events';

// import { DeveloperModeLogPage } from '../pages/developer-mode-log/developer-mode-log.page';

var CryptoJS = require("crypto-js");

declare var google: any;
@Injectable({
  providedIn: 'root'
})
export class GlobalObjectsService {
  sendSMSurl = "https://fcm.googleapis.com/fcm/send";
  url: any;
  urlArr: any[];
  urlArrCount: any = 0;
  networkStatus: boolean = true;
  applogo = "";
  // networkStatus: boolean = false;
  loading: HTMLIonLoadingElement;
  latitude1: any;
  longitude1: any;
  framePopup: boolean = true;
  savingToOracle: boolean = false;
  savingToCloud: boolean = false;
  addressgenerate: any = "";
  usercodefromlogin: any;
  platformVal: string;
  mydatavariable: any = [];
  tp_cnt: number = 0;

  appWorkingPara: any;

  current_page_parameter: any = {};
  loaderToShow: any;
  isLoading: boolean;
  public samePageNo;
  public appTheme: any = "theme-maroon";
  public previousCallObj: any = "";
  public fontSize: number = 1;
  public dependFilterData = [];
  public uniqueKey = "";
  public fontype = "";
  public refreshObjects: any = [];

  isRecording: boolean = false;
  speechdata: string;
  countfortextband3d: number;
  countforsummarycard: number = 0;
  colorcount: number = 0;
  barcodeinputdata: any;
  clickedbutton: boolean = false;
  toggleNotification: boolean = false;
  toggleFab: boolean = true;



  fabMannualMode: boolean = false;
  notiBellMannualMode: boolean = false;
  public appPageName: any;
  public newaddress: any;
  public android_version_numeric = 23;
  public ios_version_numeric;
  public getLocalDBData: boolean = true;
  letterObj = {
    to: 'MCPLLOCP',
    from: 'Lighthouse India Pvt.Ltd',
    text: ''
  }
  pdfObj = null;
  arr: any = [];
  public frameSeqId: any;
  public cartSummaryPlain: any = [];

  public plastoFrameSumm: any = [];
  public summaryCartdeatail: any = [];
  public summaryheadings: any = [];
  public frameDetail: any = [];
  dbName: any;
  appKey: any;
  bojectBypass: boolean = false; //For object bypass project
  // presentImages:{
  public callingPara: any = [];
  public presentImages: any = ['example1', 'example2', 'example3'];
  location_name: NativeGeocoderResult;
  batterySubscription: any;
  lvl: number;
  userDetails: any;
  public toggleDevloperMode: boolean = false;
  public toggleDevloperModePro: boolean = false;
  recordsFound: any;
  recordsFoundText: string;
  listTyle: string;
  toggleSound: boolean = false;
  toggleVibrate: boolean = false;
  toggleScreenshot: boolean = false;
  toggleDrag: boolean = false;
  wmaBuilderFlag: any;
  audio: any = {
    id: 'assets/audio/click1.mp3',
    toggelSound: true,
    sound: 'assets/audio/click1.mp3',
    volume: 0.5
  };

  decryptFlag: boolean = false;
  wmaDecodeFlag;
  userValueListfromglobal: any = [];

  summaryPlainData: any = [];
  attachmentArr: any = [];
  sidemenuDate: any;
  simpleLoginProcess: boolean = true; //(true)=> for appkey login process && (false)=> jump to direct login page like ARS / jyoti 

  // parentAppkey = "SHAHERP";
  // parentAppkey = "ARS201";
  // parentAppkey = "RCPLORDER";
  // parentAppkey = "MAPLRSO";
  parentAppkey = "MPPLAM"
  // parentAppkey = "MAPLPDA";
  // parentAppkey = "LHS4.0CRM";
  // parentAppkey = "VICCOCRMSR";
  // parentAppkey = "MAPLPROD";
  // parentAppkey = "OZELLCRMSE";
  // parentAppkey = "MSAGCRMSE";
  // parentAppkey = "RCPLSR";
  // parentAppkey = "MSAGCRMSE";
  // parentAppkey = "KEPROCRMSE";

  public refreshObj: any = [];
  public devItemName = {};

  public newFormInstanceArr = [];
  public picture = "";
  devItemIcon: any;
  devItemEditFlag: boolean = true;
  public mobileFlag = false;
  public breadCrumpsArray: any = [];
  public popoverFlag = "M";
  public mouseEvent;
  isToBack: boolean = false;
  public autoClickItem = [];
  public object_mast: any = [];

  public lovObjData: any = [];

  public switchTableData = [];
  public switchSearchStr = "";
  public switchCardData = [];


  public lovType: any;

  public allFrameJsonData = [];

  public parameterObject: any;

  public globleRightClickOption: any = false;
  public backObjectCode: any;

  public callingParameter = [];
  public refreshId = 0;
  public clickedWsdp: any = {};

  constructor(public http: HttpClient, public loadingController: LoadingController, private barScanner: BarcodeScanner, private alertController: AlertController, public modalController: ModalController
    , private photoViewer: PhotoViewer, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, private toastCtrl: ToastController, public device: Device, private speechRecognition: SpeechRecognition, private plt: Platform, private file: File, private fileOpener: FileOpener, private filePath: FilePath, private filechooser: FileChooser, private androidPermissions: AndroidPermissions, private document: DocumentViewer,
    private events: Events, private socialSharing: SocialSharing, private network: Network, private batteryStatus: BatteryStatus,
    private platform: Platform, private nativeAudio: NativeAudio, private locationAccuracy: LocationAccuracy, private emailComposer: EmailComposer

  ) {
    // this.wmaDecodeFlag = localStorage.getItem("wma_decode");

    // if (this.wmaDecodeFlag) {
    //   this.decryptFlag = true;
    //   for (var key in localStorage) {
    //     this.getLocallData(key) 
    //   }
    //   this.appKey = this.getLocallData("appKey");
    // }
    // else {
    //   this.decryptFlag = false;
    //   for (var key in localStorage) {
    //     this.getLocallData(key)
    //   }
    //   this.appKey = this.getLocallData("appKey");
    // }
    this.ios_version_numeric = this.android_version_numeric;
    // this.checkBattery();
    this.appKey = this.getLocallData("appKey");

    this.speechRecognition.requestPermission()
      .then(() => {
        this.speechRecognition.hasPermission()
          .then((hasPermission: boolean) => {
            // alert(hasPermission);
            // private sms: SMS,
            if (!hasPermission) {
              this.speechRecognition.requestPermission();
            }
          });
      })

    let theme = localStorage.getItem('theme');
    if (theme) {
      this.appTheme = theme;
    }
    if (this.platform.is('android') || this.platform.is('ios')) {
      //this.checkGPSPermission();
    } else {
      this.platformVal = 'browser';
      this.geoLocation();
    }
    // this.getDeviceUniqueId();


    let permission: boolean;
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.STORAGE).then(
      result => permission = result.hasPermission),
      (err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.STORAGE).then(
        result => permission = result.hasPermission)
      );

    if (!permission) {
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.STORAGE, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
    }


    this.url = this.getLocallData("scopeUrl");
    // if (this.getLocallData("server_url1")) {
    //   let d1 = new Date().getTime();
    //   this.checkAndSetScopeUrl().then(data => {
    //     console.log("total time=" + (new Date().getTime() - d1))
    //     this.url = this.getLocallData("scopeUrl");
    //   }, err => {
    //   })
    // }

    // this.checkAndSetScopeUrl().then(data => {
    //   this.url = this.getLocallData("scopeUrl");
    // }, err => { })



    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      // alert(hasPermission);
      if (!hasPermission) {
        this.speechRecognition.requestPermission();
      }
    });
    // Toggle Fab & Notification

    this.events.subscribe("checkToggle", () => {
      this.userDetails = this.getLocallData("userDetails")
      if (!this.fabMannualMode) {
        if (this.userDetails.fab_ball_default_flag == 'T') {
          this.toggleFab = true;
          this.events.publish("toggleFab", true);

        } else if (this.userDetails.fab_ball_default_flag == 'F') {
          this.toggleFab = false;
          this.events.publish("toggleFab", false);
        } else {
          this.toggleFab = true;
          this.events.publish("toggleFab", true);
        }
      }


      if (!this.notiBellMannualMode) {
        if ((this.userDetails.notification_bell_default_flag) && this.userDetails.notification_bell_default_flag == 'T') {
          this.toggleNotification = true;
          this.events.publish("toggleNotification", true);
        } else {
          this.toggleNotification = false;
          this.events.publish("toggleNotification", false);
        }
      }
    })




    this.events.subscribe("fabMannualMode", (res) => {
      this.fabMannualMode = res;
    })
    this.events.subscribe("notiBellMannualMode", (res) => {
      this.notiBellMannualMode = res;
    })
    this.events.subscribe("toggleFab", (res) => {
      this.toggleFab = res;
    })
    this.events.subscribe("toggleNotification", (res) => {
      this.toggleNotification = res;
    })


    // this.plt.ready().then(() => {
    //   if (this.plt.is('android') || this.plt.is('ios')) {
    //     this.callLog.hasReadPermission().then(hasPermission => {
    //       if (!hasPermission) {
    //         this.callLog.requestReadPermission().then(results => {
    //           this.getContacts();
    //         })
    //           .catch(e => this.callLog.requestReadPermission().then(results => {
    //             this.getContacts();
    //           }))
    //       } else {
    //         this.getContacts();
    //       }
    //     })
    //       .catch(e => this.callLog.requestReadPermission().then(results => {
    //         this.getContacts();
    //       }))

    //   }
    // });



  }

  setsidemenudetail() {
    let userDetails = this.getLocallData('userDetails');
    console.log(this.userValueListfromglobal);

    for (let y of this.userValueListfromglobal) {
      if (y.item_name in userDetails) {
        if ((y.item_name1 && y.item_name1 != "") || (y.valueforlov && y.valueforlov != "")) {

          if (y.item_name1 && y.item_name1 != "") {
            if (y.item_name1 && y.item_type == 'D' && this.platformVal == 'browser') {
              let val = JSON.parse(JSON.stringify(y.item_name1));
              userDetails[y.item_name] = val;
              let d = this.formatDate(y.item_name1, 'yyyy-MM-dd');
              y.item_name2 = { isRange: false, singleDate: { jsDate: new Date(d) } };
            } else {
              userDetails[y.item_name] = y.item_name1

            }
          } else if (y.valueforlov && y.valueforlov != "") {
            userDetails[y.item_name] = y.valueforlov
          }

        } else {
          userDetails[y.item_name] = "";
        }
      } else {
        if (y.result) {
          if (y.result.length == 1) {
            // this.userDetails[y.item_name]=y.result ? y.result[0].VALUE :"";
            userDetails[y.item_name] = y.result[0].CODE
          } else {
            userDetails[y.item_name] = "";
          }
        }
        else {
          userDetails[y.item_name] = "";
        }

      }
    }
    this.setDataLocally('userDetails', userDetails)
    console.log(this.userDetails)

  }

  getContactpermission() {

    // this.plt.ready().then(() => {
    //   if (this.plt.is('android') || this.plt.is('ios')) {
    //     this.callLog.hasReadPermission().then(hasPermission => {
    //       if (!hasPermission) {
    //         this.callLog.requestReadPermission().then(results => {
    //           this.getContacts();
    //         })
    //           .catch(e => this.callLog.requestReadPermission().then(results => {
    //             this.getContacts();
    //           }))
    //       } else {
    //         this.getContacts();
    //       }
    //     })
    //       .catch(e => this.callLog.requestReadPermission().then(results => {
    //         this.getContacts();
    //       }))

    //   }
    // });

  }
  checkGeofenceArea() {
    /*setInterval(() => {
      //this.showMap(this.lat, this.lng);
      this.geoLocation.getCurrentPosition().then((resp) => {
        this.checkLocation(resp.coords.latitude, resp.coords.longitude).then((result) => {
          if (result == 'T') {
            if (this.count1 == 0) {
              this.count1++;
              let token = this.getLocallData("device_token");
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              headers.append('Authorization', 'key=AAAAAFURuww:APA91bE5d6SNcZ195wtf58EOKJtj1m9_eqSWde0pGeQT4CN7U_s2nrMFng-QHRlSJnrJeZGlARhvClczmtO5Yq0-wk1ediylQY9FIHxJh4gstlm55BWXXnXedesxfbbGqNvgdefMo3FL');

              let options = new RequestOptions ({ headers: headers });
              let url = 'https://fcm.googleapis.com/fcm/send';
              console.log("Welcome to Lighthouse Infosystem Pvt. Ltd.");
              let body = {
                "notification":{
                  "title":"Welcome to Lighthouse Infosystem Pvt. Ltd.",
                  "body":"",
                  "sound":"default",
                  "click_action":"",
                },
                  "to": token,
                  "priority":"high",
                  "restricted_package_name":""
              }

              this.http.post(url, options).subscribe;
              this.count2 = 0;
            }
          }
          else {
            if (this.count2 == 0) {
              this.count2++;
              console.log("You are not in the area of Lighthouse Infosystem Pvt. Ltd.");
              this.count1 = 0;
            }
          }
        });
      })
    }, 5000);*/
  }

  checkLocation(lat, lng) {
    return new Promise((resolve, reject) => {
      //Lighthouse Infosystem Geofence Coordinates
      let fencingAreaCoordinates: any = [{ "lat": 21.120542, "lng": 79.046803 },
      { "lat": 21.120317, "lng": 79.046722 },
      { "lat": 21.120181, "lng": 79.047179 },
      { "lat": 21.120382, "lng": 79.047258 }];
      var result;
      try {
        var fencingArea = new google.maps.Polygon({ paths: fencingAreaCoordinates });
        setTimeout(function () {
          if (google) {
            result = google.maps.geometry.poly.containsLocation(new google.maps.LatLng(lat, lng), fencingArea) ? 'T' : 'F';
            resolve(result);
          }
          return result;
        }, 500);
      } catch (error) {
      }
    })
  }



  checkBattery() {
    if (this.plt.is('ios') || this.plt.is('android')) {
      // watch change in battery status
      this.batterySubscription = this.batteryStatus.onChange().subscribe(status => {
        console.log(status.level, status.isPlugged);
        this.lvl = status.level;
      });
    }
    return of(this.lvl);
  }
  showLoading() {
    // this.loadingController.create({
    //   message: 'Please wait..'
    // }).then((res) => {
    //   res.present();

    //   res.onDidDismiss().then((dis) => {
    //     console.log('Loading dismissed!');
    //   });
    // });
    // this.hideLoading();
    //   res.onDidDismiss().then((dis) => {
    //     console.log('Loading dismissed!');
    //   });
    // });
    // this.hideLoading();

    // this.isLoading = true;
    // return await this.loadingController.create({

    // }).then(a => {
    //   a.present().then(() => {
    //     console.log('presented');
    //     if (!this.isLoading) {
    //       a.dismiss().then(() => console.log('abort presenting'));
    //     }
    //   });
    // });
  }
  async hideLoading() {
    // setTimeout(() => {
    //   this.loadingController.dismiss();
    // }, 1000);
    // setTimeout(() => {
    //   this.loadingController.dismiss();
    // }, 1000);

    //   this.isLoading = false;
    //  return await  this.loadingController.dismiss().then(() => console.log('dismissed'));

  }

  async ShowLoadingNew() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
   
    await loading.present();
    await loading.onDidDismiss().then(() => {
      if(!loading.isConnected){
        this.hideLoadingNew()
      }
    })
  }

  async hideLoadingNew() {
    await this.loadingController.dismiss();
  }


  // setDataLocally(key, value) {
  //   let strdata = JSON.stringify(value);

  //   if (!this.decryptFlag) {
  //     var ciphertext = CryptoJS.AES.encrypt(strdata, 'wma@orcl').toString();
  //     strdata = ciphertext
  //   //  return localStorage.setItem(key, data);
  //   } 
  //     return localStorage.setItem(key, strdata);
  // }

  // getLocallData(key) {
  //   let data = localStorage.getItem(key);
  //   var decryptedData = data;

  //   if (data && data.indexOf('U2Fsd') > -1) {
  //     var bytes = CryptoJS.AES.decrypt(data, 'wma@orcl');
  //     decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  //     if (this.decryptFlag) {
  //       let data:any;
  //      /*  if(decryptedData.indexOf("\"") > -1){
  //         data = JSON.parse(decryptedData);
  //       } */
  //       data = JSON.parse(decryptedData);
  //       this.setDataLocally(key, data);
  //     }
  //   }else{
  //     if(!this.decryptFlag && key != 'loginDate'){
  //       let data:any;
  //       data = JSON.parse(decryptedData);
  //       this.setDataLocally(key, data);
  //     }
  //   }

  //   // return JSON.parse(localStorage.getItem(key))
  //   if(typeof(decryptedData) == "object" ){
  //     JSON.stringify(decryptedData);
  //   }
  //   return JSON.parse(decryptedData)
  // }
  setDataLocally(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  }


  getLocallData(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  destroyLocalData(key: string) {
    // this.pouchDBService.getObject("sessionColumn12").then((data) => {
    //   this.pouchDBService.deleteJSON(data).then(data => {
    //   }, err => { })
    // }, err => {
    // })
    return localStorage.removeItem(key);
  }


  async displayCordovaToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'bottom'
    });
    await toast.present();
  }

  async displayOfflineToast() {
    let toast = await this.toastCtrl.create({
      message: "Oops no internet connection!",
      duration: 5000,
      position: 'bottom'
    });
    await toast.present();
  }

  setScopeUrl(url) {
    this.url = (url);
  }
  getScopeUrl() {
    return this.url;
  }
  checkAndSetScopeUrl() {
    return new Promise((resolve, reject) => {
      this.urlArr = [];
      this.urlArr.push(this.getLocallData("server_url1"));
      this.urlArr.push(this.getLocallData("server_url2"));
      this.urlArr.push(this.getLocallData("server_url3"));
      this.urlArr.push(this.getLocallData("server_url4"));
      //console.log("ScopeUrl>>>>"+this.urlArr.length);
      // if(this.platform.is('android') || this.platformVal == 'browser'){
      //   let currentUrl = window.location.href;
      //   currentUrl = currentUrl.split("http://")[1].split("/")[0];
      //   console.log(currentUrl);
      //   let trySecurityCheck = false


      //   for(let uarr of this.urlArr){
      //     if(uarr.indexOf(currentUrl) > -1){
      //       trySecurityCheck = true;
      //     }
      //   }
      // }

      // if(trySecurityCheck || !environment.production || currentUrl == '203.193.167.118:8888' || this.platformVal != 'browser'){
      if (this.networkStatus) {
        this.check().then(data => {
          resolve("");
        }, err => {
          this.presentToastWithOptions((this.urlArr[0] ? this.urlArr[0].split('lhsws')[0] : "") + ", " + (this.urlArr[1] ? this.urlArr[1].split('lhsws')[0] : "") + ", " + (this.urlArr[2] ? this.urlArr[2].split('lhsws')[0] : "") + ", " + (this.urlArr[3] ? this.urlArr[3].split('lhsws')[0] : "") +
            "Registered client server is not Available...(Tip: 1) Please check your Internet Connection. 2) Check tomcat server is running, 3) Check port access on public ip. )", "errorClass");
          this.setDataLocally("appkeyTryCount", 1);
          reject();
        });
      } else {
        this.setDataLocally("appkeyTryCount", 1);
        this.displayOfflineToast();
        reject();
      }
      // }else{
      //   alert("You do not have rights to access app.")
      //   reject();
      // }



    })
  }

  check() {
    return new Promise((resolve, reject) => {
      let errorCount = 0;
      let status = true;
      this.http.get(this.urlArr[0] + 'checkServerStatus').subscribe(data => {
        if (status) {
          this.setDataLocally("scopeUrl", this.urlArr[0]);
          this.setScopeUrl(this.urlArr[0]);
          resolve("");
          status = false;
        }
      }, (err) => {
        errorCount++;
        if (errorCount == 4) {
          reject();
        }
      });
      this.http.get(this.urlArr[1] + 'checkServerStatus').subscribe(data => {
        if (status) {
          this.setDataLocally("scopeUrl", this.urlArr[1]);
          this.setScopeUrl(this.urlArr[1]);
          resolve("");
          status = false;
        }
      }, (err) => {
        errorCount++;
        if (errorCount == 4) {
          reject();
        }
      });
      this.http.get(this.urlArr[2] + 'checkServerStatus').subscribe(data => {
        if (status) {
          this.setDataLocally("scopeUrl", this.urlArr[2]);
          this.setScopeUrl(this.urlArr[2]);
          resolve("");
          status = false;
        }
      }, (err) => {
        errorCount++;
        if (errorCount == 4) {
          reject();
        }
      });
      this.http.get(this.urlArr[3] + 'checkServerStatus').subscribe(data => {
        if (status) {
          this.setDataLocally("scopeUrl", this.urlArr[3]);
          this.setScopeUrl(this.urlArr[3]);
          resolve("");
          status = false;
        }
      }, (err) => {
        errorCount++;
        if (errorCount == 4) {
          reject();
        }
      });
    });
  }

  /*check() {
    // this.checkAndSetScopeUrl();
    return new Promise((resolve, reject) => {
      var url1 = this.urlArr[this.urlArrCount];
      let req: any;
      if (url1) {
        let dbdetails = this.getLocallData("dbinitdetails");
        // req = this.http.get(url1 + 'checkServerStatus' + dbdetails).subscribe(data => {
        req = this.http.get(url1 + 'checkServerStatus').subscribe(data => {
          this.setDataLocally("scopeUrl", url1);
          this.setScopeUrl(url1);
          resolve("");
        }, (error) => {
          if (this.urlArrCount == 3) {
            this.urlArrCount = 0;
            reject();
          } else {
            this.urlArrCount++;
            this.check().then(data => {
              resolve("");
            }, err => {
              reject();
            });
          }
        })
      }

      setTimeout(() => {
        if (req) {
          if (!req.closed) {
            console.log("req unsubscribed");
            req.unsubscribe();
            //this.presentToastWithOptions("Server Connectivity Issue !", "errorClass")
            if (this.urlArrCount == 3) {
              this.urlArrCount = 0;
              reject();
            } else {
              this.urlArrCount++;
              this.check().then(data => {
                resolve("");
              }, err => {
                reject();
              });
            }
          }
        }
      }, 5000);
    })

  }*/

  checkUrl(url) {
    return new Promise((resolve, reject) => {
      let req = this.http.get(url + 'checkServerStatus').subscribe((data: any) => {
        resolve("success");
      }, (error) => {
        reject(error);
      })
    })
  }

  formatDate(date, format) {
    var datePipe = new DatePipe("en-US");
    var date1;
    try {
      date1 = new Date(date);
      // alert(date1);
      return datePipe.transform(date1, format);
    } catch (err) {
      date1 = new Date();
      return datePipe.transform(date1, format);
    }

  }

  async presentToast(message) {
    if (!message) {
      console.log('presentToast  : ' + message);
      let toast = await this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    }
  }

  async s2uToast(message, cssclass) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1000,
      animated: true,
      // showCloseButton: true,
      // closeButtonText: "OK",
      position: "middle",

      cssClass: cssclass
    });
    await toast.present();
  }

  async stopToast() {
    this.toastCtrl.dismiss();
  }

  async presentToastWithOptions(message, cssclass) {
    this.presentAlert(message);
    // const toast = await this.toastCtrl.create({
    //   // header: 'Toast header',
    //   message: message,
    //   position: 'middle',
    //   cssClass: 'errorAlert',
    //   buttons: [
    //     // {
    //     //   // side: 'start',
    //     //   // icon: 'hammer',
    //     //   // text: 'ERROR',
    //     //   handler: () => {
    //     //     console.log('Favorite clicked');
    //     //   }
    //     // }, 
    //     {
    //       // text: 'Close',
    //       icon: 'close-circle',
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     }
    //   ]
    // });
    // toast.present();
  }

  geoLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude1 = resp.coords.latitude;
      this.longitude1 = resp.coords.longitude;
      var altitude = resp.coords.altitude;
      var timestamp = new Date(resp.timestamp);

      // alert(latitude + '\n' + longitude + '\n' + timestamp)

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  geoCoderLocation(lat, lon) {
    // alert('latlong==>' + lat + ',' + lon)
    return new Promise((resolve, reject) => {
      this.latitude1 = lat;
      this.longitude1 = lon;

      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      this.nativeGeocoder.reverseGeocode(lat, lon)
        .then((result: NativeGeocoderResult[]) => {
          // alert('location==>'+JSON.stringify(result[0]));
          this.location_name = result[0];
          this.generateAddress(result[0]).then((res: any) => {
            // return resolve(res);

            var data: any = res;
            //data = data.replace('[', '').replace(']', '');
            return resolve(data);
          });
        })
        .catch((error: any) => console.log(error));

    });
  }

  generateAddress(result) {
    return new Promise((resolve, reject) => {
      let obj1 = [];
      let add = "";
      if (result.subLocality) {
        add += result.subLocality + ", ";
      }
      if (result.areasOfInterest) {
        add += result.areasOfInterest[0] + ", ";
      }
      if (result.subAdministrative) {
        add += result.subAdministrative + ", ";
      }
      if (result.administrativeArea) {
        add += result.administrativeArea + ", ";
      }
      if (result.countryName) {
        add += result.countryName + ", ";
      }
      if (result.throughfare) {
        add += result.throughfare + ", ";
      }
      if (result.postalCode) {
        add += result.postalCode + ".";
      }
      this.addressgenerate = add;

      return resolve(this.addressgenerate);
    });
  }



  inappBrowser(url: string) {
    let target = "_self";
    //this.iab.create(url, target);
  }

  transpose(temp) {
    var tempLength = temp.length ? temp.length : 0,
      arrLength = temp[0] instanceof Array ? temp[0].length : 0;
    if (arrLength === 0 || tempLength === 0) {
      return [];
    }
    var i, j, tempArray = [];
    for (i = 0; i < arrLength; i++) {
      tempArray[i] = [];
      for (j = 0; j < tempLength; j++) {
        tempArray[i][j] = temp[j][i];
      }
    }
    return tempArray;
  }




  setPageInfo(object_arr) {

    // console.log("From Services",object_arr.Values);
    let object_mast: any = {};
    object_mast.Level1 = [];
    for (let level1 of object_arr.Values) {

      let level1Obj: any = {}
      let levelKyIndex = 0;
      for (let level1Values of level1) {
        level1Obj[object_arr.Level1_Keys[levelKyIndex]] = level1Values
        levelKyIndex++;
      }
      //level2-----
      if (level1Obj.Level2) {
        let level2Arr: any = []
        for (let level2 of level1Obj.Level2) {
          let level2Obj: any = {}
          let level2KeyIndex = 0;
          for (let level2Values of level2) {
            level2Obj[object_arr.Level2_Keys[level2KeyIndex]] = level2Values
            level2KeyIndex++;
          }
          //level3-------
          if (level2Obj.Level3) {
            let level3Arr: any = []
            for (let Level3 of level2Obj.Level3) {
              let level3Obj: any = {}
              let level3KeyIndex = 0;
              for (let level3Values of Level3) {
                level3Obj[object_arr.Level3_Keys[level3KeyIndex]] = level3Values;
                level3KeyIndex++;
              }
              //level4-------
              if (level3Obj.Level4) {
                let level4Arr: any = []
                for (let Level4 of level3Obj.Level4) {
                  let level4Obj: any = {}
                  let level4KeyIndex = 0;
                  for (let level4Values of Level4) {
                    level4Obj[object_arr.Level4_Keys[level4KeyIndex]] = level4Values;
                    level4KeyIndex++;
                  }
                  //level5---
                  if (level4Obj.Level5) {
                    let level5Arr: any = []
                    for (let Level5 of level4Obj.Level5) {
                      let level5Obj: any = {}
                      let level5KeyIndex = 0;
                      for (let level5Values of Level5) {
                        level5Obj[object_arr.Level5_Keys[level5KeyIndex]] = level5Values;
                        level5KeyIndex++;
                      }
                      //level6---
                      if (level5Obj.Level6) {
                        let level6Arr: any = []
                        for (let Level6 of level5Obj.Level6) {
                          let level6Obj: any = {}
                          let level6KeyIndex = 0;
                          for (let level6Values of Level6) {
                            level6Obj[object_arr.Level6_Keys[level6KeyIndex]] = level6Values;
                            level6KeyIndex++;
                          }
                          level6Arr.push(level6Obj)
                        }
                        level5Obj.Level6 = level6Arr
                      }
                      //---level6 end
                      level5Arr.push(level5Obj)
                    }
                    level4Obj.Level5 = level5Arr
                  }
                  //---level5 end
                  level4Arr.push(level4Obj)
                }
                level3Obj.Level4 = level4Arr
              }
              //level4 End-------
              level3Arr.push(level3Obj)
            }
            level2Obj.Level3 = level3Arr
          }
          //level3 End-------
          level2Arr.push(level2Obj);
        }
        level1Obj.Level2 = level2Arr
      }
      //level2 end----
      object_mast.Level1.push(level1Obj)
    }
    return object_mast
  }

  setPlatformValue(platformVal) {
    this.platformVal = platformVal;
  }

  getPlatformValue() {
    return this.platformVal;
  }

  getNetworkInfo() {
    let jsonNetwork: any = {};
    if (this.networkStatus) {
      //  let connectSubscription = this.network.onConnect().subscribe(() => {
      var connectivity_mode;
      var network_speed = this.network.downlinkMax;
      setTimeout(() => {
        //   alert("Network type"+ this.network.type)
        if (this.network.type == 'wifi') {
          connectivity_mode = 'wifi'
        } else if (this.network.type == '3g') {
          connectivity_mode = '3g';
        } else if (this.network.type == '4g') {
          connectivity_mode = '4g';
        } else if (this.network.type == 'ethernet') {
          connectivity_mode = 'ethernet';
        }
        else {
          connectivity_mode = 'cellular';
        }
        jsonNetwork.connection = connectivity_mode;
        jsonNetwork.network_speed = network_speed;
      }, 5000);
      // });
    }
    return jsonNetwork;

    //unsubscribe the connection
    //connectSubscription.unsubscribe();
  }


  autoCalculation(formulaStr: any, frame: any): any {
    try {
      let formulaStrArr = formulaStr.split("#");
      let formulaArr = [];

      for (let f of formulaStrArr) {
        if (f) {
          formulaArr.push(f);
        }
      }
      let flag: boolean = false;
      for (let itemGroup of frame) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if ((formulaArr.indexOf(item.item_name) > -1)) {
              let val;
              if (item.value) {
                val = JSON.parse(JSON.stringify(item.value));
              } else {
                val = "null";
              }
              formulaArr[formulaArr.indexOf(item.item_name)] = val;
              flag = true;
            }
          }
        }
      }
      if (flag) {
        let temp = formulaArr.join('');
        console.log(temp + " ---> " + eval(temp));
        if ((temp.indexOf("null") > -1) && formulaArr.length <= 3) {
          return null;
        } else {
          let num = eval(temp)
          let nVal = num.toString();
          if (nVal.indexOf('.') > -1) {
            num = parseFloat(nVal).toFixed(3);
          }
          return num
        }
      } else {
        return null;
      }

    } catch (err) {
      // console.log(err);
      return null;
    }
  }

  onBlurEvent(item, formulaStr: any, frame: any) {
    try {
      let formulaArr = formulaStr.split("[");
      for (let f of formulaArr) {
        if (f) {
          let resultArr = f.split("{");
          let conditionsArr;
          let formula;
          let forValue

          if (resultArr[1].indexOf("?") > -1) {
            conditionsArr = resultArr[1].split("?");
            formula = conditionsArr[0].split("~");

            for (let itemGroup of frame) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  for (let fr of formula) {
                    // if ((formula.indexOf(item.item_name) > -1)) {
                    if (fr == item.item_name) {
                      let val;
                      if (item.blurValue != undefined || item.value != undefined) {
                        if (item.blurValue) {
                          val = item.blurValue
                        } else {
                          val = item.value
                        }
                      } else {
                        val = "'null'";
                      }
                      formula[formula.indexOf(fr)] = val;
                      //  formula[formula.indexOf(item.item_name)] = val;
                    }
                  }
                }
              }
            }
            if ((formula.indexOf('SYSDATE') > -1)) {
              let date = new Date()
              formula[formula.indexOf('SYSDATE')] = date.getTime();
            }
            forValue = formula.join('');
          }
          let evalCond;
          try {
            evalCond = eval(forValue);
          } catch (e) {
            evalCond = eval("'" + forValue + "'");
          }
          if (resultArr[0] == 'alert') {
            if (evalCond) {
              let i = 0;
              i++
              console.log(i);
              if (conditionsArr[1].split(":")[0].indexOf("}") > -1) {
                alert(conditionsArr[1].split(":")[0].split("}")[0]);
              } else {
                alert(conditionsArr[1].split(":")[0]);
              }
            } else {
              let i = 0;
              i++
              console.log(i);
              if (conditionsArr[1].indexOf(":") > -1) {
                alert(conditionsArr[1].split(":")[1].split("}")[0]);
              }
            }
          }

          if (resultArr[0] == 'error') {
            if (evalCond) {
              item.blurError = conditionsArr[1].split(":")[0].split("}")[0];
              // item.value = "";
              item.isValid = false;
            } else {
              item.blurError = "";
            }
          }

          if (resultArr[0] == 'assign') {
            let formulae = [];
            let itmName;

            if (resultArr[1].indexOf("?") > -1) {

              if (evalCond) {
                itmName = conditionsArr[1].split(":")[0].split("=")[0];
                let formula_Str = conditionsArr[1].split(":")[0].split("=")[1];
                if (formula_Str.indexOf("~") > -1) {
                  formulae = formula_Str.split("~");
                } else {
                  formulae[0] = formula_Str
                }
              } else {
                itmName = conditionsArr[1].split(":")[1].split("=")[0];
                let formula_Str = conditionsArr[1].split(":")[1].split("=")[1].split("}")[0];
                if (formula_Str.indexOf("~") > -1) {
                  formulae = formula_Str.split("~");
                } else {
                  formulae[0] = formula_Str
                }
              }

            } else {

              itmName = resultArr[1].split("=")[0];
              let formula_Str = resultArr[1].split("=")[1].split("}")[0];
              if (formula_Str.indexOf("~") > -1) {
                formulae = formula_Str.split("~");
              } else {
                formulae[0] = formula_Str
              }

            }
            let dateTimeFlag = false;
            let dateFlag = false;
            for (let itemGroup of frame) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if ((formulae.indexOf(item.item_name) > -1)) {
                    let val;
                    if (item.item_sub_type == 'D') {
                      dateFlag = true;
                    } if (item.item_sub_type == 'DT') {
                      dateTimeFlag = true;
                    }
                    if (item.blurValue) {
                      val = item.blurValue
                    } else {
                      if (item.value) {
                        val = item.value
                      } else {
                        val = "0";
                      }
                    }
                    formulae[formulae.indexOf(item.item_name)] = val;
                  }
                }
              }
            }
            let temp = formulae.join('');
            for (let itemGroup of frame) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.item_name && (itmName.toLowerCase() == item.item_name.toLowerCase())) {
                    let value = eval(temp);
                    let finVal = value;
                    if (dateFlag && !dateTimeFlag) {
                      finVal = value / (1000 * 60 * 60 * 24)
                    } if (dateTimeFlag) {
                      finVal = (value / 1000);
                    }
                    item.value = finVal;

                    let nVal = finVal.toString();
                    if (nVal.indexOf('.') > -1) {
                      item.value = parseFloat(nVal).toFixed(3);
                    }
                  }
                }
              }
            }
          }

        }
      }

      return null;
    } catch (err) {
      // console.log(err);
      return null;
    }
  }


  setValueOnCondition(conditionStr: any, frame: any): any {
    try {
      let conditionsArr = conditionStr.split("IF");
      console.log(conditionsArr);
      for (let c of conditionsArr) {
        if (c) {
          let condition = c.split("THEN");
          let formulaArr = condition[0].split("#");

          let flag: boolean = false;
          for (let itemGroup of frame) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                if ((formulaArr.indexOf(item.item_name) > -1) && item.value) {
                  formulaArr[formulaArr.indexOf(item.item_name)] = "'" + item.value + "'";
                  flag = true;
                }
              }
            }
          }
          if (flag) {
            let temp = formulaArr.join('');
            console.log(temp + " ---> " + eval(temp));
            let ifCon = condition[1];
            let elseCon: any;
            if (condition[1].indexOf("ELSE") > -1) {
              ifCon = condition[1].split("ELSE")[0];
              elseCon = condition[1].split("ELSE")[1];
            }
            if (eval(temp)) {
              let thenCon = ifCon.split("#");
              for (let itemGroup of frame) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    for (let t of thenCon) {
                      let con = t.split("~");
                      if (con[0] == item.item_name) {
                        let str = con[1].split("=");
                        item[str[0]] = str[1];
                        console.log(item);

                      }
                    }
                    /* if ((thenCon.indexOf(item.item_name) > -1)) {
                      console.log(thenCon[thenCon.indexOf(item.item_name)])
                      console.log();
                    } */
                  }
                }
              }
            } else {
              let thenCon = elseCon.split("#");
              for (let itemGroup of frame) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    for (let t of thenCon) {
                      let con = t.split("~");
                      if (con[0] == item.item_name) {
                        let str = con[1].split("=");
                        item[str[0]] = str[1];
                        console.log(item);

                      }
                    }
                    /* if ((thenCon.indexOf(item.item_name) > -1)) {
                      console.log(thenCon[thenCon.indexOf(item.item_name)])
                      console.log();
                    } */
                  }
                }
              }
            }
          } else {
            return null;
          }
        }
      }

    } catch (err) {
      // console.log(err);
      return null;
    }
  }


  async smsApi(a_mobile_number: any, a_sms_text: any) {
    // try {
    //   var location = "http://sms.smsmob.in/api/mt/SendSMS?user=Lighthouse&password=lighthouse@123&senderid=LHSERP&channel=Trans&DCS=0&flashsms=0&number=" + a_mobile_number + "&text=" + encodeURIComponent(a_sms_text);
    //   const options: InAppBrowserOptions = { location: "no", zoom: 'no', toolbar: 'no', hideurlbar: "yes", hidden: "yes" }
    //   const browser = this.theInAppBrowser.create(location, '_self', options)
    //   browser.on('loadstop').subscribe(event => {
    //     this.s2uToast("Text message sent successfully", "paymentSuccessToast");
    //   }, (error) => {
    //     this.s2uToast("Text message not sent. :(", "errorToast");
    //   });
    // } catch (error) {
    //   console.log('smsApi : ' + error.message);
    // }
  }

  async shareViaWhatsAppWeb(mobileNo, message) {
    try {
      let url = "https://api.whatsapp.com/send?phone=" + encodeURIComponent(mobileNo) + "&amp;text=" + encodeURIComponent(message);
      this.presentAlert(url);
      window.open(url);
    } catch (error) {
      console.log('sendWhatsApp : ' + error.message);
    }
  }

  async shareViaWhatsApp(mobileNo, message) {
    this.presentAlert(mobileNo + ":" + message);
    await this.socialSharing.shareViaWhatsAppToReceiver(mobileNo, message);
  }

  smsMobile(a_mobile_number: any, a_sms_text: any) {
    // try {
    //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
    //     result => console.log('Has permission?' + result.hasPermission),
    //     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
    //   );
    //   var options = {
    //     replaceLineBreaks: false, // true to replace \n by a new line, false by default
    //     android: {
    //       // intent: 'INTENT'  // Opens Default sms app
    //       intent: '' // Sends sms without opening default sms app
    //     }
    //   }
    //   this.sms.hasPermission().then(res => {
    //     this.sms.send(a_mobile_number, a_sms_text, options).then(result => {
    //       // alert(result);
    //       this.s2uToast("Text message sent successfully! :)", "paymentSuccessToast");
    //     }, (error) => {
    //       // alert(error);
    //       this.s2uToast("Text message not sent. :(", "errorToast");
    //     });
    //   });
    // } catch (error) {
    //   console.log('smsMobile : ' + error.message);
    // }
  }

  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }

  // getPermission() {
  //   alert("permissiomn")
  //   this.speechRecognition.hasPermission()
  //     .then((hasPermission: boolean) => {
  //       alert(hasPermission);
  //       if (!hasPermission) {
  //         this.speechRecognition.requestPermission();
  //       }
  //     });
  // }

  startListening() {
    // this.getPermission();

    return new Promise((resolve, reject) => {
      this.speechRecognition.isRecognitionAvailable()
        .then((available: boolean) => console.log(available))
      this.speechRecognition.getSupportedLanguages()
        .then(
          (languages: string[]) => console.log(languages),
          (error) => console.log(error)
        )
      let options = {
        language: 'en-US'
      }
      this.speechRecognition.startListening(options)
        .subscribe(
          (matches: string[]) => {
            this.speechdata = matches[0],
              resolve(this.speechdata);
          },
          (onerror) => {
            this.speechRecognition.requestPermission()
          }
        )
      // alert(this.speechdata);
    })
  }

  barcodescanner() {

    let options: BarcodeScannerOptions = {
      torchOn: true,
      showTorchButton: true,
      prompt: "Point the camera at the barcode"
    };
    return new Promise((resolve, reject) => {

      this.barScanner.scan(options).then(barcodeData => {
        console.log('Barcode data', barcodeData);

        this.barcodeinputdata = barcodeData.text;
        resolve(this.barcodeinputdata);
        // alert(JSON.stringify(this.barcodeinputdata));
        // alert((this.barcodeinputdata));

      }).catch(err => {

        console.log('Error', err);
      }).finally(function () {
        // this.flashlight.switchOff();
      });
    })
  }

  downloadPdf(shareType, data, title, footer) {

    let pagesize = 'A4'
    let pagemode = 'portrait';
    if (data[0].length > 8) {
      pagemode = 'landscape';
    }
    if (data[0].length > 12) {
      pagesize = 'A3'
    }
    if (data[0].length > 18) {
      pagesize = 'A2'
    }
    // for (let index = 0; index <= data.length; index++) {
    //   this.arr.push(data[index])
    // }
    if (footer) {
      let temp = [];
      if(footer.length > 0){
        footer.map(x => x ? temp.push(x) : temp.push(""));
        if(data && data.length > 0){
          for(let i = 0; i < data[0].length; i++){
            if(data[0].length > temp.length){
              temp.push("");
            }
          }
        }
        data.push(temp);
      }else{
        data.push(footer);
      }
    }
    console.log(data, title)
    var today = new Date();
    let date = this.formatDate(today, "dd-MMM-yyyy")
    // var date = today.getDate()+ '-' + (today.getMonth() + 1) +'-'+ today.getFullYear();
    var time1;

    // if(today.getHours() >= 12){
    //  time1 = 'PM'
    // }else{
    //   time1 = 'AM'
    // }

    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ', ' + time;
    var dateenow = dateTime;
    // console.log(this.myDiv.nativeElement.innerHTML);

    // console.log(this.myDiv.nativeElement.innerHTML);
    var docDefinition = {
      pageSize: pagesize,
      pageOrientation: pagemode,
      pageMargins: [30, 20, 30, 20],
      content: [
        { text: title, style: 'title', alignment: 'center' },
        { text: '', style: 'subheader' },
        { text: dateenow, style: 'dating', alignment: 'right' },
        // { text: this.letterObj.from },

        // { text: 'To', style: 'subheader' },
        // this.letterObj.to,

        // { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },
        {

          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1, fontSize: 20,
            body: data, style: 'body',

            //  [
            //   ['Sr.'.bold, 'Name'.bold, 'Amount Payable'.bold, 'Time'.bold, 'Amount'.bold],
            //   // for(int i=0;i <= 3;i++ ){},
            //   ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'value 5'],
            //   ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'value 5'],

            // ]

          },
          style: 'table',
          layout: {

            orientation: 'landscape',
            hLineStyle: function (rowIndex, node) {
              return { dash: { length: 1, space: 1 } };
            },
            vLineStyle: function (rowIndex, node) {
              return { dash: { length: 1 } };
            },
            // hLineWidth: function (rowIndex, node) {
            //   return (rowIndex == 1) ? 2 : 1;
            // },
            // hLineColor: function (rowIndex, node, columnIndex) {
            //   return (rowIndex == 0) ? '#FF33F9' : null;
            // },
            fillColor: function (rowIndex, node, columnIndex) {
              if (rowIndex == 0) {
                return '#ffff99';
              } else {
                // return (rowIndex % 2 === 0) ? '#e5f1ff' : null;
              }
            },
          }
        }
      ],
      styles: {
        title: {
          fontSize: 16,
          alignment: 'auto',
          bold: true,
          background: '#c2f0f0',
          padding: [0, 0, 10, 10],

        },
        table: {
          orientation: 'landscape',
          fontSize: 8,
          alignment: 'auto',
          width: 'auto'
        },

        body: {

          alignment: 'auto',
          width: 'auto'
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'green',
          width: 'auto'
        },
        dating: {
          bold: true,
          fontSize: 8,
          color: 'grey'
        }


      },

    }

    this.downloadPdf2(shareType, docDefinition, title);

    this.arr = [];
  }

  // downloadPdf(shareType, data, title, footer) {

  //   let pagesize = 'A4'
  //   let pagemode = 'portrait';
  //   if (data[0].length > 8) {
  //     pagemode = 'landscape';
  //   }
  //   if (data[0].length > 12) {
  //     pagesize = 'A3'
  //   }
  //   if (data[0].length > 18) {
  //     pagesize = 'A2'
  //   }
  //   if (footer) {

  //     data.push(footer);
  //   }
  //   console.log(data, title)
  //   var dateenow = new Date().toDateString();
  //   var docDefinition = {
  //     pageSize: pagesize,
  //     pageOrientation: pagemode,
  //     pageMargins: [20, 0, 20, 0],
  //     content: [
  //       { text: title, style: 'title' },
  //       { text: '', style: 'subheader' },
  //       { text: dateenow, style: 'dating' },
  //       {

  //         table: {
  //           // headers are automatically repeated if the table spans over multiple pages
  //           // you can declare how many rows should be treated as headers
  //           headerRows: 1, fontSize: 16,
  //           body: data, style: 'body',

  //           //  [
  //           //   ['Sr.'.bold, 'Name'.bold, 'Amount Payable'.bold, 'Time'.bold, 'Amount'.bold],
  //           //   // for(int i=0;i <= 3;i++ ){},
  //           //   ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'value 5'],
  //           //   ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'value 5'],

  //           // ]

  //         },
  //         style: 'table',
  //         layout: {

  //           orientation: 'landscape',
  //           hLineStyle: function (rowIndex, node) {
  //             return { dash: { length: 1, space: 1 } };
  //           },
  //           vLineStyle: function (rowIndex, node) {
  //             return { dash: { length: 1 } };
  //           },
  //           // hLineWidth: function (rowIndex, node) {
  //           //   return (rowIndex == 1) ? 2 : 1;
  //           // },
  //           // hLineColor: function (rowIndex, node, columnIndex) {
  //           //   return (rowIndex == 0) ? '#FF33F9' : null;
  //           // },
  //           fillColor: function (rowIndex, node, columnIndex) {
  //             if (rowIndex == 0) {
  //               return '#ffff99';
  //             } else {
  //               // return (rowIndex % 2 === 0) ? '#e5f1ff' : null;
  //             }
  //           },
  //         }
  //       }
  //     ],
  //     styles: {
  //       title: {
  //         fontSize: 16,
  //         alignment: 'auto',
  //         bold: true,
  //         background: '#c2f0f0',
  //         padding: [0, 0, 10, 10],

  //       },
  //       table: {
  //         orientation: 'landscape',
  //         fontSize: 8,
  //         alignment: 'auto',
  //         width: 'auto'
  //       },

  //       body: {

  //         alignment: 'auto',
  //         width: 'auto'
  //       },
  //       tableHeader: {
  //         bold: true,
  //         fontSize: 13,
  //         color: 'green',
  //         width: 'auto'
  //       },
  //       dating: {
  //         bold: true,
  //         fontSize: 8,
  //         color: 'grey'
  //       }


  //     },

  //   }

  //   this.downloadPdf2(shareType, docDefinition);

  //   this.arr = [];
  // }

  downloadPdf2(shareType, docDefinition, title) {
    let directoryPath = "";
    if (this.plt.is("ios")) {
      directoryPath = this.file.documentsDirectory;
      this.savePdf(shareType, docDefinition, directoryPath, title);
    }
    else if (this.plt.is("android")) {
      // alert("android checking per/..")
      this.checkStoragePermission().then((res) => {
        // alert("res: "+JSON.stringify(res));
        if (res == 'success') {
          directoryPath = this.file.externalApplicationStorageDirectory.split("Android")[0] + "/Download/";
          //alert(directoryPath)
          this.savePdf(shareType, docDefinition, directoryPath, title);
        } else {
          this.presentAlert("Please grant storage permission to download file.")
        }
      }, (error) => {
        this.presentAlert(JSON.stringify(error));
      })
    } else {
      this.savePdf(shareType, docDefinition, directoryPath, title);
    }


  }

  savePdf(shareType, docDefinition, directoryPath, title) {
    if (shareType) {
      this.pdfFilesend(docDefinition, directoryPath);
    } else {
      var today = new Date();
      let date = this.formatDate(today, "dd-MMM-yyyy")
      var time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
      var dateTime = date + ', ' + time;
      let fileName = title + "[" + dateTime + "]" + ".pdf";
      this.displayCordovaToast("Please wait download started...");
      if (this.plt.is("android") || this.plt.is("ios")) {
        pdfMake.createPdf(docDefinition).getBuffer((buffer => {
          var blob = new Blob([buffer], { type: 'application/pdf' });
          this.file.writeFile(directoryPath, fileName, blob, { replace: true })
            .then(fileEntry => {
              this.displayCordovaToast("Download complete...");
              if (fileEntry) {

                if (fileEntry.isFile) {
                  this.displayCordovaToast("File Generated");
                }

                this.file.checkFile(directoryPath, fileName).then((exist => {
                  this.filePath.resolveNativePath(directoryPath + fileName).then((pathIs => {
                  }));
                  if (this.plt.is("ios")) {
                    this.document.viewDocument(directoryPath + fileName, 'application/pdf', {});
                  } else {
                    let mimetype = 'application/pdf';
                    this.fileOpener.open(directoryPath + fileName, mimetype)
                      .then((exist) => console.log('File is opened' + JSON.stringify(exist)))
                      .catch(e => this.presentAlert("file is" + JSON.stringify(e)));
                  }
                })
                ).catch(err => {
                  this.presentAlert('Directory' + JSON.stringify(err));
                });
              }
            })
            .catch(err => {
              this.presentAlert(JSON.stringify(err));
            })
        }));
      } else {
        this.pdfObj = pdfMake.createPdf(docDefinition);
        console.log(this.pdfObj);
        this.pdfObj.download(fileName);

        this.displayCordovaToast("Download complete...");
      }
    }
  }

  downloadExcel(buffer, fileName) {
    let directoryPath = "";
    if (this.plt.is("ios")) {
      directoryPath = this.file.documentsDirectory;
      this.saveExcel(buffer, directoryPath, fileName);
    }
    else if (this.plt.is("android")) {
      this.checkStoragePermission().then((res) => {
        if (res == 'success') {
          directoryPath = this.file.externalApplicationStorageDirectory.split("Android")[0] + "/Download/";
          //alert(directoryPath);
          this.saveExcel(buffer, directoryPath, fileName);
        } else {
          this.presentAlert("Please grant storage permission to download file.")
        }
      })
    } else {
      this.saveExcel(buffer, directoryPath, fileName);
    }
  }

  saveExcel(buffer, directoryPath, fileName) {
    this.displayCordovaToast("Please wait download started...");
    // let fileName = "";
    // fileName = JSON.stringify(Math.floor(Math.random() * (999999 - 100000)) + 100000);
    if (!fileName) {
      fileName = JSON.stringify(Math.floor(Math.random() * (999999 - 100000)) + 100000);
    }
    fileName = fileName + ".xlsx";
    if (this.plt.is("android") || this.plt.is("ios")) {
      var blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      this.file.writeFile(directoryPath, fileName, blob, { replace: true })
        .then(fileEntry => {

          if (fileEntry) {

            if (fileEntry.isFile) {
              this.displayCordovaToast("File Generated");
            }

            this.file.checkFile(directoryPath, fileName).then((exist => {
              this.filePath.resolveNativePath(directoryPath + fileName).then((pathIs => {
              }));
              if (this.plt.is("ios")) {
                this.document.viewDocument(directoryPath + fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', {});
              } else {
                let mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                this.fileOpener.open(directoryPath + fileName, mimetype)
                  .then((exist) => console.log('File is opened' + JSON.stringify(exist)))
                  .catch(e => this.presentAlert("file is" + JSON.stringify(e)));
              }
            })
            ).catch(err => {
              this.presentAlert('Directory' + JSON.stringify(err));
            });
            this.displayCordovaToast("Download complete...");
          }
        })
        .catch(err => {
          this.presentAlert('Directory does not exist');
        })
    } else {
      saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), fileName);
      this.displayCordovaToast("Download complete...");
    }
  }





  viewPhoto(imgData) {
    this.photoViewer.show(imgData, '', { share: true });
  }

  increFont(font) {


    if (font) {
      let elementTagArr = [];
      const h1 = document.getElementsByTagName('h1');
      const h2 = document.getElementsByTagName('h2');
      const h3 = document.getElementsByTagName('h3');
      const h4 = document.getElementsByTagName('h4');
      const h5 = document.getElementsByTagName('h5');
      const h6 = document.getElementsByTagName('h6');
      const p = document.getElementsByTagName('p');
      const caption = document.getElementsByTagName('caption');
      const td = document.getElementsByTagName('td');
      const th = document.getElementsByTagName('th');
      const body = document.getElementsByTagName('body');
      const label = document.getElementsByTagName('ion-label');
      const button = document.getElementsByTagName('ion-button');
      const marquee = document.getElementsByTagName('marquee');
      const title = document.getElementsByTagName('ion-title');

      elementTagArr.push(body);
      elementTagArr.push(h1);
      elementTagArr.push(h2);
      elementTagArr.push(h3);
      elementTagArr.push(h4);
      elementTagArr.push(h5);
      elementTagArr.push(h6);
      elementTagArr.push(p);
      elementTagArr.push(caption);
      elementTagArr.push(td);
      elementTagArr.push(th);
      elementTagArr.push(label);
      elementTagArr.push(button);
      elementTagArr.push(marquee);
      elementTagArr.push(title);
      //  if(font){
      //   for (let z = 0; z <= elementTagArr.length; z++) {
      //     try {
      //       for (let i = 0; elementTagArr[z].length > i; i++) {
      //         elementTagArr[z][i].setAttribute('style', `font-family: ${this.fontype}rem !important;font-size: ${this.fontSize}rem !important`);
      //         // elementTagArr[z][i].setAttribute('style', `font-size: ${this.fontSize}rem !important`);
      //       }
      //     } catch (error) {

      //     }
      //   }
      //  }else{
      for (let z = 0; z <= elementTagArr.length; z++) {
        try {
          for (let i = 0; elementTagArr[z].length > i; i++) {
            elementTagArr[z][i].setAttribute('style', `font-family: ${font} !important;`);

            // elementTagArr[z][i].setAttribute('style', `font-size: ${this.fontSize}rem !important`);
          }
        } catch (error) {

        }


      }
      // } 
    }
  }
  changeFont(font) {
    console.log(font)
    if (font) {

      this.fontype = font;

    }
    if (font) {
      let elementTagArr = [];
      const h1 = document.getElementsByTagName('h1');
      const h2 = document.getElementsByTagName('h2');
      const h3 = document.getElementsByTagName('h3');
      const h4 = document.getElementsByTagName('h4');
      const h5 = document.getElementsByTagName('h5');
      const h6 = document.getElementsByTagName('h6');
      const p = document.getElementsByTagName('p');
      const caption = document.getElementsByTagName('caption');
      const td = document.getElementsByTagName('td');
      const th = document.getElementsByTagName('th');
      const body = document.getElementsByTagName('body');
      const label = document.getElementsByTagName('ion-label');
      const button = document.getElementsByTagName('ion-button');
      const marquee = document.getElementsByTagName('marquee');
      const title = document.getElementsByTagName('ion-title');

      elementTagArr.push(body);
      elementTagArr.push(h1);
      elementTagArr.push(h2);
      elementTagArr.push(h3);
      elementTagArr.push(h4);
      elementTagArr.push(h5);
      elementTagArr.push(h6);
      elementTagArr.push(p);
      elementTagArr.push(caption);
      elementTagArr.push(td);
      elementTagArr.push(th);
      elementTagArr.push(label);
      elementTagArr.push(button);
      elementTagArr.push(marquee);
      elementTagArr.push(title);
      //  if(font){
      //   for (let z = 0; z <= elementTagArr.length; z++) {
      //     try {
      //       for (let i = 0; elementTagArr[z].length > i; i++) {
      //         elementTagArr[z][i].setAttribute('style', `font-family: ${this.fontype}rem !important;font-size: ${this.fontSize}rem !important`);
      //         // elementTagArr[z][i].setAttribute('style', `font-size: ${this.fontSize}rem !important`);
      //       }
      //     } catch (error) {

      //     }
      //   }
      //  }else{
      for (let z = 0; z <= elementTagArr.length; z++) {
        try {
          for (let i = 0; elementTagArr[z].length > i; i++) {
            elementTagArr[z][i].setAttribute('style', `font-family: ${this.fontype} !important;`);
            // elementTagArr[z][i].setAttribute('style', `font-size: ${this.fontSize}rem !important`);
          }
        } catch (error) {

        }


      }
      // } 
    }
  }

  increFontsize(size) {
    if (size) {
      this.fontSize = size;
    }
    if (size) {
      let elementTagArr = [];
      const h1 = document.getElementsByTagName('h1');
      const h2 = document.getElementsByTagName('h2');
      const h3 = document.getElementsByTagName('h3');
      const h4 = document.getElementsByTagName('h4');
      const h5 = document.getElementsByTagName('h5');
      const h6 = document.getElementsByTagName('h6');
      const p = document.getElementsByTagName('p');
      const caption = document.getElementsByTagName('caption');
      const td = document.getElementsByTagName('td');
      const th = document.getElementsByTagName('th');
      const body = document.getElementsByTagName('body');
      const label = document.getElementsByTagName('ion-label');
      const button = document.getElementsByTagName('ion-button');
      const marquee = document.getElementsByTagName('marquee');
      const title = document.getElementsByTagName('ion-title');

      elementTagArr.push(body);
      elementTagArr.push(h1);
      elementTagArr.push(h2);
      elementTagArr.push(h3);
      elementTagArr.push(h4);
      elementTagArr.push(h5);
      elementTagArr.push(h6);
      elementTagArr.push(p);
      elementTagArr.push(caption);
      elementTagArr.push(td);
      elementTagArr.push(th);
      elementTagArr.push(label);
      elementTagArr.push(button);
      elementTagArr.push(marquee);
      elementTagArr.push(title);

      for (let z = 0; z <= elementTagArr.length; z++) {
        try {
          for (let i = 0; elementTagArr[z].length > i; i++) {
            elementTagArr[z][i].setAttribute('style', `font-size: ${this.fontSize}rem !important`);
          }
        } catch (error) {

        }
      }
    }
  }

  // Getting callingObjectObjectStr from frame SQL
  getCallingObjectCodeArr(objData) {
    let callingObjectCodeArr = []
    if (objData) {
      for (let obj of objData) {
        let key = "CALLING_OBJECT_CODE";
        for (let keySet in obj) {
          if (key == keySet) {
            let callingObjectSet: any = {};
            callingObjectSet.key = obj.ROWNUMBER;
            callingObjectSet.value = obj.CALLING_OBJECT_CODE;
            callingObjectCodeArr.push(callingObjectSet);
          }
        }
      }
    }
    return callingObjectCodeArr;
  } // End Method
  // Getting callingObjectObjectStr from frame SQL End


  // ----------Getting Code-Value pair from String (code~value$$code~value)
  getCodeValueJsonArr(codeValueStr) {
    if (codeValueStr) {
      let codeValueJsonArr: any = [];
      if (codeValueStr.indexOf("$$") > -1) {
        let codeValuePairArr: any = codeValueStr.split("$$");
        if (codeValuePairArr) {
          for (let codeValuePair of codeValuePairArr) {
            if (codeValuePair.indexOf("~")) {
              let codeValueData: any = {}
              let codeValue: any = codeValuePair.split("~");
              codeValueData.head = codeValue[0];
              codeValueData.objectCode = codeValue[1];
              codeValueJsonArr.push(codeValueData);
            }
          }
        }
      }
      return codeValueJsonArr;
    }
  }// End Method


  getContacts() {

    //Getting Yesterday Time
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    var fromTime = yesterday.getTime();

    // this.filters = [{
    //   name: "date",
    //   value: fromTime.toString(),
    //   operator: ">=",
    // }];
    // this.callLog.getCallLog(this.filters).then(result => {
    //   this.recordsFound = result;
    // })
  }

  setAudioParam(param) {
    // this.audio = param;
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.nativeAudio.unload(this.audio.id);
      this.nativeAudio.preloadComplex(param.id, param.sound, 1, param.volume, 1).then(() => {

      })
    }
  }

  logEvents(obj, ex_ws_seq_no, ws_seq_no, status, message) {

    let today = new Date();
    let timeStamp = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + " | " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
    let clickeItems = this.getLocallData("clickedItem") ? this.getLocallData("clickedItem") : [];
    // let ex_ws_seq_no1 = this.ex_ws_seq_no;
    // let ex_ws_seq_no1;
    // if(ex_ws_seq_no != null && ex_ws_seq_no != ""){
    //   ex_ws_seq_no1 = ex_ws_seq_no; 
    // }
    // this.setDataLocally("exWsSeqNo", ws_seq_no);
    //let obj = {"reqData": reqData, "timeStamp": timeStamp};

    let resObj = { "ex_ws_seq_no": ex_ws_seq_no, "ws_seq_no": ws_seq_no, "status": status, "message": message };
    obj["timeStamp"] = timeStamp;
    obj["response"] = resObj;

    if (typeof (clickeItems) == "string") {
      clickeItems = JSON.parse(clickeItems);
    }
    clickeItems.unshift(obj);

    // this.setDataLocally("clickedItem", clickeItems);
    if (clickeItems.length > 50) {
      clickeItems.splice(50, clickeItems.length - 50);
    }
    if (this.toggleDevloperMode) {
      this.setDataLocally("clickedItem", clickeItems);
    }
  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'mp3': 'audio/mpeg',
      'mpeg': 'video/mpeg',
      'wav': 'audio/wav',
      'weba': 'audio/webm',
      'webm': 'video/webm',
      'wmv': 'video/x-ms-wmv',
      'mp4': 'video/mp4',
      'apk': 'application/vnd.android.package-archive'
    }
    return MIMETypes[ext];
  }



  public htmlObj = {
    htmlCode: "<h1 style=\"text-align: center;\"><span style=\"color: #ff0000;\"><strong>Welcome to LHS</strong></span></h1>" +
      "<p>&nbsp;</p>" +
      "<p style=\"text-align: center;\"><strong>In Lighthouse we build mobile apps in mobile app we have a good team of 6 people . And our mobile app manager is Mr. Chaitanya Rajorkar.</strong></p>" +
      "<p style=\"text-align: center;\">&nbsp;</p>" +
      "<table style=\"height: 170px; margin-left: auto; margin-right: auto;\" width=\"493\">" +
      "<tbody>" +
      "<tr>" +
      "<td style=\"width: 116px;\"><strong>Employees</strong></td>" +
      "<td style=\"width: 116px;\">Designation</td>" +
      "<td style=\"width: 116px;\">DOB</td>" +
      "<td style=\"width: 116px;\">Images</td>" +
      "</tr>" +
      "<tr>" +
      "<td style=\"width: 116px;\">Chaitanya</td>" +
      "<td style=\"width: 116px;\">App Manger</td>" +
      "<td style=\"width: 116px;\">9-11-1992</td>" +
      "<td style=\"width: 116px;\"><img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Sundar_Pichai_WEF_2020.png/220px-Sundar_Pichai_WEF_2020.png\" alt=\"\" width=\"73\" height=\"100\" /></td>" +
      "</tr>" +
      "<tr>" +
      "<td style=\"width: 116px;\">Aamir</td>" +
      "<td style=\"width: 116px;\">Developer</td>" +
      "<td style=\"width: 116px;\">24-02-1995</td>" +
      "<td style=\"width: 116px;\"><img src=\"https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg\" alt=\"\" width=\"67\" height=\"100\" /></td>" +
      "</tr>" +
      "<tr>" +
      "<td style=\"width: 116px;\">Harsh</td>" +
      "<td style=\"width: 116px;\">Sr. Developer</td>" +
      "<td style=\"width: 116px;\">6-5-1993</td>" +
      "<td style=\"width: 116px;\"><img src=\"https://thumbor.forbes.com/thumbor/fit-in/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5bb22ae84bbe6f67d2e82e05%2F0x0.jpg%3Fbackground%3D000000%26cropX1%3D560%26cropX2%3D1783%26cropY1%3D231%26cropY2%3D1455\" alt=\"\" width=\"100\" height=\"100\" /></td>" +
      "</tr>" +
      "</tbody>" +
      "</table>"

  }


  checkGPSPermission() {
    return new Promise((resolve, reject) => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {
          if (result.hasPermission) {
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS().then(res => {
              resolve(res);
            }, err => reject(err));

          } else {
            //If not having permission ask for permission
            this.requestGPSPermission().then((res) => {
              resolve(res);
            }, err => reject(err));
          }
        },
        err => {
          reject(err);
        }
      );
    })
  }

  checkStoragePermission() {
    return new Promise((resolve, reject) => {
      this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        .then(status => {
          this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((writeStatus) => {
            if (writeStatus.hasPermission) {
              if (status.hasPermission) {
                resolve("success")
                // this.file.checkDir(this.file.externalApplicationStorageDirectory, "LHSAPP").then((res) => {
                //   resolve("success")
                // }, (error) => {
                //   this.file.createDir(this.file.externalApplicationStorageDirectory, "LHSAPP", true).then(() => {
                //     resolve("success");
                //   }, (error) => {
                //     reject(error)
                //   });
                // })
              }
              else {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
                  .then(status => {
                    if (status.hasPermission) {
                      resolve("success")
                      // this.file.checkDir(this.file.externalApplicationStorageDirectory, "LHSAPP").then(() => {
                      //   resolve("success")
                      // }, (error) => {
                      //   this.file.createDir(this.file.externalApplicationStorageDirectory, "LHSAPP", true).then(() => {
                      //     resolve("success");
                      //   }, (error) => {
                      //     reject(error)
                      //   });
                      // })
                    }
                  }, (err) => reject(err));
              }
            } else {
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((writeStatus1) => {
                if (writeStatus1.hasPermission) {
                  if (status.hasPermission) {
                    resolve("success")
                    // this.file.checkDir(this.file.externalApplicationStorageDirectory, "LHSAPP").then((res) => {
                    //   resolve("success")
                    // }, (error) => {
                    //   this.file.createDir(this.file.externalApplicationStorageDirectory, "LHSAPP", true).then(() => {
                    //     resolve("success");
                    //   }, (error) => {
                    //     reject(error)
                    //   });
                    // })
                  }
                  else {
                    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
                      .then(status => {
                        if (status.hasPermission) {
                          resolve("success")
                          // this.file.checkDir(this.file.externalApplicationStorageDirectory, "LHSAPP").then(() => {
                          //   resolve("success")
                          // }, (error) => {
                          //   this.file.createDir(this.file.externalApplicationStorageDirectory, "LHSAPP", true).then(() => {
                          //     resolve("success");
                          //   }, (error) => {
                          //     reject(error)
                          //   });
                          // })
                        }
                      }, (err) => reject(err));
                  }
                }
              }, (error) => reject(error))
            }
          }, (error) => reject(error))
        }, err => reject(err));
    })
  }

  requestGPSPermission() {
    return new Promise((resolve, reject) => {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          resolve('success');
        } else {
          //Show 'GPS Permission Request' dialogue
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
            .then(
              (res) => {
                // call method to turn on GPS
                if (res.hasPermission) {
                  this.askToTurnOnGPS().then(res => {
                    resolve(res);
                  }, err => reject(err));
                }
                else {
                  reject('error');
                }
              },
              error => {
                //Show alert if user click on 'No Thanks'
                reject(error);
              }
            );
        }
      }, (error) => {
        reject(error);
      });
    })
  }

  askToTurnOnGPS() {
    return new Promise((resolve, reject) => {
      this.locationAccuracy.isRequesting().then((requesting: boolean) => {
        if (requesting) {
          resolve('success');
        } else {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              // When GPS Turned ON call method to get Accurate location coordinates
              this.geoLocation();
              resolve('success');
            },
            (error) => {
              reject(error)
            }
          );
        }
      })
    })
  }

  converToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  presentAlert(msg) {
    return new Promise(async (resolve, reject) => {
      // if (this.plt.is('android') || this.plt.is('ios')) {
      //   const alert = await this.alertController.create({
      //     cssClass: 'selectTextAlert',
      //     // header: 'Alert',
      //     // subHeader: 'Subtitle',
      //     message: '<strong>' + msg + '</strong>',
      //     backdropDismiss: false,
      //     //buttons: ['OK'],
      //     buttons: [
      //       {
      //         text: 'Ok',
      //         handler: () => {
      //           resolve("");
      //         }
      //       }
      //     ]
      //   });

      //   await alert.present();
      // } else {
      alert(msg);
      resolve("");
      // }
    })

  }



  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    //console.log(blob);
    return new Promise((resolve, reject) => {
      /* var reader  = new FileReader();
        reader.addEventListener("load", function () {
            resolve(reader.result);
        }, false);
    
        reader.onerror = () => {
          return reject(this);
        };
        reader.readAsDataURL(blob); */

      this.converToBase64(blob).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  emailSendOfTableData(shareType, headerdata, pdfHeading, footer) {

    this.downloadPdf(shareType, headerdata, pdfHeading, footer);

  }


  pdfFilesend(docDefinition, directoryPath) {
    // this.pdfObj = pdfMake.createPdf(docDefinition);
    if (this.plt.is("android") || this.plt.is("ios")) {
      pdfMake.createPdf(docDefinition).getBuffer((buffer => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        let fileName = "";
        fileName = JSON.stringify(Math.floor(Math.random() * (999999 - 100000)) + 100000);
        fileName = fileName + ".pdf";
        this.file.writeFile(directoryPath, fileName, blob, { replace: true })
          .then(fileEntry => {
            this.displayCordovaToast("Download complete...");
            if (fileEntry) {

              if (fileEntry.isFile) {
                this.displayCordovaToast("File Generated");
              }

              this.file.checkFile(directoryPath, fileName).then((exist => {
                this.filePath.resolveNativePath(directoryPath + fileName).then((pathIs => {
                }));
                let email = {
                  to: '',
                  cc: '',
                  attachments: [
                    directoryPath + fileName
                  ],
                  subject: '',
                  body: '',
                  isHtml: true
                };
                this.emailComposer.open(email);

              })
              ).catch(err => {
                this.presentAlert('Directory' + JSON.stringify(err));
              });
            }
          })
          .catch(err => {
            this.presentAlert('Directory does not exist');
          })
      }));
    }
    this.displayCordovaToast("File Generated");
  }

  getWsdp(frameName) {
    let wsdp = [];
    let wsdptp = [];
    if (this.parameterObject) {
      for (let object of this.parameterObject.Level2) {
        for (let frame of object.Level3) {
          if ((frame.apps_page_frame_seqid == frameName) || (frameName ? (frame.frame_alias ? frame.frame_alias.toLowerCase() : "") == frameName.toLowerCase() : (frame.apps_frame_type != 'TABLE' && frame.apps_frame_type != 'CARD' && frame.apps_frame_type != 'ENTRY_TABLE'))) {

            if (frame.tableRows && frame.tableRows.length > 0) {
              let tableRows = [];
              tableRows = frame.tableRows;
              if (frame.apps_page_frame_seqid && frame.apps_page_frame_seqid.indexOf("PARA") > -1) {

                for (let framedata of tableRows) {
                  let col = {};
                  let coltp = {};
                  for (let itemGroup of framedata) {
                    if (itemGroup.Level5) {
                      for (let item of itemGroup.Level5) {
                        if (item.codeOfValues) {
                          col[item.item_name] = item.codeOfValues;
                        } else if (item.value) {
                          col[item.item_name] = item.value;
                        } else {
                          col[item.item_name] = "";
                        }
                      }
                    } else {
                      if (itemGroup) {
                        for (let item of itemGroup) {
                          if (item.codeOfValues) {
                            col[item.item_name] = item.codeOfValues;
                          } else if (item.value) {
                            col[item.item_name] = item.value;
                          } else {
                            col[item.item_name] = "";
                          }
                        }
                      }
                    }
                  }
                  wsdp.push(col);
                  wsdptp.push(coltp);
                }

                if (frameName) {
                  let obj = {
                    wsdp: wsdp,
                    wsdptp: wsdptp
                  }
                  return obj;
                }

              } else {

                for (let framedata of tableRows) {
                  let col = {};
                  let coltp = {};
                  for (let itemGroup of framedata) {
                    if (itemGroup.Level5) {
                      for (let item of itemGroup.Level5) {
                        if (item.codeOfValues) {
                          col[item.apps_item_seqid] = item.codeOfValues;
                          coltp[item.item_name] = item.codeOfValues;
                        } else if (item.value) {
                          col[item.apps_item_seqid] = item.value;
                          coltp[item.item_name] = item.value;
                        } else {
                          col[item.apps_item_seqid] = "";
                          coltp[item.item_name] = "";
                        }
                      }
                    } else {
                      if (itemGroup) {
                        for (let item of itemGroup) {
                          if (item.codeOfValues) {
                            col[item.apps_item_seqid] = item.codeOfValues;
                            coltp[item.item_name] = item.codeOfValues;
                          } else if (item.value) {
                            col[item.apps_item_seqid] = item.value;
                            coltp[item.item_name] = item.value;
                          } else {
                            col[item.apps_item_seqid] = "";
                            coltp[item.item_name] = "";
                          }
                        }
                      }
                    }
                  }
                  wsdp.push(col);
                  wsdptp.push(coltp);
                }
                if (frameName) {
                  let obj = {
                    wsdp: wsdp,
                    wsdptp: wsdptp
                  }
                  return obj;
                }
              }
            } else {
              let col = {};
              let coltp = {};
              for (let itemGroup of frame.Level4) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (item.codeOfValues) {
                      col[item.apps_item_seqid] = item.codeOfValues;
                      coltp[item.item_name] = item.codeOfValues;
                    } else if (item.value) {
                      col[item.apps_item_seqid] = item.value;
                      coltp[item.item_name] = item.value;
                    } else {
                      col[item.apps_item_seqid] = "";
                      coltp[item.item_name] = "";
                    }
                  }
                }
              }
              wsdp.push(col);
              wsdptp.push(coltp);

              if (frameName) {
                let obj = {
                  wsdp: wsdp,
                  wsdptp: wsdptp
                }
                return obj;
              }
            }
          }
        }
      }

    }
    let obj = {
      wsdp: wsdp,
      wsdptp: wsdptp
    }
    return obj;
  }



  setItemDefaultValue(item, parentComponent) {
    if (item.item_default_value) {
      for (let x in this.userDetails) {
        if (item.item_default_value.toUpperCase() == x.toUpperCase()) {
          item.value = this.userDetails[x];
        }
      }

      var date = new Date();
      // if (this.item.item_type == "T") {
      if (item.item_default_value == "USER_CODE") {
        item.value = this.userDetails.user_code;
        // if (this.userDetails.login_user_flag == 'P') {
        //   this.item.value = "USER_PRT";
        // }
        // if (this.userDetails.login_user_flag == 'R') {
        //   this.item.value = "USER_DLR";
        // } else if (this.userDetails.login_user_flag == 'E') {
        //   this.item.value = this.userDetails.user_code;
        // }
      } else if (item.item_default_value == "LOGIN_ACC_CODE") {
        item.value = this.userDetails.login_acc_code;
      } else if (item.item_default_value == "LOGIN_ACC_NAME") {
        item.value = this.userDetails.login_acc_name;
      } else if (item.item_default_value == "DEVICE_ID") {
        if (this.device.uuid) {
          item.value = this.device.uuid;
        } else {
          item.value = "";
        }
      }
      else if (item.item_default_value == "ACC_YEAR") {
        item.value = this.userDetails.acc_year;
      } else if (item.item_default_value == "EMP_CODE") {
        item.value = this.userDetails.emp_code;
      } else if (item.item_default_value == "ENTITY_CODE") {
        item.value = this.userDetails.entity_code;
      } else if (item.item_default_value == "DIV_CODE") {
        item.value = this.userDetails.div_code;
      } else if (item.item_default_value == "PLSQL_L") {
        item.value = sessionStorage.getItem("PLSQL_L");
      } else if (item.item_default_value == "GEO_ORG_CODE") {
        item.value = this.userDetails.geo_org_code;
        // } else if (this.item.item_default_value == "DIV_CODE") {
        //   this.item.value = this.userDetails.division
      } else if (item.item_default_value == "LATITUDE") {
        item.value = this.latitude1;
      } else if (item.item_default_value == "LONGITUDE") {
        item.value = this.longitude1;
      } else if (item.item_default_value == "LOCATION") {

        this.geoCoderLocation(this.latitude1, this.longitude1).then(res => {
          item.value = res;
        }, (error) => {
          item.value = "";
          // alert(JSON.stringify(error))
        });

        if (item.value == undefined) {
          item.value = "";
        }

      } else if (item.item_default_value == "SYSDATE") {
        let val: any;
        /* if (this.item.item_visible_flag == "T") { */
        // this.item.value = ("0" + date.getDate()).slice(-2)+ "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getFullYear();
        let valD = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
          ("0" + date.getDate()).slice(-2);
        item.value = this.formatDate(valD, 'dd-MMM-yyyy');
        ///  this.item.value = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
        /*  }
         if (this.item.item_visible_flag == "F") {
           this.item.value = ("0" + date.getDate()).slice(-2) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getFullYear();
         } */


      } else if (item.item_default_value == "SYSTIME") {
        item.value = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
      } else if (item.item_default_value == "INDEX") {

      } else if (item.item_default_value == "SYSDATETIME") {
        let valDT = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
          ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
        item.value = this.formatDate(valDT, "dd-MMM-yyyy HH:mm:ss");
      } else if (item.item_default_value == "BATTERY_STATUS") {
        const subscription = this.batteryStatus.onChange().subscribe(status => {
          item.value = status.level;
        });
        subscription.unsubscribe();
      }
      else {
        if (item.value) {
          /*null;*/
        } else {
          if (item.item_default_value.charAt(0) == 'G' && item.item_default_value.charAt(1) == '_') {
            item.value = '';
          } else {
            item.value = item.item_default_value;
          }
        }
      }
    }


    if (this.callingPara.length > 0) {
      for (let glob of this.callingPara) {
        if (parentComponent.wscp_send_input && parentComponent.wscp_send_input.apps_item_seqid && ((glob.objectCode == item.apps_page_frame_seqid.split("-")[0]) && (glob.itemCode == parentComponent.wscp_send_input.apps_item_seqid) && !glob.rowIndex)) {
          for (let c of glob.itmData) {
            if (c.indexOf(":=") > -1) {
              let itmName = c.split(':=');
              if (itmName[0].indexOf(".") > -1) {
                if (itmName[0].split(".")[1].toLowerCase() == item.item_name.toLowerCase()) {
                  item.value = itmName[1];
                }
              } else {
                if (itmName[0].toLowerCase() == item.item_name.toLowerCase()) {
                  item.value = itmName[1];
                }
              }
            }
          }
        }
      }
    }

    if (this.newFormInstanceArr.length > 0) {
      let glob = this.newFormInstanceArr.find(x => x.objCode == parentComponent.frame.object_code);

      if (glob && glob.newInst[item.item_name.toLowerCase()]) {
        item.value = glob.newInst[item.item_name.toLowerCase()];
      }
    }

    if (item.value == undefined) {
      item.value = item.item_default_value;
    }


  }




  // mirrorItems(event) {
  //   for (let object of this.object_mast.Level2) {
  //     for (let frame of object.Level3) {
  //       if (frame.tableRows) {
  //         if( < ){
  //         for (let tableData of frame.tableRows) {
  //           for (let itemGroup of tableData) {
  //             if (itemGroup.Level5) {
  //               for (let item of itemGroup.Level5) {
  //                 if (item.mirror_item_seqid) {
  //                   for (let fromObj of this.object_mast.Level2) {
  //                     for (let fromFrame of fromObj.Level3) {
  //                       if (!event.itemIndex) {
  //                         event.itemIndex = 0;
  //                       }
  //                       console.log(event.itemIndex);

  //                       //  let frameLevel4 = fromFrame.tableRows[event.itemIndex];
  //                       if (fromFrame.tableRows) {
  //                         let i = 0;
  //                         for (let frameLevel4 of fromFrame.tableRows) {
  //                           for (let fromItemGroup of frameLevel4) {
  //                             if (fromItemGroup.Level5) {
  //                               for (let fromItem of fromItemGroup.Level5) {
  //                                 if ((item.mirror_item_seqid == fromItem.apps_item_seqid) && (i == event.itemIndex)) {
  //                                   item.value = fromItem.value;
  //                                 }
  //                               }
  //                             } else {
  //                               if (fromItemGroup) {
  //                                 for (let fromItem of fromItemGroup) {
  //                                   if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                                     item.value = fromItem.value;
  //                                   }
  //                                 }
  //                               }
  //                             }
  //                           }
  //                           i++
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             } else {
  //               if (itemGroup) {
  //                 for (let item of itemGroup) {
  //                   if (item.mirror_item_seqid) {
  //                     for (let fromObj of this.object_mast.Level2) {
  //                       for (let fromFrame of fromObj.Level3) {
  //                         if (!event.itemIndex) {
  //                           event.itemIndex = 0;
  //                         }

  //                         if (fromFrame.tableRows) {
  //                           let i = 0;
  //                           for (let frameLevel4 of fromFrame.tableRows) {
  //                             for (let fromItemGroup of frameLevel4) {
  //                               if (fromItemGroup.Level5) {
  //                                 for (let fromItem of fromItemGroup.Level5) {
  //                                   if ((item.mirror_item_seqid == fromItem.apps_item_seqid) && (i == event.itemIndex)) {
  //                                     item.value = fromItem.value;
  //                                   }
  //                                 }
  //                               } else {
  //                                 if (fromItemGroup) {
  //                                   for (let fromItem of fromItemGroup) {
  //                                     if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                                       item.value = fromItem.value;
  //                                     }
  //                                   }
  //                                 }
  //                               }
  //                             }
  //                             i++
  //                           }
  //                         }

  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //       }

  //       else {
  //         let tableRows = [];
  //         let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
  //         for (let itemGroup of frameLevel4) {
  //           if (itemGroup.Level5) {
  //             for (let item of itemGroup.Level5) {
  //               if (item.mirror_item_seqid) {
  //                 for (let fromObj of this.object_mast.Level2) {
  //                   for (let fromFrame of fromObj.Level3) {

  //                       if (fromFrame.tableRows) {
  //                         let i = 0;
  //                         for (let frameLevel4 of fromFrame.tableRows) {
  //                           for (let fromItemGroup of frameLevel4) {
  //                             if (fromItemGroup.Level5) {
  //                               for (let fromItem of fromItemGroup.Level5) {
  //                                 if ((item.mirror_item_seqid == fromItem.apps_item_seqid) && (i == event.itemIndex)) {
  //                                   item.value = fromItem.value;
  //                                 }
  //                               }
  //                             } else {
  //                               if (fromItemGroup) {
  //                                 for (let fromItem of fromItemGroup) {
  //                                   if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                                     item.value = fromItem.value;
  //                                   }
  //                                 }
  //                               }
  //                             }
  //                           }
  //                           i++
  //                         }
  //                       }
  //                   }
  //                 }
  //                 tableRows[0] = frameLevel4;

  //               }
  //             }
  //           } else {
  //             if (itemGroup) {
  //               for (let item of itemGroup) {
  //                 if (item.mirror_item_seqid) {
  //                   for (let fromObj of this.object_mast.Level2) {
  //                     for (let fromFrame of fromObj.Level3) {

  //                       if (fromFrame.tableRows) {
  //                         let i = 0;
  //                         for (let frameLevel4 of fromFrame.tableRows) {
  //                           for (let fromItemGroup of frameLevel4) {
  //                             if (fromItemGroup.Level5) {
  //                               for (let fromItem of fromItemGroup.Level5) {
  //                                 if ((item.mirror_item_seqid == fromItem.apps_item_seqid) && (i == event.itemIndex)) {
  //                                   item.value = fromItem.value;
  //                                 }
  //                               }
  //                             } else {
  //                               if (fromItemGroup) {
  //                                 for (let fromItem of fromItemGroup) {
  //                                   if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                                     item.value = fromItem.value;
  //                                   }
  //                                 }
  //                               }
  //                             }
  //                           }
  //                           i++
  //                         }
  //                       }


  //                     }
  //                   }
  //                   tableRows[0] = frameLevel4;
  //                 }
  //               }
  //             }
  //           }
  //         }
  //         if (tableRows.length > 0) {
  //           frame.tableRows = tableRows;
  //         }
  //       }
  //     }
  //   }
  // }

  // async showDeveloperData(developerModeData){
  //   const modal = await this.modalController.create({
  //     component: DeveloperModeLogPage,
  //     cssClass: 'my-custom-class',
  //     componentProps: {
  //       data: developerModeData
  //     }
  //   });
  //   return await modal.present();

  // }



  // ----------Getting Code-Value pair from String (code~value$$code~value)

  //---------------------------------------------Demo Data---------------------------------------------------------------//
  public jsonData: any =
    { "responseStatus": "success", "responseMsg": null, "responseData": { "Level1_Keys": ["object_code", "object_name", "apps_code_str", "home_object_code", "apps_code", "apps_type", "apps_name", "operation_mode_str", "apps_working_mode", "apps_page_nos", "tnature_str", "Level2"], "Level2_Keys": ["object_code", "apps_page_no", "apps_page_name", "apps_page_type", "db_table_name", "db_table_pkey", "Level3"], "Level3_Keys": ["apps_page_frame_seqid", "object_code", "apps_page_no", "apps_frame_seqno", "apps_page_frame_name", "apps_frame_type", "createddate", "closeddate", "flag", "no_of_records", "on_frame_load_str", "Level4"], "Level4_Keys": ["object_code", "apps_page_no", "apps_page_frame_seqid", "apps_item_seqid", "design_control_type", "Level5"], "Level5_Keys": ["apps_page_no", "apps_page_frame_seqid", "apps_item_seqid", "parent_item_seqid", "item_name", "prompt_name", "item_db_name", "item_seqno", "datatype", "item_type", "item_size", "format_mask", "item_default_value", "data_required_flag", "item_visible_flag", "item_enable_flag", "from_value", "to_value", "tool_tip", "display_setting_str", "formula_str", "session_hold_flag", "calling_object_code", "calling_pageno", "calling_parameter_str", "user_code", "lastupdate", "flag", "associate_page_frame_seqid", "db_table_name", "mirror_item_seqid", "apps_frame_seqno", "design_control_type", "lov_code", "item_sub_type", "click_events_str", "object_code", "item_filter_flag", "calling_frame_seqid_str", "group_no_str", "aliases"], "Values": [["SALE-CONT1", "Sale Contract", "#EMP_DR#", "EMP_DR_HP", "EMP_DR", "M", "Employee Reporting", null, "P", "2", null, [["SALE-CONT1", "1", "Sales Contract", null, null, null, [["50", "SALE-CONT1", "1", "1", "Sale Contract", "CANVAS", "10-MAY-19", null, null, null, null, [["SALE-CONT1", "1", "50", "246", null, [["1", "50", "246", null, "SERIES", "SERIES", "SERIES", "1", "VARCHAR2", "L", "20", null, null, "F", "T", "D", null, null, null, null, null, "P", null, null, null, "SHASHANK", "06-MAY-19", null, null, null, null, null, null, "FIND_SERIES_SC", null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "247", null, "EMP_CODE", "EMP_CODE", "EMP_CODE", "2", "VARCHAR2", "T", "100", null, "EMP_CODE", "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "07-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "248", null, "ENTITY_CODE", "Entity Code", "ENTITY_CODE", "3", "VARCHAR2", "T", "20", null, "M3", "F", "F", "T", null, null, "Entity Code", null, null, "F", null, null, null, "SHASHANK", "08-MAY-19", null, null, null, null, null, null, null, "D", null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "249", null, "TCODE", "TCode", "TCODE", "4", "VARCHAR2", "T", "20", null, "E", "F", "F", "T", null, null, "TCode", null, null, "F", null, null, null, "SHASHANK", "09-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "250", null, "VRNO", "VRNO", "VRNO", "5", "VARCHAR2", "T", "100", null, null, "T", "F", "T", null, null, "VRNO", null, null, "F", null, null, null, "SHASHANK", "10-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "255", null, [["1", "50", "255", null, "ACC_CODE", "Party", "ACC_CODE", "9", "VARCHAR2", "L", "100", null, null, "F", "T", "T", null, null, "Party Name", null, null, "PHB", null, null, null, "SHASHANK", "15-MAY-19", null, null, null, null, null, null, "FIND_PARTY_SC", null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "254", null, "CURRENCY_CODE", "Curency Code", "CURRENCY_CODE", "11", "VARCHAR2", "T", "20", null, "INR", "F", "F", "T", null, null, "Currency Code", null, null, "F", null, null, null, "SHASHANK", "14-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "257", null, "DIV_CODE", "DIV_CODE", "DIV_CODE", "12", "VARCHAR2", "L", "100", null, null, "T", "F", "D", null, null, null, null, null, "T", null, null, null, "SHASHANK", "17-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "258", null, "LASTUPDATE", "LASTUPDATE", "LASTUPDATE", "13", "DATETIME", "DT", "100", null, "sysdate", "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "18-MAY-19", null, null, null, null, null, null, null, "DT", null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "259", null, "EXCHANGE_RATE", "Exchange Rate", "EXCHANGE_RATE", "14", "VARCHAR2", "T", "100", null, "1", "F", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "19-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "262", null, "USER_CODE", "User Code", "USER_CODE", "14", "VARCHAR2", "DD", "100", null, "USER_CODE", "F", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "22-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "364", null, "STAX_CODEFOR", "CODEFOR", "STAX_CODEFOR", "15", "VARCHAR2", "T", "100", null, null, "F", "F", "F", null, null, "CodeFor", null, null, "PHB", null, null, null, "SHASHANK", "01-SEP-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "365", null, [["1", "50", "365", null, "PAYMENT_MODE", "Payment Mode", "PAYMENT_MODE", "15", "VARCHAR2", "DD", "100", null, null, "F", "T", "T", null, null, "CodeFor", null, null, "F", null, null, null, "SHASHANK", "02-SEP-19", null, null, null, null, null, null, "DD_PAYMENT_MODE", null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "261", null, [["1", "50", "261", null, "ADDON_CODE", "ADDON", "ADDON_CODE", "16", "VARCHAR2", "DD", "100", null, null, "F", "T", "T", null, null, "Addon ", null, null, "P", null, null, null, "SHASHANK", "21-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "263", null, [["1", "50", "263", null, "FREIGHT_BASIS", "Freight Basis", "FREIGHT_BASIS", "19", "VARCHAR2", "DD", "100", null, null, "F", "T", "T", null, null, "Frieght Basis", null, null, "F", null, null, null, "SHASHANK", "23-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "264", null, "AMENDNO", "AMENDNO", "AMENDNO", "20", "VARCHAR2", "T", "100", null, "0", "F", "F", "T", null, null, "Entity Code", null, null, "F", null, null, null, "SHASHANK", "24-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "265", null, "AMENDDATE", "AMENDDATE", "AMENDDATE", "21", "DATETIME", "T", "100", null, "sysdate", "T", "F", "T", null, null, "AMENDDATE", null, null, "F", null, null, null, "SHASHANK", "25-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "266", null, [["1", "50", "266", null, "TRANTYPE", "Sale Type", "TRANTYPE", "22", "VARCHAR2", "DD", "50", null, null, "F", "T", "T", null, null, "Trantyppe", null, null, "F", null, null, null, "SHASHANK", "26-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "268", null, [["1", "50", "268", null, "FREIGHT_RATE", "Freight Rate", "FREIGHT_RATE", "24", "NUMBER", "N", "100", null, null, "T", "T", "T", null, null, "Freight Rate", null, null, "F", null, null, null, "SHASHANK", "28-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "269", null, [["1", "50", "269", null, "BROKERAGE_BASIS", "Brokerage Basis", "BROKERAGE_BASIS", "25", "VARCHAR2", "DD", "100", null, null, "T", "T", "T", null, null, "Trantyppe", null, null, "F", null, null, null, "SHASHANK", "29-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "270", null, [["1", "50", "270", null, "PAYMENT_DUEDAYS", "Payment duedays", "PAYMENT_DUEDAYS", "26", "NUMBER", "T", "100", null, null, "T", "T", "T", null, null, "Payment DueDays", null, null, "F", null, null, null, "SHASHANK", "30-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "271", null, [["1", "50", "271", null, "VALIDUPTO_DATE", "Valid up to date", "VALIDUPTO_DATE", "27", "DATE", "DT", "100", null, null, "T", "T", "T", null, null, "Valid up to", null, null, "F", null, null, null, "SHASHANK", "31-MAY-19", null, null, null, null, null, null, null, "D", null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "272", null, [["1", "50", "272", null, "DELIVERY_FROM_SLNO", "Delivery From", "DELIVERY_FROM_SLNO", "28", "VARCHAR2", "DD", "100", null, null, "T", "T", "T", null, null, "Delivery from slno", null, null, "F", null, null, null, "SHASHANK", "01-JUN-19", null, null, null, null, null, null, "FIND_DELIVERY_FROM_SLNO", null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "273", null, [["1", "50", "273", null, "DELIVERY_TO_SLNO", "Delivery To", "DELIVERY_TO_SLNO", "29", "VARCHAR2", "DD", "100", null, null, "T", "T", "T", null, null, "Delivery to slno", null, null, "F", null, null, null, "SHASHANK", "02-JUN-19", null, null, null, null, null, null, "FIND_DELIVERY_TO_SLNO", null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "260", null, [["1", "50", "260", null, "STAX_CODE", "Tax Code", "STAX_CODE", "29.2", "VARCHAR2", "DD", "100", null, null, "F", "T", "T", null, null, "Stax Code", null, null, "PHB", null, null, null, "SHASHANK", "20-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "274", null, [["1", "50", "274", null, "BROKER_CODE", "Broker Code", "BROKER_CODE", "30", "VARCHAR2", "L", "100", null, null, "T", "T", "T", null, null, "Broker Code", null, null, "T", null, null, null, "SHASHANK", "03-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "275", null, "IRFIELD1", "irfield1", "IRFIELD1", "31", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "04-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "267", null, [["1", "50", "267", null, "ENTRY_REMARK", "Entry Remark ", "ENTRY_REMARK", "31", "VARCHAR2", "T", "100", null, null, "T", "T", "T", null, null, "Entry Remark", null, null, "F", null, null, null, "SHASHANK", "27-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "428", null, [["1", "50", "428", null, "NEXT_BUTTON", "NEXT PAGE", null, "31.1", "BUTTON", "BT", "40", null, null, "T", "T", "T", null, null, null, null, null, null, "EMP_DR_HP", "2", null, "SHASHANK", "06-MAY-19", null, null, null, null, null, null, null, "SIMPLE_TEXT_BUTTON", "NEXT_PAGE", "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "276", null, "IRFIELD2", "irfield2", "IRFIELD2", "32", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "05-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "277", null, "IRFIELD3", "irfield3", "IRFIELD3", "33", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "06-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "278", null, "IRFIELD4", "irfield4", "IRFIELD4", "34", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "07-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "279", null, "IRFIELD5", "irfield5", "IRFIELD5", "35", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "08-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "280", null, "IRFIELD6", "irfield6", "IRFIELD6", "36", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "09-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "281", null, "IRFIELD7", "irfield7", "IRFIELD7", "37", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "10-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "282", null, "IRFIELD8", "irfield8", "IRFIELD8", "38", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "11-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "283", null, "IRFIELD9", "irfield9", "IRFIELD9", "39", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "12-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "284", null, "IRFIELD10", "irfield10", "IRFIELD10", "40", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "13-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "285", null, "IRFIELD11", "irfield11", "IRFIELD11", "41", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "14-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "286", null, "IRFIELD12", "irfield12", "IRFIELD12", "42", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "15-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "287", null, "IRFIELD13", "irfield13", "IRFIELD13", "43", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "16-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "288", null, "IRFIELD14", "irfield14", "IRFIELD14", "44", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "17-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "289", null, "IRFIELD15", "irfield15", "IRFIELD15", "45", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "18-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "290", null, "IRFIELD16", "irfield16", "IRFIELD16", "46", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "19-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "291", null, "IRFIELD17", "irfield17", "IRFIELD17", "47", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "20-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "292", null, "IRFIELD18", "irfield18", "IRFIELD18", "48", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "21-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "293", null, "IRFIELD19", "irfield19", "IRFIELD19", "49", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "22-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "294", null, "IRFIELD20", "irfield20", "IRFIELD20", "50", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "23-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "295", null, "DRAMT", "DRAMT", "DRAMT", "51", "VARCHAR2", "T", "51", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "24-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "296", null, "AFCODE2", "afcode2", "AFCODE2", "53", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "25-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "297", null, "AFCODE3", "afcode3", "AFCODE3", "54", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "26-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "298", null, "AFCODE4", "afcode4", "AFCODE4", "55", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "27-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "299", null, "AFCODE5", "afcode5", "AFCODE5", "56", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "28-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "300", null, "AFCODE6", "afcode6", "AFCODE6", "57", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "29-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "301", null, "AFCODE7", "afcode7", "AFCODE7", "58", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "30-JUN-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "302", null, "AFCODE8", "afcode8", "AFCODE8", "59", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "01-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "303", null, "AFCODE9", "afcode9", "AFCODE9", "60", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "02-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "304", null, "AFCODE10", "afcode10", "AFCODE10", "61", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "03-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "305", null, "AFCODE11", "afcode11", "AFCODE11", "62", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "04-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "306", null, "AFCODE12", "afcode12", "AFCODE12", "63", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "05-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "307", null, "AFCODE13", "afcode13", "AFCODE13", "64", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "06-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "308", null, "AFCODE14", "afcode14", "AFCODE14", "65", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "07-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "309", null, "AFCODE15", "afcode15", "AFCODE15", "66", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "08-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "310", null, "AFCODE16", "afcode16", "AFCODE16", "67", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "09-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "311", null, "AFCODE17", "afcode17", "AFCODE17", "68", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "10-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "312", null, "AFCODE18", "afcode18", "AFCODE18", "69", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "11-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "313", null, "AFRATE2", "afrate2", "AFRATE2", "71", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "12-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "314", null, "AFRATE3", "afrate3", "AFRATE3", "72", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "13-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "315", null, "AFRATE4", "afrate4", "AFRATE4", "73", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "14-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "316", null, "AFRATE5", "afrate5", "AFRATE5", "74", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "15-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "317", null, "AFRATE6", "afrate6", "AFRATE6", "75", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "16-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "318", null, "AFRATE7", "afrate7", "AFRATE7", "76", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "17-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "319", null, "AFRATE8", "afrate8", "AFRATE8", "77", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "18-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "320", null, "AFRATE9", "afrate9", "AFRATE9", "78", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "19-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "321", null, "AFRATE10", "afrate10", "AFRATE10", "79", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "20-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "322", null, "AFRATE11", "afrate11", "AFRATE11", "80", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "21-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "323", null, "AFRATE12", "afrate12", "AFRATE12", "81", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "22-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "324", null, "AFRATE13", "afrate13", "AFRATE13", "82", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "23-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "325", null, "AFRATE14", "afrate14", "AFRATE14", "83", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "24-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "326", null, "AFRATE15", "afrate15", "AFRATE15", "84", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "25-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "327", null, "AFRATE16", "afrate16", "AFRATE16", "85", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "26-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "328", null, "AFRATE17", "afrate17", "AFRATE17", "86", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "27-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "329", null, "AFRATE18", "afrate18", "AFRATE18", "87", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "28-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "330", null, "AFLOGIC2", "aflogic2", "AFLOGIC2", "89", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "29-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "347", null, "AFRATEI2", "afrateI2", "AFRATEI2", "89", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "15-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "331", null, "AFLOGIC3", "aflogic3", "AFLOGIC3", "90", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "30-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "348", null, "AFRATEI3", "afrateI3", "AFRATEI3", "90", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "16-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "332", null, "AFLOGIC4", "aflogic4", "AFLOGIC4", "91", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "31-JUL-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "349", null, "AFRATEI4", "afrateI4", "AFRATEI4", "91", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "17-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "333", null, "AFLOGIC5", "aflogic5", "AFLOGIC5", "92", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "01-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "350", null, "AFRATEI5", "afrateI5", "AFRATEI5", "92", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "18-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "334", null, "AFLOGIC6", "aflogic6", "AFLOGIC6", "93", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "02-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "351", null, "AFRATEI6", "afrateI6", "AFRATEI6", "93", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "19-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "352", null, "AFRATEI7", "afrateI7", "AFRATEI7", "94", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "20-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "335", null, "AFLOGIC7", "aflogic7", "AFLOGIC7", "94", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "03-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "336", null, "AFLOGIC8", "aflogic8", "AFLOGIC8", "95", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "04-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "353", null, "AFRATEI8", "afrateI8", "AFRATEI8", "95", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "21-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "337", null, "AFLOGIC9", "aflogic9", "AFLOGIC9", "96", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "05-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "354", null, "AFRATEI9", "afrateI9", "AFRATEI9", "96", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "22-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "338", null, "AFLOGIC10", "aflogic10", "AFLOGIC10", "97", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "06-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "355", null, "AFRATEI10", "afrateI10", "AFRATEI10", "97", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "23-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "339", null, "AFLOGIC11", "aflogic11", "AFLOGIC11", "98", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "07-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "356", null, "AFRATEI11", "afrateI11", "AFRATEI11", "98", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "24-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "340", null, "AFLOGIC12", "aflogic12", "AFLOGIC12", "99", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "08-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "357", null, "AFRATEI12", "afrateI12", "AFRATEI12", "99", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "25-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "341", null, "AFLOGIC13", "aflogic13", "AFLOGIC13", "100", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "09-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "358", null, "AFRATEI13", "afrateI13", "AFRATEI13", "100", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "26-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "342", null, "AFLOGIC14", "aflogic14", "AFLOGIC14", "101", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "10-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "359", null, "AFRATEI14", "afrateI14", "AFRATEI14", "101", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "27-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "360", null, "AFRATEI15", "afrateI15", "AFRATEI15", "102", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "28-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "343", null, "AFLOGIC15", "aflogic15", "AFLOGIC15", "102", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "11-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "344", null, "AFLOGIC16", "aflogic16", "AFLOGIC16", "103", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "12-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "361", null, "AFRATEI16", "afrateI16", "AFRATEI16", "103", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "29-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "362", null, "AFRATEI17", "afrateI17", "AFRATEI17", "104", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "30-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "345", null, "AFLOGIC17", "aflogic17", "AFLOGIC17", "104", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "13-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "363", null, "AFRATEI18", "afrateI18", "AFRATEI18", "105", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "31-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["1", "50", "346", null, "AFLOGIC18", "aflogic18", "AFLOGIC18", "105", "VARCHAR2", "T", "200", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, "SHASHANK", "14-AUG-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "252", null, "CONSIGNEE_CODE", "Consignee Name", "CONSIGNEE_CODE", "123", "VARCHAR2", "T", "50", null, null, "F", "F", "T", null, null, "Consignee Name", null, null, "F", null, null, null, "SHASHANK", "12-MAY-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "366", null, "APPROVEDDATE", "APPROVEDDATE", "APPROVEDDATE", "125", "DATETIME", "T", "100", null, null, "T", "F", "F", null, null, null, null, null, "F", null, null, null, "SHASHANK", "03-SEP-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "1", "50", "1", null, [["1", "50", "367", null, "APPROVEDBY", "APPROVEDBY", "APPROVEDBY", "126", "VARCHAR2", "T", "100", null, null, "F", "F", "F", null, null, null, null, null, "F", null, null, null, "SHASHANK", "04-SEP-19", null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]]]]]], ["SALE-CONT1", "2", "Order Body", null, null, null, [["51", "SALE-CONT1", "2", "1", "Sale Contract", "CANVAS", "10-MAY-19", null, null, null, null, [["SALE-CONT1", "2", "51", "1", null, [["2", "51", "368", null, "ACC_CODE", "Party Name", "ACC_CODE", "1", "VARCHAR2", "T", "10000", null, null, "F", "F", "D", null, null, "Acc code", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "369", null, "CURRENCY_CODE", "Curency Code", "CURRENCY_CODE", "2", "VARCHAR2", "T", "20", null, null, "F", "F", "D", null, null, "Currency Code", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "386", null, "item_category", "ITEM CATG", "item_category", "3", "VARCHAR2", "T", "100", null, null, "T", "F", "D", null, null, "Entity Code", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["2", "51", "370", null, "ENTITY_CODE", "Entity Code", "ENTITY_CODE", "3", "VARCHAR2", "T", "20", null, "M3", "F", "F", "T", null, null, "Entity Code", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "371", null, "TCODE", "TCode", "TCODE", "4", "VARCHAR2", "T", "20", null, "E", "F", "F", "T", null, null, "TCode", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "372", null, "VRNO", "VRNO", "VRNO", "5", "VARCHAR2", "T", "20", null, null, "T", "F", "T", null, null, "VRNO", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "373", null, "VRDATE", "VRDATE", "VRDATE", "6", "DATETIME", "T", "50", null, "sysdate", "F", "F", "T", null, null, "VRDATE", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "374", null, "SLNO", "SLNO", "SLNO", "7", "NUMBER", "T", "20", null, null, "T", "F", "T", null, null, "VRNO", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "375", null, "DEPT_CODE", "Party", "DEPT_CODE", "8", "VARCHAR2", "T", "100", null, null, "T", "F", "T", null, null, "Retailer Name", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "376", null, "CONTRACT_SLNO", "SLNO", "CONTRACT_SLNO", "9", "NUMBER", "T", "20", null, null, "F", "F", "T", null, null, "VRNO", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "420", null, "AMENDNO", "AMENDNO", "AMENDNO", "10", "VARCHAR2", "T", "20", null, "0", "F", "F", "T", null, null, "Amendno", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "378", null, [["2", "51", "378", null, "ITEM_CODE", "Listed  Item  Name", "ITEM_CODE", "11", "VARCHAR2", "L", "200", null, null, "F", "T", "T", null, null, "Select Item", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "423", null, "CURRENCY_CODE", "Curency Code", "CURRENCY_CODE", "11", "VARCHAR2", "T", "20", null, "INR", "F", "F", "D", null, null, "Currency Code", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "380", null, [["2", "51", "380", null, "AQTYORDER", "Quantity", "AQTYORDER", "12", "NUMBER", "N", "30", null, null, "F", "T", "T", null, null, "Quantity", null, null, "P", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "379", null, [["2", "51", "379", null, "FC_RATE", "Rate", "FC_RATE", "14", "NUMBER", "N", "30", null, null, "F", "T", "T", null, null, "Rate", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "389", null, "TAX_RATE1", "Tax Rate1", "TAX_RATE1", "16", "VARCHAR2", "T", "100", null, null, "T", "F", "T", null, null, "Stax Rate", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "392", null, "TAX_AMOUNT1", "Tax Amount", "TAX_AMOUNT1", "17", "NUMBER", "N", "30", null, null, "T", "F", "T", null, null, "Tax Amount", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "387", null, "AUM", "AUM", "AUM", "18", "VARCHAR2", "T", "30", null, null, "T", "F", "T", null, null, "UM", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "383", null, [["2", "51", "383", null, "TOLERANCE_BASIS", "Tolerance Basis", "TOLERANCE_BASIS", "19", "VARCHAR2", "DD", "50", null, null, "T", "T", "T", null, null, "Tolarnce Basis", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "388", null, [["2", "51", "388", null, "TOLERANCE_QTY", "Tolarnce Qty", "TOLERANCE_QTY", "20", "NUMBER", "T", "100", null, null, "T", "T", "T", null, null, "Tolarance quantity", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "384", null, [["2", "51", "384", null, "DIV_CODE", "DIV_CODE", "DIV_CODE", "22", "VARCHAR2", "L", "50", null, "SM", "T", "T", "T", null, null, null, null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "390", null, "STAX_CODE", "STax Code", "STAX_CODE", "23", "VARCHAR2", "T", "50", null, null, "T", "F", "D", null, null, "Stax Code", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "391", null, [["2", "51", "391", null, "IRATE", "Discount", "IRATE", "24", "NUMBER", "N", "30", null, null, "T", "T", "F", null, null, "Discount", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "377", null, [["2", "51", "377", null, "REMARK", "Remark", "REMARK", "25", "VARCHAR2", "T", "100", null, null, "T", "T", "T", null, null, "Remark", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "464", null, [["2", "51", "464", null, "ADD_ITEM", "Add-Item", null, "25.1", "VARCHAR2", "BT", "100", null, null, "T", "T", "T", null, null, null, null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, "SIMPLE_TEXT_BUTTON", "ADD_ITEM", "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "531", null, [["2", "51", "531", null, "ADD_ITEM", "NEXT PAGE", null, "25.2", "VARCHAR2", "BT", "100", null, null, "T", "T", "T", null, null, null, null, null, "T", "EMP_DR_HP", "3", null, null, null, null, null, null, null, null, null, null, "SIMPLE_TEXT_BUTTON", "NEXT_PAGE", "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "394", null, "AFIELD1", "afield1", "AFIELD1", "32", "NUMBER", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "395", null, "AFIELD10", "afield10", "AFIELD10", "33", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "396", null, "AFIELD11", "afield11", "AFIELD11", "34", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "397", null, "AFIELD12", "afield12", "AFIELD12", "35", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "398", null, "AFIELD13", "afield13", "AFIELD13", "36", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "399", null, "AFIELD14", "afield14", "AFIELD14", "37", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "400", null, "AFIELD15", "afield15", "AFIELD15", "38", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "401", null, "AFIELD16", "afield16", "AFIELD16", "39", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "402", null, "AFIELD17", "afield17", "AFIELD17", "40", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "403", null, "AFIELD18", "afield18", "AFIELD18", "41", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "404", null, "AFIELD2", "afield2", "AFIELD2", "42", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "405", null, "AFIELD3", "afield3", "AFIELD3", "43", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "406", null, "AFIELD4", "afield4", "AFIELD4", "44", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "407", null, "AFIELD5", "afield5", "AFIELD5", "45", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "408", null, "AFIELD6", "afield6", "AFIELD6", "46", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "409", null, "AFIELD7", "afield7", "AFIELD7", "47", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "410", null, "AFIELD8", "afield8", "AFIELD8", "48", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "412", null, "DRAMT", "DRAMT", "DRAMT", "49", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["2", "51", "411", null, "AFIELD9", "afield9", "AFIELD9", "49", "VARCHAR2", "T", "50", null, null, "T", "F", "T", null, null, null, null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "413", null, "AUMTOUM", "Aumtoum", "AUMTOUM", "51", "VARCHAR2", "T", "20", null, "1", "F", "F", "T", null, null, "Entity Code", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "414", null, "TAX_AMOUNT", "Tax Amount123", "TAX_AMOUNT", "52", "NUMBER", "N", "30", null, null, "T", "F", "T", null, null, "Tax Amount", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "415", null, "TAX_RATE", "Tax Rate", "TAX_RATE", "53", "VARCHAR2", "T", "100", null, null, "T", "F", "T", null, null, "Stax Rate", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "416", null, "ARATE", "ARATE", "ARATE", "54", "NUMBER", "T", "30", null, "0", "T", "F", "T", null, null, "Total", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "417", null, "RATE", "Rate", "RATE", "55", "NUMBER", "T", "30", null, null, "T", "F", "T", null, null, "Total", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "418", null, "QTYORDER", "Quantity", "QTYORDER", "56", "NUMBER", "N", "30", null, null, "F", "F", "T", null, null, "Quantity", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["2", "51", "422", null, "COST_CODE", "COST_CODE", "COST_CODE", "56", "VARCHAR2", "T", "30", null, "MAPL", "F", "F", "T", null, null, "Quantity", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "419", null, "RATE_UM", "Rate_um", "RATE_UM", "57", "VARCHAR2", "T", "31", null, null, "T", "F", "T", null, null, "UM", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "385", null, "GST_CODE", "GST_CODE", "GST_CODE", "58", "VARCHAR2", "T", "31", null, null, "T", "F", "T", null, null, "GST_CODE", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "51", "1", null, [["2", "51", "421", null, "DELIVERY_TO_SLNO", "Delivery To slno", "DELIVERY_TO_SLNO", "59", "VARCHAR2", "T", "100", null, null, "T", "F", "D", null, null, "Delivery to slno", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]]]], ["142", "SALE-CONT1", "2", "2", "Items", "CARD", null, null, null, null, null, [["SALE-CONT1", "2", "142", "1", null, [["2", "142", "525", null, "ACC_CODE", "Party Name", "ACC_CODE", "1", "VARCHAR2", "TEXT", "10000", null, null, "F", "F", "D", null, null, "Acc code", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "465", null, "CURRENCY_CODE", "Curency Code", "CURRENCY_CODE", "2", "VARCHAR2", "TEXT", "20", null, null, "F", "F", "D", null, null, "Currency Code", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "466", null, "item_category", "ITEM CATG", "item_category", "3", "VARCHAR2", "TEXT", "100", null, null, "T", "F", "D", null, null, "Entity Code", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null], ["2", "142", "467", null, "ENTITY_CODE", "Entity Code", "ENTITY_CODE", "3", "VARCHAR2", "TEXT", "20", null, "M3", "F", "F", "T", null, null, "Entity Code", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "468", null, "TCODE", "TCode", "TCODE", "4", "VARCHAR2", "TEXT", "20", null, "E", "F", "F", "T", null, null, "TCode", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "469", null, "VRNO", "VRNO", "VRNO", "5", "VARCHAR2", "TEXT", "20", null, null, "T", "F", "T", null, null, "VRNO", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "470", null, "VRDATE", "VRDATE", "VRDATE", "6", "DATETIME", "TEXT", "50", null, "sysdate", "F", "F", "T", null, null, "VRDATE", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "471", null, "SLNO", "SLNO", "SLNO", "7", "NUMBER", "TEXT", "20", null, null, "T", "F", "T", null, null, "VRNO", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "472", null, "DEPT_CODE", "Party", "DEPT_CODE", "8", "VARCHAR2", "TEXT", "100", null, null, "T", "F", "T", null, null, "Retailer Name", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "473", null, "CONTRACT_SLNO", "SLNO", "CONTRACT_SLNO", "9", "NUMBER", "TEXT", "20", null, null, "F", "F", "T", null, null, "VRNO", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "474", null, "AMENDNO", "AMENDNO", "AMENDNO", "10", "VARCHAR2", "TEXT", "20", null, "0", "F", "F", "T", null, null, "Amendno", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "475", null, "CURRENCY_CODE", "Curency Code", "CURRENCY_CODE", "11", "VARCHAR2", "TEXT", "20", null, "INR", "F", "F", "D", null, null, "Currency Code", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "476", null, [["2", "142", "476", null, "ITEM_CODE", "Listed  Item  Name", "ITEM_CODE", "11", "VARCHAR2", "TEXT", "200", null, null, "F", "T", "T", null, null, "Select Item", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "477", null, [["2", "142", "477", null, "AQTYORDER", "Quantity", "AQTYORDER", "12", "NUMBER", "TEXT", "30", null, null, "F", "T", "T", null, null, "Quantity", null, null, "P", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "479", null, [["2", "142", "479", null, "FC_RATE", "Rate", "FC_RATE", "14", "NUMBER", "TEXT", "30", null, null, "F", "T", "T", null, null, "Rate", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "481", null, "TAX_RATE1", "Tax Rate1", "TAX_RATE1", "16", "VARCHAR2", "TEXT", "100", null, null, "T", "F", "T", null, null, "Stax Rate", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "482", null, "TAX_AMOUNT1", "Tax Amount", "TAX_AMOUNT1", "17", "NUMBER", "TEXT", "30", null, null, "T", "F", "T", null, null, "Tax Amount", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "483", null, "AUM", "AUM", "AUM", "18", "VARCHAR2", "TEXT", "30", null, null, "T", "F", "T", null, null, "UM", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "484", null, [["2", "142", "484", null, "TOLERANCE_BASIS", "Tolerance Basis", "TOLERANCE_BASIS", "19", "VARCHAR2", "TEXT", "50", null, null, "T", "T", "T", null, null, "Tolarnce Basis", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "485", null, [["2", "142", "485", null, "TOLERANCE_QTY", "Tolarnce Qty", "TOLERANCE_QTY", "20", "NUMBER", "TEXT", "100", null, null, "T", "T", "T", null, null, "Tolarance quantity", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "487", null, [["2", "142", "487", null, "DIV_CODE", "DIV_CODE", "DIV_CODE", "22", "VARCHAR2", "TEXT", "50", null, "SM", "T", "T", "T", null, null, null, null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "1", null, [["2", "142", "488", null, "STAX_CODE", "STax Code", "STAX_CODE", "23", "VARCHAR2", "TEXT", "50", null, null, "T", "F", "D", null, null, "Stax Code", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "489", null, [["2", "142", "489", null, "IRATE", "Discount", "IRATE", "24", "NUMBER", "TEXT", "30", null, null, "T", "T", "F", null, null, "Discount", null, null, "F", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]], ["SALE-CONT1", "2", "142", "490", null, [["2", "142", "490", null, "REMARK", "Remark", "REMARK", "25", "VARCHAR2", "TEXT", "100", null, null, "T", "T", "T", null, null, "Remark", null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]]]]]], ["SALE-CONT1", "3", "Terms and Conditions", null, null, null, [["143", "SALE-CONT1", "3", "3", "terms and conditios", "CANVAS", null, null, null, null, "frame_sql_populate_data", [["SALE-CONT1", "3", "143", "532", null, [["3", "143", "532", null, "abc", "abc", null, "1", "VARCHAR2", "TEXT", "100", null, null, "T", "T", "T", null, null, null, null, null, "T", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "SALE-CONT1", null, null, null, null]]]]]]], ["SALE-CONT1", "4", "Addons", null, null, null, []]]]] } };

  //---------------------------------------------Demo Data---------------------------------------------------------------//
}




