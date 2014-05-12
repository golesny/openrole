"use strict";

var app = angular.module('openrole');

// init local storage
app.config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('openroleStorage');
    //localStorageServiceProvider.setStorageCookieDomain('example.com');
    localStorageServiceProvider.setStorageType('localStorage');
 }]);

// init translation
app.config(function ($translateProvider) {
    $translateProvider.fallbackLanguage('de');
    $translateProvider.determinePreferredLanguage();
});

// global controller
app.controller('OpenroleCtrl',['$scope','$rootScope','$http','$location', function($scope, $rootScope, $http, $location) {
    $scope.openrole_module_name = 'Overview';
}]);

// ------------ global controller --------------
app.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$modal','alertService','loaderService',
         function($scope, $rootScope, $http, $location, localStorageService, $modal, alertService, loaderService) {

             $rootScope.serviceHost = "https://open-role.appspot.com";
             if ($location.$$host == 'localhost') {
                 // for dev
                 $rootScope.serviceHost = "http://localhost:8888";
             }
             $rootScope.serviceHost = $rootScope.serviceHost + "/open_role_service";
             $http.defaults.headers.common["X-Openrole-Token"] = localStorageService.get("X-Openrole-Token");
             $scope.loggedin = ($http.defaults.headers.common["X-Openrole-Token"] != null);

             // init base config
             if ($rootScope.initializing != true) {
                 console.log("initializing --> getting config from server");
                 $rootScope.initializing = true;
                 $http.get($rootScope.serviceHost + '/config')
                     .success(function (data, status, headers, config) {
                         console.log("success on getting config");
                         $rootScope.GLOBALCONFIG = angular.fromJson(data);
                         loaderService.setLoadingReady();
                         $rootScope.initialized = true;
                     })
                     .error(function (data, status, headers, config) {
                         loaderService.setLoadingReady();
                         alertService.addAlert('danger', status + ': Could not get config from server: ' + data);
                     })
                 ;
             }


        // http://gregpike.net/demos/angular-local-storage/demo/demo.html
        $scope.login = function() {
            console.log("login");
            $http.post($rootScope.serviceHost + '/login?email='+$scope.email, $scope.pw, {
                headers: { 'Content-Type': 'plain/text; charset=UTF-8'}
              })
              .success(function(data, status, headers, config){
                console.log("logged in. token = "+data);
                $scope.internalLogin(data);
              })
              .error(function(data, status, headers, config) {
                    alertService.addAlert('danger', status+': Could not log in: '+data);
              });
        };
        var internalClientSideLogout = function() {
            $http.defaults.headers.common["X-Openrole-Token"] = null;
            $scope.loggedin = false;
            localStorageService.remove("X-Openrole-Token");
        }
        $scope.logout = function() {
            console.log("loggin out");
            loaderService.setLoadingStart("Logout");
            $http.get($rootScope.serviceHost + '/logout')
            .success(function(data, status, headers, config){
                internalClientSideLogout();
                    loaderService.setLoadingReady();
            })
            .error(function(data, status, headers, config) {
                if (status == 401) {
                    // already logged out
                    internalClientSideLogout();
                } else {
                    alertService.addAlert('danger', status+': Could not log in: '+data);
                }
                loaderService.setLoadingReady();
            });
        };

        $scope.internalLogin = function(token) {
            // http://stackoverflow.com/questions/20777700/angular-js-controller-gets-the-cookie-from-login-request-header-even-after-doing
            $http.defaults.headers.common["X-Openrole-Token"] = token;
            $scope.loggedin = true;
            localStorageService.add("X-Openrole-Token", token);
            alertService.addAlert('success', 'You are logged in, now');
        };

        $scope.store = function() {
            var theController = this.$parent.$parent;
            var or = theController.openrole;
            var docId = or.docId;

            loaderService.setLoadingStart("Speichere Charakter");
            var openroleAsJSON = angular.toJson(or);
            $http.post($rootScope.serviceHost + '/' +theController.openrole_module_name+'/store/'+docId, openroleAsJSON, {
                  headers: { 'Content-Type': 'application/json; charset=UTF-8'}
                })
                .success(function(data, status, headers, config){
                    theController.openrole.docId = data;
                    loaderService.setLoadingReady();
                })
                .error(function(data, status, headers, config){
                    alertService.addAlert('danger', status+": Could not store character. Cause: "+data);
                    loaderService.setLoadingReady();
                })
            ; // http post
        };

        $scope.open = function() {

            var theController = this.$parent.$parent;
            loaderService.setLoadingStart("Lade Charakterliste");

            $http.get($rootScope.serviceHost + '/' +theController.openrole_module_name+'/list')
                .success(function(data, status, headers, config){
                    loaderService.setLoadingReady();
                    $scope.openDialog(theController, data);
                })
                .error(function(data, status, headers, config){
                    loaderService.setLoadingReady();
                    alertService.addAlert('danger', status+": Could not load character list. Cause: "+data);
                })
            ; // get


        };

        $scope.openDialog = function(theController, characterlistJson) {
            // create and open the dialog
            var modalOpenDialogInstance = $modal.open({
                templateUrl: 'id.dialog.open.html',
                controller: DialogOpenCtrl,
                resolve: {
                    characterlist: function() {
                    // the the character list from service
                        return angular.fromJson(characterlistJson);
                    }
                }
            });

            modalOpenDialogInstance.result.then(function (characterDocId) {
                console.info("dialog closed. character chosen: "+characterDocId);
                loaderService.setLoadingStart("Lade Charakter "+characterDocId);
                $http.get($rootScope.serviceHost + '/'+theController.openrole_module_name+'/get/'+characterDocId)
                    .success(function (data, status, headers, config) {
                        loaderService.setLoadingReady();
                        // here we have to put the new data asychnronously instead of setting references
                        var ctrler = theController;
                        angular.copy(data, ctrler.openrole);
                    })
                    .error(function (data, status, headers, config) {
                        loaderService.setLoadingReady();
                        alertService.addAlert('danger', status+": Could not load character. Cause: "+data);
                    });
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.registerDialog = function () {

            var modalInstance = $modal.open({
                templateUrl: 'registration.html',
                controller: DialogRegistrationCtrl,
                resolve: {
                    //registerError: function() {
                    //    return $scope.registerError;
                    //}
                }
            });

            modalInstance.result.then(function (token) {
                console.info("dialog closed. user registered");
                $scope.internalLogin(token);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    }]

    );



