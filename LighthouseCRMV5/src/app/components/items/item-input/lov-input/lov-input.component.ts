import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { SingleSelectLovPage } from 'src/app/pages/single-select-lov/single-select-lov.page';
import { OverlayEventDetail } from '@ionic/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { PouchDBService } from 'src/app/services/pouch-db.service';
import { ActionSheetController } from '@ionic/angular';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { SuperPage } from 'src/app/pages/super/super.page';
import { LhsLibService } from 'src/app/services/lhs-lib.service';



@Component({
  selector: 'app-lov-input',
  templateUrl: './lov-input.component.html',
  styleUrls: ['./lov-input.component.scss'],
})
export class LOVInputComponent implements OnInit {

  @Input() lovinput: any;
  @Input() wscp: any;
  @Input() parentComponent: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  userDetails: any;
  current_page_parameter: any = {};
  Object_code: any = [];
  objectList: any[];
  keyList = [];
  lovHead = [];
  object_arr: any = [];
  clearFlag: boolean = false;
  developerModeData: any;
  breadCrumsuper: any;
  chips: any = [];
  tempCodeOfValues: any = [];
  error = false;
  lovObjFlag: boolean = false;
  backdismiss: boolean = false;
  lovObj: any;
  platformValue: any;
  wsdp: any = [];
  objLovData: any = [];
  dropdownAutoValueList: any = [];
  chipValue: any = "";
  autoValue: any = "";
  searchText: any = "";
  dataFromSingleSelect = false;
  constructor(public modalCtrl: ModalController, private viewContainerRef: ViewContainerRef, public popoverController: PopoverController, private platform: Platform,
    private globalObjects: GlobalObjectsService, public dataService: DataService, private pouchDBService: PouchDBService, public actionSheetController: ActionSheetController
    , private sqlServ: SqlLiteService, private lhslib: LhsLibService) { }

  // constructor(public modalCtrl: ModalController,@Inject(forwardRef(() => ParentComponent)) private _parent:ParentComponent) {
  //   console.log(_parent);
  // }




  ngOnInit() {
    if (this.platform.is("android")) {
      this.platformValue = "android";
      this.backdismiss = true;
    } else if (this.platform.is("ios")) {
      this.platformValue = "ios";
      this.backdismiss = true;
    } else {
      this.platformValue = "browser";
      this.backdismiss = false;
    }

    if (this.lovinput.item_sub_type == 'M' && this.lovinput.value) {
      let val = this.lovinput.value.split(",");
      this.chips = val;
      if (this.lovinput.position == 'floating') {

        let obj: any = {
          "position": "absolute",
        }
        if (this.lovinput.item_sub_type == 'M' && this.lovinput.value && this.lovinput.value.length > 0) {
          obj.top = "-18px";
        } else if (this.lovinput.value) {
          obj.top = "-18px";
        }
        this.lovinput.labelStyle = obj;
      }
    } else {
      if (this.lovinput.position == 'floating') {
        let obj = {
          "position": "absolute",

        }
        this.lovinput.labelStyle = obj;
      }
    }
    // if(!this.lovinput.lov_return_column_str){
    //   this.lovinput.item_sub_type = 'CODE_LOV'
    // }
    if (this.lovinput.item_sub_type == 'LIST_COMBO_BOX' || this.lovinput.item_sub_type == 'COMBO_BOX') {
      this.lovinput.flag = false;
      this.lovinput.show = true;
      this.getPageInfo();
    }
    console.log("this is lov input", this.lovinput);
    console.log("this is lov parentcompo", this.parentComponent);
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    console.log("this.lovinput", this.lovinput);
    this.lovinput.show = true;


    if (this.lovinput.calling_parameter_str && this.lovinput.calling_parameter_str.indexOf("LOV") > -1) {
      this.lovObjFlag = true;
      let strArr = this.lovinput.calling_parameter_str.split("~");
      for (let x of strArr) {
        if (x.indexOf("LOV") > -1) {
          this.lovObj = x;
        }
      }
    }


  }

