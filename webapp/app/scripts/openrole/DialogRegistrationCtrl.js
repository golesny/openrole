"use strict";

// http://angular-ui.github.io/bootstrap/#/modal
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var DialogRegistrationCtrl = ['$scope', '$modalInstance', '$http', '$rootScope', '$translate','SERVICEURL',
  function ($scope, $modalInstance, $http, $rootScope,$translate, SERVICEURL) {

    $scope.register = function () {
        console.log("validate register user data");
        if (this.email == null || this.email == '') {
            $scope.registerError = 'Bitte E-Mail eingegeben';
            return;
        }
        if (this.pw == null || this.pw == '') {
            $scope.registerError = 'Bitte Passwort eingegeben';
            return;
        }
        if (this.pw != this.pwrepeat) {
            $scope.registerError = 'Passwörter müssen identisch sein';
            return;
        }
        console.log("validation passed email="+this.email);
        $scope.registerError = null;
        $http.post(SERVICEURL + '/register?email='+window.escape(this.email)+'&nick='+window.escape(this.nick), this.pw)
            .success(function(data, status, headers, config) {
                console.log("Registered user: ["+status+"] "+data);
                if (status == 201) {
                    $modalInstance.close(data);
                    $scope.registerError = null;
                } else {
                    $scope.registerError = $translate.instant(data);
                }
            })
            .error(function(data, status, headers, config) {
                console.log("Could not register user: "+data);
                $scope.registerError = $translate.instant(data);
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        $scope.registerError = null;
    };

    $scope.errorExists = function() {
        return $scope.registerError != null;
    };
}];