"use strict";


var app = angular.module('openrole');

app.controller('MalmsturmCtrl',['$scope','$rootScope','$http', '$location','alertService','loaderService','$translate',
  function($scope, $rootScope, $http, $location, alertService, loaderService, $translate)
  {
    $scope.openrole_module_name = "malmsturm";
    $scope.imageToLoad = ['images/malmsturm/logo.dataurl','images/malmsturm/rune.dataurl'];
    $scope.imageLoaded = [];
    $scope.openrole = {'docId': ''};
    $scope.registeredPDFTemplates = [];
    initPDFTemplates($scope.openrole_module_name, function(obj, isAdditionalAdd) {
      $scope.registeredPDFTemplates.push(obj);
      if (isAdditionalAdd) {
        $scope.$apply();
      }
    });

    $scope.hideMoveButton = function(destList, skillListIndex, buttonSkillListIndex) {
      if (skillListIndex == buttonSkillListIndex) {
        // cannot move into same list
        return true;
      }
      if (buttonSkillListIndex == ($scope.openrole.skillpyramid.length - 1)) {
        // we can always move to last list
        return false;
      }
      for (var i=0; i<destList.length; i++) {
        if (destList[i].title == '_') {
          return false;
        }
      }
      return true;
    };

    $scope.reset = function(configObj) {
      // to avoid references we parse it each time
      $scope.openrole = JSON.parse($translate.instant('MALMSTURM.DEFAULT_EMPTY_CONFIG_BLOCK'));
      if (angular.isDefined(configObj)) {
        $.extend($scope.openrole, configObj);
      }
      $scope.calcBelastung();
    };

    $scope.characterLoaded = function(newCharacter) {
      $scope.reset(JSON.parse($translate.instant('MALMSTURM.DEFAULT_EMPTY_CONFIG_BLOCK')));
      // merge JSONS if a new field has been added
      $.extend($scope.openrole, newCharacter);
      $scope.calcBelastung();
    };

    //
    $scope.moveSkill = function(fromList, item, itemindex, tolistindex) {
      var toList = $scope.openrole.skillpyramid[tolistindex];
      if (toList === fromList) {
        return;
      }
      // add
      if ($scope.openrole.skillpyramid.length-1 == tolistindex) {
        // add to the last list
        toList.push(item);
        // add empty to old list
        fromList[itemindex] = {title: "_"};
      } else {
        // replace an empty entry
        for (var i=0; i<toList.length; i++) {
          if (toList[i].title == "_") {
            toList[i] = item;
            if ($scope.openrole.skillpyramid[$scope.openrole.skillpyramid.length-1] == fromList) {
              // just remove from last list
              fromList.splice(itemindex, 1);
            } else {
              // set empty item
              fromList[itemindex] = {"title": '_'};
            }
            break;
          }
        }
      }
      // reset the value
      $scope.listDescr = undefined;
      // reset mark for skill switch
      $scope.markedListIdx = undefined;
      $scope.markedSkillIdx = undefined;
      //
      $scope.calcBelastung();
    };

    $scope.markOrMoveSkill = function(listIdx, skillIdx) {
      if (angular.isDefined($scope.markedListIdx)) {
        // move marked skill
        var srcList = $scope.openrole.skillpyramid[$scope.markedListIdx];
        var destList = $scope.openrole.skillpyramid[listIdx];
        var tmp = destList[skillIdx];
        //
        if (srcList[$scope.markedSkillIdx].title == '_' && ($scope.openrole.skillpyramid.length - 1) == listIdx) {
          // do not add emtpy item to last list, remove old entry
          destList.splice(skillIdx, 1);
        } else {
          // add to the list
          destList[skillIdx] = srcList[$scope.markedSkillIdx];
        }
        //
        if (tmp.title == '_' && ($scope.openrole.skillpyramid.length - 1) == $scope.markedListIdx) {
          // remove the moved item from last list
          srcList.splice($scope.markedSkillIdx, 1);
        } else {
          srcList[$scope.markedSkillIdx] = tmp;
        }
        // unmark
        $scope.markedListIdx = undefined;
        $scope.markedSkillIdx = undefined;
        //
        $scope.calcBelastung();
      } else {
        $scope.markedListIdx = listIdx;
        $scope.markedSkillIdx = skillIdx;
      }
    };

    $scope.getMark = function(item, listIdx, skillIdx) {
      var mark = "";
      if ($scope.markedListIdx === listIdx && $scope.markedSkillIdx == skillIdx) {
        mark = "marked";
      }
      if (item.title == '_') {
        mark += "empty";
      }
      return mark;
    };

    $scope.calcBelastung = function() {
      for (var b=0; b < $scope.openrole.belastungspunkte.length; b++) {
        var bp = $scope.openrole.belastungspunkte[b];
        for (var i=0; i < $scope.openrole.skillpyramid.length; i++) {
          var skills = $scope.openrole.skillpyramid[i];
          for (var j=0; j<skills.length; j++) {
            if (bp.dependsOnSkill == skills[j].title) {
              bp.skillbonus = $scope.openrole.skillpyramidstartvalue - i;
            }
          }
        }
        // calc total
        var bonus = 0;
        try {
          bonus = parseInt(bp.bonus);
        } catch (e) {
          // ignore
        }
        bp.total = bp.defaultval + bp.skillbonus + bonus;
        if (bp.total > 0) {
          bp.totalArr = new Array(bp.total);
        } else {
          bp.totalArr = [];
        }
      }
    };

    $scope.newAspect = function() {
      $scope.openrole.aspects[$scope.openrole.aspects.length] = {"name": "", "description": ""};
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

    $scope.createPDF = function() {
      loaderService.loadImagesAndGeneratePDF($scope);
    };

    // init
    $scope.reset();
    // end init

  } // end controller
]);



