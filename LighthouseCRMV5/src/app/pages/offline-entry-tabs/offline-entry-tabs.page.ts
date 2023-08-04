import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PouchDBService } from 'src/app/services/pouch-db.service';
import { ModalController } from '@ionic/angular';
import { OfflineEntryListPage } from '../offline-entry-list/offline-entry-list.page';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-offline-entry-tabs',
  templateUrl: './offline-entry-tabs.page.html',
  styleUrls: ['./offline-entry-tabs.page.scss'],
})
export class OfflineEntryTabsPage implements OnInit {

  objectMast: any = [];

  constructor(private router: Router, private pouchDb: PouchDBService, private modalCtrl: ModalController, private globalObjects: GlobalObjectsService) { }

  ngOnInit() {
    this.pouchDb.getAll().then(res => {
      this.objectMast = res;
      // console.log(this.objectMast);
    });
  }
  closePage() {
    this.modalCtrl.dismiss();
  }

  doAction(event) {
    if (event.entryList.length > 0) {
      this.showUserModal(event)
    } else {
      this.globalObjects.presentAlert('No Offline Data..');
    }
  }

  async showUserModal(data: any) {
    const modal = await this.modalCtrl.create({
      component: OfflineEntryListPage,
      componentProps: data
    });
    return await modal.present();
  }
}
