import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Device } from '@ionic-native/device/ngx';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { BackgroundService } from 'src/app/services/background.service';
import { globalAgent } from 'http';
import { LhsLibService } from 'src/app/services/lhs-lib.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {
  @Input() item: any;
  @Input() frame_type: any;
  @Input() wscp: any;
  @Input() change_item_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() LHSOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnBlur: EventEmitter<any> = new EventEmitter<any>();

  @Input() itemData: any;
  @Output() emitfilterParam: EventEmitter<any> = new EventEmitter<any>();

  parentComponent;
  userDetails: any;
  location_name: any;

  constructor(private globalobject: GlobalObjectsService, private device: Device,
    private viewContainerRef: ViewContainerRef, private batteryStatus: BatteryStatus, private backgroundservices: BackgroundService,private lhsLib : LhsLibService) {
    this.userDetails = this.globalobject.getLocallData("userDetails");
  }

  getParentComponent() {
    this.parentComponent = this.viewContainerRef['_data'].componentView.component.viewContainerRef['_view'].component;
  }

  fiteredData(filterParam) {
    this.emitfilterParam.emit(filterParam);
  }

  ngOnInit() {

    if (this.item) {

     
      //  console.log(this.itemData);
      //   if (this.item.item_type == "DD") {
      //    this.item.item_type="L";
      //    this.item.item_sub_type="L_DD";
      //  } 
      if (this.item.item_type == "TEXT-BAND4-3D") {
        this.globalobject.colorcount = this.globalobject.colorcount + 1;
        if (this.globalobject.colorcount > 4) {
          this.globalobject.colorcount = 1;
        }
      }

      if (this.item.item_type == "SUMMARY-CARD") {
        this.globalobject.countforsummarycard = this.globalobject.countforsummarycard + 1;
        if (this.globalobject.countforsummarycard > 4) {
          this.globalobject.countforsummarycard = 1;
        }
      }
      if (this.change_item_type) {
        if (this.change_item_type = 'item_filter_flag') {
          this.item.item_type = this.item.item_filter_flag;
        }
      }

      this.getParentComponent();
      if (this.item.display_setting_str) {
        if (typeof (this.item.display_setting_str) === 'string') {
          try {
            this.item.display_setting_str = JSON.parse(this.item.display_setting_str);
          } catch (e) {
            this.globalobject.presentAlert("Error in display_setting_str format...");
          }
        }
      }

      if (this.item.item_default_value) {
        for (let x in this.userDetails) {
          if (this.item.item_default_value.toUpperCase() == x.toUpperCase()) {
            this.item.value = this.userDetails[x];
          }
        }

        var date = new Date();
        // if (this.item.item_type == "T") {
        if (this.item.item_default_value == "USER_CODE") {
          this.item.value = this.userDetails.user_code;
          // if (this.userDetails.login_user_flag == 'P') {
          //   this.item.value = "USER_PRT";
          // }
          // if (this.userDetails.login_user_flag == 'R') {
          //   this.item.value = "USER_DLR";
          // } else if (this.userDetails.login_user_flag == 'E') {
          //   this.item.value = this.userDetails.user_code;
          // }
        } else if (this.item.item_default_value == "LOGIN_ACC_CODE") {
          this.item.value = this.userDetails.login_acc_code;
        } else if (this.item.item_default_value == "LOGIN_ACC_NAME") {
          this.item.value = this.userDetails.login_acc_name;
        } else if (this.item.item_default_value == "DEVICE_ID") {
          if (this.device.uuid) {
            this.item.value = this.device.uuid;
          } else {
            this.item.value = "";
          }
        }
        else if (this.item.item_default_value == "ACC_YEAR") {
          this.item.value = this.userDetails.acc_year;
        } else if (this.item.item_default_value == "EMP_CODE") {
          this.item.value = this.userDetails.emp_code;
        } else if (this.item.item_default_value == "ENTITY_CODE") {
          this.item.value = this.userDetails.entity_code;
        } else if (this.item.item_default_value == "DIV_CODE") {
          this.item.value = this.userDetails.div_code;
        } else if (this.item.item_default_value == "PLSQL_L") {
          this.item.value = sessionStorage.getItem("PLSQL_L");
        } else if (this.item.item_default_value == "GEO_ORG_CODE") {
          this.item.value = this.userDetails.geo_org_code;
          // } else if (this.item.item_default_value == "DIV_CODE") {
          //   this.item.value = this.userDetails.division
        } else if (this.item.item_default_value == "LATITUDE") {
          this.item.value = this.globalobject.latitude;
        } else if (this.item.item_default_value == "LONGITUDE") {
          this.item.value = this.globalobject.longitude;
        } else if (this.item.item_default_value == "LOCATION") {

          this.globalobject
            .geoCoderLocation(this.globalobject.latitude, this.globalobject.longitude)
            .then(res => {
              this.item.value = res;
            }, (error) => {
              // alert(JSON.stringify(error))
            });

        } else if (this.item.item_default_value == "SYSDATE") {
          let val: any;
          /* if (this.item.item_visible_flag == "T") { */
          // this.item.value = ("0" + date.getDate()).slice(-2)+ "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getFullYear();
          let valD = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
            ("0" + date.getDate()).slice(-2);
          this.item.value = this.globalobject.formatDate(valD, 'dd-MMM-yyyy');
          ///  this.item.value = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
          /*  }
           if (this.item.item_visible_flag == "F") {
             this.item.value = ("0" + date.getDate()).slice(-2) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getFullYear();
           } */


        } else if (this.item.item_default_value == "SYSTIME") {
          this.item.value = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
        } else if (this.item.item_default_value == "INDEX") {

        } else if (this.item.item_default_value == "SYSDATETIME") {
          let valDT = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
            ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
          this.item.value = this.globalobject.formatDate(valDT, "dd-MMM-yyyy HH:mm:ss");
        } else if (this.item.item_default_value == "BATTERY_STATUS") {
          const subscription = this.batteryStatus.onChange().subscribe(status => {
          this.item.value = status.level;
          });
          subscription.unsubscribe();
        }
        else {
          if (this.item.value) {
            /*null;*/
          } else {
            if (this.item.item_default_value.charAt(0) == 'G' && this.item.item_default_value.charAt(1) == '_') {
              this.item.value = '';
            } else {
              this.item.value = this.item.item_default_value;
            }
          }
        }
      }
    }

    if (this.globalobject.callingPara.length > 0) {
      for (let glob of this.globalobject.callingPara) {
        if (this.parentComponent.wscp_send_input && this.parentComponent.wscp_send_input.apps_item_seqid && 
          ((glob.objectCode == this.item.apps_page_frame_seqid.split("-")[0]) && 
          ((glob.itemCode == this.parentComponent.wscp_send_input.apps_item_seqid) || 
          (glob.itemCode == this.parentComponent.wscp_send_input.orignal_apps_item_seqid)) && !glob.rowIndex)) {
          for (let c of glob.itmData) {
            if (c.indexOf(":=") > -1) {
              let itmName = c.split(':=');
              if (itmName[0].indexOf(".") > -1) {
                if (itmName[0].split(".")[1].toLowerCase() == this.item.item_name.toLowerCase()) {
                  this.item.value = itmName[1];
                }
              } else {
                if (itmName[0].toLowerCase() == this.item.item_name.toLowerCase()) {
                  this.item.value = itmName[1];
                }
              }
            }
          }
        }
      }
    }

    if (this.globalobject.newFormInstanceArr.length > 0) {
      let glob = this.globalobject.newFormInstanceArr.find(x => x.objCode == this.parentComponent.frame.object_code);

      if (glob && glob.newInst[this.item.item_name.toLowerCase()]) {
        this.item.value = glob.newInst[this.item.item_name.toLowerCase()];
      }
    }


    if(this.item){
       if(this.item.mirror_item_seqid){
        let val = this.lhsLib.get_item_value(this.item.mirror_item_seqid,this.item.indexcount);
        this.item.value = val;
      }
    }

  

  }

  itemClicked(event) {
    this.emitPass.emit(event);
  }

  itemValueChange(event) {
    this.LHSOnChange.emit(event);
  }

  model = [
    {
      name: 'Folder1',
      isSelect: true,
      children: [
        {
          name: 'Item1',
          isSelect: true,
          children: [
            {
              name: 'Child1',
            },
            {
              name: 'Child2',
              isSelect: false,
              children: [
                {
                  name: 'Child1',
                },
                {
                  name: 'Child2',
                }
              ]
            }
          ]
        },
        {
          name: 'Item2',
        }
      ]
    }, {
      name: 'Folder2',
      isSelect: true,
      children: [
        {
          name: 'Item1',
        },
        {
          name: 'Item2',
        }
      ]
    }, {
      name: 'Folder3',
      children: [
        {
          name: 'Item1',
        },
        {
          name: 'Item2',
        }
      ]
    }, {
      name: 'Folder4',
      children: [
        {
          name: 'Item1',
        },
        {
          name: 'Item2',
        }
      ]
    }, {
      name: 'Folder5',
      children: [
        {
          name: 'Item1',
        },
        {
          name: 'Item2.PDF',
        }
      ]
    }, {
      name: 'Folder6',
    }
  ];

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

  openItemEditPage(itm) {
    let item = JSON.parse(JSON.stringify(itm));
    item.click_events_str = "devEditItem";
    this.globalobject.devItemIcon = item.apps_item_seqid + "#" + item.apps_icon_name;
    this.globalobject.devItemEditFlag = false;
    this.emitPass.emit(item);
  }

  ionViewWillLeave() {
    // this.modalCtrl.dismiss();
  }

  itemOnBlur(item) {
    if (item.on_blur) {
      this.emitOnBlur.emit(item);
    }
  }


  getPosition(ev) {
    this.globalobject.mouseEvent = ev;
  }

  onRightClickgetPosition(ev) {
    this.globalobject.mouseEvent = ev;
    ev.preventDefault();
  }
}