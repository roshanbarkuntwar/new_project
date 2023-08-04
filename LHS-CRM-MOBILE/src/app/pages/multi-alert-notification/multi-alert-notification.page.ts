import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-multi-alert-notification',
  templateUrl: './multi-alert-notification.page.html',
  styleUrls: ['./multi-alert-notification.page.scss'],
})
export class MultiAlertNotificationPage implements OnInit {

  constructor(private pop:PopoverController) { }

  ngOnInit() {
  }
  closeAlert(){
   this.pop.dismiss();
  }
}
