import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Router } from '@angular/router';
import { Events, MenuController, NavController, Platform } from '@ionic/angular';
import { CacheService } from "ionic-cache";
import { Device } from '@ionic-native/device/ngx';
import { environment } from '../../../environments/environment';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-appkey-validation',
  templateUrl: './appkey-validation.page.html',
  styleUrls: ['./appkey-validation.page.scss'],
})
export class AppkeyValidationPage implements OnInit {
  // device: any = {};
  appkey: any;
  disableFlag: boolean = false;
  autocompleteItems = [];
  showAuto:boolean = false;
  searchedAppKey = [];
  serverName = "lhs";
  constructor(public globalObjects: GlobalObjectsService, private router: Router,public events: Events,
    public menuCtrl: MenuController, private navCtrl: NavController, public httpClient: HttpClient,
    cache: CacheService, private device: Device, private dataService: DataService, private plt: Platform) {
    cache.setDefaultTTL(60 * 60 * 60); //set default cache TTL for 1 day
    // private device: Device,

    //----------------------start------------------

    if (this.globalObjects.getLocallData("userDetails")) {
      let userData = this.globalObjects.getLocallData("userDetails");
      this.dataService.userStatuses();
     // this.navCtrl.navigateRoot('super');
    } else {
      if (!this.globalObjects.getLocallData("isAppLaunch")) {
        // this.router.navigate(['appkey-validation']);
        this.menuCtrl.enable(false);
      }

      // else {
      //   // this.router.navigate(['login']);
      //   this.navCtrl.navigateRoot('login');
      // }
    }
    //----------------------end--------------------
  }

  ngOnInit() {
    this.menuCtrl.enable(false)
    this.globalObjects.simpleLoginProcess =true;
    this.plt.ready().then(()  =>{
      let appkeyGpsFlag = this.globalObjects.getLocallData("appkeyGpsFlag");
    if((this.plt.is('android') || this.plt.is('ios')) && !appkeyGpsFlag ){
      this.globalObjects.checkGPSPermission();
      this.globalObjects.setDataLocally("appkeyGpsFlag", "T");
    }else{
      this.globalObjects.geoLocation();
    }
  })


  this.searchedAppKey =  this.globalObjects.getLocallData("autoAppKey") ? this.globalObjects.getLocallData("autoAppKey") : [];
  // this.save("l.lweberp");
 
  }
  ngOnDestroy() {
    this.menuCtrl.enable(true); 
  }


  save(appkey) {
    this.disableFlag = true;
    
    // var url = "http://192.168.100.195:8080/DynamicAppWS/webService/getServerDetails?appKey=" + appkey +
    // var url = "http://203.193.167.118:8888/DynamicAppWSV3/webService/getServerDetails?appKey=" + appkey +
    //   "&device_id=" + this.device.uuid + "&device_name=" + this.device.model;
    console.log(appkey);

    let appkeyTryCount = this.globalObjects.getLocallData("appkeyTryCount");
    this.globalObjects.setDataLocally("appkeyTryCount", appkeyTryCount + 1);
    let lockTime = this.globalObjects.getLocallData("appkeyLockTime");
    let expiryTime: any;
    if (lockTime != null && lockTime != "") {
      let lockTime1: any = new Date(lockTime);
      let now: any = new Date();
      expiryTime = Math.abs((lockTime1.getTime() - now.getTime()) / 60000);
    }

    if (appkeyTryCount < 3) {
      if (appkeyTryCount == 2) {
        this.globalObjects.setDataLocally("appkeyLockTime", new Date());
      }
      this.precessRequest(appkey);
    } else if (expiryTime > 10) {
      this.globalObjects.destroyLocalData("appkeyTryCount");
      this.globalObjects.destroyLocalData("appkeyLockTime");
      this.precessRequest(appkey);
    } else {
      this.disableFlag = false;
      this.globalObjects.presentToastWithOptions(`You have exceeded unsuccessful attempt. Please try after ${Math.round(10 - expiryTime)} minutes.`, "errorClass");
    }

    // postData(url, data) {
    //   return new Promise((resolve, reject) => {
    //     var l_url = this.globalObjects.getScopeUrl() + url;
    //     this.http.post(l_url, data)
    //       .subscribe(data => {
    //         resolve(data);
    //       }, err => {
    //         reject(err);
    //       })
    //   })
    // }


  }


