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
  $translateProvider.fallbackLanguage('de');
  $translateProvider.determinePreferredLanguage();
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

app.filter('escape', function() {
  return window.escape;
});

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
app.controller('OpenroleCtrl',['$scope', function($scope) {
  $scope.openrole_module_name = 'Overview';
}]);

// ------------ global controller --------------
app.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$modal','alertService','loaderService','SYSTEMS',
    function($scope, $rootScope, $http, $location, localStorageService, $modal, alertService, loaderService, SYSTEMS) {
      $rootScope.systems = SYSTEMS;
      $rootScope.serviceHost = "https://open-role.appspot.com";
      if ($location.$$host == 'localhost') {
        // for dev
        $rootScope.serviceHost = "http://localhost:8888";
      }
      $rootScope.serviceHost = $rootScope.serviceHost + "/open_role_service";
      $http.defaults.headers.common["X-Openrole-Token"] = localStorageService.get("X-Openrole-Token");
      $scope.loggedin = ($http.defaults.headers.common["X-Openrole-Token"] != null);
      $rootScope.nick = localStorageService.get("X-Openrole-Nick");

      // init base config
      $rootScope.initialized = true;
      loaderService.setLoadingReady();

      // init developer extension
      var devUrl = localStorageService.get("DeveloperExtensionURL");
      if (angular.isDefined(devUrl) && ! angular.isDefined($rootScope.devUrlAdded)) {
        console.log("loading developer extension url: "+devUrl);
        var s = document.createElement('script'); // use global document since Angular's $document is weak
        s.src = devUrl;
        document.body.appendChild(s);
        $rootScope.devUrlAdded = true;
      }

      // http://gregpike.net/demos/angular-local-storage/demo/demo.html
      $scope.login = function() {
        console.log("login");
        $http.post($rootScope.serviceHost + '/login?email='+window.escape($scope.email), $scope.pw, {
          headers: { 'Content-Type': 'plain/text; charset=UTF-8'}
        })
          .success(function(data, status, headers, config){
            console.log("logged in. token = "+data);
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
        $http.defaults.headers.common["X-Openrole-Token"] = null;
        $scope.loggedin = false;
        localStorageService.remove("X-Openrole-Token");
        localStorageService.remove("X-Openrole-Nick");
        $rootScope.nick = "";
      };

      $scope.logout = function() {
        console.log("log out");
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
              alertService.danger(status, ': Could not log in: ', data);
            }
            loaderService.setLoadingReady();
          });
      };

      $scope.internalLogin = function(responseObj) {
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
            alertService.danger(status, 'MSG.COULD_NOT_STORE_CHAR', data);
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
            alertService.danger(status+": Could not load character list. Cause: "+data);
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
              var newCharObj = {};
              angular.copy(data, newCharObj);
              ctrler.characterLoaded(newCharObj);
            })
            .error(function (data, status, headers, config) {
              loaderService.setLoadingReady();
              alertService.danger(status+": Could not load character. Cause: "+data);
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

        modalInstance.result.then(function (responseObj) {
          console.info("dialog closed. user registered");
          $scope.internalLogin(responseObj);
        }, function () {
          console.info('Modal dismissed at: ' + new Date());
        });
      };
    }]

);



