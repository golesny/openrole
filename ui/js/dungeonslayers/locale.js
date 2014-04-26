"use strict";

// i18n for dungeonslayers.html
var app = angular.module('openrole');

app.config(function ($translateProvider) {
    $translateProvider.translations('en', {
        COMING: 'Perhaps coming ...'
    })

    $translateProvider.translations('de', {
        COMING: 'Kommt vielleicht mal ...'
    })
});
