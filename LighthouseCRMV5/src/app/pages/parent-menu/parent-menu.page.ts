import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-parent-menu',
  templateUrl: './parent-menu.page.html',
  styleUrls: ['./parent-menu.page.scss'],
})
export class ParentMenuPage implements OnInit {
  show:boolean = false;
  buttonName:any = 'Show';
  openNewTab:boolean = false;
  @Input() childItems:any;
  constructor( public popOverCtrl: PopoverController) { }

  ngOnInit() {
    console.log(this.childItems);
    if(this.childItems.rightClickFlag){
      this.openNewTab = true;
    }else{
      this.openNewTab = false;
    }
  }
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  closePop(item){
    if(this.childItems.rightClickFlag){
      this.popOverCtrl.dismiss(this.childItems.calling_object_code,'openNewTab');
    }else{
      this.popOverCtrl.dismiss(item,'openTab');
    }
  }
}
