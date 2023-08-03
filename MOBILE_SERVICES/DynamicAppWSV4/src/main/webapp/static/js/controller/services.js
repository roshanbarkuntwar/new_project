angular.module('starter.controllers')

        .service('dataServices', function ($q, $http, $rootScope, pouchDBService, AuthServices, $cordovaToast, $filter) {
            var appTypes = "";
            var l_userCode = AuthServices.userCode();

            function getEntryFromData(l_url, l_appSeqNo) {
                return $q(function (resolve, reject) {
                    $http.get(l_url).success(function (data) {
                        var a = "";
                        a = data;
                        a._id = l_appSeqNo;
                        pouchDBService.updateJSON(a);
                        resolve(data);
                    }).error(function (data, status) {
                        reject(status)
                    })
                })
            }
            ;

            function setOfflineAppData() {
                var l_aapType = AuthServices.appType();
                return $q(function (resolve, reject) {
                    // console.log(url + 'offlineFormInfo?apptype=' + l_aapType + '&userCode=' + AuthServices.userCode());
                    $http.get(url + 'offlineFormInfo?apptype=' + l_aapType + '&userCode=' +
                            AuthServices.userCode()).success(function (data) {
                        var OfflineData = data.offlineFormInfo;
                        var table_Detail = OfflineData.table_Detail;
                        var view_mode = OfflineData.view_mode
                        var addFormData = OfflineData.addFormData;
                        var erorr = true;
                        var temp = {};
                        pouchDBService.getObject(l_aapType).then(function (data) {
                            temp = data;
                            temp.table_Detail = table_Detail;
                            temp.view_mode = view_mode
                            pouchDBService.updateJSON(temp);
                        }, function (err) {
                            temp.table_Detail = table_Detail;
                            temp._id = l_aapType;
                            temp.view_mode = view_mode
                            pouchDBService.updateJSON(temp);
                        })
                        for (var i = 0; i < addFormData.length; i++) {
                            var obj = addFormData[i];
                            var count = 0;
                            var temp1 = {};
                            pouchDBService.getObject(obj.seqNo + "").then(function (data) {
                                temp1 = data;
                                obj = addFormData[count];
                                temp1.recordsInfo = obj.recordsInfo;
                                temp1.defaultPopulateData = obj.defaultPopulateData;
                                pouchDBService.updateJSON(temp1);
                                count++;
                            }, function (err) {
                                if (erorr) {
                                    erorr = false;
                                    for (var j = 0; j < addFormData.length; j++) {
                                        var obj1 = addFormData[j];
                                        var temp2 = {};
                                        temp2._id = obj1.seqNo + "";
                                        temp2.defaultPopulateData = obj1.defaultPopulateData;
                                        temp2.recordsInfo = obj1.recordsInfo
                                        pouchDBService.updateJSON(temp2)
                                    }
                                }
                            })
                        }
                        resolve();
                    }).error(function (data, status) {
                        reject(status)
                    })

                })
            }

            function setOfflineDashbordData(table_Detail, view_mode, l_aapType) {
                var temp = {};
                pouchDBService.getObject(l_aapType).then(function (data) {
                    temp = data;
                    temp.table_Detail = table_Detail;
                    temp.view_mode = view_mode
                    pouchDBService.updateJSON(temp);
                }, function (err) {
                    temp.table_Detail = table_Detail;
                    temp._id = l_aapType;
                    temp.view_mode = view_mode
                    pouchDBService.updateJSON(temp);
                })

            }

            function storeSessionColumn(column_name, value, codeOfValue) {
                return $q(function (resolve, reject) {
                    var JSON = {};
                    id = "sessionColumn";
                    pouchDBService.getObject(id).then(function (data) {
                        JSON = data;
                        var temp = {};
                        var tempCount = 0;
                        var count = 0;
                        JSON.sessionColumn.forEach(function (obj) {
                            if (obj.column_name == column_name) {
                                temp = obj;
                                temp.codeOfValue = codeOfValue;
                                temp.value = value;
                                tempCount = count;
                            }
                            count++;
                        })
                        JSON.sessionColumn.splice(tempCount, 1, temp);
                        pouchDBService.updateJSON(JSON);
                        resolve("sucess");
                    }, function (err) {
                        JSON._id = id;
                        JSON.sessionColumn = [];
                        var temp = {};
                        temp.column_name = column_name;
                        temp.value = value;
                        temp.codeOfValue = codeOfValue;
                        JSON.sessionColumn.push(temp);
                        pouchDBService.updateJSON(JSON);
                        resolve("sucess");
                    })
                })
            }

            function setOfflineForm(seqNo, data) {
                return $q(function (resolve, reject) {
                    var temp1 = {};
                    pouchDBService.getObject(seqNo + "").then(function (dataObj) {
                        temp1 = dataObj;
                        temp1.recordsInfo = data.recordsInfo;
                        temp1.defaultPopulateData = data.defaultPopulateData;
                        pouchDBService.updateJSON(temp1);
                        resolve();
                    }, function (err) {
                        temp1._id = seqNo + "";
                        temp1.defaultPopulateData = data.defaultPopulateData;
                        temp1.recordsInfo = data.recordsInfo;
                        pouchDBService.updateJSON(temp1)
                        resolve();
                    })
                })

            }

            function storeLOV(lov, id) {
                return $q(function (resolve, reject) {
                    var JSON = {};
                    _id = "lov" + id;
                    pouchDBService.getObject(_id).then(function (data) {
                        JSON = data;
                        JSON.lov = lov;
                        pouchDBService.updateJSON(JSON);
                        resolve("sucess");
                    }, function (err) {
                        JSON._id = _id;
                        JSON.lov = lov;
                        pouchDBService.updateJSON(JSON);
                        resolve("sucess");
                    })
                })
            }



            function addEntryToLoacalDB(fieldsData, l_appSeqNo, fieldsTH1, defaultPopulateDataLength, uploadEntryStatus, entryType) {
                return $q(function (resolve, reject) {
                    var id = l_appSeqNo.toString();
                    var JSON = {};
                    _id = "entrySeqNo" + id;
                    pouchDBService.getObject(_id).then(function (data) {
                        JSON = data;
                        JSON.entryList.push(fieldsData);
                        JSON.count = JSON.entryList.length;
                        JSON.fieldsTH = fieldsTH1;
                        JSON.defaultPopulateDataLength = defaultPopulateDataLength;
                        JSON.uploadEntryStatus = uploadEntryStatus
                        pouchDBService.updateJSON(JSON);
                        resolve("sucess");
                    }, function (err) {
                        JSON._id = _id;
                        JSON.entryList = [];
                        JSON.entryList.push(fieldsData);
                        JSON.count = JSON.entryList.length;
                        JSON.fieldsTH = fieldsTH1;
                        JSON.defaultPopulateDataLength = defaultPopulateDataLength;
                        JSON.uploadEntryStatus = uploadEntryStatus;
                        pouchDBService.updateJSON(JSON);
                        resolve("sucess");
                    })
                })
            }

            function addOrderEntryToLoacalDB(fieldsData, l_appSeqNo, entryType, index, l_dateTime) {

                return $q(function (resolve, reject) {
                    var id = l_appSeqNo.toString();
                    var JSON = {};
                    _id = "entrySeqNo" + id;
                    pouchDBService.getObject(_id).then(function (data) {
                        JSON = data;
                        if (entryType == "headEntry") {
                            headEntry = fieldsData;
                            orderEntry = "";
                            var tempDate = {column_desc: "DATE", column_name: "DATE", column_type: "DATE", entry_by_user: "F", value: l_dateTime}
                            JSON.entryList.push({headEntry: headEntry, orderEntry: orderEntry, DATE: tempDate});

                        }
                        if (entryType == "orderEntry") {
                            var temp = JSON.entryList[index];
                            temp.orderEntry = fieldsData;
                            JSON.entryList.splice(index, 1, temp);
                        }
                        JSON.count = JSON.entryList.length;
                        pouchDBService.updateJSON(JSON);
                        resolve((JSON.count - 1));
                    }, function (err) {
                        JSON._id = _id;
                        JSON.entryList = [];
                        if (entryType == "headEntry") {
                            headEntry = fieldsData;
                            orderEntry = "";
                            date = $filter('date')(new Date(), 'dd-MM-yyyy hh:mm:ss');
                            var tempDate = {column_desc: "DATE", column_name: "DATE", column_type: "DATE", entry_by_user: "F", value: date}
                            JSON.entryList.push({headEntry: headEntry, orderEntry: orderEntry, DATE: tempDate});
                        }
                        if (entryType == "orderEntry") {
                            var temp = JSON.entryList[index];
                            temp.orderEntry = fieldsData;
                            JSON.entryList.splice(index, 1, temp);
                        }
                        JSON.count = JSON.entryList.length;
                        pouchDBService.updateJSON(JSON);
                        resolve((JSON.count - 1));
                    })
                })
            }

            function updateEntryToLoacalDB(fieldsData, l_appSeqNo, index) {
                return $q(function (resolve, reject) {
                    var id = l_appSeqNo.toString();
                    var JSON = {};
                    _id = "entrySeqNo" + id;
                    pouchDBService.getObject(_id).then(function (data) {
                        JSON = data;
                        JSON.entryList.splice(index, 1, fieldsData);
                        JSON.count = JSON.entryList.length;
                        pouchDBService.updateJSON(JSON);
                        resolve("sucess");
                    }, function (err) {
                        reject('error')
                    })
                })
            }

            function updateOrderEntryToLoacalDB(fieldsData, l_appSeqNo, index, tempAppSeqNo, entryType) {
                return $q(function (resolve, reject) {
                    var id = l_appSeqNo.toString();
                    var JSON = {};
                    _id = "entrySeqNo" + id;
                    pouchDBService.getObject(_id).then(function (data) {
                        JSON = data;
                        if (entryType == "headEntry") {
                            var temp = JSON.entryList[index];
                            temp.headEntry = fieldsData;
                            temp.orderEntry = temp.orderEntry;
                            JSON.entryList.splice(index, 1, temp);
                        }
                        if (entryType == "orderEntry") {
                            var temp = JSON.entryList[index];
                            temp.headEntry = temp.headEntry;
                            temp.orderEntry = fieldsData;
                            JSON.entryList.splice(index, 1, temp);
                        }
                        JSON.count = JSON.entryList.length;
                        pouchDBService.updateJSON(JSON);
                        resolve((JSON.count - 1));
                    }, function (err) {
                        reject('error')
                    })
                })
            }

            function deleteEntry(item, l_appSeqNo, index) {
                return $q(function (resolve, reject) {
                    var id = l_appSeqNo.toString();
                    var JSON = {};
                    _id = "entrySeqNo" + id;
                    pouchDBService.getObject(_id).then(function (data) {
                        JSON = data;
                        JSON.entryList.splice(index, 1);
                        JSON.count = JSON.entryList.length;
                        pouchDBService.updateJSON(JSON);
                        resolve("sucess");
                    }, function (err) {
                        reject('error')
                    })
                })

            }

            function deleteAllEntry(l_appSeqNo) {
                return $q(function (resolve, reject) {
                    var id = l_appSeqNo.toString();
                    var JSON = {};
                    _id = "entrySeqNo" + id;
                    pouchDBService.getObject(_id).then(function (data) {
                        JSON = data;
                        JSON.entryList = [];
                        JSON.count = JSON.entryList.length;
                        pouchDBService.updateJSON(JSON);
                        resolve("sucess");
                    }, function (err) {
                        reject('error')
                    })
                })
            }

            function uploadEntry(fieldsData, l_appSeqNo, url, l_latitude, l_longitude, l_location,
                    entryType, seqId, dependent_next_entry_seq) {
                return $q(function (resolve, reject) {
                    var l_record = {};
                    var l_imgfile = {};
                    var l_imgfiles = [];
                    var l_fileCount = 1;
                    var l_videoFile = {}
                    var l_videoFiles = [];
                    fieldsData.forEach(function (data) {
                        var key = ""; //  used to denote key value pair, for generating dynamic JSON for ADD_ENTRY 
                        var value = ""; // used to denote key value pair, for generating dynamic JSON for ADD_ENTRY
                        angular.forEach(data, function (value1, key1) {
                            if (key1 == "column_name") {
                                key = value1
                            }
                            if (key1 == "valueToSend") {
                                value = value1
                            }
                        })

                        if (data.column_type == "IMG") {
                            l_record[key] = "";
                            var l_v = key
                            key = "fileId";
                            l_imgfile[key] = l_v;
                            key = "file";
                            l_imgfile[key] = value;

                            key = "fileName";
                            value = "fileName" + l_fileCount;
                            l_imgfile[key] = value;

                            key = "desc";
                            value = "desc" + l_fileCount;
                            l_imgfile[key] = value;

                            key = "sysFileName";
                            value = "sysFileName" + l_fileCount;
                            l_imgfile[key] = value;

                            key = "imageTime";
                            value = $filter('date')(new Date(), 'dd-MM-yyyy hh:mm:ss');
                            l_imgfile[key] = value;

                            l_imgfiles.push(l_imgfile);
                            l_imgfile = {};
                            l_fileCount++;
                        } else {
                            if (data.column_type == "VIDEO") {
                                l_record[key] = "";
                                var l_v = key
                                key = "videoFileId";
                                l_videoFile[key] = l_v;
                                key = "videofile";
                                // l_videoFile[key] = $scope.l_base64VideoData;

                                key = "videoFileName";
                                value = "fileName" + l_fileCount;
                                l_videoFile[key] = value;

                                key = "videoDesc";
                                value = "desc" + l_fileCount;
                                l_videoFile[key] = value;

                                key = "sysFileName";
                                value = "sysFileName" + l_fileCount;
                                l_videoFile[key] = value;

                                l_videoFiles.push(l_videoFile);
                                l_videoFile = {};
                            } else {
                                if (data.column_type == "BUTTON") {
                                    l_record[key] = data.column_desc;
                                } else {
                                    l_record[key] = value;
                                }
                            }
                        }
                    })

                    key = 'DYNAMIC_TABLE_SEQ_ID';
                    if (dependent_next_entry_seq != null) {
                        value = dependent_next_entry_seq;
                    } else {
                        value = l_appSeqNo;
                    }
                    l_record[key] = value;

                    if (entryType == "Update") {
                        var uploadUrl = url + 'updateEntryInfo';
                        key = "SEQ_ID";
                        value = seqId;
                        l_record[key] = value;
                    } else {
                        var uploadUrl = url + 'addEntryDyanamically';
                    }

                    var l_recordsInfo = [];
                    l_recordsInfo.push(l_record)
                    l_imgfiles.forEach(function (data) {
                        l_recordsInfo.push(data)
                    })

                    l_videoFiles.forEach(function (data) {
                        l_recordsInfo.push(data)
                    })

                    var l_DataToUpload = {};
                    key = "recordsInfo";
                    l_DataToUpload[key] = l_recordsInfo;

                    var fd = new FormData()
                    fd.append('jsonString', JSON.stringify(l_DataToUpload))
                    if (l_latitude == "offlineEntry") {
                        fd.append('flag', "off");
                    }
                    // console.log("JSON STRING : " + JSON.stringify(l_DataToUpload));
                    // alert("ADD ENTRY JSON STRING : " + JSON.stringify(l_DataToUpload));
                    $http.post(uploadUrl, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function (data) {
                        resolve(data);
                    }).error(function (data, status) {
                        reject(status);
                    })
                })
            }

            function uploadAllEntry(listOfEntry, l_appSeqNo, url, type) {
                return $q(function (resolve, reject) {
                    var l_record = {};
                    var l_imgfile = {};
                    var l_imgfiles = [];
                    var l_fileCount = 1;
                    var l_videoFile = {}
                    var l_videoFiles = [];
                    var tempChecked = "";
                    var orderList = [];

                    listOfEntry.forEach(function (obj1) {
                        if (obj1.column_type == "DATE") {
                            tempChecked = "F";
                        } else {
                            obj1.forEach(function (data) {
                                var key = ""; // Variable 'key' is used to denote key value pair, for generating dynamic JSON for ADD_ENTRY 
                                var value = ""; // Variable 'value' is used to denote key value pair, for generating dynamic JSON for ADD_ENTRY

                                if (data.status == 'Checked') {
                                    tempChecked = "T";
                                }


                                angular.forEach(data, function (value1, key1) {
                                    if (key1 == "column_name") {
                                        key = value1;
                                    }
                                    if (key1 == "valueToSend" || key1 == "value") {
                                        value = value1;
                                    }
                                })
                                if (data.column_type == "IMG") {
                                    l_record[key] = "";
                                    var l_v = key
                                    key = "fileId";
                                    l_imgfile[key] = l_v;
                                    key = "file";
                                    l_imgfile[key] = value;

                                    key = "fileName";
                                    value = "fileName" + l_fileCount;
                                    l_imgfile[key] = value;

                                    key = "desc";
                                    value = "desc" + l_fileCount;
                                    l_imgfile[key] = value;

                                    key = "sysFileName";
                                    value = "sysFileName" + l_fileCount;
                                    l_imgfile[key] = value;

                                    key = "imageTime";
                                    value = $filter('date')(new Date(), 'dd-MM-yyyy hh:mm:ss');
                                    l_imgfile[key] = value;

                                    l_imgfiles.push(l_imgfile);
                                    l_imgfile = {};
                                    l_fileCount++;
                                } else {
                                    if (data.column_type == "VIDEO") {
                                        l_record[key] = "";
                                        var l_v = key
                                        key = "videoFileId";
                                        l_videoFile[key] = l_v;
                                        key = "videofile";
                                        l_videoFile[key] = $scope.l_base64VideoData;

                                        key = "videoFileName";
                                        value = "fileName" + l_fileCount;
                                        l_videoFile[key] = value;

                                        key = "videoDesc";
                                        value = "desc" + l_fileCount;
                                        l_videoFile[key] = value;

                                        key = "sysFileName";
                                        value = "sysFileName" + l_fileCount;
                                        l_videoFile[key] = value;

                                        l_videoFiles.push(l_videoFile);
                                        l_videoFile = {};
                                    } else {
                                        l_record[key] = value;
                                    }
                                }
                            })

                            if (tempChecked == "T") {


                                key = 'DYNAMIC_TABLE_SEQ_ID';
                                value = l_appSeqNo;
                                l_record[key] = value;

                                var l_recordsInfo = [];
                                l_recordsInfo.push(l_record)
                                l_imgfiles.forEach(function (data) {
                                    l_recordsInfo.push(data)
                                })

                                l_videoFiles.forEach(function (data) {
                                    l_recordsInfo.push(data)
                                })

                                var l_DataToUpload = {};
                                key = "recordsInfo";
                                l_DataToUpload[key] = l_recordsInfo;

                                var tempCopy = angular.copy(l_DataToUpload);
                                orderList.push(tempCopy);
                                tempChecked = 'F';
                            }
                        }

                    })

                    var uploadUrl = url + 'addMultipleEntry';

                    var orderListToSend = {};
                    key = "list";
                    orderListToSend[key] = orderList;


                    var fd = new FormData();
                    fd.append('jsonString', JSON.stringify(orderListToSend));
                    if (type == "offlineEntry") {
                        fd.append('flag', "off");
                    }
                    // console.log("JSON STRING : " + JSON.stringify(orderListToSend));
                    // alert(JSON.stringify(orderListToSend));
                    $http.post(uploadUrl, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function (data) {
                        resolve(data);
                    }).error(function (data, status) {
                        reject(status);
                    })
                })
            }

            return {
                storeSessionColumn: storeSessionColumn,
                setOfflineForm: setOfflineForm,
                storeLOV: storeLOV,
                deleteEntry: deleteEntry,
                uploadEntry: uploadEntry,
                deleteAllEntry: deleteAllEntry,
                uploadAllEntry: uploadAllEntry,
                getEntryFromData: getEntryFromData,
                addOrderEntryToLoacalDB: addOrderEntryToLoacalDB,
                updateOrderEntryToLoacalDB: updateOrderEntryToLoacalDB,
                setOfflineAppData: setOfflineAppData,
                addEntryToLoacalDB: addEntryToLoacalDB,
                updateEntryToLoacalDB: updateEntryToLoacalDB,
                setOfflineDashbordData: setOfflineDashbordData,
                appTypes: function () {
                    return appTypes;
                }
            }
        })