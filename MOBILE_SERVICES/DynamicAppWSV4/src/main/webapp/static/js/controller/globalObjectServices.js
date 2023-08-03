angular.module('starter.controllers')
        .service('globalObjectServices', function ($q, $rootScope, AuthServices,
                $ionicHistory, $cordovaToast, $location, $ionicPopup, $ionicScrollDelegate, $cordovaLocalNotification, $http,
                $cordovaGeolocation, $ionicLoading, pouchDBService) {

            //Common Functions

            /* Auto Calculation */
            var operators = ["+", "-", "*", "/", "(", ")", "^"];

            function isOperator(value) {
                if (value) {
                    if (operators.indexOf(value) > -1) {
                        return true;
                    }
                }
                return false;
            }

            var operator = {
                '+': function (a, b) {
                    return a + b
                },
                '<': function (a, b) {
                    return a < b
                },
                '>': function (a, b) {
                    return a > b
                },
                '-': function (a, b) {
                    return a - b
                },
                '*': function (a, b) {
                    return a * b
                },
                '/': function (a, b) {
                    return a / b
                }
            };

            function autoCalculation(column_name, fields) {
                var formula = [];
                var resutl = '';
                fields.forEach(function (obj2) {
                    if (obj2.auto_calculation) {
                        if ((obj2.auto_calculation.indexOf(column_name)) > -1) {
                            var arr = obj2.auto_calculation.split("#")
                            for (var i = 0; i < arr.length; i++) {
                                if (!isOperator(arr[i]) && arr[i] !== '') {
                                    fields.forEach(function (obj) {
                                        if (obj.column_name == arr[i]) {
                                            formula[i] = obj.value
                                        }
                                    })
                                } else {
                                    if (arr[i] !== '') {
                                        formula[i] = arr[i];
                                    }
                                }
                            }

                            // for (var j = 0; j < formula.length; j++) {
                            //     if (isOperator(formula[j])) {
                            //         resutl = operator[(formula[j])](parseFloat(formula[(j - 1)]), parseFloat(formula[(j + 1)]));
                            //         formula[(j + 1)] = resutl;
                            //         j = j + 1;
                            //     }
                            // }

                            var subRes = ""
                            for (var l = 0; l < formula.length; l++) {
                                if (formula[l] == "/" || formula[l] == "*") {
                                    subRes = operator[(formula[l])](parseFloat(formula[(l - 1)]), parseFloat(formula[(l + 1)]));
                                    formula[(l - 1)] = subRes;
                                    formula.splice(l, 1)
                                    formula.splice(l, 1)
                                }
                            }
                            if (formula.length > 0) {
                                if (formula.length == 1) {
                                    resutl = formula[0];
                                } else {
                                    for (var j = 0; j < formula.length; j++) {
                                        if (isOperator(formula[j])) {
                                            resutl = operator[(formula[j])](parseFloat(formula[(j - 1)]), parseFloat(formula[(j + 1)]));
                                            formula[(j + 1)] = resutl;
                                            j = j + 1;
                                        }
                                    }
                                }
                            }

                            fields.forEach(function (obj1) {
                                if (obj1.column_name == obj2.column_name) {
                                    // obj1.value = resutl;
                                    var factor = "1" + Array(+(parseInt(obj1.decimal_digit) > 0 &&
                                            parseInt(obj1.decimal_digit) + 1)).join("0");
                                    obj1.value = Math.round(resutl * factor) / factor;
                                    fields.forEach(function (obj3) {
                                        if (obj3.auto_calculation) {
                                            if ((obj3.auto_calculation.indexOf(obj1.column_name)) > -1) {
                                                autoCalculation(obj1.column_name, fields)
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
                return fields;
            }

            /* AutoCalculation */

            /* Row Wise Auto calculation */
            function rowWiseAutoCalculation(auto_calculation, equationOP, tableData, seqId, recordsInfo, g_tableData) {
                var formula = [];
                var resutl = '';
                var l_temp = [];
                var l_valueForEachRow = [];
                var l_tableData = [];
                var j = 0;
                var l_seqId = "";

                tableData.forEach(function (obj1) {
                    l_seqId = (obj1.length) - 1;
                    if (obj1[l_seqId] == seqId) {
                        l_tableData.push(obj1);
                    }
                })

                l_tableData.forEach(function (obj1) {
                    recordsInfo.forEach(function (obj) {
                        if (obj.entry_by_user == "T" || obj.entry_by_user == "R" && obj.entry_by_user !== '') {
                            obj.value = obj1[j];
                            j++;
                        }
                    })
                })

                if (auto_calculation) {
                    var arr = auto_calculation.split("#")
                    for (var i = 0; i < arr.length; i++) {
                        if (!isOperator(arr[i]) && arr[i] !== '') {
                            recordsInfo.forEach(function (obj) {
                                if (obj.column_name == arr[i]) {
                                    formula[i] = obj.value
                                }
                            })
                        } else {
                            if (arr[i] !== '') {
                                formula[i] = arr[i];
                            }
                        }
                    }

                    for (var j = 0; j < formula.length; j++) {
                        if (isOperator(formula[j])) {
                            resutl = operator[(formula[j])](parseFloat(formula[(j - 1)]), parseFloat(formula[(j + 1)]));
                            formula[(j + 1)] = resutl;
                            j = j + 1;
                        }
                    }

                    var k = 0;
                    if (resutl) {
                        g_tableData.forEach(function (obj1) {
                            if (obj1[l_seqId] == seqId) {
                                angular.forEach(recordsInfo, function (value1, key1) {
                                    if (value1.entry_by_user == "T" || value1.entry_by_user == "R" &&
                                            value1.entry_by_user !== '') {
                                        k++;
                                        if (value1.column_name == equationOP) {
                                            // var l_key = (k - 1);
                                            var l_key = (k - 1);
                                            var factor = "1" + Array(+(parseInt(value1.decimal_digit) > 0 &&
                                                    parseInt(value1.decimal_digit) + 1)).join("0");
                                            obj1[l_key] = Math.round(resutl * factor) / factor;
                                            // obj1[l_key] = resutl;
                                        }
                                    }
                                })
                            }
                        })
                    }

                }
                return g_tableData;
            }

            /* Row Wise Auto calculation */

            /* Serch LOV by Alphabet */
            function searchLovbyAlpha(id) {
                $location.hash(id);
                $ionicScrollDelegate.anchorScroll();
            }
            /* Serch LOV by Alphabet */

            /* Iterate Alphabet */

            function iterateAlphabet() {
                var str = "(123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                var numbers = new Array();
                for (var i = 0; i < str.length; i++) {
                    var nextChar = str.charAt(i);
                    numbers.push(nextChar);
                }
                return numbers;
            }
            /* Iterate Alphabet */

            /* Show Loading */
            function showLoading() {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: false,
                    maxWidth: 200,
                    showDelay: 0
                })
            }

            function hideLoading() {
                $ionicLoading.hide();
            }

            /* Show Loading */

            /* Trust Src */
            function trustSrc() {
                return $sce.trustAsResourceUrl(src);
            }
            /* Trust Src */

            /* Go Back to previous Page */
            function goBack(value) {
                $ionicHistory.goBack(value);
                nativeTranstion("down");
            }
            /* Go Back to previous Page */

            /* Transpose Array */
            function transpose(temp) {
                var tempLength = temp.length ? temp.length : 0,
                        arrLength = temp[0] instanceof Array ? temp[0].length : 0;
                if (arrLength === 0 || tempLength === 0) {
                    return [];
                }
                var i, j, tempArray = [];
                for (i = 0; i < arrLength; i++) {
                    tempArray[i] = [];
                    for (j = 0; j < tempLength; j++) {
                        tempArray[i][j] = temp[j][i];
                    }
                }
                return tempArray;
            }
            /* Transpose Array */

            /* Aggregate Array */

            function aggregate(data, length) {
                var aggregateArray = [],
                        i = 0,
                        sum = 0,
                        j = 0;
                var arrLength = Object.keys(data[0]).length;
                for (i = 0; i < length; i++) {
                    for (var j = 0; j < arrLength; j++) {
                        sum += Math.round(data[i][j], 0);
                    }
                    var avg = Math.round(sum / arrLength);
                    aggregateArray.push(avg);
                    sum = 0;
                }
                return aggregateArray;
            }

            /* Aggregate Array */

            /* sortOrderBy Array */

            function sortOrderby(index, data1, myTableData, detailLabelData) {
                var temData = [];
                myTableData.forEach(function (obj1) {
                    var a = [];
                    var count = 0;
                    obj1.forEach(function (obj2) {
                        var aa = obj2[count];
                        a.push(aa);
                        count++;
                    })
                    temData.push(a);
                })
                detailLabelData = temData;
                return detailLabelData;
            }
            /* sortOrderBy Array */

            /* Delete Each Row */
            function deleteEachRow(tableData, index) {
                tableData.splice(index, 1);
                return tableData;
            }
            /* Delete Each Row */

            /* Text OverLay */

            var canvas = document.getElementById('tempCanvas');
            var context = canvas.getContext('2d');
            var textOverlay = "";

            function textOverlay(column_name, image, fields) {
                fields.forEach(function (obj) {
                    if (obj.column_desc == 'Entry Date') {
                        textOverlay = obj.value;
                    }
                })
                var l_imgSource = new Image();
                l_imgSource.src = image;
                canvas.width = l_imgSource.width;
                canvas.height = l_imgSource.height;
                context.drawImage(l_imgSource, 0, 0);
                context.font = "20px impact";
                textWidth = context.measureText($scope.frase).width;
                if (textWidth > canvas.offsetWidth) {
                    context.font = "5px impact";
                }
                context.textAlign = 'center';
                context.fillStyle = 'white';
                context.fillText(textOverlay, canvas.width / 2, canvas.height * 0.8);
                var l_imgURI = canvas.toDataURL();
                fields.forEach(function (obj) {
                    if (obj.column_name == column_name) {
                        var temp = l_imgURI.split(",");
                        obj.value = temp[1];
                    }

                })
                return fields;
            }
            /* Text OverLay */

            /* Scroll Top */
            function scrollTop() {
                $ionicScrollDelegate.scrollTop();
            }
            /* Scroll Top */

            /* Display Error Message */
            function displayErrorMessage(status) {
                var message = '';
                if (status == 404 || status == -1) {
                    message = "Resource not available..";
                } else if (status == 400) {
                    message = "Invalid request..";
                } else if (status == 500) {
                    message = "Server is busy..";
                } else {
                    message = "Try Again..";
                }
                displayCordovaToast(message)
            }

            function displayCordovaToast(message) {
//            $cordovaToast.show(message, 'long', 'bottom');
                alert(message);
            }
            /* Display Error Message */

            /* Confirmation Popup */
            function confirmationPopup(message) {
                return $q(function (resolve, reject) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'confirm',
                        template: message
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            resolve('ok')
                        } else {
                            resolve('cancel')
                        }
                    });
                })
            }
            /* Confirmation Popup */

            /*native-transtion*/
            function nativeTranstion(direction) {


                // window.plugins.nativepagetransitions.slide({
                //         "direction": direction
                //     },
                //     function(msg) {
                //         // console.log("success: " + msg)
                //     },
                //     function(msg) {
                //         // alert("error: " + msg)
                //     }
                // );

                // window.plugins.nativepagetransitions.curl({
                //         "direction": direction
                //     },
                //     function(msg) {
                //         console.log("success: " + msg)
                //     },
                //     function(msg) {
                //         alert("error: " + msg)
                //     }
                // );


                // window.plugins.nativepagetransitions.fade({

                //     },
                //     function(msg) {
                //         console.log("success: " + msg)
                //     },
                //     function(msg) {
                //         alert("error: " + msg)
                //     }
                // );

                // window.plugins.nativepagetransitions.flip({
                //         "direction": direction
                //     },
                //     function(msg) {
                //         console.log("success: " + msg)
                //     },
                //     function(msg) {
                //         alert("error: " + msg)
                //     }
                // );



            }
            /*native-transtion*/

            function getLatLngLocTim() {

                return $q(function (resolve, reject) {
                    var l_object = [];
                    var l_latitude = '';
                    var l_longitude = '';
                    var l_location = '';
                    var posOptions = {timeout: 5000, enableHighAccuracy: false};
                    var l_dateTime = "";

                    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                        l_latitude = position.coords.latitude;
                        l_longitude = position.coords.longitude;

                        // alert('Latitude: ' + position.coords.latitude + '\n' +
                        //     'Longitude: ' + position.coords.longitude + '\n' +
                        //     'Altitude: ' + position.coords.altitude + '\n' +
                        //     'Accuracy: ' + position.coords.accuracy + '\n' +
                        //     'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                        //     'Heading: ' + position.coords.heading + '\n' +
                        //     'Speed: ' + position.coords.speed + '\n' +
                        //     'Timestamp: ' + position.timestamp + '\n');

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
                        l_dateTime = pad(day) + "-" +
                                pad(month) + "-" +
                                pad(year) + " " +
                                pad(hours) + ":" +
                                pad(minutes) + ":" +
                                pad(seconds);
                        l_object.l_dateTime = l_dateTime;
                        l_object.l_latitude = l_latitude;
                        l_object.l_longitude = l_longitude;

                        getLocation(l_latitude, l_longitude).then(function (data) {
                            l_object.l_location = data;
                            resolve(l_object);
                        }, function (err) {
                            resolve(l_object);
                        })
                    }, function (err) {
                        // alert('code: ' + err.code + '\n' +
                        //     'message: ' + err.message + '\n');
                        $cordovaToast.show('Unable to get Location...', 'long', 'bottom');
                        reject();
                    });
                })
            }

            function getLocation(lat, lng) {

                return $q(function (resolve, reject) {
                    var l_location = '';
                    var posOptions = {
                        timeout: 5000,
                        enableHighAccuracy: false
                    };
                    var l_latlng = new google.maps.LatLng(lat, lng);
                    var l_geocoder = geocoder = new google.maps.Geocoder();
                    l_geocoder.geocode({
                        'latLng': l_latlng
                    }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[1]) {
                                l_location = results[1].formatted_address;
                                resolve(l_location);
                            }
                        }
                    });
                }, function (err) {
                    resolve(err);
                })
            }

            function autoCalculationOfDuration(fields, column_name) {
                var formula = [];
                var data_column = '';
                fields.forEach(function (obj) {
                    if (obj.auto_calculation) {
                        data_column = obj.column_name;
                        if ((obj.auto_calculation.indexOf(column_name)) > -1) {
                            var arr = obj.auto_calculation.split("#");
                            for (var i = 0; i < arr.length; i++) {
                                if (!isOperator(arr[i]) && arr[i] !== '') {
                                    fields.forEach(function (obj1) {
                                        if (obj1.column_name == arr[i]) {
                                            formula[i] = obj1.value;
                                        }
                                    })
                                } else {
                                }
                            }
                            if (formula[0] && formula[2]) {
                                var diffMs = (formula[0] - formula[2]); // milliseconds
                                var diffDays = Math.floor(diffMs / 86400000); // days
                                var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                                var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                                obj.value = diffDays + " dy: " + diffHrs + " hr: " + diffMins + " mn";
                            } else {
                                obj.value = ''
                            }
                        }
                    } else {
                    }
                })
                return fields;
            }

            //         function callLocalNotification(url,l_aapType,l_userName) {
            //     alert("called")
            // alert(url+"......."+l_aapType+"............"+l_userName);
            //     $http.get(url + 'dyanamicWelcomeMsg?tabId=' + l_aapType + '&userName=' + l_userName).success(function(data) {
            //
            //          alert("http Sucess");
            //          var alarmTime = new Date();
            //         alarmTime.setSeconds(alarmTime.getSeconds() + 5);
            //         $cordovaLocalNotification.add({
            //             id: "1234",
            //             date: alarmTime,
            //             message: data.welcomeMsg,
            //             title: "GOOD MORNING...!!",
            //             autoCancel: false,
            //             sound: "file://sound/morning_notification.mp3",
            //             icon: "file://img/settingicon.png",
            //             badge: 441,
            //             style: "bigtext", //shortened from 'bigtextview'
            //             text: "very long string......... \n Line2 \n .......................................................",
            //             actions: [
            //         {
            //             text: "MAP",
            //             icon: "res://ic_menu_mapmode", //A drawable icon (Optional)
            //             action: 0   //Any additional values apart from text and icon will be transferred along
            //                         //to be used in your handler function. Here I used "action", but you can
            //                         //add multiple fields with any key/value. See below for more examples.
            //         },
            //         {
            //             text: "Select",
            //             action: 1,
            //             myAction: "action1"
            //         },
            //         {
            //             text: "Ignore",
            //             action: 2,
            //             anotherValue: 0
            //         }
            //         //Note: There can only be up to three actions (enforced by android)
            //     ]
            //         }).then(function () {
            //             alert("The notification has been set");
            //         },function () {
            //             alert("notificatio marla");
            //         });
            //
            //
            //         // alert(data.welcomeMsg);
            //         // $scope.welcomeMsg = data.welcomeMsg;
            //     }).error(function(err){
            // alert("http error" + err);
            //     })
            //
            //     alert("called end")
            //
            // }


            function callLocalNotification(url, l_aapType, l_userCode) {


                // http://192.168.100.145:8080/DynamicAppWS/webService/CPT/NA/NA/CPGTEST/CPGTEST/notification?userCode=HT01&seqNo=55
                $http.get(url + 'notification?userCode=' + l_userCode + "&seqNo=55").success(function (data) {
                    var idcount = 1;
                    var done = true;
                    var isUnread = "no"

                    if (data.model) {
                        // alert("notif suc");
                        data.model.forEach(function (obj) {
                            var alarmTime = new Date();
                            alarmTime.setSeconds(alarmTime.getSeconds() + (parseInt(idcount) + 2));
                            // alert(alarmTime);
                            // navigator.notification.vibrateWithPattern([0, 100, 100, 200, 100, 400, 100, 800]);
                            // if (idcount == 9) {
                            //     done = true;
                            // }
                            // navigator.notification.vibrateWithPattern([0, 100, 100, 200, 100, 400, 100, 800]);
                            // $cordovaLocalNotification.add({
                            //     // id: obj.seq_id,
                            //     id: idcount,
                            //     date: alarmTime,
                            //     title: obj.col5,
                            //     autoCancel: false,
                            //     sound: "file://sound/morning_notification.mp3",
                            //     // icon: "../img/setting-icon.png",
                            //     icon: "res://icon",
                            //     badge: idcount,
                            //     led: 'FF0000',
                            //     style: "bigtext", //shortened from 'bigtextview'
                            //     text: obj.col6,
                            //     actions: [{
                            //             text: "MAP",
                            //             icon: "res://ic_menu_mapmode", //A drawable icon (Optional)
                            //             action: 0 //Any additional values apart from text and icon will be transferred along
                            //                 //to be used in your handler function. Here I used "action", but you can
                            //                 //add multiple fields with any key/value. See below for more examples.
                            //         },
                            //         {
                            //             text: "Select",
                            //             action: 1,
                            //             myAction: "action1"
                            //         },
                            //         {
                            //             text: "Ignore",
                            //             action: 2,
                            //             anotherValue: 0
                            //         }
                            //         //Note: There can only be up to three actions (enforced by android)
                            //     ]
                            // }).then(function() {
                            //     if (done) {
                            //         done = false;
                            //         // $cordovaLocalNotification.update([{
                            //         //         id: 1,
                            //         //         title: 'Title 1 - UPDATED',
                            //         //         text: 'Text 1 - UPDATED',
                            //         //         led: 'FF0000',
                            //         //         every: 'minute',
                            //         //         icon: "file://launcher_icon",
                            //         //         // smallIcon: "https://cdn4.iconfinder.com/data/icons/flat-shaded-2/512/Notification-512.png"
                            //         //     },
                            //         //     {
                            //         //         id: 2,
                            //         //         title: 'Title 2 - UPDATED',
                            //         //         text: 'Text 2 - UPDATED',
                            //         //         led: 'FF00FF',
                            //         //         every: 'minute',
                            //         //         // icon: "res://icon.png",
                            //         //         // image: "http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Apps-preferences-desktop-notification-icon.png",
                            //         //         smallIcon: "res://icon"
                            //         //     },
                            //         //     {
                            //         //         id: 3,
                            //         //         title: 'Title 3 - UPDATED',
                            //         //         text: 'Text 3 - UPDATED',
                            //         //         led: 'FF00FF',
                            //         //         every: 'minute',
                            //         //         icon: "file://launcher_icon.png",
                            //         //         // image: "resources://Bell-128.png",
                            //         //         // smallIcon: "resources://icon.png"
                            //         //     }
                            //         // ]).then(function(result) {});
                            //     }
                            // }, function() {});
                            idcount = idcount + 1;
                            obj.isRead = "no";
                            isUnread = "yes"
                        })
                    } else {
                        isUnread = "no"
                    }
                    var temp = {};
                    var id = "localNotif";

                    // data.model.forEach(function(obj) {
                    //     obj.isRead = "no";
                    // })

                    storeNotificationDataInPDB(data.model, isUnread)

                }).error(function (err) {
                    // alert("http error" + err);
                })
                // alert("called end")
            }

            function storeNotificationDataInPDB(dataModel, isUnread) {
                var temp = {};
                var id = "localNotif";
                pouchDBService.getObject(id).then(function (dd) {
                    temp = dd;
                    if (dataModel) {
                        // var list = data.model.concat(temp.notifList)
                        var list = dataModel;
                    }
                    temp.notifList = list;
                    temp.isUnread = isUnread;
                    pouchDBService.updateJSON(temp);
                }, function (err) {
                    if (dataModel) {
                        temp.notifList = dataModel;
                    }
                    temp._id = id;
                    temp.isUnread = isUnread;
                    pouchDBService.updateJSON(temp);
                })
            }


            return {
                autoCalculation: autoCalculation,
                rowWiseAutoCalculation: rowWiseAutoCalculation,
                searchLovbyAlpha: searchLovbyAlpha,
                iterateAlphabet: iterateAlphabet,
                showLoading: showLoading,
                // trustSrc: trustSrc,
                goBack: goBack,
                hideLoading: hideLoading,
                transpose: transpose,
                aggregate: aggregate,
                sortOrderby: sortOrderby,
                deleteEachRow: deleteEachRow,
                textOverlay: textOverlay,
                scrollTop: scrollTop,
                displayErrorMessage: displayErrorMessage,
                displayCordovaToast: displayCordovaToast,
                confirmationPopup: confirmationPopup,
                nativeTranstion: nativeTranstion,
                getLatLngLocTim: getLatLngLocTim,
                autoCalculationOfDuration: autoCalculationOfDuration,
                callLocalNotification: callLocalNotification,
                storeNotificationDataInPDB: storeNotificationDataInPDB
            }
        })