import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tree-callpage',
  templateUrl: './tree-callpage.page.html',
  styleUrls: ['./tree-callpage.page.scss'],
})
export class TreeCallpagePage implements OnInit {

  constructor(private modalctrl:ModalController) { }

  ngOnInit() {
  }
  closePage(){
    this.modalctrl.dismiss();
  }

}
