'use strict';

// i18n for index.html
var app = angular.module('openrole');

app.config(['$translateProvider',function ($translateProvider) {
  //$translateProvider.translations('en', {
  // MALMSTURM: {
  //   TITLE_CHARACTER: 'Character',
  //   CHARACTERNAME: 'Charactername',
  // }
  //});

  $translateProvider.translations('de', {
    MALMSTURM: {
      TITLE_CHARACTER: 'Spielerfigur',
      CHARACTERNAME: 'Charaktername',
      ASPECTS: 'Aspekte',
      ASPECT: 'Aspekt',
      EVENTS: 'Ereignisse',
      TALENTS: 'Talente und Gaben',
      TALENTS_PLACEHOLDER: 'Talent/Gabe',
      WEAPONS: 'Waffen und Rüstung',
      WEAPON: 'Waffe/Rüstung',
      SKILLS: 'Fertigkeiten',
      BELASTUNG: 'Belastungspunkte',
      koerper: 'Körperlich',
      mental: 'Mental',
      arkan: 'Arkan',
      KONSEQUENZEN:'Konsequenzen',
      LEICHT:'Leicht',
      MITTEL: 'Mittel',
      SCHWER: 'Schwer',
      BEUTE: 'Beute',
      DIVERSES: 'Diverses',
      ANZAHL_BEUTE_ANZEIGEN: 'Beute-Ankreuzkästchen anzeigen (0 = ausblenden)'
    }
  })
}]);
