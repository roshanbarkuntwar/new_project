import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ModalController } from '@ionic/angular';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  password :any;
  confPassword :any;
  userCode: any;
  constructor(private route:ActivatedRoute,private dataservice : DataService,private router:Router,private modalctrl:ModalController, private globalObjects:GlobalObjectsService ) { }

  ngOnInit() {
    this.userCode =this.route.snapshot.params.id;
    console.log(this.userCode);
  }

  resetPassword(){
    if(this.password != this.confPassword){
      this.globalObjects.presentAlert('Password Mismatch.');
    }else{

      this.dataservice.getData("resetPasword?loginId="+encodeURIComponent(this.userCode)+'&password='+encodeURIComponent(this.password)).then(res=>{
        console.log(res);
        let data:any;
        data=res;
        if(data.updateStatus){
          let res = data.updateStatus.split('#');
          if(res[0]=="Q"){
            alert(res[1]);
          }else if(res[0] == "F"){
            alert(res[1]);
            this.router.navigate(['login']);
          }else{
            this.router.navigate(['login']);
          }
        }

      });

    }
  }
  closePage(){
    this.modalctrl.dismiss();
  }

}
