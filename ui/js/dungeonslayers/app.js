"use strict";

angular.module('dungeonslayers', [])
    .controller('DungeonslayersCtrl',['$scope','$http',  function($scope, $http) {
        $scope.openrole_module_version = '0.0.0.00000000';
        $scope.openrole_module_name = 'Dungeonslayers';
        // init base
        $http.get('http://localhost:8888/open_role_service/config').then(function(response) {
            $scope.GLOBALCONFIG = angular.fromJson(response.data);
        });
    }]);