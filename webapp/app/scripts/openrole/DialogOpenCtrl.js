"use strict";

var DialogOpenCtrl = ['$scope', '$modalInstance', '$http', '$rootScope','characterlist','titleResKey','okActionRef',
  function ($scope, $modalInstance, $http, $rootScope, characterlist, titleResKey, okActionRef) {
    $scope.characterlist = characterlist;
    $scope.titleResKey = titleResKey;
    $scope.okAction = okActionRef;
    $scope.selected = {
        char: $scope.characterlist[0]
    };
    $scope.open = function () {
        console.log("open char "+$scope.selected.char.charactername);
        $modalInstance.close({'docId':$scope.selected.char.docId, 'action':$scope.okAction}); // parameter is the character json
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}];