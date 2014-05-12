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
            console.log("creating PDF");
            var doc = new jsPDF();

            // border
            var pageSize = doc.internal.pageSize;
            var LEFT_X = 8;
            var TOP_Y = 6;
            var RIGHT_X = pageSize.width - LEFT_X * 2;
            var RIGHT_X_COL1 = (RIGHT_X - LEFT_X) / 3 * 2;
            var BOTTOM_Y = pageSize.height - TOP_Y * 2;
            var LINE_HEIGHT = 6;

            // Malmsturm Logo
            doc.addImage($scope.imageLoaded[0], 'JPEG', 115, 2, 90, 45);
            //doc.rect(LEFT_X, TOP_Y, RIGHT_X, BOTTOM_Y);

            doc.setFontSize(11);
            doc.setFont("times");
            doc.setFontType("italic");
            // *** Character name ***
            var y = TOP_Y + LINE_HEIGHT;
            doc.text(LEFT_X, y, 'Spielerfigur: '+ $scope.openrole.charactername);
            doc.line(LEFT_X, y + 1, 110, y + 1);
            y += LINE_HEIGHT + LINE_HEIGHT;

            // *** Skills ***
            doc.text(LEFT_X, y, 'Fertigkeiten: ');
            doc.line(LEFT_X, y + 1, 110, y + 1);
            y += LINE_HEIGHT;

            doc.setFontSize(9);
            for (var i = 0; i < $scope.openrole.skillpyramid.length; i++) {
                var lvl = $scope.openrole.CONFIG.skillpyramidstartvalue - i;
                if (lvl > 0) {
                    lvl = "+"+lvl;
                } else if (lvl == 0) {
                    lvl = "+/-0";
                } else {
                    lvl = ""+lvl;
                }
                doc.text(LEFT_X, y, lvl + " " + $scope.openrole.CONFIG.stufenleiter[$scope.openrole.CONFIG.skillpyramidstartvalue - i]);
                doc.addImage($scope.imageLoaded[1], 'JPEG', 36, y - 3, 4, 3 ,"rune");
                var slotWidth = 27;
                // skills
                var skillsLine = '';
                for (var j = 0; j < $scope.openrole.skillpyramid[i].length; j++) {
                    var skill = $scope.openrole.skillpyramid[i][j];
                    if (j > 0) {
                        skillsLine += " - ";
                    }
                    skillsLine += skill.title;
                }
                if (i < ($scope.openrole.skillpyramid.length - 1)) {
                    doc.text(42, y, skillsLine);
                } else {
                    // last line has many skills
                    var lines = doc.splitTextToSize(skillsLine, RIGHT_X - 42);
                    for (var j = 0; j < lines.length; j++) {
                        var line = lines[j];
                        doc.text(42, y, line);
                        if (j < lines.length - 1) {
                            y += 4;
                        }
                    }
                }
                doc.line(LEFT_X, y + 3, 35 + $scope.openrole.skillpyramid[i].length * slotWidth, y + 3);
                y += LINE_HEIGHT + 2;
            }
            y += LINE_HEIGHT;

            // *** Aspects ***
            doc.setFontSize(11);
            doc.text(LEFT_X, y, 'Aspekte: ');
            doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
            y += LINE_HEIGHT;
            // content
            y += LINE_HEIGHT;


            // *** Talente & Gaben ***
            doc.setFontSize(11);
            doc.text(LEFT_X, y, 'Talente und Gaben: ');
            doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
            y += LINE_HEIGHT;
            // content
            y += LINE_HEIGHT;


            // *** Waffen und Rüstungen ***
            doc.setFontSize(11);
            doc.text(LEFT_X, y, 'Waffen und Rüstungen: ');
            doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
            y += LINE_HEIGHT;
            // content
            y += LINE_HEIGHT;


            // *** Schicksalspunkte ***
            doc.setFontSize(11);
            doc.text(LEFT_X, y, 'Schicksalspunkte: ');
            doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
            y += LINE_HEIGHT;
            // content
            y += LINE_HEIGHT;


            // *** Stufenleiter ***
            doc.setFontSize(11);
            doc.text(LEFT_X, y, 'Stufenleiter: ');
            doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
            y += LINE_HEIGHT;

            var stufenleit = $scope.openrole.CONFIG.stufenleiter;
            var strows = Math.ceil(($scope.openrole.CONFIG.stufenleiterend - $scope.openrole.CONFIG.stufenleiterstart + 1) / 3);
            for (var st=$scope.openrole.CONFIG.stufenleiterstart, idx=0;
                     st <= $scope.openrole.CONFIG.stufenleiterend; st++, idx++) {
                if (stufenleit.hasOwnProperty(st)) {
                    var xOff = (Math.ceil( (idx+0.0000001) / strows) - 1) * 40 + 2;
                    var yOff = (idx % strows) * LINE_HEIGHT;
                    var numb = st>0?"+"+st:""+st;
                    var txtWidth = doc.myGetTextWidth(numb);
                    doc.text(LEFT_X + xOff - txtWidth + 3, y + yOff, numb);
                    doc.text(LEFT_X + xOff + 6, y + yOff, stufenleit[st]);
                }
            }
            y += LINE_HEIGHT * strows;

            y += LINE_HEIGHT;

            if ($location.$$host == 'localhost') {
                // for development: open in new window (not working in IE)
                doc.output('dataurlnewwindow');
            } else {
                // for production: download file
                doc.save("malmsturm.pdf");
            }
        };
    } // end controller
    ]);



