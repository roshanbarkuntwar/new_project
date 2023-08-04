import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import readXlsxFile from 'read-excel-file';
import { ModalController, Platform } from '@ionic/angular';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() button: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitClear: EventEmitter<any> = new EventEmitter<any>();
  click_events_str_arr = [];
  secondstring: any;
  head :any = [];
  body :any = [];
  tableBody : any=[];
  developerModeData :any ;
  platformFlag:any = 'android';
  id:any;
  constructor(private globalobjects:GlobalObjectsService,  private cdr: ChangeDetectorRef,public modalController: ModalController, public globalObjects:GlobalObjectsService, public platform:Platform) { 
    if(this.platform.is('ios')){
      this.platformFlag = 'ios';
    }
  }

  ngOnInit() { 
    this.id = this.button.apps_item_seqid + this.button.indexcount;
    // console.log(this.button)  let arr = [];
    // if (this.button.display_setting_str) {
    //   let keys = Object.keys(this.button.display_setting_str);
    //   let obj = {};
    //   let b = document.getElementById(this.button.apps_item_seqid);
    //   if (b) {
    //     for (let k of keys) {
    //       b.style.setProperty('--' + k, this.button.display_setting_str[k])
    //       this.cdr.detectChanges();
    //     }
    //   }
    // }
    // if (this.button.display_setting_str) {

    //   this.button.display_setting_str = typeof(this.button.display_setting_str) == 'string' ? JSON.parse(this.button.display_setting_str) : this.button.display_setting_str;
    //   let keys = Object.keys(this.button.display_setting_str);
    //   let obj = {};
    
    //     for (let k of keys) {
    //       obj['--' + k] = this.button.display_setting_str[k];
    //     }
    //     this.button.display_setting_str = obj;
    //     // console.log(obj);
      
    // }
  }

  ngAfterViewChecked() {
    let arr = [];
    if (this.button.display_setting_str) {
      let keys = Object.keys(this.button.display_setting_str);
      let obj = {};
      let b = document.getElementById(this.id);
      if (b) {
        for (let k of keys) {
          b.style.setProperty('--' + k, this.button.display_setting_str[k])
          this.cdr.detectChanges();
        }
      }
    }

  }

  ngAfterContentChecked(){
    this.globalobjects.clickedbutton = false;
  }
  buttonClick(event) {
    this.button.rightClickFlag = false;
    this.emitPass.emit(this.button);
    this.globalobjects.clickedbutton = true;
  }

  onRightClick(event) {
    console.log(this.button);
    event.preventDefault();
    this.button.rightClickFlag = true;
    this.emitPass.emit(this.button);
  }

  buttonClickClear() {
    // console.log("buttonClickClear");
    this.emitClear.emit(this.button);
  }
  updateStatus(status){

  }

  readFile(event){
    this.button.files = event.target.files;
    this.emitPass.emit(this.button);
    // if(this.button.click_events_str.indexOf("FILE_UPLOAD") > -1 && event.target.files.length > 0){
    //   this.converToBase64(event.target.files[0]).then((data:any)=>{
    //     this.button.value = data.split(",")[1];
    //     // window.location.href = data;
    //    this.emitPass.emit(this.button);
    //   },(error)=>{
    //     this.globalobjects.presentAlert("Error while reading file...");
    //   });
    // }else{
    // }
    // this.head = [];2
    // this.body = [];
    // this.tableBody = [];
    // this.getexceldetail($event).then(res => {
    //   if(res=="success"){
    //     this.emitPass.emit(this.button);
    //     this.globalobjects.clickedbutton = true;
    //   }
     
    // },error=>{
    //   console.log(error);
    // })
  }
  //Reading file logic of Chaitanya changed by Nitesh
  /*getexceldetail($event){
    return new Promise((resolve, reject) => {
      readXlsxFile($event.target.files[0]).then((rows)=>{
        for(let i of rows[0]){
          this.head.push(i);
        }
        this.body = rows;
        this.body.shift();
  
        for(let j of this.body){
          this.tableBody.push(j);
        }
        console.log(this.head);
      console.log(this.body);
      if(this.tableBody){
        this.button.head=JSON.parse(JSON.stringify(this.head))
        this.button.tableBody=JSON.parse(JSON.stringify(this.tableBody));
        resolve ("success");
      }
    },error=>{
      console.log(error);
      reject(error)
    });
      });
  }*/

converToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async showDeveloperData(){
    this.developerModeData= {
      ws_seq_id: '',
      frame_seq_id: this.button.apps_page_frame_seqid,
      item_seq_id: this.button.apps_item_seqid
    }
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData
      }
    });
    return await modal.present();
  
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