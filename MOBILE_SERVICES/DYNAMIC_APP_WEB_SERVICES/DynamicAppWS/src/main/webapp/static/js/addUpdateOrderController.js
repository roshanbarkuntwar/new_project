angular.module('starter.controllers').controller('addUpdateOrderCtrl', function (AuthServices, $filter,
        $state, $stateParams, $ionicModal, $scope, $ionicPopup, addUpdateEntryServices, pouchDBService,
        dataServices, globalObjectServices, $rootScope, $ionicPopover, $sce, $http, $cordovaCapture, $q) {

    var l_userCode = AuthServices.userCode();
    var l_appSeqNo = AuthServices.appSeqNo();

    // var sp_Obj = $state.params.obj // state params getting from dashbord , entryList,calendar states
    var sp_Obj = $state.params.obj
    $scope.table_desc = sp_Obj.table_desc;
    $scope.searchEntity = {};
    l_appSeqNo = ((parseInt(l_appSeqNo)) + 0.2);
    $scope.listOfEntry = [];
    $scope.count = 1;

    $scope.isDisabled = false;

    /* Getting Lat ,Long and TimeStamp */
    var l_object = [];
    addUpdateEntryServices.getLatLangTimeStamp().then(function (data) {
        l_object = data;
    })

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

    if ((sp_Obj.updation_process).indexOf('V') > -1) {
        $scope.flagForEntryListButton = 'V#';
    }
    if (sp_Obj.searchText) {
        var l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode;
        l_url = l_url + "&accCode=" + AuthServices.acc_code() + '&searchText=' + encodeURIComponent(sp_Obj.searchText);
    } else {
        var l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode;
        l_url = l_url + "&accCode=" + AuthServices.acc_code() + '&searchText=';
    }
    l_url = l_url + "&sqlFlag=T";
    // //console.log("l_url" + l_url);
    if ($rootScope.online) {
        if (sp_Obj.type == "offlineUpdateEntry") {
        } else {

            dataServices.getEntryFromData(l_url, l_appSeqNo).then(function (data) {
                $scope.fields = data.recordsInfo;
                $scope.defaultPopulateData = data.defaultPopulateData;
                $scope.formData = data.sqlData;
                $scope.sqlData = $scope.formData;
                addUpdateEntryServices.setDataCommon($scope.fields, "", sp_Obj.sessionHB).then(function (fields) {
                    $scope.fields = fields;
                    $scope.setData(sp_Obj);
                });
                // console.log($scope.fields)
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
                globalObjectServices.hideLoading();
                $scope.fields = data.recordsInfo;

                $scope.fields.forEach(function (obj) {
                    if (obj.column_type == "DATE" || obj.column_type == "DATETIME") {
                        obj.value = $filter('date')(new Date(), 'dd-MM-yyyy hh:mm:ss');
                    }
                })
                // $scope.fields = addUpdateEntryServices.setDataCommon($scope.fields);
                addUpdateEntryServices.setDataCommon($scope.fields, "", sp_Obj.sessionHB).then(function (fields) {
                    $scope.fields = fields;
                    $scope.setData();
                });

            }, function (err) {
                globalObjectServices.displayErrorMessage(err)
            })
        }
    }

    $scope.setData = function () {
        $scope.fields.forEach(function (obj1) {

            if ((obj1.updation_process).indexOf("I") > -1) {
            } else {
                obj1.entry_by_user = "F";
                obj1.nullable = "T";
            }
            if (obj1.column_desc == "SLNO" || obj1.column_name == "SLNO") {
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
                obj1.codeOfValue = sp_Obj.DIV_CODE;
            }
            if (obj1.column_name == "GEO_CODE") {
                obj1.value = sp_Obj.GEO_CODE;
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
            if (obj1.column_name == "PLANT_CODE") {
                obj1.value = sp_Obj.PLANT_CODE;
            }
            if (obj1.column_name == "SHIFT_CODE") {
                obj1.value = sp_Obj.SHIFT_CODE;
            }
            if (obj1.column_name == "DM_VRNO") {
                obj1.value = sp_Obj.DM_VRNO;
            }
            if (obj1.column_name == "FG_CIP_NO") {
                obj1.value = sp_Obj.FG_CIP_NO;
            }
            if (obj1.column_name == "DM_SLNO") {
                obj1.value = sp_Obj.DM_SLNO;
            }
            if (obj1.column_name == "CNTR_CODE") {
                obj1.value = sp_Obj.CNTR_CODE;
            }
            if (obj1.column_name == "PROCESS_CODE") {
                obj1.value = sp_Obj.PROCESS_CODE;
            }
            if (obj1.column_name == "COST_CODE") {
                obj1.value = sp_Obj.COST_CODE;
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
    }


    /* Autocalculation*/
    $scope.autoCalculation = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculation(column_name, $scope.fields);
    }

    $scope.coLumnValidate = function (column_name, coLumnValidateFun) {
        if (coLumnValidateFun) {
            if (coLumnValidateFun.indexOf("#") > -1) {
                $scope.fields = globalObjectServices.coLumnValidate(column_name, coLumnValidateFun, $scope.fields);
            } else {

            }
        }
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

    $scope.autoCalculationOfDuration = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculationOfDuration($scope.fields, column_name)
    }

    $scope.addItem = function (fieldsData) {

        globalObjectServices.showLoading();
        var session = {
            sessionvalue: []
        };
        var checkForSessionEntry = false;
        fieldsData.forEach(function (obj) {
            if (obj.session_column_flag == "T") {
                var item = obj;
                session.sessionvalue.push({
                    "column_name": item.column_name,
                    "value": item.value,
                    "codeOfValue": item.codeOfValue
                });
                checkForSessionEntry = true;

            }
            if (obj.column_desc == "VRNO" || obj.column_desc == "Retailer Code" ||
                    obj.column_desc == "Select Category" || obj.column_desc == "Select Sub Category" ||
                    obj.column_desc == "Consumer Number" || obj.column_desc == "Delivery Date") {

                obj.flagforhideValue = 1;
            }
        })
        $scope.user = angular.copy(fieldsData);
        $scope.listOfEntry.push($scope.user);
        var sessionDone = "";
        if (checkForSessionEntry == true) {
            // dataServices.storeSessionColumn1(session.sessionvalue).then(function (data) {
            //     sessionDone = true;
            // })
            $scope.fields.forEach(function (obj) {
                fieldsData.forEach(function (obj1) {
                    if (obj.column_name == obj1.column_name) {
                        obj.value = obj1.value;
                        obj.codeOfValue = obj1.codeOfValue;
                    }
                })
            })
            // globalObjectServices.hideLoading();
            // globalObjectServices.displayCordovaToast('Entry saved successfully..');
            // globalObjectServices.goBack(-1);
        }
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
                            obj.column_desc == "VRNO" || obj.session_column_flag == "T") {
                    } else {
                        obj.value = "";
                    }
                }
            }
        })
        if (sessionDone == true) {
            var id = "sessionColumn12";
            pouchDBService.getObject(id).then(function (data) {
                //console.log("session Data===" + JSON.stringify(data));
                sessionColumn = data.data;
                $scope.fields.forEach(function (obj2) {
                    sessionColumn.forEach(function (obj3) {
                        if (obj3.column_name == obj2.column_name) {
                            obj2.value = obj3.value;
                            obj2.codeOfValue = obj3.codeOfValue;
                        }
                    })
                })
            }, function (err) {
                //   dataServices.storeSessionColumn1(session.sessionvalue);
            })
        }
        globalObjectServices.hideLoading();
    }


    function addBodyEntry(listOfEntry, VRNO, process_code) {
        return $q(function (resolve, reject) {
            // })
            globalObjectServices.showLoading();
            var key = "valueToSend";
            var count = 0
            listOfEntry.forEach(function (obj1) {
                obj1.forEach(function (obj) {

                    if (obj.column_type == "DATETIME") {
                        obj[key] = ($filter('date')(obj.value, 'dd-MM-yyyy hh:mm:ss')).toString();
                        // obj.valueToSend = obj.valueToSend.toString();
                        // obj.valueToSend = "";
                        // obj.from_value = '';
                        // obj.to_value = '';
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
                                if (obj.column_name == "VRNO" || obj.column_desc == "VRNO") {
                                    if (VRNO) {
                                        obj.value = VRNO;
                                        obj[key] = VRNO;
                                    } else {
                                        if (obj.codeOfValue) {
                                            obj[key] = obj.codeOfValue;
                                        } else {
                                            obj[key] = obj.value;
                                        }
                                    }
                                } else {
                                    if (obj.column_name == "PROCESS_CODE") {
                                        if (process_code) {
                                            obj[key] = process_code;
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
                            // }
                        }
                    }
                    if (!$rootScope.online) {
                        if ((obj.column_type == "DATETIME" || obj.column_type == "DATE") && obj.column_name !== 'VRDATE') {
                            if (l_object.l_dateTime) {
                                obj[key] = l_object.l_dateTime;
                                obj.value = l_object.l_dateTime;
                            }
                        }
                    }
                    count++;
                });
                if ("T" == AuthServices.data_UPLOAD()) {
                    obj1.push({
                        column_name: "LATITUDE",
                        column_desc: "LATITUDE",
                        entry_by_user: "F",
                        value: l_object.l_latitude,
                        valueToSend: l_object.l_latitude
                    });
                    obj1.push({
                        column_name: "LONGITUDE",
                        column_desc: "LONGITUDE",
                        entry_by_user: "F",
                        value: l_object.l_longitude,
                        valueToSend: l_object.l_longitude
                    });
                    obj1.push({
                        column_name: "LOCATION",
                        column_desc: "LOCATION",
                        entry_by_user: "F",
                        value: l_object.l_location,
                        valueToSend: l_object.l_location
                    });
                }
            })
            if ($rootScope.online) {
                dataServices.uploadAllEntry(listOfEntry, l_appSeqNo, $scope.url, l_object.l_latitude,
                        l_object.l_longitude, l_object.l_location).then(function (data) {
                    globalObjectServices.hideLoading();
                    if (data.status == "insert data") {
                        if (VRNO) {
                            globalObjectServices.alertPopup("VRNO : " + VRNO);
                        }
                        resolve(VRNO);
                    } else
                    if (data.status == "updated data") {
                        resolve(VRNO);
                        globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
//                        globalObjectServices.goBack(-2);
                    } else {
                        globalObjectServices.displayCordovaToast(data.status);
                    }
                }, function (err) {
                    resolve();
                    globalObjectServices.hideLoading();
                    globalObjectServices.displayErrorMessage(err)
                });
            } else {
                var entryType = "orderEntry";

                dataServices.addOrderEntryToLoacalDB(listOfEntry, sp_Obj.tempAppSeqNo, entryType,
                        sp_Obj.entryIndex, l_object.l_dateTime).then(function (data) {
                    resolve();
                    globalObjectServices.hideLoading();
                    globalObjectServices.displayCordovaToast('Entry Saved Successfully..')
//                    globalObjectServices.goBack(-2);
                }, function (err) {
                    resolve();
                    globalObjectServices.hideLoading();
                    globalObjectServices.displayCordovaToast('Try Again...')
                })
            }

        })
    }

    function addHeadEntry(headOrderEntry, process_code) {
        return $q(function (resolve, reject) {
            globalObjectServices.showLoading();
            dataServices.uploadEntry(headOrderEntry.fieldsData, headOrderEntry.l_appSeqNo, headOrderEntry.url, headOrderEntry.l_latitude,
                    headOrderEntry.l_longitude, headOrderEntry.l_location, headOrderEntry.type,
                    headOrderEntry.seqId, headOrderEntry.dependent_next_entry_seq, headOrderEntry.update_key,
                    headOrderEntry.update_key_value, headOrderEntry.update_key_codeOfValue, headOrderEntry.l_base64VideoData)
                    .then(function (data) {
                        globalObjectServices.hideLoading();
                        if (data.status == "insert data") {
                            var result = {};
                            result.vrno = data.vrno;
                            result.process_code = process_code;
                            resolve(result);
                        }
                        globalObjectServices.displayCordovaToast(data.status);
                        $scope.SqlData = $scope.saveSql + data.sqlData;
                    })
        })
    }

    var process_count = 0;
    var process_entry_count = 0;
    var process_code_arr = [];

    function addMultipleOrder(listOfEntry) {

        if (process_count > process_entry_count) {

            sp_Obj.headOrderEntry.fieldsData.forEach(function (obj) {
                if (obj.column_name == "PROCESS_CODE") {
                    obj.valueToSend = process_code_arr[process_entry_count];
                }
            })
            // console.log("addHeadEntry---> " + process_entry_count + " -- " + process_code_arr[process_entry_count])
            addHeadEntry(sp_Obj.headOrderEntry, process_code_arr[process_entry_count]).then(function (data) {

                // console.log("addBodyEntry---> " + data.vrno + " --- " + data.process_code)
                addBodyEntry(listOfEntry, data.vrno, data.process_code).then(function () {
                    process_entry_count = process_entry_count + 1;
                    addMultipleOrder(listOfEntry);
                })
            }, function (err) {

            })
        } else {
            globalObjectServices.displayCordovaToast('Entry Saved Successfully..');
            globalObjectServices.goBack(-2);
        }

    }

    $scope.addOrder = function (listOfEntry) {

        // if ($rootScope.online) {
        // }
        if (sp_Obj.mandatory_to_start_portal === 'O') {
            if ($rootScope.online) {

                process_count = 1;
                var process_code = sp_Obj.PROCESS_CODE;
                if (sp_Obj.PROCESS_CODE) {
                    process_code_arr = sp_Obj.PROCESS_CODE.split('');
                    process_count = process_code.length;
                }

                if (process_count > 1) {
                    // for (var i = 0; i < processlength; i++) {
                    //     sp_Obj.headOrderEntry.fieldsData.forEach(function (obj) {
                    //         if (obj.column_name == "PROCESS_CODE") {
                    //             obj.valueToSend = process_code[i];
                    //         }
                    //     })
                    //     console.log("addHeadEntry---> " + i + " -- " + process_code[i])
                    //     addHeadEntry(sp_Obj.headOrderEntry, process_code[i]).then(function (data) {
                    //         // var VRNO = data.vrno;
                    //         //if (VRNO) {
                    //         //  alert(" VRNO  : " + VRNO)
                    //         // }

                    //         console.log("addBodyEntry---> " + data.vrno + " --- " + data.process_code)
                    //         addBodyEntry(listOfEntry, data.vrno, data.process_code);
                    //     }, function (err) {

                    //     })
                    // }
                    addMultipleOrder(listOfEntry);
                } else {
                    addHeadEntry(sp_Obj.headOrderEntry).then(function (data) {
                        var VRNO = data.vrno;
                        addBodyEntry(listOfEntry, VRNO, "").then(function (data) {
                            globalObjectServices.displayCordovaToast('Entry Saved Successfully..');
                            globalObjectServices.goBack(-2);
                        });
                    }, function (err) {

                    })
                }



            } else {
                globalObjectServices.displayCordovaToast("Internet connectivity not detected please reconnect and try again later..");
            }
        } else {
            addBodyEntry(listOfEntry).then(function (data) {
                globalObjectServices.displayCordovaToast('Entry Saved Successfully..');
                globalObjectServices.goBack(-2);
            });
            ;
        }
    }


    $scope.cancelAddUpdateEntry = function () {
        globalObjectServices.confirmationPopup('Do you want to Cancel Entry?').then(function (data) {
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
        // $scope.fields.forEach(function (obj) {

        //     if (obj.column_name == dependent_row) {
        //         if (dependent_row_logic == "=") {
        //             if (obj.codeOfValue != null) {
        //                 dependent_row_logic = obj.codeOfValue;
        //             } else {
        //                 dependent_row_logic = "=";
        //             }
        //         }
        //     }

        // })

        if (dependent_row) {
            if (dependent_row.indexOf('#') > -1) {
                dependent_row_logic = dependent_row;
                $scope.fields.forEach(function (obj) {

                    if (dependent_row_logic.indexOf(obj.column_name) > -1) {

                        if (obj.codeOfValue) {
                            dependent_row_logic = dependent_row_logic.replace(obj.column_name, obj.codeOfValue);
                        } else {
                            if (obj.value) {
                                dependent_row_logic = dependent_row_logic.replace(obj.column_name, obj.value);
                            } else {
                                dependent_row_logic = dependent_row_logic.replace(obj.column_name, "null");
                            }
                            // console.log(obj.column_name + " : " + obj.value);
                            // console.log(dependent_row_logic);

                        }
                    }
                })
            } else {
                $scope.fields.forEach(function (obj) {

                    if (obj.column_name == dependent_row) {
                        if (dependent_row_logic == "=") {
                            if (obj.codeOfValue != null) {
                                dependent_row_logic = obj.codeOfValue;
                            } else {
                                if (obj.value != null) {
                                    dependent_row_logic = obj.value;
                                } else {
                                    dependent_row_logic = "=";
                                }
                            }
                        }
                    }

                })
            }
        }



        addUpdateEntryServices.openLov(column_desc, column_name, dependent_row, dependent_row_logic,
                item_help_property, $scope.lov, $scope.url, l_appSeqNo).then(function (result) {
            globalObjectServices.hideLoading();
            $scope.lov = result.lov;
            $scope.lovHeading = result.lovHeading;
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
            if (err == 'error') {
                globalObjectServices.displayCordovaToast('Data is not available..')
            } else {
                globalObjectServices.displayErrorMessage(err)
            }

        })
    }

    /* To set Lov Values */
    $scope.setLOVValues = function (code, name, column_desc, dependent_row, rowID, dependent_value) {
        $scope.fields = addUpdateEntryServices.setLOVValues(code, name, column_desc, dependent_row, rowID,
                $scope.fields, l_appSeqNo, sp_Obj.type, $scope.url);
        // $scope.fields = addUpdateEntryServices.setDataListValue(column_desc, code, l_appSeqNo, dependent_row, "", $scope.fields, $scope.url);
        // $scope.fields = addUpdateEntryServices.dependent_nullable_logic(name, dependent_row, $scope.fields);
        // globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo);
        $scope.dependent_nullable_logic(name, dependent_row, $scope.fields, $scope.url, l_appSeqNo, dependent_value);
        $scope.addEntryLOVModal.hide();

        var isReload = false;

        sp_Obj.searchText = null;
        sp_Obj.searchTextColumnName = null;
        $scope.fields.forEach(function (obj) {
            // if (obj.session_column_flag) {
            //     if (obj.session_column_flag.indexOf('P') > -1) {

            //     }
            // }

            if (obj.session_column_flag) {
                if (obj.session_column_flag.indexOf('P') > -1) {
                    if (sp_Obj.searchText) {
                        if (obj.codeOfValue) {
                            sp_Obj.searchText = sp_Obj.searchText + "#" + obj.codeOfValue.split('#').join('~~');
                        } else {
                            sp_Obj.searchText = sp_Obj.searchText + "#" + obj.value.split('#').join('~~');
                        }
                    } else {
                        if (obj.codeOfValue) {
                            sp_Obj.searchText = obj.codeOfValue.split('#').join('~~');
                        } else {
                            sp_Obj.searchText = obj.value.split('#').join('~~');
                        }
                    }
                    if (sp_Obj.searchTextColumnName) {
                        sp_Obj.searchTextColumnName = sp_Obj.searchTextColumnName + "#" + obj.column_name;
                    } else {
                        sp_Obj.searchTextColumnName = obj.column_name;
                    }
                    isReload = true;
                }
                if (obj.session_column_flag.indexOf('E') > -1) {
                    sp_Obj.sessionHB.push({
                        "column_name": obj.column_name,
                        "value": obj.value,
                        "codeOfValue": obj.codeOfValue
                    });
                }
            }

        })
        if (isReload) {
            $state.transitionTo($state.current, {obj: sp_Obj}, {reload: true});
        }

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
//                globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, column_name);
                $scope.isDisabled = true;
                globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, column_name).then(function (data) {
                    $scope.isDisabled = false;
                }, function (err) {
                    $scope.isDisabled = false;
                })
            }
        });

    }

    /* To Take Image */
    $scope.takeImage = function (column_name) {
        $scope.fields = addUpdateEntryServices.takeImage($scope.fields, column_name);
    }

    /* To search values By Text */
    $scope.searchByText = function (column_name, value, dependent_column_name, query_dependent_row) {
        globalObjectServices.showLoading();


        var arr = [];
        var col_dsc = "";
        $scope.listOfEntry.forEach(function (obj) {
            obj.forEach(function (obj1) {
                if (obj1.column_name == column_name) {
                    if (obj1.value) {
                        arr.push(obj1.value);
                        col_dsc = obj1.column_desc;
                    }
                }
            })
        })
        if (arr.indexOf(value) > -1) {
            globalObjectServices.alertPopup(col_dsc + "(" + value + ") is already Added.");
        } else {

            if (dependent_column_name) {

                if (query_dependent_row) {
                    var qdr = query_dependent_row.split('#');
                    var qdr_value = qdr;
                    $scope.fields.forEach(function (obj) {
                        if (column_name == obj.column_name) {
                            obj.value = value;
                        }
                        if (qdr.indexOf(obj.column_name) > -1) {

                            if (obj.codeOfValue) {
                                qdr_value[qdr.indexOf(obj.column_name)] = obj.codeOfValue;
                            } else {
                                qdr_value[qdr.indexOf(obj.column_name)] = obj.value;
                            }

                        }
                    })
                    value = qdr_value.join('~');
                }


                globalObjectServices.setselfDependantRowValue($scope.url, column_name, l_appSeqNo, value, $scope.fields).then(function (data) {
                    globalObjectServices.hideLoading();
                    if (data) {
                        var listDependentValue = data;
                        if (listDependentValue.length > 0) {
                            listDependentValue.forEach(function (obj1) {
                                $scope.fields.forEach(function (obj) {
                                    if (obj1.columnName == obj.column_name) {
                                        obj.value = obj1.value;

                                    }
                                    $scope.isDisabled = true;
                                    if (column_name == obj.column_name) {
                                        globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, obj1.columnName).then(function (data) {
                                            obj.sqlData = data.sqlData;
                                            $scope.isDisabled = false;
                                        }, function (err) {
                                            $scope.isDisabled = false;
                                        })
//                                        globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, obj1.columnName);
                                    }
                                    if (column_name == obj.column_name) {
                                        obj.sqlData = data.sqlData;
                                    }
                                })
                                // if (obj1.columnName == "PROCESS_CODE") {
                                //     var msg = addUpdateEntryServices.getProcessMsg(obj1.value);
                                //     if (msg) {
                                //         globalObjectServices.alertPopup(msg);
                                //     }
                                // }
                                if (obj1.columnName == "WO_VRNO") {
                                    if (obj1.value) {
                                    } else {
                                        globalObjectServices.alertPopup("Balance not available in selected Job Card or Selected PROCESS doesn't match.")
                                    }
                                }
                            })
                        } else {
                            if (column_name == "BalanceQty" || column_name == "JOBSHEET_VRNO") {

                                if (AuthServices.entity_code().indexOf("RE") > -1 && $scope.table_desc == "Fabrication") {
                                    globalObjectServices.alertPopup("Balance not available in selected Job Card or Selected PROCESS doesn't match or R.M. not issued.")
                                } else {
                                    globalObjectServices.alertPopup("Balance not available in selected Job Card or Selected PROCESS doesn't match.")
                                }

                                // alert("Balance not available in selected Job Card or Selected PROCESS doesn't match.")
                            } else {
                                console.log("data not available for column_name " + column_name)
                            }
                        }


                    }

//                    globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, column_name);
                    $scope.isDisabled = true;
                    globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, column_name).then(function (data) {
                        $scope.isDisabled = false;
                    }, function (err) {
                        $scope.isDisabled = false;
                    })
                });
            } else {
                globalObjectServices.hideLoading();
                $scope.fields = addUpdateEntryServices.searchByText($scope.fields, column_name, value, $scope.url, l_appSeqNo);
//                globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, column_name);
                globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, column_name);
                $scope.isDisabled = true;
                globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, column_name).then(function (data) {
                    $scope.isDisabled = false;
                }, function (err) {
                    $scope.isDisabled = false;
                })
            }
        }

    };



    /* To Scan Barcode */
    /*   $scope.scanBarcode = function (column_name, coLumnValidate) {
     if (coLumnValidate) {
     $scope.fields = addUpdateEntryServices.scanBarcode($scope.fields, column_name, $scope.url, l_appSeqNo, $scope.listOfEntry, sp_Obj.table_desc);
     } else {
     $scope.fields = addUpdateEntryServices.scanBarcode($scope.fields, column_name, $scope.url, l_appSeqNo, "", sp_Obj.table_desc);
     }
     $scope.fields.forEach(function (data) {
     if (column_name == data.column_name) {
     // $scope.dependent_nullable_logic(data.column_name, data.dependent_row, $scope.fields, $scope.url, l_appSeqNo, data.dependent_value);
     $scope.dependent_nullable_logic(data.value, data.column_name, data.dependent_column_name, '')
     
     }
     })
     }; */

    $scope.scanBarcode = function (column_name, coLumnValidate) {
        if (coLumnValidate) {
            addUpdateEntryServices.scanBarcode($scope.fields, column_name, $scope.url, l_appSeqNo, $scope.listOfEntry, sp_Obj.table_desc).then(function (fields) {
                $scope.fields = fields;
                $scope.fields.forEach(function (data) {
                    if (column_name == data.column_name && data.item_help_property == 'B') {
                        $scope.dependent_nullable_logic(data.value, data.column_name, data.dependent_column_name, '');
                    }
                })

            })
        } else {
            //$scope.fields = addUpdateEntryServices.scanBarcode($scope.fields, column_name, $scope.url, l_appSeqNo, $scope.listOfEntry, sp_Obj.table_desc);
            addUpdateEntryServices.scanBarcode($scope.fields, column_name, $scope.url, l_appSeqNo, $scope.listOfEntry, sp_Obj.table_desc).then(function (fields) {
                $scope.fields = fields;
                $scope.fields.forEach(function (data) {
                    if (column_name == data.column_name && data.item_help_property == 'B') {
                        $scope.dependent_nullable_logic(data.value, data.column_name, data.dependent_column_name, '');
                    }
                })

            })

        }

    };


    var l_base64VideoData;
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
                l_base64VideoData = readerEvt.target.result; //converting captured data into base64 
                $scope.videoSignature = {src: l_base64VideoData, title: "Video Data"}; //Adding coverted base64 data to Src
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
            template: 'Do you want to delete item?'
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
            if (obj.column_desc == "SLNO" || obj.column_name == "SLNO") {
                obj.value = parseInt(obj.value) - 1;
            }
        })
        var slno = 1;
        $scope.listOfEntry.forEach(function (obj1) {
            obj1.forEach(function (obj2) {
                if (obj2.column_desc == "SLNO" || obj2.column_name == "SLNO") {
                    obj2.value = slno;
                    slno++;
                }
            })
        })
    }




    var newEntrySlno = addUpdateEntryServices.getSlno();

    if (newEntrySlno == 0) {
        addUpdateEntryServices.setSlno(1);
        newEntrySlno = 1;
    }

    addEntry = function (fields, sqlFlag) {
        globalObjectServices.showLoading();
        var key = "valueToSend";

        var vrdate = "";
        var isSaveEntry = true;

        fields.forEach(function (obj) {
            if (obj.column_name == "SLNO") {
                obj[key] = newEntrySlno;
                newEntrySlno++;
            } else {
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
                            if (obj.column_name == "VRNO") {
                                obj[key] = sp_Obj.VRNO;
                            } else {
                                // if (obj.item_help_property == "TB") {
                                // var temp = obj.dropdownVal.rows[obj.value];
                                // var temp1 = obj.dropdownVal.headers.indexOf("VRNO");
                                // obj[key] = temp[temp1];
                                // console.log("----------------" + temp[temp1]);
                                // } else {
                                if (obj.column_name == "VRDATE") {
                                    vrdate = obj.value
                                    obj[key] = obj.value;
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
                    }
                }
            }
            if (!$rootScope.online) {
                if (obj.column_type == "DATETIME" || obj.column_type == "DATE") {
                    if (l_object.l_dateTime) {
                        obj[key] = l_object.l_dateTime;
                        obj.value = l_object.l_dateTime;
                    }

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

        if ($rootScope.online) {

            if (vrdate) {
                // .setDate(new Date().getDate() + 1)
                vrdate1 = ($filter('date')(vrdate, 'dd-MM-yyyy'));
                ToDate = ($filter('date')(new Date(), 'dd-MM-yyyy'));
                var year = vrdate1.substring(6, 10); //6 character
                var month = vrdate1.substring(3, 5);
                var date = vrdate1.substring(0, 2);
                var endYear = ToDate.substring(6, 10);
                var endMonth = ToDate.substring(3, 5);
                var endDate = ToDate.substring(0, 2);

                var vrdate2 = new Date(year, month - 1, date);
                var ToDate = new Date(endYear, endMonth - 1, endDate);

                if (vrdate2.getTime() < ToDate.getTime()) {
                    globalObjectServices.alertPopup("Please Re-Enter data, as date is changed");
                    isSaveEntry = false;
                    globalObjectServices.goBack(-2);
                }
            }

            if (isSaveEntry) {
                dataServices.uploadEntry(fields, l_appSeqNo, $scope.url, l_object.l_latitude,
                        l_object.l_longitude, l_object.l_location, "Update",
                        sp_Obj.seqId, sp_Obj.dependent_next_entry_seq, sp_Obj.update_key, sp_Obj.update_key_value,
                        sp_Obj.update_key_codeOfValue, "", sqlFlag).then(function (data) {
                    console.log(data);

                    $scope.isDisabled = false;
                    $scope.saveSql = data.sqlData;
                    $scope.showSql($scope.saveSql);
                    globalObjectServices.hideLoading();

                    if (data.status == "updated data") {

                        // globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                        // globalObjectServices.goBack(-2);
                        // alert(data.status)

                        var msg = "Entry Updated Successfully.<br>";
                        if (sp_Obj.VRNO) {
                            // alert("VRNO : " + sp_Obj.VRNO);
                            msg = msg + " VRNO : " + sp_Obj.VRNO
                        }
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'confirm',
                            template: msg,
                            buttons: [
                                {text: 'Exit', onTap: function (e) {
                                        return false;
                                    }},
                                {
                                    text: 'Continue',
                                    type: 'button-positive',
                                    onTap: function (e) {
                                        return true;
                                    }
                                },
                            ]
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                // $state.reload();
                                // $state.go($state.current, { obj: sp_Obj }, { reload: true });
                                $state.transitionTo($state.current, {obj: sp_Obj}, {reload: true});
                            } else {
//                                globalObjectServices.goBack(-2);
                            }
                        });

                    } else {
                        globalObjectServices.displayCordovaToast(data.status);
                    }
                }, function (err) {
                    $scope.isDisabled = false;
                    globalObjectServices.hideLoading();
                    globalObjectServices.displayErrorMessage(err)
                });

            }

        } else {
            globalObjectServices.hideLoading();
            globalObjectServices.displayCordovaToast('Network is not available, Try again...')

        }
    }

    $scope.addNewEntry = function (fields, sqlFlag) {
        $scope.isDisabled = true;

        globalObjectServices.showLoading();
        if (sp_Obj.mandatory_to_start_portal === 'O') {
            addHeadEntry(sp_Obj.headOrderEntry, sqlFlag).then(function (data) {
                sp_Obj.mandatory_to_start_portal = 'E';
                globalObjectServices.hideLoading();
                sp_Obj.VRNO = data.vrno;
                addEntry(fields, sqlFlag);
            }, function (err) {
                console.log(err);
            })
        } else {
            addEntry(fields, sqlFlag);

        }



//        $ionicModal.fromTemplateUrl('static/templates/sqlDataModal.html', {
//            scope: $scope,
//            animation: 'slide-in-up'
//        }).then(function (modal) {
//            $scope.sqlDataModal = modal;
//            $scope.sqlDataModal.show();
//        });




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