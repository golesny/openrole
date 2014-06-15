
describe("malmsturm-skill-test", function() {

  beforeEach(function() {
    browser.get("/webapp/app/malmsturm.html");
  });

  describe("switch-by-clicking", function() {
    it("should switch a skill", function() {
      var skill5_1 = element(by.id('skill_List5_Skill1'));
      var t1 = skill5_1.getText();
      var t2 = element(by.id('skill_List5_Skill2')).getText();
      var skill0_0 = element(by.id('skill_List0_Skill0'));
      skill5_1.click();
      expect(skill5_1.getAttribute('data-mark')).toEqual('marked');
      // click another empty thing
      skill0_0.click();
      //
      expect(skill0_0.getText()).toEqual(t1);
      expect(skill5_1.getText()).toEqual(t2);
      expect(skill5_1.getAttribute('data-mark')).toEqual('');
    });

    it("should switch an empty skill with last list", function() {
      var skill2_0_empty = element(by.id('skill_List2_Skill0'));
      var skill5_0 = element(by.id('skill_List5_Skill0'));
      var t1 = element(by.id('skill_List5_Skill1')).getText();
      var t2_0 = skill2_0_empty.getText();
      skill2_0_empty.click();
      expect(skill2_0_empty.getAttribute('data-mark')).toEqual('markedempty');
      // click a skill
      skill5_0.click();
      //
      // mark must be gone
      expect(skill2_0_empty.getAttribute('data-mark')).toEqual('');
      expect(skill5_0.getText()).toEqual(t1);
    });

    it("should switch an empty skill with non-empty skill in first list", function() {
      var skill2_0_empty = element(by.id('skill_List2_Skill0'));
      var skill3_2 = element(by.id('skill_List3_Skill2'));
      var skill5_0 = element(by.id('skill_List5_Skill0'));
      var lbl = skill5_0.getText();
      skill2_0_empty.click();
      skill5_0.click();
      expect(skill2_0_empty.getText()).toEqual(lbl);
      //
      skill2_0_empty.click();
      skill3_2.click();
      expect(skill3_2.getText()).toEqual(lbl);
      expect(skill2_0_empty.getText()).toEqual("_");
    });
  });



  describe("switch-by-dropdown", function() {
    it("should switch a skill by drop down", function() {
      var skill5_3_DD = element(by.id('skillDD_List5_Skill3'));
      var skill5_3_txt = element(by.id('skill_List5_Skill3')).getText();
      var skill5_4_txt = element(by.id('skill_List5_Skill4')).getText();
      var skill2_0 = element(by.id('skill_List2_Skill0'));
      skill5_3_DD.click();
      //
      var move5_3_to_2 = element(by.id('moveBtn_List5_Skill3_2'));
      move5_3_to_2.click();
      expect(skill2_0.getText()).toEqual(skill5_3_txt);
      expect(element(by.id('skill_List5_Skill3')).getText()).toEqual(skill5_4_txt);

      // move another to first list
      element(by.id('skillDD_List5_Skill10')).click();
      element(by.id('moveBtn_List5_Skill10_0')).click();
      // move it from third list to first list
      var txt0 = element(by.id('skill_List0_Skill0')).getText();
      // open drop down, button +5 should be invisible
      element(by.id('skillDD_List2_Skill0')).click();
      expect(element(by.id('moveBtn_List2_Skill0_0')).isDisplayed()).toEqual(false);
    });
  });


});