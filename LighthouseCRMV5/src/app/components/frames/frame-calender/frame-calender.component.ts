import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
import { ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/demo-utils/event/events';
@Component({
  selector: 'app-frame-calender',
  templateUrl: './frame-calender.component.html',
  styleUrls: ['./frame-calender.component.scss'],
})
export class FrameCalenderComponent implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  filterFormData: any = [];
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  item_slno_count: number = 1;
  userDetails: any;
  current_page_parameter: any = {};
  collapseCard: boolean = false;
  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
  minDate = new Date().toISOString();
  eventSource = [];
  viewTitle = [];
  eventarray = [];
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
  
  
  constructor(private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string,
    private globalObjects: GlobalObjectsService, private dataService: DataService, public events: Events, ) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.events.subscribe("reloadCal",() => {
      this.ngOnInit();
    })
    this.events.subscribe("runcalender", () => {
      this.ngOnInit();
    //  this.addEvent();
    })
  }
  ngOnInit() {
    this.getData();
    
    console.log("this.frme calender console", this.frame);
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    this.event.startTime = ""


    let frameFilterFlag = this.frame.frame_filter_flag;

    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }


        console.log(itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        )
        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        ) { } else {
          theaddata.push(itemMast.prompt_name);
        }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }

    }

    // this.paginate(1);
  }
  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }

  // Create the right event format and reload source
  addEvent() {
  console.log("This is new date",new Date());
    let eventCopy = {
      title: this.event.title,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc
    }

    for (let x of this.frame.tableRows) {
      for (let y of x) {
        if (y.Level5[0].item_name == "TASK_DATE") {
          this.event.endTime = y.Level5[0].value;  
        }
        if (y.Level5[0].item_name == "ENTRY_DATE") {
          this.event.startTime = y.Level5[0].value;
        }
        if (y.Level5[0].item_name == "TASK_CATG") {
          this.event.desc = y.Level5[0].value
          eventCopy.desc = y.Level5[0].value;
        }
        if (y.Level5[0].item_name == "TASK_TYPE") {
          this.event.title = y.Level5[0].value
          eventCopy.title = y.Level5[0].value;
        }
      }

    }
    eventCopy = {
      title: this.event.title,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc
    }
    console.log("This is event date",eventCopy.startTime);
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;

      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }

    this.eventSource.push(eventCopy);
    console.log("this.eventSource in calender",this.eventSource);
    this.myCal.loadEvents();
    // this.resetEvent();
  }
  // next() {
  //   var swiper = document.querySelector('.swiper-container')['swiper'];
  //   swiper.slideNext();
  // }

  // back() {
  //   var swiper = document.querySelector('.swiper-container')['swiper'];
  //   swiper.slidePrev();
  // }

  // Change between month/week/day
  changeMode(mode) {
    console.log(mode)
    this.calendar.mode = mode;
  }

  // Focus today
  today() {
    this.calendar.currentDate = new Date();

  }
  onchange(event){
    this.calendar.currentDate = new Date(event);
  }
  clickevent(){
    // this.onViewTitleChanged()
  }
  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    console.log("onViewTitleChanged" + title);
    this.viewTitle = title;
  }
  
  async onEventSelected(event) {
    console.log("onEventSelected", event);
    this.eventarray.push(event);

    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  // Time slot was clicked
  onTimeSelected(ev) {
    console.log("onTimeSelected", ev);
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }




  getData() {
    let wscp: any = {};
    //wscp.service_type = "get_populate_data";
    // if (this.frame.on_frame_load_str) {
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    // wscp.item_sub_type = this.wscp_send_input.item_sub_type;

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      this.globalObjects.hideLoading();
      let data: any = res;
      if (data.responseStatus == "success") {
        let tableRows = [];
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        let tableKey = Object.keys(tableData[0])

        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  item.value = table[key]
                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }
        this.frame.tableRows = tableRows;
       this.getframeevent();
    
    console.log("tabledata event source",this.eventSource)
  }
    
    }).catch(err => {
      console.log("this.frame canvas err");

      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
      console.log(err);
    })
  
  }

  getframeevent(){

   
      let framearray=[];
      framearray=this.frame.tableRows;
     this.eventSource=[];
      let eventCopy1 = {
        title: '',
        startTime: '',
        endTime: '',
        allDay: this.event.allDay,
        desc: ''
      }
      
      for (let x of framearray) {
        for (let y of x) {  
          if (y.Level5[0].item_name == "TASK_DATE") {
          eventCopy1.endTime = y.Level5[0].value;  
          }
          if (y.Level5[0].item_name == "ENTRY_DATE") {
          eventCopy1.startTime = y.Level5[0].value;
          }
          if (y.Level5[0].item_name == "TASK_CATG") {
            // this.event.desc = y.Level5[0].value
            eventCopy1.desc = y.Level5[0].value;
          }
          if (y.Level5[0].item_name == "TASK_TYPE") {
            // this.event.title = y.Level5[0].value
            eventCopy1.title = y.Level5[0].value;
          }
          
        }

      let  eventCopy = {
          title: eventCopy1.title,
          startTime: new Date(eventCopy1.startTime),
          endTime: new Date(eventCopy1.endTime),
          allDay: eventCopy1.allDay,
          desc: eventCopy1.desc
        }
          this.eventSource.push(eventCopy);
          // console.log("eventcopy...>>>>>>",eventCopy)
      }
    this.myCal.loadEvents();
   
  }


  PostTextValidatePlsql(event, rowindex) {

    let wscp: any = {};
    wscp.service_type = "PostTextValidatePlsql";
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
    wscp.apps_item_seqid = event.apps_item_seqid;
    wscp.apps_page_no = event.apps_page_no;
    wscp.object_code = event.object_code;

    var inputData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": event.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, inputData).then(res => {
      this.globalObjects.hideLoading();
      let data: any = res;
      console.log(data)

      if (data.responseStatus == "success") {
        // console.log(data.responseData.Values[0][0] + data.responseData.Values[0][1]);
        // console.log(event.wsdp);
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let keyValue = data.responseData;
        if (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q") {
          if (objData.Level1[0].message) {
            alert(objData.Level1[0].message);
          }
          this.globalObjects.clickedbutton = false;
          for (let itemGroup of this.frame.tableRows[rowindex]) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                if (objData.Level1[0].item_name == item.item_name) {
                  item.value = "";
                  item.codeOfValues = "";
                }
              }
            }
          }
        } else if (objData.Level1[0].status == "L") {
          sessionStorage.setItem("PLSQL_L", objData.Level1[0].message);
        } else if (objData.Level1[0].status == "T") {
        } else {
          objData.Level1[0].status = "Q";
          // alert(objData.Level1[0].message);
          this.globalObjects.clickedbutton = false;
          // for (let itemGroup of this.frame.tableRows[rowindex]) {
          //   if (itemGroup.Level5) {
          //     for (let item of itemGroup.Level5) {
          //       if (objData.Level1[0].item_name == item.item_name) {
          //         item.value = "";
          //         item.codeOfValues = "";

          //       }
          //     }
          //   }
          // }
        }
      }

    }).catch(err => {
      console.log("this.frame canvas err");

      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("1.7 Something went wrong please try again later!");
      console.log(err);
    })

  }
  // itemClicked(event, rowindex) {
  //   // console.log("itemClicked " + rowindex);
  //   console.log("itemClicked " + JSON.stringify(event));
  //   this.PostTextValidatePlsql(event, rowindex).then(res => {
  //     if (res == "success") {
  //       this.itemClicked1(event, rowindex);
  //     }
  //   })
  // }

  // itemClicked(event, rowindex) {
  //   alert("it enters");
  //   let isValid = true;
  //   if (event.click_events_str.indexOf("addItem") > -1) {
  //     let frameLevel4 = JSON.parse(JSON.stringify(this.frame.tableRows[rowindex]))
  //     for (let itemGroup of frameLevel4) {
  //       if (itemGroup.Level5) {
  //         for (let item of itemGroup.Level5) {
  //           let temp = item.design_control_type;
  //           item.design_control_type = item.design_control_type_auto_card;
  //           item.design_control_type_auto_card = temp;

  //           temp = item.display_setting_str;
  //           item.display_setting_str = item.display_setting_str_auto_card;
  //           item.display_setting_str_auto_card = temp;

  //           temp = item.item_visible_flag;
  //           item.item_visible_flag = item.flag_auto_card;
  //           item.flag_auto_card = temp;

  //           item.temp_item_type = item.item_type

  //           if (item.item_type != "BT") {
  //             item.item_type = "TEXT";
  //           }
  //           if (item.item_name == "SLNO") {
  //             item.value = this.item_slno_count;
  //             this.item_slno_count = this.item_slno_count + 1;
  //           }
  //           if (item.isValid !== undefined && !item.isValid) {
  //             isValid = item.isValid;
  //           }
  //           // console.log();
  //         }
  //       }
  //     }

  //     let checkValidFrame = false;
  //     if (event.click_events_str.indexOf("checkValidFrame") > -1) {
  //       let arr = event.click_events_str.split("#");
  //       let frmseq = arr[event.click_events_str.indexOf("checkValidFrame")].split("~")[1];
  //       if (this.frame.apps_page_frame_seqid == frmseq) {
  //         checkValidFrame = true;
  //       }
  //     }

  //     if (checkValidFrame && !isValid) {
  //       for (let itemGroup of this.frame.tableRows[rowindex]) {
  //         if (itemGroup.Level5) {
  //           for (let item of itemGroup.Level5) {
  //             if (item.isValid !== undefined && !item.isValid) {
  //               item.touched = true;
  //             }
  //           }
  //         }
  //       }
  //       this.globalObjects.clickedbutton = false;
  //       alert("Please correct all the errors and enter valid input")
  //     } else {
  //       if (event.click_events_str.indexOf("checkValidFrame") > -1) {
  //         let arr = event.click_events_str.split("#");
  //         arr.splice([event.click_events_str.indexOf("checkValidFrame")], 1);
  //         event.click_events_str = arr.join("#");
  //       }
  //       this.frame.tableRows[rowindex] = JSON.parse(JSON.stringify(this.frame.Level4))
  //       event.ADD_ITEM = frameLevel4;
  //       this.emitPass.emit(event);
  //     }
  //   } else {
  //     event.wsdp = [];
  //     if (this.frame.tableRows) {
  //       for (let framedata of this.frame.tableRows) {
  //         let col = {};
  //         for (let itemGroup of framedata) {
  //           if (itemGroup.Level5) {
  //             for (let item of itemGroup.Level5) {
  //               let value;
  //               if (item.codeOfValues) {
  //                 value = item.codeOfValues
  //               } else {
  //                 value = item.value
  //               }
  //               col[item.apps_item_seqid] = value;
  //               if (item.session_hold_flag == 'T') {
  //                 if (this.sessionObj) {
  //                   this.sessionObj[item.item_name] = value
  //                 } else {
  //                   this.sessionObj = {};
  //                   this.sessionObj[item.item_name] = value
  //                 }
  //               }
  //               if (item.isValid !== undefined && !item.isValid) {
  //                 isValid = item.isValid;
  //               }
  //             }
  //           }
  //         }
  //         event.sessionObj = this.sessionObj
  //         event.wsdp.push(col);
  //       }
  //       //--------------------------
  //       if (this.frame.tableRows.length > 1) {
  //         let wsdpcl = {};
  //         for (let itemGroup of this.frame.tableRows[rowindex]) {
  //           if (itemGroup.Level5) {
  //             for (let item of itemGroup.Level5) {
  //               if (item.codeOfValues) {
  //                 wsdpcl[item.apps_item_seqid] = item.codeOfValues
  //               } else {
  //                 wsdpcl[item.apps_item_seqid] = item.value
  //               }
  //             }
  //           }
  //         }
  //         event.wsdpcl = [];
  //         event.wsdpcl.push(wsdpcl);
  //       }
  //       //--------------------------
  //     } else {
  //       let col = {};
  //       for (let itemGroup of this.frame.Level4) {
  //         if (itemGroup.Level5) {
  //           for (let item of itemGroup.Level5) {
  //             if (item.codeOfValues) {
  //               col[item.apps_item_seqid] = item.codeOfValues
  //             } else {
  //               col[item.apps_item_seqid] = item.value
  //             }
  //             if (item.isValid !== undefined && !item.isValid) {
  //               isValid = item.isValid
  //             }
  //           }
  //         }
  //       }
  //       event.wsdp.push(col);
  //     }

  //     let checkValidFrame = false;
  //     if (event.click_events_str.indexOf("checkValidFrame") > -1) {
  //       let arr = event.click_events_str.split("#");
  //       let frmseq = arr[event.click_events_str.indexOf("checkValidFrame")].split("~")[1];
  //       if (this.frame.apps_page_frame_seqid == frmseq) {
  //         checkValidFrame = true;
  //       }
  //     }

  //     if (checkValidFrame && !isValid) {
  //       for (let itemGroup of this.frame.tableRows[rowindex]) {
  //         if (itemGroup.Level5) {
  //           for (let item of itemGroup.Level5) {
  //             if (item.isValid !== undefined && !item.isValid) {
  //               item.touched = true;
  //             }
  //           }
  //         }
  //       }
  //       this.globalObjects.clickedbutton = false;
  //       alert("Please correct all the errors and enter valid input")
  //     } else {
  //       this.emitPass.emit(event);
  //     }
  //   }

  // }

  onSubmit(form) {
    this.globalObjects.presentAlert(form.form.valid)
  }

}
