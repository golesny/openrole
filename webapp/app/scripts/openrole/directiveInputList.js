

var app = angular.module('openrole');
/**
 * Example:
 * <div openrole-input-list title="MALMSTURM.ASPECTS" placeholder="Aspekt" content="openrole.aspects" show-description-area="MALMSTURM.EVENTS"></div>
 *
 * openrole-input-list the directive name
 * title may be a resource key or just a label
 * placeholder may be a resource key or just a label
 * content is the ng-model list that contains the list objects that must have a name property
 * show-description-area is optional, if set, than the list object must have a description property, the cont
 */
app.directive("orInputList", ['$translate', function($translate) {

  return {
    compile: function(element, attrs)
    {
      var type = attrs.type || 'text';
      var showMoveButtons = true;
      if (attrs.hasOwnProperty('showMoveButtons') && attrs['showMoveButtons'] == "false") {
        showMoveButtons = false;
      }

      var htmlText = "<div class='panel panel-default'>\n"+
        "<div class='panel-heading'><h3 class='panel-title'>" + $translate.instant(attrs.title) + "</h3></div>\n"+
        "<ul class='list-group'>\n"+
        "<li class='list-group-item' ng-repeat='listItem in "+attrs.content+"'>\n"+
        "<div class='input-group'>\n"+
        "<div class='input-group-btn'>\n"+
        "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'><span class='caret'></span></button>\n"+
        "<ul class='dropdown-menu'>\n"+
        "<li><a href='#' ng-click='delete("+attrs.content+", $index)'><span class='glyphicon glyphicon-remove-sign'></span> Löschen</a></li>\n";

      if (showMoveButtons) {
        htmlText += "<li ng-hide='$first && $last' class='divider'></li>\n"+
                    "<li ng-show='!$first'><a href='#' ng-click='moveUp(" + attrs.content + ", $index, $first)'><span class='glyphicon glyphicon-chevron-up'></span> Hoch</a></li>\n" +
                    "<li ng-show='!$last'><a href='#' ng-click='moveDown(" + attrs.content + ", $index, $last)'><span class='glyphicon glyphicon-chevron-down'></span> Runter</a></li>\n";
      }
      htmlText +=  "</ul></div>\n"+
        "<input type='text' class='form-control' placeholder='" + $translate.instant(attrs.placeholder) +"' ng-model='listItem.name'>\n"+
        "</div><!-- /input-group -->\n";

      if (attrs.hasOwnProperty('showDescriptionArea')) {
        htmlText += "<textarea class='form-control' placeholder='" + $translate.instant(attrs['showDescriptionArea']) +"' ng-model='listItem.description'></textarea>";
      }
      htmlText +=  "</li>\n"+
        "<li class='list-group-item' >\n"+
        "<button type='button' class='btn btn-default btn-xs' ng-click='new("+attrs.content+")'><span class='glyphicon glyphicon-plus-sign'></span> " +
        $translate.instant('BUTTON.ADD', {'name':$translate.instant(attrs.placeholder)}) +
        "</button>\n"+
        "</li></ul></div>";

      element.replaceWith(htmlText);
    }
  }
}]);