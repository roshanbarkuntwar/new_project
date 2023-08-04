angular.module('starter.controllers')

        .service('addUpdateEntryServices', function ($q, $http, $rootScope, $ionicModal,
                $cordovaCapture, $cordovaGeolocation, pouchDBService, globalObjectServices,
                $cordovaBarcodeScanner, AuthServices, $cordovaCamera, $cordovaToast, $filter) {

            function setDataCommon(fields, vrno, sessionHB) {
                return $q(function (resolve, reject) {
                    var sessionColumn = [];
                    var id = "sessionColumn12";
                    pouchDBService.initDB();
                    pouchDBService.getObject(id).then(function (data) {
                        // console.log("session Data==="+JSON.stringify(data));
                        sessionColumn = data.data;
                        fields.forEach(function (obj2) {
                            sessionColumn.forEach(function (obj3) {
                                if (obj3.column_name == obj2.column_name) {
                                    obj2.value = obj3.value;
                                    obj2.codeOfValue = obj3.codeOfValue;
                                }
                            })
                        })
                        fields = setData(fields, vrno, sessionHB)
                        resolve(fields);
                    }, function (err) {
                        fields = setData(fields, vrno, sessionHB)
                        resolve(fields);
                    })
                })
            }

            function setData(fields, vrno, sessionHB) {
                var radioGroup = {};
                var column_catg_value = "";
                fields.forEach(function (obj1) {

                    if (sessionHB) {
                        if (sessionHB.length > -1) {
                            sessionHB.forEach(function (obj2) {
                                if (obj2.column_name == obj1.column_name) {
                                    obj1.value = obj2.value;
                                    obj1.codeOfValue = obj2.codeOfValue;
                                }
                            })
                        }
                    }



                    if (obj1.column_catg != null) {
                        if (column_catg_value == obj1.column_catg) {
                            obj1.flagForNewcolumn_catg_value = 1;
                        } else {
                            obj1.flagForNewcolumn_catg_value = 2;
                            column_catg_value = obj1.column_catg;
                        }
                    }
                    if (obj1.item_help_property == "H" || (obj1.item_help_property == "MD")) {
                        var dropdownVal = obj1.dropdownVal.split("#");
                        var temp1 = [];
                        dropdownVal.forEach(function (element) {
                            var temp2 = element.split("~");
                            temp1.push({name: temp2[1], code: temp2[0]});
                        })

                        obj1.dropdownVal = temp1;
                        if (obj1.value) {
                            temp1.forEach(function (obj) {
                                if (obj.name == obj1.value) {
                                    obj1.value = obj.code;
                                    obj1.codeOfValue = null;
                                }
                            })
                        }
                    }
                    if (obj1.item_help_property == "MT") {
                        var date = new Date();
                        var l_data = $filter('date')(date, 'dd-MM-yyyy HH:mm:ss')
                        obj1.value = l_data;
                    }
                    if (obj1.item_help_property == "D") {
                        obj1.dropdownVal = obj1.dropdownVal.split("#");
                    }
                    if (obj1.item_help_property == "AS") {
                        obj1.dropdownVal = obj1.dropdownVal.split("#");
                    }
                    if (obj1.column_type == "BARCODE") {
                        obj1.item_help_property = "B";
                    }
                    if (obj1.column_type == "VIDEO") {
                        obj1.item_help_property = "V";
                    }
                    if (obj1.column_type == "IMG" && obj1.item_help_property !== "S") {
                        obj1.item_help_property = "I"
                    }
                    if (obj1.column_type == "DATETIME" || obj1.data_type == "DATETIME") {
                        if (obj1.entry_by_user == 'R') {
                            obj1.item_help_property = "T"
                        } else {
                            obj1.item_help_property = "DT"
                            // var t = new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000));
                            // var f = new Date(new Date().getTime() + (-30 * 24 * 60 * 60 * 1000));
                            var t = new Date(new Date().getTime() + (obj1.to_value * 24 * 60 * 60 * 1000));
                            var f = new Date(new Date().getTime() + (obj1.from_value * 24 * 60 * 60 * 1000));
                            t = $filter('date')(t, "yyyy-MM-dd");
                            f = $filter('date')(f, "yyyy-MM-dd");
                            obj1.from_value = f;
                            obj1.to_value = t;
                        }
                    }
                    if (obj1.column_type == "DATE" || obj1.data_type == "DATE") {
                        if (obj1.entry_by_user == 'R') {
                            obj1.item_help_property = "T"
                        } else {
                            obj1.item_help_property = "C"
                            if (obj1.to_value) {
                                var t = new Date(new Date().getTime() + (parseInt(obj1.to_value) * 24 * 60 * 60 * 1000));
                            } else {
                                var t = new Date(new Date().getTime() + (0 * 24 * 60 * 60 * 1000));
                            }
                            if (obj1.from_value) {
                                var f = new Date(new Date().getTime() + (-parseInt(obj1.from_value) * 24 * 60 * 60 * 1000));
                            } else {
                                var f = new Date(new Date().getTime() + (0 * 24 * 60 * 60 * 1000));
                            }

                            t = $filter('date')(t, "yyyy-MM-dd");
                            f = $filter('date')(f, "yyyy-MM-dd");
                            obj1.from_value = f.toString;
                            obj1.to_value = t.toString;
                        }
                    }
                    if (obj1.column_type == "NUMBER" || obj1.data_type == "NUMBER") {
                        if (obj1.item_help_property !== "L") {
                            obj1.item_help_property = "N"
                        }

                    }
                    if (obj1.column_type == "BUTTON") {
                        obj1.item_help_property = "BT";
                        obj1.status = '';

                    }
                    if (obj1.dependent_row == null) {
                        obj1.excel_upload = ''; //variable "excel_upload" is used from web service generated JSON,to disable dependent controls 
                    } else {
                        obj1.excel_upload = 1;
                    }

                    if (obj1.column_type == "BUTTON") {
                        obj1.item_help_property = "BT";
                        obj1.status = '';

                    }
                    // if(obj1.item_help_property ="R"){
                    //     obj1.group.push(obj1);
                    //      radioGroup.push(obj1);
                    //     delete fields[obj1]; 
                    // }


                    if (obj1.column_name == "acc_code") {
                        if (!obj1.value) {
                            obj1.value = AuthServices.acc_code();
                        }
                    } else {
                        if (obj1.column_name == "div_code") {
                            if (!obj1.value) {
                                obj1.value = AuthServices.division_data();
                            }
                        } else {
                            if (vrno) {
                                if (obj1.column_desc == "VRNO") {
                                    obj1.value = vrno;
                                }
                            } else {
                                if (obj1.column_name == "entity_code" || obj1.column_name == "ENTITY_CODE") {
                                    obj1.value = AuthServices.entity_code();
                                }
                            }
                        }
                    }

                    if ((obj1.column_name == 'SERIES' || obj1.column_name == 'series')) {
                        if (obj1.column_default_value) {
                            if ((obj1.column_default_value.indexOf("USER_RIGHTS") > -1) && obj1.value == "") {
                                alert("You don't have rights of this Entry")
                            }
                        }
                    }
                })
                return fields;
            }

            // function dependent_nullable_logic(value, column_name, g_fields) {

            //     g_fields.forEach(function (obj1) {
            //         if (obj1.dependent_nulable_logic != null) {
            //             var l_dependent_nulable_logic = obj1.dependent_nulable_logic;
            //             var l_splitedValue = l_dependent_nulable_logic.split("~");
            //             var l_splitedValue1 = l_splitedValue[0].split("=");
            //             var l_splitedValue2 = l_splitedValue1[1].split("'").join('');
            //             var l_value = l_splitedValue2;
            //             obj1.tool_tip = "";
            //             if (l_splitedValue1[0] == column_name) {
            //                 if (l_value == value) {
            //                     obj1.nullable = 'F';
            //                     obj1.tool_tip = l_splitedValue[1];
            //                 } else {
            //                     obj1.nullable = 'T';
            //                     obj1.tool_tip = obj1.tool_tip;
            //                 }
            //             }
            //         }
            //     })
            //     return g_fields;
            // }

            function dependent_nullable_logic(value, column_name, g_fields, url, l_appSeqNo, dependent_value, flag) {
                return $q(function (resolve, reject) {
                    var query_dependent_row;

                    g_fields.forEach(function (obj1) {
                        if (obj1.dependent_nulable_logic != null) {
                            var l_dependent_nulable_logic = obj1.dependent_nulable_logic;
                            if ((l_dependent_nulable_logic).indexOf("~") > -1) {
                                var l_splitedValue = l_dependent_nulable_logic.split("~");
                                var l_splitedValue1 = l_splitedValue[0].split("=");
                                var l_splitedValue2 = l_splitedValue1[1].split("'").join('');
                                var l_value = l_splitedValue2;
                                obj1.tool_tip = "";
                                if (l_splitedValue1[0] == column_name) {
                                    if (l_value == value) {
                                        obj1.nullable = 'F';
                                        obj1.tool_tip = l_splitedValue[1];
                                    } else {
                                        obj1.nullable = 'T';
                                        obj1.tool_tip = obj1.tool_tip;
                                    }
                                }

                            } else {
                                if (((l_dependent_nulable_logic).indexOf("#") > -1) && (obj1.column_name == column_name)) {
                                    var l_splitedValue = l_dependent_nulable_logic.split("#");
                                    g_fields.forEach(function (obj2) {
                                        var i = 0;
                                        for (i = 0; i < l_splitedValue.length; i++) {
                                            if (l_splitedValue[i] == obj2.column_name) {
                                                obj2.value = "";
                                            }
                                        }
                                    })
                                }
                            }
                        }
                        if (obj1.column_name == column_name) {
                            query_dependent_row = obj1.query_dependent_row;
                        }
                    })

                    if (dependent_value && flag !== 'search') {

                        if (query_dependent_row) {
                            var qdr = query_dependent_row.split('#');
                            var qdr_value = qdr;
                            g_fields.forEach(function (obj) {
                                if (qdr.indexOf(obj.column_name) > -1) {
                                    if (obj.codeOfValue) {
                                        qdr_value[qdr.indexOf(obj.column_name)] = obj.codeOfValue;
                                    } else {
                                        qdr_value[qdr.indexOf(obj.column_name)] = obj.value;
                                    }

                                }
                            })

                            console.log(qdr);
                            console.log(qdr_value);
                            value = qdr_value.join('~');
                            console.log(value);

                        }

                        globalObjectServices.setselfDependantRowValue(url, column_name, l_appSeqNo, value, g_fields).then(function (data) {
                            if (data) {
                                var listDependentValue = data;
                                if (listDependentValue.length > 0) {
                                    listDependentValue.forEach(function (obj1) {
                                        g_fields.forEach(function (obj) {
                                            if (obj1.columnName == obj.column_name) {
                                                obj.value = obj1.value;
                                            }
                                            if (column_name == obj.column_name) {
                                                obj.sqlData = data.sqlData;
                                            }
                                        })
                                        // if (obj1.column_name == "PROCESS_CODE") {
                                        //     var msg = getProcessMsg(obj1.value);
                                        //     if (msg) {
                                        //         alert(msg);
                                        //     }
                                        // }
                                        if (obj1.columnName == "WO_VRNO") {
                                            if (obj1.value) {
                                            } else {
                                                alert("Balance not available in selected Job Card or Selected PROCESS doesn't match.")
                                            }
                                        }
                                    })
                                } else {
                                    if (column_name == "BalanceQty" || column_name == "JOBSHEET_VRNO") {

                                        if (AuthServices.entity_code().indexOf("RE") > -1 && $scope.table_desc == "Fabrication") {
                                            alert("Balance not available in selected Job Card or Selected PROCESS doesn't match or R.M. not issued.")
                                        } else {
                                            alert("Balance not available in selected Job Card or Selected PROCESS doesn't match.")
                                        }

                                        // alert("Balance not available in selected Job Card or Selected PROCESS doesn't match.")
                                    } else {
                                        console.log("data not available for column_name " + column_name)
                                    }
                                }
                            }
                            resolve(g_fields);
                        });
                    } else {
                        resolve(g_fields);
                    }
                })
            }

            function getFormData(fileds) {
                return $q(function (resolve, reject) {
                    $http.get(url + 'apptypelist?userCode=' + AuthServices.userCode()).success(function (data) {
                        resolve(data.appTypes);
                    }).error(function (data, status) {
                        reject(status)
                    })
                })
            }

            function takeImage(g_fields, column_name) {
                var options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 500,
                    targetHeight: 500,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false,
                    correctOrientation: true
                }
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    g_fields.forEach(function (obj) {
                        if (obj.column_name == column_name) {
                            obj.value = imageData;
                            obj.textOverLay = "T";
                        }
                    })
                },
                        function (err) { })
                return g_fields;
            }

            function scanBarcode(g_fields, column_name, url, l_appSeqNo, listOfEntry, table_desc) {
                return $q(function (resolve, reject) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        // var imageData = {};
                        // imageData.text = "JS17Y-23735"; //"JB17Y-54062"
                        // imageData.text = "JS17Y-09589";
                        // imageData.text = "JB17Y-83432";
                        // imageData.text = "JB17Y-83604";

                        // 83438 83432 83434
                        // alert("Scanned Data : " + imageData.text);
                        var arr = [];
                        if (listOfEntry) {
                            listOfEntry.forEach(function (obj) {
                                obj.forEach(function (obj1) {
                                    if (obj1.column_type == "BARCODE") {
                                        if (obj1.value) {
                                            arr.push(obj1.value);
                                        }
                                    }
                                })
                            })
                        }


                        if (arr.indexOf(imageData.text) < 0) {
                            g_fields.forEach(function (obj) {
                                if (obj.column_name == column_name) {
                                    obj.value = imageData.text;
                                }
                                if (obj.column_name == 'BUNDLE_STATUS') {
                                    if (obj.value != 'R') {
                                        obj.value = "R";
                                    } else {
                                    }
                                }
                                if (obj.dependent_row == column_name && imageData.text != null) {
                                    // obj.excel_upload = 0;
                                    // obj.value = "";
                                    // g_fields.forEach(function (obj1) {
                                    //     if (obj.column_name == obj1.dependent_row) {
                                    //         obj1.excel_upload = 1;
                                    //         /*variable "excel_upload" is used from web service generated JSON,to disable dependent controls */
                                    //         obj1.value = "";
                                    //     }
                                    // })
                                    if (obj.item_help_property == 'L') {
                                        obj.dependent_row_logic = imageData.text;
                                        obj.value = "";
                                        obj.codeOfValue = "";
                                    } else {
                                        g_fields = setDependantRowValue(obj.column_name, imageData.text, l_appSeqNo, column_name, "", g_fields, url);
                                    }
                                } else {
                                    if (obj.dependent_row) {
                                        if (obj.dependent_row.indexOf("#") > -1 && obj.dependent_row.indexOf(column_name) > -1) {
                                            var whereClauseValue = obj.dependent_row;
                                            var arr = obj.dependent_row.split('#');

                                            g_fields.forEach(function (data) {
                                                if (arr.indexOf(data.column_name) > -1) {
                                                    if (data.codeOfValue) {
                                                        whereClauseValue = whereClauseValue.replace(data.column_name, data.codeOfValue);
                                                    } else {
                                                        whereClauseValue = whereClauseValue.replace(data.column_name, data.value);
                                                    }
                                                }
                                            })
                                            g_fields = setDependantRowValue(obj.column_name, whereClauseValue, l_appSeqNo, column_name, "", g_fields, url, table_desc);
                                        }
                                    }
                                }

                            })
                        }

                        if (arr.indexOf(imageData.text) > -1) {
                            alert("This BARCODE(" + imageData.text + ") is already Scanned.");
                        }
                        // if (obj.column_name == 'BUNDLE_STATUS') {
                        //     if (obj.value != 'R') {
                        //         obj.value = "R";
                        //     } else {
                        //     }
                        // }
                        resolve(g_fields)
                    }, function (error) {
                        resolve(g_fields)
                    });
                })
                // return g_fields;
            }



            function searchByText(g_fields, column_name, textValue, url, l_appSeqNo, listOfEntry, table_desc) {
                // $cordovaBarcodeScanner.scan().then(function (imageData) {
                // var imageData = {};
                // imageData.text = "JB17Y-54052"; //"JB17Y-54062"
                // alert("Scanned Data : " + imageData.text);



                g_fields.forEach(function (obj) {
                    // if (obj.column_name == column_name) {
                    //     obj.value =textValue;
                    // }
                    // if (obj.column_name == 'BUNDLE_STATUS') {
                    //     if (obj.value != 'R') {
                    //         obj.value = "R";
                    //     } else {
                    //     }
                    // }
                    if (obj.dependent_row == column_name && textValue) {
                        // obj.excel_upload = 0;
                        // obj.value = "";
                        // g_fields.forEach(function (obj1) {
                        //     if (obj.column_name == obj1.dependent_row) {
                        //         obj1.excel_upload = 1;
                        //         /*variable "excel_upload" is used from web service generated JSON,to disable dependent controls */
                        //         obj1.value = "";
                        //     }
                        // })
                        if (obj.item_help_property == 'L') {
                            obj.dependent_row_logic = textValue;
                            obj.value = "";
                            obj.codeOfValue = "";
                        } else {
                            g_fields = setDependantRowValue(obj.column_name, textValue, l_appSeqNo, column_name, "", g_fields, url);
                        }
                    } else {
                        if (obj.dependent_row) {
                            if (obj.dependent_row.indexOf("#") > -1 && obj.dependent_row.indexOf(column_name) > -1) {
                                var whereClauseValue = obj.dependent_row;
                                var arr = obj.dependent_row.split('#');

                                g_fields.forEach(function (data) {
                                    if (arr.indexOf(data.column_name) > -1) {
                                        if (data.codeOfValue) {
                                            whereClauseValue = whereClauseValue.replace(data.column_name, data.codeOfValue);
                                        } else {
                                            whereClauseValue = whereClauseValue.replace(data.column_name, data.value);
                                        }
                                    }
                                })
                                g_fields = setDependantRowValue(obj.column_name, whereClauseValue, l_appSeqNo, column_name, "", g_fields, url, table_desc);
                            }
                        }
                    }

                })

                // }, function (error) { });
                return g_fields;
            }


            function setmultiLOVvalue(lov, column_desc, column_name, fields) {
                var lovCount = 0;

                fields.forEach(function (obj) {
                    if (obj.column_desc == column_desc) {
                        lov.forEach(function (obj1) {
                            if (obj1.checked) {
                                if (obj.value == '' || obj.value == null) {
                                    obj.value = obj1.name;
                                    obj.codeOfValue = obj1.code;
                                } else {
                                    obj.value = obj.value + ", " + obj1.name;
                                    obj.codeOfValue = obj.codeOfValue + ", " + obj1.code;
                                }
                                lovCount = lovCount + 1;
                            }
                        })
                        obj.itemSelected = lovCount;
                    }
                })
                // alert(lovCount);
                return fields;
            }

            function saveTextArea(textAreaValue, column_name, fields) {
                fields.forEach(function (temp) {
                    if (temp.column_name == column_name) {
                        temp.value = textAreaValue;
                    }
                })
                return fields;
            }


            function setDependantRowValue(column_name, name, l_appSeqNo, dependent_row, type, fields, s_url, table_desc) {
                // alert(column_name)
                if ($rootScope.online) {
                    // alert("on")
                    if (type == "offlineUpdateEntry") {
                    } else {

                        var url = s_url + 'dependantRowValue?forWhichcolmn=' + column_name + '&whereClauseValue=' +
                                encodeURIComponent(name) + '&uniquKey=' + l_appSeqNo;
                        console.log("url : " + url);
                        $http.get(url).success(function (data) {
                            if (data && data.value) {
                                var temp = data.value;
                                var tempCode = data.code;
                                var temp1 = true
                                var auto_calculation = "";
                                var equationOP = "";
                                fields.forEach(function (obj) {
                                    if (temp1) {
                                        if (obj.column_name == column_name) {
                                            obj.value = temp;
                                            obj.codeOfValue = tempCode;
                                            obj.sqlData = data.sqlData;
                                            temp1 = false;
                                            auto_calculation = obj.auto_calculation;
                                            equationOP = obj.equationOP;
                                        }
                                        // if (column_name == "CHECK_MARKNO" && table_desc == "Packing Entry") {
                                        //     if (temp.split("#")[0] === 'F') {
                                        //         obj.value = "";
                                        //         obj.codeOfValue = "";
                                        //     }
                                        // }
                                    }

                                    // if (column_name == obj.column_name) {
                                    //     if (obj.column_name == 'BUNDLE_STATUS') {
                                    //         if (obj.value == 'R') {
                                    //             obj.value = "";
                                    //             temFlag = "1";
                                    //             alert("This Barcode is already Scanned.");
                                    //         } else {
                                    //             obj.value = "R";
                                    //         }
                                    //     }
                                    // }

                                })
                                globalObjectServices.autoCalculation(column_name, fields)
                                globalObjectServices.setColumnDependentVal(fields, s_url, l_appSeqNo, column_name);
                                // $scope.autoCalculation(column_name);

                                // if (column_name == "PROCESS_CODE" && table_desc == "RFI (Ready for Inspection)") {
                                //     var msg = getProcessMsg(data.value);
                                //     if (msg) {
                                //         alert(msg);
                                //     }
                                // }

                                if (column_name == "COL6" && table_desc == "Bundle Image Entry" && parseInt(data.value) <= 0) {
                                    alert("All Bundle images are captured.");

                                }

                                // if (column_name == "CHECK_MARKNO" && table_desc == "Packing Entry") {
                                //     var msg = getCheckMarkNoMsg(data.value);
                                //     if (msg) {
                                //         alert(msg);
                                //     }
                                // }
                            } else {
                                if (column_name == "BalanceQty") {
                                    // alert("Balance not available in selected Job Card or Selected PROCESS doesn't match. Selected PROCESS doesn't match.");
                                    if (AuthServices.entity_code().indexOf("RE") > -1 && table_desc == "Fabrication") {
                                        alert("Balance not available in selected Job Card or Selected PROCESS doesn't match or R.M. not issued.")
                                    } else {
                                        alert("Balance not available in selected Job Card or Selected PROCESS doesn't match.")
                                    }


                                } else {
                                    console.log("data not available for column_name " + column_name)
                                }

                            }
                        }).error(function (data, status) {
                            // reject(status)
                            // $cordovaToast.show('Data is not available', 'long', 'center');
                        })
                    }
                } else {
                    // alert("off")
                    if (type == "offlineUpdateEntry") {

                    } else {
                        var temp = '';
                        var temp1 = true
                        var auto_calculation = "";
                        var equationOP = "";
                        fields.forEach(function (obj) {
                            if (temp1) {
                                if (obj.column_name == column_name) {
                                    obj.value = temp;
                                    temp1 = false;

                                    obj.nullable = 'T';
                                    if (obj.entry_by_user == 'R') {
                                        obj.entry_by_user = 'T';
                                    }

                                    auto_calculation = obj.auto_calculation;
                                    equationOP = obj.equationOP;
                                }
                            }
                        })
                        fields = globalObjectServices.autoCalculation(column_name, fields);
                        // $scope.autoCalculation(column_name);
                    }
                }

                return fields;
            }

            var noOfCallSE = 0;
            var responseSE = false;

            function setDependantRowValueSE(column_name, name, l_appSeqNo, dependent_row, type, fields, s_url, noOfCall) {
                if ($rootScope.online) {
                    // alert("on")
                    if (type == "offlineUpdateEntry") {
                    } else {
                        var url = s_url + 'dependantRowValue?forWhichcolmn=' + column_name + '&whereClauseValue=' +
                                encodeURIComponent(name) + '&uniquKey=' + l_appSeqNo;
                        console.log("url : " + url);
                        $http.get(url).success(function (data) {
                            noOfCallSE++;
                            if (data.value) {
                                responseSE = true;
                            }
                            var temp = data.value;
                            var tempCode = data.code;
                            var temp1 = true
                            var auto_calculation = "";
                            var equationOP = "";
                            fields.forEach(function (obj) {
                                if (temp1) {
                                    if (obj.column_name == column_name) {
                                        obj.value = temp;
                                        obj.codeOfValue = tempCode;
                                        temp1 = false;
                                        auto_calculation = obj.auto_calculation;
                                        equationOP = obj.equationOP;
                                    }
                                }
                            })
                            fields = globalObjectServices.autoCalculation(column_name, fields)
                            // $scope.autoCalculation(column_name);

                            if (noOfCallSE == noOfCall) {
                                if (!responseSE) {
                                    // alert("Data is not available");
                                    globalObjectServices.displayCordovaToast("Data not available for search entity...");
                                }
                                noOfCallSE = 0;
                                responseSE = false;

                            }


                        }).error(function (data, status) {
                            globalObjectServices.displayCordovaToast("Some Error occured...");
                        })
                    }
                }

                return fields;
            }

            function setLOVValues(code, name, column_desc, dependent_row, rowID, fields, l_appSeqNo, type, s_url, table_desc) {
                fields.forEach(function (obj) {
                    // if (obj.column_desc == column_desc) {
                    //     if (rowID == '') {
                    //         obj.value = name;
                    //         obj.codeOfValue = code;
                    //     } else {
                    //         obj.value = name;
                    //         obj.temp = rowID;
                    //     }
                    // }

                    if (obj.column_desc == column_desc || obj.para_desc == column_desc) {
                        if (rowID == '') {
                            if (name) {
                                obj.value = name;
                                obj.codeOfValue = code;
                            } else {
                                obj.value = code;
                                obj.codeOfValue = code;
                            }
                        } else {
                            obj.value = name;
                            obj.temp = rowID;
                        }
                    }

                    if (obj.dependent_row) {
                        if (obj.dependent_row.indexOf(dependent_row) > -1) {
                            if (obj.item_help_property == 'L') {
                                obj.dependent_row_logic = code;
                                obj.value = "";
                                obj.codeOfValue = "";
                            } else {
                                if (obj.item_help_property == 'AS') {
                                    setDataListValue(obj.column_name, code, l_appSeqNo, dependent_row, type, fields, s_url).then(function (f) {
                                        fields = f;
                                    });
                                } else {
                                    if (obj.dependent_row.indexOf(dependent_row) > -1) {
                                        var whereClauseValue = obj.dependent_row;
                                        var arr = obj.dependent_row.split('#');

                                        fields.forEach(function (data) {
                                            if (arr.indexOf(data.column_name) > -1) {
                                                if (data.codeOfValue) {
                                                    whereClauseValue = whereClauseValue.replace(data.column_name, data.codeOfValue);
                                                } else {
                                                    whereClauseValue = whereClauseValue.replace(data.column_name, data.value);
                                                }
                                            }
                                        })
                                        fields = setDependantRowValue(obj.column_name, whereClauseValue, l_appSeqNo, dependent_row, "", fields, s_url, table_desc);

                                    }

                                    // if (code) {
                                    //     fields = setDependantRowValue(obj.column_name, code, l_appSeqNo, dependent_row, type, fields, s_url);
                                    // } else {
                                    if (!name && !code) {
                                        //     fields = setDependantRowValue(obj.column_name, name, l_appSeqNo, dependent_row, type, fields, s_url);
                                        // } else {
                                        obj.value = "";
                                        obj.codeOfValue = "";
                                    }
                                    // }
                                }
                            }
                        }
                    }
                });
                return fields;
            }

            function dependent_lov(dependent_row, value, fields) {
                fields.forEach(function (obj) {
                    if (dependent_row) {
                        if (obj.dependent_row == dependent_row) {
                            if (obj.item_help_property == 'L') {
                                obj.dependent_row_logic = value;
                                obj.value = "";
                                obj.codeOfValue = "";
                            }
                        }
                    }
                });
                return fields;
            }



            function setDataListValue(column_name, whereClauseValue, l_appSeqNo, dependent_row, type, fields,
                    l_url) {
                var l_data = [];

                var url = l_url + 'getLOVDyanamically?uniqueID=' + l_appSeqNo + '&whereClauseValue=' +
                        encodeURIComponent(whereClauseValue) + '&forWhichColmn=' + column_name + "&userCode=" + AuthServices.userCode();


                if ($rootScope.online) {
                    return $q(function (resolve, reject) {
                        console.log(url);
                        if (url) {
                            globalObjectServices.showLoading();
                            $http.get(url).success(function (data) {
                                globalObjectServices.hideLoading();
                                fields.forEach(function (obj) {
                                    if (obj.dependent_row == dependent_row) {
                                        obj.dropdownVal = [];
                                        data.locationList.forEach(function (obj1) {
                                            obj.dropdownVal.push(obj1.name);
                                        })
                                        // obj.dropdownVal = data.locationList;
                                    }
                                })
                                // return fields;
                                resolve(fields)
                            }).error(function (data, status) {
                                globalObjectServices.hideLoading();
                                // return fields;
                                resolve(fields);
                            })
                        }
                    })
                }

            }

            function getLatLangTimeStamp() {
                var l_object = [];
                var l_latitude = '';
                var l_longitude = '';
                var l_location = '';
                var posOptions = {timeout: 5000, enableHighAccuracy: false};
                var l_dateTime = "";
                return $q(function (resolve, reject) {
                    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                        l_latitude = position.coords.latitude;
                        l_longitude = position.coords.longitude;
                        var d = new Date(position.timestamp);
                        var hours = d.getHours(),
                                minutes = d.getMinutes(),
                                seconds = d.getSeconds(),
                                month = d.getMonth() + 1,
                                day = d.getDate(),
                                year = d.getFullYear() % 100;

                        function pad(d) {
                            return (d < 10 ? "0" : "") + d;
                        }
                        l_dateTime = pad(month) + "-" +
                                pad(day) + "-" +
                                pad(year) + " " +
                                pad(hours) + ":" +
                                pad(minutes) + ":" +
                                pad(seconds);
                        l_object.l_dateTime = l_dateTime.toString();
                        l_object.l_latitude = l_latitude;
                        l_object.l_longitude = l_longitude;

                        var l_latlng = new google.maps.LatLng(l_latitude, l_longitude);
                        var l_geocoder = geocoder = new google.maps.Geocoder();
                        l_geocoder.geocode({'latLng': l_latlng}, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[1]) {
                                    l_location = results[1].formatted_address;
                                    l_object.l_location = l_location;
                                    resolve(l_object);
                                }
                            }
                        });
                    }, function (err) {
                        // $cordovaToast.show('Unable to get Location...', 'long', 'bottom');
                    });
                })
            }



            function openLov(column_desc, column_name, dependent_row, dependent_row_logic,
                    item_help_property, l_lov, l_url, l_appSeqNo, summaryReport) {
                var l_data = [];

                if (dependent_row == null) {
                    var url = l_url + 'getLOVDyanamically?uniqueID=' + l_appSeqNo + '&forWhichColmn=' + column_name + "&userCode=" + AuthServices.userCode();
                    ;
                    var id = l_appSeqNo + column_name;
                } else {
                    if (dependent_row_logic == "=" || dependent_row_logic == "null") {
                        globalObjectServices.hideLoading();
                        globalObjectServices.displayCordovaToast('Please select above dependent value')
                        // $cordovaToast.show('Data is not available', 'long', 'center');
                    } else {
                        var url = l_url + 'getLOVDyanamically?uniqueID=' + l_appSeqNo + '&whereClauseValue=' +
                                encodeURIComponent(dependent_row_logic) + '&forWhichColmn=' + column_name + "&userCode=" + AuthServices.userCode();
                        var id = l_appSeqNo + column_name + dependent_row_logic;
                    }
                }
                if (summaryReport) {
                    if (dependent_row == null) {
                        var url = l_url + 'getReportFilterLOV?uniqueID=' + l_appSeqNo + '&forWhichColmn=' + column_name + "&userCode=" + AuthServices.userCode();
                        ;
                        var id = l_appSeqNo + column_name;
                    } else {
                        if (dependent_row_logic == "=" || dependent_row_logic == "null") {
                            globalObjectServices.hideLoading();
                            globalObjectServices.displayCordovaToast('Please select above dependent value')
                            // $cordovaToast.show('Data is not available', 'long', 'center');
                        } else {
                            var url = l_url + 'getReportFilterLOV?uniqueID=' + l_appSeqNo + '&whereClauseValue=' +
                                    dependent_row_logic + '&forWhichColmn=' + column_name + "&userCode=" + AuthServices.userCode();
                            var id = l_appSeqNo + column_name + dependent_row_logic;
                        }
                    }
                }

                if ($rootScope.online) {
                    return $q(function (resolve, reject) {
                        console.log(url);
                        if (url) {
                            globalObjectServices.showLoading();
                            $http.get(url).success(function (data) {
                                globalObjectServices.hideLoading();
                                l_lov = data.locationList

                                if (l_lov == '') {
                                    resolve(l_lov);
                                } else {
                                    l_data = setLov(l_lov);
                                    l_data.lovHeading = data.lovHeading;
                                    l_data.sqlData=data.sqlData;
                                    resolve(l_data);
                                }
                            }).error(function (data, status) {
                                globalObjectServices.hideLoading();
                                reject(status)
                            })
                        }
                    })
                } else {
                    return $q(function (resolve, reject) {
                        pouchDBService.getObject("lov" + id).then(function (data) {
                            l_lov = data.lov;
                            if (l_lov == '') {
                                $cordovaToast.show('Data is not available', 'long', 'center');
                            } else {
                                l_data = setLov(l_lov);
                            }
                            globalObjectServices.hideLoading();
                            resolve(l_data);
                        }, function (err) {
                            globalObjectServices.hideLoading();
                            reject('error')
                        })
                    })
                }
            }

            function setLov(l_lov) {
                var l_lovToSearch = l_lov;
                var l_data = [];
                var flagLOVCodeValue = "";
                l_lov.forEach(function (obj) {
                    if (obj.rowId != "") {
                        obj.code = '';
                        flagLOVCodeValue = "Empty";
                    }
                    if (obj.code == obj.name) {
                        flagLOVCodeValue = "Empty";
                    }
                })

                // globalObjectServices.scrollTop();
                var l_tempSortedLov = {};
                for (i = 0; i < l_lovToSearch.length; i++) {
                    if (l_lovToSearch[i].name) {
                        var letter = l_lovToSearch[i].name.toUpperCase().charAt(0);
                    } else {
                        if (l_lovToSearch[i].code) {
                            var letter = l_lovToSearch[i].code.toUpperCase().charAt(0);
                        }
                    }
                    if (l_tempSortedLov[letter] == undefined) {
                        l_tempSortedLov[letter] = []
                    }
                    l_tempSortedLov[letter].push(l_lovToSearch[i]);
                }
                l_data.sorted_users = l_tempSortedLov;
                l_data.lov = l_lov;
                l_data.flagLOVCodeValue = flagLOVCodeValue;
                return l_data;
            }




            var operator = {
                '+': function (a, b) {
                    return a + b
                },
                '-': function (a, b) {
                    return a - b
                },
                '*': function (a, b) {
                    return a * b
                },
                '/': function (a, b) {
                    return a / b
                },
                '<': function (a, b) {
                    return a < b
                },
                '>': function (a, b) {
                    return a > b
                },
                '<=': function (a, b) {
                    return a <= b
                },
                '>=': function (a, b) {
                    return a >= b
                }
            };

            var process = {
                T: function () {
                    return "PAINTED"
                },
                Z: function () {
                    return "RFG INSPECTION"
                },
                E: function () {
                    return "RE-PUNCHING"
                },
                C: function () {
                    return "CUTTING"
                },
                P: function () {
                    return "PUNCHING"
                },
                N: function () {
                    return "NOTCHING"
                },
                G: function () {
                    return "GALVANIZING"
                },
                H: function () {
                    return "HEEL GRINDING"
                },
                D: function () {
                    return "DRILLING"
                },
                W: function () {
                    return "WELDING"
                },
                B: function () {
                    return "BEND"
                },
                A: function () {
                    return "ANGLE FABRICATION"
                },
                R: function () {
                    return "PLATE FABRICATION"
                },
                S: function () {
                    return "STAMPING"
                },
                0: function () {
                    return "BUNDLING"
                },
                L: function () {
                    return "H/O TO GALVANISING"
                },
                F: function () {
                    return "CUTTING, PUNCHING STAMPING"
                },
                M: function () {
                    return "PROTO FAB.ASSEBLING & DIS."
                },
                Y: function () {
                    return "CLEAT FABRICATION"
                },
                I: function () {
                    return "GAS CUTTING"
                },
                O: function () {
                    return "SPECIAL GALVANISING COATING"
                },
                Q: function () {
                    return "PUNCHING,STAMPING"
                },
                K: function () {
                    return "SHEARING"
                },
            }

            function getProcessMsg(process_code) {
                var process_code_status = process_code.split("#")[0];
                var process_code1 = process_code.split("#")[1];
                // alert(process_code1 + "  ----  " + process_code);
                var msg;
                if (process_code_status === 'F') {
                    var arr = process_code1.split("");
                    for (var i = 0; i < arr.length; i++) {
                        if (msg) {
                            msg = msg + ", '" + process[(arr[i])]() + "' ";
                        } else {
                            msg = "'" + process[(arr[i])]() + "'";
                        }
                    }
                    // console.log(msg);
                    msg = msg.replace(/.$/, "") + " process are not done for this job Card"
                }
                return msg;

            }

            function getCheckMarkNoMsg(checkMarkno) {
                var checkMarkno_status = checkMarkno.split("#")[0];
                var checkMarknoMsg = checkMarkno.split("#")[1];
                // alert(process_code1 + "  ----  " + process_code);
                var msg;
                if (checkMarkno_status === 'F') {

                    // console.log(msg);
                    msg = checkMarknoMsg;
                }
                return msg;

            }




            function getGridDetails(item, url, l_appSeqNo, fields) {
                return $q(function (resolve, reject) {


                    var value = item.value;

                    if (item.query_dependent_row) {
                        var qdr = item.query_dependent_row.split('#');
                        var qdr_value = qdr;
                        fields.forEach(function (obj) {
                            if (qdr.indexOf(obj.column_name) > -1) {
                                if (obj.codeOfValue) {
                                    qdr_value[qdr.indexOf(obj.column_name)] = obj.codeOfValue;
                                } else {
                                    qdr_value[qdr.indexOf(obj.column_name)] = obj.value;
                                }

                            }
                        })
                        console.log(qdr);
                        console.log(qdr_value);
                        value = qdr_value.join('~');
                        console.log(value);

                    }


                    var l_url = url + 'getDetailInformation?forWhichcolmn=' + item.column_name + '&uniquKey=' + l_appSeqNo + '&whereClauseValue=' + encodeURIComponent(value);
                    console.log(l_url)

                    $http.get(l_url).success(function (data) {
                        console.log(data.defaultPopulateData);
                        var result = {};
                        result.message = data.message;
                        result.status = data.status;
                        var head = [];
                        var row = [];
                        if (data.defaultPopulateData) {
                            angular.forEach(data.defaultPopulateData, function (value, key) {
                                head.push(key);
                                row.push(value)
                            });
                        }

                        result.dropdownVal = {};
                        result.dropdownVal.rows = globalObjectServices.transpose(row);
                        result.dropdownVal.headers = head;
                        resolve(result);
                    }).error(function (data, status) {
                        reject(status)
                    })
                })
            }





            /* Delete Entry */


            function deleteEntry(l_seqId, seqNo, url) {
                return $q(function (resolve, reject) {
                    console.log(url + 'deleteEntry?seqId=' + l_seqId + '&seqNo=' + seqNo);
                    $http.get(url + 'deleteEntry?seqId=' + l_seqId + '&seqNo=' + seqNo).success(function (data) {
                        resolve('success')
                    }).error(function (data, status) {
                        reject(status)
                    })
                })
            }

            var slno = 0;
            function setSlno(no) {
                slno = no
            }
            function getSlno() {
                slno = slno + 1;
                return slno;
            }

            return {
                getGridDetails: getGridDetails,
                setDataCommon: setDataCommon,
                dependent_nullable_logic: dependent_nullable_logic,
                takeImage: takeImage,
                scanBarcode: scanBarcode,
                searchByText: searchByText,
                setmultiLOVvalue: setmultiLOVvalue,
                saveTextArea: saveTextArea,
                setDependantRowValue: setDependantRowValue,
                setDependantRowValueSE: setDependantRowValueSE,
                setLOVValues: setLOVValues,
                dependent_lov: dependent_lov,
                getLatLangTimeStamp: getLatLangTimeStamp,
                openLov: openLov,
                setLov: setLov,
                deleteEntry: deleteEntry,
                setSlno: setSlno,
                getSlno: getSlno,
                getProcessMsg: getProcessMsg
            }
        })