"use strict";

var DialogOpenCtrl = function ($scope, $modalInstance, $http, $rootScope, characterlist) {
    $scope.characterlist = characterlist;
    $scope.selected = {
        char: $scope.characterlist[0]
    };
    $scope.openCharacter = function () {
        console.log("open char "+$scope.selected.char.charactername);
        $modalInstance.close($scope.selected.char.docId); // parameter is the character json
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};