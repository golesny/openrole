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

app.constant("SERVICEURL",
  window.location.hostname == 'localhost' ? "http://localhost:8888/open_role_service" : "https://open-role.appspot.com/open_role_service"
);

// In some cases the token was reset. This works better ...
app.run(['$http','localStorageService', function($http, localStorageService) {
  var token = localStorageService.get("X-Openrole-Token");
  console.log("put token to $http "+token);
  $http.defaults.headers.common["X-Openrole-Token"] = token;
}]);
