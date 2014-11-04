
registerTemplate("malmsturm", "templateMalmsturm2", "Default Template 2x A4");

function templateMalmsturm2_resources() {
  return ['/images/malmsturm/logo.dataurl','/images/malmsturm/rune.dataurl',
    '/fonts/Goudy Mediaeval Regular.ttf', '/fonts/JustAnotherHand.ttf'];
}

function templateMalmsturm2(charData, imageLoaded, $translate, alertService) {
  // first page without aspect description
  var options = {"dontPrintAspectDescription": 'true'};
  var doc = templateMalmsturm1(charData, imageLoaded, $translate, alertService, options);

  var OPTS = {
    'FONT_HEAD': 'fontHead',
    'FONT_HEAD_SIZE': 11,
    'FONT_USER': 'fontUser',
    'FONT_USER_SIZE': 12,
    'HEIGHT': doc.page.height,
    'WIDTH': doc.page.width,
    'LEFT_X': 20,
    'TOP_Y': 20,
    'RIGHT_X': doc.page.width - 20,
    'LINE_HEIGHT': 12,
    'LINE_HEIGHT_1_5': 18,
    'LINE_HEIGHT_11': 27,
    'RIGHT_X_COL1':0,
    'LEFT_X_COL2':0,
    'BOTTOM_Y':0,
    TOP_Y_COLRIGHT: 15,
    'STROKE_COLOR': '#000000'
  };
  OPTS['RIGHT_X_COL1'] = (OPTS.RIGHT_X - OPTS.LEFT_X) / 3 * 2;
  OPTS['LEFT_X_COL2'] = OPTS.RIGHT_X_COL1 + 5;
  OPTS['BOTTOM_Y'] = OPTS.HEIGHT - OPTS.TOP_Y * 1.4;
  doc.page.margins.bottom = 0;

  doc.font(OPTS.FONT_HEAD);

  var y = OPTS.TOP_Y + OPTS.LINE_HEIGHT;
  templateMalmsturm2_addPageWithRightCol(doc, OPTS);
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  left column ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  // *** Aspects ***
  y = templateMalmsturm1_headline(doc, $translate.instant('MALMSTURM.ASPECTS'), OPTS.LEFT_X, y, OPTS.RIGHT_X_COL1, OPTS);

  for (var i=0; i<charData.aspects.length; i++) {
    // calculate content
    var yToAdd1 = 0;
    if (charData.aspects[i].name != undefined && charData.aspects[i].name.length > 0) {
      yToAdd1 += doc.font(OPTS.FONT_USER).fontSize(OPTS.FONT_USER_SIZE + 2).heightOfString(charData.aspects[i].name, {width: OPTS.RIGHT_X_COL1 - OPTS.LEFT_X});
    }
    var yToAdd2 = 0;
    if (charData.aspects[i].description != undefined && charData.aspects[i].description.length > 0) {
      yToAdd2 += 1 + doc.font(OPTS.FONT_USER).fontSize(OPTS.FONT_USER_SIZE).heightOfString(charData.aspects[i].description, {width: OPTS.RIGHT_X_COL1 - OPTS.LEFT_X - 10});
    }

    // check if content fits to page
    if (y+yToAdd1+yToAdd2 > OPTS.BOTTOM_Y) {
      // content does not fit
      templateMalmsturm2_addPageWithRightCol(doc, OPTS);
      y = OPTS.TOP_Y; // reset y
    }
    // print content
    if (charData.aspects[i].name != undefined && charData.aspects[i].name.length > 0) {
      doc.font(OPTS.FONT_USER).fontSize(OPTS.FONT_USER_SIZE + 2);
      doc.text(charData.aspects[i].name, OPTS.LEFT_X, y, {width: OPTS.RIGHT_X_COL1 - OPTS.LEFT_X});
      y += yToAdd1;
    }

    if (charData.aspects[i].description != undefined && charData.aspects[i].description.length > 0) {
      doc.font(OPTS.FONT_USER).fontSize(OPTS.FONT_USER_SIZE);
      doc.text(charData.aspects[i].description, OPTS.LEFT_X + 10, y, {width: OPTS.RIGHT_X_COL1 - OPTS.LEFT_X - 10});
      y += yToAdd2;
    }
    y + OPTS.LINE_HEIGHT_1_5 + 5;
  }
  y += OPTS.LINE_HEIGHT_1_5;
  // print empty lines to the end
  while (y < OPTS.BOTTOM_Y) {
    doc.moveTo(OPTS.LEFT_X, y).lineTo(OPTS.RIGHT_X_COL1, y).stroke(OPTS.STROKE_COLOR);
    y += OPTS.LINE_HEIGHT_1_5;
  }
  return doc;
}

  function templateMalmsturm2_addPageWithRightCol(doc, OPTS) {
  doc.addPage();
  doc.page.margins.bottom = 0;

  var y = OPTS.TOP_Y + 2 * OPTS.LINE_HEIGHT;
  while (y < OPTS.BOTTOM_Y) {
    doc.moveTo(OPTS.LEFT_X_COL2, y).lineTo(OPTS.RIGHT_X, y).stroke(OPTS.STROKE_COLOR);
    y += OPTS.LINE_HEIGHT_1_5;
  }
}
