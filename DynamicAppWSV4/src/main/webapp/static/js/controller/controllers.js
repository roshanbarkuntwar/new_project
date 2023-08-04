var DynamicApp = angular.module('starter.controllers', [])

DynamicApp.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0)
})


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
        scope: {decimaldigit: '='},
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


DynamicApp.controller('AppMainCtrl', function ($scope, $state, $rootScope,
        $http, $ionicModal, globalObjectServices, $timeout, AuthServices, $cordovaDevice,
        $cordovaInAppBrowser) {


    $scope.url = AuthServices._url();
    // alert( $scope.url)
    if ($scope.url == '' || $scope.url == undefined || $scope.url == "undefined") {
        // $scope.url = "http://203.193.167.114:8181/DynamicAppWSV4/webService/CP/"
        // $scope.url = "http://203.193.167.117:8080/DynamicAppWSV4/webService/"
        // $scope.url = "http://192.168.100.240:8888/DynamicAppWSV4/webService/CP/"

        // Hosted JBoss Server
        // $scope.url = "http://203.193.167.116:8888/DynamicAppWSV4/webService/CP/"
//         $scope.url = "http://203.193.167.116:8888/DynamicAppWSV4/webService/CPT/NA/NA/CPGTEST/CPGTEST/"
        // $scope.url = "http://203.193.167.116:8888/DynamicAppWSV4/webService/MA/"
        // $scope.url = "http://203.193.167.116:8888/DynamicAppWSV4/webService/RS/"
        // $scope.url = "http://203.193.167.116:8888/DynamicAppWSV4/webService/BA/"
        // $scope.url = "http://203.193.167.116:8888/DynamicAppWSV4/webService/MA/"
        // $scope.url = "http://203.193.167.116:8888/DynamicAppWSV4/webService/PF/"
        // $scope.url = "http://203.193.167.116:8888/DynamicAppWSV4/webService/BD/NA/NA/LHS_MAPP/LHS_MAPP/"
        // $scope.url = "http://203.193.167.116:8888/DynamicAppWSV4/webService/LS/"

        // Hosted Glassfish Server
        // $scope.url = "https://203.193.167.117:8181/DynamicAppWSV4/webService/CP/"

        // CPG Hosted Glassfish Server
        // $scope.url = "http://117.240.223.218:8080/DynamicAppWSV4/webService/CP/"

        // Premkumar's PC Server URL AAAU
        // $scope.url = 'http://192.168.100.145:8080/DynamicAppWSV4/webService/RS/NA/NA/NA/NA/'
        // $scope.url = 'http://192.168.100.145:8080/DynamicAppWSV4/webService/CP/NA/NA/NA/NA/'
//        $scope.url = 'http://192.168.100.145:8080/DynamicAppWSV4/webService/CPT/NA/NA/CPGTEST/CPGTEST/'
        // $scope.url = 'http://192.168.100.145:8080/DynamicAppWSV4/webService/BA/NA/NA/NA/NA/'
        // $scope.url = 'http://192.168.100.145:8080/DynamicAppWSV4/webService/MA/NA/NA/NA/NA/'
        // $scope.url = 'http://192.168.100.145:8080/DynamicAppWSV4/webService/PF/NA/NA/NA/NA/'
//        $scope.url = 'http://192.168.100.145:8080/DynamicAppWSV4/webService/BD/NA/NA/LHS_MAPP/LHS_MAPP/'
        // $scope.url = 'http://192.168.100.145:8080/DynamicAppWSV4/webService/LS/NA/NA/NA/NA/'

        // $scope.url = 'http://192.168.100.195:8080/DynamicAppWSV4/webService/ST/NA/NA/STLTERP/STLTERP/'
//          $scope.url = 'http://192.168.100.195:8080/DynamicAppWSV4/webService/BD/NA/NA/LHS_MAPP/LHS_MAPP/'

//            $scope.url = 'http://192.168.100.145:8080/DynamicAppWSV4/webService/LS/NA/NA/NA/NA/'
            $scope.url = 'http://192.168.100.145:8080/DynamicAppWSV4/webService/SM/NA/NA/VDEMOERP/VDEMOERP/'

    } else {
    }


    globalObjectServices.showLoading();
    $timeout(function () {
        globalObjectServices.hideLoading();
    }, 1000)

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
        }
        if (l_currentState == 'dashbord' || l_currentState == 'login') {
            if ($rootScope.drawer.openned) {
                // thedrawer is openned - close
                $rootScope.drawer.hide();
            } else {
                ionic.Platform.exitApp();
            }
        }
        globalObjectServices.nativeTranstion("down");
    });

    $scope.backNavigate = function () {
        globalObjectServices.goBack();
        globalObjectServices.nativeTranstion("down");
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
                    alert('Please Allow Storage setting');
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
                    alert('Please Allow Camera setting');
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
                    alert('Please Allow Location setting');
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
                    alert('Please Allow Microphone setting');
                }
                permissions.requestPermission(
                        permissions.RECORD_AUDIO,
                        function (status) {
                            if (!status.hasPermission)
                                errorCallback();
                        }, errorCallback);
            }
        }
    }, false)

    var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
    };

    $scope.openBrowser = function () {
        $cordovaInAppBrowser.open('http://lighthouseindia.com', '_blank', options).then(function (event) {
            // success
        }).catch(function (event) {
            // error
        });
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
        $scope.url = s.serverUrl + "DynamicAppWSV4/webService/" + s.dbEntity + "/" + s.dbUrl + "/" + s.portNo + "/" + s.databaseUser + "/" + s.dbPassword + "/";
        // alert("$scope.url==>  " + $scope.url);
        globalObjectServices.displayCordovaToast('Server credentials saved Successfully..')
        $state.go('login')
    }

    var l_userName = AuthServices.userName();
    var l_userCode = AuthServices.userCode();
    var l_aapType = AuthServices.appType();
}) // AppMainCtrl Close

