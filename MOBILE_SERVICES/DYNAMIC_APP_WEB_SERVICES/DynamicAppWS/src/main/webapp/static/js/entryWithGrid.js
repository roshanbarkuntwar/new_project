angular.module('starter.controllers').controller('entryWithGridCtrl', function (AuthServices, $filter,
    $state, $stateParams, $ionicModal, $scope, $ionicPopup, addUpdateEntryServices, pouchDBService, $controller,
    dataServices, globalObjectServices, $rootScope, $ionicPopover, $sce, $cordovaCapture) {

    angular.extend(this, $controller('addUpdateOrderCtrl', {
        $scope: $scope
    }));

    var l_appSeqNo = AuthServices.appSeqNo();
    l_appSeqNo = ((parseInt(l_appSeqNo)) + 0.2);

    var l_object = [];
    addUpdateEntryServices.getLatLangTimeStamp().then(function (data) {
        l_object = data;
    })

    $scope.setData = function (spObj) {
        $scope.fields.forEach(function (obj1) {
            if ((obj1.updation_process).indexOf("I") > -1) { } else {
                obj1.entry_by_user = "F";
                obj1.nullable = "T";
            }
            if (obj1.column_desc == "SLNO" || obj1.column_name == "SLNO") {
                if (spObj.SLNO) {
                    obj1.value = parseInt(spObj.SLNO) + 1;
                } else {
                    obj1.value = 1;
                }
            }
            if (obj1.column_name == 'APP_IMENO' || obj1.column_default_value == "APP_IMENO") {
                obj1.value = $scope.deviceName + '~~' + $scope.deviceID;
            }
            if (obj1.column_name == "VRNO" || obj1.column_desc == "VRNO") {
                obj1.value = spObj.VRNO;
            }
            if (obj1.column_default_value == 'APP_GPS') {
                obj1.value = l_object.l_latitude + '~~' + l_object.l_longitude;
            }

            if ((obj1.item_help_property == "TB")) {
                var head = [];
                var row = [];
                angular.forEach($scope.defaultPopulateData, function (value, key) {
                    head.push(key);
                    row.push(value)
                });
                obj1.dropdownVal = {};
                obj1.dropdownVal.rows = globalObjectServices.transpose(row);
                obj1.dropdownVal.headers = head;

            }

            if (obj1.column_name == "CASE_NO") {
                if (spObj.CASE_NO) {
                    obj1.value = spObj.CASE_NO;
                    obj1.codeOfValue = spObj.CASE_NO;
                }
            }

            $scope.fields.forEach(function (obj2) {
                if (obj2.dependent_row) {
                    if (obj2.dependent_row.indexOf(obj1.column_name) > -1) {
                        if (obj2.item_help_property !== 'L') {
                            var whereClauseValue = obj2.dependent_row;
                            var arr = obj2.dependent_row.split('#');
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
                        }
                    }
                }
            })
        })
    }
})