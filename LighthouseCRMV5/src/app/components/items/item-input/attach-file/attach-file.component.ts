import { Component, OnInit, Input } from '@angular/core';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { DataService } from 'src/app/services/data.service';
import { Base64 } from '@ionic-native/base64/ngx';
import { Platform } from '@ionic/angular';
import { platform } from 'os';

@Component({
  selector: 'app-attach-file',
  templateUrl: './attach-file.component.html',
  styleUrls: ['./attach-file.component.scss'],
})
export class AttachFileComponent implements OnInit {

  @Input() fileInput : any;
  filepaths: any = [];
  fileToUpload = [];
  l_url: any;
  plt:any = '';
  constructor(private filePath: FilePath, private platform: Platform,
    private fileChooser: FileChooser, public dataservice: DataService, private base64: Base64) { }

  ngOnInit() {
    if(this.platform.is("android")){
      this.plt = 'android';
    }else if(this.platform.is('ios')){
      this.plt = 'ios';
    }else{
      this.plt = 'browser';
    }
  }
  upload() {
    let filePath: string = 'file:///...';
    this.base64.encodeFile(filePath).then((base64File: string) => {

      console.log(base64File);
      alert("base64File..in string format.." + JSON.stringify(base64File));
    }, (err) => {
      console.log(err);
    });
  }

  uplaod2() {

    if(this.plt = "android"){
      this.fileChooser.open().then((data) => {
        // alert("chooser " + data);
        this.filePath.resolveNativePath(data).then(filePath => {
          alert("filepath " + filePath)
          this.base64.encodeFile(filePath).then(base64File => {
            // alert("base64 " + base64File);
            let fd = new FormData();
            fd.append('files', base64File);
            this.fileInput.value = base64File;
            this.fileInput.value = base64File.split(",")[1];
            // this.dataservice.postData('uploadfile', fd).then(data => {
            //   alert(data);
            // }).catch(err => {
            //   alert("err in post=> " + err);
            // });
          }).catch(err => {
            alert("erreur base64 => " + err);
          });
        }).catch(err => {
          alert("erreur filepath => " + err)
        });
      }).catch((error) => {
        alert("erreur chooser => " + error);
      })
    }else{

    }
  }

  // upload

}
