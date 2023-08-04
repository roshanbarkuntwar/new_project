angular.module('starter.controllers').controller('addUpdateEntryCtrl', function ($cordovaGeolocation, AuthServices, $filter,
        $state, $stateParams, addUpdateEntryServices, $ionicModal, $scope, dataServices,
        globalObjectServices, pouchDBService, $rootScope, $ionicPopover, popOrderServ, $sce, $cordovaCapture) {

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
    $scope.orderFormNext = $state.params.obj;
    // alert(orderFormNext);
    /* Getting Lat ,Long and TimeStamp */
    var l_object = [];
    // var l_object = addUpdateEntryServices.getLatLangTimeStamp();
    addUpdateEntryServices.getLatLangTimeStamp().then(function (data) {
        l_object = data;
    })

    /* Screen Orientation */
    if (AuthServices.screenOrientionView() == "V") {
        // window.screen.lockOrientation('portrait');
    } else {
        if (AuthServices.screenOrientionView() == "H") {
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
        $scope.orderFormNext = "Update";
        if (sp_Obj.types == 'O') {
            l_appSeqNo = ((parseInt(l_appSeqNo)) + 0.1);
            l_url = $scope.url + 'updateEntryForm?tableSeqNo=' + l_appSeqNo + '&entrySeqId=' + sp_Obj.seqId + '&userCode=' +
                    l_userCode;
            if (sp_Obj.types == 'Q') {
                l_appSeqNo = ((parseInt(l_appSeqNo)) + 0.1);
            }
            if (sp_Obj.dependent_next_entry_update_key_codeOfValue) {
                l_url = l_url + "&updateKey=" + sp_Obj.dependent_next_entry_update_key_codeOfValue;
            } else {
                l_url = l_url + "&updateKey=" + sp_Obj.dependent_next_entry_update_key_value;
            }
            // l_url = l_url + "&updateKey=" + sp_Obj.dependent_next_entry_update_key_codeOfValue;

        } else {
            if (sp_Obj.types == "I") {
                l_appSeqNo = sp_Obj.dependent_next_entry_seq


                l_url = $scope.url + 'updateEntryForm?tableSeqNo=' + l_appSeqNo + '&userCode=' +
                        l_userCode

                if (sp_Obj.dependent_next_entry_update_key_codeOfValue) {
                    l_url = l_url + "&updateKey=" + sp_Obj.dependent_next_entry_update_key_codeOfValue;
                } else {
                    l_url = l_url + "&updateKey=" + sp_Obj.dependent_next_entry_update_key_value;
                }

            } else {
                l_url = $scope.url + 'updateEntryForm?tableSeqNo=' + l_appSeqNo + '&entrySeqId=' + sp_Obj.seqId + '&userCode=' +
                        l_userCode;
                if (sp_Obj.update_key_codeOfValue) {
                    l_url = l_url + "&updateKey=" + sp_Obj.update_key_codeOfValue;
                } else {
                    l_url = l_url + "&updateKey=" + sp_Obj.update_key_value;
                }
            }
        }


    } else {
        if ((sp_Obj.updation_process).indexOf("V") > -1) {
            $scope.flagForEntryListButton = 'V#';
        }
        if (sp_Obj.type == "order" || sp_Obj.type == "orderPopulated" || sp_Obj.type == "EG") {
            $scope.orderFormNext = "next";
            l_appSeqNo = ((parseInt(l_appSeqNo)) + 0.1);
            l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode;
        } else {
            //addEntryForm 
            if (sp_Obj.dependent_next_entry_seq) {
                l_appSeqNo = sp_Obj.dependent_next_entry_seq;
                l_url = $scope.url + 'addEntryForm?seqNo=' + sp_Obj.dependent_next_entry_seq + '&userCode=' + l_userCode;
            } else {
                l_url = $scope.url + 'addEntryForm?seqNo=' + l_appSeqNo + '&userCode=' + l_userCode;
            }
        }

        l_url = l_url + "&accCode=" + AuthServices.acc_code() + '&searchText=';

        // console.log(l_url);
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
            console.log(l_url);
            dataServices.getEntryFromData(l_url, l_appSeqNo).then(function (data) {
                $scope.fields = data.recordsInfo;
                addUpdateEntryServices.setDataCommon($scope.fields, sp_Obj.vrno).then(function (fields) {
                    $scope.fields = fields;
                    setData();
                });
                // console.log(" $scope.fields========="+ JSON.stringify($scope.fields));
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
                // $scope.fields = addUpdateEntryServices.setDataCommon($scope.fields);
                addUpdateEntryServices.setDataCommon($scope.fields, sp_Obj.vrno).then(function (fields) {
                    $scope.fields = fields;
                    $scope.fields.forEach(function (obj) {
                        if (obj.column_type == "DATE" || obj.column_type == "DATETIME") {
                            obj.value = $filter('date')(new Date(), 'dd-MM-yyyy hh:mm:ss');
                        }
                    })
                    setData();
                });

            }, function (err) {
                globalObjectServices.alertPopup('Data is not available please REFRESH app')
            })
        }
    }


    // var videoSignatureSrc;
    function setData() {
        // alert(sp_Obj.type );

        $scope.fields.forEach(function (obj1) {
            if (obj1.column_name == 'APP_IMENO' || obj1.column_default_value == "APP_IMENO") {
                obj1.value = $scope.deviceName + '~~' + $scope.deviceID;
            }

            if (obj1.column_default_value == 'APP_GPS') {
                obj1.value = l_object.l_latitude + '~~' + l_object.l_longitude;
            }

            if (sp_Obj.sessionE) {
                sp_Obj.sessionE.forEach(function (data) {
                    if (data.column_name == obj1.column_name) {
                        obj1.value = data.value;
                        obj1.codeOfValue = data.codeOfValue;
                    }
                })
            }
        })
        if (sp_Obj.type == "Update" || sp_Obj.types == "I") {
            $scope.fields.forEach(function (obj1) {
                if (obj1.column_type == "VIDEO") {
                    obj1.item_help_property = "V";
                    var l_videoSrcData = 'data:video/mp4;base64,' + obj1.value;
                    // $scope.videoSignature = { src: l_videoSrcData, title: "Video Data" }; //Adding Incoming video data to Src
                    $scope.recordedVideoData = trustSrc(l_videoSrcData); //Making video data as trusted src for displaying video
                }
                if ((obj1.updation_process).indexOf("U") > -1) {
                } else {
                    obj1.entry_by_user = "R";
                }

                if (obj1.column_name == sp_Obj.update_key) {
                    if (!obj1.value && !obj1.codeOfValue) {
                        obj1.value = sp_Obj.update_key_value;
                        obj1.codeOfValue = sp_Obj.update_key_codeOfValue;
                    }

                }

                $scope.fields.forEach(function (obj2) {
                    if (obj1.column_name == obj2.dependent_row) {
                        if (obj1.codeOfValue) {
                            obj2.dependent_row_logic = obj1.codeOfValue;
                        } else {
                            obj2.dependent_row_logic = obj1.value;
                        }

                    }
                })
                if (obj1.item_help_property == "R") {
                    $scope.setRating(obj1.value, obj1.column_name);
                }
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
                        // $scope.videoSignature = { src: l_videoSrcData, title: "Video Data" }; //Adding Incoming video data to Src
                        $scope.recordedVideoData = trustSrc(l_videoSrcData); //Making video data as trusted src for displaying video
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
                //  console.log(" $scope.fields========="+ JSON.stringify($scope.fields));
                $scope.fields.forEach(function (obj1) {
                    if ((obj1.updation_process).indexOf("I") > -1) {
                    } else {
                        obj1.entry_by_user = "F";
                        obj1.nullable = "T";
                    }
                    if ((obj1.column_default_value) == "LHSSYS_CALENDER_SCHEDULER") {
                        // console.log("ye=="+obj1.value);
                        var value = (obj1.value).split('#');
                        obj1.value = value[0];
                        obj1.codeOfValue = value[1];
                    } else {
                    }
                    // if (obj2.dependent_row) {

                    $scope.fields.forEach(function (obj2) {
                        // if (obj2.dependent_row === obj1.column_name) {
                        if (obj2.dependent_row) {
                            if (obj2.dependent_row.indexOf(obj1.column_name) > -1) {
                                if (obj2.item_help_property !== 'L') {

                                    var whereClauseValue = obj2.dependent_row;
                                    var arr = obj2.dependent_row.split('#');
                                    // if (obj1.codeOfValue) {
                                    $scope.fields.forEach(function (data) {
                                        if (arr.indexOf(data.column_name) > -1) {
                                            if (data.codeOfValue) {
                                                whereClauseValue = whereClauseValue.replace(data.column_name, data.codeOfValue);
                                            } else {
                                                whereClauseValue = whereClauseValue.replace(data.column_name, data.value);
                                            }
                                        }
                                    })
                                    $scope.fields = addUpdateEntryServices.setDependantRowValue(obj2.column_name, whereClauseValue, l_appSeqNo, obj2.dependent_row, "", $scope.fields, $scope.url);
                                    // $scope.fields = addUpdateEntryServices.setDependantRowValue(obj2.column_name, obj1.codeOfValue, l_appSeqNo, obj2.dependent_row, "", $scope.fields, $scope.url);
                                    // } else {
                                    //     if (obj1.value) {


                                    //         $scope.fields = addUpdateEntryServices.setDependantRowValue(obj2.column_name, obj1.value, l_appSeqNo, obj2.dependent_row, "", $scope.fields, $scope.url);
                                    //     }
                                    // }
                                }
                            }
                        }
                    })
                    // }

                })
            }
        }
        if (sp_Obj.type == "IM") {
            $scope.orderFormNext = "image"
        }
    }


    $scope.ratingArr = [{
            value: 1,
            icon: 'ion-ios-star-outline'
        }, {
            value: 2,
            icon: 'ion-ios-star-outline'
        }, {
            value: 3,
            icon: 'ion-ios-star-outline'
        }, {
            value: 4,
            icon: 'ion-ios-star-outline'
        }, {
            value: 5,
            icon: 'ion-ios-star-outline'
        }];

    $scope.setRating = function (val, column_name) {
        var rtgs = $scope.ratingArr;
        for (var i = 0; i < rtgs.length; i++) {
            if (i < val) {
                rtgs[i].icon = 'ion-ios-star';
            } else {
                rtgs[i].icon = 'ion-ios-star-outline';
            }
        }
        ;

        $scope.fields.forEach(function (obj) {
            if (obj.column_name == column_name) {
                obj.value = val;
            }
        })

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

    $ionicModal.fromTemplateUrl('static/templates/signature_pad.html', function (modal) {
        $scope.signature_padModal = modal;
    }, {
        scope: $scope
    });

    $scope.opensignature_padModal = function (column_name) {
        $scope.column_name = column_name;
        $scope.signature_padModal.show();
        $scope.signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(0, 0, 0)'
        });
        var saveButton = document.getElementById('save');
        var cancelButton = document.getElementById('clear');

        // saveButton.addEventListener('click', function (event) {
        // Send data to server instead...
        //  var data = signaturePad.toDataURL('image/png');
        // window.open(data);
        // });

        cancelButton.addEventListener('click', function (event) {
            $scope.signaturePad.clear();
        });
    }


    $scope.saveSignature = function () {
        var data = $scope.signaturePad.toDataURL('image/png');
        $scope.fields.forEach(function (obj) {
            if (obj.column_name == $scope.column_name) {
                // data:image/png;base64,
                obj.value = data.replace("data:image/png;base64,", "");
                obj.textOverLay = "T";
            }
        })
        $scope.signature_padModal.hide();
    }


    /* Autocalculation*/
    $scope.autoCalculation = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculation(column_name, $scope.fields)
    }

    $scope.autoCalculationOfDuration = function (column_name) {
        $scope.fields = globalObjectServices.autoCalculationOfDuration($scope.fields, column_name)
    }

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
                // $scope.videoSignature = { src: l_base64VideoData, title: "Video Data" }; //Adding coverted base64 data to Src
                var l_recordedVideoData = trustSrc(l_base64VideoData); //Make src as Trusted to display Video in HTML
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

    $scope.addNewEntry = function (fieldsData, sqlFlag) {
        var checkForSessionEntry = false;
        globalObjectServices.showLoading();
        var key = "valueToSend";

        var session = {
            sessionvalue: []
        };

        var sessionHB = [];

        var sessionE = [];

        fieldsData.forEach(function (obj) {
            if (obj.session_column_flag.indexOf('T') > -1) {
                checkForSessionEntry = true;
                var item = obj;
                session.sessionvalue.push({
                    "column_name": item.column_name,
                    "value": item.value,
                    "codeOfValue": item.codeOfValue
                });

            }

            if (obj.session_column_flag.indexOf('HB') > -1) {
                sessionHB.push({
                    "column_name": obj.column_name,
                    "value": obj.value,
                    "codeOfValue": obj.codeOfValue
                });
            }

            if (obj.session_column_flag.indexOf('E') > -1) {
                sessionE.push({
                    "column_name": obj.column_name,
                    "value": obj.value,
                    "codeOfValue": obj.codeOfValue
                });
            }


            if (obj.column_name == "VRNO" || obj.column_desc == "VRNO") {
                if (obj.codeOfValue) {
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
                        if (obj.codeOfValue) {
                            sp_Obj.TCODE = obj.codeOfValue;
                            obj[key] = obj.codeOfValue;
                        } else {
                            sp_Obj.TCODE = obj.value;
                            obj[key] = obj.value;
                        }

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
                                if (obj.codeOfValue) {
                                    sp_Obj.RETAILER_CODE = obj.codeOfValue;
                                    obj[key] = obj.codeOfValue;
                                } else {
                                    sp_Obj.RETAILER_CODE = obj.value;
                                    obj[key] = obj.value;
                                }
                            } else {
                                if (obj.column_name == "DIV_CODE") {
                                    if (obj.codeOfValue) {
                                        sp_Obj.DIV_CODE = obj.codeOfValue;
                                        obj[key] = obj.codeOfValue;
                                    } else {
                                        sp_Obj.DIV_CODE = obj.value;
                                        obj[key] = obj.value;
                                    }

                                } else {
                                    if (obj.column_name == "PLANT_CODE") {
                                        if (obj.codeOfValue) {
                                            sp_Obj.PLANT_CODE = obj.codeOfValue;
                                            obj[key] = obj.codeOfValue;
                                        } else {
                                            sp_Obj.PLANT_CODE = obj.value;
                                            obj[key] = obj.value;
                                        }
                                    } else {
                                        if (obj.column_name == "SHIFT_CODE") {
                                            if (obj.codeOfValue) {
                                                sp_Obj.SHIFT_CODE = obj.codeOfValue;
                                                obj[key] = obj.codeOfValue;
                                            } else {
                                                sp_Obj.SHIFT_CODE = obj.value;
                                                obj[key] = obj.value;
                                            }
                                        } else {
                                            if (obj.column_name == "CNTR_CODE") {
                                                if (obj.codeOfValue) {
                                                    sp_Obj.CNTR_CODE = obj.codeOfValue;
                                                    obj[key] = obj.codeOfValue;
                                                } else {
                                                    sp_Obj.CNTR_CODE = obj.value;
                                                    obj[key] = obj.value;
                                                }
                                            } else {
                                                if (obj.column_name == "COST_CODE") {
                                                    if (obj.codeOfValue) {
                                                        sp_Obj.COST_CODE = obj.codeOfValue;
                                                        obj[key] = obj.codeOfValue;
                                                    } else {
                                                        sp_Obj.COST_CODE = obj.value;
                                                        obj[key] = obj.value;
                                                    }
                                                } else {
                                                    if (obj.column_name == "PROCESS_CODE") {
                                                        if (obj.codeOfValue) {
                                                            sp_Obj.PROCESS_CODE = obj.codeOfValue;
                                                            obj[key] = obj.codeOfValue;
                                                        } else {
                                                            sp_Obj.PROCESS_CODE = obj.value;
                                                            obj[key] = obj.value;
                                                        }
                                                    } else {
                                                        if (obj.column_name == "GEO_CODE") {
                                                            if (obj.codeOfValue) {
                                                                sp_Obj.GEO_CODE = obj.codeOfValue;
                                                                obj[key] = obj.codeOfValue;
                                                            } else {
                                                                sp_Obj.GEO_CODE = obj.value;
                                                                obj[key] = obj.value;
                                                            }
                                                        } else {
                                                            if (obj.column_name == "CASE_NO") {
                                                                if (obj.codeOfValue) {
                                                                    sp_Obj.CASE_NO = obj.codeOfValue;
                                                                    obj[key] = obj.codeOfValue;
                                                                } else {
                                                                    sp_Obj.CASE_NO = obj.value;
                                                                    obj[key] = obj.value;
                                                                }
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
                                                                        if (obj.codeOfValue) {
                                                                            sp_Obj.ITEM_CODE = obj.codeOfValue;
                                                                            obj[key] = obj.codeOfValue;
                                                                        } else {
                                                                            sp_Obj.ITEM_CODE = obj.value;
                                                                            obj[key] = obj.value;
                                                                        }
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
                                                                                    if (obj.codeOfValue) {
                                                                                        sp_Obj.ACC_CODE = obj.codeOfValue;
                                                                                        obj[key] = obj.codeOfValue;
                                                                                    } else {
                                                                                        sp_Obj.ACC_CODE = obj.value;
                                                                                        obj[key] = obj.value;
                                                                                    }
                                                                                } else {
                                                                                    if (obj.column_desc == "Consumer Number") {
                                                                                        sp_Obj.consumerNumber = obj.value;
                                                                                        obj[key] = obj.value;
                                                                                    } else {
                                                                                        if (obj.column_name == "DM_VRNO") {
                                                                                            if (obj.codeOfValue) {
                                                                                                sp_Obj.DM_VRNO = obj.codeOfValue;
                                                                                                obj[key] = obj.codeOfValue;
                                                                                            } else {
                                                                                                sp_Obj.DM_VRNO = obj.value;
                                                                                                obj[key] = obj.value;
                                                                                            }
                                                                                        } else {
                                                                                            if (obj.column_name == "FG_CIP_NO") {
                                                                                                if (obj.codeOfValue) {
                                                                                                    sp_Obj.FG_CIP_NO = obj.codeOfValue;
                                                                                                    obj[key] = obj.codeOfValue;
                                                                                                } else {
                                                                                                    sp_Obj.FG_CIP_NO = obj.value;
                                                                                                    obj[key] = obj.value;
                                                                                                }
                                                                                            } else {
                                                                                                if (obj.column_name == "DM_SLNO") {
                                                                                                    if (obj.codeOfValue) {
                                                                                                        sp_Obj.DM_SLNO = obj.codeOfValue;
                                                                                                        obj[key] = obj.codeOfValue;
                                                                                                    } else {
                                                                                                        sp_Obj.DM_SLNO = obj.value;
                                                                                                        obj[key] = obj.value;
                                                                                                    }
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
                                                                                                                    if (obj.column_name == 'CHQDATE') {
                                                                                                                        obj[key] = $filter('date')(obj.value, 'dd-MM-yyyy');
                                                                                                                    } else {
                                                                                                                        obj[key] = $filter('date')(obj.value, 'yyyy-MM-dd');
                                                                                                                    }
                                                                                                                    // obj[key] = $filter('date')(obj.value, 'yyyy-MM-dd');
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


        sp_Obj.sessionHB = sessionHB;
        sp_Obj.sessionE = sessionE;




        if (checkForSessionEntry == true) {
            dataServices.storeSessionColumn1(session.sessionvalue).then(function (data) {
                // if (sp_Obj.access_contrl == 'PO' || sp_Obj.mandatory_to_start_portal !== 'F') {
                //     checkForSessionEntry = false;
                // } else {
                //     globalObjectServices.displayCordovaToast('Entry saved successfully.');
                //     globalObjectServices.goBack(-1);
                // }

                if (sp_Obj.mandatory_to_start_portal === 'F') {
                    globalObjectServices.displayCordovaToast('Entry saved successfully.');
                    globalObjectServices.goBack(-1);
                }
            })
        }
        if (sp_Obj.mandatory_to_start_portal !== 'F') {

            // console.log(JSON.stringify(fieldsData))
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
                            globalObjectServices.displayCordovaToast('Entry Updated Successfully..');
                        }, function (err) {
                            globalObjectServices.hideLoading();
                            globalObjectServices.displayCordovaToast('Try Again...')
                        })
                    }
                } else {
                    // alert("IM A1");
                    if (sp_Obj.type == "IM") {
                        globalObjectServices.hideLoading();
                        sp_Obj.headEntryFieldsData = fieldsData;
                        // alert("IM $state.go(imageEntry)");
                        $state.go('imageEntry');
                    } else {

                        if (sp_Obj.type == "order" || sp_Obj.type == "orderPopulated") {
                            // var access_contrl="PO";/////////////GENNN
                            // mandatory_to_start_portal


                            if (sp_Obj.access_contrl == 'PO') {
                                // sp_Obj.access_contrl='PO';
                                sp_Obj.l_appSeqNo = l_appSeqNo;
                                sp_Obj.sessionvalue = session.sessionvalue;
                                // sp_Obj.firstScreen=firstScreen
                                sp_Obj.searchText = "";
                                fieldsData.forEach(function (obj) {
                                    // if (obj.session_column_flag == 'P') {
                                    // if (obj.session_column_flag) {
                                    //     if (obj.session_column_flag.indexOf('P') > -1) {
                                    //         sp_Obj.searchText = obj.codeOfValue;
                                    //         sp_Obj.searchTextColumnName = obj.column_name;
                                    //     }
                                    // }
                                    if (obj.session_column_flag) {
                                        if (obj.session_column_flag.indexOf('P') > -1) {
                                            if (sp_Obj.searchText) {
                                                if (obj.codeOfValue) {
                                                    sp_Obj.searchText = sp_Obj.searchText + "#" + obj.codeOfValue.split('#').join('~~');
                                                } else {
                                                    if (obj.value) {
                                                        sp_Obj.searchText = sp_Obj.searchText + "#" + obj.value.split('#').join('~~');
                                                    }

                                                }
                                            } else {
                                                if (obj.codeOfValue) {
                                                    sp_Obj.searchText = obj.codeOfValue.split('#').join('~~');
                                                } else {
                                                    if (obj.value) {
                                                        sp_Obj.searchText = obj.value.split('#').join('~~');
                                                    }

                                                }
                                            }
                                            if (sp_Obj.searchTextColumnName) {
                                                sp_Obj.searchTextColumnName = sp_Obj.searchTextColumnName + "#" + obj.column_name;
                                            } else {
                                                sp_Obj.searchTextColumnName = obj.column_name;
                                            }
                                        }
                                    }
                                })


                                if (sp_Obj.mandatory_to_start_portal === 'E') {

                                    dataServices.uploadEntry(fieldsData, l_appSeqNo, $scope.url, l_object.l_latitude,
                                            l_object.l_longitude, l_object.l_location, sp_Obj.type,
                                            sp_Obj.seqId, sp_Obj.dependent_next_entry_seq, sp_Obj.update_key, sp_Obj.update_key_value,
                                            sp_Obj.update_key_codeOfValue, l_base64VideoData, sqlFlag).then(function (data) {
                                        globalObjectServices.hideLoading();
                                        if (data.status == "insert data") {
                                            globalObjectServices.displayCordovaToast('Entry Saved Successfully.')
                                            sp_Obj.VRNO = data.vrno;
                                            addUpdateEntryServices.setSlno(1);
                                            $state.go('addPopulatedEntry', {obj: sp_Obj});
                                        } else {
                                            globalObjectServices.displayCordovaToast(data.status);
                                        }
                                        $scope.saveSql = data.sqlData;
                                        $scope.showSql($scope.saveSql);
                                    }, function (err) {
                                        globalObjectServices.hideLoading();
                                        globalObjectServices.displayErrorMessage(err)
                                    })

                                } else {
                                    if (sp_Obj.mandatory_to_start_portal === 'O') {
                                        var headOrderEntry = {};
                                        headOrderEntry.fieldsData = fieldsData;
                                        headOrderEntry.l_appSeqNo = l_appSeqNo;
                                        headOrderEntry.url = $scope.url;

                                        headOrderEntry.l_latitude = l_object.l_latitude;
                                        headOrderEntry.l_longitude = l_object.l_longitude;
                                        headOrderEntry.l_location = l_object.l_location;
                                        headOrderEntry.type = sp_Obj.type;
                                        headOrderEntry.seqId = sp_Obj.seqId;
                                        headOrderEntry.dependent_next_entry_seq = sp_Obj.dependent_next_entry_seq;
                                        headOrderEntry.update_key = sp_Obj.update_key;
                                        headOrderEntry.update_key_value = sp_Obj.update_key_value;
                                        headOrderEntry.update_key_codeOfValue = sp_Obj.update_key_codeOfValue;
                                        headOrderEntry.l_base64VideoData = sp_Obj.l_base64VideoData;

                                        sp_Obj.headOrderEntry = headOrderEntry;

                                        globalObjectServices.displayCordovaToast('Entry Saved Successfully.')
                                        addUpdateEntryServices.setSlno(1);
                                        $state.go('addPopulatedEntry', {obj: sp_Obj});

                                    } else {
                                        $state.go('addPopulatedEntry', {obj: sp_Obj});
                                    }
                                }




                                // $state.go('addPopulatedEntry', { obj: sp_Obj });

                            } else {
                                if (sp_Obj.mandatory_to_start_portal === 'O') {


                                    var headOrderEntry = {};
                                    headOrderEntry.fieldsData = fieldsData;
                                    headOrderEntry.l_appSeqNo = l_appSeqNo;
                                    headOrderEntry.url = $scope.url;

                                    headOrderEntry.l_latitude = l_object.l_latitude;
                                    headOrderEntry.l_longitude = l_object.l_longitude;
                                    headOrderEntry.l_location = l_object.l_location;
                                    headOrderEntry.type = sp_Obj.type;
                                    headOrderEntry.seqId = sp_Obj.seqId;
                                    headOrderEntry.dependent_next_entry_seq = sp_Obj.dependent_next_entry_seq;
                                    headOrderEntry.update_key = sp_Obj.update_key;
                                    headOrderEntry.update_key_value = sp_Obj.update_key_value;
                                    headOrderEntry.update_key_codeOfValue = sp_Obj.update_key_codeOfValue;
                                    headOrderEntry.l_base64VideoData = sp_Obj.l_base64VideoData;



                                    sp_Obj.headOrderEntry = headOrderEntry;


                                    globalObjectServices.displayCordovaToast('Entry Saved Successfully.')
                                    if (sp_Obj.access_contrl == 'D2') {
                                        $state.go('addUpdateOrderTable1', {obj: sp_Obj});
                                    } else if (sp_Obj.access_contrl == 'D3') {
                                        $state.go('addUpdateOrderTable2', {obj: sp_Obj});
                                    } else {
                                        $state.go('addUpdateOrder', {obj: sp_Obj});
                                    }

                                } else {
                                    if (sp_Obj.access_contrl == 'D2') {
                                        $state.go('addUpdateOrderTable1', {obj: sp_Obj});
                                    } else if (sp_Obj.access_contrl == 'D3') {
                                        $state.go('addUpdateOrderTable2', {obj: sp_Obj});
                                    } else {
                                        $state.go('addUpdateOrder', {obj: sp_Obj});
                                    }
                                }



                                // $state.go('addUpdateOrder', { obj: sp_Obj });
                            }


                            // if (sp_Obj.access_contrl == 'D2') {
                            //     $state.go('addUpdateOrderTable1', { obj: sp_Obj });
                            // } else if (sp_Obj.access_contrl == 'D3') {
                            //     $state.go('addUpdateOrderTable2', { obj: sp_Obj });
                            // } else if (sp_Obj.access_contrl == 'PO') {
                            //     // sp_Obj.access_contrl='PO';
                            //     sp_Obj.l_appSeqNo = l_appSeqNo;
                            //     sp_Obj.sessionvalue = session.sessionvalue;
                            //     // sp_Obj.firstScreen=firstScreen
                            //     fieldsData.forEach(function (obj) {
                            //         if (obj.session_column_flag == 'P') {
                            //             sp_Obj.searchText = obj.codeOfValue;
                            //             sp_Obj.searchTextColumnName = obj.column_name;
                            //         }
                            //     })

                            //     $state.go('addPopulatedEntry', { obj: sp_Obj });

                            // } else {
                            //     $state.go('addUpdateOrder', { obj: sp_Obj });
                            // }


                            globalObjectServices.hideLoading();
                            globalObjectServices.nativeTranstion("left");
                        } else {
                            if (sp_Obj.type == "EG") {
                                sp_Obj.searchText = "";
                                fieldsData.forEach(function (obj) {
                                    if (obj.session_column_flag) {
                                        if (obj.session_column_flag.indexOf('P') > -1) {
                                            if (sp_Obj.searchText) {
                                                if (obj.codeOfValue) {
                                                    sp_Obj.searchText = sp_Obj.searchText + "#" + obj.codeOfValue.split('#').join('~~');
                                                } else {
                                                    if (obj.value) {
                                                        sp_Obj.searchText = sp_Obj.searchText + "#" + obj.value.split('#').join('~~');
                                                    }
                                                }
                                            } else {
                                                if (obj.codeOfValue) {
                                                    sp_Obj.searchText = obj.codeOfValue.split('#').join('~~');
                                                } else {
                                                    if (obj.value) {
                                                        sp_Obj.searchText = obj.value.split('#').join('~~');
                                                    }
                                                }
                                            }
                                            if (sp_Obj.searchTextColumnName) {
                                                sp_Obj.searchTextColumnName = sp_Obj.searchTextColumnName + "#" + obj.column_name;
                                            } else {
                                                sp_Obj.searchTextColumnName = obj.column_name;
                                            }
                                        }
                                    }
                                })

                                if (sp_Obj.mandatory_to_start_portal === 'E') {

                                    dataServices.uploadEntry(fieldsData, l_appSeqNo, $scope.url, l_object.l_latitude,
                                            l_object.l_longitude, l_object.l_location, sp_Obj.type,
                                            sp_Obj.seqId, sp_Obj.dependent_next_entry_seq, sp_Obj.update_key, sp_Obj.update_key_value,
                                            sp_Obj.update_key_codeOfValue, l_base64VideoData, sqlFlag).then(function (data) {
                                        globalObjectServices.hideLoading();
                                        if (data.status == "insert data") {
                                            // if (data.vrno) {
                                            //     alert("VRNO : " + data.vrno);
                                            // }
                                            globalObjectServices.displayCordovaToast('Entry Saved Successfully.')
                                            sp_Obj.VRNO = data.vrno;
                                            addUpdateEntryServices.setSlno(1);
                                            $state.go('entryWithGrid', {obj: sp_Obj});

                                        } else {
                                            globalObjectServices.displayCordovaToast(data.status);
                                        }
                                        $scope.saveSql = data.sqlData;
                                        $scope.showSql($scope.saveSql);
                                    }, function (err) {
                                        globalObjectServices.hideLoading();
                                        globalObjectServices.displayErrorMessage(err)
                                    })


                                } else {
                                    if (sp_Obj.mandatory_to_start_portal === 'O') {
                                        var headOrderEntry = {};
                                        headOrderEntry.fieldsData = fieldsData;
                                        headOrderEntry.l_appSeqNo = l_appSeqNo;
                                        headOrderEntry.url = $scope.url;

                                        headOrderEntry.l_latitude = l_object.l_latitude;
                                        headOrderEntry.l_longitude = l_object.l_longitude;
                                        headOrderEntry.l_location = l_object.l_location;
                                        headOrderEntry.type = sp_Obj.type;
                                        headOrderEntry.seqId = sp_Obj.seqId;
                                        headOrderEntry.dependent_next_entry_seq = sp_Obj.dependent_next_entry_seq;
                                        headOrderEntry.update_key = sp_Obj.update_key;
                                        headOrderEntry.update_key_value = sp_Obj.update_key_value;
                                        headOrderEntry.update_key_codeOfValue = sp_Obj.update_key_codeOfValue;
                                        headOrderEntry.l_base64VideoData = sp_Obj.l_base64VideoData;

                                        sp_Obj.headOrderEntry = headOrderEntry;
                                        globalObjectServices.hideLoading();
                                        globalObjectServices.displayCordovaToast('Entry Saved Successfully.')
                                        addUpdateEntryServices.setSlno(1);
                                        $state.go('entryWithGrid', {obj: sp_Obj});

                                    } else {
                                        globalObjectServices.hideLoading();
                                        $state.go('entryWithGrid', {obj: sp_Obj});
                                    }
                                }

                            } else {

                                dataServices.uploadEntry(fieldsData, l_appSeqNo, $scope.url, l_object.l_latitude,
                                        l_object.l_longitude, l_object.l_location, sp_Obj.type,
                                        sp_Obj.seqId, sp_Obj.dependent_next_entry_seq, sp_Obj.update_key,
                                        sp_Obj.update_key_value, sp_Obj.update_key_codeOfValue, l_base64VideoData, sqlFlag).then(function (data) {
                                    globalObjectServices.hideLoading();
                                    if (data.status == "insert data") {
                                        // if (sp_Obj.type == "order") {
                                        //     $state.go('addUpdateOrder', { obj: sp_Obj });
                                        //     globalObjectServices.nativeTranstion("left");
                                        // } else {

                                        if (data.vrno) {
                                            globalObjectServices.alertPopup("VRNO : " + data.vrno);
                                        }
                                        globalObjectServices.displayCordovaToast('Entry Saved Successfully.')
                                        if (sp_Obj.duplicate_row_value_allow === 'R') {
                                            $state.reload();
                                            // $state.go($state.current, { obj: sp_Obj }, { reload: true });
                                        } else {
//                                            globalObjectServices.goBack(-1);
                                        }

                                        // }
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

                                            if (sp_Obj.types == 'Q' || sp_Obj.type == 'H') {
//                                                globalObjectServices.goBack(-1);
                                            } else if (sp_Obj.type == 'Update') {
                                                $scope.entryList();
                                            } else {

//                                                globalObjectServices.goBack(-2);
                                            }
                                        }
                                    } else {
                                        globalObjectServices.displayCordovaToast(data.status);
                                    }
                                    $scope.saveSql = data.sqlData;
                                    $scope.showSql($scope.saveSql);
                                }, function (err) {
                                    globalObjectServices.hideLoading();
                                    globalObjectServices.displayErrorMessage(err)
                                })
                            }
                        }
                    }
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
                    } else if (sp_Obj.access_contrl == 'PO' || sp_Obj.type == "orderPopulated") {
                        // sp_Obj.access_contrl='PO';
                        sp_Obj.l_appSeqNo = l_appSeqNo;
                        sp_Obj.sessionvalue = session.sessionvalue;
                        // sp_Obj.firstScreen=firstScreen
                        sp_Obj.searchText = "";
                        fieldsData.forEach(function (obj) {
                            // if (obj.session_column_flag) {
                            //     if (obj.session_column_flag.indexOf('P') > -1) {
                            //         sp_Obj.searchText = obj.codeOfValue;
                            //         sp_Obj.searchTextColumnName = obj.column_name;
                            //     }
                            // }

                            if (obj.session_column_flag) {
                                if (obj.session_column_flag.indexOf('P') > -1) {
                                    if (sp_Obj.searchText) {
                                        if (obj.codeOfValue) {
                                            sp_Obj.searchText = sp_Obj.searchText + "#" + obj.codeOfValue.split('#').join('~~');
                                        } else {
                                            if (obj.value) {
                                                sp_Obj.searchText = sp_Obj.searchText + "#" + obj.value.split('#').join('~~');
                                            }
                                        }
                                    } else {
                                        if (obj.codeOfValue) {
                                            sp_Obj.searchText = obj.codeOfValue.split('#').join('~~');
                                        } else {
                                            if (obj.value) {
                                                sp_Obj.searchText = obj.value.split('#').join('~~');
                                            }
                                        }
                                    }
                                    if (sp_Obj.searchTextColumnName) {
                                        sp_Obj.searchTextColumnName = sp_Obj.searchTextColumnName + "#" + obj.column_name;
                                    } else {
                                        sp_Obj.searchTextColumnName = obj.column_name;
                                    }
                                }
                            }
                        })

                        $state.go('addPopulatedEntry', {obj: sp_Obj});
                    } else {
                        dataServices.addEntryToLoacalDB(fieldsData, l_appSeqNo).then(function (data) {
                            globalObjectServices.hideLoading();
                            globalObjectServices.displayCordovaToast('Entry saved successfully.')
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

        // alert("IM A2");
    }

    $scope.cancelAddUpdateEntry = function () {
        globalObjectServices.confirmationPopup('Do you want to Cancel Entry?').then(function (data) {
            if (data == 'ok') {
                globalObjectServices.goBack(-1);
                if (sp_Obj.firstScreen == "PO" || sp_Obj.access_contrl == 'PO') {
                    // dataServices.deleteAllEntry(parseInt(l_appSeqNo)+0.2);
                    popOrderServ.deleteAllPopulatedEntry();
                }
            } else {
            }
        })
    }

    // document.addEventListener('backbutton', function (event) {
    //     $scope.cancelAddUpdateEntry();
    // });


    $scope.$on('$destroy', function () {

        //   alert("IM destroy");
        $scope.addEntryLOVModal.remove().then(function () {
            $scope.addEntryLOVModal = null;
        })
        $scope.signature_padModal.remove().then(function () {
            $scope.signature_padModal = null;
        })
        $scope.textAreaPopOverModal.remove().then(function () {
            $scope.textAreaPopOverModal = null;
        })
    });

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
        $scope.lov = "";
        $scope.column_desc = column_desc;
        $scope.column_name = column_name;
        $scope.flagLOVCodeValue = "";
        $scope.searchEntity.search = '';
        $scope.itemHelpPropertyFlag = item_help_property;

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

            $scope.lov = result.lov;
            $scope.lovHeading = result.lovHeading;
            $scope.alphabet = globalObjectServices.iterateAlphabet();
            $scope.sorted_users = result.sorted_users;
            $scope.flagLOVCodeValue = result.flagLOVCodeValue;
            if ($scope.lov == '' || $scope.lov == null) {

                globalObjectServices.displayCordovaToast('Data is not available..')
            } else {
                $scope.addEntryLOVModal.show();
                // globalObjectServices.scrollTop();
            }
            $scope.fields.forEach(function (data) {
                if (data.column_name == column_name) {
                    data.sqlData = result.sqlData;
                }
            })
            globalObjectServices.hideLoading();
        }, function (err) {
            globalObjectServices.hideLoading();
            globalObjectServices.displayErrorMessage(err)
        })
    }

    /* To set Lov Values */
    $scope.setLOVValues = function (code, name, column_desc, dependent_row, rowID, dependent_value) {
        $scope.fields = addUpdateEntryServices.setLOVValues(code, name, column_desc,
                dependent_row, rowID, $scope.fields, l_appSeqNo, sp_Obj.type, $scope.url, $scope.table_desc);
        $scope.dependent_nullable_logic(name, dependent_row, $scope.fields, $scope.url, l_appSeqNo, dependent_value);
        $scope.addEntryLOVModal.hide();
        // globalObjectServices.scrollTop();
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
                globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, column_name);
            }
        });

    }

    /* To Take Image */
    $scope.takeImage = function (column_name) {
        $scope.fields = addUpdateEntryServices.takeImage($scope.fields, column_name);
    }

    /* To Scan Barcode */
    $scope.scanBarcode = function (column_name) {
        //  $scope.fields = addUpdateEntryServices.scanBarcode($scope.fields, column_name, $scope.url, l_appSeqNo);
        // $scope.fields.forEach(function (data) {
        //   if (column_name == data.column_name) {
        // $scope.dependent_nullable_logic(data.column_name, data.dependent_row, $scope.fields, $scope.url, l_appSeqNo, data.dependent_value);
        //      $scope.dependent_nullable_logic(data.value, data.column_name, data.dependent_column_name, '')

        //  }
        //})

        addUpdateEntryServices.scanBarcode($scope.fields, column_name, $scope.url, l_appSeqNo, '', sp_Obj.table_desc).then(function (fields) {
            $scope.fields = fields;
            $scope.fields.forEach(function (data) {
                if (column_name == data.column_name) {
                    $scope.dependent_nullable_logic(data.value, data.column_name, data.dependent_column_name, '');
                }
            })

        })


    };

    $scope.showGridDetails = function (item) {
        console.log(item);
        addUpdateEntryServices.getGridDetails(item, $scope.url, l_appSeqNo, $scope.fields).then(function (data) {
            $scope.gridDetails = data;
            $scope.gridDetails.column_desc = item.column_desc;

            $ionicModal.fromTemplateUrl('templates/GridInfoDetails.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.gridDetailsModal = modal;
                $scope.gridDetailsModal.show();
            });
        }, function (fields) {
        })
    }

    /* To search values By Text */
    $scope.searchByText = function (column_name, value, dependent_column_name, query_dependent_row) {
        globalObjectServices.showLoading();
        if (dependent_column_name) {

            if (query_dependent_row) {
                var qdr = query_dependent_row.split('#');
                var qdr_value = qdr;
                $scope.fields.forEach(function (obj) {
                    if (qdr.indexOf(obj.column_name) > -1) {
                        if (obj.codeOfValue) {
                            qdr_value[qdr.indexOf(obj.column_name)] = obj.codeOfValue;
                        } else {
                            qdr_value[qdr.indexOf(obj.column_name)] = obj.value;
                        }
                        // qdr_value[qdr.indexOf(obj.column_name)] = obj.value;
                    }
                })
                value = qdr_value.join('~');
            }


            globalObjectServices.setselfDependantRowValue($scope.url, column_name, l_appSeqNo, value, $scope.fields).then(function (data) {
                globalObjectServices.hideLoading();
                if (data) {
                    var listDependentValue = data.listDependentValue;
                    listDependentValue.forEach(function (obj1) {
                        $scope.fields.forEach(function (obj) {
                            if (obj1.columnName == obj.column_name) {
                                obj.value = obj1.value;
                                globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, obj.column_name);
                            }
                            if (column_name == obj.column_name) {
                                obj.sqlData = data.sqlData;
                            }
                        })
                    })
                }

            });
        } else {
            globalObjectServices.hideLoading();
            $scope.fields = addUpdateEntryServices.searchByText($scope.fields, column_name, value, $scope.url, l_appSeqNo);
            globalObjectServices.setColumnDependentVal($scope.fields, $scope.url, l_appSeqNo, column_name);
        }

    };

    var trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    }

    /* Text OverLay on Image*/
    var TextOverlay = function (column_name, image) {
        $scope.fields = globalObjectServices.textOverlay(column_name, image, $scope.fields)
    }
})