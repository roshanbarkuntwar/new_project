import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { ChangePasswordPage } from '../change-password/change-password.page';
import { SqlLightTranPage } from '../sql-light-tran/sql-light-tran.page';
import { OfflineEntryTabsPage } from '../offline-entry-tabs/offline-entry-tabs.page';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { TreeCallpagePage } from '../tree-callpage/tree-callpage.page';
import { ExecuteQueryPage } from '../execute-query/execute-query.page';
import { ImageIconMasterPage } from '../image-icon-master/image-icon-master.page';
import { Events } from 'src/app/demo-utils/event/events';

declare var google;
declare var OurCodeWorldpreventscreenshots;
@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  fontArray = ['Roboto (default)', 'Helvetica', 'Helvetica Monospaced', 'Arial', 'open sans', 'poppin', 'monospace', 'serif', 'cursive'];
  fontoption: boolean = false;
  toggleVibrate: boolean = false;
  toggleScreenshot: boolean = false;
  toggleSound: boolean = false;
  toggleNotification: boolean = false;
  toggleFab: boolean = false;
  toggleDevloperMode: boolean = false;
  loginExpiry: any;
  soundOption: boolean = false;
  fontOptions: boolean = false;
  kpiTextBand: boolean = false;
  inputField: boolean = false;
  menuTab: boolean = false;
  fontRange: number;
  volumeRange: number = 0.1;
  otherlist: boolean = false;
  toggleDragMode: boolean;
  executeQueryflag: boolean = true;
  imageIconFlag: boolean = true;

  audio: any = {
    toggelSound: true,
    id: 'assets/audio/click1.mp3',
    sound: 'assets/audio/click1.mp3',
    volume: 0.5
  };
  sound: any = 'assets/audio/click1.mp3';
  fontName: any = "select font";
  fontSize: any = "select font size";
  fontSizeArray = ['4', '6', '8 (default)', '10', '12', '14'];
  fontType: any;

  tabImgHeight: any;
  tabFontWeight: any;
  tabFontSize: any;
  tabPadding: any;
  tabStyle: any;
  kpiPadd:any;
  kpiHeadFont:any;
  kpiValueFont:any;
  kpiWeight:any;
  kpiHeadWeight:any;
  kpiValWeight:any;


  constructor(public events: Events, public platform: Platform, private nativeAudio: NativeAudio, public globalObjects: GlobalObjectsService,
    private navCtrl: NavController, public dataService: DataService, private cdr: ChangeDetectorRef, public modalController: ModalController, private sqlServ: SqlLiteService) {
    this.fontRange = globalObjects.fontSize;
    this.fontName = "select font";
    this.fontSize = "select font size";

  }
  googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
  }
  ngOnInit() {
    // this.events.subscribe('toggleVibrate', (res) => {
    //   this.toggleVibrate = res;
    // });
    // this.events.subscribe('toggleSound', (res) => {
    //   this.toggleSound = res;
    // });
    
    this.toggleDragMode = this.globalObjects.toggleDrag;
    this.toggleFab = this.globalObjects.toggleFab;
    this.toggleNotification = this.globalObjects.toggleNotification;
    this.toggleVibrate = this.globalObjects.toggleVibrate;
    this.toggleScreenshot = this.globalObjects.toggleScreenshot;
    this.toggleSound = this.globalObjects.toggleSound;
    this.audio = this.globalObjects.audio;
    this.sound = this.audio.sound;
    this.volumeRange = this.audio.volume;
    this.toggleDevloperMode = this.globalObjects.toggleDevloperMode;
    this.executeQueryflag = this.globalObjects.toggleDevloperMode;
    this.imageIconFlag = this.globalObjects.toggleDevloperMode;
    this.events.subscribe("toggleFab", res => {
      this.toggleFab = res;
    })

    this.events.subscribe("toggleNotification", res => {
      this.toggleNotification = res;
    })
    this.fontType = this.globalObjects.getLocallData('fonttype');

    if (this.fontType == 'var(--ion-font-family,inherit)') {
      this.fontType = 'Robot (default)';
      console.log("type>>>>>", this.fontType);
    } else if (!this.fontType) {
      console.log("type>>>>>", this.fontType);
      this.fontType = this.fontArray[0];

    }
    this.fontSize = this.globalObjects.getLocallData('fontSize');
    if (this.fontSize == '0.875') {
      this.fontSize = '8 (default)';
      console.log("size>>>>>", this.fontSize);
    } else if (!this.fontSize) {
      console.log("fontsize>>>>", this.fontSize)
      this.fontSize = '8 (default)'
    }
    /*  let x = setInterval(() => {
       let loginDate = this.globalObjects.getLocallData("loginDate");
       if (loginDate) {
         let loginDate1: any = new Date(loginDate).getTime();
         let countDownDate: any = new Date(loginDate1 + 1000  * 60  * 60  * 24  * 10);
         let now = new Date().getTime();
         let distance = countDownDate - now;
         let days = Math.floor(distance / (1000 * 60 * 60 * 24));
         let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
         let seconds = Math.floor((distance % (1000 * 60)) / 1000);
         this.loginExpiry = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
         if (distance < 0) {
           this.globalObjects.fabMannualMode = false;
           this.globalObjects.notiBellMannualMode = false;
           this.globalObjects.destroyLocalData("userDetails");
           this.globalObjects.destroyLocalData("apptype");
           this.globalObjects.destroyLocalData("scopeUrl");
           this.globalObjects.destroyLocalData("app-theme");
           this.globalObjects.destroyLocalData("locationStartTime");
           this.globalObjects.destroyLocalData("loginDate");
           this.globalObjects.displayCordovaToast("Session time expired !!");
           this.navCtrl.navigateRoot('appkey-validation');
 
           clearInterval(x);
         }
       }
     }, 1000); */
    // orignal_object_code ,
    // orignal_apps_page_frame_seqid ,
    // orignal_apps_item_seqid 
  }

  hideOtherlist() {
    if (this.otherlist) {
      this.otherlist = false;
    } else {
      this.otherlist = true;
    }
  }

  vibrateFunc(flag) {

    if (flag) {
      navigator.vibrate(500)
      this.globalObjects.toggleVibrate = true;
    } else {
      this.globalObjects.toggleVibrate = false;
    }
  }

  successCallback(result) {
    alert(JSON.stringify(result)); // true - enabled, false - disabled
  }
 
  errorCallback(error) {
    alert(JSON.stringify(error));
  }

  screenshotFunc(flag) {

    if (flag) {
      alert(flag+"2");
      //(<any>window).plugins.preventscreenshot.enable((a) => alert(JSON.stringify(a)), (b) => alert(JSON.stringify(b)));

      document.addEventListener("deviceready", function(){
        var successCallback = function(){
            alert("The screenshots are allowed now again.");
        };
    
        var errorCallback = function(err){
          alert("An error ocurred : " + err);
        };
    
        OurCodeWorldpreventscreenshots.enable(successCallback,errorCallback);
    }, false);

      this.globalObjects.toggleScreenshot = true;
    } else {
      alert(flag+"3");
      //(<any>window).plugins.preventscreenshot.disable((a) => alert(JSON.stringify(a)), (b) => alert(JSON.stringify(b)));

      document.addEventListener("deviceready", function(){
        var successCallback = function(){
            alert("The screenshots are not allowed now.");
        };
    
        var errorCallback = function(err){
            alert("An error ocurred : " + err);
        };
    
        OurCodeWorldpreventscreenshots.disable(successCallback,errorCallback);
    }, false);

      this.globalObjects.toggleScreenshot = false;
    }
  }

  dragToggle(ev) {
    if (ev) {
      this.globalObjects.toggleDrag = true;
    } else {
      this.globalObjects.toggleDrag = false;
    }
  }

  resetDrag() {
    this.globalObjects.destroyLocalData('dragabledata');
    this.globalObjects.toggleDrag = false;
    this.toggleDragMode = false
  }

  soundFunc(flag) {

    if (flag) {
      this.globalObjects.audio.toggelSound = flag;
      this.globalObjects.toggleSound = true;
    } else {
      this.globalObjects.toggleSound = false;
      this.nativeAudio.unload(this.globalObjects.audio.id).then(() => {
        this.globalObjects.audio = {
          toggelSound: false,
          id: 'assets/audio/click1.mp3',
          sound: 'assets/audio/click1.mp3',
          volume: 0.5
        };
        this.sound = 'assets/audio/click1.mp3';
        this.volumeRange = 0.5;


        this.nativeAudio.preloadComplex(this.sound, this.sound, this.volumeRange, 1, 1).then(() => {
          // alert('sound change');
        }, err => {
          // alert(JSON.stringify(err))

        })
      }, (err) => {
        // alert('unload : '+JSON.stringify(err));
      });

    }

  }


  volumeChange(range) {
    if (this.globalObjects.toggleSound) {
      this.volumeRange = range;
      this.globalObjects.audio.volume = range;
      this.nativeAudio.setVolumeForComplexAsset(this.sound, range).then((res) => {
        // alert('volume set');
        this.nativeAudio.play(this.sound).then(() => {

        }, (err) => {
          // alert(JSON.stringify(err));
        });
      })
      console.log('audio', this.globalObjects.audio)
    }
  }

  selectSound(sound) {
    if (this.globalObjects.toggleSound) {
      console.log('current id : ' + this.globalObjects.audio.id);
      this.nativeAudio.unload(this.globalObjects.audio.id).then(() => {

      }, (err) => {
        // alert('unload : '+JSON.stringify(err));
      });
      this.sound = sound;
      this.globalObjects.audio.id = sound;
      this.globalObjects.audio.sound = sound;

      this.nativeAudio.preloadComplex(sound, sound, this.volumeRange, 1, 1).then(() => {
        // alert('sound change');
        this.nativeAudio.play(sound).then(() => {

        }, (err) => {
          // alert(JSON.stringify(err));
        });

      }, (err) => {
        // alert('preloadComplex : '+JSON.stringify(err));
      });
      console.log('audio', this.globalObjects.audio)
    }
  }


  resetLocalDb() {
    this.sqlServ.deleteAllObject();
  }


  logout() {
    this.globalObjects.fabMannualMode = false;
    this.globalObjects.notiBellMannualMode = false;

    // this.router.navigate(['login']);
    // this.navCtrl.navigateRoot('login');
    this.events.publish("logOut");
    this.modalController.dismiss();
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

  fontZoom2(e) {

    console.log(e.detail.value);
    if (e.detail.value == "8 (default)") {
      e.detail.value = 0.875;
      this.globalObjects.setDataLocally("fontSize", 0.875);
      this.globalObjects.increFontsize(0.875);
    }
    else {

      this.globalObjects.fontSize = (e.detail.value) / 10;
      this.globalObjects.setDataLocally("fontSize", this.globalObjects.fontSize);
      this.globalObjects.increFontsize(this.globalObjects.fontSize);
    }
    console.log(this.globalObjects.fontSize)


    this.cdr.detectChanges();
    // this.modalController.dismiss();

  }
  resetFontandSize() {

    localStorage.removeItem("fontSize");
    localStorage.removeItem("fonttype");
    //  this.globalObjects.fontSize=0.875;
    //  this.globalObjects.fontype="var(--ion-font-family,inherit)";
    location.reload();
    this.modalController.dismiss();
  }
  selectFont(event) {
    console.log(event)
    if (event.detail.value == "Robot (default)") {
      event.detail.value = "var(--ion-font-family,inherit)";
    }
    this.globalObjects.fontype = event.detail.value;
    this.globalObjects.setDataLocally("fonttype", this.globalObjects.fontype);
    this.globalObjects.changeFont(event.detail.value);
    this.cdr.detectChanges();
    // this.modalController.dismiss();
  }

  resetFont() {
    this.fontRange = 0.9;
  }

  toggleDevloperModeFunc(toggleDevloperMode) {
    this.globalObjects.toggleDevloperMode = toggleDevloperMode;
    this.globalObjects.getLocalDBData = !toggleDevloperMode;
    this.executeQueryflag = toggleDevloperMode;
    this.imageIconFlag = toggleDevloperMode;
  }

  closePage() {
    this.modalController.dismiss();
  }

  async openChangePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordPage,
    });
    modal.onDidDismiss().then(() => {
      //this.modalController.dismiss();
    });
    return await modal.present();
  }
  async openSqLiteTran() {
    const modal = await this.modalController.create({
      component: SqlLightTranPage,
    });
    return await modal.present();
  }

  async openExecuteQuery() {
    const modal = await this.modalController.create({
      component: ExecuteQueryPage,
    });
    return await modal.present();
  }

  async openIconMaster() {
    const modal = await this.modalController.create({
      component: ImageIconMasterPage,
    });
    return await modal.present();
  }

  async openOfflineEntryTab() {
    const modal = await this.modalController.create({
      component: OfflineEntryTabsPage,
    });
    return await modal.present();
  }
  async opentree() {

    const modal = await this.modalController.create({
      component: TreeCallpagePage,
      componentProps: { paramValue: true },
    });
    modal.onDidDismiss().then(() => {
      //this.modalController.dismiss();
    });
    return await modal.present();
  }


  

  changeStyle(item) {
    if (item == 'TAB') {
      if (this.tabImgHeight) {
        let per = ((this.tabImgHeight / 100) * 40);
        let val = 40 + per;
        let str = `height:${val}px;width:${val}px;`;
        // if(this.tabImgHeight < 35){
        //   str = str + "padding:0px;";
        // }
        let tab: any = document.getElementsByClassName('thumbnail-container');
        if (tab) {
          for (let t of tab) {
            t.setAttribute('style', str);
          }
        }
      }
      if (this.tabFontSize || this.tabFontWeight) {
        let str = "";
        if (this.tabFontSize) {
          let per = ((this.tabFontSize / 100) * 14);
          let val = 14 + per;
          str = str + `font-size:${val}px;`
        } if (this.tabFontWeight) {
          let per = ((this.tabFontWeight / 100) * 500);
          let val = 500 + per;
          str = str + `font-weight:${val};`
        }
        let tab: any = document.getElementsByClassName('new-menu-list');
        if (tab) {
          for (let t of tab) {
            t.getElementsByTagName('h2')[0].setAttribute('style', str);
          }
        }
      }

      if (this.tabPadding) {
        let str = "";
        let tab: any = document.getElementsByClassName('new-menu-list');
        if (tab) {
          let per = ((this.tabPadding / 100) * 1);
          let val = 1 + per;
          str = str + `margin-bottom:${val}px;`
          for (let t of tab) {
            t.setAttribute('style', str);
          }
        }
      }

      if (this.tabStyle) {
        let tab:any = document.getElementsByClassName('new-menu-list');
        if(tab){
          for (let t of tab) {
            t.classList.add(this.tabStyle);
          }
        }
      }

    }

    if (item == 'KPI') {
      if (this.kpiPadd) {
        let per = ((this.kpiPadd / 100) * 5);
        let val = 5 + per;
        let str = `padding-top:${val}px;padding-bottom:${val}px;`;
        // if(this.tabImgHeight < 35){
        //   str = str + "padding:0px;";
        // }
        let tab: any = document.getElementsByClassName('inner-textband');
        if (tab) {
          for (let t of tab) {
            t.setAttribute('style', str);
          }
        }
      }

      if (this.kpiHeadFont || this.kpiHeadWeight) {
        let str = "";
        if (this.kpiHeadFont) {
          let per = ((this.kpiHeadFont / 100) * 20);
          let val = 20 + per;
          str = str + `font-size:${val}px;`
        }if (this.kpiHeadWeight) {
          let per = ((this.kpiHeadWeight / 100) * 400);
          let val = 400 + per;
          str = str + `font-weight:${val};`
        }
        let tab: any = document.getElementsByClassName('inner-textband');
        if (tab) {
          for (let t of tab) {
            t.getElementsByTagName('h4')[0].setAttribute('style', str);
          }
        }
      }

      if (this.kpiValueFont || this.kpiValWeight) {
        let str = "";
        if (this.kpiValueFont) {
          let per = ((this.kpiValueFont / 100) * 14);
          let val = 14 + per;
          str = str + `font-size:${val}px;`
        }if (this.kpiValWeight) {
          let per = ((this.kpiValWeight / 100) * 300);
          let val = 300 + per;
          str = str + `font-weight:${val};`
        }
        let tab: any = document.getElementsByClassName('inner-textband');
        if (tab) {
          for (let t of tab) {
            t.getElementsByTagName('h5')[0].setAttribute('style', str);
          }
        }
      }
    }
  }

  resetStyle() {
    location.reload();
  }

}
