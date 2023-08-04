import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';
import { ApexActionFilterPage } from 'src/app/pages/apex-action-filter/apex-action-filter.page';
import { ApexSearchPipe } from 'src/app/pipes/apex-search.pipe';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IonSelect } from '@ionic/angular';
import { database } from 'firebase';
import { ApexHighlightPage } from 'src/app/pages/apex-highlight/apex-highlight.page';

@Component({
  selector: 'app-frame-apexfilter',
  templateUrl: './frame-apexfilter.component.html',
  styleUrls: ['./frame-apexfilter.component.scss'],
})
export class FrameApexfilterComponent implements OnInit {
  @Output() fromapexFilter: EventEmitter<any> = new EventEmitter<any>();
  @Input() frame: any = {};
  @Input() frametable: any = {};
  @Input() theadData: any = {};
  searchText: any;
  actionName: any = "Actions";
  columnName: any = {};
  tRows: any = [];
  frameheads: any = [];
  dataMode: any = ['Columns', 'Filter', 'Aggregate', 'Freez Column', 'Rows Per Page', 'Control Break', 'Group By','Pivot Table'];

  actionIcon: any = ['journal', 'funnel', 'calculator', 'cellular', 'menu', 'pause', 'grid', 'locate']
  flagFirst: boolean = true;
  group1 = [];
  dragarrayHeads: any;
  flagforfreeze: boolean;
  frameheadsFreeze: any;
  formatAction: any = ['Control Break', 'Row per page'];

  showList: boolean = true;

  platformVal = "";
  icon = "";

  appliedFilters = [];

  @ViewChild('mySelect') selectRef: IonSelect;

  constructor(
    public pipemys: ApexSearchPipe, public popoverController: PopoverController, public platform: Platform
  ) {
    this.columnName.prompt_name = "All Columns";

    if (this.platform.is("android") || this.platform.is("ios")) {
      this.platformVal = "mobile";
    } else {
      this.platformVal = "browser";
    }
  }


