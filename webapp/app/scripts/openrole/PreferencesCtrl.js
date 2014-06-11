"use strict";

// ------------ global controller --------------
app.controller('PreferencesCtrl', ['$scope', '$rootScope', 'localStorageService', 'alertService','loaderService',
  function($scope, $rootScope, localStorageService, alertService, loaderService) {

    $scope.savePref = function() {
      localStorageService.add("DeveloperExtensionURL", $scope.prefs.DeveloperExtensionURL);
    };

    $scope.loadPref = function() {
      $scope.prefs = {
        "DeveloperExtensionURL": localStorageService.get("DeveloperExtensionURL")
      };
    };

    $scope.loadPref();
  }
]);

