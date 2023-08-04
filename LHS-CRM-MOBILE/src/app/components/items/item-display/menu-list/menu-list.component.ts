import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ParentMenuPage } from 'src/app/pages/parent-menu/parent-menu.page';
import { Platform, PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {
  @Input() menulist: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  baseImg: any;

  constructor(public globalObjects: GlobalObjectsService, private barScanner: BarcodeScanner,private cdr: ChangeDetectorRef, private sqlServ: SqlLiteService, public sanitizer: DomSanitizer,
    public popOverCtrl: PopoverController, private platform: Platform) { }

  ngOnInit() {
    // console.log(this.menulist);
    if (this.menulist.display_setting_str) {

      this.menulist.display_setting_str = typeof(this.menulist.display_setting_str) == 'string' ? JSON.parse(this.menulist.display_setting_str) : this.menulist.display_setting_str;
      let keys = Object.keys(this.menulist.display_setting_str);
      let obj = {};
    
        for (let k of keys) {
          obj['--' + k] = this.menulist.display_setting_str[k];
        }
        this.menulist.display_setting_str = obj;
        // console.log(obj);
      
    }
    
    var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.menulist.apps_item_seqid + '&appTheme=' + this.globalObjects.appTheme;

    this.sqlServ.getImageFromLocal(this.menulist, val).then((res: any) => {
      // this.baseImg = res;
      this.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
    });

  }
  img() {
    var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.menulist.apps_item_seqid + '&appTheme=' + this.globalObjects.appTheme;
    return val

  }

  onImgError(event) {
    event.target.src = './assets/imgs/no_image.png'
    // let u = './assets/imgs/no_image.png';
    // this.globalObjects.getBase64ImageFromUrl(u).then((res)=>{
    //   this.baseImg = res;
    // })
    //Do other stuff with the event.target
  }
  ishover(e) {
    if (e.click_events_str) {
      return true;
    } else {
      return false;
    }
  }
  buttonClick(event) {
    console.log('vijay buttonClick this.menulist.prompt_name ', this.menulist.prompt_name);
    this.menulist.rightClickFlag = false;
    this.emitPass.emit(this.menulist);
  }

  onRightClick(event) {
    console.log(this.menulist);
    event.preventDefault();
    this.menulist.rightClickFlag = true;
    this.emitPass.emit(this.menulist);
  }

  barcodescanner(event) {

    return new Promise((resolve) => {
      if (this.platform.is('android') || this.platform.is('ios')) {

        let options: BarcodeScannerOptions = {
          torchOn: false,
          showTorchButton: true,
          prompt: "Point the camera at the barcode"
        };
        this.barScanner.scan(options).then(barcodeData => {
          this.menulist.value = barcodeData.text;
          this.menulist.isValid = true;

          if (this.menulist.value) {


            this.emitPass.emit(this.menulist);
            resolve("sucess");
          }

        }).catch(err => {

        });
      } else {


        let person = prompt("Please enter your code here:", "");
        if (person == null || person == "") {
        } else {
          this.menulist.value = person;
          this.menulist.isValid = true;

          if (this.menulist.value) {
            this.emitPass.emit(this.menulist);
            resolve("sucess");
          }
        }
      }


    }).catch(err => {
      alert(err);
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

}
