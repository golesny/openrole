"use strict";


var app = angular.module('openrole');

app.controller('MalmsturmGMCtrl',['$scope','$rootScope','$http', '$location','alertService','loaderService','$translate',
  function($scope, $rootScope, $http, $location, alertService, loaderService, $translate) {
    $scope.openrole_module_name = "malmsturmgm";
    $scope.openrole = {'docId': ''};
    $scope.registeredPDFTemplates = [];

    initPDFTemplates($scope.openrole_module_name, function(obj, isAdditionalAdd) {
      $scope.registeredPDFTemplates.push(obj);
      if (isAdditionalAdd) {
        $scope.$apply();
      }
    });

    $scope.reset = function() {
      // to avoid references we deep copy it
      $scope.openrole = JSON.parse(JSON.stringify($scope.emptyCharacterJSON));
    };

    $scope.createPDF = function() {
        console.log("creating PDF.1");

        try {
          var tmplName = eval($scope.openrole.pdftemplate);
          var doc = tmplName($scope.openrole, $scope.imageLoaded, $translate);
          if (!angular.isDefined(doc)) {
            alertService.danger("Template did not return the document.");
          } else {
            if ($location.$$host == 'localhost') {
              // for development: open in new window (not working in IE)
              doc.output('dataurlnewwindow');
            } else {
              // for production: download file
              doc.save("malmsturm.pdf");
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
    };

    $scope.emptyCharacterJSON =
    {
      "docId": '',
      "file_version": 1,
      "characters": [],
      "pdftemplate": "templateMalmsturmGM1"
    };

    // end empty character JSON
    // init
    $scope.reset();
    // end init
  }]);