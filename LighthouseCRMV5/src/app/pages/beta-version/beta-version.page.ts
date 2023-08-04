import { AlertController } from '@ionic/angular';
import { GlobalObjectsService } from './../../services/global-objects.service';
import { Market } from '@ionic-native/market/ngx';
import { DataService } from './../../services/data.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-beta-version',
  templateUrl: './beta-version.page.html',
  styleUrls: ['./beta-version.page.scss'],
})
export class BetaVersionPage implements OnInit {
  url: any;
  fileList: any[];
  showFile: any[];
  orderByParam: any = {};
  direction: any = 0;
  fileDate: any[] =[];
  constructor(private router: Router, private alertController: AlertController,
    private dataservice: DataService, private http:HttpClient,
    private market: Market, private globalObjects: GlobalObjectsService,
    private downloader: Downloader) { }

  ngOnInit() {

    this.url = "http://203.193.167.118:8888/lhsws/LW/192.168.100.173/1521/" + this.globalObjects.getLocallData('appKey') + "/" 
               + this.globalObjects.getLocallData('appKey') + "/ORA10G" + "/getFileExplorer?prentFolder=" + encodeURIComponent('C:\\LHSAppStore');
    // this.url = "getFileExplorer?prentFolder=" + encodeURIComponent('E:\\APP_LIVE_FOLDER');
    this.globalObjects.showLoading();
    console.log("url",this.url);
    this.http.get(this.url).subscribe((res: any) => {
      if (res.responseStatus == 'success') {
        this.fileList = res.responseData.files;
        this.fileList = this.fileList.filter(data => {
          return data.fileName.includes("NEWERP");
        })
        this.thClick();
        this.fileList = this.fileList.slice(0, 5);

        this.fileList.filter(data =>{
          let date1 = data.fileName.split('_')[4].split('.')[0].split('');
          let date = date1[6] + date1[7] + "-" + date1[4] + date1[5] + '-' + date1[0] + date1[1] + date1[2] + date1[3];
          this.fileDate.push(date);
        });
        this.globalObjects.hideLoading()
      }
      else {
        this.globalObjects.presentAlert("Unable to process your request..");
        this.globalObjects.hideLoading()
      }
     
    })
  }
  closePage() {
    this.router.navigate(['super']);
  }

  downloadApk(filename, filepath) {

    let downloadUrl = this.globalObjects.getScopeUrl() + 'downloadFile?file=' + encodeURIComponent(filepath);
    //let path = this.file.externalRootDirectory;

    // const transfer = this.ft.create();
    // alert("File downloading in progress..."); 
    // this.file.checkDir(directoryPath, 'MyDownload').then(()=>{
    //   alert("Folder exist")
    // },
    // (err)=>{
    //   this.file.createDir(directoryPath, 'MyDownload', false).then(()=> alert("Directory created"),
    //     err => alert("File Create Error: "+JSON.stringify(err))
    //   );
    //   alert("Folder not exist.")
    // })
    // directoryPath = directoryPath + '/MyDownload/';
    // transfer.download(downloadUrl, directoryPath + filename).then(entry => {
    //   alert("File download complete.") 
    // });
    this.globalObjects.presentToast
    let req: DownloadRequest = {
      uri: downloadUrl,
      title: filename,
      description: '',
      mimeType: '',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
        dirType: 'Download',
        subPath: filename
      }
    }

    this.alertController.create({
      //header: 'Confirm!',
      message: 'Please confirm download!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel click');
          }
        }, {
          text: 'Download',
          handler: () => {
            this.downloader.download(req).then((path) => {
              this.globalObjects.presentAlert("File location: " + path)
            }).catch((err: any) => {
              this.globalObjects.presentAlert("Error: " + JSON.stringify(err));
            })
          }
        }
      ]
    }).then((alert) => { alert.present() })

  }

  openInPlayStore() {
    this.market.open('com.lhs.lhsapprevartwo');
  }

  thClick(): any {
    if (this.direction == 0) {
      this.fileList = this.fileList.sort((a, b): any => {
        return a.fileName.split('_')[4] > b.fileName.split('_')[4] ? -1 : 1;
      })
      this.direction = 1;
    }
    else {
      this.fileList = this.fileList.sort((a, b): any => {
        return a.fileName.split('_')[4] > b.fileName.split('_')[4] ? 1 : -1;
      })
      this.direction = 0;
    }
  }
}
