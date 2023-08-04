import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { SuperPage } from './super.page';
// import { EntryListPage } from '../entry-list/entry-list.page';
import { MultiLevelTabPage } from '../multi-level-tab/multi-level-tab.page';
import { FrameCardComponent } from 'src/app/components/frames/frame-card/frame-card.component';
import { DragDropModule  } from '@angular/cdk/drag-drop'
import { DeveloperModePage } from '../developer-mode/developer-mode.page';
import { DevFrameItemListPage } from '../dev-frame-item-list/dev-frame-item-list.page';
import { ObjectMastEditorPage } from '../dev-object-mast-editor/object-mast-editor.page';
import { DevFrameMastEditorPage } from '../dev-frame-mast-editor/dev-frame-mast-editor.page';
import { DevImageIconMastEditorPage } from '../dev-image-icon-mast-editor/dev-image-icon-mast-editor.page';
import { DevClickEventsPage } from '../dev-click-events/dev-click-events.page';
import { Component2Module } from 'src/app/components/component2/component2.module';
import { ParentMenuPage } from '../parent-menu/parent-menu.page';



const routes: Routes = [
  {path: '',
  component: SuperPage},
  // {path:'entry-list', component:EntryListPage},
  {path:'app-multi-level-tab', component:MultiLevelTabPage},
  {path:'app-frame-card', component:FrameCardComponent},
];

// <ion-item  [routerLink]="[p.url]" routerDirection="forward">
/*{path: '',redirectTo: 'super',pathMatch: 'full'},*/
@NgModule({
  imports: [
    CommonModule,
    Component2Module,
    ComponentsModule,
    FormsModule,
    IonicModule,
    DragDropModule,
    RouterModule.forChild(routes),
    
    
  ],
  declarations: [SuperPage,MultiLevelTabPage, DeveloperModePage,DevFrameItemListPage, ObjectMastEditorPage, DevFrameMastEditorPage, DevImageIconMastEditorPage,ParentMenuPage],
  entryComponents: [SuperPage,MultiLevelTabPage, DeveloperModePage,DevFrameItemListPage, ObjectMastEditorPage, DevFrameMastEditorPage, DevImageIconMastEditorPage,ParentMenuPage ],
 
})
export class SuperPageModule {}
