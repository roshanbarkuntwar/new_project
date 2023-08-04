import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Events, LoadingController, Platform } from '@ionic/angular';
import { BackgroundService } from 'src/app/services/background.service';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';


declare var google;
@Component({
  selector: 'app-frame-waypoints',
  templateUrl: './frame-waypoints.component.html',
  styleUrls: ['./frame-waypoints.component.scss'],
})

export class FrameWaypointsComponent implements OnInit {

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

  constructor(public loadingController: LoadingController, public event: Events, private dataService: DataService,
    private platform: Platform, private globalObjects: GlobalObjectsService, private backgroundService: BackgroundService
  ) {
    this.mapHeight = document.body.clientHeight - 100 + 'px';
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    this.getData();
  }

  getData() {

    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.from_row = String(1);
    wscp.to_row = String(10000);
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
      this.calculateAndDisplayRoute();
    }

  }


  calculateAndDisplayRoute() {

    // this.locations = [
    //   [21.110816, 79.070007],
    //   // ['Bondi Beach', -33.890542, 151.274856, 4],
    //   // ['Coogee Beach', -33.923036, 151.259052, 5],
    //   [21.113778, 79.056763],
    //   [21.113069, 79.045860],
    //   [21.121653, 79.030505],
    //   [21.117777, 79.015174],
    //   [21.124388133866844, 79.0447227525748],
    //   [21.12153176584821, 79.05064283908845],
    //   [21.121436552633515, 79.05574636194503],
    //   [21.124673767642932, 79.05891054611612],
    //   [21.12624474357719, 79.06457545648693],
    //   [21.12262671342418, 79.05702224265919],
    //   [21.121484159248503, 79.05329667097388],
    //   [21.12191261809583, 79.04885660608863],
    //   [21.124388133866844, 79.0447227525748],
    //   [21.123961928633733, 79.0450181920531],
    //   [21.13082889769693, 79.04646168630104]

    // ];
    console.log("LOCATIONS: ", this.locations);

    this.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: new google.maps.LatLng(this.locations[0][0], this.locations[0][1]),
      suppressPolylines: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    this.directionsDisplay.setMap(this.map);



    var marker, i;
    var request: any = {
      travelMode: google.maps.TravelMode.DRIVING
    };

    for (i = 0; i < this.locations.length; i++) {
      if (i == 0) {
        request.origin = new google.maps.LatLng(this.locations[i][0], this.locations[i][1]);
      }
      else if (i == this.locations.length - 1) {
        request.destination = new google.maps.LatLng(parseFloat(this.locations[i][0]), parseFloat(this.locations[i][1]));
      }
      else {
        if (!request.waypoints) request.waypoints = [];
        request.waypoints.push({
          location: new google.maps.LatLng(this.locations[i][0], this.locations[i][1]),
          stopover: true
        });
      }
      if(this.locations.length == 1){
        request.destination = new google.maps.LatLng(parseFloat(this.locations[i][0]), parseFloat(this.locations[i][1]));
      }
    }

    let markers = [];
    //request.optimizeWaypoints = true;
    this.directionsService.route(request, (result, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        setTimeout(() => {

          this.directionsDisplay.setDirections(result);
          // For each route, display summary information.
          let legs = result.routes[0].legs;

          for (i = 0; i < legs.length; i++) {
            if (i == 0) {
              if(this.infoData.length > 0){
                var infowindow = new google.maps.InfoWindow({
                  content:this.infoData[i].toString()
                });
              }else{
                var infowindow = new google.maps.InfoWindow();
              }

              let marker = new google.maps.Marker({
                position: legs[i].start_location,
                map: this.map,
                icon: "https://firebasestorage.googleapis.com/v0/b/lhswma-image-icon-mast.appspot.com/o/map-icons%2Fstart.png?alt=media",
                title: "Start",
                zIndex: Math.round(legs[i].start_location.lat() * 100000) << 5
              });

              // let para = JSON.stringify(legs[i].start_address);
              let para  = (this.infoData.length > 0) ? this.infoData[i].toString() : JSON.stringify(legs[i].start_address);
              marker.addListener('click', () => {
                infowindow.setContent(para);
                infowindow.open(this.map, marker);
              });
              if(this.infoData.length > 0){
                infowindow.open(this.map, marker);
              }
              marker.setMap(this.map);
            } else if (i == legs.length - 1) {

              let location = ["start", "end"];

              for (let loc of location) {

                let marker = new google.maps.Marker({
                  position: loc == "start" ? legs[i].start_location : legs[i].end_location,
                  map: this.map,
                  icon: loc == "start" ? "https://firebasestorage.googleapis.com/v0/b/lhswma-image-icon-mast.appspot.com/o/map-icons%2Fpathmarker.png?alt=media" : "https://firebasestorage.googleapis.com/v0/b/lhswma-image-icon-mast.appspot.com/o/map-icons%2Fend.png?alt=media",
                  title: loc == "start" ? null : "End",
                  zIndex: Math.round(loc == "start" ? legs[i].start_location : legs[i].end_location.lat() * 100000) << 5
                });
                if(this.infoData.length > 0){
                  var infowindow = new google.maps.InfoWindow({
                    content:this.infoData[i].toString()
                  });
                }else{
                  var infowindow = new google.maps.InfoWindow();
                }
                let para = (this.infoData.length > 0) ? this.infoData[i].toString() : (loc == "start") ? JSON.stringify(legs[i].start_address) : JSON.stringify(legs[i].end_address);
                // let para  = this.infoData[i].toString();
                marker.addListener('click', () => {
                  infowindow.setContent(para);
                  infowindow.open(this.map, marker);
                });
                if(this.infoData.length > 0){
                  infowindow.open(this.map, marker);
                }

                marker.setMap(this.map);
              }

            }
            else {
              if(this.infoData.length > 0){
                var infowindow = new google.maps.InfoWindow({
                  content:this.infoData[i].toString()
                });
              }else{
                var infowindow = new google.maps.InfoWindow();
              }
              let opt = {
                position: legs[i].start_location,
                map: this.map,
                icon: "https://firebasestorage.googleapis.com/v0/b/lhswma-image-icon-mast.appspot.com/o/map-icons%2Fpathmarker.png?alt=media",
                zIndex: Math.round(legs[i].start_location.lat() * 100000) << 5
              };

              let marker = new google.maps.Marker(opt);

              // let para = JSON.stringify(legs[i].start_address);
              let para  =  (this.infoData.length > 0) ? this.infoData[i].toString() : JSON.stringify(legs[i].start_address);
              marker.addListener('click', () => {
                infowindow.setContent(para);
                infowindow.open(this.map, marker);
              });
              if(this.infoData.length > 0){
                infowindow.open(this.map, marker);
              }
              marker.setMap(this.map);
            }

            if(legs[i].distance["value"] < 100 && legs[i].distance["value"] > 9){
              legs[i].distance["text"] =  "0.0"+(legs[i].distance["text"].split(" ")[0]);
            }else if(legs[i].distance["value"] < 10 && legs[i].distance["value"] >= 0){
              legs[i].distance["text"] =  "0.00"+(legs[i].distance["text"].split(" ")[0]);
            }

            this.travelDistance = (this.travelDistance ? this.travelDistance : 0) + parseFloat(legs[i].distance["text"].split(" ")[0]);
          }
          //infowindow.open(this.map, );
          setTimeout(() => {

            for(let m of markers){
              infowindow.open(this.map, m);
            }
          }, 10000);
          this.createPopup();
        }, 100);
      }
    },(error)=>{alert(JSON.stringify(error))});
  }

  // calculateAndDisplayRoute() {
  //   // this.locations = [
  //   //   [21.110816, 79.070007],
  //   //   // ['Bondi Beach', -33.890542, 151.274856, 4],
  //   //   // ['Coogee Beach', -33.923036, 151.259052, 5],
  //   //   [21.113778, 79.056763],
  //   //   [21.113069, 79.045860],
  //   //   [21.121653, 79.030505],
  //   //   [21.117777, 79.015174],
  //   //   [21.124388133866844, 79.0447227525748],
  //   //   [21.12153176584821, 79.05064283908845],
  //   //   [21.121436552633515, 79.05574636194503],
  //   //   [21.124673767642932, 79.05891054611612],
  //   //   [21.12624474357719, 79.06457545648693],
  //   //   [21.12262671342418, 79.05702224265919],
  //   //   [21.121484159248503, 79.05329667097388],
  //   //   [21.12191261809583, 79.04885660608863],
  //   //   [21.124388133866844, 79.0447227525748],
  //   //   [21.123961928633733, 79.0450181920531],
  //   //   [21.13082889769693, 79.04646168630104]

  //   // ];

  //   this.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });

  //   this.map = new google.maps.Map(this.mapElement.nativeElement, {
  //     zoom: 15,
  //     center: new google.maps.LatLng(this.locations[0][0], this.locations[0][1]),
  //     suppressPolylines: true,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   });
  //   // this.directionsDisplay.setMap(this.map);


  //   var lngs = this.locations.map(function (station) { return station[1]; });
  //   var lats = this.locations.map(function (station) { return station[0]; });
  //   this.map.fitBounds({
  //     west: Math.min.apply(null, lngs),
  //     east: Math.max.apply(null, lngs),
  //     north: Math.min.apply(null, lats),
  //     south: Math.max.apply(null, lats),
  //   });

  //   // Show stations on the map as markers
  //   for (var i = 0; i < this.locations.length; i++) {
  //     new google.maps.Marker({
  //       position: new google.maps.LatLng(this.locations[i][0], this.locations[i][1]),
  //       map: this.map,
  //       //title: this.locations[i].name
  //     });
  //   }

  //   // Divide route to several parts because max stations limit is 25 (23 waypoints + 1 origin + 1 destination)
  //   for (var i = 0, parts = [], max = 25 - 1; i < this.locations.length; i = i + max)
  //     parts.push(this.locations.slice(i, i + max + 1));


  //   // Send requests to service to get route (for stations count <= 25 only one request will be sent)
  //   let markers = [];
  //   let legs = [];
  //   for (var i = 0; i < parts.length; i++) {
  //     // Waypoints does not include first station (origin) and last station (destination)
  //     var waypoints = [];
  //     for (var j = 1; j < parts[i].length - 1; j++)
  //       waypoints.push({ location: new google.maps.LatLng(parts[i][j][0], parts[i][j][1]), stopover: false });
  //     // Service options
  //     var service_options = {
  //       origin: new google.maps.LatLng(parts[i][0][0], parts[i][0][1]),
  //       destination: new google.maps.LatLng(parts[i][parts[i].length - 1][0], parts[i][parts[i].length - 1][1]),
  //       waypoints: waypoints,
  //       travelMode: google.maps.TravelMode.DRIVING
  //     };
  //     // Send request
  //     // this.directionsService.route(service_options, service_callback);
  //     this.directionsService.route(service_options, (result, status) => {
  //       if (status == google.maps.DirectionsStatus.OK) {
  //         setTimeout(() => {
  //           this.directionsDisplay.setMap(this.map);
  //           // renderer.setOptions({ suppressMarkers: true, preserveViewport: true });
  //           this.directionsDisplay.setDirections(result);
  //           // For each route, display summary information.
  //           legs.push(result.routes[0].legs[0]);


  //           //infowindow.open(this.map, );
  //           // setTimeout(() => {

  //           //   for(let m of markers){
  //           //     infowindow.open(this.map, m);
  //           //   }
  //           // }, 10000);
  //           this.createPopup();
  //           this.travelDistance = (this.travelDistance ? this.travelDistance : 0) + parseFloat(legs[0].distance["text"].split(" ")[0]);

  //           //   this.travelDistance = setMarkers(legs,this.map,this.infoData);
  //         }, 100);
  //       }
  //     });

  //   }
  //   function setMarkers(legs, map, infoData) {
  //     console.log(legs)
  //     let travelDistance = 0;
  //     for (i = 0; i < legs.length; i++) {
  //       if (i == 0 && legs.length > 1) {
  //         if (this.infoData.length > 0) {
  //           var infowindow = new google.maps.InfoWindow({
  //             content: this.infoData[i].toString()
  //           });
  //         } else {
  //           var infowindow = new google.maps.InfoWindow();
  //         }

  //         let marker = new google.maps.Marker({
  //           position: legs[i].start_location,
  //           map: this.map,
  //           //icon: "https://firebasestorage.googleapis.com/v0/b/lhswma-image-icon-mast.appspot.com/o/map-icons%2Fstart.png?alt=media",
  //           title: "Start",
  //           zIndex: Math.round(legs[i].start_location.lat() * 100000) << 5
  //         });

  //         // let para = JSON.stringify(legs[i].start_address);
  //         let para = (this.infoData.length > 0) ? this.infoData[i].toString() : JSON.stringify(legs[i].start_address);
  //         marker.addListener('click', () => {
  //           infowindow.setContent(para);
  //           infowindow.open(this.map, marker);
  //         });
  //         if (this.infoData.length > 0) {
  //           infowindow.open(this.map, marker);
  //         }
  //         marker.setMap(this.map);
  //       } else if (i == legs.length - 1) {

  //         let location = ["start", "end"];

  //         for (let loc of location) {

  //           let marker = new google.maps.Marker({
  //             position: loc == "start" ? legs[i].start_location : legs[i].end_location,
  //             map: map,
  //             //icon: loc == "start" ? "https://firebasestorage.googleapis.com/v0/b/lhswma-image-icon-mast.appspot.com/o/map-icons%2Fpathmarker.png?alt=media" : "https://firebasestorage.googleapis.com/v0/b/lhswma-image-icon-mast.appspot.com/o/map-icons%2Fend.png?alt=media",
  //             title: loc == "start" ? null : "End",
  //             zIndex: Math.round(loc == "start" ? legs[i].start_location : legs[i].end_location.lat() * 100000) << 5
  //           });
  //           if (infoData.length > 0) {
  //             var infowindow = new google.maps.InfoWindow({
  //               content: infoData[i].toString()
  //             });
  //           } else {
  //             var infowindow = new google.maps.InfoWindow();
  //           }
  //           let para = (infoData.length > 0) ? infoData[i].toString() : (loc == "start") ? JSON.stringify(legs[i].start_address) : JSON.stringify(legs[i].end_address);
  //           // let para  = this.infoData[i].toString();
  //           marker.addListener('click', () => {
  //             infowindow.setContent(para);
  //             infowindow.open(map, marker);
  //           });
  //           if (infoData.length > 0) {
  //             infowindow.open(map, marker);
  //           }

  //           marker.setMap(map);
  //         }

  //       }
  //       else {
  //         if (this.infoData.length > 0) {
  //           var infowindow = new google.maps.InfoWindow({
  //             content: this.infoData[i].toString()
  //           });
  //         } else {
  //           var infowindow = new google.maps.InfoWindow();
  //         }
  //         let opt = {
  //           position: legs[i].start_location,
  //           map: this.map,
  //           //icon: "https://firebasestorage.googleapis.com/v0/b/lhswma-image-icon-mast.appspot.com/o/map-icons%2Fpathmarker.png?alt=media",
  //           zIndex: Math.round(legs[i].start_location.lat() * 100000) << 5
  //         };

  //         let marker = new google.maps.Marker(opt);

  //         // let para = JSON.stringify(legs[i].start_address);
  //         let para = (this.infoData.length > 0) ? this.infoData[i].toString() : JSON.stringify(legs[i].start_address);
  //         marker.addListener('click', () => {
  //           infowindow.setContent(para);
  //           infowindow.open(this.map, marker);
  //         });
  //         if (this.infoData.length > 0) {
  //           infowindow.open(this.map, marker);
  //         }
  //         marker.setMap(this.map);
  //       }

  //       if (legs[i].distance["value"] < 100 && legs[i].distance["value"] > 9) {
  //         legs[i].distance["text"] = "0.0" + (legs[i].distance["text"].split(" ")[0]);
  //       } else if (legs[i].distance["value"] < 10 && legs[i].distance["value"] >= 0) {
  //         legs[i].distance["text"] = "0.00" + (legs[i].distance["text"].split(" ")[0]);
  //       }

  //       travelDistance = (travelDistance ? travelDistance : 0) + parseFloat(legs[i].distance["text"].split(" ")[0]);
  //     }
  //     return travelDistance;
  //   }
  // }

  createPopup() {
    class Popup extends google.maps.OverlayView {
      // position:  google.maps.LatLng;
      position: any;
      containerDiv: HTMLDivElement;

      constructor(position: any, content: HTMLElement) {
        super();
        this.position = position;

        content.classList.add("popup-bubble");

        // This zero-height div is positioned at the bottom of the bubble.
        const bubbleAnchor = document.createElement("div");
        bubbleAnchor.classList.add("popup-bubble-anchor");
        bubbleAnchor.appendChild(content);

        // This zero-height div is positioned at the bottom of the tip.
        this.containerDiv = document.createElement("div");
        this.containerDiv.classList.add("popup-container");
        this.containerDiv.appendChild(bubbleAnchor);

        // Optionally stop clicks, etc., from bubbling up to the map.
        Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
      }

      /** Called when the popup is added to the map. */
      onAdd() {
        this.getPanes().floatPane.appendChild(this.containerDiv);
      }

      /** Called when the popup is removed from the map. */
      onRemove() {
        if (this.containerDiv.parentElement) {
          this.containerDiv.parentElement.removeChild(this.containerDiv);
        }
      }

      /** Called each frame when the popup needs to draw itself. */
      draw() {
        const divPosition = this.getProjection().fromLatLngToDivPixel(
          this.position
        );

        // Hide the popup when it is far out of view.
        const display =
          Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
            ? "block"
            : "none";

        if (display === "block") {
          this.containerDiv.style.left = divPosition.x + "px";
          this.containerDiv.style.top = divPosition.y + "px";
        }

        if (this.containerDiv.style.display !== display) {
          this.containerDiv.style.display = display;
        }
      }
    }

    let popup = new Popup(
      new google.maps.LatLng(this.locations[0][0], this.locations[0][1]),
      this.content.nativeElement
    );
    popup.setMap(this.map);
  }



}
