"use strict";

var app = angular.module('openrole');

// init local storage
app.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('openroleStorage');
  //localStorageServiceProvider.setStorageCookieDomain('example.com');
  localStorageServiceProvider.setStorageType('localStorage');
}]);

// init translation
app.config(['$translateProvider', function ($translateProvider) {
  console.log("common.js-translation");
//  $translateProvider.fallbackLanguage('de');
//  $translateProvider.determinePreferredLanguage();
}]);

app.config(['$routeProvider','$locationProvider',function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/credits', {
            templateUrl: 'views/index.credits.html',
            controller: 'OpenroleCtrl'
        })
        .when('/contact', {
            templateUrl: 'views/index.contact.html',
            controller: 'OpenroleCtrl'
        })
        .when('/pwreset', {
            templateUrl: 'views/index.pwreset.html',
            controller: 'OpenroleCtrl'
        })
        .when('/pwresetcode', {
            templateUrl: 'views/index.pwresetcode.html',
            controller: 'OpenroleCtrl'
        })
        .otherwise({
            //redirectTo: '/'
            templateUrl: 'views/index.welcome.html',
            controller: 'OpenroleCtrl'
        });
}]);

// exception handling
app.factory('$exceptionHandler', [function () {
  return function (exception, cause) {
    console.error(exception.stack);
    alert("An application error occurred in open-role. Please send a mail with this error to the developer. Thanks.");
    window.location.href = "mailto:daniel@golesny.de?subject=Open-Role Error&body="+exception.stack;
    // more we can't do here, because I can't inject anything
  };
}]);

/* template block is for loading custom templates */
var registeredTemplates = [];
var registeredTemplatesCallbacks = {};
// for pdf tenplate to register themself for a system
var registerTemplate = function(system, id, descr) {
  console.log("registering PDF template for "+system+" with id "+id+"("+descr+")");
  var templ = {"system":system, "id":id, "name":descr};
  registeredTemplates.push(templ);
  if (system in registeredTemplatesCallbacks) {
    registeredTemplatesCallbacks[system](templ, true);
  }
};
var initPDFTemplates = function(system, callback) {
  // filter all registered templates
  for (var i=0;i<registeredTemplates.length; i++) {
    if (registeredTemplates[i].system === system) {
      callback(registeredTemplates[i], false);
    }
  }
  registeredTemplatesCallbacks[system] = callback;
};

// global controller
app.controller('OpenroleCtrl',['$scope','$http','alertService', 'loaderService','SERVICEURL', function($scope, $http, alertService, loaderService, SERVICEURL) {
  $scope.openrole_module_name = 'Overview';
  $scope.openrole_hide_pdf_button = "true";
  $scope.openrole_hide_new_button = "true";

    $scope.sendPasswordResetCode = function () {
        console.log("sendPasswordResetCode");
        loaderService.setLoadingStart("Logout");
        $http.get(SERVICEURL + '/pwreset?email='+window.escape($scope.email), {
            headers: { 'Content-Type': 'plain/text; charset=UTF-8'}
        })
        .success(function(data, status, headers, config){
               alertService.success('MSG.PWRESETSEND');
               loaderService.setLoadingReady();
                window.location = '/#/pwresetcode';
            })
            .error(function(data, status, headers, config) {
                alertService.danger(status, ': Error on requesting pw reset: ', data);
                loaderService.setLoadingReady();
            });
    };

    $scope.sendPasswordResetNewPW = function() {
        loaderService.setLoadingStart("Logout");
        $http.get(SERVICEURL + '/pwreset?email='+window.escape($scope.email)+'&code='+window.escape($scope.code), {
            headers: { 'Content-Type': 'plain/text; charset=UTF-8'}
        })
            .success(function(data, status, headers, config){
                alertService.success('MSG.PWRESETSUCCESSFUL');
                loaderService.setLoadingReady();
                window.location = '/#/';
            })
            .error(function(data, status, headers, config) {
                alertService.danger(status, ': Error on requesting pw reset: ', data);
                loaderService.setLoadingReady();
            });
    }

}]);

