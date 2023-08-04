import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-frame-task-management',
  templateUrl: './frame-task-management.component.html',
  styleUrls: ['./frame-task-management.component.scss'],
})
export class FrameTaskManagementComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  userDetails: any;
  
  public show: boolean = false;
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService) { 
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    console.log('wsdp ',this.wsdp)
    console.log('frame ',this.frame)
  }
  toggle() {
    this.show = !this.show;
  }

  getData(a_from_row: number, a_to_row: number, a_currentPage: number) {

    console.log('from row to row ' + a_from_row + '  to row   ' + a_to_row + ' currentpage ' + a_currentPage);
    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    
    
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

   

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      this.globalObjects.hideLoading();

      let data: any = res;
      if (data.responseStatus == "success") {

        let tableRows = [];
        let tableData = data.responseData.Level1;
        let tableKey = Object.keys(tableData[0])
        

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
        console.log(" vijay this.frame");
        console.log(this.frame);

      }

    }).catch(err => {
      console.log('vijay frame-table.component.ts Something went wrong :',err);
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }
  
}
