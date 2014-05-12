"use strict";

angular.module('openrole')
    .factory('alertService', function($rootScope) {
        $rootScope.alerts = [];
        var add = function (type, msg) {
            console.log("[AlertService/"+type+"] "+msg);
            $rootScope.alerts.push({type: type, msg: msg});
        }
        return {
            danger: function(msg) {
                add('danger', msg);
            },
            success: function(msg) {
                add('success', msg);
            },
            addAlert: function(type, msg) {
                add(type, msg);
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