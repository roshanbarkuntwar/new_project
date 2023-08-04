import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-frame-dashboard-graph',
  templateUrl: './frame-dashboard-graph.component.html',
  styleUrls: ['./frame-dashboard-graph.component.scss'],
})
export class FrameDashboardGraphComponent implements OnInit {
  @Input() frame: any = {};
  @Input() resfromTable: any = {};
  //frametable: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitForPdf: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('pieCanvas') pieCanvas;
  @ViewChild('lineCanvas') lineCanvas;
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
  xdataitem_name: any;
  ydataitemname: any = [];
  arrayOfColor: any = [];
  lengthforpie: number;
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");

    // this.filtergraph = this.frame.flag;

  }

  ngOnInit() {
    // alert(1);
    if (this.frame.flag) {
      if (this.frame.flag == 'B') {
        this.filtergraph = 'bar';
      } else if (this.frame.flag == 'D') {
        this.filtergraph = 'doughnout';
      } else if (this.frame.flag == 'L') {
        this.filtergraph = 'line';
      } else if (this.frame.flag == 'P') {
        this.filtergraph = 'pie';
      }
    }

    console.log("this.frame.in dashborad graph..>>>", this.frame)
    this.getData();
  }

  getData() {
    this.globalObjects.showLoading();
    console.log("from frame table data ", this.resfromTable);
    let wscp: any = {};
    wscp.service_type = "frame_sql_populate_data";
    wscp.from_row = 1;
    wscp.to_row = 100;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }
    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      console.log("res in framedashborad", res)
      this.globalObjects.hideLoading();
      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        if (tableData && tableData.length > 0) {
          let tableKey = Object.keys(tableData[0])

          for (let table of tableData) {
            let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
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
            // console.log("framelevel4 in dashboard graph",frameLevel4);
            for (let x of frameLevel4) {
              // separate labels
              var xdata = x.Level5[0].value;
              if (xdata) {
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
      console.log("this.xaxisdata", this.xaxisData);
      this.xaxisData.shift();
      this.xdataitem_name = JSON.parse(JSON.stringify(this.xaxisData));

      // dropdown for xaxis labels
      let xin: number = -1;
      for (let x of this.xdataitem_name) {
        let xdataitem;
        xin++;
        for (let y of x) {
          xdataitem = y.Level5[0].prompt_name;
        }
        this.xitem_name.push({
          key: xin,
          value: xdataitem
        });
      }
      this.ydataitemname.shift();
      console.log("YDATAITEMNAME", this.ydataitemname);
      this.chooseOption();

    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
    })
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
      let numstore = 0.13 * i;
      var randomColor: any = Math.floor(numstore * 16777215).toString(16);
      var randomjoin = "#" + randomColor;
      this.arrayOfColor.push("#6666ff");
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
    
    console.log("value of xaxis", valuesofXaxis);
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
    if (arrayofgraph1.length > 0) {
      for (let i = 0; i < arrayofgraph1.length; i++) {
        //arrayofgraph1[0].backgroundColor="blue";
        arrayofgraph1[i].borderColor = "lightblue";
        arrayofgraph1[i].fill = false;
        arrayofgraph1[i].lineTension = 0;
        arrayofgraph1[i].radius = 5;
      }
    }
    var fontvar;
    var tooltipvar;
    var x = window.matchMedia("(max-width: 950px)")
    console.log(x.matches);
    if(x.matches){
         
    }else{
      fontvar=30;
      tooltipvar=40;

    }
    console.log(fontvar)
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: xaxis,
        datasets: arrayofgraph1
      },
      options: {
        responsive: true,
       
        // legend: {
        //   display: false,
        //   position: "bottom",
        //   labels: {
        //     fontColor: "#333",
        //     fontSize: 16
        //   }
        // }, tooltips: {
        //   // titleFontSize: 20,
        //   bodyFontSize:tooltipvar
          
          

        // },
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true,
        //       fontSize:fontvar
        //     }
        //   }],
        //   xAxes: [{
        //     ticks: {
        //         fontSize:fontvar
        //     }
        // }]

        // }
      }
    });
  }
  piechartMethod(xaxis, arrayofgraph1) {
    console.log("arrayofgraph1 in pie", arrayofgraph1);

    let dataforpie: any = [];
    let backgcolor: any = [];
    let count: number = -1;
    ///////////////
    let singlepiedata: any = [];
    let count1: number = -1;
    let datapiesingle: any = [];
    let color: any = [];
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
          singlepiedata = (x.data);
        }

        //  dataforpie[count].push(x.data[count])
        //  
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

    for (let x of singlepiedata) {
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
    
    console.log("jsonArr22", jsonArr2);
    console.log("jsonArr", jsonArr)
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

