
angular.module('openrole').directive('orDropdown', function ($compile) {
  return {
    restrict: 'E',
    scope: {
      items: '=dropdownData',
      selectedItem: '=ngModel'
    },
    link: function (scope, element, attrs) {
      var html = '';
      html += '<div class="btn-group"><input ng-model="selectedItem" ng-readonly="true" class="btn btn-default">';
        html += '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>';
      html += '<ul class="dropdown-menu"><li ng-repeat="item in items"><a tabindex="-1" data-ng-click="selectVal(item)" style="cursor:pointer">{{item.name}}</a></li></ul>';
      html += '</div>';
      element.append($compile(html)(scope));
      scope.bSelectedItem = scope.items[0];
      for (var i = 0; i < scope.items.length; i++) {
        if (angular.isDefined(scope.selectedItem) && scope.items[i].id === scope.selectedItem) {
          scope.bSelectedItem = scope.items[i];
          break;
        }
      }
      scope.selectVal = function (item) {
        scope.selectedItem = item.id;
      };
      scope.selectVal(scope.bSelectedItem);
    }
  };
});