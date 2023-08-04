import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

declare var google;
declare var OverlappingMarkerSpiderfier;

@Component({
  selector: 'app-frame-location-tracking-card',
  templateUrl: './frame-location-tracking-card.component.html',
  styleUrls: ['./frame-location-tracking-card.component.scss'],
})
export class FrameLocationTrackingCardComponent implements OnInit {
  @ViewChild('Map') mapElement: ElementRef;
  map: any;
  public mapHeight: any;
 
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  thead: any = [];
  thead2: any = [];
  dispalyss: any = { "color": "red", "text-yellow": "pink" };
  userDetails: any;
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_where_str: any;
  filterFormData: any = [];
  l_card_title: any;
  tablerowsfilter: any;
  imgData:any;
  longitude:any;
  latitude:any;
  

  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
   
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService) { 

    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.mapHeight = document.body.clientHeight -500 + 'px';
  }

  ngOnInit() {

    console.log("frame in frame location tracking card component..>>", this.frame);
    this.getData();
   // this.getProfileImg();
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }
        
        // console.log(itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
        //   (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        // )

        // if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
        //   (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        // ) { } else {
        //   this.thead.push(itemMast.prompt_name)
        // }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }

    }

  }


  updateModel(value) {
    this.l_card_title = value;
  }


  filterToggle() {
    if (this.show_filter == 'show') {
      this.show_filter = 'dontshow';
    }
    else {
      this.show_filter = 'show';
    }
  }



  getData() {


    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    if (this.l_where_str) {
      console.log('wscp.where_str---- vijay-', this.l_where_str)
      wscp.where_str = this.l_where_str.join(" ");
      console.log('wscp.where_str----', wscp.where_str)
    } else {
      wscp.where_str = null;
    }


    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }


    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      console.log("res..in frame location tracking card...", res)


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
                  if(item.item_name.toUpperCase() == 'LONGITUDE'){
                    this.longitude = table[key];
                  }
                  if(item.item_name.toUpperCase() == 'LATITUDE'){
                    this.latitude =  table[key];
                  }
                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }
        console.log("thead value:", this.thead);

        this.frame.tableRows = tableRows;



      }
    }).catch(err => {
      console.log('vijay frame-table.component.ts Something went wrong :', err);

      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })

  }

  itemClicked(event, rowindex) {
    console.log("itemClicked vijay card timeline -->" + rowindex, event);
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

  openGoogleMap(event){
    //window.open('geo:'+this.latitude+','+this.longitude+'?q=address', '_system');
    let destination = this.latitude + ',' + this.longitude;
    let platform = this.globalObjects.getLocallData("platformValue");
    if(platform === 'ios'){
      window.open('maps://?q=' + destination, '_system');
    } else if(platform === 'android'){
      window.open('geo:0,0?q='+event.value+'', '_system');
    }
  }

  getFilterParameter(event) {
    console.log(event.where_str);
    this.l_where_str = event.where_str;
    this.getData();
  }

  

}