DynamicApp.controller('loginCtrl', function ($scope, AuthServices, $state, $ionicModal, $timeout, $ionicLoading,
        $http, globalObjectServices, $rootScope, $stateParams) {
    $scope.loginData_ng = {};
    $scope.flagForDisableLoginButton = 0;
    $scope.loginCheck = $state.params.statusss;
//    alert($scope.loginCheck);
    // globalObjectServices.showLoading();

    $timeout(function () {
        if ($ionicLoading._getLoader().$$state.value.isShown) {
            $ionicLoading.hide();
            globalObjectServices.displayCordovaToast("Server is Busy");
        }
    }, 10000)


    // document.addEventListener('deviceready', function() {


    //     // alert("Device ID : " + l_deviceID + " Device Name : " + l_deviceName);
    // }, false)

    if ($scope.loginCheck == 'true') {
        $scope.flagForDisableLoginButton = 1;
        data = {"userName": "Ho - App Testing ", "user_code": "HT01", "message": "User is authenticated", "module": "ALDS", "entity_code": "CP", "division": "HO", "acc_year": "16 17", "dept_code": null};
        if (data.message == 'User is authenticated') {
            var entity_code = data.entity_code;
            var division = data.division.split(" ")
            var division_data = division[0];
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
            login_params.entity_code = entity_code;
            login_params.division_data = division_data;
            login_params.acc_year = acc_year;
            login_params.dept_code = dept_code;

            AuthServices.login(data.user_code, data.userName, data.module, $scope.url, entity_code,
                    division_data, acc_year, dept_code).then(function (authenticated) {
                AuthServices.setLoginParam(login_params);
                $state.go('dashbord', {}, {reload: true})
                globalObjectServices.nativeTranstion("up");
            }, function (err) {
                globalObjectServices.displayCordovaToast('Invalid credentials or device..');
            })
        }
    }

    $scope.doLogin = function () {
        $scope.flagForDisableLoginButton = 1;
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
                '&password=' + $scope.loginData_ng.password_ng + '&deviceId=d79e928c5b0201b1' + '&deviceName=Micromax AQ4501';
        $http.get(url).success(function (data) {
            $ionicLoading.hide();
            if (data.message == 'User is authenticated') {
                var entity_code = data.entity_code;
                var division = data.division.split(" ")
                var division_data = division[0];
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
                login_params.entity_code = entity_code;
                login_params.division_data = division_data;
                login_params.acc_year = acc_year;
                login_params.dept_code = dept_code;

                AuthServices.login(data.user_code, data.userName, data.module, $scope.url, entity_code,
                        division_data, acc_year, dept_code).then(function (authenticated) {
                    AuthServices.setLoginParam(login_params);
                    $state.go('dashbord', {}, {reload: true})
                    globalObjectServices.nativeTranstion("up");
                }, function (err) {
                    globalObjectServices.displayCordovaToast('Invalid credentials or device..');
                })
            } else {
                $scope.flagForDisableLoginButton = 0;
                globalObjectServices.displayCordovaToast('Invalid credentials or device..');
            }
        }).error(function (data, status) {
            $ionicLoading.hide();
            $scope.flagForDisableLoginButton = 0;
            globalObjectServices.displayErrorMessage(status)
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
        } else {
            globalObjectServices.displayCordovaToast('Data saved successfully')
            $scope.backNavigate();
        }
    };

}) // loginCtrl Close

DynamicApp.controller('ChangePasswordCtrl', function ($scope, $state, $http,
        $ionicModal, globalObjectServices, AuthServices) {

    $ionicModal.fromTemplateUrl('templates/checkMailForResetKey.html', function (modal) {
        $scope.checkMailForResetKeyModal = modal;
    }, {scope: $scope});

    $ionicModal.fromTemplateUrl('/DynamicAppWSV4/static/templates/passwordReset.html', function (modal) {
        $scope.passwordResetModal = modal;
    }, {scope: $scope});

    $scope.checkMailForResetKey = function (emailID) {
        $scope.forgetPasswordEmailID = emailID;
        globalObjectServices.showLoading();

        $http.get($scope.url + "forgotPassword?emailId=" + $scope.forgetPasswordEmailID).success(function (data) {
            var l_resetPasswordStatus = data.key;
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
                    $state.go('dashbord', {}, {reload: true});
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
}) // ChangePasswordCtrl Close


DynamicApp.controller('changeSettingCtrl', function ($scope, $rootScope, AuthServices, $state, $ionicModal, $cordovaDevice,
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
        "http://203.193.167.116:8888/",
        "http://203.193.167.114:8181/",
        "http://203.193.167.117:8080/",
        "http://192.168.100.240:8888/",
        "http://203.193.167.116:8888/",
        "http://203.193.167.117:8181/",
        "http://117.240.223.218:8080/",
        "http://192.168.100.143:8080/",
        "http://192.168.100.145:8080/"
    ];
    setting.databaseList = ["CPGERP", "CPGTEST", "MAPLTEST", "RSIPMTEST", "BAIDVTEST",
        "PERTTEST", "LHSISO", "LHS_MAPP", "STLTERP"
    ];
    setting.dbEntityList = ["CP", "CPT", "MA", "RS", "BA", "PF", "LS", "BD", "ST"]
    setting.dbUrlList = ["192.168.100.10", "172.1.0.2"];
    setting.portNoList = ["1521"];
    setting.serverUrl = "";
    setting.dbEntity = "";
    setting.databaseUser = "";
    setting.dbPassword = "";
    setting.portNo = "";
    setting.dbUrl = "";

    setting.setDbUser = function (entity) {
        if (entity == "CP") {
            setting.databaseUser = "CPGERP";
        } else {
            if (entity == "CPT") {
                setting.databaseUser = "CPGTEST";
            } else {
                if (entity == "MA") {
                    setting.databaseUser = "MAPLTEST"
                } else {
                    if (entity == "RS") {
                        setting.databaseUser = "RSIPMTEST"
                    } else {
                        if (entity == "BA") {
                            setting.databaseUser = "BAIDVTEST";
                        } else {
                            if (entity == "PF") {
                                setting.databaseUser = "PERTTEST"
                            } else {
                                if (entity == "LS") {
                                    setting.databaseUser = "LHSISO"
                                } else {
                                    if (entity == "BD") {
                                        setting.databaseUser = "LHS_MAPP"
                                    } else {
                                        if (entity == "ST") {
                                            setting.databaseUser = "STLTERP"
                                        } else {
                                            setting.databaseUser = ""
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
}) // changeSettingCtrl Close

DynamicApp.controller('dashbordCtrl', function ($scope, $filter, $state, $http, AuthServices, $ionicPlatform,
        $rootScope, $ionicPopup, dataServices, $ionicModal, pouchDBService, globalObjectServices, reportAnalysisServices, $nlFramework) {
    var l_userName = AuthServices.userName();
    var l_userCode = AuthServices.userCode();
    var l_aapType = AuthServices.appType();
    var login_params = AuthServices.login_params();
    $scope.appType = l_aapType;
    var l_param = [];
    $ionicModal.fromTemplateUrl('/DynamicAppWSV4/static/templates/fontfamily.html', function (modal) {
        $scope.fontfamilyKeyModal = modal;
    }, {scope: $scope});

    if ("V" == AuthServices.screenOrientionView()) {
        // window.screen.lockOrientation('portrait');
    } else {
        if ("H" == AuthServices.screenOrientionView()) {
            // window.screen.lockOrientation('portrait');
        }
    }

    // $ionicPlatform.on('resume', function() {
    //     alert("ionicPlatform.on.resume");
    // });

    var reloadDashbord = function () {
        $scope.dashboradData = null;
        if ($rootScope.online) {
            // dataServices.getDashbordData().then(function(data) {
            $http.get($scope.url + 'getTableDetail?appType=' + l_aapType + '&userCode=' + l_userCode).success(function (data) {
                var l_tableData = data.table_Detail[0];

                if (data.table_Detail.length == 1 && l_tableData.firstScreen != 'E') {

                    $scope.flagForOneTab = 1;
                    $scope.firstScreen = l_tableData.firstScreen;
                    if (l_tableData.firstScreen == "G" || l_tableData.firstScreen == "T" || l_tableData.firstScreen == 1) {
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
                        $scope.openReportAnalysis = function (seq_no, reportingType) {
                            var l_graphObj = [];
                            l_graphObj.seq_no = seq_no;
                            l_graphObj.reportingType = reportingType;
                            l_graphObj.firstScreen = l_tableData.firstScreen;
                            $state.go('report', {obj: l_graphObj});
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
                    $scope.dashboradData = data.table_Detail;
                    $scope.dashboradData.forEach(function (obj) {
                        var id = "entrySeqNo" + obj.seqNo;
                        pouchDBService.getObject(id).then(function (data) {
                            obj.noOfEntry = data.count;
                        }, function (err) {
                            obj.noOfEntry = 0;
                        });
                    })
                    $scope.view_mode = data.view_mode;
                }
            }).error(function (data, status) {
                $scope.dashboradData = {};
                globalObjectServices.displayErrorMessage(status);
            })
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
                alert("Data is not available please REFRESH app");
            })
            pouchDBService.getObject("welcomeMsg").then(function (data1) {
                $scope.welcomeMsg = data1.welcomeMsg;
            }, function (err) {})
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
        // document.addEventListener('deviceready', function() {
        $ionicPlatform.ready(function () {
            pouchDBService.initDB();
            globalObjectServices.callLocalNotification($scope.url, l_aapType, l_userCode);
            reloadDashbord();
            // $rootScope.fw = $nlFramework;
            $rootScope.drawer = $nlFramework.drawer;
            $rootScope.fab = $nlFramework.fab;
            // $rootScope.burger = $nlFramework.burger;


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
            $http.get($scope.url + 'apptypelist?userCode=' + l_userCode).success(function (data) {
                $scope.appTypes = data.appTypes;
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
        $state.go('offlineEntryList', {obj: l_param});
        globalObjectServices.nativeTranstion("right");
    }

    $scope.pageDetails = function (firstScreen, value, seqNo, portlet_Id, table_desc,
            data_UPLOAD, updation_process, screenOrientionView, access_contrl, default_populate_data, dependent_next_entry_seq, replicate_fields) {
        l_param.table = value;
        l_param.seqNo = seqNo;
        l_param.portlet_Id = portlet_Id;
        l_param.table_desc = table_desc;
        l_param.firstScreen = firstScreen;
        l_param.dependent_next_entry_seq = dependent_next_entry_seq;
        l_param.default_populate_data = default_populate_data;
        l_param.updation_process = updation_process;
        l_param.replicate_fields = replicate_fields;

        AuthServices.setAppSeqNo(l_param.seqNo);
        AuthServices.setData_UPLOAD(data_UPLOAD);
        AuthServices.setScreenOrientionView(screenOrientionView);

        if (data_UPLOAD == "T") {
            // cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
            //     if (!enabled) {
            //         var confirmPopup = $ionicPopup.confirm({
            //             template: 'Please Allow to Access this device Location...',
            //             cssClass: 'PopupStyle',
            //             okType: 'button-balanced',
            //         });
            //         confirmPopup.then(function(res) {
            //             if (res) {
            //                 if (typeof cordova.plugins.settings.openSetting != undefined) {
            //                     cordova.plugins.settings.open(function() {},
            //                         function() {
            //                             alert("failed to open settings..")
            //                         });
            //                 }
            //             } else {}
            //         });
            //     } else {
            setPage();
            //     }
            // })
        } else {
            setPage();
        }

        function setPage() {
            if (dependent_next_entry_seq != null) {
                var l_obje = [];
                l_obje.seqNo = l_param.seqNo;
                var dates = new Date();
                var Inputdate = JSON.stringify($filter('date')(dates, 'dd-MM-yyyy'));
                l_obje.date2 = Inputdate.split('"').join('');
                l_obje.table_desc = $scope.table_desc;
                l_obje.updation_process = updation_process;
                l_obje.dependent_next_entry_seq = dependent_next_entry_seq;
                $state.go('entryList', {obj: l_obje});
                globalObjectServices.nativeTranstion("right");
            } else {

                if (firstScreen == "C") {
                    $state.go('calendar', {obj: l_param});
                    globalObjectServices.nativeTranstion("right");
                }
                if (firstScreen == "E") {
                    if (default_populate_data == null || default_populate_data == '') {
                        if (updation_process.charAt(0) == 'V') {
                            var l_obje = [];
                            l_obje.seqNo = l_param.seqNo;
                            var dates = new Date();
                            var Inputdate = JSON.stringify($filter('date')(dates, 'dd-MM-yyyy'));
                            l_obje.date2 = Inputdate.split('"').join('');
                            l_obje.table_desc = $scope.table_desc;
                            l_obje.updation_process = updation_process;
                            $state.go('entryList', {obj: l_obje});
                            globalObjectServices.nativeTranstion("right");
                        } else {
                            $state.go('addUpdateEntry');
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
                            $state.go('entryList', {obj: l_obje});
                            globalObjectServices.nativeTranstion("right");
                        } else {
                            l_param.types = 'P';
                            $state.go('addPopulatedEntry', {obj: l_param});
                            globalObjectServices.nativeTranstion("right");
                        }
                    }
                }
                if (firstScreen == "G" || firstScreen == "T" || firstScreen == 1) {
                    AuthServices.setPortletId(l_param.portlet_Id);
                    // if (firstScreen == "T") {
                    //     l_param.showTableFlag = 1;
                    // }
                    // alert("l_param.portlet_Id : " + l_param.portlet_Id);
                    $state.go('summaryReport', {obj: l_param});
                    globalObjectServices.nativeTranstion("right");
                }
                if (firstScreen == "S") {
                    $state.go('shortReportType', {obj: l_param});
                    globalObjectServices.nativeTranstion("right");
                }
                if (firstScreen == "O") {
                    l_param.type = "order";
                    l_param.types = 'O';
                    $state.go('addUpdateEntry');
                    globalObjectServices.nativeTranstion("right");
                }
                if (firstScreen == "L") {
                    $state.go('addPopulatedLocationEntry', {obj: l_param});
                }

                if (firstScreen == "LT") {
                    $state.go('locationTracking');
                }

            }
            AuthServices.setTabParam(l_param);
        }
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
        AuthServices.login(l_userCode, l_userName, appType, $scope.url);
        // $state.go($state.current, {}, { reload: true, notify: true });
        l_aapType = appType;
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
        $state.go('login');
        globalObjectServices.nativeTranstion("right");
    };
})

DynamicApp.controller('notifCtrl', function ($rootScope, $ionicPopover, $ionicModal, globalObjectServices, dataServices, pouchDBService,
        AuthServices, $state, $scope, $http) {
    $scope.notificationList = {};
    var isUnread = "no";
    $ionicModal.fromTemplateUrl('/DynamicAppWSV4/static/templates/entryDetails.html', function (modal) {
        $scope.entryDetailsModal = modal
    }, {scope: $scope})

    $ionicPopover.fromTemplateUrl('template/notif-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $ionicModal.fromTemplateUrl('/DynamicAppWSV4/static/templates/archievedEntries.html', function (modal) {
        $scope.archievedEntriesModal = modal
    }, {scope: $scope})

    pouchDBService.getObject("localNotif").then(function (data) {
        $scope.notificationList.notifDetails = data.notifList
    }, function (data) {
        // alert(data);
    })
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
        }, function (data) {})

        $scope.archievedEntriesModal.show();
    }

    $scope.selectItems = function (item, index) {
        if ($scope.chckedIndexs.indexOf(item) === -1) {
            $scope.chckedIndexs.push(item);
        } else {
            $scope.chckedIndexs.splice($scope.chckedIndexs.indexOf(item), 1);
        }
        //   console.log(JSON.stringify($scope.chckedIndexs))
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
            if (obj.seq_id == item) {
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

    }
    $scope.markAsUnread = function (item, index) {
        $scope.notificationList.notifDetails.forEach(function (obj) {
            if (obj.seq_id == item) {
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
            console.log(temp.notifList);
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

    $ionicModal.fromTemplateUrl('/DynamicAppWSV4/static/templates/offlineRefreshForm.html', function (modal) {
        $scope.offlineRefreshForm = modal;
    }, {scope: $scope});



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
            globalObjectServices.displayErrorMessage(status)
        })
    } else {
        globalObjectServices.displayCordovaToast('Network is not available Try again...')
    }


    $scope.pageDetails = function (firstScreen, value, seqNo, portlet_Id, table_desc,
            data_UPLOAD, updation_process, screenOrientionView, access_contrl,
            default_populate_data, dependent_next_entry_seq) {
        $scope.table_desc = table_desc;
        $scope.lovs = [];
        $scope.dependentlovs = [];
        $scope.formData = [];
        var isLOV = false;
        $scope.seqNo = seqNo;

        if (firstScreen == "E" || firstScreen == "C") {
            var l_url = $scope.url + 'addEntryForm?seqNo=' + seqNo + '&userCode=' + AuthServices.userCode();
            $http.get(l_url).success(function (data) {
                var formData = {};
                formData.data = data;
                formData.seqNo = seqNo;
                formData.table_desc = table_desc;
                $scope.formData.push(formData);

                data.recordsInfo.forEach(function (obj) {
                    if (obj.item_help_property == "L") {
                        if (obj.dependent_row == null) {
                            var url = $scope.url + 'getLOVDyanamically?uniqueID=' + seqNo +
                                    '&forWhichColmn=' + obj.column_name;
                            var temp = {};
                            temp.lov = "";
                            temp.url = url;
                            temp.column_desc = obj.column_desc;
                            temp.column_name = obj.column_name;
                            temp.id = seqNo + obj.column_name;
                            $scope.lovs.push(temp);
                            isLOV = true;
                        } else {
                            var temp = {};
                            temp.lov = "";
                            temp.url = $scope.url + 'getLOVDyanamically?uniqueID=' + seqNo + '&whereClauseValue=';
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
                                            temp11.push({name: temp2[1], code: temp2[0]});
                                        })

                                        temp.dependentLov = temp11;
                                    } else {
                                        temp.dependentLov = "";
                                    }
                                }
                            })
                            temp.id = seqNo + obj.column_name;
                            $scope.dependentlovs.push(temp);
                        }
                        isLOV = true;
                    }
                })
                if (isLOV) {
                    $scope.offlineRefreshForm.show();
                } else {
                    $scope.storeForm(seqNo, data);
                }
            }).error(function (data, status) {
                globalObjectServices.displayErrorMessage(err)
            })
        }
        if (firstScreen == "O") {
            var l_url = $scope.url + 'addEntryForm?seqNo=' + ((parseInt(seqNo)) + 0.1) + '&userCode=' +
                    AuthServices.userCode();
            $http.get(l_url).success(function (data) {
                var formData = {};
                formData.data = data;
                formData.seqNo = ((parseInt(seqNo)) + 0.1);
                formData.table_desc = table_desc + " " + 1;
                $scope.formData.push(formData);
                data.recordsInfo.forEach(function (obj) {
                    if (obj.item_help_property == "L") {
                        if (obj.dependent_row == null) {
                            var url = $scope.url + 'getLOVDyanamically?uniqueID=' + ((parseInt(seqNo)) + 0.1) +
                                    '&forWhichColmn=' + obj.column_name;
                            var temp = {};
                            temp.lov = "";
                            temp.url = url;
                            temp.column_desc = obj.column_desc;
                            temp.column_name = obj.column_name;
                            temp.id = ((parseInt(seqNo)) + 0.1) + obj.column_name
                            $scope.lovs.push(temp);
                            isLOV = true;
                        } else {
                            var temp = {};
                            temp.lov = "";
                            temp.url = $scope.url + 'getLOVDyanamically?uniqueID=' + ((parseInt(seqNo)) + 0.1) +
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
                                            temp11.push({name: temp2[1], code: temp2[0]});
                                        })

                                        temp.dependentLov = temp11;
                                    } else {
                                        temp.dependentLov = "";
                                    }
                                }
                            })
                            temp.id = ((parseInt(seqNo)) + 0.1) + obj.column_name;
                            $scope.dependentlovs.push(temp);
                        }
                    }
                })
                l_url = $scope.url + 'addEntryForm?seqNo=' + ((parseInt(seqNo)) + 0.2) + '&userCode=' +
                        AuthServices.userCode();
                $http.get(l_url).success(function (data) {
                    var formData = {};
                    formData.data = data;
                    formData.seqNo = ((parseInt(seqNo)) + 0.2);
                    formData.table_desc = table_desc + " " + 2;
                    $scope.formData.push(formData);
                    data.recordsInfo.forEach(function (obj) {
                        if (obj.item_help_property == "L") {
                            if (obj.dependent_row == null) {
                                var url = $scope.url + 'getLOVDyanamically?uniqueID=' + ((parseInt(seqNo)) + 0.2) +
                                        '&forWhichColmn=' + obj.column_name;
                                var temp = {};
                                temp.lov = "";
                                temp.url = url;
                                temp.column_desc = obj.column_desc;
                                temp.column_name = obj.column_name;
                                temp.id = ((parseInt(seqNo)) + 0.2) + obj.column_name
                                $scope.lovs.push(temp);
                                isLOV = true;
                            } else {
                                var temp = {};
                                temp.lov = "";
                                temp.url = $scope.url + 'getLOVDyanamically?uniqueID=' + ((parseInt(seqNo)) + 0.2) +
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
                                                temp11.push({name: temp2[1], code: temp2[0]});
                                            })

                                            temp.dependentLov = temp11;
                                        } else {
                                            temp.dependentLov = "";
                                        }
                                    }
                                })
                                temp.id = ((parseInt(seqNo)) + 0.2) + obj.column_name;
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
        }, function (err) {});

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
                }
            })
            dataServices.storeLOV($scope.lov, item.id).then(function (data) {
                globalObjectServices.displayCordovaToast('Data saved successfully...')
            }, function (err) {})
        }).error(function (data, status) {
            globalObjectServices.displayErrorMessage(status)
        })
    }

    $scope.storeDependentLov = function (item, value) {

        var url = item.url + value + "&forWhichColmn=" + item.column_name;
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
            }, function (err) {})
        }).error(function (data, status) {
            globalObjectServices.displayErrorMessage(status)
        })
    }
    $scope.$on('$destroy', function () {
        $scope.offlineRefreshForm.remove();
    });
})

