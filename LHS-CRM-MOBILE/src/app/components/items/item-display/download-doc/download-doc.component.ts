import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { saveAs } from 'file-saver';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { url } from 'inspector';
import { Platform } from '@ionic/angular';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
// import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@Component({
  selector: 'app-download-doc',
  templateUrl: './download-doc.component.html',
  styleUrls: ['./download-doc.component.scss'],
})
export class DownloadDocComponent implements OnInit {
  @Input() doc: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  document: any;
  docFile: any;

  constructor(private dataService: DataService, private globalObject: GlobalObjectsService,
    private plt: Platform, private file: File,  private filePath: FilePath) { }

  ngOnInit() {
    //  console.log(this.doc);
    if(this.doc.value){
      this.document = this.doc.value.split('~');
    }
    //this.showDocument(this.document[0])
  }

  showDocument() {
    // console.log("this is item image", this.displayPhoto)
    this.globalObject.displayCordovaToast("Please wait download started...");
    let doc = this.document[0];
    if (doc) {
      let url = 'getItemImage?query=' + encodeURIComponent(doc);
      if (doc) {
        this.dataService.getData(url)
          .then(res => {
            var data: any = res;
            if (data.status == 'success') {
              this.docFile = data.img;
              this.downloadFile();
            }
          }, err => {
            console.log("DocumentFetchErr " + JSON.stringify(err));
            this.document = null;
          })
      }
    }
    else{
      this.globalObject.presentAlert("Image item query not found.")
    }


  }


  downloadFile() {
    if (this.plt.is("android")) {
      this.globalObject.checkStoragePermission().then((res)=>{
        if(res == 'success'){
          this.download();
        }else{
          this.globalObject.presentAlert("Please grant storage permission to download file.");
        }
      })
    }
    else{
      this.download();
    }
  }

  async download() {
    
    let type = await this.globalObject.getMIMEtype(this.document[1].split(".")[1]);
    this.base64ToArrayBuffer(this.docFile).then((res: any) => {
      let file = new Blob([res], { type: type });

      let fileName = this.document[1];
      if(!fileName){
        fileName =  JSON.stringify(Math.floor(Math.random() * (999999 - 100000)) + 100000);
      }
      
      if (this.plt.is("android") || this.plt.is("ios")) {


        let directoryPath = "";
        if (this.plt.is("ios")) {
          directoryPath = this.file.documentsDirectory;
        }
        if (this.plt.is("android")) {
          directoryPath = this.file.dataDirectory;
        }
        this.file.writeFile(directoryPath, fileName, file, { replace: true })
          .then(fileEntry => {
            if (fileEntry) {
              if (fileEntry.isFile) {
                this.globalObject.displayCordovaToast("File Downloaded");
              }
              this.file.checkFile(directoryPath, fileName).then((exist => {
                this.filePath.resolveNativePath(directoryPath + fileName).then((pathIs => {
                }));
                if (this.plt.is("ios")) {
                  this.document.viewDocument(directoryPath + fileName, type, {});
                } else {
                  // let mimetype = type;
                  // this.fileOpener.open(directoryPath + fileName, mimetype)
                  //   .then((exist) => console.log('File is opened' + JSON.stringify(exist)))
                  //   .catch(e => this.globalObject.presentAlert("file is" + JSON.stringify(e)));
                  //   console.log(this.fileOpener)
                }
              })
              ).catch(err => {
                this.globalObject.presentAlert('Directory' + JSON.stringify(err));
              });
            }
            this.globalObject.displayCordovaToast("Download complete...");
          })
          .catch(err => {
            this.globalObject.displayCordovaToast("File format not supported...");
            this.globalObject.presentAlert('Directory does not exist');
          })
      } else {
        saveAs(file, fileName);
      }
    })
  }

  base64ToArrayBuffer(base64) {
    return new Promise((resolve, reject) => {
      var binaryString = window.atob(base64);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      resolve(bytes);
    })
  }

}
