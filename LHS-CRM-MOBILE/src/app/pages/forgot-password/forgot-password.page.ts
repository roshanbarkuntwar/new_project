import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Router } from '@angular/router';
// declare var SMSReceive: any;



@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  public shouldHeight: any;
  public userCode: any;
  userdetail: any;
  otpSent: boolean = false;
  otp: any;
  usrOtp;
  message:any = "";
  constructor(private modalCtrl: ModalController,  public location: Location,private router :Router , private dataService: DataService, private globalObjects: GlobalObjectsService,private platform:Platform) {
    this.shouldHeight = document.body.clientHeight + 'px';
    this.userdetail = this.globalObjects.getLocallData("userDetails");
    if(this.platform.is('ios') || this.platform.is('android')){

      this.start();
    }
  }

  ngOnInit() {
  }


  sendOtp() {
    this.message=""
    console.log(this.userCode)
    this.dataService.getData("sendOTP?loginId=" + encodeURIComponent(this.userCode)).then(res => {
      console.log(res);
      let data: any = res;
      if (data.otpStatus) {
        this.otpSent = data.otpStatus;
        this.otp = data.otp;
        this.message = data.otpSuccessMessage
      }else{
        alert(data.otpErrorMessage);
      }
    }).catch(e => { })
  }

  closePage() {
    this.location.back();
  }

  verifyOtp() {
    this.message=""
    if (this.usrOtp == this.otp) {
      this.router.navigate(['reset-password',this.userCode]);
    }else{
      alert("Please enter valid OTP value.")
    }
  }

  start() {


    // SMSReceive.startWatch(
    //   () => {
    //     console.log('watch started');
    //     document.addEventListener('onSMSArrive', (e: any) => {
    //       console.log('onSMSArrive()');
    //       this.usrOtp = e.data.body.match(/\d+/g);
    //     // this.usrOtp
    //     //  alert(JSON.stringify(this.usrOtp));
    //     });
    //   },
    //   () => { console.log('watch start failed') }
    // )
  }

}
