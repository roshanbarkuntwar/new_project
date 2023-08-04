import { NgModule } from '@angular/core';
// import { IonicPageModule } from 'ionic-angular';
import { ModalPage } from './modal';
import { SignaturePadModule } from 'angular2-signaturepad';
import { IonicModule } from '@ionic/angular';
@NgModule({
  declarations: [
    ModalPage,
  ],
  imports: [
    SignaturePadModule,IonicModule
  ], entryComponents: [
    ModalPage
  ]
})
export class ModalPageModule { }
