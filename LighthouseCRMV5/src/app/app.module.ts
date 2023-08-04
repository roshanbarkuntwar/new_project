import { NgModule,  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { HttpClientModule } from '@angular/common/http';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Network } from '@ionic-native/network/ngx';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { PowerManagement } from '@ionic-native/power-management/ngx';
import { BackgroundGeolocation } from "@ionic-native/background-geolocation/ngx";
import { DynamicmodalPage } from './pages/dynamicmodal/dynamicmodal.page';
import { UsersettingPage } from './pages/usersetting/usersetting.page';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Market } from '@ionic-native/market/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { ApexSearchPipe } from './pipes/apex-search.pipe';
import { LovComboSearchPipe } from './pipes/lov-combo-search.pipe';
import { MultileveltabsearchPipe } from './pipes/multileveltabsearch.pipe';
import { SearchfilterPipe } from './pipes/searchfilter.pipe';
import { TableSearchPipe } from './pipes/table-search.pipe';
import { CanvasItemSearchPipe } from './pipes/canvas-item-search.pipe';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AppkeyUserInfoPage } from './pages/appkey-user-info/appkey-user-info.page';
import { ChangePasswordPage } from './pages/change-password/change-password.page';
import { EntryListPage } from './pages/entry-list/entry-list.page';
import { PartylistPage } from './pages/partylist/partylist.page';
import { SettingPage } from './pages/setting/setting.page';
import { ImageIconMasterPage } from './pages/image-icon-master/image-icon-master.page';
import { ExecuteQueryPage } from './pages/execute-query/execute-query.page';
import { TreeCallpagePage } from './pages/tree-callpage/tree-callpage.page';
import { OfflineEntryTabsPage } from './pages/offline-entry-tabs/offline-entry-tabs.page';
import { SqlLightTranPage } from './pages/sql-light-tran/sql-light-tran.page';
import { ImagePreviewPage } from './pages/image-preview/image-preview.page';
import { OfflineEntryListPage } from './pages/offline-entry-list/offline-entry-list.page';
import { ExecutedTabPage } from './pages/executed-tab/executed-tab.page';
import { PendingTabPage } from './pages/pending-tab/pending-tab.page';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { MultiLevelTabPage } from './pages/multi-level-tab/multi-level-tab.page';
import { DeveloperModePage } from './pages/developer-mode/developer-mode.page';
import { DevObjectMastEditorPage } from './pages/dev-object-mast-editor/dev-object-mast-editor.page';
import { DevFrameMastEditorPage } from './pages/dev-frame-mast-editor/dev-frame-mast-editor.page';
import { DevFrameItemListPage } from './pages/dev-frame-item-list/dev-frame-item-list.page';
import { ParentMenuPage } from './pages/parent-menu/parent-menu.page';
import { SingleSelectLovPage } from './pages/single-select-lov/single-select-lov.page';
import { Base64 } from '@ionic-native/base64/ngx';
import { PopoverPage } from './pages/popover/popover.page';
import { DevClickEventsPage } from './pages/dev-click-events/dev-click-events.page';
import { DevObjFrameListPage } from './pages/dev-obj-frame-list/dev-obj-frame-list.page';
import { DevImageIconMastEditorPage } from './pages/dev-image-icon-mast-editor/dev-image-icon-mast-editor.page';
import { OnInitDirective } from './directives/on-init.directive';
import { DragDropDirective } from './directives/drag-drop.directive';
import { ApexActionFilterPage } from './pages/apex-action-filter/apex-action-filter.page';
import { ApexHighlightPage } from './pages/apex-highlight/apex-highlight.page';
import { FreezecolumnPage } from './pages/freezecolumn/freezecolumn.page';
import { DeveloperModeLogPage } from './pages/developer-mode-log/developer-mode-log.page';
import { TextAreaPage } from './pages/text-area/text-area.page';
import { WebdatarocksComponent } from './demo-utils/pivot-table-webdatarocks/webdatarocks.component';
import { Downloader } from '@ionic-native/downloader/ngx';
import { PouchDBService } from './services/pouch-db.service';
import { LhsLibService } from './services/lhs-lib.service';
import { DatePipe } from '@angular/common';
import { SqlLiteService } from './services/sql-lite.service';
import { GlobalObjectsService } from './services/global-objects.service';
import { DataService } from './services/data.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FormsModule } from '@angular/forms';
import { PipesModule } from './pipes/pipes.module';
import { environment } from '../environments/environment';
import { HighlightJsModule } from 'ngx-highlight-js';
import { SuperTabsModule }  from '@ionic-super-tabs/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { ServiceWorkerModule } from '@angular/service-worker';


@NgModule({
  declarations: [AppComponent, UsersettingPage, EntryListPage, PartylistPage,DynamicmodalPage,DeveloperModeLogPage,TextAreaPage,WebdatarocksComponent,
    FreezecolumnPage, SettingPage,TreeCallpagePage, OfflineEntryTabsPage,OfflineEntryListPage, SqlLightTranPage, ChangePasswordPage,PendingTabPage, ExecutedTabPage, ExecuteQueryPage, ImageIconMasterPage, ImagePreviewPage,DevClickEventsPage,DevObjFrameListPage,ApexActionFilterPage,ApexHighlightPage, AppkeyUserInfoPage],
  entryComponents: [EntryListPage,UsersettingPage, PartylistPage,DynamicmodalPage,DeveloperModeLogPage,SettingPage,TextAreaPage,
    FreezecolumnPage,TreeCallpagePage, OfflineEntryTabsPage,OfflineEntryListPage, SqlLightTranPage, ChangePasswordPage, PendingTabPage, ExecutedTabPage, ExecuteQueryPage, ImageIconMasterPage, ImagePreviewPage,DevClickEventsPage,DevObjFrameListPage,ApexActionFilterPage,ApexHighlightPage, AppkeyUserInfoPage],
  //imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,AngularMyDatePickerModule,DragDropModule,FormsModule,PipesModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA
  ],

  imports: [
    BrowserModule, FormsModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    //CacheModule.forRoot(),   
    SuperTabsModule.forRoot(),
    HighlightJsModule,
    // AngularFireModule.initializeApp(firebaseConfig),
    // AngularFireAuthModule,
    IonicModule,AngularMyDatePickerModule,
   AngularFireModule.initializeApp(environment.firebaseConfig),
   // ImageUploaderPageModule,
  // AngularFireStorageModule,
    AppRoutingModule, HttpClientModule, PipesModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],

  providers: [
    StatusBar, Device, DatePicker, DatePipe,SQLite,
    SplashScreen,SqlLiteService,LovComboSearchPipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DataService, GlobalObjectsService,LhsLibService, Camera, BarcodeScanner, Geolocation, PhotoViewer, Downloader,BackgroundGeolocation,
    NativeGeocoder, PowerManagement, BackgroundMode, FCM, MediaCapture, File, BatteryStatus,
    InAppBrowser, EmailComposer, FileTransfer, DocumentViewer, File, FileOpener, Base64, FileChooser, FilePath,
    Platform, SocialSharing, AndroidPermissions, SpeechRecognition,ApexSearchPipe,MultileveltabsearchPipe,
     Market , AppVersion, PouchDBService, Network,NativeAudio,Vibration, NativeAudio, LocationAccuracy,ImagePreviewPage,
    //  ParentMenuPage,
    //BatteryStatus
    // ,GooglePlusBackgroundGeolocation,
    //  Http,
    //  SpeechRecognitionService
 ],
  bootstrap: [AppComponent],
})
export class AppModule {}


