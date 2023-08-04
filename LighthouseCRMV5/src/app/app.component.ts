import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { Platform, NavController, IonRouterOutlet, AlertController, ModalController, MenuController, TextValueAccessor } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalObjectsService } from './services/global-objects.service';
import { Router } from '@angular/router';
// import { FCM } from '@ionic-native/fcm/ngx';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic";
import { BackgroundService } from './services/background.service';
import { OverlayEventDetail } from '@ionic/core';
import { EntryListPage } from './pages/entry-list/entry-list.page';
import { DataService } from './services/data.service';
import { ChangePasswordPage } from './pages/change-password/change-password.page';
import { PartylistPage } from './pages/partylist/partylist.page';
import { Market } from '@ionic-native/market/ngx';
import { DynamicmodalPage } from './pages/dynamicmodal/dynamicmodal.page';
import { Network } from '@ionic-native/network/ngx';
import { BatteryStatus, BatteryStatusResponse } from '@ionic-native/battery-status/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient, HttpRequest } from '@angular/common/http';
//import { RequestOptions, Headers } from '@angular/http';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { PouchDBService } from './services/pouch-db.service';
import { SqlLiteService } from './services/sql-lite.service';
import { SettingPage } from './pages/setting/setting.page';
import { async } from 'q';
import { File } from '@ionic-native/file/ngx';
import { AngularMyDatePickerDirective, IAngularMyDpOptions } from 'angular-mydatepicker';
import { UserauthenticationService } from './services/userauthentication.service';
import { AppkeyUserInfoPage } from './pages/appkey-user-info/appkey-user-info.page';
import { Events } from 'src/app/demo-utils/event/events';
// import { BackgroundMode } from '@ionic-native/background-mode/ngx';
declare var google;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  elem: any;
  @ViewChild('dp') myDp: AngularMyDatePickerDirective;
  sideLovarray: any = [];
  refreshBtn: boolean = false;
  otherlist: boolean = false;
  networkInfo: any;
  isAndroid: boolean = true;
  toggleNotification: boolean = false;
  toggleFab: boolean = false;
  selectText = "selectText";
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
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
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


  themeOptions = [
    {
      class: "blue-theme-btn",
      value: "theme-blue"
    },
    {
      class: "green-theme-btn",
      value: "theme-green"
    },
    {
      class: "dark-theme-btn",
      value: "theme-dark"
    },
    {
      class: "maroon-theme-btn",
      value: "theme-maroon"
    },
    {
      class: "grey-theme-btn",
      value: "theme-grey"
    },
    {
      class: "blue-theme-edit-btn",
      value: "theme-edit"
    },
  ]

  deviceMode = [
    {
      name: "Desktop",
      class: "active",
      icon: "laptop"
    },
    {
      name: "Tab",
      class: "",
      icon: "tablet-portrait"

    },
    {
      name: "Mobile",
      class: "",
      icon: "phone-portrait"
    }
  ]
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
  platformValue :any;
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
  constructor(
    public menuCtrl: MenuController,
    private cdr: ChangeDetectorRef,

    public platform: Platform,

    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public globalObjects: GlobalObjectsService,
    // private backgroundMode: BackgroundMode,
    private router: Router,
    private navCtrl: NavController,
    // private fcm: FCM,
    public alertController: AlertController,
    public backgroundService: BackgroundService,
    public modalCtrl: ModalController,
    public events: Events,
    public dataService: DataService,
    private market: Market, private nav: NavController,
    private background: BackgroundService,
    private geoLocation: Geolocation,
    private http: HttpClient, private nativeAudio: NativeAudio,
    private network: Network, private battery: BatteryStatus,
    private pouchDb: PouchDBService,
    private sqlServ: SqlLiteService,
    private file: File,
    private userServ : UserauthenticationService
  ) {
    this.pouchDb.initDB();

    this.events.subscribe("refreshLocal", () => {
      this.deleteLocal();
      // this.checkExpObj();
    })
    this.menuCtrl.enable(false);
    this.events.subscribe("logOut",() => {
      this.logout();
    })

    this.events.subscribe("getsidmenulist", (res) => {
      localStorage.removeItem("sidemenulov");
      this.ddListFlag = false;
      this.refreshUserSettings("sec");
      //this.globalObjects.setsidemenudetail();
    })
    let theme = this.globalObjects.getLocallData("theme");
    if (theme) {
      this.globalObjects.appTheme = theme;
    }

    this.fontRange = globalObjects.fontSize;

    // cache.setDefaultTTL(60 * 60 * 60); //for one day
    this.initializeApp();

    console.log("network............", this.network)
    if(globalObjects.bojectBypass){
      let url = "http://203.193.167.118:8888/lhsws/NW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA11G/getObjectData";
      this.http.get(url).subscribe((res:any)=>{
        if(res.responseStatus == 'success'){
          let data = res.responseData;
          if(data){
            this.openObjectBypass(data[0]);
          }else{
            alert("No data found...")
          }
        }else{
          this.proceedLogin();
        }
      })
    }else{
      this.proceedLogin();
    }
    this.checkNetworkStatus()
 
    this.default_entity = "";
    this.events.subscribe("setappkeyInfoVisibility", (res) => {
      this.appkeyInfo = res;
    })

    let appkey = this.globalObjects.getLocallData("appKey");
    let appdata = this.globalObjects.getLocallData("appData");
    if(appkey && appdata){
      for(let data of appdata){
        if(data.appkey.toLowerCase() == appkey.toLowerCase()){
          this.globalObjects.applogo = data.resData.icon_img;
        }
      }
    }

    
  }

  checkNetworkStatus() {
    let onlineCnt = 0;
    this.network.onConnect().subscribe(() => {
      this.networkInfo = this.network;
      this.globalObjects.networkStatus = true;
      this.alertCount = 0;
      var connectivity_mode;
      if (this.disconnected && onlineCnt == 0) {
        this.showAlert('You are online now...!!!', 'alertOnly');
        onlineCnt++;
        this.disconnected = false;
      }
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

      this.globalObjects.setDataLocally('connectivity_mode', connectivity_mode);
      //  this.globalObjects.setDataLocally('network_speed',network_speed);
      //events.publish("uploadOfflineData", "RANJEET");
      if (!this.tempNetworkStatus) {
        this.uploadAllOfflineEntries().then((res) => {
          if (res === 'success') {
            //alert("Data Upload Successfully to Server");
          }
        });
      }
      this.tempNetworkStatus = true;

    }, error => {
      console.error(error);
    });
    this.network.onDisconnect().subscribe(() => {
      this.globalObjects.networkStatus = false;
      this.tempNetworkStatus = false;
      this.disconnected = true;
      onlineCnt = 0;
      this.globalObjects.displayOfflineToast();
      if (this.alertCount == 0) {
        this.alertCount++;
        this.offlineAlert();
      }
    }, error => {
      console.error(error);
    });
    
    if(this.globalObjects.getLocallData("scopeUrl")){
      this.globalObjects.checkAndSetScopeUrl();
    }

  }
  fullScreen() {
    let elem = document.documentElement;
    let methodToBeInvoked = elem.requestFullscreen ||
    elem['mozRequestFullscreen']
      ||
      elem['msRequestFullscreen'];
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
}

  ngOnInit() {
    // this.fullScreen();   
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.selectedPartyName = this.globalObjects.getLocallData("partyName");
    this.selectedPartyCode = this.globalObjects.getLocallData("partyCode");
    window.addEventListener('batterystatus', this.onBatteryStatus, false);
     

    if (this.userDetails) {
      this.divCode = this.userDetails.div_code;
      this.entityCode = this.userDetails.entity_code;
      this.geoOrgCode = this.userDetails.geo_org_code;
    }

    if(this.platform.is('android') || this.platform.is('ios')){}
    else{
      if(window.location.href.toString().includes("TOOL") || window.location.href.toString().includes("DEV") ||  window.location.href.toString().includes("localhost")){
        this.globalObjects.toggleDevloperMode = true;
        this.globalObjects.getLocalDBData = false;
      }
    }

    this.events.subscribe("entity_name", (data) => {
      this.userDetails = this.globalObjects.getLocallData("userDetails");
      this.entity_name = data;
      //  this.getGeoOrgCode(this.userDetails);
    });

    if (this.globalObjects.getLocallData("entity_code_appkey")) {
    }
    this.events.subscribe("GET_SIDE_MENU_DATA", (data) => {
      this.ddListFlag = false;
      this.getUserDetails("firstTime");
    })

    this.events.subscribe("entity_code_str", (ecs) => {
      if (this.userDetails) {
        this.divCode = this.userDetails.div_code;
        this.entityCode = this.userDetails.entity_code;
        this.geoOrgCode = this.userDetails.geo_org_code;
        this.refreshBtn = false;
      }
      let entity_str = ecs;

      if (entity_str) {
        this.entityCodeStrValList = []
        if (entity_str.indexOf('#') > -1) {
          let ent_str = entity_str.split('#');
          if (ent_str) {
            this.entityMap = {};
            for (let e_s of ent_str) {
              if (e_s.indexOf('~') > -1) {
                let entity = e_s.split('~');
                let entityCodeStrVal: any = {};

                // -----------ENTITY MAP------------------//

                let key = entity[0].trim();
                this.entityMap[key] = entity[1].trim();

                // -----------ENTITY MAP------------------//
                entityCodeStrVal.code = entity[0];
                entityCodeStrVal.name = entity[1];
                this.entityCodeStrValList.push(entityCodeStrVal);

              }
            }
          }
        }
        else {
          let entity = ecs.split('~');
          let entityCodeStrVal: any = {}
          entityCodeStrVal.code = entity[0];
          entityCodeStrVal.name = entity[1];
          this.entity_name = entity[1];
          this.entityCodeStrValList.push(entityCodeStrVal);
        }
      }

      // this.entity_name = ecs
    });

    let locationTrackingStarted = this.globalObjects.getLocallData("locationTrackingStarted");
    this.userDetails = this.globalObjects.getLocallData("userDetails");

    if (locationTrackingStarted == true && this.userDetails) {
      let locationStartTime = this.globalObjects.getLocallData("locationStartTime");
      var inpDate = new Date(locationStartTime);
      var currDate = new Date();
      if (inpDate.setHours(0, 0, 0, 0) == currDate.setHours(0, 0, 0, 0)) {
        let interval_time = this.userDetails.interval_time;
        this.backgroundService.start(interval_time);
        // this.globalObjects.displayCordovaToast("Background Process Started..");
      }
    }

    this.events.subscribe("toggleFab", res => {
      this.toggleFab = res;
    })

    this.events.subscribe("toggleNotification", res => {
      this.toggleNotification = res;
    })


  }

  onBatteryStatus(status) {
    let level: any = status.level;
    // alert('Level: ' + level)
    console.log('Level: ' + status.level + ' isPlugged: ' + status.isPlugged);
    this.globalObjects.setDataLocally('battery_level', JSON.stringify(level));

  }



  callmenu() {
    this.events.subscribe("goingsuper", () => {
      this.ngOnInit();
    })
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
      let path = "";
        this.platformValue = 'android';
        this.statusBar.overlaysWebView(false);
        if (this.platform.is('android')) {
          path = this.file.externalRootDirectory;
          if (this.globalObjects.appTheme == 'theme-maroon') {
            this.statusBar.backgroundColorByHexString('#a9222f');
          }
          if (this.globalObjects.appTheme == 'theme-blue') {
            this.statusBar.backgroundColorByHexString('#083466');
          }
          if (this.globalObjects.appTheme == 'theme-green') {
            this.statusBar.backgroundColorByHexString('#077172');
          }
          if (this.globalObjects.appTheme == 'theme-dark') {
            this.statusBar.backgroundColorByHexString('#6e3e05');
          }
          if (this.globalObjects.appTheme == 'theme-grey') {
            this.statusBar.backgroundColorByHexString('#373737');
          }
          if (this.globalObjects.appTheme == 'theme-edit') {
            this.statusBar.backgroundColorByHexString('#083466');
          }
         
        }
        if (this.platform.is('ios')) {
          // this.statusBar.backgroundColorByHexString('#000');
          this.platformValue = 'ios';
          path = this.file.documentsDirectory;
          if (this.globalObjects.appTheme == 'theme-maroon') {
            this.statusBar.backgroundColorByHexString('#a9222f');
          }
          if (this.globalObjects.appTheme == 'theme-edit') {
            this.statusBar.backgroundColorByHexString('#083466');
          }
          if (this.globalObjects.appTheme == 'theme-blue') {
            this.statusBar.backgroundColorByHexString('#083466');
          }
          if (this.globalObjects.appTheme == 'theme-green') {
            this.statusBar.backgroundColorByHexString('#077172');
          }
          if (this.globalObjects.appTheme == 'theme-dark') {
            this.statusBar.backgroundColorByHexString('#6e3e05');
          }
          if (this.globalObjects.appTheme == 'theme-grey') {
            this.statusBar.backgroundColorByHexString('#373737');
          }

         
        }
      
      if (this.platform.is('ios') || this.platform.is('android')) {
        // this.file.checkDir(path, 'LHSAPP').then((res) => {
        //   path = path + '/LHSAPP/'
        //  // alert("path"+path);
        // }, (err) => {

        //   setTimeout(() => {

        //     this.file.createDir(path, 'LHSAPP', true).then((res) => {
        //     }, (err) => {
        //       alert("Create err: " + JSON.stringify(err));
        //     })

        //   }, 4000);

        
       

        // });
        this.nativeAudio.preloadComplex(this.globalObjects.audio.id, this.globalObjects.audio.sound, this.globalObjects.audio.volume, 1, 1).then(() => {
          // alert('sound change');
        })

      }else{
        this.platformValue = 'browser';
      }

      // this.statusBar.backgroundColorByName("red");
      // this.backgroundMode.enable();
      this.splashScreen.hide();

      // this.appVersion.getAppName().then(value => {
      //   alert("name"+value)
      // }).catch(err => {
      //   alert(err);
      // });

      // this.appVersion.getPackageName().then(value => {
      //   alert("packagename"+value)
      // }).catch(err => {
      //   alert(err);
      // });

      // this.appVersion.getVersionCode().then(value => {
      // alert("versioncode"+value)
      // }).catch(err => {
      //   alert(err);
      // });

      // this.appVersion.getVersionNumber().then(value => {
      //   alert("version_number"+value)
      // }).catch(err => {
      //   alert(err);
      // });


      // const updateUrl = "http://203.193.167.118:8088/App/updateapp.xml";
      // this.appUpdate.checkAppUpdate(updateUrl).then(update => {
      //   alert("Update Status:  " + JSON.stringify(update));
      // }).catch(error => {
      //   alert("Error: " + error);
      // });



      this.setPlatformValue();
      // notification start ----------------------------
      if(this.platform.is('android') || this.platform.is('ios')){
        FCM.subscribeToTopic('all');
        FCM.getToken().then(token => {
          if (token) {
            this.globalObjects.setDataLocally("device_token", token);
          }
        }).catch(err=>{
          alert(JSON.stringify(err))
        });
  
        this.events.subscribe('generateToken', () => {
          FCM.getToken().then(token => {
            if (token) {
              this.globalObjects.setDataLocally("device_token", token);
            }
          }).catch((err)=>{
            alert(JSON.stringify(err))
          });
        })

        FCM.onNotification().subscribe(data => {
          if (data.wasTapped) {
            // alert("data tapped if");
            this.openPage();
          } else {
            // this.openPage();
          }
        });
        FCM.onTokenRefresh().subscribe(token => {
          if (token) {
            //   alert("device_token"+token);
            this.globalObjects.setDataLocally("device_token", token);
          }
        });
      }

      // this.fcm.getToken().then(token => {
      //   backend.registerToken(token);
      // });

    

      this.globalObjects.geoLocation();

      //---------backButton START
      this.platform.backButton.subscribeWithPriority(0, () => {
        if (this.router.url === '/super' || this.router.url === '/login' || this.router.url === '/appkey-collection' || this.router.url === '/appkey-validation') {
          //  if (this.router.url in ('/super','/login','/appkey-collection','/appkey-validation')) {
          this.confirmExit();
        } else if (this.routerOutlet && this.routerOutlet.canGoBack()) {
          this.routerOutlet.pop();
          
        } else {
          this.confirmExit();
        }
      });
      //---------backButton END

      this.checkExpObj();
    })

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
        //console.log("Userdde: " + JSON.stringify(res));
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
        }
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
      this.globalObjects.setsidemenudetail();
    });
  }

  async openPage() {

    if (this.globalObjects.getLocallData("userDetails")) {
      this.navCtrl.navigateRoot('super');
    }
    // let componentProps: any = {};

    // componentProps = {
    //   "click_events_str": "go_approval_tab",
    //   "wsdp": [
    //     {
    //       "185": "1",
    //       "186": "SQ18215-001",
    //       "187": "INDIRA METAL (J&K)",
    //       "188": "1947000",
    //       "189": "15-FEB-19",
    //       "191": "6",
    //       "222": "QTNS",
    //       "562": null
    //     }
    //   ],  
    //   "wscp": {
    //     "object_code": "APPROVAL_DETAIL_ORDER",
    //     "item_sub_type": "SIMPLE_TEXT_BUTTON",
    //     "pageno": null,
    //     "click_events_str": "go_approval_tab",
    //     "apps_page_frame_seqid": "37",
    //     "apps_item_seqid": "700",
    //     "apps_page_no": "1",
    //     "service_type": "APPROVAL_DETAIL"
    //   },
    //   "isModal": true,
    //   "wslp": {
    //     "userName": "Gurudev  Singh",
    //     "user_code": "SSD27",
    //     "message": "User is authenticated",
    //     "module": "EMP_DR",
    //     "entity_code": "M3",
    //     "division": "    SM",
    //     "acc_year": "19-20",
    //     "dept_code": null,
    //     "acc_code": "SSD27",
    //     "acc_name": null,
    //     "dashboardLink": null,
    //     "notif_topic": null,
    //     "emp_code": "M0620",
    //     "login_user_flag": "E",
    //     "geo_org_code": "PI.NI.JM.JA.JU",
    //     "geo_org_name": "Jammu",
    //     "appkey":this.globalObjects.getLocallData("appKey"),
    //     "bill_entry_catg_preference": "theme-maroon",
    //     "app_code_str": "EMP_DR",
    //     "otp": {
    //       "resulStatus": "sucess",
    //       "otp": "950811",
    //       "resulString": "We have sent you an OTP(one time password), please check and enter otp)"
    //     },
    //     "division_data": "",
    //     "password": "123"
    //   }
    // }


    // let modal: HTMLIonModalElement =
    //   await this.modalCtrl.create({
    //     component: EntryListPage,
    //     componentProps: componentProps
    //   });

    // modal.onDidDismiss().then((detail: OverlayEventDetail) => {
    //   if (detail) {
    //     // this.data1 = detail.data;
    //   }
    // });
    // await modal.present();
  }

  async confirmExit() {
    const alert = await this.alertController.create({
      header: 'Exit App!',
      message: 'Do you want to exit app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Yes',
          handler: () => { //takes the data 
            if (this.backgroundService.isTracking) {
              this.backgroundService.moveToBackgroundLTStart();
            } else {
              navigator['app'].exitApp();

            }
          }
        }
      ]
    });
    await alert.present();
  }

  logout() {
    this.globalObjects.callingPara = [];
    this.globalObjects.fabMannualMode = false;
    this.globalObjects.notiBellMannualMode = false;
    this.globalObjects.destroyLocalData("userDetails");
    this.globalObjects.destroyLocalData("sidemenulov");
    this.globalObjects.destroyLocalData("webapplink");
    this.globalObjects.destroyLocalData("item_history");
    this.globalObjects.destroyLocalData("refreshedObj");
    this.globalObjects.destroyLocalData("clickedItem");
    this.globalObjects.destroyLocalData("iudLocal");
    this.globalObjects.destroyLocalData("loginFlag");
    if (!this.globalObjects.simpleLoginProcess) {
      // this.globalObjects.destroyLocalData("appData");
      localStorage.clear();
      this.proceedLogin();
      this.navCtrl.navigateRoot('').then(() => {
        //localStorage.clear();
      });
    } else {
      this.navCtrl.navigateRoot('appkey-validation').then(() => {
        //localStorage.clear();
      });
    }
    if(this.platform.is('android') || this.platform.is('ios')){
      FCM.unsubscribeFromTopic("all");
      FCM.subscribeToTopic('all');
      FCM.getToken().then(token => {
        if (token) {
          this.globalObjects.setDataLocally("device_token", token);
        }
      }).catch(err=>{
        alert(JSON.stringify(err))
      });

      this.events.subscribe('generateToken', () => {
        FCM.getToken().then(token => {
          if (token) {
            this.globalObjects.setDataLocally("device_token", token);
          }
        }).catch((err)=>{
          alert(JSON.stringify(err))
        });
      })
    }
    this.sqlServ.deleteAllObject();
  }

  gotosuper() {
    // let user_code="ssd27";
    // let password="12";
    // let loginFlag="";
    // let deviceValidation = this.globalObjects.getLocallData("device_validation");
    // let token = this.globalObjects.getLocallData("device_token");
    // let appKey = this.globalObjects.getLocallData("appKey");
    // let entityCodeStr = this.globalObjects.getLocallData("entityCodeStr");
    // var appDataArr: any = this.globalObjects.getLocallData("appData");
    // let url = 'login?userId=' + (user_code).trim() + '&password=' + encodeURIComponent(password) +
    //   '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
    //   + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
    //   + "&entityCodeStr=" + encodeURIComponent(entityCodeStr);

    this.events.publish("goToSuper", "LHS");
  }



  setPlatformValue() {
    if (!this.globalObjects.getLocallData('platformValue')) {
      try {
        if (this.platform.is('ios')) {
          this.isAndroid = false;
          this.globalObjects.setPlatformValue('ios');
          this.globalObjects.setDataLocally('platformValue', 'ios');
        } else if (this.platform.is('android')) {
          this.isAndroid = true;
          this.globalObjects.setPlatformValue('android');
          this.globalObjects.setDataLocally('platformValue', 'android');
        } else {
          this.globalObjects.setDataLocally('platformValue', 'browser');
        }
      } catch (e) {
        //  alert(e);
        this.globalObjects.setDataLocally('platformValue', 'browser');
      }
    }
  }

  segmentChanged(event) {
    this.globalObjects.appTheme = event.detail.value;
    this.globalObjects.setDataLocally('theme', event.detail.value);
    if (this.platform.is('android')) {
      if (this.globalObjects.appTheme == 'theme-maroon') {
        this.statusBar.backgroundColorByHexString('#a9222f');
      }
      if (this.globalObjects.appTheme == 'theme-blue') {
        this.statusBar.backgroundColorByHexString('#083466');
      }
      if (this.globalObjects.appTheme == 'theme-green') {
        this.statusBar.backgroundColorByHexString('#077172');
      }
      if (this.globalObjects.appTheme == 'theme-dark') {
        this.statusBar.backgroundColorByHexString('#6e3e05');
      }
      if (this.globalObjects.appTheme == 'theme-grey') {
        this.statusBar.backgroundColorByHexString('#373737');
      }
      if (this.globalObjects.appTheme == 'theme-edit') {
        this.statusBar.backgroundColorByHexString('#0000');
      }
    }
    if (this.platform.is('ios')) {
      // this.statusBar.backgroundColorByHexString('#000');
      if (this.globalObjects.appTheme == 'theme-maroon') {
        this.statusBar.backgroundColorByHexString('#a9222f');
      }
      if (this.globalObjects.appTheme == 'theme-blue') {
        this.statusBar.backgroundColorByHexString('#083466');
      }
      if (this.globalObjects.appTheme == 'theme-green') {
        this.statusBar.backgroundColorByHexString('#077172');
      }
      if (this.globalObjects.appTheme == 'theme-dark') {
        this.statusBar.backgroundColorByHexString('#6e3e05');
      }
      if (this.globalObjects.appTheme == 'theme-grey') {
        this.statusBar.backgroundColorByHexString('#373737');
      }
      if (this.globalObjects.appTheme == 'theme-edit') {
        this.statusBar.backgroundColorByHexString('#0000');
      }
    }
  }

  entityChanged(event) {
    let userDetails = this.globalObjects.getLocallData('userDetails');
    this.globalObjects.setDataLocally('entityCode', (event.detail.value).trim());
    let ent_code = event.detail.value;

    let ent_name = this.entityMap[ent_code];

    this.entity_name = ent_name;
    userDetails.entity_name = ent_name;
    userDetails.entity_code = (event.detail.value).trim();
    this.entityCode = (event.detail.value).trim();
    this.globalObjects.setDataLocally('userDetails', userDetails);

    //this.getDivisionCode(userDetails, event.detail.value);
    this.events.publish("refresh_app", "RANJEET");
  }

  getDivisionCode(userDetails: any, entity_code) {
    // let url = "getDivisionCode?entityCode=" + encodeURIComponent(entity_code.trim()) + "&userCode=" + encodeURIComponent(user_code.trim());
    let url = "getDivisionCode";
    userDetails.entity_code = entity_code;
    var data = {
      "parameters": userDetails
    }
    this.dataService.postData(url, data).then(res => {
      let data1: any = res;
      this.divCodeStrValList = [];
      if (data1.length > 0) {
        this.divCodeStrValList = JSON.parse(JSON.stringify(data1));
      } else {
        this.divCodeStrValList = JSON.parse(JSON.stringify(data1));
      }
      // console.log(data.divCodeList);
      // let divCodeStr = data.divCodeList;
      // if (divCodeStr) {
      //   if (divCodeStr.indexOf("#") > -1) {
      //     let divCodeArr: any = divCodeStr.split("#");
      //     if (divCodeArr) {
      //       for (let divCodeS of divCodeArr) {
      //         if (divCodeS.indexOf("~") > -1) {
      //           let divison = divCodeS.split("~");
      //           let divCodeStrVal: any = {}
      //           divCodeStrVal.code = divison[0];
      //           divCodeStrVal.name = divison[1];
      //           this.divCodeStrValList.push(divCodeStrVal);
      //         }
      //       }
      //     }
      //   } else {
      //     let divison = divCodeStr.split("~");
      //     let divCodeStrVal: any = {}
      //     divCodeStrVal.code = divison[0];
      //     divCodeStrVal.name = divison[1];
      //     this.divCodeStrValList.push(divCodeStrVal);
      //   }
      // } else {
      //   this.divCodeStrValList = [];
      // }
    })

  }

  divisionChanged(event) {
    let userDetails = this.globalObjects.getLocallData('userDetails');
    this.globalObjects.setDataLocally('divCode', (event.detail.value).trim());
    userDetails.div_code = (event.detail.value).trim();
    this.divCode = (event.detail.value).trim();
    this.globalObjects.setDataLocally('userDetails', userDetails);
    this.events.publish("refresh_app", "RANJEET");
  }

  geoOrgCodeChanged(event) {
    let userDetails = this.globalObjects.getLocallData('userDetails');
    userDetails.geo_org_code = (event.detail.value).trim();
    this.geoOrgCode = (event.detail.value).trim();
    this.globalObjects.setDataLocally('userDetails', userDetails);
  }

  getGeoOrgCode(userDetails: any) {
    let url = "getGeoOrgCode";
    var data = {
      "parameters": userDetails
    }
    this.dataService.postData(url, data).then(res => {
      this.geoOrgList = res;
      console.log("getgeorgcode", res)
    })
  }



  async changePassword() {
    let modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: ChangePasswordPage,
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail) { }
    });
    await modal.present();
  }


  async openpartylist() {
    let modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: PartylistPage
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail) {
        let data: any = detail.data;
        this.selectedPartyName = data.partyName;
        this.selectedPartyCode = data.partyCode;

      }
    });
    await modal.present();
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


  compareById(o1, o2) {
    return o1.id === o2.id
  }

  checkForUpdate() {
    this.market.open('com.lhs.lhsapprevartwo');
  }

  signalRefresh() {
    this.globalObjects.checkAndSetScopeUrl().then(() => {
      this.globalObjects.displayCordovaToast("Connected..");
      this.globalObjects.hideLoading();
    }, () => { this.globalObjects.hideLoading(); })
  }

  openAppkeyInfo() {
    let lockTime = this.globalObjects.getLocallData("openAppkeyInfoTime");
    let openAppkeyInfoCount = this.globalObjects.getLocallData('openAppkeyInfoCount');
    let expiryTime: any;
    if (lockTime != null && lockTime != "") {
      let lockTime1: any = new Date(lockTime);
      let now: any = new Date();
      expiryTime = Math.abs((lockTime1.getTime() - now.getTime()) / 60000);
    }
    if (openAppkeyInfoCount) {
      if (openAppkeyInfoCount > 2) {
        if (expiryTime <= 1) {
          //nevigate to page
          this.router.navigate(['/appkey-info']);
          this.globalObjects.setDataLocally('openAppkeyInfoCount', 0);
        } else {
          this.globalObjects.setDataLocally('openAppkeyInfoCount', 2);
          this.globalObjects.setDataLocally('openAppkeyInfoTime', new Date());
          this.globalObjects.presentAlert("You have no privilages to open appkey info page?");
        }
      } else {
        openAppkeyInfoCount = openAppkeyInfoCount + 1;
        this.globalObjects.setDataLocally('openAppkeyInfoCount', openAppkeyInfoCount);
        this.globalObjects.presentAlert("You have no privilages to open appkey info page?");
      }
    } else {
      this.globalObjects.setDataLocally('openAppkeyInfoCount', 2);
      this.globalObjects.setDataLocally('openAppkeyInfoTime', new Date());
      this.globalObjects.presentAlert("You have no privilages to open appkey info page?");
    }
  }

  refreshBlob() {
    let lockTime = this.globalObjects.getLocallData("resetBlobDataTime");
    let resetBlobDataCount = this.globalObjects.getLocallData('resetBlobDataCount');
    let expiryTime: any;
    if (lockTime != null && lockTime != "") {
      let lockTime1: any = new Date(lockTime);
      let now: any = new Date();
      expiryTime = Math.abs((lockTime1.getTime() - now.getTime()) / 60000);
    }
    if (resetBlobDataCount) {
      // let resetBlobDataCount = this.globalObjects.getLocallData('resetBlobDataCount');
      if (resetBlobDataCount > 2) {
        if (expiryTime <= 1) {
          let url = "resetBlobObject";
          this.dataService.getData(url).then((res: any) => {
            console.log(res);
            let status = res.responseStatus;
            if (status == "success") {
              this.globalObjects.presentAlert("Data refreshed..!!");
              this.globalObjects.destroyLocalData('resetBlobDataCount');
              this.globalObjects.destroyLocalData('resetBlobDataTime');
            }
          })
        } else {
          this.globalObjects.setDataLocally('resetBlobDataCount', 2);
          this.globalObjects.setDataLocally('resetBlobDataTime', new Date());
          this.globalObjects.presentAlert("You have not privilages to refresh object data?");
        }
      } else {
        resetBlobDataCount = resetBlobDataCount + 1;
        this.globalObjects.setDataLocally('resetBlobDataCount', resetBlobDataCount);
        this.globalObjects.presentAlert("You have not privilages to refresh object data?");
      }
    } else {
      this.globalObjects.setDataLocally('resetBlobDataCount', 2);
      this.globalObjects.setDataLocally('resetBlobDataTime', new Date());
      this.globalObjects.presentAlert("You have not privilages to refresh object data?");
    }
  }

  switchToCollection() {
    this.globalObjects.fabMannualMode = false;
    this.globalObjects.notiBellMannualMode = false;
    // this.globalObjects.destroyLocalData("userDetails");
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
    this.navCtrl.navigateRoot('appkey-collection');
    this.sqlServ.deleteAllObject();
  }

  openInBrowsser() {
    window.open("http://203.193.167.118:8888/lhswmalogviewer/", "_blank");
  }

  openBrowsserBuild() {
    window.open("http://203.193.167.118:8888/LHSAPP/", "_blank");
  }

  //Show and hide notification icon
  toggleNotiFunc(toggleNotification) {
    this.events.publish("toggleNotification", toggleNotification);
    this.events.publish("notiBellMannualMode", true);
  }

  //Show and hide notification icon
  toggleFabFunc(toggleFab) {
    this.events.publish("toggleFab", toggleFab);
    this.events.publish("fabMannualMode", true);
  }

  refreshUserSettings(type) {
    this.getUserDetails(type);
  }

  async settings() {
    const modal = await this.modalCtrl.create({
      component: SettingPage,
    });
    return await modal.present();
  }

  sqlLitePage() {
    this.navCtrl.navigateForward('sqllite-tran');
  }

  hideRefresh() {
    console.log(this.userValueList);
    //this.userValueList = this.globalObjects.userValueListfromglobal;
    if (this.refreshBtn) {
      this.refreshBtn = false;
    } else {
      this.refreshBtn = true;
      if (this.refreshDetailsFirstTime) {
        this.refreshDetailsFirstTime = false;
        this.ddListFlag = false;
        this.refreshUserSettings("firstTime");
      }
    }
  }



  hideOtherlist() {
    if (this.otherlist) {
      this.otherlist = false;
    } else {
      this.otherlist = true;
    }
  }

  fontZoom(e) {

    this.globalObjects.fontSize = this.fontRange;
    this.globalObjects.increFont('');
    this.cdr.detectChanges();

  }

  selectedText(ev) {
    if (ev) {
      this.selectText = "selectText";
    } else {
      this.selectText = "unselectText";
    }
  }

  /* uploadAllOfflineEntries() {
    if (this.globalObjects.networkStatus) {
      return new Promise((resolve, reject) => {
        this.pouchDb.getAll().then(res => {
          let objectMast = res;
          for (let obj of objectMast) {
            if (obj.entryList) {
              let savedEntryList = obj.entryList;
              // if (!this.offlineEntrySaveFlag) {
              //   this.offlineEntrySaveFlag = true;
              for (let entryData of savedEntryList) {
                let data: any = entryData;
                  this.dataService.postData("S2U", data).then((res: any) => {
                    console.log(res);
                    this.offlineEntrySaveFlag = false;
                    let data: any = res;
                    if (data.responseStatus == "success") {
                      // this.dataService.deleteAllEntry(entryData);
                      // resolve("success");
                      let object_arr = res.responseData;
                      let objData = this.globalObjects.setPageInfo(object_arr);

                      if (objData.Level1[0].status == "F") {
                        this.dataService.deleteAllEntry(entryData);
                        this.showAlert(objData.Level1[0].message, 'alertonly');
                        resolve("success");
                      }
                      else if (objData.Level1[0].status == "Q") {
                        this.showAlert(objData.Level1[0].message, 'alertonly');
                        resolve("success");
                      }
                      else if (objData.Level1[0].status == "T"){
                        this.dataService.deleteAllEntry(entryData);
                        resolve("success");
                      }
                      else {
                        this.showAlert(objData.Level1[0].message, 'alertonly');
                        this.dataService.deleteAllEntry(entryData);
                        resolve("success");
                      }

                    }
                  }, (err) => {
                    this.offlineEntrySaveFlag = false;
                    this.globalObjects.displayCordovaToast("Server Connection Error...");
                  })
                }
              // }
            }
          }
        })
      });
    }
    else {
      alert("Internet Service Should be Start..");
    }
  } */

  uploadAllOfflineEntries() {
    if (this.globalObjects.networkStatus) {
      return new Promise((resolve, reject) => {
        this.sqlServ.getAllPendingEntery().then(res => {
          let objectMast: any[] = res.resData;
          for (let obj of objectMast) {
            if (obj.enteryData) {
              let data: any = JSON.parse(obj.enteryData);
              this.dataService.postData("S2U", data).then((res: any) => {
                this.offlineEntrySaveFlag = false;
                let data: any = res;
                if (data.responseStatus == "success") {
                  // this.dataService.deleteAllEntry(entryData);
                  // resolve("success");
                  let object_arr = res.responseData;
                  let objData = this.globalObjects.setPageInfo(object_arr);

                  if (objData.Level1[0].status == "F") {
                    this.showAlert(objData.Level1[0].message, 'alertonly');
                    this.sqlServ.updatePendingEntery(obj.id).then((upRes: any) => {
                      if (upRes.resStatus == "success") {
                        resolve("success");
                      }
                    }, (err) => {
                      this.globalObjects.displayCordovaToast("Some Problem In Updating Local");
                    })
                    resolve("success");
                  }
                  else if (objData.Level1[0].status == "Q") {
                    this.showAlert(objData.Level1[0].message, 'alertonly');
                    resolve("success");
                  }
                  else if (objData.Level1[0].status == "T") {
                    this.sqlServ.updatePendingEntery(obj.id).then((upRes: any) => {
                      if (upRes.resStatus == "success") {
                        resolve("success");
                      }
                    }, (err) => {
                      this.globalObjects.displayCordovaToast("Some Problem In Updating Local");
                    })
                    resolve("success");
                  }
                  else {
                    this.showAlert(objData.Level1[0].message, 'alertonly');
                    this.sqlServ.updatePendingEntery(obj.id).then((upRes: any) => {
                      if (upRes.resStatus == "success") {
                        resolve("success");
                      }
                    }, (err) => {
                      this.globalObjects.displayCordovaToast("Some Problem In Updating Local");
                    })
                    resolve("success");
                  }
                }
              }, (err) => {
                this.offlineEntrySaveFlag = false;
                this.globalObjects.displayCordovaToast("Server Connection Error...");
              })
            }
          }
        })
      });
    }
    else {
      this.globalObjects.presentAlert("Internet Service Should be Start..");
    }
  }



  resetFont() {
    this.fontRange = 0.9;
  }

  async offlineAlert() {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      //header: 'Confirm!',
      message: '<strong>You are offline now...!!!<br> Do you want to continue?</strong>',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Exit',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            navigator['app'].exitApp();
          }
        }, {
          text: 'Continue',
          handler: () => {
            this.events.publish('checkGps', false);
            this.events.publish('goToSuper');
          }
        }
      ]
    });
    await alert.present();
  }

  async showAlert(massege, task) {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      //header: 'Confirm!',
      message: '<strong>' + massege + '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            if (task == 'alertOnly') {
            }
            else {
              this.events.publish('goToSuper');
            }
          }
        }
      ]
    });
    await alert.present();
  }
  // this.globalObjects.inappBrowser("https://play.google.com/store/apps/details?id=com.lhs.arserpv2&hl=en&pli=1")

  onImgError(event){
    event.target.src = './assets/imgs/no_image.png'
   //Do other stuff with the event.target
   }
   
  selectDevice(el, i) {
    for (let f of this.deviceMode) {
      if (f.class == "active") {
        f.class = "inActive"
      }
    }

    this.deviceMode[i].class = "active";
    let x = document.getElementsByTagName("html");

    if (el == "Mobile") {
      x[0].setAttribute("style", "width:440px;margin: auto;background: #eee;")
    }
    if (el == "Desktop") {
      x[0].setAttribute("style", "width:100%;margin: auto;")
    }
    if (el == "Tab") {
      x[0].setAttribute("style", "width:1024px;margin: auto;background: #eee;")
    }
    
    setTimeout(() => {
      this.events.publish('refreshOnViewChange');
    }, 500);
  }


  async deleteLocal(){
    this.sqlServ.deleteAllObject().then(() =>{
      console.log("Deleted successfully");
    })
  }


  async checkExpObj() {

    let userDetails = this.globalObjects.getLocallData("userDetails");
    let appCode = this.globalObjects.getLocallData("appCode");

    let expObj = [];
    if (userDetails) {
      let obj = {
        "appCode": appCode,
        "userCode": userDetails.user_code
      }

      this.dataService.postData("checkObjectExpiry", obj).then(async res => {
        let data: any = res;

        if (data.responseStatus == "success") {
          if (data.responseData.length > 0) {

            let refreshedObj: any[] = this.globalObjects.getLocallData("refreshedObj");


            if (refreshedObj) {
              for (let r of data.responseData) {
                let obj: any = refreshedObj.filter(x => x.object_code == r.object_code);
                if (obj.length > 0) {
                  for (let o of obj) {
                    if (o.last_update_refresh == r.last_update_refresh) {
                      await expObj.push(r)
                    } else {
                      await this.sqlServ.deletExpObj(o.object_code).then(async (res: any) => {
                        if (res.status == "success") {
                          await expObj.push(r)
                        }
                      })
                    }
                  }
                } else {
                  await this.sqlServ.deletExpObj(r.object_code).then(async (res: any) => {
                    if (res.status == "success") {
                      await expObj.push(r)
                    }
                  })
                }
              }
            } else {
              for (let r of data.responseData) {
                await this.sqlServ.deletExpObj(r.object_code).then(async (res: any) => {
                  if (res.status == "success") {
                    await expObj.push(r)
                  }
                })
              }
            }
            if (expObj.length > 0) {
              this.globalObjects.setDataLocally("refreshedObj", expObj);
            }
          }
        }
      }, (error) => {
        // alert(JSON.stringify(error));
      })
    }
  }

  onChange(dateinput) {
   
      dateinput.item_name1 = this.globalObjects.formatDate(dateinput.item_name1, "dd-MMM-yyyy");
    
    let event = {
      target: {
        value: dateinput.item_name1
      }
    }
    this.dropdwnValChng(event, dateinput.item_name, 'getdetails', null)
    // this.emitOnChange.emit(JSON.parse(JSON.stringify(this.dateinput)))
  }
  /*appkeyDetails = {
    "responseStatus": "success",
    "responseMsg": "T#ok",
    "responseData": {
      "dbName": "MAPLTEST",
      "dbPassword": "MAPLTEST",
      // "serverUrl": null,
      "serverUrl": "192.168.100.157:8888",
      "server_url2": "192.168.100.157:8888",
      "server_url3": "192.168.100.157:8888",
      "server_url4": "192.168.100.157:8888",
      "war_name": "lhsws",
      "dbUrl": "192.168.100.173",
      "dbSid": "ORA10G",
      "portNo": "1521",
      "appkey": "MAPLRSO"

    }
  }/*
  /**************ARSERP NEW LOGIN LOGIC***************/
  appkeyDetails = {
    "responseStatus": "success",
    "responseMsg": "T#ok",
    "responseData": {
      "dbName": "ARSERP",
      "dbPassword": "ARSERP",
      // "serverUrl": null,
      "serverUrl": "ars-alb-338143226.ap-south-1.elb.amazonaws.com:8080",
      "server_url2": "ars-alb-338143226.ap-south-1.elb.amazonaws.com:8080",
      "server_url3": "ars-alb-338143226.ap-south-1.elb.amazonaws.com:8080",
      "server_url4": "ars-alb-338143226.ap-south-1.elb.amazonaws.com:8080",
      "war_name": "wmacrm",
      "dbUrl": "10.82.2.7",
      "dbSid": "ORA11G",
      "portNo": "1521",
      "appkey": "arscrm"

    }
  }
  /**************RCPL NEW LOGIN LOGIC***************/
 /* appkeyDetails = {
    "responseStatus": "success",
    "responseMsg": "T#ok",
    "responseData": {
      "dbName": "RCPLERP",
      "dbPassword": "rcpl_123",
      // "serverUrl": null,
      "serverUrl": "114.143.165.230:8080",
      "server_url2": "103.83.136.182:8080",
      "server_url3": "114.143.165.230:8080",
      "server_url4": "103.83.136.182:8080",
      "war_name": "lhsws",
      "dbUrl": "192.168.100.222",
      "dbSid": "ORA10G",
      "portNo": "1521",
      "appkey": "RCPLSR"

    }
  }*/
  // appkeyDetails = {
  //   "responseStatus": "success",
  //   "responseMsg": "T#ok",
  //   "responseData": {
  //     "dbName": "RCPLERP",
  //     "dbPassword": "rcpl_123",
  //     // "serverUrl": null,
  //     "serverUrl": "114.143.165.230:8080",
  //     "server_url2": "103.83.136.182:8080",
  //     "server_url3": "114.143.165.230:8080",
  //     "server_url4": "114.143.165.230:8080",
  //     "war_name": "lhsws",
  //     "dbUrl": "192.168.100.222",
  //     "dbSid": "ORA10G",
  //     "portNo": "1521",
  //     "appkey": "RCPLORDER"
     
  //   }
  // }
 



  
 /* appkeyDetails = {
    "responseStatus": "success",
    "responseMsg": "T#ok",
    "responseData": {
      "dbName": "VICCOERP",
      "dbPassword": "VICCOERP",
      "serverUrl": null,
      // "serverUrl": "49.248.223.219:8080",
      "server_url2": "49.248.223.219:8080",
      "server_url3": "49.248.223.219:8080",
      "server_url4": "49.248.223.219:8080",
      "war_name": "lhswsdev",
      "dbUrl": "192.168.1.223",
      "dbSid": "ORA10G",
      "portNo": "1521",
      "appkey": "VICCOCRM"
     
    }
  } */
  /*appkeyDetails = {
    "responseStatus": "success",
    "responseMsg": "T#ok",
    "responseData": {
      "dbName": "SKRERP",
      "dbPassword": "SKRERP",
      // "serverUrl": null,
      "serverUrl": "203.193.167.118:8888",
      "server_url2": "203.193.167.118:8888",
      "server_url3": "203.193.167.118:8888",
      "server_url4": "203.193.167.118:8888",
      "war_name": "lhswsskr",
      "dbUrl": "192.168.100.12",
      "dbSid": "ORA10G",
      "portNo": "1521",
      "appkey": "SKRMD"
     
    }
  }*/

  // MAPLERP CLIENT
 /* appkeyDetails = {
    "responseStatus": "success",
    "responseMsg": "T#ok",
    "responseData": {
      "dbName": "MAPLERP",
      "dbPassword": "MAPLERP",
      // "serverUrl": null,
      "serverUrl": "27.255.128.116:8282",
      "server_url2": "27.255.128.116:8282",
      "server_url3": "27.255.128.116:8282",
      "server_url4": "27.255.128.116:8282",
      "war_name": "lhsws",
      "dbUrl": "192.168.200.100",
      "dbSid": "ora11g",
      "portNo": "1521",
      "appkey": "MAPLPROD"
    }
  }*/

  // JYOTI-CRM LOCAL
 /* appkeyDetails = {
    "responseStatus": "success",
    "responseMsg": "T#ok",
    "responseData": {
      "dbName": "MAPLCRM",
      "dbPassword": "MAPLCRM",
      // "serverUrl": null,
      "serverUrl": "203.193.167.118:8888",
      "server_url2": "203.193.167.118:8888",
      "server_url3": "203.193.167.118:8888",
      "server_url4": "203.193.167.118:8888",
      "war_name": "lhsws",
      "dbUrl": "192.168.100.173",
      "dbSid": "ORA10G",
      "portNo": "1521",
      "appkey": "L.MAPLRSO"
    }
  } */

  //FOR PNB
 /* appkeyDetails = {
    "responseStatus": "success",
    "responseMsg": "T#ok",
    "responseData": {
      "dbName": "WMAERP",
      "dbPassword": "WMAERP",
      // "serverUrl": null,
      "serverUrl": "203.193.167.118:8888",
      "server_url2": "203.193.167.118:8888",
      "server_url3": "203.193.167.118:8888",
      "server_url4": "203.193.167.118:8888",
      "war_name": "lhsws",
      "dbUrl": "192.168.100.173",
      "dbSid": "ORA10G",
      "portNo": "1521",
      "appkey": "PNBAPP"
    }
  }*/


  /* appkeyDetails = {
     "responseStatus": "success",
     "responseMsg": "T#ok",
     "responseData": {
       "dbName": "RCPLERP",
       "dbPassword": "RCPLERP",
       // "serverUrl": null,
       "serverUrl": "203.193.167.118:8888",
       "server_url2": "203.193.167.118:8888",
       "server_url3": "203.193.167.118:8888",
       "server_url4": "203.193.167.118:8888",
       "war_name": "lhsws",
       "dbUrl": "192.168.100.173",
       "dbSid": "ORA10G",
       "portNo": "1521",
       "appkey": "L.RCPLORDER"
      
     }
   }*/

  proceedLogin() {

    var resData: any = this.appkeyDetails;
    var responseData = null;
    let parentAppkey = this.globalObjects.parentAppkey;

    let userDetails = this.globalObjects.getLocallData("userDetails");
    if (userDetails) {
      this.router.navigate(['super']);
    } else if (this.globalObjects.simpleLoginProcess) {
      this.router.navigate(['appkey-validation']);
    } else {
      this.userServ.getParentAppkeyCollection(parentAppkey.toUpperCase()).then(()=>{
        let appdata = this.globalObjects.getLocallData("appDataMain");
        for(let data of appdata){
          if(data.appkey.toLowerCase() == parentAppkey.toLowerCase()){
            responseData = data.resData;
            var server_url = "http://" + responseData.serverUrl + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
    
            this.globalObjects.setDataLocally("appKey", responseData.appkey.toUpperCase());
            this.globalObjects.setDataLocally("appCode", "");
      
            var server_url2 = "http://" + responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            var server_url3 = "http://" + responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            var server_url4 = "http://" + responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            this.globalObjects.setDataLocally("parentAppkey", responseData.appkey);
            this.globalObjects.setDataLocally("isAppLaunch", true);
            // this.globalObjects.setDataLocally("scopeUrl", server_url);
            this.globalObjects.setDataLocally("server_url1", server_url);
            this.globalObjects.setDataLocally("server_url2", server_url2);
            this.globalObjects.setDataLocally("server_url3", server_url3);
            this.globalObjects.setDataLocally("server_url4", server_url4);
            this.globalObjects.setDataLocally("dbName", responseData.dbName);
            this.globalObjects.setDataLocally("webapplink", responseData.webapplink);
            this.globalObjects.applogo = responseData.icon_img;
            this.globalObjects.checkAndSetScopeUrl().then(()=>{
              //this.globalObjects.setScopeUrl(server_url);
            })
           
            this.globalObjects.setDataLocally("device_validation", "");
          }
        }
      }, (err)=> {
        alert("Unable to get appkey details. Please contact to administrator.")
      })

    
      // this.userServ.getParentAppkeyCollection(responseData.appkey.toUpperCase()).then(()=>{
      //   this.globalObjects.checkAndSetScopeUrl().then(data => {
      //     this.router.navigate(['login']);
      //   }, err => {
      //     this.router.navigate(['appkey-validation']);
      //   })
      // }, (err)=> {
      //   alert("Unable to get appkey details. Please contact to administrator.")
      // })
    }

  }

  openObjectBypass(objectdata){
    if(objectdata.appkey){
      let responseData = objectdata;
      var server_url = "http://" + responseData.server_url1 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.database_ip + "/" + responseData.database_port + "/" + responseData.database_name + "/" + encodeURIComponent(responseData.database_password) + "/" + responseData.db_sid + "/";

      this.globalObjects.setDataLocally("appKey", responseData.appkey.toUpperCase());
      this.globalObjects.setDataLocally("appCode", "");

      var server_url2 = "http://" + responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.database_ip + "/" + responseData.database_port + "/" + responseData.database_name + "/" + encodeURIComponent(responseData.database_password) + "/" + responseData.db_sid + "/";
      var server_url3 = "http://" + responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.database_ip + "/" + responseData.database_port + "/" + responseData.database_name + "/" + encodeURIComponent(responseData.database_password) + "/" + responseData.db_sid + "/";
      var server_url4 = "http://" + responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.database_ip + "/" + responseData.database_port + "/" + responseData.database_name + "/" + encodeURIComponent(responseData.database_password) + "/" + responseData.db_sid + "/";
      this.globalObjects.setDataLocally("parentAppkey", responseData.appkey);
      this.globalObjects.setDataLocally("isAppLaunch", true);
      // this.globalObjects.setDataLocally("scopeUrl", server_url);
      this.globalObjects.setDataLocally("server_url1", server_url);
      this.globalObjects.setDataLocally("server_url2", server_url2);
      this.globalObjects.setDataLocally("server_url3", server_url3);
      this.globalObjects.setDataLocally("server_url4", server_url4);
      this.globalObjects.setDataLocally("dbName", responseData.database_name);

      this.globalObjects.checkAndSetScopeUrl().then(()=>{
        this.globalObjects.setScopeUrl(server_url);
      
        this.getUserData(responseData);

      })
     
      this.globalObjects.setDataLocally("device_validation", "");
    }
  }

  async getUserData(data: any) {
    let reqData = {
      "database_name": data.database_name,
      "app_key" : data.appkey
    }
    let body = {
      "parameters": reqData
    };

    console.log(JSON.stringify(body));
    // if (data.seq_no < 0) {
    //   let url = "getAppKeyUserDetails";
    //   this.dataservice.postData(url, body).then((res: any) => {
    //     let data1: any = res;
    //     if (data1.responseStatus == 'success') {
    //       this.showUserModal(data1.responseData);
    //     } else {
    //       this.globleObj.presentToastWithOptions("Something went wrong, Try after some time...", "errorClass")
    //     }
    //   }, (error) => {
    //     console.log(error);

    //   })
    // }
    // else {
      //this.globleObj.showLoading()
      let url = "http://" + data.server_url1 + "/lhsws/MC/" + data.database_ip + "/1521/" + data.database_name + "/" + data.database_password + "/" + data.db_sid + "/getAppKeyUserDetails";
      console.log(url);
      this.http.post(url, body)
        .subscribe((data1: any) => {
          console.log(data1);
          //this.globleObj.hideLoading();
          data.app_key = data.appkey;
          data1.appKeyDetails = data;
          if (data1.responseStatus == 'success') {
            this.showUserModal(data1);
          } else {
            this.globalObjects.presentToastWithOptions("Requested Server not Available", "errorClass")
          }
        }, (error) => {
          console.log(error);
         // this.globleObj.hideLoading()
          this.globalObjects.presentToastWithOptions("Requested Server not Available", "errorClass");
        })
    // }
  }

  async showUserModal(data: any) {
    const modal = await this.modalCtrl.create({
      component: AppkeyUserInfoPage,
      componentProps: data,
      backdropDismiss:false
    });
    return await modal.present();
  }




}







