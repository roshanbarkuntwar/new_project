import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { GlobalObjectsService } from '../../services/global-objects.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'
import { ModalController, PopoverController, Events, MenuController, NavController, Platform } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { MultiLevelTabPage } from '../multi-level-tab/multi-level-tab.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { HttpClient } from '@angular/common/http';
import { EntryListPage } from '../entry-list/entry-list.page';
import { BackgroundService } from 'src/app/services/background.service';
import { Market } from '@ionic-native/market/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
// import { FileOpener } from '@ionic-native/file-opener/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { DeveloperModePage } from '../developer-mode/developer-mode.page';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FrameOtpComponent } from 'src/app/components/frames/frame-otp/frame-otp.component';
import { SettingPage } from '../setting/setting.page';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import readXlsxFile from 'read-excel-file';
import { format } from 'sql-formatter';
import { UsersettingPage } from '../usersetting/usersetting.page';
import { ObjectMastEditorPage } from '../dev-object-mast-editor/object-mast-editor.page';
import { DevFrameMastEditorPage } from '../dev-frame-mast-editor/dev-frame-mast-editor.page';
import { DevFrameItemListPage } from '../dev-frame-item-list/dev-frame-item-list.page';
// import { OpenTextareaPage } from '../open-textarea/open-textarea.page';
import { ParentMenuPage } from '../parent-menu/parent-menu.page';
import { Console } from 'console';
import { AnyRecord, AnyRecordWithTtl } from 'dns';
import { SingleSelectLovPage } from '../single-select-lov/single-select-lov.page';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { LhsPlSQLToJS } from 'src/app/demo-utils/plsqlToJs/LhsPlSQLToJS';
import { PlsqlToJsService } from 'src/app/demo-utils/plsqlToJs/plsql-to-js.service';
import { Observable } from 'rxjs';
// import { CustomCameraPage } from '../custom-camera/custom-camera.page';
// import { DeveloperModeLogPage } from '../developer-mode-log/developer-mode-log.page';
// import { UsersettingPage } from '../usersetting/usersetting.page';
// Add this on your Android Manifest Platforms first
// <uses-permission android:name="android.permission.SEND_SMS"/>


// declare var Android : any;
@Component({
  selector: 'app-super',
  templateUrl: './super.page.html',
  styleUrls: ['./super.page.scss'],
})
export class SuperPage implements OnInit {

  toggleSideMenu: boolean = true;

  @Input() wscpNav: any;

  plt: any;

  imgUrl: any[];
  object_mast: any;
  page_mast: any;
  breadCrumsuper: any;
  userDetails: any;
  flag = true;
  order_pageno: number;
  tabflag: boolean;
  tabflag2: boolean;
  fullsScreen: boolean = true;
  wscp: any = {};
  wsdp: any = [];
  wsdpcl: any = [];
  wsud: any = {};

  // type = "";
  page_no: number = 0;
  isModal: any = "Menu";

  currentPageInfo: any = {};
  object_arr: any;
  levelbattery: any;

  click_events_str: any;
  myExtObject: any;
  sessionObj: any;
  pageParameter: any = {};
  popoverdismiss: boolean = true;

  operation_mode: any;
  notificationCount: any;
  toggleNotification: boolean;
  toggleFab: boolean;
  fabMannualMode: boolean = false;
  eventOfadditem: any = {};
  id: any = 0;

  localAppData: any;
  appValideFlag: boolean = true;
  samePageNo: number;
  concatArr = [];
  showTree = false;

  refreshObj: boolean = false;

  lovFlag: boolean = false;
  item_slno_count = 1;

  // appPageName = "";

  smartBtn: boolean = true;
  @ViewChild('fab', { read: ElementRef }) private fabbtn: ElementRef;
  modalFlag: any;
  concatKey = [];
  otpFrame: boolean = true;
  dragPosition = "";
  screenWidth: number;
  dargMode: boolean = false;
  otpFlag: boolean = false;
  otpFrameObjCode: any;
  headExcelSheet: any = [];
  bodyExcelSheet: any = [];
  tableBodyExcelSheet: any = [];
  scriptLoading: boolean = false;
  checkGps: boolean = true;
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
  formatSql: any = "Select * from sqlqurey;";
  sqlData: any;
  newFormInstance: any = {};
  backdismiss: boolean = false;

  clickEvent: any;
  bluetoothList: any = [];
  selectedPrinter = "";
  constructor(
    private cdr: ChangeDetectorRef, private dataService: DataService, public globalObjects: GlobalObjectsService,
    public modalCtrl: ModalController, public events: Events, private router: Router,
    public popOverCtrl: PopoverController, private background: BackgroundService,
    private socialSharing: SocialSharing, public http: HttpClient, private navCtrl: NavController,
    private routeactivate: ActivatedRoute, private menuCtrl: MenuController,
    private market: Market, public platform: Platform, private nativeAudio: NativeAudio,
    private ft: FileTransfer, private file: File, private document: DocumentViewer,
    private sqlLiteServ: SqlLiteService, private lhs_lib: LhsLibService, private convert_plsq_js: PlsqlToJsService,
  ) {


    this.globalObjects.fontSize = this.globalObjects.getLocallData("fontSize");
    this.globalObjects.fontype = this.globalObjects.getLocallData("fontype");
    // this.globalObjects.increFont(this.globalObjects.getLocallData("fontSize"), this.globalObjects.getLocallData("fonttype"))
    if (this.globalObjects.fontSize) {
      this.globalObjects.increFontsize(this.globalObjects.fontSize);
    }
    if (this.globalObjects.fontype) {
      this.globalObjects.changeFont(this.globalObjects.fontSize);
    }
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.localAppData = this.globalObjects.getLocallData("appData");
    this.background.getLocation();
    this.events.subscribe("refresh_app", () => {
      this.ngOnInit();
    })



    // this.http.get('https://firebasestorage.googleapis.com/v0/b/photo-cbbee.appspot.com/o/').subscribe((data: any) => {
    //   this.imgUrl = data.items;
    // })
    this.events.subscribe('verifyOtp', res => {
      if (this.object_mast.Level2[this.page_no].object_code == res.object_code) {
        this.popOverCtrl.dismiss(res);
      }
    });
    this.menuCtrl.swipeGesture(true);
    this.events.subscribe('pageName', res => {
      if (this.object_mast.Level2[this.page_no].object_code == res.object_code) {
        this.object_mast.Level2[this.page_no].apps_page_name = res.pageName
      }
    })

    this.events.subscribe("goToSuper", () => {
      this.refreshPage();
    })
    this.events.subscribe("checkGps", (res) => {
      this.checkGps = res;
    })

    this.events.subscribe("toggleFab", (res) => {
      this.toggleFab = res;
    })

    this.events.subscribe("toggleNotification", (res) => {
      this.toggleNotification = res;
    })

    this.events.subscribe("jumptosuper", () => {
      this.refreshPage();
    })

    this.events.subscribe("refreshOnViewChange", () => {
      this.userDetails = this.globalObjects.getLocallData("userDetails");
      this.refreshObjFab()
    })

    this.events.subscribe("refreshOnViewChangeBypass", () => {
      this.userDetails = this.globalObjects.getLocallData("userDetails");
      this.wscp.object_code = this.userDetails.homeObjectCode
      this.refreshObjFab()
    })

    // this.events.subscribe("setVal", () => {
    //   this.setParaCall();
    // })

  }

  onrun() {

    this.formatSql = format(this.sqlData, {
      language: 'plsql',
      uppercase: true,
    });
  }

  // options: InAppBrowserOptions = {
  //   hidden: 'yes'
  //  var url = "http://203.193.167.118:8888/DynamicAppWSV3/webService/getServerDetails?appKey=" + appkey +
  // "&device_id=" + this.device.uuid + "&device_name=" + this.device.model;
  // };

  fromgfmglobal() {
    this.dataService.FCMlink()
  }
  openwatsapp() {
    this.socialSharing.shareViaWhatsApp("sharetext").then(() => {
      // Success
    }).catch(() => {
      // Error!
    });
  }

  logOut() {
    this.events.publish("logOut");
  }

  // async smsApi() {
  //   var location = 'http://sms.smsmob.in/api/mt/SendSMS?user=Lighthouse&password=lighthouse@123&senderid=LHSERP&channel=Trans&DCS=0&flashsms=0&number=8208830485&text=736717.';
  //   const options: InAppBrowserOptions = { location: "no", zoom: 'no', toolbar: 'no', hideurlbar: "yes", hidden: "yes" }
  //   const browser = this.theInAppBrowser.create(location, '_self', options)
  //   browser.on('loadstop').subscribe(event => {
  //     this.globalObjects.s2uToast("Text message sent successfully", "paymentSuccessToast");
  //   }, (error) => {
  //     this.globalObjects.s2uToast("Text message not sent. :(", "errorToast");
  //   }
  //   );
  // }


  // smsMobile() {
  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
  //     result => console.log('Has permission?' + result.hasPermission),
  //     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
  //   );
  //   var options = {
  //     replaceLineBreaks: false, // true to replace \n by a new line, false by default
  //     android: {
  //       // intent: 'INTENT'  // Opens Default sms app
  //       intent: '' // Sends sms without opening default sms app
  //     }}
  //   this.sms.hasPermission().then(res => {
  //     this.sms.send('9325543074', 'hi', options).then(result => {
  //       alert(result);
  //       this.globalObjects.s2uToast("Text message sent successfully! :)", "paymentSuccessToast");
  //     }, (error) => {
  //       alert(error);
  //       this.globalObjects.s2uToast("Text message not sent. :(", "errorToast");
  //     });
  //   });
  // }


  // async smsfrommobile() {
  //   // Text + Image or URL works
  //   this.socialSharing.shareViaSMS("this hello text", "8433669706").then(() => {
  //     // Success
  //   }).catch((e) => {
  //     // Error!
  //   });
  // }



  ngOnInit() {





    if (this.wscpNav) {
      this.wscp = this.wscpNav;
      this.globalObjects.lovType = this.wscp.item_sub_type
      this.lovFlag = true;
    }

    // this.globalObjects.lovObjData = [];

    if ((this.platform.is('ios') || this.platform.is('android'))) {
      this.plt = '';
      this.backdismiss = true;
    } else {
      this.plt = 'browser';
      this.backdismiss = false;
    }

    console.log(this.otpFlag)
    this.screenWidth = document.getElementById('super').clientWidth;
    if (this.screenWidth > 779) {
      this.dragPosition = 'horizontal';
    } else {
      this.dragPosition = 'vertical';
    }
    this.events.publish("checkToggle");

    let userDetails = this.globalObjects.getLocallData('userDetails');
    if (userDetails.side_menu_bar_flag == 'T') {
      this.toggleSideMenu = true;
    } else if (userDetails.side_menu_bar_flag == 'F') {
      this.toggleSideMenu = false;
    } else {
      this.toggleSideMenu = true;
    }

    // if(this.platform.is('ios') || this.platform.is('android')){
    // this.nativeAudio.preloadSimple('uniqueId1', 'assets/audio/click.mp3').then((res) => { },
    //   (err) => {
    //     alert(JSON.stringify(err));
    //   });
    // }
    this.toggleFab = this.globalObjects.toggleFab;
    this.toggleNotification = this.globalObjects.toggleNotification;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    var appkey = this.globalObjects.getLocallData("appKey");
    var dbName = this.globalObjects.getLocallData("dbName");
    this.globalObjects.dbName = dbName;
    this.globalObjects.appKey = appkey;
    // this.dbPassword = obj.resData.dbPassword;
    if (this.userDetails) {
      //this.wsud.login_session_id= this.userDetails.login_session_id
      this.wsud.latitude = this.globalObjects.latitude;
      this.wsud.longitude = this.globalObjects.longitude;
      this.wsud.battery_level = this.globalObjects.getLocallData('battery_level');
      this.wsud.connection_type = this.globalObjects.getLocallData('connectivity_mode');
      this.wsud.downlinkmax = this.globalObjects.getLocallData('network_speed');
      this.wscp.appkey = appkey;
      this.wscp.platform = this.globalObjects.getLocallData("platformValue");
    }
    else if (appkey) {
      this.navCtrl.navigateRoot('login');
    }
    else {
      this.navCtrl.navigateRoot('appkey-validation');
    }

    this.globalObjects.countfortextband3d = 0;
    if (this.click_events_str && (this.click_events_str.indexOf("NEXT_PAGE") > -1 || this.click_events_str.indexOf("SAME_PAGE") > -1)) {
    } else {
      this.platform.ready().then(() => {

        if (this.userDetails.gps_mandatory_flag == 'Y' && (this.platform.is('ios') || this.platform.is('android')) && this.checkGps) {
          this.globalObjects.checkGPSPermission().then(() => {
            // this.validatePlatform(loginFlag);
          }, (err) => {
            this.globalObjects.presentAlert("You can not access app without location permission. Please allow location permission.");
            navigator['app'].exitApp();
          })
        }
        else if (!this.checkGps) {
          this.checkGps = true;
        }
      })
      this.getPageInfo();
    }
    this.globalObjects.current_page_parameter = this.pageParameter;

    if (!this.globalObjects.current_page_parameter.MODE) {
      this.globalObjects.current_page_parameter.MODE = '';
    }
    // console.log(this.pageParameter);

    this.events.publish("entity_name", this.userDetails.entity_name);
    this.events.publish("entity_code_str", this.userDetails.entity_code_str);
    this.events.unsubscribe("openQueryParamObj");
    this.events.subscribe("openQueryParamObj", () => {
      this.openDevQueryParamObj()
    })
    // this.getNotificationCount();

  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.object_mast.Level2[this.page_no].Level3, event.previousIndex, event.currentIndex);
    // console.log(event.currentIndex);
    let prv: any = event.previousIndex + 1;
    let cur: any = event.currentIndex + 1;
    let localData = this.globalObjects.getLocallData('dragabledata');
    let dragableFrame = [];
    let localObj: any;
    let dragFrame = [];
    let flag1 = true;
    let flag2 = true;
    if (localData) {
      dragableFrame = localData;
      localObj = dragableFrame.find(x => x.objKey == this.object_mast.Level2[this.page_no].object_code);
    }

    if (localObj) {
      for (let frame of this.object_mast.Level2[this.page_no].Level3) {
        if (cur < prv) {
          if (parseInt(frame.apps_frame_seqno) == cur && flag1) {
            frame.apps_frame_seqno = JSON.stringify(prv);
            localObj.frames[0][frame.apps_page_frame_seqid] = frame.apps_frame_seqno
            flag1 = false;
          } if (parseInt(frame.apps_frame_seqno) == prv && flag2) {
            frame.apps_frame_seqno = JSON.stringify(cur);
            localObj.frames[0][frame.apps_page_frame_seqid] = frame.apps_frame_seqno;
            flag2 = false;
          }
        }
        else if (parseInt(frame.apps_frame_seqno) <= cur && parseInt(frame.apps_frame_seqno) > prv) {
          frame.apps_frame_seqno = JSON.stringify(parseFloat(frame.apps_frame_seqno) - 1);
          localObj.frames[0][frame.apps_page_frame_seqid] = frame.apps_frame_seqno
        }
        else if (parseInt(frame.apps_frame_seqno) == cur && parseInt(frame.apps_frame_seqno) < prv) {
          frame.apps_frame_seqno = JSON.stringify(parseFloat(frame.apps_frame_seqno) + 1);
          localObj.frames[0][frame.apps_page_frame_seqid] = frame.apps_frame_seqno
        } else if (parseInt(frame.apps_frame_seqno) == prv) {
          frame.apps_frame_seqno = JSON.stringify(cur);
          for (let x of localObj.frames) {
            localObj.frames[0][frame.apps_page_frame_seqid] = frame.apps_frame_seqno
          }
        }
      }
    }
    else {

      let frameId = {};
      for (let frame of this.object_mast.Level2[this.page_no].Level3) {
        if (parseInt(frame.apps_frame_seqno) <= cur && parseInt(frame.apps_frame_seqno) > prv) {
          frame.apps_frame_seqno = JSON.stringify(parseFloat(frame.apps_frame_seqno) - 1);
          frameId[frame.apps_page_frame_seqid] = frame.apps_frame_seqno
          //dragFrame.push(frameId);
        } else if (parseInt(frame.apps_frame_seqno) == cur && parseInt(frame.apps_frame_seqno) < prv) {
          frame.apps_frame_seqno = JSON.stringify(parseFloat(frame.apps_frame_seqno) + 1);
          frameId[frame.apps_page_frame_seqid] = frame.apps_frame_seqno
          //dragFrame.push(frameId);
        } else if (parseInt(frame.apps_frame_seqno) > cur && parseInt(frame.apps_frame_seqno) > prv) {
          frameId[frame.apps_page_frame_seqid] = frame.apps_frame_seqno
        }
        else if (parseInt(frame.apps_frame_seqno) < cur && parseInt(frame.apps_frame_seqno) < prv) {
          frameId[frame.apps_page_frame_seqid] = frame.apps_frame_seqno
        } else if (parseInt(frame.apps_frame_seqno) == prv) {
          frame.apps_frame_seqno = JSON.stringify(cur);
          frameId[frame.apps_page_frame_seqid] = frame.apps_frame_seqno
        }
      }
      dragFrame.push(frameId);
      let objCode = {
        objKey: this.object_mast.Level2[this.page_no].object_code,
        frames: dragFrame
      };
      dragableFrame.push(objCode);
    }
    this.globalObjects.setDataLocally("dragabledata", dragableFrame);

