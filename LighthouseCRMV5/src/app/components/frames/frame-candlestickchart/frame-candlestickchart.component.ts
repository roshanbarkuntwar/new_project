import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
declare var google;

@Component({
  selector: 'app-frame-candlestickchart',
  templateUrl: './frame-candlestickchart.component.html',
  styleUrls: ['./frame-candlestickchart.component.scss'],
})
export class FrameCandlestickchartComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  
  callingObjectArr: any[];
  tableData: any;
  userDetails: any;
  rowColName:any = [];
  grapharray: any=[];
  tableRows: any;
  candleGraph:any;
  candleGraphFlag:boolean=false;
  candleGraphValue:any;
  constructor(  public globalObjects: GlobalObjectsService, private dataService: DataService) { 
    this.userDetails = globalObjects.getLocallData("userDetails");
    
  }
  ionViewDidEnter() {
   
  }
  ngOnInit() {
    this.candleGraph = this.frame.design_control_type;
    if(this.candleGraph){
      this.candleGraphFlag = true;
    }else{
      this.candleGraphFlag = false;
      this.candleGraphValue = this.candleGraph;
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
            let stringValue=[];
            let numbervalue=[];
            let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
            for (let itemGroup of frameLevel4) {
              for (let item of itemGroup.Level5) {
                for (let key of tableKey) {
                  if (item.item_name.toUpperCase() == key.toUpperCase()) {
                    item.value = table[key]
                    if(isNaN(item.value)){
                        stringValue.push(item.value)
                    }else{
                      numbervalue.push(parseFloat(item.value));
                    }
                  }
                }
              }
            } 
            let myarray:any=[];
            // myarray.push(stringValue[0]);
            numbervalue.push(23);
            myarray=stringValue.concat(numbervalue);
            this.tableRows=myarray;
            this.grapharray.push(this.tableRows);
            // console.log(this.grapharray)

            
          }
          this.frame.tableRows = this.grapharray;
          
            console.log(this.grapharray)
        
          console.log(this.frame)
          if(this.grapharray.length>0){
            this.drawChart();
            // this.callGraph();
          }
          
        }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }

  drawChart() {
   
    var data = google.visualization.arrayToDataTable(this.grapharray,true);

    var options = {
      legend:'none',
      bar: { groupWidth: '100%' }, // Remove space between bars.
      candlestick: {
        fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
        risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
      }
    };

    var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

    chart.draw(data, options);
  }
}