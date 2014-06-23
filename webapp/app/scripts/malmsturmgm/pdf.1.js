
registerTemplate("malmsturmgm", "templateMalmsturmGM1", "Default Template zwei Spalten A4");

function templateMalmsturmGM1(groupData, imageLoaded, $translate) {
  var doc = new jsPDF();

// border
  var pageSize = doc.internal.pageSize;
  var LEFT_X = 8;
  var TOP_Y = 6;
  var RIGHT_X = pageSize.width - LEFT_X;
  var RIGHT_X_COL1 = (RIGHT_X - LEFT_X) / 3 * 2;
  var LEFT_X_COL2 = RIGHT_X_COL1 + 5;
  var BOTTOM_Y = pageSize.height - TOP_Y * 2;
  var LINE_HEIGHT = 5;
  var LINE_HEIGHT_8 = 8 / 2.54;
  var LINE_HEIGHT_11 = 10 / 2.54;

  doc.setFontSize(14);
  doc.setFont("times");

// *** Group name ***
  var y = TOP_Y + LINE_HEIGHT;
  doc.text(LEFT_X, y, $translate.instant('MALMSTURMGM.GROUP') + ': '+groupData.charactername);

  y += 2 * LINE_HEIGHT;

  for (var c=0; c<groupData.characters.length; c++) {
    doc.setFontSize(12);
    // *** Aspects ***
    var charData = groupData.characters[c];
    doc.text(LEFT_X, y, $translate.instant('MALMSTURMGM.CHARACTER') +': '+charData.charactername + " ("+charData.nick+")");
    doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
    y += LINE_HEIGHT;
    for (var i=0; i<charData.aspects.length; i++) {
      if (charData.aspects[i].name != undefined && charData.aspects[i].name.length > 0) {
        var lines = doc.setFontSize(10).splitTextToSize(charData.aspects[i].name, RIGHT_X_COL1 - LEFT_X);
        doc.text(LEFT_X, y, lines);
        y += lines.length * LINE_HEIGHT_11;
      }
      if (groupData.pdfprintaspecttext == "true") {
        if (charData.aspects[i].description != undefined && charData.aspects[i].description.length > 0) {
          var lines = doc.setFontSize(8).splitTextToSize(charData.aspects[i].description, RIGHT_X_COL1 - LEFT_X - 3);
          doc.text(LEFT_X + 3, y, lines);
          y += lines.length * LINE_HEIGHT_8 + 1;
        }
      }
      y += 2;
    }
  }


  return doc;
};
