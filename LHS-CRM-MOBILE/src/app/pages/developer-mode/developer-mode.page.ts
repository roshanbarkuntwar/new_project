import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { IonRouterOutlet, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-developer-mode',
  templateUrl: './developer-mode.page.html',
  styleUrls: ['./developer-mode.page.scss'],
})
export class DeveloperModePage implements OnInit {
  clickedEventData:any;

  constructor(private globbalObject:GlobalObjectsService, private popOverCtrl: PopoverController) { }

  ngOnInit() {
    this.clickedEventData =  this.globbalObject.getLocallData("clickedItem")? this.globbalObject.getLocallData("clickedItem") : "";
    if(this.clickedEventData == ""){
      this.globbalObject.presentAlert("There is no data in developer mode right now...");
    }
  }
  closePopover(){
    this.popOverCtrl.dismiss();
  }

  clearData(){
    this.globbalObject.destroyLocalData('clickedItem');
    this.clickedEventData=[];
   
  }
}
