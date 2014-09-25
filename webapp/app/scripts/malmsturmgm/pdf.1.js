
registerTemplate("malmsturmgm", "templateMalmsturmGM1", "Default Template zwei Spalten A4");

function templateMalmsturmGM1_resources() {
  return [];
}

function templateMalmsturmGM1(groupData, resLoaded, $translate, alertService, options) {
  var doc = new PDFDocument({size: 'A4'});

// border
  var PAGE_HEIGHT = doc.page.height;
  var PAGE_WIDTH = doc.page.width;
  var LEFT_X = 15;
  var TOP_Y = 20;
  var RIGHT_X = PAGE_WIDTH - LEFT_X;
  var RIGHT_X_COL1 = (RIGHT_X - LEFT_X) / 3 * 2;
  var LEFT_X_COL2 = RIGHT_X_COL1 + 5;
  var BOTTOM_Y = PAGE_HEIGHT - TOP_Y * 2;
  var LINE_HEIGHT_8 = 8;
  var LINE_HEIGHT_11 = 10;

// *** Group name ***
  var y = TOP_Y;
  var txt = $translate.instant('MALMSTURMGM.GROUP') + ': '+groupData.charactername;
  doc.fontSize(14).text(txt, LEFT_X, y);

  y += 2 * LINE_HEIGHT_11;

  for (var c=0; c<groupData.characters.length; c++) {
    // *** Aspects ***
    var charData = groupData.characters[c];
    txt = $translate.instant('MALMSTURMGM.CHARACTER') +': '+charData.charactername + " ("+charData.nick+")";
    doc.fontSize(12).text(txt, LEFT_X, y);
    y += 6;
    doc.moveTo(LEFT_X, y + 6).lineTo(RIGHT_X_COL1, y + 6).stroke();
    y += LINE_HEIGHT_11;
    if (angular.isDefined(charData.aspects)) {
      for (var i = 0; i < charData.aspects.length; i++) {
        if (angular.isDefined(charData.aspects[i].name) && charData.aspects[i].name.length > 0) {
          doc.fontSize(11);
          var bh1 = doc.heightOfString(charData.aspects[i].name, {"width": RIGHT_X_COL1 - LEFT_X});
          doc.text(charData.aspects[i].name, LEFT_X, y, {"width": RIGHT_X_COL1 - LEFT_X});
          y += bh1 + 2;
        }
        if (groupData.pdfprintaspecttext == "true") {
          if (charData.aspects[i].description != undefined && charData.aspects[i].description.length > 0) {
            doc.fontSize(10);
            var blockheight = doc.heightOfString(charData.aspects[i].description, {"width": RIGHT_X_COL1 - LEFT_X - 3});
            doc.text(charData.aspects[i].description, LEFT_X + 3, y, {"width": RIGHT_X_COL1 - LEFT_X - 3});
            y += blockheight;
          }
        }
        y += 5;
      }
    } else {
      console.log("no aspects for character "+charData.charactername);
    }
  }
  return doc;
}
