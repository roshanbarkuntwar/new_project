import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
declare var google
@Component({
  selector: 'app-frame-bar',
  templateUrl: './frame-bar.component.html',
  styleUrls: ['./frame-bar.component.scss'],
})
export class FrameBarComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  callingObjectArr: any[];
  barchart_values:any;
  tableData: any;
  userDetails: any;
  rowColName:any = [];
   colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
  grapharray: any[];
  barGraph:any;
  barGraphFlag:boolean = true;
  barGraphValue:any;
  constructor(  public globalObjects: GlobalObjectsService, private dataService: DataService) { 
    this.userDetails = globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    this.barGraph = this.frame.design_control_type;
    if(this.barGraph){
      this.barGraphFlag = true;
    }else{
      this.barGraphFlag = false;
      this.barGraphValue = this.barGraph;
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
          this.barchart_values=frameLevel4[0].apps_page_frame_seqid
          let colRow = [];
          let barRows = [];
          for (let itemGroup of frameLevel4) {
            i++;
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  item.value = table[key]
                  if(isNaN(item.value)){
                    barRows.push(item.value);
                  }else{
                  barRows.push(parseFloat(item.value));
                  }
                  colRow.push(item.prompt_name);
                }
              }
            }
          }
        //  barRows[0].color = "gold";
          let style = {
            role:"style"
          }
          colRow.push(style);
          promptName.push(colRow);
          tableRows[0] = promptName[0];

          barRows[barRows.length ] = this.colorArray[i];
          tableRows.push(barRows);
        }
          
        this.grapharray = tableRows;

        console.log(this.frame)
        if(this.grapharray.length>0){
          // this.callGraph();
          this.drawChart();
        }
       
      }
  }).catch(err => {
    this.globalObjects.presentToast("2 Something went wrong please try again later!");
    console.log(err);
  })
}

drawChart() {
  var data = google.visualization.arrayToDataTable(this.grapharray);

  var view = new google.visualization.DataView(data);
  view.setColumns([0, 1,
                   { calc: "stringify",
                     sourceColumn: 1,
                     type: "string",
                     role: "annotation" },
                   2]);

  var options = {
  
  
    bar: {groupWidth: "95%"},
    legend: { position: "none" },
  };

  setTimeout(() => {
    let element=document.getElementById(this.barchart_values)
    var chart = new google.visualization.BarChart(element);
    chart.draw(view, options);
   }
   , 100); 
}

}