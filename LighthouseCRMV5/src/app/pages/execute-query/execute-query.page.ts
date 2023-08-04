import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ImagePreviewPage } from '../image-preview/image-preview.page';


@Component({
  selector: 'app-execute-query',
  templateUrl: './execute-query.page.html',
  styleUrls: ['./execute-query.page.scss'],
})
export class ExecuteQueryPage implements OnInit {

  queryOrPro: string = "Query"
  loading: boolean = false;
  query: string;
  tableBody: any = [];
  jsonQuery = {};
  status: any = [];
  statusArray: any = [];
  colorVar: string;
  tableArr = [];
  isActive:boolean=false;
  constructor(private modalCtrl: ModalController, private dataService: DataService, public imagePreviewPage:ImagePreviewPage) { }

  ngOnInit() {
    
  }

  closePage() {
    this.modalCtrl.dismiss();
  }

  enablePro(event){
     this.isActive =event;
     if(event){
      this.queryOrPro="Procedures"
     }else{
       this.queryOrPro="Query"
     }
  }

  executeQuery() {
    this.loading = true;
    this.statusArray = [];
    this.status = [];
    this.tableArr = [];
    this.tableBody = [];
    let url = 'executeQuery';

    var data = {
      "query": this.query == undefined ? this.query : (this.query).replace(/[\n\r]+/g, ''),
      "EnablePro": this.isActive
    }

    this.dataService.postData(url, data).then((res: any) => {
      this.loading = false;
      // let resobj: any = res;
      for (let resobj of res.responseData) {
        let head = [];
        let body = [];
        if (resobj[-1] != undefined) {
          this.status.push(resobj[-1]);
          this.colorVar = this.status[0][0];
          this.statusArray.push(this.status[0][1]);
        } else {
          for (let i of resobj[0]) {
            head.push(i);
          }
          for (let j in resobj) {
            body.push(resobj[j])
          }
          body.shift();
        }

        this.tableArr.push({ head: head, body: body });
        console.log(this.tableArr);
      }
    }).catch(err => {
      console.log(err)
    })
  }

  async openPopUP(obj){

    const modal = await this.modalCtrl.create({
      component: ImagePreviewPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img: obj
      }
    });
    modal.present();
  }
  
}