    // console.log(dragFrame);

  }

  dragable(ev) {
    ev = !ev;
  }



  async getPageInfo() {

    let tabdata: any;
    if (!this.tabflag2) {
      this.routeactivate.queryParams.subscribe(params => {
        if (params && params.special) {
          tabdata = params.special;
        }
      });
    }
    if (this.wscp.object_code == "SALE-CONT1..FromLocalStorageTS") {
      // SALE-CONT1
      // ---local storage test order page
      let data = this.globalObjects.jsonData;
      this.object_arr = data.responseData
      let objData = this.globalObjects.setPageInfo(this.object_arr);
      this.object_mast = objData.Level1[0];
    }
    else {
      this.wscp.service_type = this.wscp.service_type ? this.wscp.service_type : "get_object_config";

      if (this.wscp.service_type == "get_object_config") {
        let validDateStr = this.localAppData[0].resData.app_valid_upto_date;

        if (validDateStr) {
          let validDate = new Date(validDateStr);
          let todayDate = new Date();

          if (validDate < todayDate) {
            this.appValideFlag = false;
          } else {
            this.appValideFlag = true;
          }
        }
      }

      if (this.appValideFlag) {

        if (tabdata) {
          this.wscp = "";
          this.wscp = JSON.parse(tabdata);
          this.tabflag = true;
        }
        let reqData: any = {};


        let iudId = this.globalObjects.getLocallData('iudLocal');
        if (iudId) {
          this.wscp.iud_seqid = this.userDetails.login_session_id + (iudId + 1);
          this.globalObjects.setDataLocally('iudLocal', (iudId + 1));
        } else {
          this.wscp.iud_seqid = this.userDetails.login_session_id + 1;
          this.globalObjects.setDataLocally('iudLocal', 1);
        }

        // this.userDetails.version_numeric=this.globalObjects.version_numeric;
        if (this.platform.is('ios')) {
          this.userDetails.ios_version_numeric = this.globalObjects.ios_version_numeric;
        }
        if (this.platform.is('android')) {
          this.userDetails.android_version_numeric = this.globalObjects.android_version_numeric;
        }
        this.screenWidth = document.getElementById('super').clientWidth;

        if (this.screenWidth == 0) {
          this.screenWidth = document.getElementById('sreenWidth').clientWidth;
        }
        this.userDetails.screen_width = this.screenWidth;

        reqData = {
          "wslp": this.userDetails,
          "wscp": this.wscp,
          "wsdp": this.wsdp,
          "wsdpcl": this.wsdpcl,
          "wsud": this.wsud
        }


        if (this.wsdp) { } else {
          reqData.wsdp = [
            {
              "apps_item_seqid": "1",
              "itemType": "TEXT",
              "itemDefaultValue": "Y~Yes#N~No"
            }];
        }
        if (!this.wscp.object_code || this.wscp.object_code == "") {
          this.isModal = "Menu";
        }

        /*-------------------- Getting Data From Local DB ---------------------------------------*/

        if (this.wscp.object_code) { }
        else {
          this.wscp.object_code = this.userDetails.homeObjectCode;
        }

        // let openObjectNewTab = localStorage.getItem("openObjectNewTab");
        // if(openObjectNewTab){
        //   this.wscp.object_code = openObjectNewTab;
        //  localStorage.removeItem("openObjectNewTab");
        // }

        let objectKey = this.wscp.object_code && this.wscp.object_code != "" ? this.wscp.object_code : "homeObjectCode";

        if (this.wscp.local_Item_Seq_Id) {
          objectKey = objectKey + '#' + this.wscp.local_Item_Seq_Id;
        } else {
          if (this.wscp.apps_item_seqid) {
            objectKey = objectKey + '#' + this.wscp.apps_item_seqid;
          }
        }
        if (!this.refreshObj) {
          this.sqlLiteServ.getById(objectKey, 'object_master').then((data: any) => {
            if (((data.resStatus == 'Success' && this.globalObjects.getLocalDBData) || !this.globalObjects.networkStatus)) {

              let objMast = JSON.parse(data.resData.objMast);


              //------------------------ Replace_Parameter_value ---------------//

              this.globalObjects.parameterObject = objMast;

              // this.globalObjects.parameterObject = this.object_mast;

              if (this.globalObjects.callingParameter.length > 0) {

                let glob = this.globalObjects.callingParameter.find(x => x.obj_code == objMast.object_code);
                if (glob) {

                  let str = glob.str;

                  for (let object of objMast.Level2) {
                    for (let frame of object.Level3) {
                      if (frame.apps_page_frame_seqid && frame.apps_page_frame_seqid.indexOf("PARA") > -1) {

                        let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
                        for (let itemGroup of frameLevel4) {
                          for (let item of itemGroup.Level5) {

                            if (item.item_name == "p_calling_parameter_str") {


                              item.value = str;
                              item.item_default_value = str;
                            }


                          }
                        }
                        frame.tableRows = [];
                        frame.tableRows[0] = frameLevel4;
                      }
                    }
                  }
                }
              }
              this.lhs_lib.object_mast = objMast;
              this.object_mast = objMast;

              this.setParaCall();

              //------------------------ Replace_Parameter_value ---------------//

              //------------------------ calling_parameter_str_cc ---------------//

              if (this.object_mast.calling_parameter_str_cc) {

                this.wscp.calling_parameter_str_cc = this.object_mast.calling_parameter_str_cc;
                //  this.globalobject.callingPara = this.item.calling_parameter_str.split('~');
                let str = this.object_mast.calling_parameter_str_cc.replace(/=/g, ":=");
                let callingStr = str.split('~');

                let obj = {
                  itmData: callingStr,
                  objectCode: this.object_mast.object_code,
                  itemCode: this.wscp.apps_item_seqid
                }

                if (this.globalObjects.callingPara.length > 0) {
                  let glob = this.globalObjects.callingPara.find(x => x.objectCode == this.object_mast.object_code && x.itemCode == this.wscp.apps_item_seqid);

                  if (glob) {

                    for (let c of obj.itmData) {
                      for (let i of glob.itmData) {
                        if (i.split(":=")[0] == c.split(":=")[0]) {
                          c = i
                        }
                      }
                    }
                    glob.itmData = obj.itmData
                  } else {
                    this.globalObjects.callingPara.push(obj);
                  }
                } else {
                  this.globalObjects.callingPara.push(obj);
                }
              }

              //------------------------ calling_parameter_str_cc ---------------//

              this.wscp.apps_working_mode = this.object_mast.apps_working_mode;
              if (this.object_mast) {
                if (this.object_mast.operation_mode_str && this.object_mast.operation_mode_str.indexOf("#") > -1) {
                  this.operation_mode = this.object_mast.operation_mode_str.split("#");
                }

                let glob = this.globalObjects.refreshObj.find(x => x.refreshObj == this.object_mast.object_code);
                if (glob && glob.refreshFlag) {
                  for (let obj of this.object_mast.Level2[0].Level3) {
                    let seqNo = obj.apps_page_frame_seqid;
                    let name = "refreshFrame" + seqNo.replace(/-/g, '_') + this.globalObjects.refreshId;
                    this.events.unsubscribe(name);
                  }
                }

              }
            }

            else {
              this.proceedGetPageInfo(reqData);
            }
          }, (err) => {
            this.proceedGetPageInfo(reqData);
          })
        } else {
          this.proceedGetPageInfo(reqData);
        }
      } else {
        let validMessage = this.localAppData[0].resData.app_valid_upto_message;
        this.globalObjects.presentAlert(JSON.stringify(validMessage));
      }
    }
    this.globalObjects.allFrameJsonData = [];
  }

  proceedGetPageInfo(reqData) {
    //   console.log("From Requested data Page ...............",reqData);
    var objToday1 = new Date();
    this.dataService.postData("S2U", reqData).then((res: any) => {
      let curMinute1 = objToday1.getMinutes() < 10 ? "0" + objToday1.getMinutes() : objToday1.getMinutes();
      let curSeconds1 = objToday1.getSeconds() < 10 ? "0" + objToday1.getSeconds() : objToday1.getSeconds();
      var lastupdae = curMinute1 + "  " + curSeconds1;
      //  console.log("1st res:    ",JSON.stringify(res));
      let data: any = res;
      if (data.responseStatus == "success") {
        this.object_arr = data.responseData;

        //-------------------------------------------Pending for Session_HOLD_FLAG-----------wscp to wsdp-------------------------//
        let objData = this.globalObjects.setPageInfo(this.object_arr);

        let objMast = objData.Level1[0];

        //------------------------ Replace_Parameter_value ---------------//

        this.globalObjects.parameterObject = objMast;


        if (this.globalObjects.callingParameter.length > 0) {

          let glob = this.globalObjects.callingParameter.find(x => x.obj_code == objMast.object_code);
          if (glob) {

            let str = glob.str;

            for (let object of objMast.Level2) {
              for (let frame of object.Level3) {
                if (frame.apps_page_frame_seqid && frame.apps_page_frame_seqid.indexOf("PARA") > -1) {

                  let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
                  for (let itemGroup of frameLevel4) {
                    for (let item of itemGroup.Level5) {
                      if (item.item_name == "p_calling_parameter_str") {
                        item.value = str;
                        item.item_default_value = str;
                      }
                    }
                  }
                  frame.tableRows = [];
                  frame.tableRows[0] = frameLevel4;
                }
              }
            }
          }
        }
        this.lhs_lib.object_mast = objMast;
        this.object_mast = objMast;
        this.setParaCall();

        //------------------------ Replace_Parameter_value ---------------//


        // --------------------------------------------- Frame Type Changes after checking screen width End --------------------//



        //------------------------ calling_parameter_str_cc ---------------//

        if (this.object_mast.calling_parameter_str_cc) {

          this.wscp.calling_parameter_str_cc = this.object_mast.calling_parameter_str_cc;
          //  this.globalobject.callingPara = this.item.calling_parameter_str.split('~');
          let str = this.object_mast.calling_parameter_str_cc.replace(/=/g, ":=");
          let callingStr = str.split('~');

          let obj = {
            itmData: callingStr,
            objectCode: this.object_mast.object_code,
            itemCode: this.wscp.apps_item_seqid
          }

          if (this.globalObjects.callingPara.length > 0) {
            let glob = this.globalObjects.callingPara.find(x => x.objectCode == this.object_mast.object_code && x.itemCode == this.wscp.apps_item_seqid);

            if (glob) {

              for (let c of obj.itmData) {
                for (let i of glob.itmData) {
                  if (i.split(":=")[0] == c.split(":=")[0]) {
                    c = i
                  }
                }
              }
              glob.itmData = obj.itmData
            } else {
              this.globalObjects.callingPara.push(obj);
            }
          } else {
            this.globalObjects.callingPara.push(obj);
          }
        }


        //------------------------ calling_parameter_str_cc ---------------//

        let offlineObjectCode: any;
        //if (this.object_mast && this.object_mast.apps_working_mode === 'I') {

        // this.globalObjects.appWorkingPara = {
        //   objCode : this.object_mast.object_code,
        //   apps_working_mode : this.object_mast.apps_working_mode
        // }

        this.wscp.apps_working_mode = this.object_mast.apps_working_mode;

        if (this.object_mast.local_storage_flag != "F") {
          if (reqData.wscp) {
            if (reqData.wscp.object_code) {
              offlineObjectCode = reqData.wscp.object_code;
            }
            else {
              offlineObjectCode = "homeObjectCode"//this.userDetails.homeObjectCode;
            }
          }
          let pouchObjectKey = offlineObjectCode;
          this.object_mast._id = pouchObjectKey;
          //this.object_mast._rev = "";
          var temp: any = {};
          var id = pouchObjectKey;

          if (this.wscp.local_Item_Seq_Id) {
            id = id + '#' + this.wscp.local_Item_Seq_Id;
          } else {
            if (this.wscp.apps_item_seqid) {
              id = id + '#' + this.wscp.apps_item_seqid;
            }
          }

          temp = {
            id: id,
            objData: JSON.stringify(this.object_mast)
          }

          this.sqlLiteServ.getById(id, 'object_master').then(data => {
            if (data.resStatus == 'Success') {
              // alert(" id found in sqlite");
              temp.rev = data.resData._rev;
              this.sqlLiteServ.updateObjMast(temp, 'object_master');
            } else {
              // alert(" id not found in sqlite");
              this.sqlLiteServ.postDataSql(temp, 'object_master');
            }

          });

        }

        /*  this.pouchDBService.getObject(id).then((localData: any) => {
           temp = this.object_mast;
           temp._id = id;
           temp._rev = localData._rev;
           this.pouchDBService.updateJSON(temp);
         }, (err) => {
           this.object_mast._id = pouchObjectKey;
           //this.object_mast._rev = "";
           this.pouchDBService.updateJSON(this.object_mast);
         }) */
        //}
        if (this.object_mast) {
          if (this.object_mast.operation_mode_str && this.object_mast.operation_mode_str.indexOf("#") > -1) {
            this.operation_mode = this.object_mast.operation_mode_str.split("#");
          }

          let glob = this.globalObjects.refreshObj.find(x => x.refreshObj == this.object_mast.object_code);
          if (glob && glob.refreshFlag) {
            for (let obj of this.object_mast.Level2[0].Level3) {
              let seqNo = obj.apps_page_frame_seqid;
              let name = "refreshFrame" + seqNo.replace(/-/g, '_') + this.globalObjects.refreshId;
              this.events.unsubscribe(name);
            }
          }
          //------------------------ Offline Entry Records for Each Object------------------------------------//
          // for (let l_obj_1 of this.object_mast.Level2) {
          //   if (l_obj_1.Level3.length > 0) {
          //     for (let l_obj_2 of l_obj_1.Level3) {
          //       if (l_obj_2.Level4.length > 0) {
          //         for (let l_obj_3 of l_obj_2.Level4) {
          //           if (l_obj_3.Level5.length > 0) {
          //             for (let l_obj_4 of l_obj_3.Level5) {
          //               if (l_obj_4) {
          //                 let l_object_code = l_obj_4.calling_object_code + "_localEntryList";
          //                 this.pouchDBService.getObject(l_object_code).then(res => {
          //                   let l_data: any = res;
          //                   l_obj_4.noOfEntry = l_data.count;
          //                 }, err => {
          //                   console.log(err);
          //                   l_obj_4.noOfEntry = 0;
          //                 })
          //               }
          //             }
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
          //------------------------ Offline Entry Records for Each Object------------------------------------//
        }
      }
      else {
        if (this.wscp.service_type == "get_object_config") {
          let resArr = data.responseMsg.split('#')
          if (resArr[0] == "V") {
            this.globalObjects.presentAlert(resArr[1]);

            this.market.open('com.lhs.lhsvtwo');
          } else if (resArr[0] == "Q") {
            this.globalObjects.presentAlert(resArr[1]);
          } else {
            this.globalObjects.presentAlert(data.responseMsg);
          }
        }
      }

      let localdata = this.globalObjects.getLocallData("dragabledata");
      let framedata = [];
      if (localdata) {
        for (let x of localdata) {
          if (x.objKey == this.object_mast.Level2[this.page_no].object_code) {
            for (let dragFrame of x.frames) {
              for (let y in dragFrame) {
                for (let frame of this.object_mast.Level2[this.page_no].Level3) {
                  if (frame.apps_page_frame_seqid == y) {
                    frame.apps_frame_seqno = dragFrame[y];
                    framedata[dragFrame[y] - 1] = frame;
                  }
                }
              }

            }
            this.object_mast.Level2[this.page_no].Level3 = framedata
          }
        }
      }


      let notificationObject = this.globalObjects.getLocallData("notiObjectCode");

      if (notificationObject) {
        this.wscp.object_code = notificationObject;
        this.globalObjects.destroyLocalData("notiObjectCode");


        let componentProps = {
          click_events_str: "get_object_config",
          object_mast: [],
          wscp: { object_code: notificationObject },
          wsdp: [],
          wsdpcl: []
        }

        this.openPage(componentProps)
      }

      //  this.appPageName = this.object_mast.Level2[this.page_no].apps_page_name;

      /*   console.log(this.object_mast.Level2[this.page_no]);
        console.log(framedata); */
    }).catch(err => {
      this.globalObjects.presentToast("5 Something went wrong please try again later!");
      //console.log(err);
      let msg = err
      msg.message = "Http failure response.";
      msg.url = msg.url ? msg.url.split("lhsws")[0] : null;
      if (msg.url) {
        alert(JSON.stringify(msg));
      }
    })
  }



  setPageInfo() {
    for (let frame of this.object_mast.Level2[this.page_no].Level3) {
      for (let itemGroup of frame.Level4) {
        let itemMast: any = [];
        for (let item of itemGroup.Level5Values) {
          let item1 = {};
          let count = 0;
          for (let key of itemGroup.Level5Keys) {
            item1[key] = item[count];
            count++;
          }
          itemMast.push(item1);
        }
        itemGroup.Level5 = itemMast;
        delete itemGroup['Level5Keys'];
        delete itemGroup['Level5Values'];
      }
    }
  }
  goItemClicked(event, i) {
    this.globalObjects.breadCrumpsArray.splice(i, this.globalObjects.breadCrumpsArray.length);
    console.log(this.globalObjects.breadCrumpsArray);
    this.itemClicked(event);
  }

  itemClicked(event) {

    if (event.rightClickFlag) {
      if (event.calling_object_code) {
        this.openPop(event)
      }
    } else {
      if (event.lovData) {
        this.setLovData(event.lovData);

      }



      this.mirrorItems(event);
      if (event.changeEvent) {
        this.setSessionValue(event);
      }

      if (event.childItems) {
        this.openPop(event.childItems);
      } else {

        if (event.click_events_str || event.post_events_str) {
          let click_events_str_arr = [];
          if (event.click_events_str && event['click_events_str'].indexOf('~~') > -1 && (!event.itemClicked || event.itemClicked != 'post')) {
            click_events_str_arr = event['click_events_str'].split('~~');
            var newstr = click_events_str_arr[1].replace("strLoginID", this.userDetails.user_code);
            let secondstring = newstr.replace("strPassword", this.userDetails.password)
            if (click_events_str_arr[0] == "OPEN_URL" && click_events_str_arr[1].indexOf("ErpReports") > -1) {
              var windowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
              if (click_events_str_arr[1].indexOf('http://') > -1) {
                let url = click_events_str_arr[1].split("http://")[1];
                for (let frame of this.object_mast.Level2[this.page_no].Level3) {
                  if (frame.apps_page_frame_seqid == event.apps_page_frame_seqid) {
                    if (frame.tableRows) {
                      for (let itemGroup of frame.tableRows[event.itemIndex]) {
                        if (itemGroup.Level5) {
                          for (let item of itemGroup.Level5) {
                            let itemName = ":" + item.item_name.toLowerCase();
                            url = url.replace(itemName, item.value);
                          }
                        } else {
                          if (itemGroup) {
                            for (let item of itemGroup) {
                              let itemName = ":" + item.item_name.toLowerCase();
                              url = url.replace(itemName, item.value);
                            }
                          }
                        }
                      }
                    }
                  }
                }
                for (let x in this.userDetails) {
                  if (url.indexOf(":" + x.toLowerCase()) > -1) {
                    let itemName = ":" + x.toLowerCase();
                    url = url.replace(itemName, this.userDetails[x]);
                  }
                }
                window.open("http://" + url, '_system', windowFeatures);
              } else {
                let url = click_events_str_arr[1].split("https://")[1];
                for (let frame of this.object_mast.Level2[this.page_no].Level3) {
                  if (frame.apps_page_frame_seqid == event.apps_page_frame_seqid) {
                    if (frame.tableRows) {
                      for (let itemGroup of frame.tableRows[event.itemIndex]) {
                        if (itemGroup.Level5) {
                          for (let item of itemGroup.Level5) {
                            let itemName = ":" + item.item_name.toLowerCase();
                            url = url.replace(itemName, item.value);
                          }
                        } else {
                          if (itemGroup) {
                            for (let item of itemGroup) {
                              let itemName = ":" + item.item_name.toLowerCase();
                              url = url.replace(itemName, item.value);
                            }
                          }
                        }
                      }
                    }
                  }
                }
                for (let x in this.userDetails) {
                  if (url.indexOf(":" + x.toLowerCase()) > -1) {
                    let itemName = ":" + x.toLowerCase();
                    url = url.replace(itemName, this.userDetails[x]);
                  }
                }
                window.open("https://" + url, '_system', windowFeatures);
              }
            } else {
              if (click_events_str_arr[1].indexOf("#") > -1) {
                let url = click_events_str_arr[1];
                for (let x in this.userDetails) {
                  if (click_events_str_arr[1].indexOf("#" + x.toLowerCase() + "#") > -1) {
                    let itemName = "#" + x.toLowerCase() + "#";
                    url = url.replace(itemName, this.userDetails[x]);
                  }
                }

                for (let frame of this.object_mast.Level2[this.page_no].Level3) {
                  if (frame.tableRows) {
                    if (frame.apps_page_frame_seqid == event.apps_page_frame_seqid) {
                      let data = frame.tableRows[event.itemIndex];
                      for (let obj of data) {
                        if (frame.apps_frame_type == 'TABLE') {
                          let itemName = obj[0].item_name.toLowerCase();
                          url = url.replace("#" + itemName + "#", obj[0].value);
                        } else {
                          if (obj.Level5 && obj.Level5.length > 0) {
                            for (let item of obj.Level5) {
                              let itemName = item.item_name.toLowerCase();
                              url = url.replace("#" + itemName + "#", item.value);
                            }
                          }
                        }
                      }
                    }
                  }
                }
                // this.iab.create(url, "_blank", {
                //   "location": "no", 
                //   "toolbar": "no"
                // });
                window.open(url, '_system', windowFeatures).focus();
              } else {
                if (click_events_str_arr[1].indexOf("ErpReports") > -1) {
                  window.open("http://docs.google.com/gview?embedded=true&url=" + click_events_str_arr[1], '_system', windowFeatures);
                } else {
                  window.open(click_events_str_arr[1], '_system', windowFeatures);
                  // this.iab.create(click_events_str_arr[1], "_blank", {
                  //   "location": "no", 
                  //   "toolbar": "no"
                  // });
                }
              }
            }
          }
          else if (event.click_events_str && event['click_events_str'].indexOf('OPEN_URL') > -1 && (!event.itemClicked || event.itemClicked != 'post')) {
            if (event['click_events_str'].indexOf('~~') <= -1) {
              var windowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
              let url = event.value.toString();
              window.open(url, '_system');
              // this.iab.create(url, "_blank", {
              //   "location": "no", 
              //   "toolbar": "no"
              // });
            }
          }
          else if (event.click_events_str && event['click_events_str'].indexOf('OPEN_JAVA_URL') > -1 && (!event.itemClicked || event.itemClicked != 'post')) {
            this.openWebLinks(event)
          } else if ((event.click_events_str && event.click_events_str.indexOf("checkValidFrame") > -1) && (!event.itemClicked || event.itemClicked != 'post')) {
            event.click_events_count = 0;
            let isValid = this.checkValidFrame(event);
            if (!isValid) {
              this.globalObjects.clickedbutton = false;
              this.globalObjects.presentAlert("Please correct all the errors and enter valid input")
            } else {
              event.click_events_arr = event.click_events_str.split("#");
              event.click_events_count = event.click_events_count + 1;
              this.itemClicked1(event, event.click_events_str);
            }
          }
          else {
            let clickEventStr = "";
            if (event.itemClicked && event.itemClicked == 'pre') {
              clickEventStr = event.click_events_str;
            } else if (event.itemClicked && event.itemClicked == 'post') {
              clickEventStr = event.post_events_str;
            } else {
              clickEventStr = event.click_events_str;
            }


            if (clickEventStr && clickEventStr.indexOf(";") > -1) {
              event.click_events_arr = clickEventStr.split(";");
            } else {
              event.click_events_arr = clickEventStr ? clickEventStr.split("#") : [];
            }
            event.click_events_count = 0;
            this.itemClicked1(event, clickEventStr);
          }
        }
      }
    }
  }


  itemClicked1(event, clickEventStr) {
    // this.events.publish('toggleVibrate', true);
    //  this.samePageNo = this.globalObjects.samePageNo;
    this.breadCrumsuper = event;
    // this.events.publish('toggleSound', true);
    if (this.globalObjects.toggleSound) {
      this.nativeAudio.play(this.globalObjects.audio.id).then(() => { }, (err) => {
        // alert(JSON.stringify(err));
      });
    }
    if (this.globalObjects.toggleVibrate) {
      navigator.vibrate(500);
    }


    if (event.calling_object_code && event.calling_object_code == this.object_mast.object_code) {
      this.globalObjects.refreshId++;
    }


    this.sessionObj = event.sessionObj;
    let nextPageInfo: any = {};
    nextPageInfo.click_events_str = clickEventStr;

    if (event.calling_parameter_str && (event.calling_parameter_str.indexOf('popover') > -1)) {
      let callingArr = event.calling_parameter_str.split('~');
      for (let c of callingArr) {
        if (c.indexOf('popover') > -1) {
          nextPageInfo.popoverStyle = c;
        }
      }
    }


    if (event.wsdp) {
      nextPageInfo.wsdp = event.wsdp;
    }
    nextPageInfo.wscp = {};

    if (this.object_mast.Level2[this.page_no].origin_apps_item_seqid) {
      // this.wscp.origin_apps_item_seqid = this.object_mast.Level2[this.page_no].origin_apps_item_seqid;
      nextPageInfo.wscp.origin_apps_item_seqid = this.object_mast.Level2[this.page_no].origin_apps_item_seqid;
    }


    nextPageInfo.wscp.calling_parameter_str = event.calling_parameter_str;
    nextPageInfo.wscp.orignal_apps_page_frame_seqid = event.orignal_apps_page_frame_seqid;
    nextPageInfo.wscp.orignal_apps_item_seqid = event.orignal_apps_item_seqid;
    nextPageInfo.wscp.orignal_object_code = event.orignal_object_code;

    nextPageInfo.wscp.platform = this.globalObjects.getLocallData('platformValue');
    nextPageInfo.wscp.iud_seqid = this.object_mast.Level2[this.page_no].iud_seqid;
    nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
    nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
    nextPageInfo.wscp.local_Item_Seq_Id = event.local_Item_Seq_Id;
    this.wscp.local_Item_Seq_Id = event.local_Item_Seq_Id;
    if (event.wscp) {
      if (event.wscp.apps_item_seqid) {
        nextPageInfo.wscp.apps_item_seqid = event.wscp.apps_item_seqid;
      }
    }
    if (event.prev_ws_seqid) {
      nextPageInfo.wscp.prev_ws_seqid = event.prev_ws_seqid;
    }
    if (event.callingObjectArr) {
      if (event.callingObjectArr.length > 0) {
        let clickIndex = event.itemIndex;
        let callingObjectCodeStr = event.callingObjectArr[clickIndex].value;
        // console.log(callingObjectCodeStr);
        let codeValueJsonArr = this.globalObjects.getCodeValueJsonArr(callingObjectCodeStr);
        // console.log(codeValueJsonArr);
        for (let codeValue of codeValueJsonArr) {
          if (JSON.stringify(codeValue.head).toUpperCase() == JSON.stringify(event.item_name).toUpperCase()) {
            nextPageInfo.wscp.object_code = codeValue.objectCode;
          }
        }
      } else {
        nextPageInfo.wscp.object_code = event.calling_object_code;
      }
    } else {
      nextPageInfo.wscp.object_code = event.calling_object_code;
    }
    nextPageInfo.wscp.apps_working_mode = this.object_mast.apps_working_mode;
    nextPageInfo.wscp.item_sub_type = event.item_sub_type;
    nextPageInfo.wscp.pageno = event.calling_pageno;
    // nextPageInfo.wscp.calling_parameter_str = event.calling_parameter_str;
    nextPageInfo.wscp.click_events_str = event.click_events_arr[event.click_events_count];
    if (event.calling_parameter_str) {
      nextPageInfo.pageParameter = {};
      let temp = event.calling_parameter_str.split("~~");
      for (let t of temp) {
        nextPageInfo.pageParameter[(t.split("=")[0])] = t.split("=")[1]
      }
    }

    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        nextPageInfo.wscp[key] = this.sessionObj[key];
      }
    }
    nextPageInfo.object_mast = this.object_mast;
    nextPageInfo.wsdpcl = event.wsdpcl;
    nextPageInfo.sessionObj = event.sessionObj;
    nextPageInfo.wscp.flag = event.flag;


    if (this.globalObjects.callingPara.length > 0) {
      let newglob = [];
      for (let glob of this.globalObjects.callingPara) {
        if ((glob.objectCode == event.apps_page_frame_seqid.split("-")[0]) && (glob.itemCode == event.apps_item_seqid)) {

        } else {
          newglob.push(glob);
        }
      }
      this.globalObjects.callingPara = newglob;
    }

    if (this.globalObjects.callingParameter.length > 0 && event.calling_object_code) {
      let index = 0;

      for (let glob of this.globalObjects.callingParameter) {
        if (glob.obj_code == event.calling_object_code) {
          this.globalObjects.callingParameter.splice(index, 1);
        }
        index++
      }
    }

    this.lhs_lib.clickEvent = event;
    this.clickEvent = event;
    if (event.calling_parameter_str) {
      this.callingParaFunc(event);
    }

    if (event.click_events_arr[event.click_events_count] != "SAME_PAGE") {
      this.globalObjects.samePageNo = 1;
    }



    if (event.click_events_arr[event.click_events_count] == "NEXT_PAGE") {
      if (event.calling_frame_seqid_str && event.calling_frame_seqid_str.indexOf("#") > -1) {
        if (event.page_no) {
          nextPageInfo.page_no = event.page_no;
          this.order_pageno = nextPageInfo.page_no;
        } else {
          nextPageInfo.page_no = this.page_no + 1;
        }
        let seqid_arr = event.calling_frame_seqid_str.split("#");
        let calling_frame_seqid_arr = [];
        for (let x of seqid_arr) {
          if (x) {
            calling_frame_seqid_arr.push(x);
          }
        }
        nextPageInfo.calling_frame_seqid_arr = calling_frame_seqid_arr;
        this.calling_frame_seqid_str_concat(nextPageInfo);
      } else {
        if (event.page_no) {
          nextPageInfo.page_no = event.page_no;
          this.order_pageno = nextPageInfo.page_no;
        } else {
          nextPageInfo.page_no = this.page_no + 1;
        }
        this.openPage(nextPageInfo);
      }

      //  calling_frame_seqid_arr.indexOf('#')

    } else if (event.click_events_arr[event.click_events_count].indexOf("checkValidRow") > -1) {
      if (event.click_events_arr.length > (event.click_events_count + 1)) {
        event.click_events_count = event.click_events_count + 1;
        this.itemClicked1(event, clickEventStr);
      }

    } else if (event.click_events_arr[event.click_events_count].indexOf("CONCAT") > -1) {
      let concatKey = event.click_events_arr[event.click_events_count].split('~');
      nextPageInfo.concatKey = concatKey;
      this.concatFun(nextPageInfo, event, clickEventStr);

    } else if (event.click_events_arr[event.click_events_count] == 'RUN_JS') {
      //alert(value)

      let key = `declare
      l_avg_percent number:=(avg(:JSSC.avl_limit) / MIN(JSSC.cred_limit)) * 100;
      begin
      for (i in 1..get_frame_value('JSSC','count(avl_limit)) loop
      if :JSSC.per.i <l_avg_percent then
         set_item_config(":jssc.", "display_setting_str", "{'background-color':'red'}", i);
      else
         set_item_config(":jssc.", "display_setting_str", "{'background-color':'green'}", i);
      end if;
      end loop;
      end; `

      let value = this.convert_plsq_js.getConvertedScript(key);
      console.log(value);
      // alert(value);

      // this.execute_js(event.value);

      //  eval(event.value);

    } else if (event.click_events_arr[event.click_events_count] == "SAME_PAGE") {
      // nextPageInfo.samePageNo = this.globalObjects.samePageNo;
      nextPageInfo.samePageNo = this.page_no + 1;
      nextPageInfo.page_no = this.page_no + 1;
      nextPageInfo.wscp.item_sub_type = event.item_sub_type;
      nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
      nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      nextPageInfo.clickEvt = event.click_events_arr[event.click_events_count];
      this.samePageForm(nextPageInfo, event, clickEventStr);
    }
    else if (event.click_events_arr[event.click_events_count] == "BACK_PAGE") {
      this.closePage(event, clickEventStr);
    }
    else if (event.click_events_arr[event.click_events_count] == "POPUP_BACK_PAGE") {
      this.popupClosePage();
    } else if (event.click_events_arr[event.click_events_count] == "go_home_page") {
      // location.reload();
      if (this.platform.is('ios') || this.platform.is('android')) {
        location.reload();
      }
      else {
        let url: any = location;
        window.open(String(url).split('super')[0], '_self');
      }
    }
    //  else if (event.click_events_arr[event.click_events_count] == "SAVE_FRAME_PKEY" ||
    //   event.click_events_arr[event.click_events_count] == "UPDATE_FRAME_PKEY" ||
    //   event.click_events_arr[event.click_events_count] == "DELETE_FRAME_PKEY") {
    //   nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
    //   nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
    //   nextPageInfo.wscp.apps_page_no = event.apps_page_no;
    //   nextPageInfo.wscp.object_code = event.object_code;
    //   nextPageInfo.wscp.service_type = event.click_events_arr[event.click_events_count];
    //   this.saveData(nextPageInfo, event, event.click_events_arr[event.click_events_count]);
    // }
    else if (event.click_events_arr[event.click_events_count] == " ") {
      nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
      nextPageInfo.wscp.apps_page_no = event.apps_page_no;
      nextPageInfo.wscp.object_code = event.object_code;
      nextPageInfo.wscp.service_type = event.click_events_arr[event.click_events_count];
      this.execute_plsql(nextPageInfo, event, clickEventStr);
    } else if (event.click_events_arr[event.click_events_count] == "UPDATE_IRFEILDS") {
      nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
      nextPageInfo.wscp.apps_page_no = event.apps_page_no;
      nextPageInfo.wscp.object_code = event.object_code;
      nextPageInfo.wscp.service_type = "UPDATE_IRFEILDS";
      this.saveData(nextPageInfo, event, event.click_events_arr[event.click_events_count], clickEventStr);
    } else if (event.click_events_arr[event.click_events_count] == "when_new_form_instance" ||
      event.click_events_arr[event.click_events_count] == "SAVE_FRAME_PKEY" ||
      event.click_events_arr[event.click_events_count] == "execute_item_plsql" ||
      event.click_events_arr[event.click_events_count].toLowerCase() == "ora_plsql1_text" ||
      event.click_events_arr[event.click_events_count].toLowerCase() == "ora_plsql2_text" ||
      event.click_events_arr[event.click_events_count] == "get_process_report_data") {

      nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
      nextPageInfo.wscp.apps_page_no = event.apps_page_no;
      nextPageInfo.wscp.object_code = event.object_code;
      nextPageInfo.wscp.service_type = event.click_events_arr[event.click_events_count];

      /*  uncomment when calling_frame_seqid_str using . now this is done by plsql*/

      if (event.calling_frame_seqid_str && event.calling_frame_seqid_str.indexOf("#") > -1) {
        let seqid_arr = event.calling_frame_seqid_str.split("#");
        let calling_frame_seqid_arr = [];
        for (let x of seqid_arr) {
          if (x) {
            calling_frame_seqid_arr.push(x);
          }
        }
        event.calling_frame_seqid_arr = calling_frame_seqid_arr;
      }
      //  calling_frame_seqid_arr.indexOf('#')
      this.execute_plsql(nextPageInfo, event, clickEventStr);

    }
    else if (event.click_events_arr[event.click_events_count].indexOf("execute_item_plsql_cb") > -1) {
      nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
      nextPageInfo.wscp.apps_page_no = event.apps_page_no;
      nextPageInfo.wscp.object_code = event.object_code;
      nextPageInfo.wscp.service_type = "execute_item_plsql";

      /*  uncomment when calling_frame_seqid_str using . now this is done by plsql*/

      if (event.calling_frame_seqid_str && event.calling_frame_seqid_str.indexOf("#") > -1) {
        let seqid_arr = event.calling_frame_seqid_str.split("#");
        let calling_frame_seqid_arr = [];
        for (let x of seqid_arr) {
          if (x) {
            calling_frame_seqid_arr.push(x);
          }
        }
        event.calling_frame_seqid_arr = calling_frame_seqid_arr;
      }
      //  calling_frame_seqid_arr.indexOf('#')
      this.execute_plsql(nextPageInfo, event, clickEventStr);
    } else if (event.click_events_str && event.click_events_arr[event.click_events_count].toLowerCase().indexOf('server_host(') > -1) {
      let param = event.click_events_arr[event.click_events_count].split("(")[1].split(")")[0];
      this.server_host(event, param);
    }

    else if (event.click_events_arr[event.click_events_count].indexOf("execute_item_plsql") > -1) {
      let uniqKey = event.click_events_arr[event.click_events_count].split('~');
      let globKey = this.globalObjects.uniqueKey;
      if ((uniqKey[1] == 'unique') && (globKey == this.object_mast.Level2[this.page_no].iud_seqid)) {
        this.globalObjects.presentAlert('Your Transction is already in Queue.(message from app (unique))');
      } else {
        nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
        nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
        nextPageInfo.wscp.apps_page_no = event.apps_page_no;
        nextPageInfo.wscp.object_code = event.object_code;
        nextPageInfo.wscp.service_type = "execute_item_plsql";
        /*  uncomment when calling_frame_seqid_str using . now this is done by plsql*/
        if (event.calling_frame_seqid_str && event.calling_frame_seqid_str.indexOf("#") > -1) {
          let seqid_arr = event.calling_frame_seqid_str.split("#");
          let calling_frame_seqid_arr = [];
          for (let x of seqid_arr) {
            if (x) {
              calling_frame_seqid_arr.push(x);
            }
          }
          event.calling_frame_seqid_arr = calling_frame_seqid_arr;
        }
        this.globalObjects.uniqueKey = this.object_mast.Level2[this.page_no].iud_seqid;
        //  calling_frame_seqid_arr.indexOf('#')
        this.execute_plsql(nextPageInfo, event, clickEventStr);
      }
    }
    else if (event.click_events_arr[event.click_events_count].indexOf('go_approval_tab') > -1) {
      nextPageInfo.wscp.object_code = event.calling_object_code;
      nextPageInfo.wscp.item_sub_type = event.item_sub_type;
      nextPageInfo.wscp.pageno = event.calling_pageno;
      nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
      nextPageInfo.wscp.apps_page_no = event.apps_page_no;
      nextPageInfo.wscp.service_type = "APPROVAL_DETAIL";
      nextPageInfo.frame = this.object_mast.Level2[this.page_no].Level3;
      nextPageInfo.wslp = this.userDetails;
      this.open_model_page(nextPageInfo);
    } else if (event.click_events_arr[event.click_events_count].indexOf('super_approval_tab') > -1) {
      // nextPageInfo.wscp.service_type = "APPROVAL_DETAIL";
      /* nextPageInfo.wscp.item_sub_type = event.item_sub_type;
         nextPageInfo.wscp.pageno = event.calling_pageno;
         nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
         nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
         nextPageInfo.wscp.apps_page_no = event.apps_page_no;
         nextPageInfo.frame = this.object_mast.Level2[this.page_no].Level3;
         nextPageInfo.wslp = this.userDetails;
         nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid; */
      nextPageInfo.object_mast = [];
      nextPageInfo.wscp.object_code = event.calling_object_code;
      nextPageInfo.wscp.get_tab_count_pages = 'get_tab_count_pages';
      this.openPage(nextPageInfo);
    } else if (event.click_events_arr[event.click_events_count] == 'go-multi-level-tab') {
      nextPageInfo.wscp.object_code = event.calling_object_code;
      nextPageInfo.wscp.item_sub_type = event.item_sub_type;
      nextPageInfo.wscp.pageno = event.calling_pageno;
      nextPageInfo.wscp.apps_page_frame_seqid = event.calling_frame_seqid_str;
      nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
      nextPageInfo.wscp.apps_page_no = event.apps_page_no;
      nextPageInfo.wscp.service_type = event.calling_object_code;
      nextPageInfo.frame = this.object_mast.Level2[this.page_no].Level3;
      nextPageInfo.wslp = this.userDetails;
      this.open_model_multilevel_page(nextPageInfo);
    } else if (event.click_events_arr[event.click_events_count].toLowerCase() == 'refresh_location') {
      this.refresh_cordinate();
    }
    else if (event.click_events_arr[event.click_events_count].indexOf("populateExcel") > -1) {
      this.getexceldetail(event.files[0]).then((data: any) => {
        this.moveExceltoFrame(event, data.head, data.tableBody);
      }, (error) => {
        this.globalObjects.presentAlert("Error while reading file. Please check required format and try again.");
      });

    } else if (event.click_events_arr[event.click_events_count].indexOf("download") > -1) {

      nextPageInfo.click_event = event.click_events_arr[event.click_events_count];
      nextPageInfo.wscp.service_type = clickEventStr;
      this.downloadFromJava(nextPageInfo);
    }
    else if (event.click_events_arr[event.click_events_count].indexOf("FILE_UPLOAD") > -1) {
      if (event.files.length > 0) {
        event.value = null;
        for (let file of event.files) {
          this.globalObjects.converToBase64(file).then((data: any) => {
            event.value = event.value ? (event.value + data.split(",")[1]) : data.split(",")[1];
            event.value = event.value + "~" + file.name.replace(/\s/g, '_') + "#";
            console.log(event.value);
            // window.location.href = data;
          }, (error) => {
            this.globalObjects.presentAlert("Error while reading file...");
          });
        }
      } else {
        this.globalObjects.presentAlert("No file selected...");
      }
    }
    else if (event.click_events_arr[event.click_events_count] == "addRow") {
      event.pageNo = this.page_no;
      this.addNewRow(event);
    }

    else if (event.click_events_arr[event.click_events_count] == "refresh_app") {
      console.log(event)
    }
    else if (event.click_events_arr[event.click_events_count] == "calender") {
      this.addCalender(event);
    } else if (event.click_events_arr[event.click_events_count] == "editable" || event.click_events_arr[event.click_events_count] == "EDITABLE") {
      if (event.click_events_arr.length > (event.click_events_count + 1)) {
        event.click_events_count = event.click_events_count + 1;
        this.itemClicked1(event, clickEventStr);
      }
    } else if (event.click_events_arr[event.click_events_count].indexOf("addItemQR") > -1) {
      let event_str = event.click_events_arr[event.click_events_count];
      if (event_str.indexOf("~")) {
        event.addFrameSeqId = event_str.split("~")[1];
      }
      this.addItemQR(event);
    }
    else if (event.click_events_arr[event.click_events_count].indexOf("addItem") > -1 && !(event.click_events_arr[event.click_events_count].indexOf("addItem_QR") > -1)) {
      let event_str = event.click_events_arr[event.click_events_count];
      if (event_str.indexOf("~")) {
        event.addFrameSeqId = event_str.split("~")[1];
      }
      this.additem(event, clickEventStr);
    }
    else if (event.click_events_arr[event.click_events_count].indexOf("addMirrorItem") > -1) {
      let event_str = event.click_events_arr[event.click_events_count];
      if (event_str.indexOf("~")) {
        event.addFrameSeqId = event_str.split("~")[1];
      }
      this.additemMirror(event, clickEventStr);
    }
    else if (event.click_events_arr[event.click_events_count].indexOf("itemAddFrom") > -1) {
      let event_str = event.click_events_arr[event.click_events_count];
      if (event_str.indexOf("~")) {
        event.fromFrameSeq = event_str.split("~")[1];
      }
      this.addItemFrom(event, clickEventStr);
    }

    else if (event.click_events_arr[event.click_events_count].indexOf("transferItemFromTo") > -1) {
      let event_str = event.click_events_arr[event.click_events_count];
      let str = event_str.split('~');
      event.fromFrame = str[1];
      event.toFrame = str[2];
      event.pageNo = this.page_no;
      this.transferItem(event, clickEventStr);
    } else if ((event.click_events_arr[event.click_events_count] == "editItem") || (clickEventStr.indexOf("editItem") > -1)) {
      this.editItem(event);
    } else if (event.click_events_arr[event.click_events_count] == "deleteItem") {
      // this.deleteRow(event);
    } else if (event.click_events_arr[event.click_events_count] == "CHECK_GEOFENCE") {
      this.checkGeofence(event, clickEventStr);
    } else if (event.click_events_arr[event.click_events_count] == "SEND_SMS") {
      this.sendSms(event);
    } else if (event.click_events_arr[event.click_events_count] == "smsMobile") {
      this.sendSmsThrought('smsMobile', event, clickEventStr);
    } else if (event.click_events_arr[event.click_events_count] == "smsApi") {
      this.sendSmsThrought('smsApi', event, clickEventStr);
    } else if (event.click_events_arr[event.click_events_count] == "send_hardcoded_email" || event.click_events_arr[event.click_events_count] == "send_hardcoded_email_attch") {
      this.sendEmail(event, event.click_events_arr[event.click_events_count], clickEventStr);
    } else if (event.click_events_arr[event.click_events_count] == "SEND_WHATSAPP") {
      this.shareViaWhatsApp(event, clickEventStr);
    }
    else if (event.click_events_arr[event.click_events_count] == "call_logs") {
      nextPageInfo.wscp.object_code = event.calling_object_code;
      nextPageInfo.wscp.item_sub_type = event.item_sub_type;
      nextPageInfo.wscp.pageno = event.calling_pageno;
      nextPageInfo.wscp.apps_page_frame_seqid = event.calling_frame_seqid_str;
      nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
      nextPageInfo.wscp.apps_page_no = event.apps_page_no;
      nextPageInfo.wscp.service_type = "call_logs";
      this.callLogs(nextPageInfo, event, clickEventStr);
    }

    else if (event.click_events_arr[event.click_events_count].indexOf("START_TRACKING") > -1) {
      let event_str = event.click_events_arr[event.click_events_count];
      let interval_time: any = 5;
      if (event_str.indexOf("~")) {
        interval_time = event_str.split("~")[1];
      }
      event.interval_time = interval_time;
      this.trackingEvent("START", event, clickEventStr);
    }
    // else if (event.click_events_arr[event.click_events_count].indexOf("APPROVE_REJECT") > -1){
    //   nextPageInfo.click_events_arr = event.click_events_arr;
    //   nextPageInfo.click_events_count = event.click_events_count;
    //   nextPageInfo.wscp.service_type = event.wscp.service_type;
    //   this.approveReject(nextPageInfo);
    // }
    else if (event.click_events_arr[event.click_events_count] == "END_TRACKING") {
      this.background.bgmode = true;
      this.trackingEvent("END", event, clickEventStr);
    }
    else if (event.click_events_arr[event.click_events_count].indexOf("exit_pages_refresh") > -1) {
      let event_str = event.click_events_arr[event.click_events_count];
      if (event_str.indexOf("~")) {
        this.globalObjects.frameSeqId = event_str.split("~")[1];
      }
      this.modalCtrl.dismiss();
    }
    else if (event.click_events_arr[event.click_events_count] == "get_object_config_exit") {
      this.modalCtrl.dismiss();
      nextPageInfo.object_mast = [];
      this.openPage(nextPageInfo);
    }
    else if (event.click_events_arr[event.click_events_count] == "SEND_NOTIFICATION") {
      this.sendNotification(event, clickEventStr);
    }
    else if (event.click_events_arr[event.click_events_count] == "SEND_HTML_MAIL") {
      this.sendHtml(event);
    }
    else if (event.click_events_arr[event.click_events_count] == "SWITCH_SMART_VIEW") {
      this.switchSmart(event);
    }
    else if (event.click_events_arr[event.click_events_count].indexOf("SWITCH_SMART_VIEW") > -1) {
      let switchFrames = [];
      switchFrames = event.click_events_arr[event.click_events_count].split('~');
      event.switchFrames = switchFrames;
      this.switchSmart(event);
    }

    else if (event.click_events_arr[event.click_events_count] == "get_object_config_all_exit") {
      location.reload();

    } else if (event.click_events_arr[event.click_events_count].indexOf("REFRESH_FRAME") > -1) {

      nextPageInfo.apps_page_frame_seqid = event.apps_page_frame_seqid;
      nextPageInfo.apps_item_seqid = event.apps_item_seqid;
      nextPageInfo.apps_page_no = event.apps_page_no;
      nextPageInfo.object_code = event.object_code;

      nextPageInfo.clickEvt = event.click_events_arr[event.click_events_count];
      nextPageInfo.wscp.item_sub_type = event.item_sub_type;
      nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
      nextPageInfo.click_events_arr = event.click_events_arr
      nextPageInfo.click_events_count = event.click_events_count
      nextPageInfo.wscp.object_code = event.object_code;
      this.refreshSamePage(nextPageInfo, clickEventStr);

    } else if (event.click_events_arr[event.click_events_count].toLowerCase().indexOf("set_frame_config") > -1) {

      let str = "this.lhs_lib." + event.click_events_arr[event.click_events_count].toLowerCase();

      eval(str);
      let clickEv = event.click_events_arr[event.click_events_count].split(",")[0].split("(")[1].replaceAll("'", "");
      nextPageInfo.clickEvt = clickEv;
      nextPageInfo.wscp.item_sub_type = event.item_sub_type;
      nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
      nextPageInfo.click_events_arr = event.click_events_arr
      nextPageInfo.click_events_count = event.click_events_count
      nextPageInfo.wscp.object_code = event.object_code;
      this.refreshSamePage(nextPageInfo, clickEventStr);

    }

    else if (event.click_events_arr[event.click_events_count] == "openFile") {
      this.openFileOnServer(event);
    }

    else if (event.click_events_arr[event.click_events_count] == "SEND_EMAIL") {
      this.sendEmailJava(event, clickEventStr);
    }
    else if (event.click_events_arr[event.click_events_count] == "open_in_browser") {
      if (this.platform.is('ios') || this.platform.is('android')) {
        this.globalObjects.presentAlert("This page can be open in browser only...")
      } else {
        nextPageInfo.object_mast = [];
        this.openPage(nextPageInfo);
      }
    } else if (clickEventStr == "devEditItem") {

      nextPageInfo.object_mast = [];
      nextPageInfo.item_type = event.item_type;
      nextPageInfo.item_sub_type = event.item_sub_type;

      this.devEditItem(nextPageInfo);

    } else if (event.click_events_arr[event.click_events_count].toLowerCase() == "execute_query") {



      this.refreshObjFab();
    }
    else if (event.click_events_arr[event.click_events_count] == "SAME_OBJECT_REFRESH") {
      // this.refreshObj = true;
      this.wscp.service_type = ""
      this.refreshObjFab();
    } else if (event.click_events_arr[event.click_events_count].indexOf("go_item") > -1) {
      eval("this.lhs_lib." + event.click_events_arr[event.click_events_count]);
    } else if (event.click_events_arr[event.click_events_count].toLowerCase().indexOf("back_object") > -1) {
      this.globalObjects.backObjectCode = event.click_events_arr[event.click_events_count].split("(")[1].replace(")", "");
      this.modalCtrl.dismiss();
    }
    else if (event.click_events_arr[event.click_events_count].indexOf("delete_record") > -1) {
      eval("this.lhs_lib." + event.click_events_arr[event.click_events_count]);
    }
    else {
      nextPageInfo.object_mast = [];
      // if(nextPageInfo.wscp.object_code=="READ_NOTIFICATION" && nextPageInfo.wscp.flag=="null" ){
      //   this.popOverCtrl.dismiss();
      //   nextPageInfo.wscp.flag="M";
      // }
      if (event.click_events_arr[event.click_events_count] == "get_object_config~OTP") {
        this.openOtpPop(nextPageInfo);
      } else {
        if (event.click_events_arr[event.click_events_count] != "") {
          this.openPage(nextPageInfo);
        }
      }
    }
    console.log("it loads")
    //  this.globalObjects.samePageNo = 0;


    let a = this.object_mast
  }

  async openOtpPop(componentProps) {
    let popUp = await this.popOverCtrl.create({
      component: SuperPage,
      componentProps: {
        otpFlag: true,
        id: "globalPopover",
        otpFrameObjCode: this.object_mast.Level2[this.page_no].object_code
      },
      backdropDismiss: true
    });

    popUp.onDidDismiss().then((details: OverlayEventDetail) => {
      if (details.data.verifiedFlag == "F") {
        this.globalObjects.presentAlert("Please Enter A Valid Otp");
      } else if (details.data.verifiedFlag == "T") {
        this.openPage(componentProps);
      }
    });
    return await popUp.present();
  }

  closeAllModal(nextPageInfo) {
    if (this.globalObjects.frameSeqId) {
      if (nextPageInfo.wscp.apps_page_frame_seqid == this.globalObjects.frameSeqId) {
        //  nextPageInfo.object_mast = [];
        this.globalObjects.frameSeqId = "";
        this.ngOnInit();
        //  this.openPage(nextPageInfo);
      } else {
        this.modalCtrl.dismiss();
      }
    }
  }


  checkGeofence(event: any, clickEventStr) {
    var object_mast = this.object_mast.Level2
    for (let object of object_mast) {
      for (let frame of object.Level3) {
        let latitude;
        let longitude;
        if (frame.tableRows) {
          for (let framedata of frame.tableRows) {
            for (let itemGroup of framedata) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.item_default_value == "LATITUDE") {
                    latitude = item.value
                  } else if (item.item_default_value == "LONGITUDE") {
                    longitude = item.value
                  }
                }
              }
            }
          }
        }

        if (latitude && longitude) {
          // this.globalObjects.checkLocation(21.1191385, 79.0473204).then(res => {
          this.globalObjects.checkLocation(latitude, longitude).then(res => {
            let result = res;
            if (result) {
              if (event.click_events_arr.length > (event.click_events_count + 1)) {
                event.click_events_count = event.click_events_count + 1;
                this.itemClicked1(event, clickEventStr);
              }
            } else {
              this.globalObjects.presentAlert("You are out of Geolocation , You Can not complete this process");
            }
          })
        }
      }
    }
  }

  openFileOnServer(event) {
    if (this.platform.is('android')) {
      this.globalObjects.checkStoragePermission().then((res) => {
        if (res == 'success') {
          this.download(event);
        } else {
          this.globalObjects.presentAlert("Please grant storage permission to download file.")
        }
      })
    } else {
      this.download(event);
    }
  }

  // async openTextarea(){
  //   const popover = await this.popOverCtrl.create({
  //     component: OpenTextareaPage,
  //     backdropDismiss:false,
  //     translucent: true,
  //     componentProps: {}
  //   });

  //   popover.onDidDismiss().then((detail: OverlayEventDetail) => {

  //   });
  //   await popover.present();
  // }

  sendEmailJava(event, clickEventStr) {
    event.item_enable_flag = 'F'
    let a = this.object_mast;
    let ccMail = "";
    let toMail = "";
    let bccMail = "";
    let body = "";
    let mobile = "";
    let attachment = "";
    let subject = "";
    for (let obj of a.Level2) {
      for (let obj1 of obj.Level3) {
        if (event.apps_page_frame_seqid == obj1.apps_page_frame_seqid) {
          for (let obj2 of obj1.tableRows) {
            for (let obj3 of obj2) {
              for (let obj4 of obj3.Level5) {

                if (obj4.item_name == "CC_MAIL") {
                  ccMail = obj4.value;
                }
                else if (obj4.item_name == "BCC_MAIL") {
                  bccMail = obj4.value;
                }
                else if (obj4.item_name == "TO_MAIL") {
                  toMail = obj4.value;
                } else if (obj4.item_name == "MOBILENO" || obj4.item_name == "MOBILE_NUMBER") {
                  mobile = obj4.value;
                }
                else if (obj4.item_name == "ATTCH" || obj4.item_name == "ATTACHMENT") {
                  attachment = obj4.value;
                }
                else if (obj4.item_name == "EMAIL_BODY") {
                  body = obj4.value;
                }
                else if (obj4.item_name == "SUBJECT") {
                  subject = obj4.value;
                }
              }
            }
          }

        }
      }
    }
    let url = "sendEmail";
    let reqData = {
      "parameters": {
        "to_mail": toMail,
        "cc_mail": ccMail,
        "bcc_mail": bccMail,
        "subject": subject,
        "body": body
      }
    };
    this.dataService.postData(url, reqData).then((res: any) => {
      event.item_enable_flag = 'T'
      if (res.responseStatus == "success") {
        alert(res.responseMsg);
        this.popOverCtrl.dismiss();

      } else {
        alert(res.responseMsg)
      }
      if (event.click_events_arr.length > (event.click_events_count + 1)) {
        event.click_events_count = event.click_events_count + 1;
        this.itemClicked1(event, clickEventStr);
      }
    }, (err) => {
      alert("Server error...");
      event.item_enable_flag = 'T'
      if (event.click_events_arr.length > (event.click_events_count + 1)) {
        event.click_events_count = event.click_events_count + 1;
        this.itemClicked1(event, clickEventStr);
      }
    })
  }

  // async download(event) {
  //   // if (event.item_name == "FILE_PATH") {

  //   let filePath = event.value.replace(/\\/g, "/");
  //   let filename = filePath.split("/").reverse()[0];
  //   let fileExtn = filename.split('.').reverse()[0];
  //   let fileMIMEType = this.getMIMEtype(fileExtn);
  //   let downloadUrl = this.globalObjects.getScopeUrl() + 'downloadAnyFile?file=' + filePath;
  //   // let downloadUrl = "http://203.193.167.118:8888/lhsws/NW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA10G/downloadFile?file=C:/ugk_w/house/invoice/NC20Y-00006.pdf";
  //   let path = "";
  //   if (this.platform.is("ios")) {
  //     path = this.file.documentsDirectory;
  //   }
  //   if (this.platform.is("android")) {
  //     path = this.file.externalRootDirectory;
  //   }


  //   this.globalObjects.displayCordovaToast("Please wait download started...");

  //   this.makeXmlHttpReq(downloadUrl).then((data: any) => {

  //     if (this.platform.is('ios') || this.platform.is('android')) {
  //       alert("checking directory");
  //       this.file.checkDir(path, 'LHSAPP').then((res) => {
  //         alert("directory found");
  //         path = path + '/LHSAPP/'
  //         this.file.writeFile(path, filename, data, { replace: true }).then(data => {
  //           alert("file saved..."+data);
  //           this.globalObjects.displayCordovaToast("Download complete...");
  //           if (this.platform.is('ios')) {
  //             this.document.viewDocument(path + filename, fileMIMEType, {});
  //           } else {

  //             // this.fileOpener.open(path + filename, fileMIMEType)
  //             //   .then(() => console.log('File is opened'))
  //             //   .catch(e => this.globalObjects.presentAlert("file is" + JSON.stringify(e)));
  //           }
  //         }, (error) => {
  //           alert('Error occured while saving file. Please check storage permission and try again.')
  //         });
  //       }, (err) => {
  //         alert("checking directory");
  //         this.file.createDir(path, 'LHSAPP', true).then((res) => {
  //           alert("directory found");
  //           path = path + '/LHSAPP/'
  //           this.file.writeFile(path, filename, data, { replace: true }).then(data => {
  //             alert("file saved..."+data);
  //             this.globalObjects.displayCordovaToast("Download complete...");
  //             if (this.platform.is('ios')) {
  //               this.document.viewDocument(path + filename, fileMIMEType, {});
  //             } else {

  //               // this.fileOpener.open(path + filename, fileMIMEType)
  //               //   .then(() => console.log('File is opened'))
  //               //   .catch(e => this.globalObjects.presentAlert("file is" + JSON.stringify(e)));
  //             }
  //           }, (error) => {
  //             alert('Error occured while saving file. Please check storage permission and try again.')
  //           });
  //         }, (err) => {
  //           // alert("Create err: "+JSON.stringify(err));
  //           path = this.file.dataDirectory;
  //           this.file.writeFile(path, filename, data, { replace: true }).then(data => {
  //             // alert("file saved..."+data);
  //             this.globalObjects.displayCordovaToast("Download complete...");
  //             if (this.platform.is('ios')) {
  //               this.document.viewDocument(path + filename, fileMIMEType, {});
  //             } else {

  //               // this.fileOpener.open(path + filename, fileMIMEType)
  //               //   .then(() => console.log('File is opened'))
  //               //   .catch(e => this.globalObjects.presentAlert("file is" + JSON.stringify(e)));
  //             }
  //           }, (error) => {
  //             alert('Error occured while saving file. Please check storage permission and try again.')
  //           });
  //         })

  //     })
  //     } else {

  //       const a = document.createElement('a')
  //       const objectUrl = URL.createObjectURL(data)
  //       a.href = objectUrl
  //       a.download = filename;
  //       a.click();
  //       URL.revokeObjectURL(objectUrl);
  //     }

  //   }, (err) => {
  //     this.globalObjects.presentAlert("File not found...");
  //   })
  //   // }
  // }



  async download(event) {
    // if (event.item_name == "FILE_PATH") {

    let filePath = event.value.replace(/\\/g, "/");
    let filename = filePath.split("/").reverse()[0];
    let fileExtn = filename.split('.').reverse()[0];
    let fileMIMEType = this.getMIMEtype(fileExtn);
    let downloadUrl = this.globalObjects.getScopeUrl() + 'downloadAnyFile?file=' + filePath;
    // let downloadUrl = "http://203.193.167.118:8888/lhsws/NW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA10G/downloadFile?file=C:/ugk_w/house/invoice/NC20Y-00006.pdf";
    let path = "";
    if (this.platform.is("ios")) {
      path = this.file.documentsDirectory;
    }
    if (this.platform.is("android")) {
      path = this.file.externalApplicationStorageDirectory.split("Android")[0] + "/Download/"
    }


    this.globalObjects.displayCordovaToast("Please wait download started...");

    this.makeXmlHttpReq(downloadUrl).then((data: any) => {

      if (this.platform.is('ios') || this.platform.is('android')) {
        // alert("checking directory");
        this.globalObjects.checkStoragePermission().then((res) => {
          this.file.checkDir(path, 'LHSAPP').then((res) => {
            // alert("directory found");

            this.file.writeFile(path, filename, data, { replace: true }).then(data => {
              // alert("file saved..." + data);
              this.globalObjects.displayCordovaToast("Download complete...");
              if (this.platform.is('ios')) {
                this.document.viewDocument(path + filename, fileMIMEType, {});
              } else {

                // this.fileOpener.open(path + filename, fileMIMEType)
                //   .then(() => console.log('File is opened'))
                //   .catch(e => this.globalObjects.presentAlert("file is" + JSON.stringify(e)));
              }
            }, (error) => {
              alert('Error occured while saving file. Please check storage permission and try again.')
            });
          }, (err) => {
            // alert("checking directory");
            this.file.createDir(path, 'LHSAPP', true).then((res) => {
              // alert("directory found");
              this.file.writeFile(path, filename, data, { replace: true }).then(data => {
                // alert("file saved..." + data);
                this.globalObjects.displayCordovaToast("Download complete...");
                if (this.platform.is('ios')) {
                  this.document.viewDocument(path + filename, fileMIMEType, {});
                } else {

                  // this.fileOpener.open(path + filename, fileMIMEType)
                  //   .then(() => console.log('File is opened'))
                  //   .catch(e => this.globalObjects.presentAlert("file is" + JSON.stringify(e)));
                }
              }, (error) => {
                alert('Error occured while saving file. Please check storage permission and try again.')
              });
            }, (err) => {
              // alert("Create err: "+JSON.stringify(err));
              path = this.file.dataDirectory;
              this.file.writeFile(path, filename, data, { replace: true }).then(data => {
                // alert("file saved..."+data);
                this.globalObjects.displayCordovaToast("Download complete...");
                if (this.platform.is('ios')) {
                  this.document.viewDocument(path + filename, fileMIMEType, {});
                } else {

                  // this.fileOpener.open(path + filename, fileMIMEType)
                  //   .then(() => console.log('File is opened'))
                  //   .catch(e => this.globalObjects.presentAlert("file is" + JSON.stringify(e)));
                }
              }, (error) => {
                alert('Error occured while saving file. Please check storage permission and try again.')
              });
            })
          })
        })
      } else {

        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(data)
        a.href = objectUrl
        a.download = filename;
        a.click();
        URL.revokeObjectURL(objectUrl);
      }

    }, (err) => {
      this.globalObjects.presentAlert("File not found...");
    })
    // }
  }

  makeXmlHttpReq(downloadUrl) {
    return new Promise((resolve, reject) => {
      let oReq = new XMLHttpRequest();
      oReq.open("GET", downloadUrl, true);
      oReq.setRequestHeader('Access-Control-Allow-Origin', '*');
      oReq.setRequestHeader("Content-Type", "application/json");
      // oReq.withCredentials = true;
      console.log("ResStatus: " + oReq.status);
      oReq.responseType = "blob"; // blob pls


      oReq.onreadystatechange = (oEvent) => {
        if (oReq.readyState === 4) {
          if (oReq.status === 200) {
            oReq.onload = (oEvent) => {
              resolve(oReq.response);
            }
          } else {
            reject("Error");
          }
        }
      };
      oReq.send();
    })
  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
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
      'mp4': 'video/mp4'

    }
    return MIMETypes[ext];
  }

  // smsApi(l_mobile_number: any, l_sms_text: any) {
  //   this.globalObjects.smsApi(l_mobile_number, l_sms_text);
  // }
  // smsMobile(l_mobile_number: any, l_sms_text: any) {
  //   this.globalObjects.smsMobile(l_mobile_number, l_sms_text);
  // }

  sendSmsThrought(l_sendby, event, clickEventStr) {
    var object_mast = this.object_mast.Level2
    for (let object of object_mast) {
      for (let frame of object.Level3) {
        let mobileNo;
        let message = "Please Input Proper Message..!";
        if (frame.tableRows) {
          for (let framedata of frame.tableRows) {
            for (let itemGroup of framedata) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.item_name == "MOBILE_NUMBER" || item.item_name == "MOBILENO" || item.item_name == "mobileno") {
                    mobileNo = item.value
                  } else if (item.item_name == "SMS_TEXT") {
                    message = item.value
                  }
                }
              }
            }
          }
        }
        if (mobileNo && message && l_sendby == 'smsMobile') {
          try {
            this.globalObjects.smsMobile(mobileNo, message);
            if (event.click_events_arr.length > (event.click_events_count + 1)) {
              event.click_events_count = event.click_events_count + 1;
              this.itemClicked1(event, clickEventStr);
            }
          } catch (error) {
          }
        }
        else if (mobileNo && message && l_sendby == 'smsApi') {
          this.globalObjects.smsApi(mobileNo, message);
          if (event.click_events_arr.length > (event.click_events_count + 1)) {
            event.click_events_count = event.click_events_count + 1;
            this.itemClicked1(event, clickEventStr);
          }
        }
        else if (mobileNo && message && l_sendby == 'shareViaWhatsApp') {
          this.globalObjects.shareViaWhatsApp(mobileNo, message);
          if (event.click_events_arr.length > (event.click_events_count + 1)) {
            event.click_events_count = event.click_events_count + 1;
            this.itemClicked1(event, clickEventStr);
          }
        }
      }
    }
  }

  sendSms(event) {
    var object_mast = this.object_mast.Level2
    for (let object of object_mast) {
      for (let frame of object.Level3) {
        let mobileNo;
        let message;
        if (frame.tableRows) {
          for (let framedata of frame.tableRows) {
            for (let itemGroup of framedata) {
              if (frame.apps_frame_type == 'APPROVAL-TAB') {
                for (let itemp of itemGroup) {
                  if (itemp.Level5) {
                    for (let item of itemp.Level5) {
                      if (item.item_name == "MOBILE_NUMBER" || item.item_name == "MOBILENO") {
                        mobileNo = item.value
                      } else if (item.item_name == "SMS" || item.item_name == "SMS_TEXT") {
                        message = item.value
                      }
                    }
                  }
                }
              } else {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (event.apps_page_frame_seqid == itemGroup.apps_page_frame_seqid) {
                      if (item.item_name == "MOBILE_NUMBER" || item.item_name == "MOBILENO" || item.item_name == "MOBILE_NO") {
                        mobileNo = item.value
                      } else if (item.item_name == "SMS" || item.item_name == "SMS_TEXT" || item.item_name == "EMAIL_BODY") {
                        message = item.value
                      }
                    }
                    // if (item.item_name == "MOBILE_NUMBER") {
                    //   mobileNo = item.value
                    // } else if (item.item_name == "SMS") {
                    //   message = item.value
                    // }
                  }
                }
              }
            }
          }
        }

        if (mobileNo && message) {
          this.wscp.service_type = "send_sms";
          let smsData: any = {};
          smsData.mobileNo = mobileNo;
          smsData.smsText = message;
          let wsdp: any = [];
          wsdp.push(smsData);
          let reqData: any = {};
          reqData = {
            "wslp": this.userDetails,
            "wscp": this.wscp,
            "wsdp": wsdp,
            "wsdpcl": this.wsdpcl,
            "wsud": this.wsud
          }

          this.dataService.postData("SEND_SMS", reqData).then(res => {
            let data: any = res;
            if (data.responseStatus == "success") {
              this.object_arr = data.responseData;
              let objData = this.globalObjects.setPageInfo(this.object_arr);
              this.object_mast = objData.Level1[0];
            }
          }).catch(err => {
            console.log('super.page.ts Something went wrong :', err);
            this.globalObjects.presentToast("785 Something went wrong please try again later!");
            console.log(err);
          })
        }
      }
    }
  }
  sendNotification(event, clickEventStr) {
    this.wscp.service_type = "SEND_NOTIFICATION";
    let smsData: any = {};
    let wsdp: any = [];
    wsdp.push(smsData);
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": this.wscp,
      "wsdp": wsdp,
      "wsdpcl": this.wsdpcl,
      "wsud": this.wsud
    }

    this.dataService.postData("S2U", reqData).then(res => {
      let data: any = res;
      if (data.responseStatus == "success") {
        this.object_arr = data.responseData;
        let objData = this.globalObjects.setPageInfo(this.object_arr);
        this.object_mast = objData.Level1[0];
      }
    }).catch(err => {
      console.log('super.page.ts Something went wrong :', err);
      this.globalObjects.presentToast("785 Something went wrong please try again later!");
      console.log(err);
    });
    if (event.click_events_arr.length > (event.click_events_count + 1)) {
      event.click_events_count = event.click_events_count + 1;
      this.itemClicked1(event, clickEventStr);
    }
  }


  sendEmail(event: any, emailType, clickEventStr) {
    emailType = emailType.toUpperCase();
    let wsdp = [{

      "email_type": emailType
    }]
    let reqData = {
      "wsdp": wsdp
    };
    this.dataService.postData("SEND_HARDCODED_EMAIL", reqData).then((data: any) => {
      this.globalObjects.presentAlert(data.responseMsg);
      if (event.click_events_arr.length > (event.click_events_count + 1)) {
        event.click_events_count = event.click_events_count + 1;
        this.itemClicked1(event, clickEventStr);
      }
    }, (err) => {
      this.globalObjects.presentAlert(JSON.stringify(err))
      if (event.click_events_arr.length > (event.click_events_count + 1)) {
        event.click_events_count = event.click_events_count + 1;
        this.itemClicked1(event, clickEventStr);
      }
    })
  }

  editItem(event: any) {
    let seqId;
    if (event.click_events_str.indexOf("~") > -1) {
      seqId = event.click_events_str.split("~")[1];
    } else {
      seqId = event.apps_page_frame_seqid
    }
    for (let frame of this.object_mast.Level2[this.page_no].Level3) {
      if (frame.apps_frame_type == 'CANVAS' && frame.apps_page_frame_seqid == seqId) {
        frame.tableRows = [];
        frame.tableRows.push(event.EDIT_ITEM);
      }
    }
  }

  // mirrorItems(event) {
  //     for (let frame of this.object_mast.Level2[this.page_no].Level3) {
  //       if (frame.tableRows) {
  //         for (let tableData of frame.tableRows) {
  //           for (let itemGroup of tableData) {
  //             if (itemGroup.Level5) {
  //               for (let item of itemGroup.Level5) {
  //                 if (item.mirror_item_seqid) {
  //                   for (let fromFrame of this.object_mast.Level2[this.page_no].Level3) {
  //                     if (fromFrame.apps_page_frame_seqid == event.apps_page_frame_seqid) {
  //                       if (!event.itemIndex) {
  //                         event.itemIndex = 0;
  //                       }
  //                       console.log(event.itemIndex);

  //                       let frameLevel4 = fromFrame.tableRows[event.itemIndex];
  //                       for (let fromItemGroup of frameLevel4) {
  //                         if (fromItemGroup.Level5) {
  //                           for (let fromItem of fromItemGroup.Level5) {
  //                             if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                               item.value = fromItem.value;
  //                             }
  //                           }
  //                         } else {
  //                           if (fromItemGroup) {
  //                             for (let fromItem of fromItemGroup) {
  //                               if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                                 item.value = fromItem.value;
  //                               }
  //                             }
  //                           }
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
  //                     for (let fromFrame of this.object_mast.Level2[this.page_no].Level3) {
  //                       if (fromFrame.apps_page_frame_seqid == event.apps_page_frame_seqid) {

  //                         if (!event.itemIndex) {
  //                           event.itemIndex = 0;
  //                         }

  //                         let frameLevel4 = fromFrame.tableRows[event.itemIndex];
  //                         for (let fromItemGroup of frameLevel4) {
  //                           if (fromItemGroup.Level5) {
  //                             for (let fromItem of fromItemGroup.Level5) {
  //                               if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                                 item.value = fromItem.value;
  //                               }
  //                             }
  //                           } else {
  //                             if (fromItemGroup) {
  //                               for (let fromItem of fromItemGroup) {
  //                                 if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                                   item.value = fromItem.value;
  //                                 }
  //                               }
  //                             }
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

  //       else {
  //         let tableRows = [];
  //         let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
  //         for (let itemGroup of frameLevel4) {
  //           if (itemGroup.Level5) {
  //             for (let item of itemGroup.Level5) {
  //               if (item.mirror_item_seqid) {
  //                 for (let fromFrame of this.object_mast.Level2[this.page_no].Level3) {
  //                   if (fromFrame.apps_page_frame_seqid == event.apps_page_frame_seqid) {
  //                     let fromFrameLevel4 = fromFrame.tableRows[event.itemIndex];
  //                     for (let fromItemGroup of fromFrameLevel4) {
  //                       if (fromItemGroup.Level5) {
  //                         for (let fromItem of fromItemGroup.Level5) {
  //                           if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                             item.value = fromItem.value;
  //                           }
  //                         }
  //                       } else {
  //                         if (fromItemGroup) {
  //                           for (let fromItem of fromItemGroup) {
  //                             if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                               item.value = fromItem.value;
  //                             }
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //                 tableRows[0] = frameLevel4;
  //               }
  //             }
  //           } else {
  //             if (itemGroup) {
  //               for (let item of itemGroup) {
  //                 if (item.mirror_item_seqid) {
  //                   for (let fromFrame of this.object_mast.Level2[this.page_no].Level3) {
  //                     if (fromFrame.apps_page_frame_seqid == event.apps_page_frame_seqid) {
  //                       let fromFrameLevel4 = fromFrame.tableRows[event.itemIndex];
  //                       for (let fromItemGroup of fromFrameLevel4) {
  //                         if (fromItemGroup.Level5) {
  //                           for (let fromItem of fromItemGroup.Level5) {
  //                             if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                               item.value = fromItem.value;
  //                             }
  //                           }
  //                         } else {
  //                           if (fromItemGroup) {
  //                             for (let fromItem of fromItemGroup) {
  //                               if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
  //                                 item.value = fromItem.value;
  //                               }
  //                             }
  //                           }
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


  mirrorItems(event) {

    // let itmvalue = this.getItemValue('WMV70001-I-12', event.itemIndex);

    // this.setItemValue('AB.DIV_CODE', itmvalue, 0);


    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if (frame.tableRows) {
          //  if(this.eventOfadditem.length <= 0){
          if (this.eventOfadditem && this.eventOfadditem.frameSeq && (this.eventOfadditem.frameSeq == frame.apps_page_frame_seqid)) { }
          else {
            for (let tableData of frame.tableRows) {
              for (let itemGroup of tableData) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (item.mirror_item_seqid) {
                      if (!event.itemIndex) {
                        event.itemIndex = 0;
                      }
                      if (this.get_item_value(item.mirror_item_seqid, event.itemIndex)) {
                        item.value = this.get_item_value(item.mirror_item_seqid, event.itemIndex);
                      }
                      // for (let fromObj of this.object_mast.Level2) {
                      //   for (let fromFrame of fromObj.Level3) {
                      //     if (!event.itemIndex) {
                      //       event.itemIndex = 0;
                      //     }
                      //     console.log(event.itemIndex);

                      //     //  let frameLevel4 = fromFrame.tableRows[event.itemIndex];
                      //     if (fromFrame.tableRows) {
                      //       let i = 0;
                      //       for (let frameLevel4 of fromFrame.tableRows) {
                      //         for (let fromItemGroup of frameLevel4) {
                      //           if (fromItemGroup.Level5) {
                      //             for (let fromItem of fromItemGroup.Level5) {
                      //               if ((item.mirror_item_seqid == fromItem.apps_item_seqid) && (i == event.itemIndex)) {
                      //                 item.value = fromItem.value;
                      //               }
                      //             }
                      //           } else {
                      //             if (fromItemGroup) {
                      //               for (let fromItem of fromItemGroup) {
                      //                 if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
                      //                   item.value = fromItem.value;
                      //                 }
                      //               }
                      //             }
                      //           }
                      //         }
                      //         i++
                      //       }
                      //     }
                      //   }
                      // }
                    }
                  }
                } else {
                  if (itemGroup) {
                    for (let item of itemGroup) {
                      if (item.mirror_item_seqid) {
                        if (!event.itemIndex) {
                          event.itemIndex = 0;
                        }
                        if (this.get_item_value(item.mirror_item_seqid, event.itemIndex)) {
                          item.value = this.get_item_value(item.mirror_item_seqid, event.itemIndex);
                        }

                      }
                    }
                  }
                }
              }
            }
          }
        }

        else {
          let tableRows = [];
          let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
          for (let itemGroup of frameLevel4) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                if (item.mirror_item_seqid) {
                  for (let fromObj of this.object_mast.Level2) {
                    for (let fromFrame of fromObj.Level3) {

                      if (fromFrame.tableRows) {
                        let i = 0;
                        for (let frameLevel4 of fromFrame.tableRows) {
                          for (let fromItemGroup of frameLevel4) {
                            if (fromItemGroup.Level5) {
                              for (let fromItem of fromItemGroup.Level5) {
                                if ((item.mirror_item_seqid == fromItem.apps_item_seqid) && (i == event.itemIndex)) {
                                  item.value = fromItem.value;
                                }
                              }
                            } else {
                              if (fromItemGroup) {
                                for (let fromItem of fromItemGroup) {
                                  if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
                                    item.value = fromItem.value;
                                  }
                                }
                              }
                            }
                          }
                          i++
                        }
                      }
                    }
                  }
                  tableRows[0] = frameLevel4;

                }
              }
            } else {
              if (itemGroup) {
                for (let item of itemGroup) {
                  if (item.mirror_item_seqid) {
                    for (let fromObj of this.object_mast.Level2) {
                      for (let fromFrame of fromObj.Level3) {

                        if (fromFrame.tableRows) {
                          let i = 0;
                          for (let frameLevel4 of fromFrame.tableRows) {
                            for (let fromItemGroup of frameLevel4) {
                              if (fromItemGroup.Level5) {
                                for (let fromItem of fromItemGroup.Level5) {
                                  if ((item.mirror_item_seqid == fromItem.apps_item_seqid) && (i == event.itemIndex)) {
                                    if (fromItem.value) {
                                      item.value = fromItem.value;
                                    }
                                  }
                                }
                              } else {
                                if (fromItemGroup) {
                                  for (let fromItem of fromItemGroup) {
                                    if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
                                      if (fromItem.value) {
                                        item.value = fromItem.value;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                            i++
                          }
                        }


                      }
                    }
                    tableRows[0] = frameLevel4;
                  }
                }
              }
            }
          }
          if (tableRows.length > 0) {
            frame.tableRows = tableRows;
          }
        }
      }
    }


  }



  transferItem(event, clickEventStr) {
    let fromFrame = [];
    let pageNo = this.page_no;
    let isValid = true;
    let theaddata: any = [];
    for (let frame of this.object_mast.Level2[pageNo].Level3) {
      if (frame.apps_page_frame_seqid == event.fromFrame) {
        let frameLevel4 = JSON.parse(JSON.stringify(frame.tableRows[event.itemIndex]));
        for (let itemGroup of frameLevel4) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {

              let temp = item.design_control_type;
              item.design_control_type = item.design_control_type_auto_card;
              item.design_control_type_auto_card = temp;

              temp = item.display_setting_str;
              item.display_setting_str = item.display_setting_str_auto_card;
              item.display_setting_str_auto_card = temp;

              temp = item.item_visible_flag;
              item.item_visible_flag = item.flag_auto_card;
              item.flag_auto_card = temp;

              item.temp_item_type = item.item_type

              if (item.item_type != "BT") {
                item.item_type = "TEXT";
              }
              if (item.design_control_type) {

              } else {
                if (itemGroup.Level5.length >= 1) {
                  itemGroup.groupCol = ["12"];
                  if (itemGroup.Level5.length == 2) {
                    itemGroup.groupCol = ["6", "6"];
                  } if (itemGroup.Level5.length == 3) {
                    itemGroup.groupCol = ["4", "4", "4"];
                  } if (itemGroup.Level5.length == 4) {
                    itemGroup.groupCol = ["3", "3", "3", "3"];
                  }
                }
              }
              if (item.item_visible_flag == 'T') {
                theaddata.push(item.prompt_name);
              }
              /* if (item.item_name == "SLNO") {
                item.value = this.item_slno_count;
                this.item_slno_count = this.item_slno_count + 1;
              }*/
              if (item.isValid !== undefined && !item.isValid) {
                isValid = item.isValid;
              }
            }
          }
        }

        console.log(frameLevel4);
        fromFrame = frameLevel4;
      } if (frame.apps_page_frame_seqid == event.toFrame) {
        frame.tableRows = []
        frame.tHead = theaddata;
        frame.tableRows[0] = fromFrame;
      }
    }

    if (event.click_events_arr.length > (event.click_events_count + 1)) {
      event.click_events_count = event.click_events_count + 1;
      this.itemClicked1(event, clickEventStr);
    }
  }

  addItemFrom(event, clickEventStr) {
    for (let frame of this.object_mast.Level2[this.page_no].Level3) {
      if (event.fromFrameSeq) {
        if (frame.apps_page_frame_seqid == event.fromFrameSeq) {
          if (frame.tableRows) {

            let frameLevel4 = JSON.parse(JSON.stringify(frame.tableRows[0]));
            let theaddata: any = [];

            for (let itemGroup of frameLevel4) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  item.item_default_value = "";
                  let temp = item.design_control_type;
                  item.design_control_type = item.design_control_type_auto_card;
                  item.design_control_type_auto_card = temp;

                  temp = item.display_setting_str;
                  item.display_setting_str = item.display_setting_str_auto_card;
                  item.display_setting_str_auto_card = temp;

                  temp = item.item_visible_flag;
                  item.item_visible_flag = item.flag_auto_card;
                  item.flag_auto_card = temp;

                  item.temp_item_type = item.item_type

                  if (item.item_type != "BT") {
                    item.item_type = "TEXT";
                  }
                  if (item.item_name == "SLNO") {
                    item.value = this.item_slno_count;
                    this.item_slno_count = this.item_slno_count + 1;
                  }
                  if (item.value) {
                    item.isValid = true;
                  }

                  if (item.session_hold_flag == 'T') {
                    if (this.sessionObj) {
                      this.sessionObj[item.item_name] = item.value
                    } else {
                      this.sessionObj = {};
                      this.sessionObj[item.item_name] = item.value
                    }
                  }
                  if (item.item_visible_flag == 'T') {
                    theaddata.push(item.prompt_name);
                  }
                }
              }
            }
            event.tHead = theaddata;
            event.ADD_ITEM = frameLevel4;
          }
        }
      }
    }

    if (event.click_events_arr.length > (event.click_events_count + 1)) {
      event.click_events_count = event.click_events_count + 1;
      if ((event.click_events_arr[event.click_events_count].indexOf("addItem") > -1) || (event.click_events_arr[event.click_events_count].indexOf("addMirrorItem") > -1)) {
        this.itemClicked1(event, clickEventStr);
      } else {
        this.additem(event, clickEventStr);
      }
    } else {
      this.additem(event, clickEventStr);
    }

  }

  additemMirror(event, clickEventStr) {
    for (let frame of this.object_mast.Level2[this.page_no].Level3) {
      if (event.addFrameSeqId) {
        if (frame.apps_page_frame_seqid == event.addFrameSeqId) {
          if (frame.addTableRows) {
            frame.addTableRows.push(event.ADD_ITEM);
            frame.addTableRows.stopLoader = true;
            this.eventOfadditem.frameSeq = event.addFrameSeqId;
            this.eventOfadditem.rows = frame.addTableRows;

          } else {
            frame.addTableRows = [];
            frame.addTableRows.push(event.ADD_ITEM);
            this.eventOfadditem.frameSeq = event.addFrameSeqId;
            this.eventOfadditem.rows = frame.addTableRows;

          }
          if (frame.tableRows) { } else {
            frame.tableRows = [];
          }

          let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
          let tableRows = [];
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              if (item.mirror_item_seqid) {
                for (let fromItemGroup of event.ADD_ITEM) {
                  for (let fromItem of fromItemGroup.Level5) {
                    if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
                      item.value = fromItem.value;
                    }
                  }
                }
              }
            }
          }
          tableRows.push(frameLevel4);

          if (this.eventOfadditem && this.eventOfadditem.rows && this.eventOfadditem.rows.length < 2) {
            frame.tableRows = tableRows;
          } else {
            frame.tableRows.push(frameLevel4);
          }
        }
      } else {
        if (frame.apps_frame_type == 'CARD') {

          if (frame.addTableRows) {
            frame.addTableRows.push(event.ADD_ITEM);
            frame.addTableRows.stopLoader = true;
            this.eventOfadditem.frameSeq = event.addFrameSeqId;
            this.eventOfadditem.rows = frame.addTableRows;

          } else {
            frame.addTableRows = [];
            frame.addTableRows.push(event.ADD_ITEM);
            this.eventOfadditem.frameSeq = event.addFrameSeqId;
            this.eventOfadditem.rows = frame.addTableRows;
          }

          if (frame.tableRows) { } else {
            frame.tableRows = [];
          }

          let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
          let tableRows = [];
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              if (item.mirror_item_seqid) {
                for (let fromItemGroup of event.ADD_ITEM) {
                  for (let fromItem of fromItemGroup.Level5) {
                    if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
                      item.value = fromItem.value;
                    }
                  }
                }
              }
            }
          }
          tableRows.push(frameLevel4);

          if (this.eventOfadditem && this.eventOfadditem.rows && this.eventOfadditem.rows.length < 2) {
            frame.tableRows = tableRows;
          } else {
            frame.tableRows.push(frameLevel4);
          }
        }
      }
    }

    if (event.click_events_arr.length > (event.click_events_count + 1)) {
      event.click_events_count = event.click_events_count + 1;
      this.itemClicked1(event, clickEventStr);
    }
  }

  addItemQR(event) {
    var rowindex;

    rowindex = event.itemIndex ? event.itemIndex : 0;
    event.itemIndex = rowindex;

    let frameId = event.apps_page_frame_seqid;

    let isValid = true;
    for (let frame of this.object_mast.Level2[this.page_no].Level3) {
      if (frame.apps_page_frame_seqid == frameId) {
        let frameLevel4: any = JSON.parse(JSON.stringify(frame.tableRows[rowindex]));
        let theaddata: any = [];
        for (let itemGroup of frameLevel4) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              item.item_default_value = "";
              let temp = item.design_control_type;
              item.design_control_type = item.design_control_type_auto_card;
              item.design_control_type_auto_card = temp;

              temp = item.display_setting_str;
              item.display_setting_str = item.display_setting_str_auto_card;
              item.display_setting_str_auto_card = temp;

              temp = item.item_visible_flag;
              item.item_visible_flag = item.flag_auto_card;
              item.flag_auto_card = temp;

              item.temp_item_type = item.item_type

              if (item.item_type != "BT") {
                if (item.click_events_str && (item.click_events_str.indexOf("EDITABLE") > -1 || item.click_events_str.indexOf("editable") > -1)) {
                } else {
                  item.item_type = "TEXT";
                }
              }
              if (item.item_name == "SLNO") {
                item.value = this.item_slno_count;
                this.item_slno_count = this.item_slno_count + 1;
              }
              if (item.value) {

                item.isValid = true;
              }
              if (item.isValid !== undefined && !item.isValid) {
                isValid = item.isValid;
              }

              if (item.session_hold_flag == 'T') {
                if (this.sessionObj) {
                  this.sessionObj[item.item_name] = item.value
                } else {
                  this.sessionObj = {};
                  this.sessionObj[item.item_name] = item.value
                }
              }
              if (item.item_visible_flag == 'T') {
                theaddata.push(item.prompt_name);
              }
            }
          }
        }

        let checkValidFrame = false;

        if (event.click_events_str.indexOf("checkValidFrame") > -1) {
          let arr = event.click_events_str.split("#");
          let frmseq = arr[event.click_events_str.indexOf("checkValidFrame")].split("~")[1];
          if (frame.apps_page_frame_seqid == frmseq) {
            checkValidFrame = true;
          }
        }
        if (checkValidFrame && !isValid) {
          for (let itemGroup of frame.tableRows[rowindex]) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                if (item.isValid !== undefined && !item.isValid) {
                  item.touched = true;
                }
              }
            }
          }
          this.globalObjects.clickedbutton = false;
          this.globalObjects.presentAlert("Please correct all the errors and enter valid input")
        }
        else {
          if (event.click_events_str.indexOf("checkValidFrame") > -1) {
            let arr = event.click_events_str.split("#");
            arr.splice([event.click_events_str.indexOf("checkValidFrame")], 1);
            event.click_events_str = arr.join("#");
          }
        }

        if (isValid) {
          if (event.click_events_str.indexOf('itemAddFrom') > -1) { } else {
            frame.tableRows[rowindex] = JSON.parse(JSON.stringify(frame.Level4))
          }
          for (let itemGroup of frame.tableRows[rowindex]) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                if (item.session_hold_flag == 'T') {
                  if (this.sessionObj) {
                    item.value = this.sessionObj[item.item_name];
                  }
                }
              }
            }
          }
          event.tHead = theaddata;
          event.ADD_ITEM = frameLevel4;
          this.additem(event, event.click_events_str)
        }
      }
    }

  }
  additem(event, clickEventStr) {

    for (let frame of this.object_mast.Level2[this.page_no].Level3) {
      if (event.addFrameSeqId) {
        if (frame.apps_page_frame_seqid == event.addFrameSeqId) {
          if (frame.tableRows) {
            var rowindex;
            let i = 0;
            for (let rowsdata of frame.tableRows) {
              for (let dataRow of rowsdata) {
                for (let r of dataRow.Level5) {

                  if (event.itemPKey) {
                    if (r.item_name == "DB_TABLE_PKEY" && (event.itemPKey == r.value)) {
                      rowindex = i;
                    }
                  } else {
                    if (r.item_name == "ROWNUMBER" && (r.value - 1) == event.itemIndex) {
                      rowindex = i;
                    }
                  }
                }
              }
              i++;
            }
            if (frame.tableRows && frame.tableRows.length > 0 && rowindex >= 0) {
              frame.tableRows[rowindex] = event.ADD_ITEM;
            } else {
              frame.tableRows.push(event.ADD_ITEM);
            }
            frame.tableRows.stopLoader = true;
            frame.tHead = event.tHead;
            this.eventOfadditem.frameSeq = event.addFrameSeqId;
            this.eventOfadditem.rows = frame.tableRows;

          } else {
            frame.tableRows = [];
            frame.tableRows.push(event.ADD_ITEM);
            frame.tHead = event.tHead;
            this.eventOfadditem.frameSeq = event.addFrameSeqId;
            this.eventOfadditem.rows = frame.tableRows;
          }

          if (frame.apps_frame_type == 'ENTRY_TABLE') {
            let name = "addEvent_" + frame.apps_page_frame_seqid;
            let obj = {
              flag: "T"
            }
            this.events.publish(name, obj);
          }
        }
      } else {
        if (frame.apps_frame_type == 'CARD') {

          if (frame.tableRows) {
            frame.tableRows.push(event.ADD_ITEM);
            frame.tableRows.stopLoader = true;
            this.eventOfadditem.frameSeq = event.addFrameSeqId;
            this.eventOfadditem.rows = frame.tableRows;

          } else {
            frame.tableRows = [];
            frame.tableRows.push(event.ADD_ITEM);
            this.eventOfadditem.frameSeq = event.addFrameSeqId;
            this.eventOfadditem.rows = frame.tableRows;
          }
        }
        else if (frame.apps_frame_type == 'CALENDER') {
          if (frame.tableRows) {
            frame.tableRows.push(event.ADD_ITEM);
          } else {
            frame.tableRows = [];
            frame.tableRows.push(event.ADD_ITEM);

          }
          this.events.publish("runcalender", "Calenderrun");
        }
      }
    }

    if (event.click_events_arr.length > (event.click_events_count + 1)) {
      event.click_events_count = event.click_events_count + 1;
      this.itemClicked1(event, clickEventStr);
    }
  }
  addCalender(event) {
    for (let frame of this.object_mast.Level2[this.page_no].Level3) {
      if (frame.apps_frame_type == 'CALENDER') {
        if (frame.tableRows) {
          frame.tableRows.push(event.ADD_ITEM);
        } else {
          frame.tableRows = [];
          frame.tableRows.push(event.ADD_ITEM);
        }
      }
    }
  }

  saveData(nextPageInfo, event, str, clickEventStr) {
    let wsdp = [];
    if (str == "DELETE_FRAME_PKEY") { } else {
      var object_mast = this.object_mast.Level2
      for (let object of object_mast) {
        for (let frame of object.Level3) {
          if (frame.flag != "F") {
            if (frame.tableRows) {
              for (let framedata of frame.tableRows) {
                let col = {};
                for (let itemGroup of framedata) {
                  if (itemGroup.Level5) {
                    for (let item of itemGroup.Level5) {
                      if (item.codeOfValues) {
                        col[item.apps_item_seqid] = item.codeOfValues;
                      } else if (item.value) {
                        col[item.apps_item_seqid] = item.value;
                      } else {
                        col[item.apps_item_seqid] = "";
                      }
                    }
                  } else if (itemGroup) {
                    for (let item of itemGroup) {
                      if (item.codeOfValues) {
                        col[item.apps_item_seqid] = item.codeOfValues;
                      } else if (item.value) {
                        col[item.apps_item_seqid] = item.value;
                      } else {
                        col[item.apps_item_seqid] = "";
                      }
                    }
                  }
                }
                wsdp.push(col)
              }
            } else {
              let col = {};
              for (let itemGroup of frame.Level4) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    // col[item.apps_item_seqid] = item.value
                    if (item.codeOfValues) {
                      col[item.apps_item_seqid] = item.codeOfValues;
                    } else if (item.value) {
                      col[item.apps_item_seqid] = item.value;
                    } else {
                      col[item.apps_item_seqid] = "";
                    }
                  }
                }
              }
              wsdp.push(col)
            }
          }
        }
      }
    }
    // console.log(wsdp);
    //---------------------------------
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": nextPageInfo.wscp,
      "wsdp": wsdp,
      "wsdpcl": nextPageInfo.wsdpcl,
      "wsud": this.wsud
    }
    // console.log(reqData);
    // this.globalObjects.showLoading();


    if (!this.globalObjects.networkStatus) {
      this.dataService.saveEntryToLocalDB(reqData).then(res => {
        console.log(reqData);
        if (res == "success") {
          this.globalObjects.displayCordovaToast("Entry Saved in Local Storage..!");
          this.closePage("", clickEventStr);
        } else {
          this.globalObjects.displayCordovaToast("Error in Save Offline.. !");
        }
      })
    } else {
      this.dataService.postData("S2U", reqData).then(res => {
        // this.globalObjects.hideLoading();
        let data: any = res;
        // console.log(data);
        if (data.responseStatus == "success") {
          this.globalObjects.presentAlert("Data Saved Successfully");
          // this.globalObjects.s2uToast("Data Saved Successfully", "paymentSuccessToast");
          let object_arr = data.responseData
          // let objData = this.globalObjects.setPageInfo(object_arr);
          let keycount = 0;
          for (let obj of object_arr.Level1_Keys) {
            if (event.sessionObj) {
              event.sessionObj[obj] = object_arr.Values[0][keycount]
            } else {
              event.sessionObj = {};
              event.sessionObj[obj] = object_arr.Values[0][keycount]
            }
            keycount = keycount + 1;
          }
          if (event.click_events_arr.length > (event.click_events_count + 1)) {
            event.click_events_count = event.click_events_count + 1;
            this.itemClicked1(event, clickEventStr);
          } else if (str == "DELETE_FRAME_PKEY") {
            this.deleteRow(event);
          }
        } else {
          this.globalObjects.presentToastWithOptions(data.responseMsg, "errorclass")
        }
      }).catch(err => {
        this.globalObjects.presentToast("6 Something went wrong please try again later!");
        console.log(err);
      })
    }
    //---------------------------------
  }


  deleteRow(event) {
    // var object_mast = this.object_mast.Level2
    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        frame.tableRows.splice(event.itemIndex, 1)
      }
    }
  }


  execute_plsql(nextPageInfo, event, clickEventStr) {
    event.item_enable_flag = 'F';
    let wsdp = [];
    let wsdptp = [];
    var object_mast = this.object_mast.Level2;

    let call_frame_CB;
    let callingItm_CB;
    let clickEvent_CB = [];



    if ((clickEventStr.indexOf("execute_item_plsql_cb") > -1) || (clickEventStr.indexOf("execute_item_plsql_item") > -1)) {
      let strArr = clickEventStr.split("#");
      for (let c of strArr) {
        if ((c.indexOf("execute_item_plsql_cb") > -1) || (c.indexOf("execute_item_plsql_item") > -1)) {
          clickEvent_CB = c.split("~");
          call_frame_CB = clickEvent_CB[1];
          callingItm_CB = clickEvent_CB[2];
        }
      }
    }


    if (clickEventStr && clickEventStr.indexOf("execute_item_plsql_cb") > -1) {


      if (clickEvent_CB[2].indexOf("#") > -1) {
        callingItm_CB = clickEvent_CB[2].split("#")[0];
      }

      for (let object of object_mast) {
        for (let frame of object.Level3) {
          if (frame.flag != "F") {
            if (frame.apps_page_frame_seqid == call_frame_CB) {
              let tableRows = [];
              tableRows = frame.tableRows;

              for (let framedata of tableRows) {
                for (let itemGroup of framedata) {
                  if (itemGroup.Level5) {
                    for (let item of itemGroup.Level5) {
                      if ((item.apps_item_seqid == callingItm_CB) && item.value == 'Y') {

                        let col = {};
                        let coltp = {};
                        for (let itemGroup of framedata) {
                          if (itemGroup.Level5) {
                            for (let item of itemGroup.Level5) {
                              if (item.codeOfValues) {
                                col[item.apps_item_seqid] = item.codeOfValues;
                                coltp[item.item_name] = item.codeOfValues;
                              } else if (item.value != undefined && item.value != null) {
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

    if (event.click_events_str && event.click_events_str.indexOf("execute_item_plsql_item") > -1) {

      if (clickEvent_CB[2].indexOf("#") > -1) {
        callingItm_CB = clickEvent_CB[2].split("#")[0];
      }

      if(event.calling_frame_seqid_arr && event.calling_frame_seqid_arr.length > 0){
        let arr = [];
        for(let x of event.calling_frame_seqid_arr){
          if(x != call_frame_CB){
            arr.push(x);
          }
        }
        event.calling_frame_seqid_arr = arr;
      }

      for (let object of object_mast) {
        for (let frame of object.Level3) {
          if (frame.flag != "F") {
            if (frame.apps_page_frame_seqid == call_frame_CB) {
              let tableRows = [];
              tableRows = frame.tableRows;

              for (let framedata of tableRows) {
                for (let itemGroup of framedata) {
                  if (itemGroup.Level5) {
                    for (let item of itemGroup.Level5) {
                      if (item && (item.apps_item_seqid == callingItm_CB) && item.value) {

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
                          }
                        }

                        wsdp.push(col);
                        wsdptp.push(coltp);

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


    if (event.calling_frame_seqid_arr) {
      for (let call_frame of event.calling_frame_seqid_arr) {
        for (let object of object_mast) {
          for (let frame of object.Level3) {
            if (frame.flag != "F") {

              if (frame.apps_page_frame_seqid && frame.apps_page_frame_seqid == call_frame && call_frame == this.object_mast.object_code + "-PARA") {

                for (let framedata of frame.tableRows) {
                  let col = {};
                  let coltp = {};
                  for (let itemGroup of framedata) {
                    if (itemGroup.Level5) {
                      for (let item of itemGroup.Level5) {
                        if (item.codeOfValues) {
                          col[item.item_name] = item.codeOfValues;
                        } else if (item.value != undefined && item.value != null) {
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
                          } else if (item.value != undefined && item.value != null) {
                            col[item.item_name] = item.value;
                          } else {
                            col[item.item_name] = "";
                          }
                        }
                      }
                    }
                  }
                  wsdp.push(col);
                }

              }

              if ((frame.apps_page_frame_seqid == call_frame && frame.apps_page_frame_seqid != call_frame_CB && frame.apps_page_frame_seqid != this.object_mast.object_code + "-PARA")
                // && frame.apps_page_frame_seqid != this.object_mast.object_code + "-PARA"
              ) {
                let tableRows = [];
                tableRows = frame.tableRows;

                if (frame.apps_frame_type == 'ORDER ENTRY') {
                  tableRows = this.globalObjects.summaryPlainData;
                }

                if (frame.apps_frame_type == 'FRAME_COLLAPSE') {
                  tableRows = [];
                }

                if (this.eventOfadditem && this.eventOfadditem.rows && this.eventOfadditem.rows.length > 0) {
                  if (this.eventOfadditem.rows.length > 1) {
                    if (this.eventOfadditem.rows[1][0].apps_page_frame_seqid == frame.apps_page_frame_seqid) {
                      tableRows = this.eventOfadditem.rows;
                    }
                  } else {
                    if (this.eventOfadditem.rows[0].length > 0) {
                      if (this.eventOfadditem.rows[0][0].apps_page_frame_seqid == frame.apps_page_frame_seqid) {
                        tableRows = this.eventOfadditem.rows;
                      }
                    }
                  }
                }

                if (this.globalObjects.attachmentArr.length > 0) {
                  tableRows = []
                  if (this.globalObjects.attachmentArr[0].apps_page_frame_seqid == frame.apps_page_frame_seqid) {
                    for (let r of frame.tableRows[0]) {
                      this.globalObjects.attachmentArr.push(r);
                    }
                    tableRows[0] = this.globalObjects.attachmentArr;
                  }
                }


                if (this.concatKey.length > 0) {
                  for (let conKey of this.concatKey) {
                    if (frame.apps_page_frame_seqid == conKey) {
                      tableRows = this.concatArr;
                      this.concatArr = [];
                    }
                  }
                }
                if (frame.tableRows) {
                  if (tableRows.length > 0) {
                    for (let framedata of tableRows) {
                      let col = {};
                      let coltp = {};
                      for (let itemGroup of framedata) {
                        if (itemGroup.Level5) {
                          for (let item of itemGroup.Level5) {
                            if (item.codeOfValues) {
                              col[item.apps_item_seqid] = item.codeOfValues;
                              coltp[item.item_name] = item.codeOfValues;
                            } else if (item.value != undefined && item.value != null) {
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
                        } else if (item.value != undefined && item.value != null) {
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
                }
              }
            }
          }
        }
      }
    } else {

      for (let object of object_mast) {
        for (let frame of object.Level3) {
          if (frame.flag != "F") {
            let tableRows = [];
            tableRows = frame.tableRows
            if (this.concatKey.length > 0) {
              for (let conKey of this.concatKey) {
                if (frame.apps_page_frame_seqid == conKey) {
                  tableRows = this.concatArr;
                  this.concatArr = [];
                }
              }
            }
            if (frame.tableRows) {
              if (tableRows.length > 0) {

                for (let framedata of tableRows) {
                  let col = {};
                  let coltp = {};
                  for (let itemGroup of framedata) {
                    if (itemGroup.Level5) {
                      for (let item of itemGroup.Level5) {
                        if (item.codeOfValues) {
                          col[item.apps_item_seqid] = item.codeOfValues;
                          coltp[item.item_name] = item.codeOfValues;
                        } else if (item.value != undefined && item.value != null) {
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
                    } else if (item.value != undefined && item.value != null) {
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
            }
          }
        }
      }
    }
    if (this.globalObjects.summaryCartdeatail.length > 0) {
      let qtyPre: boolean = false;
      let glob = this.globalObjects.summaryCartdeatail;
      wsdp = [];
      wsdptp = [];

      for (let framedata of object_mast[0].Level3[0].tableRows) {
        let col = {};
        let coltp = {};
        for (let itemGroup of framedata) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues;
                coltp[item.item_name] = item.codeOfValues;
              } else if (item.value != undefined && item.value != null) {
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
      }
      let col = {};
      let coltp = {};
      for (let globArr of glob) {
        for (let globObj of globArr.items) {
          for (let itemGroup of globObj) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                if (item.codeOfValues) {
                  col[item.apps_item_seqid] = item.codeOfValues;
                  coltp[item.item_name] = item.codeOfValues;
                } else if (item.value != undefined && item.value != null) {
                  col[item.apps_item_seqid] = item.value;
                  coltp[item.item_name] = item.value;
                } else {
                  col[item.apps_item_seqid] = "";
                  coltp[item.item_name] = "";
                } if (item.item_name == 'AQTYORDER' && item.value) {
                  qtyPre = true;
                }
              }
            }
          }
          if (qtyPre) {
            let col2 = JSON.parse(JSON.stringify(col));
            let col3 = JSON.parse(JSON.stringify(coltp));
            wsdp.push(col2);
            wsdptp.push(col3);
            qtyPre = false;
          }
        }
      }
    }



    if (Object.keys(this.newFormInstance).length > 0) {
      wsdp.push(this.newFormInstance);
    }

    //---------------------------------
    let reqData: any = {};
    // alert(JSON.stringify(this.globalObjects.getDeviceInfo()));
    let tpFlag: boolean = false;
    let condArr = event.click_events_arr[event.click_events_count].split('~');

    // nextPageInfo.wscp.apps_item_seqid = event.wscp ? event.wscp.apps_item_seqid : event.apps_item_seqid;
    // nextPageInfo.wscp.apps_page_frame_seqid = event.wscp ? event.wscp.apps_page_frame_seqid : event.apps_page_frame_seqid;

    if (condArr[1] == 'wsdptp') {
      tpFlag = true;
      wsdptp[0].apps_page_frame_seqid = event.apps_page_frame_seqid;
      wsdptp[0].apps_item_seqid = event.apps_item_seqid;
      reqData = {
        "wsdptp": wsdptp
      }
    } else {
      reqData = {
        "wslp": this.userDetails,
        "wscp": nextPageInfo.wscp,
        "wsdp": wsdp,
        "wsdpcl": nextPageInfo.wsdpcl,
        "wsud": this.wsud
      }
      let iudId = this.globalObjects.getLocallData('iudLocal');
      if (iudId) {
        reqData.wscp.iud_seqid = this.userDetails.login_session_id + (iudId + 1);
        this.globalObjects.setDataLocally('iudLocal', (iudId + 1));
      } else {
        reqData.wscp.iud_seqid = this.userDetails.login_session_id + 1;
        this.globalObjects.setDataLocally('iudLocal', 1);
      }
    }
    // console.log(reqData);

    // this.globalObjects.showLoading();

    // if (this.wscp.object_code == "READ_NOTIFICATION") {
    //   this.modalCtrl.dismiss();
    //   this.isModal = "Menu"
    // }
    // alert(JSON.stringify(th is.wscp))


    let data = {
      reqData: JSON.stringify(reqData),
      status: "pending"
    }

    if (!this.globalObjects.networkStatus) {
      this.sqlLiteServ.saveEnterySql(data).then(res => {
        if (res.resStatus == "success") {
          this.globalObjects.displayCordovaToast("Entry Saved in Local Storage..!");
          this.closePage("", clickEventStr);
        } else {
          this.globalObjects.displayCordovaToast("Error in Save Offline.. !");
        }
      })

    } else {
      this.dataService.postData("S2U", reqData).then(res => {

        let data: any = res;

        if (tpFlag) {
          data.responseStatus == "success";

          this.globalObjects.clickedbutton = false;

          this.globalObjects.presentAlert(data.responseData.message).then(() => {
            if (event.click_events_arr.length > (event.click_events_count + 1)) {
              event.click_events_count = event.click_events_count + 1;
              this.itemClicked1(event, clickEventStr);
            }
          })
        }
        else {
          if (data.responseStatus == "success") {

            let object_arr = data.responseData
            let keycount = 0;
            for (let obj of object_arr.Level1_Keys) {
              if (event.sessionObj) {
                event.sessionObj[obj] = object_arr.Values[0][keycount]
              } else {
                event.sessionObj = {};
                event.sessionObj[obj] = object_arr.Values[0][keycount]
              }
              keycount = keycount + 1;
            }

            keycount = 0;
            if (event.click_events_arr[event.click_events_count] == "when_new_form_instance") {
              let newInst = {};
              for (let obj of object_arr.Level1_Keys) {
                if (event.sessionObj) {
                  newInst[obj] = object_arr.Values[0][keycount]
                } else {
                  newInst = {};
                  newInst[obj] = object_arr.Values[0][keycount]
                }
                keycount = keycount + 1;
              }
              if (this.globalObjects.newFormInstanceArr.length > 0) {
                let glob = this.globalObjects.newFormInstanceArr.find(x => x.objCode == event.calling_object_code);
                if (glob) {
                  glob.newInst = newInst;
                }
              } else {
                let data = {
                  objCode: event.calling_object_code,
                  newInst: newInst
                }
                this.globalObjects.newFormInstanceArr.push(data);
              }
              this.wsdp.push(this.newFormInstance);
            }
            let objData = this.globalObjects.setPageInfo(object_arr);
            let flag: boolean = true;
            console.log('objData', objData);
            if (objData.Level1[0].prev_ws_seqid) {
              event.prev_ws_seqid = objData.Level1[0].prev_ws_seqid;
            }
            if (objData.Level1[0].status == "F") {
              this.globalObjects.clickedbutton = false;
              flag = false;
              this.globalObjects.presentAlert(objData.Level1[0].message).then(() => {
                if (event.click_events_arr.length > (event.click_events_count + 1) && (objData.Level1[0].status != "Q") && !flag) {
                  event.click_events_count = event.click_events_count + 1;
                  this.itemClicked1(event, clickEventStr);
                }
              })
            }
            else if (objData.Level1[0].status == "L") {
              sessionStorage.setItem("PLSQL_L", objData.Level1[0].message);
            } else if (objData.Level1[0].status == "S") {
              event.item_enable_flag = 'T';
              this.server_host(event, "'" + objData.Level1[0].message + "'");
            }
            else if (objData.Level1[0].status == "J") {
              event.item_enable_flag = 'T';
              this.generatAllFrameJson(objData.Level1);
            }

            else if (objData.Level1[0].status == "Q") {
              event.item_enable_flag = 'T';
              this.globalObjects.presentAlert(objData.Level1[0].message);
              this.globalObjects.clickedbutton = false;

              for (let frame of this.object_mast.Level2[this.page_no].Level3) {
                if (frame.apps_frame_type === "CALENDER") {
                  this.events.publish('reloadCal');
                }
              }

              this.globalObjects.uniqueKey = "";
            }
            else if (objData.Level1[0].status == "T") {
              event.item_enable_flag = 'T';
              if (objData.Level1[0].message && objData.Level1[0].message.indexOf("OPEN_URL") > -1) {
                let url = objData.Level1[0].message.split("~~")[1];
                window.open(url, '_system');
                // this.dataService.downloadFile(url).then((res)=>{
                //   console.log(res);
                // })
                // window.open(url, '_system');
                // const fileTransfer: FileTransferObject = this.transfer.create();
                // let time = new Date().getTime();
                // fileTransfer.download(url, this.file.dataDirectory + time +'.pdf', true).then((entry) => {
                //   alert(entry.toURL());
                //   this.fileOpener.open(entry.toURL(), "application/pdf")
                // .then(() => console.log('File is opened'))
                // .catch(e => alert("file is" + JSON.stringify(e)));
                //   console.log('download complete: ' + entry.toURL());
                // }, (error) => {
                //   alert(JSON.stringify(error));
                // });
                // this.socialSharing.share("", "", "", url);
              }
              if (event.click_events_arr.length > (event.click_events_count + 1)) {
                event.click_events_count = event.click_events_count + 1;
                this.itemClicked1(event, clickEventStr);
              }
            } else if (objData.Level1[0].status == "E") {
              event.item_enable_flag = 'T';
              if (objData.Level1[0].message && objData.Level1[0].message.indexOf("OPEN_URL") > -1) {
                let url1 = objData.Level1[0].message.split("~~")[1];
                let key = this.encryptQS(url1.split("=")[1],'Si)kPoil');
                let url = url1.split("=")[0] + "=" + key;
                console.log(url)
                window.open(url, '_system');
            
                // this.dataService.downloadFile(url).then((res)=>{
                //   console.log(res);
                // })
                // window.open(url, '_system');
                // const fileTransfer: FileTransferObject = this.transfer.create();
                // let time = new Date().getTime();
                // fileTransfer.download(url, this.file.dataDirectory + time +'.pdf', true).then((entry) => {
                //   alert(entry.toURL());
                //   this.fileOpener.open(entry.toURL(), "application/pdf")
                // .then(() => console.log('File is opened'))
                // .catch(e => alert("file is" + JSON.stringify(e)));
                //   console.log('download complete: ' + entry.toURL());
                // }, (error) => {
                //   alert(JSON.stringify(error));
                // });
                // this.socialSharing.share("", "", "", url);
              }
              if (event.click_events_arr.length > (event.click_events_count + 1)) {
                event.click_events_count = event.click_events_count + 1;
                this.itemClicked1(event, clickEventStr);
              }
            }
            else {
              objData.Level1[0].status = "Q";
              event.item_enable_flag = 'T';
              this.globalObjects.uniqueKey = "";
              flag = false;
              this.globalObjects.presentAlert(objData.Level1[0].message).then(res => {
                if (event.click_events_arr.length > (event.click_events_count + 1) && (objData.Level1[0].status != "Q") && !flag) {
                  event.click_events_count = event.click_events_count + 1;
                  this.itemClicked1(event, clickEventStr);
                }
              });
              this.globalObjects.clickedbutton = false;
            }
            //let keycount = 0;
            // if (wscp.object_code == "READ_NOTIFICATION")

            // if (object_arr.Level1_Keys) {
            //   for (let obj of object_arr.Level1_Keys) {
            //     if (event.sessionObj) {
            //       event.sessionObj[obj] = object_arr.Values[0][keycount]
            //     } else {
            //       event.sessionObj = {};
            //       event.sessionObj[obj] = object_arr.Values[0][keycount]
            //     }
            //     keycount = keycount + 1;
            //   }
            // }
            // console.log(event.sessionObj);
            if (event.click_events_arr.length > (event.click_events_count + 1) && (objData.Level1[0].status != "Q") && flag) {
              event.click_events_count = event.click_events_count + 1;
              this.itemClicked1(event, clickEventStr);
            }


          } else {
            // this.globalObjects.presentToast(data.responseMsg)
            // this.globalObjects.presentToastWithOptions(data.responseMsg,"errorclass")

            event.item_enable_flag = 'T';
            this.globalObjects.presentToastWithOptions(data.responseMsg, "errorclass");
            this.globalObjects.clickedbutton = false;
            for (let frame of this.object_mast.Level2[this.page_no].Level3) {
              if (frame.apps_frame_type === "CALENDER") {
                this.events.publish('reloadCal');
              }
            }
            this.globalObjects.uniqueKey = "";
          }
        }

      }).catch(err => {

        this.globalObjects.presentToast("6 Something went wrong please try again later!");
        console.log(err);
      })
    }
    //---------------------------------
  }

  calling_frame_seqid_str_concat(event) {
    let wsdp = [];
    var object_mast = this.object_mast.Level2;
    if (event.calling_frame_seqid_arr) {
      for (let call_frame of event.calling_frame_seqid_arr) {
        for (let object of object_mast) {

          for (let frame of object.Level3) {

            if (frame.apps_page_frame_seqid == call_frame) {
              let tableRows = [];
              tableRows = frame.tableRows;

              if (this.eventOfadditem && this.eventOfadditem.rows && this.eventOfadditem.rows.length > 0) {
                if (this.eventOfadditem.rows.length > 1) {
                  if (this.eventOfadditem.rows[1][0].apps_page_frame_seqid == frame.apps_page_frame_seqid) {
                    tableRows = this.eventOfadditem.rows;
                  }
                } else {
                  if (this.eventOfadditem.rows[0].length > 0) {
                    if (this.eventOfadditem.rows[0][0].apps_page_frame_seqid == frame.apps_page_frame_seqid) {
                      tableRows = this.eventOfadditem.rows;
                    }
                  }
                }
              }

              if (this.concatKey.length > 0) {
                for (let conKey of this.concatKey) {
                  if (frame.apps_page_frame_seqid == conKey) {
                    tableRows = this.concatArr;
                    this.concatArr = [];
                  }
                }
              }
              if (frame.tableRows) {
                if (tableRows.length > 0) {
                  for (let framedata of tableRows) {
                    let col = {};
                    for (let itemGroup of framedata) {
                      if (itemGroup.Level5) {
                        for (let item of itemGroup.Level5) {
                          if (item.codeOfValues) {
                            col[item.apps_item_seqid] = item.codeOfValues;
                          } else if (item.value) {
                            col[item.apps_item_seqid] = item.value;
                          } else {
                            col[item.apps_item_seqid] = "";
                          }
                        }
                      }
                    }
                    wsdp.push(col)
                  }
                }
              } else {
                let col = {};
                for (let itemGroup of frame.Level4) {
                  if (itemGroup.Level5) {
                    for (let item of itemGroup.Level5) {
                      if (item.codeOfValues) {
                        col[item.apps_item_seqid] = item.codeOfValues;
                      } else if (item.value) {
                        col[item.apps_item_seqid] = item.value;
                      } else {
                        col[item.apps_item_seqid] = "";
                      }

                    }
                  }
                }
                wsdp.push(col)
              }
            }
          }
        }
      }
      event.wsdp = wsdp
      this.openPage(event);
    } else {
      this.openPage(event);
    }

  }

  checkValidFrame(event) {

    let isValid = true;
    // -----------------------------------
    let arr = event.click_events_str.split("#");
    let frmseq = arr[event.click_events_str.indexOf("checkValidFrame")].split("~");
    var object_mast = this.object_mast.Level2
    for (let object of object_mast) {
      for (let frame of object.Level3) {
        if (frame.flag != "F") {
          for (let chkframe of frmseq) {
            if (frame.apps_page_frame_seqid == chkframe) {
              if (frame.tableRows && frame.tableRows.length > 0) {
                for (let framedata of frame.tableRows) {
                  for (let itemGroup of framedata) {
                    if (itemGroup.Level5) {
                      for (let item of itemGroup.Level5) {
                        if ((item.isValid !== undefined && !item.isValid && item.item_visible_flag != 'F')) {
                          isValid = item.isValid;
                          item.touched = true;
                        }
                      }
                    }
                  }
                }
              } else {
                isValid = false;
                this.globalObjects.presentAlert("Data should not be null,please add items...");
              }
            }
          }
        }
      }
    }
    return isValid;
  }


  async openPage(componentProps) {

    this.globalObjects.breadCrumpsArray.push(this.breadCrumsuper);
    console.log(this.globalObjects.breadCrumpsArray);
    this.breadCrumsuper = [];
    console.log(this.page_no);

    this.modalFlag = componentProps.wscp.flag;
    if (componentProps.wscp.flag != 'P') {
      this.globalObjects.mydatavariable = componentProps;
    }

    // this.itemClicked(event);

    if (componentProps.wscp.object_code == "READ_NOTIFICATION") {
      this.modalCtrl.dismiss();
    }

    if (componentProps.wscp.flag == 'P') {
      componentProps.isModal = "P";
      this.globalObjects.popoverFlag = "P";
      const modal1 = await this.popOverCtrl.create({
        component: SuperPage,
        cssClass: 'pop-ion-content',
        componentProps: componentProps,
        id: "globalPopover",
        backdropDismiss: true
      });

      //  x/y/h/w
      // x bottom
      // componentProps.popoverStyle='#popover$x=5%$y=20%$h=100%$w=40%$#';
      if (componentProps.popoverStyle) {
        modal1.lastElementChild.lastElementChild.setAttribute('style', 'display:none;');
        if (componentProps.popoverStyle.indexOf('popover') > -1) {
          // let styleArrStr = componentProps.popoverStyle.split('popover')[1].split('#')[0];
          let styleArr = componentProps.popoverStyle.split('#');
          let obj: any = {};
          for (let x of styleArr) {
            let key = x.split('=');

            if (key[0] == 'x') {
              obj.left = key[1];
            }
            if (key[0] == 'y') {
              obj.top = key[1];
            }
            if (key[0] == 'w') {
              obj.width = key[1];
            }
            if (key[0] == 'h') {
              obj.height = key[1];
            }
          }

          let style: any = "";
          let i = 0;
          for (let x in obj) {
            i++;
            console.log(x);
            console.log(obj[x]);
            if (i < Object.keys(obj).length) {
              style = style + x + ' : ' + obj[x] + ' !important' + ' ;';
            } else {
              style = style + x + ' : ' + obj[x] + ' !important';
            }


          }
          console.log(style);

          setTimeout(() => {

            modal1.lastElementChild.lastElementChild.setAttribute('style', style);

          }, 1);
        }
      }

      // document.getElementsByTagName("H1")[0].setAttribute("class", "democlass");
      console.log(modal1.lastElementChild.lastElementChild);
      modal1.onDidDismiss().then((details: OverlayEventDetail) => {
        this.globalObjects.popoverFlag = 'M';
        this.globalObjects.breadCrumpsArray.pop();
      });


      return await modal1.present();
    }
    else {
      console.log("openpage------>", componentProps);
      // this.globalObjects.breadCrumpsArray.push(this.breadCrumsuper);
      // this.breadCrumsuper=[];
      /*    let currentCallObj = componentProps.wscp.object_code;
        let previousCallObj = this.globalObjects.previousCallObj;
  
       if (previousCallObj && currentCallObj && previousCallObj === currentCallObj) {
          this.wsdp = componentProps.wsdp;
          this.wscp = componentProps.wscp;
          this.wsdpcl = componentProps.wsdpcl;
          this.ngOnInit();
        } else { 
  
          this.globalObjects.previousCallObj = currentCallObj;*/

      let modal: any;
      // console.log('vijay1111 ',componentProps.wscp.object_code);
      componentProps.isModal = "M";
      modal = await this.modalCtrl.create({
        component: SuperPage,
        componentProps: componentProps,
        backdropDismiss: this.backdismiss,
        id: JSON.stringify(componentProps.wscp.apps_item_seqid)
      });

      modal.onDidDismiss().then((detail: OverlayEventDetail) => {
        this.globalObjects.devItemEditFlag = true;
        this.globalObjects.clickedbutton = false;
        this.globalObjects.previousCallObj = "";
        this.globalObjects.summaryCartdeatail = [];
        this.wscp.local_Item_Seq_Id = null;
        this.wscp.apps_item_seqid = null;
        this.globalObjects.devItemName = {};
        this.globalObjects.devItemIcon = "";
        this.clickEvent = "";

        if (this.globalObjects.backObjectCode) {
          if (this.globalObjects.backObjectCode == this.object_mast.object_code && this.page_no == 0) {
            this.globalObjects.backObjectCode = "";
          } else {
            try {
              this.modalCtrl.dismiss();
            } catch (e) {
              this.globalObjects.backObjectCode = "";
            }
          }
        }

        // if (this.globalObjects.callingPara.length > 0) {
        //   let index = 0;
        //   for (let glob of this.globalObjects.callingPara) {
        //     if (glob.objectCode == componentProps.wscp.object_code) {
        //       this.globalObjects.callingPara.splice(index, 1);
        //     }
        //     index++
        //   }
        // }
        // this.globalObjects.cartSummaryPlain = [];
        if (this.order_pageno == 2) {
          this.globalObjects.cartSummaryPlain = [];
          //this.globalObjects.summaryCartdeatail
          this.order_pageno = 0;
        }

        if (detail) {
          if (detail.data) {
            // this.getNotificationCount();
          }
        }
        if (this.operation_mode) {
          for (let o of this.operation_mode) {
            if (o.indexOf('BACK_REFRESH') > -1) {
              if (o.indexOf('~') > -1) {
                //let backRef = o.split("#");
                let clickEvt = o;
                if (clickEvt) {
                  let pageInfo = componentProps;
                  pageInfo.clickEvt = clickEvt;

                  this.refreshSamePage(pageInfo, componentProps.click_events_str);
                }
              } else {
                this.ngOnInit();
              }
            }
          }

        }
        this.closeAllModal(componentProps);
        this.globalObjects.breadCrumpsArray.pop();
      });
      return await modal.present();
    }

  }

  async open_model_page(componentProps) {
    // console.log(componentProps);
    componentProps.isModal = "M";
    let modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        // component: SuperPage,
        component: EntryListPage,
        backdropDismiss: this.backdismiss,
        componentProps: componentProps
      });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail) {
        if (detail.data) {
          this.getPageInfo();
        }
      }
      if (this.operation_mode && this.operation_mode.indexOf('BACK_REFRESH') > -1) {
        this.ngOnInit();
      }
    });
    return await modal.present();
  }
  async open_approval_page(componentProps) {

    this.openPage(componentProps);
    // console.log(componentProps);
    /*  componentProps.isModal = "M";
     let modal: HTMLIonModalElement =
       await this.modalCtrl.create({
         component: SuperPage,
         // component: EntryListPage,
         componentProps: componentProps
       });
     console.log(this.object_mast);
     modal.onDidDismiss().then((detail: OverlayEventDetail) => {
 
       if (detail) {
         if (detail.data) {
           this.getPageInfo();
         }
       }
       if (this.operation_mode && this.operation_mode.indexOf('BACK_REFRESH') > -1) {
         this.ngOnInit();
       }
     });
     return await modal.present(); */
  }



  async open_model_multilevel_page(componentProps) {
    let modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: MultiLevelTabPage,
        backdropDismiss: this.backdismiss,
        componentProps: componentProps
      });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {

      if (this.operation_mode && this.operation_mode.indexOf('BACK_REFRESH') > -1) {
        this.ngOnInit();
      }
    });
    return await modal.present();
  }



  // openMultiTabpage() {
  //   this.navCtrl.navigateForward("multi-level-tab");
  // }
  async openNotification() {
    if (this.isModal == "M") {
      this.modalCtrl.dismiss();
    }
    let componentProps: any = {};
    let wslp: any = {};
    this.wscp = {};
    let wsdp: any = [];
    wslp = this.userDetails;
    this.wscp.object_code = "READ_NOTIFICATION";
    this.wscp.pageno = "null";
    this.wscp.click_events_str = "get_object_config";
    this.wscp.service_type = "get_object_config";

    componentProps = {
      "wslp": wslp,
      "wscp": this.wscp,
      "wsdp": wsdp
    }

    componentProps.isModal = "M";
    // let componentProps = {
    //   "wslp": {
    //     "app_code_str": "EMP_DR"
    //   },
    //   "wscp": {
    //     "object_code": "APP_NOTIFICATION",
    //     "pageno": null,
    //     "click_events_str": "get_object_config",
    //     "service_type": "get_object_config"
    //   },
    //   "wsdp": [
    //     {}
    //   ]
    // }

    console.log("componrnt....", componentProps)
    let modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: SuperPage,
        backdropDismiss: this.backdismiss,
        componentProps: componentProps
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      this.wscp = {};
      if (detail) {
        if (detail.data) {
          // this.getNotificationCount();
        }
        if (this.operation_mode && this.operation_mode.indexOf('BACK_REFRESH') > -1) {
          this.ngOnInit();
        }
      }
    });
    return await modal.present();
  }

  opentoast() {
    this.globalObjects.presentToastWithOptions("Error in Handler", "errorclass");
  }

  popDismiss() {
    this.popoverdismiss = false;
    this.popOverCtrl.dismiss();
    // this.openPage( this.globalObjects.mydatavariable);
    this.isModal = "Menu";
  }

  async closePage(event, clickEventStr) {

    // if (this.wscp.object_code == "READ_NOTIFICATION") {
    //   this.modalCtrl.dismiss();
    // this.wscp={};
    // this.wsdp=[];
    // this.wsdpcl=[];
    // // } else {
    // await this.modalCtrl.dismiss({
    //   'dismissed': true
    // });
    console.log(this.page_no);
    let proceed = false;
    if (this.object_mast && this.object_mast.operation_mode_str && this.object_mast.operation_mode_str.indexOf("ASK_FOR_BACK") > -1 && this.page_no == 0) {
      var r = confirm("Are you sure, do you want to discard all changes?");
      if (r == true) {
        proceed = true;
      } else {
        proceed = false;
      }
    } else {
      proceed = true;
    }

    if (proceed) {
      if (this.object_mast && this.object_mast.Level2) {
        let glob = this.globalObjects.refreshObj.find(x => x.refreshObj == this.object_mast.object_code);
        if (glob) {
          glob.refreshFlag = false
        }
        for (let obj of this.object_mast.Level2[this.page_no].Level3) {
          let seqNo = obj.apps_page_frame_seqid;
          let name = "refreshFrame" + seqNo.replace(/-/g, '_') + this.globalObjects.refreshId;
          this.events.unsubscribe(name);
        }
        if (this.globalObjects.refreshId > 0) {
          this.globalObjects.refreshId--;
        }
      }
      if (this.globalObjects.popoverFlag == "P") {
        this.globalObjects.popoverFlag = 'M'
        this.popOverCtrl.dismiss();
        if (event && event.click_events_arr.length > (event.click_events_count + 1)) {
          event.click_events_count = event.click_events_count + 1;
          this.itemClicked1(event, clickEventStr);
        }
      } else {
        this.modalCtrl.dismiss();
        if (event && event.click_events_arr.length > (event.click_events_count + 1)) {
          event.click_events_count = event.click_events_count + 1;
          this.itemClicked1(event, clickEventStr);
        }
      }
    }
    // this.events.unsubscribe("refreshFrame");
    // }
  }

  async popupClosePage() {

    if (this.object_mast && this.object_mast.Level2) {
      let glob = this.globalObjects.refreshObj.find(x => x.refreshObj == this.object_mast.object_code);
      if (glob) {
        glob.refreshFlag = false
      }
      for (let obj of this.object_mast.Level2[0].Level3) {
        let seqNo = obj.apps_page_frame_seqid;
        let name = "refreshFrame" + seqNo.replace(/-/g, '_') + this.globalObjects.refreshId;
        this.events.unsubscribe(name);
      }
    }
    if (this.globalObjects.popoverFlag == "P") {
      this.globalObjects.popoverFlag = 'M'
      this.popOverCtrl.dismiss();
      this.modalCtrl.dismiss();
    }
    // this.events.unsubscribe("refreshFrame");
    // }
  }

  getNotificationCount() {
    let userDetails = this.globalObjects.getLocallData("userDetails");
    var data = {
      "parameters": userDetails
    }
    let url = "getNotificationCount";
    try {
      console.log("Notication: " + (userDetails))
      console.log("Notication: " + url)

      this.dataService.postData(url, data).then(res => {
        let data: any = res;
        // this.notificationCount = [];
        if (data.responseStatus == "success") {
          this.notificationCount = data.responseData;
        }
      })
    } catch (error) {
      this.globalObjects.presentAlert("LHSSYS_PORTAL_NEWS DOESN'T EXIST !!");
    }
  }

  refreshObjFab() {

    this.globalObjects.plastoFrameSumm = [];
    this.globalObjects.cartSummaryPlain = [];
    if (this.globalObjects.networkStatus) {
      this.refreshObj = true;
    }
    this.events.publish("refreshLocal");
    if (this.object_mast && this.object_mast.Level2) {
      for (let obj of this.object_mast.Level2[0].Level3) {
        let seqNo = obj.apps_page_frame_seqid;
        let name = "refreshFrame" + seqNo.replace(/-/g, '_') + this.globalObjects.refreshId;
        this.events.unsubscribe(name);
      }
    }
    this.refreshPage();
    // this.gotosuper();
  }

  refreshPage() {

    if (this.tabflag) {
      this.isModal = "Menu";
      this.tabflag2 = true;
      this.wscp = {};
      this.wsdp = [];
      this.userDetails = this.globalObjects.getLocallData("userDetails");
      this.ngOnInit();
    } else {
      if (!this.wscp.object_code) {
        this.wscp.object_code = this.object_mast.Level2[this.page_no].object_code;
      }
      this.ngOnInit();
    }
  }

  switchAppKey() {
    //  this.navCtrl.
    this.router.navigate(['appkey-collection']);
  }


  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ionViewDidLeave() {
    this.events.publish("setappkeyInfoVisibility", 'N');
  }

  fabDrop() {
    let top = this.fabbtn.nativeElement.getBoundingClientRect().top;
    if (top < 48) {
      this.events.publish("setappkeyInfoVisibility", 'Y');
    } else {
      this.events.publish("setappkeyInfoVisibility", 'N');
    }
  }

  trackingEvent(type, event, clickEventStr) {
    if (type === 'START') {
      this.globalObjects.setDataLocally("locationStartTime", new Date());
      this.userDetails.interval_time = event.interval_time;
      this.globalObjects.setDataLocally("userDetails", this.userDetails);

      this.background.start(event.interval_time);
      // this.background.startgpsEntry();
    }
    else {
      this.globalObjects.destroyLocalData("locationStartTime");
      this.background.stop();
      // this.background.endgpsEntry();
    }
    if (event.click_events_arr.length > (event.click_events_count + 1)) {
      event.click_events_count = event.click_events_count + 1;
      this.itemClicked1(event, clickEventStr);
    }
  }

  ionViewWillLeave() {
    if (this.modalFlag == 'M') {
      this.modalCtrl.dismiss();
    }
  }

  concatFun(nextPageInfo, event, clickEventStr) {
    this.concatKey = nextPageInfo.concatKey;
    let newTableRows = [];
    for (let obj of this.object_mast.Level2) {
      for (let frame of obj.Level3) {
        for (let conKey of this.concatKey) {
          if (frame.apps_page_frame_seqid == conKey) {
            for (let tabData of frame.tableRows) {
              for (let itemGrp of tabData) {
                newTableRows.push(itemGrp);
              }
            }
          }
        }
      }
    }
    this.concatArr.push(newTableRows);
    if (event.click_events_arr.length > (event.click_events_count + 1)) {
      event.click_events_count = event.click_events_count + 1;
      this.itemClicked1(event, clickEventStr);
    }
  }

  samePageForm(nextPageInfo, event, clickEventStr) {
    this.wsdp = nextPageInfo.wsdp;
    this.wsdpcl = nextPageInfo.wsdpcl;
    this.wscp = nextPageInfo.wscp;

    let flag: boolean = false;

    if (!this.globalObjects.current_page_parameter.MODE) {
      this.globalObjects.current_page_parameter.MODE = '';
    }
    let mainPage = this.object_mast.Level2[this.page_no].Level3;
    let newPage;
    if (event.calling_pageno) {
      newPage = event.calling_pageno;
    }
    else {
      newPage = nextPageInfo.samePageNo + 1;
      if (this.globalObjects.samePageNo) {
        newPage = this.globalObjects.samePageNo + 1;
        this.globalObjects.samePageNo = this.globalObjects.samePageNo + 1;
      } else {
        this.globalObjects.samePageNo = newPage;
      }
    }

    let newPageInfo = []
    newPageInfo = this.object_mast.Level2

    for (let frame of newPageInfo) {
      if (frame.apps_page_no == newPage) {
        for (let obj of frame.Level3) {
          mainPage.push(obj);
          flag = true;
        }
      }
    }
    if (flag) {
      let length = newPageInfo[nextPageInfo.samePageNo].Level3.length;
      console.log(length);
      newPageInfo.splice(nextPageInfo.samePageNo, 1);
      // newPageInfo[nextPageInfo.samePageNo].Level3.splice(0, length);
      this.events.publish("same_page", this.wsdp);
    }

    if (event.click_events_arr.length > (event.click_events_count + 1)) {
      event.click_events_count = event.click_events_count + 1;
      this.itemClicked1(event, clickEventStr);
    }
    /* 
  let obj_mast = []
  obj_mast  = this.object_mast.Level2;
  let arr_page = obj_mast[0].Level3
  let newPage = obj_mast[nextPageInfo.page_no].Level3;

  for(let  i = 0; i < newPage.length ; i++){
    arr_page.push(newPage[i]);
    
  } */

  }

  shareViaWhatsApp(event, clickEventStr) {
    var object_mast = this.object_mast.Level2;
    let rowindex = 0;
    if (event.itemIndex) {
      rowindex = event.itemIndex;
    }
    for (let object of object_mast) {
      for (let frame of object.Level3) {
        let mobileNo;
        let message;

        if (frame.tableRows) {
          for (let itemGroup of frame.tableRows[rowindex]) {
            if (frame.apps_frame_type == 'APPROVAL-TAB') {
              for (let itemp of itemGroup) {
                if (itemp.Level5) {
                  for (let item of itemp.Level5) {
                    if (item.item_name == "MOBILE_NUMBER" || item.item_name == "MOBILENO") {
                      mobileNo = item.value
                    } else if (item.item_name == "SMS" || item.item_name == "SMS_TEXT") {
                      message = item.value
                    }
                  }
                }
              }
            } else {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (event.apps_page_frame_seqid == itemGroup.apps_page_frame_seqid) {
                    if (item.item_name == "MOBILE_NUMBER" || item.item_name == "MOBILENO" || item.item_name == "MOBILE_NO") {
                      mobileNo = item.value
                    } else if (item.item_name == "SMS" || item.item_name == "SMS_TEXT" || item.item_name == "EMAIL_BODY") {
                      message = item.value
                    }
                  }
                }
              }
            }
          }
        }
        try {
          if (mobileNo && message) {

            if (this.platform.is("android") || this.platform.is("ios")) {
              this.globalObjects.shareViaWhatsApp(mobileNo, message);
            } else {
              this.globalObjects.shareViaWhatsAppWeb(mobileNo, message);
            }
          }
        } catch (error) {
          console.log(error.message);
          if (event.click_events_arr.length > (event.click_events_count + 1)) {
            event.click_events_count = event.click_events_count + 1;
            this.itemClicked1(event, clickEventStr);
          }
        }
        if (event.click_events_arr.length > (event.click_events_count + 1)) {
          event.click_events_count = event.click_events_count + 1;
          this.itemClicked1(event, clickEventStr);
        }
      }
    }
  }
  callLogs(nextPageInfo, event, clickEventStr) {
    this.globalObjects.getContactpermission();
    let callLog = this.globalObjects.recordsFound;
    let wsdp = [];
    let i = 0;
    this.globalObjects.presentAlert(JSON.stringify(callLog));
    for (let x of callLog) {
      let rownumber = i++;
      let date = this.globalObjects.formatDate(x.date, "dd-MMM-yyyy HH:mm:ss");

      let obj = {
        rownumber: rownumber,
        name: x.cachedName,
        duration: x.duration,
        type: x.type,
        number: x.number,
        date: date,
      }
      wsdp.push(obj);
    }

    let wsdpcl = [];
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": nextPageInfo.wscp,
      "wsdp": wsdp,
      "wsdpcl": wsdpcl,

    }
    this.dataService.postData("S2U", reqData).then(res => {

      // this.globalObjects.hideLoading();
      let data: any = res;
      let object_arr = data.responseData
      let objData = this.globalObjects.setPageInfo(object_arr);
      // console.log(data);
      // if (data.responseStatus == "success") {
      //   alert("sucess logs ")
      // }

      if (objData.Level1[0].status == "F") {
        this.globalObjects.presentAlert(objData.Level1[0].message);
      }
      else if (objData.Level1[0].status == "L") {
        sessionStorage.setItem("PLSQL_L", objData.Level1[0].message);
      }
      else if (objData.Level1[0].status == "Q") {
        this.globalObjects.presentAlert(objData.Level1[0].message);
      }
      if (event.click_events_arr.length > (event.click_events_count + 1) && (objData.Level1[0].status != "Q")) {
        event.click_events_count = event.click_events_count + 1;
        this.itemClicked1(event, clickEventStr);
      }
    })
  }

  async gotosuper() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      location.reload();
    }
    else {
      let url: any = location;
      window.open(String(url).split('super')[0], '_self');
    }

  }

  /*  approveReject(nextPageInfo){
     let event_str = nextPageInfo.click_events_arr[nextPageInfo.click_events_count];
       let APPROVAL_FLAG: any ;
       let REMARK: any ;
       if (event_str.indexOf("~")) {
      //   nextPageInfo.wsdp.REMARK = APPROVAL_FLAG = event_str.split("~")[0];
         nextPageInfo.wsdp[0].APPROVAL_FLAG = event_str.split("~")[1];
       }
       
     let post_data = {
       "wslp": this.userDetails,
       "wscp": nextPageInfo.wscp,
       "wsdp": nextPageInfo.wsdp
     }
     this.dataService.postData('S2U', post_data).then(res => {
       console.log(res);
     });
   } */

  sendHtml(e) {

    let wsdpcl = [];
    let wscp: any = {};
    wscp.service_type = "SEND_HTML_MAIL"
    let reqData: any = {};
    let wsdp = [];
    // wsdp.push(this.globalObjects.htmlObj);
    reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
      "wsdpcl": wsdpcl,

    }
    this.dataService.postData("S2U", reqData).then(res => {
      let data: any = res;

      if (data.responseStatus == "success") {
        this.globalObjects.presentAlert("Mail send sucessfull...");
      } else {
        this.globalObjects.presentAlert("Error occured while sending mail, Please try after some time.");
      }
    })
  }


  userStatus() {

    let wsdpcl = [];
    let wscp: any = {};
    wscp.service_type = "userStatus"
    let reqData: any = {};
    let wsdp = [];

    this.platform.ready().then(() => {
      wscp.app_status = 'appStart'
      reqData = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": wsdp,
        "wsdpcl": wsdpcl,
      }
      this.dataService.postData("S2U", reqData).then(res => {
      });

      this.platform.resume.subscribe((result) => {
        wscp.app_status = 'appStart'
        reqData = {
          "wslp": this.userDetails,
          "wscp": wscp,
          "wsdp": wsdp,
          "wsdpcl": wsdpcl,
        }
        this.dataService.postData("S2U", reqData).then(res => {
        });
      });

      this.platform.pause.subscribe((result) => {
        wscp.app_status = 'appPause'
        reqData = {
          "wslp": this.userDetails,
          "wscp": wscp,
          "wsdp": wsdp,
          "wsdpcl": wsdpcl,
        }
        this.dataService.postData("S2U", reqData).then(res => {
        });
      });
    })
  }

  addNewRow(event) {
    let pageNo = event.pageNo;
    for (let frame of this.object_mast.Level2[pageNo].Level3) {
      if (frame.apps_page_frame_seqid == event.apps_page_frame_seqid) {
        let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));

        for (let itemGroup of frameLevel4) {
          for (let item of itemGroup.Level5) {
            item.indexCount = frame.tableRows.length;


            if (item.session_hold_flag == 'T') {
              if (this.sessionObj) {
                item.value = this.sessionObj[item.item_name];
              }
            }
            if (item.item_default_value == 'INDEX') {
              frame.apps_frame_seq_id
              let name = frame.apps_page_frame_seqid + "." + item.apps_item_seqid;
              let val = this.get_item_value(name, frame.tableRows.length - 1);
              // item.value = frame.tableRows.length + 1;
              // this.item_slno_count = this.item_slno_count + 1;
              item.value = parseInt(val) + 1;
            }
            item.indexcount = frame.tableRows.length;
          }
        }

        if (frame.tableRows) {
          frame.tableRows.push(frameLevel4);
        } else {
          frame.tableRows[0] = frameLevel4;
        }
      }
    }

    setTimeout(() => {

      this.mirrorItems(event);
    }, 5);

    /*  if (event.click_events_arr.length > (event.click_events_count + 1)) {
       event.click_events_count = event.click_events_count + 1;
       this.itemClicked1(event);
     } */
  }

  async openDeveloperPage() {
    const popover = await this.popOverCtrl.create({
      component: DeveloperModePage,
      cssClass: 'developer-popover',
      translucent: true,
      backdropDismiss: true
    });
    return await popover.present();
  }

  refreshSamePage(nextPageInfo, clickEventStr) {
    this.wsdp = nextPageInfo.wsdp;
    this.wsdpcl = nextPageInfo.wsdpcl;
    this.wscp.item_sub_type = nextPageInfo.wscp.item_sub_type;
    let refreshKey = nextPageInfo.clickEvt.split('~');
    let refreshFrame = []
    for (let x of refreshKey) {
      let obj = {
        key: x,
        val: 'T'
      }
      refreshFrame.push(obj);
    }
    let event: any = {};
    event = nextPageInfo;
    event.refreshFrame = refreshFrame;


    let glob = this.globalObjects.refreshObj.find(x => x.refreshObj == nextPageInfo.wscp.object_code);

    if (glob) {
      glob.refreshFlag = true
    } else {
      let obj = {
        refreshFlag: true,
        refreshObj: nextPageInfo.wscp.object_code
      }
      this.globalObjects.refreshObj.push(obj);
    }



    for (let x of refreshKey) {
      let name = "refreshFrame" + x.replace(/-/g, '_') + this.globalObjects.refreshId;
      this.events.publish(name, event);
    }
    // this.events.publish('refreshFrame', event);
    if (event.click_events_arr) {
      if (event.click_events_arr.length > (event.click_events_count + 1)) {
        event.click_events_count = event.click_events_count + 1;
        this.itemClicked1(event, clickEventStr);
      }
    }
  }



  switchSmart(event) {

    if (this.smartBtn) {
      for (let frame of this.object_mast.Level2[this.page_no].Level3) {
        if (event.switchFrames.length > 0) {
          for (let sF of event.switchFrames) {
            if (sF == frame.apps_page_frame_seqid) {
              if (frame.tableRows && frame.tableRows.length > 0) {
                for (let framedata of frame.tableRows) {
                  for (let itemGroup of framedata) {
                    if (itemGroup.Level5) {
                      for (let item of itemGroup.Level5) {
                        if ((item.data_required_flag == 'T' || item.prompt_name[item.prompt_name.length - 1] == "*")) {
                        } else {
                          item.item_visible_flag = 'F';
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let framedata of frame.tableRows) {
              for (let itemGroup of framedata) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if ((item.data_required_flag == 'T' || item.prompt_name[item.prompt_name.length - 1] == "*")) {
                    } else {
                      item.item_visible_flag = 'F';
                    }
                  }
                }
              }
            }
          }
        }
      }
      this.smartBtn = false;
    } else {
      for (let frame of this.object_mast.Level2[this.page_no].Level3) {
        if (frame.tableRows && frame.tableRows.length > 0) {
          for (let framedata of frame.tableRows) {
            for (let itemGroup of framedata) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  for (let f of frame.Level4) {
                    for (let x of f.Level5) {
                      if (x.item_name == item.item_name && x.item_visible_flag == 'T') {
                        item.item_visible_flag = 'T';
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      this.smartBtn = true;
    }

  }



  openLocationTrackingPage() {
    let userDetails = this.globalObjects.getLocallData('userDetails');
    let reqData = {
      "wslp": userDetails,
    }
    this.dataService.postData("openLocationTrackingDashboard", reqData).then((res: any) => {
      if (res.responseStatus == 'success') {
        let data = res.responseData;
        let sessionId = data.sessionId;
        let tenantId = data.tenantId;
        let scopeUrl = this.globalObjects.getLocallData('scopeUrl');
        let arr = scopeUrl.split("/");
        let url = arr[0] + "//" + arr[2] + "/bridge?action=getLocationTrackingDashboard&sessionId=" + sessionId + "&tenantId=" + tenantId;
        window.open(url, "_blank");
      } else {
        this.globalObjects.presentAlert("Error while creating session...")
      }
    }, error => this.globalObjects.presentAlert("Server Error..."));
  }

  /*   async openSettingPage(){
     let setModal = await this.modalCtrl.create({
        component: SettingPage,
        
      });
  
      setModal.onDidDismiss().then((detail: OverlayEventDetail) => {
       
      });
      return await setModal.present();
  
    }
   */


  getexceldetail(file) {
    return new Promise((resolve, reject) => {
      let head = [];
      let body = [];
      let tableBody = [];
      let data: any = {};
      readXlsxFile(file).then((rows) => {
        for (let i of rows[0]) {
          head.push(i);
        }
        body = rows;
        body.shift();

        for (let j of body) {
          tableBody.push(j);
        }
        if (tableBody) {
          data.head = JSON.parse(JSON.stringify(head))
          data.tableBody = JSON.parse(JSON.stringify(tableBody));
          resolve(data);
        }
      }, error => {
        reject(error)
      });
    });
  }

  moveExceltoFrame(event, head, body) {
    let tiltseparate = event.click_events_str.split('~');
    for (let frameCollection of this.object_mast.Level2[this.page_no].Level3) {
      if (tiltseparate[1] == frameCollection.apps_page_frame_seqid) {

        let final: any = [];
        let frameTableRowsdata: any = JSON.parse(JSON.stringify(frameCollection.tableRows));

        for (let y = 0; y < body.length; y++) {
          let i: number = -1;
          let pushtoFinal: any = [];
          for (let heades of head) {
            i++;
            for (let tabledata of frameTableRowsdata) {

              for (let rows of tabledata) {
                for (let items of rows.Level5) {
                  if (heades == items.item_name) {
                    items.value = body[y][i]
                  }
                }
              }
              pushtoFinal = (JSON.parse(JSON.stringify(tabledata)))

            }

          }
          final.push(pushtoFinal);

        }
        frameCollection.tableRows = final;
      }
    }
    console.log(this.object_mast)
  }

  openWebLinks(data: any) {
    /*let reqData = {
      "parameters": {
        "menu_option_code" : data.value
      }
    }
     let url = "openPortalUrl";
    this.dataService.postData(url, reqData).then((res: any) => {
      if (res.responseStatus == 'success') {
        let data = res.responseData;
        let sessionId = this.userDetails.session_id;
        let tenantId = data.tenantId;
        let finalUrl = data.url + "&sessionId=" + sessionId + "&tenantId=" + tenantId;
        if(sessionId && tenantId){
          window.open(finalUrl, "_blank");
        }else{
          alert("Session id or tenant id is missing...");
        }
      } else {
        this.globalObjects.presentAlert(res.responseMsg);
      }
    }, error => this.globalObjects.presentAlert("Server Error..."));*/
    let userDetails = this.globalObjects.getLocallData('userDetails');
    userDetails.database_name = this.globalObjects.getLocallData('tenantId');
    this.wscp.service_type = 'open_java_url';
    this.wscp.menu_option_code = data.value;
    let reqData = {
      "wslp": userDetails,
      "wscp": this.wscp
    }

    this.dataService.postData("S2U", reqData).then((data: any) => {
      if (data.responseStatus == 'success') {
        let object_arr = data.responseData
        let objData = this.globalObjects.setPageInfo(object_arr);
        if (objData.Level1[0]) {
          if (objData.Level1[0].status == "Q") {
            this.globalObjects.presentAlert(objData.Level1[0].message);
          }
          else if (objData.Level1[0].java_url) {
            if (objData.Level1[0].status == "F") {
              this.globalObjects.presentAlert(objData.Level1[0].message);
            }
            window.open(objData.Level1[0].java_url, "_blank");
          } else {
            this.globalObjects.presentAlert("Java Url not found from backend...");
          }
          console.log(objData);
        } else {
          this.globalObjects.presentAlert("No data found...");
        }
      } else {
        this.globalObjects.presentAlert(data.responseMsg);
      }
    }, error => this.globalObjects.presentAlert("Server Error..."));

  }

  uploadFileToServer(event, data) {
    console.log(event);
    let wsdp = [];

    wsdp = event.wsdp.filter((item) => {

      item[event.apps_item_seqid] = data;
      return item;
    })
    let reqData = {
      "wslp": this.userDetails,
      "wscp": event.wscp,
      "wsdp": wsdp,
      "wsud": this.wsud
    }

    this.dataService.postData("S2U", reqData).then(res => {
      if (res == 'success') {

      } else {

      }
    }, (error) => {
      this.globalObjects.presentAlert("Server connectivity issue...");
    })
  }

  async openSettingPage() {
    const modal = await this.modalCtrl.create({
      component: SettingPage,
      backdropDismiss: this.backdismiss
    });
    return await modal.present();
  }





  selectDevice(screen, i) {
    for (let f of this.deviceMode) {
      if (f.class == "active") {
        f.class = "inActive"
      }
    }

    this.deviceMode[i].class = "active";
    let x = document.getElementsByTagName("html");
    let s = document.getElementsByClassName("shrinkMyscreen")[0];

    if (screen == "Mobile") {
      this.globalObjects.mobileFlag = true;
      x[0].setAttribute("style", "width:440px;margin: auto;background: #eee;");
    }
    if (screen == "Desktop") {
      this.globalObjects.mobileFlag = false;
      x[0].setAttribute("style", "width:100%;margin: auto;");

    }
    if (screen == "Tab") {
      this.globalObjects.mobileFlag = false;
      x[0].setAttribute("style", "width:1024px;margin: auto;background: #eee;");
    }
    this.refreshObjFab();
  }

  async downloadScript(objectcode) {
    this.scriptLoading = true;
    let reqData = {
      objectcode: objectcode
    }
    if (!this.platform.is('ios') && !this.platform.is('android')) {
      this.dataService.postData("getObjectCodeScript", reqData).then((res: any) => {
        this.scriptLoading = false;
        if (res.responseStatus == 'success') {
          let text = res.responseData;
          var data = new Blob([text], { type: 'text/plain' });
          let textFile = null;
          if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
          }
          let fileName = JSON.stringify(Math.floor(Math.random() * (999999 - 100000)) + 100000);
          const a = document.createElement('a')
          const objectUrl = URL.createObjectURL(data)
          a.href = objectUrl
          a.download = objectcode + ".txt";
          a.click();
          URL.revokeObjectURL(objectUrl);
        } else {
          this.globalObjects.presentAlert(res.responseMsg);
        }
      }, (err) => {
        this.scriptLoading = false;
        this.globalObjects.presentAlert("404 Url not found...");
      })
    } else {
      this.globalObjects.presentAlert("This feature is available for browser only...");
    }

  }




  async openObjectEditorPage(data) {
    const objModal = await this.modalCtrl.create({
      component: ObjectMastEditorPage,
      cssClass: 'my-custom-class',
      backdropDismiss: this.backdismiss,
      componentProps: {
        data: data
      }

    });
    return await objModal.present();

  }

  async openFrameEditorPage(data) {
    const objModal = await this.modalCtrl.create({
      component: DevFrameMastEditorPage,
      cssClass: 'my-custom-class',
      backdropDismiss: this.backdismiss,
      componentProps: {
        data: data
      }

    });
    return await objModal.present();

  }


  async openItemAddPage(data) {


    let apps_page_frame_seqid = data.apps_page_frame_seqid;
    let apps_page_no = this.page_no;


    this.globalObjects.popoverFlag = 'P';
    let popUp = await this.popOverCtrl.create({
      component: DevFrameItemListPage,
      componentProps: data,
      id: "globalPopover",
      backdropDismiss: true
    });

    let devItemName: any = {};
    popUp.onDidDismiss().then((details: OverlayEventDetail) => {
      console.log(details);
      this.globalObjects.popoverFlag = 'M';
      if (details.data) {
        let nextPageInfo: any = {};
        nextPageInfo.wscp = {};
        nextPageInfo.wscp.click_events_str = "get_object_config";
        nextPageInfo.wscp.object_code = details.data.object_code;
        nextPageInfo.object_mast = [];
        nextPageInfo.devPara = {};

        devItemName.d_apps_page_frame_seqid = apps_page_frame_seqid;
        devItemName.d_apps_page_no = this.page_no + 1;
        devItemName.d_item_type = details.data.item_type_code;
        devItemName.d_item_sub_type = details.data.item_sub_type_code;

        this.globalObjects.devItemName = devItemName;
        this.globalObjects.devItemEditFlag = false;
        this.openPage(nextPageInfo)
      }
    });
    return await popUp.present();

  }

  devEditItem(event) {
    this.dataService.getData("devItemMast").then((res: any) => {
      if (res.responseStatus == 'success') {
        let data = res.responseData;
        let objCode = "";
        for (let d of data) {
          if (d.item_type_code == event.item_type) {
            objCode = d.object_code
          }
        }
        event.wscp.object_code = objCode;

        if (objCode == "" || objCode == null || objCode == undefined) {
          this.globalObjects.devItemEditFlag = true;
          alert("Object Code Not Present");
        } else {
          this.openPage(event);
        }
      }
    })
  }

  downloadFromJava(data) {
    let format = data.click_event.split("~");
    let reqData: any = {};
    debugger;

    reqData = {
      "wslp": this.userDetails,
      "wscp": data.wscp,
      "wsdp": data.wsdp,
      "wsdpcl": this.wsdpcl,
      //  "extension":format[1]


    }
    this.dataService.postData("S2U", reqData).then((res: any) => {
      let data: any = res;
      if (data.responseStatus == "success") {

      }
    }).catch(error => { console.log(error) })


  }

  async popoveruser() {
    // this.router.navigate(["/usersetting",{userValueList: this.globalObjects.userValueListfromglobal}], );
    this.sqlLiteServ.deleteAllObject();
    let popUp = await this.modalCtrl.create({
      component: UsersettingPage,

      componentProps: {
        userValueList: this.globalObjects.userValueListfromglobal,
        id: "globalPopover",
        flag: true
      },
      backdropDismiss: this.backdismiss
    });
    popUp.present();
    popUp.onDidDismiss().then((details: OverlayEventDetail) => {
      console.log("page");
      // this.navCtrl.navigateRoot('super');
    })

  }

  ngAfterViewChecked() {
    if (this.globalObjects.fontype == "") { } else {
      // console.log("q")
      if (this.globalObjects.fontype) {

        this.globalObjects.changeFont(this.globalObjects.fontype);
      }
      this.cdr.detectChanges();
    }
    if (this.globalObjects.fontSize > 0.9) {

      this.globalObjects.increFontsize(this.globalObjects.fontSize);
      this.cdr.detectChanges();
    }
  }

  setSessionValue(event) {
    for (let evFrame of event.tabRows) {
      for (let evItems of evFrame.Level5) {
        if (evItems.session_hold_flag) {

          for (let frame of this.object_mast.Level2[this.page_no].Level3) {
            let heads = [];
            for (let itemdata of frame.Level4) {
              for (let item of itemdata.Level5) {
                if (item.item_default_value == evItems.item_name) {
                  item.value = evItems.value
                }
                if (event.itemFlagForVisible) {
                  for (let x of event.itemFlagForVisible) {
                    if (item.item_name == x.key) {
                      item.item_visible_flag = x.value;
                    }
                  }
                  if (frame.tHead) {
                    if (item.item_visible_flag == 'T') {
                      if (item.item_type != "ADD_ROW_BT" && item.item_type != "DELETE_ROW_BT") {

                        heads.push(item.prompt_name);
                      }
                    }
                  }
                }
              }
            }
            if (frame.tHead && heads.length > 0) {
              frame.tHead = heads;
            }
          }

          for (let frame of this.object_mast.Level2[this.page_no].Level3) {
            let heads = [];
            if (frame.tableRows) {
              for (let tabledata of frame.tableRows) {
                for (let rows of tabledata) {
                  for (let items of rows.Level5) {
                    if (items.item_default_value == evItems.item_name) {
                      items.value = evItems.value;
                      console.log(items);
                    }
                    if (event.itemFlagForVisible) {
                      for (let x of event.itemFlagForVisible) {
                        if (items.item_name == x.key) {
                          items.item_visible_flag = x.value;
                        }
                      }
                      if (frame.tHead) {
                        if (items.item_visible_flag == 'T') {
                          if (items.item_type != "ADD_ROW_BT" && items.item_type != "DELETE_ROW_BT") {
                            heads.push(items.prompt_name);
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



  openPop(comProps) {
    setTimeout(async () => {


      let event = this.globalObjects.mouseEvent;
      let popUp = await this.popOverCtrl.create({
        component: ParentMenuPage,
        componentProps: { childItems: comProps },

        event: event,
        backdropDismiss: true
      });

      popUp.onDidDismiss().then(res => {
        console.log(res)
        if (res.role == 'openTab') {
          this.itemClicked(res.data);
        }
        if (res.role == 'openNewTab') {
          localStorage.setItem("openObjectNewTab", res.data);
          window.open(window.location.href.split('/super')[0], "_blank");
        }
      });


      // if((this.globalObjects.screenheight - 200) < this.globalObjects.top){

      //   popUp.style.top = this.globalObjects.top-250 + "px";
      //   popUp.style.left = this.globalObjects.left + "px";
      // }
      return await popUp.present();
    }, 5);
  }

  func2() {
    alert("hello")
  }

  // async openCamera(){
  //    let modal =  await this.modalCtrl.create({
  //     component: CustomCameraPage,
  //     cssClass: 'transparent-modal-camera'
  //     // componentProps: componentProps,
  //     // id: JSON.stringify(componentProps.wscp.apps_item_seqid)
  //   });
  //   modal.present();
  // }

  fullScreen(event) {

    let elem = document.documentElement;
    if (event == 'full') {
      let methodToBeInvoked = elem.requestFullscreen ||
        elem['mozRequestFullscreen']
        ||
        elem['msRequestFullscreen'];
      if (methodToBeInvoked) methodToBeInvoked.call(elem);
    }
    if (event == 'in') {
      document.exitFullscreen();
    }

  }

  setLovVal() {
    this.popOverCtrl.dismiss(this.globalObjects.lovObjData);
  }

  openDevQueryParamObj() {

    let obj = {
      aliases: null,
      apps_frame_seqno: null,
      apps_icon_name: "COMPANYSTOCK",
      apps_item_seqid: "WMGH0008-I-3333",
      apps_page_frame_seqid: "WMGH0008-F-6",
      apps_page_no: "1",
      callingObjectArr: [],
      calling_frame_seqid_str: null,
      calling_object_code: "WMGT0029",
      calling_pageno: null,
      calling_parameter_str: null,
      click_events_str: "get_object_config",
      column_width: null,
      css_class: null,
      data_required_flag: "F",
      datatype: "VARCHAR2",
      db_table_name: null,
      dependent_column_sql: null,
      dependent_column_str: null,
      design_control_type: null,
      design_control_type_auto_card: null,
      display_setting_str: null,
      display_setting_str_auto_card: null,
      flag: "P",
      flag_auto_card: null,
      format_mask: null,
      formula_str: null,
      from_value: null,
      group_no_str: null,
      indexcount: 0,
      input_pattern: null,
      itemIndex: 0,
      item_db_name: null,
      item_default_value: null,
      item_enable_flag: "T",
      item_filter_flag: null,
      item_name: "CHAITENYA",
      item_position_divider: null,
      item_seqno: "12",
      item_size: null,
      item_sub_type: null,
      item_sub_type_auto_card: null,
      item_sub_type_child: null,
      item_type: "TABV2",
      item_type_auto_card: null,
      item_visible_flag: "T",
      lov_code: null,
      lov_return_column_str: null,
      mirror_item_seqid: null,
      object_code: "WMGH0008",
      on_blur: null,
      orignal_apps_item_seqid: "WMGH0008-I-3333",
      orignal_apps_page_frame_seqid: "WMGH0008-F-6",
      orignal_object_code: "WMGH0008",
      parent_item_seqid: null,
      popup_parent_item_seqid: null,
      position: null,
      post_text_validate_plsql: null,
      prompt_name: "Chaitenya",
      sessionObj: undefined,
      session_hold_flag: null,
      summary_flag: null,
      to_value: null,
      tool_tip: null,
      wsdp: []
    }

    this.itemClicked(obj);
  }


  deleteLov(i) {
    this.globalObjects.lovObjData.splice(i, 1);
  }

  // ionViewDidEnter(){
  //     alert();
  //   }


  generatAllFrameJson(data) {

    let maindata = [];
    let frameData = this.groupBy(data, function (item) {
      let str = "item.frame_name";
      let arrStr = eval(str)
      return arrStr;
    });

    for (let p of frameData) {
      let fData = [];
      let paraData = this.groupBy(p.items, function (item) {
        let str = "item.para_type";
        let arrStr = eval(str)
        return arrStr;
      });

      for (let f of paraData) {
        let itemData = this.groupBy(f.items, function (item) {
          let str = "item.row_slno";
          let arrStr = eval(str)
          return arrStr;
        });
        let obj = {
          paraType: f.key,
          frameData: itemData
        }
        fData.push(obj);
      }

      let obj = {
        frame_name: p.key,
        paraData: fData
      }
      maindata.push(obj)
    }
    this.globalObjects.allFrameJsonData = maindata;
    let event: any = {};
    event.wscp = this.wscp;
    event.wsdp = this.wsdp;

    let refreshFrame = []

    for (let m of maindata) {
      if (m.frame_name.indexOf("PARA") > -1) {
        for (let f of m.paraData) {
          for (let itms of f.frameData) {
            for (let it of itms.items) {
              let itemName = ":" + it.frame_name + "." + it.item_name;
              let value = it.para_value;

              this.set_item_value(itemName, 0, value);
            }
          }
        }
      } else {
        let obj = {
          key: m.frame_name,
          val: 'T'
        }
        refreshFrame.push(obj);
      }
    }

    event.refreshFrame = refreshFrame;

    for (let r of refreshFrame) {
      let name = "refreshFrame" + r.key.replace(/-/g, '_') + this.globalObjects.refreshId;
      this.events.publish(name, event);
    }

  }

  groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      let obj = {
        key: JSON.parse(group),
        items: groups[group]
      }
      return obj;
    })
  }

  callingParaFunc(event) {
    this.wscp.calling_parameter_str = event.calling_parameter_str;

    //  this.globalobject.callingPara = this.item.calling_parameter_str.split('~');
    let callingStr: any = [];
    if (event.calling_parameter_str.indexOf(";") > -1) {
      // New calling_parameter_str imp START
      let locCallingStr = event.calling_parameter_str.split(';');
      if (locCallingStr.length > 0) {
        locCallingStr[locCallingStr.length - 1] == "" ? locCallingStr.pop() : "";
      }

      if (event.calling_object_code) {

        let userDetails = this.globalObjects.getLocallData("userDetails");
        let str = "";
        for (let usr in userDetails) {
          if (usr.toLowerCase().indexOf("g_") > -1) {
            str = str + "app_add_para(\"" + usr.toLowerCase().replace("g_", "p_") + "\",\"" + userDetails[usr] + "\");";
          }
        }
        console.log(str);

        let glob = this.globalObjects.callingParameter.find(x => x.obj_code == this.clickEvent.calling_object_code);

        if (glob) {
          glob.str = glob.str + str;
        } else {

          let obj = {
            obj_code: this.clickEvent.calling_object_code,
            str: str
          }
          this.globalObjects.callingParameter.push(obj);
        }
      }

      for (let c of locCallingStr) {
        // if (c.indexOf("app_add_para(") > -1) {
        //   let values = c.split("(")[1];
        //   let whereValArr = values.split(",");
        //   let val = whereValArr[1].split(")")[0];
        //   let value;
        //   if (val.indexOf("::") > -1) {
        //     let itmname = val.split("::");
        //     for (let frame of this.object_mast.Level2[this.page_no].Level3) {
        //       let frameAlis;
        //       if (itmname[1].indexOf(".") > -1) {
        //         frameAlis = itmname[1].split(".")[0];
        //         itmname[1] = itmname[1].split(".")[1];
        //       }
        //       if (frameAlis && frameAlis == frame.frame_alias) {
        //         if (frame.tableRows) {
        //           for (let itmGrp of frame.tableRows[0]) {
        //             for (let item of itmGrp.Level5) {
        //               if (itmname[1] == undefined || itmname[1] == null) itmname[1] = "";
        //               if (itmname[1].toLowerCase() == item.item_name.toLowerCase()) {
        //                 itmname[1] = item.value;

        //                 value = itmname.join('');
        //                 let str = whereValArr[0].replace(":", "") + "=" + value;
        //                 callingStr.push(str);
        //                 //callingStr.splice(i, 1);
        //                 console.log(callingStr);
        //               }
        //             }
        //           }
        //         }
        //       } else {
        //         for (let page of this.object_mast.Level2) {
        //           for (let frame1 of page.Level3) {
        //             if (frame1.tableRows) {
        //               for (let itmGrp of frame1.tableRows[0]) {
        //                 for (let item of itmGrp.Level5) {
        //                   if (itmname[1] == undefined || itmname[1] == null) itmname[1] = "";
        //                   if (itmname[1].toLowerCase() == item.item_name.toLowerCase()) {
        //                     itmname[1] = item.value;

        //                     value = itmname.join('');
        //                     let str = whereValArr[0].replace(":", "") + "=" + value;
        //                     callingStr.push(str);
        //                     //callingStr.splice(i, 1);
        //                     console.log(callingStr);
        //                   }
        //                 }
        //               }
        //             }
        //           }
        //         }
        //       }
        //     }
        //   } else {
        //     value = val;
        //     let str = whereValArr[0].replace(":", "") + "=" + value;
        //     callingStr.push(str);
        //     //callingStr.splice(i, 1);
        //     console.log(callingStr);
        //   }

        if (c.toLowerCase().indexOf("app_add_para(") > -1) {
          if (c.toLowerCase().indexOf("app_add_para(") > -1) {
            let values = c.split("(")[1];
            let valArr = values.split(":=");
            let getValue;
            let func = "this." + c;
            let cArr = func.split(",");

            if (cArr[1].indexOf("::") > -1) {
              let strArr = cArr[1].split("::");
              if (strArr[0]) {


                // if(cArr[1].split("::")[0] == "\""){
                //   if(cArr[1].split("::")[1].indexOf(" ") > -1){
                //     func = cArr[0] + "," + strArr.join("::") ;
                //   }else{
                //     let a = cArr[1].split(")");
                //     let b = a[0].split("\"");

                //     b[0] = "\"'"
                //     b[2] = "'\")";
                //     cArr[1] = b.join("");
                //     func = cArr.join(",");
                //   }

                // }else{

                //   func = cArr[0] + "," + strArr.join("::") ;
                // }
              } else {
                cArr[1] = "'" + cArr[1].replace(")", "')");
                func = cArr[0] + "," + cArr[1];
              }
            }
            // if(((cArr[1].indexOf("\"") > -1) || (cArr[1].indexOf("'") > -1)) && cArr[1].indexOf(":") > -1){
            //   cArr[1] = cArr[1].replace("\"","\"'").replace("\")","'\")");
            //   func = cArr[0] + "," + cArr[1];
            // }else{
            //   if(cArr[1].indexOf(":") > -1){
            //     cArr[1] = "'" + cArr[1].replace(")","')");
            //     func = cArr[0] + "," + cArr[1];
            //   }
            // }
            eval(func);

          }
        } else if (c.indexOf("app_button_click") > -1) {
          let fucVal = c.substring(c.indexOf('(') + 1, c.indexOf(')'));
          if (this.globalObjects.autoClickItem.length > 0) {
            if (this.globalObjects.autoClickItem.indexOf(fucVal) == -1) {
              this.globalObjects.autoClickItem.push(fucVal);
            }
          } else {
            this.globalObjects.autoClickItem.push(fucVal);
          }
        } else if (c.toLowerCase().indexOf("app_add_paras") > -1) {
          let values = c.split("(")[1];
          let valArr = values.split(":=");
          let getValues = this.lhs_lib.get_row_values(valArr[1], event.itemIndex);

          if (event.calling_object_code || event.apps_page_no != getValues.pageNo) {
            let str = valArr[0].split("[")[1].replace(")", "").replace("]", "");
            let setItemsArr
            if (str && str.indexOf(" ") > -1) {
              setItemsArr = str.replace(" ", "").split(",")
            } else {
              setItemsArr = str.split(",")
            }
            let i = 0;
            for (let item of setItemsArr) {
              let str = item + ":=" + getValues.rowData[i];
              callingStr.push(str);
              i++
            }
          } else {
            this.wscp.apps_item_seqid = event.apps_item_seqid;
            this.lhs_lib.set_row_values(valArr[0], getValues, 0);
          }

          console.log(callingStr);
        }


      }

      // for (let frame of this.object_mast.Level2[this.page_no].Level3) {
      //   if (event.indexcount && frame.tableRows && frame.tableRows.length > event.indexcount) {
      //     for (let itmGrp of frame.tableRows[event.indexcount]) {
      //       for (let item of itmGrp.Level5) {
      //         let i = 0;
      //         for (let x of callingStr) {
      //           let fucVal = x.substring(x.indexOf('(') + 1, x.indexOf(')'));
      //           let itemNameArr = fucVal.split(",");

      //           i++;
      //         }
      //       }
      //     }
      //   } else {
      //     if (frame.tableRows) {
      //       for (let rows of frame.tableRows) {
      //         for (let itmGrp of rows) {
      //           for (let item of itmGrp.Level5) {

      //             let i = 0;
      //             for (let x of callingStr) {
      //               let fucVal = x.substring(x.indexOf('(') + 1, x.indexOf(')'));
      //               let itemNameArr = fucVal.split(",");

      //               i++;
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
      // New calling_parameter_str imp END
    }
    else {

      let str = event.calling_parameter_str.replace(/=/g, ":=");
      callingStr = str.split('~');

      for (let frame of this.object_mast.Level2[this.page_no].Level3) {
        if (event.indexcount && frame.tableRows && frame.tableRows.length > event.indexcount) {
          for (let itmGrp of frame.tableRows[event.indexcount]) {
            if(itmGrp.Level5){
            for (let item of itmGrp.Level5) {
              let i = 0;
              for (let x of callingStr) {
                if (x.indexOf(":=") > -1) {
                  let itmName = x.split(':=');
                  if (itmName[1] == item.item_name) {
                    let str = "";
                    if (item.value) {
                      itmName[1] = item.value;
                      str = itmName[0] + ':=' + item.value;
                    } else {
                      itmName[1] = "";
                      str = itmName[0] + ':=' + "";
                    }
                    callingStr.push(str);
                    callingStr.splice(i, 1);
                    console.log(callingStr);
                  }
                }
                i++;
              }
            }
          } else {
            if (itmGrp) {
              for (let item of itmGrp) {
                let i = 0;
              for (let x of callingStr) {
                let i = 0;
                for (let x of callingStr) {
                  if (x.indexOf(":=") > -1) {
                    let itmName = x.split(':=');
                    if (itmName[1] == item.item_name) {
                      let str = "";
                      if (item.value) {
                        itmName[1] = item.value;
                        str = itmName[0] + ':=' + item.value;
                      } else {
                        itmName[1] = "";
                        str = itmName[0] + ':=' + "";
                      }
                      callingStr.push(str);
                      callingStr.splice(i, 1);
                      console.log(callingStr);
                    }
                  }
                  i++;
                }
              }
              }
            }
          }
          }
        } else {
          if (frame.tableRows) {
            for (let rows of frame.tableRows) {
              for (let itmGrp of rows) {
                if(itmGrp.Level5){
                for (let item of itmGrp.Level5) {

                  let i = 0;
                  for (let x of callingStr) {
                    if (x.indexOf(":=") > -1) {
                      let itmName = x.split(':=');
                      if (itmName[1] == item.item_name) {
                        let str = "";
                        if (item.value) {
                          itmName[1] = item.value;
                          str = itmName[0] + ':=' + item.value;
                        } else {
                          itmName[1] = "";
                          str = itmName[0] + ':=' + "";
                        }
                        callingStr.push(str);
                        callingStr.splice(i, 1);
                        console.log(callingStr);
                      }
                    }
                    i++;
                  }
                }
              } else {
                if (itmGrp) {
                  for (let item of itmGrp) {
                    let i = 0;
                  for (let x of callingStr) {
                    if (x.indexOf(":=") > -1) {
                      let itmName = x.split(':=');
                      if (itmName[1] == item.item_name) {
                        let str = "";
                        if (item.value) {
                          itmName[1] = item.value;
                          str = itmName[0] + ':=' + item.value;
                        } else {
                          itmName[1] = "";
                          str = itmName[0] + ':=' + "";
                        }
                        callingStr.push(str);
                        callingStr.splice(i, 1);
                        console.log(callingStr);
                      }
                    }
                    i++;
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
    let obj = {
      itmData: callingStr,
      objectCode: event.calling_object_code,
      parentCode: event.apps_page_frame_seqid.split("-")[0],
      itemCode: event.apps_item_seqid
    }

    if (callingStr.length > 0) {
      if (this.globalObjects.callingPara.length > 0) {
        let glob = this.globalObjects.callingPara.find(x => x.objectCode == event.calling_object_code && x.itemCode == event.apps_item_seqid);

        if (glob) {
          for (let i of callingStr) {
            let flag = true;
            let index = 0;
            for (let c of glob.itmData) {
              if (i.split(":=")[0] == c.split(":=")[0]) {
                flag = false;
                glob.itmData[index] = i;
              }
              index++;
            }
            if (flag) {
              glob.itmData.push(i);
            }
          }

        } else {
          this.globalObjects.callingPara.push(obj);
        }
      } else {
        this.globalObjects.callingPara.push(obj);
      }
    }
  }

  get_item_value(name, rowIndex) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];

      if (name.indexOf("'") > -1) {
        itemName = name.split(".")[1].split("'")[0];
      } else {
        itemName = name.split(".")[1];
      }

    } else {
      if (name.indexOf("'") > -1) {
        itemName = name.split("'")[0];
      } else {
        itemName = name
      }
    }

    if (rowIndex) { } else { rowIndex = 0; }

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName) : true) || (frameName ? (frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase() : true)) {
          if (frame.tableRows && frame.tableRows[rowIndex]) {
            for (let itemGroup of frame.tableRows[rowIndex]) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toUpperCase() == item.item_name.toUpperCase())))) {
                    let value;
                    if (item.datatype) {
                      value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                      value = value ? value.toString().replace(/,/g, "") : "";
                    } else {
                      value = item.value
                    }


                    if (name.indexOf("'") > -1) {
                      return value + "'";
                    } else {
                      return value;
                    }

                  }
                }
              }
              else {
                if (itemGroup) {
                  for (let item of itemGroup) {
                    if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                      let value;
                      if (item.datatype) {
                        value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                        value = value ? value.toString().replace(/,/g, "") : "";
                      } else {
                        value = item.value
                      }
                      if (name.indexOf("'") > -1) {
                        return value + "'";
                      } else {
                        return value;
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

  set_item_value(name, rowIndex, value) {
    let frameName = '';
    let itemName;

    let addItem = true;
    if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (rowIndex) { } else { rowIndex = 0; }

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName) : true) || (frameName ? (frame.frame_alias ? frame.frame_alias.toLowerCase() : "") == frameName.toLowerCase() : true)) {
          // if ((frame.apps_page_frame_seqid == frameName) || ((frame.frame_alias ? frame.frame_alias.toLowerCase() : '') == frameName)) {

          if (frame.tableRows && frame.tableRows[rowIndex]) {
            for (let itemGroup of frame.tableRows[rowIndex]) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                    if (frameName) {
                      return item.value = value
                    } else {
                      item.value = value
                    }
                    addItem = false;
                  }
                }
              } else {
                if (itemGroup) {
                  for (let item of itemGroup) {
                    if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                      if (frameName) {
                        return item.value = value
                      } else {
                        item.value = value
                      }
                      addItem = false;
                    }
                  }
                }
              }
            }
          } else {

            let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
            for (let itemGroup of frameLevel4) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                    item.value = value
                    addItem = false;
                  }
                }
              } else {
                if (itemGroup) {
                  for (let item of itemGroup) {
                    if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                      item.value = value;
                      addItem = false;
                    }
                  }
                }
              }
            }

            if (frame.tableRows && frame.tableRows.length > 0) {
              frame.tableRows.push(frameLevel4);
            } else {
              frame.tableRows = [];
              frame.tableRows[0] = frameLevel4;
            }
          }

        }

      }
    }

    // if (this.clickEvent) {
    //   let callingStr = [];
    //   callingStr[0] = itemName + ":=" + value;
    //   let obj = {
    //     frameName: frameName,
    //     itmData: callingStr,
    //     objectCode: this.clickEvent.calling_object_code,
    //     itemCode: this.clickEvent.apps_item_seqid,
    //     rowIndex: rowIndex
    //   }

    //   if (callingStr.length > 0) {
    //     if (this.globalObjects.callingPara.length > 0) {
    //       let glob = this.globalObjects.callingPara.find(x => x.objectCode == obj.objectCode && x.itemCode == obj.itemCode);
    //       if (glob) {

    //         for (let c of callingStr) {
    //           let flag = true;
    //           for (let g of glob.itmData) {
    //             if (c == g) {
    //               flag = false
    //             }
    //           }
    //           if (flag) {
    //             glob.itmData.push(c);
    //           }
    //         }

    //         console.log(glob);
    //       } else {
    //         this.globalObjects.callingPara.push(obj);
    //       }
    //     } else {
    //       this.globalObjects.callingPara.push(obj);
    //     }
    //   }
    // }

    if (addItem) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frame.apps_page_frame_seqid && frame.apps_page_frame_seqid.indexOf("PARA") > -1) && (itemName.toUpperCase().indexOf("P_") > -1)) {

            if (frame.Level4 && frame.Level4.length > 0) {
              let itemGrp = JSON.parse(JSON.stringify(frame.Level4[0]));
              for (let item of itemGrp.Level5) {
                item.item_default_value = "";
                item.item_name = itemName;
                item.prompt_name = itemName;
                item.value = value;
              }

              if (frame.tableRows && frame.tableRows.length > 0) {
                frame.tableRows[0].push(itemGrp);
              } else {
                frame.tableRows[0][0] = itemGrp;
              }
            }
          }
        }
      }
    }

  }
  setGlobal(name, value, rowIndex) {

    let frameName = '';
    let itemName;

    if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.clickEvent) {
      let callingStr = [];
      callingStr[0] = itemName + ":=" + value;
      let obj = {
        frameName: frameName,
        itmData: callingStr,
        objectCode: this.clickEvent.calling_object_code,
        itemCode: this.clickEvent.apps_item_seqid,
        rowIndex: rowIndex
      }

      if (callingStr.length > 0) {
        if (this.globalObjects.callingPara.length > 0) {
          let glob = this.globalObjects.callingPara.find(x => x.objectCode == obj.objectCode && x.itemCode == obj.itemCode);
          if (glob) {

            for (let c of callingStr) {
              let flag = true;
              for (let g of glob.itmData) {
                if (c == g) {
                  flag = false
                }
              }
              if (flag) {
                glob.itmData.push(c);
              }
            }

            console.log(glob);
          } else {
            this.globalObjects.callingPara.push(obj);
          }
        } else {
          this.globalObjects.callingPara.push(obj);
        }
      }

    }
  }

  // getRowValues(name, rowIndex) {
  //   let frameName;

  //   if (name.indexOf(".") > -1) {
  //     rowIndex = parseInt(name.split(".")[1]) - 1;
  //   }

  //   if (name.indexOf("::") > -1) {
  //     name = name.split("::")[1];
  //   }

  //   frameName = name.split("[")[0];
  //   let itemName = name.split("[")[1].replace("]", "");
  //   let itemNames = itemName.replace(")", "");
  //   let itemArr = itemNames.split(",");

  //   let rowsArr = [];
  //   for (let object of this.object_mast.Level2) {
  //     for (let frame of object.Level3) {
  //       if ((frameName ? (frame.apps_page_frame_seqid == frameName) : true) || (frame.frame_alias == frameName)) {


  //         if (frame.tableRows) {
  //           for (let itemName of itemArr) {
  //             for (let itemGroup of frame.tableRows[rowIndex]) {

  //               if (itemGroup.Level5) {
  //                 for (let item of itemGroup.Level5) {
  //                   if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                     rowsArr.push(item.value);
  //                   }
  //                 }

  //               } else {
  //                 if (itemGroup) {
  //                   for (let item of itemGroup) {
  //                     if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
  //                       rowsArr.push(item.value);
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //         let obj = {
  //           pageNo: frame.apps_page_no,
  //           rowData: rowsArr
  //         }
  //         return obj;
  //       }
  //     }
  //   }

  // }

  // setRowsValues(name, valuesarr, rowIndex) {
  //   let frameName;
  //   if (name.indexOf(".") > -1) {
  //     rowIndex = parseInt(name.split(".")[1]) - 1;
  //     name = name.split(".")[0];
  //   }
  //   if (name.indexOf(":") > -1) {
  //     name = name.split(":")[1];
  //   }

  //   frameName = name.split("[")[0];
  //   let itemNameStr = name.split("[")[1];
  //   let itemNames = itemNameStr.split("]")[0];
  //   let itemArr = itemNames.split(",");


  //   for (let object of this.object_mast.Level2) {
  //     for (let frame of object.Level3) {
  //       if ((frame.apps_page_frame_seqid == frameName) || ((frame.frame_alias ? frame.frame_alias.toLowerCase() : '') == frameName)) {
  //         let i = 0;

  //         if (valuesarr.pageNo < frame.apps_page_no) {

  //           let callingStr = [];

  //           let str = name.split("[")[1].replace(")", "").replace("]", "");
  //           let setItemsArr
  //           if (str && str.indexOf(" ") > -1) {
  //             setItemsArr = str.replace(" ", "").split(",")
  //           } else {
  //             setItemsArr = str.split(",")
  //           }
  //           let i = 0;
  //           for (let item of setItemsArr) {
  //             if (valuesarr.rowData[i]) {
  //               let str = item + ":=" + valuesarr.rowData[i];
  //               callingStr.push(str);
  //             }
  //             i++
  //           }

  //           let obj = {
  //             frameName: frameName,
  //             itmData: callingStr,
  //             objectCode: frame.object_code,
  //             itemCode: this.clickEvent.apps_item_seqid,
  //             rowIndex: rowIndex
  //           }

  //           if (callingStr.length > 0) {
  //             if (this.globalObjects.callingPara.length > 0) {
  //               let glob = this.globalObjects.callingPara.find(x => x.objectCode == obj.objectCode && x.itemCode == obj.itemCode);
  //               if (glob) {
  //                 glob = obj
  //               } else {
  //                 this.globalObjects.callingPara.push(obj);
  //               }
  //             } else {
  //               this.globalObjects.callingPara.push(obj);
  //             }
  //           }
  //         } else {
  //           if (frame.tableRows && frame.tableRows[rowIndex]) {
  //             for (let itemName of itemArr) {
  //               for (let itemGroup of frame.tableRows[rowIndex]) {
  //                 if (itemGroup.Level5) {
  //                   for (let item of itemGroup.Level5) {
  //                     if (((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                       item.value = valuesarr.rowData[i]
  //                     }
  //                   }
  //                 } else {
  //                   if (itemGroup) {
  //                     for (let item of itemGroup) {
  //                       if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
  //                         item.value = valuesarr.rowData[i];
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //               i++
  //             }
  //           } else {
  //             let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
  //             for (let itemName of itemArr) {
  //               for (let itemGroup of frameLevel4) {
  //                 if (itemGroup.Level5) {
  //                   for (let item of itemGroup.Level5) {
  //                     if (((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                       item.value = valuesarr.rowData[i]
  //                     }
  //                   }
  //                 } else {
  //                   if (itemGroup) {
  //                     for (let item of itemGroup) {
  //                       if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
  //                         item.value = valuesarr.rowData[i];
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //               i++
  //             }

  //             if (frame.tableRows) {
  //               frame.tableRows.push(frameLevel4);
  //             } else {
  //               frame.tableRows = [];
  //               frame.tableRows.push(frameLevel4);
  //             }
  //           }
  //         }
  //         return;
  //       }
  //     }
  //   }
  // }



  setLovData(data) {

    let lovCloseFlag: boolean = true;

    if (this.globalObjects.lovType && this.globalObjects.lovType == 'M') {
      lovCloseFlag = false;
    }

    if (lovCloseFlag) {
      this.globalObjects.lovObjData = [];
      let obj = {
        values: data[1].value,
        codeOfValues: data[0].value
      }
      let finObj = {
        value: obj,
        apps_item_seqid: this.wscpNav.apps_item_seqid
      }
      let glob = this.globalObjects.lovObjData.find(x => x.apps_item_seqid == this.wscpNav.apps_item_seqid && x.value.codeOfValues == data[0].value);

      if (glob) { } else {
        this.globalObjects.lovObjData.push(finObj);
      }
      this.popOverCtrl.dismiss(data);
    } else {
      let obj = {
        values: data[1].value,
        codeOfValues: data[0].value
      }
      let finObj = {
        value: obj,
        apps_item_seqid: this.wscpNav.apps_item_seqid
      }
      let glob = this.globalObjects.lovObjData.find(x => x.apps_item_seqid == this.wscpNav.apps_item_seqid && x.value.codeOfValues == data[0].value);
      // let glob = this.globalObjects.lovObjData.find(x => x.value.codeOfValues == data[0].value);

      if (glob) { } else {
        this.globalObjects.lovObjData.push(finObj);
      }
    }
  }

  app_add_para(to, from) {




    if (this.clickEvent && this.clickEvent.calling_object_code) {
      let rowindex = this.clickEvent ? this.clickEvent.itemIndex : 0;
      let str = ""
      let value;
      if (from.indexOf("::") > -1) {

        let fromArr = from.split("::");

        if ((fromArr[0] && ((fromArr[0] != "'") && (fromArr[0] != "\"'"))) || fromArr.length > 2) {

          for (let i = 0; i < fromArr.length; i++) {
            let val1 = "";
            if (i != 0) {
              if (fromArr[i].indexOf(" ") > -1) {
                let val = fromArr[i].split(" ");
                val1 = this.get_item_value(val[0], rowindex);

                // val[0] = val1 ? "'"+ val1 +"'": val[0];
                val[0] = (val1 == undefined) ? val[0] : "'" + val1 + "'";

                fromArr[i] = val.join(" ");
                // val1 ? fromArr[i] =  val[0] + "'"+ val1 +"'" + val[1] : fromArr[i] = "::"+ fromArr[i] + val[1];
              } else {
                val1 = this.get_item_value(fromArr[i], rowindex);
                // val1 ? fromArr[i] = "'" +val1 + "'" : fromArr[i] = "::"+ fromArr[i];
                (val1 == undefined) ? fromArr[i] = "::" + fromArr[i] : fromArr[i] = "'" + val1 + "'";
              }
            }
          }
        } else {
          let val1 = this.get_item_value(fromArr[1], rowindex);
          // val1 ? fromArr[i] = "'" +val1 + "'" : fromArr[i] = "::"+ fromArr[i];
          (val1 == undefined) ? fromArr[1] = "::" + fromArr[1] : fromArr[1] = val1;
        }


        console.log(this.clickEvent);
        value = fromArr.join("");
        // value = this.get_item_value(from, rowindex);
        value = (value == undefined) ? from : value;//? value.replace(/'/g, "") : from;
        if (value) {
          str = "app_add_para(\"" + to + "\",\"" + value + "\");";

        }
        // this.setGlobal(to, value, 0);
      } else {
        value = from;
        // value = value ? value.replace(/'/g, "") : from;
        str = "app_add_para(\"" + to + "\",\"" + value + "\");";
        // this.set_item_value(to, 0, value);
      }

      let glob = this.globalObjects.callingParameter.find(x => x.obj_code == this.clickEvent.calling_object_code);

      if (glob) {

        // let glbArr = glob.str.split(";");
        // let strArr = str.split(";");
        // let arr = []
        // for(let sr of strArr){
        //   let flg = true;
        //   for(let glr of glbArr){
        //     if(sr.split(",")[0] == glr.split(",")[0]){
        //       flg = false;
        //       glr = sr;
        //     }
        //   }

        //   if(flg){
        //     glbArr.push(sr);
        //   }
        // }

        // let s = glbArr.join(";");
        glob.str = glob.str + str;
      } else {

        let obj = {
          obj_code: this.clickEvent.calling_object_code,
          str: str
        }
        this.globalObjects.callingParameter.push(obj);
      }

    } else {
      let value = from;
      let rowindex = this.clickEvent ? this.clickEvent.itemIndex : 0;
      if (from.indexOf(":") > -1) {
        let fromArr = from.split(":");

        for (let i = 0; i < fromArr.length; i++) {
          let val1 = "";
          if (i != 0) {
            if (fromArr[i].indexOf(" ") > -1) {
              let val = fromArr[i].split(" ");
              val1 = this.get_item_value(val[0], rowindex);

              val[0] = val1 ? "'" + val1 + "'" : val[0];

              fromArr[i] = val.join(" ");
              // val1 ? fromArr[i] = val[0] + "'" + val1 + "'" + val[1] : fromArr[i] = ":" + fromArr[i] + val[1];
            } else {
              val1 = this.get_item_value(fromArr[i], rowindex);
              val1 ? fromArr[i] = "'" + val1 + "'" : fromArr[i] = ":" + fromArr[i];
            }
          }
        }


        value = fromArr.join("");
        // value = this.get_item_value(from, rowindex);
      }
      value = value ? value : from;

      this.set_item_value(to, 0, value);
    }
    // if (to.indexOf(":") > -1) {
    // }

  }


  setParaCall() {
    if (this.globalObjects.callingParameter.length > 0) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if (frame.apps_page_frame_seqid.indexOf("PARA") > -1) {
            for (let itemGroup of frame.tableRows[0]) {
              for (let item of itemGroup.Level5) {

                if (item.item_name == "p_calling_parameter_str") {
                  if (item.value && item.value.toLowerCase().indexOf("app_add_para(") > -1) {
                    let valArr = [];
                    if (item.value.indexOf(";") > -1) {
                      valArr = item.value.split(";")
                    } else {
                      valArr[0] = item.value
                    }

                    valArr.pop();


                    for (let v of valArr) {
                      let func = "this." + v;
                      eval(func);
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


  execute_js(value) {

    if (value.indexOf("get_item_value") > -1) {
      value = value.replaceAll("get_item_value", "this.get_item_value");
    }
    if (value.indexOf("set_item_value") > -1) {
      value = value.replaceAll("set_item_value", "this.set_item_value");
    }
    if (value.indexOf("set_row_values") > -1) {
      value = value.replaceAll("set_row_values", "this.lhs_lib.set_row_values");
    }
    if (value.indexOf("get_row_values") > -1) {
      value = value.replaceAll("get_row_values", "this.lhs_lib.get_row_values");
    }
    if (value.indexOf("get_item_config") > -1) {
      value = value.replaceAll("get_item_config", "this.lhs_lib.get_item_config");
    }
    if (value.indexOf("set_item_config") > -1) {
      value = value.replaceAll("set_item_config", "this.lhs_lib.set_item_config");
    }
    if (value.indexOf("set_rows_source_config") > -1) {
      value = value.replaceAll("set_rows_source_config", "this.lhs_lib.set_rows_source_config");
    }
    if (value.indexOf("get_frame_config") > -1) {
      value = value.replaceAll("get_frame_config", "this.lhs_lib.get_frame_config");
    }
    if (value.indexOf("set_frame_config") > -1) {
      value = value.replaceAll("set_frame_config", "this.lhs_lib.set_frame_config");
    }
    if (value.indexOf("get_page_config") > -1) {
      value = value.replaceAll("get_page_config", "this.lhs_lib.get_page_config");
    }
    if (value.indexOf("set_page_config") > -1) {
      value = value.replaceAll("set_page_config", "this.lhs_lib.set_page_config");
    }
    if (value.indexOf("sum") > -1) {
      value = value.replaceAll("sum", "this.lhs_lib.sum");
    }
    if (value.indexOf("count") > -1) {
      value = value.replaceAll("count", "this.lhs_lib.count");
    }
    if (value.indexOf("avg") > -1) {
      value = value.replaceAll("avg", "this.lhs_lib.avg");
    }
    if (value.indexOf("min") > -1) {
      value = value.replaceAll("min", "this.lhs_lib.min");
    }
    if (value.indexOf("max") > -1) {
      value = value.replaceAll("max", "this.lhs_lib.max");
    }
    if (value.indexOf("table_rows") > -1) {
      value = value.replaceAll("table_rows", "tableRows");
    }
    eval(value);


    // if(value.toLowerCase().indexOf('get_item_value(') > -1){
    //   value = value.replace('')
    // }
  }



  async refresh_cordinate() {
    let latitude: any;
    let longitude: any;
    let location: any;

    await this.globalObjects.getLocation().then((res: any) => {

      latitude = res.lat;
      longitude = res.lon;
      this.globalObjects.geoCoderLocation(latitude, longitude).then(res => {
        location = res;
      }, (error) => {
        // alert(JSON.stringify(error))
      });

      setTimeout(() => {

        for (let fromFrame of this.object_mast.Level2[this.page_no].Level3) {
          for (let fromFrameLevel4 of fromFrame.tableRows) {
            for (let fromItemGroup of fromFrameLevel4) {
              if (fromItemGroup.Level5) {
                for (let item of fromItemGroup.Level5) {
                  if (item.item_default_value == "LATITUDE") {
                    item.value = latitude;
                  }
                  if (item.item_default_value == "LONGITUDE") {
                    item.value = longitude;
                  }
                  if (item.item_default_value == "LOCATION") {
                    item.value = location;
                  }
                }
              }
            }
          }
        }
      }, 500);
    })
  }

  //   TestItem(){
  //     var appCache = window.applicationCache;

  // appCache.update(); // Attempt to update the user's cache.



  // if (appCache.status == window.applicationCache.UPDATEREADY) {
  //   appCache.swapCache();  // The fetch was successful, swap in the new cache.
  // }
  //   }
  openBrowser(event, type) {
    // if(event == 'I'){
    //   let options :InAppBrowserOptions= {
    //     "location": "no", 
    //     "toolbar": "no"
    //   };
    //   this.iab.create("https://b2bsangam.com/", type, options);
    // }else{
    //   window.open("https://b2bsangam.com/", type);
    // }

  }


  server_host(event, param) {
    event.item_enable_flag = 'F';
    var scopurl = this.globalObjects.getLocallData("scopeUrl");
    var protocol = scopurl.split("//")[0];
    var domain = scopurl.split("//")[1].split("/")[0];
    var url = protocol + "//" + domain + "/lhsws/openCommandLineWithCommand?command=" + eval(param);
    let data = fetch(encodeURI(url)).then(res => {
      event.item_enable_flag = 'T';
      console.log(data);
    });
    // setTimeout(()=>{
    //   event.item_enable_flag = 'T';
    //   new AbortController().abort();
    //   }, 2000)
  }



  encryptQS(str, key) {
    if (key == null || key.length <= 0) {
      return str

    } else {
      if (key.toString().length > 8)
        key = key.substring(0, 8);
      let prand:any = "";
      for (var i = 0; i < key.length; i++) {
        prand += key.charCodeAt(i).toString()
      }
      var sPos = Math.floor(prand.length / 5), preMult = prand.charAt(sPos) == '0' ? '1' : prand.charAt(sPos);
      preMult = preMult + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5);
      var mult = parseInt(preMult), incr = Math.ceil(key.length / 2), modu = Math.pow(2, 31) - 1;
      if (mult < 2) {
        return null
      }
      var salt:any = Math.round(Math.random() * 1000000000) % 100000000;
      prand += salt;
      while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10), 10)).toString()
      } 
      prand = (mult * prand + incr) % modu;
      let enc_chr:any = "";
      let enc_str:any = "";
      for (var i = 0; i < str.length; i++) {
        enc_chr = parseInt((str.charCodeAt(i) ^ Math.floor((prand / modu) * 255)).toString());
        if (enc_chr < 16) {
          enc_str += "0" + enc_chr.toString(16)
        }
        else
          enc_str += enc_chr.toString(16);
        prand = (mult * prand + incr) % modu
      }
      salt = salt.toString(16);
      while (salt.length < 8)
        salt = "0" + salt;
      enc_str += salt;

      return enc_str
    }
  }



  

}