  ngOnInit() {
    console.log(this.frame);

    this.tRows = JSON.parse(JSON.stringify(this.frame.tableRows));
    this.frameheads = JSON.parse(JSON.stringify(this.theadData));

    this.dragarrayHeads = JSON.parse(JSON.stringify(this.theadData));


    // this.columnName=this.frameheads[0];
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  createTable() {
    let apexFrameLevel4;
    /*   if (this.tRows.length > 0) {
        trows = JSON.parse(JSON.stringify(this.tRows));
      } else {
   */
    apexFrameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    // }
    let visibleItems: any = [];
    this.group1.forEach(m => {
      for (let x of this.frame.apextheaders) {
        if (x.prompt_name == m) {
          visibleItems.push(x);
        }
      }
    });
    this.frame.visibleItems = visibleItems;
    console.log(this.frame);
    let event: any = {};
    // event.trows = JSON.parse(JSON.stringify(trows));
   // event.thead = this.group1;
    event.apex = true;
    event.visibleItems = visibleItems;
    this.fromapexFilter.emit(event);
    this.actionName = '';
    // this.group1 = [];
    // this.dragarrayHeads = JSON.parse(JSON.stringify(this.frameheads));
  }
  cancelTable() {
    this.actionName = '';
  }


  // fist drop to Go
  dropdwnValChng(event) {

    console.log(event);
    this.searchText = '';

    console.log(this.columnName)
  }

  serchtextChange(event) {
    if (this.searchText == '') {
      if (this.frame.ctrlBrkCond && this.frame.ctrlBrkCond.length > 0) {
        let values = [];
        event.searchTabData = values;
      } else {
        this.theadData
        this.frame.tableRows = JSON.parse(JSON.stringify(this.tRows));
        this.theadData = JSON.parse(JSON.stringify(this.frameheads));
        event.apex = true;
        event.trows = this.tRows
      }
      this.fromapexFilter.emit(event);
    }
  }
  searchWithGO() {
    console.log(this.searchText);
    let event: any = {};
    if (this.frame.ctrlBrkCond && this.frame.ctrlBrkCond.length > 0) {
      let values = this.frame.tableData.filter(x => x[this.columnName.item_name] == this.searchText);
      event.searchTabData = values;
    } else {
      this.theadData = JSON.parse(JSON.stringify(this.frameheads));
      let vals = this.pipemys.transform(JSON.parse(JSON.stringify(this.tRows)), this.searchText, this.columnName.prompt_name);

      event.trows = vals;
      event.thead = JSON.parse(JSON.stringify(this.frameheads));
    }
    this.fromapexFilter.emit(event);
  }
  // to Go
  drpActionValue(event) {
    if (this.actionName == 'Sort' || this.actionName == 'Aggregate' || this.actionName == 'Filter' || this.actionName == 'Rows Per Page') {
      this.presentPopover(this.actionName);
    }
    if (this.actionName == 'Freez Column') {
      this.flagforfreeze = true;
    }
    else {
      this.flagforfreeze = false;
    }

    //  this.presentPopover("event.detail.value");
  }

  async presentPopover(ev) {
    console.log(ev)
    if (this.flagFirst) {
      this.flagFirst = false;
      this.tRows = JSON.parse(JSON.stringify(this.tRows));
    } else {
      // this.frame.tableRows=this.tRows;
    }
    let dta = {
      shuffle: ev,
      frame: JSON.parse((JSON.stringify(this.frame)))
      // datahead: JSON.parse(JSON.stringify(this.frameheads)),
      // tRows: JSON.parse(JSON.stringify(this.tRows)),
      // apexHeads: JSON.parse(JSON.stringify(this.frame.apextheaders)),
      // apexAggriHead: JSON.parse(JSON.stringify(this.frame.apexAggriHead)),
      // noOfRecord: JSON.parse(JSON.stringify(this.frame.no_of_records))
    }
    const popover = await this.popoverController.create({
      component: ApexActionFilterPage,
      cssClass: "apex-popover",
      animated: true,
      showBackdrop: true,
      componentProps: dta,
      id: "apexPop"
      // translucent: true
    });
    popover.onDidDismiss().then((data: any) => {
      this.actionName = ""
      console.log(data);
      if (data.data) {
        if (data.role == 'formatAction') {
          let event: any = {};
          event.apex = true;
          event.apex_orderBy_str = data.data;
          this.fromapexFilter.emit(event);
        } else if (data.role == 'sort') {
          let event: any = {};
          event.apex = true;
          event.funArr = data.data;
          this.frame.funcArr = data.data;
          this.fromapexFilter.emit(event);
        } else if (data.role == 'numOfRecords') {
          let event: any = {};
          event.apex = true;
          event.noOfRecords = data.data;
          this.fromapexFilter.emit(event);
        } else if (data.role == 'controlBr') {
          let ctrlObj = data.data;
          let event: any = {};
          event.apex = true;
          event.ctrlBreakArr = data.data;
          this.frame.ctrlBrkCond = data.data;

          let apply = this.appliedFilters.find(x => x.type == 'Control Break');
          if (apply) {
          } else {
            let obj = {
              type: 'Control Break',
              icon: this.icon
            }
            this.appliedFilters.push(obj);
          }

          this.fromapexFilter.emit(event);
          // this.createGroupTable(ctrlObj);
        } else if (data.role == 'groupBy') {

          let event: any = {};
          event.apex = true;
          event.groupBy = data.data;
          this.frame.funcArr = data.data.funArr;
          this.frame.ctrlBrkCond = data.data.controlBr;


          let apply = this.appliedFilters.find(x => x.type == 'Group By');
          if (apply) {
          } else {
            let obj = {
              type: 'Group By',
              icon: this.icon
            }
            this.appliedFilters.push(obj);
          }
          this.fromapexFilter.emit(event);
        }

        if (data.role == 'pages') {
          alert(data.data);
        }
        if (data.role == 'columnFilter') {
          console.log()
          let event: any = {};
          //  event.trows = data.data;
          event.apex = true;
          // event.apex_where_str = data.data;
          event.filterCond = data.data;
          //  event.thead = JSON.parse(JSON.stringify(this.frameheads));
          //  this.fromapexFilter.emit(event);
          this.frame.filterAbleArr = event.filterCond;
          this.getFilteredData(event.filterCond);
        }
      }

    });
    return await popover.present();
  }



  dropdwnfreezeVl(event) {
    console.log(this.frameheadsFreeze);

    this.freezeFunction();


  }
  freezeFunction() {
    let headClasses: any = [];
    let trows;
    if (this.tRows.length > 0) {
      trows = JSON.parse(JSON.stringify(this.tRows));
    } else {

      trows = JSON.parse(JSON.stringify(this.frame.tableRows));
    }
    let a = 0;
    let freezeCol = [];
    this.frameheadsFreeze.forEach(m => {

      let obj = {
        "width": "100px",
        "min-width": "100px",
        "max-width": "100px",
        "left": a + "px",
        "z-index": "99999"
      }
      headClasses.push(obj);

      let data = {
        prompt_name:m,
        style:obj
      }
     freezeCol.push(data);
      a = a + 100;
    });


    let heads;
    heads = (JSON.parse(JSON.stringify(this.frameheadsFreeze)));
    //code for separating different values in array
    var array3 = this.frameheads.filter((obj) => {
      return heads.indexOf(obj) == -1;
    });
    heads = JSON.parse(JSON.stringify(heads.concat(array3)));
    console.log(heads);
    let newtrows: any = [];
    for (let x of trows) {
      let arr: any = [];
      for (let head of heads) {
        for (let data1 of x) {
          for (let data2 of data1) {
            if (data2.prompt_name === head) {
              arr.push(data1);
            }
          }

        }
      }

      newtrows.push(JSON.parse(JSON.stringify(arr)));
    }
    console.log(this.frame)
    let event: any = [];
    event.trows = JSON.parse(JSON.stringify(newtrows));
    event.thead = heads;
    event.headclasses = headClasses;

    event.headLength = this.frameheadsFreeze.length - 1;
    event.apex = true;
    event.freezeCol = freezeCol;
    this.fromapexFilter.emit(event);
    this.actionName = '';
    // this.group1 = [];
    // this.dragarrayHeads = JSON.parse(JSON.stringify(this.frameheads));
  }



  myFunction(event) {
    document.getElementById("myDropdown").classList.toggle("show");
    document.getElementById("myDropdown1").classList.remove("show");
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }

  }


