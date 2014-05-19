'use strict';

var app = angular.module('webappApp');
app.controller('MainCtrl', ['$scope', function ($scope) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
}]);
