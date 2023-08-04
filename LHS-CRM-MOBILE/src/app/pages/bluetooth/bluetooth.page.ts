import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { AlertController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppInfoPage } from '../app-info/app-info.page';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation/ngx';
import { startBackgroundGeolocation } from 'src/app/directives/background-geolocation';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
})
export class BluetoothPage implements OnInit {

  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: any;
  inputData: any;
  data: any;
  bytes: any;
  debug: string;
  connectedDeviceName: any;
  connectedDevice: any;
  deviceName: any;
  deviceNamee: any;
  @Input() bluetooth: any;

  constructor(private bluetoothSerial: BluetoothSerial, private alertController: AlertController, private cdr: ChangeDetectorRef,
    private popOver: PopoverController, private androidPermissions: AndroidPermissions, private openNativeSettings: OpenNativeSettings,
    private appLauncher: AppLauncher, private appVersion: AppVersion, private toastCtrl: ToastController,private backgroundMode: BackgroundMode,
    public globalObjectService: GlobalObjectsService, private backgroundGeolocation: BackgroundGeolocation,   private platform: Platform,) {
     }

  ngOnInit() {
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    const unPair = [];
    this.bluetoothSerial.discoverUnpaired().then((success) => {
      success.forEach((value, key) => {
        var exists = false;
        unPair.forEach((val2, i) => {
          if (value.id === val2.id) {
            exists = true;
          }
        });
        if (exists === false && value.id !== '') {
          unPair.push(value);
        }
      });
      this.unpairedDevices = unPair;
      this.gettingDevices = false;
    },
      (err) => {
        console.log(err);
      });

    this.bluetoothSerial.list().then((success) => {
      let devices = [];
      for(let x of success){
        if(x.id == this.globalObjectService.deviceNamee || x.name == this.globalObjectService.deviceNamee){} else {
          devices.push(x)
        }
      }
      
      this.pairedDevices = devices;

    },
      (err) => {

      });

    // this.getConnectedDeviceName();
    // this.getConnect()

  }



  success = (data: any) => {
    this.deviceConnected();
  }
  fail = (error: any) => {
    alert(error);
  }

