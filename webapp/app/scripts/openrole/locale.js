"use strict";

// i18n for index.html
var app = angular.module('openrole');

app.config(['$translateProvider', function ($translateProvider) {
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
    },
    HELP: {
      DEVURL: {
        TITLE: 'This help is only for Chrome browser',
        STEP1: 'Download the folder chrome-extension from <a href="https://github.com/golesny/openrole/tree/master/examples">GitHub</a> and put it somewhere on your local disk',
        STEP2: 'Load the extension by going to <span style="font-family: monospace">chrome://extensions</span>,'+
          'enabling Developer Mode, and selecting the new folder with Load unpacked extension....'+
          '<br>You will get an ID from Chrome (Example: <span style="font-family: monospace">meeofidccceehflmmmllgbafgpnnkaha</span>)',
        STEP3: 'Enter here the Developer Extension URL (replace the ID with yours) <span style="font-family: monospace">chrome-extension://meeofidccceehflmmmllgbafgpnnkaha/pdf.dev.js</span>',
        STEP4: 'Go to the roleplaying system you have extended and select your template',
        STEP5: 'After modifying the js file you have to reload the page to make your changes active',
        STEP6: 'After you have finished the template contact me so that everyone can use your template'
      }
    }
  });

  $translateProvider.translations('de', {
    WELCOME: 'Willkommen bei openrole.net',
    INTRODUCTION: 'Klicke auf das System Logo um einen Charakter zu erstellen',
    LOADING: 'Lade',
    GENERATING_PDF : 'Generiere PDF',
    ERROR_LOAD_IMG : 'Konnte Bilder nicht laden. Grund:',
    OPEN_CHARACTER_TITLE: 'Öffne einen Charakter',
    OPEN_WITH_CUSTOM_CONF_TITLE: 'Konfiguration auswählen',
    PDFTEMPLATE:'PDF-Template',
    MENU: {
      LOGOUT: 'Abmelden',
      PREFERENCES: 'Einstellungen',
      CONTACT: 'Kontakt/Impressum',
      CHANGELOG: 'Changelog',
      PWRESET: 'Passwort vergessen'
    },
    COMING: 'Kommt vielleicht mal ...',
    MSG: {
      SERVER_NOT_AVAILABLE: 'Der Server ist nicht verfügbar, um die Konfiguration zu laden.',
      LOGGED_IN: 'Du bist eingeloggt.',
      INTERNAL_SERVER_ERROR: 'Ein Serverfehler ist aufgetreten.',
      COULD_NOT_STORE_CHAR: 'Der Charakter konnte nicht gespeichert werden.',
      ILLEGAL_ACTION: 'Illegale Operation',
      SERVICE_ACTION_INVALID: 'Illegale Server-Aktion',
      USER_PW_WRONG: 'Falscher User oder falsches Passwort',
      USER_ALREADY_EXISTS: 'Der Username existiert schon. Bitte wähle einen anderen Namen',
      NICK_ALREADY_EXISTS: 'Der Nickname existiert schon. Bitte wähle einen anderen Namen',
      ID_NOT_FOUND: 'Der Charakter wurde für einen anderen Account angelegt und daher für diesen Account nicht abgespeichert werden. Erstelle einen neuen Charakter',
      COULD_NOT_LOAD_SHARED: 'Konnte die Liste der freigegebenen Charaktere nicht laden.',
      NOT_LOGGED_IN: 'Du bist nicht eingeloggt. Wenn du dich gerade erst angemeldet/registriert hast, dann warte einen kurzen Moment, ansonsten melde dich neu an.',
      PDF_LAYOUT_TOO_MUCH_CONTENT: 'Bitte benutze ein anderes Template oder veringere die Menge des Inhalts.',
      EMAIL_NOT_EXISTS: 'Die E-Mail existiert nicht im System',
      WRONG_PWRESET_CODE: 'Der Code zum Passwort zurücksetzen ist falsch.',
      PWRESETSEND: 'Code wurde versendet. Bitte den Code in der in das Formular eingeben, um neues Passwort zu bekommen.',
      PWRESETSUCCESSFUL: 'Neues Passwort versendet',
      WRONG_EMAILFORMAT: 'Die E-Mail Adresse konnte nicht konvertiert werden',
      MAIL_COULDNOT_SEND: 'Mail konnte nicht versendet werden (Interner Fehler)'
    },
    LABEL: {
      NICK: 'Nickname',
      NICK_NOTE: ' (freiwillig, nur für die Charakter-Freigabe-Funktion)',
      EMAIL: 'E-Mail',
      PW1: 'Passwort',
      PW2: 'Passwort (wiederholen)',
      DATAPROTECTION: 'Die E-Mail und das Passwort werden unumkehrbar verschlüsselt (SHA1 Hash) abgespeichert und können daher nicht wiederhergestellt werden. Nur zum Login und für die Passwort vergessen Funktion wird die E-Mail übertragen.\n'+
        'Die E-Mail wird nie geprüft, nicht weitergegeben und wird in keinster Weise weiterverwendet außer für die Passwort vergessen Funktion.\n'+
        'Möchtest du auf die Passwort vergessen Funktion verzichten, kannst du einen beliebigen Usernamen benutzen, das hat zur Folge, dass bei einem Verlust des Passworts der Zugang nur mit einer freiwilligen Spende und einer E-Mail über das Support-System wiederhergestellt werden.',
      SHARES: 'Lese-Freigaben für folgende Benutzer (Nick)',
      CODE: 'Code'
    },
    BUTTON: {
      OPEN: 'Öffnen',
      ADD: '{{name}} hinzufügen',
      SAVE: 'Speichern',
      CANCEL: 'Abbrechen',
      LOGIN: 'Anmelden',
      SENDPWRESETCODE: 'Passwort zurücksetzen anfordern',
      SENDNEWPW: 'Neues Passwort zusenden'
    },
    PREF: {
      DEVURL: 'Entwickler Extension URL'
    },
    HELP: {
      DEVURL: {
        TITLE: 'Diese Anleitung ist für den Browser Chrome',
        STEP1: 'Lade den Ordner chrome-extension von <a href="https://github.com/golesny/openrole/tree/master/examples">GitHub</a> und speichere ihn auf deiner lokalen Platte',
        STEP2: 'Lade diese Extension indem <span style="font-family: monospace">chrome://extensions</span> aufrufst,'+
        'den Entwickler Modus aktivierst und diesen Ordner in Entpackte Erweiterung laden auswählst'+
          '<br>Dann bekommst du ein ID von Chrome (Beispiel: <span style="font-family: monospace">meeofidccceehflmmmllgbafgpnnkaha</span>)',
        STEP3: 'Gib die Entwickler Erweiterungs URL hier ein (ersetze die ID durch deine eigene) <span style="font-family: monospace">chrome-extension://meeofidccceehflmmmllgbafgpnnkaha/pdf.dev.js</span>',
        STEP4: 'Gehe zu dem System, dass du erweitert hast, und lade das Template',
        STEP5: 'Nachdem du Änderungen an dem js gemacht hast, lade die Seite neu',
        STEP6: 'Wenn du fertig bist melde dich bei mir und schicke mir das Template, dann können es alle benutzen'
      },
      PWRESETDESCRIPTION: 'Es wird ein Code an die E-Mail Adresse geschickt. Mit dem Code bekommst ein neues Passwort zugesendet.',
      PWRESETDESCRIPTION2: 'Es wurde ein Code an die E-Mail Adresse geschickt. Mit dem Code bekommst ein neues Passwort zugesendet.'
    }
  })
}]);

// locale controller
app.controller('LocaleCtrl', ['$scope', '$translate', 'localStorageService', function ($scope, $translate, localStorageService) {

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
}]);