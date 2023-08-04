import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Console } from 'console';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-frame-plasto-summary-card',
  templateUrl: './frame-plasto-summary-card.component.html',
  styleUrls: ['./frame-plasto-summary-card.component.scss'],
})
export class FramePlastoSummaryCardComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  parentRows = [];
  summaryCartArr = [];
  tableRows = [];
  tHead = [];

  parentdata = [];

  constructor(private globalObjects: GlobalObjectsService) { }

  ngOnInit() {

    console.log(this.globalObjects.cartSummaryPlain);
    /* if (this.globalObjects.plastoFrameSumm.length > 0 && this.frame.Level4.length <= 0) {
      // let tableRows = [];

      this.summaryCartArr = this.globalObjects.plastoFrameSumm;
      this.parentRows = this.summaryCartArr;
      this.tHead = this.parentRows[0].tHead;
      this.tableRows = [];
      for (let row of this.globalObjects.plastoFrameSumm) {
          for (let p of row.parentRow) {
            this.tableRows.push(p);
          }
        }
      this.frame.tableRows = this.tableRows;
    } */

   /*  for(let s of this.summaryCartArr){
      let parentName = this.parentdata.find(x => x.frameName == s.frameName);

      if(parentName){
        let arr = []
        arr = parentName.data;
        arr.push(s)
        parentName.data = arr
      }else{
        let arr = []
        arr.push(s);
        let obj = {
          frameName : s.frameName,
          data: arr
        }
        this.parentdata.push(obj);
      }
    }

    console.log(this.parentdata);
  } */

  this.summaryCartArr = this.globalObjects.plastoFrameSumm;

  let row = this.summaryCartArr[0].cartArr[0].cardRow;

  let theaddata: any = [];
  for (let itemGroup of row) {
    for (let itemMast of itemGroup.Level5) {
      if (itemMast.item_sub_type != 'ONLY_VIEW_PARENT' && itemMast.item_type != 'DISPLAY_PHOTO'
        && itemMast.item_sub_type != 'ONLY_VIEW_COUNT' && itemMast.item_visible_flag == 'T') {

        theaddata.push(itemMast.prompt_name);
      }
    }
  }
  this.tHead = theaddata;
  console.log(theaddata);

  let tableRows = [];
  if(this.globalObjects.plastoFrameSumm.length > 0){
    for(let p of this.globalObjects.plastoFrameSumm){
      if(p.cartArr){
        for(let c of p.cartArr){
          if(c.parentRow){
           for(let p of c.parentRow){
             tableRows.push(c.cardRow);
           }
          }
        }
      }
    }
  }

  console.log(this.summaryCartArr);

// this.frame.tableRows = tableRows;
}

deleteItem(event,d,c,i){
  this.summaryCartArr[d].cartArr[c].parentRow.splice(i,1);
  this.emitPass.emit(event);
}


itemValueChange(event,rowsdata,h,i) {
  console.log(event);
  this.emitPass.emit(event);
}




}
