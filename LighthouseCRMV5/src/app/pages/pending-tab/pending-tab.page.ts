import { Component, OnInit } from '@angular/core';
import { SqlLiteService } from 'src/app/services/sql-lite.service';

@Component({
  selector: 'app-pending-tab',
  templateUrl: './pending-tab.page.html',
  styleUrls: ['./pending-tab.page.scss'],
})
export class PendingTabPage implements OnInit {

  pendingData :any = [];
  data :any = [];
  pendingCount : number = 0;
  constructor(private sqlServ: SqlLiteService) {}

  ngOnInit() {
    this.getAllData();
  }


  getAllData() {
    this.sqlServ.getAllPendingEntery().then(res => {
      if (res.resStatus == "Success") {
        this.data = res.resData
        for (let a of this.data) {
          let enteryData = JSON.parse(a.enteryData);
          for (let b of enteryData.wsdp) {
            this.pendingData.push(b);
          }
        }
        this.pendingCount = this.data.length;
      } 
    }).catch(e => {
     // alert(JSON.stringify(e));
    })
  }


  deleteCard(object,i) {
    let id;
    id = this.data[i].id;
    this.sqlServ.deleteCard(id).then(res => {
      this.pendingData = [];
      this.ngOnInit()
    }).catch(e => {
      alert(JSON.stringify(e));
    });
  }

  updateCard(i){
    let id;
    id =this.data[i].id;
  }
}
