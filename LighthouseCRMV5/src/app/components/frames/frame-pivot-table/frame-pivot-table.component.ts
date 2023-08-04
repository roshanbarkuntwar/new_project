import { Component, Input, OnInit, ViewChild } from '@angular/core';
//import * as FusionCharts from 'fusioncharts'
import { WebdatarocksComponent } from 'src/app/demo-utils/pivot-table-webdatarocks/webdatarocks.component';
import * as WebDataRocks from 'webdatarocks';

@Component({
  selector: 'app-frame-pivot-table',
  templateUrl: './frame-pivot-table.component.html',
  styleUrls: ['./frame-pivot-table.component.scss'],
})
export class FramePivotTableComponent implements OnInit {
  @ViewChild('pivot1') child: WebdatarocksComponent;
  @Input() data:any;
  constructor() { }

  ngOnInit(){
    var pivot = new WebDataRocks({
    container: "#wdr-component111",
    toolbar: true,
    height: 395,
    report: {
      dataSource: {
       // filename: "https://cdn.webdatarocks.com/data/data.csv",
      // filename:this.data,
       data:this.data,
       dataSourceType:"json"
       
      },
    

    },
  //   reportcomplete: function() {
  //     pivot.off("reportcomplete");
  //     var chart = new FusionCharts({
  //      // "type": "stackedcolumn2d",
  //      "type": "pie3d",
  //       "renderAt": "fusionchartContainer",
  //       "width": "100%",
  //       "height": 350
  //   });
  //   pivot.fusioncharts.getData({
  //       type: chart.chartType()
  //   }, function(data) {
  //       chart.setJSONData(data);
  //       chart.setChartAttribute("theme", "fusion");
  //       chart.render();
  //   }, function(data) {
  //       chart.setJSONData(data);
  //       chart.setChartAttribute("theme", "fusion");
  //   });
  // }
  });


 
  
}





}

