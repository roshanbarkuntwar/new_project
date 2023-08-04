import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  tablerowsfilter:any;
  current_page_parameter: any = {};
  userDetails: any;
  l_total_rows: any;
  dialer: any;
  
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService) { 

    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    this. getData();
  }
  filterToggle(){
console.log("is")
  }
  openMike(){
    console.log("is")
  }

  openbarcodescanner(){
    console.log("openscanner")
  }
  getData() {
    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }


    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      console.log("res..in plain kpi card...", res)


      let data: any = res;
      if (data.responseStatus == "success") {

        let tableRows = [];
        //  let tableData = data.responseData.Level1;
        //  let tableKey = Object.keys(tableData[0])

        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        let tableKey = Object.keys(tableData[0])

        this.l_total_rows = tableData[0].TOTAL_ROWS;

        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if (item.item_name.toUpperCase() == key.toUpperCase()) {
                  item.value = table[key]
                
                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }

        this.frame.tableRows = tableRows;
        console.log("chat lists tablrows: ", tableRows);


      }
    }).catch(err => {
      console.log('vijay frame-table.component.ts Something went wrong :', err);

      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })

  }
 


  getParsedJson(json) {
    try {
      if (json) {
        return JSON.parse(json)
      } else {
        return {}
      }
    } catch (err) {
      if (typeof json == 'object') {
        return json;
      } else {
        return {}
      }
    }
  }

}
