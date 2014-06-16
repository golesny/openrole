
registerTemplate("malmsturmgm", "templateMalmsturmGM1", "Default Template 1x A4");

function templateMalmsturmGM1(charData, imageLoaded, $translate) {
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

  doc.setFontSize(11);
  doc.setFont("times");
  doc.setFontType("italic");
// *** Character name ***
  var y = TOP_Y + LINE_HEIGHT;
  doc.text(LEFT_X, y, 'Spielerfigur: ');
  doc.line(LEFT_X, y + 1, 110, y + 1);

  return doc;
};
