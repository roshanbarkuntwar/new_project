import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavParams, ModalController, Events } from '@ionic/angular';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { PouchDBService } from 'src/app/services/pouch-db.service';

@Component({
  selector: 'app-offline-entry-list',
  templateUrl: './offline-entry-list.page.html',
  styleUrls: ['./offline-entry-list.page.scss'],
})
export class OfflineEntryListPage implements OnInit {

  savedEntryList: any = [];
  finalEntryList: any = [];

  constructor(private navParams: NavParams, private modalCtrl: ModalController, private pouchDb: PouchDBService,
    private globalObjects: GlobalObjectsService, private dataService: DataService, private events: Events) {
    this.getData();
  }
  getData() {
    let sp_obj: any = this.navParams;
    this.savedEntryList = sp_obj.data.entryList;
    for (let data of this.savedEntryList) {
      let savedDataMap: any = new Map();
      for (let finalData of data.wsdp) {
        for (let jsonData in finalData) {
          savedDataMap.set(jsonData, finalData[jsonData]);
        }
      }
      this.finalEntryList.push(savedDataMap);
    }

  }
  ngOnInit() {
    // this.events.subscribe("uploadOfflineData", (res1) => {
    //   this.uploadAll().then(res => {
    //     if (res == "success") {
    //       alert("Data Upload Successfully to Server");
    //       // alert("Offline Data Uploaded..");
    //     }
    //   });
    // })
  }
  closePage() {
    this.modalCtrl.dismiss();
  }

  uploadAll() {
    if (this.globalObjects.networkStatus) {
      return new Promise((resolve, reject) => {
        for (let entryData of this.savedEntryList) {
          let data: any = entryData;
          this.dataService.postData("S2U", data).then(res => {
            console.log(res);
            let data: any = res;
            if (data.responseStatus == "success") {
              resolve("success");
              this.savedEntryList = [];
              this.finalEntryList = [];
              this.dataService.deleteAllEntry(entryData);
            }
          })
        }
      })
    }
    else {
      this.globalObjects.presentAlert("Internet Service Should be Start..");
    }
  }
  upload(object, index) {
    console.log(object, index);
    if (this.globalObjects.networkStatus) {
      var data: any = this.savedEntryList[index];
      this.dataService.postData("S2U", data).then(res => {
        this.dataService.deleteEntry(data, index).then(result => {
          this.globalObjects.presentAlert("Record Deleted Successfully..");
        }, err => {
          console.log("Error in Delete Record...");
        });
        console.log(res);
        let dataRes: any = res;
        if (dataRes.responseStatus == "success") {
          this.savedEntryList.splice(index, 1);
          this.finalEntryList.splice(index, 1);
          this.globalObjects.presentAlert("Data Upload Successfully to Server");
        }
      })
    }
    else {
      this.globalObjects.presentAlert("Internet Service Should be Start..");
    }
  }


  deleteRecord(object, index) {
    this.dataService.deleteEntry(object, index).then(res => {
      if (res == "success") {
        this.savedEntryList.splice(index, 1);
        this.finalEntryList.splice(index, 1);
        this.globalObjects.presentAlert("Deleted Successfully..");
      }
    })
  }
  deleteAll() {
    for (let entryData of this.savedEntryList) {
      this.dataService.deleteAllEntry(entryData).then(res => {
        if (res == "success") {
          this.savedEntryList = [];
          this.finalEntryList = [];
          this.globalObjects.presentAlert("All Record Deleted Successfully..");
        }
      })
    }
  }
}
