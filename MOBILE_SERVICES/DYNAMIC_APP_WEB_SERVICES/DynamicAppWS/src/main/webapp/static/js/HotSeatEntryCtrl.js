angular.module('starter.controllers').controller('HotSeatEntryCtrl', function (AuthServices,
 $filter,$state, $stateParams, $ionicModal, $scope,
    globalObjectServices, $interval, $http) {

    var lt = this;
    // alert();
    var datess = new Date();
    var Inputdates = JSON.stringify($filter('date')(datess, 'dd-MM-yyyy hh:mm:ss'));
    var sp = AuthServices.tabParam();
    var interval;
    lt.start = function () {
        console.log(Inputdates);
        interval = $interval(callAtInterval, (1000 * parseFloat(sp.replicate_fields)));
        callAtInterval();
    }
    function callAtInterval() {
        var dates = new Date();
        var Inputdate = JSON.stringify($filter('date')(dates, 'dd-MM-yyyy hh:mm:ss'));
        console.log(Inputdate);
      
        // http://192.168.100.145:8080/DynamicAppWS/webService/SM/NA/NA/VDEMOERP/VDEMOERP/hotSeatVRNO?userCode=SHASHANK
        var url = $scope.url + 'hotSeatVRNO?userCode=' + AuthServices.userCode();

        $http.get(url).success(function (data) {
            if (data.vrno !== "Not Available") {
                sp.vrno = data.vrno
                sp.type = "H";
                AuthServices.setTabParam(sp);
                lt.stop();
                $state.go("addUpdateEntry");
                
            }
        }).error(function (data, status) {
            globalObjectServices.hideLoading();
            globalObjectServices.displayErrorMessage(status);
        })
    }

    lt.stop = function () {
        $interval.cancel(interval);
        lt.isStart = false;
    }

})
