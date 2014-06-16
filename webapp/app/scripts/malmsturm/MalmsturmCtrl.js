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

    $scope.reset = function() {
      // to avoid references we deep copy it
      $scope.openrole = JSON.parse(JSON.stringify($scope.emptyCharacterJSON));
      $scope.calcBelastung();
    };

    $scope.characterLoaded = function(newCharacter) {
      $scope.reset();
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

    $scope.emptyCharacterJSON =
    {
      "docId": '' ,
      "file_version": 1,
      "charactername": '',

      "skillpyramidstartvalue": 5,
      "skillpyramid":
        [
          [ {"title": "_"}],
          [ {"title": "_"}, {"title": "_"}],
          [ {"title": "_"}, {"title": "_"}, {"title": "_"} ],
          [ {"title": "_"}, {"title": "_"}, {"title": "_"}, {"title": "_"} ],
          [ {"title": "_"}, {"title": "_"}, {"title": "_"}, {"title": "_"}, {"title": "_"} ],
          [
            { "title": "Athletik" },
            { "title": "Ausdauer" },
            { "title": "Ausstrahlung" },
            { "title": "Besitz" },
            { "title": "Einbruch" },
            { "title": "Einschüchtern" } ,
            { "title": "Entschlossenheit"},
            { "title": "Ermitteln" },
            { "title": "Gelehrsamkeit" },
            { "title": "Fahrzeug steuern" },
            { "title": "Fingerfertigkeit" },
            { "title": "Führungsqualitäten" },
            { "title": "Gespür" },
            { "title": "Handwerk" },
            { "title": "Heimlichkeit" },
            { "title": "Waffenloser Kampf" },
            { "title": "Nahkampf" },
            { "title": "Fernkampf" },
            { "title": "Kunst" },
            { "title": "Reiten" },
            { "title": "Scharfsinn" },
            { "title": "Spiele" },
            { "title": "Sprachen" },
            { "title": "Täuschung" },
            { "title": "Technik" },
            { "title": "Zaubern"}
          ]
        ],
      "stufenleiter":
      { "12": "Perfekt",
        "11": "Göttergleich",
        "10": "Überirdisch",
        "9": "Übernatürlich",
        "8": "Übermenschlich",
        "7": "Legendär",
        "6": "Weltklasse",
        "5": "Großartig",
        "4": "Hervorragend",
        "3": "Gut",
        "2": "Ordentlich",
        "1": "Durchschnittlich",
        "0": "Mäßig",
        "-1": "Armselig",
        "-2": "Grauenhaft"},
      "stufenleiterstart": -2,
      "stufenleiterend": 12,
      "konsequenzen":  ["LEICHT","MITTEL","SCHWER"],

      "aspects": [{"name": "", "description": ""}],
      "talents": [{"name": ""}],
      "weapons": [{"name": ""}],
      "beute": 6,
      "belastungspunkte": [
        {
          "id": "koerper",
          "defaultval": 5,
          "skillbonus": 0,
          "bonus": 0,
          "dependsOnSkill":"Ausdauer",
          "total": 0,
          "totalArr": new Array(0)
        },
        {
          "id": "mental",
          "defaultval": 5,
          "skillbonus": 0,
          "bonus": 0,
          "dependsOnSkill":"Entschlossenheit",
          "total": 0,
          "totalArr": new Array(0)
        },
        {
          "id": "arkan",
          "defaultval": 5,
          "skillbonus": 0,
          "bonus": 0,
          "dependsOnSkill":"Zaubern",
          "total": 0,
          "totalArr": new Array(0)
        }
      ],
      "pdffooter": [
        {"header": "Der Einsatz eines SP erlaubt wahlweise",
         "content":["+1 auf vor einen Wurf","eine Behauptung",
           "auslösen eines Aspekts (+2, neuer Wurf, andere Fertigkeit)"
          ]},
        {"header":"",
          "content":[
            "die Aktivierung mancher Talente/Gaben",
            "der Erzwingung eines Aspekts zu widerstehen",
            "den Aspekt eines Gegners auszunutzen"
          ]
        },
        {"header":"SP erhält man durch",
          "content":[
            "Hinnahme der Erzwingung eines Aspekts",
            "Gutes Rollenspiel"
          ]
        },
        {"header":"Jede Stufe erlaubt wahlweise die Erhöhung von",
          "content":["Qualität, Zeit oder Unauffälligkeit einer Aufgabe",
            "Angriffstress"
          ]
        },
        {"header":"Spin (3 Erfolge) erlaubt wahlweise",
        "content":["+1/-1 auf die nächste Aktion",
        "die Erzeugung eines zeitweiligen Aspekts"]}
      ],
      "pdftemplate": "templateMalmsturm1",
      "shares": []
    };
    // end empty character JSON
    // init
    $scope.reset();
    // end init

  } // end controller
]);



