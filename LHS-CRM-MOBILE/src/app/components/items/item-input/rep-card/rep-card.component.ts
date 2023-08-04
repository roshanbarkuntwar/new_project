import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-rep-card',
  templateUrl: './rep-card.component.html',
  styleUrls: ['./rep-card.component.scss'],
})
export class RepCardComponent implements OnInit {

  @Input() rep_card: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  wsdp: any = [{}];
  frame: any = {};
  public show: boolean = false;
  public buttonName: any = 'md-add';
  userDetails: any;
  l_created_date: any;
  // l_row_count:any;
  l_message: any;
  wscp: any = {};
  l_where_str: any[];


  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService,
    public loadingController: LoadingController) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ngOnInit() {
    this.getCreatedDate();
  }

  toggle() {
    this.show = !this.show;
    if (this.show) {
      this.buttonName = "md-remove";
    }
    else { this.buttonName = "md-add" }
  }
  showLoader() {
    this.loadingController.create({
      message: 'Please wait..'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed!');
      });
    });
    this.hideLoader();
  }

  hideLoader() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 1000);
  }
  getCreatedDate() {
    let wscp: any = {};
    wscp.service_type = 'getCreatedDate';
    wscp.apps_page_frame_seqid = this.rep_card.apps_page_frame_seqid;
    wscp.object_code = this.rep_card.calling_object_code;

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {

      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        
        if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
          alert(objData.Level1[0].message);
        }
        else{
        if (objData.Level1[0]) {
          if (objData.Level1[0].CREATED) {
            console.log('this.frame.tableRows ', objData.Level1[0].CREATED);
            this.l_created_date = objData.Level1[0].CREATED;
            this.l_message = '(Last Updated: ' + this.l_created_date + ')';
          }
          else {
            this.l_message = '';
          }
        }
      }}
      

    }).catch(err => {
      console.log(err);
    })
  }

  getData() {
    this.globalObjects.showLoading();
    this.show = !this.show;
    if (this.show) {
      this.buttonName = "md-remove";
      let wscp: any = {};
      //wscp.service_type = "get_populate_data";
      // if (this.frame.on_frame_load_str) {


      wscp.service_type = this.rep_card.click_events_str;
      wscp.click_events_str = this.rep_card.click_events_str;
      // wscp.service_type = 'get_object_config';
      // wscp.click_events_str = 'get_object_config'
      wscp.apps_page_frame_seqid = this.rep_card.apps_page_frame_seqid;
      wscp.apps_item_seqid = this.rep_card.apps_item_seqid;
      wscp.object_code = this.rep_card.calling_object_code;
      this.wscp = wscp;

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": this.wsdp
      }



      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {

        let data: any = res;
        this.globalObjects.hideLoading();
        if (data.responseStatus == "success") {
          let objData = this.globalObjects.setPageInfo(data.responseData);
          // this.frame.tableRows=objData.Level1[0].Level2[0].Level3[0].Level4;
          this.frame.Level3 = objData.Level1[0].Level2[0].Level3;
          for(let x of this.frame.Level3){
            for(let y of x.Level4){
              if(y.Level5[0].item_filter_flag){
                x.hideextraframes=true;
              }
            }
          }
          console.log(this.frame)
         
        }
      }).catch(err => {
        console.log("this.frame canvas err");

        this.globalObjects.presentToast("1.13 Something went wrong please try again later!");
        console.log(err);
      })
    }
    else {
      this.buttonName = "md-add";
    }
  }


  buttonClick(event) {
    this.emitPass.emit(this.rep_card);
  }


  filerData(i) {
    let wsdp = [];
    let key = {};
    let query;
   
    let setdateplsql;
    let setbetweennumber;
    let setbetweennumberarray=[];
    let multilevelitemarray = [];
    for (let itemGroup of this.frame.Level3[i].Level4) {

      for (let item of itemGroup.Level5) {
        query = null;      
        setbetweennumber=null;
        let value;
        if (item.codeOfValues) {
          key[item.apps_item_seqid] = item.codeOfValues;
          value = item.codeOfValues
        } else if (item.value) {
          key[item.apps_item_seqid] = item.value;
          value = item.value
        }

        let colName: any = "";

        if (item.item_db_name) {
          colName = item.item_db_name
        } else {
          colName = item.item_name
        }

        let fromDate = null;
        if(item.from_date){
          fromDate = this.globalObjects.formatDate(item.from_date, "dd-MMM-yyyy");
        }
        
        let toDate = null;
        if(item.to_date){
          toDate = this.globalObjects.formatDate(item.to_date, "dd-MMM-yyyy");
        }

        if (item.item_sub_type == 'BETWEEN_NUMBER' && (fromDate != null) && (toDate != null)) {
           query = " and " + item.aliases + "." + colName + " between " + "to_date('" + fromDate + "','dd-mon-rrrr') and to_date('" + toDate + "','dd-mon-rrrr')";
          setbetweennumber = " and " + item.aliases + "." + colName + " between " + "to_number('" + fromDate + "') and to_number('" + toDate + "')"
        }
        //------------------------------------
        if (item.item_sub_type == 'ASON_DATE' && (value)) {
           query = " and " + item.aliases + "." + colName + item.dateType + " to_date('" + value + "','dd-mon-rrrr')";
          setdateplsql = " begin lhs_utility.set_to_Date(to_date('" + value + "','dd-mon-rrrr')); end;";
        } else if (item.item_sub_type == 'BETWEEN_DATE' && (fromDate) && (toDate) && item.tool_tip == 'DT') {
           query = " and " + item.aliases + "." + colName + " between " + "to_date('" + fromDate + "','dd-mon-rrrr') and to_date('" + toDate + "','dd-mon-rrrr')";
          setdateplsql = " begin lhs_utility.set_from_Date(to_date('" + fromDate + "','dd-mon-rrrr hh24:mi:ss')); lhs_utility.set_to_Date(to_date('" + toDate + "','dd-mon-rrrr hh24:mi:ss')); end;";
        } else if (item.item_sub_type == 'BETWEEN_DATE' && (fromDate) && (toDate)) {
           query = " and " + item.aliases + "." + colName + " between " + "to_date('" + fromDate + "','dd-mon-rrrr') and to_date('" + toDate + "','dd-mon-rrrr')";
          setdateplsql = " begin lhs_utility.set_from_Date(to_date('" + fromDate + "','dd-mon-rrrr')); lhs_utility.set_to_Date(to_date('" + toDate + "','dd-mon-rrrr')); end;";
       
        } 
       else if (item.item_sub_type == 'M' && (value)) {
        let valuearr = value.split(",");
          query = " and " + item.aliases + "." + colName + " in (";
          for (let val of valuearr) {
            query = query + "'" + val + "',";
          }
          query = query.substring(0, query.length - 1);
          query = query + ")";
        } else {
          if (value) {
            query = " and " + item.aliases + "." + colName + "=" + "'" + value + "'";
          }
        }
        if (query) {
          multilevelitemarray.push(query);
        }
        
        if(setbetweennumber){
          setbetweennumberarray += setbetweennumber ;
        }       
      }
    }
  
    wsdp.push(key);
    console.log(setdateplsql);
    this.frame.where_str = "";
    if(multilevelitemarray.length > 0){
    this.frame.where_str = multilevelitemarray;
    }
    this.frame.other_set_filters = "select 1 from dual";
    // this.frame.other_set_filters = "begin lhs_utility.set_entity_code('" + 
    //     this.userDetails.entity_code.trim() + "'); lhs_utility.set_div_code('" +
    //     this.userDetails.div_code.trim() + "'); begin lhs_utility.set_acc_code('" + 
    //     this.userDetails.acc_code.trim() + "'); exception when others then null; end; 
    //     lhs_utility.set_acc_year('" + this.userDetails.acc_year.trim() + "');
    //     lhs_utility.set_user_code('" + this.userDetails.user_code.trim() + "');end;"
        
     this.frame.setdateplsql = setdateplsql;
    if(setbetweennumberarray.length >0){
      this.frame.setbetweennumber = setbetweennumberarray;
    }
     
    // this.frame.date_filter = 

    this.frame.wsdp = multilevelitemarray;

     this.emitPass.emit(this.frame);
  }


  itemClicked(event, i) {
  
    if (event.click_events_str == 'process_report_data') {
      event.item_enable_flag = 'F';
      let wscp: any = {};
      let isValid = true;
      //wscp.service_type = "get_populate_data";
      // if (this.frame.on_frame_load_str) {
      wscp.service_type = event.click_events_str;
      wscp.click_events_str = event.click_events_str;
      wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      wscp.apps_item_seqid = event.apps_item_seqid;
      wscp.object_code = event.calling_object_code;
      this.filerData(i);
      if(this.frame.where_str.length > 0){
        wscp.where_str = this.frame.where_str.join(" ");
      }else{
        wscp.where_str = this.frame.where_str;
      }
      wscp.setdateplsql = this.frame.setdateplsql;
      wscp.setbetweennumber = this.frame.setbetweennumber;
      wscp.other_set_filters = this.frame.other_set_filters;

      let col = {};
      for (let itemGroup of this.frame.Level3[i].Level4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues;
              // console.log(item.item_name);
            }
            else if (item.item_sub_type == 'BETWEEN_DATE') {
              let fromDate = this.globalObjects.formatDate(item.from_date, "dd-MMM-yyyy");
              let toDate = this.globalObjects.formatDate(item.to_date, "dd-MMM-yyyy");
              col[item.apps_item_seqid] = fromDate + ' to ' + toDate;
              col["date_filter_type"] = item.filter_type;
            } else {
              console.log(item.item_name, item);
              // console.log(item.value);
              col[item.apps_item_seqid] = item.value;
            }
            if (item.isValid !== undefined && !item.isValid) {
              isValid = item.isValid
            }
          }
        }
      }
      event.wsdp = [];
      event.wsdp.push(col);
   
     
  //   let x:string = "";
  //   if(this.frame.wsdp.length >1){
  //   for (let data1 of this.frame.wsdp) {
  //     console.log(data1)
  //     x += data1 + "  ";
  //   }
  //     wscp.where_str=x;
  // }else{
  //   x=this.frame.wsdp;
  //   wscp.where_str=x;
  // }

  
  
      // event.wsdp.push(this.frame.wsdp);


      console.log('event.wsdp ', this.frame.wsdp);

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": event.wsdp
      }

      this.globalObjects.showLoading();

      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {
        this.globalObjects.hideLoading();
        let data: any = res;
        if (data.responseStatus == "success") {
          console.log('vijay data  ', data)
          let objData = this.globalObjects.setPageInfo(data.responseData);
          if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
            alert(objData.Level1[0].message);
          }
        }
        this.buttonName = "md-add";
        this.show = !this.show;
        this.globalObjects.hideLoading();
        this.getCreatedDate();

      }).catch(err => {
        console.log("this.frame canvas err");
        this.globalObjects.hideLoading();
        this.globalObjects.presentToast("1.14 Something went wrong please try again later!");
        console.log(err);
        alert(err);
      })
    }
  }


}
