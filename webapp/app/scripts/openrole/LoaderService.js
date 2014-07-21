"use strict";

angular.module('openrole')
  .factory('loaderService', ['$rootScope','$http','$translate','$location','alertService', function($rootScope, $http, $translate, $location, alertService) {
    $rootScope.loading = $translate.instant('LOADING'); // init loading text

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
        // TODO: deepcopy --> angular.copy doesnt seem to work
        var doc = tmplName(scope.openrole, scope.imageLoaded, $translate, alertService, {});
        if (!angular.isDefined(doc)) {
          alertService.danger("Template did not return the document.");
        } else {
          if ($location.$$host == 'localhost') {
            // for development: open in new window (not working in IE)
            doc.output('dataurlnewwindow');
          } else {
            // for production: download file
            doc.save("openrole.pdf");
          }
        }
      } catch (e) {
        alertService.danger(e);
      }
    };

    var internalImageLoader = function(imageRecords, imageLoaded, index, scope){
      //bind load event
      if( index >= imageRecords.length ){
        internalSetLoadingReady(false, $translate.instant('GENERATING_PDF'));
        createInternalPDF(scope);
        internalSetLoadingReady(true);
      } else {
        internalSetLoadingReady(false, $translate.instant('LOADING') + " "+(index+1)+"/"+imageRecords.length);
        //add image path
        $http.get(imageRecords[index])
          .success(function(data, status, headers, config){
            console.log("Loaded image "+index+" "+imageRecords[index]);
            // convert to dataurl, because jsPDF displays dataURLs nicer
            imageLoaded[index] = data; //"data:image/jpeg;base64," + Base64.encodeBinary(data);
            internalImageLoader(imageRecords, imageLoaded, index + 1, scope);
          })
          .error(function(data, status, headers, config){
            alertService.danger(status+": "+$translate.instant('ERROR_LOAD_IMG')+" "+data);
            internalSetLoadingReady(true);
          })
        ;
      }
    };

    return {
      loadImagesAndGeneratePDF: function(scope){
        internalImageLoader(scope.imageToLoad, scope.imageLoaded, scope.imageLoaded.length, scope);
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