import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { AlertController, NavController } from '@ionic/angular';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.page.html',
  styleUrls: ['./image-uploader.page.scss'],
})
export class ImageUploaderPage implements OnInit {
  loginCredentials: any = {};
  login: boolean  = false;
  shouldHeight:any;
  @ViewChild("fileBlue") fileBlue: ElementRef;
  @ViewChild("fileDark") fileDark: ElementRef;
  @ViewChild("fileMaroon") fileMaroon: ElementRef;
  @ViewChild("fileGrey") fileGrey: ElementRef;
  @ViewChild("fileGreen") fileGreen: ElementRef;
  displayBlue: any;
  displayDark: any;
  displayMaroon: any;
  displayGrey: any;
  displayGreen: any;
  defaultImg = "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"

  searchText: string;
  storedImages: any = [];
  storedImagesSearch: any = [];
  hide: boolean = true;
  storageRef = ["theme-blue", "theme-green", "theme-dark", "theme-maroon", "theme-grey"];
  title = ["Theme Blue", "Theme Green", "Theme Dark", "Theme Maroon", "Theme Grey"];

  downloadImages: any = [];
  downloadStatus: boolean = false;
  downloadItem = '';

  toggleView: boolean = false;
  firebaseDisplay:boolean ;
  oracleDisplay:boolean;
  connTitle = '';

  oracleImgName = [];
  searchOracleImgName = [];
  oracleImages = [];
  searchOracleImgs = [];

  loadingImages = false;

  constructor(private router: Router, private storage: AngularFireStorage, private dataService : DataService,
              public globlalobject: GlobalObjectsService, private http:HttpClient,
              private alertController: AlertController,    private navCtrl: NavController) {
                this.shouldHeight = document.body.clientHeight + 'px';
               }

  ngOnInit() {
    this.getFileList();
    this.getOracleImageList();
    this.toggleStorage(this.toggleView);
  }

  doLogin(){
    if(this.loginCredentials.user_code == 'admin' && this.loginCredentials.password == 'admin'){
      this.login = true;
    }
    else{
      this.navCtrl.navigateRoot('super');
      this.globlalobject.presentAlert("Invalid Username or Password.")
    }
  }
  
  inputType = 'password';
  iconName = 'eye-off';

