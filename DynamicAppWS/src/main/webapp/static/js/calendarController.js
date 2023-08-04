// Git Repo: https://github.com/Russian60/flex-calendar

angular.module('app', ['flexcalendar', 'pascalprecht.translate'])
    .controller('MainController', ['$scope', '$http', '$state', '$filter', '$stateParams', '$cordovaToast', 'AuthServices',
        function ($scope, $http, $state, $filter, $cordovaToast, $stateParams, AuthServices, globalObjectServices) {

            var l_userCode = AuthServices.userCode();
            var sp_obj = $state.params.obj; // State parameter from dashboardCtrl
            var l_obje = [];
            l_obje.seqNo = AuthServices.appSeqNo();
            var default_populate_data = sp_obj.default_populate_data;
            var updation_process = sp_obj.updation_process;
            //console.log($scope.url + "reportingDateListByType?userCode=" + l_userCode + '&seqNo=' + l_obje.seqNo);
            $http.get($scope.url + "reportingDateListByType?userCode=" + l_userCode + '&seqNo=' + l_obje.seqNo).success(function (data) {
                $scope.events = data.reportingDate;
                // //console.log(" $scope.events : " + JSON.stringify($scope.events));
            })

            $scope.options = {
                defaultDate: $scope.date1,
                minDate: "2015-01-01",
                maxDate: "2020-12-31",
                disabledDates: [],
                dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
                mondayIsFirstDay: true, //set monday as first day of week. Default is false
                eventClick: function (date) {
                    var dates = date.date;
                    var Inputdate = JSON.stringify($filter('date')(dates, 'yyyy-MM-dd'));
                    l_obje.date2 = Inputdate.split('"').join('');
                    l_obje.updation_process = updation_process;
                    l_obje.table_desc = sp_obj.table_desc;
                    $state.go('entryList', { obj: l_obje });
                    // globalObjectServices.nativeTranstion("left");
                },
                dateClick: function (date) { },
                changeMonth: function (month, year) { },
            };

            $scope.addEntry = function () {
                // l_obje.type = "addEntry";
                // l_obje.table_desc = sp_obj.table_desc;

                // if (default_populate_data == null || default_populate_data == '') {
                //     if (updation_process == "V#U#" || updation_process == "V#") {
                //         // var l_obj = [];
                //         // l_obje.seqNo = l_obje.seqNo;
                //         var dates = new Date();
                //         var Inputdate = JSON.stringify($filter('date')(dates, 'dd-MM-yyyy'));
                //         l_obje.date2 = Inputdate.split('"').join('');
                //         l_obje.table_desc = $scope.table_desc;
                //         // l_obje.firstScreen = firstScreen;
                //         l_obje.updation_process = updation_process;
                //         $state.go('entryList', { obj: l_obje });
                //     } else {
                //         var l_param = [];
                //         l_param.updation_process = updation_process;
                //         // l_param.firstScreen = firstScreen;
                //         $state.go('addUpdateEntry', { obj: l_param });
                //     }
                // } else {
                //     if (updation_process == "V#U#" || updation_process == "V#") {
                //         // var l_obje = [];
                //         // l_obje.seqNo = l_obje.seqNo;
                //         var dates = new Date();
                //         var Inputdate = JSON.stringify($filter('date')(dates, 'dd-MM-yyyy'));
                //         l_obje.date2 = Inputdate.split('"').join('');
                //         l_obje.table_desc = $scope.table_desc;
                //         // l_obje.firstScreen = firstScreen;
                //         l_obje.updation_process = updation_process;
                //         $state.go('entryList', { obj: l_obje });
                //     } else {
                //         var l_param = [];
                //         l_param.type = "order";
                //         l_param.updation_process = updation_process;
                //         $state.go('addPopulatedEntry', { obj: l_param });
                //     }
                // }
                // $state.go('addUpdateEntry', { obj: l_obje });


                l_obje.type = "addEntry";
                l_obje.table_desc = sp_obj.table_desc;
                l_obje.updation_process = updation_process;
                l_obje.table_desc = $scope.table_desc;
                var dates = new Date();
                var Inputdate = JSON.stringify($filter('date')(dates, 'dd-MM-yyyy'));
                l_obje.date2 = Inputdate.split('"').join('');
                if (default_populate_data == null || default_populate_data == '') {
                    if (updation_process.charAt(0) == 'V') {
                        $state.go('entryList', { obj: l_obje });
                    } else {
                        $state.go('addUpdateEntry', { obj: l_obje });
                    }
                    // globalObjectServices.nativeTranstion("left");
                } else {
                    if (updation_process.charAt(0) == 'V') {
                        $state.go('entryList', { obj: l_obje });
                    } else {
                        $state.go('addPopulatedEntry', { obj: l_obje });
                    }
                    // globalObjectServices.nativeTranstion("left");
                }
            }
        }
    ])

    .service('AuthServices', function ($q, $http, $rootScope) {
        var LOCAL_TOKEN_KEY = 'yourTokenKey';
        var userName = '';
        var isAuthenticated = false;
        var authToken;
        var userCode = '';
        var valueFormat = ''
        var appType = '';
        var _url = '';
        var appSeqNo = '';
        var tabParam = "";
        var portlet_Id = '';
        var data_UPLOAD = "";
        var screenOrientionView = '';
        var isLocationTracking = false;
        var login_params = '';
        var entity_code = division_data = acc_year = dept_code = '';
        var databaseUser = '';
        var dbPassword = '';
        var dbUrl = '';
        var portNo = '';
        var acc_code = '';
        var password = '';
        var force_flag;

        //console.log("init force_flag" + force_flag);
        /* variable "data_UPLOAD" is used from web service generated JSON,
           to verify that LAT, LONG & Location is to be saved for particular entrty or not */

        function loadUserCredentials() {
            var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            if (token) {
                useCredentials(token);
            }
        }


        function setLocalData(value) {
            valueFormat=value
            // window.localStorage.setItem(key, JSON.stringify(value));
        }
        function getLocalData(key) {
            // alert("f")
            valueFormat = JSON.parse(window.localStorage.getItem(key));
            // return 
        }

        function setAppSeqNo(asn) {
            appSeqNo = asn;

        }
        function setForce_flag(f) {

            //console.log("set force_flag" + f);
            force_flag = f;

            //console.log("setted force_flag" + force_flag);

        }

        function setPortletId(portletId) {
            portlet_Id = portletId;
        }

        function setScreenOrientionView(SOV) {
            screenOrientionView = SOV;
        }

        function setData_UPLOAD(value) {
            data_UPLOAD = value;
        }

        function setTabParam(param) {
            tabParam = param;

        }

        function setLoginParam(param) {
            login_params = param;
        }

        function storeUserCredentials(token) {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            useCredentials(token);
        }

        function useCredentials(token) {
            var tokenArray = token.split(',');
            userCode = tokenArray[0];
            userName = tokenArray[1];
            appType = tokenArray[2];
            _url = tokenArray[3];
            entity_code = tokenArray[4];
            division_data = tokenArray[5];
            acc_year = tokenArray[6];
            dept_code = tokenArray[7];
            databaseUser = tokenArray[8];
            dbPassword = tokenArray[9];
            dbUrl = tokenArray[10];
            portNo = tokenArray[11];
            acc_code = tokenArray[12];
            password = tokenArray[13];

            isAuthenticated = true;
            authToken = token;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            userCode = '';
            userName = '';
            appType = '';
            _url = '';
            entity_code = division_data = acc_year = acc_code = dept_code = '';
            portNo = '';
            dbPassword = '';
            dbUrl = '';
            databaseUser = '';
            password = '';
            isAuthenticated = false;
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }

        var login = function (userCode, userName, appType, _url, entityCode,
            divisionData, accYear, deptCode, databaseUser, dbPassword, dbUrl, portNo, acc_code, password) {
            return $q(function (resolve, reject) {
                storeUserCredentials(userCode + ',' + userName + ',' + appType + ',' + _url + ',' + entityCode + ',' +
                    divisionData + ',' + accYear + ',' + deptCode + ',' + databaseUser + ',' + dbPassword + ',' + dbUrl + ',' + portNo + ',' + acc_code + ',' + password + ",");
                resolve('Login success.');
            });
        };

        // var login = function(userCodeT, userNameT, appTypeT) {
        //     return $q(function(resolve, reject) {
        //         // storeUserCredentials(userCode + ',' + userName + ',' + appType + ',');
        //         userCode = userCodeT;
        //         userName = userNameT;
        //         appType = appTypeT;

        //         resolve('Login success.');
        //     });
        // };

        var logout = function () {
            destroyUserCredentials();
        };
        var isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
        };

        function setLocationTracking(val) {
            isLocationTracking = val
        }

        loadUserCredentials();

        return {
            login: login,
            logout: logout,
            isAuthorized: isAuthorized,
            setAppSeqNo: setAppSeqNo,
            setTabParam: setTabParam,
            setLoginParam: setLoginParam,
            setPortletId: setPortletId,
            setScreenOrientionView: setScreenOrientionView,
            setData_UPLOAD: setData_UPLOAD,
            setForce_flag: setForce_flag,
            setLocationTracking: setLocationTracking,
            setLocalData: setLocalData,
            getLocalData: getLocalData,
            isAuthenticated: function () {
                return isAuthenticated;
            },
            portlet_Id: function () {
                return portlet_Id;
            },
            userCode: function () {
                return userCode;
            },
            userName: function () {
                return userName;
            },
            appType: function () {
                return appType;
            },
            _url: function () {
                return _url;
            },
            appSeqNo: function () {
                return appSeqNo;
            },
            tabParam: function () {
                return tabParam;
            },
            login_params: function () {
                return login_params;
            },
            data_UPLOAD: function () {
                return data_UPLOAD;
            },
            screenOrientionView: function () {
                return screenOrientionView;
            },
            isLocationTracking: function () {
                return isLocationTracking;
            },
            entity_code: function () {
                return entity_code;
            },
            division_data: function () {
                return division_data;
            },
            acc_code: function () {
                return acc_code;
            },
            acc_year: function () {
                return acc_year;
            },
            dept_code: function () {
                return dept_code;
            },

            databaseUser: function () {
                return databaseUser;
            },
            dbPassword: function () {
                return dbPassword;
            },
            dbUrl: function () {
                return dbUrl;
            },
            portNo: function () {
                return portNo;
            },
            password: function () {
                return password;
            },
            force_flag: function () {
                //console.log("return force_flag " + force_flag);
                return force_flag;
            },
            valueFormat: function () {
                return valueFormat;
            }


        };
    })


