'use strict';

var app = angular.module('openrole',
    ['LocalStorageModule',
     'pascalprecht.translate',
      'ui.bootstrap',
      'ngTouch',
      'ui.ace'
    ]);

app.constant("SYSTEMS",
  [
    //{"id":"dungeonslayers", "name":"Dungeonslayers"},
    {"id":"malmsturm", "name":"Malmsturm", "customConf":"true"},
    {"id":"malmsturmgm", "name":"Malmsturm Gamemaster", "customConf":"false"},
    {"id":"customconf", "name":"Konfigurations-Editor", "customConf":"false"}
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
