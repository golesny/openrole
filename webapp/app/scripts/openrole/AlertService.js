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
      var ts = (new Date()).toLocaleTimeString();
      console.log("[AlertService/"+type+"] "+msg+", "+ts);
      // remove all success
      for (var i=0; i<$rootScope.alerts.length; i++) {
        if ($rootScope.alerts[i].type == "success") {
          $rootScope.alerts.splice(i, 1);
        }
      }
      // add new message
      $rootScope.alerts.push({type: type, msg: msg, ts: ts});
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
      },
      clearAll: function() {
        $rootScope.alerts = [];
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


