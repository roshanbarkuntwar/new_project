import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-frame-img-mini-slider',
  templateUrl: './frame-img-mini-slider.component.html',
  styleUrls: ['./frame-img-mini-slider.component.scss'],
})
export class FrameImgMiniSliderComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('slides') slides: IonSlides;
  userDetails: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay: true,
  };

  sliderList = [];
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    console.log(this.frame);
    if(this.frame.apps_frame_type == "IMG_SLIDER_V2"){
      this.getData()
    }
  }

  prev(){
    this.slides.slidePrev();
  }
  next(){
    this.slides.slideNext();
  }
  itemClicked(event, i) {
    this.emitPass.emit(event);
  }


  getImages(query) {
    //this.globalObjects.displayCordovaToast("Please wait download started...");
    let url = 'getItemImages?query=' + encodeURIComponent(query);
    this.dataService.getData(url)
      .then(res => {
        var data: any = res;
        if (data.status == 'success') {
          this.sliderList = data.img;
        } else {
          alert(data.message);
        }
      }, err => {
        console.log("DocumentFetchErr " + JSON.stringify(err));

      })
  }

  getData() {
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
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
        let i = 0;
        for (let table of tableData) {
          console.log(table);
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
          let colRow = [];
          let barRows = [];
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  item.value = table[key]
                  this.getImages(item.value)
                }
              }
            }
          }
          tableRows.push(barRows);
        }
      }
    }).catch(err => {
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
