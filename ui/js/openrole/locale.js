"use strict";

// i18n for index.html
var app = angular.module('openrole');

app.config(function ($translateProvider) {
    $translateProvider.translations('en', {
        WELCOME: 'Welcome to Open Role ...',
        INTRODUCTION: 'Click on the system logo you like to create a character for',
        LOADING: 'Loading',
        GENERATING_PDF : 'Generating PDF',
        ERROR_LOAD_IMG : 'Could not load images. Cause:',
        OPEN_CHARACTER_TITLE: 'Open a character',
        OPEN: 'Open',
        CANCEL: 'Cancel'
    })

    $translateProvider.translations('de', {
        WELCOME: 'Willkommen bei Open Role',
        INTRODUCTION: 'Klicke auf das System Logo um einen Charakter zu erstellen',
        LOADING: 'Lade',
        GENERATING_PDF : 'Generiere PDF',
        ERROR_LOAD_IMG : 'Konnte Bilder nicht laden. Grund:',
        OPEN_CHARACTER_TITLE: 'Öffne einen Charakter',
        OPEN: 'Öffnen',
        CANCEL: 'Abbrechen'
    })
});

// locale controller
app.controller('LocaleCtrl', function ($scope, $translate, localStorageService) {

    $scope.changeLanguage = function (key) {
        console.log("changing language to "+key+ " preferred ="+$translate.preferredLanguage() + " current stored="+localStorageService.get("lang"));
        $translate.use(key);
        if (key == $translate.preferredLanguage()) {
            // remove entry
            console.log("removing local storage value");
            localStorageService.remove("lang");
        } else {
            // store
            localStorageService.add("lang", key);
        }
    };
    // init the stored language
    if (localStorageService.get("lang") != null) {
        console.log("using stored language="+localStorageService.get("lang"));
        $scope.changeLanguage(localStorageService.get("lang"));
    }
});