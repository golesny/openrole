'use strict';

// i18n for index.html
var app = angular.module('openrole');

app.config(['$translateProvider',function ($translateProvider) {
  $translateProvider.registerAvailableLanguageKeys(["en","de"]);
  $translateProvider.fallbackLanguage("en");
  $translateProvider.determinePreferredLanguage();

  $translateProvider.translations('en', {
    CUSTOMCONF: {
      NAME: 'Configuration Name',
      SYSTEM: 'System Name',
      EDITCONFIG: 'Configuration',
      BTN_RESET_DEFAULT: 'Load Default Configuration'
    }
  })

  $translateProvider.translations('de', {
    CUSTOMCONF: {
      NAME: 'Konfigurationsname',
      SYSTEM: 'Systemname',
      EDITCONFIG: 'Konfiguration',
      BTN_RESET_DEFAULT: 'Default Konfiguration laden'
    }
  });

}]);