  getMode(i, event, event2) {
    console.log(event)
    this.actionName = event;
    this.icon = this.actionIcon[i];
    if (this.actionName == 'Freez Column') {
      this.selectRef.open();
      this.flagforfreeze = true;
    }
    else {
      this.flagforfreeze = false;
    }
    if (this.actionName == 'Sort' || this.actionName == 'Aggregate' || this.actionName == 'Filter'
      || this.actionName == 'Rows Per Page' || this.actionName == 'Control Break' || this.actionName == 'Group By') {
      this.presentPopover(this.actionName);
    }
    if (this.actionName == 'Highlight') {
      this.highlightPopover();
    } if(this.actionName == 'Pivot Table'){
      let ev:any = {}
      ev.apex = true;
      ev.showPivot = true;
      this.fromapexFilter.emit(ev);
    }
    // this.myFunction(event2);
  }


  async highlightPopover() {
    let data = {
      frame: this.frame
    }
    const popover = await this.popoverController.create({
      component: ApexHighlightPage,
      animated: true,
      backdropDismiss: true,
      componentProps: data
    });
    popover.onDidDismiss().then(res => {
      console.log(res)
      if (res.role == 'data') {
        console.log(res.data);
        let event: any = {};
        event.apex = true;
        event.ngStyle = res.data;
        this.fromapexFilter.emit(event);
      }
    })
    return await popover.present();
  }


