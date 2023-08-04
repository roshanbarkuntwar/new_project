import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './services/data.service';
import { GlobalObjectsService } from './services/global-objects.service';

import { HttpClientModule } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Device } from '@ionic-native/device/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { DatePipe } from '@angular/common';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
// import { PowerManagement } from '@ionic-native/power-management/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FCM } from '@ionic-native/fcm/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { PipesModule } from './pipes/pipes.module';
import { EntryListPage } from './pages/entry-list/entry-list.page';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
//import { BatteryStatus } from '@ionic-native/battery-status/ngx';

// import { SMS } from '@ionic-native/sms/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CacheModule } from "ionic-cache";
import { PartylistPage } from './pages/partylist/partylist.page';
import { FormsModule } from '@angular/forms';
import { Market } from '@ionic-native/market/ngx';

import { AppVersion } from '@ionic-native/app-version/ngx';
import { Downloader } from '@ionic-native/downloader/ngx';
import { PouchDBService } from './services/pouch-db.service';
import { Network } from '@ionic-native/network/ngx';
import { DynamicmodalPage } from './pages/dynamicmodal/dynamicmodal.page';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { DragDropModule, CdkDropList } from '@angular/cdk/drag-drop';
// import { DocumentScanner } from '@ionic-native/document-scanner/ngx';
//import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { BackgroundGeolocation } from "@ionic-native/background-geolocation/ngx";
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
// import { AngularFireAuthModule } from '@angular/fire/auth';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Http  } from '@angular/http';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { SuperTabsModule }  from '@ionic-super-tabs/angular';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SqlLiteService } from './services/sql-lite.service';
import { DeveloperModeLogPage } from './pages/developer-mode-log/developer-mode-log.page';
import { SettingPage } from './pages/setting/setting.page';
import { OfflineEntryTabsPage } from './pages/offline-entry-tabs/offline-entry-tabs.page';
import { ChangePasswordPage } from './pages/change-password/change-password.page';
import { SqlLightTranPage } from './pages/sql-light-tran/sql-light-tran.page';
import { ExecutedTabPage } from './pages/executed-tab/executed-tab.page';
import { PendingTabPage } from './pages/pending-tab/pending-tab.page';
import { OfflineEntryListPage } from './pages/offline-entry-list/offline-entry-list.page';
import { TreeCallpagePage } from './pages/tree-callpage/tree-callpage.page';
// import { TreesetComponent } from './components/items/item-display/treeset/treeset.component';
import { ExecuteQueryPage } from './pages/execute-query/execute-query.page';
import { UsersettingPage } from './pages/usersetting/usersetting.page';
import { ImageIconMasterPage } from './pages/image-icon-master/image-icon-master.page';
import { ImagePreviewPage } from './pages/image-preview/image-preview.page';
import { HighlightJsModule } from 'ngx-highlight-js';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { DevClickEventsPage } from './pages/dev-click-events/dev-click-events.page';
import { DevObjFrameListPage } from './pages/dev-obj-frame-list/dev-obj-frame-list.page';
import { ApexActionFilterPage } from './pages/apex-action-filter/apex-action-filter.page';
import { ApexSearchPipe } from './pipes/apex-search.pipe';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { FreezecolumnPage } from './pages/freezecolumn/freezecolumn.page';
import { ApexHighlightPage } from './pages/apex-highlight/apex-highlight.page';
import { AppkeyUserInfoPage } from './pages/appkey-user-info/appkey-user-info.page';
import { MultileveltabsearchPipe } from './pipes/multileveltabsearch.pipe';
import { TextAreaPage } from './pages/text-area/text-area.page';
import { WebdatarocksComponent } from './demo-utils/pivot-table-webdatarocks/webdatarocks.component';
import { LovComboSearchPipe } from './pipes/lov-combo-search.pipe';
import { LhsLibService } from './services/lhs-lib.service';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BarcodeProvider } from './demo-utils/barcode/barcode';
import { BluetoothPage } from './pages/bluetooth/bluetooth.page';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { AppLauncher } from '@ionic-native/app-launcher/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AppInfoPage } from './pages/app-info/app-info.page';
// import { ForegroundService } from '@ionic-native/foreground-service/ngx';
// import { ParentMenuPage } from './pages/parent-menu/parent-menu.page';
/* import { ParentNamePipe } from './pages/parent-name.pipe'; */

