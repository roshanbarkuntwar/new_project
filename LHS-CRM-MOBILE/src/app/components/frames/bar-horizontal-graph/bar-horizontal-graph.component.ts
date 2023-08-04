import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
declare var google;
@Component({
  selector: 'app-bar-horizontal-graph',
  templateUrl: './bar-horizontal-graph.component.html',
  styleUrls: ['./bar-horizontal-graph.component.scss'],
})
export class BarHorizontalGraphComponent implements OnInit {
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
  piechart_3d:any;
  grapharray:any=[];
  singlevalueArray:any=[];
  barHorizontalGraph:any;
  barHorizontalGraphFlag:boolean=true;
  barHorizontalGraphValue:any;
  constructor( public globalObjects: GlobalObjectsService, private dataService: DataService) { 
    this.userDetails = globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    this.barHorizontalGraph = this.frame.design_control_type;
    if(this.barHorizontalGraph){
      this.barHorizontalGraphFlag = true;
    }else{
      this.barHorizontalGraphFlag = false;
      this.barHorizontalGraphValue = this.barHorizontalGraph;
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
        let obj={
          role: 'style' 
       }
        let tableKey = [];
          if (tableData.length > 0) {
            tableKey = Object.keys(tableData[0]);
          }
          let promptName = [];
          let i = 0;
          for (let table of tableData) {
            
            let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
            this.barchart_values=frameLevel4[0].apps_page_frame_seqid;
            // console.log(this.barchart_values)
            // this.piechart_3d=frameLevel4[0].apps_page_frame_seqid;
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
          
          if(frameLevel4.length ==2 && barRows.length ==2 ){
            colRow.push(obj);
          }
            promptName.push(colRow);
            // promptName.push(obj);
            tableRows[0] = promptName[0];
            if(frameLevel4.length ==2 && barRows.length ==2 ){
            barRows.push('color: #76A7FA');
            }
            tableRows.push(barRows);
          }
            
          this.grapharray = tableRows;

  
          console.log(this.grapharray)
         
          if(this.grapharray.length>0){
             
            this.drawsecond();
          }
         
        }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }

  
  drawsecond(){
    
    // var data = google.visualization.arrayToDataTable([
    //   ['Year', 'Visitations', 'test',{ role: 'style' } ],
    //   ['2010', 10,15, 'color: gray'],
    //   ['2020', 14,23, 'color: #76A7FA'],
    //   ['2030', 16,8, 'opacity: 0.2'],
    //   ['2040', 22, 9,'stroke-color: #703593; stroke-width: 4; fill-color: #C5A5CF'],
    //   ['2050', 28,10, 'stroke-color: #871B47; stroke-opacity: 0.6; stroke-width: 8; fill-color: #BC5679; fill-opacity: 0.2']
    // ]);
    var data = google.visualization.arrayToDataTable(this.grapharray);
    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" },
                     2]);

   
    if(this.grapharray.length >10){
      // ishan 50-bargraph
      
     var options = {
        chartArea:{
          width:'100%',
        },
        height:'auto',  
        bar: {groupWidth: "50%"},
        hAxis: {showTextEvery: 1,slantedText:'true',slantedTextAngle: '60' },
        isStacked: false,
        legend: { position: "none" },
        width:'100%', 
      };
      setTimeout(() => {
        let element=document.getElementById(this.barchart_values)
        var chart = new google.visualization.ColumnChart(element);
        chart.draw(data, options);
       }
       , 100);
      
    }else{
      // prashant double bar
      var myoptions = {
      /*   chartArea:{
          width:'90%',left:40
        }, */
      /*   height:300,  */
        legend: { position: 'none' },  
        bar: {groupWidth: "50%"},
      };
  
      setTimeout(() => {
  
        let element=document.getElementById(this.barchart_values)
        var chart = new google.visualization.ColumnChart(element);
        chart.draw(data, myoptions);
       }
       , 100);
    }
    
   
  }


  
}
