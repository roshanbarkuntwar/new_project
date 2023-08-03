
angular.module('starter.controllers').controller('reportCardViewCtrl', function ($state, $stateParams, $ionicModal,
    $scope, $http, AuthServices, globalObjectServices, $filter) {
    var sp_obj = $state.params.obj;
    $scope.paginationFlag = sp_obj.paginationFlag
    $scope.filteredParam = sp_obj.filteredParam;
    $scope.reportingType=sp_obj.reportingType
    if (sp_obj.firstScreen == 1) {
        $scope.showTableFlag = 1;
    }
    globalObjectServices.showLoading();
   
    $scope.seriesData = [];
    $scope.labelData = [];
    var columnName = [];
    var l_graphData = "";
    var colors;
    var JSONvalue = {};
    JSONvalue.data = new Array();

    var url = "";
    $scope.pageCount = 0;
    var graphDisplay=true;
    $scope.loadData = function () {
        $scope.searchPageCount = 0;
       
            url = $scope.url + 'tableLabelDetail?seqNo=' + sp_obj.seq_no + '&userCode=' +
                AuthServices.userCode();
      
        console.log(url);
        $http.get(url).success(function (data) {
            $scope.graphGabelDetail = data.graphGabelDetail;
            globalObjectServices.hideLoading();
            l_graphData = angular.copy(data.graphGabelDetail);
            $scope.graphGabelDetail.forEach(function (temp) {
                $scope.detailLabelData = temp.graphLabelData;
                $scope.tableheader = temp.series;
                $scope.noOfColumns = temp.noOfColumns;
            })
        }).error(function (data, status) {
            globalObjectServices.displayErrorMessage(status)
        })
    }

    $scope.loadData();
    $scope.loadMoreTableData = function (searchFlag, searchText) {
        globalObjectServices.showLoading();
        $scope.pageCount++;


        if (searchFlag) {
            $scope.searchPageCount++;
            url = $scope.url + "searchedReportData?seqNo=" + sp_obj.seq_no + '&userCode=' +
                AuthServices.userCode() + "&searchText=" + searchText + "&pageNo=" + $scope.searchPageCount;

        } else {
            url = $scope.url + "tableLabelPagedDetail?seqNo=" + sp_obj.seq_no + '&userCode=' +
                AuthServices.userCode() + "&pageNo=" + $scope.pageCount;
        }

        console.log(url);

        $http.get(url).success(function (data) {
            $scope.graphGabelDetail = data.graphGabelDetail;

            // l_graphData
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
    // http://192.168.100.145:8080/DynamicAppWS/webService/SM/NA/NA/VDEMOERP/VDEMOERP/searchedReportData?seqNo=25&userCode=SHASHANK&searchText=D&pageNo=0
        globalObjectServices.showLoading();
        var url = "";
        url = $scope.url + "searchedReportData?seqNo=" + sp_obj.seq_no + '&userCode=' +
            AuthServices.userCode() + "&searchText=" + searchText + "&pageNo=0";
        console.log(url);
        $http.get(url).success(function (data) {
            $scope.graphGabelDetail = data.graphGabelDetail;
            globalObjectServices.hideLoading();
            l_graphData = angular.copy(data.graphGabelDetail);
            $scope.graphGabelDetail.forEach(function (temp) {
                $scope.detailLabelData = temp.graphLabelData;
                columnName = temp.columnName;
                $scope.myTableData = [];
                $scope.tableValue = [];
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
        
        }).error(function (data, status) {
            globalObjectServices.displayErrorMessage(status)
        })
    }

 }) ///reportAnalysisCtrl