'use strict';

// i18n for index.html
var app = angular.module('openrole');

app.config(['$translateProvider',function ($translateProvider) {
  $translateProvider.registerAvailableLanguageKeys(["de"]);
  $translateProvider.use("de");

  $translateProvider.translations('de', {
    MALMSTURMGM: {
      GROUP: 'Gruppe',
      CHARACTER: 'Charakter',
      CHARACTERSELECTION: 'Wähle die Charakter aus',
      PDFPREF: 'PDF Einstellungen',
      PRINTASPEKTTEXT: 'Text der Aspekte mit ausgeben',
      DEFAULT_EMPTY_CONFIG_BLOCK:
'{\n\
  "docId": "",\n\
  "file_version": 1,\n\
  "characters": [],\n\
  "pdftemplate": "templateMalmsturmGM1"\n\
}'
    }
  })
}]);
