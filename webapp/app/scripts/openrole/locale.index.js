"use strict";

// i18n for index.html
var app = angular.module('openrole');

app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.registerAvailableLanguageKeys(["en", "de"]);
  $translateProvider.fallbackLanguage("en");
  $translateProvider.determinePreferredLanguage();
}]);
