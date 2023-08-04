import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BackgroundService } from 'src/app/services/background.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  constructor(private navCtrl: NavController,
    public backgroundProvider: BackgroundService,
    private globalObject : GlobalObjectsService
  ) {

  }

  ngOnInit() {
  }

  click() {
    this.navCtrl.navigateForward(['home']);
  }


  public start(interval) {
    console.log("start function clicked");
    if (interval) {
      this.globalObject.setDataLocally("interval", interval);
     // localStorage.setItem("interval", interval);
      this.backgroundProvider.start(interval);
    } else {
      this.globalObject.presentAlert("Please enter Interval in secounds");
    }
  }


  public stop() {
    this.backgroundProvider.stop();
    console.log("end function clicked")
  }

}
