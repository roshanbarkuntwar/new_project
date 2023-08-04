import { Injectable } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { PowerManagement } from '@ionic-native/power-management/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device/ngx';
import { DataService } from './data.service';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { GlobalObjectsService } from './global-objects.service';

import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from "@ionic-native/background-geolocation/ngx";
// import { Insomnia } from '@ionic-native/insomnia/ngx';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  public isTracking: boolean = false;
  public data: any = [];
  public dataTosend: any = [];
  public appVersion: any = "1.1:20200406";
  public activity = "Fore Ground";

  public timestamp: any = "";
  longitude: any;
  latitude: any;
  message: any;
  batteryLevel: any;


  interval: any;
  intervalTimeout: number = 60;
  count: number = 1;
  l_obj: any;
  onPauseSubscription: any;

  backgroundInterval: any;
  foregroundInterval: any;
  // userCode: string;
  userDetails: any;
  bgmode: boolean = false;

  constructor(public http: HttpClient,
    private backgroundGeolocation: BackgroundGeolocation,
    private backgroundMode: BackgroundMode,
    private batteryStatus: BatteryStatus,
    private device: Device, private toastCtrl: ToastController, private powerManagement: PowerManagement,
    public geoLocation: Geolocation, public platform: Platform,
    private dataService: DataService, private globalObjects: GlobalObjectsService) {
   
    // this.gpsEntry();
  }

  ngOnInit() {
    this.getLocation();
    this.batteryStatus.onChange().subscribe(status => {
      this.batteryLevel = status.level;
    });
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }
  startgpsEntry() {
    this.backgroundGeolocation.start();
  }
  endgpsEntry() {
    this.backgroundGeolocation.stop();
  }
  start(interval_time) {
    // alert(interval_time);
    // this.displayToast(interval_time + "in start")
    // this.dataService.getData('testTracking?state=start').then(res => { }).catch(e => { });

    this.globalObjects.setDataLocally("locationTrackingStarted", true);
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    let config = {
      silent: true
    };
    this.backgroundMode.configure(config);


    // this.data.push({
    //   date: new Date().getTime(),
    //   "activity": this.activity,
    //   timestamp: this.timestamp,
    //   latitude: this.latitude,
    //   longitude: this.longitude,
    //   message: this.message,
    //   appVersion: this.appVersion,
    // });


    // this.runAtInterval();

    // this.dataTosend.push({
    //   date: new Date().getTime(),
    //   "activity": this.activity,
    //   timestamp: this.timestamp,
    //   latitude: this.latitude,
    //   longitude: this.longitude,
    //   message: this.message,
    //   appVersion: this.appVersion,
    // });

    this.intervalTimeout = interval_time;
    this.backgroundMode.on('enable').subscribe(() => {

      this.interval = setInterval(() => {
        this.globalObjects.getLocallData('locationTrackingStarted') == true ? this.runAtInterval() : '';
        // test //
        // this.dataService.getData('testTracking?state=enable').then(res => { }).catch(e => { });
        // test end //
      }, this.intervalTimeout * 60 * 1000);

      //---------------------------------------------------------------------------------

      this.onPauseSubscription = this.platform.pause.subscribe(() => {
        // test //
        // this.dataService.getData('testTracking?state=onpaussubscription').then(res => { }).catch(e => { });
        // test end //
        this.backgroundMode.moveToBackground();
      }, () => {

      });

      this.powerManagement.dim().then(() => {
        // test //
        // this.dataService.getData('testTracking?state=dim').then(res => { }).catch(e => { });
        // test end //
        this.powerManagement.setReleaseOnPause(false).then(() => {
          // test //
          // this.dataService.getData('testTracking?state=setReleaseOnPause').then(res => { }).catch(e => { });
          // test end //
          this.activity = this.activity + (' : setReleaseOnPause success');
        }, () => {
          // test //
          // this.dataService.getData('testTracking?state=setReleasefailed').then(res => { }).catch(e => { });
          // test end //
          this.activity = this.activity + (' : setReleaseOnPause Failed to set');
        })
      }, () => {
        // test //
        // this.dataService.getData('testTracking?state=failedWakeLock').then(res => { }).catch(e => { });
        // test end //
        this.activity = this.activity + (' : Failed to acquire wakelock');
      })

      //---------------------------------------------------------------------------------
    }, () => {
      this.interval = setInterval(() => {
        this.globalObjects.getLocallData('locationTrackingStarted') == true ? this.runAtInterval() : '';
        // test //
        // this.dataService.getData('testTracking?state=enableError').then(res => { }).catch(e => { });
        // test end //
      }, this.intervalTimeout * 60 * 1000);
      this.backgroundMode.excludeFromTaskList();
    });
    this.backgroundMode.on('deactivate')
      .subscribe(() => {

        // test //
        // this.dataService.getData('testTracking?state=deactivated').then(res => { }).catch(e => { });
        // test end //
        if (this.bgmode) {
        } else {

          //  this.globalObjects.displayCordovaToast("BG Mode End..");
        }

        this.activity = "Fore Ground";
        this.backgroundMode.wakeUp();
        // this.backgroundMode.excludeFromTaskList();
        this.backgroundMode.moveToForeground();
        if (this.onPauseSubscription != undefined) {
          // test //
          // this.dataService.getData('testTracking?state=paussubscriptionUndefined').then(res => { }).catch(e => { });
          // test end //
          this.onPauseSubscription.unsubscribe();
        }
      });
    this.backgroundMode.enable();
    // this.platform.registerBackButtonAction(() => {
    //   this.backgroundMode.moveToBackground();
    // });

    this.backgroundMode.on('activate').subscribe(() => {
      // this.globalObjects.displayCordovaToast("BG Mode Start..");

      // test //
      // this.dataService.getData('testTracking?state=bgmodeactivated').then(res => {

      // }).catch(e => {
      //   //alert(e);
      // });
      // test end //

      this.activity = "BG activate";
      this.backgroundMode.disableWebViewOptimizations();
      this.interval = setInterval(() => {
        if (!this.backgroundMode.isActive()) {
          this.activity = "Fore Ground";
          // test //
          // this.dataService.getData('testTracking?state=isactiveCondition').then(res => { }).catch(e => { });
          // test end //
        }
        this.globalObjects.getLocallData('locationTrackingStarted') == true ? this.runAtInterval() : '';
        // test //
        // this.dataService.getData('testTracking?state=activatedRuninterval').then(res => { }).catch(e => { });
        // test end //
      }, this.intervalTimeout * 60 * 1000);
    });

    this.backgroundMode.on('failure').subscribe(() => {
      this.activity = "failure";
      // this.dataService.getData('testTracking?state=onFailure').then(res => { }).catch(e => { });
    });
    this.isTracking = true;
  }
  // this.backgroundMode.excludeFromTaskList();

  moveToBackgroundLTStart() {
    // this.dataService.getData('testTracking?state=move ToBackGround').then(res => { }).catch(e => { });
    this.backgroundMode.moveToBackground();

  }

  gpsEntry() {
    this.getLocation();
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      interval: 20000,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false,// enable this to clear background location settings when the app terminates
      notificationsEnabled :false
      // url: "http://203.193.167.118:8888/lhsws/LV/192.168.100.173/1521/VICCOERP/VICCOERP/ORA10G"

    };


    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
        }, (err => {

        }));
    });



    this.backgroundGeolocation.on(BackgroundGeolocationEvents.background).subscribe(res => {
      clearInterval(this.foregroundInterval);
      this.backgroundGeolocation.checkStatus().then(status => {
        if (status.isRunning) {
          this.backgroundInterval = setInterval(() => {
            this.runAtInterval();
            /*  this.http.get('http://203.193.167.118:8888/lhsws/LV/192.168.100.173/1521/VICCOERP/VICCOERP/ORA10G/testTracking?state=back~'+this.latitude+'#'+ this.longitude, {}, this.header).then(res => {
               this.getLocation();
             }, (err) => {
               // alert("this error from start button" + JSON.stringify(err));
             }); */
            // this.backgroundMode.enable();
          }, 20000);
        }
      });
    })

    this.backgroundGeolocation.on(BackgroundGeolocationEvents.foreground).subscribe(res => {
      clearInterval(this.backgroundInterval);
      this.backgroundGeolocation.checkStatus().then(status => {
        if (status.isRunning) {
          this.foregroundInterval = setInterval(() => {
            this.runAtInterval();
          }, 20000);

        }
      });
    });

  }


  runAtInterval() {

    if(this.latitude &&  this.longitude){
      this.dataTosend.push({
        date: new Date().getTime(),
        "activity": this.activity,
        timestamp: this.timestamp,
        latitude: this.latitude,
        longitude: this.longitude,
        message: this.message,
        appVersion: this.appVersion,
        batteryLevel: this.batteryLevel
      });
      this.sendToserver();
      this.getLocation();
    }else{
      var options = {
        enableHighAccuracy: true,
        timeout: (this.intervalTimeout * 60 * 1000 / 2) / 2,
        //timeout: 5000
  
      };
      // let geo_object: any = {};
      this.geoLocation.getCurrentPosition(options).then((pos) => {
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;
        this.timestamp = pos.timestamp;
        this.message = "geoLocation";
        // alert(pos);
          this.dataTosend.push({
            date: new Date().getTime(),
            "activity": this.activity,
            timestamp: this.timestamp,
            latitude: this.latitude,
            longitude: this.longitude,
            message: this.message,
            appVersion: this.appVersion,
            batteryLevel: this.batteryLevel
          });
          this.sendToserver();
          this.getLocation();
      }).catch((error) => {
  
        var options = {
          enableHighAccuracy: true,
          timeout: ((this.intervalTimeout * 60 * 1000 / 2) - 5),
          maximumAge: 36000
        };
        navigator.geolocation.getCurrentPosition(position => {
    
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.timestamp = position.timestamp;
          this.message = "navigator.geolocation"

          this.dataTosend.push({
            date: new Date().getTime(),
            "activity": this.activity,
            timestamp: this.timestamp,
            latitude: this.latitude,
            longitude: this.longitude,
            message: this.message,
            appVersion: this.appVersion,
            batteryLevel: this.batteryLevel
          });
          this.sendToserver();
          this.getLocation();
    
        }, () => { }, options)
        // this.displayToast('Error getting location' + error);
      });
    }

  }

  sendToserver() {
    // alert("1");
    // alert("length : " + this.dataTosend.length);
    // this.globalObjects.displayCordovaToast("*");
    if (this.dataTosend.length > 0) {
      let reqData: any = {};
      reqData.dataTosend = this.dataTosend;
      let url = "Apptracking?deviceId=" + encodeURIComponent(this.device.uuid) + "&deviceName=" + encodeURIComponent(this.device.model)
        + "&seqNo=108&userCode=" + this.userDetails.user_code + "&dataTosend=" + encodeURIComponent(JSON.stringify(this.dataTosend));

      this.dataService.postData(url, reqData).then(res => {
        let resobj: any = res;
        if (resobj.status = 'success') {
          this.dataTosend = [];
        }
      }).catch(err => { console.log(err) })
    }
  }

  async displayToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  stop() {
    this.globalObjects.setDataLocally("locationTrackingStarted", false);
    clearInterval(this.interval);

    // this.activity = "BG disable";
    // this.powerManagement.release().then(() => {
    //   this.activity = this.activity + ('disableBackground: Wakelock released');
    // }, () => {
    //   this.activity = this.activity + ('disableBackground: Failed to release wakelock');
    // });
    // this.data.push({
    //   date: new Date().getTime(),
    //   "activity": this.activity,
    //   timestamp: this.timestamp,
    //   latitude: this.latitude,
    //   longitude: this.longitude,
    //   message: this.message,
    // });
    // this.dataTosend.push({
    //   date: new Date().getTime(),
    //   "activity": this.activity,
    //   timestamp: this.timestamp,
    //   latitude: this.latitude,
    //   longitude: this.longitude,
    //   message: this.message,
    //   appVersion: this.appVersion,
    // });
    // this.sendToserver();
    // this.backgroundMode.disable();
    this.isTracking = false;
  }

  getLocation() {
    // this.displayToast("alert in getlocation" +  ((this.intervalTimeout * 1000 / 2) - 5));
    var options = {
      enableHighAccuracy: true,
      timeout: (this.intervalTimeout * 60 * 1000 / 2) / 2,
      //timeout: 5000

    };
    // let geo_object: any = {};
    this.geoLocation.getCurrentPosition(options).then((pos) => {
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;
      this.timestamp = pos.timestamp;
      this.message = "geoLocation";
      // alert(pos);
    }).catch((error) => {

      this.latitude = "";
      this.longitude = "";
      this.timestamp = "";
      this.message = error.message;
      this.getNavigator();
      // this.displayToast('Error getting location' + error);
    });
  }

  getNavigator() {
    // this.displayToast((this.intervalTimeout * 60 * 1000 / 2) - 5);
    var options = {
      enableHighAccuracy: true,
      timeout: ((this.intervalTimeout * 60 * 1000 / 2) - 5),
      maximumAge: 36000
    };
    navigator.geolocation.getCurrentPosition(position => {

      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.timestamp = position.timestamp;
      this.message = "navigator.geolocation"

    }, () => { }, options)
  }

}

