"use strict";

// i18n for index.html
var app = angular.module('openrole');

app.config(function ($translateProvider) {
    $translateProvider.translations('en', {
          WELCOME: 'Welcome to Open Role ...',
          INTRODUCTION: 'Click on the system logo you like to create a character for'

    })

    $translateProvider.translations('de', {
          WELCOME: 'Willkommen bei Open Role',
          INTRODUCTION: 'Klicke auf das System Logo um einen Charakter zu erstellen'
    })
});
