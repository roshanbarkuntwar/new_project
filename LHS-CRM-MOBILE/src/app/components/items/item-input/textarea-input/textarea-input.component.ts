import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverPage } from 'src/app/pages/popover/popover.page';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
@Component({
  selector: 'app-textarea-input',
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.scss'],
})
export class TextareaInputComponent implements OnInit {
  @Input() itemTxtInp: any
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  constructor(public popOverCtrl: PopoverController, private globalObjects: GlobalObjectsService) { }

  ngOnInit() {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    // console.log(this.itemTxtInp);
  }


  postEvent(){
    let item = JSON.parse(JSON.stringify(this.itemTxtInp));
    item.postEvent = true;
    this.emitOnChange.emit(item);
  }


  async  textAreaPopOver() {
    let textareaEditModal = await this.popOverCtrl.create({
      component: PopoverPage,
      animated: true,
      showBackdrop: true,
      componentProps: { data1: this.itemTxtInp.value, heading: this.itemTxtInp.prompt_name }
    });
    textareaEditModal.onDidDismiss().then((textareaData) => {
      this.itemTxtInp.value = textareaData.data;
    });
    return await textareaEditModal.present();
  }

  clear() {
    this.itemTxtInp.value = ''
  }
  onChange(onChange) {
  
    console.log(this.itemTxtInp.value);
      this.emitOnChange.emit(this.itemTxtInp)
  }
  focusClick(event){
    let obj={
      border: '2px solid #000'
    }
    if(event=='not'){
     this.itemTxtInp.focusstyle={};

    }else{

      this.itemTxtInp.focusstyle=obj;
    }
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
