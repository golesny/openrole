
describe("malmsturm-skill-test", function() {

  beforeEach(function() {
    browser.get("/webapp/app/malmsturmgm.html");
  });

  describe("button ADD", function() {
    it("should add new empty characters", function() {
      var btnAdd = element(by.css('[ng-click="newLink(openrole.characters)"]'));
      // initially it should be empty
      expect(element.all(by.repeater('character in openrole.characters track by $index')).count()).toEqual(0);
      btnAdd.click();
      expect(element.all(by.repeater('character in openrole.characters track by $index')).count()).toEqual(1);
      btnAdd.click();
      expect(element.all(by.repeater('character in openrole.characters track by $index')).count()).toEqual(2);
    });

  });

});