  hideShowPassword() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
    this.iconName = this.iconName === 'eye-off' ? 'eye' : 'eye-off';
  }

  /***********************Oracle Operations*****************************/ 
  getOracleImageList(){
    this.loadingImages = true;
    let nameUnion = [];
    // let url = "http://192.168.100.214:8888/lhsws/MC/192.168.100.173/1521/LWEBTEST/LWEBTEST/ORA10G/listAllImages";
    let url = this.globlalobject.getScopeUrl() + "listAllImages";
    let body = {};
    body['themes'] = this.storageRef;
    this.http.post(encodeURI(url), body).subscribe((res:any)=>{
      console.log(res);
      this.loadingImages = false;
      if(res.responseStatus == "Success"){
        nameUnion = res.responseData.nameUnion;
        this.oracleImgName = res.responseData.nameUnion;
        this.searchOracleImgName = res.responseData.nameUnion;
        let data:any = res.responseData;
        console.log("oracleImgName: "+this.oracleImgName);
        for(let i=0; i<nameUnion.length; i++){
          let newArray = [];
          if(data.themeblue[0].indexOf(nameUnion[i]) > -1){
            newArray.push(data.themeblue[1][data.themeblue[0].indexOf(nameUnion[i])]);
          }
          else{
            newArray.push(this.defaultImg);//no image data
          }
          if(data.themegreen[0].indexOf(nameUnion[i]) > -1){
            newArray.push(data.themegreen[1][data.themegreen[0].indexOf(nameUnion[i])]);
          }
          else{
            newArray.push(this.defaultImg);//no image data
          }
          if(data.themedark[0].indexOf(nameUnion[i]) > -1){
            newArray.push(data.themedark[1][data.themedark[0].indexOf(nameUnion[i])]);
          }
          else{
            newArray.push(this.defaultImg);//no image data
          }
          if(data.thememaroon[0].indexOf(nameUnion[i]) > -1){
            newArray.push(data.thememaroon[1][data.thememaroon[0].indexOf(nameUnion[i])]);
          }
          else{
            newArray.push(this.defaultImg);//no image data
          }
          if(data.themegrey[0].indexOf(nameUnion[i]) > -1){
            newArray.push(data.themegrey[1][data.themegrey[0].indexOf(nameUnion[i])]);
          }
          else{
            newArray.push(this.defaultImg);//no image data
          }
          this.oracleImages.push(newArray);
          this.searchOracleImgs.push(newArray);
        }
        console.log("NewArray", this.oracleImages);
      }
    }, (err)=>{
      console.log(err);
    })
  }

  filterOracleTable(){
    this.oracleImages = [];
    this.oracleImgName = this.searchOracleImgName.filter((item: any) => {
      if (item.toLowerCase().includes(this.searchText.toLowerCase())) {
        let index = this.searchOracleImgName.indexOf(item);
        this.oracleImages.push(this.searchOracleImgs[index]);
        return item;
      }
    })
  }

  clearTableData(){
    this.globlalobject.savingToOracle = true;
    // let url = "http://192.168.100.157:8888/lhsws/MC/192.168.100.173/1521/LWEBTEST/LWEBTEST/ORA10G/cleartableimageiconmast";
       let url = this.globlalobject.getScopeUrl() +  "cleartableimageiconmast";
       this.http.get(encodeURI(url)).subscribe((res:any) =>{
        this.globlalobject.savingToOracle = false;
        console.log(res);
        if(res.responseStatus == "Success"){
          alert(res.responseMsg);
        }else{
          alert(res.responseMsg);
        }
      })
  }

  async saveImagesToOracle(){
    
    this.globlalobject.savingToOracle = true;
    let body = {};
    let themeData = [];
    
    for (let i = 0; i < this.storageRef.length; i++) {
      let imageData = [];
      let nameArray =[];
      let imgArray =[];
      for (let j = 0; j < this.downloadImages[i].length; j++) {
        let imageUrl = "https://firebasestorage.googleapis.com/v0/b/lhswma-image-icon-mast.appspot.com/o/" + this.storageRef[i] + "%2F" + this.downloadImages[i][j] + "?alt=media";
        var res = await fetch(imageUrl);
        let blob = await res.blob();
        this.getBase64(blob).then((data:any) => {
          nameArray.push(this.downloadImages[i][j].substring(0, (this.downloadImages[i][j].lastIndexOf(".") < 0 ? this.downloadImages[i][j].length-1 : this.downloadImages[i][j].lastIndexOf("."))).toUpperCase());
          imgArray.push(data.split(',')[1]);
        })
      }
      imageData.push(nameArray);
      imageData.push(imgArray);
      themeData.push(imageData);
      if(i == this.storageRef.length-1){
        body['themes'] =  this.storageRef;
        body['themeData'] = themeData;
        // let url = "http://192.168.100.157:8888/lhsws/MC/192.168.100.173/1521/LWEBTEST/LWEBTEST/ORA10G/saveAllImages";
        let url = this.globlalobject.getScopeUrl() +  "saveAllImages";
        this.http.post(encodeURI(url), body).subscribe((res:any) =>{
          this.globlalobject.savingToOracle = false;
          console.log(res);
          if(res.responseData.length > 0){
            this.globlalobject.presentAlert("Some icon cannot be saved. Please check icon name length. Check console for rejected icons...")
            console.log("Rejected Icons: "+JSON.stringify(res.responseData));
          }
          else if(res.responseStatus == "Success"){
            this.globlalobject.presentAlert(res.responseMsg);
          }else{
            this.globlalobject.presentAlert(res.responseMsg);
          }
        })
      }
    }
   
  }

  async uploadFiles() {


      this.fileBlue.nativeElement.files[0] ? this.uploadToFirebase('theme-blue', this.fileBlue.nativeElement.files[0]) : '';
      this.fileGreen.nativeElement.files[0] ? this.uploadToFirebase('theme-green', this.fileGreen.nativeElement.files[0]) : '';
      this.fileDark.nativeElement.files[0] ? this.uploadToFirebase('theme-dark', this.fileDark.nativeElement.files[0]) : '';
      this.fileMaroon.nativeElement.files[0] ? this.uploadToFirebase('theme-maroon', this.fileMaroon.nativeElement.files[0]) : '';
      this.fileGrey.nativeElement.files[0] ? this.uploadToFirebase('theme-grey', this.fileGrey.nativeElement.files[0]) : '';
    
    this.fileBlue.nativeElement.files[0] ? this.fileBlue.nativeElement.value = "" : '';
    this.fileGreen.nativeElement.files[0] ? this.fileGreen.nativeElement.value = '' : '';
    this.fileDark.nativeElement.files[0] ? this.fileDark.nativeElement.value = '' : '';
    this.fileMaroon.nativeElement.files[0] ? this.fileMaroon.nativeElement.value = '' : '';
    this.fileGrey.nativeElement.files[0] ? this.fileGrey.nativeElement.value = '' : '';
    this.displayBlue = '';
    this.displayDark = '';
    this.displayMaroon = '';
    this.displayGrey = '';
    this.displayGreen = '';

  }

  async uploadToFirebase(dir, file) {
    
    if (this.storedImagesSearch.indexOf(file.name) > -1) {
      const alert = await this.alertController.create({

        header: 'Replace existing file!',
        message: 'File with the ' + file.name + ' already exist, do you want to continue?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Continue',
            handler: () => {
              this.globlalobject.savingToOracle = true;
              const path = dir + '/' + file.name
              const uploadTask = this.storage.upload(
                path,
                file
              );

              uploadTask.then(async res => {
                this.uploadFileToOracle(dir,file);
                if (this.storedImages.indexOf(file.name) == -1) {
                  this.storedImages.unshift(file.name);
                  this.storedImagesSearch.unshift(file.name);
                  let index = this.storageRef.indexOf(dir);
                  if (this.downloadImages[index].indexOf(file.name) == -1) {
                    this.downloadImages[index].push(file.name);
                  }
                } else {
                  this.getFileList();
                }
                this.globlalobject.savingToOracle = false;
                this.globlalobject.displayCordovaToast("File uploaded successfuly...");
              });
            }
          }
        ]
      });

      await alert.present();
    } else {
      this.globlalobject.savingToOracle = true;
      const path = dir + '/' + file.name
      const uploadTask = this.storage.upload(
        path,
        file
      );

      uploadTask.then(async res => {
        this.uploadFileToOracle(dir,file);
        this.storedImages.unshift(file.name);
        this.storedImagesSearch.unshift(file.name);
        this.globlalobject.displayCordovaToast("File uploaded successfuly...");
        this.globlalobject.savingToOracle = false;
        //this.getFileList();
      });

      // uploadTask.percentageChanges().subscribe(change => {
      //   //this.uploadProgress = change;
      // });
    }

  }

  uploadFileToOracle(dir, file){
    let body = {};
    this.getBase64(file).then((data:any) => {
      body['theme'] = dir;
      body['imageName'] = file.name.split('.')[0];
      body['image'] = data.split(',')[1];
      // let url = "http://192.168.100.214:8888/lhsws/MC/192.168.100.173/1521/LWEBTEST/LWEBTEST/ORA10G/saveImage";
      let url = this.globlalobject.getScopeUrl() + "saveImage"
      this.http.post(encodeURI(url), body).subscribe((res:any) =>{
        if(res.responseStatus == 'Success'){
          this.getOracleImageList();
        }else{
          alert(res.responseMsg)
        }
        console.log(data);
      })
    })
  }

  deleteFileInOracle(dir, fileName){
    let body = {};
      body['theme'] = dir;
      body['imageName'] = fileName.split('.')[0];
      // let url = "http://192.168.100.214:8888/lhsws/MC/192.168.100.173/1521/LWEBTEST/LWEBTEST/ORA10G/deleteImage";
      let url = this.globlalobject.getScopeUrl() + "deleteImage";
      this.http.post(encodeURI(url), body).subscribe((res:any) =>{
        if(res.responseStatus == 'Success'){
          this.getOracleImageList();
        }else{
          console.log("Oracle: ",res.responseMsg)
        }
      })
  }
