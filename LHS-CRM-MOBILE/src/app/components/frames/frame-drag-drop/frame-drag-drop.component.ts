import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-frame-drag-drop',
  templateUrl: './frame-drag-drop.component.html',
  styleUrls: ['./frame-drag-drop.component.scss'],
})
export class FrameDragDropComponent implements OnInit {

  
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  @Input() frame: any = {};
  @Output() passdataToframetable: EventEmitter<any> = new EventEmitter<any>();
  @Output() passdataToframeDepen: EventEmitter<any> = new EventEmitter<any>();
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};

  itemList:any = [];
  wscp: any;
  developerModeData: { ws_seq_id: any; frame_seq_id: any; };
  callingObjectArr: any[];
  tableData: any;
  tableRows: any=[];
  l_where_str: any;
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService,) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }


  ngOnInit() {
    console.log(this.frame);
    let theaddata = [];
    this.getData();
    // for (let itemGroup of this.frame.Level4) {
    //   for (let itemMast of itemGroup.Level5) {
    //     if (itemMast.item_visible_flag == 'F' ) { } else {
    //       theaddata.push(itemMast.prompt_name);
    //     }
    //   }
    // }
    // this.itemList = theaddata;
  }
 
  group1 = [];
  group2 = [];
  group3 = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    console.log("group1", this.group1);
    console.log("group2", this.group2);
    console.log("group3", this.group3);
  }

  getData() {
    this.globalObjects.showLoading();
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
   
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;

    if (this.l_where_str) {
      wscp.where_str = this.l_where_str.join(" ");
    } else {
      wscp.where_str = null;
    }
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

        // let tableRows = []; 
        // let tableData = data.responseData.Level1;
        // let tableKey = Object.keys(tableData[0])


        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        if (tableData && tableData.length > 0) {
          let tableKey = Object.keys(tableData[0])
          for (let table of tableData) {
            let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
            for (let itemGroup of frameLevel4) {
              for (let item of itemGroup.Level5) {
                for (let key of tableKey) {
                  if (item.item_name.toUpperCase() == key.toUpperCase()) {
                    item.value = table[key]
                    this.itemList.push(table[key]);
                  }
                }
              }
            }
            this.tableRows.push(frameLevel4);
          }
        
        }
        //  this.itemList=this.tableRows;
         
        this.frame.tableRows = this.tableRows;
        console.log(this.frame);
      }
    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }


 }
