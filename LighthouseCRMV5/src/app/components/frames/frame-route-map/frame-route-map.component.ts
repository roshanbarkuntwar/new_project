import { Component, ViewChild, ElementRef, NgZone, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

declare var google;
@Component({
  selector: 'app-frame-route-map',
  templateUrl: './frame-route-map.component.html',
  styleUrls: ['./frame-route-map.component.scss'],
})
export class FrameRouteMapComponent  {

  @ViewChild('Map') map1Element: ElementRef;
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  current_page_parameter: any = {};
  wscp: any = {};
  callingObjectArr: any = [];
  tableData: any = [];

  map: any;
  lat: any;
  lng: any;
  mapHeight: any;
  originInput: any ='';
  serviceOrigin: any =  {};
  destinationInput: any = '';
  serviceDestination: any = {};
  originPlaceId: any;
  destinationPlaceId: any;
  travelMode = 'DRIVING';
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  activaInput: any;
  selectStatus: boolean = false;
  distance:any;
  travelTime:any;
  infowindow:any = null;
  messages: any = [];
  loading: boolean = true;
  reqFrom: string = 'backEnd';
  loadCount: number = 0;

  constructor(
    private globalObjects: GlobalObjectsService, private dataService: DataService, 
    public androidPermissions: AndroidPermissions,private nativeGeocoder: NativeGeocoder,
    private geoLocation: Geolocation,
    public zone: NgZone
  ) {
    this.mapHeight = document.body.clientHeight - 300 + 'px';
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.userDetails = globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    

    this.geoLocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.serviceOrigin["lat"] = resp.coords.latitude;
      this.serviceOrigin["lng"] = resp.coords.longitude;
      this.geoCoderLocation(this.lat, this.lng).then((res:any)=>{
        for(let item of res){
          if(item){
            this.originInput += item + ", ";
          }
        }
        // alert("Origin add:"+JSON.stringify(res));
      });
    },(error)=>{
      var options = {
        enableHighAccuracy: true,
        maximumAge: 36000
      };
      navigator.geolocation.getCurrentPosition(position => {
          this.lat = position.coords.latitude;
        this.lng = position.coords.latitude;
        this.serviceOrigin["lat"] = position.coords.latitude;
        this.serviceOrigin["lng"] = position.coords.latitude;
  
      }, () => { }, options)
    })
    setTimeout(() => {
      this.showMap(this.lat, this.lng);
    }, 500);
    this.getData();
  }

  getData() {
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
   
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }
    this.loading = true;

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      let data: any = res;
      if (data.responseStatus == "success") {
        let tableRows = [];
        let objData = this.globalObjects.setPageInfo(data.responseData);

        // For Getting *CALLING_OBJECT_CODE* from Frame //
        this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
        // For Getting *CALLING_OBJECT_CODE* from Frame //

        let tableData = objData.Level1;
        this.tableData = tableData;
        let itemData: any;

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
          if(tableData.length<=0){
          
            this.frame.tableRows[0]= JSON.parse(JSON.stringify(this.frame.Level4));
          }
          console.log("Frame Map route Data", this.frame)

          for(let  framedata of this.frame.tableRows){
            for(let itemGroup of framedata){
              for(let item of itemGroup.Level5){
                if(item.item_name == 'LATITUDE'){
                  this.serviceDestination["lat"] = item.value;
                }else if(item.item_name == 'LONGITUDE'){
                  this.serviceDestination["lng"] = item.value;
                }
              }

            }
          }
          //this.loading =false;
          if(this.serviceDestination.lat && this.serviceDestination.lng){
            this.geoCoderLocation(this.serviceDestination.lat, this.serviceDestination.lng).then((res:any)=>{
              // alert('service: ' + JSON.stringify(res) );.
              for(let item of res){
                if(item){
                  this.destinationInput += item + ", ";
                }
              }
              // this.destinationInput = res;
              console.log("Origin add:",JSON.stringify(res));
            });
            this.calculateAndDisplayRoute();
          }else{
            this.showMapOnCordinates(this.serviceOrigin.lat, this.serviceOrigin.lng)
          }
      }else{
        this.showMapOnCordinates(this.serviceOrigin.lat, this.serviceOrigin.lng)
      }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }

  showMapOnCordinates(lat, long) {
    this.globalObjects.displayCordovaToast("Destination Latitude and Longitude not found...");
    let url: string = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    const latlng = { lat: lat, lng: long };
    const map = new google.maps.Map(this.map1Element.nativeElement, {
      zoom: 15,
      center: latlng,
     
    });
    let contentString = "";
    this.globalObjects.geoCoderLocation(lat , long).then((res:any)=>{
      for(let item of res){
        if(item){
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
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });
    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
    if(contentString){
      infowindow.open(map, marker);
    }
  }

  geoCoderLocation(lat, lon) {
    // alert('latlong==>' + lat + ',' + lon)
    return new Promise((resolve, reject) => {
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      this.nativeGeocoder.reverseGeocode(lat, lon)
        .then((result: NativeGeocoderResult[]) => {
          // alert('location==>'+JSON.stringify(result[0]));
          this.generateAddress(result[0]).then(res => {
            return resolve(res);
          });
        })
        .catch((error: any) => console.log(error));
   
    });
  }
  
  generateAddress(result) {
    return new Promise((resolve, reject) => {
      let obj1 = [];
      if (result.subThroughfare) {
        obj1.push(result.subThroughfare)
      }
      if (result.throughfare) {
        obj1.push(result.throughfare)
      }
      if (result.subLocality) {
        obj1.push(result.subLocality)
      }
      if (result.locality) {
        obj1.push(result.locality)
      }
      if (result.subAdministrative) {
        obj1.push(result.subAdministrative)
      }
      if (result.administrativeArea) {
        obj1.push(result.administrativeArea)
      }
      if (result.postalCode) {
        obj1.push(result.postalCode)
      }
      if (result.countryName) {
        obj1.push(result.countryCode)
      }

      return resolve(obj1);
    });
  }

  showMap(lat, long) {
    let latLng = new google.maps.LatLng(lat, long);
    this.map = new google.maps.Map(this.map1Element.nativeElement, {
      zoom: 15,
      center: latLng
    });

    let url: string = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    var myLatLang = new google.maps.LatLng(lat, long);
    var marker = new google.maps.Marker({
      position: myLatLang,
      type: 'poly',
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: 'Location Tracking',
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      icon: { url: url }
    });
    //marker.setMap(this.map);

    this.directionsDisplay.setMap(this.map);
    // this.attachLocation(marker, data.LOCATION_NAME);
  }

  drawPolyline() {

    let latlng = [{ lat: 21.141361, lng: 79.080189 },
    { lat: 21.135798, lng: 79.060319 },
    { lat: 21.131154, lng: 79.051350 },
    { lat: 21.130914, lng: 79.046672 },
    { lat: 21.125200, lng: 79.044365 }];
    let latLng = new google.maps.LatLng(latlng[0].lat, latlng[0].lng);
    var map = new google.maps.Map(this.map1Element.nativeElement, {
      zoom: 15,
      center: latLng
    });

    var flightPath = new google.maps.Polyline({
      path: latlng,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(map);
  }

  calculateAndDisplayRoute() {
    const that = this;
    let origin: any;
    let dest:any;
    if(this.reqFrom == 'frontEnd'){
      origin = this.originInput;
      dest = this.destinationInput;
    }
    else{
      origin = new google.maps.LatLng(parseFloat(this.serviceOrigin.lat), parseFloat(this.serviceOrigin.lng));
      dest = new google.maps.LatLng(parseFloat(this.serviceDestination.lat), parseFloat(this.serviceDestination.lng));

    }
    this.directionsService.route({
      origin: origin,
      destination: dest,
      travelMode: 'DRIVING',
      // alternatives : true
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
        this.distance =  response.routes[0].legs[0].distance["text"];
        this.travelTime =  response.routes[0].legs[0].duration["text"];
        var step = Math.floor(response.routes[0].legs[0].steps.length / 2);
        if(this.infowindow){
          this.infowindow.close();
        }
        this.infowindow = new google.maps.InfoWindow();
        this.infowindow.setContent(response.routes[0].legs[0].distance["text"] + "<br>" + response.routes[0].legs[0].duration["text"] + " ");
        this.infowindow.setPosition(response.routes[0].legs[0].steps[step].end_location);
        this.infowindow.open(this.map);
        // console.log("Diection res:"+ response);
        // console.log("Distance:"+ this.distance +" Time" +this.travelTime);
      } else {
       console.log('Directions request failed due to ' + status);
      }
    });
    this.reqFrom = 'backEnd';
  }

  getRoute(){
    this.reqFrom = 'frontEnd';
    this.calculateAndDisplayRoute();
  }

 
  UpdateSearchResults(place) {
    this.loadCount++;
    if (!this.selectStatus) {
      this.activaInput = place
      let input: any;
      if (place == 'origin') {
        input = this.originInput;
        //this.loadCount = true;
      } else {
        input = this.destinationInput;
        //this.loadCount = true;
      }
      if (!input || input == '') {
        this.autocompleteItems = [];
        return;
      }
      if(this.loadCount >2){
        this.GoogleAutocomplete.getPlacePredictions({ input: input },
          (predictions, status) => {
            this.autocompleteItems = [];
            this.zone.run(() => {
              predictions.forEach((prediction) => {
                this.autocompleteItems.push(prediction);
              });
            });
          });
      }
    }
    this.selectStatus = false;
  }

  SelectSearchResult(item) {
    this.selectStatus = true;
    if (this.activaInput == 'origin') {
      this.originInput = item.description;
    }
    else {
      this.destinationInput = item.description;
    }
    console.log('Selected:', item);
    this.autocompleteItems = [];
  }

  ClearAutocomplete(place) {
    this.autocompleteItems = [];
    if (place == 'origin') {
      this.originInput = '';
    } else {
      this.destinationInput = '';
    }
  }
}
