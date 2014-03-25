"use strict";

angular.module('openrole', [])
    .controller('OpenroleCtrl',['$scope','$http','$location',  function($scope, $http, $location) {
        $scope.openrole_module_version = '0.0.1.20140325';
        $scope.openrole_module_name = '';
        // init
        var serviceHost = "http://open-role.appspot.com";
        if ($location.$$host == 'localhost') {
            // for dev
            serviceHost = "http://localhost:8888";
        }
        // init base
        $http.get(serviceHost + '/open_role_service/config').then(function(response) {
            $scope.GLOBALCONFIG = angular.fromJson(response.data);
        });
    }]);