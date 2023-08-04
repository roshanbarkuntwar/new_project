angular.module('starter.controllers')

        .service('addUpdateEntryServices', function ($q, $http, $rootScope, $ionicModal,
                $cordovaCapture, $cordovaGeolocation, pouchDBService, globalObjectServices,
                $cordovaBarcodeScanner, AuthServices, $cordovaCamera, $cordovaToast, $filter) {

            function setDataCommon(fields) {
                var column_catg_value = "";
                var sessionColumn = [];
                var id = "sessionColumn";
                pouchDBService.getObject(id).then(function (data) {
                    sessionColumn = data.sessionColumn;
                    fields.forEach(function (obj2) {
                        sessionColumn.forEach(function (obj3) {
                            if (obj3.column_name == obj2.column_name) {
                                obj2.value = obj3.value;
                                obj2.codeOfValue = obj3.codeOfValue;
                            }
                        })
                    })
                }, function (err) {})
                fields.forEach(function (obj1) {
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
                    if (obj1.column_type == "BARCODE") {
                        obj1.item_help_property = "B";
                    }
                    if (obj1.column_type == "VIDEO") {
                        obj1.item_help_property = "V";
                    }
                    if (obj1.column_type == "IMG") {
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
                            obj1.from_value = f;
                            obj1.to_value = t;
                        }
                    }
                    if (obj1.column_type == "NUMBER" || obj1.data_type == "NUMBER") {
                        obj1.item_help_property = "N"
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
                })
                return fields;
            }

            function dependent_nullable_logic(value, column_name, g_fields) {

                g_fields.forEach(function (obj1) {
                    if (obj1.dependent_nulable_logic != null) {
                        var l_dependent_nulable_logic = obj1.dependent_nulable_logic;
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
                    }
                })
                return g_fields;
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
                    saveToPhotoAlbum: false
                }
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    g_fields.forEach(function (obj) {
                        if (obj.column_name == column_name) {
                            obj.value = imageData
                        }
                    })
                },
                        function (err) {})
                return g_fields;
            }

            function scanBarcode(g_fields, column_name) {
                $cordovaBarcodeScanner.scan().then(function (imageData) {
                    alert("Scanned Data : " + imageData.text);
                    g_fields.forEach(function (obj) {
                        if (obj.column_name == column_name) {
                            obj.value = imageData.text;
                        }
                        if (obj.dependent_row == column_name && imageData.text != null) {
                            obj.excel_upload = 0;
                            obj.value = "";
                            g_fields.forEach(function (obj1) {
                                if (obj.column_name == obj1.dependent_row) {
                                    obj1.excel_upload = 1;
                                    /*variable "excel_upload" is used from web service generated JSON,to disable dependent controls */
                                    obj1.value = "";
                                }
                            })
                        } else {
                        }
                    })
                }, function (error) {});
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


            function setDependantRowValue(column_name, name, l_appSeqNo, dependent_row, type, fields, s_url) {
                if ($rootScope.online) {
                    // alert("on")
                    if (type == "offlineUpdateEntry") {
                    } else {
                        var url = s_url + 'dependantRowValue?forWhichcolmn=' + column_name + '&whereClauseValue=' +
                                name + '&uniquKey=' + l_appSeqNo;
                        $http.get(url).success(function (data) {
                            var temp = data.value;
                            var temp1 = true
                            var auto_calculation = "";
                            var equationOP = "";
                            fields.forEach(function (obj) {
                                if (temp1) {
                                    if (obj.column_name == column_name) {
                                        obj.value = temp;
                                        temp1 = false;
                                        auto_calculation = obj.auto_calculation;
                                        equationOP = obj.equationOP;
                                    }
                                }
                            })
                            fields = globalObjectServices.autoCalculation(column_name, fields)
                            // $scope.autoCalculation(column_name);
                        }).error(function (data, status) {
                            reject(status)
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
                                    obj.entry_by_user = 'T';
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

            function setLOVValues(code, name, column_desc, dependent_row, rowID, fields, l_appSeqNo, type, s_url) {
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

                    if (obj.dependent_row == dependent_row) {
                        if (obj.item_help_property == 'L') {
                            obj.dependent_row_logic = code;
                            obj.value = "";
                            obj.codeOfValue = "";
                        } else {
                            fields = setDependantRowValue(obj.column_name, code, l_appSeqNo, dependent_row, type, fields, s_url);
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
                        l_object.l_dateTime = l_dateTime;
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
                        $cordovaToast.show('Unable to get Location...', 'long', 'bottom');
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
                                dependent_row_logic + '&forWhichColmn=' + column_name + "&userCode=" + AuthServices.userCode();
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
                        // console.log(url);
                        if (url) {
                            $http.get(url).success(function (data) {
                                globalObjectServices.hideLoading();
                                l_lov = data.locationList
                                if (l_lov == '') {
                                    resolve(l_lov);
                                } else {
                                    l_data = setLov(l_lov);
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
                                globalObjectServices.hideLoading();
                                $cordovaToast.show('Data is not available', 'long', 'center');
                            } else {
                                l_data = setLov(l_lov);
                            }
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
                })

                globalObjectServices.scrollTop();
                var l_tempSortedLov = {};
                for (i = 0; i < l_lovToSearch.length; i++) {
                    if (l_lovToSearch[i].name) {
                        var letter = l_lovToSearch[i].name.toUpperCase().charAt(0);
                    } else {
                        var letter = l_lovToSearch[i].code.toUpperCase().charAt(0);
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



            /* Delete Entry */


            function deleteEntry(l_seqId, seqNo, url) {
                return $q(function (resolve, reject) {
                    $http.get(url + 'deleteEntry?seqId=' + l_seqId + '&seqNo=' + seqNo).success(function (data) {
                        resolve('success')
                    }).error(function (data, status) {
                        reject(status)
                    })
                })
            }

            return {
                setDataCommon: setDataCommon,
                dependent_nullable_logic: dependent_nullable_logic,
                takeImage: takeImage,
                scanBarcode: scanBarcode,
                setmultiLOVvalue: setmultiLOVvalue,
                saveTextArea: saveTextArea,
                setDependantRowValue: setDependantRowValue,
                setLOVValues: setLOVValues,
                dependent_lov: dependent_lov,
                getLatLangTimeStamp: getLatLangTimeStamp,
                openLov: openLov,
                setLov: setLov,
                deleteEntry: deleteEntry
            }
        })