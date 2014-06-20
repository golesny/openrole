
angular.module('openrole').directive('orDropdownSharedChar', function ($compile) {
  return {
    restrict: 'E',
    scope: {
      items: '=dropdownData',
      doSelect: '&selectVal',
      selectedItem: '=preselectedItem',
      model: '&selectModel'
    },
    link: function (scope, element, attrs) {
      var html = '<div class="btn-group"><button class="btn button-label btn-default">&nbsp;</button><button class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>';
      html += '<ul class="dropdown-menu"><li ng-repeat="item in items"><a tabindex="-1" data-ng-click="selectVal(item)">{{item.charactername}} ({{item.nick}})</a></li></ul></div>';
      element.append($compile(html)(scope));
      for (var i = 0; i < scope.items.length; i++) {
        if (scope.items[i].docId === scope.selectedItem.docId) {
          scope.bSelectedItem = scope.items[i];
          break;
        }
      }
      scope.selectVal = function (item) {
        scope.doSelect({
          selectedVal: {
            "docId":item.docId,
            "charactername":item.charactername,
            "nick":item.nick
          }
        });
      };
      if (angular.isDefined( scope.bSelectedItem) ) {
        scope.selectVal(scope.bSelectedItem);
      }

      // update the text after every model change (e.g. loading the character)
      scope.$watch(scope.model, function(item) {
        if (angular.isDefined(item)) {
          var txt = item.charactername;
          if (item.nick != "") {
            txt += " (" + item.nick + ")";
          }
          if (txt == "") {
            txt = "&nbsp;";
          }
          $('button.button-label', element).html(txt);
        }
      });
    }
  };
});