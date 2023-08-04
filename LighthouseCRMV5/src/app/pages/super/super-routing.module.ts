import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultiLevelTabPage } from '../multi-level-tab/multi-level-tab.page';
import { FrameCardComponent } from 'src/app/components/frames/frame-card/frame-card.component';

import { SuperPage } from './super.page';

const routes: Routes = [
  {path: '',
  component: SuperPage},
  // {path:'entry-list', component:EntryListPage},
  {path:'app-multi-level-tab', component:MultiLevelTabPage},
  {path:'app-frame-card', component:FrameCardComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperPageRoutingModule {}
