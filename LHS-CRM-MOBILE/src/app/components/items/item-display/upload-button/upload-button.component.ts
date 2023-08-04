import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { resolve } from 'url';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
})
export class UploadButtonComponent implements OnInit {

  @Input() button: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() parentComponent: any;
  acceptParameter :any = "";
  seq:any;
  num:number = 0;
  itemGrp:any;
  fileNames = [];
  constructor(private globalObjects: GlobalObjectsService) { 
   
  }



  ngOnInit() {
    /*let frame = JSON.parse(JSON.stringify(this.parentComponent.frame.Level4));

    for(let row of frame){
      for(let item of row.Level5){
        this.seq = item.apps_item_seqid.split("-")[0] + '-' + item.apps_item_seqid.split("-")[1];

        if(parseInt(item.apps_item_seqid.split("-")[2]) > this.num){
          this.num = parseInt(item.apps_item_seqid.split("-")[2]);
        }  
        
        if(this.button.apps_item_seqid == item.apps_item_seqid){
          this.itemGrp = row;
        }
      }
    }*/
     //.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel
     if(this.button.item_sub_type){
      let acceptPara = this.button.item_sub_type;
      this.button.item_sub_type = acceptPara.split("#")[0];
      let paraArr = acceptPara.indexOf("#") > -1 ? acceptPara.split("#")[1].split("~") : [];
      if(paraArr.length > 0){
        for(let p of paraArr){
         this.acceptParameter = this.acceptParameter ? this.acceptParameter + "," + this.globalObjects.getMIMEtype(p) : this.globalObjects.getMIMEtype(p);
        }
 
      }else{
       this.acceptParameter = "*";
      }
 
     }
  }


  readFile(event){
    this.button.files = [];
    if(this.button.item_sub_type == 'S'){
      this.fileNames = [];
    }
    for(let f of event.target.files){
     this.fileNames.push(f);
    }
   this.button.files = this.fileNames;
   this.emitPass.emit(this.button);
 /*  if(this.button.item_sub_type == 'M'){
    this.convertFile(event.target.files).then((res:any) => {
      
      for(let r of res){
        let butn = JSON.parse(JSON.stringify(this.itemGrp));
        this.num ++;
        butn.Level5[0].apps_item_seqid = this.seq + '-' + this.num;
        butn.Level5[0].value = r;
        this.globalObjects.attachmentArr.push(butn);
      }
     })
   }else{
    this.convertFile(event.target.files).then((res:any) =>{
      this.button.value = res[0];
      this.emitPass.emit(this.button);
     })
   }*/
  }

  convertFile(files){

    return new Promise((resolve,reject) => {
      let blobFiles:any = [];

      if (files.length > 0) {
        for (let f of files) {
  
          this.globalObjects.converToBase64(f).then((data: any) => {
            let file:any;
            file = data.split(",")[1];
            file = file + "~" + f.name.replace(/\s/g, '_');
            if(this.button.item_sub_type == 'M'){
              file = file + '#' + this.button.apps_item_seqid;
            }
            blobFiles.push(file);
            if(files.length == blobFiles.length){
              resolve(blobFiles)
            }
          }, (error) => {
            this.globalObjects.presentAlert("Error while reading file...");
            reject();
          });
        }
      } else {
        this.globalObjects.presentAlert("No file selected...");
        reject();
      }
    })
  }

  removeItem(index){
    this.fileNames.splice(index, 1);
    this.button.files = [];
    if(this.button.item_sub_type == 'S'){
      this.fileNames = [];
    }
   this.button.files = this.fileNames;

   this.emitPass.emit(this.button);
  }

}
