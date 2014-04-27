"use strict";

angular.module('openrole')
  .controller('MalmsturmCtrl',['$scope','$rootScope','$http', '$location',  function($scope, $rootScope, $http, $location) {
    $scope.openrole_module_version = '0.1.0.20140426';
    $scope.openrole_module_name = 'malmsturm';
    $scope.imageRecords = ['img/malmsturm/logo.dataurl','img/malmsturm/rune.dataurl'];
    $scope.imageLoaded = [];
    $scope.openrole = {'docId': ''};

    // to reset all
    $scope.reset = function() {
        $scope.openrole.docId = '';
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
    $http.get('data/malmsturm-config.json').then(function(response){
        $scope.openrole.CONFIG = response.data;
        $scope.reset();
    });

    // drag&Drap on skills
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

// todo make as service
$rootScope.loadAllImages = function(imageRecords, imageLoaded, index, createPDFAfterLoad){
    console.log("loading image "+index);

    //bind load event
    if( index >= imageRecords.length ){
        $rootScope.loading = "Generiere PDF";
        createPDFAfterLoad();
        $rootScope.loadingReady = true;
        return;
    }
    $rootScope.loadingReady = false;
    $rootScope.loading = "Lade Bild "+(index+1)+"/"+imageRecords.length;

    //add image path
    $http.get(imageRecords[index])
        .success(function(data, status, headers, config){
            console.log("Loaded image "+index+" "+imageRecords[index]);
            // convert to dataurl, because jsPDF displays dataURLs nicer
            imageLoaded[index] = data; //"data:image/jpeg;base64," + Base64.encodeBinary(data);
            $rootScope.loadAllImages(imageRecords, imageLoaded, index + 1, createPDFAfterLoad);
        })
        .error(function(data, status, headers, config){
            $rootScope.addAlert('danger', status+": Could not load images. Cause: "+data);
            $rootScope.loadingReady = true;
        })
    ;
};
    $scope.createPDF = function() {
            $rootScope.loadAllImages($scope.imageRecords, $scope.imageLoaded, 0, $scope.createInternalPDF);
    };

    $scope.createInternalPDF = function() {
        console.log("creating PDF");
            var doc = new jsPDF();

            doc.setFont("times");
            doc.setFontType("italic");
            doc.text(20, 40, 'Spielerfigur: '+ $scope.openrole.charactername);
            doc.addImage($scope.imageLoaded[0], 'JPEG', 110, 2, 90, 45);

            doc.setFontSize(11);
            for (var i in $scope.openrole.skillpyramid) {
                doc.addImage($scope.imageLoaded[1], 'JPEG', 50,100+i*10, 6, 4 ,"rune");
                var lvl = $scope.openrole.CONFIG.skillpyramidstartvalue - i;
                if (lvl > 0) {
                    lvl = "+"+lvl;
                } else if (lvl == 0) {
                    lvl = "+/-0";
                } else {
                    lvl = ""+lvl;
                }
                doc.text(15, 103+i*10, lvl + " " + $scope.openrole.CONFIG.stufenleiter[$scope.openrole.CONFIG.skillpyramidstartvalue - i]);
            }

            if ($location.$$host == 'localhost') {
              // for development: open in new window (not working in IE)
              doc.output('dataurlnewwindow');
            } else {
              // for production: download file
              doc.save("malmsturm.pdf");
            }
    };
}]);



