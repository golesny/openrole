'use strict';

var app = angular.module('openrole',
    ['LocalStorageModule',
     'pascalprecht.translate',
      'ui.bootstrap',
      'ngTouch',
      'ngDragDrop'
    ]);

app.constant("SYSTEMS",
  [
    //{"id":"dungeonslayers", "name":"Dungeonslayers"},
    {"id":"malmsturm", "name":"Malmsturm"},
    {"id":"malmsturmgm", "name":"Malmsturm Gamemaster"}
  ]
);