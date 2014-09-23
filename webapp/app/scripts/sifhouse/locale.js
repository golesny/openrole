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
    SIFHOUSE: {
      HOUSE: 'Das Haus',
      HOUSENAME: 'Name des Hauses',
      REALM: 'Gebiet',
      CAMPAIGN: 'Kampagne',
      LIEGE: 'Lehnsheer',
      STATISTICS: 'Statistiken',
      DEFENSE: 'Verteidigung',
      INFLUENCE: 'Einfluss',
      LANDS: 'Ländereien',
      LAW: 'Gesetz',
      POPULATION: 'Bevölkerung',
      POWER: 'Macht',
      WEALTH: 'Reichtum',
      MOTTO: 'Motto',
      DESCRIPTIONS: 'Beschreibungen',

      PDFPREF: 'Pdf Einstellungen',
      CRESTELEMENT: 'SVG-Pfad',
      DEFAULT_EMPTY_CONFIG_BLOCK:'{\n\
  "docId": "",\n\
  "file_version": 1,\n\
  "pdftemplate": "templateSifHouse1",\n\
  "crest": {\n\
    "shape": { "name":"Form", \
               "svgType": "shapepath",\n\
               "strokecolor": "#000000",\n\
               "shape": 0,\n\
               "path": ""\n\
    },\n\
    "elements": [{"name":"Background",  "svgType":"rect",   "path":"M 0,0", "x":"0", "y":"0", "w":"180", "h":"250", "fill":"#CCCC00"},\n\
                 {"name":"path (lu)",   "svgType":"path",   "path":"M 0,0 90,0 90,100 0,100", "fill":"#00cc00"},\n\
                 {"name":"rect (rb)", "svgType":"rect",   "path":"M 0,0", "x":"90", "y":"100", "h":"150","w":"90", "fill":"#cc0000"},\
                 {"name":"circle",  "svgType":"circle", "path":"M 0,0", "x":"50", "y":"80","r":"20","fill":"#0000cc"}]\n\
  },\n\
  "stats": [{"name":"Verteidigung", "val":"2","text":""},\n\
              {"name":"Einfluß", "val":"2","text":""},\n\
              {"name":"Ländereien", "val":"2","text":""},\n\
              {"name":"Gesetz", "val":"2","text":""},\n\
              {"name":"Bevölkerung", "val":"2","text":""},\n\
              {"name":"Macht", "val":"2","text":""},\n\
              {"name":"Wohlstand", "val":"2","text":""}\
             ],\n\
  "textblocks": [{"name":"Verteidigungsanlagen","text":""},\n\
                 {"name":"Wohlstand","text":""},\n\
                 {"name":"Einfluß","text":""},\n\
                 {"name":"Diener & Ritter","text":""},\n\
                 {"name":"Ländereien","text":""},\n\
                 {"name":"Erbschaften","text":""},\n\
                 {"name":"Macht","text":""},\n\
                 {"name":"Geschichte","text":""}\n\
                ]\n\
}'
    }
  })
}]);
// DEFENSEHOLDING,"WEALTHHOLDING","INFLUENCEHOLDING","HOUSEHOLD","LANDHOLDING","HEIRS","POWERHOLDING","HISTORY"
