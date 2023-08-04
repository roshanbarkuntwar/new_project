import { Router } from '@angular/router';
import { GlobalObjectsService } from './../../services/global-objects.service';
import { AppkeyUserInfoPage } from './../appkey-user-info/appkey-user-info.page';
import { ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-appkey-info',
  templateUrl: './appkey-info.page.html',
  styleUrls: ['./appkey-info.page.scss'],
})
export class AppkeyInfoPage implements OnInit {

  // url: string = "http://192.168.100.157:8888/lhsws/MC/192.168.100.173/1521/MCPLERP/MCPLERP/ORA10G/getAppKeyDetails";
  thead: any[];
  tablerows: any[];
  tablerowsres: any[];
  searchText: string;
  httpHeaders: any;
  selectedRow: number;

  constructor(private router: Router, private http: HttpClient, private modalctrl: ModalController, private globleObj: GlobalObjectsService, private dataservice: DataService) { }

  ngOnInit() {
    let url = "http://203.193.167.118:8888/lhsws/LW/192.168.100.173/1521/LWEBTEST/LWEBTEST/ORA10G/";
    // this.http.get(this.url).subscribe((res: any) => {
    // if(!this.globleObj.getLocallData("appkeyUrl")){
    //   url = this.globleObj.getScopeUrl();
    //   this.globleObj.setDataLocally('appkeyUrl',url);
    // }
    // else{
    //   url = this.globleObj.getLocallData("appkeyUrl") 
    // }
    this.http.get(url+'getAppKeyDetails').subscribe((res: any) => {
    
      let data: any = res.responseData;
      let head = data.HEADING;
      this.thead = head.filter((item)=>{
        if(item != "DATABASE_PASSWORD"){
          return item;
        }
      })
      this.tablerowsres = data.BODY;
      this.tablerows = this.tablerowsres;
      console.log(res);
    },(err) => {
      this.globleObj.presentAlert("Unable to process request..")
    })

  }

  closePage() {
    this.router.navigate(['super']);
  }

  async getUserData(data: any, i: number) {
    this.selectedRow = i;
    console.log(data.seq_no);
    let body = {
      "parameters": data
    };

    this.httpHeaders = new HttpHeaders({
      'Content-Type': ' /json',
    });
    console.log(JSON.stringify(body));
    // if (data.seq_no < 0) {
    //   let url = "getAppKeyUserDetails";
    //   this.dataservice.postData(url, body).then((res: any) => {
    //     let data1: any = res;
    //     if (data1.responseStatus == 'success') {
    //       this.showUserModal(data1.responseData);
    //     } else {
    //       this.globleObj.presentToastWithOptions("Something went wrong, Try after some time...", "errorClass")
    //     }
    //   }, (error) => {
    //     console.log(error);

    //   })
    // }
    // else {
      //this.globleObj.showLoading()
      let url = "http://" + data.server_url + "/lhsws/MC/" + data.database_ip + "/1521/" + data.database_name + "/" + data.database_password + "/" + data.db_sid + "/getAppKeyUserDetails";
      console.log(url);
      this.http.post(url, body, this.httpHeaders)
        .subscribe((data1: any) => {
          console.log(data1);
          //this.globleObj.hideLoading();
          data1.appKeyDetails = data;
          if (data1.responseStatus == 'success') {
            this.showUserModal(data1);
          } else {
            this.globleObj.presentToastWithOptions("Requested Server not Available", "errorClass")
          }
        }, (error) => {
          console.log(error);
         // this.globleObj.hideLoading()
          this.globleObj.presentToastWithOptions("Requested Server not Available", "errorClass");
        })
    // }
  }

  filterTable() { 
    this.tablerows = this.tablerowsres.filter((item: any) => {
      if (item.database_name && item.database_name.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item
      } else  if (item.seq_no && item.seq_no.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item
      } else  if (item.app_key && item.app_key.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item
      } else  if (item.server_url && item.server_url.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item
      } else  if (item.server_name && item.server_name.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item
      } else  if (item.database_ip && item.database_ip.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item
      } else  if (item.device_validation && item.device_validation.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item
      } else  if (item.entity_code_str && item.entity_code_str.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item
      } else  if (item.app_name && item.app_name.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item
      } else  if (item.location_tracking_flag && item.location_tracking_flag.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item
      } else  if (item.db_sid && item.db_sid.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item
      }
      
      // return item.value.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1;
    })
  }

  async showUserModal(data: any) {
    const modal = await this.modalctrl.create({
      component: AppkeyUserInfoPage,
      componentProps: data
    });
    return await modal.present();
  }

}
