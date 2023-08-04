// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // serverUrlAws:"http://203.193.167.118:8888/lhsws/",
  serverUrlAws:"http://192.168.100.21:8888/lhsws/",
  serverUrlLhs:"https://b2bsangam.com/lhsws/",
  // serverUrlAws:"http://192.168.100.157:8888/lhsws/",
  // serverUrlLhs:"http://192.168.100.157:8888/lhsws/",
  firebaseConfig : {
    apiKey: "AIzaSyCzBYK2qkDp9VJ2a--qZLCUwfm32fQA1U0",
    authDomain: "lhswma-image-icon-mast.firebaseapp.com",
    databaseURL: "https://lhswma-image-icon-mast.firebaseio.com",
    projectId: "lhswma-image-icon-mast",
    storageBucket: "lhswma-image-icon-mast.appspot.com",
    messagingSenderId: "1427225356",
    appId: "1:1427225356:web:17e1b236623e8ca9d6e729"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