DynamicApp.controller('locationTrackingCtrl', function ($rootScope, $interval, dataServices,
        globalObjectServices, AuthServices, $stateParams, $scope, $http) {
    var lt = this;
    var sp = AuthServices.tabParam();
    var interval = "";
    lt.isStart = AuthServices.isLocationTracking();
    lt.start = function () {
        interval = $interval(callAtInterval, (1000 * 60 * parseFloat(sp.replicate_fields)));
        AuthServices.setLocationTracking(true);
        lt.isStart = true;
    }
    lt.stop = function () {
        $interval.cancel(interval);
        AuthServices.setLocationTracking(false);
        lt.isStart = false;
    }

    function callAtInterval() {
        globalObjectServices.getLatLngLocTim().then(function (data) {
            // http://192.168.100.143:8080/DynamicAppWSV4/webService/CPT/192.168.100.10/1521/NA/NA/GPStracking?seqNo=1&userCode=SHASHANK&lat=30&lng=30&location=trimurti%20nager&deviceId=&DeviceName=
            var url = $scope.url + "GPStracking?seqNo=" + AuthServices.appSeqNo() + "&userCode=" + AuthServices.userCode() +
                    "&lat=" + data.l_latitude + "&lng=" + data.l_longitude +
                    "&location=" + data.l_location + "&locationDate=" + data.l_dateTime + '&deviceId=' + $scope.deviceID + '&DeviceName=' + $scope.deviceName;
            // alert("URL1     :    " + url);
            $http.get(url).success(function (dataa) {
                // alert("URL2     :   " + url);
                globalObjectServices.displayCordovaToast('Location saved successfully...')
            }).error(function (err, status) {
                // alert("LOCATION ERROR : " + err);
            })
        });

    }

}) // locationTrackingCtrl Close

