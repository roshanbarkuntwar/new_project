angular.module('starter.controllers').controller('addPopulatedEntryCtrl', function (AuthServices, $filter,
        $state, $stateParams, $ionicModal, $scope, addUpdateEntryServices, globalObjectServices, popOrderServ,
        $rootScope, pouchDBService, dataServices) {

    var l_userCode = AuthServices.userCode();
    var l_appSeqNo = AuthServices.appSeqNo();

    // var sp_Obj = $state.params.obj // state params getting from dashbord , entryList,calendar states
    var sp_Obj = AuthServices.tabParam();
    // $scope.rowsOfPopulateData = [];
    $scope.table_desc = sp_Obj.table_desc;
    $scope.searchEntity = {};
    $scope.fieldsTH = [];

    $scope.orderPopulatedFlag = sp_Obj.access_contrl;


    if (sp_Obj.display_clause == '2') {
        $scope.orderPopulatedFlag = sp_Obj.display_clause
        // alert("display_clause" + sp_Obj.access_contrl);
    }

    /* Screen Orientation */
    if ("V" == AuthServices.screenOrientionView()) {
        // window.screen.lockOrientation('portrait');
    } else {
        if ("H" == AuthServices.screenOrientionView()) {
            // window.screen.lockOrientation('landscape');
        }
    }

    /* initialization of Modal's */
    $ionicModal.fromTemplateUrl('static/templates/addEntryLOV.html', function (modal) {
        $scope.addEntryLOVModal = modal
    }, {scope: $scope})

    $ionicModal.fromTemplateUrl('static/templates/textAreaPopOver.html', {
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
        if (sp_Obj.access_contrl == 'PO') {
            sp_Obj.l_appSeqNo = sp_Obj.l_appSeqNo + (0.1);
            sp_Obj.l_appSeqNo = sp_Obj.l_appSeqNo.toFixed(1);
            var l_url = $scope.url + 'addEntryForm?seqNo=' + sp_Obj.l_appSeqNo + '&userCode=' + l_userCode
                    + "&accCode=" + AuthServices.acc_code() + '&searchText=' + encodeURIComponent(sp_Obj.searchText);
        } else {
            var l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode;
            l_url = l_url + "&accCode=" + AuthServices.acc_code() + '&searchText=';
        }

    }
    l_url = l_url + "&sqlFlag=T";
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
        var formId = sp_Obj.l_appSeqNo;
        formId = formId + "";

        pouchDBService.getObject(formId).then(function (data) {
            console.log("fetching data offline")
            $scope.fields = data.recordsInfo;
            var searchId = sp_Obj.searchText.split(',');
            var default_populated_data;
            searchId.forEach(function (id) {
                id = id.trim();
                if (default_populated_data) {
                    angular.forEach(default_populated_data, function (value, key) {
                        var temp = data.defaultPopulateData[id];
                        // console.log(temp[key]);
                        default_populated_data[key] = default_populated_data[key].concat(temp[key]);
                    })
                } else {
                    default_populated_data = data.defaultPopulateData[id];
                }
            })

            if (default_populated_data) {
                $scope.rowsOfPopulateData = [];
                $scope.default_populated_data = default_populated_data;
                setData();
                // setTableValue($scope.default_populated_data);
            } else {
                getDataOnline();
            }
        }, function (err) {
            getDataOnline();
        })

    }


    function getDataOnline() {
        if ($rootScope.online) {
            // console.log(l_url)
            console.log("fetching data online")
            dataServices.getEntryFromData(l_url, l_appSeqNo).then(function (data) {
                $scope.fields = data.recordsInfo;
                $scope.default_populated_data = data.defaultPopulateData;
                $scope.formData = data.sqlData;
                $scope.sqlData = $scope.formData;
                $scope.rowsOfPopulateData = [];
                setData();
                // setTableValue($scope.default_populated_data);
            }, function (err) {
                globalObjectServices.displayErrorMessage(err)
            })
        } else {
            alert('Data is not available please REFRESH app')
        }
    }



    // if ($rootScope.online) {
    //     if (sp_Obj.type == "offlineUpdateEntry") {
    //         var l_obj = "";
    //         if (sp_Obj.flagFororder == 1) {
    //             $scope.rowsOfPopulateData = sp_Obj.orderEntry;
    //             for (var i = 0; i < 1; i++) {
    //                 $scope.rowsOfPopulateData.forEach(function (obj) {
    //                     l_obj = angular.copy(obj);
    //                 })
    //             }
    //             l_obj.forEach(function (obj1) {
    //                 if (obj1.entry_by_user == "T" || obj1.entry_by_user == "R" && obj1.entry_by_user !== '') {
    //                     $scope.fieldsTH.push(obj1.column_desc);
    //                 }
    //             })
    //         } else {
    //             $scope.rowsOfPopulateData = sp_Obj.recordsInfo;
    //             $scope.fieldsTH = sp_Obj.fieldsTH;
    //         }
    //     } else {
    //         console.log(l_url)
    //         dataServices.getEntryFromData(l_url, l_appSeqNo).then(function (data) {
    //             $scope.fields = data.recordsInfo;
    //             $scope.default_populated_data = data.defaultPopulateData;
    //             setData();
    //             setTableValue($scope.default_populated_data);
    //         }, function (err) {
    //             globalObjectServices.displayErrorMessage(err)
    //         })
    //     }
    // } else {
    //     if (sp_Obj.type == "offlineUpdateEntry") {
    //         var l_obj = "";
    //         if (sp_Obj.flagFororder == 1) {
    //             $scope.rowsOfPopulateData = sp_Obj.orderEntry;
    //             if ($scope.rowsOfPopulateData != '') {
    //                 for (var i = 0; i < 1; i++) {
    //                     $scope.rowsOfPopulateData.forEach(function (obj) {
    //                         l_obj = angular.copy(obj);
    //                     })
    //                 }
    //                 l_obj.forEach(function (obj1) {
    //                     if (obj1.entry_by_user == "T" || obj1.entry_by_user == "R" && obj1.entry_by_user !== '') {
    //                         $scope.fieldsTH.push(obj1.column_desc);
    //                     }
    //                 })
    //             } else { }
    //         } else {
    //             $scope.rowsOfPopulateData = sp_Obj.recordsInfo;
    //             $scope.fieldsTH = sp_Obj.fieldsTH;
    //         }
    //     } else {
    //         var formId = sp_Obj.l_appSeqNo;
    //         formId = formId + "";
    //         $scope.rowsOfPopulateData = [];
    //         pouchDBService.getObject(formId).then(function (data) {
    //             $scope.fields = data.recordsInfo;
    //             var searchId = sp_Obj.searchText.split(',');
    //             var default_populated_data;
    //             searchId.forEach(function (id) {
    //                 id = id.trim();
    //                 if (default_populated_data) {
    //                     angular.forEach(default_populated_data, function (value, key) {
    //                         var temp = data.defaultPopulateData[id];
    //                         // console.log(temp[key]);
    //                         default_populated_data[key] = default_populated_data[key].concat(temp[key]);
    //                     })
    //                 } else {
    //                     default_populated_data = data.defaultPopulateData[id];
    //                 }

    //             })
    //             $scope.default_populated_data = default_populated_data;
    //             setData();
    //             setTableValue($scope.default_populated_data);
    //             // console.log("rowsOfPopulateData--> " + JSON.stringify($scope.rowsOfPopulateData));
    //         }, function (err) {
    //             alert('Data is not available please REFRESH app')
    //         })
    //     }
    // }

    function setTableValue(default_populated_data1) {
        var default_populated_data = default_populated_data1;
        $scope.fields.forEach(function (obj) {
            if (obj.entry_by_user == "T" || obj.entry_by_user == "R" && obj.entry_by_user !== '') {
                $scope.fieldsTH.push(obj.column_desc);
            }
            delete obj['column_catg'];
            delete obj['column_default_value'];
            delete obj['para_default_value'];
            delete obj['para_desc'];
            delete obj['para_column'];
            // delete obj['status'];
            // delete obj['column_select_list_value'];
            delete obj['excel_upload'];
            delete obj['img'];
            delete obj['table_name'];
            delete obj['para_desc'];
            delete obj['ref_LOV_WHERE_CLAUSE'];
            delete obj['ref_LOV_TABLE_COL'];
            // delete obj['slno'];
        })
        angular.forEach(default_populated_data, function (value, key) {
            $scope.defaultPopulateDataLength = Object.keys(default_populated_data[key]).length;
        })
        // alert( sp_Obj.sessionvalue)
        //console.log(JSON.stringify(sp_Obj.sessionvalue))
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
                    obj.value = i + 1;
                } else {
                    if (defaultPopulateData == "undefined" || defaultPopulateData == undefined ||
                            defaultPopulateData == "") {
                    } else {
                        var dataField = defaultPopulateData[i];
                        if (defaultPopulateData[i] != null && defaultPopulateData[i].indexOf("~") > -1) {

                            var splitedvalue = dataField.split('~');
                            obj.value = splitedvalue[1];
                            obj.codeOfValue = splitedvalue[0];
                        } else {
                            obj.value = defaultPopulateData[i];
                        }
                    }
                }
                sp_Obj.sessionvalue.forEach(function (obj1) {
                    if (obj1.column_name == obj.column_name) {
                        obj.codeOfValue = obj1.codeOfValue;
                        obj.value = obj1.value;
                    }
                })

            })
            var tempCopy = angular.copy($scope.fields);
            $scope.rowsOfPopulateData.push(tempCopy);
            // console.log("------------------")
            // console.log("------------------")
            // console.log(JSON.stringify($scope.rowsOfPopulateData))
            // console.log("------------------")
            // console.log("------------------")
        }
    }

    function setData() {
        addUpdateEntryServices.setDataCommon($scope.fields, "", sp_Obj.sessionHB).then(function (fields) {
            $scope.fields = fields;
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
            setTableValue($scope.default_populated_data);

        })
        // console.log($scope.fields);
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
        // //console.log("listOfEntry" + JSON.stringify(fieldsData));
        globalObjectServices.showLoading();
        var key = "valueToSend";
        if ($rootScope.online) {
            if (sp_Obj.type == "offlineUpdateEntry") {
                if (sp_Obj.flagFororder == 1) {
                    // var tempAppSeqNo = AuthServices.appSeqNo();
                    var entryType = "orderEntry";
                    // //console.log("data"+JSON.stringify(fieldsData)) 
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

                        if (obj.column_name == "vrno" || obj.column_name == "VRNO" || obj.column_desc == "vrno" || obj.column_desc == "VRNO") {
                            if (sp_Obj.VRNO) {
                                obj.valueToSend = sp_Obj.VRNO;
                            }
                            // obj.codeOfValue = sp_Obj.VRNO;
                        }
                    })
                })
                if (sp_Obj.access_contrl == 'PO' && sp_Obj.display_clause != '2') {
                    functionToSaveOrderDataLocally(fieldsData);
                } else {
                    // alert("l_appSeqNo" + l_appSeqNo);

                    if (sp_Obj.mandatory_to_start_portal === 'O') {

                        dataServices.uploadEntry(sp_Obj.headOrderEntry.fieldsData, sp_Obj.headOrderEntry.l_appSeqNo, sp_Obj.headOrderEntry.url, sp_Obj.headOrderEntry.l_latitude,
                                sp_Obj.headOrderEntry.l_longitude, sp_Obj.headOrderEntry.l_location, sp_Obj.headOrderEntry.type,
                                sp_Obj.headOrderEntry.seqId, sp_Obj.headOrderEntry.dependent_next_entry_seq, sp_Obj.headOrderEntry.update_key, sp_Obj.headOrderEntry.update_key_value,
                                sp_Obj.headOrderEntry.update_key_codeOfValue, sp_Obj.headOrderEntry.l_base64VideoData).then(function (data) {
                            globalObjectServices.hideLoading();
                            if (data.status == "insert data") {

                                // alert(data.vrno);
                                sp_Obj.VRNO = data.vrno;
                                addUpdateEntryServices.setSlno(1);
                                // alert(sp_Obj.VRNO);
                                if (sp_Obj.VRNO) {
                                    fieldsData.forEach(function (obj) {
                                        obj.forEach(function (obj) {
                                            if (obj.column_name == "vrno" || obj.column_name == "VRNO" || obj.column_desc == "vrno" || obj.column_desc == "VRNO") {
                                                obj.valueToSend = sp_Obj.VRNO;
                                                // obj.codeOfValue = sp_Obj.VRNO;
                                            }
                                        })
                                    })
                                }

                                dataServices.uploadAllEntry(fieldsData, sp_Obj.l_appSeqNo, $scope.url).then(function (data) {
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

                                }, function (err) {
                                    globalObjectServices.displayErrorMessage(err)
                                });

                            } else {
                                globalObjectServices.displayCordovaToast(data.status);
                            }
                        }, function (err) {
                            globalObjectServices.hideLoading();
                            globalObjectServices.displayErrorMessage(err)
                        })
                    } else {
                        // alert("else" + sp_Obj.VRNO)
                        // if (sp_Obj.VRNO) {
                        //     fieldsData.forEach(function (obj) {
                        //         obj.forEach(function (obj) {
                        //             if (obj.column_name == "vrno" || obj.column_name == "VRNO" || obj.column_desc == "vrno" || obj.column_desc == "VRNO") {
                        //                 obj.valueToSend = sp_Obj.VRNO;
                        //                 // obj.codeOfValue = sp_Obj.VRNO;
                        //             }
                        //         })
                        //     })
                        // }
                        dataServices.uploadAllEntry(fieldsData, sp_Obj.l_appSeqNo, $scope.url).then(function (data) {
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
                        }, function (err) {
                            globalObjectServices.displayErrorMessage(err)
                        });
                    }
                }
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
                if (sp_Obj.access_contrl == 'PO') {
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
                    functionToSaveOrderDataLocally(fieldsData);
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
    }
    function functionToSaveOrderDataLocally(fieldsData, flag) {
        var fieldsDataToSave = [];
        fieldsData.forEach(function (obj1) {
            obj1.forEach(function (obj) {
                if (obj.column_name == 'QTYORDER' && obj.value) {
                    fieldsDataToSave.push(obj1);
                }
            })
        })
        var entryListDataValue = [];
        var DataValue = [];
        fieldsDataToSave.forEach(function (obj1, index) {
            var entryListDataValue = [];
            obj1.forEach(function (obj) {
                entryListDataValue.push({
                    "column_desc": obj.column_desc,
                    "column_name": obj.column_name,
                    "column_default_value": obj.column_default_value,
                    "value": obj.value,
                    "valueToSend": obj.valueToSend,
                    "column_select_list_value": obj.column_select_list_value,
                    "codeOfValue": obj.codeOfValue,
                    "summary_function_flag": obj.summary_function_flag
                })
            })
            entryListDataValue.push({"slno": new Date() + index})
            DataValue.push(entryListDataValue);
        })
        var id = "entrySeqNo" + sp_Obj.l_appSeqNo;
        // pouchDBService.getObject(id).then(function (data) {
        // //console.log("DataValue==" + JSON.stringify(DataValue));
        saveOrderPopulatedEntryOffline(DataValue, fieldsDataToSave, flag)
        // }, function (err) {
        // saveOrderPopulatedEntryOffline(DataValue, fieldsDataToSave, flag);
        // })

    }
    function saveOrderPopulatedEntryOffline(DataValue, fieldsDataToSave, flag) {
        var id = "entrySeqNo" + sp_Obj.l_appSeqNo;
        if (DataValue != "") {
            // dataServices.addEntryToLoacalDB(DataValue, sp_Obj.l_appSeqNo, sp_Obj.fieldsTH, fieldsDataToSave.length).then(function (data) {
            popOrderServ.addEntryToLoacalDB(DataValue, sp_Obj.l_appSeqNo, $scope.fieldsTH, fieldsDataToSave.length).then(function (data) {
                globalObjectServices.hideLoading();

                if (flag == 'disaplaylist') {
                    popOrderServ.getObject(id).then(function (data) {
                        // globalObjectServices.showLoading();
                        var l_obje = [];
                        l_obje.seqNo = sp_Obj.l_appSeqNo;
                        l_obje.entryList = data.entryList;
                        l_obje.listData = "";
                        l_obje.types = "PO";
                        l_obje.searchTextColumnName = sp_Obj.searchTextColumnName;
                        l_obje.searchText = sp_Obj.searchText;
                        $state.go('entryDetailsInTabular', {obj: l_obje});
                        globalObjectServices.nativeTranstion("right");
                    }, function (err) {
                        globalObjectServices.hideLoading();
                        globalObjectServices.displayCordovaToast('Add items...');
                        // globalObjectServices.displayCordovaToast('Try Again...')
                    })
                } else {
                    globalObjectServices.displayCordovaToast('Entry saved successfully..')
                    sp_Obj.type = "orderPopulated";
                    sp_Obj.access_contrl = "PO";
                    $state.go('addUpdateEntry', {obj: "next"});
                }
                // globalObjectServices.displayCordovaToast('Entry saved successfully.')
                globalObjectServices.hideLoading();
            }, function (err) {
                globalObjectServices.hideLoading();
                globalObjectServices.displayCordovaToast('Try Again...');
            })
        } else {
            if (flag == 'disaplaylist') {
                popOrderServ.getObject(id).then(function (data) {
                    // //console.log(JSON.stringify(data.entryList))
                    // globalObjectServices.showLoading();
                    if (data) {
                        if (data.entryList != "") {
                            var l_obje = [];
                            l_obje.seqNo = sp_Obj.l_appSeqNo;
                            l_obje.entryList = data.entryList;
                            l_obje.listData = "";
                            l_obje.types = "PO";
                            l_obje.searchTextColumnName = sp_Obj.searchTextColumnName;
                            l_obje.searchText = sp_Obj.searchText;
                            $state.go('entryDetailsInTabular', {obj: l_obje});
                            globalObjectServices.nativeTranstion("right");
                        } else {
                            globalObjectServices.hideLoading();
                            globalObjectServices.displayCordovaToast('Add items...')
                        }
                    } else {
                        globalObjectServices.hideLoading();
                        globalObjectServices.displayCordovaToast('Add items...')
                    }
                }, function (err) {
                    globalObjectServices.hideLoading();
                    // alert("add items..")
                    globalObjectServices.displayCordovaToast('Add items...')
                })
            } else {
                globalObjectServices.hideLoading();
                globalObjectServices.displayCordovaToast('Add items...')
            }
        }
    }

    $scope.addPopulatedOrder = function (fieldsData) {
        var id = "entrySeqNo" + sp_Obj.l_appSeqNo;
        functionToSaveOrderDataLocally(fieldsData, 'disaplaylist');

    }
    $scope.cancelAddUpdateEntry = function () {
        globalObjectServices.confirmationPopup('Do you want to Cancel Entry?').then(function (data) {
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
            $scope.fields.forEach(function (data) {
                if (data.column_name == column_name) {
                    data.sqlData = result.sqlData;
                }
            })
        }, function (err) {
            globalObjectServices.hideLoading();
            globalObjectServices.displayErrorMessage(err)
        })
    }

    /* To set Lov Values */
    $scope.setLOVValues = function (code, name, column_desc, dependent_row, rowID, dependent_value) {
        $scope.fields = addUpdateEntryServices.setLOVValues(code, name, column_desc, dependent_row, rowID,
                $scope.fields, l_appSeqNo, sp_Obj.type, $scope.url);
        // $scope.fields = addUpdateEntryServices.dependent_nullable_logic(name, dependent_row, $scope.fields);
        // globalObjectServices.setColumnDependentVal($scope.fields,$scope.url,l_appSeqNo);
        $scope.dependent_nullable_logic(name, dependent_row, $scope.fields, $scope.url, l_appSeqNo, dependent_value);
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
    $scope.textAreaPop = {};
    $scope.textAreaPopOver = function ($event, column_name, value, column_desc) {
        $scope.textAreaPop.textAreaValue = value;
        $scope.textAreaPop.textAreaHeading = column_desc;
        $scope.textAreaPop.nameOfColumn = column_name;
        $scope.textAreaPopOverModal.show($event);
    };

    /* Save text Area Value */
    $scope.saveTextArea = function (textAreaValue, column_name) {
        $scope.fields = addUpdateEntryServices.saveTextArea(textAreaValue, column_name, $scope.fields);
        $scope.textAreaPopOverModal.hide().then(function (popover) {
            $scope.textAreaPop = {};
        });
    }

    /* dependent_nullable_logic - Make particular control manditory on the basis of selected value in dependent control */
    $scope.dependent_nullable_logic = function (value, column_name, dependent_value, flag) {
        addUpdateEntryServices.dependent_nullable_logic(value, column_name, $scope.fields, $scope.url, l_appSeqNo, dependent_value, flag).then(function (data) {
            $scope.fields = data;
            if (flag == 'search') {
            } else {
                globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo);
            }
        });

    }
    $scope.showSql = function (data) {
        $ionicModal.fromTemplateUrl('static/templates/sqlDataModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.sqlDataModal = modal;
            $scope.sqlData = data;
            $scope.sqlDataModal.show();
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

}).service('popOrderServ', function ($q) {
    var entryList;

    function getObject() {
        return $q(function (resolve, reject) {
            resolve(entryList);
        })
    }

    function addEntryToLoacalDB(fieldsData, l_appSeqNo, fieldsTH1, defaultPopulateDataLength, uploadEntryStatus, entryType) {
        return $q(function (resolve, reject) {
            var id = l_appSeqNo.toString();
            var JSON = {};
            _id = "entrySeqNo" + id;
            // pouchDBService.getObject(_id).then(function (data) {
            if (entryList) {
                JSON = entryList;
                JSON.entryList.push(fieldsData);
                JSON.count = JSON.entryList.length;
                JSON.fieldsTH = fieldsTH1;
                JSON.defaultPopulateDataLength = defaultPopulateDataLength;
                JSON.uploadEntryStatus = uploadEntryStatus
                entryList = JSON;
                resolve("sucess");
            } else {
                JSON._id = _id;
                JSON.entryList = [];
                JSON.entryList.push(fieldsData);
                JSON.count = JSON.entryList.length;
                JSON.fieldsTH = fieldsTH1;
                JSON.defaultPopulateDataLength = defaultPopulateDataLength;
                JSON.uploadEntryStatus = uploadEntryStatus;
                entryList = JSON;
                resolve("sucess");
            }
        })
    }

    function deleteOrderPopulatedEntry(l_appSeqNo, index, seq_id) {
        return $q(function (resolve, reject) {
            var id = l_appSeqNo.toString();
            var JSON = {};
            _id = "entrySeqNo" + id;
            // pouchDBService.getObject(_id).then(function (data) {
            JSON = entryList;
            entryList.entryList.forEach(function (obj) {
                obj.forEach(function (obj1, index) {
                    obj1.forEach(function (obj2) {
                        if (obj2.slno == seq_id) {
                            obj.splice(index, 1);
                        }
                    })
                })
            })
            JSON.entryList = entryList.entryList;
            JSON.count = JSON.entryList.length;
            entryList = JSON;
            resolve("sucess");
            // }, function (err) { reject('error') })
        })
    }

    function deleteAllPopulatedEntry() {
        entryList = null;
    }

    return {

        getObject: getObject,
        addEntryToLoacalDB: addEntryToLoacalDB,
        deleteAllPopulatedEntry: deleteAllPopulatedEntry,
        deleteOrderPopulatedEntry: deleteOrderPopulatedEntry
    }

})
