import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

import { Events } from 'src/app/demo-utils/event/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-partylist',
  templateUrl: './partylist.page.html',
  styleUrls: ['./partylist.page.scss'],
})
export class PartylistPage implements OnInit {
  partyList: any[];

  constructor(private modalCtrl: ModalController, public navParams: NavParams,
    public dataService: DataService, private globalObjects: GlobalObjectsService, private events: Events) { }

  ngOnInit() {
    this.getPartyList();
  }


  closeLov() {
    this.modalCtrl.dismiss();
  }

  getPartyList() {
    //alert(1);
    let userDetails = this.globalObjects.getLocallData("userDetails");
    var data = {
      "parameters": userDetails
    }
    let url = "getPartyList";
    this.dataService.postData(url, data).then(res => {
      console.log(res);
      let data: any = res;
      this.partyList = [];
      if (data.responseStatus == "success") {
        this.partyList = data.responseData;
      }
    })
  }

  selectParty(party) {
    console.log(party);
    // this.events.publish("onSelectParty", party);
    let partyCode = party.partyCode ? party.partyCode : "";
    this.globalObjects.setDataLocally("partyName", party.partyName);
    this.globalObjects.setDataLocally("partyCode", partyCode);
    this.modalCtrl.dismiss(party);

  }


  // setLOVValues(item) {


  //   let values = ""
  //   let codeOfValues = ""

  //   if (values == '' || values == null) {
  //     values = item[this.keyList[1]];
  //     codeOfValues = item[this.keyList[0]];
  //   } else {
  //     values = values + "," + item[this.keyList[1]];
  //     codeOfValues = codeOfValues + "," + item[this.keyList[0]];
  //   }

  //   let result: any = {};
  //   result.value = values;
  //   result.codeOfValues = codeOfValues;
  //   this.modalCtrl.dismiss(result);


  //   this.modalCtrl.dismiss(item);
  // }
}