DynamicApp.controller('summaryReportCtrl', function ($state, $scope, $stateParams, $http, $filter, addUpdateEntryServices,
        AuthServices, globalObjectServices, reportAnalysisServices, $rootScope, $ionicModal) {
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


    $ionicModal.fromTemplateUrl('/DynamicAppWSV4/static/templates/addEntryLOV.html', function (modal) {
        $scope.addEntryLOVModal = modal
    }, {scope: $scope})

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
                    // alert(setYear);
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


        console.log("filterRefreshReportData JSON : " + JSON.stringify(jsonList));
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


    $scope.openReportAnalysis = function (seq_no, reportingType) {
        var l_graphObj = [];
        l_graphObj.seq_no = seq_no;
        l_graphObj.reportingType = reportingType;
        l_graphObj.firstScreen = sp_obj.firstScreen;
        l_graphObj.filteredParam = sp_obj.filteredParam;
        $state.go('report', {obj: l_graphObj});
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

    $scope.openSlide = function (seq_no) {
        $http.get($scope.url + 'reportFilterForm?userCode=' + AuthServices.userCode() +
                '&seqNo=' + seq_no).success(function (data) {
            $scope.fields = addUpdateEntryServices.setDataCommon(data.recordsInfo);
            var count = 1;
            $scope.fields.forEach(function (obj) {
                obj.column_name = "col" + count;
                count++;
            })
        }).error(function (data, status) {})
    }


    $scope.searchEntity = {};
    $scope.openLov = function (column_desc, column_name, dependent_row, dependent_row_logic, item_help_property) {
        globalObjectServices.showLoading();
        $scope.lov = "";
        $scope.column_desc = column_desc;
        $scope.column_name = column_name;
        $scope.flagLOVCodeValue = "";
        $scope.searchEntity.search = '';
        $scope.itemHelpPropertyFlag = item_help_property;
        addUpdateEntryServices.openLov(column_desc, column_name, dependent_row, dependent_row_logic,
                item_help_property, $scope.lov, $scope.url, sp_obj.seqNo, true).then(function (result) {
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

    $scope.setLOVValues = function (code, name, column_desc, dependent_row, rowID) {
        $scope.fields = addUpdateEntryServices.setLOVValues(code, name, column_desc,
                dependent_row, rowID, $scope.fields, sp_obj.seqNo, sp_obj.type, $scope.url)
        $scope.addEntryLOVModal.hide();
        globalObjectServices.scrollTop();
    }

})

DynamicApp.controller('reportAnalysisCtrl', function ($state, $stateParams, $ionicModal, $ionicPopover,
        $scope, $http, AuthServices, globalObjectServices, $filter) {
    var sp_obj = $state.params.obj;
    if (sp_obj.firstScreen == 1) {
        $scope.showTableFlag = 1;
    }
    globalObjectServices.showLoading();
    $scope.selectedValues = "Table";
    $scope.flagForTypeChange = 4;
    $scope.ReportList = [{"reportType": "Graph"}, {"reportType": "Table"}];
    $scope.seriesData = [];
    $scope.labelData = [];
    var columnName = [];
    var l_graphData = "";
    var colors;
    var JSONvalue = {};
    JSONvalue.data = new Array();

//    $ionicModal.fromTemplateUrl('/DynamicAppWSV4/static/templates/reportDrillDown.html', function(modal) {
//        $scope.reportDrillDownModal = modal
//    }, { scope: $scope })

    $ionicPopover.fromTemplateUrl('/DynamicAppWSV4/static/templates/reportDrillDown.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.reportDrillDownModal = popover;
    });


    $http.get($scope.url + 'tableLabelDetail?seqNo=' + sp_obj.seq_no + '&userCode=' +
            AuthServices.userCode()).success(function (data) {
        $scope.graphGabelDetail = data.graphGabelDetail;
        globalObjectServices.hideLoading();
        l_graphData = angular.copy(data.graphGabelDetail);
        $scope.graphGabelDetail.forEach(function (temp) {
            $scope.detailLabelData = temp.graphLabelData;
            $scope.tableheader = temp.series;
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
                        $scope.tableValue.push({"series": obj1, "value": obj2[i]});
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
        })

//        $scope.hashIndex = [];
//        for (var i = 0; i < $scope.tableheader.length; i++) {
//            if (($scope.tableheader[i]).indexOf('#') > -1) {
//                $scope.hashIndex[i] = $scope.tableheader[i].split("#")[1];
//                $scope.tableheader[i] = $scope.tableheader[i].split("#")[0];
//            } else {
//                $scope.hashIndex[i] = "NA";
//            }
//        }
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
                            if (avg) {
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
        $scope.detailLabelData.push(lastRow);
    }).error(function (data, status) {
        globalObjectServices.displayErrorMessage(status)
    })
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
            l_graphData.forEach(function (temp) {
                $scope.graphTypeList = [{"graphType": "Bar Chart"}, {"graphType": "Line Chart"}];
                $scope.data = [];
                var l_data = globalObjectServices.transpose(temp.graphLabelData);
                $scope.labels = [];
                var value_tosend = [];
                $scope.colors = [{backgroundColor: "#28a54c", borderColor: "#28a54c"}]
                var i = 0;
                l_data.forEach(function (obj) {
                    if ((!obj.some(isNaN)) == true) {
                        value_tosend.push(obj);
                        $scope.labels.push(temp.series[i]);
                        i++
                    } else {
                        i++
                    }

                })
                var l_length = Object.keys(value_tosend).length;
                var aggregate = globalObjectServices.aggregate((value_tosend), l_length);
                $scope.data.push(aggregate);
            })
        }
    };

    $scope.reportDetail = {};
    $scope.tableDesc = function (index, slNo, event) {
        var value = angular.copy($scope.detailLabelData[index]);
        for (var i = 0; i < value.length; i++) {
            value[i] = value[i].replace('&', '^');
            columnName[i] = columnName[i].replace('&', '^');
        }
        $http.get($scope.url + 'reportDrillDownGrid?seqId=' + sp_obj.seq_no + "&value=" + value +
                '&slNo=' + slNo + "&columnName=" + columnName).success(function (data) {
            $scope.reportDetail.tableHeader = data.tableHeader;
            $scope.reportDetail.tableData = data.tableData;
            $scope.reportHeading = data.para_desc;
            $scope.reportDrillDownModal.show(event);
        });
    }

    $scope.reportingType = sp_obj.reportingType;
    $scope.selectedChart = "Bar Chart";
    $scope.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];
    $scope.labels = ["JAN", "FEB", "MAR"];
    $scope.options = {responsive: true};
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
        if (l_graphtype === "Pie Chart") {
            $scope.flagForPageChange = 2;
        } else if (l_graphtype === "Line Chart") {
            $scope.flagForPageChange = 3;
        } else if (l_graphtype === "Bar Chart") {
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
        if (tableView === true) {
            $scope.flagForTableView = 0;
        } else {
            $scope.flagForTableView = 1;
        }
    }
})

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

    $ionicPopover.fromTemplateUrl('/DynamicAppWSV4/static/templates/optionPopOver.html', {
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
    }, function (err) {});

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
            if (l_flagforPopulatedForm == 0) {
                dataServices.uploadAllEntry(item, sp_obj.seqNo, $scope.url).then(function (data) {
                    deleteEntry(item, index);
                    globalObjectServices.displayCordovaToast('Entry uploaded sucessfully...')
                }, function (err) {
                    globalObjectServices.displayCordovaToast('Try Again..')
                });
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
        globalObjectServices.confirmationPopup('Do you want to Delete Entry??').then(function (data) {
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
            l_param.uploadEntryStatus = uploadEntryStatus
            $state.go('addPopulatedLocationEntry', {obj: l_param});
        } else {
            if (l_flagforPopulatedForm == 0) {
                l_param.types = 'P';
                l_param.fieldsTH = fieldsTH;
                $state.go('addPopulatedEntry', {obj: l_param});
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
        $stateParams, $ionicModal, $scope, $http, addUpdateEntryServices, globalObjectServices, $ionicPopover, $rootScope) {
    // globalObjectServices.showLoading();
    var sp_obj = $state.params.obj; // State Parameter from calendarCtrl

    $scope.flagForUpdateButton = '';
    $scope.flagForApproveButton = '';
    $scope.flagForDeleteButton = '';

    $ionicPopover.fromTemplateUrl('/DynamicAppWSV4/static/templates/optionPopOver.html', {
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

    var l_selectedDate = ($filter('date')(sp_obj.date2, 'dd-MM-yyyy'))
    $ionicModal.fromTemplateUrl('/DynamicAppWSV4/static/templates/entryDetails.html', function (modal) {
        $scope.entryDetailsModal = modal
    }, {scope: $scope})

    if ($rootScope.online) {
        var url = $scope.url + 'dynamicEntryList?userCode=' + AuthServices.userCode() +
                '&reportingDate=' + l_selectedDate + '&seqNo=' + sp_obj.seqNo;
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

    $scope.getEntryDetails = function (listData) {
        globalObjectServices.showLoading();
        if (sp_obj.types == 'P') {
            var l_obj = [];
            l_obj.seqNo = sp_obj.seqNo;
            l_obj.listData = listData;
            globalObjectServices.hideLoading();
            $state.go('entryDetailsInTabular', {obj: l_obj})
            globalObjectServices.nativeTranstion("right");
        } else {
            var l_seqId = "";
            listData.forEach(function (obj) {
                if (obj.column_name == "SEQ_ID") {
                    l_seqId = obj.value;
                }
            })
            $http.get($scope.url + 'getEntryDetailDyanamically?tableSeqNo=' + sp_obj.seqNo +
                    '&entrySeqId=' + l_seqId).success(function (data) {
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
            if (obj.column_name == "SEQ_ID") {
                $scope.seqId = obj.value;
            }
        })
        if (sp_obj.types == 'P') {
            var l_obj = [];
            l_obj.seqNo = sp_obj.seqNo;
            l_obj.listData = listData;
            $state.go('entryDetailsInTabular', {obj: l_obj})
            globalObjectServices.nativeTranstion("right");
        } else {
            var l_param = [];
            l_param.seqId = $scope.seqId;
            l_param.fileId = $scope.fileId;
            l_param.table_desc = sp_obj.table_desc;
            l_param.type = "Update";
            l_param.types = sp_obj.types;
            l_param.dependent_next_entry_seq = sp_obj.dependent_next_entry_seq;
            AuthServices.setTabParam(l_param);
            $state.go('addUpdateEntry');
            globalObjectServices.nativeTranstion("right");
        }
        $scope.entryDetailsModal.hide();
        $scope.entryDetailsModal.remove().then(function () {
            $scope.entryDetailsModal = null;
        });
    }

    $scope.openUpdateEntryEntryList = function (listData) {
        $scope.optionPopOver.hide();
        listData.forEach(function (obj) {
            if (obj.column_name == "SEQ_ID") {
                $scope.seqId = obj.value;
            }
        })

        var l_param = [];
        l_param.seqId = $scope.seqId;
        l_param.fileId = $scope.fileId;
        l_param.table_desc = sp_obj.table_desc;
        l_param.dependent_next_entry_seq = sp_obj.dependent_next_entry_seq;
        l_param.type = "Update";
        AuthServices.setTabParam(l_param);
        $state.go('addUpdateEntry');
        globalObjectServices.nativeTranstion("right");
        $scope.entryDetailsModal.hide();
        $scope.entryDetailsModal.remove().then(function () {
            $scope.entryDetailsModal = null;
        });
    }

    // Navigate to ADD_ENTRY module
    $scope.addEntry = function () {
        var l_obje = [];
        l_obje.type = "addEntry";
        l_obje.table_desc = sp_obj.table_desc;
        AuthServices.setTabParam(l_param);
        $state.go('addUpdateEntry');
        globalObjectServices.nativeTranstion("right");
    }

    // Delete Entry
    $scope.deleteEntry = function (item, index) {
        var l_seqId = '';
        item.forEach(function (obj) {
            if (obj.column_name == "SEQ_ID") {
                l_seqId = obj.value;
            }
        })
        globalObjectServices.confirmationPopup('Do you want to Delete Entry??').then(function (data) {
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
}) // entryListCtrl Close

DynamicApp.controller('entryDetailsInTabularCtrl', function ($state, $scope, $http, $stateParams,
        globalObjectServices, AuthServices, addUpdateEntryServices) {

    var l_obj = $state.params.obj;
    var l_seqId = "";
    var l_Vrno = "";
    var listData = l_obj.listData;
    var l_data = '';
    var temp_data = "";

    var usercode = AuthServices.userCode();
    listData.forEach(function (obj) {
        if (obj.column_name == "SEQ_ID") {
            l_seqId = obj.value;
        }
        if (obj.column_desc == "VRNO") {
            l_Vrno = obj.value;
        }
    })
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
    var l_TableHeaderData = "";

    $http.get($scope.url + 'entryDetailInTabular?seqNo=' + l_obj.seqNo + '&vrno=' + l_Vrno +
            '&userCode=' + usercode).success(function (data) {
        // console.log($scope.url + 'entryDetailInTabular?seqNo=' + l_obj.seqNo + '&vrno=' + l_Vrno +'&userCode=' + usercode)
        var entryDetailsinTabular = data.recordInfo;
        l_TableHeaderData = entryDetailsinTabular.tableHeader;
        temp_data = entryDetailsinTabular.tableData;
        $scope.tableData = angular.copy(temp_data);
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
        var l_value = '';
        var l_value1 = '';
        var l_value2 = 'Seq ID';
        $scope.tableHeader.push(l_value); //For table's first column
        $scope.tableHeader.push(l_value1); //For table's second column

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
                        temp1.push({name: temp2[1], code: temp2[0]});
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
    }).error(function (data, status) {
        globalObjectServices.displayErrorMessage(status)
    })

    $scope.editrow = function (seqId) {
        $scope.flagForEdit = [];
        $scope.flagForEdit[seqId] = 1;
    }

    $scope.deleterow = function (index, seq_id) {
        globalObjectServices.confirmationPopup('Do you want to Delete Entry??').then(function (data) {
            if (data == 'ok') {
                addUpdateEntryServices.deleteEntry(seq_id, l_obj.seqNo, $scope.url).then(function (data) {
                    $scope.tableData = globalObjectServices.deleteEachRow($scope.tableData, index)
                    globalObjectServices.displayCordovaToast('Entry Deleted Successfully..')
                }, function (err) {
                    globalObjectServices.displayErrorMessage(err);
                })
            } else {
            }
        })
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
            l_recordsInfo.push({recordsInfo: [value]});
        })
        key = "list";
        dataListToSend[key] = l_recordsInfo;
        var fd = new FormData();
        var uploadUrl = $scope.url + 'multipleUpdateEntryInfo';
        fd.append('jsonString', JSON.stringify(dataListToSend));
        // console.log("dataListToSend" + JSON.stringify(dataListToSend))
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            globalObjectServices.hideLoading();
            if (data.status == "updated data") {
                globalObjectServices.displayCordovaToast('Entry Updated Successfully..')
                globalObjectServices.goBack(-2);
            } else {
                globalObjectServices.displayCordovaToast('Try Again..')
            }
        }).error(function (data, status) {
            globalObjectServices.hideLoading();
            globalObjectServices.displayErrorMessage(status)
        })
    }

    $scope.cancelAddUpdateEntry = function () {
        globalObjectServices.confirmationPopup('Do you want to Cancel Entry??').then(function (data) {
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
    }).error(function (data) {})

    $scope.openShortReport = function (seqNo, slno, status) {
        if (status) {
            $http.get($scope.url + 'shortReportDetail?seqId=' + seqNo + '&slNo=' + slno).success(function (data) {
                $scope.shortReportDetail.forEach(function (obj) {
                    if (obj.slno == slno) {
                        obj.shortReprt = data.value;
                        obj.shortReportProcess = false;
                    }
                })
            }).error(function (data) {})
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
//                            height: height + 'px',
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
//                            height: height + 'px',
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