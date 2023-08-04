import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartylistPage } from './partylist.page';

const routes: Routes = [
  {
    path: '',
    component: PartylistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartylistPageRoutingModule {}
