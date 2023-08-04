import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Subscriber } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dev-image-icon-mast-editor',
  templateUrl: './dev-image-icon-mast-editor.page.html',
  styleUrls: ['./dev-image-icon-mast-editor.page.scss'],
})
export class DevImageIconMastEditorPage implements OnInit {
  @Input() data: any;

  themeBlue: any;
  themeMaroon: any;
  themeGreen: any;
  themeGray: any;
  themeDark: any;

  blueAppIconName: any;
  maroonAppIconName: any;
  greenAppIconName: any;
  grayAppIconName: any;
  darkAppIconName: any;

  myCondition: boolean = true;
  myImage: any;
  flag: boolean = false;

  imageBlueObj: any = {};
  imageMaroonObj: any = {};
  imageGreenObj: any = {};
  imageGrayObj: any = {};
  imageDarkObj: any = {};

  imageArr: any = [];

  constructor(private modalctrl: ModalController, private dataService: DataService) { }

  ngOnInit() {
    console.log(this.data == "" || this.data == undefined);
    if (!this.data) {
      this.flag = false;
      this.themeBlue = './assets/imgs/no_image.png';
      this.themeDark = './assets/imgs/no_image.png';
      this.themeGray = './assets/imgs/no_image.png';
      this.themeGreen = './assets/imgs/no_image.png';
      this.themeMaroon = './assets/imgs/no_image.png';
    } else {
      this.flag = true;
      let url = 'imageIconSelect';
      let reqData = {
        "apps_icon_name": this.data
      }
      this.dataService.postDataDev(url, reqData).then((res: any) => {
        let result = res.responseData;
        for (let obj of result) {
          if (obj.apps_icon_theme == "theme-blue") {
            this.themeBlue = obj.icon_image;
            this.blueAppIconName = obj.apps_icon_name;
          }
          if (obj.apps_icon_theme == "theme-dark") {
            this.themeDark = obj.icon_image;
            this.darkAppIconName = obj.apps_icon_name;
          }
          if (obj.apps_icon_theme == "theme-green") {
            this.themeGreen = obj.icon_image;
            this.greenAppIconName = obj.apps_icon_name;
          }
          if (obj.apps_icon_theme == "theme-grey") {
            this.themeGray = obj.icon_image;
            this.grayAppIconName = obj.apps_icon_name;
          }
          if (obj.apps_icon_theme == "theme-maroon") {
            this.themeMaroon = obj.icon_image;
            this.maroonAppIconName = obj.apps_icon_name;
          }
        }
      })
    }
  }

  closePage() {
    let dat = {
      icon_name:this.data,
      img: this.themeBlue
    }
    this.modalctrl.dismiss(dat);
  }

  save() {
    this.imageArr = [];
    if (JSON.stringify(this.imageBlueObj) != '{}') {
      this.imageBlueObj['apps_icon_name'] = this.data;
      this.imageArr.push(this.imageBlueObj);
    }
    if (JSON.stringify(this.imageMaroonObj) != '{}') {
      this.imageMaroonObj['apps_icon_name'] = this.data;
      this.imageArr.push(this.imageMaroonObj);
    }
    if (JSON.stringify(this.imageGrayObj) != '{}') {
      this.imageGrayObj['apps_icon_name'] = this.data;
      this.imageArr.push(this.imageGrayObj);
    }
    if (JSON.stringify(this.imageGreenObj) != '{}') {
      this.imageGreenObj['apps_icon_name'] = this.data;
      this.imageArr.push(this.imageGreenObj);
    }
    if (JSON.stringify(this.imageDarkObj) != '{}') {
      this.imageDarkObj['apps_icon_name'] = this.data;
      this.imageArr.push(this.imageDarkObj);
    }

    if (this.data == "" || this.data == undefined) {
      alert("please select 'App Icon Name'");
    } else {
      if (this.imageArr.length <= 0) {
        alert("You choose nothing for save");
      }
      else {
        let url = 'imageIconInsert';
        let reqData = {
          "reqData": this.imageArr
        }
        this.dataService.postDataDev(url, reqData).then((res: any) => {
          let result = res.responseStatus;
          if (result == "success") {
            this.imageArr = [];
            alert("image inserted successfully")
            this.closePage();
          } else {
            this.imageArr = [];
            alert(res.responseMsg)
          }
        })
      }
      this.imageArr = [];
    }
  }

