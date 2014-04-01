"use strict";

var app = angular.module('openrole', ['ngDragDrop', 'LocalStorageModule']);

app.config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('openroleStorage');
    //localStorageServiceProvider.setStorageCookieDomain('example.com');
    localStorageServiceProvider.setStorageType('localStorage');
 }]);

app.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService',
         function($scope, $rootScope, $http, $location, localStorageService)
    {
        $rootScope.serviceHost = "https://open-role.appspot.com";
        if ($location.$$host == 'localhost') {
            // for dev
            $rootScope.serviceHost = "http://localhost:8888";
        }
        $rootScope.serviceHost = $rootScope.serviceHost + "/open_role_service";
        $http.defaults.headers.common["X-Openrole-Token"] = localStorageService.get("X-Openrole-Token");
        $scope.loggedin = ($http.defaults.headers.common["X-Openrole-Token"] != null);

        // init base config
        $http.get($rootScope.serviceHost + '/config').then(function(response) {
            $rootScope.GLOBALCONFIG = angular.fromJson(response.data);
            $rootScope.initialized = true;
        });

        // http://gregpike.net/demos/angular-local-storage/demo/demo.html
        $scope.login = function() {
            console.log("login");
            $http.post($rootScope.serviceHost + '/login?email='+$scope.email, $scope.pw).success(function(data, status, headers, config){
                console.log("logged in. token = "+data);
                // http://stackoverflow.com/questions/20777700/angular-js-controller-gets-the-cookie-from-login-request-header-even-after-doing
                $http.defaults.headers.common["X-Openrole-Token"] = data;
                $scope.loggedin = true;
                localStorageService.add("X-Openrole-Token", data);
            });
            //$scope.cookieValue = $cookies.text;
        }
        $scope.logout = function() {
            console.log("logout");
            $http.get($rootScope.serviceHost + '/logout').then(function(response) {
                $http.defaults.headers.common["X-Openrole-Token"] = null;
                $scope.loggedin = false;
                //localStorageService.remove("X-Openrole-Token");
            });
        }
    }]

    );