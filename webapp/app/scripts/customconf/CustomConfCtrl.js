"use strict";


var app = angular.module('openrole');

app.controller('CustomConfCtrl',['$scope','$rootScope','$http', '$location','alertService','loaderService','$translate','SYSTEMS',
  function($scope, $rootScope, $http, $location, alertService, loaderService, $translate, SYSTEMS)
  {
    $scope.openrole_module_name = "customconf";
    $scope.openrole_hide_pdf_button = "true";
    if (!angular.isDefined($scope.availableSystems)) {
      $scope.availableSystems = [];
      for (var i=0; i<SYSTEMS.length; i++) {
        if (SYSTEMS[i].customConf == "true") {
          $scope.availableSystems.push(SYSTEMS[i]);
        }
      }
    }
    $scope.openrole = {"docId": "", "systemname": $scope.availableSystems[0].id};

    $scope.reset = function() {
      $scope.openrole = {"docId": "", "systemname": $scope.availableSystems[0].id};
      $scope.loadDefaultConf();
    };

    $scope.loadDefaultConf = function() {
      var sysConfBlock = $scope.openrole.systemname.toUpperCase() + '.DEFAULT_EMPTY_CONFIG_BLOCK';
      var text = $translate.instant(sysConfBlock);
      if (text === sysConfBlock) {
        $scope.openrole.configuration = "Error: script tag for locale.js missing?"
      } else {
        $scope.openrole.configuration = text;
      }
    };


    $scope.characterLoaded = function(newCharacter) {
      $scope.reset();
      // merge JSONS if a new field has been added
      $.extend($scope.openrole, newCharacter);
      console.log("systemname="+$scope.openrole.systemname);
    };

    $scope.newShare = function(arraylist) {
      arraylist.push("");
    };

    $scope.deleteShare = function(arraylist, $index) {
      arraylist.splice($index, 1);
    };

    // init
    $scope.reset();
    // end init

  } // end controller
]);



