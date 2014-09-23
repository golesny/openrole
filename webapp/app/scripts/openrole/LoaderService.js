"use strict";

angular.module('openrole')
  .factory('loaderService', ['$rootScope','$http','$translate','$location','alertService', function($rootScope, $http, $translate, $location, alertService) {
    $rootScope.loading = $translate.instant('LOADING'); // init loading text
    var cache = $rootScope.$new();
    cache.res = {};

    var internalSetLoadingReady = function(newState, msg) {
      $rootScope.loadingReady = (newState == true);
      if (typeof msg !== "undefined") {
        console.log(msg);
        $rootScope.loading = msg;
      }
    };


    var createInternalPDF = function(scope) {
      try {
        var tmplName = eval(scope.openrole.pdftemplate);
        // TODO: deepcopy --> angular.copy doesn't seem to work
        var doc = tmplName(scope.openrole, cache.res, $translate, alertService, {});
        if (!angular.isDefined(doc)) {
          alertService.danger("Template did not return the document.");
        } else {
          var stream = doc.pipe(blobStream());
          // for production: download file
          stream.on('finish', function() {
            if ($location.$$host == 'localhost') {
              // for development: open in new window (not working in IE)
              window.open(stream.toBlobURL('application/pdf'));
            } else {
              // FileSaver.js
              saveAs(stream.toBlob(), 'openrole.pdf');
            }
          });
          doc.end();
        }
      } catch (e) {
        alertService.danger(e);
      }


    };

    var internalResLoader = function(objRecords, index, cacheRes, scope){
      //bind load event
      if( index >= objRecords.length ) {
          internalSetLoadingReady(false, $translate.instant('GENERATING_PDF'));
          createInternalPDF(scope);
          internalSetLoadingReady(true);
      } else {
        internalSetLoadingReady(false, $translate.instant('LOADING') + " "+(index+1)+"/"+objRecords.length);
        if (cacheRes[objRecords[index]] !== undefined) {
            // url already loaded
            internalResLoader(objRecords, index + 1, cacheRes, scope);
        } else {
          // ttf must be loaded as array buffer
          var config = {};
          if (objRecords[index].endsWith("ttf") || objRecords[index].endsWith("otf")) {
                config = {"responseType": "arraybuffer"};
          }
          // load
          $http.get(objRecords[index], config)
            .success(function (data, status, headers, config) {
              console.log("Loaded image " + index + " " + objRecords[index]);
              cacheRes[objRecords[index]] = data;
              internalResLoader(objRecords, index + 1, cacheRes, scope);
            })
            .error(function (data, status, headers, config) {
              alertService.danger(status + ": " + $translate.instant('ERROR_LOAD_IMG') + " " + data);
              internalSetLoadingReady(true);
            })
          ; // end $http
        }
      }
    };



    return {
        loadResourcesAndGeneratePDF: function(scope){
            var tmplNameResources = eval(scope.openrole.pdftemplate + "_resources");
            var resToLoad = [];
            if (angular.isDefined(tmplNameResources)) {
                resToLoad = tmplNameResources();
            }
            for (var i=0; i<resToLoad.length; i++) {
               if (! (resToLoad[i] in cache.res)) {
                   cache.res[resToLoad[i]] = undefined;
               }
            }
            internalResLoader(resToLoad, 0, cache.res, scope);
      },
      setLoadingReady: function() {
        internalSetLoadingReady(true);
      },
      setLoadingStart: function(msg) {
        internalSetLoadingReady(false, msg);
      }

    };



  }])
;
