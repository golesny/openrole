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

// ------------ global controller --------------
app.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$modal',
         function($scope, $rootScope, $http, $location, localStorageService, $modal)
    {
        $rootScope.loading = "Loading"; // init loading text
        $rootScope.serviceHost = "https://open-role.appspot.com";
        if ($location.$$host == 'localhost') {
            // for dev
            $rootScope.serviceHost = "http://localhost:8888";
        }
        $rootScope.serviceHost = $rootScope.serviceHost + "/open_role_service";
        $http.defaults.headers.common["X-Openrole-Token"] = localStorageService.get("X-Openrole-Token");
        $scope.loggedin = ($http.defaults.headers.common["X-Openrole-Token"] != null);

        // init base config
        $http.get($rootScope.serviceHost + '/config')
            .success(function(data, status, headers, config) {
                $rootScope.GLOBALCONFIG = angular.fromJson(data);
                $rootScope.loadingReady = true;
                $rootScope.initialized = true;
            })
            .error(function(data, status, headers, config) {
                $rootScope.loadingReady = true;
                $rootScope.addAlert('danger', status+': Could not get config from server: '+data);
            })
        ;

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
                    $rootScope.addAlert('danger', status+': Could not log in: '+data);
              });
        };
        var internalClientSideLogout = function() {
            $http.defaults.headers.common["X-Openrole-Token"] = null;
            $scope.loggedin = false;
            localStorageService.remove("X-Openrole-Token");
        }
        $scope.logout = function() {
            console.log("loggin out");
            $rootScope.loadingReady = false;
            $rootScope.loading = "Logout";
            $http.get($rootScope.serviceHost + '/logout')
            .success(function(data, status, headers, config){
                internalClientSideLogout();
                $rootScope.loadingReady = true;
            })
            .error(function(data, status, headers, config) {
                if (status == 401) {
                    // already logged out
                    internalClientSideLogout();
                } else {
                    $rootScope.addAlert('danger', status+': Could not log in: '+data);
                }
                $rootScope.loadingReady = true;
            });
        };

        $scope.internalLogin = function(token) {
            // http://stackoverflow.com/questions/20777700/angular-js-controller-gets-the-cookie-from-login-request-header-even-after-doing
            $http.defaults.headers.common["X-Openrole-Token"] = token;
            $scope.loggedin = true;
            localStorageService.add("X-Openrole-Token", token);
        };

        $scope.store = function() {
            var theController = this.$parent.$parent;
            var or = theController.openrole;
            var docId = or.docId;

            $rootScope.loadingReady = false;
            $rootScope.loading = "Speichere Charakter";
            var openroleAsJSON = angular.toJson(or);
            $http.post($rootScope.serviceHost + '/' +theController.openrole_module_name+'/store/'+docId, openroleAsJSON, {
                  headers: { 'Content-Type': 'application/json; charset=UTF-8'}
                })
                .success(function(data, status, headers, config){
                    theController.openrole.docId = data;
                    $rootScope.loadingReady = true;
                })
                .error(function(data, status, headers, config){
                    $rootScope.addAlert('danger', status+": Could not store character. Cause: "+data);
                    $rootScope.loadingReady = true;
                })
            ; // http post
        };

        $scope.open = function() {

            var theController = this.$parent.$parent;
            $rootScope.loadingReady = false;
            $rootScope.loading = "Lade Charakterliste";

            $http.get($rootScope.serviceHost + '/' +theController.openrole_module_name+'/list')
                .success(function(data, status, headers, config){
                    $rootScope.loadingReady = true;
                    $scope.openDialog(theController, data);
                })
                .error(function(data, status, headers, config){
                    $rootScope.loadingReady = true;
                    $rootScope.addAlert('danger', status+": Could not load character list. Cause: "+data);
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
                $rootScope.loadingReady = false;
                $rootScope.loading = "Lade Charakter "+characterDocId;
                $http.get($rootScope.serviceHost + '/'+theController.openrole_module_name+'/get/'+characterDocId)
                    .success(function (data, status, headers, config) {
                        $rootScope.loadingReady = true;
                        // here we have to put the new data asychnronously instead of setting references
                        var ctrler = theController;
                        angular.copy(data, ctrler.openrole);
                    })
                    .error(function (data, status, headers, config) {
                        $rootScope.loadingReady = true;
                        $rootScope.addAlert('danger', status+": Could not load character. Cause: "+data);
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

// locale controller
app.controller('LocaleCtrl', function ($scope, $translate, localStorageService) {

    $scope.changeLanguage = function (key) {
        console.log("changing language to "+key+ " preferred ="+$translate.preferredLanguage() + " current stored="+localStorageService.get("lang"));
        $translate.use(key);
        if (key == $translate.preferredLanguage()) {
            // remove entry
            console.log("removing local storage value");
            localStorageService.remove("lang");
        } else {
            // store
            localStorageService.add("lang", key);
        }
    };
    // init the stored language
    if (localStorageService.get("lang") != null) {
        console.log("using stored language="+localStorageService.get("lang"));
        $scope.changeLanguage(localStorageService.get("lang"));
    }
});

