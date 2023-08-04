import { Component, OnInit } from '@angular/core';
import { ViewController } from '@ionic/core';
import { NavParams, PopoverController } from '@ionic/angular';
// import { NavParams, NavController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {
  heading: any;
  previous_val :any;
  comment = { val: '' };
  constructor(public navParams:NavParams,public popOverCtrl: PopoverController ) {
    this.previous_val = this.navParams.get('data1');
    this.heading = this.navParams.get('heading');
    this.comment.val = this.previous_val;

   }
  
  ngOnInit() {

  }
  save() {
    let text_data = this.comment.val;
    this.popOverCtrl.dismiss(text_data);
    
  }
  cancelModal() {
    let mydata=this.comment.val
    this.popOverCtrl.dismiss(mydata);
  }
}