// ------------ global controller --------------
app.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$modal','alertService','loaderService','SYSTEMS','SERVICEURL',
    function($scope, $rootScope, $http, $location, localStorageService, $modal, alertService, loaderService, SYSTEMS, SERVICEURL) {
      $rootScope.systems = SYSTEMS;
      $scope.loggedin = ($http.defaults.headers.common["X-Openrole-Token"] != null);
      $rootScope.nick = localStorageService.get("X-Openrole-Nick");

      // init base config
      $rootScope.initialized = true;
      loaderService.setLoadingReady();

      // init developer extension
      var devUrl = localStorageService.get("DeveloperExtensionURL");
      if (angular.isDefined(devUrl) && devUrl != null && ! angular.isDefined($rootScope.devUrlAdded)) {
        console.log("loading developer extension url: "+devUrl);
        var s = document.createElement('script'); // use global document since Angular's $document is weak
        s.src = devUrl;
        document.body.appendChild(s);
        $rootScope.devUrlAdded = true;
      }

      // http://gregpike.net/demos/angular-local-storage/demo/demo.html
      $scope.login = function() {
        console.log("login");
        $http.post(SERVICEURL + '/login?email='+window.escape($scope.email), $scope.pw, {
          headers: { 'Content-Type': 'plain/text; charset=UTF-8'}
        })
          .success(function(data, status, headers, config){
            console.log("logged in. token = "+data.token);
            $scope.internalLogin(data);
          })
          .error(function(data, status, headers, config) {
            if (data == "USER_PW_WRONG") {
              // show Passwort vergessen button
            }
            alertService.danger(status, ': Could not log in: ', data);
          });
      };
      var internalClientSideLogout = function() {
        console.log("internal log out");
        delete $http.defaults.headers.common["X-Openrole-Token"];
        $scope.loggedin = false;
        localStorageService.remove("X-Openrole-Token");
        localStorageService.remove("X-Openrole-Nick");
        $rootScope.nick = "";
      };

      $scope.logout = function() {
        console.log("log out");
        alertService.clearAll();
        loaderService.setLoadingStart("Logout");
        $http.get(SERVICEURL + '/logout')
          .success(function(data, status, headers, config){
            internalClientSideLogout();
            loaderService.setLoadingReady();
          })
          .error(function(data, status, headers, config) {
            if (status == 401) {
              // already logged out
              internalClientSideLogout();
            } else {
              alertService.danger(status, ': Could not log in: ', data);
            }
            loaderService.setLoadingReady();
          });
      };

      $scope.internalLogin = function(responseObj) {
        console.log("internal log in");
        // http://stackoverflow.com/questions/20777700/angular-js-controller-gets-the-cookie-from-login-request-header-even-after-doing
        $http.defaults.headers.common["X-Openrole-Token"] = responseObj.token;
        $scope.loggedin = true;
        localStorageService.add("X-Openrole-Token", responseObj.token);
        alertService.success('MSG.LOGGED_IN');
        localStorageService.add("X-Openrole-Nick", responseObj.nick);
        $rootScope.nick = responseObj.nick;
      };

      $scope.store = function() {
        var theController = this.$parent.$parent;
        var or = theController.openrole;
        or.nick = $rootScope.nick;
        var docId = or.docId;

        loaderService.setLoadingStart("Speichere Charakter");
        var openroleAsJSON = angular.toJson(or);
        $http.post(SERVICEURL + '/' +theController.openrole_module_name+'/store/'+docId, openroleAsJSON, {
          headers: { 'Content-Type': 'application/json; charset=UTF-8'}
        })
          .success(function(data, status, headers, config){
            theController.openrole.docId = data;
            loaderService.setLoadingReady();
          })
          .error(function(data, status, headers, config){
            alertService.danger(status, 'MSG.COULD_NOT_STORE_CHAR', data);
            loaderService.setLoadingReady();
          })
        ; // http post
      };

      $scope.open = function() {

        var theController = this.$parent.$parent;
        loaderService.setLoadingStart("Lade Charakterliste");

        $http.get(SERVICEURL + '/' +theController.openrole_module_name+'/list')
          .success(function(data, status, headers, config){
            loaderService.setLoadingReady();
            $scope.openDialog(theController, data, 'OPEN_CHARACTER_TITLE', 'openCharacter');
          })
          .error(function(data, status, headers, config){
            loaderService.setLoadingReady();
              alertService.danger(status, data);
          })
        ; // get


      };

      $scope.openDialog = function(theController, characterlistJson, titleResKey, okActionRef) {
        // create and open the dialog
        var modalOpenDialogInstance = $modal.open({
          templateUrl: 'id.dialog.open.html',
          controller: DialogOpenCtrl,
          resolve: {
            characterlist: function() {
              // the the character list from service
              return angular.fromJson(characterlistJson);
            },
            titleResKey: function() {
              return titleResKey;
            },
            okActionRef: function() {
              return okActionRef;
            }
          }
        });

        $scope.openCharacter = function(characterDocId) {
          loaderService.setLoadingStart("Lade Charakter "+characterDocId);
          $http.get(SERVICEURL + '/'+theController.openrole_module_name+'/get/'+characterDocId)
            .success(function (data, status, headers, config) {
              loaderService.setLoadingReady();
              // here we have to put the new data asychnronously instead of setting references
              var ctrler = theController;
              var newCharObj = {};
              angular.copy(data, newCharObj);
              ctrler.characterLoaded(newCharObj);
            })
            .error(function (data, status, headers, config) {
              loaderService.setLoadingReady();
              alertService.danger(status+": Could not load character. Cause: "+data);
            });
        };

        modalOpenDialogInstance.result.then(function (responseObj) {
          console.info("dialog closed. item id chosen: "+responseObj.docId);
          if ("openCharacter" === responseObj.action) {
            $scope.openCharacter(responseObj.docId);
          } else if ("resetConf"=== responseObj.action){
            $scope.resetConf(responseObj.docId);
          }
        }, function () {
          console.info('Modal dismissed at: ' + new Date());
        });

        $scope.resetConf =function(confDocId) {
          if ("default" === confDocId) {
            var ctrler = theController;
            ctrler.reset(undefined);
          } else {
            loaderService.setLoadingStart("Lade Konfiguration " + confDocId);
            $http.get(SERVICEURL + '/customconf/get/' + confDocId)
              .success(function (data, status, headers, config) {
                loaderService.setLoadingReady();
                // here we have to put the new data asychnronously instead of setting references
                var ctrler = theController;
                ctrler.reset(JSON.parse(data.configuration));
              })
              .error(function (data, status, headers, config) {
                loaderService.setLoadingReady();
                alertService.danger(status + ": Could not load configuration. Cause: " + data);
              });
          }
        }
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

        modalInstance.result.then(function (responseObj) {
          console.info("dialog closed. user registered");
          $scope.internalLogin(responseObj);
        }, function () {
          console.info('Modal dismissed at: ' + new Date());
        });
      };

      $scope.reset = function() {
        var theController = this.$parent.$parent;
        // only show conf dialog for systems that have is turned on
        var customConfEnabled = false;
        for (var i=0; i<SYSTEMS.length; i++) {
          if (SYSTEMS[i].id === theController.openrole_module_name) {
            customConfEnabled = (SYSTEMS[i].customConf == "true");
          }
        }

        if (customConfEnabled) {
          loaderService.setLoadingStart("Lade Konfigurationsliste");

          $http.get(SERVICEURL + '/customconf/list/' + theController.openrole_module_name)
            .success(function (data, status, headers, config) {
              loaderService.setLoadingReady();
              if (angular.isDefined(data) && data.length > 0) {
                var tmpList = [
                  {"docId": "default", "charactername": "Default"}
                ];
                tmpList = tmpList.concat(data);
                $scope.openDialog(theController, tmpList, "OPEN_WITH_CUSTOM_CONF_TITLE", "resetConf");
              } else {
                // no custom config available
                theController.reset(undefined);
              }
            })
            .error(function (data, status, headers, config) {
              loaderService.setLoadingReady();
              alertService.danger(status, data);
            })
          ; // get
        } else {
          // custom config not enabled
          theController.reset(undefined);
        }
      };
    }]

);



