import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AnyAaaaRecord } from 'dns';

@Component({
  selector: 'app-new-menu-list',
  templateUrl: './new-menu-list.component.html',
  styleUrls: ['./new-menu-list.component.scss'],
})
export class NewMenuListComponent implements OnInit {

  @Input() menulistNEW: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  baseImg: any;
  childFlag:boolean = false;


  constructor(public globalObjects: GlobalObjectsService, private sqlServ: SqlLiteService,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.menulistNEW.apps_item_seqid + '&appTheme=' + this.globalObjects.appTheme
    this.sqlServ.getImageFromLocal(this.menulistNEW, val).then((res:any) => {
      // this.baseImg = res;
      this.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
    });
  }

  buttonClick(event) {
    console.log('vijay buttonClick this.menulist.prompt_name ', this.menulistNEW.prompt_name);
      this.menulistNEW.rightClickFlag = false;
      this.emitPass.emit(this.menulistNEW);
  }

  onRightClick(event) {
    console.log(this.menulistNEW);
    event.preventDefault();
    this.menulistNEW.rightClickFlag = true;
    this.emitPass.emit(this.menulistNEW);
  }

  onImgError(event) {
    event.target.src = './assets/imgs/no_image.png'
    // let u = './assets/imgs/no_image.png';
    // this.globalObjects.getBase64ImageFromUrl(u).then((res)=>{
    //   this.baseImg = res;
    // })

  }

  img() {
    var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.menulistNEW.apps_item_seqid + '&appTheme=' + this.globalObjects.appTheme
    return val
  }

}
