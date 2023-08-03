angular.module('starter.controllers').controller('addUpdateOrderCtrl', function (AuthServices, $filter,
        $state, $stateParams, $ionicModal, $scope, $ionicPopup, addUpdateEntryServices, pouchDBService,
        dataServices, globalObjectServices, $rootScope, $ionicPopover, $sce, $cordovaCapture) {

    var l_userCode = AuthServices.userCode();
    var l_appSeqNo = AuthServices.appSeqNo();

    // var sp_Obj = $state.params.obj // state params getting from dashbord , entryList,calendar states
    var sp_Obj = $state.params.obj
    $scope.table_desc = sp_Obj.table_desc;
    $scope.searchEntity = {};
    l_appSeqNo = ((parseInt(l_appSeqNo)) + 0.2);
    $scope.listOfEntry = [];
    $scope.count = 1;


    /* Getting Lat ,Long and TimeStamp */
    var l_object = [];
    var l_object = addUpdateEntryServices.getLatLangTimeStamp();

    /* Screen Orientation */
    if ("V" == AuthServices.screenOrientionView()) {
        // window.screen.lockOrientation('portrait');
    } else {
        if ("H" == AuthServices.screenOrientionView()) {
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

    if ((sp_Obj.updation_process).indexOf('V') > -1) {
        $scope.flagForEntryListButton = 'V#';
    }

    var l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode;

    if ($rootScope.online) {
        if (sp_Obj.type == "offlineUpdateEntry") {
        } else {
            dataServices.getEntryFromData(l_url, l_appSeqNo).then(function (data) {
                $scope.fields = data.recordsInfo;
                setData();
            }, function (err) {
                globalObjectServices.displayErrorMessage(err)
            })
        }
    } else {
        if (sp_Obj.type == "offlineUpdateEntry") {
        } else {
            var id = l_appSeqNo.toString();
            id = id + "";
            pouchDBService.getObject(id).then(function (data) {
                $scope.fields = data.recordsInfo;
                $scope.fields.forEach(function (obj) {
                    if (obj.column_type == "DATE" || obj.column_type == "DATETIME") {
                        obj.value = $filter('date')(new Date(), 'dd-MM-yyyy hh:mm:ss');
                    }
                })
                setData();
            }, function (err) {
                globalObjectServices.displayErrorMessage(err)
            })
        }
    }

    function setData() {
        $scope.fields.forEach(function (obj1) {

            if ((obj1.updation_process).indexOf("I") > -1) {
            } else {
                obj1.entry_by_user = "F";
                obj1.nullable = "T";
            }
            if (obj1.column_desc == "SLNO") {
                if (sp_Obj.SLNO) {
                    obj1.value = parseInt(sp_Obj.SLNO) + 1;
                } else {
                    obj1.value = 1;
                }
            }
            if (obj1.column_name == "VRNO" || obj1.column_desc == "VRNO") {
                obj1.value = sp_Obj.VRNO;
            }
            if (obj1.column_name == "ENTITY_CODE" || obj1.column_desc == "Entity Code") {
                obj1.value = sp_Obj.ENTITY_CODE;
            }
            if (obj1.column_name == "TCODE" || obj1.column_desc == "TCode") {
                obj1.value = sp_Obj.TCODE;
            }
            if (obj1.column_name == "VRDATE" || obj1.column_desc == "VRDATE") {
                obj1.value = sp_Obj.VRDATE;
            }
            if (obj1.column_name == "RETAILER_CODE" || obj1.column_desc == "Retailer Code") {
                obj1.value = sp_Obj.RETAILER_CODE;
            }
            if (obj1.column_name == "DIV_CODE") {
                obj1.value = sp_Obj.DIV_CODE;
            }
            if (obj1.column_name == "ITEM_CODE") {
                obj1.value = sp_Obj.ITEM_CODE;
            }
            if (obj1.column_name == "UM") {
                obj1.value = sp_Obj.UM;
            }
            if (obj1.column_name == "AUM") {
                obj1.value = sp_Obj.AUM;
            }
            if (obj1.column_name == "ACC_CODE" || obj1.column_desc == "Select Dealer " || obj1.column_desc == "Party Name") {
                obj1.value = sp_Obj.ACC_CODE;
            }
            if (obj1.column_desc == "Consumer Number") {
                if (sp_Obj.consumerNumber == undefined) {
                } else {
                    obj1.value = sp_Obj.consumerNumber;
                }
            }
            if (obj1.summary_function_flag == "T") {
                obj1.summary_function_flag = "Grand Total";
            }
            if (obj1.summary_function_flag == "C") {
                obj1.summary_function_flag = "Count";
            }
            if (obj1.summary_function_flag == "A") {
                obj1.summary_function_flag = "Average";
            }
        })
        $scope.fields = addUpdateEntryServices.setDataCommon($scope.fields);
    }


    /* Autocalculation*/
    $scope.autoCalculation = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculation(column_name, $scope.fields);
    }

    $scope.autoCalculationOfDuration = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculationOfDuration($scope.fields, column_name)
    }

    $scope.addItem = function (fieldsData) {
        fieldsData.forEach(function (obj) {
            if (obj.column_desc == "VRNO" || obj.column_desc == "Retailer Code" ||
                    obj.column_desc == "Select Category" || obj.column_desc == "Select Sub Category" ||
                    obj.column_desc == "Consumer Number" || obj.column_desc == "Delivery Date") {

                obj.flagforhideValue = 1;
            }
        })
        $scope.user = angular.copy(fieldsData);
        $scope.listOfEntry.push($scope.user)

        $scope.fields.forEach(function (obj) {
            if (obj.summary_function_flag == "Grand Total") {
                if (obj.summary) {
                    obj.summary = parseFloat(obj.summary) + parseFloat(obj.value);
                } else {
                    obj.summary = obj.value;
                }
            }

            if (obj.summary_function_flag == "Count") {
                if (obj.summary) {
                    obj.summary = parseInt(obj.summary) + 1;
                } else {
                    obj.summary = 1
                }
            }

            if (obj.summary_function_flag == "Average") {
                if (obj.summary) {
                    obj.summary = ((parseFloat(obj.summary) * ($scope.count - 1)) + parseFloat(obj.value));
                } else {
                    obj.summary = parseFloat(obj.value);
                }
                obj.summary = parseFloat(obj.summary) / parseFloat($scope.count)
                $scope.count++;
            }

            if (obj.column_desc == "SLNO" || obj.column_name == "SLNO") {
                obj.value = parseInt(obj.value) + 1;
            } else {
                if (obj.nullable == "F" && obj.entry_by_user == "F") {
                } else {
                    if (obj.column_name == "RETAILER_CODE" || obj.column_desc == "Consumer Number" ||
                            obj.column_desc == "VRNO") {
                    } else {
                        obj.value = "";
                    }
                }
            }
        })
        // console.log(JSON.stringify($scope.listOfEntry));
        fieldsData = "";
    }

    $scope.addOrder = function (listOfEntry) {
        // console.log("listOfEntry" + JSON.stringify(listOfEntry));
        globalObjectServices.showLoading();
        var key = "valueToSend";
        listOfEntry.forEach(function (obj1) {
            obj1.forEach(function (obj) {
                if (obj.column_type == "DATETIME") {
                    obj[key] = ($filter('date')(obj.value, 'dd-MM-yyyy hh:mm:ss'));
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
                            }
                        } else {
                            if (obj.temp != null) {
                                obj[key] = (obj.temp + "#" + obj.value);
                            } else {
                                if (obj.codeOfValue != null) {
                                    if (obj.codeOfValue == "") {
                                        obj[key] = obj.value;
                                    } else {
                                        obj[key] = obj.codeOfValue;
                                    }
                                } else {
                                    obj[key] = obj.value;
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
            });
            if ("T" == AuthServices.data_UPLOAD()) {
                obj1.push({
                    column_name: "LATITUDE",
                    entry_by_user: "F",
                    value: l_object.l_latitude,
                    valueToSend: l_object.l_latitude
                });
                obj1.push({
                    column_name: "LONGITUDE",
                    entry_by_user: "F",
                    value: l_object.l_longitude,
                    valueToSend: l_object.l_longitude
                });
                obj1.push({
                    column_name: "LOCATION",
                    entry_by_user: "F",
                    value: l_object.l_location,
                    valueToSend: l_object.l_location
                });
            }
        })
        if ($rootScope.online) {
            dataServices.uploadAllEntry(listOfEntry, l_appSeqNo, $scope.url, l_object.l_latitude,
                    l_object.l_longitude, l_object.l_location).then(function (data) {
                $scope.addEntryLOVModal.remove().then(function () {
                    $scope.addEntryLOVModal = null;
                });
                globalObjectServices.hideLoading();
                if (data.status == "insert data") {
                    globalObjectServices.displayCordovaToast('Entry Saved Successfully..')
                    globalObjectServices.goBack(-2);
                } else
                if (data.status == "updated data") {
                    globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                    globalObjectServices.goBack(-2);
                } else {
                    globalObjectServices.displayCordovaToast(data.status);
                }


                $scope.addEntryLOVModal.remove().then(function () {
                    $scope.addEntryLOVModal = null;
                });
            }, function (err) {
                globalObjectServices.displayErrorMessage(err)
            });
        } else {
            var entryType = "orderEntry";

            dataServices.addOrderEntryToLoacalDB(listOfEntry, sp_Obj.tempAppSeqNo, entryType,
                    sp_Obj.entryIndex, l_object.l_dateTime).then(function (data) {
                globalObjectServices.hideLoading();
                globalObjectServices.goBack(-2);
            }, function (err) {
                globalObjectServices.hideLoading();
                globalObjectServices.displayCordovaToast('Try Again...')
            })
        }
    }

    $scope.cancelAddUpdateEntry = function () {
        globalObjectServices.confirmationPopup('Do you want to Cancel Entry??').then(function (data) {
            if (data == 'ok') {
                globalObjectServices.goBack(-2);
            } else {
            }
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
        $scope.fields = addUpdateEntryServices.setLOVValues(code, name, column_desc, dependent_row, rowID,
                $scope.fields, l_appSeqNo, sp_Obj.type, $scope.url)
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

    /* confirmation Popup Before deleting Entry */
    $scope.confirmationTodeleteEntry = function (item, index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm ',
            template: 'Do you want to delete item??'
        });
        confirmPopup.then(function (res) {
            if (res) {
                deleteEntry(item, index);
            }
        });
    }

    /* To delete Entry */
    function deleteEntry(item, x) {
        $scope.listOfEntry.splice(x, 1);
        var t = "";
        var a = "";
        item.forEach(function (obj) {
            if (obj.summary_function_flag == "Grand Total") {
                t = obj.value
            }
            if (obj.summary_function_flag == "Average") {
                a = obj.value;
            }
        })

        $scope.fields.forEach(function (obj) {
            if (obj.summary_function_flag == "Grand Total") {
                if (obj.summary) {
                    obj.summary = parseFloat(obj.summary) - parseFloat(t);
                } else {
                    obj.summary = t;
                }
            }
            if (obj.summary_function_flag == "Count") {
                if (obj.summary) {
                    obj.summary = parseInt(obj.summary) - 1;
                } else {
                    obj.summary = 0
                }
            }
            if (obj.summary_function_flag == "Average") {
                $scope.count--;
                if ($scope.count == 1) {
                    obj.summary = 0;
                } else {
                    if (obj.summary) {
                        obj.summary = ((parseFloat(obj.summary) * ($scope.count)) - parseFloat(a));
                    } else {
                        obj.summary = parseFloat(a);
                    }
                    obj.summary = parseFloat(obj.summary) / parseFloat(($scope.count - 1))
                }
            }
            if (obj.column_desc == "SLNO") {
                obj.value = parseInt(obj.value) - 1;
            }
        })
        var slno = 1;
        $scope.listOfEntry.forEach(function (obj1) {
            obj1.forEach(function (obj2) {
                if (obj2.column_desc == "SLNO" || obj.column_name == "SLNO") {
                    obj2.value = slno;
                    slno++;
                }
            })
        })
    }
})