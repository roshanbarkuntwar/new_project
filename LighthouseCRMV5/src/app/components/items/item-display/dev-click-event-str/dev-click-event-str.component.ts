import { Component, OnInit, Input } from '@angular/core';
import { DevClickEventsPage } from 'src/app/pages/dev-click-events/dev-click-events.page';
import { PopoverController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-dev-click-event-str',
  templateUrl: './dev-click-event-str.component.html',
  styleUrls: ['./dev-click-event-str.component.scss'],
})
export class DevClickEventStrComponent implements OnInit {

  @Input() textEvent: any;
  objectCode:any;

  constructor(private popOverCtrl: PopoverController) { }



  ngOnInit() {
    this.objectCode = this.textEvent.apps_page_frame_seqid.split("-")[0];
  }

  async itemClicked(){
    console.log(this.objectCode);
    var data = {
    objectCode :this.objectCode,
    clickEventString:this.textEvent.value == 'get_object_config' || this.textEvent.value == undefined ? '' : this.textEvent.value
    }
    let popUp = await this.popOverCtrl.create({
      component: DevClickEventsPage,
      componentProps: {value:data},
      backdropDismiss: false
    });

    popUp.onDidDismiss().then((res:OverlayEventDetail) =>{
      if(res.role == "backdrop"){}else{
        if(res.data){
          this.textEvent.value = res.data;
        }else{
          this.textEvent.value = 'get_object_config';
        }
      }
  })

    return await popUp.present();
    }

}
