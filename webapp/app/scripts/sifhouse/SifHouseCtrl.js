"use strict";


var app = angular.module('openrole');

app.controller('SifHouseCtrl',['$scope','$rootScope','$http', '$location','alertService','loaderService','$translate','SERVICEURL',
  function($scope, $rootScope, $http, $location, alertService, loaderService, $translate, SERVICEURL) {
    $scope.openrole_module_name = "sifhouse";
    $scope.openrole = {'docId': ''};
    $scope.data = {"availableChars":[]};
    $scope.registeredPDFTemplates = [];

    initPDFTemplates($scope.openrole_module_name, function(obj, isAdditionalAdd) {
      $scope.registeredPDFTemplates.push(obj);
      if (isAdditionalAdd) {
        $scope.$apply();
      }
    });

    $scope.reset = function() {
      // to avoid references we parse it each time
      var emptyConfigString;
      try {
        emptyConfigString = $translate.instant('SIFHOUSE.DEFAULT_EMPTY_CONFIG_BLOCK');
        $scope.openrole = JSON.parse(emptyConfigString);
        $scope.crestShapeChanged();
        $scope.crestSelItem = $scope.openrole.crest.elements[0];
      } catch (e) {
        console.log("Parse Error on block: "+emptyConfigString);
        alertService.danger("Could not load the empty default config block", e);
      }
    };


    $scope.createPDF = function() {
      loaderService.loadResourcesAndGeneratePDF($scope);
    };

    $scope.characterLoaded = function(newCharacter) {
      $scope.reset();
      // merge JSONS if a new field has been added
      $.extend($scope.openrole, newCharacter);
      //
      console.log("character loaded");
    };

    $scope.crestShapeChanged = function() {
      var shape = 0;
      try {
        shape = parseInt($scope.openrole.crest.shape.shape);
      } catch (e) {
        // ignore
      }
      if (shape < 0) {
        shape = 0;
      }
      if (shape > 100) {
        shape = 100;
      }
      $scope.openrole.crest.shape.shape = ""+shape;
      var p1 = Math.round(100 + 0.4 * shape);  // 100 - 140
      var p2 = Math.round(200 + 0.48 * shape); // 200 - 248

      $scope.openrole.crest.shape.path = 'M  2,'+p1+' 2,2 176,2 176,'+p1+' Q176 '+p2+',90 246 Q2 '+p2+',2 '+p1;
    };


    $scope.new = function(arraylist) {
      arraylist[arraylist.length] = {"name": ""};
    };

    $scope.delete = function(arraylist, $index) {
      arraylist.splice($index, 1);
    };

    $scope.newShare = function(arraylist) {
      arraylist.push("");
    };

    $scope.deleteShare = function(arraylist, $index) {
      arraylist.splice($index, 1);
    };

    $scope.move = function(arraylist, fromIdx, toIdx) {
      var tmp = arraylist[fromIdx];
      arraylist[fromIdx] = arraylist[toIdx];
      arraylist[toIdx] = tmp;
    };

    $scope.moveUp = function(arraylist, $index) {
      $scope.move(arraylist, $index, $index -1);
    };

    $scope.moveDown = function(arraylist, $index) {
      $scope.move(arraylist, $index, $index +1);
    };

    $scope.isEqual = function(o1, values) {
      for (var i=0; i<values.length; i++) {
        if (values[i] === o1) {
          return true;
        }
      }
      return false;
    };

    $scope.selectSVGElement = function(element) {
      $scope.crestSelItem = element;
    };

    $scope.svgAdd = function(svgType) {
      var obj = {"name":svgType, "svgType":svgType};
      $scope.openrole.crest.elements.push(obj);
    };

    $scope.svgRemove = function() {
      if ($scope.crestSelItem.svgType === "shapepath") {
        return;
      }

      var el = $scope.openrole.crest.elements.remove($scope.crestSelItem);
      if ($scope.openrole.crest.elements.length > 0) {
        $scope.crestSelItem = $scope.openrole.crest.elements[0];
      }
    };

    $scope.svgDuplicate = function() {
      var obj = angular.copy($scope.crestSelItem);
      $scope.openrole.crest.elements.push(obj);
      $scope.crestSelItem = obj;
    };

    // init
    $scope.reset();
    // end init
  }]);
