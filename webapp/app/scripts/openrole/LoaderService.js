"use strict";

angular.module('openrole')
  .factory('loaderService', ['$rootScope','$http','$translate','alertService', function($rootScope, $http, $translate, alertService) {
    $rootScope.loading = $translate.instant('LOADING'); // init loading text

    var internalSetLoadingReady = function(newState, msg) {
      $rootScope.loadingReady = (newState == true);
      if (typeof msg !== "undefined") {
        console.log(msg);
        $rootScope.loading = msg;
      }
    };

    var internalImageLoader = function(imageRecords, imageLoaded, index, callbackFunctionAfterLoad){
      //bind load event
      if( index >= imageRecords.length ){
        internalSetLoadingReady(false, $translate.instant('GENERATING_PDF'));
        callbackFunctionAfterLoad();
        internalSetLoadingReady(true);
      } else {
        internalSetLoadingReady(false, $translate.instant('LOADING') + " "+(index+1)+"/"+imageRecords.length);
        //add image path
        $http.get(imageRecords[index])
          .success(function(data, status, headers, config){
            console.log("Loaded image "+index+" "+imageRecords[index]);
            // convert to dataurl, because jsPDF displays dataURLs nicer
            imageLoaded[index] = data; //"data:image/jpeg;base64," + Base64.encodeBinary(data);
            internalImageLoader(imageRecords, imageLoaded, index + 1, callbackFunctionAfterLoad);
          })
          .error(function(data, status, headers, config){
            alertService.danger(status+": "+$translate.instant('ERROR_LOAD_IMG')+" "+data);
            internalSetLoadingReady(true);
          })
        ;
      }
    };

    return {
      loadImages: function(imageRecords, imageLoaded, callbackFunctionAfterLoad){
        internalImageLoader(imageRecords, imageLoaded, imageLoaded.length, callbackFunctionAfterLoad);
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