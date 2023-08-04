import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dev-frame-item-list',
  templateUrl: './dev-frame-item-list.page.html',
  styleUrls: ['./dev-frame-item-list.page.scss'],
})
export class DevFrameItemListPage implements OnInit {

  baseImg:any;
  itemData:any = [];


  constructor(public popOverCtrl: PopoverController, private dataServ: DataService) { }


  ngOnInit() {
    this.getData();
  }

  getData(){
    this.dataServ.getDataDev("devItemMast").then((res:any) => {
      if(res.responseStatus == 'success')
      this.itemData = res.responseData;
      console.log(res);
    })
  }


  popDismissN(data) {
    if(data && data.object_code){
      console.log(data);

      this.popOverCtrl.dismiss(data);
    }else{
      this.popOverCtrl.dismiss();
    }
    // this.openPage( this.globalObjects.mydatavariable);
  }

  popDismiss(){
    this.popOverCtrl.dismiss();
  }


  onImgError(event){
    event.target.src = './assets/imgs/no_image.png'
   //Do other stuff with the event.target
   }

}
