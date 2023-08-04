import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { GlobalObjectsService } from './global-objects.service';
import { PouchDBService } from './pouch-db.service';
import { resolve } from 'dns';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class SqlLiteService {

  dbInstance: SQLiteObject;

  tables = {
    'object_master': ['id', 'objMast'],
    'item_master': ['id', 'itemData'],
    'frame_master': ['id', 'frameData'],
    'item_img_master': ['id', 'imgData']
  }

  constructor(public sqlite: SQLite, private platform: Platform, private globalObjects: GlobalObjectsService, private pouchServ: PouchDBService) {
    this.platform.ready().then(() => {
      this.initFunc();
    })
  }

  initFunc() {
    if (this.platform.is("android") || this.platform.is('ios')) {
      if(this.sqlite){
        this.sqlite.create({
          name: 'lhswma.db',
          location: 'default'
        })
          .then(async (db: SQLiteObject) => {
            this.dbInstance = db;
            await db.executeSql('CREATE TABLE IF NOT EXISTS object_master (id,objMast BLOB)', []).then(async () => {
              await db.executeSql('CREATE TABLE IF NOT EXISTS item_master (id,itemData BLOB)', []);
              await db.executeSql('CREATE TABLE IF NOT EXISTS frame_master (id,frameData BLOB)', []);
              await db.executeSql('CREATE TABLE IF NOT EXISTS item_img_master (id,imgData BLOB)', []);
              await db.executeSql('CREATE TABLE IF NOT EXISTS itemValue_Mast (id INTEGER PRIMARY KEY AUTOINCREMENT,enteryData BLOB,status TEXT)', []);
            })
  
          })
          .catch(e => { alert(JSON.stringify(e)) });
      }
    }
  }

  getId() {
    // alert("getting data");
    if (this.platform.is("android")) {
      this.dbInstance.executeSql('select * from object_master', [])
        .then(res => {
          let items = [];
          if (res.rows.length > 0) {
            /* for (var i = 0; i < res.rows.length; i++) {
             
             alert(JSON.stringify(res.rows.item(i)));
           } */
            alert(res.rows.length);
          }
        }).catch(e => { });
    }
  }

  getById(id, table): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('android') || this.platform.is('ios')) {
        if(this.dbInstance){
          this.dbInstance.executeSql(`SELECT * FROM ${table} WHERE id = ?`, [id]).then(res => {
            if (res.rows.length > 0) {
              resolve({
                resStatus: "Success",
                resData: res.rows.item(0),
              });
            } else {
              resolve({
                resStatus: "noData",
              })
            }
          }, (error) => {
            reject(error)
          });
        }else{
          reject("dbInstance not available")
        }
      } else {
        this.pouchServ.getObject(id).then((res: any) => {
          resolve(res);
        }, (error) => {
          reject(error);
        })
      }
    })
  }

  deleteObjMast(id, table): Promise<any> {
    if (this.platform.is('android') || this.platform.is('ios')) {
      return this.dbInstance.executeSql(`DELETE FROM ${table} WHERE id = ?`, [id])
        .then(res => {
          if (table == 'object_master') {
            this.dbInstance.executeSql('DELETE FROM frame_master WHERE objectCode = ?', [id]);
            this.dbInstance.executeSql('DELETE FROM item_master WHERE objectCode = ?', [id]);
          }
        }).catch(e => this.globalObjects.presentAlert("There is some error deleteObjMast"));
    } else {
      this.pouchServ.deleteJSON(id);
    }
  }



  postDataSql(data, table): Promise<any> {
    // alert("post : " +  data.id);
    let tab = this.tables[table];
    if (this.platform.is('android') || this.platform.is('ios')) {
      return this.dbInstance.executeSql(`INSERT INTO ${table} (${tab[0]}, ${tab[1]}) VALUES (?, ?)`, [data.id, data.objData])
        .then(res => { }).catch(e => alert("There is some error postDataSql"));
    } else {
      let pouch: any = {}
      pouch._id = data.id;
      if (tab[1] == 'itemData') {
        pouch.itemData = data.objData;
      } else if (tab[1] == 'objMast') {
        pouch.objMast = data.objData;
      } else if (tab[1] == 'frameData') {
        pouch.frameData = data.objData;
      }

      this.pouchServ.updateJSON(pouch);
    }
  }

  updateObjMast(data, table): Promise<any> {
    let tab = this.tables[table];
    return new Promise((resolve, reject) => {
      if (this.platform.is('android') || this.platform.is('ios')) {
        return this.dbInstance.executeSql(`UPDATE ${table} SET ${tab[1]} = ? WHERE ${tab[0]} = ?`, [data.objData, data.id])
          .then(res => {
            let data = {
              resStatus: "Success"
            }
            resolve(data)
          }).catch(e => {
            alert("There is some error updateObjMast");
            reject();
          }
          );
      } else {
        let pouch: any = {}
        pouch._id = data.id;
        pouch._rev = data.rev;
        if (tab[1] == 'itemData') {
          pouch.itemData = data.objData;
        } else if (tab[1] == 'objMast') {
          pouch.objMast = data.objData;
        } else if (tab[1] == 'frameData') {
          pouch.frameData = data.objData;
        }
        this.pouchServ.updateJSON(pouch);
        resolve("");
      }
    })
  }


  deleteAllObject() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      //  alert("delete : " + id);
      return this.dbInstance.executeSql('DELETE FROM object_master', [])
        .then(res => {
          this.dbInstance.executeSql('DELETE FROM itemValue_Mast', []);
          this.dbInstance.executeSql('DELETE FROM item_master', []);
          this.dbInstance.executeSql('DELETE FROM frame_master', []);

          //  alert("deleted" + JSON.stringify(res));
        }).catch(e => this.globalObjects.presentAlert("There is some error deleteAllObject"));
    } else {
      this.pouchServ.destroyDataBase();
    }
  }

  saveEnterySql(data): Promise<any> {
    if (this.platform.is('android') || this.platform.is('ios')) {
      return this.dbInstance.executeSql('INSERT INTO itemValue_Mast (enteryData,status) VALUES (?,?)', [data.reqData, data.status]).then(res => {
        return {
          resStatus: "success"
        }
      }).catch(e => this.globalObjects.presentAlert("There is some error saveEnterySql"));
    }
  }

  getAllPendingEntery(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.platform.is("android") || this.platform.is('ios')) {
        this.dbInstance.executeSql('select * from itemValue_Mast where status = ?', ["pending"])
          .then(res => {
            let items = [];
            for (var i = 0; i < res.rows.length; i++) {
              items.push(res.rows.item(i));
            }
            let data = {
              resStatus: "Success",
              resData: items
            }
            resolve(data);
          }).catch(e => {
            reject(e);
            alert(JSON.stringify(e));
          });
      } else {
        reject();
      }
    })
  }

  deleteCard(id): Promise<any> {
    if (this.platform.is('android') || this.platform.is('ios')) {
      return this.dbInstance.executeSql('DELETE FROM itemValue_Mast WHERE id = ?', [id]).then(res => {
        return { resStatus: "deleted" }
      }).catch(e => {
        alert(JSON.stringify(e));
      })
    }
  }

  updatePendingEntery(id) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      return this.dbInstance.executeSql('UPDATE itemValue_Mast SET status = ? WHERE id = ?', ["executed", id]).then(res => {
        return { resStatus: "success" }
      }).catch(e => {
        alert(JSON.stringify(e));
      })
    }
  }

  getAllExecutedEntery() {
    return new Promise((resolve, reject) => {
      if (this.platform.is("android") || this.platform.is('ios')) {
        this.dbInstance.executeSql('select * from itemValue_Mast where status = ?', ["executed"])
          .then(res => {
            let items = [];
            for (var i = 0; i < res.rows.length; i++) {
              items.push(res.rows.item(i));
            }
            let data = {
              resStatus: "Success",
              resData: items
            }
            resolve(data);
          }).catch(e => {
            reject(e);
            alert(JSON.stringify(e));
          });
      } else {
        reject();
      }
    })
  }

  async deletExpObj(id) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      return new Promise(async (resolve, reject) => {
        this.dbInstance.executeSql(`SELECT * FROM object_master WHERE id LIKE ?`, ['%' + id + '%']).then(async (res: any) => {
          if (res.rows.length > 0) {
            let items = [];
            for (var i = 0; i < res.rows.length; i++) {
              items.push(res.rows.item(i));
            }
            if (items.length > 0) {
              for (let o of items) {
                this.deleteObjMast(o.id, "object_master");
              }
              await resolve({ status: "success" });
            } else {
              await resolve({ status: "no data" });
            }
          } else {
            await resolve({ status: "no data" });
          }
        }, (error) => {
          reject(error)
        });
      })
    } else {
      return new Promise(async (resolve, reject) => {
        await this.pouchServ.getAllDocs().then(async (res: any) => {
          let data: any[] = res.rows;
          let objdata: any[] = await data.filter(d => JSON.parse(d.doc.objMast).object_code == id);
          if (objdata.length > 0) {
            for (let o of objdata) {
              this.deleteObjMast(o, "objMast");
            }
            await resolve({ status: "success" });
          } else {
            await resolve({ status: "no data" });
          }
        }, (error) => {
          reject(error);
        })
      })
    }
  }

  insertBaseImg(data: any): Promise<any> {
    // alert("post : " +  data.id);
    // let tab = this.tables[table];
    if (this.platform.is('android') || this.platform.is('ios')) {
      return this.dbInstance.executeSql(`INSERT INTO item_img_master (id, imgData) VALUES (?, ?)`, [data.id, data.img])
        .then(res => { }).catch(e => alert("There is some error postDataSql"));
    } else {
      let pouch: any = {}
      pouch._id = data.id;
      pouch.objCode = data.objCode;
      pouch.theme = data.theme;
      pouch.imgData = data.img;

      this.pouchServ.updateJSON(pouch);
    }
  }





  getImageFromLocal(item, imgUrl) {
    return new Promise((resolve, reject) => {
      let id = item.apps_item_seqid + '&&' + this.globalObjects.appTheme;
      let objCode = item.apps_page_frame_seqid.split("-")[0];
      this.getById(id, 'item_img_master').then((tableRes) => {
        let baseImg
        if (tableRes.resStatus == "Success") {
          baseImg = tableRes.resData.imgData;
          resolve(baseImg);
        } else {
          this.getBase64ImageFromUrl(imgUrl).then(res => {
            baseImg = res;
            let data = {
              id: item.apps_item_seqid + '&&' + this.globalObjects.appTheme,
              objCode: objCode,
              theme: this.globalObjects.appTheme,
              img: baseImg
            }
            this.insertBaseImg(data);
            resolve(baseImg);
          }).catch(err => {
            reject();
          })
        }
      })
    })
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    //console.log(blob);
    return new Promise((resolve, reject) => {
      /* var reader  = new FileReader();
        reader.addEventListener("load", function () {
            resolve(reader.result);
        }, false);
    
        reader.onerror = () => {
          return reject(this);
        };
        reader.readAsDataURL(blob); */

      this.globalObjects.converToBase64(blob).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

}