  update() {

    this.imageArr = [];

    if (JSON.stringify(this.imageBlueObj) != '{}') {
      this.imageArr.push(this.imageBlueObj);
    }
    if (JSON.stringify(this.imageMaroonObj) != '{}') {
      this.imageArr.push(this.imageMaroonObj);
    }
    if (JSON.stringify(this.imageGrayObj) != '{}') {
      this.imageArr.push(this.imageGrayObj);
    }
    if (JSON.stringify(this.imageGreenObj) != '{}') {
      this.imageArr.push(this.imageGreenObj);
    }
    if (JSON.stringify(this.imageDarkObj) != '{}') {
      this.imageArr.push(this.imageDarkObj);
    }

    if (this.imageArr.length <= 0 || this.data == "") {
      alert("You choose nothing for update");
    } else {
      let url = 'imageIconEdit';
      let reqData = {
        "reqData": this.imageArr
      }
      this.dataService.postDataDev(url, reqData).then((res: any) => {
        let result = res.responseStatus;
        if (result == "success") {
          this.imageArr = [];
          alert("image updated successfully")
          this.closePage();
        } else {
          this.imageArr = [];
          alert("error while updating image")
        }
      })
      this.imageArr = [];
    }
  }

  onChangeBlue($event: Event) {
    this.imageBlueObj = {};
    const file = ($event.target as HTMLInputElement).files[0];
    if (file.size > 9999) {
      alert("choose image below than 10 kb");
      this.themeBlue = './assets/imgs/no_image.png';
    } else {
      this.myCondition = false;
      this.converToBase64(file).then((res) => {
        this.imageBlueObj = { "old_apps_icon_name": this.blueAppIconName, "apps_icon_theme": "theme-blue", "icon_image": res }
        this.themeBlue = 'data:image/jpeg;base64,' + res;
      });
    }
  }

  onChangeMaroon($event: Event) {
    this.imageMaroonObj = {};
    const file = ($event.target as HTMLInputElement).files[0];
    if (file.size > 9999) {
      alert("choose image below than 10 kb");
      this.themeMaroon = './assets/imgs/no_image.png';
    } else {
      this.myCondition = false;
      this.converToBase64(file).then((res) => {
        this.imageMaroonObj = { "old_apps_icon_name": this.maroonAppIconName, "apps_icon_theme": "theme-maroon", "icon_image": res };
        this.themeMaroon = 'data:image/jpeg;base64,' + res;
      });
    }
  }

  onChangeGreen($event: Event) {
    this.imageGreenObj = {};
    const file = ($event.target as HTMLInputElement).files[0];
    if (file.size > 9999) {
      alert("choose image below than 10 kb");
      this.themeGreen = './assets/imgs/no_image.png';
    } else {
      this.myCondition = false;

      this.converToBase64(file).then((res) => {
        this.imageGreenObj = { "old_apps_icon_name": this.greenAppIconName, "apps_icon_theme": "theme-green", "icon_image": res };
        this.themeGreen = 'data:image/jpeg;base64,' + res;
      });
    }
  }

  onChangeGrey($event: Event) {
    this.imageGrayObj = {};
    const file = ($event.target as HTMLInputElement).files[0];
    if (file.size > 9999) {
      alert("choose image below than 10 kb");
      this.themeGray = './assets/imgs/no_image.png';
    } else {
      this.myCondition = false;

      this.converToBase64(file).then((res) => {
        this.imageGrayObj = { "old_apps_icon_name": this.grayAppIconName, "apps_icon_theme": "theme-grey", "icon_image": res };
        this.themeGray = 'data:image/jpeg;base64,' + res;
      });
    }
  }

  onChangeDark($event: Event) {
    this.imageDarkObj = {};
    const file = ($event.target as HTMLInputElement).files[0];
    if (file.size > 9999) {
      alert("choose image below than 10 kb");
      this.themeDark = './assets/imgs/no_image.png';
    } else {
      this.myCondition = false;

      this.converToBase64(file).then((res) => {
        this.imageDarkObj = { "old_apps_icon_name": this.darkAppIconName, "apps_icon_theme": "theme-dark", "icon_image": res };
        this.themeDark = 'data:image/jpeg;base64,' + res;
      });
    }
  }

  converToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const observable = new Observable((subscriber: Subscriber<any>) => {
        this.readFile(file, subscriber);
      });
      observable.subscribe((d) => {
        this.myImage = (d).split(",");
        this.myImage = this.myImage[1];
        console.log(this.myImage);
        resolve(this.myImage);
      }, (err) => reject(err));
    })
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();
    };
    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }
}

