"use strict";


var app = angular.module('openrole');

app.controller('MalmsturmGMCtrl',['$scope','$rootScope','$http', '$location','alertService','loaderService','$translate','SERVICEURL',
  function($scope, $rootScope, $http, $location, alertService, loaderService, $translate, SERVICEURL) {
    $scope.openrole_module_name = "malmsturmgm";
    $scope.openrole = {'docId': ''};
    $scope.data = {"availableChars":[]};
    $scope.registeredPDFTemplates = [];

    initPDFTemplates($scope.openrole_module_name, function(obj, isAdditionalAdd) {
      $scope.registeredPDFTemplates.push(obj);
      if (isAdditionalAdd) {
        $scope.$apply();
      }
    });

    $scope.loadSharedCharacters = function() {
      loaderService.setLoadingStart("Loading shared characters. "+$http.defaults.headers.common["X-Openrole-Token"]);
      $http.get(SERVICEURL + '/malmsturm/shares/')
        .success(function(data, status, headers, config){
          $scope.data.availableChars = data;
          loaderService.setLoadingReady();
        })
        .error(function(data, status, headers, config) {
          $scope.data.availableChars = [];
          alertService.danger('MSG.COULD_NOT_LOAD_SHARED', status, data);
          loaderService.setLoadingReady();
        });
    };

    $scope.reset = function() {
      // to avoid references we parse it each time
      $scope.openrole = JSON.parse($translate.instant('MALMSTURMGM.DEFAULT_EMPTY_CONFIG_BLOCK'));
    };

    $scope.createPDF = function() {
        try {
          var tmplName = eval($scope.openrole.pdftemplate);
          var dataCopy = JSON.parse(JSON.stringify($scope.openrole));
          // add the character data to data for PDF
          for (var i=0; i<dataCopy.characters.length; i++) {
            // search
            for (var j=0; j<$scope.data.availableChars.length; j++) {
              if ($scope.data.availableChars[j].docId == dataCopy.characters[i].docId) {
                dataCopy.characters[i] = $scope.data.availableChars[j];
                break;
              }
            }
          }
          var doc = tmplName(dataCopy, $scope.imageLoaded, $translate);
          if (!angular.isDefined(doc)) {
            alertService.danger("Template did not return the document.");
          } else {
            if ($location.$$host == 'localhost') {
              // for development: open in new window (not working in IE)
              doc.output('dataurlnewwindow');
            } else {
              // for production: download file
              doc.save("malmsturmgm.pdf");
            }
          }
        } catch (e) {
          alertService.danger(e);
        }
    };

    $scope.characterLoaded = function(newCharacter) {
      $scope.reset();
      // merge JSONS if a new field has been added
      $.extend($scope.openrole, newCharacter);
      //
      console.log("character loaded");
    };

    $scope.newLink = function(arraylist) {
      arraylist[arraylist.length] = {
        "docId":"",
        "charactername":"",
        "nick":""
      };
    };

    // init
    $scope.reset();
    $scope.loadSharedCharacters();
    // end init
  }]);