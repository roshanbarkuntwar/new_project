import { Component, Input, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { ApexSearchPipe } from 'src/app/pipes/apex-search.pipe';

@Component({
  selector: 'app-apex-action-filter',
  templateUrl: './apex-action-filter.page.html',
  styleUrls: ['./apex-action-filter.page.scss'],
})
export class ApexActionFilterPage implements OnInit {
  frame:any;
  databack: any = [];
  shuffle;
  columnName: any;
  framefromapexCompo: any;
  thead: any = [];
  description: any;
  frames: any = {};

  operatorName: any;
  tRows: any;
  expressionQuery: any = [];
  operators: any = ['=', '<>', 'is null', 'is not null', 'like', 'not like', 'in', 'not in'];
  apexThead = [];
  apexAggriHead = [];
  noOfRecords;
  test:any;
  dbFunction: any = ["!=", ">=", "<=", ">", "<", "ABS", "ADD MONTH", "BETWEEN", "CASE", "CEIL", "CURRENT_DATE", "CURRENT_TIMESTAMP",
    "DECODE", "ELSE", "END", "EXP", "GREATEST", "IN", "INITCAP", "INSTR", "IS", "LAST_DAY", "LIST", "LENGTH", "LIKE", "LOG", "LPAD",
  ];

  functions = [
    { name: 'Sum', value: 'S' },
    { name: 'Average', value: 'A' },
    { name: 'Count', value: 'C' },
    { name: 'Minimum', value: 'M' },
    { name: 'Maximum', value: 'X' }
  ];

  controlBreakArr:any = [{coloumns: "",status : "Enabled"}]
  aggregateFun:any = [{ fun: "S", coloumns: {} }]
  orderFormat: any = ['asc', 'desc'];
  formatRows: any = [{ coloumns: {}, ordFormat: "asc", nullPosition: "" }];
  nullValue: any = ['nulls first', 'nulls last'];
  rowsFilter: any = [{ coloumns: {}, operators: "like", description: "" }];

  /* newFormatAttribute: any = { coloumns: "", status: "", };
  newAttribute: any = { coloumns: "", operators: "like", description: "%%" }; */
  formatActnflag: boolean = false;
  rowsInpage = ["1", "5", "10", "20", "25", "50", "100", "1000", "ALL"];
  rowPerPage;

  constructor(public navParams: NavParams, public popOverCtrl: PopoverController, public pipemys: ApexSearchPipe) {
    // this.thead = JSON.parse(JSON.stringify(this.navParams.data.datahead));
    // this.apexThead = JSON.parse(JSON.stringify(this.navParams.data.apexHeads));
    // this.apexAggriHead = JSON.parse(JSON.stringify(this.navParams.data.apexAggriHead));
    // this.frames = JSON.parse(JSON.stringify(this.navParams.data.tRows));
    // this.shuffle = this.navParams.data.shuffle;
    // this.rowPerPage = this.navParams.data.noOfRecord;

    this.frame = this.navParams.data.frame;

    this.thead = this.frame.apextheads;
    this.apexThead = this.frame.apextheaders;
    this.apexAggriHead = this.frame.apexAggriHead;
    this.frames = this.frame.tableRows;
    
    this.shuffle = this.navParams.data.shuffle;
    this.rowPerPage = this.frame.no_of_records;
// this.test = this.apexThead[0];

    if(this.frame.visibleItems && this.frame.visibleItems.length > 0){
      this.apexThead = this.frame.visibleItems;
    }
    
    // this.maindata=JSON.parse(JSON.stringify(this.navParams.data.mainData));
    console.log(this.shuffle);
    
   /*  if (this.shuffle) {
      this.formatActnflag = true;
    } else {
      this.formatActnflag = false;
    }
    console.log(this.tRows); */
  }
  addElement(exp, i) {
    this.expressionQuery = this.expressionQuery + " " + exp;
    console.log(this.expressionQuery);
    this.controlBreakArr;
  }
 /*  formatShuffle(event) {
    if (event == 'Set-Row') {
      this.formatActnflag = false
    }
    if (event == 'Control-Break') {
      this.formatActnflag = true;
    }
  }
 */
  ngOnInit() {
    if(this.shuffle == 'Group By' || this.shuffle == 'Aggregate'){
      this.aggregateFun = [];
      for(let a of this.apexAggriHead){
        let obj = { 
          fun: "S", 
          coloumns: a 
        }
      this.aggregateFun.push(obj);
      }
    }else{
      this.aggregateFun = [];
    }


    let con;
    for (let r of this.rowsFilter) {
      if (con) {
        con = con + '&&' + r.coloumns + r.operators + r.description
      } else {
        con = r.coloumns + r.operators + r.description
      }
    }

    if(this.frame.ctrlBrkCond && this.frame.ctrlBrkCond.length > 0){
      for(let c of this.frame.ctrlBrkCond){
        for(let a of this.apexThead){
          if(c.coloumns.item_name == a.item_name){
            c.coloumns = a
          }
        }
      }
      this.controlBreakArr = this.frame.ctrlBrkCond;
      this.frame.ctrlBrkCond;
    }

    if(this.frame.funcArr && this.frame.funcArr.length > 0){
      for(let f of this.frame.funcArr){
        for(let a of this.apexAggriHead){
          if(f.coloumns.item_name == a.item_name){
            f.coloumns = a
          }
        }
      }
      this.aggregateFun = this.frame.funcArr;
    }

    if(this.frame.filterAbleArr && this.frame.filterAbleArr.length > 0){
      for(let f of this.frame.filterAbleArr){
        for(let a of this.apexThead){
          if(f.coloumns.item_name == a.item_name){
            f.coloumns = a
          }
        }
      }
      this.rowsFilter = this.frame.filterAbleArr;
    }

    let r = this.rowsInpage.find(x => x == (this.frame.rowsPerPage).toString());
    this.rowPerPage = r;


  
  }
  addFieldValue(ev) {
    if (ev == 'aggreFun') {
      let row = { fun: "S", coloumns: {} };
      this.aggregateFun.push(row);
    } else if (ev == 'formRows') {
      let row = { coloumns: {}, ordFormat: "asc", nullPosition: "" }
      this.formatRows.push(row)
    } else if (ev == 'rowsFil') {
      let row = { coloumns: {}, operators: "like", description: "" }
      this.rowsFilter.push(row)
    } else if (ev == 'controlBr') {
      let row = { coloumns: "", status: "Enabled" }
      this.controlBreakArr.push(row)
    }
    // this.newAttribute = {};
  }

  rmFieldValue(i, ev) {
    if (ev == 'aggreFun') {
      this.aggregateFun.splice(i, 1);
    } else if (ev == 'formRows') {
      this.formatRows.splice(i, 1);
    } else if (ev == 'rowsFil') {
      this.rowsFilter.splice(i, 1);
    } else if (ev == 'controlBr') {
      this.controlBreakArr.splice(i, 1);
    }
  }

  selecPages(event) {
    console.log(event.detail.value);
    this.popOverCtrl.dismiss(JSON.parse(JSON.stringify(event.detail.value)), 'pages');
  }

  createFormat() {
    let con;
    let order_str: any = "order by ";
    for (let r of this.formatRows) {
      let col = r.coloumns.aliases ? r.coloumns.aliases + '.' + r.coloumns.item_name : r.coloumns.item_name;
      let str = col + ' ' + r.ordFormat + ' ' + r.nullPosition;
      if (con) {
        con = con + ',' + str
      } else {
        con = str
      }

      // this.sendDatatoApex2(this.maindata, r.description, r.coloumns, r.operators);
    }
    order_str += con
    this.popOverCtrl.dismiss(order_str, "formatAction");
  }

  createRow() {
    console.log(this.rowsFilter);
   let filterableCond = []
    // this.maindata = JSON.parse(JSON.stringify(this.frames));
    for (let r of this.rowsFilter) {
      // let col = r.coloumns.aliases ? r.coloumns.aliases + '.' + r.coloumns.item_name : r.coloumns.item_name;
      // let str = col + ' ' + r.operators + " '" + r.description + "'";
      // con = con + ' and ' + str;
      let obj = {
        item_name:r.coloumns.item_name,
        operator:r.operators,
        value:r.description
      }

      filterableCond.push(obj);
      // this.sendDatatoApex2(this.maindata, r.description, r.coloumns, r.operators);
    }
    this.popOverCtrl.dismiss(this.rowsFilter, 'columnFilter');
  }

  changeRows(num){

    this.popOverCtrl.dismiss(num, 'numOfRecords');
  }

  createFunction(){
    // let funArr = [];

    // for(let a of this.aggregateFun){
    //   let col = a.coloumns.item_name;
    //   let fun = {
    //     itemName : col,
    //     summFlag : a.fun
    //   }
    //   funArr.push(fun);
    // }
    this.popOverCtrl.dismiss(this.aggregateFun, 'sort');
  }

  createBreak(){
 
    this.popOverCtrl.dismiss(this.controlBreakArr, 'controlBr');
  }

  createGroupBy(){

    let obj = {
      funArr:this.aggregateFun,
      controlBr:this.controlBreakArr
    }

    this.popOverCtrl.dismiss(obj, 'groupBy');
  }



  cancel() {
    this.rowsFilter = [{ coloumns: {}, operators: "", description: "" }];
    this.formatRows = [{ coloumns: {}, ordFormat: "asc", nullPosition: "" }];
    this.aggregateFun = [{ fun: "S", coloumns: {} }];
    this.controlBreakArr = [{coloumns: "",status:"Enabled"}]
    this.popOverCtrl.dismiss();
  }

  cancelModal() {
    this.rowsFilter = [{ coloumns: {}, operators: "", description: "" }];
    this.formatRows = [{ coloumns: {}, ordFormat: "asc", nullPosition: "" }];
    this.aggregateFun = [{ fun: "S", coloumns: {} }]
    this.popOverCtrl.dismiss(this.databack);
  }

  columnValChng(event) {
    console.log(event);
    console.log(this.columnName)
  }
  operatorValChng(event) {

    console.log(event)
    console.log(this.operatorName);
  }
  sendDatatoApex() {
    this.frames.tableRows = JSON.parse(JSON.stringify(this.tRows));
    let dataRows: any = [];
    let vals = this.pipemys.transform(JSON.parse(JSON.stringify(this.frames)), this.description, this.columnName);
    let trows = JSON.parse(JSON.stringify(vals));
    for (let data of trows) {
      console.log(data);
      for (let datax of data) {
        for (let x of datax) {
          if (this.operatorName == '=') {
            if (x.prompt_name == this.columnName && x.value == this.description) {
              dataRows.push(data);
            }
          }
          else if (this.operatorName == '!=') {
            if (x.prompt_name == this.columnName && x.value != this.description) {
              dataRows.push(data);
            }
          }
          else if (this.operatorName == 'is null') {
            if (x.prompt_name == this.columnName && x.value == null) {
              dataRows.push(data);
            }
          }
          else if (this.operatorName == 'is not null') {
            if (x.prompt_name == this.columnName && x.value != null) {
              dataRows.push(data);
            }
          }
          else if (this.operatorName == 'like' || this.operatorName == 'contains') {
            if (x.prompt_name == this.columnName) {
              var v = x.value.includes(this.description);
              if (v) {

                dataRows.push(data);
              }
            }
          }
          else if (this.operatorName == 'not like' || this.operatorName == 'does not contains') {
            if (x.prompt_name == this.columnName) {
              var v = x.value.includes(this.description);
              if (!v) {

                dataRows.push(data);
              }
            }
          }

        }
      }

    }
    this.popOverCtrl.dismiss(JSON.parse(JSON.stringify(dataRows)));
  }

  // sendDatatoApex2(rows, desc, colName, operatr) {
  //   // this.databack.push(this.columnName);
  //   // this.databack.push(this.operatorName);
  //   // this.databack.push(this.description);
  //   // this.frames.tableRows=JSON.parse(JSON.stringify(this.tRows));
  //   let dataRows: any = [];
  //   let vals = this.pipemys.transform(JSON.parse(JSON.stringify(rows)), desc, colName);
  //   let trows = JSON.parse(JSON.stringify(vals));
  //   for (let data of trows) {
  //     console.log(data);
  //     for (let datax of data) {
  //       for (let x of datax) {
  //         let val = JSON.parse(JSON.stringify(x.value).trim());
  //         if (operatr == '=') {

  //           if (x.prompt_name == colName && val.includes(desc)) {
  //             dataRows.push(data);
  //           }
  //         }
  //         else if (operatr == '!=') {
  //           if (x.prompt_name == colName && x.value != desc) {
  //             dataRows.push(data);
  //           }
  //         }
  //         else if (operatr == 'is null') {
  //           if (x.prompt_name == colName && x.value == null) {
  //             dataRows.push(data);
  //           }
  //         }
  //         else if (operatr == 'is not null') {
  //           if (x.prompt_name == colName && x.value != null) {
  //             dataRows.push(data);
  //           }
  //         }
  //         else if (operatr == 'like' || operatr == 'contains') {
  //           if (x.prompt_name == colName) {
  //             var v = x.value.includes(desc);
  //             if (v) {

  //               dataRows.push(data);
  //             }
  //           }
  //         }
  //         else if (operatr == 'not like' || operatr == 'does not contains') {
  //           if (x.prompt_name == this.columnName) {
  //             var v = x.value.includes(desc);
  //             if (!v) {

  //               dataRows.push(data);
  //             }
  //           }
  //         }

  //       }
  //     }

  //   }
  //   this.maindata = (JSON.parse(JSON.stringify(dataRows)));
  //   // this.popOverCtrl.dismiss(JSON.parse(JSON.stringify(dataRows)));
  // }



}

