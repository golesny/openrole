"use strict";

angular.module('openrole')
    .controller('OpenroleCtrl',['$scope','$rootScope','$http','$location', function($scope, $rootScope, $http, $location) {
        $scope.openrole_module_version = '0.0.1.20140325';
        $scope.openrole_module_name = '';
    }]);