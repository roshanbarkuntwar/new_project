import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.page.html',
  styleUrls: ['./image-preview.page.scss'],
})
export class ImagePreviewPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @Input('img') img: any;

  sliderOpts = {
    zoom: true
  };

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  ionViewDidEnter() {
    this.slides.update();
  }

  async zoom(zoomIn: boolean) {
    const slider = await this.slides.getSwiper();
    const zoom = slider.zoom;
    zoomIn ? zoom.in() : zoom.out();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
