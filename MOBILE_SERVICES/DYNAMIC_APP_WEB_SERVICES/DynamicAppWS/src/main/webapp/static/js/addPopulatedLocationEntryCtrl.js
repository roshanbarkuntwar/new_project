// addPopulatedLocationEntryCtrl.js
angular.module('starter.controllers').controller('addPopulatedLocationEntryCtrl', function ($cordovaGeolocation, AuthServices, $filter,
    $cordovaToast, $ionicHistory, $state, $stateParams, $cordovaCamera, $ionicLoading, $cordovaCapture, $cordovaBarcodeScanner,
    $ionicModal, $scope, $http, addUpdateEntryServices, globalObjectServices, $ionicScrollDelegate, $q, $location, $log, $ionicPopover, $sce, $rootScope, dataServices, locationEntryServices, pouchDBService) {

    var l_userCode = AuthServices.userCode();
    var l_appSeqNo = AuthServices.appSeqNo();

    var sp_Obj = $state.params.obj // state params getting from dashbord , entryList,calendar states
    $scope.table_desc = sp_Obj.table_desc;
    $scope.searchEntity = {}

    if ("V" == AuthServices.screenOrientionView()) {
        // window.screen.lockOrientation('portrait');
    } else {
        if ("H" == AuthServices.screenOrientionView()) {
            // window.screen.lockOrientation('landscape');
        }
    }

    $ionicModal.fromTemplateUrl('static/templates/addEntryLOV.html', function (modal) {
        $scope.addEntryLOVModal = modal
    }, { scope: $scope })

    $ionicModal.fromTemplateUrl('static/templates/textAreaPopOver.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.textAreaPopOverModal = popover;
    });


    if ((sp_Obj.updation_process).indexOf('V') > -1) {
        $scope.flagForEntryListButton = 'V#';
    }

    $scope.listOfEntry = [];
    $scope.fieldsTH = [];

    if ($rootScope.online) {
        if (sp_Obj.type == "offlineUpdateEntry") {

            $scope.rowsOfPopulateData = sp_Obj.recordsInfo;
            $scope.defaultPopulateDataLength = sp_Obj.defaultPopulateDataLength;
            $scope.fieldsTH = sp_Obj.fieldsTH;
            $scope.uploadEntryStatus = sp_Obj.uploadEntryStatus;
        } else {
            var l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode;
            l_url = l_url + "&accCode=" + AuthServices.acc_code()+"&searchText=";
            $http.get(l_url).success(function (data) {
                $scope.fields = data.recordsInfo;
                $scope.defaultPopulateData = data.defaultPopulateData;
                $scope.sqlData = data.sqlData;
                setinfo();
            }).error(function (data) { $cordovaToast.show('Try Again...', 'long', 'bottom'); })
        }

    } else {
        if (sp_Obj.type == "offlineUpdateEntry") {
            $scope.rowsOfPopulateData = sp_Obj.recordsInfo;
            $scope.defaultPopulateDataLength = sp_Obj.defaultPopulateDataLength;
            $scope.fieldsTH = sp_Obj.fieldsTH;
            $scope.uploadEntryStatus = sp_Obj.uploadEntryStatus;
        } else {
            var id = l_appSeqNo.toString();
            id = id + "";
            pouchDBService.getObject(id).then(function (data) {
                $scope.fields = data.recordsInfo;
                $scope.defaultPopulateData = data.defaultPopulateData;
                setinfo();
            }, function (err) {
                alert("Data is not available please REFRESH app");
            })
        }
    }



 /*    function setinfo() {
        $scope.fields = addUpdateEntryServices.setDataCommon($scope.fields);
        var temp = locationEntryServices.setinfo($scope.fields, $scope.defaultPopulateData);
        $scope.rowsOfPopulateData = temp.rowsOfPopulateData;
        $scope.defaultPopulateDataLength = temp.defaultPopulateDataLength;
        $scope.fieldsTH = temp.fieldsTH;
        $scope.uploadEntryStatus = temp.uploadEntryStatus;
    } */

	
	function setinfo() {
        // $scope.fields = addUpdateEntryServices.setDataCommon($scope.fields);
        addUpdateEntryServices.setDataCommon($scope.fields, sp_Obj.vrno).then(function(fields) {
            $scope.fields = fields;
            // setData();

            var temp = locationEntryServices.setinfo($scope.fields, $scope.defaultPopulateData);
            $scope.rowsOfPopulateData = temp.rowsOfPopulateData;
            $scope.defaultPopulateDataLength = temp.defaultPopulateDataLength;
            $scope.fieldsTH = temp.fieldsTH;
            $scope.uploadEntryStatus = temp.uploadEntryStatus;
        });

    }



    $scope.saveLocation = function (column_name, index, item) {

        for (var i = 0; i < $scope.defaultPopulateDataLength; i++) {

            var temp1 = $scope.rowsOfPopulateData[i];
            if (temp1) {
                temp1.forEach(function (obj) {
                    if (obj.entry_by_user == "T" || obj.entry_by_user == "R") {
                        if (i == index || i == (index - 1) || i == (index + 1)) {
                            obj.entry_by_user = "T";
                        } else {
                            obj.entry_by_user = "R";
                        }
                    }
                    if (i == index) {
                        if (obj.column_desc == "Entry Date") {
                            obj.value = $filter('date')(new Date(), 'MM-dd-yyyy hh:mm:ss');
                        }
                        item = temp1;
                    }

                })
                $scope.rowsOfPopulateData.splice(i, 1, temp1);
            }
        }


        getLatLng(item, index).then(function (data) {
            data.forEach(function (obj) {
                if (obj.item_help_property == "BT") {
                    if (obj.status == '') {
                        obj.status = "Checked"
                        $scope.uploadEntryStatus[index] = "T";
                    }
                }
            })
            $scope.rowsOfPopulateData.splice(index, 1, data);
        }, function (err) {
            $ionicLoading.hide();
        });
    }

    $scope.uploadEntry = function (index, item) {

        if ($rootScope.online) {
            locationEntryServices.uploadLocation(item, $scope.url, l_appSeqNo).then(function (data) {
                item.forEach(function (obj) {
                    if (obj.item_help_property == "BT") {
                        if (obj.status == 'Checked') {
                            obj.status = "uploaded"
                            $scope.uploadEntryStatus[index] = 'F';
                        }
                    }
                })
                $scope.rowsOfPopulateData.splice(index, 1, item);
            }, function (err) { });
            // obj.status = "uploaded"
        } else {
            $cordovaToast.show('Network is not available Try Again...', 'long', 'bottom');
        }


    }



    $scope.save = function (rowsOfPopulateData,uploadEntryStatus) {

        if (sp_Obj.type == "offlineUpdateEntry") {

            dataServices.updateLocPopEntryToLoacalDB(rowsOfPopulateData, l_appSeqNo, sp_Obj.index,uploadEntryStatus).then(function (data) {
                $cordovaToast.show('Entry saved successfully', 'long', 'bottom')
                $ionicHistory.goBack(-1);
            }, function (err) {
                $cordovaToast.show('Try Again', 'long', 'bottom')
            })
        } else {

            var tempDate = $filter('date')(new Date(), 'MM-dd-yyyy hh:mm:ss');
            rowsOfPopulateData.push({ column_desc: "DATE", column_name: "DATE", column_type: "DATE", entry_by_user: "F", value: tempDate });

            var entryType = "populated"

            // console.log("save" + JSON.stringify(rowsOfPopulateData));

            dataServices.addEntryToLoacalDB(rowsOfPopulateData, l_appSeqNo, $scope.fieldsTH, $scope.defaultPopulateDataLength,uploadEntryStatus, entryType).then(function (data) {
                $cordovaToast.show('Entry saved successfully', 'long', 'bottom')
                $ionicHistory.goBack(-1);
            }, function (err) {
                $cordovaToast.show('Try Again', 'long', 'bottom')
            })
        }

    }


    function getLatLng(temp1, index) {

        return $q(function (resolve, reject) {

            var l_latitude = '';
            var l_longitude = '';
            var l_location = '';
            var posOptions = { timeout: 5000, enableHighAccuracy: false };

            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                l_latitude = position.coords.latitude;
                l_longitude = position.coords.longitude;

                var tempDate = $filter('date')(new Date(), 'MM-dd-yyyy hh:mm:ss');

                temp1.push({ column_name: "LATITUDE", entry_by_user: "F", value: l_latitude });
                temp1.push({ column_name: "LONGITUDE", entry_by_user: "F", value: l_longitude });
                temp1.push({ column_name: "LOCATION_DATETIME", entry_by_user: "F", value: tempDate });

                getLocation(temp1, index, l_latitude, l_longitude).then(function (data) {
                    resolve(data);
                }, function (err) {
                    resolve(data);
                })
            }, function (err) {
                // alert("err"+err)
                $cordovaToast.show('Unable to get Location...', 'long', 'bottom');
                reject();
            });

        })
    }

    function getLocation(temp1, index, lat, lng) {

        return $q(function (resolve, reject) {
            var l_location = '';
            var posOptions = { timeout: 5000, enableHighAccuracy: false };
            var l_latlng = new google.maps.LatLng(lat, lng);
            var l_geocoder = geocoder = new google.maps.Geocoder();
            l_geocoder.geocode({ 'latLng': l_latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        l_location = results[1].formatted_address;
                        temp1.push({ column_name: "LOCATION", entry_by_user: "F", value: l_location });
                        resolve(temp1);
                    }
                }
            });
        }, function (err) {
            resolve(temp1);
        })

    }



    $scope.autoCalculation = function (column_name) {
        $scope.rowsOfPopulateData.forEach(function (obj1) {
            obj1 = globalObjectServices.autoCalculation(column_name, obj1)
        })
    }


    // $scope.recordedVideoData = "";
    // $scope.takeImage = function(column_name) {
    $scope.takeImage = function (column_name, index) {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        }
        $cordovaCamera.getPicture(options).then(function (imageData) {
            // $scope.overlay(column_name, ('data:image/jpeg;base64,' + imageData));
            var temp1 = $scope.rowsOfPopulateData[index];
            if (temp1) {
                temp1.forEach(function (obj) {
                    if (obj.column_name == column_name) {
                        obj.value = imageData;
                    }
                })
                $scope.rowsOfPopulateData.splice(index, 1, temp1);
            }
        }, function (err) { })
    }


    $scope.cancelAddUpdateEntry = function () {
        $ionicHistory.goBack(-1)
    }



    $scope.openLov = function (column_desc, column_name, dependent_row, dependent_row_logic, item_help_property) {
        $scope.lov = "";
        $scope.column_desc = column_desc;
        $scope.column_name = column_name;
        $scope.flagLOVCodeValue = "";
        $scope.searchEntity.search = '';
        $scope.itemHelpPropertyFlag = item_help_property;

        if (dependent_row == null) {
            var url = $scope.url + 'getLOVDyanamically?uniqueID=' + l_appSeqNo + '&forWhichColmn=' + column_name;
            // console.log(url);
            var id = l_appSeqNo + column_name;
        } else {
            if (dependent_row_logic == "=" || dependent_row_logic == "null") {
                $cordovaToast.show('Data is not available', 'long', 'center');
            } else {
                var url = $scope.url + 'getLOVDyanamically?uniqueID=' + l_appSeqNo + '&whereClauseValue=' + dependent_row_logic + '&forWhichColmn=' + column_name;
                var id = l_appSeqNo + column_name + dependent_row_logic;
            }
        }
        if ($rootScope.online) {
            $http.get(url).success(function (data) {
                $scope.lov = data.locationList
                if ($scope.lov == '') { $cordovaToast.show('Data is not available', 'long', 'center'); } else {
                    setLov();
                }
            }).error(function (data) {
                $cordovaToast.show('Data is not available', 'long', 'center');
            })
        } else {
            pouchDBService.getObject("lov" + l_appSeqNo + column_name).then(function (data) {
                $scope.lov = data.lov;
                if ($scope.lov == '') { $cordovaToast.show('Data is not available', 'long', 'center'); } else {
                    setLov();
                }
            }, function (err) {
                $cordovaToast.show('Data is not available', 'long', 'center');
            })
        }
    }

    function setLov() {
        var l_lovToSearch = $scope.lov;
        $scope.lov.forEach(function (obj) {
            if (obj.rowId != "") {
                obj.code = '';
                $scope.flagLOVCodeValue = "Empty";
            }
        })
        $scope.addEntryLOVModal.show();
        $ionicScrollDelegate.scrollTop();
        var log = [];
        $scope.alphabet = iterateAlphabet();
        //Sort user list by first letter of name
        var l_tempSortedLov = {};
        for (i = 0; i < l_lovToSearch.length; i++) {
            var letter = l_lovToSearch[i].name.toUpperCase().charAt(0);
            if (l_tempSortedLov[letter] == undefined) {
                l_tempSortedLov[letter] = []
            }
            l_tempSortedLov[letter].push(l_lovToSearch[i]);
        }
        $scope.sorted_users = l_tempSortedLov;
    }


    /* To set Lov Values */
    $scope.setLOVValues = function (code, name, column_desc, dependent_row, rowID) {
        $scope.fields = addUpdateEntryServices.setLOVValues(code, name, column_desc, dependent_row, rowID,
            $scope.fields, l_appSeqNo, sp_Obj.type, $scope.url)
            
        $scope.addEntryLOVModal.hide();
        globalObjectServices.scrollTop();
    }


    $scope.setmultiLOVvalue = function (code, name, column_desc, dependent_row, rowID) {
        $scope.fields = addUpdateEntryServices.setmultiLOVvalue(code, name, column_desc, $scope.fields);
    }

    /* To set Dependent Lov */
    $scope.dependent_lov = function (dependent_row, value) {
        $scope.fields = addUpdateEntryServices.dependent_lov(dependent_row, value, $scope.fields)
    }

    /* Open Pop over for TextArea editor in ADD_UPDATE Entry Form */
    $scope.textAreaPopOver = function ($event, column_name, value) {
        $scope.nameOfColumn = column_name;
        $scope.textAreaPopOverModal.show($event);
    };

    $scope.saveTextArea = function (textAreaValue, column_name) {
        $scope.fields = addUpdateEntryServices.saveTextArea(textAreaValue, column_name, $scope.fields)
        $scope.textAreaPopOverModal.hide();
    }

    //Click letter event
    $scope.searchLovbyAlpha = function (id) {
        globalObjectServices.searchLovbyAlpha(id)
    }


    /* dependent_nullable_logic - Make particular control manditory on the basis of selected value in dependent control */

    $scope.dependent_nullable_logic = function (value, column_name, dependent_value, flag) {
        addUpdateEntryServices.dependent_nullable_logic(value, column_name, $scope.fields, $scope.url, l_appSeqNo, dependent_value, flag).then(function (data) {
            $scope.fields = data;
            if (flag == 'search') {            
            }else{
                globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo);
            }
        });

    }


    $scope.$on('$destroy', function () {
        $scope.addEntryLOVModal.remove().then(function () {
            $scope.addEntryLOVModal = null;
        })
        $scope.textAreaPopOverModal.remove().then(function () {
            $scope.textAreaPopOverModal = null;
        })
    });







})


    .service('locationEntryServices', function ($q, $http, $rootScope, pouchDBService, AuthServices, $cordovaToast, $filter) {
        var appTypes = "";
        var l_userCode = AuthServices.userCode();


        function setinfo(fields, defaultPopulateData) {
            var res = {};
            res.fieldsTH = [];
            res.rowsOfPopulateData = [];
            res.uploadEntryStatus = []
            var count = 0;


            fields.forEach(function (obj) {
                var v = '';
                angular.forEach(obj, function (value, key) {
                    if (key == 'column_desc') {
                        v = value
                    }
                    if (key == "entry_by_user") {
                        if (value == "T" || value == "R" && v !== '') {
                            res.fieldsTH.push(v)
                        }
                    }
                })
            })

            res.fieldsTH.push("Upload Location");
            angular.forEach(defaultPopulateData, function (value, key) {
                res.defaultPopulateDataLength = Object.keys(defaultPopulateData[key]).length;
            })

            var tempdisable = true;
            for (var i = 0; i < res.defaultPopulateDataLength; i++) {
                fields.forEach(function (obj) {
                    var tempDefaultPopulateData = "";
                    angular.forEach(defaultPopulateData, function (value, key) {
                        if (key == obj.column_name); {
                            tempDefaultPopulateData = defaultPopulateData[obj.column_name];
                        }
                    })
                    if (obj.column_desc == "SLNO") {
                        obj.value = i;
                    } else {
                        if (tempDefaultPopulateData == "undefined" || tempDefaultPopulateData == undefined || tempDefaultPopulateData == "") { } else {
                            obj.value = tempDefaultPopulateData[i];
                        }
                    }
                    if (obj.entry_by_user == "T" || obj.entry_by_user == "R") {
                        if (tempdisable) {
                            obj.entry_by_user = "T";

                        } else {
                            obj.entry_by_user = "R";
                        }
                    }

                })
                res.uploadEntryStatus[count] = 'F';
                count++;
                tempdisable = false;
                var tempCopy = angular.copy(fields);
                res.rowsOfPopulateData.push(tempCopy);
            }
            return res;

        }

        function uploadLocation(item, url, l_appSeqNo) {

            return $q(function (resolve, reject) {
                var key = "valueToSend";
                // console.log(item);


                item.forEach(function (obj) {
                    // if (obj.column_type == "DATETIME") {
                    //     obj[key] = ($filter('date')(obj.value, 'MM-dd-yyyy hh:mm:ss'));
                    // } else {
                    if (obj.column_desc == "User Code" || obj.column_desc == "USER_CODE") {
                        obj[key] = l_userCode
                    } else {
                        if (obj.temp != null) {
                            obj[key] = (obj.temp + "#" + obj.value);
                        } else {
                            if (obj.codeOfValue != null) {
                                obj[key] = obj.codeOfValue;
                            } else {
                                obj[key] = obj.value;
                            }
                        }
                    }
                    // }
                })

                var l_record = {};
                var l_imgfile = {};
                var l_imgfiles = [];
                var l_fileCount = 1;
                var l_videoFile = {}
                var l_videoFiles = [];

                var orderList = [];


                item.forEach(function (data) {
                    // fieldsData.forEach(function(data) {
                    var key = ""; // Variable 'key' is used to denote key value pair, for generating dynamic JSON for ADD_ENTRY 
                    var value = ""; // Variable 'value' is used to denote key value pair, for generating dynamic JSON for ADD_ENTRY
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

                key = 'DYNAMIC_TABLE_SEQ_ID';
                value = l_appSeqNo;
                l_record[key] = value;

                // if ("T" == AuthServices.data_UPLOAD()) {

                // alert(JSON.stringify(l_record));
                // }

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

                var currentTime = new Date();

                var uploadUrl = url + 'addEntryDyanamically';


                var orderListToSend = {};
                key = "list";
                orderListToSend[key] = orderList;

                var fd = new FormData();
                fd.append('jsonString', JSON.stringify(l_DataToUpload));
                // console.log("JSON STRING upload : " + JSON.stringify(l_DataToUpload));
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function (data) {
                    // $ionicLoading.hide();

                    // Calculate Response Time
                    var stopwatch = (new Date() - currentTime) / 1000;
                    // alert("Response Time to add entry :" + stopwatch);

                    if (data.status == "insert data") {
                        $cordovaToast.show('Entry Saved Successfully..', 'long', 'bottom');
                        // $ionicHistory.goBack(-2);
                    } else {
                        if (data.status == "updated data") {
                            $cordovaToast.show('Entry Updated Successfully..', 'long', 'bottom');
                        } else {
                            $cordovaToast.show('Try again to add entry..', 'long', 'bottom');
                        }
                    }
                    resolve("success")
                }).error(function (data) {
                    // $ionicLoading.hide();
                    reject();
                    $cordovaToast.show('Try Again..', 'long', 'bottom')
                })
            })
        }

        return {
            setinfo: setinfo,
            uploadLocation: uploadLocation
        }
    })