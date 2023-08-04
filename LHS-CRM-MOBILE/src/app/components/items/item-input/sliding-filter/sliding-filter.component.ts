import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { ModalController, Events } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { SingleSelectLovPage } from 'src/app/pages/single-select-lov/single-select-lov.page';

@Component({
  selector: 'app-sliding-filter',
  templateUrl: './sliding-filter.component.html',
  styleUrls: ['./sliding-filter.component.scss'],
})
export class SlidingFilterComponent implements OnInit {
  @Input() sFilter: any;
  @Input() frame_type: any;
  @Input() parentComponent: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitfilterParam: EventEmitter<any> = new EventEmitter<any>();
  @Input() framedata: any = {};
  @Input() itemData: any;
  @Input() item: any;



  wscp: any = {};
  userDetails: any;
  object_arr: any = [];
  objectList: any = [];
  map = new Map();
  Object_code: any = [];

  keyList: any = [];
  ValuesSelect: any = [];
  selectedValues: any = [];
  selectedkey: any = [];
  Vlength: number;

  dataSet: any = [];
  range: number = 0;
  indextoAdd: number = -1;
  keyChecked = [];
  keyValues: any = [];
  itemDataArr: any = [];
  current_page_parameter: any = {};
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService, public modalCtrl: ModalController,
    public events: Events) {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
  }

  ngOnInit() {

    this.sFilter.item_sub_type = 'M';
    if (this.itemData) {
      this.getDepData();
    } else {
      this.getrangedata();
    }

    this.events.subscribe("ClearAll", () => {
      this.clearall(this.dataSet);
    });
  }
  itemClicked(event) {
    this.emitPass.emit(this.sFilter);
  }

  onButtonGroupClick(event, val, i) {
    val.isChecked = !val.isChecked
    let clickedElement = event.target || event.srcElement;
    if (clickedElement.nodeName === "ION-BUTTON") {
      let elemClasses = (clickedElement as HTMLIonButtonElement).classList;
      let isActive = elemClasses.contains("active");
      if (isActive) {
        elemClasses.remove("active");
        elemClasses.add("inactive");
      } else {
        clickedElement.className += " active";
      }
    }
    val.clickedElement = clickedElement;
    val.index = i;

    this.indextoAdd++;
    this.ValuesSelect[this.indextoAdd] = [];
    if (this.ValuesSelect[this.indextoAdd]) {
      this.ValuesSelect[this.indextoAdd] = (val);
    }
    let datakey = [];
    let datavalue = [];

    for (let x of this.ValuesSelect) {
      if (x.isChecked) {
        datakey.push(x.key);
        datavalue.push(x.value);
      }
    }

    this.selectedkey = datakey.toString();
    this.selectedValues = datavalue.toString();
    this.sFilter.value = this.selectedkey;
    this.sFilter.codeOfValues = this.selectedValues;
  }

  clearall(dataSet) {

    for (let x of this.ValuesSelect) {
      if (x.clickedElement) {
        if (x.clickedElement.nodeName === "ION-BUTTON") {
          let elemClasses = (x.clickedElement as HTMLIonButtonElement).classList;
          let isActive = elemClasses.contains("active");
          if (isActive) {
            elemClasses.remove("active");
            elemClasses.add("inactive");
          } else {
            x.clickedElement.className += " active";
          }
        }
      }
      if (x.isChecked) {
        x.isChecked = false;
      }
    }
    this.sFilter.value = "";
    this.sFilter.codeOfValues = "";
    this.ValuesSelect = [];
    this.indextoAdd = -1;
    this.range = 10;
    if (this.range > this.Vlength) {
      this.range = this.Vlength;
    }
    if (this.itemDataArr.length > 0) {
      let globArr = this.globalObjects.dependFilterData;
      let globKey = globArr.find(k => k.key == this.itemDataArr[0].key);
      if (globKey) {
        delete globKey.query;
        delete globKey.event;
      }
      this.getDepData();
    }

    this.callAfterclearall(this.dataSet);


  }
  getrangedata() {
    let wsdp = [];
    if (this.sFilter.item_enable_flag && (!(this.sFilter.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.sFilter.item_enable_flag == 'F'))) {
      return false;
    } else {

      let col = {};
      if (this.parentComponent.frame.tableRows) {
        for (let tableData of this.parentComponent.frame.tableRows[0]) {
          for (let itemGroup of tableData) {
            if(itemGroup){
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.codeOfValues) {
                    col[item.apps_item_seqid] = item.codeOfValues
                  } else {
                    col[item.apps_item_seqid] = item.value
                  }
                }
              }else{
                
                  if (itemGroup.codeOfValues) {
                    col[itemGroup.apps_item_seqid] = itemGroup.codeOfValues
                  } else {
                    col[itemGroup.apps_item_seqid] = itemGroup.value
                  }
              }
            }
          }
        }
      } else {
        for (let itemGroup of this.parentComponent.frame.Level4) {
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
    }
    this.getPageInfo(wsdp)
  }



  getPageInfo(wsdp) {
    this.globalObjects.showLoading();
    this.wscp.service_type = "get_lov_data";
    this.wscp.apps_page_no = this.sFilter.apps_page_no;
    this.wscp.apps_page_frame_seqid = this.sFilter.apps_page_frame_seqid;
    this.wscp.apps_item_seqid = this.sFilter.apps_item_seqid;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.userDetails["object_code"] = this.sFilter.object_code;
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": this.wscp,
      "wsdp": wsdp
    }
    this.dataService.postData("S2U", reqData).then(res => {
      this.globalObjects.hideLoading();
      let data: any = res;

      this.callAfterclearall(data);
    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("4 Something went wrong please try again later!");
    })
  }
  callAfterclearall(data) {
    this.dataSet = data;
    if (this.dataSet.responseStatus == "success") {
      this.Vlength = this.dataSet.responseData.Values.length;
      this.range = 10;
      if (this.range > this.Vlength) {
        this.range = this.Vlength
      }
      let meatadata = this.dataSet.responseData.Values;
      let indexx = 1;
      for (let x of meatadata) {
        if (x[1] != null && x[0] != null) {
          this.map.set(x[1], x[0]);
          indexx++;
        }
      }
      this.object_arr = data.responseData;
      let objData = this.globalObjects.setPageInfo(data.responseData);
      this.objectList = objData.Level1;
    }


  }

  increaseRange() {
    let globArr = this.globalObjects.dependFilterData;
    let globKey = globArr.find(k => k.key == this.itemDataArr[0].key);

    if (globKey && globKey.range) {
      this.range = globKey.range;
    } else {
      this.range = 10 + this.range;
    }
    if (this.range > this.Vlength) {
      this.range = this.Vlength
    }

  }



  async openLov() {
    var data = { message: 'hello world' };
    // if (this.lovinput.item_enable_flag == '') {
    if (this.sFilter.item_enable_flag && (!(this.sFilter.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.sFilter.item_enable_flag == 'F'))) {
      return false;
    } else {
      let wsdp = [];
      let col = {};
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
      wsdp.push(col);
      // console.log(wsdp)

      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: SingleSelectLovPage,
          componentProps: { paramValue: this.sFilter, wsdp: wsdp, prompt_name: this.sFilter.prompt_name, wscp: this.wscp }
        });
      modal.onDidDismiss().then((detail: OverlayEventDetail) => {
        if (detail) {
          // console.log('The result:', detail.data);
          if (detail.data.codeOfValues) {
            this.sFilter.codeOfValues = detail.data.codeOfValues;
          }
          if (detail.data.value) {
            this.sFilter.value = detail.data.value;
          }
        }
      });
      await modal.present();
    }

  }

  getDepData() {

    let itemfilterData = JSON.parse(JSON.stringify(this.itemData))
    let mainData = [];
    for (let x of itemfilterData) {
      for (let y of x) {
        if (y.Level5[0].item_name == this.sFilter.item_name && y.Level5[0].value) {
          let dataObj = {
            key: y.Level5[0].item_name,
            value: y.Level5[0].value
          }
          mainData.push(dataObj);
        }
      }
    }
    let finalList = [];
    mainData.forEach(m => {
      if (!finalList.find(f => m.value == f.value)) {
        finalList.push(m);
      }
      this.itemDataArr = finalList;
    })

    let globArr = this.globalObjects.dependFilterData;
    let globKey = globArr.find(k => k.key == this.itemDataArr[0].key);
    if (globKey) {
      if (globKey.itemValue) {
        this.itemDataArr = globKey.itemValue;
      }
      if (globKey.event) {
        this.sFilter.query = globKey.query;
        this.sFilter.value = globKey.value;
        this.sFilter.codeOfValues = globKey.codeOfValues;

        globKey.event.forEach(a => {
          let clickVal = this.itemDataArr.find(c => a.value == c.value);
          if (clickVal) {
            clickVal.clickedElement = a.clickedElement;
            clickVal.isChecked = a.isChecked;
            this.ValuesSelect.push(clickVal);
          }
        })

      }
    }

    this.Vlength = this.itemDataArr.length;
    this.increaseRange();
  }

  onSelect(event, val, i) {
    let valSelect = this.ValuesSelect.find(x => x.value == val.value);
    if (!valSelect) {
      val.isChecked = !val.isChecked
      let clickedElement = event.target || event.srcElement;
      if (clickedElement.nodeName === "ION-BUTTON") {
        let elemClasses = (clickedElement as HTMLIonButtonElement).classList;
        let isActive = elemClasses.contains("active");
        if (isActive) {
          elemClasses.remove("active");
          elemClasses.add("inactive");
        } else {
          clickedElement.className += " active";
        }
      }
      val.clickedElement = clickedElement;
      val.index = i;
      this.ValuesSelect.push(val);
    } else {
      valSelect.isChecked = !valSelect.isChecked;
    }


    let dataObjValues: any = {}
    let dataObjArr = [];
    //  this.keyChecked = [];
    let datakey = [];
    let datavalue = [];
    for (let x of this.ValuesSelect) {
      if (x.isChecked) {
        datakey.push(x.value);
        datavalue.push(x.value);
        this.keyChecked.push(x)
        if (dataObjValues.query) {
          dataObjValues.query += "|| a." + x.key + " == '" + x.value + "'";
        } else {


          dataObjValues.query = "a." + x.key + " == '" + x.value + "'";
        }
      }
    }
    this.selectedkey = datakey.toString();
    this.selectedValues = datavalue.toString();
    this.sFilter.value = this.selectedkey;
    this.sFilter.codeOfValues = this.selectedValues;
    this.sFilter.query = dataObjValues.query;

    let globArr = this.globalObjects.dependFilterData;
    let globKey = globArr.find(a => a.key == this.ValuesSelect[0].key);

    globArr.forEach(g => {
      if (g.key != val.key) {
        delete g.itemValue;
      }
    })

    if (globKey) {
      globKey.range = this.range;
      globKey.itemValue = this.itemDataArr;
      globKey.query = this.sFilter.query;
      globKey.event = this.keyChecked;
      globKey.value = this.sFilter.value;
      globKey.codeOfValues = this.sFilter.codeOfValues;
    } else {
      let obj = {
        key: this.ValuesSelect[0].key,
        itemValue: this.itemDataArr,
        query: this.sFilter.query,
        event: this.keyChecked,
        value: this.sFilter.value,
        codeOfValues: this.sFilter.codeOfValues,
        range: this.range
      }
      globArr.push(obj);
    }
    this.emitfilterParam.emit();
  }
}
