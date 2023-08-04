import { Injectable } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
// import { PowerManagement } from '@ionic-native/power-management/ngx';
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
// import { ForegroundService } from '@ionic-native/foreground-service/ngx';

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
  userDetails: any;
  bgmode: boolean = false;

  constructor(public http: HttpClient,
    private backgroundGeolocation: BackgroundGeolocation,
    private backgroundMode: BackgroundMode,
    private batteryStatus: BatteryStatus,
    // public foregroundService: ForegroundService,
    private device: Device, private toastCtrl: ToastController, 
    // private powerManagement: PowerManagement,
    public geoLocation: Geolocation, public platform: Platform,
    private dataService: DataService, private globalObjects: GlobalObjectsService) {}

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
   
    this.globalObjects.setDataLocally("locationTrackingStarted", true);
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    let config = {
      silent: true
    };
    this.backgroundMode.configure(config);

    this.intervalTimeout = interval_time;
    this.backgroundMode.on('enable').subscribe(() => {

      this.interval = setInterval(() => {
        this.globalObjects.getLocallData('locationTrackingStarted') == true ? this.runAtInterval() : '';
      }, this.intervalTimeout * 60 * 1000);

      //---------------------------------------------------------------------------------

      this.onPauseSubscription = this.platform.pause.subscribe(() => {
        this.backgroundMode.moveToBackground();
      }, () => {

      });

      // this.powerManagement.dim().then(() => {
      //   this.powerManagement.setReleaseOnPause(false).then(() => {
      //     this.activity = this.activity + (' : setReleaseOnPause success');
      //   }, () => {
      //     this.activity = this.activity + (' : setReleaseOnPause Failed to set');
      //   })
      // }, () => {
      //   this.activity = this.activity + (' : Failed to acquire wakelock');
      // })

      //---------------------------------------------------------------------------------
    }, () => {
      this.interval = setInterval(() => {
        this.globalObjects.getLocallData('locationTrackingStarted') == true ? this.runAtInterval() : '';
      }, this.intervalTimeout * 60 * 1000);
      this.backgroundMode.excludeFromTaskList();
    });
    this.backgroundMode.on('deactivate')
      .subscribe(() => {

        this.activity = "Fore Ground";
        this.backgroundMode.wakeUp();
        this.backgroundMode.moveToForeground();
        if (this.onPauseSubscription != undefined) {
          this.onPauseSubscription.unsubscribe();
        }
      });
    this.backgroundMode.enable();

    this.backgroundMode.on('activate').subscribe(() => {
      this.activity = "BG activate";
      this.backgroundMode.disableWebViewOptimizations();
      this.interval = setInterval(() => {
        if (!this.backgroundMode.isActive()) {
          this.activity = "Fore Ground";
        }
        this.globalObjects.getLocallData('locationTrackingStarted') == true ? this.runAtInterval() : '';
      }, this.intervalTimeout * 60 * 1000);
    });

    this.backgroundMode.on('failure').subscribe(() => {
      this.activity = "failure";
    });
    this.isTracking = true;
  }

  moveToBackgroundLTStart() {
    this.backgroundMode.moveToBackground();
  }

  gpsEntry() {
    this.getLocation();
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      interval: 5000,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false,// enable this to clear background location settings when the app terminates
      notificationsEnabled :true,
      startOnBoot:true,
      url:"http://192.168.100.157:8888/lhsws/M3/192.168.100.173/1521/LWEBERP/LWEBERP/ORA11G/getLocations"
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
    // this.foregroundService.start('GPS Running', 'Background Service');
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
        timeout: (this.intervalTimeout * 60 * 1000 / 2) / 2
      };
      this.geoLocation.getCurrentPosition(options).then((pos) => {
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;
        this.timestamp = pos.timestamp;
        this.message = "geoLocation";
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
    this.isTracking = false;
  }

  getLocation() {
    var options = {
      enableHighAccuracy: true,
      timeout: (this.intervalTimeout * 60 * 1000 / 2) / 2,
    };

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

