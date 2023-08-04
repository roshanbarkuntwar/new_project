import { Injectable, RendererFactory2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { GlobalObjectsService } from './global-objects.service';
import { File } from '@ionic-native/file/ngx';
import { MediaCapture, MediaFile, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { PouchDBService } from './pouch-db.service';
import { Events } from 'src/app/demo-utils/event/events';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Device } from '@ionic-native/device/ngx';
import { environment } from 'src/environments/environment.prod';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  base_url = "";
  httpHeaders: any;
  hhtpHeaderVideo: any;
  render: any;
  lat: any;
  longi: any;
  userDetails: any;
  serverName = "lhs";
  
  constructor(private rendererFactory: RendererFactory2, public http: HttpClient, private camera: Camera, private pouchDBService: PouchDBService,
    public globalObjects: GlobalObjectsService, private file: File, private mediaCapture: MediaCapture, private platform: Platform, public device: Device,
    private geolocation: Geolocation) {
    this.render = rendererFactory.createRenderer(null, null)
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    // this.userStatuses();
    // this.base_url = "http://192.168.100.195:8888/lhsws/MC/192.168.100.173/1521/LWEBTEST/LWEBTEST/ORA10G/"
    // this.base_url="http://203.193.167.118:8888/DynamicAppWSV3/webService/MC/192.168.100.173/1521/CFLTEST/CFLTEST/"

  }


  getData(url) {
    return new Promise((resolve, reject) => {

      var l_url =  this.globalObjects.getScopeUrl() + url;
      // var l_url = "http://192.168.100.157:8888/lhsws/RC/192.168.100.173/1521/RCPLERP/RCPLERP/ORA10G/" + url;
      console.log(l_url);
      this.http.get(l_url)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }

  getDataDev(url) {
    return new Promise((resolve, reject) => {
     // var l_url = this.globalObjects.getScopeUrl() + url;
      var l_url = "http://203.193.167.118:8888/lhsws/NW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA11G/" + url;
      // var l_url = "http://192.168.100.161:8888/lhsws/LV/192.168.100.173/1521/VICCOERP/VICCOERP/ORA10G/" + url;
      console.log(l_url);
      this.http.get(l_url)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }

  postDataDev(url, data) {
    return new Promise((resolve, reject) => {
      //var l_url = this.globalObjects.getScopeUrl() + url;
     var l_url = "http://203.193.167.118:8888/lhsws/NW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA11G/" + url;
      // var l_url = "http://192.168.100.30:8888/lhsws/LV/192.168.100.173/1521/VICCOERP/VICCOERP/ORA10G/" + url;
      console.log(l_url);
      this.http.post(l_url, data)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }

  postData(url, data) {

    if (!data.wsdptp) {
      data.wsdptp = [];
    }

    let logObj = { "reqData": data };
    if (data.wscp) {
      if (data.wscp.service_type) {
        return new Promise((resolve, reject) => {
          var l_url = this.globalObjects.getScopeUrl() + url;
          // var l_url = "http://192.167.100.157:8888/lhsws/AR/192.168.100.173/1521/WMAERP/WMAERP/ORA10G/" + url;
          data.wscp.developer_mode = this.globalObjects.toggleDevloperMode ? "Y" : "N";
          this.http.post(l_url, data)
            .subscribe((data: any) => {

              if (l_url.indexOf("S2U") > -1 && this.globalObjects.toggleDevloperMode) {
                let indexWsSeq = data.responseData ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") == -1 ? data.responseData.Level1_Keys.indexOf("same_ws_seqid") : data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : -1;
                let indexExWsSeq = data.responseData ? data.responseData.Level1_Keys.indexOf("EX_WS_SEQID") == -1 ? data.responseData.Level1_Keys.indexOf("ex_ws_seqid") : data.responseData.Level1_Keys.indexOf("EX_WS_SEQID") : -1;
                let indexStatus = data.responseData ? data.responseData.Level1_Keys.indexOf("status") : -1;
                let indexMessage = data.responseData ? data.responseData.Level1_Keys.indexOf("message") : -1;
                let ws_seq_no = indexWsSeq > -1 ? data.responseData.Values[0][indexWsSeq] : "";
                let status = indexStatus > -1 ? data.responseData.Values[0][indexStatus] : "";
                let message = indexMessage > -1 ? data.responseData.Values[0][indexMessage] : "";
                this.globalObjects.logEvents(logObj, indexExWsSeq, ws_seq_no, status ? status : data.responseStatus, message ? message : data.responseMsg);
              }
              resolve(data);
            }, err => {
              this.globalObjects.logEvents(logObj, "", "", "error", err);
              reject(err);
            })
        })
      }
      else {
        return new Promise((resolve, reject) => {
          resolve(data);
        })
      }
    } else {
      return new Promise((resolve, reject) => {
        var l_url = this.globalObjects.getScopeUrl() + url;
        //  var l_url = "http://192.168.100.33:8888/lhsws/NW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA10G/" + url;

        this.http.post(l_url, data)
          .subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          })
      })
    }




  }

  postDataLhsServer(url, data) {
    return new Promise((resolve, reject) => {

      this.getDataFromLHS(url, data).then((res) => {
        resolve(res);
      }, err => {
        reject(err);
      })
      /* let requrl = "";
       if (this.serverName == "lhs") {
         requrl = environment.serverUrlLhs + url;
       } else {
         requrl = environment.serverUrlAws + url;
       }
       let req = this.http.post(requrl, data).subscribe((res: any) => {
         this.serverName = "lhs";
         resolve(res);
       }, (error) => {
         this.serverName = "aws"
         if (this.serverName != "lhs") {
           this.postDataLhsServer(url, data).then((res) => {
             resolve(res);
           }, (err) => {
             reject(err);
           })
         } else {
           reject(error);
         }
       });
 
       setTimeout(() => {
         if (req) {
           if (!req.closed) {
             console.log("req unsubscribed");
             req.unsubscribe();
             this.serverName = "aws"
             this.postDataLhsServer(url, data).then((res) => {
               resolve(res);
             }, (err) => {
               reject(err);
             })
           }
         }
       }, 5000);*/
    })
  }

  getDataFromLHS(url, data) {

    return new Promise((resolve, reject) => {

      let lhsUrl = environment.serverUrlLhs + url;
      let awsUrl = environment.serverUrlAws + url;
      let reqStatus = true;
      let errorCount = 0;
      // if(this.serverName == "lhs"){
      //   requrl = environment.serverUrlLhs + url;
      // }else{
      //   requrl = environment.serverUrlAws + url;
      // }

      this.http.post(lhsUrl, data).subscribe((res: any) => {
        if (reqStatus && res.responseStatus == 'success') {
          resolve(res);
          reqStatus = false;
        } else {
          errorCount++;
          if (errorCount == 2) {
            resolve(res);
          }
        }
      }, (error) => {
        errorCount++;
        if (errorCount == 2) {
          reject();
        }
      });
      this.http.post(awsUrl, data).subscribe((res: any) => {
        if (reqStatus && res.responseStatus == 'success') {
          resolve(res);
          reqStatus = false;
        } else {
          errorCount++;
          if (errorCount == 2) {
            resolve(res);
          }
        }
      }, (error) => {
        errorCount++;
        if (errorCount == 2) {
          reject();
        }
      });

    })

  }
  takePhoto(column_name, flag) {
    return new Promise((resolve, reject) => {
      var sourceType: any;
      if (flag == "PHOTOLIBRARY") {
        sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
      } else {
        sourceType = this.camera.PictureSourceType.CAMERA;
      }
      const options: CameraOptions = {
        quality: 40,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 450,
        targetHeight: 450,
        saveToPhotoAlbum: false,
        correctOrientation: true

      };
      this.camera.getPicture(options).then(
        imageData => {
          resolve(imageData);
          // this.compress("data:image/jpeg;base64,"+imageData, 75, 100).then((data)=>{
          //   resolve(data);
          // },(err)=>{
          //   alert(JSON.stringify(err));
          // });
        }, (err) => {
          alert(JSON.stringify(err));
        })
    })
  }

  takeVideoFromGallay(){
    return new Promise((resolve,rejects)=>{
      const options: CameraOptions = {
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,
        mediaType: this.camera.MediaType.VIDEO,
        targetHeight:1,
      };
      this.camera.getPicture(options).then(
        async(videoUrl:any) => {
            
            // var filename = videoUrl.substr(videoUrl.lastIndexOf('/') + 1);
            // var dirpath = videoUrl.substr(0, videoUrl.lastIndexOf('/') + 1);
  
            // dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
            
           
            //   var dirUrl:any = await this.file.resolveDirectoryUrl(dirpath);
            //   var retrievedFile:any = await this.file.getFile(dirUrl, filename, {});
      
            //   resolve(retrievedFile.nativeURL);
            
            // let a:FileEntrythis.file.getFile(videoUrl);

            resolve(videoUrl)
          // this.compress("data:image/jpeg;base64,"+imageData, 75, 100).then((data)=>{
          //   resolve(data);
          // },(err)=>{ 
          //   alert(JSON.stringify(err));
          // });

        }, (err) => {
          alert(JSON.stringify(err));
        })
    })
  }

  ///////////////////////////////////// Compress Base64 Image //////////////////////////////////////
  compress(imageDataUrlSource, ratio, quality) {
    return new Promise((resolve, reject) => {

      quality = quality / 100;
      ratio = ratio / 100;
      const sourceImage = new Image();
      sourceImage.onload = (
        () => {
          const canvas = this.render.createElement('canvas');
          const ctx = canvas.getContext('2d');
          let w;
          let h;
          w = sourceImage.naturalWidth;
          h = sourceImage.naturalHeight;

          canvas.width = w * ratio;
          canvas.height = h * ratio;
          ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
          const mime = imageDataUrlSource.substr(5, imageDataUrlSource.split(';')[0].length - 5);
          const result = canvas.toDataURL(mime, quality);
          resolve(result);
        });
      sourceImage.src = imageDataUrlSource;

    });
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  setmultiLOVvalue(fields, lov) {
    return new Promise((resolve, reject) => {
      var lovCount = 0;
      for (let obj of fields) {
        obj.value = '';
        obj.codeOfValue = ''
        for (let obj1 of lov) {
          if (obj1.checked) {
            if (obj.value == '' || obj.value == null) {
              obj.value = obj1.name;
              obj.codeOfValue = obj1.code;
            } else {
              obj.value = obj.value + ", " + obj1.name;
              obj.codeOfValue = obj.codeOfValue + ", " + obj1.code;
            }
            lovCount = lovCount + 1;
          }
        }
        obj.itemSelected = lovCount;
        resolve(obj.value);
      }
    })
  }

  takeVideo() {
    return new Promise((resolve, reject) => {
      let directoryPath = "";
      let platformVal = this.globalObjects.getPlatformValue();
      if (platformVal) {
        if (platformVal == 'ios') {
          directoryPath = this.file.documentsDirectory;
        } else {
          directoryPath = this.file.externalRootDirectory;
        }
      } else {
        directoryPath = this.file.externalRootDirectory;
      }
      let options: CaptureVideoOptions = {
        limit: 1,
        quality: 0,
        duration: 9000
      }
      this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
        let capturedFile = res[0];
        let fileName = capturedFile.name;
        let dir = capturedFile['localURL'].split('/');
        dir.pop();
        let fromDirectory = dir.join('/');
        let toDirectory = directoryPath + "LHSAPP";
        this.file.createDir(directoryPath, "LHSAPP", false).then(result => {
          var pathval = toDirectory + "/";
          this.file.moveFile(fromDirectory, fileName, toDirectory, fileName).then(result => {
            this.file.readAsDataURL(pathval, fileName).then(result => {
              resolve(result);
            }, (err) => {
              // alert(err);
            });
          });
        }, (err) => {
          var pathval = toDirectory + "/";
          this.file.moveFile(fromDirectory, fileName, toDirectory, fileName).then(result => {
            this.file.readAsDataURL(pathval, fileName).then(result => {
              resolve(result);
            }, (err) => {
            });
          });
        })
      })
    })
  }
  // moveFiles(path, fileName, newPath, newFileName, column_name) {
  //   var pathval = newPath + "/";
  //   this.file.moveFile(path, fileName, newPath, newFileName).then(result => {
  //     this.file.readAsDataURL(pathval, fileName).then(result => {
  //         resolve(result);

  //     }, (err) => {
  //   });
  // }

  // setVideoData(pathval, fileName, column_name) {
  //   this.file.readAsDataURL(pathval, fileName).then(result => {
  //     for (let obj of fields) {
  //       if (obj.column_name == column_name) {
  //         obj.value = result;
  //       }
  //       if (obj.dependent_row == column_name) { //Check for control dependency 
  //         obj.excel_upload = 0;
  //         obj.value = "";
  //         for (let obj1 of fields) {
  //           if (obj.column_name == obj1.dependent_row) {
  //             obj1.excel_upload = 1; /*variable "excel_upload" is used from web service generated JSON,to disable dependent controls */
  //             obj1.value = "";
  //           }
  //         }
  //       } else { }
  //     }
  //   }, (err) => {
  //   });
  // }



  FCMlink() {

    let AUTH_KEY_FCM = "AAAASDnknak:APA91bH7qMCkNOuqPSUR2ldONtE6c6WMourBKX1dMjh4WtiSL1HP9YPNVTzl9pM-KnM1ocZgkcRbc0zd5rx-bFEIQZ2n-jEAMI-u-oIEr56szE_9hLIDxQsw-a7FImqe8L--qCt2lZ4U";
    let mobtoken = "fVlp_8vg57I:APA91bHBFkF-Xk3uva1zZGTR9gJeBAuM_ynb-utMq6kKnE6hflzlcKqgYxL4kD6jjxDKBv9K7i1t3FZ9Cy1eeKBrl-M9sjBtvXeCNNWvalott6cMVSun1b5B7OfhrBa87Yc8wyUjhKEG";
    let url = 'https://fcm.googleapis.com/fcm/send';
    let body =
    {
      "notification": {
        "title": "Notification title",
        "body": "Notification body",
        "sound": "default",
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "icon": "fcm_push_icon"
      },
      "data": {
        "hello": "This is a Firebase Cloud Messagin  hbhj g Device Gr new v Message!",
      },
      "to": mobtoken
    };

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'key=' + AUTH_KEY_FCM
    });

    this.http.post(url, body, this.httpHeaders)
      .subscribe(data => {
        console.log("fcm data", data);
      }, error => {
        console.log(error);
      });
  }

  saveEntryToLocalDB(nextPageInfo) {
    return new Promise((resolve, reject) => {
      var formData: any = {};
      var object_code = nextPageInfo.wscp.object_code;
      // var _id = object_code + "_localEntryList";
      var _id = object_code;
      this.pouchDBService.getObject(_id).then(data => {
        let resData: any = data;
        formData = resData;
        formData._id = resData._id;
        if (formData.entryList) {
          formData.entryList.push(nextPageInfo);
        } else {
          formData.entryList = [];
          formData.entryList.push(nextPageInfo);
        }
        formData.count = formData.entryList.length;
        this.pouchDBService.put(_id, formData);
        resolve("success");
      }, err => {
        formData._id = _id;
        formData.entryList = [];
        formData.entryList.push(nextPageInfo);
        formData.count = formData.entryList.length;
        this.pouchDBService.put(_id, formData);
        resolve("success");
      })
    })
  }

  deleteEntry(nextPageInfo, index) {
    return new Promise((resolve, reject) => {
      var formData: any = {};
      var object_code = nextPageInfo.wscp.object_code;
      var _id = object_code;
      this.pouchDBService.getObject(_id).then(data => {
        formData = data;
        formData.entryList.splice(index, 1);
        formData.count = formData.entryList.length;
        this.pouchDBService.put(_id, formData);
        resolve("sucess");
      }, err => { reject('error') })
    })
  }

  deleteAllEntry(nextPageInfo) {
    return new Promise((resolve, reject) => {
      var formData: any = {};
      var object_code = nextPageInfo.wscp.object_code;
      var _id = object_code;
      this.pouchDBService.getObject(_id).then(data => {
        formData = data;
        formData.entryList = [];
        formData.count = formData.entryList.length;
        this.pouchDBService.put(_id, formData);
        resolve("sucess");
      }, err => { reject('error') })
    })
  }




  getlocation() {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.longi = resp.coords.longitude;
        resolve("");
      }).catch((error) => {
        console.log('Error getting location', error);
      })
    });

  }


  passwsdp(status) {
    // let wsdp=[];
    // let appdata = this.globalObjects.getLocallData("appData");
    // let devicetoken=this.globalObjects.getLocallData("device_token");
    // let platform=this.globalObjects.getLocallData("platformValue");
    // let appKey = this.globalObjects.getLocallData("appKey");
    //  wsdp = [{
    //       "userCode" : this.userDetails.user_code,
    //       "appkey"  : appKey,
    //       "activeType" :status,
    //       "activeDetail" : "Device "+status,
    //       "deviceId" : devicetoken,
    //       "platform" : platform,
    //       "deviceDetail" : this.device.manufacturer + ", " + this.device.model,
    //       "latitude" : this.lat,
    //       "longitude" : this.longi
    //       }]
    //     let reqData: any = {};
    //     reqData = {
    //       "wsdp":wsdp
    //     }
    //     this.postData("ACTIVE_LOG", reqData).then(res => {
    //       // alert(JSON.stringify(res))
    //     });
  }

  userStatuses() {
    this.platform.ready().then(() => {
      this.getlocation().then(() => {
        this.passwsdp('Start');
        //  alert("process started");
      });

      this.platform.resume.subscribe((result) => {
        this.getlocation().then(() => {
          this.passwsdp('Resume');
        });
      });

      this.platform.pause.subscribe((result) => {
        this.getlocation().then(() => {
          this.passwsdp('Paused');
        });
      })
    })
  }

  postMultipartData(url, data,videoType,filePath) {
    return new Promise((resolve, reject) => {

      const formData = new FormData();
      formData.append('file', data);
      formData.append('videoType' , videoType);
      formData.append('filePath',filePath);
      var l_url = this.globalObjects.getScopeUrl() + url;
      console.log(l_url);
          let oReq = new XMLHttpRequest();
          oReq.open("POST", l_url, true);
          console.log("ResStatus: " + oReq.status);
          oReq.responseType = "json";
    
          oReq.onreadystatechange = (oEvent) => {
            if (oReq.readyState === 4) {
              
              if (oReq.status === 200) {
                oReq.onload = (oEvent) => {
                  resolve(oReq.response);
                }
              } else if(oReq.status === 300){
                oReq.onload = (oEvent) => {
                  resolve(oReq.response);
                }
              } else if(oReq.status === 400){
                oReq.onload = (oEvent) => {
                  resolve(oReq.response);
                }
              } else if(oReq.status === 404){
                oReq.onload = (oEvent) => {
                  resolve(oReq.response);
                }
              } else {
                resolve(oReq.response);
              }
            }
          };
          oReq.send(formData);
    })
  }


}
