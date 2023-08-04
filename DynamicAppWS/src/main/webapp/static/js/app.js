angular.module('starter', ['app', 'nlFramework', 'ngImgCrop', 'ngSanitize', 'ionic', 'chart.js',
    'starter.controllers', 'ngCordova',
    'ion-datetime-picker', 'ngAnimate'
])

    .run(function ($ionicPlatform, $rootScope, $state, $window) {
        $rootScope.$state = $state
        // DatePicker Functionality
        $rootScope.dateValue = new Date()

        $ionicPlatform.ready(function () {

            if (window.Connection) {
                if (navigator.connection.type == Connection.NONE) { }
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


    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.views.transition('none');
        $stateProvider


            .state('login', {
                url: '/login',
                templateUrl: 'static/templates/login.html',
                controller: 'loginCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            .state('changePassword', {
                url: '/changePassword',
                templateUrl: 'static/templates/forgetpassword.html',
                controller: 'ChangePasswordCtrl',
                cache: false
            })

            .state('dashbord', {
                url: '/dashbord',
                templateUrl: 'static/templates/dashbord.html',
                controller: 'dashbordCtrl',
                cache: false
            })

            .state('notification', {
                url: '/notification',
                templateUrl: 'static/templates/notification.html',
                controller: 'notifCtrl',
                cache: false

            })


            .state('pinAuthetication', {
                url: '/pinAuthetication',
                templateUrl: 'static/templates/PinAuthentication.html',
                controller: 'loginCtrl',
                cache: false
            })

            .state('changeSetting', {
                url: '/changeSetting',
                templateUrl: 'static/templates/changeSetting.html',
                controller: 'changeSettingCtrl as setting',
                cache: false
            })
            .state('changeServerSettingSSL', {
                url: '/changeServerSettingSSL',
                templateUrl: 'static/templates/changeServerSettingSSL.html',
                controller: 'changeServerSettingSSLCtrl as setting',
                cache: false
            })



            .state('setting', {
                url: '/setting',
                templateUrl: 'static/templates/offlineRefreshTab.html',
                controller: 'settingCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('HotSeatEntry', {
                url: '/HotSeatEntry',
                templateUrl: 'static/templates/HotSeatEntry.html',
                controller: 'HotSeatEntryCtrl as lt',
                cache: false,
                params: {
                    obj: null
                }
            })



            .state('locationTracking', {
                url: '/locationTracking',
                templateUrl: 'static/templates/locationTracking.html',
                controller: 'locationTrackingCtrl as lt',
                cache: false
            })


            .state('calendar', {
                url: '/calendar',
                templateUrl: 'static/templates/calendarDashboard.html',
                controller: 'MainController',
                cache: false,
                params: {
                    obj: null
                }

            })

            .state('summaryReport', {
                url: '/summaryReport',
                templateUrl: 'static/templates/summaryReport.html',
                controller: 'summaryReportCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            //  .state('graph', {
            //     url: '/graph',
            //     templateUrl: 'static/templates/graph.html',
            //     controller: 'graphCtrl',
            //     cache: false,
            //     params: {
            //         obj: null
            //     }
            // })
            .state('report', {
                url: '/ReportAnalysis',
                templateUrl: 'static/templates/ReportAnalysis.html',
                controller: 'reportAnalysisCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('reportCardView', {
                url: '/reportCardView',
                templateUrl: 'static/templates/reportCardView.html',
                controller: 'reportCardViewCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })


            .state('addPopulatedEntry', {
                url: '/addPopulatedEntry',
                templateUrl: function ($stateParams) {
                    if ($stateParams.obj.table_desc == 'Order Booking 1' && $stateParams.obj.table == 'SS_TRAN') {
                        return 'static/templates/addPopulatedEntryNew.html'
                    } else {
                        return 'static/templates/addPopulatedEntry.html'
                    }
                },
                controller: 'addPopulatedEntryCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })



            //  .state('addPopulatedEntry', {
            //             url: '/addPopulatedEntry',
            //             templateUrl: 'static/templates/addPopulatedEntryNew.html',
            //             controller: 'addPopulatedEntryCtrl',
            //             cache: false,
            //             params: {
            //                 obj: null
            //             }
            //         })
            // .state('orderPopulatedentryList', {
            //     url: '/orderPopulatedentryList',
            //     templateUrl: 'static/templates/orderPopulatedentryList.html',
            //     controller: 'orderPopulatedentryListCtrl',
            //     cache: false,
            //     params: {
            //         obj: null
            //     }
            // })



            .state('addPopulatedLocationEntry', {
                url: '/addPopulatedLocationEntry',
                templateUrl: 'static/templates/addPopulatedLocationEntry.html',
                controller: 'addPopulatedLocationEntryCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })



            .state('addUpdateEntry', {
                url: '/addUpdateEntry',
                templateUrl: 'static/templates/addUpdateEntry.html',
                controller: 'addUpdateEntryCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('addUpdateEntryTable1', {
                url: '/addUpdateEntryTable1',
                templateUrl: 'static/templates/addUpdateEntryTable1.html',
                controller: 'addUpdateEntryCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('addUpdateEntryTable2', {
                url: '/addUpdateEntryTable2',
                templateUrl: 'static/templates/addUpdateEntryTable2.html',
                controller: 'addUpdateEntryCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })




            .state('entryFormWithEntryList', {
                url: '/entryFormWithEntryList',
                templateUrl: 'static/templates/entryFormWithEntryList.html',
                controller: 'entryFormWithEntryListCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            .state('entryFormWithEntryListTable1', {
                url: '/entryFormWithEntryListTable1',
                templateUrl: 'static/templates/entryFormWithEntryListTable1.html',
                controller: 'entryFormWithEntryListCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            .state('entryFormWithEntryListTable2', {
                url: '/entryFormWithEntryListTable2',
                templateUrl: 'static/templates/entryFormWithEntryListTable2.html',
                controller: 'entryFormWithEntryListCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('searchEntry', {
                url: '/searchEntry',
                templateUrl: 'static/templates/searchEntry.html',
                controller: 'searchEntryCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('entryWithGrid', {
                url: '/entryWithGrid',
                templateUrl: 'static/templates/entryWithGrid.html',
                controller: 'entryWithGridCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('imageEntry', {
                url: '/imageEntry',
                templateUrl: 'static/templates/imageEntry.html',
                controller: 'imageEntryCtrl',
                cache: false,
            })


            .state('searchEntryTable1', {
                url: '/searchEntryTable1',
                templateUrl: 'static/templates/searchEntryTable1.html',
                controller: 'searchEntryCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            .state('searchEntryTable2', {
                url: '/searchEntryTable2',
                templateUrl: 'static/templates/searchEntryTable2.html',
                controller: 'searchEntryCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })



            .state('entryList', {
                url: '/entryList',
                templateUrl: 'static/templates/entryList.html',
                controller: 'entryListCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('offlineEntryList', {
                url: '/offlineEntryList',
                templateUrl: 'static/templates/offlineEntryList.html',
                controller: 'offlineEntryListCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('shortReportType', {
                url: '/shortReportType',
                templateUrl: 'static/templates/shortReportType.html',
                controller: 'shortReportTypeCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('shortReportDetail', {
                url: '/shortReportDetail',
                templateUrl: 'static/templates/shortReportDetail.html',
                controller: 'shortReportDetailCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('addUpdateOrder', {
                url: '/addUpdateOrder',
                templateUrl: 'static/templates/addUpdateOrder.html',
                controller: 'addUpdateOrderCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            .state('addUpdateOrderTable1', {
                url: '/addUpdateOrderTable1',
                templateUrl: 'static/templates/addUpdateOrderTable1.html',
                controller: 'addUpdateOrderCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            .state('addUpdateOrderTable2', {
                url: '/addUpdateOrderTable2',
                templateUrl: 'static/templates/addUpdateOrderTable2.html',
                controller: 'addUpdateOrderCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            .state('entryDetailsInTabular', {
                url: '/entryDetailsInTabular',
                templateUrl: 'static/templates/entryDetailsInTabular.html',
                controller: 'entryDetailsInTabularCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })

            .state('entryDetails', {
                url: '/entryDetails',
                templateUrl: 'static/templates/entryDetails.html',
                controller: 'entryDetailsCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })



        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get('$state')
            $state.go('dashbord')
        })
    })

// .config(['$compileProvider', function($compileProvider) {
//     $compileProvider.imgSrcSanitizationWhitelist(/^\s(https|file|blob|cdvfile|content):|data:image\//);
// }]);











// .config(['$compileProvider', function($stateProvider, $urlRouterProvider, $compileProvider) {

//     $compileProvider.imgSrcSanitizationWhitelist(/^\s(https|file|blob|cdvfile):|data:image\//);

//     $stateProvider
//         .state('login', {
//             url: '/login',
//             templateUrl: 'static/templates/login.html',
//             controller: 'loginCtrl',
//             cache: false

//         })
//         .state('changePassword', {
//             url: '/changePassword',
//             templateUrl: 'static/templates/forgetpassword.html',
//             controller: 'ChangePasswordCtrl',
//             cache: false
//         })

//     .state('dashbord', {
//         url: '/dashbord',
//         templateUrl: 'static/templates/dashbord.html',
//         controller: 'dashbordCtrl',
//         cache: false
//     })

//     .state('setting', {
//         url: '/setting',
//         templateUrl: 'static/templates/setting.html',
//         controller: 'settingCtrl',
//         cache: false,
//         params: {
//             obj: null
//         }
//     })

//     .state('calendar', {
//         url: '/calendar',
//         templateUrl: 'static/templates/calendarDashboard.html',
//         controller: 'MainController',
//         cache: false,
//         params: {
//             obj: null
//         }

//     })

//     .state('graphAnalysis', {
//         url: '/graphAnalysis',
//         templateUrl: 'static/templates/graphAnalysis.html',
//         controller: 'graphAnalysisCtrl',
//         cache: false,
//         params: {
//             obj: null
//         }
//     })


//     .state('addUpdateEntry', {
//             url: '/addUpdateEntry',
//             templateUrl: 'static/templates/addUpdateEntry.html',
//             controller: 'addUpdateEntryCtrl',

//             cache: false,
//             params: {
//                 obj: null
//             }
//         })
//         .state('graph', {
//             url: '/graph',
//             templateUrl: 'static/templates/graph.html',
//             controller: 'graphCtrl',
//             cache: false,
//             params: {
//                 obj: null
//             }
//         })

//     .state('entryList', {
//         url: '/entryList',
//         templateUrl: 'static/templates/entryList.html',
//         controller: 'entryListCtrl',
//         cache: false,
//         params: {
//             obj: null
//         }
//     })

//     .state('shortReportType', {
//         url: '/shortReportType',
//         templateUrl: 'static/templates/shortReportType.html',
//         controller: 'shortReportTypeCtrl',
//         cache: false,
//         params: {
//             obj: null
//         }
//     })

//     .state('shortReportDetail', {
//         url: '/shortReportDetail',
//         templateUrl: 'static/templates/shortReportDetail.html',
//         controller: 'shortReportDetailCtrl',
//         cache: false,
//         params: {
//             obj: null
//         }
//     })

//     .state('addUpdateOrder', {
//         url: '/addUpdateOrder',
//         templateUrl: 'static/templates/addUpdateOrder.html',
//         controller: 'addUpdateOrderCtrl',
//         cache: false,
//         params: {
//             obj: null
//         }
//     })

//     $urlRouterProvider.otherwise(function($injector, $location) {
//         var $state = $injector.get('$state')
//         $state.go('dashbord')
//     })
// }])