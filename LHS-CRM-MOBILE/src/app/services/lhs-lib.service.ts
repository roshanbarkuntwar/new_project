import { Injectable } from '@angular/core';
import { GlobalObjectsService } from './global-objects.service';

@Injectable({
  providedIn: 'root'
})
export class LhsLibService {

  object_mast: any;
  clickEvent: any;
  constructor(private globalObjects: GlobalObjectsService) { }



  /**** Set Multiple Rows Values Start******/

  set_row_values(name, valuesarr, rowIndex) {
    let frameName;
    if (name.indexOf(".") > -1) {
      rowIndex = parseInt(name.split(".")[1]) - 1;
      name = name.split(".")[0];
    }
    if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    frameName = name.split("[")[0];
    let itemNameStr = name.split("[")[1];
    let itemNames = itemNameStr.split("]")[0];
    let itemArr = itemNames.split(",");

    if(rowIndex){}else{rowIndex = 0;}


    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {
          let i = 0;
          if (valuesarr.pageNo < frame.apps_page_no) {

            let callingStr = [];

            let str = name.split("[")[1].replace(")", "").replace("]", "");
            let setItemsArr
            if (str && str.indexOf(" ") > -1) {
              setItemsArr = str.replace(" ", "").split(",")
            } else {
              setItemsArr = str.split(",")
            }
            let i = 0;
            for (let item of setItemsArr) {
              if (valuesarr.rowData[i]) {
                let str = item + ":=" + valuesarr.rowData[i];
                callingStr.push(str);
              }
              i++
            }

            let obj = {
              frameName: frameName,
              itmData: callingStr,
              objectCode: frame.object_code,
              itemCode: this.clickEvent.apps_item_seqid,
              rowIndex: rowIndex
            }

            if (callingStr.length > 0) {
              if (this.globalObjects.callingPara.length > 0) {
                let glob = this.globalObjects.callingPara.find(x => x.objectCode == obj.objectCode && x.itemCode == obj.itemCode);
                if (glob) {
                  glob = obj
                } else {
                  this.globalObjects.callingPara.push(obj);
                }
              } else {
                this.globalObjects.callingPara.push(obj);
              }
            }
          } else {
            if (frame.tableRows && frame.tableRows[rowIndex]) {
              for (let itemName of itemArr) {
                for (let itemGroup of frame.tableRows[rowIndex]) {
                  if (itemGroup.Level5) {
                    for (let item of itemGroup.Level5) {
                      if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                        item.value = valuesarr.rowData[i]
                      }
                    }
                  } else {
                    if (itemGroup) {
                      for (let item of itemGroup) {
                        if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                          item.value = valuesarr.rowData[i];
                        }
                      }
                    }
                  }
                }
                i++
              }
            } else {
              let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
              for (let itemName of itemArr) {
                for (let itemGroup of frameLevel4) {
                  if (itemGroup.Level5) {
                    for (let item of itemGroup.Level5) {
                      if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                        item.value = valuesarr.rowData[i]
                      }
                    }
                  } else {
                    if (itemGroup) {
                      for (let item of itemGroup) {
                        if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                          item.value = valuesarr.rowData[i];
                        }
                      }
                    }
                  }
                }
                i++
              }

