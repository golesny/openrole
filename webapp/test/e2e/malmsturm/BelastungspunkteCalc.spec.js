
describe("malmsturm-belastungspunkte", function() {

  beforeEach(function () {
    browser.get("/webapp/app/malmsturm.html");
  });

  describe("calculation", function () {
    it("should be called and correct on skill move", function () {
      element(by.id('skill_List5_Skill1')).click(); // Ausdauer
      element(by.id('skill_List0_Skill0')).click();
      element(by.id('skill_List5_Skill5')).click(); // Entschlossenheit
      element(by.id('skill_List1_Skill0')).click();
      element(by.id('skill_List5_Skill23')).click();
      element(by.id('skill_List2_Skill0')).click();
      browser.waitForAngular();

      var elems = element.all(by.repeater('bel in openrole.belastungspunkte'));
      expect(elems.count()).toBe(3);

      expect($('.e2ebsb0').getText()).toEqual("5");
      expect($('.e2ebsb1').getText()).toEqual("4");
      expect($('.e2ebsb2').getText()).toEqual("3");

      expect($('.e2ebst0').getText()).toEqual("= 10");
      expect($('.e2ebst1').getText()).toEqual("= 9");
      expect($('.e2ebst2').getText()).toEqual("= 8");

      $('.e2ebsf0').sendKeys("1");
      $('.e2ebsf1').sendKeys("3");
      $('.e2ebsf2').sendKeys("5");

      expect($('.e2ebst0').getText()).toEqual("= 11");
      expect($('.e2ebst1').getText()).toEqual("= 12");
      expect($('.e2ebst2').getText()).toEqual("= 13");
    });
  });
});