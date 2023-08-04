import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { LoginGuard } from './services/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'appkey-validation',
    loadChildren: () => import('./pages/appkey-validation/appkey-validation.module').then( m => m.AppkeyValidationPageModule),
    //canActivate:[LoginGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate:[LoginGuard]
  },
  {
    path: 'usersetting',
    loadChildren: () => import('./pages/usersetting/usersetting.module').then( m => m.UsersettingPageModule)
  },
  {
    path: 'dynamicmodal',
    loadChildren: () => import('./pages/dynamicmodal/dynamicmodal.module').then( m => m.DynamicmodalPageModule)
  },
  {
    path: 'super',
    loadChildren: () => import('./pages/super/super.module').then( m => m.SuperPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'appkey-user-info',
    loadChildren: () => import('./pages/appkey-user-info/appkey-user-info.module').then( m => m.AppkeyUserInfoPageModule)
  },
  {
    path: 'entry-list',
    loadChildren: () => import('./pages/entry-list/entry-list.module').then( m => m.EntryListPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'partylist',
    loadChildren: () => import('./pages/partylist/partylist.module').then( m => m.PartylistPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'sql-light-tran',
    loadChildren: () => import('./pages/sql-light-tran/sql-light-tran.module').then( m => m.SqlLightTranPageModule)
  },
  {
    path: 'offline-entry-tabs',
    loadChildren: () => import('./pages/offline-entry-tabs/offline-entry-tabs.module').then( m => m.OfflineEntryTabsPageModule)
  },
  {
    path: 'tree-callpage',
    loadChildren: () => import('./pages/tree-callpage/tree-callpage.module').then( m => m.TreeCallpagePageModule)
  },
  {
    path: 'execute-query',
    loadChildren: () => import('./pages/execute-query/execute-query.module').then( m => m.ExecuteQueryPageModule)
  },
  {
    path: 'image-icon-master',
    loadChildren: () => import('./pages/image-icon-master/image-icon-master.module').then( m => m.ImageIconMasterPageModule)
  },
  {
    path: 'image-preview',
    loadChildren: () => import('./pages/image-preview/image-preview.module').then( m => m.ImagePreviewPageModule)
  },
  {
    path: 'offline-entry-list',
    loadChildren: () => import('./pages/offline-entry-list/offline-entry-list.module').then( m => m.OfflineEntryListPageModule)
  },
  {
    path: 'executed-tab',
    loadChildren: () => import('./pages/executed-tab/executed-tab.module').then( m => m.ExecutedTabPageModule)
  },
  {
    path: 'pending-tab',
    loadChildren: () => import('./pages/pending-tab/pending-tab.module').then( m => m.PendingTabPageModule)
  },
  {
    path: 'multi-level-tab',
    loadChildren: () => import('./pages/multi-level-tab/multi-level-tab.module').then( m => m.MultiLevelTabPageModule)
  },
  {
    path: 'developer-mode',
    loadChildren: () => import('./pages/developer-mode/developer-mode.module').then( m => m.DeveloperModePageModule)
  },
  {
    path: 'dev-frame-mast-editor',
    loadChildren: () => import('./pages/dev-frame-mast-editor/dev-frame-mast-editor.module').then( m => m.DevFrameMastEditorPageModule)
  },
  {
    path: 'dev-frame-item-list',
    loadChildren: () => import('./pages/dev-frame-item-list/dev-frame-item-list.module').then( m => m.DevFrameItemListPageModule)
  },
  {
    path: 'parent-menu',
    loadChildren: () => import('./pages/parent-menu/parent-menu.module').then( m => m.ParentMenuPageModule)
  },
  {
    path: 'single-select-lov',
    loadChildren: () => import('./pages/single-select-lov/single-select-lov.module').then( m => m.SingleSelectLovPageModule)
  },
  {
    path: 'developer-mode-log',
    loadChildren: () => import('./pages/developer-mode-log/developer-mode-log.module').then( m => m.DeveloperModeLogPageModule)
  },
  {
    path: 'popover',
    loadChildren: () => import('./pages/popover/popover.module').then( m => m.PopoverPageModule)
  },
  {
    path: 'dev-click-events',
    loadChildren: () => import('./pages/dev-click-events/dev-click-events.module').then( m => m.DevClickEventsPageModule)
  },
  {
    path: 'dev-obj-frame-list',
    loadChildren: () => import('./pages/dev-obj-frame-list/dev-obj-frame-list.module').then( m => m.DevObjFrameListPageModule)
  },
  {
    path: 'dev-image-icon-mast-editor',
    loadChildren: () => import('./pages/dev-image-icon-mast-editor/dev-image-icon-mast-editor.module').then( m => m.DevImageIconMastEditorPageModule)
  },
  {
    path: 'text-area',
    loadChildren: () => import('./pages/text-area/text-area.module').then( m => m.TextAreaPageModule)
  },
  {
    path: 'apex-action-filter',
    loadChildren: () => import('./pages/apex-action-filter/apex-action-filter.module').then( m => m.ApexActionFilterPageModule)
  },
  {
    path: 'apex-highlight',
    loadChildren: () => import('./pages/apex-highlight/apex-highlight.module').then( m => m.ApexHighlightPageModule)
  },
  {
    path: 'dev-object-mast-editor',
    loadChildren: () => import('./pages/dev-object-mast-editor/dev-object-mast-editor.module').then( m => m.DevObjectMastEditorPageModule)
  },
  {
    path: 'appkey-collection',
    loadChildren: () => import('./pages/appkey-collection/appkey-collection.module').then( m => m.AppkeyCollectionPageModule),
    canActivate:[LoginGuard]
  },
  {
    path: 'add-to-cart',
    loadChildren: () => import('./pages/add-to-cart/add-to-cart.module').then( m => m.AddToCartPageModule)
  },
  {
    path: 'appkey-info',
    loadChildren: () => import('./pages/appkey-info/appkey-info.module').then( m => m.AppkeyInfoPageModule)
  },
  {
    path: 'beta-version',
    loadChildren: () => import('./pages/beta-version/beta-version.module').then( m => m.BetaVersionPageModule)
  },
  {
    path: 'bypass',
    loadChildren: () => import('./pages/bypass/bypass.module').then( m => m.BypassPageModule)
  },
  {
    path: 'cart-summary',
    loadChildren: () => import('./pages/cart-summary/cart-summary.module').then( m => m.CartSummaryPageModule)
  },
  {
    path: 'change-server-setting',
    loadChildren: () => import('./pages/change-server-setting/change-server-setting.module').then( m => m.ChangeServerSettingPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'freezecolumn',
    loadChildren: () => import('./pages/freezecolumn/freezecolumn.module').then( m => m.FreezecolumnPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'multi-alert-notification',
    loadChildren: () => import('./pages/multi-alert-notification/multi-alert-notification.module').then( m => m.MultiAlertNotificationPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'update-app',
    loadChildren: () => import('./pages/update-app/update-app.module').then( m => m.UpdateAppPageModule)
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
