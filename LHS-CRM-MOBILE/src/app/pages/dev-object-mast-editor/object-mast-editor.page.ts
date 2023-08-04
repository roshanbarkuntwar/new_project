import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-object-mast-editor',
  templateUrl: './object-mast-editor.page.html',
  styleUrls: ['./object-mast-editor.page.scss'],
})
export class ObjectMastEditorPage implements OnInit {

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
