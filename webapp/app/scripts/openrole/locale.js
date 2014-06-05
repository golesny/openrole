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
    CANCEL: 'Cancel',
    MENU: {
      LOGOUT: 'Log out',
      PREFERENCES: 'Preferences'
    },
    COMING: 'Perhaps coming ...',
    MSG: {
      SERVER_NOT_AVAILABLE: 'Server not available to load the configuration.',
      LOGGED_IN: 'You are logged in, now.',
      INTERNAL_SERVER_ERROR: 'Server error occurred.',
      COULD_NOT_STORE_CHAR: 'Could not store character'
    },
    BUTTON: {
      ADD: 'Add {{name}}'
    }
  });

  $translateProvider.translations('de', {
    WELCOME: 'Willkommen bei Open Role',
    INTRODUCTION: 'Klicke auf das System Logo um einen Charakter zu erstellen',
    LOADING: 'Lade',
    GENERATING_PDF : 'Generiere PDF',
    ERROR_LOAD_IMG : 'Konnte Bilder nicht laden. Grund:',
    OPEN_CHARACTER_TITLE: 'Öffne einen Charakter',
    OPEN: 'Öffnen',
    CANCEL: 'Abbrechen',
    MENU: {
      LOGOUT: 'Abmelden',
      PREFERENCES: 'Einstellungen'
    },
    COMING: 'Kommt vielleicht mal ...',
    MSG: {
      SERVER_NOT_AVAILABLE: 'Der Server ist nicht verfügbar, um die Konfiguration zu laden.',
      LOGGED_IN: 'Du bist eingeloggt.',
      INTERNAL_SERVER_ERROR: 'Ein Serverfehler ist aufgetreten.',
      COULD_NOT_STORE_CHAR: 'Der Charakter konnte nicht gespeichert werden.'
    },
    BUTTON: {
      ADD: '{{name}} hinzufügen'
    }
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