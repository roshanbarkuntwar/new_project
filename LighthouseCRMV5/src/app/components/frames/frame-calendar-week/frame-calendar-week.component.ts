import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { colors } from 'src/app/demo-utils/colors';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-frame-calendar-week',
  templateUrl: './frame-calendar-week.component.html',
  styleUrls: ['./frame-calendar-week.component.scss'],
})
export class FrameCalendarWeekComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  view: string = 'month';
  calenderData: any = [];
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  eventss:any = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      // actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      // actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      // actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ]
  actions: CalendarEventAction[] = [
    {
      label: '<img height="22px"  padding-left="10px" src="./../assets/imgs/edit.png">',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<img height="22px"  padding-left="10px" src="./../assets/imgs/delete.png">',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.eventss = this.eventss.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];


  modalData: {
    action: string;
    event: CalendarEvent;
  };
  elevants: any = [];
  developerModeData: any;
  userDetails: any;
  activeDayIsOpen: boolean = true;
  constructor(public globalservice: GlobalObjectsService, private dataService: DataService) { 
    this.userDetails = this.globalservice.getLocallData("userDetails");
  }

  ngOnInit() {
    console.log(subDays(startOfDay(new Date()), 1));
    console.log( addDays(new Date(), 1),);
    console.log(addHours(new Date(), 2));
    this.getData();
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
 
  getData() {
    let wscp: any = {};
    
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;


    //wscp.service_type = "get_populate_data";
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    // wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;



    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {

      this.globalservice.hideLoading();
      let data: any = res;
      this.calenderData = [];
      this.elevants = [];
      console.log("data response", data.responseStatus)
      if (data.responseStatus == "success") {
 // Developer Mode Loging
 if (data.responseData.Level1_Keys.length > 0) {
  let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
  let wsSewId = id ? data.responseData.Values[0][id] : "";
  this.developerModeData = {
    ws_seq_id: wsSewId,
    frame_seq_id: reqData.wscp.apps_page_frame_seqid
  };
}
//Developer Mode Loging





        let trows = [];
        let objData = this.globalservice.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        let tableKey = Object.keys(tableData[0])

        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
          // this.elevants = frameLevel4[0].apps_page_frame_seqid;
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  item.value = table[key]
                }
              }
            }
          }
          trows.push(frameLevel4);
        }
        this.calenderData = trows;
        this.frame.tableRows = trows;
        this.frame.object_code = "";
        console.log(" this.frame.tableRows", this.calenderData)
        for (let datedesc of this.calenderData) {
          let objevent: any =  {
            start:0,
            end: 0,
            title: '',
            color: colors.yellow,
            actions:this.actions,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,
          }
          let datedesccopy= JSON.parse(JSON.stringify(datedesc));
          for (let objectOfdate of datedesccopy) {
            //  console.log(objectOfdate.Level5[0])
            if (objectOfdate.Level5[0].item_name == 'START_DATE') {
              let da = startOfDay(new Date(objectOfdate.Level5[0].value));
              objevent.start =da;
            }
            if (objectOfdate.Level5[0].item_name == 'END_DATE') {
              let da2 = endOfDay(new Date(objectOfdate.Level5[0].value));
              objevent.end =da2;
            }

            if (objectOfdate.Level5[0].item_name == 'TITLE') {
              objevent['title'] = objectOfdate.Level5[0].value;
            }
            // if (objectOfdate.Level5[0].item_name == 'ROWNUMBER') {
            //   objevent['rownumid'] = objectOfdate.Level5[0].value;
            // }
            // if(objectOfdate.Level5[0].item_name=='COLOR'){
            //   objevent['color']='task-not-so-imp';
            // }
            // objevent['color'] = 'task-not-so-imp';
           
          }   
          objevent['lhsitem']=datedesccopy;
             this.elevants.push(objevent);
          //  console.log(this.events)
          //   "fromdate": "26-Dec-2020",
          //   "todate": "26-Dec-2020",
          //   "todate": "Evwnt1",
          //   "todatetodatetodatetodate": "task-low"
          // }
        }
       

      }
      console.log(this.eventss)
      console.log(this.elevants)

    }).catch(err => {
      console.log("this.frame canvas err");

      this.globalservice.hideLoading();
      this.globalservice.presentToast("1.5 Something went wrong please try again later!");
      console.log(err);
    })

  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }
  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    if(action=='Clicked'){
      let framerows=event['lhsitem'];
      for(let rows of framerows){
        if(rows.Level5[0].item_name=='TITLE'){
          this.emitPass.emit(rows.Level5[0]);
          break;
        }
      }

    }
    if(action=='Edited'){
      
    }
    if(action=='Deleted'){
      
    }
    console.log(event);
  //  alert(JSON.stringify(this.modalData))
  }



}
