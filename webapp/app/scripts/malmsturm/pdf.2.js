
registerTemplate("malmsturm", "templateMalmsturm2", "Default Template 2x A4");

function templateMalmsturm2(charData, imageLoaded, $translate, alertService) {
  // first page without aspect description
  var params = {"dontPrintAspectDescription": 'true'};
  var doc = templateMalmsturm1(charData, imageLoaded, $translate, alertService, params);

  var pageSize = doc.internal.pageSize;
  var LEFT_X = 8;
  var TOP_Y = 6;
  var TOP_Y_COLRIGHT = 15;
  var RIGHT_X = pageSize.width - LEFT_X;
  var RIGHT_X_COL1 = (RIGHT_X - LEFT_X) / 3 * 2;
  var LEFT_X_COL2 = RIGHT_X_COL1 + 5;
  var BOTTOM_Y = pageSize.height - TOP_Y * 2;
  var LINE_HEIGHT = 6;
  var LINE_HEIGHT_8 = 8 / 2.54;
  var LINE_HEIGHT_11 = 11 / 2.54;

  doc.setFont("times");
  doc.setFontType("italic");


  var y = TOP_Y + LINE_HEIGHT;
  templateMalmsturm2_addPageWithRightCol(doc, LEFT_X_COL2, RIGHT_X, TOP_Y_COLRIGHT, BOTTOM_Y, LINE_HEIGHT_11);
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  left column ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  // *** Aspects ***
  doc.setFontSize(11);
  doc.text(LEFT_X, y, 'Aspekte: ');
  doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
  y += LINE_HEIGHT;
  for (var i=0; i<charData.aspects.length; i++) {
    // calculate content
    var lines1;
    var yToAdd1 = 0;
    if (charData.aspects[i].name != undefined && charData.aspects[i].name.length > 0) {
      lines1 = doc.setFontSize(11).splitTextToSize(charData.aspects[i].name, RIGHT_X_COL1 - LEFT_X);
      yToAdd1 = lines1.length * LINE_HEIGHT_11;
    }
    var lines2;
    var yToAdd2 = 0;
    if (charData.aspects[i].description != undefined && charData.aspects[i].description.length > 0) {
      lines2 = doc.setFontSize(8).splitTextToSize(charData.aspects[i].description, RIGHT_X_COL1 - LEFT_X);
      yToAdd2 = lines2.length * LINE_HEIGHT_8 + 1;
    }
    // check if content fits to page
    if (y+yToAdd1+yToAdd2 > BOTTOM_Y) {
      templateMalmsturm2_addPageWithRightCol(doc, LEFT_X_COL2, RIGHT_X, TOP_Y_COLRIGHT, BOTTOM_Y, LINE_HEIGHT_11);
      y = TOP_Y + LINE_HEIGHT;
    }
    // print content
    if (charData.aspects[i].name != undefined && charData.aspects[i].name.length > 0) {
      doc.setFontSize(11);
      doc.text(LEFT_X, y, lines1);
      y += yToAdd1;
    }

    if (charData.aspects[i].description != undefined && charData.aspects[i].description.length > 0) {
      doc.setFontSize(8);
      doc.text(LEFT_X, y, lines2);
      y += yToAdd2;
    }
    y += LINE_HEIGHT_8;
  }
  y += LINE_HEIGHT_11;
  // print empty lines to the end
  while (y < BOTTOM_Y) {
    doc.line(LEFT_X, y, RIGHT_X_COL1, y);
    y += LINE_HEIGHT_11;
  }
  return doc;
};

function templateMalmsturm2_addPageWithRightCol(doc, LEFT_X, RIGHT_X, TOP_Y, BOTTOM_Y, LINE_HEIGHT) {
  doc.addPage();

  var y = TOP_Y;
  while (y < BOTTOM_Y) {
    doc.line(LEFT_X, y, RIGHT_X, y);
    y += LINE_HEIGHT;
  }
}