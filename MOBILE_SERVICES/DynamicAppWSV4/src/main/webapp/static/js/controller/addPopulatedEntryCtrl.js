angular.module('starter.controllers').controller('addPopulatedEntryCtrl', function ($cordovaGeolocation, AuthServices, $filter,
        $state, $stateParams, $ionicModal, $scope, addUpdateEntryServices, globalObjectServices,
        $rootScope, pouchDBService, dataServices, $ionicPopover) {

    var l_userCode = AuthServices.userCode();
    var l_appSeqNo = AuthServices.appSeqNo();

    // var sp_Obj = $state.params.obj // state params getting from dashbord , entryList,calendar states
    var sp_Obj = AuthServices.tabParam();
    $scope.rowsOfPopulateData = [];
    $scope.table_desc = sp_Obj.table_desc;
    $scope.searchEntity = {};
    $scope.fieldsTH = [];

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

    if (sp_Obj.type == "Update") {
        var l_url = $scope.url + 'updateEntryForm?tableSeqNo=' + l_appSeqNo + '&entrySeqId=' +
                sp_Obj.seqId + '&userCode=' + l_userCode;
    } else {
        if ((sp_Obj.updation_process).indexOf('V') > -1) {
            $scope.flagForEntryListButton = 'V#';
        }
        var l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode;
    }
    if ($rootScope.online) {
        if (sp_Obj.type == "offlineUpdateEntry") {
            var l_obj = "";
            if (sp_Obj.flagFororder == 1) {
                $scope.rowsOfPopulateData = sp_Obj.orderEntry;
                for (var i = 0; i < 1; i++) {
                    $scope.rowsOfPopulateData.forEach(function (obj) {
                        l_obj = angular.copy(obj);
                    })
                }
                l_obj.forEach(function (obj1) {
                    if (obj1.entry_by_user == "T" || obj1.entry_by_user == "R" && obj1.entry_by_user !== '') {
                        $scope.fieldsTH.push(obj1.column_desc);
                    }
                })
            } else {
                $scope.rowsOfPopulateData = sp_Obj.recordsInfo;
                $scope.fieldsTH = sp_Obj.fieldsTH;
            }
        } else {
            dataServices.getEntryFromData(l_url, l_appSeqNo).then(function (data) {
                $scope.fields = data.recordsInfo;
                $scope.default_populated_data = data.defaultPopulateData;
                setData();
                setTableValue($scope.default_populated_data);
            }, function (err) {
                globalObjectServices.displayErrorMessage(err)
            })
        }
    } else {
        if (sp_Obj.type == "offlineUpdateEntry") {
            var l_obj = "";
            if (sp_Obj.flagFororder == 1) {
                $scope.rowsOfPopulateData = sp_Obj.orderEntry;
                if ($scope.rowsOfPopulateData != '') {
                    for (var i = 0; i < 1; i++) {
                        $scope.rowsOfPopulateData.forEach(function (obj) {
                            l_obj = angular.copy(obj);
                        })
                    }
                    l_obj.forEach(function (obj1) {
                        if (obj1.entry_by_user == "T" || obj1.entry_by_user == "R" && obj1.entry_by_user !== '') {
                            $scope.fieldsTH.push(obj1.column_desc);
                        }
                    })
                } else {
                }
            } else {
                $scope.rowsOfPopulateData = sp_Obj.recordsInfo;
                $scope.fieldsTH = sp_Obj.fieldsTH;
            }
        } else {
            var id = l_appSeqNo.toString();
            id = id + "";
            $scope.rowsOfPopulateData = [];
            pouchDBService.getObject(id).then(function (data) {
                $scope.fields = data.recordsInfo;
                $scope.default_populated_data = data.defaultPopulateData;
                setData();
                setTableValue($scope.default_populated_data);
            }, function (err) {
                alert('Data is not available please REFRESH app')
            })
        }
    }

    function setTableValue(default_populated_data1) {
        var default_populated_data = default_populated_data1;
        $scope.fields.forEach(function (obj) {
            if (obj.entry_by_user == "T" || obj.entry_by_user == "R" && obj.entry_by_user !== '') {
                $scope.fieldsTH.push(obj.column_desc);
            }
        })
        angular.forEach(default_populated_data, function (value, key) {
            $scope.defaultPopulateDataLength = Object.keys(default_populated_data[key]).length;
        })
        for (var i = 0; i < $scope.defaultPopulateDataLength; i++) {
            $scope.fields.forEach(function (obj) {
                var defaultPopulateData = "";
                angular.forEach(default_populated_data, function (value, key) {
                    if (key == obj.column_name)
                        ;
                    {
                        defaultPopulateData = default_populated_data[obj.column_name];
                    }
                })
                if (obj.column_desc == "SLNO") {
                    obj.value = i;
                } else {
                    if (defaultPopulateData == "undefined" || defaultPopulateData == undefined ||
                            defaultPopulateData == "") {
                    } else {
                        obj.value = defaultPopulateData[i];
                    }
                }
            })
            var tempCopy = angular.copy($scope.fields);
            $scope.rowsOfPopulateData.push(tempCopy);
        }
    }

    function setData() {
        $scope.fields = addUpdateEntryServices.setDataCommon($scope.fields);
        if (sp_Obj.type == "Update") {
            $scope.fields.forEach(function (obj1) {
                if ((obj1.updation_process).indexOf("U") > -1) {
                } else {
                    obj1.entry_by_user = "R";
                }
                if (obj1.auto_calculation !== null) {
                    l_auto_calculation_eq = obj1.auto_calculation;
                    l_equationOP = obj1.column_name;
                }
                $scope.fields.forEach(function (obj2) {
                    if (obj1.column_name == obj2.dependent_row) {
                        obj2.dependent_row_logic = obj1.codeOfValue;
                    }
                    if ((l_auto_calculation_eq.indexOf(obj2.column_name)) > -1) {
                        obj2.auto_calculation = l_auto_calculation_eq;
                        obj2.equationOP = l_equationOP;
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
        $scope.rowsOfPopulateData.forEach(function (obj1) {
            obj1 = globalObjectServices.autoCalculation(column_name, obj1)
        })
    }

    /* Got to EntryList */
    $scope.entryList = function () {
        var l_obje = [];
        l_obje.seqNo = l_appSeqNo;
        l_obje.types = sp_Obj.types;
        var dates = new Date();
        var Inputdate = JSON.stringify($filter('date')(dates, 'dd-MM-yyyy'));
        l_obje.date2 = Inputdate.split('"').join('');
        l_obje.table_desc = $scope.table_desc;
        l_obje.firstScreen = sp_Obj.firstScreen;
        l_obje.updation_process = sp_Obj.updation_process;
        $state.go('entryList', {obj: l_obje});
        globalObjectServices.nativeTranstion("right");
    }

    $scope.addOrder = function (fieldsData) {
        // console.log("listOfEntry" + JSON.stringify(fieldsData));
        globalObjectServices.showLoading();
        var key = "valueToSend";
        if ($rootScope.online) {
            if (sp_Obj.type == "offlineUpdateEntry") {
                if (sp_Obj.flagFororder == 1) {
                    // var tempAppSeqNo = AuthServices.appSeqNo();
                    var entryType = "orderEntry";
                    // console.log("data"+JSON.stringify(fieldsData)) 
                    dataServices.updateOrderEntryToLoacalDB(fieldsData, l_appSeqNo, sp_Obj.index,
                            sp_Obj.tempAppSeqNo, entryType).then(function (data) {
                        globalObjectServices.hideLoading();
                        globalObjectServices.goBack(-2);
                        globalObjectServices.nativeTranstion("down");
                        globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                    }, function (err) {
                        globalObjectServices.displayCordovaToast('Try Again..')
                    })
                } else {
                    dataServices.updateEntryToLoacalDB(fieldsData, l_appSeqNo, sp_Obj.index).then(function (data) {
                        globalObjectServices.hideLoading();
                        globalObjectServices.goBack(-2);
                        globalObjectServices.nativeTranstion("down");
                        globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                    }, function (err) {
                        globalObjectServices.displayCordovaToast('Try Again..')
                    })
                }
            } else {
                var orderList = [];
                fieldsData.forEach(function (obj1) {
                    obj1.forEach(function (obj) {
                        if (obj.column_type == "DATETIME") {
                            obj[key] = ($filter('date')(obj.value, 'MM-dd-yyyy hh:mm:ss'));
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
                                            obj[key] = obj.codeOfValue;
                                        } else {
                                            obj[key] = obj.value;
                                        }
                                    }
                                }
                            }
                        }
                    })
                })
                dataServices.uploadAllEntry(fieldsData, l_appSeqNo, $scope.url).then(function (data) {
                    $scope.addEntryLOVModal.remove().then(function () {
                        $scope.addEntryLOVModal = null;
                    });
                    globalObjectServices.hideLoading();
                    if (data.status == "insert data") {
                        globalObjectServices.displayCordovaToast('Entry Saved Successfully..')
                        globalObjectServices.goBack(-1);
                        globalObjectServices.nativeTranstion("down");
                    } else
                    if (data.status == "updated data") {
                        globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                        globalObjectServices.goBack(-2);
                        globalObjectServices.nativeTranstion("down");
                    } else {
                        globalObjectServices.displayCordovaToast(data.status);
                    }
                    $scope.addEntryLOVModal.remove().then(function () {
                        $scope.addEntryLOVModal = null;
                    });
                },
                        function (err) {
                            globalObjectServices.displayErrorMessage(err)
                        });
            }
        } else {
            if (sp_Obj.type == "offlineUpdateEntry") {
                if (sp_Obj.flagFororder == 1) {
                    // var tempAppSeqNo = AuthServices.appSeqNo();
                    var entryType = "orderEntry";
                    dataServices.updateOrderEntryToLoacalDB(fieldsData, l_appSeqNo, sp_Obj.index,
                            sp_Obj.tempAppSeqNo, entryType).then(function (data) {
                        globalObjectServices.hideLoading();
                        globalObjectServices.goBack(-2);
                        globalObjectServices.nativeTranstion("down");
                        globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                    }, function (err) {
                        globalObjectServices.displayCordovaToast('Try Again...')
                    })
                } else {
                    dataServices.updateEntryToLoacalDB(fieldsData, l_appSeqNo, sp_Obj.index).then(function (data) {
                        globalObjectServices.hideLoading();
                        globalObjectServices.goBack(-2);
                        globalObjectServices.nativeTranstion("down");
                        globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                    }, function (err) {
                        globalObjectServices.displayCordovaToast('Try Again...')
                    })
                }
            } else {
                globalObjectServices.hideLoading();
                var tempDate = $filter('date')(new Date(), 'MM-dd-yyyy hh:mm:ss');
                $scope.rowsOfPopulateData.push({
                    column_desc: "DATE",
                    column_name: "DATE",
                    column_type: "DATE",
                    entry_by_user: "F",
                    value: tempDate
                });
                dataServices.addEntryToLoacalDB($scope.rowsOfPopulateData, l_appSeqNo, $scope.fieldsTH).then(function (data) {
                    if (sp_Obj.type == "order") {
                        $state.go('addUpdateOrder', {obj: sp_Obj});
                        globalObjectServices.nativeTranstion("right");
                    } else {
                        globalObjectServices.hideLoading();
                        globalObjectServices.goBack(-1);
                        globalObjectServices.nativeTranstion("down");
                    }
                }, function (err) {
                    globalObjectServices.displayCordovaToast('Try Again...')
                })
            }
        }
    }

    $scope.cancelAddUpdateEntry = function () {
        globalObjectServices.confirmationPopup('Do you want to Cancel Entry??').then(function (data) {
            if (data == 'ok') {
                globalObjectServices.goBack(-1);
                globalObjectServices.nativeTranstion("down");
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
})