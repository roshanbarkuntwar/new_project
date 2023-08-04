import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingController, Events } from '@ionic/angular';

@Component({
  selector: 'app-frame-canvas-filter',
  templateUrl: './frame-canvas-filter.component.html',
  styleUrls: ['./frame-canvas-filter.component.scss'],
})
export class FrameCanvasFilterComponent implements OnInit {
  @Input() frame: any = {};
  @Input() theadData: any = {};
  @Input() frametable:any={};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() passdataToframetable:EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  myevent:any=[];
  filterFormData: any = [];
  userDetails: any;
  showFrame: boolean = false;
  item_slno_count: number = 1;
  current_page_parameter: any = {};
  cFilter:boolean = false;
  jFilter:boolean = false;
  aFilter:boolean = false;
  dnDFilter:boolean = false;
  apexFilter:boolean=false;
 hedsapex:any;
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService,
     public loadingController: LoadingController ,public event:Events) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
   }

  ngOnInit() {
    console.log(this.theadData);
    
    // let frameFilterFlag = this.frame.frame_filter_flag;
    // if (frameFilterFlag.indexOf("#C#") > -1 ) {
    //   this.cFilter = true;
    // }else if(frameFilterFlag.indexOf("#APX#")>-1){
    //   this.apexFilter=true;
    //  }
    // else if (frameFilterFlag.indexOf("#J#") > -1 ) {
    //   this.jFilter = true;
    // }else if (frameFilterFlag.indexOf("#A#") > -1) {
    //   this.aFilter = true;
    // }else if (frameFilterFlag.indexOf("#D&D#") > -1) {
    //   this.dnDFilter = true;
    // }
    // else{
    //   this.cFilter = true;
    // }

    let frameFilterFlag = this.frame.frame_filter_flag.split("#");

    for(let f of frameFilterFlag){
      if (f == 'C' ) {
          this.cFilter = true;
        }else if(f == "ACTION"){
          this.apexFilter=true;
         }
        else if (f == "J") {
          this.jFilter = true;
        }else if (f == "A" ) {
          this.aFilter = true;
        }else if (f =="D&D") {
          this.dnDFilter = true;
        }
        else{
          // this.cFilter = true;
        }
    
    }
   
    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }


        // // console.log(itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
        //   (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        // )
        if (itemMast.item_type && itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        ) { } else {
          theaddata.push(itemMast.prompt_name);
        }
      }
      this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      // if (filterFlag) {
      //   this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      // }

    }
  }
  getData() {
  
    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    // if (this.frame.on_frame_load_str) {
    wscp.service_type = 'getFilterCanvasdata';
    wscp.from_row = String(1);
    wscp.to_row = String(10);
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
    
      let data: any = res;
      if (data.responseStatus == "success") {
        let tableRows = [];
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        let tableKey = [];
        if (tableData.length > 0) {
          tableKey = Object.keys(tableData[0]);
        }
        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  item.value = table[key]
                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }
        this.frame.tableRows = tableRows;
        console.log("it is in canvas..", this.frame)
      }
      this.showFrame = true;
    }).catch(err => {
      console.log("this.frame canvas err");
      this.showFrame = true;
      // this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
      console.log(err);
    })
    // }
  }
  SkipFilter(){
   this.event.publish("skipFilter","eventRun");
  }


  datafromframeFilter(event){
    this.myevent=event
    this.frame.event=this.myevent;
    console.log(event);
    this.passdataToframetable.emit(event);
  
  }
  getdataFromcanvasApex(event){
    event.apex=true;
    this.passdataToframetable.emit(event);
  }
  clearAll(){
    if(this.cFilter){
    this.event.publish("ClearAll","eve");
    this.event.publish("clearalldata");
    }
    else if(this.jFilter){
      this.event.publish("clearJ");
      this.event.publish("clearalldata");
    }else if(this.aFilter){
      this.event.publish("clearA");
      this.event.publish("clearalldata");
    }
  }
}
