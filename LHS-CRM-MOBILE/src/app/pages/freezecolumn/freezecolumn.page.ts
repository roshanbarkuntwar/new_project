import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-freezecolumn',
  templateUrl: './freezecolumn.page.html',
  styleUrls: ['./freezecolumn.page.scss'],
})
export class FreezecolumnPage implements OnInit {
getHeads:any;
getheadFromDD:any;
  constructor(public navParams: NavParams, public popOverCtrl: PopoverController) { 
    this.getHeads =JSON.parse(JSON.stringify(this.navParams.data.datahead)) ;
  }

  ngOnInit() {
  }

  dropdwnfreezeVl(event){
   console.log(event.detail);
  }
  sendChoosecolumn(){
    this.popOverCtrl.dismiss(JSON.parse(JSON.stringify(this.getheadFromDD)),"freeze");
  }
  cancel(){
    this.popOverCtrl.dismiss();
  }
}
