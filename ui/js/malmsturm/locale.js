
// i18n for malmsturm.html
var app = angular.module('openrole');

app.config(function ($translateProvider) {
    $translateProvider.translations('en', {
        TITLE_CHARACTER: 'Character',
        CHARACTERNAME: 'Charactername'
    })

    $translateProvider.translations('de', {
        TITLE_CHARACTER: 'Spielerfigur',
        CHARACTERNAME: 'Charaktername'
    })
});
