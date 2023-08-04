import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SummaryCardComponent implements OnInit {

  @Input() summ_card_input: any;
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  num:number;
  pbarValue: any;
  tableValue:any;
  constructor(public globalobject:GlobalObjectsService) { 
    this.num= this.globalobject.countforsummarycard;
    console.log("this.num",this.num)
  }

  ngOnInit() {
    this.pbarValue=this.summ_card_input.tool_tip;
    console.log('summ_card_input ',this.summ_card_input);


    if (this.summ_card_input.datatype == 'NUMBER') {
      if(this.summ_card_input.value && this.summ_card_input.format_mask && !isNaN(parseFloat(this.summ_card_input.value))){
        let mask = this.summ_card_input.format_mask.split(",");
        let str = "";
        let val = "";
        let i = 0;
        let value = this.summ_card_input.value;
        if(value.indexOf(".") > -1){
          value = value.split(".")[0];
        }
        let itmLen = value.length;
        for(let m of mask){
          i++
          if(itmLen > 0){
            let num = mask[mask.length - i].length;
            if(itmLen < mask[mask.length - i].length){
              num = itmLen;
            }
            str =  "(\\d{"+ num +"})" + str;
            if(val == ""){
              val = val + '$'+i;
            }else{
              val = val + ','+'$'+i;
            }
            itmLen = itmLen - mask[mask.length - i].length;
          }
        }
        let finalStr = '/'+str+'/'

        if(this.summ_card_input.value.indexOf(".") > -1){
          let temp = value.replace(eval(finalStr),val);
          this.tableValue = temp + '.' + this.summ_card_input.value.split(".")[1];
        }else{
          this.tableValue = this.summ_card_input.value.replace(eval(finalStr),val);
        }
        this.summ_card_input.value = this.tableValue;
      }
    
    }

  }

  itemClick(event) {
    this.emitPass.emit(this.summ_card_input);
  }

}

 