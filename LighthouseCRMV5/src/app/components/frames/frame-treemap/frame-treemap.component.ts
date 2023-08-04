import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
declare var google;
@Component({
  selector: 'app-frame-treemap',
  templateUrl: './frame-treemap.component.html',
  styleUrls: ['./frame-treemap.component.scss'],
})
export class FrameTreemapComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  chart_div:any;
  callingObjectArr: any[];
  tableData: any;
  userDetails: any;
  arraygraph: any[];
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService) {
    this.userDetails = globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
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
          this.chart_div=frameLevel4[0].apps_page_frame_seqid;
          let colRow = [];
          let barRows = [];
          for (let itemGroup of frameLevel4) {
            i++;
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  if (table[key]) {
                    item.value = table[key];
                  } else {
                    item.value = null;
                  }
                  if (isNaN(item.value)) {
                    barRows.push(item.value);
                  } else {
                    if (item.value) {
                      barRows.push(parseInt(item.value));
                    } else {
                      barRows.push(item.value);
                    }
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
        console.log(tableRows)

        this.arraygraph = tableRows;

        console.log(this.arraygraph)
        if(this.arraygraph.length>0){

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


    setTimeout(() => {
      let element=document.getElementById(this.chart_div);
      var data = google.visualization.arrayToDataTable(this.arraygraph);

    var tree = new google.visualization.TreeMap(document.getElementById(this.chart_div));

    tree.draw(data, {
      minColor: '#f00',
      midColor: '#ddd',
      maxColor: '#0d0',
      headerHeight: 15,
      fontColor: 'black',
      showScale: true
      //generateTooltip: showFullTooltip
    });
     
    } ,100);
    
    /* console.log("function is calling");
    function showFullTooltip(row, size, value) {
      console.log("function is calling");
      return '<div style="background:#fd9; padding:10px; border-style:solid">' +
             '<span style="font-family:Courier"><b>' + "chaitanya" +
             '</b>, ' + "pagla" + ', ' + "hai" +
             ', ' + "wo" + '</span><br>' +
             'Datatable row: ' + row + '<br>' +
       "haramkhor" +
             ' (total value of this cell and its children): ' + size + '<br>' +
      "hai" + ': ' + value + ' </div>';
    } */
  }



}
