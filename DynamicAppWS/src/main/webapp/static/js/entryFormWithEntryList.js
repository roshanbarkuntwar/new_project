angular.module('starter.controllers').controller('entryFormWithEntryListCtrl', function (AuthServices, $filter,
        $state, $ionicModal, $scope, $ionicPopup, addUpdateEntryServices, pouchDBService,
        dataServices, globalObjectServices, $http, $rootScope, $sce, $cordovaCapture) {

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
    $scope.disableAddNew = sp_Obj.replicate_rec;

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
    }, {scope: $scope})

    $ionicModal.fromTemplateUrl('static/templates/textAreaPopOver.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.textAreaPopOverModal = popover;
    });

    if ((sp_Obj.updation_process).indexOf('V') > -1) {
        $scope.flagForEntryListButton = 'V#';
    }

    var l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode + "&accCode=" + AuthServices.acc_code();
    //console.log("l_url" + l_url);
    if ($rootScope.online) {
        if (sp_Obj.type == "offlineUpdateEntry") {
        } else {
            dataServices.getEntryFromData(l_url, l_appSeqNo).then(function (data) {
                $scope.fields = data.recordsInfo;
                $scope.sqlData = data.sqlData;
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
        })
        $scope.fields = addUpdateEntryServices.setDataCommon($scope.fields, "", sp_Obj.sessionHB);
    }


    /* Autocalculation*/
    $scope.autoCalculation = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculation(column_name, $scope.fields);
    }

    $scope.autoCalculationOfDuration = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculationOfDuration($scope.fields, column_name)
    }


    $scope.entryList = function (fields) {

        fields.forEach(function (data) {
            if (data.column_name == sp_Obj.update_key) {
                sp_Obj.update_key_value = data.value
                sp_Obj.update_key_codeOfValue = data.codeOfValue;
            }
        })

        if ($rootScope.online) {
            var url = $scope.url + 'dynamicEntryList?userCode=' + AuthServices.userCode() +
                    '&reportingDate=' + sp_Obj.update_key_codeOfValue + '&seqNo=' + sp_Obj.replicate_fields;
            //console.log(url);
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

    $scope.addEntry = function (fieldsData) {
        // AuthServices.setAppSeqNo(sp_Obj.dependent_next_entry_seq);
        // sp_Obj.type = "Update";
        // AuthServices.setTabParam(sp_Obj);
        fieldsData.forEach(function (data) {
            if (data.column_name == sp_Obj.update_key) {
                sp_Obj.update_key_value = data.value
                sp_Obj.update_key_codeOfValue = data.codeOfValue;
            }
        })
        sp_Obj.type = "";
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