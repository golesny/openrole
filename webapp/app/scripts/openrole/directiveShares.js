

var app = angular.module('openrole');
/**
 * The compoentent to share your character.
 *
 * Example:
 * <div or-shares></div>
 *
 * or-shares the directive name
 */
app.directive("orShares", ['$translate', function($translate) {

  return {
    compile: function(element, attrs)
    {
      var type = attrs.type || 'text';

      var htmlText = "<div class='panel panel-default'>\n"+
        "<div class='panel-heading'><h3 class='panel-title'>" + $translate.instant('LABEL.SHARES') + "</h3></div>\n"+
        "<ul class='list-group'>\n"+
        "<li class='list-group-item' ng-repeat='nck in openrole.shares track by $index'>\n"+
        "<div class='input-group'>\n"+
        "<div class='input-group-btn'>\n"+
        "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'><span class='caret'></span></button>\n"+
        "<ul class='dropdown-menu'>\n"+
        "<li><a href='#' ng-click='deleteShare(openrole.shares, $index)'><span class='glyphicon glyphicon-remove-sign'></span> Löschen</a></li>\n";

      htmlText +=  "</ul></div>\n"+
        "<input type='text' class='form-control' placeholder='" + $translate.instant('LABEL.NICK') +"' ng-model='openrole.shares[$index]'>\n"+
        "</div><!-- /input-group -->\n";

      htmlText +=  "</li>\n"+
        "<li class='list-group-item' >\n"+
        "<button type='button' class='btn btn-default btn-xs' ng-click='newShare(openrole.shares)'><span class='glyphicon glyphicon-plus-sign'></span> " +
        $translate.instant('BUTTON.ADD', {'name':$translate.instant('LABEL.NICK')}) +
        "</button>\n"+
        "</li></ul></div>";

      element.replaceWith(htmlText);
    }
  }
}]);