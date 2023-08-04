import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-video-input',
  templateUrl: './video-input.component.html',
  styleUrls: ['./video-input.component.scss'],
})
export class VideoInputComponent implements OnInit {
  @Input() videoInput: any;
  @Output() emitVideoPath: EventEmitter<any> = new EventEmitter<any>();
  rndInt:any;
  platformValue: boolean = true;
  uploadFlag: boolean = false;
  initialFlag: boolean = true;
  uploadedFile: any;
  httpHeaders: any;
  videoLeng: any;
  videoType: any = "";
  width: any = "100%";
  height: any = "50%";
  filePath: any;
  videoCount: number = 0;
  opacity: any = "1";
  btndis: boolean = true;
  uploadVidFilePath: any = "";
  count: any = 0;
  deleteVideo:boolean = false;

  constructor(public modalCtrl: ModalController, public dataService: DataService, public platform: Platform, public file: File) { }

  ngOnInit() {
    this.rndInt = Math.floor(100000 + Math.random() * 900000);
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.platformValue = false;
    }
    this.width = this.videoInput.display_setting_str["width"] == undefined ? this.width : this.videoInput.display_setting_str["width"];
    this.height = this.videoInput.display_setting_str["height"] == undefined ? this.height : this.videoInput.display_setting_str["height"];
    this.filePath = this.videoInput.item_default_value ? this.videoInput.item_default_value : this.videoInput.value;;
  }

  captureVideo() {
    this.btndis = false;
    this.dataService.takeVideo().then((videoRes: any) => {
      var videoBase64: any;
      videoBase64 = videoRes.split(",")[1];
      let type = (videoRes.split(";")[0]).split(":")[1];
      this.base64ToArrayBuffer(videoBase64).then((res: any) => {
        let file = new Blob([res], { type: type });
        this.videoType = type;
        this.uploadedFile = file;
        var URL = window.URL;;
        var fileURL = URL.createObjectURL(file)
        var videoNode = document.getElementById(this.rndInt)
        videoNode.setAttribute("src", fileURL)
        this.initialFlag = false;
      });
    })
  }

  clearImage() {
    var videoNode = document.getElementById(this.rndInt)
    videoNode.setAttribute("src", "")
    this.uploadedFile = "";
    this.videoType = "";
    this.filePath = "";
    this.btndis = true;
    this.initialFlag = true;
  }

  selectFile(theme, file) {
    this.btndis = false;
    this.uploadedFile = file;
    var URL = window.URL;;
    var fileURL = URL.createObjectURL(file)
    var videoNode = document.getElementById(this.rndInt)
    videoNode.setAttribute("src", fileURL)
    this.videoType = file.type;
    this.initialFlag = false;
  };

  uploadVideo() {
    if (this.count == 0) {
      if (this.uploadedFile.size < 209715200) {
        this.opacity = "0.2";
        this.uploadFlag = true;
        this.dataService.postMultipartData("uploadVideo", this.uploadedFile, this.videoType, this.filePath).then((res: any) => {
          if (res.responseStatus == "success") {
            let data: any = res.responseData.filepath;
            this.uploadVidFilePath = data;
            this.videoInput.value = data;
            //this.emitVideoPath.emit(this.videoInput);
            alert("video uploaded successfully");
            this.deleteVideo = true;
            this.uploadFlag = false;
            this.opacity = "1";
            this.count = 1
          } else if (res.responseStatus === "error") {
            alert("error while uploading video");
            this.uploadFlag = false;
            this.opacity = "1";
          } else {
            alert("Server Error")
            this.uploadFlag = false;
            this.opacity = "1";
          }
        })
      } else {
        alert("Please Upload less than 200mb video file")
      }

    } else {
      alert("You Can't Upload More Than One Video");
    }
  }

  base64ToArrayBuffer(base64) {
    return new Promise((resolve, reject) => {
      var binaryString = window.atob(base64);
      var binaryLen = binaryString.length;
      this.videoLeng = binaryLen;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      resolve(bytes);
    })
  }

  getParsedJson(json) {
    try {
      if (json) {
        return JSON.parse(json)
      } else {
        return {}
      }
    } catch (err) {
      if (typeof json == 'object') {
        return json;
      } else {
        return {}
      }
    }
  }

  readFile(file) {
    this.btndis = false;
    this.uploadedFile = file;
    var URL = window.URL;;
    var fileURL = URL.createObjectURL(file)
    var videoNode = document.getElementById(this.rndInt)
    videoNode.setAttribute("src", fileURL)
    this.videoType = file.type;
    this.initialFlag = false;
  }

  chooseVideo() {
    this.dataService.takeVideoFromGallay().then((imageData: any) => {
      alert(JSON.stringify(imageData));
      var URL = window.URL;;
      var fileURL = URL.createObjectURL(imageData)
      var videoNode = document.getElementById(this.rndInt)
      videoNode.setAttribute("src", fileURL)
      // this.videoType = file.type;
      // this.initialFlag = false;

      // alert(JSON.stringify(imageData.toURI()));

      // this.file.resolveLocalFilesystemUrl

      // this.getBase64(imageData).then((data:any) => {

      //   this.uploadedFile=data.split(",")[1];
      //  });

      // // this.uploadedFile = imageData[0];
      // alert(JSON.stringify(this.uploadedFile));

      // let type = (this.uploadedFile.split(";")[0]).split(":")[1];
      // alert(JSON.stringify(type));


      // window.resolveLocalFileSystemURL(imageData, function (fileEntry) {
      //   fileEntry.file(function (file) {
      //     alert('got file! '+file);
      //     console.log('File__++ ', file);
      //   });
      // });

      // this.base64ToArrayBuffer(this.uploadedFile).then((res: any) => {
      //   let file = new Blob([res], { type: type });
      //   this.videoType = type;
      //   this.uploadedFile = file;
      //   var URL = window.URL;;
      //   var fileURL = URL.createObjectURL(file)
      //   var videoNode = document.getElementById(this.videoInput.apps_item_seqid)
      //   videoNode.setAttribute("src", fileURL)
      //   this.initialFlag = false;
      // });
      //  this.imageinput.value = imageData.split(",")[1];
      // alert(JSON.stringify(imageData.target.File[0]));
      // this.uploadedFile = imageData;

      // var URL = window.URL;;
      // var fileURL = URL.createObjectURL(imageData)
      // var videoNode = document.getElementById(this.videoInput.apps_item_seqid)
      // videoNode.setAttribute("src", fileURL)
      // this.videoType = imageData.type;
      // this.initialFlag = false;
    },
      (err) => {
        alert(JSON.stringify(err));
      })

  }

  removeItem(){
    var l_url = encodeURI("deleteVideo?videoPath="+this.uploadVidFilePath);
    this.dataService.getData(l_url).then((res:any)=>{
      if(res.status.indexOf("success") > -1){
        this.count = 0;
        this.deleteVideo = false;
        var videoNode = document.getElementById(this.rndInt)
        videoNode.setAttribute("src", "")
        this.uploadedFile = "";
        this.videoType = "";
        this.btndis = true;
        this.initialFlag = true;
      }else{
        alert("Faild to delete video");
      }
    },(err)=> {
      alert(JSON.stringify(err))
    }   )
  }
}


