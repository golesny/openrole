'use strict';

// i18n for index.html
var app = angular.module('openrole');

app.config(['$translateProvider',function ($translateProvider) {

  $translateProvider.registerAvailableLanguageKeys(["en","de"]);
  $translateProvider.fallbackLanguage("en");
  $translateProvider.determinePreferredLanguage();

  $translateProvider.translations('en', {
    SIFHOUSE: {
      HOUSE: 'The House',
      HOUSENAME: 'House Name',
      REALM: 'Realm',
      CAMPAIGN: 'Campaign',
      LIEGE: 'Liege',
      CREST: 'Crest',
      STATISTICS: 'Statistics',
      DEFENSE: 'Defense',
      INFLUENCE: 'Influence',
      LANDS: 'Lands',
      LAW: 'Law',
      POPULATION: 'Population',
      POWER: 'Power',
      WEALTH: 'Wealth',
      MOTTO: 'Motto',
      DESCRIPTIONS: 'Descriptions',

      PDFPREF: 'Pdf Preferences',
      CRESTELEMENT: 'SVG-Path',
      DEFAULT_EMPTY_CONFIG_BLOCK:'{\n\
  "docId": "",\n\
  "file_version": 1,\n\
  "pdftemplate": "templateSifHouse1",\n\
  "crest": {\n\
    "shape": { "name":"Form", \n\
               "svgType": "shapepath",\n\
               "strokecolor": "#000000",\n\
               "shape": 0,\n\
               "path": ""\n\
    },\n\
    "elements": [{"name":"Background",  "svgType":"rect",   "path":"M 0,0", "x":"0", "y":"0", "w":"180", "h":"250", "fill":"#CCCC00"},\n\
                 {"name":"path (lu)",   "svgType":"path",   "path":"M 0,0 90,0 90,100 0,100", "fill":"#00cc00"},\n\
                 {"name":"rect (rb)", "svgType":"rect",   "path":"M 0,0", "x":"90", "y":"100", "h":"150","w":"90", "fill":"#cc0000"},\n\
                 {"name":"circle",  "svgType":"circle", "path":"M 0,0", "x":"50", "y":"80","r":"20","fill":"#0000cc"}]\n\
  },\n\
  "stats": [{"name":"Defense", "val":"2","text":""},\n\
              {"name":"Influence", "val":"2","text":""},\n\
              {"name":"Lands", "val":"2","text":""},\n\
              {"name":"Law", "val":"2","text":""},\n\
              {"name":"Population", "val":"2","text":""},\n\
              {"name":"Power", "val":"2","text":""},\n\
              {"name":"Wealth", "val":"2","text":""}\
             ],\n\
  "textblocks": [{"name":"Defense Holdings","text":""},\n\
                 {"name":"Wealth Holdings","text":""},\n\
                 {"name":"Influence Holdings","text":""},\n\
                 {"name":"Retainers, Servants and Household Knights","text":""},\n\
                 {"name":"Land Holdings","text":""},\n\
                 {"name":"Heirs","text":""},\n\
                 {"name":"Power Holdings","text":""},\n\
                 {"name":"History","text":""}\n\
                ]\n\
}'
    }
  });
  $translateProvider.translations('de', {
    SIFHOUSE: {
      HOUSE: 'Das Haus',
      HOUSENAME: 'Name des Hauses',
      REALM: 'Gebiet',
      CAMPAIGN: 'Kampagne',
      LIEGE: 'Lehnsheer',
      CREST: 'Wappen',
      STATISTICS: 'Statistiken',
      DEFENSE: 'Verteidigung',
      INFLUENCE: 'Einfluss',
      LANDS: 'Land',
      LAW: 'Recht',
      POPULATION: 'Bevölkerung',
      POWER: 'Macht',
      WEALTH: 'Vermögen',
      MOTTO: 'Motto',
      DESCRIPTIONS: 'Beschreibungen',

      PDFPREF: 'Pdf Einstellungen',
      CRESTELEMENT: 'SVG-Pfad',
      DEFAULT_EMPTY_CONFIG_BLOCK:'{\n\
  "docId": "",\n\
  "file_version": 1,\n\
  "pdftemplate": "templateSifHouse1",\n\
  "crest": {\n\
    "shape": { "name":"Form", \n\
               "svgType": "shapepath",\n\
               "strokecolor": "#000000",\n\
               "shape": 0,\n\
               "path": ""\n\
    },\n\
    "elements": [{"name":"Background",  "svgType":"rect",   "path":"M 0,0", "x":"0", "y":"0", "w":"180", "h":"250", "fill":"#CCCC00"},\n\
                 {"name":"Pfad (lu)",   "svgType":"path",   "path":"M 0,0 90,0 90,100 0,100", "fill":"#00cc00"},\n\
                 {"name":"Rechteck (rb)", "svgType":"rect",   "path":"M 0,0", "x":"90", "y":"100", "h":"150","w":"90", "fill":"#cc0000"},\n\
                 {"name":"Kreis",  "svgType":"circle", "path":"M 0,0", "x":"50", "y":"80","r":"20","fill":"#0000cc"}]\n\
  },\n\
  "stats": [{"name":"Verteidigung", "val":"2","text":""},\n\
              {"name":"Einfluß", "val":"2","text":""},\n\
              {"name":"Land", "val":"2","text":""},\n\
              {"name":"Recht", "val":"2","text":""},\n\
              {"name":"Bevölkerung", "val":"2","text":""},\n\
              {"name":"Macht", "val":"2","text":""},\n\
              {"name":"Vermögen", "val":"2","text":""}\
             ],\n\
  "textblocks": [{"name":"Verteidigungsbesitztümer","text":""},\n\
                 {"name":"Vermögensbesitztümer","text":""},\n\
                 {"name":"Einflußbesitztümer","text":""},\n\
                 {"name":"Bevölkerungsbesitztümer","text":""},\n\
                 {"name":"Landesbesitztümer","text":""},\n\
                 {"name":"Rechtsbesitztümer","text":""},\n\
                 {"name":"Machtbesitztümer","text":""},\n\
                 {"name":"Geschichte","text":""}\n\
                ]\n\
}'
    }
  });

}]);
// DEFENSEHOLDING,"WEALTHHOLDING","INFLUENCEHOLDING","HOUSEHOLD","LANDHOLDING","HEIRS","POWERHOLDING","HISTORY"
