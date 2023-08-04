import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { DomElementSchemaRegistry } from '@angular/compiler';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-frame-calender-month',
  templateUrl: './frame-calender-month.component.html',
  styleUrls: ['./frame-calender-month.component.scss'],
})
export class FrameCalenderMonthComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("monthAndYear") monthAndYear: ElementRef;
  yeardordropdown = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2034', '2035', '2036', '2037', '2038', '2039', '2040'];
  monthdordropdown = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  year: any;
  month: any;
  userDetails: any;
  calenderData: any = [];
  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  selectYear: any = document.getElementById("year");
  selectMonth: any = document.getElementById("month");
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  currentMonth1: string;
  currentYear1: string = '2021';
  eventOFData: any = [];
  events: any = [];
  developerModeData: any;
  eventss: any = [
    {
      "fromdate": "26-Dec-2020",
      "todate": "26-Dec-2020",
      "event": "Evwnt1",
      "color": "task-low"
    },
    {
      "fromdate": "04-Dec-2020",
      "todate": "07-Dec-2021",
      "event": "Team Meeting",
      "color": "booked-activity"
    },
    {
      "fromdate": "07-Nov-2020",
      "todate": "07-Nov-2020",
      "event": "Evwnt2",
      "color": "task-not-so-imp"
    },
    {
      "fromdate": "21-Dec-2020",
      "todate": "28-Dec-2020",
      "event": "Europe Tour",
      "color": "booked-activity"
    },
    {
      "fromdate": "23-Dec-2020",
      "todate": "23-Dec-2020",
      "event": "hello4",
      "color": "task-urgent"
    }
    , {
      "fromdate": "20-Dec-2020",
      "todate": "20-Dec-2020",
      "event": "Do Yoga",
      "color": "task-urgent"
    }
    , {
      "fromdate": "20-Dec-2020",
      "todate": "20-Dec-2020",
      "event": "WorkOut",
      "color": "task-primary"
    },
    {
      "fromdate": "25-Dec-2020",
      "todate": "27-Dec-2020",
      "event": "event7",
      "color": "task-primary"
    },
    {
      "fromdate": "27-Jan-2021",
      "todate": "28-Jan-2021",
      "event": "Evwnt8",
      "color": "task-low"
    },
    {
      "fromdate": "09-Jan-2021",
      "todate": "09-Jan-2021",
      "event": "Evwnt9",
      "color": "task-primary"
    },
    {
      "fromdate": "03-Jan-2021",
      "todate": "04-Jan-2021",
      "event": "Evwnt10",
      "color": "task-not-so-imp"
    },
  ]
  cal_id: any;
  //monthAndYear:any = document.getElementById("monthAndYear");

  constructor(public globalservice: GlobalObjectsService, private dataService: DataService,public modalController:ModalController) {
    this.userDetails = this.globalservice.getLocallData("userDetails");
  }

  ngOnInit() {
    let finddatefordd = new Date();
    this.currentYear1 = JSON.stringify(finddatefordd.getFullYear());
    this.currentMonth1 = finddatefordd.toLocaleString("default", { month: "short" });
    console.log(this.currentMonth1);
    console.log(this.eventss);
    this.getData("", "");
    // this.showCalendar(this.currentMonth, this.currentYear);

  }
  getData(startdate, enddate) {
    let wscp: any = {};
    if (startdate || enddate) {
      wscp.cal_start_date = startdate;
      wscp.cal_end_date = enddate;
    }
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
      this.events = [];
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
          this.cal_id = frameLevel4[0].apps_page_frame_seqid;
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
          let objevent: any = {}
          for (let objectOfdate of datedesc) {
            //  console.log(objectOfdate.Level5[0])
            if (objectOfdate.Level5[0].item_name == 'START_DATE') {

              let da = this.globalservice.formatDate(objectOfdate.Level5[0].value, 'dd-MMM-yyyy')
              //  console.log(da)
              objevent['fromdate'] = da;
            }
            if (objectOfdate.Level5[0].item_name == 'END_DATE') {
              let da2 = this.globalservice.formatDate(objectOfdate.Level5[0].value, 'dd-MMM-yyyy')
              objevent['todate'] = da2;
            }
            if (objectOfdate.Level5[0].item_name == 'TITLE') {
              objevent['event'] = objectOfdate.Level5[0].value;
            }
            if (objectOfdate.Level5[0].item_name == 'ROWNUMBER') {
              objevent['rownumid'] = objectOfdate.Level5[0].value;
            }
            // if(objectOfdate.Level5[0].item_name=='COLOR'){
            //   objevent['color']='task-not-so-imp';
            // }
            objevent['color'] = 'task-not-so-imp';
          }
          this.events.push(objevent)
          //  console.log(this.events)
          //   "fromdate": "26-Dec-2020",
          //   "todate": "26-Dec-2020",
          //   "todate": "Evwnt1",
          //   "todatetodatetodatetodate": "task-low"
          // }
        }
        this.showCalendar(this.currentMonth, this.currentYear);

      }

    }).catch(err => {
      console.log("this.frame canvas err");

      this.globalservice.hideLoading();
      this.globalservice.presentToast("1.5 Something went wrong please try again later!");
      console.log(err);
    })

  }



  next() {
    console.log(this.monthAndYear.nativeElement.innerText)
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    var date = new Date(this.monthAndYear.nativeElement.innerText);
    var firstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1 + 1, 0);
    this.getData(this.globalservice.formatDate(firstDay, 'dd-MMM-yyyy'), this.globalservice.formatDate(lastDay, 'dd-MMM-yyyy'))
    // this.getData(this.currentMonth,this.currentYear);
    // this.showCalendar(this.currentMonth, this.currentYear);
  }

  previous() {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    var date = new Date(this.monthAndYear.nativeElement.innerText);
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() - 1 + 1, 0);
    this.getData(this.globalservice.formatDate(firstDay, 'dd-MMM-yyyy'), this.globalservice.formatDate(lastDay, 'dd-MMM-yyyy'))
    // this.showCalendar(this.currentMonth, this.currentYear);
    // this.getData(this.currentMonth,this.currentYear);
  }
  jump2(currentMonth1, year) {
    let mm = "12-" + currentMonth1 + "-2020";
    var d = new Date(mm);
    var n = d.getMonth();
    this.jump(n, year);
  }
  jump(month, year) {
    if (year && !month) {
      this.currentYear = parseInt(year);
    }
    if (month && !year) {
      this.currentMonth = parseInt(month);
    }
    var dat1 = new Date();
    dat1.setMonth(this.currentMonth);
    dat1.setFullYear(this.currentYear);
    var firstDay = new Date(dat1.getFullYear(), dat1.getMonth(), 1);
    var lastDay = new Date(dat1.getFullYear(), dat1.getMonth() + 1, 0);
    this.getData(this.globalservice.formatDate(firstDay, 'dd-MMM-yyyy'), this.globalservice.formatDate(lastDay, 'dd-MMM-yyyy'));
    // this.showCalendar(this.currentMonth, this.currentYear);
  }

  showCalendar(month, year) {

    // for(let x of eventsCopy){   this loop is for separating saturday loop
    //   const date1 = new Date(x.fromdate);

    //   var day = date1.getDay();
    //   var isWeekend = (day === 6);    // 6 = Saturday
    //   console.log(isWeekend);
    // }

    let eventsCopy = [];
    console.log(this.events)
    eventsCopy = JSON.parse(JSON.stringify(this.events));
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    this.monthAndYear.nativeElement.innerHTML = this.months[month] + " " + year;

    // creating all cells
    let dateArray = [];

    let date = 1;
    for (let i = 0; i < 6; i++) {
      let darr: any = [];
      // creates a table row
      // let row = document.createElement("tr");
      //creating individual cells, filing them up with data.
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          // let cell = document.createElement("td");
          // let cellText = document.createTextNode("");
          // cell.appendChild(cellText);
          // row.appendChild(cell);
          darr.push(null);
        }
        else if (date > daysInMonth) {
          break;
        }

        else {
          // let cell = document.createElement("td");
          // let cellText = document.createTextNode(JSON.stringify(date));
          // if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
          //   cell.classList.add("bg-info");
          // } // color today's date
          // cell.appendChild(cellText);
          // row.appendChild(cell);
          darr.push(date);
          date++;
        }
      }
      dateArray.push(darr)
      //tbl.appendChild(row);
    }

    //let table = tbl;
    let cntcolor: number = -1;
    let diffcolor: number = -1;
    for (let rows of dateArray) {

      let extrarow = 0;
      let row = document.createElement("tr");
      let maxtr = 1;
      let eventData: any = [];

      for (let date of rows) {
        // date will contain single date | ex.1
        let cell = document.createElement("td");

        if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
          cell.style.background = "red";
        } // color today's date

        // let cellText = document.createTextNode(date ? date.toString() : "");
        let spanText = document.createElement("span");
        // let button1 = document.createElement("button");
        spanText.className = "task-not-so-imp";
        if(date){
          spanText.className="date-color";
        }
        spanText.textContent = date ? date.toString() : "";
       
        cell.appendChild(spanText);

        row.appendChild(cell);
        let data: any = [];
        if (date) {
          let currenloopdate = year + "-" + (month + 1) + "-" + JSON.parse(date);
          currenloopdate = JSON.stringify(this.globalservice.formatDate(currenloopdate, 'dd-MMM-yyyy'));

          let diff = 0;
          data = eventsCopy.filter((item: any) => {
            if (Date.parse(JSON.parse(currenloopdate)) == Date.parse(item.fromdate)) {
              let day = new Date(Date.parse(JSON.parse(currenloopdate))).getDay();
              const diffTime = Math.abs(Date.parse(item.fromdate) - Date.parse(item.todate));
              diff = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              item.diff = diff;
              return diff;
            }
          })
          if (data.length > 0) {
            const sortedActivities = data.sort((a, b) => a.diff - b.diff);
            data = sortedActivities;

            let mxRows = maxtr;
            maxtr = maxtr < data.length ? data.length : maxtr;
          }
        }
        eventData.push(data ? data : null);
      }
      tbl.appendChild(row);
      //making event tr
      if (maxtr > 0) {
        let colspan = 0;
        for (let i = 0; i < maxtr; i++) {
          let row = document.createElement("tr");
          let index = 0;
          let len = 0;
          for (let item of eventData) {
            if (item.length > 0) {
              len = len > item.length ? len : item.length;
            }
          }
          for (let data of eventData) {
            colspan > 0 ? colspan-- : "";


            let spanText = document.createElement("span");
            //  spanText.className = data[0].color;
            if (len > 0) {
              if (data.length > 0 && colspan == 0) {
                let cell = document.createElement("td");
                if (data[0].diff > 0) {

                  spanText.className = data[0].color;

                  colspan = data[0].diff;
                  cell.colSpan = data[0].diff;

                  let differ = parseInt(data[0].diff);

                  if ((7 - differ) < index) {   //for two weeks event
                    let dt = ((differ - 7) + index - 1) * 1000 * 60 * 60 * 24;
                    let nextDt = new Date(Date.parse(data[0].todate) - dt);
                    let nextEvDt = this.globalservice.formatDate(nextDt, 'dd-MMM-yyyy');
                    if (data[0].more) {
                      let obj = {
                        "fromdate": nextEvDt,
                        "todate": data[0].todate,
                        "event": data[0].event,
                        "color": data[0].color,
                        "rownumid": data[0].rownumid,
                        "more": data[0].more
                      }
                      eventsCopy.push(obj);
                    } else {
                      let obj = {
                        "fromdate": nextEvDt,
                        "todate": data[0].todate,
                        "event": data[0].event,
                        "color": data[0].color,
                        "rownumid": data[0].rownumid,
                        "more": this.colorsbackground[cntcolor],
                      }
                      eventsCopy.push(obj);
                    }
                    // eventsCopy.push(obj);
                    console.log(nextEvDt);
                  }
                }

                //let cellText = document.createTextNode(data[0].event ? data[0].event.toString() : "");
                var date1 = new Date(data[0].fromdate);
                var date2 = new Date(data[0].todate);
                var diffDays = date2.getDate() - date1.getDate();

                spanText.textContent = data[0].event ? data[0].event.toString() : "";
                let spano = document.createElement("span");
                spano.textContent = JSON.stringify(data[0]);  //object append in hide form
                spano.style.display = "none";
                spanText.appendChild(spano);
                spanText.setAttribute("style", "color:" + data[0].color.toString());
                spanText.addEventListener("click", () => {
                  this.itemClicked(spanText.childNodes[1].textContent);
                });
                spanText.style.color = this.colors[cntcolor];
                if (diffDays > 0 || diffDays > 7) {
                  spanText.style.background = this.colorsbackground[cntcolor];
                  spanText.style.color = "black"
                }
                if (data[0].more) {
                  spanText.style.background = data[0].more;
                  spanText.style.color = "black"
                }
                cell.appendChild(spanText);
                row.appendChild(cell);
                data.shift();
              }
              else if (data.length > 0) {
                maxtr++;
              }
              else {
                if (colspan == 0) {
                  let cell = document.createElement("td");
                  cell.style.background = "white";
                  let cellText = document.createTextNode("");
                  cell.appendChild(cellText);
                  row.appendChild(cell);
                }
              }
            }
            index++;
          }
          cntcolor++;
          tbl.appendChild(row);
        }
      }
    }
  }


  itemClicked(event) {
    let event1;
    let eve = JSON.parse(event);
    let col = {};
    let tableeventrow = this.frame.tableRows[parseInt(eve.rownumid) - 1]

    for (let itemGroup of tableeventrow) {
      if (itemGroup) {
        for (let item of itemGroup.Level5) {
          if (item.item_name == 'TITLE') {
            event1 = item;
          }
          col[item.apps_item_seqid] = item.value;
        }
      }
    }
    console.log(col)
    event1.wsdp = [];
    event1.wsdp.push(col);
    event1.wsdpcl = [];
    event1.wsdpcl.push(col);
    event1.itemIndex = parseInt(eve.rownumid);

    this.emitPass.emit(event1);
  }


  colorsbackground: any = [
    '#ffb3b3', '#fece9a', '#f5df4d', '#a0daa9', '#FF6633',
    '#FF0000', '#3cb371', '#ee82ee', '#FFD700', '#648177',
    '#FFEFD5', '#663399', '#2E8B57', '#DC143C', '#008B8B',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
  colors: any = [
    "#63b598", "#ce7d78", "#ea9e70", "#000000", "#983f7a",
    "#648177", "#0d5ac1", "#d298e2", "#6119d0", "#61da5e",
    "#f205e6", "#1c0365", "#14a9ad", "#4ca2f9", "#a4e43f",
    "#d2737d", "#c0a43c", "#f2510e", "#651be6", "#79806e",
    "#61da5e", "#cd2f00", "#cd2f00", "#4bb473", "#75d89e",
    "#9348af", "#01ac53", "#c5a4fb", "#996635", "#b11573",
    "#4bb473", "#75d89e", "#ca4751", "#7e50a8", "#880977",
    "#2f3f94", "#2f7b99", "#da967d", "#34891f", "#b0d87b",
    "#ffdbe1", "#2f1179", "#4b5bdc", "#0cd36d", "#539397",
    "#c4d647", "#e0eeb8", "#11dec1", "#289812", "#566ca0",
    "#935b6d", "#916988", "#513d98", "#aead3a", "#9e6d71",
    "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a",
    "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52",
    "#48b41b", "#e1cf3b", "#983f7a", "#ea24a3", "#b2be57",
    "#5be4f0", "#57c4d8", "#a4d17a", "#225b8", "#be608b",
    "#96b00c", "#088baf", "#89d534", "#d36647", "#fa06ec",
    "#f158bf", "#e145ba", "#ee91e3", "#05d371", "#5426e0",
    "#4834d0", "#802234", "#c9a941", "#41d158", "#89d534",
    "#6749e8", "#0971f0", "#8fb413", "#b2b4f0", "#c3c89d",
    "#fb21a3", "#51aed9", "#5bb32d", "#807fb", "#21538e",
    "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422",
    "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52",
    "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#21538e",
    "#d36647", "#983f7a", "#ea24a3", "#b2be57", "#fa06ec",
    "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422",
    "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52",
    "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#9cb64a",
    "#996c48", "#9ab9b7", "#aa226d", "#792ed8", "#c4fd57",
    "#06e052", "#e3a481", "#0eb621", "#fc458e", "#b2db15",
    "#73872a", "#520d3a", "#cefcb8", "#a5b3d9", "#7d1d85",
    "#f1ae16", "#3f8473", "#e7dbce", "#15b9ee", "#0f5997",
    "#8fe22a", "#ef6e3c", "#243eeb", "#1dc18", "#dd93fd",
    "#421f79", "#7a3d93", "#635f6d", "#93f2d7", "#9b5c2a",
    "#409188", "#911e20", "#1350ce", "#10e5b1", "#fff4d7",
    "#cb2582", "#ce00be", "#77772a", "#6995ba", "#21d52e",
    "#32d5d6", "#17232", "#608572", "#c79bc2", "#00f87c",
    "#fc6b57", "#f07815", "#8fd883", "#060e27", "#96e591",
    "#d00043", "#bde052", "#e08c56", "#c9d730", "#30cc49",
    "#b47162", "#1ec227", "#4f0f6f", "#1d1d58", "#947002",
    "#28fcfd", "#bb09b", "#36486a", "#d02e29", "#1ae6db",
    "#3e464c", "#a84a8f", "#88aa0b", "#406df9", "#a8b8d4",
    "#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086",
    "#3d6751", "#fb4c03", "#640fc1", "#62c03e", "#d3493a",
    "#615af0", "#4be47", "#2a3434", "#4a543f", "#79bca0",
    "#00efd4", "#e3d94c", "#dc1c06", "#436a9f", "#1a806a",
    "#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59",
    "#f53b2a", "#b46238", "#2dfff6", "#a82b89", "#1a8011",
    "#4cf09d", "#c188a2", "#67eb4b", "#b308d3", "#fc7e41",
    "#af3101", "#ff065", "#474893", "#3cec35", "#dce77a",
    "#71b1f4", "#a2f8a5", "#e23dd0", "#d3486d", "#00f7f9",
    "#1c65cb", "#5d1d0c", "#2d7d2a", "#ff3420", "#5cdd87",
    "#1bede6", "#8798a4", "#d7790f", "#b2c24f", "#de73c2",
    "#d70a9c", "#25b67", "#a259a4", "#e4ac44", "#77ecca",
    "#88e9b8", "#c2b0e2", "#86e98f", "#ae90e2", "#1a806b",
    "#436a9e", "#0ec0ff", "#9685eb", "#8a96c6", "#e23dd0",
    "#f812b3", "#b17fc9", "#8d6c2f", "#d3277a", "#2ca1ae",
    "#dba2e6", "#76fc1b", "#608fa4", "#20f6ba", "#07d7f6",
  ]



  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: "my-custom-class",
      componentProps: {
        data: this.developerModeData
      }
    });
    return await modal.present();
  
}
}