              if (frame.tableRows) {
                frame.tableRows.push(frameLevel4);
              } else {
                frame.tableRows = [];
                frame.tableRows.push(frameLevel4);
              }
            }
          }
          return;
        }
      }
    }
  }

  /**** Set Multiple Rows Values End******/



  /**** Get Multiple Rows Values Start******/

  get_row_values(name, rowIndex) {
    let frameName;

    if (name.indexOf(".") > -1) {
      rowIndex = parseInt(name.split(".")[1]) - 1;
    }

    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } else if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    frameName = name.split("[")[0];
    let itemName = name.split("[")[1].replace("]", "");
    let itemNames = itemName.replace(")", "");
    let itemArr = itemNames.split(",");

    if(rowIndex){}else{rowIndex = 0;}

    let rowsArr = [];
    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {


          if (frame.tableRows) {
            for (let itemName of itemArr) {
              for (let itemGroup of frame.tableRows[rowIndex]) {

                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      rowsArr.push(item.value);
                    }
                  }

                } else {
                  if (itemGroup) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                        rowsArr.push(item.value);
                      }
                    }
                  }
                }
              }
            }
          }
          let obj = {
            pageNo: frame.apps_page_no,
            rowData: rowsArr
          }
          return obj;
        }
      }
    }

  }

  /**** Get Multiple Rows Values End******/



  /**** Set Item Value Start******/

  set_item_value(name, value, rowIndex) {
    let frameName = '';
    let itemName;


    if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if(rowIndex){}else{rowIndex = 0;}


    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {
          // if ((frame.apps_page_frame_seqid == frameName.toUpperCase()) || ((frame.frame_alias ? frame.frame_alias.toLowerCase() : '') == frameName)) {

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let itemGroup of frame.tableRows[rowIndex]) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                    return item.value = value
                  }
                }
              } else {
                if (itemGroup) {
                  for (let item of itemGroup) {
                    if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                      return item.value = value;
                    }
                  }
                }
              }
            }
          } else {

            let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
            for (let itemGroup of frameLevel4) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                    return item.value = value
                  }
                }
              } else {
                if (itemGroup) {
                  for (let item of itemGroup) {
                    if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                      return item.value = value;
                    }
                  }
                }
              }
            }
            frame.tableRows = [];
            frame.tableRows[0] = frameLevel4;
          }

          if ((frameName.indexOf("PARA") > -1)) {

            let itemGrp = JSON.parse(JSON.stringify(frame.Level4[0]));
            for (let item of itemGrp.Level5) {
              item.item_name = itemName;
              item.prompt_name = itemName;
              item.value = value;
            }

            if (frame.tableRows && frame.tableRows.length > 0) {
              frame.tableRows[0].push(itemGrp);
            } else {
              frame.tableRows[0][0] = itemGrp;
            }
            return;
          }
        }
      }
    }

    if (this.clickEvent) {
      let callingStr = [];
      callingStr[0] = itemName + ":=" + value;
      let obj = {
        frameName: frameName,
        itmData: callingStr,
        objectCode: this.clickEvent.calling_object_code,
        itemCode: this.clickEvent.apps_item_seqid,
        rowIndex: rowIndex
      }

      if (callingStr.length > 0) {
        if (this.globalObjects.callingPara.length > 0) {
          let glob = this.globalObjects.callingPara.find(x => x.objectCode == obj.objectCode && x.itemCode == obj.itemCode);
          if (glob) {

            for (let c of callingStr) {
              let flag = true;
              for (let g of glob.itmData) {
                if (c.split(":=")[0] == g.split(":=")[0]) {
                  g = c;
                  flag = false
                }
              }
              if (flag) {
                glob.itmData.push(c);
              }
            }

            console.log(glob);
          } else {
            this.globalObjects.callingPara.push(obj);
          }
        } else {
          this.globalObjects.callingPara.push(obj);
        }
      }

    }

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frame.apps_page_frame_seqid.indexOf("PARA") > -1) && (itemName.indexOf("P_") > -1)) {

          if (frame.Level4 && frame.Level4.length > 0) {
            let itemGrp = JSON.parse(JSON.stringify(frame.Level4[0]));
            for (let item of itemGrp.Level5) {
              item.item_name = itemName;
              item.prompt_name = itemName;
              item.value = value;
            }

            if (frame.tableRows && frame.tableRows.length > 0) {
              frame.tableRows[0].push(itemGrp);
            } else {
              frame.tableRows[0][0] = itemGrp;
            }
            return;
          }
        }
      }
    }

  }

  /**** Set Item Value End******/


  get_item_value(name, rowIndex) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];

      if (name.indexOf("'") > -1) {
        itemName = name.split(".")[1].split("'")[0];
      } else {
        itemName = name.split(".")[1];
      }

    } else {
      if (name.indexOf("'") > -1) {
        itemName = name.split("'")[0];
      } else {
        itemName = name
      }
    }

    if (rowIndex) { } else { rowIndex = 0; }

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName) : true) || (frameName ? (frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase() : true)) {
          if (frame.tableRows && frame.tableRows[rowIndex]) {
            for (let itemGroup of frame.tableRows[rowIndex]) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toUpperCase() == item.item_name.toUpperCase())))) {
                    let value;
                    if (item.datatype) {
                      value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                      value = value ? value.toString().replace(/,/g, "") : "";
                    } else {
                      value = item.value
                    }


                    if (name.indexOf("'") > -1) {
                      return value + "'";
                    } else {
                      return value;
                    }

                  }
                }
              }
              else {
                if (itemGroup) {
                  for (let item of itemGroup) {
                    if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                      let value;
                      if (item.datatype) {
                        value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                        value = value ? value.toString().replace(/,/g, "") : "";
                      } else {
                        value = item.value
                      }
                      if (name.indexOf("'") > -1) {
                        return value + "'";
                      } else {
                        return value;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }


  /**** Get Item Config Start******/

  get_item_config(name, rowIndex) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if(rowIndex){}else{rowIndex = 0;}

    if (this.object_mast) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {
            if (frame.tableRows && frame.tableRows[rowIndex]) {
              for (let itemGroup of frame.tableRows[rowIndex]) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      return item;
                    }
                  }

                } else {
                  if (itemGroup) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
                        return item;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /**** Get Item Config End******/


  /**** Set Item Config Start******/

  set_item_config(name, paraName, paraValue, rowIndex) {

    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if(rowIndex){}else{rowIndex = 0;}

    if(paraName == 'display_setting_str' && (typeof(paraValue) == 'string')){
      let strArr = paraValue.split(",");
      let obj = {};
      for(let s of strArr){
        let keys = s.split(":");
        let key = keys[0]
        if(key.indexOf("{") > -1){
          key = key.split("{")[1];
        }
        key = key.replace(/'/g,"");
        let val = keys[1];
        if(val.indexOf("}") > -1){
          val = val.split("}")[0];
        }
        
        val = val.replace(/'/g,"");
        obj[key] = val;
      }

      paraValue = obj;
    }

    if (this.object_mast) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {
            if (frame.tableRows && frame.tableRows[rowIndex]) {
              for (let itemGroup of frame.tableRows[rowIndex]) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true) {
                      if(paraName == "display_setting_str" && item.datatype == "NUMBER"){
                       let value = JSON.parse(JSON.stringify(paraValue));
                       value["text-align"] = "right";
                       item[paraName] = value;
                      }else{
                        item[paraName] = paraValue;
                      }
                    }
                  }

                } else {
                  if (itemGroup) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
                        if(paraName == "display_setting_str" && item.datatype == "NUMBER"){
                          let value = JSON.parse(JSON.stringify(paraValue));
                          value["text-align"] = "right";
                          item[paraName] = value;
                         }else{
                           item[paraName] = paraValue;
                         }
                      }
                    }
                  }
                }
              }
            }
            else {
              let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
              for (let itemGroup of frameLevel4) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      item[paraName] = paraValue
                    }
                  }

                } else {
                  if (itemGroup) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
                        item[paraName] = paraValue
                      }
                    }
                  }
                }
              }
              frame.tableRows = [];
              frame.tableRows[0] = frameLevel4;
            }
          }
        }
      }
    }
  }

  /**** Set Item Config End******/



  /**** Set Multiple row Config Start******/

  set_rows_source_config(frameName, items, rowIndex) {

    if(rowIndex){}else{rowIndex = 0;}
    
    if (this.object_mast) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {
            if (frame.tableRows && frame.tableRows.length < 0) {
              if (items.length > 1) {

                for (let itemGroup of frame.tableRows[rowIndex]) {
                  for (let itemName of items) {
                    if (itemGroup.Level5) {
                      for (let item of itemGroup.Level5) {
                        if (((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName.item_name && (itemName.item_name.toLowerCase() == item.item_name.toLowerCase())))) {
                          item[itemName.para_name] = itemName.para_value
                        }
                      }

                    } else {
                      if (itemGroup) {
                        for (let item of itemGroup) {
                          if ((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                            item[itemName.para_name] = itemName.para_value
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else if (items.length == 1) {
              for (let tableData of frame.tableRows) {
                for (let itemGroup of tableData) {
                  for (let itemName of items) {
                    if (itemGroup.Level5) {
                      for (let item of itemGroup.Level5) {
                        if (((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName.item_name && (itemName.item_name.toLowerCase() == item.item_name.toLowerCase())))) {
                          item[itemName.para_name] = itemName.para_value
                        }
                      }

                    } else {
                      if (itemGroup) {
                        for (let item of itemGroup) {
                          if ((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                            item[itemName.para_name] = itemName.para_value
                          }
                        }
                      }
                    }
                  }
                }
              }
              return;
            } else {
              let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
              for (let itemGroup of frameLevel4) {
                for (let itemName of items) {
                  if (itemGroup.Level5) {
                    for (let item of itemGroup.Level5) {
                      if (((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName.item_name && (itemName.item_name.toLowerCase() == item.item_name.toLowerCase())))) {
                        item[itemName.para_name] = itemName.para_value
                      }
                    }

                  } else {
                    if (itemGroup) {
                      for (let item of itemGroup) {
                        if ((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                          item[itemName.para_name] = itemName.para_value
                        }
                      }
                    }
                  }
                }
              }
              frame.tableRows = [];
              frame.tableRows[0] = frameLevel4;

            }
          }
        }
      }
    }
  }

  /**** Set Multiple row Config End******/



  /****  Get Frame Config Start******/

  get_frame_config(name) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      frameName = name;
    }

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {
          return frame;
        }
      }
    }


    return null;
  }

  /****  Get Frame Config End******/


  /****  Set Frame Config Start******/

  set_frame_config(name, paraName, paraValue) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      frameName = name;
    }

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {
          return frame[paraName] = paraValue;
        }
      }
    }
    return null;
  }

  /****  Set Frame Config End******/


  get_page_config(pageNum) {
    return this.object_mast.Level2[pageNum - 1];
  }

  set_page_config(pageNum, paraName, paraValue) {
    return this.object_mast.Level2[pageNum - 1][paraName] = paraValue;
  }


  


 



  ////**********************************  Aggrigation Functions  ***********************////


  sum(name){
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.object_mast) {
      let value = 0;
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {
            if (frame.tableRows && frame.tableRows.length > 0) {
              for (let tableData of frame.tableRows) {
                for (let itemGroup of tableData) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      value = value + parseFloat((item.value).replace(/,/g, ""));
                    }
                  }

                } else {
                  if (itemGroup) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                        value = value + parseFloat((item.value).replace(/,/g, ""));
                      }
                    }
                  }
                }
                }
              }
            }

          }
        }
      }
      return value;
    }

  }


  count(name){
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.object_mast) {
      let value = 0;
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {

           
            if (frame.tableRows && frame.tableRows.length > 0) {
              for (let tableData of frame.tableRows) {
                for (let itemGroup of tableData) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      value = value + 1;
                    }
                  }

                } else {
                  if (itemGroup) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                        value = value + 1;
                      }
                    }
                  }
                }
                }
              }
            }

          }
        }
      }
      return value;
    }

  }


  avg(name){
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.object_mast) {
      let value = 0;
      let length = 0;
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {

          
            if (frame.tableRows && frame.tableRows.length > 0) {
              for (let tableData of frame.tableRows) {
                for (let itemGroup of tableData) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      value = value + parseFloat((item.value).replace(/,/g, ""));
                      length = frame.tableRows.length;
                    }
                  }

                } else {
                  if (itemGroup) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                        value = value + parseFloat((item.value).replace(/,/g, ""));
                        length = frame.tableRows.length;
                      }
                    }
                  }
                }
                }
              }
            }

          }
        }
      }
      return value/length;
    }

  }


  min(name){
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.object_mast) {
     
      let valueArr = [];
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {

            if (frame.tableRows && frame.tableRows.length > 0) {
              for (let tableData of frame.tableRows) {
                for (let itemGroup of tableData) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                        valueArr.push(parseFloat((item.value).replace(/,/g, "")));
                    }
                  }

                } else {
                  if (itemGroup) {
                    for (let item of itemGroup) {
                      valueArr.push(parseFloat((item.value).replace(/,/g, "")));
                    }
                  }
                }
                }
              }
            }

          }
        }
      }
      return Math.min.apply(Math, valueArr);;
    }

  }


   max(name){
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.object_mast) {
      let valueArr = [];
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {

            if (frame.tableRows && frame.tableRows.length > 0) {
              for (let tableData of frame.tableRows) {
                for (let itemGroup of tableData) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                        valueArr.push(parseFloat((item.value).replace(/,/g, "")));
                    }
                  }

                } else {
                  if (itemGroup) {
                    for (let item of itemGroup) {
                      valueArr.push(parseFloat((item.value).replace(/,/g, "")));
                    }
                  }
                }
                }
              }
            }

          }
        }
      }
      return Math.max.apply(Math, valueArr);;
    }

  }

  go_item(frameId, item_name, rowIndex?) {

    let frameName = frameId;
    let itemName = item_name;

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || (frameName ? (frame.frame_alias ? frame.frame_alias.toLowerCase() : "") == frameName.toLowerCase() : true)) {

          if (frame.apps_frame_type == 'ENTRY_TABLE') {
            let container = document.querySelector("#" + frame.apps_page_frame_seqid + rowIndex);
            if (container) {
              var universe = container.querySelectorAll(
                "input,select"
              );
              var list = Array.prototype.filter.call(universe, function (item) {
                return item.tabIndex >= "0";
              });
              let el = list.find((el) => el.offsetParent && el.offsetParent.id.toLowerCase() == itemName.toLowerCase());
              el.focus();
            }
          } else {

            let container = document.querySelector("#" + frame.apps_page_frame_seqid);
            if (container) {
              var universe = container.querySelectorAll(
                "input,select"
              );
              var list = Array.prototype.filter.call(universe, function (item) {
                return item.tabIndex >= "0";
              });
              let el = list.find((el) => el.offsetParent && el.offsetParent.id.toLowerCase() == itemName.toLowerCase());
              el.focus();
            }

            // for (let el of list) {
            //   if (el.offsetParent && el.offsetParent.id.toLowerCase() == itemName.toLowerCase()) {
            //     el.focus();
            //     break;
            //   }
            // }
          }

        }
      }
    }
  }
  
  delete_record(frameId, rowIndex) {
    let frameName = frameId;
    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || (frameName ? (frame.frame_alias ? frame.frame_alias.toLowerCase() : "") == frameName.toLowerCase() : true)) {
          if (frame.tableRows && frame.tableRows[rowIndex]) {
            frame.tableRows[rowIndex].splice(rowIndex,1);
          }
        }
      }
    }
  }


}
