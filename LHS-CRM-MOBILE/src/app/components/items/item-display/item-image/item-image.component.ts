import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Events, ModalController } from '@ionic/angular';
import { ImagePreviewPage } from 'src/app/pages/image-preview/image-preview.page';

@Component({
  selector: 'app-item-image',
  templateUrl: './item-image.component.html',
  styleUrls: ['./item-image.component.scss'],
})
export class ItemImageComponent implements OnInit {

  @Input() displayPhoto: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  imgData: any;
  @Input() styleCss: any;

  @Input() frame_type:any;

  constructor(private dataService: DataService, private modalCtrl: ModalController,
    private events: Events) {
    this.events.subscribe("DISPLAY_PHOTO", () => {
      this.showItemImage(this.displayPhoto);
    })
  }

  ngOnInit() {
    if (this.displayPhoto.value) {
      this.showItemImage(this.displayPhoto);
    }
    console.log(this.displayPhoto)

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

  showItemImage(displayPhoto) {
    // console.log("this is item image", this.displayPhoto)
    this.imgData = '/assets/imgs/no_image.png';
    if (displayPhoto) {
      let url = 'getItemImage?query=' + encodeURIComponent(displayPhoto.value);
      if (displayPhoto.value) {
        this.dataService.getData(url)
          .then(res => {
            console.log(res);
            var data: any = res;
            if (data.status == 'success') {
              this.imgData = 'data:image/png;base64,' + data.img;
            } else {
              this.imgData = '/assets/imgs/no_image.png';
            }
          }, err => {
            console.log("ImgDataErr " + JSON.stringify(err));
            this.imgData = null;
          })
      }
    }
  }

  async photoview() {
    const modal = await this.modalCtrl.create({
      component: ImagePreviewPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img: this.imgData
      }
    });
    modal.present();
  }
}