  myFunction1(event) {
    //document.getElementById("myDropdown").classList.remove("show");
    document.getElementById("myDropdown1").classList.toggle("show");
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }

  }


  getColname(i, event, event2) {
    this.columnName = event;

    this.searchText = "";
    this.myFunction1(event2);
  }


  createGroupTable(ctrlArr) {
    let grpColumn = [];
    for (let c of ctrlArr) {
      for (let x of this.frame.allTablerows) {
        for (let data1 of x) {
          for (let data2 of data1.Level5) {
            if ((c.itemName == data2.item_name) && data2.value) {
              data2.item_visible_flag = 'F';
              let grp = grpColumn.find(x => x.key == data2.value);
              if (grp) {
                grp.rows.push(x);
              } else {
                let rowsArr = [];
                rowsArr.push(x);
                let obj = {
                  key: data2.value,
                  rows: rowsArr
                }
                grpColumn.push(obj);
              }
            }
          }
        }
      }
    }
    console.log(grpColumn);
    let event: any = {};
    event.apex = true;
    event.cBTableRows = grpColumn;
    this.fromapexFilter.emit(event);
  }


  clear(i, ev) {
    let event: any = {};
    event.apex = true;
    // this.frame.funcArr = [];

    if(ev == 'groupBy'){
    this.frame.ctrlBrkCond.splice(i, 1);
    if ((this.frame.ctrlBrkCond && (this.frame.ctrlBrkCond.length > 0)) && (this.frame.funcArr && (this.frame.funcArr.length > 0))) {
      let data = {
        funArr: this.frame.funcArr,
        controlBr: this.frame.ctrlBrkCond
      }
      event.groupBy = data;
    } else {
      event.clear = 'groupBy';
      this.frame.funcArr = [];
      let headArr = [];
      for (let itemGroup of this.frame.Level4) {
        for (let itemMast of itemGroup.Level5) {
          if (itemMast.item_visible_flag == 'T') {
            headArr.push(itemMast.prompt_name);
          }
        }
      }

      event.head = headArr;
    }
    this.fromapexFilter.emit(event);
  } if(ev =='filter'){
    this.frame.filterAbleArr.splice(i, 1);
    if(this.frame.filterAbleArr.length > 0){
      this.getFilteredData(this.frame.filterAbleArr);
    }else{
      event.filteredData = [];
      this.fromapexFilter.emit(event);
    }
  } if(ev == 'All'){
    event.clear = ev;
    this.frame.filterAbleArr = [];
    this.frame.ctrlBrkCond = [];
    this.frame.funcArr = [];
    this.frame.visibleItems = [];
    this.frame.tableData = [];
    this.fromapexFilter.emit(event);
  }
    
  }

  getFilteredData(condArr) {
    // this.filterAbleData = [];
    let filteredData = [];
    for (let c of condArr) {
      if (c.operators == '=') {
        if (filteredData.length > 0) {
          let data = filteredData.filter(x => x[c.coloumns.item_name].toLowerCase() == c.description.toLowerCase());
          filteredData = data;
        } else {
          filteredData = this.frame.tableData.filter(x => x[c.coloumns.item_name].toLowerCase() == c.description.toLowerCase());
        }
      } else if (c.operators == '<>') {
        if (filteredData.length > 0) {
          let data = filteredData.filter(x => x[c.coloumns.item_name].toLowerCase() != c.description.toLowerCase());
          filteredData = data;
        } else {
          filteredData = this.frame.tableData.filter(x => x[c.coloumns.item_name].toLowerCase() != c.description.toLowerCase());
        }
      } else if (c.operators == 'is null') {
        if (filteredData.length > 0) {
          let data = filteredData.filter(x => x[c.coloumns.item_name] == null);
          filteredData = data;
        } else {
          filteredData = this.frame.tableData.filter(x => x[c.coloumns.item_name] == null);
        }
      } else if (c.operators == 'is not null') {
        if (filteredData.length > 0) {
          let data = filteredData.filter(x => x[c.coloumns.item_name] != null);
          filteredData = data;
        } else {
          filteredData = this.frame.tableData.filter(x => x[c.coloumns.item_name] != null);
        }
      } else if (c.operators == 'like') {
        if (filteredData.length > 0) {
          let data = filteredData.filter(x => ((x[c.coloumns.item_name] != null) && x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
          filteredData = data;
        } else {
          filteredData = this.frame.tableData.filter(x => ((x[c.coloumns.item_name] != null) && x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
        }
        console.log(filteredData);
      } else if (c.operators == 'not like') {
        if (filteredData.length > 0) {
          let data = filteredData.filter(x => ((x[c.coloumns.item_name] == null) || !x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
          filteredData = data;
        } else {
          filteredData = this.frame.tableData.filter(x => ((x[c.coloumns.item_name] == null) || !x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
        }
      } else if (c.operators == 'not in') {
        let str = "";
        if ((c.description).indexOf(",") > -1) {
          let condArr = c.description.split(',');
          let i = 0
          for (let c of condArr) {
            i++;
            if (i < condArr.length) {
              str = str + "x[c.coloumns.item_name].toLowerCase() != '" + c.toLowerCase() + "' && "
            } else {
              str = str + "x[c.coloumns.item_name].toLowerCase() != '" + c.toLowerCase() + "'";
            }
          }
        } else {
          str = "x[c.coloumns.item_name].toLowerCase() != '" + c.description.toLowerCase() + "'";
        }

        if (filteredData.length > 0) {
          let data = filteredData.filter(x => (eval(str)));
          filteredData = data;
        } else {
          filteredData = this.frame.tableData.filter(x => (eval(str)));
        }
      } else if (c.operators == 'in') {
        let str = "";
        if ((c.description).indexOf(",") > -1) {
          let condArr = c.description.split(',');
          let i = 0
          for (let c of condArr) {
            i++;
            if (i < condArr.length) {
              str = str + "x[c.coloumns.item_name].toLowerCase() == '" + c.toLowerCase() + "' || "
            } else {
              str = str + "x[c.coloumns.item_name].toLowerCase() == '" + c.toLowerCase() + "'";
            }
          }
        } else {
          str = "x[c.coloumns.item_name].toLowerCase() == '" + c.description.toLowerCase() + "'";
        }

        if (filteredData.length > 0) {
          let data = filteredData.filter(x => (eval(str)));
          filteredData = data;
        } else {
          filteredData = this.frame.tableData.filter(x => (eval(str)));
        }
      }

    }
    let event:any = {};
   
    event.filteredData = filteredData;
    event.apex = true;
    this.fromapexFilter.emit(event);
   // console.log(filteredData);
  }



  closeDrag() {
    this.actionName = "";
  }

}
