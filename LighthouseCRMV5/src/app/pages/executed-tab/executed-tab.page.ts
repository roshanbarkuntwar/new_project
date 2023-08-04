import { Component, OnInit } from '@angular/core';
import { SqlLiteService } from 'src/app/services/sql-lite.service';

@Component({
  selector: 'app-executed-tab',
  templateUrl: './executed-tab.page.html',
  styleUrls: ['./executed-tab.page.scss'],
})
export class ExecutedTabPage implements OnInit {

  executedData :any = [];
  data :any = [];
  constructor(private sqlServ: SqlLiteService) {}

  ngOnInit() {
    this.getAllData();
  }

  getAllData() {
    this.sqlServ.getAllExecutedEntery().then((res:any) => {
      if (res.resStatus == "Success") {
        this.data = res.resData
        for (let a of this.data) {
          let enteryData = JSON.parse(a.enteryData);
          for (let b of enteryData.wsdp) {
            this.executedData.push(b);
          }
        }
      } 
    }).catch(e => {
     // alert(JSON.stringify(e));
    })
  }

  updateCard(i){
  }

  deleteCard(i){
  }

}