  async selectDevices(id: any) {

    const alert = await this.alertController.create({
      header: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.popOver.dismiss();
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(id).subscribe(this.success, this.fail);
            this.bluetoothSerial.available().then(data => {
              console.log("Available " + (data));
              this.bluetoothSerial.read().then(data => {
                console.log("Read " + (data));
                this.data = this.inputData;
                console.log('id', id);
                this.bluetoothSerial.list().then(
                  devices => {
                    let devicess = devices
                    for (let device of devicess) {
                      console.log('devices.id', device.id)
                      let originalString = device.id;
                      console.log('originalString', originalString);
                      let newString = originalString.replace(/:/g, "");
                      console.log('newString', newString);
                      console.log('id', id);
                      console.log(originalString == id)
                      if (originalString == id) {
                        this.globalObjectService.deviceNamee = device.name || device.id
                        console.log('deviceNamee', this.deviceNamee);


                        let ndevices = [];
                        for(let x of devicess){
                          if(x.id == this.globalObjectService.deviceNamee || x.name == this.globalObjectService.deviceNamee){} else {
                            ndevices.push(x)
                          }
                        }
                        
                        this.pairedDevices = ndevices;
                      }


                    }

                  },
                  error => {
                    console.error('Error getting device list:', error);
                  }
                );
                this.popOver.dismiss();

                //  this.navCtrl.push(WelcomePage);

              });
            });
          }

        }
      ]

    });
    await alert.present();
  }

  deviceConnected() {
    this.bluetoothSerial.isConnected().then(success => {
      if(success){
        console.log('success', success)
        alert('Connected Successfullly');
      }else{

      }
    }, error => {
      alert('error' + JSON.stringify(error));
    });
  }

  async disconnect() {
    const alert = await this.alertController.create({
      header: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    this.globalObjectService.deviceNamee = '';
    await alert.present();
  }



  gettData() {
    this.bluetoothSerial.subscribe('kg').subscribe((data: any) => {
      console.log(data)
      let d = 'val' + data;
      console.log(d)
      let dd = new RegExp('\r?\n', 'g')
      let enteredText = d;
      let lineBreaks = (enteredText.match(/\n/g) || [])
      let numberOfLineBreaks = (enteredText.match(/\n/g) || []).length;
      let characterCount = enteredText.length + numberOfLineBreaks;
      console.log(lineBreaks);
      let breakS = JSON.stringify(lineBreaks)
      console.log(breakS)
      console.log(characterCount);
      console.log(lineBreaks)
      if (lineBreaks[0] == "\n") {
        let vall: any = d;

        this.bytes = vall.replaceAll('val', '');
        console.log(this.bytes)

      }
      console.log(this.bytes);
      this.bluetoothSerial.clear();
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 100)
      console.log(this.bytes);
    });
  }


  getRawData() {
    this.bluetoothSerial.read().then((dd) => {
      this.debug += "\n" + JSON.stringify(dd);
      console.log(this.debug)
      this.bluetoothSerial.clear().then(data => {
        console.log("Is buffer clear before reciving new messages?:", data);
      });
    });
  }


  enableBluetooth() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN).then(
      result => {
        if (result.hasPermission) {
          // Permission is granted
          this.bluetoothSerial.enable().then(success => {
            alert("Bluetooth  enabled");
            this.popOver.dismiss();

          }, error => {
            alert("Bluetooth is not enabledd");
            this.openAppInfo();
          });
        } else {
          // Permission is not granted, request it
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN).then(
            result => {
              if (result.hasPermission) {
                // Permission is granted
                this.bluetoothSerial.enable().then(success => {
                  alert("Bluetooth is enabled");
                  this.popOver.dismiss();
                }, error => {
                  alert("Bluetooth is not enabled");
                  this.openAppInfo();
                });
              } else {
                // Permission is still not granted, show error message
                alert("Bluetooth permission is not granted");
              }
            }
          );
        }
      }, error => {
        alert("Bluetooth");
        this.openAppInfo();
      });
  }



  checkLocationPermissions() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION ).then(
      result => {
        if (result.hasPermission) {
          alert('Location permission granted');
          // Your app can now discover nearby devices and establish Bluetooth connections
        } else {
          alert('Location permission not granted');
          this.requestLocationPermissions();
        }
      },
      err => {
        alert('Error checking location permission');
      }
    );
  }

  requestLocationPermissions() {
    this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
    ]).then(
      result => {
        if (result.hasPermission) {
          alert('Location permission granted');
          // Your app can now discover nearby devices and establish Bluetooth connections
        } else {
          alert('Location permission not granted');
        }
      },
      err => {
        alert('Error requesting location permission');
      }
    );
  }

  app() {
    const options = {
      packageName: 'com.android.settings',
      extras: {
        'android.provider.extra.APP_PACKAGE': 'com.lhs.lhsvtwo'
      }
    } as AppLauncherOptions;
    this.appLauncher.launch(options)
      .then(() => alert('Settings launched successfully'))
      .catch((error) => alert('Error launching settings'));
  }

  open(setting: string) {
    this.openNativeSettings.open(setting).then(val => {
      alert(setting)
    }).catch(err => {
      alert("error")
    })
  }


  async openAppInfo() {
    const popover = await this.popOver.create({
      component: AppInfoPage,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    this.dismissInfo();
  }

  dismissInfo() {
    this.popOver.dismiss();
  }


  getConnectedDeviceName() {
    this.bluetoothSerial.isConnected().then((isConnected) => {
      if (isConnected) {
        console.log(isConnected);
        this.bluetoothSerial.list().then((devices) => {
          console.log(devices)
          const connectedDevices = devices.filter((device) => device.connected);
          console.log(connectedDevices)
          console.log(connectedDevices.name)
          console.log(connectedDevices[0].name)
          if (connectedDevices.length > 0) {
            this.connectedDeviceName = connectedDevices[0].name;
            console.log("Connecetd Device", this.connectedDeviceName)
          } else {
            console.log('No connected Bluetooth device');
          }
        }).catch((error) => {
          console.log('Error listing Bluetooth devices:');
        });
      } else {
        console.log('No connected Bluetooth device');
      }
    }).catch((error) => {
      console.log('Error checking Bluetooth connection:', error);
    });
  }


  getConnect() {
    this.bluetoothSerial.isConnected().then(
      isConnected => {
        if (isConnected) {
          this.bluetoothSerial.list().then(
            devices => {
              console.log(devices)
              this.bluetoothSerial.isConnected().then(
                connectedDeviceAddress => {
                  const connectedDevice = devices.find(device => device.address === connectedDeviceAddress);
                  if (connectedDevice) {
                    const deviceName = connectedDevice.name;
                    console.log('Connected device name:', deviceName);
                  } else {
                    console.log('No device connected.');
                  }
                },
                error => {
                  console.error('Error getting connected device address:', error);
                }
              );
            },
            error => {
              console.error('Error getting device list:', error);
            }
          );
        } else {
          console.log('No device connected.');
        }
      },
      error => {
        console.error('Error checking connection status:', error);

      })

  }


  getId(id?) {
    console.log('id', id);
    this.bluetoothSerial.list().then(
      devices => {
        let devicess = devices
        for (let device of devicess) {
          console.log('devices.id', device.id)
          let originalString = device.id;
          console.log('originalString', originalString);
          let newString = originalString.replace(/:/g, "");
          console.log('newString', newString);
          console.log('id', id);
          if (originalString == id) {
            this.deviceName = devices.name
            console.log('Connected device', this.deviceName);
          }
          setTimeout(() => {
            this.deviceNamee = this.deviceName
          }, 1000);
        }
      },
      error => {
        console.error('Error getting device list:', error);
      }
    );
  }






}


