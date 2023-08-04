import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
// import { createOfflineCompileUrlResolver } from '@angular/compiler';

@Component({
  selector: 'app-multi-level-tab',
  templateUrl: './multi-level-tab.page.html',
  styleUrls: ['./multi-level-tab.page.scss'],
})
export class MultiLevelTabPage implements OnInit {
  // @Input() frame: any = {};
  @Input() wsdp: any = {};
  // @Input() wscp: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  multilevelitemarray: any = [];
  multiselectarray: any = [];
  userDetails: any;
  tableheading: any = [];
  pagetabIndex: number = 0;
  public show_filter: any = 'dontshow';
  checkboxdata: any = [];
  chekdata: any = [];
  tabdetail: any = {};
  tabdetailarray: any = []
  lastelementoftab: any = [];
  counter: number;
  filterFormData: any = [];
  thead: any = [];
  tabheading: any;
  wscp: any;
  object_arr: any;
  object_mast: any;
  selectedTab: any = 1;
  tabHeadings: any = [];
  allTabData: any = [];
  searchText;
  noOfrows: number = 0;
  changetab: number = 0;
  selecttruevalue: any = [];
  selecttruevalue0: any = [];
  flag_for_chip:boolean=false;
  myarray: any = [];
  array0: any = [];
  framelength: number;
  multilevelselecttabarray:any=[];

  constructor(private globalObjects: GlobalObjectsService, public modalCtrl: ModalController, private dataService: DataService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    this.getObjectConfigData();

  }

  segmentChanged(event) {
    console.log(event.detail.value);
    this.selectedTab = event.detail.value;
  }


  getObjectConfigData() {
  
    let wscp: any = this.wscp;
    wscp.service_type = "get_object_config";
    wscp.from_row = "1";
    wscp.to_row = "80";
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp

    }

