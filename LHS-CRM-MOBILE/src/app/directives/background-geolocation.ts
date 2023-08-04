import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation/ngx';

export function startBackgroundGeolocation() {
  const backgroundGeolocation = new BackgroundGeolocation();
 
  const config: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    interval: 3000,
    debug: true,
    stopOnTerminate: false,
    startOnBoot: true,
    // foregroundService: true,
    notificationTitle: 'Background tracking',
    notificationText: 'enabled'
  };
 
  backgroundGeolocation.configure(config)
    .then(() => {
        console.log(backgroundGeolocation.configure(config))
      backgroundGeolocation.start();
      console.log(backgroundGeolocation.start())
    })
    .catch((error) => {
      console.error(error);
    });
}