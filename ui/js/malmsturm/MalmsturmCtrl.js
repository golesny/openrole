"use strict";

angular.module('openrole')
  .controller('MalmsturmCtrl',['$scope','$rootScope','$http', '$location',  function($scope, $rootScope, $http, $location) {
    $scope.openrole_module_version = '0.0.4.20140325';
    $scope.openrole_module_name = 'Malmsturm';
    $scope.imageRecords = ['img/malmsturm/logo.jpg','img/malmsturm/rune.jpg'];
    $scope.imageLoaded = [];

    // to reset all
    $scope.reset = function() {
        $scope.charactername = '';
        // deep copy
        $scope.skillpyramid = [];
        for (var i in $scope.CONFIG.skillpyramid) {
            $scope.skillpyramid[i] = $scope.CONFIG.skillpyramid[i].slice();
        }
        $scope.aspects = [{"name": "", "description": ""}];
        $scope.talents = [{"name": ""}];

    };

    // initialize by loading the config
    $http.get('data/malmsturm-config.json').then(function(response){
        $scope.CONFIG = response.data;
        $scope.reset();
    });

    // drag&Drap on skills
    $scope.dropCallback = function(event, ui, item, $index) {
        if (item.title == '_') {
          var fillerList = $scope.skillpyramid[$scope.skillpyramid.length-1]
          var emptyElementIdx = fillerList.indexOf(item);
          if (emptyElementIdx > -1) {
            fillerList.splice(emptyElementIdx, 1);
          }
        }
    };

    $scope.newAspect = function() {
        $scope.aspects[$scope.aspects.length] = {"name": "", "description": ""};
    };
    $scope.newTalent = function() {
        $scope.talents[$scope.talents.length] = {"name": ""};
    }

        $scope.delete = function(arraylist, $index) {
            arraylist.splice($index, 1);
        };

        $scope.moveUp = function(arraylist, $index, $first) {
            if (!$first) {
                var tmp = arraylist[$index];
                arraylist[$index] = arraylist[$index - 1];
                arraylist[$index - 1] = tmp;
            }
        }

        $scope.moveDown = function(arraylist, $index, $last) {
            if (!$last) {
                var tmp = arraylist[$index];
                arraylist[$index] = arraylist[$index + 1];
                arraylist[$index + 1] = tmp;
            }
        }

        $scope.notifyUser = function(message) {
            $('.bottom-left').notify({
                message: { text: message },
                type: 'info'
            }).show();
        }


$scope.loadAllImages = function(index){
    console.log("loading image "+index);
    //bind load event
    if( index >= $scope.imageRecords.length ){
        $scope.createInternalPDF();
        return;
    }

    //create image object
    var image = new Image();

    //add image path
    image.src = $scope.imageRecords[index];
    image.onload = function(){
        //now load next image
        $scope.imageLoaded[index] = image;
        $scope.loadAllImages(index + 1);
    }
    image.onerror = function() {
        alert("Could not load image: "+image.src);
    }
}
        $scope.createPDF = function() {
            $scope.loadAllImages(0);
        }
    $scope.createInternalPDF = function() {
        console.log("creating PDF");
            var doc = new jsPDF();

            doc.setFont("times");
            doc.setFontType("italic");
            doc.text(20, 40, 'Spielerfigur: '+ $scope.charactername);
            doc.addImage($scope.imageLoaded[0], 'JPEG', 110, 2, 90, 45);

            doc.setFontSize(11);
            for (var i in $scope.skillpyramid) {
                doc.addImage($scope.imageLoaded[1], 'JPEG', 50,100+i*10, 6, 4 ,"rune");
                var lvl = $scope.CONFIG.skillpyramidstartvalue - i;
                if (lvl > 0) {
                    lvl = "+"+lvl;
                } else if (lvl == 0) {
                    lvl = "+/-0";
                } else {
                    lvl = ""+lvl;
                }
                doc.text(15, 103+i*10, lvl + " " + $scope.CONFIG.stufenleiter[$scope.CONFIG.skillpyramidstartvalue - i]);
            }

            if ($location.$$host == 'localhost') {
              // for development: open in new window (not working in IE)
              doc.output('dataurlnewwindow');
            } else {
              // for production: download file
              doc.save("malmsturm.pdf");
            }
    }
}]);



