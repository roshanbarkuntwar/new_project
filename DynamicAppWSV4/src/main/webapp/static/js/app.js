//var App = angular.module('starter', ["ngRoute", 'starter.controllers']);

angular.module('starter', ["ngRoute", 'app', 'nlFramework', 'ngImgCrop', 'ngSanitize', 'ionic',
    'chart.js', 'starter.controllers', 'ngCordova',
    'ion-datetime-picker', 'ngAnimate'
])

        .run(function ($ionicPlatform, $rootScope, $state, $window) {
            $rootScope.$state = $state
            // DatePicker Functionality
            $rootScope.dateValue = new Date()

            $ionicPlatform.ready(function () {

                if (window.Connection) {
                    if (navigator.connection.type == Connection.NONE) {
                    }
                }
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                    cordova.plugins.Keyboard.disableScroll(false);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault()
                }

                $rootScope.$on("$cordovaLocalNotification:click", function (notification, $state) {
                    window.location.href = '#/notification';
                })

            })
        })

//        .config(function ($routeProvider) {
//            $routeProvider
//                    .when("/banana", {
//                        templateUrl: 'static/templates/login.html',
//                        controller: "loginCtrl"
//                    })
//                    .when("/tomato", {
//                        template: "<h1>Tomato</h1><p>Tomatoes contain around 95% water.</p>"
//                    })
//                    .otherwise({
//                        template: "<h1>Nothing</h1><p>Nothing has been selected BUT WE WILL DO IT ANYWAYS...</p>"
//                    });
//        })

        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
            $ionicConfigProvider.views.transition('none');
            $stateProvider

                    .state('login', {
                        url: '/login?statusss',
                        templateUrl: '/DynamicAppWSV4/static/templates/login.html',
                        controller: 'loginCtrl',
                        cache: false

                    })
                    .state('changePassword', {
                        url: '/changePassword',
                        templateUrl: '/DynamicAppWSV4/static/templates/forgetpassword.html',
                        controller: 'ChangePasswordCtrl',
                        cache: false
                    })

                    .state('dashbord', {
                        url: '/dashbord',
                        templateUrl: '/DynamicAppWSV4/static/templates/dashbord.html',
                        controller: 'dashbordCtrl',
                        cache: false
                    })

                    .state('notification', {
                        url: '/notification',
                        templateUrl: '/DynamicAppWSV4/static/templates/notification.html',
                        controller: 'notifCtrl',
                        cache: false

                    })

                    .state('pinAuthetication', {
                        url: '/pinAuthetication',
                        templateUrl: '/DynamicAppWSV4/static/templates/PinAuthentication.html',
                        controller: 'loginCtrl',
                        cache: false
                    })

                    .state('changeSetting', {
                        url: '/changeSetting',
                        templateUrl: '/DynamicAppWSV4/static/templates/changeSetting.html',
                        controller: 'changeSettingCtrl as setting',
                        cache: false
                    })

                    .state('setting', {
                        url: '/setting',
                        templateUrl: '/DynamicAppWSV4/static/templates/offlineRefreshTab.html',
                        controller: 'settingCtrl',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })

                    .state('locationTracking', {
                        url: '/locationTracking',
                        templateUrl: '/DynamicAppWSV4/static/templates/locationTracking.html',
                        controller: 'locationTrackingCtrl as lt',
                        cache: false
                    })

                    .state('calendar', {
                        url: '/calendar',
                        templateUrl: '/DynamicAppWSV4/static/templates/calendarDashboard.html',
                        controller: 'MainController',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })

                    .state('summaryReport', {
                        url: '/summaryReport',
                        templateUrl: '/DynamicAppWSV4/static/templates/summaryReport.html',
                        controller: 'summaryReportCtrl',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })
                    //  .state('graph', {
                    //     url: '/graph',
                    //     templateUrl: 'templates/graph.html',
                    //     controller: 'graphCtrl',
                    //     cache: false,
                    //     params: {
                    //         obj: null
                    //     }
                    // })
                    .state('report', {
                        url: '/ReportAnalysis',
                        templateUrl: '/DynamicAppWSV4/static/templates/ReportAnalysis.html',
                        controller: 'reportAnalysisCtrl',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })

                    .state('addPopulatedEntry', {
                        url: '/addPopulatedEntry',
                        templateUrl: '/DynamicAppWSV4/static/templates/addPopulatedEntry.html',
                        controller: 'addPopulatedEntryCtrl',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })

                    .state('addPopulatedLocationEntry', {
                        url: '/addPopulatedLocationEntry',
                        templateUrl: '/DynamicAppWSV4/static/templates/addPopulatedLocationEntry.html',
                        controller: 'addPopulatedLocationEntryCtrl',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })

                    .state('addUpdateEntry', {
                        url: '/addUpdateEntry',
                        templateUrl: '/DynamicAppWSV4/static/templates/addUpdateEntry.html',
                        controller: 'addUpdateEntryCtrl',
                        cache: false,
                    })

                    .state('entryList', {
                        url: '/entryList',
                        templateUrl: '/DynamicAppWSV4/static/templates/entryList.html',
                        controller: 'entryListCtrl',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })

                    .state('offlineEntryList', {
                        url: '/offlineEntryList',
                        templateUrl: '/DynamicAppWSV4/static/templates/offlineEntryList.html',
                        controller: 'offlineEntryListCtrl',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })

                    .state('shortReportType', {
                        url: '/shortReportType',
                        templateUrl: '/DynamicAppWSV4/static/templates/shortReportType.html',
                        controller: 'shortReportTypeCtrl',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })

                    .state('shortReportDetail', {
                        url: '/shortReportDetail',
                        templateUrl: '/DynamicAppWSV4/static/templates/shortReportDetail.html',
                        controller: 'shortReportDetailCtrl',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })

                    .state('addUpdateOrder', {
                        url: '/addUpdateOrder',
                        templateUrl: '/DynamicAppWSV4/static/templates/addUpdateOrder.html',
                        controller: 'addUpdateOrderCtrl',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })
                    .state('entryDetailsInTabular', {
                        url: '/entryDetailsInTabular',
                        templateUrl: '/DynamicAppWSV4/static/templates/entryDetailsInTabular.html',
                        controller: 'entryDetailsInTabularCtrl',
                        cache: false,
                        params: {
                            obj: null
                        }
                    })

            $urlRouterProvider.otherwise(function ($injector, $location) {
                var $state = $injector.get('$state')
                $state.go('login')
            })
        })

//        .controller('AppMainCtrl', function ($scope, $location) {
//
////                alert("JAI HOOO>...");
//            $scope.goto = function () {
////    alert("goto tgoogh");
////window.location.href = '#/banana';
//                $location.url('/banana')
//            }
//        });