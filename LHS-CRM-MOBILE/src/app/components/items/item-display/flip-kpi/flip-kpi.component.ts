import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';

@Component({
  selector: 'app-flip-kpi',
  templateUrl: './flip-kpi.component.html',
  styleUrls: ['./flip-kpi.component.scss'],
})
export class FlipKpiComponent implements OnInit {

  @Input() kpi:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  values:any = [];
  baseImg:any = "";
  imgStyle:any = {};
  
  constructor(public globalObjects: GlobalObjectsService,private sqlServ: SqlLiteService) { }

  ngOnInit() {

    this.baseImg = this.globalObjects.getScopeUrl()+'getImage?id='+this.kpi.apps_item_seqid+'&appTheme='+this.globalObjects.appTheme;
    
    // this.sqlServ.getImageFromLocal(this.kpi,val).then((res) => {
    //   this.baseImg = res;
    // });

    // const a = document.createElement('a')
    // const objectUrl = URL.createObjectURL(this.baseImg)
    // a.href = objectUrl
    // a.download = filename;
    // a.click();
    
    if(this.kpi.value.indexOf("@") > -1){
      this.values = this.kpi.value.split("@");
    }else{
      this.values[0] = this.kpi.value;
    }
    // URL.revokeObjectURL(objectUrl);
    this.globalObjects.getBase64ImageFromUrl(this.baseImg).then((image:any)=>{
      if(image){
        this.imgStyle = {
          "background-image": `url(${JSON.stringify(image)})`
        }
      }
    });

   
  }

 

  itemClick(event) {
    this.emitPass.emit(this.kpi);
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
