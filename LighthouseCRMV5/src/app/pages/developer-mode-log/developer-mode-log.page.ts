import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { format } from 'sql-formatter';
import * as copy from 'copy-to-clipboard';
@Component({
  selector: 'app-developer-mode-log',
  templateUrl: './developer-mode-log.page.html',
  styleUrls: ['./developer-mode-log.page.scss'],
})
export class DeveloperModeLogPage implements OnInit {
  formatSql: any = [];
  sqlData: any;
  @Input() data: any;
  logData: any = [];
  beautifyflag: Boolean = false;
  num:number = -1;
  userDetails: any;
  // copyIcon:boolean = false;
  constructor(private modalctrl: ModalController, private http: HttpClient, public globalObjects: GlobalObjectsService) { 
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }
  onrun() {

    this.formatSql = format(this.sqlData, {
      language: 'plsql',
      uppercase: true,
    });
  }
  beautify(data, index, i) {

    console.log(this.logData[i][index])
    this.logData[i][data.key] = format(data.value, {
      language: 'plsql',
      uppercase: true,
    });
    // this.logData[i][data.key] = data.key;
    console.log(this.logData[i][data.value]);
  }
  copySql(data,i){
    var textCopy = this.logData[i][data.key];
    copy(textCopy);
    this.num = i;
   }

  ngOnInit() {

    this.getData(this.data).then((res) => {
      this.logData = res;
    });
    console.log(this.logData);
  }
  closePage() {
    this.modalctrl.dismiss();
  }

  getData(reqData: any) {
    return new Promise((resolve, reject) => {
      let url = this.globalObjects.getScopeUrl() + "getDeveloperModeData"
      if (reqData) {
        this.http.post(url, reqData).subscribe((res: any) => {
          if (res.responseStatus == 'success') {
            resolve(res.responseData);
          } else {
            this.globalObjects.presentAlert(res.responseMsg);
            resolve(res.responseData);
          }
        }, (error) => {
          this.globalObjects.presentAlert("Error 404 url not available...");
          resolve(null);
        })
      }
      else {
        reject();
      }
    })
  }

  clearData() {
    if (this.logData.length > 0) {
      let reqData = {
        frame_seq_id: this.logData[0].APPS_PAGE_FRAME_SEQID
      }
      let url = this.globalObjects.getScopeUrl() + "clearLogData"
      if (reqData.frame_seq_id) {
        this.http.post(url, reqData).subscribe((res: any) => {
          if (res.responseStatus == 'success') {
            this.logData = [];
            this.globalObjects.presentAlert(res.responseMsg);
          } else {
            this.globalObjects.presentAlert(res.responseMsg);
          }
        }, (error) => {
          this.globalObjects.presentAlert("Server error occured please try again later...");
        })
      }
    }
  }

  
}
