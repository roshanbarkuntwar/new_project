import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-kpi-slider',
  templateUrl: './kpi-slider.component.html',
  styleUrls: ['./kpi-slider.component.scss'],
})


export class KpiSliderComponent implements OnInit {

  @Input() sKpi:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log(this.sKpi);
    if (this.sKpi.value) {
      this.sKpi.value = this.sKpi.value.split("@");
    } else {
      this.sKpi.value = [];
    }
  }

  itemClick(event) {
    this.emitPass.emit(this.sKpi);
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
