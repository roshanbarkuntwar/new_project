import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomElementSchemaRegistry } from '@angular/compiler';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
  selector: 'app-eventinthe-calender',
  templateUrl: './eventinthe-calender.component.html',
  styleUrls: ['./eventinthe-calender.component.scss'],
})
export class EventintheCalenderComponent implements OnInit {
  @ViewChild("monthAndYear") monthAndYear: ElementRef;

  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  selectYear: any = document.getElementById("year");
  selectMonth: any = document.getElementById("month");
  year:any;
  month:any;
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  currentMonth1: string;
  currentYear1: string;

  //monthAndYear:any = document.getElementById("monthAndYear");

  constructor(public globalservice: GlobalObjectsService) { }

  ngOnInit() {
    this.showCalendar(this.currentMonth, this.currentYear);
  }




  next() {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  previous() {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  jump(month, year) {
    if (year && !month) {
      this.currentYear = parseInt(year);
    }
    if (month && !year) {
      this.currentMonth = parseInt(month);
    }
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  showCalendar(month, year) {

    // for(let x of this.events){   this loop is for separating saturday loop
    //   const date1 = new Date(x.fromdate);

    //   var day = date1.getDay();
    //   var isWeekend = (day === 6);    // 6 = Saturday
    //   console.log(isWeekend);
    // }

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
          // cell.classList.add("bg-info");
        } // color today's date

        let cellText = document.createTextNode(date ? date.toString() : "");
        cell.appendChild(cellText);
        row.appendChild(cell);
        let data: any = [];
        if (date) {
          let currenloopdate = year + "-" + (month + 1) + "-" + JSON.parse(date);
          currenloopdate = JSON.stringify(this.globalservice.formatDate(currenloopdate, 'dd-MMM-yyyy'));

          let diff = 0;
          data = this.events.filter((item: any) => {
            if (Date.parse(JSON.parse(currenloopdate)) == Date.parse(item.fromdate)) {

              let day = new Date(Date.parse(JSON.parse(currenloopdate))).getDay();
              const diffTime = Math.abs(Date.parse(item.fromdate) - Date.parse(item.todate));
              diff = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              item.diff = diff;
              return diff;
            }
          })
          if (data.length > 0) {
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

            if (len > 0) {
              if (data.length > 0 && colspan == 0) {
                let cell = document.createElement("td");
                if (data[0].diff > 0) {
                  colspan = data[0].diff;
                  cell.colSpan = data[0].diff;

                  let differ = parseInt(data[0].diff);

                  if((7 - differ) < index){
                    let dt = ((differ - 7) + index - 1) * 1000 * 60 * 60 * 24;
                    let nextDt = new Date(Date.parse(data[0].todate) - dt);
                    let nextEvDt = this.globalservice.formatDate(nextDt, 'dd-MMM-yyyy');

                    let obj = {
                      "fromdate": nextEvDt,
                      "todate": data[0].todate,
                      "event": data[0].event,
                      "color": data[0].color
                    }

                    this.events.push(obj);
                    console.log(nextEvDt);
                  }
                }
                let cellText = document.createTextNode(data[0].event ? data[0].event.toString() : "");
                cell.style.background = data[0].color ? data[0].color : "white";
                cell.appendChild(cellText);
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
          tbl.appendChild(row);
        }
      }
    }
  }

  events: any = [
    {
      "fromdate": "26-Dec-2020",
      "todate": "26-Dec-2020",
      "event": "Evwnt1",
      "color": "lightblue"
    },
    {
      "fromdate": "04-Dec-2020",
      "todate": "07-Dec-2020",
      "event": "Evwnt1",
      "color": "lightblue"
    },
    {
      "fromdate": "07-Nov-2020",
      "todate": "07-Nov-2020",
      "event": "Evwnt2",
      "color": "grey"
    },
    {
      "fromdate": "21-Dec-2020",
      "todate": "28-Dec-2020",
      "event": "hello3",
      "color": "aqua"
    },
    {
      "fromdate": "20-Dec-2020",
      "todate": "30-Dec-2020",
      "event": "hello4",
      "color": "orange"
    }
    , {
      "fromdate": "20-Dec-2020",
      "todate": "20-Dec-2020",
      "event": "hello5"
    }
    , {
      "fromdate": "22-Dec-2020",
      "todate": "24-Dec-2020",
      "event": "hello6"
    },
    {
      "fromdate": "25-Dec-2020",
      "todate": "27-Dec-2020",
      "event": "event7"
    },
    {
      "fromdate": "27-Jan-2021",
      "todate": "28-Jan-2021",
      "event": "Evwnt8",
      "color": "grey"
    },
    {
      "fromdate": "09-Jan-2021",
      "todate": "09-Jan-2021",
      "event": "Evwnt9",
      "color": "lightblue"
    },
    {
      "fromdate": "03-Jan-2021",
      "todate": "04-Jan-2021",
      "event": "Evwnt10",
      "color": "grey"
    },
  ]


}
