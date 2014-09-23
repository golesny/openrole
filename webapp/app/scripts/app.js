'use strict';

var app = angular.module('openrole',
    ['LocalStorageModule',
     'pascalprecht.translate',
      'ui.bootstrap',
      'ngTouch',
      'ui.ace',
      'ngRoute',
      'colorpicker.module'
    ]);

app.constant("SYSTEMS",
  [
    //{"id":"dungeonslayers", "name":"Dungeonslayers"},
    {"id":"malmsturm", "name":"Malmsturm", "customConf":"true"},
    {"id":"malmsturmgm", "name":"Malmsturm Gamemaster", "customConf":"false"},
    {"id":"sifhouse", "name":"Song of Ice and Fire - House Sheet", "customConf":"true"},
    {"id":"customconf", "name":"Konfigurations-Editor", "customConf":"false"}
  ]
);

app.constant("SERVICEURL",
  window.location.hostname == 'localhost' ? "http://localhost:8888/open_role_service" : "https://open-role.appspot.com/open_role_service"
);

// In some cases the token was reset. This works better ...
app.run(['$http','localStorageService', function($http, localStorageService) {
  var token = localStorageService.get("X-Openrole-Token");
  if (angular.isDefined(token) && token != null) {
      console.log("put token to $http "+token);
      $http.defaults.headers.common["X-Openrole-Token"] = token;
  } else {
      console.log("reset token at $http");
      delete $http.defaults.headers.common["X-Openrole-Token"];
  }
}]);
