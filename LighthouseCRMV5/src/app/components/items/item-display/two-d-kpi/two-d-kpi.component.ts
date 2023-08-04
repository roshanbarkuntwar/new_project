import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-two-d-kpi',
  templateUrl: './two-d-kpi.component.html',
  styleUrls: ['./two-d-kpi.component.scss'],
})


export class TwoDKPIComponent implements OnInit {

  @Input() dKpi: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  flag:boolean = false;

  constructor() { }

  ngOnInit() {
    console.log(this.dKpi);
    if(this.dKpi.css_class){}else{
      this.dKpi.css_class = 'blue';
    }
    if (this.dKpi.value) {
      this.dKpi.value = this.dKpi.value.split("@");
      console.log(this.dKpi.value);
    } else {
      this.dKpi.value = [];
    }
  }

  itemClick(event) {
    this.emitPass.emit(this.dKpi);
  }


}
