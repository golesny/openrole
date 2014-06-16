'use strict';

// i18n for index.html
var app = angular.module('openrole');

app.config(['$translateProvider',function ($translateProvider) {
  //$translateProvider.translations('en', {
  // MALMSTURM: {
  //   TITLE_CHARACTER: 'Character',
  //   CHARACTERNAME: 'Charactername',
  // }
  //});

  $translateProvider.translations('de', {
    MALMSTURMGM: {
      PDFPREF: 'PDF Einstellungen'
    }
  })
}]);
