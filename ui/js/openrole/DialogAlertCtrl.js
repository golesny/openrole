"use strict";

function DialogAlertCtrl($rootScope, $scope) {
    $scope.alerts = [
        //{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        // { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    /**
     *
     * @param type danger or success
     * @param msg any text
     */
    $rootScope.addAlert = function(type, msg) {
        console.log(type+ ": "+msg);
        $scope.alerts.push({type: type, msg: msg});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

}