import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
declare var CanvasJS;

@Component({
  selector: 'app-frame-funnelgraph',
  templateUrl: './frame-funnelgraph.component.html',
  styleUrls: ['./frame-funnelgraph.component.scss'],
})
export class FrameFunnelgraphComponent implements OnInit {
Chart:any=[];
@Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  callingObjectArr: any[];
  piechart_3d:any;
  tableData: any;
  grapharray:any=[];
  funnelGraph:any;
  funnelGraphFlag:boolean=true;
  funnelGraphValue:any;
  constructor( private globalObjects: GlobalObjectsService, private dataService: DataService) {
    this.userDetails = globalObjects.getLocallData("userDetails");
   }

  ngOnInit() {
    console.log("funnel graph")
    // this.functiosn();
    this.funnelGraph = this.frame.design_control_type;
    if(this.funnelGraph){
      this.funnelGraphFlag = true;
    }else{
      this.funnelGraphFlag = false;
      this.funnelGraphValue = this.funnelGraph;
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
            this.piechart_3d=frameLevel4[0].apps_page_frame_seqid;
            let colRow = [];
            let barRows = [];
            let obj:any={};
            for (let itemGroup of frameLevel4) {
              i++;
            
              for (let item of itemGroup.Level5) {
               
                for (let key of tableKey) {
                  if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                    item.value = table[key]
                  
                      
                    if(isNaN(item.value)){
                        obj.label=item.value;
                      // barRows.push(obj);
                    }else{
                      obj.y=parseInt(item.value);
                    // barRows.push(obj);
                    }
                    // colRow.push(item.prompt_name);
                  }
                }
              
              }
              
            }
            barRows.push(obj);
          //  barRows[0].color = "gold";
            // promptName.push(colRow);
            // tableRows[0] = promptName[0];
            tableRows.push(obj);
          }
            
          this.grapharray = tableRows;
  
          // console.log(this.frame)
          if(this.grapharray.length>0){

            // this.functiosn();
            console.log("this.funnel ",this.grapharray)
            this.functiosn();
          }
         
        }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }




  functiosn() {

    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2", //"light1", "dark1", "dark2"
      title:{
      //  text: "Sales Analysis - June 2016"
      },
      data: [{
        type: "funnel",
        indexLabelPlacement: "inside",
        indexLabelFontColor: "white",
        toolTipContent: "<b>{label}</b>: {y} <b>({percentage}%)</b>",
        indexLabel: "{label} ({percentage}%)",
        dataPoints: this.grapharray
          // { y: 1400, label: "Leads" },
          // { y: 1212, label: "Initial Communication" },
          // { y: 1080, label: "Customer Evaluation" },
          // { y: 665,  label: "Negotiation" },
          // { y: 578, label: "Order Received" },
          // { y: 549, label: "Payment" }
        
      }]
    });
    

    var dataPoint = chart.options.data[0].dataPoints;
    var total = dataPoint[0].y;
    for(var i = 0; i < dataPoint.length; i++) {
      if(i == 0) {
        chart.options.data[0].dataPoints[i].percentage = 100;
      } else {
        chart.options.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
      }
    }
    chart.render();
    
    }

    

}
