
describe("navigation-tester", function() {

  beforeEach(function() {
    browser.get("/webapp/app/index.html")
  });

  describe("on index.html", function() {
    it("should display correct title", function() {
      expect(browser.getTitle()).toBe("openrole.net - Character Generator Platform");
    });

    it('nav menu should be available on all device sizes', function(){
      var menuBtn = element(by.id('smalldevmenu'));
      var menuBtnPref = element(by.id('menuBtnPref'));
      expect(menuBtn.isDisplayed()).toEqual(false);
      expect(menuBtnPref.isDisplayed()).toEqual(true);

      // resize an check the small device size
      browser.driver.manage().window().setSize(500, 700);
      browser.driver.sleep(200);
      expect(menuBtn.isDisplayed()).toEqual(true);
      expect(menuBtnPref.isDisplayed()).toEqual(false);
      menuBtn.click();
      browser.driver.sleep(100);
      expect(menuBtnPref.isDisplayed()).toEqual(true);

      // maximize to normal size
      browser.driver.manage().window().maximize()
    });
  });

});