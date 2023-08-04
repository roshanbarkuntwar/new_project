import { Component, OnInit, Input } from '@angular/core';
import { collapse } from './../../../animation/collapse-animate';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
  animations: [collapse]
})
export class FileTreeComponent implements OnInit {
  @Input() model: any;
  @Input() isChild: boolean;
  @Input() isMainFolder: any;
  @Input() isFile: any;
  @Input() itemData: any;
  l_url : any;
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService,
    private ft: FileTransfer, private file: File,private document: DocumentViewer,private fileOpener: FileOpener,
    public platform: Platform) { }
  ngOnInit() {
    if (this.isMainFolder) {
      this.getData();
    } else {
      this.model.forEach((element: any) => {
        element.isSelect ? element.toggle = 'on' : element.toggle = 'init';
      });
    }
  }

  private toggleItem(item) {
    item.toggle === 'on' ? item.toggle = 'off' : item.toggle = 'on';
  }


  getData() {
   this.globalObjects.showLoading();
     this.l_url = "getFileExplorer?prentFolder=" + encodeURIComponent(this.itemData.format_mask);
     console.log("l-url",this.l_url)
    this.dataService.getData(this.l_url).then(res => {
      this.globalObjects.hideLoading();
      let data: any = res;
      if (data.responseStatus == "success") {
        this.model = [];
        this.model.push(data.responseData);
        this.model.forEach((element: any) => {
          element.isSelect ? element.toggle = 'on' : element.toggle = 'init';
        });
      }
    }).catch(err => {
      console.log('vijay frame-table.component.ts Something went wrong :', err);
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }


  getMIMEtype(extn){
    let ext=extn.toLowerCase();
    let MIMETypes={
      'txt' :'text/plain',
      'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc' : 'application/msword',
      'pdf' : 'application/pdf',
      'jpg' : 'image/jpeg',
      'bmp' : 'image/bmp',
      'png' : 'image/png',
      'xls' : 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf' : 'application/rtf',
      'ppt' : 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'mp3' : 'audio/mpeg',
      'mpeg' : 'video/mpeg',
      'wav' : 'audio/wav',
      'weba' : 'audio/webm',
      'webm' : 'video/webm',
      'wmv' :	'video/x-ms-wmv',
      'mp4' : 'video/mp4'

    }
    return MIMETypes[ext];
  }
  
  DownloadandOpenPdf(filepath, filename) {
    let fileExtn=filename.split('.').reverse()[0];
    // alert(fileExtn)
    let fileMIMEType=this.getMIMEtype(fileExtn);
    
    // alert(fileMIMEType)
    
   
    // alert("filepath>>" + filepath + ", filename>>>" + filename);
    // let downloadUrl1 = 'http://192.168.100.149:8888/lhsws/LW/192.168.100.173/1521/LWEBTEST/LWEBTEST/ORA10G/downloadFile?file=' + encodeURIComponent(filepath);
    // console.log(downloadUrl1)
    let  downloadUrl= this.globalObjects.getScopeUrl() + 'downloadFile?file=' + encodeURIComponent(filepath);
    // console.log(downloadUrl)
    
    
    let path = this.file.externalRootDirectory + "/LHSAPP/";
    // alert("path"+path)
    const transfer = this.ft.create();
    // alert("transfer........>>>>>>"+JSON.stringify(transfer))
    this.globalObjects.displayCordovaToast("Please wait download started...");
    transfer.download(downloadUrl, path + filename).then(entry => {
      this.l_url = entry.toURL();
      this.globalObjects.displayCordovaToast("Download complete...");
    //  alert(this.l_url)

      if (this.platform.is('ios')) {
        this.document.viewDocument(this.l_url, fileMIMEType, {});
      } else {
        
        this.fileOpener.open(this.l_url, fileMIMEType)
          .then(() => console.log('File is opened'))
          .catch(e => this.globalObjects.presentAlert("file is" + JSON.stringify(e)));
      }
    });
  }
}




// export const collapse = [
//   trigger('collapse', [
//       state('init', style({ height: 0 })),
//       state('off', style({ height: 0 })),
//       state('on', style({ height: '*' })),
//       transition('* => on', [animate('400ms cubic-bezier(.39,.8,.5,.95)')]),
//       transition('on => off', [animate('400ms cubic-bezier(.39,.8,.5,.95)')]),
//       transition('init => off', [animate('0s')])
//   ])
// ];