/***********************Firebase Storage Operations*****************************/ 
  getFileList() {
    this.storedImages = [];
    this.storedImagesSearch = [];
    for (let i = 0; i < this.storageRef.length; i++) {
      let imageName = [];
      const storageRef = firebase.storage().ref(this.storageRef[i]);
      storageRef.listAll().then(result => {
        console.log("List: ", result);
        result.items.forEach(ref => {
          // images.push({
          //   name: ref.name,
          //   full: ref.fullPath,
          //   url: await ref.getDownloadURL(),
          //   ref: ref
          // });
          // images.push(ref.name);
          imageName.push(ref.name);
          if (this.storedImages.indexOf(ref.name) == -1) {
            this.storedImages.push(ref.name);
            this.storedImagesSearch.push(ref.name);
          }
        });
      });
      this.downloadImages.push(imageName);
    }
    console.log("Images:", this.downloadImages);
  }

  filterTable() {
    this.storedImages = this.storedImagesSearch.filter((item: any) => {
      if (item.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item;
      }
    })
  }

  deleteFile(ref) {
    let index = this.downloadImages[this.storageRef.indexOf(ref.split('/')[0])].indexOf(ref.split('/')[1]);
    if (index > -1) {
      this.downloadImages[this.storageRef.indexOf(ref.split('/')[0])].splice(index, 1);
    }
    this.storage.ref(ref).delete();
    this.deleteFileInOracle(ref.split('/')[0], ref.split('/')[1])
    this.globlalobject.displayCordovaToast("File deleted successfuly...");
  }

  async  backupAllImages() {

    const alert = await this.alertController.create({

      header: 'Backup All Images',
      message: 'Please continue to backup...',
      buttons: [
        {
          text: 'Cancel',
          role: ' ',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Continue',
          handler: () => {
            this.downloadZip();
          }
        }
      ]
    });

    await alert.present();
  }

  async downloadZip() {
    for (let i = 0; i < this.storageRef.length; i++) {
      this.downloadItem = this.storageRef[i];
      const jszip = new JSZip();
      for (let j = 0; j < this.downloadImages[i].length; j++) {
        this.downloadStatus = true;
        let imageUrl = "https://firebasestorage.googleapis.com/v0/b/lhswma-image-icon-mast.appspot.com/o/" + this.storageRef[i] + "%2F" + this.downloadImages[i][j] + "?alt=media";
        var res = await fetch(imageUrl);
        let blob = await res.blob();
        jszip.file(this.downloadImages[i][j], blob);
        if (j === (this.downloadImages[i].length - 1)) {
          let fileName = this.storageRef[i] + '.zip';
          jszip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, fileName);
          });
          this.downloadStatus = false;
        }
      }
    }
  }

  toggleUpload() {
    this.hide = !this.hide;
  }

  toggleStorage(toggle) {
    //this.toggleStorage = toggle;
    if (toggle) {
      this.firebaseDisplay = true;
      this.oracleDisplay = false;
      this.connTitle = 'You are connected to cloud storage...';
    }
    else {
      this.firebaseDisplay = false;
      this.oracleDisplay = true;
      this.connTitle = 'You are connected to oracle storage...';
    }
  }
  
  selectFile(theme, file) {
    console.log(file);
    this.getBase64(file).then((data) => {
      if (theme == 'blue') {
        this.displayBlue = data;
      } else if (theme == 'dark') {
        this.displayDark = data;
      } else if (theme == 'maroon') {
        this.displayMaroon = data;
      } else if (theme == 'grey') {
        this.displayGrey = data;
      } else if (theme == 'green') {
        this.displayGreen = data;
      }
    });
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  closePage() {
    this.login = false;
    this.router.navigate(['super']);
  }

  /*getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }*/
}
