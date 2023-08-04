import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-image-icon-master',
  templateUrl: './image-icon-master.page.html',
  styleUrls: ['./image-icon-master.page.scss'],
})
export class ImageIconMasterPage implements OnInit {
  file: any;
  constructor(private modalCtrl: ModalController, private dataService: DataService) { }
  importImages: any = [];
  requestImport: any = []
  storageRef: any = [];
  isEnabledExport: boolean = false;
  isEnabledImport: boolean = false;
  isEnabledImportChoose: boolean = true;
  downloadStatus: boolean = false;
  uploadStatus: boolean = false;
  downloadItem = [];
  uploadItem = [];
  remainingItem = '';
  loading: boolean = false;
  completeDownload: boolean = false;
  totalDownloadCount: number = 0;
  remainingDownloadCount: number = 0;
  percentage: any = 0;
  serverMsg: any ='';
  serverMessage: boolean = false;
  errorMessage: boolean = false;
  responceError: boolean = false;
  responseKey = [];
  errorMsg = [];

  ngOnInit() {
  }

  closePage() {
    this.modalCtrl.dismiss();
  }

  importZipImages() {
    this.errorMsg = [];
    this.errorMessage = false;
    this.serverMessage = false;
    this.responceError = false;
    this.isEnabledImport = false;
    this.isEnabledImportChoose = false;
    this.isEnabledExport = true;
  }

  async exportImages() {
    this.serverMessage = false;
    this.uploadStatus = false;
    this.storageRef = [];
    this.responceError = false;
    this.isEnabledImport = true;
    this.isEnabledImportChoose = true;
    this.loading = true;
    let url = 'imageIconMaster';
    let tableName = 'lhswma_image_icon_mast';

    let data = {
      "tableName": tableName,
    }

    this.dataService.postDataDev(url, data).then(async (res: any) => {
      let result = res.responseData
      this.storageRef = Object.keys(res.responseData);
      const jszip = new JSZip();
      let themeName: string;
      this.loading = false;
      for (let theme in result) {
        this.downloadStatus = true;
        this.downloadItem.push(theme);
        this.totalDownloadCount = result[theme].length;
        this.storageRef.shift();
        for (let i = 0; i < result[theme].length; i++) {
          let img = await fetch('data:image/jpeg;base64,' + result[theme][i][0]);
          themeName = result[theme][i][2];
          let fileName = result[theme][i][3];
          jszip.file(fileName + '.PNG', await img.blob());
          this.remainingDownloadCount = i;
          this.percentage = ((this.remainingDownloadCount / this.totalDownloadCount) * 100).toFixed(2);
          if (i == result[theme].length - 1) {
            let folderName = themeName + '.zip';
            jszip.generateAsync({ type: 'blob' }).then(function (content) {
              saveAs(content, folderName);
            });
          }
        }
      }

      this.downloadStatus = false;
      this.completeDownload = true;
      setTimeout(() => {
        this.completeDownload = false;
      }, 9000);

      this.isEnabledImport = false;
      this.isEnabledImportChoose = true;

    }).catch(err => {
      alert("Unable to process your request, try again later...");
      this.loading = false;
      this.isEnabledImport = false;
      this.isEnabledImportChoose = true;
     // console.log(err)

    })
  }


  async changeListener($event) {
    this.storageRef = [];
    this.uploadItem = [];
    this.importImages = [];
    this.uploadStatus = true;
    for (let j = 0; j < $event.target.files.length; j++) {
      this.storageRef.push(JSON.parse(JSON.stringify(($event.target.files[j].name).split('.')[0]).trim()));
    }
    for (let i = 0; i < $event.target.files.length; i++) {
      this.uploadItem.push((($event.target.files[i].name).split('.')[0]).trim());
      this.storageRef.shift();
      await this.unzipContent($event.target.files[i]).then((data: any) => {
        if (Object.keys(data)[0] == "wrongFolder") {
          this.errorMsg.push(JSON.parse(JSON.stringify(data["wrongFolder"].name)));
          this.errorMessage = true;
          this.uploadItem.pop();
        }
        else {
          this.importImages = this.importImages.concat(data);
          console.log(this.importImages)
        }
        if ($event.target.files.length == i + 1) {
          this.sendimportData(this.importImages);
        }
      }, error => {
        console.log(error)
      });
    }
  }

  unzipContent(dataFile) {
    return new Promise((resolve, reject) => {
      var zip = new JSZip();
      let icon_image = (dataFile.name).split('.')[0];
      let reqFolder: any = [];
      let count = 0;
      this.totalDownloadCount;
      zip.loadAsync(dataFile).then(async (contents) => {
        this.totalDownloadCount = Object.keys(contents.files).length;
        await Object.keys(contents.files).forEach(async (filename) => {

          if (contents.files[filename].dir != true) {

            await zip.file(filename).async('base64').then(async (content) => {

              this.remainingDownloadCount = count++;

              this.percentage = ((this.remainingDownloadCount / this.totalDownloadCount) * 100).toFixed(2);

              await reqFolder.push({ icon_image: content, apps_icon_theme: icon_image, apps_icon_name: filename.split('.')[0] });
            }, error => reject(error));
          } else {
            resolve({ wrongFolder: contents.files[filename] });
          }
          if (Object.keys(contents.files).length == reqFolder.length) {
            resolve(reqFolder);
          }

        }, error => reject(error));
      }, error => {
        reject(error);
      });
    })
  }

  sendimportData(data) {
    this.uploadStatus = false;
    let url = 'importImages';
    this.isEnabledImportChoose = true;
    this.isEnabledExport = false;
    this.loading = true;
    let reqData = {
      "reqData": data,
    }
    this.dataService.postDataDev(url, reqData).then(async (res: any) => {
      this.serverMessage = true;
      this.serverMsg = res.responseMsg;
      if (Object.keys(res.responseData).length > 0) {
        this.responceError = true;
        for (let obj in res.responseData) {
          this.responseKey.push({ key: obj, value: res.responseData[obj] });
        }
      }
      this.loading = false;
      this.storageRef = [];
      this.uploadItem = [];
      this.importImages = [];
    }).catch(err=>{
     // console.log(err);
      alert("Unable to process your request, try again later...")
      this.loading = false;
      this.storageRef = [];
      this.uploadItem = [];
      this.importImages = [];
    });
  }
}
