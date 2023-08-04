import { literal } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { ExecutedTabPage } from '../executed-tab/executed-tab.page';
import { PendingTabPage } from '../pending-tab/pending-tab.page';

@Component({
  selector: 'app-sql-light-tran',
  templateUrl: './sql-light-tran.page.html',
  styleUrls: ['./sql-light-tran.page.scss'],
})
export class SqlLightTranPage implements OnInit {
  pendingTab = PendingTabPage;
  executedTab =ExecutedTabPage;
  activeTab:any = 'PENDING-TAB';
  
  constructor(public modalController: ModalController, public platform:Platform) {}

  ngOnInit() {
  }

  navigatePage(tab) {
    this.activeTab = tab;
  }

  
  closePage(){
    this.modalController.dismiss();
  }


}

