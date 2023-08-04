var DynamicApp = angular.module('starter.controllers', [])

DynamicApp.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0)
})


DynamicApp.directive("copyToClipboard", copyClipboardDirective);
function copyClipboardDirective() {
    var clip;
    function link(scope, element) {
        function clipboardSimulator() {
            var self = this,
                    textarea,
                    container;
            function createTextarea() {
                if (!self.textarea) {
                    container = document.createElement('div');
                    container.id = 'simulate-clipboard-container';
                    container.setAttribute('style', ['position: fixed;', 'left: 0px;', 'top: 0px;', 'width: 0px;', 'height: 0px;', 'z-index: 100;', 'opacity: 0;', 'display: block;'].join(''));
                    document.body.appendChild(container);
                    textarea = document.createElement('textarea');
                    textarea.setAttribute('style', ['width: 1px;', 'height: 1px;', 'padding: 0px;'].join(''));
                    textarea.id = 'simulate-clipboard';
                    self.textarea = textarea;
                    container.appendChild(textarea);
                }
            }
            createTextarea();
        }
        clipboardSimulator.prototype.copy = function () {
            this.textarea.innerHTML = '';
            this.textarea.appendChild(document.createTextNode(scope.textToCopy));
            this.textarea.focus();
            this.textarea.select();
            setTimeout(function () {
                document.execCommand('copy');
            }, 20);
        };
        clip = new clipboardSimulator();
        element[0].addEventListener('click', function () {
            clip.copy();
        });
    }
    return {
        restrict: 'A',
        link: link,
        scope: {
            textToCopy: '='
        }
    };
}


DynamicApp.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, addUpdateEntryCtrl) {
            function inputValue(val) {
                if (val) {
                    var l_digits = val.replace(/[^0-9]/g, '')
                    if (l_digits !== val) {
                        addUpdateEntryCtrl.$setViewValue(l_digits)
                        addUpdateEntryCtrl.$render()
                    }
                    return parseFloat(l_digits)
                }
                return undefined
            }
            addUpdateEntryCtrl.$parsers.push(inputValue)
        }
    }
})

DynamicApp.directive('noSpecialChar', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, RegisterCtrl) {
            RegisterCtrl.$parsers.push(function (inputValue) {
                if (inputValue == null)
                    return ''
                cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
                cleanInputValue = inputValue.replace(/[^a-z,A-Z ]/g, '');
                if (cleanInputValue.length > 30) {
                    cleanInputValue = cleanInputValue.slice(0, -1);
                }
                if (cleanInputValue != inputValue) {
                    RegisterCtrl.$setViewValue(cleanInputValue);
                    RegisterCtrl.$render();
                }
                return cleanInputValue;
            });
        }
    }
});

DynamicApp.directive('validateEmail', function () {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return {
        require: 'ngModel',
        restrict: '',
        link: function (scope, elm, attrs, ctrl) {
            if (ctrl && ctrl.$validators.email) {
                ctrl.$validators.email = function (modelValue) {
                    return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                };
            }
        }
    };
});

DynamicApp.directive('isNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope) {
            scope.$watch('wks.number', function (newValue, oldValue) {
                var arr = String(newValue).split("");
                if (arr.length === 0)
                    return;
                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.'))
                    return;
                if (arr.length === 2 && newValue === '-.')
                    return;
                if (isNaN(newValue)) {
                    scope.wks.number = oldValue;
                }
            });
        }
    };
});

function isEmpty(value) {
    return angular.isUndefined(value) || value === '' || value === null || value !== value;
}

DynamicApp.directive('bindHtml', ['$sce', function ($sce) {
        return {
            restrict: 'A',
            transclude: true,
            template: '<span><span ng-bind-html="html"></span><span ng-transclude></span></span>',
            link: function (scope, element, attrs) {
                scope.html = $sce.trustAsHtml(scope.$eval(attrs.bindHtml));
            }
        };
    }]);

DynamicApp.directive('ngMin', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMin, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var minValidator = function (value) {
                var min = scope.$eval(attr.ngMin) || 0;
                if (!isEmpty(value) && value < min) {
                    ctrl.$setValidity('ngMin', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMin', true);
                    return value;
                }
            };
            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
});

DynamicApp.directive('validNumber', function () {
    return {
        require: '?ngModel',
        scope: {
            decimaldigit: '='
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }
                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    if (scope.decimaldigit == 0) {
                        clean = decimalCheck[0];
                    } else {
                        decimalCheck[1] = decimalCheck[1].slice(0, scope.decimaldigit);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

DynamicApp.directive('ngMax', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMax, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var maxValidator = function (value) {
                var max = scope.$eval(attr.ngMax) || Infinity;
                if (!isEmpty(value) && value > max) {
                    ctrl.$setValidity('ngMax', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMax', true);
                    return value;
                }
            };

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});


DynamicApp.directive("limitTo", [function () {
        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                var limit = parseInt(attrs.limitTo);
                angular.element(elem).on("keydown", function (e) {
                    if (this.value.length > limit) {
                        e.stopPropagation();
                        // scope.$apply(function () {
                        //     scope.myModel.updateAttributeStatus = true;
                        // });
                        e.preventDefault();
                        return false;
                    }
                });
            }
        }
    }]);

DynamicApp.controller('AppMainCtrl', function ($scope, $state, $rootScope,
        $http, $ionicModal, globalObjectServices, $timeout, AuthServices, $cordovaDevice
        ) {
    $scope.appVerson = "1.0.0";


    $scope.databaseUser = "";
    $scope.dbPassword = "";
    $scope.dbUrl = "";
    $scope.portNo = "";
    // $scope.url = "";
    $scope.url = AuthServices._url();
    //  globalObjectServices.alertPopup( $scope.url)
    if ($scope.url == '' || $scope.url == undefined || $scope.url == "undefined") {


        //aaaa

        //postgrays
        // var serverUrl = "http://192.168.100.146:8080/DynamicAppWS/webService/";
        // var serverUrl = "http://203.193.167.118:8888/DynamicAppWSPG/webService/";

        //oracle
//         var serverUrl = "http://192.168.100.145:8080/DynamicAppWS/webService/";
        var serverUrl = "http://192.168.100.195:9090/DynamicAppWS/webService/";
        // var serverUrl = "http://192.168.100.146:8080/DynamicAppWS/webService/";
        // var serverUrl = "http://203.193.167.118:8888/DynamicAppWSV3/webService/";




        //postgrays
        // var databaseUrl = "RP/192.168.100.173/1521/RPSILERP/RPSILERP/";
        //var databaseUrl = "TG/192.168.100.173/1521/TAGERP/TAGERP/";
        // var databaseUrl = "NA/NA/NA/ASHISH/ASHISH/";
        // var databaseUrl = "NA/NA/NA/UNILEVER/UNILEVER/";
        // var databaseUrl = "NA/NA/NA/NETVISION/NETVISION/";

        // var databaseUrl = "LS/192.168.100.173/1521/LHSISO/LHSISO/";
        // var databaseUrl = "BD/192.168.100.173/1521/LHS_MAPP/LHS_MAPP/";
        // var databaseUrl = "ST/192.168.100.173/1521/STLTERP/STLTERP/";
        // var databaseUrl = "DI/192.168.100.173/1521/DILVERP/DILVERP/";
        // var databaseUrl = "JC/192.168.100.173/1521/JCTLERP/JCTLERP/";
        // var databaseUrl = "NW/192.168.100.173/1521/NWPLTEST/NWPLTEST/";
        // var databaseUrl = "CP/192.168.100.173/1521/CPGERP/CPGERP/";
        // var databaseUrl = "MA/192.168.100.173/1521/MAPLTEST/MAPLTEST/";
        // var databaseUrl = "BA/192.168.100.173/1521/BAIDVTEST/BAIDVTEST/";
        // var databaseUrl = "PF/192.168.100.173/1521/PERTTEST/PERTTEST/";
        // var databaseUrl = "TG/192.168.100.173/1521/TAGERP/TAGERP/";
        // var databaseUrl = "SM/192.168.100.10/1521/VDEMOERP/VDEMOERP/";
        //    var databaseUrl = "SP/192.168.100.173/1521/SONIVERP/SONIVERP/";
//         var databaseUrl = "ST/192.168.100.173/1521/SSLERP/SSLERP/";
        var databaseUrl = "RE/192.168.100.173/1521/ROHASERP/ROHASERP/";
        // var databaseUrl = "MS/192.168.100.173/1521/MANERP/MANERP/";
        // var databaseUrl = "VE/192.168.100.173/1521/VEEERP/VEEERP/";
        // var databaseUrl = "VE/192.168.100.173/1521/VEETEST/VEETEST/";
        // var databaseUrl = "SX/192.168.100.173/1521/SNXVERP/SNXVERP/";
        // var databaseUrl = "SE/192.168.100.173/1521/SSELERP/SSELERP/";
        //  var databaseUrl = "SS/192.168.100.173/1521/SMBHVERP/SMBHVERP/";
        // var databaseUrl = "AE/192.168.100.173/1521/AAEVERP/AAEVERP/";
        $scope.url = serverUrl + databaseUrl;


        //live client server url
        //NETVISIONLIVE   Hosted postgrays
        // $scope.url = "http://180.151.87.156:8888/DynamicAppWSPG/webService/NA/NA/NA/NETVISIONLIVE/NA/";


        // SONIVERP Hosted JBoss
        //Has different backup
        // $scope.url = 'http://202.189.234.141/DynamicAppWSV3/webService/SP/192.168.0.101/1521/SONIVERP/SONIVERP/'

        // ROHASERP Clientside Hosted JBoss
        // $scope.url = "http://192.168.10.24:8080/DynamicAppWSV3/webService/RE/192.168.10.22/1521/ROHASERP/ROHASERP/";

        // SSLERP Clientside Hosted JBoss
//        $scope.url = 'http://202.191.213.166:8888/DynamicAppWSV3/webService/SS/192.168.1.16/1521/SSLERP/SSLERP/'
        // 202.191.213.166


        // MANERP Clientside Hosted JBoss
        // $scope.url = 'http://192.168.0.174:8080/DynamicAppWSV3/webService/MS/192.168.0.174/1521/MANERP/MANERP/'


        // SNXVERP Clientside Hosted JBoss
        // $scope.url = "http://103.83.136.50:8084/DynamicAppWSV3/webService/SX/192.168.1.124/1521/SNXVERP/SNXVERP/";
        // 192.168.1.124:8084

        // SONIVERP Clientside Hosted JBoss
        // $scope.url = 'http://202.189.234.141/DynamicAppWSV3/webService/SP/192.168.0.101/1521/SONIVERP/SONIVERP/'

        // VEETEST Clientside Hosted JBoss
//         $scope.url = "http://45.117.0.43:8888/DynamicAppWSV3Config/webService/VE/192.168.0.250/1521/VEETEST/VEETEST/";

    }


    // globalObjectServices.showLoading();
    // $timeout(function () {
    //     globalObjectServices.hideLoading();
    // }, 1000)

    document.addEventListener('offline', onOffline, false)

    $rootScope.online = true;

    function onOffline() {
        $rootScope.$apply(function () {
            $rootScope.online = false;
            globalObjectServices.displayCordovaToast('Sorry, no Internet Connectivity detected. Please reconnect and try again.');
            // globalObjectServices.confirmationPopup('Sorry, no Internet Connectivity detected. Please reconnect and try again.').then(function(data) {
            //     if (data == 'ok') {} else { ionic.Platform.exitApp() }
            // })
        })
    }
    document.addEventListener('online', function () {
        $rootScope.$apply(function () {
            $rootScope.online = true
            $rootScope.closeToast()
        })
    }, false)
    document.addEventListener('backbutton', function (event) {
        var l_currentState = $state.current.name;
        if (l_currentState == 'calendar') {
            $state.go('dashbord'); // exit the app
            globalObjectServices.nativeTranstion("right");
        } else {
            if (l_currentState == 'dashbord' || l_currentState == 'login') {
                if ($rootScope.drawer.openned) {
                    // thedrawer is openned - close
                    $rootScope.drawer.hide();
                } else {
                    ionic.Platform.exitApp();
                }
            }
        }
        globalObjectServices.nativeTranstion("down");
    });

    $scope.backNavigate = function () {
        globalObjectServices.goBack();
        // globalObjectServices.nativeTranstion("down");
    };

    document.addEventListener('deviceready', function () {
        $scope.deviceName = $cordovaDevice.getModel();
        $scope.deviceID = $cordovaDevice.getUUID();
        var permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, checkPermissionCallback, null);
        permissions.hasPermission(permissions.CAMERA, checkPermissionCamera, null);
        permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, checkPermissionFineLocation, null);
        permissions.hasPermission(permissions.RECORD_AUDIO, checkPermissionMicrophone, null);

        function checkPermissionCallback(status) {
            if (!status.hasPermission) {
                var errorCallback = function () {
                    globalObjectServices.alertPopup('Please Allow Storage setting');
                }
                permissions.requestPermission(
                        permissions.WRITE_EXTERNAL_STORAGE,
                        function (status) {
                            if (!status.hasPermission)
                                errorCallback();
                        }, errorCallback);
            }
        }

        function checkPermissionCamera(status) {
            if (!status.hasPermission) {
                var errorCallback = function () {
                    globalObjectServices.alertPopup('Please Allow Camera setting');
                }
                permissions.requestPermission(
                        permissions.CAMERA,
                        function (status) {
                            if (!status.hasPermission)
                                errorCallback();
                        }, errorCallback);
            }
        }

        function checkPermissionFineLocation(status) {
            if (!status.hasPermission) {
                var errorCallback = function () {
                    globalObjectServices.alertPopup('Please Allow Location setting');
                }
                permissions.requestPermission(
                        permissions.ACCESS_FINE_LOCATION,
                        function (status) {
                            if (!status.hasPermission)
                                errorCallback();
                        }, errorCallback);
            }
        }

        function checkPermissionMicrophone(status) {
            if (!status.hasPermission) {
                var errorCallback = function () {
                    globalObjectServices.alertPopup('Please Allow Microphone setting');
                }
                permissions.requestPermission(
                        permissions.RECORD_AUDIO,
                        function (status) {
                            if (!status.hasPermission)
                                errorCallback();
                        }, errorCallback);
            }
        }
        // $scope.notification = {
        //     link: "http://192.168.100.195:8084/erpapprovals/approverecord?vrno=PS17Y-01063&apprkey=ORDI&apprkeyname=ORDI - Purchase Order&tcod=U&tt=test&username=PRAKASH&password=tc@1236"
        // };


        /*  FCMPlugin.onNotification(function (data) {
         // this.badge.increase(1);
         // data.wasTapped = true;
         if (data.wasTapped) {
         globalObjectServices.alertPopup("I am tapped" + JSON.stringify(data));
         $scope.notification = data;
         openNotif();
         } else {
         //Notification was received in foreground. Maybe the user needs to be notified.
         $scope.notification = data;
         globalObjectServices.alertPopup("I am not tapped" + JSON.stringify(data));
         openNotif();
         }
         },
         function (msg) {
         globalObjectServices.alertPopup("Success tapped callback " + msg);
         // $scope.notification = msg;
         // openNotif();
         },
         function (err) {
         globalObjectServices.alertPopup("Error tapped callback " + err);
         }); */

        FCMPlugin.unsubscribeFromTopic('all');

    }, false)
    $scope.notificationList = [];

    function openNotif() {
        if ($scope.notification) {
            $scope.notificationList.push($scope.notification);
            if ($scope.forceNotifModal) {
                $scope.forceNotifModal.show();
            } else {
                $ionicModal.fromTemplateUrl('templates/ForceNotif.html', {
                    scope: $scope,
                    animation: 'animated slideInDown',
                    hideDelay: 1020
                }).then(function (modal) {
                    $scope.forceNotifModal = modal;
                    $scope.forceNotifModal.show();
                });
            }
        }
    }

    $scope.openlink = function (data) {
        //  globalObjectServices.alertPopup("openLink")
        //  globalObjectServices.alertPopup(data.link);

        var link = data.serverUrl + "/approverecord?" + "vrno=" + data.vrno + "&apprkey=" + data.apprkey +
                "&apprkeyname=" + data.apprkeyname + "&tcod=" + data.tcode + "&tt=test" +
                "&username=" + AuthServices.userCode() + "&password=" + AuthServices.password();
        //  globalObjectServices.alertPopup(link);
        globalObjectServices.openWebLink(link);
    }
    $scope.openShortReportDetail = function (seqNo) {
        $state.go('shortReportDetail', {obj: seqNo});
        globalObjectServices.nativeTranstion("right");
    };

    $scope.setValue = function (s) {

        if (s.dbEntity == "") {
            s.dbEntity = "NA"
        }
        if (s.dbUrl == "") {
            s.dbUrl = "NA"
        }
        if (s.portNo == "") {
            s.portNo = "NA"
        }
        if (s.databaseUser == "") {
            s.databaseUser = "NA"
        }
        $scope.url = s.serverUrl + s.warName + "/webService/" + s.dbEntity + "/" + s.dbUrl + "/" + s.portNo + "/" + s.databaseUser + "/" + s.dbPassword + "/";
        //  globalObjectServices.alertPopup("$scope.url==>  " + $scope.url);
        // globalObjectServices.displayCordovaToast('Server credentials saved Successfully..')
        var autharray = [];
        autharray.databaseUser = s.databaseUser;
        autharray.dbPassword = s.dbPassword;
        autharray.dbUrl = s.dbUrl;
        autharray.portNo = s.portNo;
        $state.go('login', {
            obj: autharray
        })
    }

    $scope.changeIPAddress = function (ipAddress) {
        var s_url = $scope.url;
        if (ipAddress) {
            var temp_url = $scope.url;
            var url_1 = temp_url.split(":")[0];
            var url_2 = temp_url.split(":")[1];
            var url_3 = temp_url.split(":")[2];
            var bb = url_2.split(".")[0];
            var url_2_2 = bb.split("")[0] + bb.split("")[1] + ipAddress;
            s_url = url_1 + ":" + url_2_2 + ":" + url_3;
            console.log("................")
            console.log($scope.url);
            console.log(s_url);
            $scope.url = s_url;
        }
    }


    var l_userName = AuthServices.userName();
    var l_userCode = AuthServices.userCode();
    var l_aapType = AuthServices.appType();
    AuthServices.setForce_flag(true);
}) // AppMainCtrl Close

DynamicApp.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])


DynamicApp.controller('loginCtrl', function ($scope, AuthServices, $state, $timeout, $stateParams, $ionicLoading,
        $http, globalObjectServices) {
    $scope.loginData_ng = {};
    $scope.flagForDisableLoginButton = 0;
    var dataSet = $state.params.obj;
    // globalObjectServices.showLoading();

    $timeout(function () {
        if ($ionicLoading._getLoader().$$state.value.isShown) {
            $ionicLoading.hide();
            globalObjectServices.displayCordovaToast("Server is Busy");
        }
    }, 10000)

    $scope.token = '';
    /* document.addEventListener('deviceready', function () {
     setTimeout(getTheToken, 1000);
     function getTheToken() {
     if (typeof FCMPlugin != 'undefined') {
     FCMPlugin.getToken(
     function (token) {
     if (token == null) {
     setTimeout(getTheToken, 1000);
     } else {
     $scope.token = token;
     }
     },
     function (err) {
     }
     );
     }
     else {
     FCMPlugin.onTokenRefresh(function (token) {
     $scope.token = token;
     });
     }
     }
     FirebaseInstanceId.deleteInstanceId()
     }) */


    // document.addEventListener('deviceready', function() {
    //     //  globalObjectServices.alertPopup("Device ID : " + l_deviceID + " Device Name : " + l_deviceName);
    // }, false)

    $scope.doLogin = function () {
        $scope.flagForDisableLoginButton = 1;
        if (dataSet != null) {
            $scope.databaseUser = dataSet.databaseUser;
            $scope.dbPassword = dataSet.dbPassword;
            $scope.dbUrl = dataSet.dbUrl;
            $scope.portNo = dataSet.portNo;
        } else {
            $scope.databaseUser = "DILVERP1";
            $scope.dbPassword = "DILVERP1";
            $scope.dbUrl = "NA";
            $scope.portNo = "NA";
        }

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        })
        // var url = $scope.url + 'login?userId=' + $scope.loginData_ng.username_ng +
        //     '&password=' + $scope.loginData_ng.password_ng + '&deviceId=' + $scope.deviceID + '&deviceName=' + $scope.deviceName;
        var url = $scope.url + 'login?userId=' + $scope.loginData_ng.username_ng +
                '&password=' + $scope.loginData_ng.password_ng + '&deviceId=d79e928c5b0201b1' + '&deviceName=Micromax AQ4501' +
                "&notificationToken=" + $scope.token;
        console.log(url);
        $http.get(url).success(function (data) {
            $ionicLoading.hide();
            if (data.message == 'User is authenticated') {
                var entity_code = data.entity_code;
                var division_data = "";
                if (data.division) {
                    if (data.division.indexOf(" ") > -1) {
                        division_data = data.division.split(" ")[0];
                    } else {
                        division_data = data.division
                    }
                }


                var acc_code = data.acc_code;
                // var acc_code = "DCO";
                var currentDate = new Date();
                var getMonth = currentDate.getMonth() + 1;
                var getYear = currentDate.getFullYear().toString().substr(2, 2);
                var acc_year;
                var result_year = [];
                if (getMonth == 1 || getMonth == 2 || getMonth == 3) {
                    var fst = (getYear - 1);
                    var scnd = (parseInt(getYear));
                    acc_year = fst + " " + scnd;
                } else {
                    var scnd = (parseInt(getYear));
                    var fst = (getYear + 1);
                    acc_year = fst + " " + scnd;
                }
                var dept_code = data.dept_code;
                var login_params = [];
                if (entity_code) {
                    login_params.entity_code = entity_code.split(' ')[0];
                } else {
                    login_params.entity_code = entity_code;
                }

                login_params.division_data = division_data;
                login_params.acc_year = acc_year;
                login_params.dept_code = dept_code;
                login_params.databaseUser = "ss";
                login_params.dbPassword = $scope.dbPassword;
                login_params.dbUrl = $scope.dbUrl;
                login_params.portNo = $scope.portNo;
                AuthServices.login(data.user_code, data.userName, data.module, $scope.url, login_params.entity_code,
                        division_data, acc_year, dept_code, $scope.databaseUser, $scope.dbPassword, $scope.dbUrl, $scope.portNo, acc_code, $scope.loginData_ng.password_ng).then(function (authenticated) {
                    AuthServices.setLoginParam(login_params);
                    $state.go('dashbord', {}, {
                        reload: true
                    })
                    globalObjectServices.nativeTranstion("up");
                }, function (err) {
                    globalObjectServices.displayCordovaToast('Invalid credentials or device..' + err);
                })

                /*  if (data.notif_topic) {
                 var topic = data.notif_topic.split(",");
                 topic.forEach(function (top) {
                 FCMPlugin.subscribeToTopic(top);
                 })
                 } else {
                 FCMPlugin.subscribeToTopic('all');
                 } */

            } else {
                $scope.flagForDisableLoginButton = 0;
                globalObjectServices.displayCordovaToast('Invalid credentials or device.' + data.message);
            }
        }).error(function (data, status) {
            $ionicLoading.hide();
            $scope.flagForDisableLoginButton = 0;
            globalObjectServices.displayErrorMessage(status);
        })
    }


    $scope.changePassword = function () {
        $state.go('changePassword');
        globalObjectServices.nativeTranstion("right");
    };
    // $scope.changeSetting = function(seqNo) {
    //     $state.go('changeSetting');
    // };

    var autenticationPin = 007;
    $scope.pinAuthentication = function () {
        $state.go('pinAuthetication');
    };
    $scope.changeSetting = function (pin) {
        if (autenticationPin == pin) {
            $state.go('changeSetting');
        } else if (pin == "101") {
            $state.go('changeServerSettingSSL');
        } else {
            globalObjectServices.displayCordovaToast('Data saved successfully')
            $scope.backNavigate();
        }
    };
    $scope.uploadFile = function (myFile) {

        var f = document.getElementById('file').files[0],
                r = new FileReader();
        r.onloadend = function (e) {

            var data = e.target.result;
            var url = $scope.url + 'uplaodFile';

            var fd = new FormData();
            fd.append('file', data);
            fd.append('fileName', f.name);
            fd.append('mfile', myFile);

            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (data) {
                console.log("success--> ")
                console.log(data)
                alert(data.msg)
            }, function (err) {
                alert("error")
                console.log("err--> ")
                console.log(err)
            })
        }

        r.readAsBinaryString(f);


