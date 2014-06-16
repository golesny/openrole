// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-local-storage/angular-local-storage.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/es5-shim/es5-shim.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/json3/lib/json3.min.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/affix.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/alert.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/button.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/carousel.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/collapse.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/dropdown.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tab.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/transition.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/scrollspy.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/modal.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip.js',
      'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/popover.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-local-storage/angular-local-storage.js',
      'app/bower_components/angular-translate/angular-translate.js',
      'app/bower_components/jspdf/dist/jspdf.min.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angular-touch/angular-touch.js',
      'app/bower_components/jquery-ui/ui/jquery-ui.js',
      'app/bower_components/angular-dragdrop/src/angular-dragdrop.js',
      'app/scripts/app.js',
  'app/scripts/openrole/jsPdf.openrole.plugins.js',
  'app/scripts/openrole/locale.js',
  'app/scripts/openrole/common.js',
  'app/scripts/openrole/DialogOpenCtrl.js',
  'app/scripts/openrole/DialogRegistrationCtrl.js',
  'app/scripts/openrole/AlertService.js',
  'app/scripts/openrole/LoaderService.js',
  'app/scripts/openrole/directiveInputList.js',
  'app/scripts/openrole/PreferencesCtrl.js',
  'app/scripts/openrole/directiveDropdown.js',
    'app/scripts/malmsturm/MalmsturmCtrl.js',
        'app/scripts/malmsturm/pdf.1.js',
      'app/scripts/malmsturm/locale.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome', 'Firefox', 'IE'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
