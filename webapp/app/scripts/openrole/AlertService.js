"use strict";

angular.module('openrole')
  .factory('alertService', ['$rootScope','$translate', function($rootScope, $translate) {
    $rootScope.alerts = [];
    var add = function () {
      var args = Array.prototype.slice.call(arguments[0]);
      var type = args[0];
      var msg = "";
      for (var i = 1; i < args.length; i++) {
        if (args[i] instanceof Error) {
          var splits = args[i].stack.split("\n");
          for (var j=0; j < 4 && j < splits.length; j++) {
            msg += splits[j]+" ";
          }
        } else {
          msg += $translate.instant(""+args[i]) + " ";
        }
      }
      console.log("[AlertService/"+type+"] "+msg);
      $rootScope.alerts.push({type: type, msg: msg});
    };
    return {
      danger: function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('danger');
        add(args);
      },
      success: function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('success');
        add(args);
      },
      closeAlert: function(index) {
        $rootScope.alerts.splice(index, 1);
      }
    };
  }])
  .controller('DialogAlertCtrl', ['$scope', 'alertService', function($scope, alertService) {
    $scope.closeAlert = function(index) {
      alertService.closeAlert(index);
    }
  }]
)
;


