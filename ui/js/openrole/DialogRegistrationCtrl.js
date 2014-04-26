
// http://angular-ui.github.io/bootstrap/#/modal
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var DialogRegistrationCtrl = function ($scope, $modalInstance, $http, $rootScope) {

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
        $http.post($rootScope.serviceHost + '/register?email='+this.email, this.pw)
            .success(function(data, status, headers, config) {
                console.log("Registered user: ["+status+"] "+data);
                if (status == 201) {
                    $modalInstance.close(data);
                    $scope.registerError = null;
                } else {
                    $scope.registerError = data;
                }
            })
            .error(function(data, status, headers, config) {
                console.log("Could not register user: "+data);
                $scope.registerError = data;
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        $scope.registerError = null;
    };

    $scope.errorExists = function() {
        return $scope.registerError != null;
    };
};