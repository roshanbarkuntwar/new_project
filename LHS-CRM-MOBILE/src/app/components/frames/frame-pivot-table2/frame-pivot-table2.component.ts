import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare var $:any;

import 'pivottable/dist/pivot.min.js';
import 'pivottable/dist/pivot.min.css';

@Component({
  selector: 'app-frame-pivot-table2',
  templateUrl: './frame-pivot-table2.component.html',
  styleUrls: ['./frame-pivot-table2.component.scss'],
})
export class FramePivotTable2Component implements OnInit {

  @Input() frame: any = {};
  //frametable: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  constructor() { }

  ngOnInit(): void {
    alert("calling pivot");

    var data = [
      ["row","total_bill","tip","gender","smoker","day","time","size"],
      ["1",16.99,1.01,"Female","No","Sun","Dinner",2],
      ["2",10.34,1.66,"Male","No","Sun","Dinner",3],
      ["3",21.01,3.5,"Male","No","Sun","Dinner",3],
      ["4",23.68,3.31,"Male","No","Sun","Dinner",2],
      ["5",24.59,3.61,"Female","No","Sun","Dinner",4],
      ["6",25.29,4.71,"Male","No","Sun","Dinner",4],
      ["7",8.77,2,"Male","No","Sun","Dinner",2],
      ["8",26.88,3.12,"Male","No","Sun","Dinner",4],
      ["9",15.04,1.96,"Male","No","Sun","Dinner",2],
      ["10",14.78,3.23,"Male","No","Sun","Dinner",2],
      ["11",10.27,1.71,"Male","No","Sun","Dinner",2],
      ["12",35.26,5,"Female","No","Sun","Dinner",4],
      ["13",15.42,1.57,"Male","No","Sun","Dinner",2],
      ["14",18.43,3,"Male","No","Sun","Dinner",4],
      ["15",14.83,3.02,"Female","No","Sun","Dinner",2],
      ["16",21.58,3.92,"Male","No","Sun","Dinner",2],
      ["17",10.33,1.67,"Female","No","Sun","Dinner",3],
      ["18",16.29,3.71,"Male","No","Sun","Dinner",3],
      ["19",16.97,3.5,"Female","No","Sun","Dinner",3],
      ["20",20.65,3.35,"Male","No","Sat","Dinner",3],
      ["21",17.92,4.08,"Male","No","Sat","Dinner",2],
      ["22",20.29,2.75,"Female","No","Sat","Dinner",2],
      ["23",15.77,2.23,"Female","No","Sat","Dinner",2],
      ["24",39.42,7.58,"Male","No","Sat","Dinner",4],
      ["25",19.82,3.18,"Male","No","Sat","Dinner",2]
    ];

    for(var i=0;i<6000;i++){
      data.push( [i+"25",19.82,3.18,"Male","No","Sat","Dinner",2*i]);
    }

    $("#output").pivotUI(
      data, {
        rows: ["gender"],
        cols: ["smoker"],
        vals: ["tip", "total_bill"],
        aggregatorName: "Sum over Sum",
        rendererName: "Bar Chart",
        renderers: $.extend(
         $.pivotUtilities.renderers, 
          $.pivotUtilities.plotly_renderers
        )
      });
  }

  

}
