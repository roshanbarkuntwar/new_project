import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { Events, LoadingController, Platform } from '@ionic/angular';
import { BackgroundService } from 'src/app/services/background.service';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;
@Component({
  selector: 'app-frame-travel-location',
  templateUrl: './frame-travel-location.component.html',
  styleUrls: ['./frame-travel-location.component.scss'],
})
export class FrameTravelLocationComponent implements OnInit {


  @ViewChild('Map') mapElement: ElementRef;
  @ViewChild('content') content: ElementRef;
  map: any;
  public mapHeight: any;
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  userDetails: any;
  latitude: any;
  longitude: any;
  locationData = [];
  infowindow: any = null;
  platform1: any;
  directionsService: any = new google.maps.DirectionsService;
  directionsDisplay: any;
  location_data: any = [];
  locations: any = [];
  travelDistance: any = 0;
  infoData: any = [];

  constructor(public loadingController: LoadingController, public event: Events, private dataService: DataService, private geoLocation: Geolocation,
    private platform: Platform, private globalObjects: GlobalObjectsService, private backgroundService: BackgroundService
  ) {
    this.mapHeight = document.body.clientHeight - 100 + 'px';
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    this.getData();
    // let latLng = new google.maps.LatLng(21.124108874104078, 79.04508410024633);
    // this.map = new google.maps.Map(this.mapElement.nativeElement, {
    //   zoom: 15,
    //   center: latLng
    // });
  }

  getData() {

    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = String(1);
    wscp.to_row = String(10);
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;

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
        } else {
          this.globalObjects.presentAlert("No data found...");
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
        if (tableData[0].status == "Q") {
          this.globalObjects.presentAlert(tableData[0].message)
        }
        console.log("it is in canvas..", this.frame);
        this.showMap();
      } else {
        if (this.frame.Level4.length > 0) {
          for (let obj of this.frame.Level4) {
            for (let data of obj.Level5) {
              if (data.item_name == 'LOCATION') {
                this.latitude = this.globalObjects.latitude;
              } else if (data.item_name == 'LONGITUDE') {
                this.longitude = this.globalObjects.longitude;
              }
            }
          }
          //  this.showMapOnCordinates(this.latitude, this.longitude);
        }
      }
    }).catch(err => {
      console.log("this.frame canvas err");
      this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
      console.log(err);
    })

  }

  showMap() {

    if (this.frame.tableRows.length > 0) {
      for (let tableRows of this.frame.tableRows) {
        var jsonObj = {};
        for (let data of tableRows) {
          for (let obj of data.Level5) {
            jsonObj[obj.item_name] = obj.value;
          }
        }
        this.location_data.push(jsonObj);
      }
      let markerindex = 1;
      for (let data of this.location_data) {
        let url: string;

        if (data.LOCATION) {
          if (data.LOCATION.indexOf('~~') > -1) {
            let latLng = [];
            var coords = data.LOCATION.split('~~');
            latLng.push(coords[0]);
            latLng.push(coords[1]);
            if (coords.length > 2) {
              this.infoData.push(coords[2])
            }
            this.locations.push(latLng);
          }
        }
      }
      //this.calculateAndDisplayRoute();
      this.drawMarkersOnMap();
    }

  }



  drawMarkersOnMap() {
    // this.geoLocation.getCurrentPosition().then((resp) => {
      //let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 7,
        //center: latLng
      });

      console.log("LOCATION", this.locations)
    //   this.locations = [
    //     [21.1686572556551, 79.08018885050305],
    //     [21.136157871129964, 79.10216150592042],
    //     [21.10669414205616, 79.08345041654155],
    //     [21.135397332169305, 79.07224951211977],
    //     [21.12230744489825, 79.06473932716266]
    // ] 
      let markerindex = 1;
      for (let data of this.locations) {
        let url: string = "https://firebasestorage.googleapis.com/v0/b/lhswma-image-icon-mast.appspot.com/o/map-icons%2Fpathmarker.png?alt=media";
        var infowindow 
        if(this.infoData.length > 0){
          infowindow = new google.maps.InfoWindow({
            content:this.infoData[markerindex-1].toString()
          });
        }
        // if (data.LOCATION.indexOf('~~') > -1) {
          var myLatLang = new google.maps.LatLng(data[0], data[1]);
          var marker = new google.maps.Marker({
            position: myLatLang,
            //type: 'poly',
            draggable: false,
            animation: google.maps.Animation.DROP,
            title: data.REMARK,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            icon: { url: url }
          });
          // let para  = this.infoData[i].toString();
          if(this.infoData.length > 0){
            let para =  this.infoData[markerindex-1].toString();
            marker.addListener('click', () => {
              infowindow.setContent(para);
              infowindow.open(this.map, marker);
            });
          }
          if (markerindex == 1) {
            this.map.panTo(marker.position);
          }
          marker.setMap(this.map);
          markerindex++;
          //this.attachLocation(marker, data.LOCATION_NAME);
        // }
      }

    // });
  }



}
