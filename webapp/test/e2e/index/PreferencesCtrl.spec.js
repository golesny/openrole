
describe("preferences-ctrl-test", function() {

  beforeEach(function() {
    browser.get("/webapp/app/preferences.html")
  });

  describe("preferences-page", function() {
    it("should save and cancel the values", function() {
      var inputDevUrl = element(by.model('prefs.DeveloperExtensionURL'));
      // prepare values
      inputDevUrl.sendKeys('e2e-test');
      // save
      element(by.id('save')).click();
      // modify all values
      inputDevUrl.sendKeys('shouldbereverted');
      // reverts
      element(by.id('cancel')).click();
      // assertion
      expect(inputDevUrl.getAttribute('value')).toEqual('e2e-test');
    })
  });

});