import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-frame-otp',
  templateUrl: './frame-otp.component.html',
  styleUrls: ['./frame-otp.component.scss'],
})
export class FrameOtpComponent implements OnInit {

 // @Input() otpFrameObjCode:any;
  @Input() frame: any = {};
  constructor(private events:Events) { }

  ngOnInit() {
    console.log(this.frame);
  }



  verifyOtp(){
    let res = {
      object_code:this.frame,
      verifiedFlag:"T"
    }
    this.events.publish("verifyOtp",res);
  }

}
