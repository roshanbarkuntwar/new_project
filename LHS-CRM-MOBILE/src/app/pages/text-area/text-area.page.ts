import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.page.html',
  styleUrls: ['./text-area.page.scss'],
})
export class TextAreaPage implements OnInit {
  @Input() value;
  
  constructor( public popOverCtrl: PopoverController) { }

  ngOnInit() {
  }

  dismiss(){
    this.popOverCtrl.dismiss({value : this.value});
  }

}
