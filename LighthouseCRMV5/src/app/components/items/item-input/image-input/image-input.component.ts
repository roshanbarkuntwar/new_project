import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, ActionSheetController, Platform, IonButtons } from '@ionic/angular';
import { ModalPage } from 'src/app/pages/modal/modal';
import { OverlayEventDetail } from '@ionic/core';
import { DataService } from '../../../../services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
// import { DocumentScanner, DocumentScannerOptions } from '@ionic-native/document-scanner/ngx';

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss'],
})
export class ImageInputComponent implements OnInit {
  @Input() imageinput: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  imgData: any;
  platformValue: boolean = true;
  constructor(public modalCtrl: ModalController, public dataService: DataService,private globalObjects: GlobalObjectsService,private  actionSheetController:ActionSheetController,
    public platform: Platform) { }
  // private docScan: DocumentScanner
  ngOnInit() {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    console.log('this.imageinput ', this.imageinput);
    if(this.platform.is('ios') || this.platform.is('android')){
        this.platformValue = false;
    }
  }
  onChange(onChange) {
      this.emitOnChange.emit(this.imageinput)
  }

  takeImage(itemDbName, flag) {
   
      this.dataService.takePhoto(itemDbName, flag).then((imageData:any) => {
        //  this.imageinput.value = imageData.split(",")[1];
         this.imageinput.value = imageData;
    
        },
        (err)=>{
          alert(JSON.stringify(err));
        })
   
   console.log(this.imageinput)
  }

  clearImage() {
    console.log("clear image")
    this.imageinput.value = '';
  }

  drawClear() {
    
    this.imageinput.value = '';
  }

  async opensignaturePad() {
    var data = { message: 'hello world' };
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: ModalPage,
        componentProps: { values: data }
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail) {
        //console.log('The result:', detail.data);
        this.imageinput.value = detail.data.replace("data:image/png;base64,", "");
      }
    });
    await modal.present();
  }

  photoview(){
    this.imgData = 'data:image/png;base64,' + this.imageinput.value;
    this.globalObjects.viewPhoto(this.imgData);
  }
  selectFile(theme, file) {
    console.log(file);
    this.getBase64(file).then((data:any) => {
      
     this.imageinput.value=data.split(",")[1];
    });
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  scanDoc() {
    
    // let opts: DocumentScannerOptions = {
    //   quality: 2.2,
    //   returnBase64: true,
    //   sourceType: 1
    // };
    // this.docScan.scanDoc(opts)
    //   .then((res: string) => {
    //     this.imageinput.value = res;
    //   })
    //   .catch((error: any) => {
    //     console.error(error);
    //     alert(error);
    //   });

  }

  async  handleButtonClick() {
 
      const actionSheet = await this.actionSheetController.create({
        header: 'Choose Option',
        cssClass:'cls',
       
        buttons: [
          { text: 'CAMERA', role: 'destructive', handler: () => {
           this.takeImage(this.imageinput.item_db_name,'CAMERA')}
          },
          { text: 'GALLERY', handler: () => {
            this.takeImage(this.imageinput.item_db_name,'PHOTOLIBRARY')} },
          { text: 'DELETE' ,handler: () => {
            this.clearImage()}},
          { text: 'Cancel', role: 'cancel' }
        ]
      });

      await actionSheet.present();

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
