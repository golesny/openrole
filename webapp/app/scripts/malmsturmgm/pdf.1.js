
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
  var LINE_HEIGHT = 6;
  var LINE_HEIGHT_8 = 8 / 2.54;
  var LINE_HEIGHT_11 = 11 / 2.54;

  doc.setFontSize(13);
  doc.setFont("times");
  doc.setFontType("italic");

// *** Group name ***
  var y = TOP_Y + LINE_HEIGHT;
  doc.text(LEFT_X, y, 'Gruppe: '+groupData.charactername);
  doc.line(LEFT_X, y + 1, 110, y + 1);

  y += LINE_HEIGHT;
  // *** Aspects ***
  doc.setFontSize(11);

  for (var c=0; c<groupData.characters.length; c++) {
    var charData = groupData.characters[c];
    doc.text(LEFT_X, y, 'Charakter: '+charData.charactername + " ("+charData.nick+")");
    doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
    y += LINE_HEIGHT;
    for (var i=0; i<charData.aspects.length; i++) {
      if (charData.aspects[i].name != undefined && charData.aspects[i].name.length > 0) {
        var lines = doc.setFontSize(11).splitTextToSize(charData.aspects[i].name, RIGHT_X_COL1 - LEFT_X);
        doc.text(LEFT_X, y, lines);
        y += lines.length * LINE_HEIGHT_8;
      }
      if (groupData.pdfprintaspecttext == "true") {
        if (charData.aspects[i].description != undefined && charData.aspects[i].description.length > 0) {
          var lines = doc.setFontSize(8).splitTextToSize(charData.aspects[i].description, RIGHT_X_COL1 - LEFT_X);
          doc.text(LEFT_X, y, lines);
          y += lines.length * LINE_HEIGHT_8;
        }
      }
      y += LINE_HEIGHT;
    }
  }


  return doc;
};