//        var req = {
//            url: '/uplaodFile',
//            method: 'POST',
//            headers: {'Content-Type': undefined},
//            data: formData,
//            transformRequest: function (data, headersGetterFunction) {
//                return data;
//            }
//        };
    }
    $scope.add = function () {
        var f = document.getElementById('file').files[0],
                r = new FileReader();
        r.onloadend = function (e) {
            var data = e.target.result;
            //send your binary data via $http or $resource or do anything else with it


//            var url = $scope.url + 'uplaodFile?file=' + data + "&fileName=" + f.name;
            var url = $scope.url + 'uplaodFile';
//            console.log(url);
            var fd = new FormData();
            fd.append('file', data);
            fd.append('fileName', f.name);
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (data) {
                console.log("success--> ")
                console.log(data)
                alert(data.msg)
            }, function (err) {
                alert("error")
                console.log("err--> ")
                console.log(err)
            })



//            console.log("data---> ");
//            console.log(data)
        }

        r.readAsBinaryString(f);
    }







}) // loginCtrl Close

DynamicApp.controller('ChangePasswordCtrl', function ($scope, $state, $http,
        $ionicModal, globalObjectServices, AuthServices) {

    $ionicModal.fromTemplateUrl('templates/checkMailForResetKey.html', function (modal) {
        $scope.checkMailForResetKeyModal = modal;
    }, {
        scope: $scope
    });
    $ionicModal.fromTemplateUrl('templates/passwordReset.html', function (modal) {
        $scope.passwordResetModal = modal;
    }, {
        scope: $scope
    });
    $scope.checkMailForResetKey = function (emailID) {
        $scope.forgetPasswordEmailID = emailID;
        globalObjectServices.showLoading();
        $http.get($scope.url + "forgotPassword?emailId=" + $scope.forgetPasswordEmailID).success(function (data) {
            var l_resetPasswordStatus = data.key;
            $scope.checkMailForResetKeyModal.show();
            if (l_resetPasswordStatus == "Please check your email ,We have send you a unique key,Use this to reset your password") {
                globalObjectServices.hideLoading();
                $scope.checkMailForResetKeyModal.show();
                globalObjectServices.displayCordovaToast('Check your Email for a key to reset your password...')
            } else if (l_resetPasswordStatus ==
                    "Might be emailId is Wrong ,Please enter valid email ID.") {
                globalObjectServices.hideLoading();
                globalObjectServices.displayCordovaToast('Enter Valid Email ID...')
            } else if (l_resetPasswordStatus == "Not valid emailId") {
                globalObjectServices.hideLoading();
                globalObjectServices.displayCordovaToast('Email ID not Valid...')
            } else if (l_resetPasswordStatus == "Fail") {
                globalObjectServices.hideLoading();
                globalObjectServices.displayCordovaToast('Try Again, with Valid Email ID...')
            } else {
                globalObjectServices.hideLoading();
                globalObjectServices.displayCordovaToast('Try Again..')
            }

        }).error(function (data, status) {
            globalObjectServices.hideLoading();
            globalObjectServices.displayErrorMessage(status)
        });
    };
    $scope.openPasswordReset = function () {
        $scope.checkMailForResetKeyModal.hide();
        $scope.checkMailForResetKeyModal.remove().then(function () {
            $scope.checkMailForResetKeyModal = null;
        });
        $scope.passwordResetModal.show();
    };
    $scope.passwordReset = function (resetKey, newPassword) {
        globalObjectServices.showLoading();
        $http.get($scope.url + "resetPasword?emailId=" + $scope.forgetPasswordEmailID + "&password=" +
                newPassword + "&key=" + resetKey).success(function (data) {
            var l_setNewPasswordStatuss = data.result; // Web Service response data
            globalObjectServices.hideLoading();
            if (l_setNewPasswordStatuss == "success") {
                $scope.passwordResetModal.hide();
                $scope.passwordResetModal.remove().then(function () {
                    $scope.passwordResetModal = null;
                });
                AuthServices.login(data.userCode, data.userName, data.apptype, $scope.url).then(function (authenticated) {
                    $state.go('dashbord', {}, {
                        reload: true
                    });
                    globalObjectServices.nativeTranstion("right");
                }, function (err) {
                    globalObjectServices.displayCordovaToast('Try Again..')
                });
                globalObjectServices.displayCordovaToast('Password Updated...')
            } else if (l_setNewPasswordStatuss == "not valid") {
                globalObjectServices.displayCordovaToast('Reset Key Expired, try requesting new Reset Key...')
            } else if (l_setNewPasswordStatuss == "fail") {
                globalObjectServices.displayCordovaToast('Please Enter Correct Reset Key...')
            } else {
                globalObjectServices.displayCordovaToast('Please Enter Correct Reset Key...')
            }
        }).error(function (data, status) {
            globalObjectServices.hideLoading();
            globalObjectServices.displayErrorMessage(status)
        });
    };
    $scope.$on('$destroy', function () {
        $scope.checkMailForResetKeyModal.remove().then(function () {
            $scope.checkMailForResetKeyModal = null;
        })
        $scope.passwordResetModal.remove().then(function () {
            $scope.passwordResetModal = null;
        })
    });
}) // ChangePasswordCtrl Close



DynamicApp.controller('changeServerSettingSSLCtrl', function ($scope, $rootScope, AuthServices, $state,
        $http, globalObjectServices) {
    var setting = this;
    $scope.inputType = 'password';
    $scope.hideShowPassword = function () {
        if ($scope.inputType == 'password')
            $scope.inputType = 'text';
        else
            $scope.inputType = 'password';
    };
    setting.serverList = [
        "http://27.250.7.75:8888/",
        "http://192.168.1.22:8888/"
    ];
    // $scope.url = 'http://202.191.213.165:8888/DynamicAppWSV3/webService/SS/192.168.1.16/1521/SSLERP/SSLERP/'

    setting.dbUrlList = ["192.168.1.16", "NA"];
    setting.portNoList = ["1521", "NA"];
    setting.warName = "DynamicAppWSV3";
    setting.serverUrl = "";
    setting.dbEntity = "SS";
    setting.databaseUser = "SSLERP";
    setting.dbPassword = "SSLERP";
    setting.portNo = "1521";
    setting.dbUrl = "192.168.1.16"
})

DynamicApp.controller('changeSettingCtrl', function ($scope, $rootScope, AuthServices, $state,
        $http, globalObjectServices) {
    var setting = this;
    $scope.inputType = 'password';
    $scope.hideShowPassword = function () {
        if ($scope.inputType == 'password')
            $scope.inputType = 'text';
        else
            $scope.inputType = 'password';
    };
    setting.serverList = [
        "http://203.193.167.118:8888/",
        "http://203.193.167.116:8888/",
        "http://203.193.167.114:8181/",
        "http://203.193.167.117:8080/",
        "http://203.193.167.117:8888/",
        "http://192.168.100.240:8888/",
        "http://203.193.167.117:8888/",
        "http://203.193.167.117:8181/",
        "http://117.240.223.218:8080/",
        "http://192.168.100.143:8080/",
        "http://192.168.100.145:8080/",
        "http://180.151.87.156:8888/",
        "http://202.191.213.165:8888/",
        "http://192.168.0.174:8080/",
        "http://27.250.7.75:8888/",
    ];
    setting.warList = ["DynamicAppWS", "DynamicAppWSPG", "DynamicAppWSV3", "DynamicAppWSPGReg"];
    setting.databaseList = [
        "CPGERP", "CPGTEST",
        "MAPLTEST", "RSIPMTEST",
        "BAIDVTEST", "PERTTEST",
        "ASHISH",
        "SONIVERP", "SONIVERP", "SONIVTEST",
        "LHSISO", "LHS_MAPP", "STLTERP",
        "DILVERP1", "UNILEVER", "NETVISION", "ROHASERP", "VEEERP", "SNXVERP", "SSELERP",
        "VDEMOERP", "JCTLERP", "SSLERP", "MANERP", "NA",
    ];
    setting.dbEntityList = ["CP", "CPT", "MA", "RS", "BA", "PF", "AS", "SP", "LS", "BD",
        "ST", "DI", "NV", "UL", "SM", "JC", "SS", "MS", "RE", "SX", "VE", "SE"
    ]
    setting.dbUrlList = ["192.168.100.10", "172.1.0.2", "192.168.0.101", "192.168.100.173", "192.168.1.16", "192.168.0.174", "NA"];
    setting.portNoList = ["1521", "NA"];
    setting.warName = "";
    setting.serverUrl = "";
    setting.dbEntity = "";
    setting.databaseUser = "";
    setting.dbPassword = "";
    setting.portNo = "";
    setting.dbUrl = "";
    setting.setDbUser = function (entity) {

        switch (entity) {
            case 'SE':
                setting.databaseUser = "SSELERP";
                break;
            case 'SS':
                setting.databaseUser = "SSLERP";
                break;
            case 'MS':
                setting.databaseUser = "MANERP";
                break;
            case 'SM':
                setting.databaseUser = "VDEMOERP";
                break;
            case 'SP':
                setting.databaseUser = "SONIVERP";
                break;
            case 'RE':
                setting.databaseUser = "ROHASERP";
                break;
            case 'SX':
                setting.databaseUser = "SNXVERP";
                break;
            case 'VE':
                setting.databaseUser = "VEEERP";
                break;
            case 'CP':
                setting.databaseUser = "CPGERP";
                break;
            case 'CPT':
                setting.databaseUser = "CPGTEST";
                break;
            case 'JC':
                setting.databaseUser = "JCTLERP";
                break;
            case 'MA':
                setting.databaseUser = "MAPLTEST";
                break;
            case 'RS':
                setting.databaseUser = "RSIPMTEST";
                break;
            case 'BA':
                setting.databaseUser = "BAIDVTEST";
                break;
            case 'PF':
                setting.databaseUser = "PERTTEST";
                break;
            case 'LS':
                setting.databaseUser = "LHSISO";
                break;
            case 'BD':
                setting.databaseUser = "LHS_MAPP";
                break;
            case 'DI':
                setting.databaseUser = "DILVERP1";
                break;
            case 'ST':
                setting.databaseUser = "STLTERP";
                break;
            case 'UL':
                setting.databaseUser = "UNILEVER";
                break;
            case 'NV':
                setting.databaseUser = "NETVISION";
                break;
            case 'AS':
                setting.databaseUser = "ASHISH";
                break;
            default:
                setting.databaseUser = ""
        }
    }
}) // changeSettingCtrl Close

