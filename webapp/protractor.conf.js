exports.config = {
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./test/e2e/**/*.spec.js'],
  baseUrl: 'http://localhost:63342/',
  chromeDriver:      'C:/Users/daniel/AppData/Roaming/npm/node_modules/protractor/selenium/chromedriver.exe',
  seleniumServerJar: 'C:/Users/daniel/AppData/Roaming/npm/node_modules/protractor/selenium/selenium-server-standalone-2.42.0.jar',

  suites: {
    malmsturmgm: 'test/e2e/malmsturmgm/**/*spec.js',
    malmsturm: 'test/e2e/malmsturm/**/*spec.js'
    //malmsturm: ['tests/e2e/contact_search/**/*Spec.js', 'tests/e2e/venue_search/**/*Spec.js']
  }
};