const firebaseConfig = {
  apiKey: "AIzaSyD-qL_rTgay7JnhccZkUZj9nO7gTtI7wwU",
  authDomain: "lhserp-6f2bd.firebaseapp.com",
  databaseURL: "https://lhserp-6f2bd.firebaseio.com",
  projectId: "lhserp-6f2bd",
  storageBucket: "lhserp-6f2bd.appspot.com",
  messagingSenderId: "259409264840",
  appId: "1:259409264840:web:a7a0c3bfcb07a75831a5fd",
  measurementId: "G-QS4HZQGCQZ"
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
@NgModule({
  declarations: [AppComponent,AppInfoPage, UsersettingPage, EntryListPage, PartylistPage,DynamicmodalPage,DeveloperModeLogPage,TextAreaPage,WebdatarocksComponent,
    FreezecolumnPage, SettingPage,TreeCallpagePage, OfflineEntryTabsPage,OfflineEntryListPage, SqlLightTranPage, BluetoothPage,ChangePasswordPage,PendingTabPage, ExecutedTabPage, ExecuteQueryPage, ImageIconMasterPage, ImagePreviewPage,DevClickEventsPage,DevObjFrameListPage,ApexActionFilterPage,ApexHighlightPage, AppkeyUserInfoPage],
  entryComponents: [EntryListPage,UsersettingPage, PartylistPage,DynamicmodalPage,DeveloperModeLogPage,SettingPage,TextAreaPage,BluetoothPage,AppInfoPage,
    FreezecolumnPage,TreeCallpagePage, OfflineEntryTabsPage,OfflineEntryListPage, SqlLightTranPage, ChangePasswordPage, PendingTabPage, ExecutedTabPage, ExecuteQueryPage, ImageIconMasterPage, ImagePreviewPage,DevClickEventsPage,DevObjFrameListPage,ApexActionFilterPage,ApexHighlightPage, AppkeyUserInfoPage],
  imports: [
    BrowserModule, FormsModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    CacheModule.forRoot(),   
    SuperTabsModule.forRoot(),
    HighlightJsModule,
    // AngularFireModule.initializeApp(firebaseConfig),
    // AngularFireAuthModule,
    IonicModule,AngularMyDatePickerModule,
    DragDropModule,
   AngularFireModule.initializeApp(environment.firebaseConfig),
   // ImageUploaderPageModule,
   AngularFireStorageModule,
    AppRoutingModule, HttpClientModule, PipesModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar, Device, DatePicker, DatePipe,SQLite,BluetoothSerial,
    SplashScreen,SqlLiteService,LovComboSearchPipe,OpenNativeSettings,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DataService, GlobalObjectsService,LhsLibService, Camera, BarcodeScanner, Geolocation, Downloader,BackgroundGeolocation,
    NativeGeocoder, BackgroundMode, FCM, MediaCapture, File, BatteryStatus,AppLauncher,Diagnostic,
    InAppBrowser, EmailComposer, FileTransfer, DocumentViewer, File, Base64, FileChooser, FilePath,FirebaseX,
    Platform, SocialSharing, AndroidPermissions, SpeechRecognition,ApexSearchPipe,MultileveltabsearchPipe,
     Market , AppVersion, PouchDBService, Network,NativeAudio,Vibration, NativeAudio, LocationAccuracy,ImagePreviewPage,BarcodeProvider,
     BackgroundGeolocation,
    //  ParentMenuPage,
    //BatteryStatus
    // ,GooglePlusBackgroundGeolocation,
     CdkDropList, Http,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent,WebdatarocksComponent]
})
export class AppModule { }