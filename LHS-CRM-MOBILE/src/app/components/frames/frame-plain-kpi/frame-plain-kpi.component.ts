import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-frame-plain-kpi',
  templateUrl: './frame-plain-kpi.component.html',
  styleUrls: ['./frame-plain-kpi.component.scss'],
})
export class FramePlainKpiComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
 
  userDetails: any;
  l_total_rows: number;
  dialer: any;
  tablerowsfilter:any;
   
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService) { 

    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    console.log("frame in frame timeline card component..>>", this.frame);
    this.getData();
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
                  if(item.item_type == 'DI'){
                    this.dialer = table[key];
                  }
                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }

        this.frame.tableRows = tableRows;
        console.log("plain kpi tablrows: ", tableRows);


      }
    }).catch(err => {
      console.log('vijay frame-table.component.ts Something went wrong :', err);

      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })

  }

  itemClicked(event, rowindex) {
    console.log("itemClicked vijay plain kpi  -->" + rowindex, event);
    if (event.click_events_str == "editItem") {
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.tableRows[rowindex]))
      for (let itemGroup of frameLevel4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            let temp = item.design_control_type_auto_card;
            item.design_control_type_auto_card = item.design_control_type;
            item.design_control_type = temp;

            temp = item.display_setting_str_auto_card;
            item.display_setting_str_auto_card = item.display_setting_str;
            item.display_setting_str = temp;

            temp = item.flag_auto_card;
            item.flag_auto_card = item.item_visible_flag;
            item.item_visible_flag = temp;

            item.item_type = item.temp_item_type

          }
        }
      }
      this.frame.tableRows.splice(rowindex, 1);
      event.EDIT_ITEM = frameLevel4;
      this.emitPass.emit(event);
    } else if (event.click_events_str == "deleteItem") {
      this.frame.tableRows.splice(rowindex, 1);
    }
    else {
      event.wsdp = [];
      let col = {};
      for (let itemGroup of this.frame.tableRows[rowindex]) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else {
              col[item.apps_item_seqid] = item.value
            }
          }
        }
      }

      event.wsdp.push(col);
    }
    this.emitPass.emit(event);
  }
}
