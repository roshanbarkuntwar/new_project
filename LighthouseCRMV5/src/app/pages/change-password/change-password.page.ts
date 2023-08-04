import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  user: any = {};
  userDetails: any;
  today =  new Date();
  constructor(public platform :Platform, private router: Router, private dataService: DataService, private globalService: GlobalObjectsService, public modalController: ModalController) {
    this.userDetails = globalService.getLocallData('userDetails');
  }

  ngOnInit() {
  }

  closePage() {
    this.modalController.dismiss();
    
  }
   changePassword(user) {
    console.log(user);
    if(user.newPassword && user.cnfPassword && user.oldPassword){
      if (user.newPassword != user.cnfPassword) {
        this.globalService.presentAlert('New password and confirm password is not matching!');
      } else {
        user.login_acc_code = this.userDetails.login_acc_code;
        user.userFlag = this.userDetails.login_user_flag;
        user.user_type = this.userDetails.user_type;
        user.wma_user_code = this.userDetails.wma_user_code;
        user.actual_code = this.userDetails.actual_code;
        var data = {
          "parameters": user
        }
        let url = "changePassword";
  
        console.log(data);
        this.dataService.postData(url, data).then(async (res) => {
          console.log(res);
          let data: any = res;
          let status = data.responseMsg.split('#')[0];
          await this.globalService.presentAlert(data.responseMsg);
          if(status != 'Q'){
            this.modalController.dismiss();
          }
          // this.router.navigate(['super']);
        })
  
      }
    }
    else {
      let tot = this.today.getDate() + this.today.getMonth() + 1 ;
      if(parseInt(user.oldPassword) != NaN){
        if(tot == parseInt(user.oldPassword) && (!environment.production)){
          this.globalService.toggleDevloperModePro = !this.globalService.toggleDevloperModePro;
          this.modalController.dismiss();
        }else{
          this.globalService.presentAlert("Please enter all details...");
        }
      }else{
        this.globalService.presentAlert("Please enter all details...");
      }
    }
  }


}
