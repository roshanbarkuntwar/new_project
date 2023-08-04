import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { GlobalObjectsService } from '../../services/global-objects.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// import {ComponentProps, ModalOptions} from '@ionic/core';

@Component({
  selector: 'app-change-server-setting',
  templateUrl: './change-server-setting.page.html',
  styleUrls: ['./change-server-setting.page.scss'],
})
export class ChangeServerSettingPage implements OnInit {

  authPinForm: FormGroup;

  constructor(public navCtrl: NavController, private fb: FormBuilder,private location: Location, 
              public globalObjects: GlobalObjectsService, private router: Router, public modalCtrl: ModalController) {
                this.authPinForm = this.fb.group({
                  authPin: [null, Validators.compose([Validators.required])]
                });
              }

  ngOnInit() {
  }

  
  async checkAuthPin(value) {
    if (value.authPin === '007') {
      const serverSettingModal = await this.modalCtrl.create({
        component: 'ChangeServerSettingPage',
        componentProps: { paramValue: '' }
      });
      // serverSettingModal.present();
      serverSettingModal.onDidDismiss().then(fieldsData => {
        this.navCtrl.navigateRoot('LoginPage');
      });
      await serverSettingModal.present();
    } else {
      this.globalObjects.displayCordovaToast('setting saved successfully');
      this.navCtrl.navigateRoot('LoginPage');
    }
  }

  cancelPage() {
    this.navCtrl.pop();
  }
  
  goBack() {
    this.location.back();
  }

  changeAppKey() {
    // this.navCtrl.navigateRoot('AppkeyValidationPage');
    this.router.navigate(['appkey-validation']);
  }

  appCollectionPage() {
    // this.navCtrl.navigateRoot('AppKeyCollectionPage');
    this.router.navigate(['appkey-collection']);
  }

}
