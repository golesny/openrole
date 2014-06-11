'use strict';

describe('OpenRoleCtrl', function () {

  // load the controller's module
  beforeEach(module('openrole'));

  var OpenroleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OpenroleCtrl = $controller('OpenroleCtrl', {
      $scope: scope
    });
  }));

  it('should be the module name Overview', function () {
    expect(scope.openrole_module_name).toBe("Overview");
  });
});
