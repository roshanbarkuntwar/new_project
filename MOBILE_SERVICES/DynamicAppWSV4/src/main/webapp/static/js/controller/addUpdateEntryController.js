angular.module('starter.controllers').controller('addUpdateEntryCtrl', function ($cordovaGeolocation, AuthServices, $filter,
        $state, $stateParams, addUpdateEntryServices, $ionicModal, $scope, dataServices,
        globalObjectServices, pouchDBService, $rootScope, $ionicPopover, $sce, $cordovaCapture) {

    var l_userCode = AuthServices.userCode();
    var l_appSeqNo = AuthServices.appSeqNo();

    // var sp_Obj = $state.params.obj // state params getting from dashbord , entryList,calendar states
    var sp_Obj = AuthServices.tabParam();
    var l_url = "";
    $scope.table_desc = sp_Obj.table_desc;
    $scope.searchEntity = {};
    $scope.flagForEntryListButton = 0;
    var l_tempSeqNo = l_appSeqNo;
    var column_catg_value = "";

    /* Getting Lat ,Long and TimeStamp */
    var l_object = [];
    var l_object = addUpdateEntryServices.getLatLangTimeStamp();

    /* Screen Orientation */
    if (AuthServices.screenOrientionView() == "V") {
        // window.screen.lockOrientation('portrait');
    } else {
        if (AuthServices.screenOrientionView() == "H") {
            // window.screen.lockOrientation('landscape');
        }
    }

    /* initialization of Modal's */
    $ionicModal.fromTemplateUrl('/DynamicAppWSV4/static/templates/addEntryLOV.html', function (modal) {
        $scope.addEntryLOVModal = modal
    }, {scope: $scope})

    $ionicModal.fromTemplateUrl('/DynamicAppWSV4/static/templates/textAreaPopOver.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.textAreaPopOverModal = popover;
    });

    if (sp_Obj.type == "Update") {
        if (sp_Obj.types == 'O') {
            l_appSeqNo = ((parseInt(l_appSeqNo)) + 0.1);
            l_url = $scope.url + 'updateEntryForm?tableSeqNo=' + l_appSeqNo + '&entrySeqId=' + sp_Obj.seqId + '&userCode=' +
                    l_userCode;
        } else {
            l_url = $scope.url + 'updateEntryForm?tableSeqNo=' + l_appSeqNo + '&entrySeqId=' + sp_Obj.seqId + '&userCode=' +
                    l_userCode;
        }
    } else {
        if ((sp_Obj.updation_process).indexOf("V") > -1) {
            $scope.flagForEntryListButton = 'V#';
        }
        if (sp_Obj.type == "order") {
            l_appSeqNo = ((parseInt(l_appSeqNo)) + 0.1);
            l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode;
        } else {
            //addEntryForm 
            l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode;
        }
    }
    if ($rootScope.online) {
        if (sp_Obj.type == "offlineUpdateEntry") {
            if (sp_Obj.headEntry != undefined) {
                var temp = angular.copy(sp_Obj.headEntry);
                $scope.fields = temp;
            } else {
                var temp = angular.copy(sp_Obj.recordsInfo);
                $scope.fields = temp;
            }
            setData();
        } else {
            dataServices.getEntryFromData(l_url, l_appSeqNo).then(function (data) {
                $scope.fields = data.recordsInfo;
                $scope.fields = addUpdateEntryServices.setDataCommon($scope.fields);
                setData();
            }, function (err) {
                globalObjectServices.displayErrorMessage(err)
            })
        }
    } else {
        if (sp_Obj.type == "offlineUpdateEntry") {
            if (sp_Obj.headEntry != undefined) {
                var temp = angular.copy(sp_Obj.headEntry);
                $scope.fields = temp;
            } else {
                var temp = angular.copy(sp_Obj.recordsInfo);
                $scope.fields = temp;
            }
            setData();
        } else {
            var id = l_appSeqNo.toString();
            id = id + "";
            pouchDBService.getObject(id).then(function (data) {
                $scope.fields = data.recordsInfo;
                $scope.fields = addUpdateEntryServices.setDataCommon($scope.fields);
                $scope.fields.forEach(function (obj) {
                    if (obj.column_type == "DATE" || obj.column_type == "DATETIME") {
                        obj.value = $filter('date')(new Date(), 'dd-MM-yyyy hh:mm:ss');
                    }
                })
                setData();
            }, function (err) {
                alert('Data is not available please REFRESH app')
            })
        }
    }

    function setData() {
        if (sp_Obj.type == "Update") {
            $scope.fields.forEach(function (obj1) {
                if (obj1.column_type == "VIDEO") {
                    obj1.item_help_property = "V";
                    var l_videoSrcData = 'data:video/mp4;base64,' + obj1.value;
                    $scope.videoSignature = {src: l_videoSrcData, title: "Video Data"}; //Adding Incoming video data to Src
                    $scope.recordedVideoData = $scope.trustSrc($scope.videoSignature.src); //Making video data as trusted src for displaying video
                }
                if ((obj1.updation_process).indexOf("U") > -1) {
                } else {
                    obj1.entry_by_user = "R";
                }

                $scope.fields.forEach(function (obj2) {
                    if (obj1.column_name == obj2.dependent_row) {
                        obj2.dependent_row_logic = obj1.codeOfValue;
                    }
                })
            })
        } else {
            if (sp_Obj.type == "offlineUpdateEntry") {
                $scope.fields.forEach(function (obj1) {
                    $scope.fields.forEach(function (obj2) {
                        if (obj1.column_name == obj2.dependent_row) {
                            obj2.dependent_row_logic = obj1.codeOfValue;
                        }
                    })
                    if (obj1.column_type == "VIDEO") {
                        obj1.item_help_property = "V";
                        var l_videoSrcData = 'data:video/mp4;base64,' + obj1.value;
                        $scope.videoSignature = {src: l_videoSrcData, title: "Video Data"}; //Adding Incoming video data to Src
                        $scope.recordedVideoData = $scope.trustSrc($scope.videoSignature.src); //Making video data as trusted src for displaying video
                    }
                    if ((obj1.updation_process).indexOf("U") > -1) {
                        if (obj1.column_desc == "User Code") {
                        } else {
                            obj1.entry_by_user = "T";
                        }
                    } else {
                        obj1.entry_by_user = "R";
                    }
                })
            } else {
                $scope.fields.forEach(function (obj1) {
                    if ((obj1.updation_process).indexOf("I") > -1) {
                    } else {
                        obj1.entry_by_user = "F";
                        obj1.nullable = "T";
                    }
                })
            }
        }
    }


    /* Autocalculation*/
    $scope.autoCalculation = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculation(column_name, $scope.fields)
    }

    $scope.autoCalculationOfDuration = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculationOfDuration($scope.fields, column_name)
    }

    /* Got to EntryList */
    $scope.entryList = function () {
        var l_obje = [];
        l_obje.seqNo = l_appSeqNo;
        var dates = new Date();
        var Inputdate = JSON.stringify($filter('date')(dates, 'dd-MM-yyyy'));
        l_obje.date2 = Inputdate.split('"').join('');
        l_obje.table_desc = $scope.table_desc;
        l_obje.firstScreen = sp_Obj.firstScreen;
        l_obje.updation_process = sp_Obj.updation_process;
        if (sp_Obj.type == "order") {
            l_obje.types = sp_Obj.types;

        }
        $state.go('entryList', {obj: l_obje});
        globalObjectServices.nativeTranstion("left");
    }

    $scope.addNewEntry = function (fieldsData) {
        // console.log(JSON.stringify(fieldsData))
        var checkForSessionEntry = false;
        globalObjectServices.showLoading();
        var key = "valueToSend";
        fieldsData.forEach(function (obj) {
            // if (obj.column_type == "DATETIME") {
            //     obj[key] = ($filter('date')(obj.value, 'MM-dd-yyyy hh:mm:ss'));
            // } else {
            if (!checkForSessionEntry) {
                if (obj.session_column_flag == "T") {
                    dataServices.storeSessionColumn(obj.column_name, obj.value, obj.codeOfValue).then(function (data) {})
                    globalObjectServices.hideLoading();
                    checkForSessionEntry = true;
                    globalObjectServices.displayCordovaToast('Entry saved successfully..')
                    globalObjectServices.goBack(-1);
                } else {
                    if (obj.column_name == "VRNO" || obj.column_desc == "VRNO") {
                        if (obj.item_help_property == "L") {
                            sp_Obj.VRNO = obj.codeOfValue;
                            obj[key] = obj.codeOfValue;
                        } else {
                            sp_Obj.VRNO = obj.value;
                            obj[key] = obj.value;
                        }
                    } else {
                        if (obj.column_name == "ENTITY_CODE" || obj.column_desc == "Entity Code") {
                            sp_Obj.ENTITY_CODE = obj.value;
                            obj[key] = obj.value;
                        } else {
                            if (obj.column_name == "TCODE" || obj.column_desc == "TCode") {
                                sp_Obj.TCODE = obj.value;
                                obj[key] = obj.value;
                            } else {
                                if (obj.column_name == "VRDATE" || obj.column_desc == "VRDATE") {
                                    if (AuthServices.entity_code() == "PF") {
                                        sp_Obj.VRDATE = $filter('date')(new Date(obj.value), "M-dd-yyyy");
                                        obj[key] = $filter('date')(new Date(obj.value), "M-dd-yyyy");
                                    } else {
                                        sp_Obj.VRDATE = obj.value;
                                        obj[key] = obj.value;
                                    }
                                } else {
                                    if (obj.column_name == "DIV_CODE") {
                                        sp_Obj.DIV_CODE = obj.value;
                                        obj[key] = obj.value;
                                    } else {
                                        if (obj.column_name == "SLNO") {
                                            if (obj.value) {
                                                obj.value = parseInt(obj.value) + 1;
                                                sp_Obj.SLNO = obj.value;
                                                obj[key] = obj.value;
                                            } else {
                                                obj.value = 1;
                                                sp_Obj.SLNO = obj.value;
                                                obj[key] = obj.value;
                                            }
                                        } else {
                                            if (obj.column_name == "ITEM_CODE") {
                                                sp_Obj.ITEM_CODE = obj.value;
                                                obj[key] = obj.value;
                                            } else {
                                                if (obj.column_name == "UM") {
                                                    sp_Obj.UM = obj.value;
                                                    obj[key] = obj.value;
                                                } else {
                                                    if (obj.column_name == "AUM") {
                                                        sp_Obj.AUM = obj.value;
                                                        obj[key] = obj.value;
                                                    } else {
                                                        if (obj.column_name == "ACC_CODE" || obj.column_desc == "Select Dealer" ||
                                                                obj.column_desc == "Party Name") {
                                                            sp_Obj.ACC_CODE = obj.codeOfValue;
                                                            obj[key] = obj.codeOfValue;
                                                        } else {
                                                            if (obj.column_desc == "Consumer Number") {
                                                                sp_Obj.consumerNumber = obj.value;
                                                                obj[key] = obj.value;
                                                            } else {
                                                                if (obj.column_desc == "Order Date") {
                                                                    sp_Obj.Order_Date = obj.value;
                                                                    obj[key] = obj.value;
                                                                } else {
                                                                    if (obj.column_desc == "User Code" || obj.column_desc == "USER_CODE") {
                                                                        obj[key] = l_userCode
                                                                    } else {
                                                                        if (obj.item_help_property == "MD") {
                                                                            if (obj.value || obj.value == '') {
                                                                                obj.value.forEach(function (data) {
                                                                                    if (obj[key]) {
                                                                                        obj[key] = obj[key] + "," + data;
                                                                                    } else {
                                                                                        obj[key] = data;
                                                                                    }
                                                                                })
                                                                            } else {
                                                                                obj[key] = "1";
                                                                            }
                                                                        } else {
                                                                            if (obj.temp != null) {
                                                                                obj[key] = (obj.temp + "#" + obj.value);
                                                                            } else if (obj.column_type == "DATETIME") {
                                                                                obj[key] = $filter('date')(obj.value, 'dd-MM-yyyy HH:mm:ss');
                                                                            } else {
                                                                                if (obj.codeOfValue != null) {
                                                                                    obj[key] = obj.codeOfValue;
                                                                                } else {
                                                                                    obj[key] = obj.value;
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
                                    }
                                }
                            }
                        }
                    }
                }
                if (!$rootScope.online) {
                    if (obj.column_type == "DATETIME" || obj.column_type == "DATE") {
                        obj[key] = l_object.l_dateTime;
                        obj.value = l_object.l_dateTime;
                    }
                }
            }
        });
        if (!checkForSessionEntry) {
            if ("T" == AuthServices.data_UPLOAD()) {
                fieldsData.push({
                    column_name: "LATITUDE",
                    entry_by_user: "F",
                    value: l_object.l_latitude,
                    valueToSend: l_object.l_latitude
                });
                fieldsData.push({
                    column_name: "LONGITUDE",
                    entry_by_user: "F",
                    value: l_object.l_longitude,
                    valueToSend: l_object.l_longitude
                });
                fieldsData.push({
                    column_name: "LOCATION",
                    entry_by_user: "F",
                    value: l_object.l_location,
                    valueToSend: l_object.l_location
                });
            }
            if ($rootScope.online) {
                if (sp_Obj.type == "offlineUpdateEntry") {
                    if (sp_Obj.flagFororder = 1) {
                        var tempAppSeqNo = AuthServices.appSeqNo();
                        var entryType = "headEntry";
                        globalObjectServices.hideLoading();
                        dataServices.updateOrderEntryToLoacalDB(fieldsData, l_appSeqNo, sp_Obj.index,
                                tempAppSeqNo, entryType).then(function (data) {
                            sp_Obj.entryIndex = data;
                            sp_Obj.tempAppSeqNo = tempAppSeqNo
                            $state.go('addPopulatedEntry', {obj: sp_Obj});
                            globalObjectServices.nativeTranstion("left");
                        }, function (err) {
                            globalObjectServices.displayCordovaToast('Try Again...')
                        })
                    } else {
                        dataServices.updateEntryToLoacalDB(fieldsData, l_appSeqNo, sp_Obj.index).then(function (data) {
                            globalObjectServices.hideLoading();
                            globalObjectServices.goBack(-1);
                            globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                        }, function (err) {
                            globalObjectServices.hideLoading();
                            globalObjectServices.displayCordovaToast('Try Again...')
                        })
                    }
                } else {
                    dataServices.uploadEntry(fieldsData, l_appSeqNo, $scope.url, l_object.l_latitude,
                            l_object.l_longitude, l_object.l_location, sp_Obj.type,
                            sp_Obj.seqId, sp_Obj.dependent_next_entry_seq).then(function (data) {
                        globalObjectServices.hideLoading();
                        if (data.status == "insert data") {
                            if (sp_Obj.type == "order") {
                                $state.go('addUpdateOrder', {obj: sp_Obj});
                                globalObjectServices.nativeTranstion("left");
                            } else {
                                globalObjectServices.displayCordovaToast('Entry Saved Successfully..')
                                globalObjectServices.goBack(-1);
                            }
                        } else
                        if (data.status == "updated data") {
                            if (sp_Obj.types == "O") {
                                var l_obj = [];
                                l_obj.listData = fieldsData;
                                l_obj.seqNo = ((parseInt(l_tempSeqNo)) + 0.2);
                                $state.go('entryDetailsInTabular', {obj: l_obj})
                                globalObjectServices.nativeTranstion("left");
                            } else {
                                globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                                globalObjectServices.goBack(-2);
                            }
                        } else {
                            globalObjectServices.displayCordovaToast(data.status);
                        }
                        $scope.addEntryLOVModal.remove().then(function () {
                            $scope.addEntryLOVModal = null;
                        })
                    }, function (err) {
                        globalObjectServices.hideLoading();
                        globalObjectServices.displayErrorMessage(err)
                    })
                }
            } else {
                if (sp_Obj.type == "offlineUpdateEntry") {
                    if (sp_Obj.flagFororder = 1) {
                        var tempAppSeqNo = AuthServices.appSeqNo();
                        var entryType = "headEntry";
                        // console.log("data"+JSON.stringify(fieldsData)) 
                        dataServices.updateOrderEntryToLoacalDB(fieldsData, l_appSeqNo, sp_Obj.index,
                                tempAppSeqNo, entryType).then(function (data) {
                            globalObjectServices.hideLoading();
                            sp_Obj.entryIndex = data;
                            sp_Obj.tempAppSeqNo = tempAppSeqNo;
                            sp_Obj.table_desc = sp_Obj.table_desc;
                            $state.go('addPopulatedEntry', {obj: sp_Obj});
                            globalObjectServices.nativeTranstion("left");
                        }, function (err) {
                            globalObjectServices.hideLoading();
                            globalObjectServices.displayCordovaToast('Try Again...')
                        })
                    } else {
                        dataServices.updateEntryToLoacalDB(fieldsData, l_appSeqNo, sp_Obj.index).then(function (data) {
                            globalObjectServices.hideLoading();
                            globalObjectServices.goBack(-1);
                            globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                        }, function (err) {
                            globalObjectServices.hideLoading();
                            globalObjectServices.displayCordovaToast('Try Again...')
                        })
                    }
                } else {
                    if (sp_Obj.type == "order") {
                        var tempAppSeqNo = AuthServices.appSeqNo();
                        sp_Obj.tempAppSeqNo = tempAppSeqNo;
                        var entryType = "headEntry";
                        globalObjectServices.hideLoading();
                        dataServices.addOrderEntryToLoacalDB(fieldsData, tempAppSeqNo, entryType, "",
                                l_object.l_dateTime).then(function (data) {
                            sp_Obj.entryIndex = data;
                            $state.go('addUpdateOrder', {obj: sp_Obj});
                            globalObjectServices.nativeTranstion("left");
                        }, function (err) {
                            globalObjectServices.hideLoading();
                            globalObjectServices.displayCordovaToast('Try Again...')
                        })
                    } else {
                        dataServices.addEntryToLoacalDB(fieldsData, l_appSeqNo).then(function (data) {
                            globalObjectServices.hideLoading();
                            globalObjectServices.displayCordovaToast('Entry saved successfully..')
                            globalObjectServices.goBack(-1);
                            globalObjectServices.hideLoading();
                        }, function (err) {
                            globalObjectServices.hideLoading();
                            globalObjectServices.displayCordovaToast('Try Again...')
                        })
                    }
                }
            }
        }
    }

    $scope.cancelAddUpdateEntry = function () {
        globalObjectServices.confirmationPopup('Do you want to Cancel Entry??').then(function (data) {
            if (data == 'ok') {
                globalObjectServices.goBack(-1);
            } else {
            }
        })
    }


    $scope.saveLocation = function (fields) {

        globalObjectServices.getLatLngLocTim().then(function (data) {
            fields.forEach(function (obj) {
                if (obj.column_name == "LOCATION") {
                    obj.value = data.l_location;
                }
                if (obj.column_name == "LONGITUDE") {
                    obj.value = data.l_longitude;
                }
                if (obj.column_name == "LATITUDE") {
                    obj.value = data.l_latitude;
                }
            })
            $scope.fields = fields;

        })
    }


    /* To show Lov */
    $scope.openLov = function (column_desc, column_name, dependent_row, dependent_row_logic, item_help_property) {
        globalObjectServices.showLoading();
        $scope.lov = "";
        $scope.column_desc = column_desc;
        $scope.column_name = column_name;
        $scope.flagLOVCodeValue = "";
        $scope.searchEntity.search = '';
        $scope.itemHelpPropertyFlag = item_help_property;
        addUpdateEntryServices.openLov(column_desc, column_name, dependent_row, dependent_row_logic,
                item_help_property, $scope.lov, $scope.url, l_appSeqNo).then(function (result) {
            globalObjectServices.hideLoading();
            $scope.lov = result.lov;
            $scope.alphabet = globalObjectServices.iterateAlphabet();
            $scope.sorted_users = result.sorted_users;
            $scope.flagLOVCodeValue = result.flagLOVCodeValue;
            if ($scope.lov == '' || $scope.lov == null) {

                globalObjectServices.displayCordovaToast('Data is not available..')
            } else {
                $scope.addEntryLOVModal.show();
            }
        }, function (err) {
            globalObjectServices.hideLoading();
            globalObjectServices.displayErrorMessage(err)
        })
    }

    /* To set Lov Values */
    $scope.setLOVValues = function (code, name, column_desc, dependent_row, rowID) {
        $scope.fields = addUpdateEntryServices.setLOVValues(code, name, column_desc,
                dependent_row, rowID, $scope.fields, l_appSeqNo, sp_Obj.type, $scope.url)
        $scope.addEntryLOVModal.hide();
        globalObjectServices.scrollTop();
    }

    /* To set values for Multi-select LOV */
    $scope.setmultiLOVvalue = function (lov, column_desc, column_name) {
        $scope.fields = addUpdateEntryServices.setmultiLOVvalue(lov, column_desc, column_name, $scope.fields);
        $scope.addEntryLOVModal.hide();
    }

    /* To set Dependent Lov */
    $scope.dependent_lov = function (dependent_row, value) {
        $scope.fields = addUpdateEntryServices.dependent_lov(dependent_row, value, $scope.fields)
    }

    /* Click letter event */
    $scope.searchLovbyAlpha = function (id) {
        globalObjectServices.searchLovbyAlpha(id)
    }

    /* Open Pop over for TextArea editor in ADD_UPDATE Entry Form */
    $scope.textAreaPopOver = function ($event, column_name, value) {
        $scope.nameOfColumn = column_name;
        $scope.textAreaPopOverModal.show($event);
    };

    /* Save text Area Value */
    $scope.saveTextArea = function (textAreaValue, column_name) {
        $scope.fields = addUpdateEntryServices.saveTextArea(textAreaValue, column_name, $scope.fields)
        $scope.textAreaPopOverModal.hide();
    }

    /* dependent_nullable_logic - Make particular control manditory on the basis of selected value in dependent control */
    $scope.dependent_nullable_logic = function (value, column_name) {
        $scope.fields = addUpdateEntryServices.dependent_nullable_logic(value, column_name, $scope.fields);
    }

    /* To Take Image */
    $scope.takeImage = function (column_name) {
        $scope.fields = addUpdateEntryServices.takeImage($scope.fields, column_name);
    }

    /* To Scan Barcode */
    $scope.scanBarcode = function (column_name) {
        $scope.fields = addUpdateEntryServices.scanBarcode($scope.fields, column_name);
    };

    /* To record Video */
    $scope.recordVideo = function (column_name, column_size) {
        var options = {
            quality: 0,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            targetWidth: 170,
            targetHeight: 170,
            limit: 1,
            duration: column_size,
            saveToPhotoAlbum: true
        }
        $cordovaCapture.captureVideo(options).then(function (videoData) {

            var l_videoFile = videoData[0]; //Recorded Video Data containing JSON(ex:name,type etc)
            var l_fileReader = new FileReader();
            var l_file = '';

            l_file = new window.File(l_videoFile.name, l_videoFile.localURL, l_videoFile.type, l_videoFile.lastModifiedDate, l_videoFile.size);
            l_fileReader.readAsDataURL(l_file);
            l_fileReader.onload = function (readerEvt) {
                $scope.l_base64VideoData = readerEvt.target.result; //converting captured data into base64 
                $scope.videoSignature = {src: $scope.l_base64VideoData, title: "Video Data"}; //Adding coverted base64 data to Src
                var l_recordedVideoData = $scope.trustSrc($scope.videoSignature.src); //Make src as Trusted to display Video in HTML
                $scope.$apply(function () {
                    $scope.recordedVideoData = l_recordedVideoData;
                })
                $scope.fields.forEach(function (obj) {
                    if (obj.column_name == column_name) {
                        $scope.$apply(function () {
                            obj.value = l_videoFile.name;
                        })
                    }
                    if (obj.dependent_row == column_name) { //Check for control dependency 
                        obj.excel_upload = 0;
                        obj.value = "";
                        $scope.fields.forEach(function (obj1) {
                            if (obj.column_name == obj1.dependent_row) {
                                obj1.excel_upload = 1;
                                /*variable "excel_upload" is used from web service generated JSON,to disable dependent controls */
                                obj1.value = "";
                            }
                        })
                    } else {
                    }
                })
            };
        })
    }
    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    }

    /* Text OverLay on Image*/
    var TextOverlay = function (column_name, image) {
        $scope.fields = globalObjectServices.textOverlay(column_name, image, $scope.fields)
    }
})