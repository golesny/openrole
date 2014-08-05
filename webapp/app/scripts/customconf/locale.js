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
    CUSTOMCONF: {
      NAME: 'Konfigurationsname',
      SYSTEM: 'Systemname',
      EDITCONFIG: 'Konfiguration',
      BTN_RESET_DEFAULT: 'Default Konfiguration laden'
    }
  })
}]);
