import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { IonDatetime, Platform } from '@ionic/angular';
import { AngularMyDatePickerDirective, IAngularMyDpOptions, IMyDateModel, IMyDate } from 'angular-mydatepicker';
// import { IAngularMyDpOptions, AngularMyDatePickerDirective, IMyDateModel } from 'angular-mydatepicker/public-api';




@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
})
export class DateInputComponent implements OnInit {
  @ViewChild('dp') myDp: AngularMyDatePickerDirective;
  myDatePickerOptions: IAngularMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    dateRange: false,
  //   disableDateRanges: [{
  //     begin: {year:2020, month: 12, day: 1}, 
  //     end: {year: 2021, month: 1, day: 31}
  // }]
  minYear:1950,
  maxYear:2050
}

month = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sepr", "Oct", "Nov", "Dec" ];
  @Input() dateinput: any;
  @Input() frame_type: any;
  platformValue: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnBlur: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  dateTimeFormat :any;
  public val: any ;
 
  from_value: any='1950';
  to_value: any='2051';
  
  constructor(public datepipe: DatePipe, private datePicker: DatePicker, public globalservice: GlobalObjectsService,public platform:Platform,
    private cdr: ChangeDetectorRef) {

  }

  clearBrowserData(){
    //this.myDp.clearDate();
    this.dateinput.value="";
    if(this.dateinput.position=='floating' && this.dateinput.item_sub_type=='D'  &&  this.platformValue == 'browser'){
      let obj : any={
        "position":"absolute"
       }
      
     this.dateinput.labelStyle=obj;
   
     
   }
  
  }
 
  ngOnInit() {   
   if(this.platform.is("android")){
     this.platformValue="android";
   }else if(this.platform.is("ios")){
      this.platformValue="ios";
   }else{
     this.platformValue="browser";
     
   }
   if(this.dateinput.position=='floating' && this.dateinput.item_sub_type=='D'  &&  this.platformValue == 'browser'){
     let obj : any={
       "position":"absolute"
      }
      if(this.dateinput.value){
       obj.top = "-18px";
      }
    this.dateinput.labelStyle=obj;
  }
  if(this.dateinput.position=='floating' && this.dateinput.item_sub_type=='DT'  &&  this.platformValue == 'browser'){
    let obj;
    if(this.dateinput.value){
          obj={
            "margin-bottom":"0px"
          }
    }else{
       obj={
        "margin-bottom":"5px"
      }
    }
    this.dateinput.labelStyle=obj;
  }
  //  from value to value code start 
  
    //  Ion-Datetime
   if ((this.dateinput.item_sub_type == 'DT') && this.platformValue != 'android') {
     if(this.dateinput.to_value){
       this.to_value=this.dateinput.to_value;
     }
     if(this.dateinput.from_value){
      this.to_value=this.dateinput.from_value;
    }
   }
   //plugin
   if ((this.dateinput.item_sub_type == 'D') && this.platformValue == 'browser') {
    if(this.dateinput.to_value){
     this.myDatePickerOptions.maxYear=JSON.parse(this.dateinput.to_value);
    }
    if(this.dateinput.from_value){
     this.myDatePickerOptions.minYear=JSON.parse(this.dateinput.from_value);
   }
  }
  // ion-date date
  if ((this.dateinput.item_sub_type == 'D') && this.platformValue == 'ios') {
   
    if(this.dateinput.from_value){
     this.from_value=this.dateinput.from_value;
   }
   if(this.dateinput.to_value){
    this.to_value=this.dateinput.to_value;
   }
  }
   //  from value to value code end

    if (this.dateinput.value && this.dateinput.item_sub_type == 'D' && this.platformValue == 'browser') {

      let d = this.globalservice.formatDate(this.dateinput.value, 'yyyy-MM-dd');
      
      this.dateinput.Dvalue={isRange: false, singleDate: {jsDate: new Date(d)}};
    }
    else if (this.dateinput.value && this.dateinput.item_sub_type == 'DT' && this.platformValue == 'browser') {
      this.dateTimeFormat = this.globalservice.formatDate(this.dateinput.value, "yyyy-MM-ddTHH:mm");
      this.dateinput.value = this.globalservice.formatDate(this.dateinput.value, "dd-MMM-yyyy HH:mm:ss");
  
    }else{
      this.val = this.dateinput.value; 
    }
    this.current_page_parameter = this.globalservice.current_page_parameter;
    console.log("dateinput", this.dateinput)
    this.showdate();

  }
  toggleCalendar(): void {
    if(this.dateinput.item_enable_flag =="T"){

      this.cdr.detectChanges();
      let ree = this.myDp.toggleCalendar();
     console.log(ree);
    }
   
  }


  onChange() {
    if(this.dateinput.position=='floating'  && this.dateinput.item_sub_type == 'D'  &&  this.platformValue == 'browser'){
    let obj={
      "position":"absolute",
      "top":"-18px"
    }
    this.dateinput.labelStyle=obj;
  }
  if(this.dateinput.position=='floating'  && this.dateinput.item_sub_type == 'DT'  &&  this.platformValue == 'browser'){
    let obj={
     "margin-bottom":"0px"
    }
    this.dateinput.labelStyle=obj;
  }

       
    if (this.dateinput.item_sub_type == 'D' && this.platformValue == 'browser' && this.frame_type != 'ENTRY_TABLE') { 
      let datevalue;
      if(this.dateinput.Dvalue){
      
        datevalue=this.dateinput.Dvalue.singleDate.date.day +"-"+ this.month[this.dateinput.Dvalue.singleDate.date.month-1] +"-"+ this.dateinput.Dvalue.singleDate.date.year;
        this.dateinput.value=datevalue;
        
      }
    }
    else  if (this.dateinput.item_sub_type == 'D' && this.platformValue == 'browser' && this.frame_type == 'ENTRY_TABLE') { 
      if(this.dateinput.value){
        let dateFormat = this.globalservice.formatDate(this.dateinput.value, "yyyy-MM-dd");
        this.dateinput.value = this.globalservice.formatDate(dateFormat, "dd-MMM-yyyy");
      }
    }
    else if (this.dateinput.item_sub_type == 'T' && this.platformValue == 'browser') {
      //this.dateinput.value = this.globalservice.formatDate(this.dateinput.value, "HH:mm:ss");
    }
    else if (this.dateinput.item_sub_type == 'DT' && this.platformValue == 'browser') {
      this.dateTimeFormat = this.globalservice.formatDate(this.dateinput.value, "yyyy-MM-ddTHH:mm");
      this.dateinput.value = this.globalservice.formatDate(this.dateTimeFormat, "dd-MMM-yyyy HH:mm:ss");
    }
    else if (this.dateinput.item_sub_type == 'DT' && this.platformValue == 'ios') {
      this.dateTimeFormat = this.globalservice.formatDate(this.dateinput.value, "yyyy-MM-ddTHH:mm");
      this.dateinput.value = this.globalservice.formatDate(this.dateTimeFormat, "dd-MMM-yyyy HH:mm:ss");
    }
    else if (this.dateinput.item_sub_type == 'D' && this.platformValue == 'ios') {
      this.dateinput.value = this.globalservice.formatDate(this.dateinput.value, "dd-MMM-yyyy");
    } if (this.dateinput.item_sub_type == 'D' && this.frame_type == 'ENTRY_TABLE' && this.platformValue == 'browser') {
      this.dateinput.value = this.globalservice.formatDate(this.dateinput.value, "dd-MMM-yyyy");
    }
    console.log(this.dateinput.value);
    if(this.dateinput.value && this.dateinput.value.indexOf('Sepr')){
     this.dateinput.value= (this.dateinput.value).replace('Sepr','Sep')
    
    }
   if(this.dateinput.value){
     let blurDate = new Date(this.dateinput.value)
     this.dateinput.blurValue = blurDate.getTime()  ;
     this.emitOnChange.emit(this.dateinput)
   }
    // setTimeout(()=>{

    //   if(this.dateinput.on_blur && this.dateinput.value){
    //     this.emitOnBlur.emit(this.dateinput)
    //   }
    // },500)
  }

  showdate() {
 
    if (this.dateinput.item_enable_flag && (!(this.dateinput.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.dateinput.item_enable_flag == 'F'))) {

      let t; let f;
      if (this.dateinput.to_value) {
        t = new Date(new Date().getTime() + (parseInt(this.dateinput.to_value) * 24 * 60 * 60 * 1000)).getTime();
      }
      if (this.dateinput.from_value) {
        f = new Date(new Date().getTime() + (parseInt(this.dateinput.from_value) * 24 * 60 * 60 * 1000)).getTime();
      }
      this.dateinput.to_value = t;
      this.dateinput.from_value = f;
      if (this.platformValue == 'browser' || this.platformValue == 'ios') {
        if (this.dateinput.to_value) { this.to_value = this.globalservice.formatDate(t, "yyyy-MM-dd"); }
        if (this.dateinput.from_value) { this.from_value = this.globalservice.formatDate(f, "yyyy-MM-dd"); }
      }
    }
  }

  showDateTimepicker() {
    // alert('dt picker')
    // if (this.dateinput.item_enable_flag == 'F') {
    if (this.dateinput.item_enable_flag && (!(this.dateinput.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.dateinput.item_enable_flag == 'T'))) {
      this.datePicker.show({
        date: new Date(),
        mode: 'datetime',
        minDate: this.dateinput.from_value,
        maxDate: this.dateinput.to_value,
        is24Hour: true,
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      }).then(
        date => {
          this.dateinput.value = "";
          var dateVal = "";
          dateVal = this.globalservice.formatDate(date, 'dd-MMM-yyyy HH:mm:ss');
          this.dateinput.value = dateVal;
        },
        err => console.log('Error occurred while getting datetime: ' + err)
      );
    }
  }


  showDatepicker(dateinput) {
    // alert("it is ")
    // if (this.dateinput.item_enable_flag == 'F') {
    if (this.dateinput.item_enable_flag && (!(this.dateinput.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.dateinput.item_enable_flag == 'T'))) {
      this.datePicker.show({
        date: new Date(),
        mode: 'date',
        minDate: this.dateinput.from_value,
        maxDate: this.dateinput.to_value,
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      }).then(
        date => {

          this.dateinput.value = "";
          var dateVal = "";
          dateVal = this.globalservice.formatDate(date, 'dd-MMM-yyyy');
          this.dateinput.value = dateVal;

        },
        err => console.log('Error occurred while getting datetime: ', err)
      );
    }
  }
  showtimepicker(dateinput) {
    // if (this.dateinput.item_enable_flag == 'F') {
    if (this.dateinput.item_enable_flag && (!(this.dateinput.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.dateinput.item_enable_flag == 'T'))) {
      this.datePicker.show({
        date: new Date(),
        mode: 'time',
        is24Hour:true,
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      }).then(
        date => {
          this.dateinput.value = "";
          var dateVal = "";
          dateVal = this.globalservice.formatDate(date, 'HH:mm:ss');
          this.dateinput.value = dateVal;

        },
        err => console.log('Error occurred while getting datetime: ' + err)
      );
    }
  }

  DateChanged(temp_date) {
    if (temp_date) {
      this.dateinput.value = this.globalservice.formatDate(temp_date, 'dd-MMM-yyyy');
    } else {
      this.dateinput.value = null;
    }
    // alert(this.dateinput.value)
  }
  clear() {
    this.dateinput.value = "";
  }


  onBlur(){
    // if(this.dateinput.on_blur && this.dateinput.value){
    //   this.emitOnBlur.emit(this.dateinput)
    // }
  }
 
}


