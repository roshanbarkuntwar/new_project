import { Component, OnInit, Input, Output, EventEmitter, Pipe } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-menu-tab',
  templateUrl: './menu-tab.component.html',
  styleUrls: ['./menu-tab.component.scss'],
})

export class MenuTabComponent implements OnInit {
@Input() menutab:any;
@Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
imgUrl:any;
baseImg:any;
  constructor(public globalObjects: GlobalObjectsService,private sqlServ : SqlLiteService,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log(this.menutab);
    this.imgUrl = this.globalObjects.getScopeUrl()+'getImage?id='+this.menutab.apps_item_seqid+'&appTheme='+this.globalObjects.appTheme;
    this.sqlServ.getImageFromLocal(this.menutab,this.imgUrl).then((res:any) => {
      // this.baseImg = res;
      this.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
    });
  }
 
  img(){
    var val = this.imgUrl;
    return val
  }

  onImgError(event){
   event.target.src = './assets/imgs/no_image.png'
  //  let u = './assets/imgs/no_image.png';
  //   this.globalObjects.getBase64ImageFromUrl(u).then((res)=>{
  //     this.baseImg = res;
  //   })
  }

  buttonClick(event) {
    console.log('vijay this.button', this.menutab);
    this.menutab.rightClickFlag = false;
    this.emitPass.emit(this.menutab);
  }

  onRightClick(event) {
    console.log(this.menutab);
    event.preventDefault();
    this.menutab.rightClickFlag = true;
    this.emitPass.emit(this.menutab);
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
