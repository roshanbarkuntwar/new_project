import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/demo-utils/event/events';


@Component({
  selector: 'app-frame-graph',
  templateUrl: './frame-graph.component.html',
  styleUrls: ['./frame-graph.component.scss'],
})
export class FrameGraphComponent implements OnInit {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('pieCanvas') pieCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  arrayofgraph: any = [];
  arrayoflabel: any = [];
  @Input() resfromTable: any = {};
  barChart: any;
  doughnutChart: any;
  lineChart: any;
  piechart: any;
  filtergraph: any = 'bar';
  valueofxitem: any = 0;
  userDetails: any;
  xaxisData: any = [];
  yaxisData: any = [];
  tablerows: any = [];
  xitem_name: any = [];
  xdataitem_name: any=[];
  ydataitemname: any = [];
  arrayOfColor: any = [];
  lengthforpie: number;

  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService, private events: Events) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }
  ngOnInit() {
    if (this.resfromTable.flag) {
      if (this.resfromTable.flag == 'B') {
        this.filtergraph = 'bar';
      } else if (this.resfromTable.flag == 'D') {
        this.filtergraph = 'doughnout';
      } else if (this.resfromTable.flag == 'L') {
        this.filtergraph = 'line';
      } else if (this.resfromTable.flag == 'P') {
        this.filtergraph = 'pie';
      }
    }
    console.log(this.resfromTable);
    this.getData();
  }

  getData() {
  
    let data: any = this.resfromTable;
    if (data.responseStatus == "success") {
      let objData = this.globalObjects.setPageInfo(data.responseData);
      let tableData = objData.Level1;
      if (tableData && tableData.length > 0) {
        let tableKey = Object.keys(tableData[0])

        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.resfromTable.Level4));
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if (item.item_name.toUpperCase() == key.toUpperCase()) {
                  item.value = table[key];
                }
              }
            }
          }
          let z: number = 0;
          let y: number = 0;
          console.log("framelevel4 in frame graph",frameLevel4);
          for (let x of frameLevel4) {
            // separate labels

            var xdata = x.Level5[0].value;
            if(xdata){
            if (isNaN(xdata)) {
              z++;
              if (this.xaxisData[z]) {
                this.xaxisData[z].push(x);

              } else {
                this.xaxisData[z] = [];
                this.xaxisData[z].push(x);
              }
            }
            else {
              y++;
              // separate values
              if (this.yaxisData[y]) {
                this.yaxisData[y].push(x.Level5[0].value);
                this.ydataitemname[y] = (x.Level5[0].prompt_name);
              } else {

                this.yaxisData[y] = [];
                this.yaxisData[y].push(x.Level5[0].value);
                this.ydataitemname[y] = [];
                this.ydataitemname[y] = (x.Level5[0].prompt_name);
              }
            }
          }
          }
        }
      }
    }
    console.log("this.xaxisdata",this.xaxisData);
    this.xaxisData.shift();
    console.log("yaxisdata", this.yaxisData)
    this.xdataitem_name = JSON.parse(JSON.stringify(this.xaxisData));
    console.log("this.xdataitem_name",this.xdataitem_name);
    // dropdown for xaxis labels
    let xin: number = -1;
    for (let x of this.xdataitem_name) {
      let xdataitem;
      xin++;
      for (let y of x) {
        xdataitem= y.Level5[0].item_name;
      }
      this.xitem_name.push({
        key: xin,
        value: xdataitem
      });
    }
    console.log("drop down of x xitemname", this.xitem_name)
    this.ydataitemname.shift();
    this.chooseOption();
  }
  chooseOption() {
    
    let xdataOfxaxis = JSON.parse(JSON.stringify(this.xaxisData[this.valueofxitem]));
    let valuesofXaxis: any = [];  //labels for x axis
    for (let x of xdataOfxaxis) {
      valuesofXaxis.push(x.Level5[0].value);
    }
    let arrayofgraph1 = [];
    let ydata = JSON.parse(JSON.stringify(this.yaxisData))
    ydata.shift();
    this.lengthforpie = ydata[0].length;
    for (let i = 0; i < ydata.length; i++) {
      var randomColor: any = Math.floor(Math.random() * 9563).toString(16);
      var randomjoin = "#" + randomColor;
      this.arrayOfColor.push(randomjoin);//random color generate for graph
    }
    console.log("arrayOfColor", this.arrayOfColor)
    let yitemcount: number = -1;
    for (let x of ydata) {
      yitemcount++;
      let objectdata =
      {
        label: this.ydataitemname[yitemcount], //y item choose option
        data: x,                              // x data 
        backgroundColor: this.arrayOfColor[yitemcount],   //color of bars

      }
      arrayofgraph1.push(objectdata);
    }
    console.log("valueof xaxis", valuesofXaxis);
    console.log("arrayofgraph", arrayofgraph1);
    this.lineChartMethod(valuesofXaxis, arrayofgraph1);
    this.barChartMethod(valuesofXaxis, arrayofgraph1);
    this.doughnutChartMethod(valuesofXaxis, arrayofgraph1);
    this.piechartMethod(valuesofXaxis, arrayofgraph1);
  }

  barChartMethod(xaxis, arrayofgraph1) {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',

      data: {
        labels: xaxis,
        datasets: arrayofgraph1

      },
      options: {
        responsive: true,

        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true
        //     }
        //   }]
        // }
      }
    });

  }

  doughnutChartMethod(xaxis, arrayofgraph1) {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data:
      {
        labels: xaxis,
        datasets: arrayofgraph1

      },
      options: {
        responsive: true,

        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: false,
        //     }
        //   }]
        // },
        // legend: {
        //   display: false
        // },
      }
    });
  }

  lineChartMethod(xaxis, arrayofgraph1) {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: xaxis,
        datasets: arrayofgraph1

      },
      options: {
        responsive: true,

        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true
        //     }
        //   }]
        // }
      }
    });
  }
  piechartMethod(xaxis, arrayofgraph1) {
    let dataforpie: any = [];
    let backgcolor: any = [];
    let count: number = -1;
     ///////////////
     let singlepiedata:any=[];
     let count1: number = -1;
     let datapiesingle:any=[];
     let color:any=[];
     for (let i = 0; i < this.lengthforpie; i++) {
       let numstore = 0.13 * i;
       var randomColor: any = Math.floor(numstore * 16777215).toString(16);
       var randomjoin = "#" + randomColor;
       color.push(randomjoin);//random color generate for graph
     }
 ///////////////
    for (let i = 0; i < this.lengthforpie; i++) {
      count++;
      for (let x of arrayofgraph1) {
        if (count == 0) {
          backgcolor.push(x.backgroundColor)
        }
        if (dataforpie[count]) {
          dataforpie[count].push(x.data[count]);

        } else {
          dataforpie[count] = [];
          dataforpie[count].push(x.data[count]);
        }
      }
    }
    var jsonArr = [];
    for (var i = 0; i < this.lengthforpie; i++) {
      jsonArr.push({
        backgroundColor: backgcolor,
        data: dataforpie[i],
      });
    }
    //////////////
    
     
    for(let x of singlepiedata){
      count1++;
      if (datapiesingle[count1]) {
        datapiesingle[count1].push(x);
      } else {
        datapiesingle[count1] = [];
        datapiesingle[count1].push(x);
      }
    }
  
    var jsonArr2 = [];

    // for (var i = 0; i < this.lengthforpie; i++) {
      jsonArr2.push({
        backgroundColor: color,
        data: singlepiedata,
      });
    // }
   ////////////
   console.log("jsonArr22", jsonArr2);

    console.log("jsonArr", jsonArr)
    console.log("yadata", xaxis)
    this.piechart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: xaxis,
        datasets: jsonArr2
      },
      options: {
        // title: {
        //   display: true,
        // }
      }
    });
  }
}
