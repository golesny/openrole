'use strict';

describe('MalmsturmCtrl > hideMoveButton', function () {

  // load the controller's module
  beforeEach(module('openrole'));

  var MalmsturmCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MalmsturmCtrl = $controller('MalmsturmCtrl', {
      $scope: scope
    });
  }));

  it('should return true on equal index', function () {
    expect(scope.hideMoveButton(undefined, 0, 0)).toBe(true);
    expect(scope.hideMoveButton(undefined, -1, -1)).toBe(true);
    expect(scope.hideMoveButton(new Array("a"), 1, 1)).toBe(true);
    expect(scope.hideMoveButton(undefined, 50, 50)).toBe(true);
    expect(scope.hideMoveButton(new Array(), 0, 0)).toBe(true);
  });

  it('should return false if dest is last list', function() {
    scope.openrole.skillpyramid = ['A', 'B', 'C'];
    expect(scope.hideMoveButton(new Array("a"), 0, 2)).toBe(false);
    scope.openrole.skillpyramid.push("D");
    expect(scope.hideMoveButton(new Array("a"), 0, 3)).toBe(false);
  });

  it('should return false for free lists and vv', function() {
    scope.openrole.skillpyramid = [[sk('_')],[sk('A'), sk('_')],[sk('A'),sk('B')],[sk('X'),sk('Y')]];

    expect(scope.hideMoveButton(scope.openrole.skillpyramid[0], 1, 0)).toBe(false);
    expect(scope.hideMoveButton(scope.openrole.skillpyramid[1], 0, 1)).toBe(false);
    expect(scope.hideMoveButton(scope.openrole.skillpyramid[2], 0, 2)).toBe(true);
  });

  var sk = function(title) {
    return {"title":title};
  }
});