  precessRequest(appkey) {
    
    let base_url = "getServerDetails";
    // let base_url = "http://192.168.100.149:8888/lhsws/getServerDetails";
    // let base_url = "http://192.168.100.233/lhsws/getServerDetails";
    // let base_url = "http://ars-alb-338143226.ap-south-1.elb.amazonaws.com:8080/lhsws/getServerDetails";
    console.log(base_url);
    // if (this.globalObjects.getOnlineStatus) {
    let platform;
    if (this.plt.is("android")) {
      platform = "android";
    } else if (this.plt.is("ios")) {
      platform = "ios";
    } else {
      platform = "browser";
    }
    var data = {
      "parameters": {
        "appKey": appkey,
        "device_id": this.device.uuid,
        "device_name": this.device.model,
        "platform": platform
      }
    }
    // this.globalObjects.showLoading();

    this.getAppkeyData(base_url, data).then(data => {
      
      console.log("data in AppKeyValidate..", data)

      var resData: any = data;
      var responseData = resData.responseData;
      var responseMsg = resData.responseMsg;
      // this.globalObjects.hideLoading();
      if (resData.responseStatus == "success") {
        var msg = responseMsg.split("#");

        let existKey = this.searchedAppKey.find(x => x == appkey);
        if(existKey){}else{
          this.searchedAppKey.push(appkey);
        }

        this.globalObjects.setDataLocally("autoAppKey",this.searchedAppKey);
        this.globalObjects.parentAppkey = appkey;
        this.globalObjects.setDataLocally("parentAppkey",appkey);

        // alert(resData.dbName);
        if(this.plt.is('android') || this.plt.is('ios')){
          this.events.publish('generateToken');
        }

        if ((msg[0] == "T") || (msg[0] == "F") || (responseMsg.charAt(1) != "#")) {
          var server_url = "";
          var server_url2 = "";
          var server_url3 = "";
          var server_url4 = "";
          
          if(responseData.serverUrl && responseData.serverUrl.indexOf('http') > -1){
            server_url = responseData.serverUrl + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }else{
            server_url = "http://" + responseData.serverUrl + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }
          
          if(responseData.server_url2 && responseData.server_url2.indexOf('http') > -1){
            server_url2 =  responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }else{
            server_url2 = "http://" + responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }
          if(responseData.server_url3 && responseData.server_url3.indexOf('http') > -1){
            server_url3 = responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }else{
            server_url3 = "http://" + responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }
          if(responseData.server_url4 && responseData.server_url4.indexOf('http') > -1){
            server_url4 = responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }else{
            server_url4 = "http://" + responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }

          //  this.validateObjects(server_url, appkey).then((res: any) => {
          // if (res.responseStatus == "Success") {
          //=----------------------------------------------
          /*  if(!this.globalObjects.getLocallData("loginDate")){
             this.globalObjects.setDataLocally("loginDate", new Date());
           } */
          var appData: any = {};
          appData.app_name = resData.responseData.app_name;
          appData.appkey = appkey.toUpperCase();
          appData.loginFlag = resData.responseData.loginFlag;

          // alert(appkey.toUpperCase());
          appData.resData = resData.responseData;
          var appArr: any = this.globalObjects.getLocallData("appData");
          if (appArr) {
            let isExsist = false;
            for (let app of appArr) {
              if (app.appkey.toUpperCase() == appkey.toUpperCase()) {
                app = JSON.parse(JSON.stringify(appData));
                isExsist = true;
              }
            }
            if (!isExsist) {
              appArr.push(appData);
            }
            this.globalObjects.setDataLocally("appData", appArr);
          } else {
            appArr = [];
            appArr.push(appData);
            this.globalObjects.setDataLocally("appData", appArr);
          }
          //=----------------------------------------------
          this.globalObjects.setDataLocally("appKey", appkey); 
          
          this.globalObjects.setDataLocally("appCode", responseData.appcode);
          this.globalObjects.setDataLocally("webapplink", responseData.webapplink);
          if(responseData.tenantId){
            this.globalObjects.setDataLocally("tenantId", responseData.tenantId);
          }else{
            this.globalObjects.setDataLocally("tenantId", responseData.dbName);
          }

          if(responseData.default_theme){
            this.globalObjects.appTheme = responseData.default_theme;
            this.globalObjects.setDataLocally("theme", responseData.default_theme);
          }

          // var server_url2 = "http://" + responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          // var server_url3 = "http://" + responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          // var server_url4 = "http://" + responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          this.globalObjects.setDataLocally("isAppLaunch", true);
          this.globalObjects.setDataLocally("scopeUrl", server_url);
          this.globalObjects.setDataLocally("server_url1", server_url);
          this.globalObjects.setDataLocally("server_url2", server_url2);
          this.globalObjects.setDataLocally("server_url3", server_url3);
          this.globalObjects.setDataLocally("server_url4", server_url4);
          this.globalObjects.setDataLocally("dbName", responseData.dbName);
          this.globalObjects.setScopeUrl(server_url);
          this.globalObjects.setDataLocally("entity_code_str_appkey", responseData.entity_code_str);
          this.globalObjects.setDataLocally("entity_code_appkey", responseData.entity);
          let dbinitdetails = "?minIdel=" + (responseData.minIdel ? responseData.minIdel : null) 
                              + "&maxIdel=" + (responseData.maxIdel ? responseData.maxIdel : null) 
                              + "&maxTotal=" + (responseData.maxTotal ? responseData.maxTotal : null);
          this.globalObjects.setDataLocally("dbinitdetails", dbinitdetails);
          if (msg[0] == "F") {
            this.globalObjects.presentAlert(msg[1]);
          }
          this.globalObjects.applogo = responseData.icon_img;
          this.globalObjects.checkAndSetScopeUrl().then(data => {
            this.disableFlag = false;
            this.router.navigate(['login']);

            this.globalObjects.destroyLocalData("appkeyTryCount");
            this.globalObjects.destroyLocalData("appkeyLockTime");
          }, err => { 
            this.disableFlag = false;this.globalObjects.hideLoading(); 
          })
        }
        else {
          this.disableFlag = false;
          this.globalObjects.presentAlert(msg[1]);
        }
        this.globalObjects.setDataLocally("device_validation", responseData.device_validation);
      } else {
          this.disableFlag = false;
          this.globalObjects.presentToastWithOptions(resData.responseMsg, "errorClass");
      }
    }, err => {
      
        this.disableFlag = false;
        this.globalObjects.hideLoading();
        if(!this.globalObjects.networkStatus && (this.plt.is('android') || this.plt.is("ios")) ){
          this.globalObjects.presentAlert("You are offline now.");
        }
        this.globalObjects.destroyLocalData("appkeyTryCount");
        this.globalObjects.presentAlert("LHS Server connectivity issue.");
         
    });

   
  }
  
