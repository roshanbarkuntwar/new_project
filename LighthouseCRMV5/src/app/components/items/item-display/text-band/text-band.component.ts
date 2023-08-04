import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-text-band',
  templateUrl: './text-band.component.html',
  styleUrls: ['./text-band.component.scss'],
})
export class TextBandComponent implements OnInit {
  @Input() textband: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(public globalObjects:GlobalObjectsService, private modalController: ModalController) { }

  val:any = [];
  developerModeData:any;
  ngOnInit() {
    console.log(this.textband);
    if(this.textband.value){
      if (this.textband.value.indexOf('@') > -1) {
        this.val = this.textband.value.split("@");
      }
      // } else{
      //   this.textband.prompt_name = this.textband.value;
      // }
    }
    else {
      this.textband.value = [];
    }
    this.developerModeData = {
      //ws_seq_id: wsSewId,
      frame_seq_id: this.textband.apps_page_frame_seqid,
      item_seq_id: this.textband.apps_item_seqid,
    };
  }

  itemClick(event) {
    this.textband.rightClickFlag = false;
    this.emitPass.emit(this.textband);
  }

  onRightClick(event) {
    console.log(this.textband);
    event.preventDefault();
    this.textband.rightClickFlag = true;
    this.emitPass.emit(this.textband);
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

