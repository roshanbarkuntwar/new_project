import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { ModalController } from '@ionic/angular';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';

@Component({
  selector: 'app-frame-collaps',
  templateUrl: './frame-collaps.component.html',
  styleUrls: ['./frame-collaps.component.scss'],
})
export class frameCollapsComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wscp: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  framearray: any = [];
  userDetails: any;
  public show: boolean = false;
  text: string;
  public buttonName: any = 'chevron-forward-outline';
  data: any = [];
  l_total_rows: number;
  developerModeData: any;
  loading = false;
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, public modalController: ModalController) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.text = 'Hello World';
    this.data = ['Mr.Jone 24/05/2019', 'Mr.Jone 24/05/2019'];

  }

  ngOnInit() {
    console.log("frame collasp", this.frame)
    this.getData();
  }

  toggle() {
    this.show = !this.show;
    if (this.show)
    this.buttonName = "chevron-down-outline";
    else{
      this.buttonName = "chevron-forward-outline";

    }
      
  }

  getData() {

    this.loading = true;
    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;


    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }


    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
      this.globalObjects.hideLoading();
      this.loading = false;
      let data: any = res;



      if (data.responseStatus == "success") {
        // Developer Mode Loging
        if (data.responseData.Level1_Keys.length > 0) {
          let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
          let wsSewId = id ? data.responseData.Values[0][id] : "";
          this.developerModeData = {
            ws_seq_id: wsSewId,
            frame_seq_id: reqData.wscp.apps_page_frame_seqid
          }
        }
        //Developer Mode Loging

        let tableRows = [];
        //  let tableData = data.responseData.Level1;
        //  let tableKey = Object.keys(tableData[0])

        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        let tableKey = [];
        if (tableData.length > 0) {
          tableKey = Object.keys(tableData[0])
        }

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

        ///   this.framearray = this.frame.tableRows;

      }

      if (!this.frame.tableRows) {
        this.frame.tableRows = [];
        this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
      }

    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })

  }

  itemClicked(event, rowindex) {
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
              if(item.value){
                col[item.apps_item_seqid] = item.value
              }else {
                col[item.apps_item_seqid] = ""
              }
            }
          }
        }
      }

      event.wsdp.push(col);
    }
    this.emitPass.emit(event);
  }

  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData
      }
    });
    return await modal.present();

  }


}