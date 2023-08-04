import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ParentMenuPage } from 'src/app/pages/parent-menu/parent-menu.page';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {
  @Input() menulist: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  baseImg: any;

  constructor(public globalObjects: GlobalObjectsService, private barScanner: BarcodeScanner, private sqlServ: SqlLiteService, public sanitizer: DomSanitizer,
    public popOverCtrl: PopoverController) { }

  ngOnInit() {
    // console.log(this.menulist);
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

    }).catch(err => {
      alert(err);
    })

  }


}
