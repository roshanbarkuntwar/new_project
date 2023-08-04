import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ImageUploaderPage } from './pages/image-uploader/image-uploader.page';
import { AuthGuard } from './services/auth.guard';
import { LoginGuard } from './services/login.guard';

const routes: Routes = [
  { path: 'image-uploader', loadChildren: './pages/image-uploader/image-uploader.module#ImageUploaderPageModule' },
 // { path:'image-uploader',pathMatch: 'full', component:ImageUploaderPage},
  {path: '',redirectTo: 'login',pathMatch: 'full'},
  // { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'list', loadChildren: './list/list.module#ListPageModule' },
  { path: 'super', loadChildren: './pages/super/super.module#SuperPageModule', canActivate:[AuthGuard] },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', canActivate:[LoginGuard]},
  { path: 'appkey-validation', loadChildren: './pages/appkey-validation/appkey-validation.module#AppkeyValidationPageModule', canActivate:[LoginGuard]},
  { path: 'usersetting', loadChildren: './pages/usersetting/usersetting.module#UsersettingPageModule' },
  { path: 'appkey-collection', loadChildren: './pages/appkey-collection/appkey-collection.module#AppkeyCollectionPageModule', canActivate:[LoginGuard]},
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'ChangeServerSettingPage', loadChildren: './pages/change-server-setting/change-server-setting.module#ChangeServerSettingPageModule' },
  { path: 'entry-list', loadChildren: './pages/entry-list/entry-list.module#EntryListPageModule'},
  { path: 'multi-level-tab', loadChildren: './pages/multi-level-tab/multi-level-tab.module#MultiLevelTabPageModule'},
  { path: 'add-to-cart', loadChildren: './pages/add-to-cart/add-to-cart.module#AddToCartPageModule' },
  { path: 'cart-summary', loadChildren: './pages/cart-summary/cart-summary.module#CartSummaryPageModule' },
  { path: 'change-password', loadChildren: './pages/change-password/change-password.module#ChangePasswordPageModule' },
  { path: 'update-app', loadChildren: './pages/update-app/update-app.module#UpdateAPPPageModule' },
  { path: 'bridge', loadChildren: './pages/bypass/bypass.module#BypassPageModule' },
  { path: 'appkey-info', loadChildren: './pages/appkey-info/appkey-info.module#AppkeyInfoPageModule' },
  { path: 'appkey-user-info', loadChildren: './pages/appkey-user-info/appkey-user-info.module#AppkeyUserInfoPageModule' },
  { path: 'beta-version', loadChildren: './pages/beta-version/beta-version.module#BetaVersionPageModule' },
  // { path: 'dynamicmodal', loadChildren: './dynamicmodal/dynamicmodal.module#DynamicmodalPageModule' },
  { path: 'offline-entry-list', loadChildren: './pages/offline-entry-list/offline-entry-list.module#OfflineEntryListPageModule' },
  { path: 'offline-entry-tabs', loadChildren: './pages/offline-entry-tabs/offline-entry-tabs.module#OfflineEntryTabsPageModule' },
  { path: 'forgot-password', loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
 // { path: 'reset-password', loadChildren: './reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'reset-password/:id', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'setting', loadChildren: './pages/setting/setting.module#SettingPageModule' },
  { path: 'developer-mode', loadChildren: './pages/developer-mode/developer-mode.module#DeveloperModePageModule' },
  { path: 'sqllite-tran', loadChildren: './pages/sql-light-tran/sql-light-tran.module#SqlLightTranPageModule' },
  { path: 'developer-mode-log', loadChildren: './pages/developer-mode-log/developer-mode-log.module#DeveloperModeLogPageModule' },
  { path: 'tree-callpage', loadChildren: './pages/tree-callpage/tree-callpage.module#TreeCallpagePageModule' },
  { path: 'execute-query', loadChildren: './pages/execute-query/execute-query.module#ExecuteQueryPageModule' },
  { path: 'image-icon-master', loadChildren: './pages/image-icon-master/image-icon-master.module#ImageIconMasterPageModule' },
  { path: 'image-preview', loadChildren: './pages/image-preview/image-preview.module#ImagePreviewPageModule' },
  
  { path: 'object-mast-editor', loadChildren: './pages/dev-object-mast-editor/object-mast-editor.module#ObjectMastEditorPageModule' },
  { path: 'dev-frame-mast-editor', loadChildren: './pages/dev-frame-mast-editor/dev-frame-mast-editor.module#DevFrameMastEditorPageModule' },
  { path: 'dev-frame-item-list', loadChildren: './pages/dev-frame-item-list/dev-frame-item-list.module#DevFrameItemListPageModule' },
  { path: 'dev-obj-frame-list', loadChildren: './pages/dev-obj-frame-list/dev-obj-frame-list.module#DevObjFrameListPageModule' },
  { path: 'apex-highlight', loadChildren: './pages/apex-highlight/apex-highlight.module#ApexHighlightPageModule' },
  { path: 'parent-menu', loadChildren: './pages/parent-menu/parent-menu.module#ParentMenuPageModule' },
  { path: 'text-area', loadChildren: './pages/text-area/text-area.module#TextAreaPageModule' },
  { path: 'bluetooth', loadChildren: './pages/bluetooth/bluetooth.module#BluetoothPageModule' },
  { path: 'app-info', loadChildren: './pages/app-info/app-info.module#AppInfoPageModule' },
 
  // { path: 'partylist', loadChildren: './pages/partylist/partylist.module#PartylistPageModule' },
 
  
  // { path: 'voice-search', loadChildren: './voice-search/voice-search.module#VoiceSearchPageModule' }
 

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
