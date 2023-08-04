import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dev-obj-frame-list',
  templateUrl: './dev-obj-frame-list.page.html',
  styleUrls: ['./dev-obj-frame-list.page.scss'],
})
export class DevObjFrameListPage implements OnInit {
  @Input() objCode:any;
  constructor(private dataServ: DataService, public popOverCtrl: PopoverController) { }
  results:any=[];
  itemArr:any=[];
  clickData:any="";
  ngOnInit() {
    if(this.objCode && this.objCode.item != undefined){
      this.itemArr = this.objCode.item.split("~");
    }
    this.getObjFrameData();
  }

  getObjFrameData(){
    let url='devPageFrameMast'
    var data = {
      "objectCode" : this.objCode.objectCode
    }
    this.dataServ.postDataDev(url,data).then((res:any)=>{
      this.results = res.responseData;
      for(let t of this.results){
        for(let inputItem of this.itemArr){
          if(t.apps_page_frame_seqid == inputItem){
              t["flag"] = true;
          }
        }
      }

    }).catch(err=>{
      console.log(err);
    })
  }

  popDismiss(){
    this.popOverCtrl.dismiss();
  }

  getObjFrame(){
    this.clickData = "";
    for(let d of this.results){
      if(d.flag){
        this.clickData = this.clickData+ '~' + d.apps_page_frame_seqid;
      }
    }
   this.popOverCtrl.dismiss(this.clickData);
  }

}
