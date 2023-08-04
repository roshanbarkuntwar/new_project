import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

declare var google;
@Component({
  selector: 'app-frame-geochart',
  templateUrl: './frame-geochart.component.html',
  styleUrls: ['./frame-geochart.component.scss'],
})
export class FrameGeochartComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  chart_div: any;
  callingObjectArr: any[];
  tableData: any;
  userDetails: any;
  arraygraph: any[];
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService) {
    this.userDetails = globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    console.log(this.frame);
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
        let tableRows1 = [];
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
          this.chart_div = frameLevel4[0].apps_page_frame_seqid;
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
          tableRows.push(frameLevel4);
          //  barRows[0].color = "gold";
          promptName.push(colRow);
          tableRows1[0] = promptName[0];
          tableRows1.push(barRows);
        }
        this.frame.tableRows = tableRows;
        console.log( this.frame.tableRows)

        this.arraygraph = tableRows1;

        console.log(this.arraygraph)
        if (this.arraygraph.length > 0) {

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


   
let arraydata = [
  ['State Code', 'State',   'Popularity'],
  ['IN-AP','Andhra Pradesh', 36],
  ['IN-AR','Arunachal Pradesh', 20],
  ['IN-AS','Assam', 200],
  ['IN-BH','Bihar', 204],
  ['IN-CH','Chhattisgarh', 204],
  ['IN-GA','Goa', 207],
  ['IN-GJ','Gujarat', 208],
  ['IN-HR','Haryana', 209],
  ['IN-HP','Himachal Pradesh', 206],
  ['IN-JK','Jharkhand', 20],
  ['IN-KA','Karnataka', 203],
  ['IN-KL','Kerala', 20],
  ['IN-MP','Madhya Pradesh', 255],
  ['IN-MH','Maharashtra', null],
  ['IN-MN','Manipur', 265],
  ['IN-ME','Meghalaya', 260],
  ['IN-MI','Mizoram', 240],
  ['IN-NL','Nagaland', 20],
  ['IN-OR','Odisha', 20],
  ['IN-PB','Punjab', 20],
  ['IN-RJ','Rajasthan', 20],
  ['IN-SK','Sikkim', null],
  ['IN-TN','Tamil Nadu', 20],
]

    

  
 console.log(this.frame)



    setTimeout(() => {
      let element = document.getElementById(this.chart_div);
      var data = google.visualization.arrayToDataTable(this.arraygraph);

      var chart = new google.visualization.GeoChart(document.getElementById(this.chart_div));
      var options = {
        region: 'IN' , // Africa
        mapType: 'styledMap',
        displayMode:'markers',
        domain:'IN',
        trigger:'none',
        // displayMode: 'text',
        colorAxis: {colors: ['#00853f', 'black', '#e31b23','#FF5733','#FFCA33','#9CFF33']},
        backgroundColor: '#000000',
        // datalessRegionColor: '#f8bbd0',
        // defaultColor: '#f5f5f5',
        magnifyingGlass:{enable: true, zoomFactor: 5.0}
        // defaultColor: '#f5f5f5',
      };
      chart.draw(data, options);
      google.visualization.events.addListener(chart, 'select',  ()=> {
        var selection = chart.getSelection();
        if (selection.length > 0) {
        
         
          var v=data.getValue(selection[0].row, 0);
          console.log(">>>>>",selection[0].row);
          console.log(">>====>>>",data.Wf[selection[0].row]);
        this.selectHandler1(data.Wf[selection[0].row].c);   
          //window.open('http://' + data.getValue(selection[0].row, 2), '_blank');
        }
      });
     }

     
     , 100);

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

  selectHandler1(e) {
console.log(e);
  let event:any=[];
  let col = {};
  let wsdp = [];
  let cnt=0;
  for (let itemGroup of this.frame.Level4) {
    for (let item of itemGroup.Level5) {
          item.value=e[cnt].v;
          console.log(item);
      col[item.apps_item_seqid] = item.value;
      if(item.prompt_name=='Location'){
        item.value=e[cnt].v;
        event=item;
      }
    } 
    cnt++;
  } 


  wsdp.push(col);  
  event.wsdp = wsdp;
  event.callingObjectArr = this.callingObjectArr;
  
  this.emitPass.emit(event);
}

}
