angular.module('starter.controllers').controller('imageEntryCtrl',
    function (AuthServices, $state, $stateParams, addUpdateEntryServices, $ionicModal,
        $scope, globalObjectServices, $rootScope, $http) {
        // alert("S-0");

        // $scope.$on("$ionicView.enter", function (scopes, states) {
        //     alert("imageEntryCtrl enter");
        // });

        // $scope.$on("$ionicView.loaded", function (event) {
        //     alert("imageEntryCtrl loaded");
        // })

        var l_userCode = AuthServices.userCode();
        var l_appSeqNo = AuthServices.appSeqNo();

        var sp_Obj = AuthServices.tabParam();
        var l_url = "";
        $scope.table_desc = sp_Obj.table_desc;

        // alert("S-1");
        var replaceParameter = "";
        var replaceArr = {};

        sp_Obj.headEntryFieldsData.forEach(function (element) {
            if (element.valueToSend) {
                // alert("S-L");
                replaceArr[element.column_name] = element.valueToSend
            }
        });

        // alert("S-2");

        angular.forEach(replaceArr, function (value1, key1) {
            // alert("S-L");
            if (replaceParameter) {
                replaceParameter = replaceParameter + "#" + value1;
            } else {
                replaceParameter = value1
            }
        })

        // alert("S-3");

        console.log(replaceArr);

        var url = $scope.url + 'getDependentImage?seqNo=' + l_appSeqNo + '&replaceParameter=' + replaceParameter;
        // var url = "http://192.168.100.148:8080/DynamicAppWS/webService/MS/192.168.100.173/1521/MANERP/MANERP/getDependentImage?seqNo=13&replaceParameter=K-NDN60-%2023";
        console.log(url);
        if ($rootScope.online) {
            // alert("S-4");
            globalObjectServices.showLoading();
            $http.get(url).success(function (data) {
                // alert("S-5/ S");
                globalObjectServices.hideLoading();
                $scope.imageDetails = data.dependentImages;
                if (!$scope.imageDetails) {
                    globalObjectServices.displayCordovaToast("Data not Available");
                }
            }, function (err) {
                // alert("S-5 E");
                globalObjectServices.hideLoading();
                globalObjectServices.displayCordovaToast("Data not Available");
            })
        } else {
            // alert("S-6 o");
            globalObjectServices.displayCordovaToast("Network Not Available");
        }


        $ionicModal.fromTemplateUrl('templates/ImageEntryZoomModal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });


        $scope.openImage = function (img) {
            $scope.zoomImage = img;
            $scope.modal.show();
        }

        $scope.$on('$destroy', function () {

            $scope.modal.remove().then(function () {
                $scope.modal = null;
            })
        })

        // http://localhost:8080/DynamicAppWS/webService/MS/192.168.100.173/1521/MANERP/MANERP/getDependentImage?seqNo=13&markno=

    })