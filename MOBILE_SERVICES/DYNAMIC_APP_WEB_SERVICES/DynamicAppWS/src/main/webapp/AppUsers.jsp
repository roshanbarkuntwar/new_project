<%-- 
    Document   : AppUsers
    Created on : May 30, 2018, 4:57:52 PM
    Author     : anjali.bhendarkar
--%>

<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>LHS ERP App</title>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"></script>
        <style>
            .appUserModal .modal-header {
                padding: 5px 20px;

            }
            .appUserModal .modal-dialog {
                max-width: 98%;
            }
            .appUserModal .table-outer{
                max-height: 500px

            }
            table, th , td {
                width: 100%;
                border: 1px solid grey;
                border-collapse: collapse;
                padding: 5px !important;
                font-size: 0.8rem
            }
            th , td{
                width:120px;
                min-width: 120px;
                max-width: 120px;
                word-break: break-all;
            }
            .srno{
                width:50px;
                min-width: 50px;
                max-width: 50px;

            }
            .db{
                width:90px;
                min-width: 90px;
                max-width: 90px;
            }
            .table thead th {
                font-weight: 500;
            }
            .localServer{
                background-color: lightblue !important;
            }
            .clientServer{
                background-color: #cef1d1 !important;
            }

            .cust-checkbox {
                display: block;
                position: relative;
                padding-left: 25px;
                margin-bottom: 12px;
                cursor: pointer;
                font-size: 12px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .local {
                background-color: #d1f2f4;
                border: 1px solid #207fe0;
            }
            .checkmark {
                position: absolute;
                top: 0;
                left: 0;
                height: 20px;
                width: 20px;
            }
            .cust-checkbox input {
                position: absolute;
                opacity: 0;
            }
            .client {
                background-color: #cef1d1;
                border: 1px solid #14921e;
            }

            .cust-checkbox input:checked ~ .local {
                background-color: #d1f2f4;
                border: 1px solid #207fe0;
            }
            .cust-checkbox .checkmark:after {
                left: 7px;
                top: 3px;
                width: 5px;
                height: 10px;
                border: solid #2a3f5a;
                border-width: 0 3px 3px 0;
                -webkit-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
            }
            .cust-checkbox input:checked ~ .checkmark:after {
                display: block;
            }
            .checkmark:after {
                content: "";
                position: absolute;
                display: none;
            }
            .delImg{
                width: 24px;
            }

            .clickTd{
                text-decoration: underline;
                color: blue;
            }
        </style>
    </head>
    <body>
        <div class="jumbotron text-center" style="margin-bottom:0;padding: 1rem 0.5rem;">
            <h2>LHS ERP App</h2>
            <p> Server Details</p> 
        </div>
        <div ng-app="myApp" ng-controller="myCtrl" style="    padding: 10px;">
            <div>
                <!--                <div class="form-check">
                                    <label class="form-check-label">
                                        <input type="checkbox" class="form-check-input" ng-model="servers.client" ng-change="checked(servers)">Client Server
                                    </label>
                                </div>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input type="checkbox" class="form-check-input" ng-model="servers.local" ng-change="checked(servers)">Local Server
                                    </label>
                                </div>-->
                <div class="row ">
                    <div class="col-md-6 col-sm-7">
                        <div class="status-wrapper">

                            <div class="row">
                                <div class="col-md-3">
                                    <label class="cust-checkbox ">Client Server<input id="clientChk" type="checkbox" ng-model="servers.client" ng-change="checked(servers)">
                                        <span class="checkmark client"></span>
                                    </label>
                                </div>
                                <div class="col-md-3">
                                    <label class="cust-checkbox ">Local Server <input id="localChk" type="checkbox" ng-model="servers.local" ng-change="checked(servers)">
                                        <span class="checkmark local"></span>
                                    </label>
                                </div>
                                <div class="col-md-6">
                                    <label >
                                        <input type="text" placeholder="Search..." ng-model="searchValue">
                                    </label>
                                    <img src="/DynamicAppWSV3/static/img/del.png" class="delImg" ng-click="searchValue = ''" >
                                </div>

                            </div>
                        </div>
                    </div>


                </div>
            </div>

            <div class="table-responsive table-outer">
                <table class="table table-hover  table-striped ">
                    <thead class="btn-primary">
                        <tr>
                            <th class="srno">Sr.No.</th>
                            <th class="srno">Seq No</th>
                            <th class="db">DB Name</th>
                            <th class="db">DB Password</th>
                            <th>Entity Str</th>
                            <th class="db">Device Validation</th>
                            <th>Server url</th>
                            <th>DB Url</th>
                            <th class="db">port No</th>
                            <th>War Name</th>
                            <th class="srno">Total Key</th>
                            <th class="srno">Used Key</th>
                            <th class="srno">Unused Key</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="user in users| filter: searchValue"  ng-class="{
                            localServer:  user.seq_no < 0, clientServer: user.seq_no > 0}"  >
                            <td class="srno">{{$index + 1}}
                            <td class="srno"> {{ user.seq_no}}</td>
                            <td class="db clickTd" ng-click="getAppUsers(user);" data-toggle="modal" data-target="#myModal">{{ user.dbName}}</td>
                            <td class="db">{{ user.dbPassword}}</td>
                            <td>{{ user.entity_code_str}}</td>
                            <td class="db">
                                <span ng-if="user.device_validation == 'Y'">YES</span>
                                <span ng-if="user.device_validation == 'N'">NO</span>
                            </td>
                            <td>{{ user.server_url1}}</td>
                            <td>{{user.dbUrl}}</td>
                            <td class="db">{{ user.portNo}}</td>
                            <td>{{ user.war_name}}</td>
                            <td class="srno" >{{ user.total_user}}</td>
                            <td class="srno clickTd" ng-click="getUsedAppKeyUser(user, 'Active');" data-toggle="modal" data-target="#myModal1"> {{ user.used}}  </td>
                            <td class="srno clickTd"ng-click="getUsedAppKeyUser(user, 'In-active');" data-toggle="modal" data-target="#myModal1">{{ user.total_user - user.used}}</td>

                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal fade appUserModal" id="myModal">
                <div class="modal-dialog  modal-lg ">
                    <div class="modal-content">

                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h5 class="modal-title">App Users ( {{databaseName}} )</h5>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        <!-- Modal body -->

                        <div class="modal-body">
                            <div class="table-responsive table-outer">
                                <table class="table table-hover  table-striped " ng-if="users">
                                    <thead class="btn-primary">
                                        <tr >
                                            <th class="srno">Sr.No.</th>
                                            <th class="db">App Key</th>
                                            <th class="db">User Code</th>
                                            <th>User Name</th>
                                            <th class="db">Module</th>
                                            <th>Device Id</th>
                                            <th>Device Name</th>
                                            <th class="db">Push Alert Topic</th>
                                            <th>Push Alert Token</th>
                                            <th>Reset</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr ng-repeat="user in appUsers" >
                                            <td class="srno">{{$index + 1}}</td>
                                            <td>{{user.appkey}} </td>
                                            <td class="db">{{user.user_code}} </td>
                                            <td>{{user.user_name}} </td>
                                            <td class="db">{{ user.module}}</td>
                                            <td>{{ user.device_id}}</td>
                                            <td>{{user.device_name}}</td>
                                            <td>{{ user.push_alert_topic}}</td>
                                            <td>{{ user.push_alert_token_no}}</td>
                                            <td class="db clickTd" ng-click="resetUserAppKey(user);">Reset</td>
                                        </tr>
                                        <tr >
                                            <td ng-if="isProcessing" colspan="9" style="text-align: center;font-size: 1rem;"><img style="width:90px" src="https://cdn.dribbble.com/users/255512/screenshots/2215917/animation.gif"></img>Please Wait.... </td>
                                            <td ng-if="isErorrMsg" colspan="9" style="text-align: center;font-size: 1rem;">{{isErorrMsg}} </td>
                                        </tr>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade appUserModal" id="myModal1">
                <div class="modal-dialog  modal-lg ">
                    <div class="modal-content">

                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h5 class="modal-title"> {{ status}} App Users ( {{databaseName}} )</h5>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        <!-- Modal body -->

                        <div class="modal-body">
                            <div class="table-responsive table-outer">
                                <table class="table table-hover  table-striped " ng-if="users">
                                    <thead class="btn-primary">
                                        <tr >
                                            <th class="srno">Sr.No.</th>
                                            <th class="db">App Key</th>
                                            <th class="db">User Code</th>

                                            <th>Device Id</th>
                                            <th>Device Name</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!--ng-if="user.device_id != ''"--> 
                                        <tr ng-repeat="user in usedAppKeyUser">
                                            <td class="srno">{{$index + 1}} 
                                            <td class="db">{{user.appkey}} </td>
                                            <td class="db">{{user.user_code}} </td>

                                            <td>{{ user.device_id}}</td>
                                            <td>{{user.device_name}}</td>


                                        </tr>
                                        <!--                                        <tr >
                                                                                    <td ng-if="isProcessing" colspan="8" style="text-align: center;font-size: 1rem;"><img style="width:90px" src="https://cdn.dribbble.com/users/255512/screenshots/2215917/animation.gif"></img>Please Wait.... </td>
                                                                                    <td ng-if="isErorrMsg" colspan="8" style="text-align: center;font-size: 1rem;">{{isErorrMsg}} </td>
                                                                                </tr>-->
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </body>
    <script>
        var app = angular.module('myApp', []);
        app.controller('myCtrl', function ($scope, $http, $filter) {
        $scope.users;
        $scope.appUsers;
        $scope.isProcessing = false;
        $scope.ServerUsers = "";
        //            var apa = "12/5*9+9.4*2";
        //            alert(eval(apa));
        //            $scope.getUsers = function (appKey) {

        $scope.servers = {
        client: true,
                local: false
        };
        $scope.checked = function () {
        $scope.users = [];
        $scope.ServerUsers.forEach(function (item) {

        console.log(item.seq_no.indexOf("-"));
        if (item.entity_code_str) {
        item.entity_code_str = item.entity_code_str.split("#").join(", ");
        }

        if ($scope.servers.client && (item.seq_no.indexOf("-") == - 1)) {
        $scope.users.push(item);
        }
        if ($scope.servers.local && (item.seq_no.indexOf("-") > - 1)) {
        $scope.users.push(item);
        }
//                            $scope.users.push(item)
//                            
        })
        }

        $http.get("getUsers")
                .then(function (response) {
                console.log("Success ")
                        console.log(response);
                $scope.ServerUsers = response.data;
                $scope.ServerUsers = $filter('orderBy')($scope.ServerUsers, 1)
                        $scope.checked();
                }, function (err) {
                console.log("Error ")
                        console.log(err)
                        alert(err)
                });
        $scope.getUsedAppKeyUser = function(user, status){
        $scope.status = status;
        $scope.databaseName = user.dbName;
        $http.get("getAppKeyUsers?seqNo=" + user.seq_no + "&status=" + status)
                .then(function (response) {
                console.log("Success ")
                        console.log(response);
                $scope.usedAppKeyUser = response.data;
                }, function (err) {
                console.log("Error ")
                        console.log(err)
                        alert(err)
                });
        }


        $scope.getAppUsers = function (user) {
        $scope.databaseName = user.dbName;
        $scope.appUsers = "";
        $scope.isProcessing = true;
        $scope.isErorrMsg = null;
        $scope.server_url = "http://" + user.server_url1 + "/" + user.war_name + "/webService/" + user.entity_code + "/" + user.dbUrl + "/" + user.portNo + "/" + user.dbName + "/" + user.dbPassword + "/";
        console.log('WW: ' + $scope.server_url);
//                var server_url = "http://192.168.100.195:9090/DynamicAppWS/webService/" + user.entity_code + "/" + user.dbUrl + "/" + user.portNo + "/" + user.dbName + "/" + user.dbPassword + "/";
        $http.get($scope.server_url + "getAppUsers")
                .then(function (response) {
                $scope.isProcessing = false;
                $scope.appUsers = response.data;
                if ($scope.appUsers) {
                if ($scope.appUsers.length > 0) {
                } else {
                $scope.isErorrMsg = "Data Not Available";
                }
                } else {
                $scope.isErorrMsg = "Data Not Available";
                }
                }, function (err) {
                $scope.isProcessing = false;
                $scope.isErorrMsg = "Error While retriving Data.";
                console.log("Error ")
                        console.log(err)
//                            alert(err)
                });
        }

        $scope.resetUserAppKey = function(user){
        var retVal = confirm("Do you Really want to Reset AppKey Data..?");
               if( retVal == true ){
                    $http.get("resetLhsCareAppKey?appKey=" + user.appkey+"&userCode="+user.user_code).then(function (response){
//            console.log(response);
            var resData = response.data;
            if(resData.status == 'success'){
                $http.get($scope.server_url + "resetUserAppKeyValidation?appKey=" + user.appkey+"&userCode="+user.user_code).then(function (res){
                    console.log(res);
                    var resData = res.data;
                    if(resData.status == 'success'){
                        alert(resData.message);
                    }
                    else{
                        alert('Something Went Wrong..');
                    }
                })
            }
            else{
                alert('App Key Not Used by Any User. !');
            }
        })
               }
               else{
//                alert('Cancelled..');
                  return false;
               }

      
        }



        //                var url = "http://203.193.167.118:8888/DynamicAppWSV3/webService/getServerDetails?appKey=" + appKey +
        //                        "&device_id=" + "" + "&device_name=" + "";
        //                console.log(url);
        //                var server_url = "";
        //
        //                $http.get(url)
        //                        .then(function (resData) {
        //                            resData = resData.data;
        //                            console.log("Success ")
        //                            console.log(resData)
        //                            server_url = "http://" + resData.serverUrl + "/" + resData.war_name + "/webService/" + resData.entity + "/" + resData.dbUrl + "/" + resData.portNo + "/" + resData.dbName + "/" + resData.dbPassword + "/";
        //
        //                            $http.get(server_url + "getUsers?appKey=" + appKey)
        //                                    .then(function (response) {
        //
        //                                        console.log("Success ")
        //                                        console.log(response);
        //
        //                                        $scope.users = response.data;
        //                                    }, function (err) {
        //                                        console.log("Error ")
        //                                        console.log(err)
        //                                        alert(err)
        //                                    });
        //
        //
        //                        }, function (err) {
        //                            console.log("Error ")
        //                            console.log(err)
        //                            alert(err)
        //                        });


        //                $http.get("getUsers?appKey=" + appKey)
        //                        .then(function (response) {
        //                            alert(response)
        //                            console.log("Success ")
        //                            console.log(response)
        //                        }, function (err) {
        //                            console.log("Error ")
        //                            console.log(err)
        //                            alert(err)
        //                        });
        //            }

        });
    </script>
</html>
