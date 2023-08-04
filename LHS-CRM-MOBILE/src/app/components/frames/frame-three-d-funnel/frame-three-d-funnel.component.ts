import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
declare var AmCharts;
@Component({
  selector: 'app-frame-three-d-funnel',
  templateUrl: './frame-three-d-funnel.component.html',
  styleUrls: ['./frame-three-d-funnel.component.scss'],
})
export class FrameThreeDFunnelComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  grapharray: any[];
  developerModeData: { ws_seq_id: any; frame_seq_id: any; };
  piechart_3d: any;
  rotate:boolean = true;
  threeDfunnel:any;
  threeDFunnelFlag:any;
  threeDFunnelValue:any;
  constructor(private dataService: DataService, private globalObjects: GlobalObjectsService, public modalController: ModalController) { 
    this.userDetails = globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    if(this.frame.apps_frame_type == "3D-PYRAMID-GRAPH"){
        this.rotate = true;
    }else{
        this.rotate= false;
    }
    this.threeDfunnel = this.frame.design_control_type;
    if(this.threeDfunnel){
      this.threeDFunnelFlag = true;
    }else{
      this.threeDFunnelFlag = false;
      this.threeDFunnelValue = this.threeDfunnel;
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
        //this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
        // For Getting *CALLING_OBJECT_CODE* from Frame //
  
        let tableData = objData.Level1;
        //this.tableData = tableData;
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
           console.log(this.piechart_3d);
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
                        obj.title=item.value;
                      // barRows.push(obj);
                    }else{
                      obj.value=parseInt(item.value);
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
        if(this.grapharray.length > 0){
          this.drawChart();
        }
  
          // console.log(this.frame)
          // if(this.grapharray.length>0){

          //   // this.functiosn();
          //   console.log("this.funnel ",this.grapharray)
          //   this.functiosn();
          // }
         console.log(this.grapharray);
        }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }

  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: null,
      frame_seq_id: this.frame.apps_page_frame_seqid
    }
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData
      }
    });
    return await modal.present();
  }

drawChart(){
  setTimeout(() => {
    var chart = AmCharts.makeChart( "chartdiv", {
      "type": "funnel",
      "theme": "light",
      "dataProvider": this.grapharray,
      "balloon": {
        "fixedPosition": false
      },
      "valueField": "value",
      "titleField": "title",
      "marginRight": 200,
      "marginLeft": 50,
      "startX": 500,
      "rotate": this.rotate,
      "depth3D": 50,
      "angle": 80,
      "outlineAlpha": 1,
      "animationRequested": false,
      "outlineColor": "#FFFFFF",
      "outlineThickness": 2,
      "labelPosition": "right",
      "balloonText": "[[title]]: [[value]]n[[description]]",
      "export": {
        "enabled": true
      }
    } );
    chart.validateNow();
  }, 200);
}

}
