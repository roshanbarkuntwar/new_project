import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.scss'],
})
export class VideoStreamComponent implements OnInit {
  @Input() streamEvent: any;
  videoPath: any;
  platformValue: boolean = true;
  width: any = "50%";
  height: any = "50%";
  url = "";
  rndInt:any;
  constructor(public globalObjects: GlobalObjectsService,public platform: Platform) { }

  ngOnInit() {
   
    this.rndInt = Math.floor(100000 + Math.random() * 900000);

    this.videoPath = this.streamEvent.item_default_value ? this.streamEvent.item_default_value : this.streamEvent.value;

    var l_url = encodeURI(this.globalObjects.getScopeUrl() + "streamVideo?videoPath=" + this.videoPath);
    console.log(l_url);
    this.url = l_url;
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.platformValue = false;
    }

    this.width = this.streamEvent.display_setting_str["width"] == undefined ? this.width : this.streamEvent.display_setting_str["width"];
    this.height = this.streamEvent.display_setting_str["height"] == undefined ? this.height : this.streamEvent.display_setting_str["height"];

    setTimeout(() => {
      var videoNode = document.getElementById(this.rndInt);
      videoNode.setAttribute("src", this.url);
    }, 1000);
    
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
