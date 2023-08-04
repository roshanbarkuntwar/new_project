import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-dynamicmodal',
  templateUrl: './dynamicmodal.page.html',
  styleUrls: ['./dynamicmodal.page.scss'],
})
export class DynamicmodalPage implements OnInit {

  modalData : any;
  heading:any= [];
  
  constructor(private modalCtrl: ModalController, public platform:Platform) {

   
   }

  ngOnInit() {
    console.log(JSON.stringify(this.modalData));
    if(this.modalData){
        // for(let head of this.modalData.result){
            this.heading = Object.keys(this.modalData.result[0]);
           // alert(this.heading)
        // }
    }
  }

  selectValue(data){
     console.log(JSON.stringify(data));
     this.modalCtrl.dismiss(data);
  }


  closeLov() {
    this.modalCtrl.dismiss();
  }
}
