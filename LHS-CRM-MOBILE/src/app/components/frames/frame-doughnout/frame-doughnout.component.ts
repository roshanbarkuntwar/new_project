import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { typeSourceSpan } from '@angular/compiler';


declare var google;
@Component({
  selector: 'app-frame-doughnout',
  templateUrl: './frame-doughnout.component.html',
  styleUrls: ['./frame-doughnout.component.scss'],
})
export class FrameDoughnoutComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  donutchart:any;
  callingObjectArr: any[];
  tableData: any;
  userDetails: any;
  grapharray: any = [];
  doughnoutGraph:any;
  doughnoutGraphFlag:boolean=true;
  doughnoutGraphValue:any;
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService) {
    this.userDetails = globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    this.doughnoutGraph = this.frame.design_control_type;
    if(this.doughnoutGraph){
      this.doughnoutGraphFlag = true;
    }else{
      this.doughnoutGraphFlag = false;
      this.doughnoutGraphValue = this.doughnoutGraph;
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
            
            let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
            this.donutchart=frameLevel4[0].apps_page_frame_seqid;
            console.log(this.donutchart)
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
            promptName.push(colRow);
            tableRows[0] = promptName[0];
            tableRows.push(barRows);
          }
            
          this.grapharray = tableRows;
  
          console.log(this.frame)
          if(this.grapharray.length>0){

            this.drawChart();
          }
         
        }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }
  drawChart() {
    var data = google.visualization.arrayToDataTable(
     this.grapharray
    );

    var options = {
      chartArea:{width:'90%',height:'90%'},
      pieHole: 0.4,
      tooltip:{trigger:'selection'}
    };
   
   setTimeout(() => {
    let element=document.getElementById(this.donutchart)
     let chart = new google.visualization.PieChart(element);
     chart.draw(data, options)
   }
   , 100);
  
  }

}
