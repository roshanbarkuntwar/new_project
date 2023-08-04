import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperPageRoutingModule } from './super-routing.module';

import { SuperPage } from './super.page';
import { ComponentsModule } from '../../components/components.module';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { MultileveltabsearchPipe } from 'src/app/pipes/multileveltabsearch.pipe';
import { MultiLevelTabPage } from '../multi-level-tab/multi-level-tab.page';
import { DeveloperModePage } from '../developer-mode/developer-mode.page';
import { DevFrameItemListPage } from '../dev-frame-item-list/dev-frame-item-list.page';
import { DevFrameMastEditorPage } from '../dev-frame-mast-editor/dev-frame-mast-editor.page';
import { DevImageIconMastEditorPage } from '../dev-image-icon-mast-editor/dev-image-icon-mast-editor.page';
import { DevObjectMastEditorPage } from '../dev-object-mast-editor/dev-object-mast-editor.page';
import { ParentMenuPage } from '../parent-menu/parent-menu.page';
import { Component2Module } from 'src/app/components/component2/component2.module';
import {DragDropModule,CdkDropList} from '@angular/cdk/drag-drop';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperPageRoutingModule,
    ComponentsModule,
    Component2Module,DragDropModule
  ],
  declarations: [SuperPage,MultiLevelTabPage, DeveloperModePage,DevFrameItemListPage, DevObjectMastEditorPage, DevFrameMastEditorPage, DevImageIconMastEditorPage,ParentMenuPage],
  entryComponents: [SuperPage,MultiLevelTabPage, DeveloperModePage,DevFrameItemListPage, DevObjectMastEditorPage, DevFrameMastEditorPage, DevImageIconMastEditorPage,ParentMenuPage],
  providers :[SearchfilterPipe,DatePipe,MultileveltabsearchPipe,CdkDropList]
})
export class SuperPageModule {}
