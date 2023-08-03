angular.module('starter.controllers')

.service('reportAnalysisServices', function($q, $http, $rootScope, AuthServices, $cordovaToast, $filter) {


    function setTab(url, seqNo, firstScreen) {
        return $q(function(resolve, reject) {
            if (firstScreen == 'G') {
                var l_url = url + 'graphTabList?portletId=' + AuthServices.portlet_Id() + '&seqNo=' + seqNo + '&userCode=' + AuthServices.userCode();
            } else {
                var l_url = url + 'tableTabList?portletId=' + AuthServices.portlet_Id() + '&seqNo=' + seqNo + '&userCode=' + AuthServices.userCode();
            }
            $http.get(l_url).success(function(data) {
                var l_tabList = data.tabList;
                resolve(l_tabList);
            }).error(function(data, status) { reject(status) })


            // if (firstScreen == 'G') {
            //     $http.get().success(function(data) {
            //         var l_tabList = data.tabList;
            //         resolve(l_tabList);
            //     }).error(function(data) {})
            // } else {
            //     $http.get().success(function(data) {
            //         var l_tabList = data.tabList;
            //         resolve(l_tabList);
            //     }).error(function(data) {})
            // }

        })
    }

    function setshortReportTypeTab(url, seqNo) {
        return $q(function(resolve, reject) {

            $http.get(url + 'shortReportType?seqNo=' + seqNo).success(function(data) {
                var l_ShortReportTabList = data.tabList;
                resolve(l_ShortReportTabList);

            }).error(function(data, status) { reject(status) })

        })
    }

    return {
        // refreshSummaryValue: refreshSummaryValue,
        setTab: setTab,
        setshortReportTypeTab: setshortReportTypeTab
    }

})