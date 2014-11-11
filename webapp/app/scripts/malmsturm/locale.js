'use strict';

// i18n for index.html
var app = angular.module('openrole');

app.config(['$translateProvider',function ($translateProvider) {
  $translateProvider.registerAvailableLanguageKeys(["de"]);
  $translateProvider.use("de");

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
      ANZAHL_BEUTE_ANZEIGEN: 'Beute-Ankreuzkästchen anzeigen (0 = ausblenden)',
      NOTES: 'Notizen',
      DEFAULT_EMPTY_CONFIG_BLOCK:
'{ \n\
  "docId": "",\n\
  "file_version": 1,\n\
      "charactername": "",\n\
      "skillpyramidstartvalue": 5,\n\
      "skillpyramid":\n\
        [\n\
          [ {"title": "_"}],\n\
          [ {"title": "_"}, {"title": "_"}],\n\
          [ {"title": "_"}, {"title": "_"}, {"title": "_"} ],\n\
          [ {"title": "_"}, {"title": "_"}, {"title": "_"}, {"title": "_"} ],\n\
          [ {"title": "_"}, {"title": "_"}, {"title": "_"}, {"title": "_"}, {"title": "_"} ],\n\
          [\n\
            { "title": "Athletik" },\n\
            { "title": "Ausdauer" },\n\
            { "title": "Ausstrahlung" },\n\
            { "title": "Besitz" },\n\
            { "title": "Einbruch" },\n\
            { "title": "Einschüchtern" } ,\n\
            { "title": "Entschlossenheit"},\n\
            { "title": "Ermitteln" },\n\
            { "title": "Gelehrsamkeit" },\n\
            { "title": "Fahrzeug steuern" },\n\
            { "title": "Fingerfertigkeit" },\n\
            { "title": "Führungsqualitäten" },\n\
            { "title": "Gespür" },\n\
            { "title": "Handwerk" },\n\
            { "title": "Heimlichkeit" },\n\
            { "title": "Waffenloser Kampf" },\n\
            { "title": "Nahkampf" },\n\
            { "title": "Fernkampf" },\n\
            { "title": "Kunst" },\n\
            { "title": "Reiten" },\n\
            { "title": "Scharfsinn" },\n\
            { "title": "Spiele" },\n\
            { "title": "Sprachen" },\n\
            { "title": "Täuschung" },\n\
            { "title": "Technik" },\n\
            { "title": "Zaubern"}\n\
          ]\n\
        ],\n\
      "stufenleiter":\n\
      { "12": "Perfekt",\n\
        "11": "Göttergleich",\n\
        "10": "Überirdisch",\n\
        "9": "Übernatürlich",\n\
        "8": "Übermenschlich",\n\
        "7": "Legendär",\n\
        "6": "Weltklasse",\n\
        "5": "Großartig",\n\
        "4": "Hervorragend",\n\
        "3": "Gut",\n\
        "2": "Ordentlich",\n\
        "1": "Durchschnittlich",\n\
        "0": "Mäßig",\n\
        "-1": "Armselig",\n\
        "-2": "Grauenhaft"},\n\
      "stufenleiterstart": -2,\n\
      "stufenleiterend": 12,\n\
      "konsequenzen":  ["LEICHT","MITTEL","SCHWER"],\n\
 \n\
      "aspects": [{"name": "", "description": ""}],\n\
      "talents": [{"name": ""}],\n\
      "weapons": [{"name": ""}],\n\
      "beute": 6,\n\
      "belastungspunkte": [\n\
        {\n\
          "id": "koerper",\n\
          "defaultval": 5,\n\
          "skillbonus": 0,\n\
          "bonus": 0,\n\
          "dependsOnSkill":"Ausdauer",\n\
          "total": 0,\n\
          "totalArr": []\n\
        },\n\
        {\n\
          "id": "mental",\n\
          "defaultval": 5,\n\
          "skillbonus": 0,\n\
          "bonus": 0,\n\
          "dependsOnSkill":"Entschlossenheit",\n\
          "total": 0,\n\
          "totalArr": []\n\
        },\n\
        {\n\
          "id": "arkan",\n\
          "defaultval": 5,\n\
          "skillbonus": 0,\n\
          "bonus": 0,\n\
          "dependsOnSkill":"Zaubern",\n\
          "total": 0,\n\
          "totalArr": []\n\
        }\n\
      ],\n\
      "pdffooter": [\n\
        {"header": "Der Einsatz eines SP erlaubt wahlweise",\n\
          "content":["+1 auf vor einen Wurf","eine Behauptung",\n\
            "auslösen eines Aspekts (+2, neuer Wurf, andere Fertigkeit)"\n\
          ]},\n\
        {"header":"",\n\
          "content":[\n\
            "die Aktivierung mancher Talente/Gaben",\n\
            "der Erzwingung eines Aspekts zu widerstehen",\n\
            "den Aspekt eines Gegners auszunutzen"\n\
          ]\n\
        },\n\
        {"header":"SP erhält man durch",\n\
          "content":[\n\
            "Hinnahme der Erzwingung eines Aspekts",\n\
            "Gutes Rollenspiel"\n\
          ]\n\
        },\n\
        {"header":"Jede Stufe erlaubt wahlweise die Erhöhung von",\n\
          "content":["Qualität, Zeit oder Unauffälligkeit einer Aufgabe",\n\
            "Angriffstress"\n\
          ]\n\
        },\n\
        {"header":"Spin (3 Erfolge) erlaubt wahlweise",\n\
          "content":["+1/-1 auf die nächste Aktion",\n\
            "die Erzeugung eines zeitweiligen Aspekts"]}\n\
      ],\n\
      "pdftemplate": "templateMalmsturm1",\n\
      "shares": []\n\
    }'
     // end default config block
    }
  })
}]);