  async openLov() {
    let glob = this.globalObjects.lovObjData.find(x => x.apps_item_seqid == this.lovinput.apps_item_seqid);

    if (glob) {
      this.openLovObject();
    } else {

      this.wscp.lov_code = this.lovinput.lov_code;
      this.lovinput.touched = true;
      if (this.lovinput.show) {
        this.lovinput.show = false;
        let rowindex;
        var data = { message: 'hello world' };
        // if (this.lovinput.item_enable_flag == '') {
        if (this.lovinput.item_enable_flag && (!(this.lovinput.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.lovinput.item_enable_flag == 'F'))) {
          return false;
        } else {
          let wsdp = [];
          let col = {};
          if (this.lovinput.indexcount) {
            rowindex = this.lovinput.indexcount;
          } else {
            rowindex = 0;
          }
          if (this.parentComponent.frame.tableRows) {
            for (let itemGroup of this.parentComponent.frame.tableRows[rowindex]) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.codeOfValues) {
                    col[item.apps_item_seqid] = item.codeOfValues
                  } else {
                    col[item.apps_item_seqid] = item.value
                  }
                }
              }
            }
          } else {
            for (let itemGroup of this.parentComponent.frame) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.codeOfValues) {
                    col[item.apps_item_seqid] = item.codeOfValues
                  } else {
                    col[item.apps_item_seqid] = item.value
                  }
                }
              }
            }
          }

          wsdp = this.globalObjects.getWsdp("").wsdp;

          if (this.parentComponent.frame.apps_frame_type == 'TABLE' || this.parentComponent.frame.apps_frame_type == 'CARD' || this.parentComponent.frame.apps_frame_type == 'ENTRY_TABLE'){
            wsdp.push(col);
          }

          // if(this.globalObjects.parameterFrame){
          //   let col = {};
          //   for (let itemGroup of this.globalObjects.parameterFrame.tableRows[rowindex]) {
          //     if (itemGroup.Level5) {
          //       for (let item of itemGroup.Level5) {
          //         if (item.codeOfValues) {
          //           col[item.item_name] = item.codeOfValues
          //         } else {
          //           col[item.item_name] = item.value
          //         } 
          //       }
          //     }
          //   }
          //   wsdp.push(col);
          // }

          // if (this.globalObjects.parameterObject) {
          //   wsdp = []
          //   for (let object of this.globalObjects.parameterObject.Level2) {
          //     for (let frame of object.Level3) {
          //       if (frame.tableRows) {
          //         let tableRows = [];
          //         tableRows = frame.tableRows;
          //         if (frame.apps_page_frame_seqid && frame.apps_page_frame_seqid.indexOf("PARA") > -1) {

          //           for (let framedata of tableRows) {
          //             let col = {};
          //             let coltp = {};
          //             for (let itemGroup of framedata) {
          //               if (itemGroup.Level5) {
          //                 for (let item of itemGroup.Level5) {
          //                   if (item.codeOfValues) {
          //                     col[item.item_name] = item.codeOfValues;
          //                   } else if (item.value) {
          //                     col[item.item_name] = item.value;
          //                   } else {
          //                     col[item.item_name] = "";
          //                   }
          //                 }
          //               }
          //             }
          //             wsdp.push(col);
          //           }

          //         } else {

          //           for (let framedata of tableRows) {
          //             let col = {};
          //             let coltp = {};
          //             for (let itemGroup of framedata) {
          //               if (itemGroup.Level5) {
          //                 for (let item of itemGroup.Level5) {
          //                   if (item.codeOfValues) {
          //                     col[item.apps_item_seqid] = item.codeOfValues;
          //                   } else if (item.value) {
          //                     col[item.apps_item_seqid] = item.value;
          //                   } else {
          //                     col[item.apps_item_seqid] = "";
          //                   }
          //                 }
          //               }
          //             }
          //             wsdp.push(col);
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
          // wsdp = this.globalObjects.getWsdp("").wsdp;
          // console.log(wsdp)
          // let newWsdp = [];
          // if (this.parentComponent.wsdp && this.parentComponent.wsdp.length > 0 && (this.parentComponent.frame.object_code == this.lovinput.object_code)
          //   && (this.parentComponent.frame.apps_page_no != '1')) {
          //   newWsdp.push(Object.assign(this.parentComponent.wsdp[0], wsdp[0]));
          // } else {
          //   newWsdp = wsdp;
          // }


          //  newWsdp = wsdp;
          if (this.lovinput.item_sub_type == "L_DD") {
            this.openDropDown(wsdp);
          } else if (this.lovinput.item_type == "LP") {
            const popover = await this.popoverController.create({
              component: SingleSelectLovPage,
              id: "globalPopover",
              backdropDismiss: true,
              translucent: true,
              componentProps: { paramValue: this.lovinput, wsdp: wsdp, prompt_name: this.lovinput.prompt_name, wscp: this.wscp }
            });
            this.globalObjects.breadCrumpsArray.push(this.lovinput);
            popover.onDidDismiss().then((detail: OverlayEventDetail) => {
              this.globalObjects.breadCrumpsArray.pop();
              this.lovinput.show = true;

              if (detail.data) {
                this.lovinput.codeOfValues = detail.data.codeOfValues;
                this.lovinput.value = detail.data.value;
                this.lovinput.item = detail.data.item;
                this.lovinput.DcodeOfValues = detail.data.codeOfValues;
                this.lovinput.Dvalue = detail.data.value;
                this.lovinput.Ditems = detail.data.Ditems;
                if (this.lovinput.item_sub_type == 'LOV_ON_CHOICE') {
                  if (this.lovinput.position == 'floating') {

                    let obj: any = {
                      "position": "absolute",
                    }
                    if (this.lovinput.value && this.lovinput.value.length > 0) {
                      obj.top = "-18px";
                    } else if (this.lovinput.value) {
                      obj.top = "-18px";
                    }
                    this.lovinput.labelStyle = obj;
                  }
                  this.chips = [];
                  this.tempCodeOfValues = [];
                  this.chips.push(this.lovinput.value);
                  this.tempCodeOfValues.push(this.lovinput.codeOfValues);
                }
                if (this.lovinput.item_sub_type == 'M' || this.lovinput.item_sub_type == 'LIST_COMBO_BOX') {
                  this.lovinput.isValid = true
                  this.chips = detail.data.value;
                  this.tempCodeOfValues = this.lovinput.codeOfValues;
                  this.lovinput.value = "";
                  this.lovinput.codeOfValues = "";
                  for (let item of detail.data.codeOfValues) {
                    this.lovinput.codeOfValues = this.lovinput.codeOfValues ? (this.lovinput.codeOfValues + "," + item) : item;
                  }
                  for (let item of detail.data.value) {
                    this.lovinput.value = this.lovinput.value ? (this.lovinput.value + "," + item) : item;
                  }
                  if (this.lovinput.item_sub_type == 'LIST_COMBO_BOX' && this.objectList && this.objectList.length > 0) {
                    for (let object of this.objectList) {
                      if (this.tempCodeOfValues.indexOf(object[this.keyList[0].key]) > -1) {
                        if (object[this.keyList[0].key] == this.tempCodeOfValues[this.tempCodeOfValues.indexOf(object[this.keyList[0].key])]) {
                          object.isChecked = true;
                        }
                      }
                    }
                  }
                  if (this.lovinput.position == 'floating') {
                    let obj: any = {
                      "position": "absolute",
                    }
                    if (this.lovinput.value && this.lovinput.value.length > 0) {
                      obj.top = "-18px";
                    } else if (this.lovinput.value) {
                      obj.top = "-18px";
                    }
                    this.lovinput.labelStyle = obj;
                  }
                  this.onChange('');
                }
              }
              else {
                if (this.lovinput.value) {

                } else {

                  this.lovinput.codeOfValues = "";
                  this.lovinput.value = "";
                  this.lovinput.isValid = false
                  if (this.lovinput.item_sub_type == 'M' || this.lovinput.item_sub_type == 'LOV_ON_CHOICE') {
                    this.lovinput.isValid = false
                    this.chips = [];
                    this.tempCodeOfValues = [];
                    if (this.objectList) {
                      for (let object of this.objectList) {
                        object.isChecked = false;
                      }
                    }
                    this.onChange('');
                  }
                }
              }
            });
            await popover.present();
          } else {

            const modal: HTMLIonModalElement =
              await this.modalCtrl.create({
                component: SingleSelectLovPage,
                backdropDismiss: true,
                componentProps: { paramValue: this.lovinput, wsdp: wsdp, prompt_name: this.lovinput.prompt_name, wscp: this.wscp }
              });
            this.globalObjects.breadCrumpsArray.push(this.lovinput);
            modal.onDidDismiss().then((detail: OverlayEventDetail) => {
              this.globalObjects.breadCrumpsArray.pop();
              this.lovinput.show = true;
              // this.lovinput.touched =true
              if (detail.data) {
                this.lovinput.codeOfValues = detail.data.codeOfValues;
                this.lovinput.item = detail.data.item;
                this.objLovData = detail.data.data;
                this.lovinput.value = detail.data.value;
                this.lovinput.DcodeOfValues = detail.data.codeOfValues;
                this.lovinput.Dvalue = detail.data.value;
                this.lovinput.Ditems = detail.data.Ditems;
                this.dataFromSingleSelect = true;
                if (this.lovinput.item_sub_type == 'LOV_ON_CHOICE') {
                  if (this.lovinput.position == 'floating') {

                    let obj: any = {
                      "position": "absolute",
                    }
                    if (this.lovinput.value && this.lovinput.value.length > 0) {
                      obj.top = "-18px";
                    } else if (this.lovinput.value) {
                      obj.top = "-18px";
                    }
                    this.lovinput.labelStyle = obj;
                  }
                  this.chips.length = 0;
                  this.tempCodeOfValues.length = 0;
                  this.chips.push(this.lovinput.value);
                  this.tempCodeOfValues.push(this.lovinput.codeOfValues);
                }
                if (this.lovinput.item_sub_type == 'M' || this.lovinput.item_sub_type == 'LIST_COMBO_BOX') {
                  this.lovinput.isValid = true
                  this.chips = detail.data.value;
                  this.tempCodeOfValues = this.lovinput.codeOfValues;
                  this.lovinput.value = "";
                  this.lovinput.codeOfValues = "";
                  for (let item of detail.data.codeOfValues) {
                    this.lovinput.codeOfValues = this.lovinput.codeOfValues ? (this.lovinput.codeOfValues + "," + item) : item;
                  }
                  for (let item of detail.data.value) {
                    this.lovinput.value = this.lovinput.value ? (this.lovinput.value + "," + item) : item;
                  }
                  if (this.lovinput.item_sub_type == 'LIST_COMBO_BOX' && this.objectList && this.objectList.length > 0) {
                    for (let object of this.objectList) {
                      if (this.tempCodeOfValues.indexOf(object[this.keyList[0].key]) > -1) {
                        if (object[this.keyList[0].key] == this.tempCodeOfValues[this.tempCodeOfValues.indexOf(object[this.keyList[0].key])]) {
                          object.isChecked = true;
                        }
                      }
                    }
                  }
                  this.onChange('');
                }

                // if(!this.lovinput.lov_return_column_str){
                //   this.lovinput.value = detail.data.value;
                // }else{
                // }
                this.onChange('');
              }
              else {

                if (this.lovinput.value) {

                } else {
                  this.lovinput.codeOfValues = "";
                  this.lovinput.value = "";
                  if (this.lovinput.item_sub_type == 'M' || this.lovinput.item_sub_type == 'LOV_ON_CHOICE') {
                    this.lovinput.isValid = false
                    this.chips = [];
                    this.tempCodeOfValues = [];
                    if (this.objectList) {
                      for (let object of this.objectList) {
                        object.isChecked = false;
                      }
                    }
                    this.onChange('');
                  }
                }
              }
            });
            await modal.present();
          }
        }
      }
    }
  }





  cleardata() {
    this.lovinput.value = null;
    this.lovinput.codeOfValues = null;
    this.clearFlag = true;
    this.globalObjects.lovObjData = [];
    this.objLovData = [];
    //this.clearReturnData();
    if (this.lovinput.position == 'floating') {
      let obj: any = {
        "position": "absolute",
      }
      this.lovinput.labelStyle = obj;
    }
    if (this.lovinput.item_sub_type == 'M' || this.lovinput.item_sub_type == 'LIST_COMBO_BOX' || this.lovinput.item_sub_type == 'LOV_ON_CHOICE') {
      this.lovinput.isValid = false;
      this.chips = [];
      this.tempCodeOfValues = [];
      if (this.objectList) {
        for (let object of this.objectList) {
          object.isChecked = false;
        }
      }
      this.onChange('');
    }

  }

  onChange(onChange) {
    if (this.lovinput.position == 'floating') {

      let obj: any = {
        "position": "absolute",
      }
      if (this.lovinput.item_sub_type == 'M' || this.lovinput.item_sub_type == 'LIST_COMBO_BOX' && this.lovinput.value && this.lovinput.value.length > 0) {
        obj.top = "-18px";
      } else if (this.lovinput.value) {
        obj.top = "-18px";
      }
      this.lovinput.labelStyle = obj;
    }
    let itemFlag = [];
    let reqFlag = [];
    let enFlag = [];
    for (let l in this.lovinput.item) {
      let coldata;
      if (l.indexOf("#") > -1) {
        coldata = l.split("#")[0];
      } else {
        coldata = l;
      }
      if (coldata.toLowerCase().split("~")[1] == 'item_visible_flag') {
        if (this.lovinput.item[l]) {
          let item = this.lovinput.item[l].split('~');
          for (let a of item) {
            let flag = a.split('=');
            let obj = {
              key: flag[0],
              value: flag[1]
            }
            itemFlag.push(obj);
          }
        }
      }
      if (coldata.toLowerCase().split("~")[1] == 'data_required_flag') {
        if (this.lovinput.item[l]) {
          let item = this.lovinput.item[l].split('~');
          for (let a of item) {
            let flag = a.split('=');
            let obj = {
              key: flag[0],
              value: flag[1]
            }
            reqFlag.push(obj);
          }
        }
      }
      if (coldata.toLowerCase().split("~")[1] == 'item_enable_flag') {
        if (this.lovinput.item[l]) {
          let item = this.lovinput.item[l].split('~');
          for (let a of item) {
            let flag = a.split('=');
            let obj = {
              key: flag[0],
              value: flag[1]
            }
            enFlag.push(obj);
          }
        }
      }
    }
    if (this.lovinput.lov_return_column_str) {
      if (this.lovinput.lov_return_column_str.indexOf(";") > -1) {
        this.setReturnData();
      } else {

        // let lov_RetArr : any = [];
        let lov_return_key = this.lovinput.lov_return_column_str.split("#");

        let tablerows = [];
        tablerows = this.parentComponent.frame.tableRows;
        // if (this.parentComponent.frame.apps_frame_type == "ENTRY_TABLE") {
        //   tablerows[0] = this.parentComponent.frame.tableRows[this.lovinput.indexCount];
        // } else {
        //   tablerows = this.parentComponent.frame.tableRows;
        // }
        let rowIndex = 0;
        if (this.lovinput.indexcount) {
          rowIndex = this.lovinput.indexcount;
        }

        if (tablerows) {
          for (let itemGroup of tablerows[rowIndex]) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                for (let lovKey of lov_return_key) {
                  if (item.item_name && lovKey.toUpperCase() == item.item_name.toUpperCase()) {
                    if (this.clearFlag && !this.lovinput.item) {
                      item.value = null;
                      item.codeOfValues = null;
                    }
                    for (let x in this.lovinput.item) {
                      let k;
                      if (x.indexOf("#") > -1) {
                        k = x.split("#")[0];
                      } else {
                        k = x
                      }
                      if (item.item_name && item.item_name.toUpperCase() == k.toUpperCase().split("~")[1]) {
                        if (this.clearFlag) {
                          item.value = null;
                          item.codeOfValues = null;
                        } else {
                          item.value = this.lovinput.item[x];
                          if (item.item_type == 'L') {
                            item.codeOfValues = this.lovinput.item[x];
                          }

                          if (item.value && item.item_sub_type == 'D' && this.platformValue == 'browser') {

                            let d = this.globalObjects.formatDate(item.value, 'yyyy-MM-dd');
                            let blurDate = new Date(item.value)
                            item.blurValue = blurDate.getTime();
                            item.Dvalue = { isRange: false, singleDate: { jsDate: new Date(d) } };
                            if (item.position == 'floating') {
                              let obj = {
                                "position": "absolute",
                                "top": "-18px"
                              }
                              item.labelStyle = obj;
                            }
                          }

                        }
                      }
                    }
                  }
                }
                if (itemFlag.length > 0 || reqFlag.length > 0 || enFlag.length > 0) {
                  for (let f of itemFlag) {
                    if (item.item_name && item.item_name.toUpperCase() == f.key.toUpperCase()) {
                      item.item_visible_flag = f.value;
                    }
                  }

                  for (let e of enFlag) {
                    if (item.item_name && item.item_name.toUpperCase() == e.key.toUpperCase()) {
                      item.item_enable_flag = e.value;
                    }
                  }

                  for (let r of reqFlag) {
                    if (item.item_name && item.item_name.toUpperCase() == r.key.toUpperCase()) {
                      item.data_required_flag = r.value;
                      if (r.value == 'T') {
                        item.isValid = false;
                        if (item.prompt_name && item.prompt_name.indexOf('*') > -1) { } else {
                          item.prompt_name = item.prompt_name + '*'
                        }
                      } else {
                        if (item.prompt_name && item.prompt_name.indexOf('*') > -1) {
                          let str = item.prompt_name.slice(0, item.prompt_name.length - 1);
                          item.prompt_name = str;
                        }
                      }
                    }
                  }

                }
              }
            }
          }
        } else {
          for (let lovKey of lov_return_key) {
            if (this.lovinput.item_name && lovKey.toUpperCase() == this.lovinput.item_name.toUpperCase()) {
              for (let x in this.lovinput.item) {
                let k;
                if (x.indexOf("#") > -1) {
                  k = x.split("#")[0];
                } else {
                  k = x
                }
                if (this.lovinput.item_name.toUpperCase() == k.toUpperCase().split("~")[1]) {
                  this.lovinput.value = this.lovinput.item[x];
                  this.lovinput.codeOfValues = this.lovinput.item[x]

                }
              }
            }
          }
        }
      }
    } else {




      if (itemFlag.length > 0 || reqFlag.length > 0) {
        let tablerows = this.parentComponent.frame.tableRows;
        for (let tabledata of tablerows) {
          for (let itemGroup of tabledata) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                for (let f of itemFlag) {
                  if (item.item_name && item.item_name.toUpperCase() == f.key.toUpperCase()) {
                    item.item_visible_flag = f.value;
                  }
                }

                for (let e of enFlag) {
                  if (item.item_name && item.item_name.toUpperCase() == e.key.toUpperCase()) {
                    item.item_enable_flag = e.value;
                  }
                }

                for (let r of reqFlag) {
                  if (item.item_name && item.item_name.toUpperCase() == r.key.toUpperCase()) {
                    item.data_required_flag = r.value;
                    if (r.value == 'T') {
                      item.isValid = false;
                      if (item.prompt_name && item.prompt_name.indexOf('*') > -1) { } else {
                        item.prompt_name = item.prompt_name + '*'
                      }
                    } else {
                      if (item.prompt_name && item.prompt_name.indexOf('*') > -1) {
                        let str = item.prompt_name.slice(0, item.prompt_name.length - 1);
                        item.prompt_name = str;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // if(this.lovinput.touched){
    //   this.error = true;
    // }else{
    //   this.error = false;
    // }
    this.clearFlag = false;
    this.lovinput.itemClicked = 'post';
    this.emitOnChange.emit(this.lovinput)
  }


  setReturnData() {
    if (this.clearFlag) {
      this.clearReturnData();
    } else {

      let lov_return_key = this.lovinput.lov_return_column_str.split(";");

      let tablerows = [];
      if (this.parentComponent.frame.apps_frame_type == "ENTRY_TABLE") {
        tablerows[0] = this.parentComponent.frame.tableRows[this.lovinput.indexCount];
      } else {
        tablerows = this.parentComponent.frame.tableRows;
      }
      lov_return_key.pop();
      for (let retStr of lov_return_key) {
        let values = [];
        if (retStr.indexOf("!=") > -1) {
          values = retStr.split("!=");
        } else {
          values = retStr.split(":=");
        }
        let frameName;
        let key = [];
        if (values[0].indexOf(".") > -1) {
          key = values[0].split(".");
          if (key[0].indexOf(":") > -1) {
            frameName = key[0].split(":")[1];
          } else {
            frameName = key[0];
          }
        } else {
          if (values[0].indexOf(":") > -1) {
            frameName = values[0].split(":")[1];
          } else {
            frameName = values[0];
          }
        }

        // if (values[0].indexOf(".") > -1) {
        //   let key = values[0].split(".");
        //   let frameName;
        //   if (key[0].indexOf(":") > -1) {
        //     frameName = key[0].split(":")[1];
        //   } else {
        //     frameName = key[0];
        //   }
        if (this.lovinput.item_sub_type != 'M') {
          if (this.dataFromSingleSelect) {
            for (let lVal of this.objLovData) {
              if (values[1] && values[1].indexOf(".") > -1) {
                values[1] = values[1].split(".")[1];
              }
              if (lVal.key.toLowerCase() == values[1].toLowerCase()) {
                this.lhslib.set_item_value(values[0], lVal.value, this.lovinput.indexCount);
              }
            }
            // if (this.parentComponent.frame.frame_alias && (this.parentComponent.frame.frame_alias.toLowerCase() == frameName.toLowerCase())) {
            //   for (let tabledata of tablerows) {
            //     for (let itemGroup of tabledata) {
            //       if (itemGroup.Level5) {
            //         for (let item of itemGroup.Level5) {
            //           if (item.item_name.toLowerCase() == key[1].toLowerCase()) {
            //             for (let lVal of this.objLovData) {
            //               if (values[1] && values[1].indexOf(".") > -1) {
            //                 values[1] = values[1].split(".")[1];
            //               }
            //               if (lVal.key.toLowerCase() == values[1].toLowerCase()) {
            //                 item.value = lVal.value;
            //               }
            //             }
            //           }
            //         }
            //       }
            //     }
            //   }
            // } else {
            //   for (let tabledata of tablerows) {
            //     for (let itemGroup of tabledata) {
            //       if (itemGroup.Level5) {
            //         for (let item of itemGroup.Level5) {
            //           if (item.item_name.toLowerCase() == frameName.toLowerCase()) {
            //             for (let lVal of this.objLovData) {
            //               if (values[1] && values[1].indexOf(".") > -1) {
            //                 values[1] = values[1].split(".")[1];
            //               }
            //               if (lVal.key.toLowerCase() == frameName.toLowerCase()) {
            //                 item.value = lVal.value;
            //               }
            //             }
            //           }
            //         }
            //       }
            //     }
            //   }
            // }
          } else {
            if (this.parentComponent.frame.frame_alias && (this.parentComponent.frame.frame_alias.toLowerCase() == frameName.toLowerCase())) {
              for (let tabledata of tablerows) {
                for (let itemGroup of tabledata) {
                  if (itemGroup.Level5) {
                    for (let item of itemGroup.Level5) {
                      if (item.item_name.toLowerCase() == key[1].toLowerCase()) {
                        for (let lVal of this.objLovData) {
                          if (lVal.key.toLowerCase() == values[1].toLowerCase()) {
                            item.value = lVal.value;
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              for (let tabledata of tablerows) {
                for (let itemGroup of tabledata) {
                  if (itemGroup.Level5) {
                    for (let item of itemGroup.Level5) {
                      if (item.item_name.toLowerCase() == frameName.toLowerCase()) {
                        for (let lVal of this.objLovData) {
                          if (values[1] && values[1].indexOf(".") > -1) {
                            values[1] = values[1].split(".")[1];
                          }
                          if (lVal.key.toLowerCase() == frameName.toLowerCase()) {
                            item.value = lVal.value;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          for (let val of this.objLovData) {
            for (let lVal of val) {
              // if (values[1] && values[1].indexOf(".") > -1) {
              //   values[1] = values[1].split(".")[1];
              // }
              if (lVal.key.toLowerCase() == values[1].toLowerCase()) {
                this.lhslib.set_item_value(values[0], lVal.value, 0);
              }
            }
          }
        }



      }
      this.dataFromSingleSelect = false;
    }

  }

  clearReturnData() {

    let lov_return_key = this.lovinput.lov_return_column_str.split(";");

    let tablerows = [];
    if (this.parentComponent.frame.apps_frame_type == "ENTRY_TABLE") {
      tablerows[0] = this.parentComponent.frame.tableRows[this.lovinput.indexCount];
    } else {
      tablerows = this.parentComponent.frame.tableRows;
    }
    lov_return_key.pop();
    for (let retStr of lov_return_key) {
      if (retStr.indexOf(":=") > -1) {
        let values = retStr.split(":=");
        let frameName;
        let key = [];
        if (values[0].indexOf(".") > -1) {
          key = values[0].split(".");
          if (key[0].indexOf(":") > -1) {
            frameName = key[0].split(":")[1];
          } else {
            frameName = key[0];
          }
        } else {
          if (values[0].indexOf(":") > -1) {
            frameName = values[0].split(":")[1];
          } else {
            frameName = values[0];
          }
        }



        if (this.parentComponent.frame.frame_alias && (this.parentComponent.frame.frame_alias.toLowerCase() == frameName.toLowerCase())) {
          for (let tabledata of tablerows) {
            for (let itemGroup of tabledata) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.item_name.toLowerCase() == key[1].toLowerCase()) {
                    item.value = null;
                    // for (let lVal of this.objLovData) {
                    //   if (lVal.key.toLowerCase() == values[1].toLowerCase()) {
                    //     item.value = lVal.value;
                    //   }
                    // }
                  }
                }
              }
            }
          }
        } else {
          for (let tabledata of tablerows) {
            for (let itemGroup of tabledata) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.item_name.toLowerCase() == frameName.toLowerCase()) {
                    item.value = null;
                    // for (let lVal of this.objLovData) {
                    //   if (lVal.key.toLowerCase() == values[1].toLowerCase()) {
                    //     item.value = lVal.value;
                    //   }
                    // }
                  }
                }
              }
            }
          }
        }

      }

    }

    this.clearFlag = false;

  }



  getDropData(wsdp) {
    return new Promise((resolve) => {


      this.wscp.service_type = "get_lov_data";
      this.wscp.apps_page_no = this.lovinput.apps_page_no;
      this.wscp.apps_page_frame_seqid = this.lovinput.apps_page_frame_seqid;
      this.wscp.apps_item_seqid = this.lovinput.apps_item_seqid;
      this.userDetails = this.globalObjects.getLocallData("userDetails");
      this.userDetails["object_code"] = this.lovinput.object_code;
      let reqData: any = {};
      reqData = {
        "wslp": this.userDetails,
        "wscp": this.wscp,
        "wsdp": wsdp
      }

      // reqData.wsdp = [{
      //     "apps_item_seqid": "1",
      //     "itemType": "TEXT",
      //     "itemDefaultValue": "Y~Yes#N~No"
      //   }];

      if (!this.globalObjects.networkStatus) {
        let objectKey = this.userDetails.object_code + "_LOV_" + this.wscp.apps_item_seqid;
        if (this.userDetails.object_code && this.wscp.apps_working_mode == 'I') {
          this.sqlServ.getById(objectKey, 'item_master').then(data => {
            if (data.resStatus == 'Success') {
              let objData: any = JSON.parse(data.resData.objData);
              this.objectList = objData.Level1;
              this.Object_code = objData.Level1[0];

              for (let code in this.Object_code) {
                let codedata = code.split("~");
                if (codedata[1].toLowerCase() != 'item_visible_flag') {
                  this.lovHead.push(codedata[0]);
                  this.keyList.push(code);
                }
              }

              let dropDownArr = [];
              dropDownArr[0] = {
                text: this.lovHead[1],
                role: 'close',
                icon: 'arrow-back',
                cssClass: 'coustom',
                handler: () => {
                  this.lovinput.show = true;
                }
              }
              for (let x of this.objectList) {

                let obj = {
                  text: x[this.keyList[1]],
                  handler: () => {
                    this.lovinput.codeOfValues = x[this.keyList[0]];
                    this.lovinput.value = x[this.keyList[1]];
                    this.lovinput.item = x
                    this.lovinput.show = true;
                    console.log(this.lovinput);
                  }
                }
                dropDownArr.push(obj);
              }

              resolve(dropDownArr);
            }
          }, (error) => {
          })
        }
      }
      else {
        this.globalObjects.ShowLoadingNew();

        this.dataService.postData("S2U", reqData).then(res => {

          let data: any = res;
          // console.log("data in lovpage", res);

          this.globalObjects.hideLoadingNew();
          if (data.responseStatus == "success") {
            this.object_arr = data.responseData
            let objData = this.globalObjects.setPageInfo(data.responseData);
            this.objectList = objData.Level1;
            this.Object_code = objData.Level1[0];
            delete this.Object_code['Level2'];

            //-------------------OFFLINE LOV SAVE ---------------------------------------------------//
            let offlineObjectCode: any;
            if (objData && this.wscp.apps_working_mode == 'I') {
              if (reqData.wslp) {
                if (reqData.wslp.object_code) {
                  offlineObjectCode = reqData.wslp.object_code + "_LOV_" + reqData.wscp.apps_item_seqid;
                }
              }
              let pouchObjectKey = offlineObjectCode;
              objData.id = pouchObjectKey;
              // objData._rev = "";
              var temp: any = {};
              var id = pouchObjectKey;
              this.sqlServ.getById(id, 'item_master').then((localData: any) => {
                temp.objMast = JSON.stringify(objData);
                temp.id = id;
                if (data.resStatus == 'Success') {
                  this.sqlServ.deleteObjMast(id, 'item_master').then(() => {
                    this.sqlServ.postDataSql(temp, 'item_master');
                  })
                } else {
                  this.sqlServ.postDataSql(temp, 'item_master');
                }
              }, (err) => {
                temp.id = pouchObjectKey;
                temp.objMast = JSON.stringify(objData);
                // objData._rev = "";
                this.sqlServ.postDataSql(temp, 'item_master');
              })
            }

            //-------------------OFFLINE LOV SAVE ---------------------------------------------------//
            // this.objectList = this.object_arr.Level1;
            for (let code in this.Object_code) {
              let codedata = code.split("~");

              if (codedata[1].toLowerCase() != 'item_visible_flag') {
                this.lovHead.push(codedata[0]);
                this.keyList.push(code);
              }
            }

            let dropDownArr = [];
            dropDownArr[0] = {
              text: this.lovHead[1],
              role: 'close',
              icon: 'arrow-back',
              cssClass: 'coustom',
              handler: () => {
                this.lovinput.show = true;
              }
            }

            for (let x of this.objectList) {
              let obj = {
                text: x[this.keyList[1]],
                handler: () => {
                  this.lovinput.codeOfValues = x[this.keyList[0]];
                  this.lovinput.value = x[this.keyList[1]];
                  this.lovinput.item = x;
                  this.lovinput.show = true;
                  console.log(this.lovinput);
                }
              }
              dropDownArr.push(obj);
            }
            resolve(dropDownArr);
          } else {

            alert(data.responseMsg);
          }
        }).catch(err => {
          this.globalObjects.hideLoadingNew();
          this.globalObjects.presentToast("4 Something went wrong please try again later!");
        })
      }
    })
  }

  openDropDown(wsdp) {
    console.log("l_dd")
    this.getDropData(wsdp).then(res => {
      console.log(wsdp)
      this.presentActionSheet(res)
    })
  }

  removeItem(index) {
    this.chips.splice(index, 1);
    this.tempCodeOfValues.splice(index, 1);
    this.lovinput.value = [];
    this.lovinput.codeOfValues = [];
    for (let i = 0; i < this.chips.length; i++) {
      this.lovinput.value.push(this.chips[i]);
      this.lovinput.codeOfValues.push(this.tempCodeOfValues[i]);
    }
    // if(this.chips.length <=0){
    //   this.cleardata();
    // }
    console.log(this.lovinput.value);
  }


  async presentActionSheet(res) {
    this.globalObjects.breadCrumpsArray.push(this.lovinput);
    const actionSheet = await this.actionSheetController.create({
      // header: this.lovHead[1],
      cssClass: 'my-custom-class',
      buttons: res,
      backdropDismiss: true
    });
    await actionSheet.present();
    actionSheet.onDidDismiss().then((detail: OverlayEventDetail) => {
      this.globalObjects.breadCrumpsArray.pop();
      this.lovinput.show = true;
    })
  }

  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: this.lovinput.apps_page_frame_seqid,
      item_seq_id: this.lovinput.apps_item_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData
      }
    });
    return await modal.present();
  }


  async openLovObject() {
    let rowindex;
    let wsdp = [];
    let col = {};
    if (this.lovinput.indexcount) {
      rowindex = this.lovinput.indexcount;
    } else {
      rowindex = 0;
    }
    if (this.parentComponent.frame.tableRows) {
      for (let itemGroup of this.parentComponent.frame.tableRows[rowindex]) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else {
              col[item.apps_item_seqid] = item.value
            }
          }
        }
      }
    } else {
      for (let itemGroup of this.parentComponent.frame) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else {
              col[item.apps_item_seqid] = item.value
            }
          }
        }
      }
    }
    wsdp.push(col);
    // console.log(wsdp)
    let newWsdp = [];
    if (this.parentComponent.wsdp && this.parentComponent.wsdp.length > 0) {
      newWsdp.push(Object.assign(this.parentComponent.wsdp[0], wsdp[0]));
    } else {
      newWsdp = wsdp;
    }
    let objCode;
    if (this.lovObj) {
      objCode = this.lovObj.split("=")[1];
    }
    this.wscp.click_events_str = "get_object_config";
    this.wscp.object_code = objCode;
    this.wscp.service_type = null;

    let wscp = {
      apps_item_seqid: this.wscp.apps_item_seqid,
      apps_page_frame_seqid: this.wscp.apps_page_frame_seqid,
      apps_working_mode: this.wscp.apps_working_mode,
      click_events_str: this.wscp.click_events_str,
      item_sub_type: this.lovinput.item_sub_type,
      object_code: this.wscp.object_code,
      origin_apps_item_seqid: this.wscp.origin_apps_item_seqid,
      orignal_apps_item_seqid: this.wscp.orignal_apps_item_seqid,
      service_type: null,
      lov_code: this.lovinput.lov_code
    }


    if (wscp.apps_item_seqid) { } else {
      wscp.apps_item_seqid = this.lovinput.apps_item_seqid;
    }

    let data = {
      click_events_str: "get_object_config",
      isModal: "P",
      object_mast: [],
      wscpNav: wscp,
      wsdp: newWsdp
    }

    this.globalObjects.popoverFlag = 'P'



    const modal =
      await this.popoverController.create({
        component: SuperPage,
        id: "globalPopover",
        componentProps: data,
        backdropDismiss: true
      });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      // this.globalObjects.popoverFlag = 'M';
      if (this.lovinput.item_sub_type == 'M') {
        let values = [];
        let codeOfValues = [];
        this.lovinput.isValid = true
        this.objLovData = [];
        for (let l of this.globalObjects.lovObjData) {
          if (l.apps_item_seqid == this.lovinput.apps_item_seqid) {
            values.push(l.value.values);
            codeOfValues.push(l.value.codeOfValues)
            this.objLovData.push(l.returnData);
          }
        }


        this.chips = values;
        this.tempCodeOfValues = codeOfValues
        this.lovinput.codeOfValues = "";
        this.lovinput.value = "";

        for (let item of codeOfValues) {
          this.lovinput.codeOfValues = this.lovinput.codeOfValues ? (this.lovinput.codeOfValues + "," + item) : item;
        }
        for (let item of values) {
          this.lovinput.value = this.lovinput.value ? (this.lovinput.value + "," + item) : item;
        }
        if (this.lovinput.position == 'floating') {

          let obj: any = {
            "position": "absolute",
          }
          if (this.lovinput.value && this.lovinput.value.length > 0) {
            obj.top = "-18px";
          } else if (this.lovinput.value) {
            obj.top = "-18px";
          }
          this.lovinput.labelStyle = obj;
        }
        this.onChange('');



      } else {
        this.objLovData = detail.data;

        if (!this.lovinput.lov_return_column_str) {
          this.lovinput.value = this.globalObjects.lovObjData[0].values;
          this.lovinput.codeOfValues = this.globalObjects.lovObjData[0].codeOfValues;
        }
        this.onChange('');
      }


    });

    await modal.present();

  }

  async removeItemCombo(index) {
    let valArr = this.lovinput.Dvalue;
    let codeOfVal = this.lovinput.DcodeOfValues;
    if (valArr.length > 0 && codeOfVal.length > 0) {
      let obj = JSON.parse(JSON.stringify(this.globalObjects.lovObjData));
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].apps_item_seqid == this.lovinput.apps_item_seqid) {
          if (this.tempCodeOfValues[index] == obj[i].value.codeOfValues) {
            this.globalObjects.lovObjData.splice(i, 1);
          }
        }
      }
      this.lovinput.Ditems.splice(index, 1);
      this.setItemValues();
      if (this.lovinput.Ditems && this.lovinput.Ditems.length == 0) {
        this.clearFlag = true;
      }
      let codeVal = this.tempCodeOfValues[index];
      valArr.splice(valArr.indexOf(this.chips[index]), 1);
      codeOfVal.splice(codeOfVal.indexOf(this.tempCodeOfValues[index]), 1);
      this.lovinput.value = valArr.join(',');
      this.lovinput.codeOfValues = codeOfVal.join(',');
      this.tempCodeOfValues = codeOfVal;
      this.chips = valArr;
      if (this.objectList) {
        for (let object of this.objectList) {
          if (object[this.keyList[0].key] == codeVal) {
            object.isChecked = false;
          }
        }
      }

    } else {
      this.lovinput.value = "";
      this.lovinput.codeOfValues = "";
      this.lovinput.isValid = false;
      this.tempCodeOfValues = [];
      this.chips = [];
    }
    this.onChange("");
  }

  setItemValues() {
    let strArr = [];
    let items = this.lovinput.Ditems;
    for (let l of items) {
      for (let k in l) {
        if (k != "checked" && k != "isChecked" && k != "Level2") {
          if (strArr.length > 0) {
            let glob = strArr.find(x => x.key == k);
            if (glob) {
              glob.value = glob.value + "," + l[glob.key];
            } else {
              let data = {
                key: k,
                value: l[k]
              }
              strArr.push(data);
            }
          } else {
            let data = {
              key: k,
              value: l[k]
            }
            strArr.push(data);
          }
        }
      }
    }

    let sItem = items.length > 0 ? JSON.parse(JSON.stringify(items[0])) : "";
    for (let str of strArr) {
      if (sItem[str.key]) {
        sItem[str.key] = str.value
      }
    }

    this.lovinput.item = sItem;
  }

  getMode(event) {
    if (event.isChecked == false) {
      this.chips.push(event[this.keyList[1].key]);
      event.isChecked = true;
      this.lovinput.isValid = true
      this.lovinput.codeOfValues = this.lovinput.codeOfValues ? (this.lovinput.codeOfValues + "," + event[this.keyList[0].key]) : event[this.keyList[0].key];
      this.lovinput.value = this.lovinput.value ? (this.lovinput.value + "," + event[this.keyList[1].key]) : event[this.keyList[1].key];
      this.tempCodeOfValues.push(event[this.keyList[0].key]);
    } else {
      this.chips.splice(this.chips.indexOf(event.text), 1);
      let valArr = this.lovinput.value ? this.lovinput.value.split(",") : [];
      let codeOfVal = this.lovinput.codeOfValues ? this.lovinput.codeOfValues.split(",") : [];
      if (valArr.length > 0 && codeOfVal.length > 0) {
        valArr.splice(valArr.indexOf(event[this.keyList[1].key]), 1);
        codeOfVal.splice(codeOfVal.indexOf(event[this.keyList[0].key]), 1);
        this.lovinput.value = valArr.join(',');
        this.lovinput.codeOfValues = codeOfVal.join(',');
        this.tempCodeOfValues = codeOfVal;
      } else {
        this.lovinput.value = "";
        this.lovinput.codeOfValues = "";
        this.lovinput.isValid = false;
        this.tempCodeOfValues = [];
        this.chips = [];
      }

      event.isChecked = false;
    }
    this.onChange('');

  }
  getModeCombo(index) {

    this.lovinput.value = this.objectList[index][this.keyList[1].key];
    this.lovinput.codeOfValues = this.objectList[index][this.keyList[0].key];
    this.lovinput.flag = false;
    this.onChange("");

  }

  selectval(event, index) {
    console.log("selectVal: " + event.isChecked)
    if (event.isChecked == true) {
      this.chips.push(this.objectList[index][this.keyList[1].key]);
      this.tempCodeOfValues.push(event[this.keyList[0].key]);
      this.lovinput.isValid = true;
      this.lovinput.codeOfValues = this.lovinput.codeOfValues ? (this.lovinput.codeOfValues + "," + this.objectList[index][this.keyList[0].key]) : this.objectList[index][this.keyList[0].key];
      this.lovinput.value = this.lovinput.value ? (this.lovinput.value + "," + this.objectList[index][this.keyList[1].key]) : this.objectList[index][this.keyList[1].key];
      event.isChecked = true;
    } else {
      let valArr = this.lovinput.value ? this.lovinput.value.split(",") : [];
      let codeOfVal = this.lovinput.codeOfValues ? this.lovinput.codeOfValues.split(",") : [];
      if (valArr.length > 0 && codeOfVal.length > 0) {
        valArr.splice(valArr.indexOf(this.objectList[index][this.keyList[1].key]), 1);
        codeOfVal.splice(codeOfVal.indexOf(this.objectList[index][this.keyList[0].key]), 1);
        this.lovinput.value = valArr.join(',');
        this.lovinput.codeOfValues = codeOfVal.join(',');
        this.chips.splice(this.chips.indexOf(this.objectList[index][this.keyList[1].key]), 1);
        this.tempCodeOfValues = codeOfVal;
        event.isChecked = false;
      } else {
        this.lovinput.value = "";
        this.lovinput.codeOfValues = "";
        this.lovinput.isValid = false;
        this.tempCodeOfValues = [];
        this.chips = [];
        event.isChecked = false;
      }
    }
    this.onChange('');
  }

  onChangeFirst(value) {
    if (this.lovinput.item_sub_type != 'LIST_COMBO_BOX') {
      this.lovinput.blurError = "";
    }
    this.onChange(value);
  }

  showDD() {
    this.lovinput.flag = true;
  }

  arrowkeyLocation = 0;

  keyDown(event: KeyboardEvent) {

    if (!(this.platform.is('android') && this.platform.is('ios'))) {
      let pipeLength = this.objectList.length;
      this.arrowkeyLocation ? this.arrowkeyLocation : this.arrowkeyLocation = 0;
      if (event.keyCode == 38) {  //up
        this.arrowkeyLocation--;
      }
      if (event.keyCode == 40) {   //down
        this.arrowkeyLocation++;
      }
      if (event.keyCode == 8) {   //space
        //this.arrowkeyLocation++;
        this.lovinput.flag = true;
      }
      if (event.keyCode == 13) {   //enter
        if (this.lovinput.item_sub_type == 'COMBO_BOX') {
          this.getModeCombo(this.arrowkeyLocation);
        } else {
          this.getMode(this.objectList[this.arrowkeyLocation]);
        }
      }
      if (event.keyCode == 32) {   //space check box
        if (this.lovinput.item_sub_type == 'COMBO_BOX') {
          //this.getModeCombo(this.objectList[this.arrowkeyLocation]);
        } else {
          this.getMode(this.objectList[this.arrowkeyLocation]);
        }
      }

      if (this.arrowkeyLocation > (pipeLength - 1)) {
        if (event.keyCode == 38) {//up
          this.arrowkeyLocation = 0;
        }
        if (event.keyCode == 40) {
          this.arrowkeyLocation = 0;
        }
      }
      if (this.arrowkeyLocation == -1) {
        if (event.keyCode == 38) { //up
          this.arrowkeyLocation = pipeLength - 1;
        }
      }
    }
  }

  onBlur() {
    this.lovinput.flag = false;
  }

  onClear() {
    this.lovinput.flag = false;
    this.lovinput.value = '';
    this.lovinput.codeOfValues = '';
  }

  getPageInfo() {
    if (this.globalObjects.networkStatus) {
      this.globalObjects.showLoading();
    }

    let col = {};
    let rowindex;
    if (this.lovinput.indexcount) {
      rowindex = this.lovinput.indexcount;
    } else {
      rowindex = 0;
    }
    if (this.parentComponent.frame.tableRows) {
      for (let itemGroup of this.parentComponent.frame.tableRows[0]) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else {
              col[item.apps_item_seqid] = item.value
            }
          }
        }
      }
    } else {
      for (let itemGroup of this.parentComponent.frame) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else {
              col[item.apps_item_seqid] = item.value
            }
          }
        }
      }
    }
    this.wsdp.push(col);
    this.wscp.service_type = "get_lov_data";
    this.wscp.apps_page_no = this.lovinput.apps_page_no;
    this.wscp.apps_page_frame_seqid = this.lovinput.apps_page_frame_seqid;
    this.wscp.apps_item_seqid = this.lovinput.apps_item_seqid;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.userDetails["object_code"] = this.lovinput.object_code;
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": this.wscp,
      "wsdp": this.wsdp
    }

    //------------------- Getting OFFLINE LOV SAVE ---------------------------------------------------//

    let objectKey = this.userDetails.object_code + "_LOV_" + this.wscp.apps_item_seqid;
    this.sqlServ.getById(objectKey, 'item_master').then(data => {
      if ((data.resStatus == 'Success') && !this.globalObjects.networkStatus) {
        let objData: any = JSON.parse(data.resData.itemData);
        this.objectList = objData.Level1;
        this.Object_code = objData.Level1[0];
        for (let ob of this.objectList) {
          ob.isChecked = false;
        }

        this.generateLov();
      }
      else {
        this.dataService.postData("S2U", reqData).then(res => {
          this.globalObjects.hideLoading();
          let data: any = res;
          console.log("data in lovpage", res);


          if (data.responseStatus == "success") {
            this.object_arr = data.responseData
            let objData = this.globalObjects.setPageInfo(data.responseData);
            this.objectList = objData.Level1;
            this.Object_code = objData.Level1[0];
            delete this.Object_code['Level2'];
            console.log(this.objectList)
            //-------------------OFFLINE LOV SAVE ---------------------------------------------------//

            for (let ob of this.objectList) {
              ob.isChecked = false;
            }
            let offlineObjectCode: any;
            if (objData && this.wscp.apps_working_mode == 'I') {
              if (reqData.wslp) {
                if (reqData.wslp.object_code) {
                  offlineObjectCode = reqData.wslp.object_code + "_LOV_" + reqData.wscp.apps_item_seqid;
                }
              }

              let pouchObjectKey = offlineObjectCode;
              var temp: any = {};
              var id = pouchObjectKey;
              this.sqlServ.getById(id, 'item_master').then((localData: any) => {
                temp.objData = JSON.stringify(objData);
                temp.id = id;

                if (localData.resStatus == 'Success') {
                  temp.rev = localData.resData._rev;
                  this.sqlServ.updateObjMast(temp, 'item_master').then(() => { })
                } else {
                  this.sqlServ.postDataSql(temp, 'item_master');
                }
              })
            }

            //-------------------OFFLINE LOV SAVE ---------------------------------------------------//

            this.generateLov();

          } else {
            alert(data.responseMsg);
          }
        }).catch(err => {
          this.globalObjects.hideLoading();
          this.globalObjects.presentToast("4 Something went wrong please try again later!");
        })
      }
    }, err => this.globalObjects.presentAlert('ERR PDB: ' + err))
  }



  generateLov() {

    let checkedKey;
    for (let code in this.Object_code) {
      if (code.indexOf("CB_SELECT") > -1) {
        checkedKey = code;
      }
      let coldata = code.split("#");
      let codedata
      if (coldata) {
        codedata = coldata[0].split("~");
      } else {
        codedata = code[0].split("~");
      }

      if (codedata[1].toLowerCase() != 'item_visible_flag') {
        let head;
        if (coldata) {
          head = coldata.find(x => x.indexOf("item_visible_flag") > -1);
        }

        if (head) {
          let itmVisi = head.split("~")[1];
          if (itmVisi == 'F') { } else {
            let data = {
              th: codedata[0],
              code: code
            }
            this.lovHead.push(data);
          }
        } else {
          let data = {
            th: codedata[0],
            code: code
          }
          this.lovHead.push(data);
        }

        let val: any = {};

        let wheredataArr = [];
        for (let c of coldata) {
          let k = c.split("~");

          if (k[0] == "display_setting_str" || k[0] == "item_visible_flag" || k[0] == "filter_flag") {
            if (k[0] == "display_setting_str") {
              val.display_setting_str = k[1];
            } else if (k[0] == "item_visible_flag") {
              val.item_visible_flag = k[1];
            } else if (k[0] == "filter_flag") {
              val.filter_flag = k[1];
            }
          } else {
            val.key = code;
          }
        }
        this.keyList.push(val);
      }
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

  checkEndOfString(event) {

    if (event.keyCode == 186) {   //down
      let val = this.chipValue;
      val = val.replace(";", "");
      // if(this.objectList){
      //   for (let object of this.objectList) {
      //     if(this.keyList.length > 0){
      //       if(object[this.keyList[0].key].toLowerCase()== val.toLowerCase()){
      if (this.lovinput.item_sub_type == 'LIST_COMBO_BOX') {
        this.chips.push(val);
        this.tempCodeOfValues.push(val);
        this.lovinput.value = this.chips.join(',');
        this.lovinput.codeOfValues = this.tempCodeOfValues.join(',');
        this.chipValue = "";
      } else
        if (this.chips.length == 0 && val) {
          this.chips.push(val);
          this.tempCodeOfValues.push(val);
          this.lovinput.value = this.chips.join(',');
          this.lovinput.codeOfValues = this.tempCodeOfValues.join(',');
          this.chipValue = "";
        }
      //       }
      //     }
      //   }
      // }
    }
  }

  itemClickedPreEvent() {
    this.lovinput.itemClicked = 'pre';
    this.emitPass.emit(this.lovinput);
  }

}