// Library
! function () {
    "use strict";

    function e() {
        var e = '<div class="flex-calendar"><div class="month"><div class="arrow {{arrowPrevClass}}" ng-click="prevMonth()"></div><div class="label">{{ selectedMonth | translate }} {{selectedYear}}</div><div class="arrow {{arrowNextClass}}" ng-click="nextMonth()"></div></div><div class="week"><div class="day" ng-repeat="day in weekDays(options.dayNamesLength) track by $index">{{ day }}</div></div><div class="days" ng-repeat="week in weeks"><div class="day"ng-repeat="day in week track by $index"ng-class="{selected: isDefaultDate(day), event: day.event[0], disabled: day.disabled, out: !day}"ng-click="onClick(day, $index, $event)"><div class="number">{{day.day}}</div></div></div></div>',
            a = { restrict: "E", scope: { options: "=?", events: "=?" }, template: e, controller: t };
        return a
    }

    function t(e, t) {
        function a() {
            e.mappedDisabledDates = e.options.disabledDates.map(function (e) {
                return new Date(e)
            })
        }

        function n() {
            e.mappedEvents = e.events.map(function (e) {
                return e.date = new Date(e.date), e
            })
        }

        function o(t, a, n) { t && !t.disabled && (e.options.defaultDate = t.date, 0 != t.event.length ? e.options.eventClick(t, n) : e.options.dateClick(t, n)) }

        function s(t) { t && e.mappedEvents && (t.event = [], e.mappedEvents.forEach(function (e) { t.date.getFullYear() === e.date.getFullYear() && t.date.getMonth() === e.date.getMonth() && t.date.getDate() === e.date.getDate() && t.event.push(e) })) }

        function i(t) {
            if (!e.options.minDate && !e.options.maxDate) return !0;
            var a = t.date;
            return e.options.minDate && a < e.options.minDate ? !1 : e.options.maxDate && a > e.options.maxDate ? !1 : !0
        }

        function d(t) {
            if (!e.mappedDisabledDates) return !1;
            for (var a = 0; a < e.mappedDisabledDates.length; a++)
                if (t.year === e.mappedDisabledDates[a].getFullYear() && t.month === e.mappedDisabledDates[a].getMonth() && t.day === e.mappedDisabledDates[a].getDate()) return !0
        }

        function l() {
            var t = null,
                a = null;
            if (!e.options.minDate) return !0;
            var n = M.indexOf(e.selectedMonth);
            return 0 === n ? (t = e.selectedYear - 1, a = 11) : (t = e.selectedYear, a = n - 1), t < e.options.minDate.getFullYear() ? !1 : t === e.options.minDate.getFullYear() && a < e.options.minDate.getMonth() ? !1 : !0
        }

        function r() {
            var t = null,
                a = null;
            if (!e.options.maxDate) return !0;
            var n = M.indexOf(e.selectedMonth);
            return 11 === n ? (t = e.selectedYear + 1, a = 0) : (t = e.selectedYear, a = n + 1), t > e.options.maxDate.getFullYear() ? !1 : t === e.options.maxDate.getFullYear() && a > e.options.maxDate.getMonth() ? !1 : !0
        }

        function c() {
            e.weeks = [];
            for (var t = null, a = new Date(e.selectedYear, M.indexOf(e.selectedMonth) + 1, 0).getDate(), n = 1; a + 1 > n; n += 1) {
                var o = new Date(e.selectedYear, M.indexOf(e.selectedMonth), n),
                    l = new Date(e.selectedYear, M.indexOf(e.selectedMonth), n).getDay();
                e.options.mondayIsFirstDay && (l = (l + 6) % 7), t = t || [null, null, null, null, null, null, null], t[l] = { year: e.selectedYear, month: M.indexOf(e.selectedMonth), day: n, date: o, _month: o.getMonth() + 1 }, i(t[l]) ? e.mappedEvents && s(t[l]) : t[l].disabled = !0, t[l] && d(t[l]) && (t[l].disabled = !0), (6 === l || n === a) && (e.weeks.push(t), t = void 0)
            }
            e.arrowPrevClass = e.allowedPrevMonth() ? "visible" : "hidden", e.arrowNextClass = e.allowedNextMonth() ? "visible" : "hidden"
        }

        function D() { e.options._defaultDate = e.options.defaultDate ? new Date(e.options.defaultDate) : new Date, e.selectedYear = e.options._defaultDate.getFullYear(), e.selectedMonth = M[e.options._defaultDate.getMonth()], e.selectedDay = e.options._defaultDate.getDate(), c() }

        function p() {
            if (e.mappedDisabledDates && 0 !== e.mappedDisabledDates.length) {
                for (var t = 0; t < e.mappedDisabledDates.length; t++) e.mappedDisabledDates[t] = new Date(e.mappedDisabledDates[t]);
                c()
            }
        }

        function u(e) {
            return g.map(function (t) {
                return m(t).slice(0, e)
            })
        }

        function v(t) {
            if (t) {
                var a = t.year === e.options._defaultDate.getFullYear() && t.month === e.options._defaultDate.getMonth() && t.day === e.options._defaultDate.getDate();
                return a
            }
        }

        function f() {
            if (e.allowedPrevMonth()) {
                var t = M.indexOf(e.selectedMonth);
                0 === t ? (e.selectedYear -= 1, e.selectedMonth = M[11]) : e.selectedMonth = M[t - 1];
                var a = { name: e.selectedMonth, index: t - 1, _index: t + 2 };
                e.options.changeMonth(a, e.selectedYear), c()
            }
        }

        function h() {
            if (e.allowedNextMonth()) {
                var t = M.indexOf(e.selectedMonth);
                11 === t ? (e.selectedYear += 1, e.selectedMonth = M[0]) : e.selectedMonth = M[t + 1];
                var a = { name: e.selectedMonth, index: t + 1, _index: t + 2 };
                e.options.changeMonth(a, e.selectedYear), c()
            }
        }
        e.days = [], e.options = e.options || {}, e.events = e.events || [], e.options.dayNamesLength = e.options.dayNamesLength || 1, e.options.mondayIsFirstDay = e.options.mondayIsFirstDay || !1, e.onClick = o, e.allowedPrevMonth = l, e.allowedNextMonth = r, e.weekDays = u, e.isDefaultDate = v, e.prevMonth = f, e.nextMonth = h, e.arrowPrevClass = "visible", e.arrowNextClass = "visible";
        var m = t("translate"),
            M = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"],
            g = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        if (e.options.mondayIsFirstDay) {
            var y = g.shift();
            g.push(y)
        }
        e.options.minDate && (e.options.minDate = new Date(e.options.minDate)), e.options.maxDate && (e.options.maxDate = new Date(e.options.maxDate)), e.options.disabledDates && a(), e.events && n(), e.$watch("options.defaultDate", function () { D() }), e.$watch("options.disabledDates", function () { a(), p() }), e.$watch("events", function () { n(), c() })
    }
    angular.module("flexcalendar", []).directive("flexCalendar", e), t.$inject = ["$scope", "$filter"]
}();