    this.dataService.postData("S2U", reqData).then(res => {
      this.globalObjects.hideLoading();
      let data: any = res;
      if (data.responseStatus == "success") {
        this.object_arr = data.responseData;
        let objData = this.globalObjects.setPageInfo(data.responseData);
        this.object_mast = objData.Level1[0].Level2[0].Level3[0]

        // for (let itemGroup of this.object_mast.Level4) {
        //   let itemMast: any = [];
        //   for (let item of itemGroup.Level5Values) {
        //     let item1 = {};
        //     let count = 0;
        //     for (let key of itemGroup.Level5Keys) {
        //       item1[key] = item[count];
        //       count++;
        //     }
        //     itemMast.push(item1);
        //   }
        //   itemGroup.Level5 = itemMast;
        //   delete itemGroup['Level5Keys'];
        //   delete itemGroup['Level5Values'];
        // }
      }

      this.getHeaderData();

    })
    // this.gettheData(12, 14, 2);
  }

  getHeaderData() {
    for (let itemGroup of this.object_mast.Level4) {
      for (let item of itemGroup.Level5) {
        if (item.group_no_str) {
          this.tabHeadings.push(item.group_no_str);
        }
      }
    }
    // console.log(this.tabHeadings);
    this.tabHeadings = this.tabHeadings.filter((item, i, ar) =>{
      if(ar.indexOf(item) === i){
        return item
      }
    } );
    this.selectedTab = this.tabHeadings[0];
    for (let h of this.tabHeadings) {
      this.allTabData.push({ tabHeadings: h })
    }

    for (let itemGroup of this.object_mast.Level4) {
      for (let item of itemGroup.Level5) {
        if (this.tabHeadings.indexOf(item.group_no_str) > -1) {
          if (this.allTabData[this.tabHeadings.indexOf(item.group_no_str)].frame) {
            this.allTabData[this.tabHeadings.indexOf(item.group_no_str)].frame.push(itemGroup);
          } else {
            this.allTabData[this.tabHeadings.indexOf(item.group_no_str)].frame = [];
            this.allTabData[this.tabHeadings.indexOf(item.group_no_str)].frame.push(itemGroup);
          }
        }
      }
    }
    this.paginate(this.pagetabIndex, 1)
    // for (let itemGroup of this.object_mast.Level4) {
    //   let filterFlag = false;
    //   for (let itemMast of itemGroup.Level5) {
    //     if (itemMast.item_filter_flag) {
    //       filterFlag = true;
    //     }
    //     if (itemMast.item_visible_falg == 'F' || itemMast.item_type.indexOf('WHERE') > -1) { } else {
    //       this.thead.push(itemMast.prompt_name)
    //     }
    //   }
    //   if (filterFlag) {
    //     this.filterFormData.push(itemGroup);
    //   }

    // }


    // console.log("alltaabbbbbbb", this.allTabData);

    this.paginate(0, 1)
    // console.log(unique);
  }

  paginate(tabIndex, a_current_page: number = 1) {

    let l_total_pages = Math.ceil(this.allTabData[tabIndex].l_total_rows / this.allTabData[tabIndex].no_of_records);
    let L_total_pages = this.allTabData[tabIndex].l_total_rows / this.allTabData[tabIndex].no_of_records;
    if (a_current_page < 1) {
      a_current_page = 1;
    } else if (a_current_page > l_total_pages) {
      a_current_page = l_total_pages;
    }

    let l_from_row: number = null;
    let l_to_row: number = null;

    if (l_total_pages > 0 && a_current_page == 1) {
      l_to_row = Math.ceil(this.allTabData[tabIndex].l_total_rows / L_total_pages);
    }
    else {
      l_to_row = Math.ceil(this.allTabData[tabIndex].l_total_rows / L_total_pages) * a_current_page;
    }

    l_from_row = Math.ceil((l_to_row - this.allTabData[tabIndex].no_of_records)) + 1;

    this.allTabData[tabIndex].c_from_row = l_from_row;
    this.allTabData[tabIndex].c_to_row = l_to_row;


    // if (a_current_page!=1){
    //   this.l_total_remain_pages=Math.ceil(this.l_total_rows / this.frame.no_of_records)-(this.c_to_row-this.frame.no_of_records);
    // }
    // this.getData(l_from_row, l_to_row, a_current_page);

    // this.getTabData(tabIndex, l_from_row, l_to_row, a_current_page);
    this.getTabData(tabIndex, 1, 100, a_current_page);

  }


  selectTab(heading, i) {
    console.log("select_tab",heading+"_"+i+"_")

    this.myarray.push( this.multilevelitemarray);
    console.log("this.myarray....>>>", this.myarray);
    this.multilevelitemarray = [];
    this.selecttruevalue = [];
    this.selecttruevalue0 = [];
    console.log("heading", heading + "_" + i);
    this.paginate(i, 1);
    this.pagetabIndex = i;
    this.tabheading = heading;

  }

  getTabData(tabIndex, a_from_row: number, a_to_row: number, a_currentPage: number) {
    let wscp: any = this.wscp
    wscp.service_type = "frame_sql_populate_data";
    wscp.from_row = String(a_from_row);
    wscp.to_row = String(a_to_row);
 
    if (this.myarray) {
      let array: any = [];
      for (let x of this.myarray) {


        for (let xvalues of x) {

          array.push(xvalues)

        }
      }

      wscp.where_str = String(array);
      wscp.where_str = array.join(" ");
      // this.myarray=[];
      console.log("wscp join>>>>>>>     ", wscp.where_str)
    }

    // wscp.apps_page_frame_seqid = this.allTabData[tabIndex].frame.apps_page_frame_seqid;
    wscp.group_no_str = this.allTabData[tabIndex].tabHeadings
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }
   

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      this.globalObjects.hideLoading();

      let data: any = res;
      // console.log("data....>>>", data)
      if (data.responseStatus == "success") {

        let tableRows = [];

        // let tableData = data.responseData.Level1;
        // let tableKey = Object.keys(tableData[0])

        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        let tableKey = Object.keys(tableData[0])
        console.log("tabledata..>>>>", tableData)


        this.allTabData[tabIndex].l_total_rows = tableData[0].TOTAL_ROWS;
        let frameLevel4;
        for (let table of tableData) {
          // console.log("table.in multilevel.>>", table)
          frameLevel4 = JSON.parse(JSON.stringify(this.allTabData[tabIndex].frame))
          // console.log("frameLevel4", frameLevel4)
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if (item.item_name.toUpperCase() == key.toUpperCase()) {
                  item.value = table[key]
                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }
        for (let itemGroup of frameLevel4) {
          let filterFlag = false;
          for (let Level5 of itemGroup.Level5) {
            if (Level5.item_filter_flag) {
              filterFlag = true;

            }
            if (Level5.item_visible_falg == 'T' || Level5.item_type.indexOf('WHERE') > -1) { } else {
              this.thead.push(Level5.prompt_name);
            }
          }
          if (filterFlag) {
            this.filterFormData.length = 0;
            this.filterFormData.push(itemGroup)
          }

        }
        this.allTabData[tabIndex].frame.tableRows = tableRows;
        console.log("this.frame");
        console.log(this.allTabData[tabIndex]);
        this.allTabData[tabIndex].l_current_page = a_currentPage;
        this.noOfrows = this.allTabData[this.pagetabIndex].l_total_rows
        this.framelength = this.allTabData[tabIndex].frame.length;
   }
    }).catch(err => {
      this.globalObjects.hideLoading();
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      console.log(err);
    })
  }
  closeModal() {
    this.modalCtrl.dismiss();

  }
  filterToggle() {
    if (this.show_filter == 'show') {
      this.show_filter = 'dontshow';
    }
    else {
      this.show_filter = 'show';
    }
  }
  count1: number;
  checkboxselect(events, j, tabindex) {
    this.counter = 0;
    this.tabdetail = this.allTabData[this.pagetabIndex].frame.tableRows;
    let tabarray = [];
    tabarray.push(this.tabdetail)

    tabarray.forEach((item, i) => {

      item.id = this.pagetabIndex;
    });
    let dataarray: any = {};
    dataarray = tabarray[tabarray.length - 1]
    this.tabdetailarray[tabindex] = (dataarray);
    this.counter = tabindex;
    // alert( this.tabdetailarray.length)
    if (events.detail.checked == true) {
      this.checkboxdata.push(this.allTabData[this.pagetabIndex].frame.tableRows[j])
    }
    if (events.detail.checked == false) {
      this.checkboxdata.pop(j)
    }
  }
  get_checkboxdetail() {
    let checkboxdetail: any = []
    checkboxdetail = this.tabdetailarray;
    console.log("checkboxdetail", checkboxdetail)

  }

  selectremove(j,itemchecked,tabIndex,chipid) {
    // this.selecttruevalue0.splice(p, 1);
    
    this.flag_for_chip=true;
    console.log( j+"____"+itemchecked+"____" +tabIndex+"____"+chipid)
    this.selecttruevalue.splice(chipid,1);
    this.selectitem(j, itemchecked, tabIndex,chipid);
    this.flag_for_chip=false;
  }
  selectitem(j, itemchecked, tabIndex,itemarray) {
    console.log( j+"____"+itemchecked+"____" +tabIndex+"____"+itemarray)
    
    this.multilevelselecttabarray=[];
    let arr: any = [];
    let selectfalsevalue: any = {};
    
    // alert(this.framelength);
  //  console.log(tabIndex + "__" + itemchecked + "__" + this.framelength)
  //  console.log(j + "__" + itemchecked);
    this.multiselectarray[this.pagetabIndex] = this.allTabData[this.pagetabIndex].frame.tableRows;
    if(this.flag_for_chip==true){
      this.allTabData[this.pagetabIndex].frame.tableRows[j][itemchecked].Level5[0].isChecked= false;
     }
    if (this.allTabData[this.pagetabIndex].frame.tableRows[j][itemchecked].Level5[0].isChecked == false) {
      var aliases = (this.allTabData[this.pagetabIndex].frame.tableRows[j][itemchecked].Level5[0].aliases);
      var itemname = (this.allTabData[this.pagetabIndex].frame.tableRows[j][itemchecked].Level5[0].item_name);
      let itemvalue = (this.allTabData[this.pagetabIndex].frame.tableRows[j][itemchecked].Level5[0].value);
      let obj: any = {};
      obj[itemchecked] = (itemvalue);
      selectfalsevalue = obj;
      let count: number = 0;
      // this.selecttruevalue0 =  this.selecttruevalue0.filter(val => selectfalsevalue==(val));
      for (let x of this.selecttruevalue0) {

        if (Object.values(x).toString() == Object.values(obj).toString()) {
          this.selecttruevalue0.splice(count, 1);
        }
        count++;
      }
      let countforchip: number = 0;
          alert(itemvalue)
          if(this.flag_for_chip==false){
        for(let x of this.selecttruevalue){
         
          if(x.value==itemvalue){
           
            this.selecttruevalue.splice(countforchip,1);
          }
          countforchip++;
        }
      }
       
     
      console.log("false in selecttruevale0...",this.selecttruevalue0)
      console.log("select....",this.selecttruevalue)
    }
    if (this.allTabData[this.pagetabIndex].frame.tableRows[j][itemchecked].Level5[0].isChecked == true) {
     
      var aliases = (this.allTabData[this.pagetabIndex].frame.tableRows[j][itemchecked].Level5[0].aliases);
      var itemname = (this.allTabData[this.pagetabIndex].frame.tableRows[j][itemchecked].Level5[0].item_name);
      var itemvalue = (this.allTabData[this.pagetabIndex].frame.tableRows[j][itemchecked].Level5[0].value);
      let array1: any = {};
      array1[itemchecked] = (itemvalue);
      let additem:any={
        j: j,
        itemchecked: itemchecked,
        tabindex: tabIndex,
        value:itemvalue
      };
      
      this.selecttruevalue.push(additem);
      console.log("this.selecttruevalue ....aditem..",this.selecttruevalue);
      this.selecttruevalue0.push(array1);
      console.log("selecttruevalue0.......",  this.selecttruevalue0);
     
    }
    for (let item of this.selecttruevalue0) {
      var y = Object.keys(item);
      const z = parseInt(y[0]);
      if (arr[z]) {
        arr[z].push(Object.values(item));
      } else {
        arr[z] = [];
        arr[z].push(Object.values(item));
      }
    }
    if(arr[itemchecked]){
      // console.log("itemchecked//////",arr[itemchecked])

      arr[itemchecked] = arr[itemchecked].map(i => "'" + i + "'");
      this.multilevelitemarray[itemchecked] = (" and " + aliases + "." + itemname + " " + "in" + " " + "(" + arr[itemchecked] + ")");
    }
   else {
    this.multilevelitemarray[itemchecked] =[];
    this.multilevelitemarray[itemchecked].pop();
   } 
   console.log("this.multilevelitemarray[itemchecked]...>>>",this.multilevelitemarray)
  }

  clearSelected() {
    for (let x of this.multiselectarray[this.pagetabIndex]) {
      console.log("x....",x)
      for (let y of x) {
        for (let item in y.Level5[0]) {
          if (item == 'isChecked') {
            y.Level5[0][item] = false;
          }
        }
      }
    }
    this.clearArray();
   console.log("this.multilevelitemarray", this.multilevelitemarray)
  }

  clearArray() {
    var count: number = 0;
    let arr: any = []
    if (this.multiselectarray[this.pagetabIndex]) {
      var index = this.pagetabIndex;
      for (let x of this.multilevelitemarray) {
        if (x.charAt(0) == index) {
          this.multilevelitemarray.splice(count, 1);
          this.clearArray();
        }
        count++;
      }
    }


  }

  clearalldata() {
    this.selecttruevalue.splice(0, this.selecttruevalue.length)
    this.clearSelected();
    this.multilevelitemarray = [];
  }
}
