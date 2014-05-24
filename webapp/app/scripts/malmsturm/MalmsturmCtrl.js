"use strict";


angular.module('openrole')
  .controller('MalmsturmCtrl',['$scope','$rootScope','$http', '$location','alertService','loaderService',
    function($scope, $rootScope, $http, $location, alertService, loaderService)
    {
      $scope.openrole_module_name = "malmsturm";
      $scope.file_version = '1';
      $scope.imageToLoad = ['img/malmsturm/logo.dataurl','img/malmsturm/rune.dataurl'];
      $scope.imageLoaded = [];
      $scope.openrole = {'docId': ''};

      // to reset all
      $scope.reset = function() {
        $scope.openrole.docId = '';
        $scope.openrole.file_version = $scope.file_version;
        $scope.openrole.charactername = '';
        // deep copy
        $scope.openrole.skillpyramid = [];
        for (var i in $scope.openrole.CONFIG.skillpyramid) {
          $scope.openrole.skillpyramid[i] = $scope.openrole.CONFIG.skillpyramid[i].slice();
        }
        $scope.openrole.aspects = [{"name": "", "description": ""}];
        $scope.openrole.talents = [{"name": ""}];
      };

      // initialize by loading the config
      $http.get('data/malmsturm-config.json')
        .success(function (data, status, headers, config) {
          $scope.openrole.CONFIG = data;
          $scope.reset();
        })
        .error(function (data, status, headers, config) {
          alertService.danger(status + ": Could not load config.");
        })
      ;

      // drag&Drap on skills
      $scope.dropStartCallback = function(event, ui, fromListIndex, itemIndex, item) {
        $scope.draggedFromListIndex = fromListIndex;
        $scope.draggedIndex = itemIndex;
        $scope.draggedItem = item;
      };
      $scope.dropCallback = function(event, ui, item) {
        if (item.title == '_') {
          var fillerList = $scope.openrole.skillpyramid[$scope.openrole.skillpyramid.length-1]
          var emptyElementIdx = fillerList.indexOf(item);
          if (emptyElementIdx > -1) {
            fillerList.splice(emptyElementIdx, 1);
          }
        }
      };

      $scope.newAspect = function() {
        $scope.openrole.aspects[$scope.openrole.aspects.length] = {"name": "", "description": ""};
      };
      $scope.newTalent = function() {
        $scope.openrole.talents[$scope.openrole.talents.length] = {"name": ""};
      };

      $scope.delete = function(arraylist, $index) {
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

      $scope.createPDF = function() {
        loaderService.loadImages($scope.imageToLoad, $scope.imageLoaded, $scope.createInternalPDF);
      };

      $scope.createInternalPDF = function() {
        console.log("creating PDF.1");

        try {
          var tmplName = eval('templateMalmsturm1');
          var doc = tmplName($scope.openrole, $scope.imageLoaded);
          if ($location.$$host == 'localhost') {
            // for development: open in new window (not working in IE)
            doc.output('dataurlnewwindow');
          } else {
            // for production: download file
            doc.save("malmsturm.pdf");
          }
        } catch (e) {
          alertService.danger(e.stack.split('\n')[0]);
        }

      };

    } // end controller
  ]);



