import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
declare var google
@Component({
  selector: 'app-frame-single-scale-column-chart',
  templateUrl: './frame-single-scale-column-chart.component.html',
  styleUrls: ['./frame-single-scale-column-chart.component.scss'],
})
export class FrameSingleScaleColumnChartComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  callingObjectArr: any[];
  singleScalechart_values: any;
  tableData: any;
  userDetails: any;
  rowColName: any = [];
  grapharray: any[];
  singleScaleColumnChart:any;
  singleScaleColumnChartFlag:boolean=true;
  singleScaleColumnChartValue:any;
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService) {
    this.userDetails = globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    this.singleScaleColumnChart = this.frame.design_control_type;
    if(this.singleScaleColumnChart){
      this.singleScaleColumnChartFlag = true;
    }else{
      this.singleScaleColumnChartFlag = false;
      this.singleScaleColumnChartValue = this.singleScaleColumnChart;
    }
    this.getData();
  }

  getData() {
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;

    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;

    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }


    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }


    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      let data: any = res;
      if (data.responseStatus == "success") {
        let tableRows = [];
        let objData = this.globalObjects.setPageInfo(data.responseData);

        // For Getting *CALLING_OBJECT_CODE* from Frame //
        this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
        // For Getting *CALLING_OBJECT_CODE* from Frame //

        let tableData = objData.Level1;
        this.tableData = tableData;
        let itemData: any;

        let tableKey = [];
        if (tableData.length > 0) {
          tableKey = Object.keys(tableData[0]);
        }
        let promptName = [];
        let i = 0;
        for (let table of tableData) {

          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
          this.singleScalechart_values = frameLevel4[0].apps_page_frame_seqid
          let colRow = [];
          let barRows = [];
          for (let itemGroup of frameLevel4) {
            i++;
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  item.value = table[key]
                  if (isNaN(item.value)) {
                    barRows.push(item.value);
                  } else {
                    barRows.push(parseFloat(item.value));
                  }
                  colRow.push(item.prompt_name);
                }
              }
            }
          }
          //  barRows[0].color = "gold";
          // let style = {
          //   role:"style"
          // }
          // colRow.push(style);
          promptName.push(colRow);
          tableRows[0] = promptName[0];


          tableRows.push(barRows);
        }

        this.grapharray = tableRows;

        console.log(this.frame)
        if (this.grapharray.length > 0) {
          // this.callGraph();
          google.charts.load('current', { 'packages': ['bar'] });
          google.charts.setOnLoadCallback(this.drawChart());
        }

      }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }

  drawChart() {
    var data = google.visualization.arrayToDataTable(this.grapharray);

    var options = {
      bars: 'vertical',
      vAxis: { format: 'decimal' },
      height: 'auto',
    };



    setTimeout(() => {
      let element = document.getElementById(this.singleScalechart_values);
      var chart = new google.charts.Bar(element);
      chart.draw(data, google.charts.Bar.convertOptions(options));
    }
      , 100);

  }
}
