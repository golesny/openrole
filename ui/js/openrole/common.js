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
        $rootScope.serviceHost = "https://open-role.appspot.com";
        if ($location.$$host == 'localhost') {
            // for dev
            $rootScope.serviceHost = "http://localhost:8888";
        }
        $rootScope.serviceHost = $rootScope.serviceHost + "/open_role_service";
        $http.defaults.headers.common["X-Openrole-Token"] = localStorageService.get("X-Openrole-Token");
        $scope.loggedin = ($http.defaults.headers.common["X-Openrole-Token"] != null);

        // init base config
        $http.get($rootScope.serviceHost + '/config').then(function(reponse) {
            $rootScope.GLOBALCONFIG = angular.fromJson(reponse.data);
            $rootScope.initialized = true;
        });

        // http://gregpike.net/demos/angular-local-storage/demo/demo.html
        $scope.login = function() {
            console.log("login");
            $http.post($rootScope.serviceHost + '/login?email='+$scope.email, $scope.pw)
              .success(function(data, status, headers, config){
                console.log("logged in. token = "+data);
                $scope.internalLogin(data);
            });
        }
        $scope.logout = function() {
            console.log("logout");
            $http.get($rootScope.serviceHost + '/logout').then(function(response) {
                $http.defaults.headers.common["X-Openrole-Token"] = null;
                $scope.loggedin = false;
                localStorageService.remove("X-Openrole-Token");
            });
        }

        $scope.internalLogin = function(token) {
            // http://stackoverflow.com/questions/20777700/angular-js-controller-gets-the-cookie-from-login-request-header-even-after-doing
            $http.defaults.headers.common["X-Openrole-Token"] = token;
            $scope.loggedin = true;
            localStorageService.add("X-Openrole-Token", token);
        }


        $scope.registerDialog = function () {

            var modalInstance = $modal.open({
                templateUrl: 'registration.html',
                controller: ModalRegistrationCtrl,
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



// http://angular-ui.github.io/bootstrap/#/modal
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalRegistrationCtrl = function ($scope, $modalInstance, $http, $rootScope) {

    $scope.register = function () {
        console.log("validate register user data");
        if (this.email == null || this.email == '') {
            $scope.registerError = 'Bitte E-Mail eingegeben';
            return;
        }
        if (this.pw == null || this.pw == '') {
            $scope.registerError = 'Bitte Passwort eingegeben';
            return;
        }
        if (this.pw != this.pwrepeat) {
            $scope.registerError = 'Passwörter müssen identisch sein';
            return;
        }
        console.log("validation passed email="+this.email);
        $scope.registerError = null;
        $http.post($rootScope.serviceHost + '/register?email='+this.email, this.pw)
            .success(function(data, status, headers, config) {
                console.log("Registered user: ["+status+"] "+data);
                if (status == 201) {
                    $modalInstance.close(data);
                    $scope.registerError = null;
                } else {
                    $scope.registerError = data;
                }
            })
            .error(function(data, status, headers, config) {
                console.log("Could not register user: "+data);
                $scope.registerError = data;
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        $scope.registerError = null;
    };

    $scope.errorExists = function() {
        return $scope.registerError != null;
    };
};

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