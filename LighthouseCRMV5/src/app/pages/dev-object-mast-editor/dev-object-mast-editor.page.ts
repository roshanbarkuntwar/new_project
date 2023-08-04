import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dev-object-mast-editor',
  templateUrl: './dev-object-mast-editor.page.html',
  styleUrls: ['./dev-object-mast-editor.page.scss'],
})
export class DevObjectMastEditorPage implements OnInit {

  @Input() data:any ;

  constructor(private modalctrl: ModalController) { }

  ngOnInit() {
    console.log(this.data);
  }

  itemClick(event){}
  closePage(){
    this.modalctrl.dismiss();
  }

 
}
