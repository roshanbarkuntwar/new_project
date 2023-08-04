import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingController, Events, Platform } from '@ionic/angular';
import { BackgroundService } from 'src/app/services/background.service';


declare var google;
declare var OverlappingMarkerSpiderfier;

@Component({
  selector: 'app-frame-map',
  templateUrl: './frame-map.component.html',
  styleUrls: ['./frame-map.component.scss'],
})
export class FrameMapComponent implements OnInit {

  @ViewChild('Map') mapElement: ElementRef;
  map: any;
  public mapHeight: any;
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  latitude: any;
  longitude: any;
  location_data: any = [];
  infowindow: any = null;
  platform1: any;

  // location: Map<any, any> = new Map<any, any>();
  constructor(private geoLocation: Geolocation, private globalObjects: GlobalObjectsService,
    private dataService: DataService, public loadingController: LoadingController, public event: Events,
    private backgroundService: BackgroundService, private platform: Platform) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.mapHeight = document.body.clientHeight - 500 + 'px';
  }

  ngOnInit() {
    console.log('frame in map', this.frame);
    console.log('wsdp in map', this.wsdp);
    console.log('wscp_send_input in map', this.wscp_send_input);
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.platform1 = 'device';
      this.globalObjects.checkGPSPermission();
    }
    else{
      this.platform1 = 'browser';
    }
    if(this.frame.no_of_records != null && this.frame.no_of_records != ""){
      let height = this.frame.no_of_records;
      this.mapHeight = (document.body.clientHeight * parseInt(height))/100 + 'px';
    }
    this.getData();
  }



  getData() {

    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    // if (this.frame.on_frame_load_str) {
    wscp.service_type = this.frame.on_frame_load_str;
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
        console.log("it is in canvas..", this.frame);
        this.showMap();
      } else {
        if (this.frame.Level4.length > 0) {
          for (let obj of this.frame.Level4) {
            for (let data of obj.Level5) {
              if (data.item_name == 'LATITUDE' || data.item_name == 'LONGITUDE') {
                this.latitude = this.globalObjects.latitude;
                this.longitude = this.globalObjects.longitude;
              }
            }
          }
          this.showMapOnCordinates(this.latitude, this.longitude);
        }
      }
    }).catch(err => {
      console.log("this.frame canvas err");
      // this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
      console.log(err);
    })

  }


  showMapOnCordinates(lat, long) {
    /*var jsonObj = {};
    jsonObj['LATITUDE'] = lat;
    jsonObj['LONGITUDE'] = long;
    let latLng = new google.maps.LatLng(lat, long);
     const map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: latLng
    });

    let url: string = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    var myLatLang = new google.maps.LatLng(lat, long);
    const marker = new google.maps.Marker({
      position: myLatLang,
      type: 'poly',
      draggable: false,
      animation: google.maps.Animation.DROP,
      title: 'Location Tracking',
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      icon: { url: url }
    });
     marker.setMap(this.map);*/
    let url: string = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    const latlng = { lat: lat, lng: long };
    const map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: latlng,
    });
    let contentString = "";
    this.globalObjects.geoCoderLocation(lat, long).then((res: any) => {
      for (let item of res) {
        if (item) {
          contentString += item + ", ";
        }
      }
    });
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    const marker = new google.maps.Marker({
      position: latlng,
      map,
      type: 'poly',
      draggable: false,
      animation: google.maps.Animation.DROP,
      title: 'Location Tracking',
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      icon: { url: url }
    });
    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
    if (contentString) {
      infowindow.open(map, marker);
    }
  }

  showMap() {
    this.geoLocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: latLng
      });

      if (this.frame.tableRows.length > 0) {
        for (let tableRows of this.frame.tableRows) {
          // var location: Map<any, any> = new Map<any, any>();
          var jsonObj = {};
          for (let data of tableRows) {
            for (let obj of data.Level5) {
              jsonObj[obj.item_name] = obj.value;
            }
          }
          this.location_data.push(jsonObj);
        }
        // console.log("LOCATION", this.location_data)
        let markerindex = 1;
        for (let data of this.location_data) {
          let url: string;
          if (data.FLAG == 'I') {
            url = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
          } else if (data.FLAG == 'O') {
            url = "http://maps.google.com/mapfiles/ms/icons/pink-dot.png";
          } else {
            url = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
          }
          if (data.LAT_LONG) {
            if (data.LAT_LONG.indexOf('~~') > -1) {
              var coords = data.LAT_LONG.split('~~');
              var myLatLang = new google.maps.LatLng(coords[0], coords[1]);
              var marker = new google.maps.Marker({
                position: myLatLang,
                type: 'poly',
                draggable: false,
                animation: google.maps.Animation.DROP,
                title: data.REMARK,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                icon: { url: url }
              });
              marker.setMap(this.map);
              if(markerindex == 1){
                this.map.panTo(marker.position);
                markerindex++;
              }
              this.attachLocation(marker, data.LOCATION_NAME);
            }
          }
        }
      }
    });
  }

  attachLocation(marker: any, LOCATION_NAME: string) {

    var oms = new OverlappingMarkerSpiderfier(this.map, {
      markersWontMove: true,
      markersWontHide: true,
      basicFormatEvents: true
    });

    var infoWindow = new google.maps.InfoWindow({
      content: LOCATION_NAME
    });
    marker.addListener('click', function () {
      infoWindow.open(this.map, marker);
    });

  }
}