  getAppkeyData(url, data){
   
    return new Promise((resolve, reject)=>{
      let lhsMainUrl = environment.lhsServerUrl + url;
      let lhsUrl = environment.serverUrlLhs + url;
      let awsUrl = environment.serverUrlAws + url;
      let reqStatus = true;
      let errorCount = 0;
      // if(this.serverName == "lhs"){
      //   requrl = environment.serverUrlLhs + url;
      // }else{
      //   requrl = environment.serverUrlAws + url;
      // }
      this.httpClient.post(lhsMainUrl, data).subscribe((res:any)=>{
        if(reqStatus && res.responseStatus == 'success'){

          resolve(res);
          reqStatus = false;
        }else{
          errorCount++;
          if(errorCount == 3){
            resolve(res);
          }
        }
      }, (error)=>{
        errorCount++;
        if(errorCount == 3){
          reject();
        }
      });
      
      this.httpClient.post(lhsUrl, data).subscribe((res:any)=>{
        if(reqStatus && res.responseStatus == 'success'){

          resolve(res);
          reqStatus = false;
        }else{
          errorCount++;
          if(errorCount == 3){
            resolve(res);
          }
        }
      }, (error)=>{
        errorCount++;
        if(errorCount == 3){
          reject();
        }
      });
      this.httpClient.post(awsUrl, data).subscribe((res:any)=>{
        if(reqStatus && res.responseStatus == 'success'){
          resolve(res);
          reqStatus = false;
        }else{
          errorCount++;
          if(errorCount == 3){
            resolve(res);
          }
        }
      }, (error)=>{
        errorCount++;
        if(errorCount == 3){
          reject();
        }
      });
     
    })

  }

  validateObjects(serverUrl, appkey) {
    return new Promise((resolve, reject) => {
      // let url =  "http://192.168.100.60:8888/lhsws/LW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA10G/" + 'validateObjects?appkey=' + appkey;
      let url = encodeURI(serverUrl + 'validateObjects?appkey=' + appkey);
      this.httpClient.get(encodeURI(url)).subscribe((res: any) => {
        console.log("ValidateObjects:", res);
        resolve(res);
      }, (err) => {
        reject(err);
      });
    })
  }



  UpdateSearchResults(s){
    this.autocompleteItems = [];
   /*  var search = new RegExp(s , 'i'); // prepare a regex object
    let items = this.searchedAppKey.filter(item => search.test(item)); */

    let query = s.toLowerCase();
    let items = this.searchedAppKey.filter(item => item.toLowerCase().indexOf(query) >= 0);
    
    if(items.length > 0){
      
      for(let b of items){
        let exist = this.autocompleteItems.find(x => x == b);

        if(exist){}else{
          this.autocompleteItems.push(b);
        }
      }
    }
  }

  SelectSearchResult(item){
    this.appkey = item;
    this.showAuto = false;
  }

  onFocus(){
    //this.showAuto = true;
  }

  onBlur(){
    // setTimeout(() => {
    //   this.showAuto = false;
    // },700);
  }

 
}
