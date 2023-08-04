import { Component, Input, ViewChild} from '@angular/core';
// import { ViewController} from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';


// import { SignatureUploadComponent } from '../../components/signature-upload/signature-upload';
/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  private signatureImage: string;
 
  public signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 200,
    'backgroundColor': '#FFF',
    'penColor': '#000'
  };
  constructor(private modalCtrl:ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }
  async drawComplete() {
   this.signatureImage = this.signaturePad.toDataURL();
  
   await this.modalCtrl.dismiss(this.signatureImage);
  }

 

  drawClear() {
    this.signaturePad.clear();
  }

  dismissModal() {
    //this.signaturePad.pop();
    this.modalCtrl.dismiss();
  }


}
