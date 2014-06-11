
describe("navigation-tester", function() {

  beforeEach(function() {
    browser.get("/webapp/app/index.html")
  });

  describe("index.title", function() {
    it("should display correct title", function() {
      expect(browser.getTitle()).toBe("openrole.net - Character Generator Platform");
    })
  });

});