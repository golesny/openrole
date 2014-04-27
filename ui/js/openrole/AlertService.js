"use strict";

angular.module('openrole')
    .factory('alertService', function($rootScope) {
        $rootScope.alerts = [];
        return {
            addAlert: function(type, msg) {
                console.log("[AlertService] " + type+ ": "+msg);
                $rootScope.alerts.push({type: type, msg: msg});
            },
            closeAlert: function(index) {
                $rootScope.alerts.splice(index, 1);
            }
        };
    })
    .controller('DialogAlertCtrl', function($scope, alertService) {
        $scope.closeAlert = function(index) {
            alertService.closeAlert(index);
        }
    }
    )
;