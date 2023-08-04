import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Events } from '@ionic/angular';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-frame-cart-summary-plain',
  templateUrl: './frame-cart-summary-plain.component.html',
  styleUrls: ['./frame-cart-summary-plain.component.scss'],
})
export class FrameCartSummaryPlainComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};

  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  totalQty = 0;
  totalAmt = 0;
  discount = 0;
  taxVal = 0;
  tableRows = []
  totalVal: number;
  constructor(private events: Events, public globalObjects: GlobalObjectsService) {
    this.events.subscribe("showSummary", () => {
      this.summDetails();
    });

    

  }

  ngOnInit() {
    let name = "refreshFrame" + ((this.frame.apps_page_frame_seqid).toString().replace(/-/g,"_")) +  this.globalObjects.refreshId;
    this.events.unsubscribe(name);
    this.events.subscribe(name, res => {
      for (let f of res.refreshFrame) {
        if (f.key == this.frame.apps_page_frame_seqid && f.val == 'T') {
          f.val = 'F';
          this.summDetails();
        }
      }
    })
    console.log(this.frame);
    this.summDetails();
  }

  summDetails() {
    this.totalQty = 0;
    this.totalAmt = 0;
    this.discount = 0;
    this.taxVal = 0;
    this.totalVal = 0;
    this.tableRows = [];

    if(this.globalObjects.plastoFrameSumm.length > 0){
      this.globalObjects.cartSummaryPlain = [];
      for(let g of this.globalObjects.plastoFrameSumm){
        for(let c of g.cartArr){
          this.globalObjects.cartSummaryPlain.push(c);
        }
      }
    }
    for (let row of this.globalObjects.cartSummaryPlain) {
      if (row.parentKey) {
        for (let p of row.parentRow) {
          this.tableRows.push(p);
        }
      } else {
        this.tableRows.push(row.cartRows)
      }
    }
    this.frame.tableRows = this.tableRows;
    for (let tabledata of this.tableRows) {
      for (let itemGroup of tabledata) {
        for (let row of itemGroup.Level5) {
          if (row.item_name == 'AQTYORDER' &&  row.value != undefined && row.value != null) {
            this.totalQty = this.totalQty + parseFloat(row.value);
          }
          if (row.item_name == 'TOTAL' && row.value != undefined && row.value != null) {
            this.totalAmt = this.totalAmt + parseFloat(row.value);
          }
          if (row.item_name == 'DISCOUNT' && row.value != undefined && row.value != null) {
            this.discount = this.discount + parseFloat(row.value);
          }
          if (row.item_name == 'TAX_VALUE' && row.value != undefined && row.value != null) {
            this.taxVal = this.taxVal + parseFloat(row.value);
          }
          if (row.item_name == 'TOTAL_VALUE' && row.value != undefined && row.value != null) {
            this.totalVal = this.totalVal + parseFloat(row.value);
          }
        }
      }
    }
    console.log(this.totalQty);
    this.globalObjects.summaryPlainData = this.tableRows;

  }

  itemClicked(event) {
    this.emitPass.emit(event);
  }

}