DynamicApp.controller('dashbordCtrl', function ($scope, $filter, $state, $http, AuthServices, $ionicPlatform,
        $rootScope, $ionicPopup, dataServices, $ionicModal, pouchDBService, globalObjectServices, $ionicPopover,
        reportAnalysisServices, $nlFramework) {
    var l_userName = AuthServices.userName();
    var l_userCode = AuthServices.userCode();
    var l_aapType = AuthServices.appType();
    var login_params = AuthServices.login_params();
    //  globalObjectServices.alertPopup(AuthServices.databaseUser);
    var dbuser = AuthServices.databaseUser();
    var dbpwd = AuthServices.dbPassword();
    var dbUrl = AuthServices.dbUrl();
    var portNo = AuthServices.portNo();
    $scope.entity_code = AuthServices.entity_code();
    var division_data = AuthServices.division_data()
    var acc_year = AuthServices.acc_year();
    var dept_code = AuthServices.dept_code();
    var scheme;
    $scope.appType = l_aapType;
    $scope.sideMenu = {};
    var l_param = [];
    // $ionicModal.fromTemplateUrl('templates/fontfamily.html', function (modal) {
    //     $scope.fontfamilyKeyModal = modal;
    // }, {
    //         scope: $scope
    //     });

    $scope.appVerson = $scope.appVerson;
    // alert(" $scope.appVerson" + $scope.appVerson)

    $ionicPopover.fromTemplateUrl('static/templates/popover.html', {
        scope: $scope,
    }).then(function (popover) {
        $scope.popover = popover;
    });
    // document.addEventListener('deviceready', function () {
    //     alert("device ready");
    // })
    // $ionicPlatform.ready(function () {
    //     alert("ionicPlatform ready")
    // })



    if ("V" == AuthServices.screenOrientionView()) {
        // window.screen.lockOrientation('portrait');
    } else {
        if ("H" == AuthServices.screenOrientionView()) {
            // window.screen.lockOrientation('portrait');
        }
    }

    // $ionicPlatform.on('resume', function() {
    //      globalObjectServices.alertPopup("ionicPlatform.on.resume");
    // });
    var reloadDashbord = function () {
        $scope.dashboradData = null;
        if ($rootScope.online) {
            // dataServices.getDashbordData().then(function(data) {
            console.log($scope.url + 'getTableDetail?appType=' + l_aapType + '&userCode=' + l_userCode);
            $http.get($scope.url + 'getTableDetail?appType=' + l_aapType + '&userCode=' + l_userCode).success(function (data) {
                if (data.table_Detail !== null) {

                    var l_tableData = data.table_Detail[0];
                    if (data.table_Detail.length == 1 && l_tableData.firstScreen != 'E' && l_tableData.firstScreen != 'SE' &&
                            l_tableData.firstScreen != 'I' && l_tableData.firstScreen != 'M' && l_tableData.firstScreen != 'H' &&
                            l_tableData.firstScreen != 'EG' && l_tableData.firstScreen != 'N') {

                        $scope.flagForOneTab = 1;
                        $scope.firstScreen = l_tableData.firstScreen;
                        if (l_tableData.firstScreen == "G" || l_tableData.firstScreen == "T" ||
                                l_tableData.firstScreen == 1) {
                            AuthServices.setPortletId(l_tableData.portlet_Id);
                            if (l_tableData.firstScreen == 1 || l_tableData.firstScreen == "T") {
                                if (l_tableData.firstScreen == "T") {
                                    $scope.showSummaryValueFlag = 1;
                                }
                                $scope.showSummaryTabFlag = 1;
                            }
                            reportAnalysisServices.setTab($scope.url, l_tableData.seqNo, l_tableData.firstScreen).then(function (data) {
                                $scope.graphTab = data;
                                $scope.graphTab.forEach(function (obj) {
                                    obj.isProcessing = false;
                                })
                            }, function (err) {
                                globalObjectServices.displayCordovaToast('Try Again..')
                            })

                            $scope.refreshSummaryValue = function (seq_no, reportingType) {
                                $scope.graphTab.forEach(function (obj) {
                                    if (obj.seq_no == seq_no) {
                                        obj.isProcessing = true;
                                    }
                                })
                                $http.get($scope.url + 'CallLastUpdateProcedure?userCode=' + AuthServices.userCode() +
                                        '&seqId=' + seq_no + '&entityCode=' + AuthServices.entity_code() + '&divCode=' +
                                        AuthServices.division_data() + '&accYear=' + AuthServices.acc_year()).success(function (data) {
                                    $scope.graphTab.forEach(function (obj) {
                                        if (obj.seq_no == seq_no) {
                                            obj.isProcessing = false;
                                        }
                                    })
                                    globalObjectServices.displayCordovaToast(data.status);
                                }).error(function (data, status) {
                                    $scope.graphTab.forEach(function (obj) {
                                        if (obj.seq_no == seq_no) {
                                            obj.isProcessing = false;
                                        }
                                    })
                                    globalObjectServices.displayErrorMessage(status)
                                })
                            };
                            $scope.openReportAnalysis = function (seq_no, reportingType) {
                                var l_graphObj = [];
                                l_graphObj.seq_no = seq_no;
                                l_graphObj.reportingType = reportingType;
                                l_graphObj.firstScreen = l_tableData.firstScreen;
                                $state.go('report', {
                                    obj: l_graphObj
                                });
                                globalObjectServices.nativeTranstion("right");
                            };
                        } else if (l_tableData.firstScreen == "S") {
                            $scope.flagForShortReportTab = 1;
                            reportAnalysisServices.setshortReportTypeTab($scope.url, l_tableData.seqNo).then(function (data) {
                                $scope.typeList = data;
                            }, function (err) {
                                globalObjectServices.displayCordovaToast('Try Again..')
                            })
                        }
                    } else {
                        $scope.sideMenu.offline_flag_app_run = false;
                        $scope.dashboradData = data.table_Detail;
                        $scope.dashboradData.forEach(function (obj) {
                            var id = "entrySeqNo" + obj.seqNo;
                            pouchDBService.getObject(id).then(function (data) {
                                obj.noOfEntry = data.count;
                            }, function (err) {
                                obj.noOfEntry = 0;
                            });
                            if (obj.offline_flag_app_run == "T") {
                                $scope.sideMenu.offline_flag_app_run = true;
                            }
                        })
                        $scope.view_mode = data.view_mode;
                    }
                } else {
                    $scope.dashboradData = "";
                    $scope.sideMenu.offline_flag_app_run = false;
                }
            }).error(function (data, status) {
                $scope.dashboradData = {};
                $scope.sideMenu.offline_flag_app_run = false;
                globalObjectServices.displayErrorMessage(status);
            })
            // console.log($scope.url + 'dyanamicWelcomeMsg?tabId=' + l_aapType + '&userName=' + l_userName);
            $http.get($scope.url + 'dyanamicWelcomeMsg?tabId=' + l_aapType + '&userName=' + l_userName).success(function (data) {
                $scope.welcomeMsg = data.welcomeMsg;
                pouchDBService.getObject("welcomeMsg").then(function (data1) {
                    var temp = data1;
                    temp.welcomeMsg = data.welcomeMsg;
                    pouchDBService.updateJSON(temp);
                }, function (err) {
                    var temp = {};
                    temp.welcomeMsg = data.welcomeMsg;
                    temp._id = "welcomeMsg";
                    pouchDBService.updateJSON(temp);
                })
            }).error(function (data, status) {
                globalObjectServices.displayErrorMessage(status)
            })
        } else {
            pouchDBService.getObject(l_aapType).then(function (data) {
                $scope.dashboradData = data.table_Detail;
                $scope.view_mode = data.view_mode;
                $scope.dashboradData.forEach(function (obj) {
                    id = "entrySeqNo" + obj.seqNo;
                    pouchDBService.getObject(id).then(function (data) {
                        obj.noOfEntry = data.count;
                    }, function (err) {
                        obj.noOfEntry = 0;
                    });
                })
            }, function (err) {
                globalObjectServices.alertPopup("Data is not available please REFRESH app");
            })
            pouchDBService.getObject("welcomeMsg").then(function (data1) {
                $scope.welcomeMsg = data1.welcomeMsg;
            }, function (err) { })
        }

        pouchDBService.getObject("localNotif").then(function (data2) {
            $scope.isNotificationUnread = data2.isUnread;
        }, function (data2) {
            $scope.isNotificationUnread = "no";
        })

    }


    if (l_userName == "" || l_userCode == '' || l_aapType == '') {
        $state.go('login');
    } else {
        // $ionicBackdrop.retain();
        // $timeout(function() {
        //     $ionicBackdrop.release();
        // }, 9000);

        // DDD
        // document.addEventListener('deviceready', function () {
        // alert("platform getting redy");
        $ionicPlatform.ready(function () {

            // alert("platform ready")
            // Don't forget to add the org.apache.cordova.device plugin!
            // if (device.platform === 'iOS') {
            //     scheme = 'twitter://';
            // } else if (device.platform === 'Android') {
            // scheme = 'com.twitter.android';

            // var sApp = startApp.set({
            //     "application": "'com.twitter.android"
            // });
            // }

            pouchDBService.initDB();
            globalObjectServices.callLocalNotification($scope.url, l_aapType, l_userCode);
            reloadDashbord();
            // $rootScope.fw = $nlFramework;
            $rootScope.drawer = $nlFramework.drawer;
            $rootScope.fab = $nlFramework.fab;
            var nlOptions = {
                speed: 0.4,
                animation: 'ease',
                actionButton: true,
                toast: false,
                burger: {
                    use: true,
                    endY: 6,
                    startScale: 1, // X scale of bottom and top line of burger menu at starting point (OFF state)
                    endScale: 0.7 // X scale of bottom and top line of burger menu at end point (ON state)
                },
                drawer: {
                    maxWidth: 250,
                },
                secMenu: false
            };
            $nlFramework.init(nlOptions);
            // -----------------------------------------------------------------------------------------------

            console.log($scope.url + 'apptypelist?userCode=' + l_userCode);
            $http.get($scope.url + 'apptypelist?userCode=' + l_userCode).success(function (data) {
                $scope.appTypes = data.appTypes;
                if (data.entityCodes) {
                    $scope.entityCodes = data.entityCodes;
                    if (!$scope.entity_code) {
                        $scope.entity_code = $scope.entityCodes[0].code;
                    }

                }


                if ($scope.appTypes.length !== 1) {
                    $scope.sideMenu.appTypes_flag = true
                }
                pouchDBService.getObject("appTypes").then(function (data1) {
                    var temp = data1;
                    temp.appTypes = data.appTypes;
                    pouchDBService.updateJSON(temp);
                }, function (err) {
                    var temp = {};
                    temp.appTypes = data.appTypes;
                    temp._id = "appTypes";
                    pouchDBService.updateJSON(temp);
                })
            }).error(function (data, status) {
                pouchDBService.getObject("appTypes").then(function (data) {
                    $scope.appTypes = data.appTypes
                })
            })
            if (AuthServices.force_flag()) {

                $http.get($scope.url + 'forceNotification?userCode=' + l_userCode + "&seqNo=55").success(function (data) {
                    $scope.forceNotifList = data.model;
                    // $scope.forceNotifModal.show();
                    if ($scope.forceNotifList.length !== 0) {
                        $ionicModal.fromTemplateUrl('templates/ForceNotif.html', {
                            scope: $scope,
                            animation: 'animated slideInDown',
                            hideDelay: 1020
                        }).then(function (modal) {
                            $scope.forceNotifModal = modal;
                            $scope.forceNotifModal.show();
                        });
                    }
                })
            }




        });
    }

    $scope.toggleDrower = function () {
        if ($rootScope.drawer.openned) {
            // thedrawer is openned - close
            $rootScope.drawer.hide();
        } else {
            $rootScope.drawer.show();
        }
    }
    $scope.openBrowser = function () {
        var link = 'http://lighthouseindia.com';
        globalObjectServices.openWebLink(link);
    }
    $scope.openlink = function (link) {
        //  globalObjectServices.alertPopup("openLink")
        //  globalObjectServices.alertPopup(link);
        globalObjectServices.openWebLink(link);
    }

    $scope.openOtherApp = function () {
        var sApp = startApp.set({
            "component": ["com.lhs.foregroundexample", "com.lhs.foregroundexample.UnHideActivity"]
        }, {/* extras */
            "INTERVAL": 10000
        });
        sApp.start(function () { }, function (error) { /* fail */
            //  globalObjectServices.alertPopup(error);
        });
    }

    $scope.startLocTracAndHideActivity = function () {
        var sApp = startApp.set({
            "component": ["com.lhs.foregroundexample", "com.lhs.foregroundexample.StartLocTracAndHideActivity"]
        }, {/* extras */
            "INTERVAL": 10000
        });
        sApp.start(function () { }, function (error) { /* fail */
            //  globalObjectServices.alertPopup(error);
        });
    }


    $scope.entryList = function (value, seqNo, portlet_Id, table_desc, data_UPLOAD,
            updation_process, screenOrientionView, default_populate_data, firstScreen) {
        AuthServices.setAppSeqNo(seqNo);
        l_param.table = value;
        l_param.seqNo = seqNo;
        l_param.portlet_Id = portlet_Id;
        l_param.table_desc = table_desc;
        AuthServices.setAppSeqNo(l_param.seqNo);
        AuthServices.setData_UPLOAD(data_UPLOAD);
        AuthServices.setScreenOrientionView(screenOrientionView);
        l_param.default_populate_data = default_populate_data;
        l_param.updation_process = updation_process;
        l_param.firstScreen = firstScreen;
        $state.go('offlineEntryList', {
            obj: l_param
        });
        globalObjectServices.nativeTranstion("right");
    }

    $scope.pageDetails = function (firstScreen, value, seqNo, portlet_Id, table_desc,
            data_UPLOAD, updation_process, screenOrientionView, access_contrl, default_populate_data,
            dependent_next_entry_seq, replicate_fields, unique_message, update_key, replicate_rec,
            mandatory_to_start_portal, duplicate_row_value_allow, display_clause) {
        l_param.table = value;
        l_param.seqNo = seqNo;
        l_param.portlet_Id = portlet_Id;
        l_param.table_desc = table_desc;
        l_param.firstScreen = firstScreen;
        l_param.dependent_next_entry_seq = dependent_next_entry_seq;
        l_param.default_populate_data = default_populate_data;
        l_param.updation_process = updation_process;
        // l_param.updation_process = "I#V#U#"      ;
        l_param.replicate_fields = replicate_fields;
        l_param.replicate_rec = replicate_rec;
        l_param.access_contrl = access_contrl;
        l_param.unique_message = unique_message;
        // l_param.mandatory_to_start_portal = mandatory_to_start_portal;
        l_param.duplicate_row_value_allow = duplicate_row_value_allow;
        l_param.display_clause = display_clause;
        AuthServices.setAppSeqNo(l_param.seqNo);
        AuthServices.setData_UPLOAD(data_UPLOAD);
        AuthServices.setScreenOrientionView(screenOrientionView);
        //  globalObjectServices.alertPopup("tuyuee");

        // if (data_UPLOAD == "T") {
        //     cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
        //         if (!enabled) {
        //             var confirmPopup = $ionicPopup.confirm({
        //                 template: 'Please Allow to Access this device Location...',
        //                 cssClass: 'PopupStyle',
        //                 okType: 'button-balanced',
        //             });
        //             confirmPopup.then(function(res) {
        //                 if (res) {
        //                     if (typeof cordova.plugins.settings.openSetting != undefined) {
        //                         cordova.plugins.settings.open(function() {},
        //                             function() {
        //                                  globalObjectServices.alertPopup("failed to open settings..")
        //                             });
        //                     }
        //                 } else {}
        //             });
        //         } else {
        //             setPage();
        //         }
        //     })
        // } else {
        setPage();
        // }

        function setPage() {
            if (dependent_next_entry_seq != null && firstScreen != "I") {
                var l_obje = [];
                l_obje.seqNo = l_param.seqNo;
                var dates = new Date();
                var Inputdate = JSON.stringify($filter('date')(dates, 'dd-MM-yyyy'));
                l_obje.date2 = Inputdate.split('"').join('');
                l_obje.table_desc = l_param.table_desc;
                l_obje.updation_process = updation_process;
                l_obje.dependent_next_entry_seq = dependent_next_entry_seq;
                $state.go('entryList', {
                    obj: l_obje
                });
                globalObjectServices.nativeTranstion("right");
            } else {

                if (firstScreen == "C") {
                    $state.go('calendar', {
                        obj: l_param
                    });
                    globalObjectServices.nativeTranstion("right");
                } else {
                    if (firstScreen == "E" || firstScreen == "M") {
                        if (default_populate_data == null || default_populate_data == '') {
                            if (updation_process.charAt(0) == 'V') {
                                var l_obje = [];
                                l_obje.seqNo = l_param.seqNo;
                                var dates = new Date();
                                var Inputdate = JSON.stringify($filter('date')(dates, 'dd-MM-yyyy'));
                                l_obje.date2 = Inputdate.split('"').join('');
                                l_obje.table_desc = $scope.table_desc;
                                l_obje.updation_process = updation_process;
                                $state.go('entryList', {
                                    obj: l_obje
                                });
                                globalObjectServices.nativeTranstion("right");
                            } else {
                                if (access_contrl == 'D2') {
                                    $state.go('addUpdateEntryTable1');
                                } else if (access_contrl == 'D3') {
                                    $state.go('addUpdateEntryTable2');
                                } else {
                                    $state.go('addUpdateEntry');
                                }
                                globalObjectServices.nativeTranstion("right");
                            }
                        } else {
                            if (updation_process.charAt(0) == 'V') {
                                var l_obje = [];
                                l_obje.seqNo = l_param.seqNo;
                                var dates = new Date();
                                var Inputdate = JSON.stringify($filter('date')(dates, 'dd-MM-yyyy'));
                                l_obje.date2 = Inputdate.split('"').join('');
                                l_obje.table_desc = $scope.table_desc;
                                l_obje.updation_process = updation_process;
                                $state.go('entryList', {
                                    obj: l_obje
                                });
                                globalObjectServices.nativeTranstion("right");
                            } else {
                                l_param.types = 'P';
                                $state.go('addPopulatedEntry', {
                                    obj: l_param
                                });
                                globalObjectServices.nativeTranstion("right");
                            }
                        }
                    }
                    if (firstScreen == "G" || firstScreen == "T" || firstScreen == 1 || firstScreen == "CV") {
                        AuthServices.setPortletId(l_param.portlet_Id);
                        // if (firstScreen == "T") {
                        //     l_param.showTableFlag = 1;
                        // }
                        //  globalObjectServices.alertPopup("l_param.portlet_Id : " + l_param.portlet_Id);
                        $state.go('summaryReport', {
                            obj: l_param
                        });
                        globalObjectServices.nativeTranstion("right");
                    } else {
                        /*  if (firstScreen == "N") {
                         $state.go('notification'); */
                        // globalObjectServices.nativeTranstion("right");

                        if (firstScreen == "S") {
                            $state.go('shortReportType', {
                                obj: l_param
                            });
                            globalObjectServices.nativeTranstion("right");
                        } else {
                            if (firstScreen == "PO") {
                                l_param.type = "orderPopulated";
                                // l_param.types = 'O';
                                l_param.mandatory_to_start_portal = mandatory_to_start_portal
                                l_param.access_contrl = "PO";
                                l_param.firstScreen = firstScreen;
                                $state.go('addUpdateEntry', {
                                    obj: "next"
                                });
                                globalObjectServices.nativeTranstion("right");
                            } else {
                                //  globalObjectServices.alertPopup(firstScreen+"firstScreen");
                                if (firstScreen == "O") {
                                    l_param.type = "order";
                                    l_param.types = 'O';
                                    l_param.mandatory_to_start_portal = mandatory_to_start_portal;
                                    if (access_contrl == 'D2') {
                                        $state.go('addUpdateEntryTable1', {
                                            obj: "next"
                                        });
                                    } else if (access_contrl == 'D3') {
                                        $state.go('addUpdateEntryTable2', {
                                            obj: "next"
                                        });
                                    } else {
                                        $state.go('addUpdateEntry', {
                                            obj: "next"
                                        });
                                    }
                                    globalObjectServices.nativeTranstion("right");
                                } else {
                                    if (firstScreen == "I") {
                                        l_param.type = 'I';
                                        l_param.firstScreen = "I";
                                        if (access_contrl == 'D2') {
                                            $state.go('entryFormWithEntryListTable1', {
                                                obj: "next"
                                            });
                                        } else if (access_contrl == 'D3') {
                                            $state.go('entryFormWithEntryListTable2', {
                                                obj: "next"
                                            });
                                        } else {
                                            $state.go('entryFormWithEntryList', {
                                                obj: "next"
                                            });
                                        }

                                    } else {
                                        if (firstScreen == "Q") {
                                            l_param.type = 'Q';
                                            l_param.firstScreen = "Q";
                                            l_param.update_key = update_key;
                                            if (access_contrl == 'D2') {
                                                $state.go('addUpdateEntryTable1');
                                            } else if (access_contrl == 'D3') {
                                                $state.go('addUpdateEntryTable2');
                                            } else {
                                                $state.go('addUpdateEntry');
                                            }
                                        } else {
                                            if (firstScreen == "SE") {
                                                l_param.type = 'SE';
                                                l_param.firstScreen = "SE";
                                                l_param.update_key = update_key;
                                                if (access_contrl == 'D2') {
                                                    $state.go('searchEntryTable1');
                                                } else if (access_contrl == 'D3') {
                                                    $state.go('searchEntryTable2');
                                                } else {
                                                    $state.go('searchEntry');
                                                }
                                            } else {
                                                if (firstScreen == "EG") {
                                                    l_param.mandatory_to_start_portal = mandatory_to_start_portal;
                                                    l_param.type = "EG"
                                                    l_param.firstScreen = "EG";
                                                    $state.go('addUpdateEntry');
                                                } else {
                                                    if (firstScreen == "L") {
                                                        $state.go('addPopulatedLocationEntry', {
                                                            obj: l_param
                                                        });
                                                    } else {
                                                        if (firstScreen == "LT") {
                                                            $state.go('locationTracking');
                                                        } else {
                                                            if (firstScreen == "WL") {
                                                                openWebLink(unique_message);
                                                            } else if (firstScreen == 'H') {
                                                                $state.go('HotSeatEntry');
                                                            } else if (firstScreen == 'ED') {
                                                                $state.go('entryDetails');
                                                            } else if (firstScreen == 'IM') {
                                                                l_param.type = "IM"
                                                                l_param.firstScreen = firstScreen;
                                                                $state.go('addUpdateEntry');
                                                            }
                                                            // Search Entry
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    //}
                                }
                            }
                        }
                    }
                }
            }
            l_param.update_key = update_key;
            AuthServices.setTabParam(l_param);
        }
    }

    function openWebLink(link) {
        // link = link.replace("'strLoginID'", 'devesh');
        // link = link.replace("'strPassword'", 'ds@123');
        link = link.replace("'strLoginID'", AuthServices.userCode());
        link = link.replace("'strPassword'", AuthServices.password());
        /* var actionParam = item.actionParam;
         actionParam = actionParam.replace("'USER_CODE'", AuthServices.userCode());
         actionParam = actionParam.replace("'VRNO'", item.vrno);
         actionParam = actionParam.replace("'TCODE'", item.tcode);
         actionParam = actionParam.replace("'TNATURE'", item.tnature);
         actionParam = actionParam.replace("'EMP_CODE'", item.emp_CODE);
         actionParam = actionParam.replace("'APPR_TYPE'", item.appr_TYPE);
         actionParam = actionParam.replace("'TNATURE_NAME'", item.tnature_NAME);
         actionParam = actionParam.replace("'PASSWORD'", AuthServices.password); */

        // console.log(link);
        globalObjectServices.openWebLink(link);
    }

    $scope.openSetting = function () {
        $state.go('setting');
        globalObjectServices.nativeTranstion("right");
    };
    $scope.exitApp = function () {
        ionic.Platform.exitApp(); // Exit from app
    };
    $scope.setAppType = function (appType) {
        // $rootScope.drawer.hide();
        // data.user_code, data.userName, data.module, $scope.url, $scope.databaseUser,$scope.dbPassword,$scope.dbUrl,$scope.portNo
        AuthServices.login(l_userCode, l_userName, appType, $scope.url, $scope.entity_code, division_data, acc_year, dept_code, dbuser, dbpwd, dbUrl, portNo);
        // $state.go($state.current, {}, { reload: true, notify: true });
        l_aapType = appType;
        reloadDashbord();
    }

    $scope.setEntityCode = function (entityCode) {
        AuthServices.login(l_userCode, l_userName, l_aapType, $scope.url, entityCode, division_data, acc_year, dept_code, dbuser, dbpwd, dbUrl, portNo);
        $scope.entity_code = entityCode;
        reloadDashbord();
    }

    $scope.reloadDashbord = function () {
        reloadDashbord();
    }

    $scope.openNotificaton = function () {
        $state.go('notification');
    }

    $scope.logout = function () {
        AuthServices.logout();
        pouchDBService.getObject("sessionColumn12").then(function (data) {
            pouchDBService.deleteJSON(data);
        })
        $state.go('login');
        globalObjectServices.nativeTranstion("right");
    };
    $scope.seveFlag = function () {
        $scope.forceNotifModal.hide();
        AuthServices.setForce_flag(false);
    };
})

DynamicApp.controller('notifCtrl', function ($rootScope, $ionicPopover, $ionicModal, globalObjectServices, dataServices, pouchDBService,
        AuthServices, $state, $scope, $http, $cordovaInAppBrowser) {
    $scope.notificationList = {};
    var isUnread = "no";
    $ionicModal.fromTemplateUrl('templates/entryDetails.html', function (modal) {
        $scope.entryDetailsModal = modal
    }, {scope: $scope})

    $ionicPopover.fromTemplateUrl('template/notif-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $ionicModal.fromTemplateUrl('templates/archievedEntries.html', function (modal) {
        $scope.archievedEntriesModal = modal
    }, {scope: $scope})

    pouchDBService.getObject("localNotif").then(function (data) {
        $scope.notificationList.notifDetails = data.notifList
        $scope.notificationList.notifDetails.forEach(function (obj) { })
    }, function (data) { })

    $scope.notifiDeatils = function (seq_id) {
        $http.get($scope.url + 'getEntryDetailDyanamically?userCode=' + AuthServices.userCode() + "&tableSeqNo=55&entrySeqId=" + seq_id).success(function (data) {
            $scope.entryDetails = data;
            $scope.entryDetailsModal.show();
            ;
        })
    }

    $scope.$on('$destroy', function () {
        $scope.entryDetailsModal.remove();
        $scope.popover.remove();
        $scope.archievedEntriesModal.remove();
    })

    $scope.openPopover = function ($event, seq_id, index, isRead, item) {
        $scope.seq_id = seq_id;
        $scope.index = index;
        $scope.popover.show($event);
        $scope.isRead = isRead;
        $scope.itemValue = item;
    }

    $scope.archieveEntry = function (item, index) {
        var l_data = [];
        var temp = {};
        var id = "archieve_Data";
        l_data.push(item)
        $scope.deleteEntry(item, index);
        pouchDBService.getObject(id).then(function (data) {
            temp = data;
            if (l_data) {
                var list = l_data.concat(temp.arhieveList);
            }
            temp.arhieveList = list;
            pouchDBService.updateJSON(temp);
        }, function (err) {
            if (l_data) {
                temp.arhieveList = l_data;
            }
            temp._id = id;
            pouchDBService.updateJSON(temp);
        })
        globalObjectServices.displayCordovaToast("Notification Moved to Archive");
    }

    $scope.chckedIndexs = [];
    $scope.selectDiv = 0;
    $scope.selectDivValue = function (item) {
        $scope.selectDiv = 1;
    }
    $scope.recoverEntry = function () {
        $scope.selectDiv = 0;
        pouchDBService.getObject("archieve_Data").then(function (data) {
            $scope.arhieveList = data.arhieveList;
            $scope.arhieveList.forEach(function (obj) {
                if (obj.toggled) {
                    obj.toggled = false;
                }
            })
            if ($scope.chckedIndexs) {
                $scope.chckedIndexs = []
            }
        }, function (data) { })
        $scope.archievedEntriesModal.show();
    }

    $scope.selectItems = function (item, index) {
        if ($scope.chckedIndexs.indexOf(item) === -1) {
            $scope.chckedIndexs.push(item);
        } else {
            $scope.chckedIndexs.splice($scope.chckedIndexs.indexOf(item), 1);
        }
    }

    $scope.recoverdSelectedItems = function (index) {
        angular.forEach($scope.chckedIndexs, function (value, index) {
            var index = $scope.arhieveList.indexOf(value);
            $scope.arhieveList.splice($scope.arhieveList.indexOf(value), 1);
        });
        $scope.chckedIndexs.forEach(function (obj) {
            $scope.notificationList.notifDetails.push(obj);
        })
        $scope.deleteRecoveredEntry($scope.chckedIndexs);
        globalObjectServices.storeNotificationDataInPDB($scope.notificationList.notifDetails, isUnread);
        $scope.archievedEntriesModal.hide();
    }
    $scope.deleteRecoveredEntry = function (item) {
        $scope.chckedIndexs = [];
        $scope.arhieveList.forEach(function (obj) {
            if (obj.isRead == "no") {
                isUnread = "yes"
            }
        })
        var temp = {};
        pouchDBService.getObject("archieve_Data").then(function (data) {
            temp = data;
            temp.arhieveList = $scope.arhieveList;
            temp.isUnread = isUnread;
            pouchDBService.updateJSON(temp);
        }, function (err) {
            temp.arhieveList = $scope.arhieveList;
            temp._id = "archieve_Data";
            temp.isUnread = isUnread;
            pouchDBService.updateJSON(temp);
        })
    }

    $scope.markAsRead = function (item, index) {
        $scope.notificationList.notifDetails.forEach(function (obj) {
            if (obj.seq_id == item.seq_id) {
                obj.isRead = "yes"
            }
            if (obj.isRead == "no") {
                isUnread = "yes"
            }
        })
        var temp = {};
        pouchDBService.getObject("localNotif").then(function (dd) {
            temp = dd;
            temp.notifList = $scope.notificationList.notifDetails;
            temp.isUnread = isUnread;
            pouchDBService.updateJSON(temp);
        }, function (err) {
            temp.notifList = $scope.notificationList.notifDetails;
            temp._id = "localNotif";
            temp.isUnread = isUnread;
            pouchDBService.updateJSON(temp);
        })


        globalObjectServices.displayCordovaToast("Notification Marked As Read");
    }


    $scope.open = function (item, index) {
        var actionParam = item.actionParam;
        actionParam = actionParam.replace("'USER_CODE'", AuthServices.userCode());
        actionParam = actionParam.replace("'VRNO'", item.vrno);
        actionParam = actionParam.replace("'TCODE'", item.tcode);
        actionParam = actionParam.replace("'TNATURE'", item.tnature);
        actionParam = actionParam.replace("'EMP_CODE'", item.emp_CODE);
        actionParam = actionParam.replace("'APPR_TYPE'", item.appr_TYPE);
        actionParam = actionParam.replace("'TNATURE_NAME'", item.tnature_NAME);
        actionParam = actionParam.replace("'PASSWORD'", AuthServices.password);
        openWebLink(actionParam);
        // globalObjectServices.openWebLink(actionParam);
    }





    function openWebLink(actionParam) {

        var options = {
            location: 'no',
            clearcache: 'yes',
            toolbar: 'no'
        };
        $cordovaInAppBrowser.open(actionParam, '_blank', options).then(function (event) {
            console.log("cordovaInAppBrowser.open")
        }).catch(function (event) {

        });
        var count = 0;
        $rootScope.$on('$cordovaInAppBrowser:loadstart', function (e, event) {
            if (nameInterval && count !== 0) {
                count++;
                clearInterval(nameInterval);
            } else {
            }
        });
        $rootScope.$on('$cordovaInAppBrowser:loadstop', function (e, event) {
            nameInterval = setInterval(function () {
                console.log("setInterval");
                $cordovaInAppBrowser.executeScript({code: "document.getElementById('hiddenInput').innerHTML"}).then(function (values) {
                    // Do something here with your obtained value
                    if (values) {
                        $cordovaInAppBrowser.close();
                    }
                })
                count++;
            }, 500);
            // $rootScope.$on('$cordovaInAppBrowser:loaderror', function (e, event) {

            // });

            // $rootScope.$on('$cordovaInAppBrowser:exit', function (e, event) {
            // });


        })

    }




    $scope.markAsUnread = function (item, index) {
        $scope.notificationList.notifDetails.forEach(function (obj) {
            if (obj.seq_id == item.seq_id) {
                obj.isRead = "no";
                isUnread = "yes";
            }
        })
        var temp = {};
        pouchDBService.getObject("localNotif").then(function (dd) {
            temp = dd;
            temp.notifList = $scope.notificationList.notifDetails;
            temp.isUnread = isUnread;
            pouchDBService.updateJSON(temp);
        }, function (err) {
            temp.notifList = $scope.notificationList.notifDetails;
            temp._id = "localNotif";
            temp.isUnread = isUnread;
            pouchDBService.updateJSON(temp);
        })
        globalObjectServices.displayCordovaToast("Notification Marked As Unread");
    }

    $scope.deleteEntry = function (item, index) {
        $scope.notificationList.notifDetails.splice(index, 1);
        $scope.notificationList.notifDetails.forEach(function (obj) {
            if (obj.isRead == "no") {
                isUnread = "yes"
            }
        })
        var temp = {};
        pouchDBService.getObject("localNotif").then(function (dd) {
            temp = dd;
            temp.notifList = $scope.notificationList.notifDetails;
            // console.log(temp.notifList);
            temp.isUnread = isUnread;
            pouchDBService.updateJSON(temp);
        }, function (err) {
            temp.notifList = $scope.notificationList.notifDetails;
            temp._id = "localNotif";
            temp.isUnread = isUnread;
            pouchDBService.updateJSON(temp);
        })

    }

}) // CLOSE notifCtrl

DynamicApp.controller('settingCtrl', function ($rootScope, $ionicModal, globalObjectServices, dataServices, pouchDBService,
        AuthServices, $state, $scope, $http) {

    var l_appType = AuthServices.appType();
    $scope.dependentLov = [];
    $ionicModal.fromTemplateUrl('templates/offlineRefreshForm.html', function (modal) {
        $scope.offlineRefreshForm = modal;
    }, {
        scope: $scope
    });
    if ($rootScope.online) {
        globalObjectServices.showLoading();
        var url = $scope.url + 'tableDetailForOffline?appType=' + l_appType + '&userCode=' + AuthServices.userCode();
        $http.get(url).success(function (data) {
            $scope.offlineData = data.table_Detail;
            dataServices.setOfflineDashbordData(data.table_Detail, data.view_mode, l_appType);
            // $scope.offlineRefreshTab.show();
            globalObjectServices.hideLoading();
        }).error(function (data, status) {
            globalObjectServices.hideLoading();
            globalObjectServices.displayErrorMessage(status);
        })
    } else {
        globalObjectServices.displayCordovaToast('Network is not available Try again...')
    }


    // $scope.pageDetails = function (firstScreen, value, seqNo, portlet_Id, table_desc,
    //     data_UPLOAD, updation_process, screenOrientionView, access_contrl,
    //     default_populate_data, dependent_next_entry_seq) {
    $scope.pageDetails = function (item) {
        globalObjectServices.showLoading();
        $scope.table_desc = item.table_desc;
        $scope.lovs = [];
        $scope.dependentlovs = [];
        $scope.defaultPopulatedData = [];
        $scope.formData = [];
        var isLOV = false;
        $scope.seqNo = item.seqNo;
        var firstScreen = item.firstScreen;
        if (firstScreen == "E" || firstScreen == "C") {
            var l_url = $scope.url + 'addEntryForm?seqNo=' + $scope.seqNo + '&userCode=' + AuthServices.userCode() + '&searchText=' + '&accCode=' + AuthServices.acc_code();
            $http.get(l_url).success(function (data) {
                globalObjectServices.hideLoading();
                var formData = {};
                formData.data = data;
                formData.seqNo = $scope.seqNo;
                formData.table_desc = $scope.table_desc;
                $scope.formData.push(formData);
                data.recordsInfo.forEach(function (obj) {
                    if (obj.item_help_property == "L") {
                        if (obj.dependent_row == null) {
                            var url = $scope.url + 'getLOVDyanamically?uniqueID=' + $scope.seqNo +
                                    '&forWhichColmn=' + obj.column_name + "&userCode=" + AuthServices.userCode();
                            ;
                            var temp = {};
                            temp.lov = "";
                            temp.url = url;
                            temp.column_desc = obj.column_desc;
                            temp.column_name = obj.column_name;
                            temp.id = $scope.seqNo + obj.column_name;
                            $scope.lovs.push(temp);
                            isLOV = true;
                        } else {
                            var temp = {};
                            temp.lov = "";
                            temp.url = $scope.url + 'getLOVDyanamically?uniqueID=' + $scope.seqNo +
                                    '&whereClauseValue=' + "&userCode=" + AuthServices.userCode();
                            ;
                            temp.column_desc = obj.column_desc;
                            temp.column_name = obj.column_name;
                            temp.dependent_row = obj.dependent_row;
                            temp.dependent_row_logic = obj.dependent_row_logic;
                            data.recordsInfo.forEach(function (obj11) {
                                if (obj.dependent_row == obj11.column_name) {
                                    if (obj11.item_help_property == "H") {
                                        var dropdownVal = obj11.dropdownVal.split("#");
                                        var temp11 = [];
                                        dropdownVal.forEach(function (element) {
                                            var temp2 = element.split("~");
                                            temp11.push({
                                                name: temp2[1],
                                                code: temp2[0]
                                            });
                                        })

                                        temp.dependentLov = temp11;
                                    } else {
                                        temp.dependentLov = "";
                                    }
                                }
                            })
                            temp.id = $scope.seqNo + obj.column_name;
                            $scope.dependentlovs.push(temp);
                        }
                        isLOV = true;
                    }
                })
                if (isLOV) {
                    $scope.offlineRefreshForm.show();
                } else {
                    $scope.storeForm($scope.seqNo, data);
                }
            }).error(function (data, status) {
                globalObjectServices.displayErrorMessage(err)
            })
        }

        if (firstScreen == "O" || firstScreen == "PO") {
            var l_url = $scope.url + 'addEntryForm?seqNo=' + ((parseInt($scope.seqNo)) + 0.1) + '&userCode=' +
                    AuthServices.userCode() + '&accCode=' + AuthServices.acc_code() + '&searchText=';
            $http.get(l_url).success(function (data) {
                globalObjectServices.hideLoading();
                var formData = {};
                formData.data = data;
                formData.seqNo = ((parseInt($scope.seqNo)) + 0.1);
                formData.table_desc = $scope.table_desc + " " + 1;
                $scope.formData.push(formData);
                data.recordsInfo.forEach(function (obj) {

                    if (obj.dependent_row) {
                        data.recordsInfo.forEach(function (obj1) {
                            if (obj1.column_name == obj.dependent_row) {
                                if (obj.dependent_row_logic == "=") {
                                    if (obj1.codeOfValue != null) {
                                        obj.dependent_row_logic = obj1.codeOfValue;
                                    } else {
                                        if (obj1.value != null) {
                                            obj.dependent_row_logic = obj1.value;
                                        } else {
                                            obj.dependent_row_logic = "=";
                                        }
                                    }
                                }
                            }

                        })
                    }


                    if (obj.item_help_property == "L" || obj.item_help_property == "M") {
                        if (obj.dependent_row == null) {
                            var url = $scope.url + 'getLOVDyanamically?uniqueID=' + ((parseInt($scope.seqNo)) + 0.1) +
                                    '&forWhichColmn=' + obj.column_name + "&userCode=" + AuthServices.userCode();
                            ;
                            var temp = {};
                            temp.lov = "";
                            temp.url = url;
                            temp.column_desc = obj.column_desc;
                            temp.column_name = obj.column_name;
                            temp.id = ((parseInt($scope.seqNo)) + 0.1) + obj.column_name

                            $scope.lovs.push(temp);
                            if (obj.session_column_flag == 'P') {
                                temp.seqNo = ((parseInt($scope.seqNo)) + 0.1);
                                temp.dependentLov = "";
                                $scope.defaultPopulatedData.push(temp);
                            }
                            isLOV = true;
                        } else {
                            if (obj.dependent_row_logic && obj.dependent_row_logic !== '=' && !obj.dependent_row_logic.indexOf('#') > -1) {

                                var url = $scope.url + 'getLOVDyanamically?uniqueID=' + ((parseInt($scope.seqNo)) + 0.1) +
                                        '&forWhichColmn=' + obj.column_name + '&whereClauseValue=' + obj.dependent_row_logic + "&userCode=" + AuthServices.userCode();
                                var temp = {};
                                temp.lov = "";
                                temp.url = url;
                                temp.column_desc = obj.column_desc;
                                temp.column_name = obj.column_name;
                                temp.id = ((parseInt($scope.seqNo)) + 0.1) + obj.column_name + obj.dependent_row_logic;
                                $scope.lovs.push(temp);
                                if (obj.session_column_flag == 'P') {
                                    temp.seqNo = ((parseInt($scope.seqNo)) + 0.1);
                                    temp.dependentLov = "";
                                    $scope.defaultPopulatedData.push(temp);
                                }
                                isLOV = true;
                            } else {
                                var temp = {};
                                temp.lov = "";
                                temp.url = $scope.url + 'getLOVDyanamically?uniqueID=' + ((parseInt($scope.seqNo)) + 0.1) + "&userCode=" + AuthServices.userCode() +
                                        '&whereClauseValue=';
                                temp.column_desc = obj.column_desc;
                                temp.column_name = obj.column_name;
                                temp.dependent_row = obj.dependent_row;
                                temp.dependent_row_logic = obj.dependent_row_logic;
                                data.recordsInfo.forEach(function (obj11) {
                                    if (obj.dependent_row == obj11.column_name) {
                                        if (obj11.item_help_property == "H") {
                                            var dropdownVal = obj11.dropdownVal.split("#");
                                            var temp11 = [];
                                            dropdownVal.forEach(function (element) {
                                                var temp2 = element.split("~");
                                                temp11.push({
                                                    name: temp2[1],
                                                    code: temp2[0]
                                                });
                                            })
                                            temp.dependentLov = temp11;
                                        } else {
                                            temp.dependentLov = "";
                                        }
                                    }
                                })
                                temp.id = ((parseInt($scope.seqNo)) + 0.1) + obj.column_name;
                                if (obj.session_column_flag != 'P') {
                                    $scope.dependentlovs.push(temp);
                                } else {
                                    temp.seqNo = ((parseInt($scope.seqNo)) + 0.1);
                                    $scope.defaultPopulatedData.push(temp);
                                }

                            }
                        }
                    }
                })
                l_url = $scope.url + 'addEntryForm?seqNo=' + ((parseInt($scope.seqNo)) + 0.2) + '&userCode=' +
                        AuthServices.userCode() + '&searchText=' + '&accCode=' + AuthServices.acc_code();
                $http.get(l_url).success(function (data) {
                    globalObjectServices.hideLoading();
                    var formData = {};
                    formData.data = data;
                    formData.seqNo = ((parseInt($scope.seqNo)) + 0.2);
                    formData.table_desc = $scope.table_desc + " " + 2;
                    $scope.formData.push(formData);
                    data.recordsInfo.forEach(function (obj) {
                        if (obj.item_help_property == "L") {
                            if (obj.dependent_row == null) {
                                var url = $scope.url + 'getLOVDyanamically?uniqueID=' + ((parseInt($scope.seqNo)) + 0.2) + "&userCode=" + AuthServices.userCode() +
                                        '&forWhichColmn=' + obj.column_name;
                                var temp = {};
                                temp.lov = "";
                                temp.url = url;
                                temp.column_desc = obj.column_desc;
                                temp.column_name = obj.column_name;
                                temp.id = ((parseInt($scope.seqNo)) + 0.2) + obj.column_name
                                $scope.lovs.push(temp);
                                isLOV = true;
                            } else {
                                var temp = {};
                                temp.lov = "";
                                temp.url = $scope.url + 'getLOVDyanamically?uniqueID=' + ((parseInt($scope.seqNo)) + 0.2) + "&userCode=" + AuthServices.userCode() +
                                        '&whereClauseValue=';
                                temp.column_desc = obj.column_desc;
                                temp.column_name = obj.column_name;
                                temp.dependent_row = obj.dependent_row;
                                temp.dependent_row_logic = obj.dependent_row_logic;
                                data.recordsInfo.forEach(function (obj11) {
                                    if (obj.dependent_row == obj11.column_name) {
                                        if (obj11.item_help_property == "H") {
                                            var dropdownVal = obj11.dropdownVal.split("#");
                                            var temp11 = [];
                                            dropdownVal.forEach(function (element) {
                                                var temp2 = element.split("~");
                                                temp11.push({
                                                    name: temp2[1],
                                                    code: temp2[0]
                                                });
                                            })

                                            temp.dependentLov = temp11;
                                        } else {
                                            temp.dependentLov = "";
                                        }
                                    }
                                })
                                temp.id = ((parseInt($scope.seqNo)) + 0.2) + obj.column_name;
                                $scope.dependentlovs.push(temp);
                            }
                        }
                    })

                    if (isLOV) {
                        $scope.offlineRefreshForm.show();
                    } else {
                        $scope.formData.forEach(function (obj) {
                            $scope.storeForm(obj.seqNo, obj.data);
                        })
                    }
                }).error(function (data, status) {
                    globalObjectServices.displayErrorMessage(status)
                })
            }).error(function (data, status) {
                globalObjectServices.displayErrorMessage(status)
            })
        }
    }
    $scope.storeForm = function (seqNo, formData) {
        dataServices.setOfflineForm(seqNo, formData).then(function (data) {
            globalObjectServices.displayCordovaToast('Form saved successfully...')
        }, function (err) { });
    }
    $scope.storeLov = function (item) {
        $http.get(item.url).success(function (lovData) {
            $scope.lov = lovData.locationList;
            $scope.lovs.forEach(function (data) {
                if (data.column_desc == item.column_desc) {
                    data.lov = $scope.lov;
                    $scope.dependentlovs.forEach(function (data1) {
                        if (data1.dependent_row == item.column_name) {
                            data1.dependentLov = $scope.lov;
                        }
                    })

                    $scope.defaultPopulatedData.forEach(function (data1) {
                        if (data1.column_name == item.column_name) {
                            data1.dependentLov = $scope.lov;
                        }
                    })
                }
            })
            dataServices.storeLOV($scope.lov, item.id).then(function (data) {
                globalObjectServices.displayCordovaToast('Data saved successfully...')
            }, function (err) { })
        }).error(function (data, status) {
            globalObjectServices.displayErrorMessage(status)
        })
    }

    $scope.storeDefaultPopulatedData = function (item, value) {
        var seqNo = (item.seqNo + 0.1).toFixed(1);
        var url = $scope.url + 'addEntryForm?seqNo=' + seqNo + '&userCode=' +
                AuthServices.userCode() + '&accCode=' + AuthServices.acc_code() + '&searchText=' + value;
        console.log(url);
        $http.get(url).success(function (data) {
            console.log(data.defaultPopulateData)
            dataServices.setOfflineDefaultPopulatedData(seqNo, data, value).then(function (data) {
                globalObjectServices.displayCordovaToast('Form saved successfully...')
            }, function (err) { });
        })
    }

    $scope.storeDependentLov = function (item, value) {

        var url = item.url + value + "&forWhichColmn=" + item.column_name + "&userCode=" + AuthServices.userCode();
        ;
        $http.get(url).success(function (lovData) {
            $scope.lov = lovData.locationList;
            $scope.lovs.forEach(function (data) {
                if (data.column_desc == item.column_desc) {
                    data.lov = $scope.lov;
                    $scope.dependentlovs.forEach(function (data1) {
                        if (data1.dependent_row == item.column_name) {
                            data1.dependentLov = $scope.lov;
                        }
                    })
                }
            })

            $scope.dependentlovs.forEach(function (data) {
                if (data.column_desc == item.column_desc) {
                    data.lov = $scope.lov;
                    $scope.dependentlovs.forEach(function (data1) {
                        if (data1.dependent_row == item.column_name) {
                            data1.dependentLov = $scope.lov;
                        }
                    })
                }
            })
            dataServices.storeLOV($scope.lov, (item.id + value)).then(function (data) {
                globalObjectServices.displayCordovaToast('Data saved successfully...')
            }, function (err) { })
        }).error(function (data, status) {
            globalObjectServices.displayErrorMessage(status)
        })
    }
    $scope.$on('$destroy', function () {
        $scope.offlineRefreshForm.remove();
    });
})

DynamicApp.controller('locationTrackingCtrl', function ($interval, AuthServices, $scope) {
    // console.log("1");
    var lt = this;
    var sp = AuthServices.tabParam();
    var interval = "";
    lt.disableTracking = AuthServices.isLocationTracking();
    lt.table_desc = sp.table_desc;
    lt.isStart = AuthServices.isLocationTracking();
    lt.start = function () {
        if (sp.replicate_fields) {
            interval = 1000 * 60 * parseInt(sp.replicate_fields); // convert milliseconds to mint 
            if (interval) {
                AuthServices.setLocationTracking(true);
                lt.disableTracking = AuthServices.isLocationTracking();
                // lt.isStart = true;
                //  globalObjectServices.alertPopup("INTERVAL : " + sp.replicate_fields +
                //     "USERCODE : " + AuthServices.userCode() +
                //     "ENTITYCODE : " + AuthServices.entity_code() +
                //     "DBUSER : " +   AuthServices.databaseUser() +
                //     "DBPASSWORD : " + AuthServices.dbPassword() +
                //     "SEQNO : " + AuthServices.appSeqNo() +
                //     "DBURL : " + AuthServices.dbUrl() +
                //     "DBPORTNO : " + AuthServices.portNo());
                //  globalObjectServices.alertPopup(AuthServices.isLocationTracking());
                //  globalObjectServices.alertPopup(AuthServices.dbUrl())
                var sApp = startApp.set({
                    "component": ["com.lhs.foregroundexample", "com.lhs.foregroundexample.StartLocTracAndHideActivity"]
                }, {/* extras */
                    "INTERVAL": interval,
                    "USERCODE": AuthServices.userCode(),
                    "ENTITYCODE": AuthServices.entity_code(),
                    "DBUSER": AuthServices.databaseUser(),
                    "DBPASSWORD": AuthServices.dbPassword(),
                    "SEQNO": AuthServices.appSeqNo(),
                    "DBURL": AuthServices.dbUrl(),
                    "DBPORTNO": AuthServices.portNo(),
                    "URL": $scope.url
                });
                sApp.start(function () {

                }, function (error) { /* fail */
                    //  globalObjectServices.alertPopup(error);
                });
            } else {
                globalObjectServices.displayCordovaToast("Interval is not defined");
            }
        } else {
            globalObjectServices.displayCordovaToast("Interval is not defined");
        }
    }

    lt.stop = function () {
        // $interval.cancel(interval);
        // lt.isStart = false;
        AuthServices.setLocationTracking(false);
        lt.disableTracking = AuthServices.isLocationTracking();
        var sApp = startApp.set({
            "component": ["com.lhs.foregroundexample", "com.lhs.foregroundexample.UnHideActivity"]
        });
        sApp.start(function () {

        }, function (error) { /* fail */
            //  globalObjectServices.alertPopup(error);
        });
    }

    // function callAtInterval() {
    //     globalObjectServices.getLatLngLocTim().then(function(data) {
    //         // http://192.168.100.143:8080/DynamicAppWS/webService/CPT/192.168.100.10/1521/NA/NA/GPStracking?seqNo=1&userCode=SHASHANK&lat=30&lng=30&location=trimurti%20nager&deviceId=&DeviceName=
    //         var url = $scope.url + "GPStracking?seqNo=" + AuthServices.appSeqNo() + "&userCode=" + AuthServices.userCode() +
    //             "&lat=" + data.l_latitude + "&lng=" + data.l_longitude +
    //             "&location=" + data.l_location + "&locationDate=" + data.l_dateTime + '&deviceId=' + $scope.deviceID + '&DeviceName=' + $scope.deviceName;
    //         //  globalObjectServices.alertPopup("URL1     :    " + url);
    //         $http.get(url).success(function(dataa) {
    //             //  globalObjectServices.alertPopup("URL2     :   " + url);
    //             globalObjectServices.displayCordovaToast('Location saved successfully...')
    //         }).error(function(err, status) {
    //             //  globalObjectServices.alertPopup("LOCATION ERROR : " + err);
    //         })
    //     });
    // }

}) // locationTrackingCtrl Close

DynamicApp.controller('summaryReportCtrl', function ($state, $scope, $http, $filter, addUpdateEntryServices,
        AuthServices, globalObjectServices, reportAnalysisServices, $ionicModal, $location,
        $ionicScrollDelegate) {
    // var sp_obj = $state.params.obj;
    var sp_obj = AuthServices.tabParam();
    var login_params = AuthServices.login_params();
    // console.log(login_params)
    $scope.firstScreen = sp_obj.firstScreen;
    if (sp_obj.firstScreen == 1 || sp_obj.firstScreen == "T") {
        if (sp_obj.firstScreen == "T") {
            $scope.showSummaryValueFlag = 1;
        }
        $scope.showSummaryTabFlag = 1;
    }

    reportAnalysisServices.setTab($scope.url, sp_obj.seqNo, sp_obj.firstScreen).then(function (data) {
        $scope.graphTab = data;
        $scope.graphTab.forEach(function (obj) {
            obj.isProcessing = false;
            var lastUpdateVal = obj.lastupdate;
            if (obj.lastupdate) {
                if ((obj.lastupdate).indexOf("#")) {
                    var splitlastUpdate = lastUpdateVal.split("#");
                    if (splitlastUpdate[0] == "R") {
                        obj.colorVal = "red";
                    } else {
                        obj.colorVal = "none";
                    }
                    obj.lastupdate = splitlastUpdate[1];
                }
            }
        })
    }, function (err) {
        globalObjectServices.displayCordovaToast('Try Again..')
    })

    $scope.refreshSummaryValue = function (seq_no, reportingType) {
        $scope.graphTab.forEach(function (obj) {
            if (obj.seq_no == seq_no) {
                obj.isProcessing = true;
            }
        })

        $http.get($scope.url + 'CallLastUpdateProcedure?userCode=' + AuthServices.userCode() +
                '&seqId=' + seq_no + '&entityCode=' + AuthServices.entity_code() + '&divCode=' +
                AuthServices.division_data() + '&accYear=' + AuthServices.acc_year()).success(function (data) {
            $scope.graphTab.forEach(function (obj) {
                if (obj.seq_no == seq_no) {
                    obj.isProcessing = false;
                }
            })
            $state.reload();
            globalObjectServices.displayCordovaToast(data.status)
        }).error(function (data, status) {
            $scope.graphTab.forEach(function (obj) {
                if (obj.seq_no == seq_no) {
                    obj.isProcessing = false;
                }
            })
            globalObjectServices.displayErrorMessage(status)
        })
    };
    $ionicModal.fromTemplateUrl('static/templates/addEntryLOV.html', function (modal) {
        $scope.addEntryLOVModal = modal
    }, {
        scope: $scope
    })


    $scope.autoCalculationOfDuration = function (column_name, fields) {
        $scope.fields = globalObjectServices.autoCalculationOfDuration($scope.fields, column_name)
    }

    $scope.refreshSummaryValuePara = function (seq_no, reportingType, fields) {

        var key;
        var value;
        var jsonList = {};
        var setYear;
        fields.forEach(function (obj) {
            if (obj.item_help_property == "R") {
                if (obj.value == true) {
                    obj.value == globalObjectServices.getDate(obj.para_desc);
                    setYear = globalObjectServices.getDate(obj.para_desc);
                    //  globalObjectServices.alertPopup(setYear);
                }
            }
            if (obj.item_help_property == "C") {
                obj.value = $filter('date')(obj.value, "dd-MM-yyyy");
            }
            angular.forEach(obj, function (value1, key1) {
                if (key1 == "para_column") {
                    key = value1
                }
                if (key1 == "value") {
                    value = value1
                }
            })
            if (obj.item_help_property == "R") {
                value = setYear;
                console.log("value" + value);
            }
            jsonList[key] = value;
        })

        sp_obj.filteredParam = fields;
        // console.log(JSON.stringify(jsonList));


        // console.log(JSON.stringify($scope.url + 'filterRefreshReportData?userCode=' + AuthServices.userCode() +
        //     '&seqId=' + seq_no + '&entityCode=' + AuthServices.entity_code() + '&divCode=' +
        //     AuthServices.division_data() + '&accYear=' + AuthServices.acc_year() + "&JSON=" + jsonList));
        // console.log("filterRefreshReportData JSON : " + JSON.stringify(jsonList));
        $http.get($scope.url + 'filterRefreshReportData?userCode=' + AuthServices.userCode() +
                '&seqId=' + seq_no + '&entityCode=' + AuthServices.entity_code() + '&divCode=' +
                AuthServices.division_data() + '&accYear=' + AuthServices.acc_year() + "&JSON=" + JSON.stringify(jsonList)).success(function (data) {
            $scope.graphTab.forEach(function (obj) {
                if (obj.seq_no == seq_no) {
                    obj.isProcessing = false;
                }
            })
            $state.reload();
            globalObjectServices.displayCordovaToast(data.status)
        }).error(function (data, status) {
            $scope.graphTab.forEach(function (obj) {
                if (obj.seq_no == seq_no) {
                    obj.isProcessing = false;
                }
            })
            globalObjectServices.displayErrorMessage(status)
        })


    }


    $scope.openReportAnalysis = function (seq_no, reportingType, paginationFlag) {
        var l_graphObj = [];
        l_graphObj.seq_no = seq_no;
        l_graphObj.reportingType = reportingType;
        l_graphObj.firstScreen = sp_obj.firstScreen;
        sp_obj.filteredParam = {};
        l_graphObj.filteredParam = sp_obj.filteredParam;
        l_graphObj.paginationFlag = paginationFlag;
        l_graphObj.showDataInReportHead = [];
        l_graphObj.valueFormat = [];
        var valueFlag = [];
        var temVal = "";
        var dataTemp = AuthServices.valueFormat();
        if (dataTemp) {
            // for (let itemVal of dataTemp) {
            dataTemp.forEach(function (itemVal) {
                if (itemVal.seqId == seq_no) {
                    temVal = itemVal.selectedFormat;
                }
            })
        }
        if (sp_obj.firstScreen == "CV") {
            $state.go('reportCardView', {
                obj: l_graphObj
            });
        } else {
            globalObjectServices.showLoading();
            var l_url1 = $scope.url + "reportFilterForm?userCode=" + AuthServices.userCode() + '&seqNo=' + seq_no;
            $http.get(l_url1).success(function (data) {
                if (data.recordsInfo) {
                    data.recordsInfo.forEach(function (obj) {
                        if (obj.value && obj.showDataInReportHead == 'T') {
                            valueFlag.push({'value': obj.value});
                        }
                        if (obj.para_column == 'VALUE_FORMAT') {
                            if (temVal == "") {
                                temVal = obj.value;
                            }
                            l_graphObj.valueFormat.push({'para_desc': obj.para_desc, 'value': temVal, 'dropdownVal': obj.dropdownVal});
                        }
                    })
                    l_graphObj.showDataInReportHead = JSON.parse(JSON.stringify(valueFlag));
                }
                $scope.graphTab.forEach(function (item) {
                    if (item.seq_no == seq_no) {
                        item.status = false;
                    }
                })
                l_graphObj.recordInfo = data.recordsInfo;
                $state.go('report', {
                    obj: l_graphObj, seq_no: seq_no, valueFormat: temVal
                });
            })

        }
        globalObjectServices.nativeTranstion("right");
    };
    $scope.toggleRadio = function (key1, para_column, dependent_row) {
        $scope.fields.forEach(function (obj) {
            if (obj.item_help_property == "R") {
                if (obj.para_desc == key1) {
                    obj.value = true;
                } else {
                    if (obj.para_column == para_column)
                        obj.value = false;
                }
            }
            if (obj.item_help_property == dependent_row) {
                obj.disable = true;
            }
        })
    }

    $scope.openSlide = function (seq_no, status) {

        if (!status) {
            $http.get($scope.url + 'reportFilterForm?userCode=' + AuthServices.userCode() +
                    '&seqNo=' + seq_no).success(function (data) {
                addUpdateEntryServices.setDataCommon(data.recordsInfo).then(function (object) {
                    $scope.fields = object;
                    $scope.reportSeqNo = data.seqNo;
                    var count = 1;
                    $scope.fields.forEach(function (obj) {
                        obj.column_name = "col" + count;
                        count++;
                        if (obj.para_column == "VALUE_FORMAT") {
                            obj.hideValueFormat = "true";
                        }
                    })
                    $location.hash("item_" + seq_no);
                    $ionicScrollDelegate.anchorScroll();
                    $scope.graphTab.forEach(function (item) {
                        if (item.seq_no == seq_no) {
                            item.status = !item.status;
                        } else {
                            if (!status) {
                                item.status = status;
                            }
                        }
                    })
                })

            }).error(function (data, status) {

            })
        } else {
            $scope.graphTab.forEach(function (item) {
                if (item.seq_no == seq_no) {
                    item.status = !item.status;
                }
            })
        }
    }



    $scope.openLov = function (column_desc, column_name, dependent_row, dependent_row_logic, item_help_property) {
        globalObjectServices.showLoading();
        $scope.lov = "";
        $scope.column_desc = column_desc;
        $scope.column_name = column_name;
        $scope.flagLOVCodeValue = "";
        $scope.searchEntity.search = '';
        $scope.itemHelpPropertyFlag = item_help_property;
        addUpdateEntryServices.openLov(column_desc, column_name, dependent_row, dependent_row_logic,
                item_help_property, $scope.lov, $scope.url, $scope.reportSeqNo, true).then(function (result) {
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

    // $scope.setLOVValues = function (code, name, column_desc, dependent_row, rowID) {
    //     $scope.fields = addUpdateEntryServices.setLOVValues(code, name, column_desc,
    //         dependent_row, rowID, $scope.fields, sp_obj.seqNo, sp_obj.type, $scope.url)
    //     $scope.addEntryLOVModal.hide();
    //     globalObjectServices.scrollTop();
    // }

    /* To set Lov Values */
    $scope.setLOVValues = function (code, name, column_desc, dependent_row, rowID, dependent_value) {
        $scope.fields = addUpdateEntryServices.setLOVValues(code, name, column_desc,
                dependent_row, rowID, $scope.fields, sp_obj.seqNo, sp_obj.type, $scope.url);
        // $scope.dependent_nullable_logic(name, dependent_row, $scope.fields, $scope.url, sp_obj.seqNo, dependent_value);
        $scope.addEntryLOVModal.hide();
        // globalObjectServices.scrollTop();
    }

    $scope.$on('$destroy', function () {
        $scope.addEntryLOVModal.remove().then(function () {
            $scope.addEntryLOVModal = null;
        })
    });
})

DynamicApp.controller('reportAnalysisCtrl', function ($state, $stateParams, $ionicModal,
        $scope, $http, AuthServices, globalObjectServices, $filter) {
    var initDate = new Date();
    // console.log((new Date().getTime() - initDate.getTime()) / 10000)
    // $scope.valueFormatData = "";
    var sp_obj = $state.params.obj;
    $scope.paginationFlag = sp_obj.paginationFlag;
    $scope.filteredParam = sp_obj.filteredParam;
    $scope.valueFormateIterator = sp_obj.showDataInReportHead;
    console.log(sp_obj)

    if (sp_obj.firstScreen == 1) {
        $scope.showTableFlag = 1;
    }
    $scope.selectedValues = "Table";
    $scope.flagForTypeChange = 4;
    $scope.valueFormatVal = "";
    // $scope.ReportList = [{
    //     "reportType": "Graph"
    // }, {
    //     "reportType": "Table"
    // }];
    $scope.ReportList = [];
    $scope.ReportList.push({reportType: "Table"});
    $scope.seriesData = [];
    $scope.labelData = [];
    var columnName = [];
    var l_graphData = "";
    var colors;
    var JSONvalue = {};
    JSONvalue.data = new Array();
    $scope.searchEntity = {};
    $scope.searchEntity.search = "";
    $ionicModal.fromTemplateUrl('templates/reportDrillDown.html', function (modal) {
        $scope.reportDrillDownModal = modal
    }, {scope: $scope})
    $ionicModal.fromTemplateUrl('templates/reportDetails.html', function (modal) {
        $scope.reportDetailsModal = modal
    }, {scope: $scope})

    var url = "";
    $scope.pageCount = 0;
    var graphDisplay = true;
    $scope.loadData = function (valueFormatData, showLoaderFlag) {
        $scope.searchPageCount = 0;
        // $scope.$apply(function () {
        $scope.flagforVerticleTable = 0;
        // })
        if (showLoaderFlag == "showLoader") {
            globalObjectServices.showLoading();
        } else {
            globalObjectServices.hideLoading();
        }
        var flagVal = "";
        if (valueFormatData) {
            if (valueFormatData == "clearData") {
                $scope.valueFormatData = $scope.valueFormatVal;
                flagVal = "true";
            } else {
                $scope.valueFormatData = valueFormatData;
            }
        } else {
            $scope.valueFormatData = "";
        }

        if (sp_obj.valueFormat && !$scope.valueFormatData && !flagVal) {
            $scope.valueFormatLength = sp_obj.valueFormat.length;
            // console.log($scope.valueFormatLength)
            // for (let obj of sp_obj.valueFormat) {
            //     if (obj.dropdownVal) {
            //         var dropdownVal = obj.dropdownVal.split("#");
            //         var temp1 = [];
            //         for (let element of dropdownVal) {
            //             var temp2 = element.split("~");
            //             temp1.push({ name: temp2[1], code: temp2[0] });
            //         }
            //         obj.dropdownVal = temp1;
            //         if (obj.value) {
            //             for (let obj1 of temp1) {
            //                 if (obj1.name == obj.value) {
            //                     obj.value = obj1.code;
            //                     obj.codeOfValue = null;
            //                 }
            //             }
            //         }
            //     }
            //     $scope.valueFormatArray = obj.dropdownVal;
            //     $scope.valueFormatVal = obj.value;
            // }

            //  for (let obj of sp_obj.valueFormat) {
            sp_obj.valueFormat.forEach(function (obj) {
                if (obj.dropdownVal) {
                    var dropdownVal = obj.dropdownVal.split("#");
                    var temp1 = [];
                    // for (let element of dropdownVal) {
                    dropdownVal.forEach(function (element) {
                        var temp2 = element.split("~");
                        temp1.push({name: temp2[1], code: temp2[0]});
                    })
                    obj.dropdownVal = temp1;
                    if (obj.value) {
                        // for (let obj1 of temp1) {
                        temp1.forEach(function (obj1) {
                            if (obj1.name == obj.value) {
                                obj.value = obj1.code;
                                obj.codeOfValue = null;
                            }
                        })
                    }

                }
                $scope.valueFormatArray = obj.dropdownVal;
                $scope.valueFormatVal = obj.value;
            })

        }
        if (!$scope.searchEntity.search) {
            $scope.searchEntity.search = "";
        }
        if (valueFormatData) {
            url = $scope.url + "tableLabelPagedDetail?seqNo=" + sp_obj.seq_no + '&userCode=' + AuthServices.userCode() + "&pageNo=" + $scope.pageCount + "&valueFormat=" + $scope.valueFormatData + "&searchText=" + $scope.searchEntity.search;
        } else {
            url = $scope.url + "tableLabelPagedDetail?seqNo=" + sp_obj.seq_no + '&userCode=' + AuthServices.userCode() + "&pageNo=" + $scope.pageCount + "&valueFormat=" + $scope.valueFormatVal + "&searchText=" + $scope.searchEntity.search;
        }
        // if ($scope.paginationFlag == 'T') {
        //     if (valueFormatData) {
        //         url = $scope.url + "tableLabelPagedDetail?seqNo=" + sp_obj.seq_no + '&userCode=' + AuthServices.userCode() + "&pageNo=" + $scope.pageCount + "&valueFormat=" + $scope.valueFormatData;
        //     } else {
        //         url = $scope.url + "tableLabelPagedDetail?seqNo=" + sp_obj.seq_no + '&userCode=' + AuthServices.userCode() + "&pageNo=" + $scope.pageCount + "&valueFormat=" + $scope.valueFormatVal;
        //     }
        // } else {
        //     url = $scope.url + "tableLabelPagedDetail?seqNo=" + sp_obj.seq_no + '&userCode=' + AuthServices.userCode() + "&pageNo="
        // }

        console.log("l_url===" + url);
        $http.get(url).success(function (data) {
            $scope.graphGabelDetail = data.graphGabelDetail;
            if (showLoaderFlag == "showLoader") {
                globalObjectServices.hideLoading();
            }
            l_graphData = angular.copy(data.graphGabelDetail);
            $scope.graphGabelDetail.forEach(function (temp) {
                $scope.detailLabelData = temp.graphLabelData;
                $scope.tableheader = temp.series;
                $scope.columnWidth = temp.columnWidth;
                $scope.columnAlignment = temp.columnAlignment;
                $scope.noOfColumns = temp.noOfColumns;
                columnName = temp.columnName;
                $scope.horizontalTableData = globalObjectServices.transpose($scope.detailLabelData);
                $scope.myTableData = [];
                $scope.tableValue = [];
                if ($scope.detailLabelData.length == 1) {
                    $scope.flagforVerticleTable = 1;
                    var i = 0;
                    $scope.detailLabelData.forEach(function (obj2) {
                        temp.series.forEach(function (obj1) {
                            $scope.tableValue.push({
                                "series": obj1,
                                "value": obj2[i]
                            });
                            i++;
                        })
                    })
                }
                $scope.detailLabelData.forEach(function (obj) {
                    var temp = [];
                    var count = 0;
                    obj.forEach(function (obj2) {
                        var a = {};
                        a[count] = obj2
                        temp.push(a)
                        count++;
                    })
                    $scope.myTableData.push(temp);
                })
                if (temp.graphDisplayFlag == 'G') {
                    if (graphDisplay) {
                        $scope.ReportList.push({reportType: "Graph"});
                        graphDisplay = false;
                    }
                }
            })
            calculate();
        }).error(function (data, status) {
            globalObjectServices.hideLoading();
            globalObjectServices.displayErrorMessage(status);
        })

    }
    $scope.loadData();
    $scope.changeValueFormat = function (selectedFormat) {
        var tempValdata = [];
        var valueFlag = "false";
        $scope.valueFormatVal = selectedFormat;
        tempValdata = AuthServices.valueFormat();
        if (tempValdata) {
            tempValdata.forEach(function (itemVal) {
                //   for (let itemVal of tempValdata) {
                if (itemVal.seqId == sp_obj.seq_no) {
                    itemVal.selectedFormat = selectedFormat;
                } else {
                }
            })
        } else {
            tempValdata = [];
            valueFlag = "true";
            tempValdata.push({"seqId": sp_obj.seq_no, "selectedFormat": selectedFormat});
        }
        if (tempValdata) {
            if (valueFlag == "true") {
            } else {
                tempValdata.push({"seqId": sp_obj.seq_no, "selectedFormat": selectedFormat});
            }
            AuthServices.setLocalData(tempValdata);
        }
        $scope.loadData(selectedFormat, "showLoader");
    }
    $scope.reportDetails = function () {
        $scope.reportValues = sp_obj.recordInfo;
        console.log($scope.reportValues)
        $scope.reportDetailsModal.show();
    }
    function calculate() {
        $scope.hashIndex = [];
        var lastRow = [];
        var lastRow1 = [];
        var lastRow2 = [];
        var lastRow3 = [];
        for (var i = 0; i < $scope.tableheader.length; i++) {
            if (($scope.tableheader[i]).indexOf('#') > -1) {
                var th = $scope.tableheader[i].split("#");
                if (th[1] == "T" || th[1] == "A" || th[1] == "C" || th[2] == "T" || th[2] == "A" || th[2] == "C") {
                    var tempAvgCount = 1;
                    $scope.detailLabelData.forEach(function (obj) {
                        if (th[1] == "T") {
                            if (lastRow1[i]) {

                                lastRow1[i] = "TOTAL : " + Math.round((parseFloat(lastRow1[i].split(":")[1]) + parseFloat(obj[i])) * 1000) / 1000;
                            } else {
                                lastRow1[i] = "TOTAL : " + parseFloat(obj[i]);
                            }
                        }
                        if (th[2] == "T") {
                            if (lastRow2[i]) {
                                lastRow2[i] = "TOTAL : " + Math.round((parseFloat(lastRow2[i].split(":")[1]) + parseFloat(obj[i])) * 1000) / 1000;
                            } else {
                                lastRow2[i] = "TOTAL : " + parseFloat(obj[i]);
                            }

                        }
                        if (th[3] == "T") {
                            if (lastRow3[i]) {
                                lastRow3[i] = "TOTAL : " + Math.round((parseFloat(lastRow3[i].split(":")[1]) + parseFloat(obj[i])) * 1000) / 1000;
                            } else {
                                lastRow3[i] = "TOTAL : " + parseFloat(obj[i]);
                            }
                        }
                        if (th[1] == "A") {
                            if (lastRow1[i]) {
                                lastRow1[i] = (parseFloat(lastRow1[i].split(":")[1]) * (parseFloat(tempAvgCount) - 1)) + parseFloat(obj[i]);
                                lastRow1[i] = "AVERAGE : " + Math.round((parseFloat(lastRow1[i]) / (parseFloat(tempAvgCount))) * 1000) / 1000;
                            } else {
                                lastRow1[i] = "AVERAGE : " + parseFloat(obj[i]);
                            }
                        }
                        if (th[2] == "A") {
                            if (lastRow2[i]) {
                                lastRow2[i] = (parseFloat(lastRow2[i].split(":")[1]) * (parseFloat(tempAvgCount) - 1)) + parseFloat(obj[i]);
                                lastRow2[i] = "AVERAGE : " + Math.round((parseFloat(lastRow2[i]) / (parseFloat(tempAvgCount))) * 1000) / 1000;
                            } else {
                                lastRow2[i] = "AVERAGE : " + parseFloat(obj[i]);
                            }

                        }
                        if (th[3] == "A") {
                            if (lastRow3[i]) {
                                lastRow3[i] = (parseFloat(lastRow3[i].split(":")[1]) * (parseFloat(tempAvgCount) - 1)) + parseFloat(obj[i]);
                                lastRow3[i] = "AVERAGE : " + Math.round((parseFloat(lastRow3[i]) / (parseFloat(tempAvgCount))) * 1000) / 1000;
                            } else {
                                lastRow3[i] = "AVERAGE : " + parseFloat(obj[i]);
                            }

                        }
                        if (th[1] == "C") {
                            if (lastRow1[i]) {
                                lastRow1[i] = "COUNT : " + (parseFloat(lastRow1[i].split(":")[1]) + parseFloat(1));
                            } else {
                                lastRow1[i] = "COUNT : " + 1;
                            }
                        }
                        if (th[2] == "C") {
                            if (lastRow2[i]) {
                                lastRow2[i] = "COUNT : " + (parseFloat(lastRow2[i].split(":")[1]) + parseFloat(1));
                            } else {
                                lastRow2[i] = "COUNT : " + 1;
                            }
                        }
                        if (th[3] == "C") {
                            if (lastRow3[i]) {
                                lastRow3[i] = "COUNT : " + (parseFloat(lastRow3[i].split(":")[1]) + parseFloat(1));
                            } else {
                                lastRow3[i] = "COUNT : " + 1;
                            }
                        }
                        tempAvgCount++;
                    })
                    var temp = $scope.horizontalTableData[i];
                    var tot;
                    var avg;
                    var cal = 0;
                    if (th[1] == "T" || th[2] == "T" || th[3] == "T") {
                        temp.forEach(function (obj1) {
                            if (tot) {
                                if (parseFloat(obj1)) {
                                    tot = Math.round((parseFloat(tot) + parseFloat(obj1)) * 1000) / 1000;
                                }
                            } else {
                                tot = parseFloat(obj1);
                            }
                        })
                    }


                    if (th[1] == "A" || th[2] == "A" || th[3] == "A") {
                        var tempCountAvg = 1;
                        temp.forEach(function (obj1) {
                            if (avg || avg == '0') {
                                // if (parseFloat(obj1)) {
                                avg = Math.round((((parseFloat(avg) * (tempCountAvg - 1)) + parseFloat(obj1)) / tempCountAvg) * 1000) / 1000;
                                // }
                            } else {
                                avg = parseFloat(obj1);
                            }
                            tempCountAvg++;
                        })
                    }

                    if (th[1] == "C" || th[2] == "C" || th[3] == "C") {
                        temp.forEach(function (obj1) {
                            if (cal) {
                                cal = parseFloat(cal) + 1;
                            } else {
                                cal = 1;
                            }
                        })
                    }
                    if (tot) {
                        temp.push("TOTAL : " + tot);
                        tot = "";
                    }
                    if (avg) {
                        temp.push(("AVERAGE : " + avg));
                        avg = "";
                    }
                    if (cal) {
                        temp.push(("COUNT : " + cal));
                        cal = "";
                    }
                    if (parseFloat(th[1])) {
                        $scope.hashIndex[i] = $scope.tableheader[i].split("#")[1];
                    } else {
                        $scope.hashIndex[i] = "NA";
                    }
                } else {
                    $scope.hashIndex[i] = $scope.tableheader[i].split("#")[1];
                }
                $scope.tableheader[i] = $scope.tableheader[i].split("#")[0];
            } else {
                $scope.hashIndex[i] = "NA";
                lastRow[i] = null;
            }
            if (lastRow1[i]) {
                lastRow[i] = lastRow1[i];
            }
            if (lastRow2[i]) {
                if (lastRow[i]) {
                    lastRow[i] = lastRow[i] + " " + lastRow2[i];
                } else {
                    lastRow[i] = lastRow2[i];
                }
            }
            if (lastRow3[i]) {
                if (lastRow[i]) {
                    lastRow[i] = lastRow[i] + " " + lastRow3[i];
                } else {
                    lastRow[i] = lastRow3[i];
                }
            }
        }
        if (lastRow) {
            $scope.detailLabelData.push(lastRow);
        }
        console.log("end cal" + (new Date().getTime() - initDate.getTime()) / 10000);
    }

    function calculateTableData(tableheader) {
        var lastRow = [];
        var lastRow1 = [];
        var lastRow2 = [];
        var lastRow3 = [];
        for (var i = 0; i < tableheader.length; i++) {
            if ((tableheader[i]).indexOf('#') > -1) {
                var th = tableheader[i].split("#");
                if (th[1] == "T" || th[1] == "A" || th[1] == "C" || th[2] == "T" || th[2] == "A" || th[2] == "C") {
                    var tempAvgCount = 1;
                    $scope.detailLabelData.forEach(function (obj) {
                        if (th[1] == "T") {
                            if (lastRow1[i]) {
                                lastRow1[i] = "TOTAL : " + Math.round((parseFloat(lastRow1[i].split(":")[1]) + parseFloat(obj[i])) * 1000) / 1000;
                            } else {
                                lastRow1[i] = "TOTAL : " + parseFloat(obj[i]);
                            }
                        }
                        if (th[2] == "T") {
                            if (lastRow2[i]) {
                                lastRow2[i] = "TOTAL : " + Math.round((parseFloat(lastRow2[i].split(":")[1]) + parseFloat(obj[i])) * 1000) / 1000;
                            } else {
                                lastRow2[i] = "TOTAL : " + parseFloat(obj[i]);
                            }

                        }
                        if (th[3] == "T") {
                            if (lastRow3[i]) {
                                lastRow3[i] = "TOTAL : " + Math.round((parseFloat(lastRow3[i].split(":")[1]) + parseFloat(obj[i])) * 1000) / 1000;
                            } else {
                                lastRow3[i] = "TOTAL : " + parseFloat(obj[i]);
                            }
                        }
                        if (th[1] == "A") {
                            if (lastRow1[i]) {
                                lastRow1[i] = (parseFloat(lastRow1[i].split(":")[1]) * (parseFloat(tempAvgCount) - 1)) + parseFloat(obj[i]);
                                lastRow1[i] = "AVERAGE : " + Math.round((parseFloat(lastRow1[i]) / (parseFloat(tempAvgCount))) * 1000) / 1000;
                            } else {
                                lastRow1[i] = "AVERAGE : " + parseFloat(obj[i]);
                            }
                        }
                        if (th[2] == "A") {
                            if (lastRow2[i]) {
                                lastRow2[i] = (parseFloat(lastRow2[i].split(":")[1]) * (parseFloat(tempAvgCount) - 1)) + parseFloat(obj[i]);
                                lastRow2[i] = "AVERAGE : " + Math.round((parseFloat(lastRow2[i]) / (parseFloat(tempAvgCount))) * 1000) / 1000;
                            } else {
                                lastRow2[i] = "AVERAGE : " + parseFloat(obj[i]);
                            }

                        }
                        if (th[3] == "A") {
                            if (lastRow3[i]) {
                                lastRow3[i] = (parseFloat(lastRow3[i].split(":")[1]) * (parseFloat(tempAvgCount) - 1)) + parseFloat(obj[i]);
                                lastRow3[i] = "AVERAGE : " + Math.round((parseFloat(lastRow3[i]) / (parseFloat(tempAvgCount))) * 1000) / 1000;
                            } else {
                                lastRow3[i] = "AVERAGE : " + parseFloat(obj[i]);
                            }

                        }
                        if (th[1] == "C") {
                            if (lastRow1[i]) {
                                lastRow1[i] = "COUNT : " + (parseFloat(lastRow1[i].split(":")[1]) + parseFloat(1));
                            } else {
                                lastRow1[i] = "COUNT : " + 1;
                            }
                        }
                        if (th[2] == "C") {
                            if (lastRow2[i]) {
                                lastRow2[i] = "COUNT : " + (parseFloat(lastRow2[i].split(":")[1]) + parseFloat(1));
                            } else {
                                lastRow2[i] = "COUNT : " + 1;
                            }
                        }
                        if (th[3] == "C") {
                            if (lastRow3[i]) {
                                lastRow3[i] = "COUNT : " + (parseFloat(lastRow3[i].split(":")[1]) + parseFloat(1));
                            } else {
                                lastRow3[i] = "COUNT : " + 1;
                            }
                        }
                        tempAvgCount++;
                    })
                    var temp = $scope.horizontalTableData[i];
                    var tot;
                    var avg;
                    var cal = 0;
                    if (th[1] == "T" || th[2] == "T" || th[3] == "T") {
                        temp.forEach(function (obj1) {
                            if (tot) {
                                if (parseFloat(obj1)) {
                                    tot = Math.round((parseFloat(tot) + parseFloat(obj1)) * 1000) / 1000;
                                }
                            } else {
                                tot = parseFloat(obj1);
                            }
                        })
                    }

                    if (th[1] == "A" || th[2] == "A" || th[3] == "A") {
                        var tempCountAvg = 1;
                        temp.forEach(function (obj1) {
                            if (avg || avg == '0') {
                                // if (parseFloat(obj1)) {
                                avg = Math.round((((parseFloat(avg) * (tempCountAvg - 1)) + parseFloat(obj1)) / tempCountAvg) * 1000) / 1000;
                                // }
                            } else {
                                avg = parseFloat(obj1);
                            }
                            tempCountAvg++;
                        })
                    }
                    if (th[1] == "C" || th[2] == "C" || th[3] == "C") {
                        temp.forEach(function (obj1) {
                            if (cal) {
                                cal = parseFloat(cal) + 1;
                            } else {
                                cal = 1;
                            }
                        })
                    }
                    if (tot) {
                        temp.push("TOTAL : " + tot);
                        tot = "";
                    }
                    if (avg) {
                        temp.push(("AVERAGE : " + avg));
                        avg = "";
                    }
                    if (cal) {
                        temp.push(("COUNT : " + cal));
                        cal = "";
                    }
                    $scope.horizontalTableData[i] = temp;
                }
            } else {
                lastRow[i] = null;
            }

            if (lastRow1[i]) {
                lastRow[i] = lastRow1[i];
            }
            if (lastRow2[i]) {
                if (lastRow[i]) {
                    lastRow[i] = lastRow[i] + " " + lastRow2[i];
                } else {
                    lastRow[i] = lastRow2[i];
                }
            }
            if (lastRow3[i]) {
                if (lastRow[i]) {
                    lastRow[i] = lastRow[i] + " " + lastRow3[i];
                } else {
                    lastRow[i] = lastRow3[i];
                }
            }
        }
        if (lastRow) {
            $scope.detailLabelData.push(lastRow);
        }
    }




    $scope.loadMoreTableData = function (searchFlag, searchText) {
        globalObjectServices.showLoading();
        if (searchFlag) {
            $scope.searchPageCount++;
            url = $scope.url + "tableLabelPagedDetail?seqNo=" + sp_obj.seq_no + '&userCode=' + AuthServices.userCode() + "&pageNo=" + $scope.searchPageCount + "&valueFormat=" + $scope.valueFormatVal + "&searchText=" + searchText;
        } else {
            $scope.pageCount++;
            url = $scope.url + "tableLabelPagedDetail?seqNo=" + sp_obj.seq_no + '&userCode=' + AuthServices.userCode() + "&pageNo=" + $scope.pageCount + "&valueFormat=" + $scope.valueFormatVal + "&searchText=" + searchText;
        }


        $http.get(url).success(function (data) {
            $scope.graphGabelDetail = data.graphGabelDetail;
            $scope.graphGabelDetail.forEach(function (obj) {
                var popData = false;
                var popdataCount = 0;
                var popDataIndex;
                if (obj.graphLabelData.length > 0) {

                    obj.series.forEach(function (series_obj) {
                        if (series_obj.indexOf('#') > -1) {
                            popData = series_obj;
                            popDataIndex = popdataCount;
                            $scope.detailLabelData.pop();
                        }
                        popdataCount++
                    })
                    l_graphData.forEach(function (objj) {
                        objj.graphLabelData = objj.graphLabelData.concat(obj.graphLabelData);
                    })
                    // l_graphData.graphLabelData = l_graphData.graphLabelData.concat(obj.graphLabelData);
                    $scope.detailLabelData = $scope.detailLabelData.concat(obj.graphLabelData);
                    var temp2 = globalObjectServices.transpose(obj.graphLabelData);
                    var coutnt = 0;
                    var temp = [];
                    $scope.horizontalTableData.forEach(function (obj) {
                        if (popDataIndex == coutnt) {
                            if (popData) {
                                if (popData.indexOf('#T') > -1) {
                                    obj.pop();
                                }
                                if (popData.indexOf('#C') > -1) {
                                    obj.pop();
                                }
                                if (popData.indexOf('#A') > -1) {
                                    obj.pop();
                                }
                            }
                        }
                        obj = obj.concat(temp2[coutnt]);
                        temp[coutnt] = obj;
                        coutnt++;
                    })
                    $scope.horizontalTableData = temp;
                    calculateTableData(obj.series);
                } else {
                    globalObjectServices.displayCordovaToast("No more data available");
                }
            })
            globalObjectServices.hideLoading();
        }).error(function (data, status) {
            globalObjectServices.hideLoading();
            globalObjectServices.displayErrorMessage(status)
        })
    }



    $scope.searchData = function (searchText) {

        this.searchEntity.search = searchText;
        $scope.loadData("clearData", "showLoader");
    }




    $scope.openPageByType = function (l_type) {
        if (l_type == "Table") {
            $scope.flagForTypeChange = 4;
        } else if (l_type == "Graph" && (sp_obj.firstScreen == 'G')) {
            $scope.flagForTypeChange = 5;
            $http.get($scope.url + 'graphDetail?portletId=' + AuthServices.portlet_Id() + '&seqNo=' + sp_obj.seq_no).success(function (data) {
                data.graphDetail.forEach(function (temp) {
                    $scope.graphTypeList = temp.graphTypeList;
                    $scope.series = temp.series;
                    colors = temp.color;
                    for (var i = 0; i < colors.length; i++) {
                        var colors_item = colors[i];
                        var border_item = colors[i];
                        JSONvalue.data.push({
                            backgroundColor: colors_item,
                            borderColor: border_item,
                        });
                    }
                    $scope.colors = (JSONvalue.data);
                    $scope.data = globalObjectServices.transpose(temp.graphdata);
                    $scope.labels = ["JAN", "FEB", "MAR"];
                    var l_length = Object.keys($scope.data).length;
                    $scope.aggregateData = globalObjectServices.aggregate((temp.graphdata), l_length);
                })
            }).error(function (data, status) {
                globalObjectServices.displayErrorMessage(status)
            })
        } else if (l_type == "Graph" && (sp_obj.firstScreen == 'T')) {
            $scope.flagForTypeChange = 5;
            $scope.graphTypeLis = [];
            // $scope.graphTypeList = [{
            //     "graphType": "Bar Chart"
            // }, {
            //         "graphType": "Line Chart"
            //     }];
            l_graphData.forEach(function (temp) {
                // $scope.graphTypeLis.push({ graphType: "Bar Chart" });
                if ($scope.flagforVerticleTable == 1) {
                    $scope.graphTypeList = [{
                            "graphType": "Bar Chart"
                        }];
                } else {
                    $scope.graphTypeList = [{
                            "graphType": "Bar Chart"
                        }, {
                            "graphType": "Line Chart"
                        }];
                }

                $scope.data = [];
                var l_data = globalObjectServices.transpose(temp.graphLabelData);
                $scope.labels = [];
                var value_tosend = [];
                $scope.colors = [{
                        backgroundColor: "#28a54c",
                        borderColor: "#28a54c"
                    }]
                var i = 0;
                l_data.forEach(function (obj) {
                    if (i < $scope.noOfColumns)
                        if ((obj)) {
                            value_tosend.push(obj);
                            $scope.labels.push(temp.series[i].split("#")[0]);
                        }
                    i++
                })
                var l_length = Object.keys(value_tosend).length;
                var aggregate = globalObjectServices.aggregate((value_tosend), l_length);
                $scope.data.push(aggregate);
            })
        }
    };
    $scope.reportDetail = {};
    $scope.tableDesc = function (index, slNo) {
        var value = angular.copy($scope.detailLabelData[index]);
        for (var i = 0; i < value.length; i++) {
            value[i] = value[i].replace('&', '^');
            columnName[i] = columnName[i].replace('&', '^');
        }
        $http.get($scope.url + 'reportDrillDownGrid?seqId=' + sp_obj.seq_no + "&value=" + value +
                '&slNo=' + slNo + "&columnName=" + columnName).success(function (data) {
            $scope.reportDetail.tableHeader = data.tableHeader;
            $scope.reportDetail.tableData = data.tableData
            $scope.reportHeading = data.para_desc;
            $scope.reportDrillDownModal.show();
        })
    }

    $scope.reportingType = sp_obj.reportingType;
    $scope.selectedChart = "Bar Chart";
    $scope.datasetOverride = [{
            yAxisID: 'y-axis-1'
        }, {
            yAxisID: 'y-axis-2'
        }];
    $scope.labels = ["JAN", "FEB", "MAR"];
    $scope.options = {
        responsive: true
    };
    $scope.flagForPageChange = 1;
    $scope.optionForLine = {
        scales: {
            yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }, {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: true,
                    position: 'right'
                }]
        }
    };
    $scope.changeGraph = function (l_graphtype) {
        if (l_graphtype == "Pie Chart") {
            $scope.flagForPageChange = 2;
        } else if (l_graphtype == "Line Chart") {
            $scope.flagForPageChange = 3;
        } else if (l_graphtype == "Bar Chart") {
            $scope.flagForPageChange = 1;
        }
    };
    $scope.sortOrderby = function (index, data1) {
        $scope.currentFilter = data1;
        $scope.reverse = !$scope.reverse;
        var reverse = true;
        var temp = $filter('orderBy')($scope.myTableData, index, reverse);
        $scope.myTableData = temp;
        $scope.detailLabelData = globalObjectServices.sortOrderby(index, data1,
                $scope.myTableData, $scope.detailLabelData);
    }
    $scope.flagForTableView = 1;
    $scope.changeTableview = function (tableView) {
        if (tableView == true) {
            $scope.flagForTableView = 0
        } else {
            $scope.flagForTableView = 1
        }
    }

    // $scope.anchorScroll = function (to) {
    //     //  globalObjectServices.alertPopup(to);
    //     globalObjectServices.searchLovbyAlpha(to);
    // };

    $scope.anchorScroll = function (to) {
        //  globalObjectServices.alertPopup(to);
        globalObjectServices.anchorScroll(to);
    };
    $scope.anchorSbottom = function (to) {
        $scope.anchorS = 'bottom';
    };
    $scope.anchorStop = function (to) {
        $scope.anchorS = 'top';
    };
    $scope.anchorScrollR = function (to) {
        var myDiv = document.getElementById(to);
        myDiv.scrollLeft = myDiv.scrollWidth;
    }

    $scope.anchorScrollL = function (to) {
        var myDiv = document.getElementById(to);
        myDiv.scrollLeft = 0;
    }


    $scope.$on('$destroy', function () {
        $scope.reportDrillDownModal.remove().then(function () {
            $scope.reportDrillDownModal = null;
        })
    });
    console.log("end cal" + (new Date().getTime() - initDate.getTime()) / 10000);
}) ///reportAnalysisCtrl



DynamicApp.controller('offlineEntryListCtrl', function (AuthServices, $filter, $state, $rootScope,
        $stateParams, $ionicModal, $scope, globalObjectServices, $ionicPopover, dataServices, pouchDBService) {

    var sp_obj = $state.params.obj;
    $scope.flagForUpdateButton = 'U#';
    $scope.flagForApproveButton = '';
    $scope.flagForDeleteButton = 'D#';
    $scope.flagForUploadButton = "UP#";
    $scope.flagForUploadAllButton = 'UPA#';
    var l_flagforPopulatedForm = 1;
    if (sp_obj.default_populate_data == null || sp_obj.default_populate_data == '' ||
            sp_obj.default_populate_data == "null") {
        $scope.flagForUploadAllButton = 'UPA#';
    } else {
        $scope.flagForUploadAllButton = "";
        l_flagforPopulatedForm = 0;
    }

    if (sp_obj.firstScreen == "PO") {
        $scope.flagForUpdateButton = '';
        $scope.flagForApproveButton = '';
        $scope.flagForDeleteButton = 'D#';
        $scope.flagForUploadButton = "UP#";
        $scope.flagForUploadAllButton = '';
    }

    $ionicPopover.fromTemplateUrl('templates/optionPopOver.html', {
        scope: $scope,
    }).then(function (optionPopOver) {
        $scope.optionPopOver = optionPopOver;
    });
    $scope.entryDetail = []
    var fieldsTH = "";
    var defaultPopulateDataLength = "";
    var uploadEntryStatus = "";
    var id = "entrySeqNo" + AuthServices.appSeqNo();
    pouchDBService.getObject(id).then(function (data) {
        // var tempDate = $filter('date')(new Date(), 'MM-dd-yyyy hh:mm:ss');
        // data.entryList.push({ column_desc: "DATE", column_name: "DATE", column_type: "DATE", entry_by_user: "F", value: tempDate });
        $scope.listOfEntries = data.entryList;
        fieldsTH = data.fieldsTH;
        defaultPopulateDataLength = data.defaultPopulateDataLength;
        uploadEntryStatus = data.uploadEntryStatus;
        if ($scope.listOfEntries[0].headEntry) {
            $scope.flagForUploadAllButton = "";
        }
    }, function (err) { });
    $scope.uploadAllEntry = function () {
        if ($rootScope.online) {
            dataServices.uploadAllEntry($scope.listOfEntries, sp_obj.seqNo, $scope.url).then(function (data) {
                $scope.deleteAllEntry();
                globalObjectServices.displayCordovaToast('Entry uploaded sucessfully...')
            }, function (err) {
                globalObjectServices.displayCordovaToast('Try Again..')
            });
        } else {
            globalObjectServices.displayCordovaToast('Network is not available...')
        }
    }

    $scope.uploadEntry = function (item, index) {
        if ($rootScope.online) {
            if (l_flagforPopulatedForm == 0 || sp_obj.firstScreen == "PO") {
                sp_obj.seqNo + 0.2;
                dataServices.uploadAllEntry(item, (parseInt(sp_obj.seqNo) + 0.2).toFixed(1), $scope.url).then(function (data) {
                    if (data.status == "insert data") {
                        deleteEntry(item, index);
                        globalObjectServices.displayCordovaToast('Entry uploaded sucessfully...')
                    } else {
                        globalObjectServices.displayCordovaToast(data.status);
                    }

                }, function (err) {
                    globalObjectServices.displayCordovaToast('Try Again..')
                });
                console.log(item + " ------------- " + index)
            } else {

                if (item.headEntry) {
                    var temp = "offlineEntry";
                    var tempSeqNo = (parseInt(sp_obj.seqNo) + 0.1)
                    dataServices.uploadEntry(item.headEntry, tempSeqNo, $scope.url, temp).then(function (data) {
                        tempSeqNo = (parseInt(sp_obj.seqNo) + 0.2)
                        if (item.orderEntry == "") {
                            deleteEntry(item, index);
                            globalObjectServices.displayCordovaToast('Entry uploaded sucessfully...')
                        } else {
                            dataServices.uploadAllEntry(item.orderEntry, tempSeqNo, $scope.url, temp).then(function (data) {
                                deleteEntry(item, index);
                                globalObjectServices.displayCordovaToast('Entry uploaded sucessfully...')
                            }, function (err) {
                                globalObjectServices.displayCordovaToast('Try Again..')
                            });
                        }
                    }, function (err) {
                        globalObjectServices.displayCordovaToast('Try Again..');
                    });
                } else {
                    dataServices.uploadEntry(item, sp_obj.seqNo, $scope.url).then(function (data) {
                        globalObjectServices.displayCordovaToast('Entry uploaded sucessfully...')
                        deleteEntry(item, index);
                    }, function (err) {
                        globalObjectServices.displayCordovaToast('Try Again..')
                    });
                }

            }
        } else {
            globalObjectServices.displayCordovaToast('Network is not available...')
        }
    }

    $scope.deleteEntry = function (item, index) {
        globalObjectServices.confirmationPopup('Do you want to Delete Entry?').then(function (data) {
            if (data == 'ok') {
                deleteEntry(item, index);
            } else {
            }
        })
    }

    function deleteEntry(item, index) {
        dataServices.deleteEntry(item, sp_obj.seqNo, index).then(function (data) {
            pouchDBService.getObject(id).then(function (data) {
                $scope.listOfEntries = data.entryList;
                $scope.optionPopOver.hide();
            }, function (err) {
                globalObjectServices.displayCordovaToast('Try Again..')
            });
        }, function (err) {
            globalObjectServices.displayCordovaToast('Try Again..')
        });
    }

    $scope.deleteAllEntry = function () {
        dataServices.deleteAllEntry(sp_obj.seqNo).then(function (data) {
            pouchDBService.getObject(id).then(function (data) {
                $scope.listOfEntries = data.entryList;
                $scope.optionPopOver.hide();
            }, function (err) {
                globalObjectServices.displayCordovaToast('Try Again..')
            });
        }, function (err) {
            globalObjectServices.displayCordovaToast('Try Again..')
        });
    }
    $scope.openPopover = function ($event, item, index) {
        $scope.item = item;
        $scope.index = index
        $scope.optionPopOver.show($event)
    }
    $scope.openUpdateEntry = function (listData, index) {
        $scope.optionPopOver.hide();
        var l_param = [];
        l_param.headEntry = listData.headEntry;
        l_param.orderEntry = listData.orderEntry;
        l_param.recordsInfo = listData;
        l_param.index = index;
        l_param.updation_process = ""
        l_param.table_desc = sp_obj.table_desc;
        l_param.type = "offlineUpdateEntry";
        if (sp_obj.firstScreen == 'O') {
            l_param.flagFororder = 1;
        } else {
            l_param.flagFororder = 0;
        }
        if (uploadEntryStatus) {
            l_param.defaultPopulateDataLength = defaultPopulateDataLength;
            l_param.uploadEntryStatus = uploadEntryStatus;
            l_param.fieldsTH = fieldsTH;
            $state.go('addPopulatedLocationEntry', {
                obj: l_param
            });
        } else {
            if (l_flagforPopulatedForm == 0) {
                l_param.types = 'P';
                l_param.fieldsTH = fieldsTH;
                $state.go('addPopulatedEntry', {
                    obj: l_param
                });
                globalObjectServices.nativeTranstion("right");
            } else {
                AuthServices.setTabParam(l_param);
                $state.go('addUpdateEntry');
                globalObjectServices.nativeTranstion("right");
            }
        }
    }
}) // offlineEntryListCtrl Close


DynamicApp.controller('entryListCtrl', function (AuthServices, $filter, $state,
        $stateParams, $ionicModal, $scope, $http, addUpdateEntryServices,
        globalObjectServices, $ionicPopover, $rootScope) {
    // globalObjectServices.showLoading();
    var sp_obj = $state.params.obj; // State Parameter from calendarCtrl
    var l_param = AuthServices.tabParam();
    $scope.flagForUpdateButton = '';
    $scope.flagForApproveButton = '';
    $scope.flagForDeleteButton = '';
    $ionicPopover.fromTemplateUrl('templates/optionPopOver.html', {
        scope: $scope,
    }).then(function (optionPopOver) {
        $scope.optionPopOver = optionPopOver;
    });
    $scope.entryDetail = [];
    if ((sp_obj.updation_process).indexOf('U') > -1) {
        $scope.flagForUpdateButton = 'U#';
    }
    if ((sp_obj.updation_process).indexOf('A') > -1) {
        $scope.flagForApproveButton = 'A#';
    }
    if ((sp_obj.updation_process).indexOf('D') > -1) {
        $scope.flagForDeleteButton = 'D#';
    }

    $scope.firstScreen = sp_obj.firstScreen;
    var l_selectedDate = ($filter('date')(sp_obj.date2, 'dd-MM-yyyy'))
    $ionicModal.fromTemplateUrl('templates/entryDetails.html', function (modal) {
        $scope.entryDetailsModal = modal
    }, {
        scope: $scope
    })

    $scope.loadEntry = function () {
        globalObjectServices.showLoading();
        if ($rootScope.online) {
            var url = $scope.url + 'dynamicEntryList?userCode=' + AuthServices.userCode() +
                    '&reportingDate=' + l_selectedDate + '&seqNo=' + sp_obj.seqNo;
            console.log(url);
            $http.get(url).success(function (data) {
                $scope.listOfEntries = data
                if ($scope.listOfEntries == "") {
                    globalObjectServices.hideLoading();
                    globalObjectServices.displayCordovaToast('Entries not available...')
                }
                globalObjectServices.hideLoading();
            }).error(function (data, status) {
                $scope.listOfEntries = "";
                globalObjectServices.hideLoading();
                globalObjectServices.displayErrorMessage(status)
            })
        } else {
            globalObjectServices.hideLoading();
            globalObjectServices.displayCordovaToast('Can not fetch Entry List in OFFLINE mode...')
        }
    }


    $scope.loadEntry();
    $scope.getEntryDetails = function (listData) {
        globalObjectServices.showLoading();
        if (sp_obj.types == 'P') {
            var l_obj = [];
            l_obj.seqNo = sp_obj.seqNo;
            l_obj.listData = listData;
            globalObjectServices.hideLoading();
            $state.go('entryDetailsInTabular', {
                obj: l_obj
            })
            globalObjectServices.nativeTranstion("right");
        } else {
            var l_seqId = "";
            listData.forEach(function (obj) {
                // if (obj.column_name == "SEQ_ID") {
                //     l_seqId = obj.value;
                // }
                if (obj.column_name == l_param.update_key || obj.column_name == obj.update_key) {
                    l_param.update_key_value = obj.value;
                    l_param.update_key_codeOfValue = obj.codeOfValue
                    $scope.seqId = obj.value;
                }
            })
            var updateKeyValue
            if (l_param.update_key_codeOfValue) {
                updateKeyValue = l_param.update_key_codeOfValue;
            } else {
                updateKeyValue = l_param.update_key_value;
            }

            var url = $scope.url + 'getEntryDetailDyanamically?tableSeqNo=' + sp_obj.seqNo +
                    '&entrySeqId=' + l_seqId + "&updateKey=" + updateKeyValue

            console.log(url);
            $http.get(url).success(function (data) {
                globalObjectServices.hideLoading();
                $scope.entryDetails = data;
                $scope.entryDetailsModal.show();
                $scope.seqId = l_seqId;
            }).error(function (data, status) {
                globalObjectServices.displayErrorMessage(status)
            })
        }
    }

    $scope.openPopover = function ($event, item) {
        $scope.item = item;
        $scope.optionPopOver.show($event)
    }

    $scope.openUpdateEntry = function (listData) {

        listData.forEach(function (obj) {
            if (obj.column_name == l_param.update_key || obj.column_name == obj.update_key) {
                l_param.update_key_value = obj.value;
                l_param.update_key_codeOfValue = obj.codeOfValue
                $scope.seqId = obj.value;
            }
        })
        if (sp_obj.types == 'P' || sp_obj.types == 'O' || $scope.firstScreen == 'PO') {
            var l_obj = [];
            // if()
            l_obj.seqNo = sp_obj.seqNo;
            l_obj.listData = listData;
            l_obj.types = sp_obj.types;
            l_obj.firstScreen = $scope.firstScreen;
            $state.go('entryDetailsInTabular', {
                obj: l_obj
            })
            globalObjectServices.nativeTranstion("right");
        } else {
            // var l_param = AuthServices.tabParam();
            l_param.seqId = $scope.seqId;
            l_param.fileId = $scope.fileId;
            l_param.table_desc = sp_obj.table_desc;
            l_param.type = "Update";
            l_param.types = sp_obj.types;
            l_param.dependent_next_entry_seq = sp_obj.dependent_next_entry_seq;
            AuthServices.setTabParam(l_param);
            if (sp_obj.access_contrl == 'D2') {
                $state.go('addUpdateEntryTable1');
            } else if (sp_obj.access_contrl == 'D3') {
                $state.go('addUpdateEntryTable2');
            } else {
                $state.go('addUpdateEntry');
            }
            // $state.go('addUpdateEntry');
            globalObjectServices.nativeTranstion("right");
        }
        $scope.entryDetailsModal.hide();
    }

    $scope.openUpdateEntryEntryList = function (listData) {
        $scope.optionPopOver.hide();
        listData.forEach(function (obj) {
            if (obj.column_name == "SEQ_ID") {
                $scope.seqId = obj.value;
            }
        })
        // var l_param = AuthServices.tabParam();
        l_param.seqId = $scope.seqId;
        l_param.fileId = $scope.fileId;
        l_param.table_desc = sp_obj.table_desc;
        l_param.dependent_next_entry_seq = sp_obj.dependent_next_entry_seq;
        l_param.type = "Update";
        AuthServices.setTabParam(l_param);
        if (sp_obj.access_contrl == 'D2') {
            $state.go('addUpdateEntryTable1');
        } else if (sp_obj.access_contrl == 'D3') {
            $state.go('addUpdateEntryTable2');
        } else {
            $state.go('addUpdateEntry');
        }
        // $state.go('addUpdateEntry');
        globalObjectServices.nativeTranstion("right");
        $scope.entryDetailsModal.hide();
    }

    // Navigate to ADD_ENTRY module
    $scope.addEntry = function () {
        var l_obje = [];
        l_obje.type = "addEntry";
        l_obje.table_desc = sp_obj.table_desc;
        AuthServices.setTabParam(l_param);
        if (sp_obj.access_contrl == 'D2') {
            $state.go('addUpdateEntryTable1');
        } else if (sp_obj.access_contrl == 'D3') {
            $state.go('addUpdateEntryTable2');
        } else {
            $state.go('addUpdateEntry');
        }
        // $state.go('addUpdateEntry');
        globalObjectServices.nativeTranstion("right");
    }

    // Delete Entry
    $scope.deleteEntry = function (item, index) {
        var l_seqId = '';
        item.forEach(function (obj) {
            if (obj.column_name == obj.update_key) {
                l_seqId = obj.value;
            }
        })
        globalObjectServices.confirmationPopup('Do you want to Delete Entry?').then(function (data) {
            if (data == 'ok') {
                addUpdateEntryServices.deleteEntry(l_seqId, sp_obj.seqNo, $scope.url).then(function (data) {
                    $scope.listOfEntries = globalObjectServices.deleteEachRow($scope.listOfEntries, index)
                    globalObjectServices.displayCordovaToast('Entry Deleted Successfully..')
                }, function (err) {
                    globalObjectServices.displayErrorMessage(err);
                })
            } else {
            }
        })
    }


    $scope.searchEntry = function (searchText) {

        // http://192.168.100.145:8080/DynamicAppWS/webService/SM/NA/NA/VDEMOERP/VDEMOERP/searchedEntryList?userCode=SHASHANK&reportingDate=20-05-2017&fromDate=&toDate=&searchText=Birth&seqNo=14
        globalObjectServices.showLoading();
        if ($rootScope.online) {
            var url = $scope.url + 'searchedEntryList?userCode=' + AuthServices.userCode() +
                    '&reportingDate=' + l_selectedDate + '&seqNo=' + sp_obj.seqNo + "&fromDate=&toDate=&searchText=" + searchText;
            console.log(url);
            $http.get(url).success(function (data) {
                globalObjectServices.hideLoading();
                $scope.listOfEntries = data
                if ($scope.listOfEntries == "") {
                    globalObjectServices.displayCordovaToast('Entries not available...')
                }

            }).error(function (data, status) {
                $scope.listOfEntries = "";
                globalObjectServices.hideLoading();
                globalObjectServices.displayErrorMessage(status)
                globalObjectServices.displayCordovaToast('Can not fetch Entry List in OFFLINE mode...')
            })
        }
    }

    $scope.filterEntry = function (from_date, to_date) {

        // http://192.168.100.145:8080/DynamicAppWS/webService/SM/NA/NA/VDEMOERP/VDEMOERP/searchedEntryList?userCode=SHASHANK&reportingDate=20-05-2017&fromDate=&toDate=&searchText=Birth&seqNo=14

        if ($rootScope.online) {
            if (!from_date) {
                globalObjectServices.alertPopup("Please select  From Date");
            } else if (!to_date) {
                globalObjectServices.alertPopup("Please select  To Date");
            } else {
                from_date = $filter('date')(from_date, 'dd-MM-yyyy HH:mm:ss');
                to_date = $filter('date')(to_date, 'dd-MM-yyyy HH:mm:ss');
                if (to_date < from_date) {
                    globalObjectServices.alertPopup("Please select Valid Date");
                } else {
                    globalObjectServices.showLoading();
                    var url = $scope.url + 'searchedEntryList?userCode=' + AuthServices.userCode() +
                            '&reportingDate=' + l_selectedDate + '&seqNo=' + sp_obj.seqNo + "&fromDate=" + from_date + "&toDate=" + to_date + "&searchText=";
                    console.log(url);
                    $http.get(url).success(function (data) {
                        globalObjectServices.hideLoading();
                        $scope.listOfEntries = data
                        if ($scope.listOfEntries == "") {
                            globalObjectServices.displayCordovaToast('Entries not available...')
                        }

                    }).error(function (data, status) {
                        $scope.listOfEntries = "";
                        globalObjectServices.hideLoading();
                        globalObjectServices.displayErrorMessage(status)
                    })
                }
            }
        } else {
            globalObjectServices.displayCordovaToast('Can not fetch Entry List in OFFLINE mode...')
        }
    }

    $scope.closeEntryDetails = function () {
        $scope.entryDetailsModal.hide()
    }

    $scope.$on('$destroy', function () {
        $scope.optionPopOver.remove().then(function () {
            $scope.optionPopOver = null;
        })
        $scope.entryDetailsModal.remove().then(function () {
            $scope.entryDetailsModal = null;
        })
    });
}) // entryListCtrl Close

DynamicApp.controller('entryDetailsCtrl', function (AuthServices, $filter, $state,
        $stateParams, $ionicModal, $scope, $http, addUpdateEntryServices,
        globalObjectServices, $ionicPopover, $rootScope) {
    // globalObjectServices.showLoading();
    var l_param = AuthServices.tabParam();
    $scope.flagForUpdateButton = '';
    $scope.flagForApproveButton = '';
    $scope.flagForDeleteButton = '';
    $scope.heading = l_param.table_desc;
    $scope.firstScreen = l_param.firstScreen;
    $scope.entryDetail = [];
    if ((l_param.updation_process).indexOf('U') > -1) {
        $scope.flagForUpdateButton = 'U#';
    }
    if ((l_param.updation_process).indexOf('A') > -1) {
        $scope.flagForApproveButton = 'A#';
    }
    if ((l_param.updation_process).indexOf('D') > -1) {
        $scope.flagForDeleteButton = 'D#';
    }

    $scope.firstScreen = l_param.firstScreen;
    var l_selectedDate = ($filter('date')(l_param.date2, 'dd-MM-yyyy'))



    globalObjectServices.showLoading();
    var l_seqId = "";
    var updateKeyValue;
    if (l_param.update_key_codeOfValue) {
        updateKeyValue = l_param.update_key_codeOfValue;
    } else if (l_param.update_key == "user_code" || l_param.update_key == "retailer_code") {
        updateKeyValue = AuthServices.userCode();
    } else {
        updateKeyValue = l_param.update_key_value;
    }

    var url = $scope.url + 'getEntryDetailDyanamically?tableSeqNo=' + l_param.seqNo +
            '&entrySeqId=' + l_seqId + "&updateKey=" + updateKeyValue;
    console.log(url);
    $http.get(url).success(function (data) {
        globalObjectServices.hideLoading();
        $scope.entryDetails = data;
        $scope.seqId = l_seqId;
    }).error(function (data, status) {
        globalObjectServices.displayErrorMessage(status)
    })

    $scope.closeEntryDetails = function () {
        globalObjectServices.goBack(-1);
    }

    $scope.openUpdateEntry = function (listData) {

        // listData.forEach(function (obj) {
        //     if (obj.column_name == l_param.update_key || obj.column_name == obj.update_key) {
        //         l_param.update_key_value = obj.value;
        //         l_param.update_key_codeOfValue = obj.codeOfValue
        //         $scope.seqId = obj.value;
        //     }
        // })
        l_param.update_key_value = updateKeyValue;
        if (l_param.types == 'P' || l_param.types == 'O') {
            var l_obj = [];
            l_obj.seqNo = l_param.seqNo;
            l_obj.listData = listData;
            l_obj.types = l_param.types;
            // l_obj.firstScreen = $scope.firstScreen;
            $state.go('entryDetailsInTabular', {
                obj: l_obj
            })
            globalObjectServices.nativeTranstion("right");
        } else {
            // var l_param = AuthServices.tabParam();
            l_param.seqId = $scope.seqId;
            l_param.fileId = $scope.fileId;
            l_param.table_desc = l_param.table_desc;
            l_param.type = "Update";
            l_param.types = l_param.types;
            l_param.dependent_next_entry_seq = l_param.dependent_next_entry_seq;
            AuthServices.setTabParam(l_param);
            if (l_param.access_contrl == 'D2') {
                $state.go('addUpdateEntryTable1');
            } else if (l_param.access_contrl == 'D3') {
                $state.go('addUpdateEntryTable2');
            } else {
                $state.go('addUpdateEntry');
            }
            // $state.go('addUpdateEntry');
            globalObjectServices.nativeTranstion("right");
        }
    }

    $scope.openUpdateEntryEntryList = function (listData) {
        $scope.optionPopOver.hide();
        listData.forEach(function (obj) {
            if (obj.column_name == "SEQ_ID") {
                $scope.seqId = obj.value;
            }
        })
        // var l_param = AuthServices.tabParam();
        l_param.seqId = $scope.seqId;
        l_param.fileId = $scope.fileId;
        l_param.table_desc = l_param.table_desc;
        l_param.dependent_next_entry_seq = l_param.dependent_next_entry_seq;
        l_param.type = "Update";
        AuthServices.setTabParam(l_param);
        if (l_param.access_contrl == 'D2') {
            $state.go('addUpdateEntryTable1');
        } else if (l_param.access_contrl == 'D3') {
            $state.go('addUpdateEntryTable2');
        } else {
            $state.go('addUpdateEntry');
        }
        // $state.go('addUpdateEntry');
        globalObjectServices.nativeTranstion("right");
        $scope.entryDetailsModal.hide();
    }

    // Navigate to ADD_ENTRY module
    $scope.addEntry = function () {
        var l_obje = [];
        l_obje.type = "addEntry";
        l_obje.table_desc = l_param.table_desc;
        AuthServices.setTabParam(l_param);
        if (l_param.access_contrl == 'D2') {
            $state.go('addUpdateEntryTable1');
        } else if (l_param.access_contrl == 'D3') {
            $state.go('addUpdateEntryTable2');
        } else {
            $state.go('addUpdateEntry');
        }
        // $state.go('addUpdateEntry');
        globalObjectServices.nativeTranstion("right");
    }


}) // entryDetailsCtrl Close


DynamicApp.controller('entryDetailsInTabularCtrl', function ($state, $scope, $http, $stateParams, popOrderServ, $rootScope,
        globalObjectServices, AuthServices, dataServices, $filter, pouchDBService, addUpdateEntryServices) {

    var l_obj = $state.params.obj;
    var l_seqId = "";
    var l_Vrno = "";
    var listData = l_obj.listData;
    var l_data = '';
    var temp_data = "";
    $scope.typesForOrderPopulated = l_obj.types;
    var usercode = AuthServices.userCode();
    if (listData) {
        listData.forEach(function (obj) {
            if (obj.column_name == "SEQ_ID") {
                l_seqId = obj.value;
            }
            if (obj.column_desc == "VRNO") {
                l_Vrno = obj.value;
            }
        })
    }
    $scope.tableHeader = [];
    $scope.entry_by_user = [];
    $scope.item_help_property = [];
    $scope.nullable = [];
    $scope.tool_tip = [];
    $scope.column_size = [];
    $scope.column_name = [];
    // $scope.tableData = [];
    $scope.from_value = [];
    $scope.to_value = [];
    $scope.column_type = [];
    $scope.dropdownVal = [];
    $scope.auto_calculation = [];
    $scope.equationCOL = [];
    $scope.decimal_digit = [];
    var listOfPopulatedEntriesData = [];
    var l_TableHeaderData = "";
    //  globalObjectServices.alertPopup(l_obj.firstScreen + l_obj.seqNo)
    if (l_obj.types == 'O' || l_obj.firstScreen == 'PO') {
        l_obj.seqNo = l_obj.seqNo + 0.1;
        l_obj.seqNo = l_obj.seqNo.toFixed(1);
    }

    var entryDetailsinTabular = {};
    if ($rootScope.online) {
        console.log($scope.url + 'entryDetailInTabular?seqNo=' + l_obj.seqNo + '&vrno=' + l_Vrno +
                '&userCode=' + usercode + '&accCode=' + '&searchText=');
        $http.get($scope.url + 'entryDetailInTabular?seqNo=' + l_obj.seqNo + '&vrno=' + l_Vrno +
                '&userCode=' + usercode + '&accCode=' + '&searchText=').success(function (data) {
            entryDetailsinTabular = data.recordInfo;
            l_TableHeaderData = entryDetailsinTabular.tableHeader;
            setData();
        }).error(function (data, status) {
            globalObjectServices.displayErrorMessage(status)
        })
    } else {

        pouchDBService.getObject(l_obj.seqNo).then(function (data) {
            entryDetailsinTabular.tableData = [];
            entryDetailsinTabular.tableHeader = data;
            l_TableHeaderData = entryDetailsinTabular.tableHeader;
            setData();
        })

    }


    function calculateSummary(tableData, tableHeader, summaryRow) {


        // console.log(summaryRow);
        summaryRow = summaryRow[0];
        var summaryRowValue = summaryRow;
        //  = summaryRow[0];

        // array.indexOf(element)

        var totalIndex = summaryRow.indexOf("T");
        var countIndex = summaryRow.indexOf("C");
        var avgIndex = summaryRow.indexOf("A");
        var total;
        var count;
        var avg;
        var avgCount = 1;
        // var summary = 0;

        // var summaryTotalIndex=tableHeader.indexOf("T")
        tableData.forEach(function (data) {

            // if (data.summary_function_flag == 'T') {
            //     // summary
            //     summary = summary + data.value;
            // }
            if (total) {
                total = total + parseInt(data[totalIndex]);
            } else {
                total = parseInt(data[totalIndex]);
            }

            if (count) {
                count = count + parseInt(data[countIndex]);
            } else {
                count = parseInt(data[countIndex]);
            }

            if (avg) {
                avg = (avg * (avgCount - 1) + parseFloat(data[avgIndex])) / avgCount;
                avgCount++
            } else {
                avg = parseFloat(data[avgIndex]);
                avgCount++;
            }



        })
        // var nullable = null;
        // summaryRowValue.forEach(function (data) {
        //     data = nullable;
        // })

        for (var i = 0; i < summaryRowValue.length; i++) {
            summaryRowValue[i] = '';
        }


        summaryRowValue[0] = 'Summary:';
        summaryRowValue[totalIndex + 1] = "Grand Total : " + total;
        summaryRowValue[countIndex + 1] = "Count : " + count;
        summaryRowValue[avgIndex + 1] = "Average : " + avg.toFixed(2);
        //  globalObjectServices.alertPopup()
        console.log(summaryRowValue);
        console.log(tableData);
        summaryRowValue
        // tableData.push(summaryRowValue);
        // console.log(tableData);
        $scope.summaryRow = summaryRowValue;
        return tableData;
    }


    var setData = function () {

        if (l_obj.types == 'PO') {
            var listOfPopulatedEntries = l_obj.entryList;
            listOfPopulatedEntries.forEach(function (obj1) {
                obj1.forEach(function (obj) {
                    listOfPopulatedEntriesData.push(obj);
                })
            })
            var tableDataValue = [];
            var uniqueIDValue = "";
            // console.log("l_obj.entryList===" + JSON.stringify(l_obj.entryList))

            var summaryRow = [];
            listOfPopulatedEntriesData.forEach(function (obj1, index) {
                var tableData = [];
                var tempRow = [];
                obj1.forEach(function (obj2) {

                    l_TableHeaderData.recordsInfo.forEach(function (obj) {
                        if (obj2.column_name == obj.column_name) {
                            if (obj.entry_by_user == "T" || obj.entry_by_user == "R") {
                                tableData.push(obj2.value);
                                tempRow.push(obj2.summary_function_flag);
                            }
                        }
                        if (obj2.slno) {
                            uniqueIDValue = obj2.slno;
                        }
                    })
                })

                summaryRow.push(tempRow)

                tableData.push(uniqueIDValue);
                tableDataValue.push(tableData)
            })
            entryDetailsinTabular.tableData = tableDataValue;
        }
        temp_data = entryDetailsinTabular.tableData;
        $scope.tableData = angular.copy(temp_data);
        $scope.tableData = calculateSummary($scope.tableData, $scope.tableHeader, summaryRow);
        // console.log("tableData===" + JSON.stringify($scope.tableData));
        if (l_obj.types == 'PO') {
        } else {
            $scope.tableData.forEach(function (obj) {
                for (i = 0; i < obj.length; i++) {
                    if (obj[i]) {
                        if ((obj[i]).indexOf("~") > -1) {
                            l_data = obj[i].split("~");
                            obj[i] = l_data[1];
                        } else {
                        }
                    }
                }
            })
        }
        var l_value = '';
        var l_value1 = '';
        var l_value2 = 'Seq ID';
        $scope.tableHeader.push(l_value); //For table's first column
        // $scope.tableHeader.push(l_value1); //For table's second column

        l_TableHeaderData.recordsInfo.forEach(function (obj) {
            var v = '';
            var l_item_help_property = '';
            angular.forEach(obj, function (value, key) {
                if (key == 'column_desc') {
                    v = value
                    l_item_help_property = obj.item_help_property;
                }
                if (key == "entry_by_user") {
                    if (value == "T" || value == "R" && v !== '') {
                        $scope.tableHeader.push(v);
                        $scope.entry_by_user.push(value);
                    }
                }
            })
            if (obj.entry_by_user == "T" || obj.entry_by_user == "R" && obj.entry_by_user !== '') {
                $scope.nullable.push(obj.nullable);
                $scope.tool_tip.push(obj.tool_tip);
                $scope.column_size.push(obj.column_size);
                $scope.column_name.push(obj.column_name);
                $scope.from_value.push(obj.from_value);
                $scope.to_value.push(obj.to_value);
                $scope.column_type.push(obj.column_type);
                $scope.decimal_digit.push(obj.decimal_digit);
                if (obj.column_type == "BARCODE") {
                    obj.item_help_property = "B"
                }
                if (obj.column_type == "DATETIME") {
                    obj.item_help_property = "T"
                }
                if (obj.column_type == "NUMBER") {
                    obj.item_help_property = "N"
                }
                if (obj.item_help_property == "H") {
                    var dropdownVal = obj.dropdownVal.split("#");
                    var temp1 = [];
                    dropdownVal.forEach(function (element) {
                        var temp2 = element.split("~");
                        temp1.push({
                            name: temp2[1],
                            code: temp2[0]
                        });
                    })
                    obj.dropdownVal = temp1;
                }
                if (obj.item_help_property == "D") {
                    obj.dropdownVal = obj1.dropdownVal.split("#");
                }
                if (obj.auto_calculation !== null) {
                    $scope.auto_calculation_eq = obj.auto_calculation;
                    $scope.equationOP = obj.column_name;
                }
                $scope.dropdownVal.push(obj.dropdownVal);
                $scope.item_help_property.push(obj.item_help_property);
            }
        })
        l_TableHeaderData.recordsInfo.forEach(function (obj2) {
            if (obj2.entry_by_user == "T" || obj2.entry_by_user == "R" && obj2.entry_by_user !== '') {
                if ($scope.auto_calculation_eq) {
                    if (($scope.auto_calculation_eq.indexOf(obj2.column_name)) > -1) {
                        obj2.auto_calculation = $scope.auto_calculation_eq;
                        obj2.equationOP = $scope.equationOP;
                    }
                    $scope.auto_calculation.push(obj2.auto_calculation);
                    $scope.equationCOL.push(obj2.equationOP);
                }
            }
        })

    }





    $scope.cancelOrderPopulatedEntry = function () {
        //  var sp_obj = [];
        // sp_obj.type = "orderPopulated";
        //  sp_obj.access_contrl = "PO";
        //  $state.go('addUpdateEntry', {
        //  obj: "next"
        // });

        globalObjectServices.goBack(-2);
    }
    $scope.editrow = function (seqId) {
        $scope.flagForEdit = [];
        $scope.flagForEdit[seqId] = 1;
    }

    $scope.deleterow = function (index, seq_id) {
        globalObjectServices.confirmationPopup('Do you want to Delete Entry?').then(function (data) {
            if (data == 'ok') {
                addUpdateEntryServices.deleteEntry(seq_id, l_obj.seqNo, $scope.url).then(function (data) {
                    $scope.tableData = globalObjectServices.deleteEachRow($scope.tableData, index);
                    if (l_obj.types == 'PO') {
                        deleteOrderPopulatedEntry(seq_id, index)
                    } else {
                    }
                    globalObjectServices.displayCordovaToast('Entry Deleted Successfully..')
                }, function (err) {
                    globalObjectServices.displayErrorMessage(err);
                })
            } else {
            }
        })
    }

    function deleteOrderPopulatedEntry(seq_id, index) {
        var id = "entrySeqNo" + l_obj.seqNo;
        popOrderServ.deleteOrderPopulatedEntry(l_obj.seqNo, index, seq_id).then(function (data) {

            // pouchDBService.getObject(id).then(function(data) {
            //  var listOfPopulatedEntries = data.entryList;
            //  listOfPopulatedEntries.forEach(function (obj1) {
            //   obj1.forEach(function (obj) {
            //      listOfPopulatedEntriesData.push(obj);
            //  })
            //  })
            //	var tableDataValue = [];
            //  var uniqueIDValue = "";
            // console.log("l_obj.entryList===" + JSON.stringify(l_obj.entryList))
            //   listOfPopulatedEntriesData.forEach(function (obj1, index) {
            //      var tableData = [];
            //    obj1.forEach(function (obj2) {
            //     l_TableHeaderData.recordsInfo.forEach(function (obj) {
            //      if (obj2.column_name == obj.column_name) {
            //       if (obj.entry_by_user == "T" || obj.entry_by_user == "R") {
            //        tableData.push(obj2.value);
            //     }
            //   }
            //     if (obj2.slno) { uniqueIDValue = obj2.slno; }
            //  })
            // })
            //    tableData.push(uniqueIDValue);
            //    tableDataValue.push(tableData)
            //})
            // entryDetailsinTabular.tableData = tableDataValue;
            //temp_data = entryDetailsinTabular.tableData;
            // $scope.tableData = angular.copy(temp_data);
            // }, function(err) {

            // })


        }, function (err) {
            globalObjectServices.displayCordovaToast('Try Again..')
        });
    }

    $scope.addUpdatedEntry = function (TableData) {
        globalObjectServices.showLoading();
        var object = {};
        var key = "";
        var rowsOfPopulateData = [];
        var l_recordsInfo = [];
        var dataListToSend = {};
        var l_data = '';
        var TableDataLength = '';
        var temp_data_length = '';
        var Data = angular.copy(TableData);
        if ((temp_data.length) > (TableData.length)) {
            temp_data_length = TableData.length;
        } else {
            temp_data_length = temp_data.length;
        }
        var tableDataValue1 = [];
        if (l_obj.types == 'PO') {
            // console.log(JSON.stringify(listOfPopulatedEntriesData))
            listOfPopulatedEntriesData.forEach(function (obj1, index) {
                var tableData1 = [];
                obj1.forEach(function (obj2) {
                    l_TableHeaderData.recordsInfo.forEach(function (obj) {
                        if (obj2.column_name == obj.column_name) {
                            // if (obj.entry_by_user == "T" || obj.entry_by_user == "R") {
                            if (obj2.codeOfValue) {
                                obj2.value = obj2.codeOfValue;
                            }
                            if (obj.value) {
                                obj2.value = obj.value;
                            }
                            // if (obj.column_name == 'VRNO') {
                            //     var vrnoValue = new Date();
                            //     var Inputdate = JSON.stringify($filter('date')(vrnoValue, 'dd-MM-yy hh:mm'));
                            //     obj2.value = Inputdate.split('"').join('');
                            // }
                            if (obj.column_name == l_obj.searchTextColumnName) {
                                obj2.value = l_obj.searchText;
                            }
                            tableData1.push({"column_name": obj.column_name, "value": obj2.value});
                        }
                    })
                })
                tableDataValue1.push(tableData1)
            })


            if ($rootScope.online) {
                // console.log(JSON.stringify(tableDataValue1));
                dataServices.uploadAllEntry(tableDataValue1, l_obj.seqNo, $scope.url).then(function (data) {
                    globalObjectServices.hideLoading();
                    if (data.status == "insert data") {
                        globalObjectServices.displayCordovaToast('Entry Saved Successfully..');
                        // deleteAllEntry();
                        popOrderServ.deleteAllPopulatedEntry();
                        globalObjectServices.goBack(-3);
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
                    globalObjectServices.displayErrorMessage(err);
                });
            } else {

                globalObjectServices.hideLoading();
                var tempDate = $filter('date')(new Date(), 'MM-dd-yyyy hh:mm:ss');
                tableDataValue1.push({
                    column_desc: "DATE",
                    column_name: "DATE",
                    column_type: "DATE",
                    entry_by_user: "F",
                    value: tempDate
                });
                dataServices.addEntryToLoacalDB(tableDataValue1, parseInt(l_obj.seqNo), $scope.tableHeader, "1", "uploadEntryStatus", "PO").then(function (data) {
                    globalObjectServices.displayCordovaToast('Entry Saved Successfully..');
                    popOrderServ.deleteAllPopulatedEntry();
                    globalObjectServices.goBack(-3);
                }, function (err) {
                    globalObjectServices.displayCordovaToast('Try Again...')
                })
            }

        } else {
            angular.forEach(temp_data, function (value, key) {
                TableDataLength = Object.keys(temp_data[key]).length;
            })

            for (var i = 0; i < temp_data_length; i++) {
                for (var j = 0; j < TableDataLength; j++) {
                    if (temp_data[i][j]) {
                        if ((temp_data[i][j]).indexOf("~") > -1) {
                            l_data = temp_data[i][j].split("~");
                            Data[i][j] = l_data[0];
                        }
                    }
                }
            }


            Data.forEach(function (obj) {
                angular.forEach(obj, function (value, key) {
                    var column_name = $scope.column_name[key];
                    var SEQ_ID = "SEQ_ID";
                    var DYNAMIC_TABLE_SEQ_ID = "DYNAMIC_TABLE_SEQ_ID";
                    if (column_name == undefined || column_name == '') {
                        object[SEQ_ID] = obj[key];
                    } else {
                        object[column_name] = obj[key];
                    }
                    l_TableHeaderData.recordsInfo.forEach(function (temp) {
                        if (temp.column_desc == "User Code" || temp.column_name == "USER_CODE" ||
                                temp.column_name == "EMP_CODE") {
                            object[temp.column_name] = usercode;
                        }
                    })
                    object[DYNAMIC_TABLE_SEQ_ID] = l_obj.seqNo;
                })
                var l_tempCopy = angular.copy(object);
                rowsOfPopulateData.push(l_tempCopy);
            })
            angular.forEach(rowsOfPopulateData, function (value, recordsInfo) {
                l_recordsInfo.push({
                    recordsInfo: [value]
                });
            })
            key = "list";
            dataListToSend[key] = l_recordsInfo;
            var fd = new FormData();
            var uploadUrl = $scope.url + 'multipleUpdateEntryInfo';
            fd.append('jsonString', JSON.stringify(dataListToSend));
            console.log("dataListToSend" + JSON.stringify(dataListToSend))
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (data) {
                globalObjectServices.hideLoading();
                if (data.status == "updated data") {
                    globalObjectServices.displayCordovaToast('Entry Updated Successfully..');
                    globalObjectServices.goBack(-2);
                } else {
                    globalObjectServices.displayCordovaToast('Try Again..')
                }
            }).error(function (data, status) {
                globalObjectServices.hideLoading();
                globalObjectServices.displayErrorMessage(status)
            })

        }
    }

    function deleteAllEntry() {
        var id = "entrySeqNo" + l_obj.seqNo;
        dataServices.deleteAllEntry(l_obj.seqNo).then(function (data) { }, function (err) {
            globalObjectServices.displayCordovaToast('Try Again..')
        });
    }
    $scope.cancelAddUpdateEntry = function () {
        globalObjectServices.confirmationPopup('Do you want to Cancel Entry?').then(function (data) {
            if (data == 'ok') {
                globalObjectServices.goBack(-1);
            } else {
            }
        })
    }

    $scope.rowWiseAutoCalculation = function (auto_calculation, equationOP, tableData, seqId) {
        $scope.tableData = globalObjectServices.rowWiseAutoCalculation(auto_calculation,
                equationOP, tableData, seqId, l_TableHeaderData.recordsInfo, $scope.tableData)
    }
}) //close EntryList In Tabular CTRL


DynamicApp.controller('shortReportTypeCtrl', function ($state, $scope, $stateParams,
        reportAnalysisServices, $cordovaToast) {
    var sp_Obj = $state.params.obj
    reportAnalysisServices.setshortReportTypeTab($scope.url, sp_Obj.seqNo).then(function (data) {
        $scope.typeList = data;
    }, function (err) {
        $cordovaToast.show('Try again...', 'long', 'bottom');
    })
})

DynamicApp.controller('shortReportDetailCtrl', function ($state, $scope, $http, AuthServices, $stateParams) {

    var sp_Obj = $state.params.obj // state params getting from shortReportType
    $scope.shortReportProcess = false;
    $http.get($scope.url + 'shortReportSubType?seqId=' + sp_Obj).success(function (data) {
        $scope.shortReportDetail = data.subTab;
    }).error(function (data) { })

    $scope.openShortReport = function (seqNo, slno, status) {
        if (status) {
            $http.get($scope.url + 'shortReportDetail?seqId=' + seqNo + '&slNo=' + slno).success(function (data) {
                $scope.shortReportDetail.forEach(function (obj) {
                    if (obj.slno == slno) {
                        obj.shortReprt = data.value;
                        obj.shortReportProcess = false;
                    }
                })
            }).error(function (data) { })
        }
        ;
    }
})

// Short Report module sliding animation code
DynamicApp.animation('.slide-toggle', ['$animateCss', function ($animateCss) {
        var lastId = 0;
        var _cache = {};
        function getId(el) {
            var id = el[0].getAttribute("data-slide-toggle");
            if (!id) {
                id = ++lastId;
                el[0].setAttribute("data-slide-toggle", id);
            }
            return id;
        }

        function getState(id) {
            var state = _cache[id];
            if (!state) {
                state = {};
                _cache[id] = state;
            }
            return state;
        }

        function generateRunner(closing, state, animator, element, doneFn) {
            return function () {
                state.animating = true;
                state.animator = animator;
                state.doneFn = doneFn;
                animator.start().finally(function () {
                    if (closing && state.doneFn === doneFn) {
                        element[0].style.height = '';
                    }
                    state.animating = false;
                    state.animator = undefined;
                    state.doneFn();
                });
            }
        }

        return {
            addClass: function (element, className, doneFn) {
                if (className == 'ng-hide') {
                    var state = getState(getId(element));
                    var height = (state.animating && state.height) ?
                            state.height : element[0].offsetHeight;
                    var animator = $animateCss(element, {
                        from: {
                            // height: height + 'px',
                            height: 100 + '%',
                            opacity: 1
                        },
                        to: {
                            height: '0px',
                            opacity: 0
                        }
                    });
                    if (animator) {
                        if (state.animating) {
                            state.doneFn =
                                    generateRunner(true,
                                            state,
                                            animator,
                                            element,
                                            doneFn);
                            return state.animator.end();
                        } else {
                            state.height = height;
                            return generateRunner(true,
                                    state,
                                    animator,
                                    element,
                                    doneFn)();
                        }
                    }
                }
                doneFn();
            },
            removeClass: function (element, className, doneFn) {
                if (className == 'ng-hide') {
                    var state = getState(getId(element));
                    var height = (state.animating && state.height) ?
                            state.height : element[0].offsetHeight;
                    var animator = $animateCss(element, {
                        from: {
                            height: '0px',
                            opacity: 0
                        },
                        to: {
                            // height: height + 'px',
                            height: 100 + '%',
                            opacity: 1
                        }
                    });
                    if (animator) {
                        if (state.animating) {
                            state.doneFn = generateRunner(false,
                                    state,
                                    animator,
                                    element,
                                    doneFn);
                            return state.animator.end();
                        } else {
                            state.height = height;
                            return generateRunner(false,
                                    state,
                                    animator,
                                    element,
                                    doneFn)();
                        }
                    }
                }
                doneFn();
            }
        };
    }]); // CLOSE - Short Report module sliding animation code