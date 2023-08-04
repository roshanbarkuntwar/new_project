angular.module('starter.controllers').controller('searchEntryCtrl', function (AuthServices, $filter,
    $state, $stateParams, $ionicModal, $scope, $ionicPopup, addUpdateEntryServices, pouchDBService,
    dataServices, globalObjectServices, $http, $rootScope, $ionicPopover, $sce, $cordovaCapture) {

    var l_userCode = AuthServices.userCode();
    var l_appSeqNo = AuthServices.appSeqNo();

    // var sp_Obj = $state.params.obj // state params getting from dashbord , entryList,calendar states
    // var sp_Obj = $state.params.obj
    var sp_Obj = AuthServices.tabParam();
    $scope.table_desc = sp_Obj.table_desc;
    $scope.searchEntity = {};
    // l_appSeqNo = ((parseInt(l_appSeqNo)) + 0.2);
    // l_appSeqNo
    $scope.listOfEntry = [];
    $scope.count = 1;
    $scope.update_key = sp_Obj.update_key;

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

    var l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode + "&accCode=" + AuthServices.acc_code() + "&searchText=";
    console.log("l_url" + l_url);
    if ($rootScope.online) {
        if (sp_Obj.type == "offlineUpdateEntry") { } else {
            dataServices.getEntryFromData(l_url, l_appSeqNo).then(function (data) {
                $scope.fields = data.recordsInfo;
                setData();
            }, function (err) {
                globalObjectServices.displayErrorMessage(err)
            })
        }
    } else {
        if (sp_Obj.type == "offlineUpdateEntry") { } else {
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

            if ((obj1.updation_process).indexOf("I") > -1) { } else {
                obj1.entry_by_user = "F";
                obj1.nullable = "T";
            }
        })
        // $scope.fields = addUpdateEntryServices.setDataCommon($scope.fields, "", sp_Obj.sessionHB);

        addUpdateEntryServices.setDataCommon($scope.fields, "", sp_Obj.sessionHB).then(function (data) {
            $scope.fields = data;
        })
    }


    /* Autocalculation*/
    $scope.autoCalculation = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculation(column_name, $scope.fields);
    }

    $scope.autoCalculationOfDuration = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculationOfDuration($scope.fields, column_name)
    }


    $scope.entryList = function (fields) {
        // var retailer_code;
        // fields.forEach(function (data) {
        //     if (data.column_name == "retailer_code") {
        //         retailer_code = data.codeOfValue;
        //     }
        // })


        fields.forEach(function (data) {
            if (data.column_name == sp_Obj.update_key) {
                sp_Obj.update_key_value = data.value
                sp_Obj.update_key_codeOfValue = data.codeOfValue;
            }
        })



        if ($rootScope.online) {
            var url = $scope.url + 'dynamicEntryList?userCode=' + AuthServices.userCode() +
                '&reportingDate=' + sp_Obj.update_key_codeOfValue + '&seqNo=' + "3";
            $http.get(url).success(function (data) {
                $scope.listOfEntries = data
                if ($scope.listOfEntries == "") {
                    globalObjectServices.displayCordovaToast('Entries not available...')
                }
            }).error(function (data, status) {
                $scope.listOfEntries = "";
                globalObjectServices.displayErrorMessage(status)
            })
        } else {
            globalObjectServices.hideLoading();
            globalObjectServices.displayCordovaToast('Can not fetch Entry List in OFFLINE mode...')
        }
    }


    $scope.updateEntry = function (fieldsData) {
        // AuthServices.setAppSeqNo(sp_Obj.dependent_next_entry_seq);
        // sp_Obj.type = "Update";
        // AuthServices.setTabParam(sp_Obj);

        fieldsData.forEach(function (data) {
            if (data.update_key == data.column_name) {
                sp_Obj.dependent_next_entry_update_key = data.update_key;
                sp_Obj.dependent_next_entry_update_key_value = data.value
                sp_Obj.dependent_next_entry_update_key_codeOfValue = data.codeOfvalue;
            }
        })

        // retailer_code

        sp_Obj.type = "Update";
        sp_Obj.types = "I";
        sp_Obj.dependent_next_entry_seq = sp_Obj.replicate_fields;
        AuthServices.setTabParam(sp_Obj);

        if (sp_Obj.access_contrl == 'D2') {
            $state.go('addUpdateEntryTable1');
        } else if (sp_Obj.access_contrl == 'D3') {
            $state.go('addUpdateEntryTable2');
        } else {
            $state.go('addUpdateEntry');
        }

        // $state.go('addUpdateEntry');
    }

    $scope.addNewEntry = function (fieldsData) {
        var checkForSessionEntry = false;
        globalObjectServices.showLoading();
        var key = "valueToSend";

        var session = {
            sessionvalue: []
        };

        fieldsData.forEach(function (obj) {
            if (obj.session_column_flag == "T") {
                var item = obj;
                session.sessionvalue.push({
                    "column_name": item.column_name,
                    "value": item.value,
                    "codeOfValue": item.codeOfValue
                });

            }
            if (!checkForSessionEntry) {
                if (obj.session_column_flag == "T") {
                    checkForSessionEntry = true;

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
                                    if (obj.column_name == "RETAILER_CODE" || obj.column_desc == "Retailer Code") {
                                        sp_Obj.RETAILER_CODE = obj.codeOfValue;
                                        obj[key] = obj.codeOfValue;
                                    } else {
                                        if (obj.column_name == "DIV_CODE") {
                                            sp_Obj.DIV_CODE = obj.codeOfValue;
                                            obj[key] = obj.codeOfValue;
                                        } else {
                                            if (obj.column_name == "GEO_CODE") {
                                                sp_Obj.GEO_CODE = obj.codeOfValue;
                                                obj[key] = obj.codeOfValue;
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
                                                        sp_Obj.ITEM_CODE = obj.codeOfValue;
                                                        obj[key] = obj.codeOfValue;
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
                                                                                    if (obj.value || obj.value == "") {
                                                                                        obj.value.forEach(function (data) {
                                                                                            if (obj[key]) {
                                                                                                obj[key] = obj[key] + ',' + data;
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
                                                                                    } else if (obj.column_type == "DATE") {
                                                                                        // obj[key] = $filter('date')(obj.value, 'dd-MM-yyyy');
                                                                                        obj[key] = $filter('date')(obj.value, 'yyyy-MM-dd');
                                                                                    } else {
                                                                                        if (obj.column_desc.indexOf(".") > -1) {
                                                                                            var copyFrom = obj.column_desc.split(".")[1];
                                                                                            fieldsData.forEach(function (obj2) {
                                                                                                if (obj2.column_name == copyFrom) {
                                                                                                    obj[key] = obj2.value;
                                                                                                }
                                                                                            })
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

                        }
                    }
                }
                if (obj.column_name == sp_Obj.update_key) {
                    if (obj.codeOfValue) {
                        sp_Obj.update_key_value = obj.value;
                        sp_Obj.update_key_codeOfValue = obj.codeOfValue;
                    } else {
                        sp_Obj.update_key_value = obj.value;
                        sp_Obj.update_key_codeOfValue = obj.value;
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


        if ($rootScope.online) {


            dataServices.uploadEntry(fieldsData, l_appSeqNo, $scope.url, l_object.l_latitude,
                l_object.l_longitude, l_object.l_location, "Update",
                sp_Obj.seqId, sp_Obj.dependent_next_entry_seq, sp_Obj.update_key, sp_Obj.update_key_value, sp_Obj.update_key_codeOfValue).then(function (data) {
                    globalObjectServices.hideLoading();
                    // alert(sp_Obj.unique_message)
                    if (data.status == "insert data") {
                        // if (sp_Obj.type == "order") {
                        //     $state.go('addUpdateOrder', { obj: sp_Obj });
                        //     globalObjectServices.nativeTranstion("left");
                        // } else {
                        globalObjectServices.displayCordovaToast('Entry Saved Successfully..')
                        globalObjectServices.goBack(-1);
                        // }
                    } else
                        if (data.status == "updated data") {
                            if (sp_Obj.types == "O") {
                                var l_obj = [];
                                l_obj.listData = fieldsData;
                                l_obj.seqNo = ((parseInt(l_tempSeqNo)) + 0.2);
                                $state.go('entryDetailsInTabular', { obj: l_obj })
                                globalObjectServices.nativeTranstion("left");
                            } else {
                                if (sp_Obj.unique_message) {
                                    dataServices.executeAfterUpdate
                                }
                                globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                                if (sp_Obj.types == 'Q') {
                                    globalObjectServices.goBack(-1);
                                } else {
                                    globalObjectServices.goBack(-2);
                                }
                            }
                        } else {
                            globalObjectServices.displayCordovaToast(data.status);
                        }
                }, function (err) {
                    globalObjectServices.hideLoading();
                    globalObjectServices.displayErrorMessage(err)
                })
        }

    }


    $scope.searchEntry = function (item, fieldsData) {

        var dependent_row_logic;
        var dependent_row;
        var noOfCall = 0;

        $scope.fields.forEach(function (obj) {
            if (obj.dependent_row) {
                noOfCall++;
            }
        })

        $scope.fields.forEach(function (obj) {

            if (obj.dependent_row) {
                if (obj.dependent_row.indexOf(item.column_name) > -1) {
                    dependent_row = obj.dependent_row;
                    if (dependent_row.indexOf('#') > -1) {
                        dependent_row_logic = dependent_row;
                        $scope.fields.forEach(function (obj1) {
                            if (dependent_row.indexOf(obj1.column_name) > -1) {
                                if (obj1.value) {
                                    dependent_row_logic = dependent_row_logic.replace(obj1.column_name, obj1.value);
                                } else {
                                    dependent_row_logic = dependent_row_logic.replace(obj1.column_name, "null");
                                }
                            }
                        })
                    } else {
                        dependent_row_logic = item.value;
                    }

                    $scope.fields = addUpdateEntryServices.setDependantRowValueSE(obj.column_name, dependent_row_logic, l_appSeqNo, item.dependent_row, "", fieldsData, $scope.url, noOfCall)

                }
            }
        })



        // fieldsData.forEach(function(data) {
        //     if (item.column_name == data.dependent_row) {
        //         $scope.fields = addUpdateEntryServices.setDependantRowValue(data.column_name, item.value, l_appSeqNo, item.dependent_row, "", fieldsData, $scope.url)
        //     }
        // })



        // function setDependantRowValue(column_name, name, l_appSeqNo, dependent_row, type, fields, s_url) {
    }

    $scope.cancelAddUpdateEntry = function () {
        globalObjectServices.confirmationPopup('Do you want to Cancel Entry?').then(function (data) {
            if (data == 'ok') {
                globalObjectServices.goBack(-2);
            } else { }
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

        if (dependent_row) {
            if (dependent_row.indexOf('#') > -1) {
                dependent_row_logic = dependent_row;
            }


            $scope.fields.forEach(function (obj) {


                if (dependent_row_logic.indexOf(obj.column_name) > -1) {

                    if (obj.value) {
                        dependent_row_logic = dependent_row_logic.replace(obj.column_name, obj.value);
                    } else {
                        dependent_row_logic = dependent_row_logic.replace(obj.column_name, "null");
                    }
                    // console.log(obj.column_name + " : " + obj.value);
                    // console.log(dependent_row_logic);

                }




                // if (obj.column_name == dependent_row) {
                //     if (dependent_row_logic == "=") {
                //         if (obj.codeOfValue != null) {
                //             dependent_row_logic = obj.codeOfValue;
                //         } else {
                //             dependent_row_logic = "=";
                //         }
                //     }
                // }

            })
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
        $scope.textAreaPopOverModal.hide().then(function () {
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

    /* To Take Image */
    $scope.takeImage = function (column_name) {
        $scope.fields = addUpdateEntryServices.takeImage($scope.fields, column_name);
    }

    /* To Scan Barcode */
    $scope.scanBarcode = function (column_name) {
        $scope.fields = addUpdateEntryServices.scanBarcode($scope.fields, column_name);
        $scope.fields.forEach(function (data) {
            if (column_name == data.column_name) {
                // $scope.dependent_nullable_logic(data.column_name, data.dependent_row, $scope.fields, $scope.url, l_appSeqNo, data.dependent_value);
                $scope.dependent_nullable_logic(data.value, data.column_name, data.dependent_column_name, '')

            }
        })

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
                $scope.videoSignature = { src: $scope.l_base64VideoData, title: "Video Data" }; //Adding coverted base64 data to Src
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
                    } else { }
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

    $scope.$on('$destroy', function () {
        $scope.addEntryLOVModal.remove().then(function () {
            $scope.addEntryLOVModal = null;
        })
        $scope.textAreaPopOverModal.remove().then(function () {
            $scope.textAreaPopOverModal = null;
        })
    });

})