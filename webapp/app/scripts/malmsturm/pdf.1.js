
registerTemplate("malmsturm", "templateMalmsturm1", "Default Template 1x A4");


function templateMalmsturm1_resources() {
  return ['/images/malmsturm/logo.dataurl','/images/malmsturm/rune.dataurl',
          '/fonts/Goudy Mediaeval Regular.ttf', '/fonts/JustAnotherHand.ttf'];
}

function templateMalmsturm1(charData, resLoaded, $translate, alertService, options) {
  var doc = new PDFDocument({size: 'A4'});

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
    'STROKE_COLOR': '#000000'
  };
  OPTS['RIGHT_X_COL1'] = (OPTS.RIGHT_X - OPTS.LEFT_X) / 3 * 2;
  OPTS['LEFT_X_COL2'] = OPTS.RIGHT_X_COL1 + 5;
  OPTS['BOTTOM_Y'] = OPTS.HEIGHT - OPTS.TOP_Y * 1.4;
  doc.page.margins.bottom = 0;

  doc.registerFont(OPTS.FONT_HEAD, resLoaded['/fonts/Goudy Mediaeval Regular.ttf'], OPTS.FONT_HEAD);
  doc.registerFont(OPTS.FONT_USER, resLoaded['/fonts/JustAnotherHand.ttf'], OPTS.FONT_USER);

// Malmsturm Logo
  doc.image(resLoaded['/images/malmsturm/logo.dataurl'], OPTS.RIGHT_X - 210, 2, {width: 200});
  //doc.rect(OPTS.LEFT_X, OPTS.TOP_Y, OPTS.RIGHT_X - OPTS.LEFT_X, OPTS.BOTTOM_Y - OPTS.TOP_Y).stroke();

  doc.fontSize(OPTS.FONT_HEAD_SIZE).font(OPTS.FONT_HEAD);

// *** Character name ***
  var y = OPTS.TOP_Y + OPTS.LINE_HEIGHT;
  doc.text($translate.instant('MALMSTURM.TITLE_CHARACTER')+': ', OPTS.LEFT_X, y);
  doc.font(OPTS.FONT_USER).fontSize(OPTS.FONT_USER_SIZE).text(charData.charactername, OPTS.LEFT_X + 50, y + 1.5);
  doc.lineWidth(1).moveTo(OPTS.LEFT_X, y + OPTS.LINE_HEIGHT).lineTo(280, y + OPTS.LINE_HEIGHT).stroke(OPTS.STROKE_COLOR);

  y += 2 * OPTS.LINE_HEIGHT;

// *** Skills ***
  y = templateMalmsturm1_headline(doc, $translate.instant('MALMSTURM.SKILLS'), OPTS.LEFT_X, y, 280, OPTS);

  doc.fontSize(OPTS.FONT_HEAD_SIZE - 2);
  for (var i = 0; i < charData.skillpyramid.length; i++) {
    var lvl = charData.skillpyramidstartvalue - i;
    if (lvl > 0) {
      lvl = "+" + lvl;
    } else if (lvl == 0) {
      lvl = "+/-0";
    } else {
      lvl = "" + lvl;
    }
    doc.text(lvl + " " + charData.stufenleiter[charData.skillpyramidstartvalue - i], OPTS.LEFT_X, y);
    doc.image(resLoaded['/images/malmsturm/rune.dataurl'], 90, y + 2, {width: 8});
    var slotWidth = 68;
    // skills
    var skillsLine = '';
    for (var j = 0; j < charData.skillpyramid[i].length; j++) {
      var skill = charData.skillpyramid[i][j];
      if (j > 0) {
        skillsLine += " - ";
      }
      skillsLine += skill.title;

    }
    if (i < (charData.skillpyramid.length - 1)) {
      doc.text(skillsLine, 106, y);
      doc.moveTo(OPTS.LEFT_X, y + OPTS.LINE_HEIGHT + 2).lineTo(88 + charData.skillpyramid[i].length * slotWidth, y + OPTS.LINE_HEIGHT + 2);
    } else {
      // last line has many skills and a break
      doc.text(skillsLine, 106, y, {width: OPTS.RIGHT_X - 110});
      var height = doc.heightOfString(skillsLine, {width: OPTS.RIGHT_X - 110});
      y += height;
      doc.moveTo(OPTS.LEFT_X, y + 2).lineTo(OPTS.RIGHT_X, y + 2).stroke(OPTS.STROKE_COLOR);
    }
    y += OPTS.LINE_HEIGHT_1_5;
  }
  y += OPTS.LINE_HEIGHT;

  var yr = y; // right y
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  left column ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// *** Aspects ***
  y = templateMalmsturm1_headline(doc, $translate.instant('MALMSTURM.ASPECTS'), OPTS.LEFT_X, y, OPTS.RIGHT_X_COL1, OPTS);

  doc.font(OPTS.FONT_USER);
  for (var i=0; i<charData.aspects.length; i++) {
    if (charData.aspects[i].name != undefined && charData.aspects[i].name.length > 0) {
      doc.fontSize(OPTS.FONT_USER_SIZE).text(charData.aspects[i].name, OPTS.LEFT_X, y, {width: OPTS.RIGHT_X_COL1 - OPTS.LEFT_X});
      y += doc.heightOfString(charData.aspects[i].name, {width: OPTS.RIGHT_X_COL1 - OPTS.LEFT_X});
    }
    if (! options.hasOwnProperty("dontPrintAspectDescription")) {
      if (charData.aspects[i].description != undefined && charData.aspects[i].description.length > 0) {
        y -= 0.5;
        doc.fontSize(OPTS.FONT_USER_SIZE - 2).text(charData.aspects[i].description, OPTS.LEFT_X, y, {width: OPTS.RIGHT_X_COL1 - OPTS.LEFT_X});
        y += doc.heightOfString(charData.aspects[i].description, {width: OPTS.RIGHT_X_COL1 - OPTS.LEFT_X}) + 4;

      }
    }
    y += 2;
  }
  y += OPTS.LINE_HEIGHT;
  // print empty lines for Aspects
  for (var i=charData.aspects.length; i<5; i++) {
    for (var j=0; j<2; j++) {
      var ly = y + 1 +  (j*OPTS.LINE_HEIGHT_1_5);
      doc.moveTo(OPTS.LEFT_X, ly).lineTo(OPTS.RIGHT_X_COL1, ly).stroke(OPTS.STROKE_COLOR);
    }
    y += 2 * OPTS.LINE_HEIGHT_1_5 + 2;
  }
  y += 5;

// *** Talents ***
  y = templateMalmsturm1_1LineBlock(doc, y, $translate.instant('MALMSTURM.TALENTS'), charData.talents, OPTS);

// *** Waffen und Rüstungen ***
  y = templateMalmsturm1_1LineBlock(doc, y, $translate.instant('MALMSTURM.WEAPONS'), charData.weapons, OPTS);

// *** Schicksalspunkte ***
  doc.fontSize(OPTS.FONT_HEAD_SIZE).font(OPTS.FONT_HEAD);
  doc.text('Schicksalspunkte   Gesamt:      Aktuell:', OPTS.LEFT_X, y);
  y += OPTS.LINE_HEIGHT;
  doc.moveTo(OPTS.LEFT_X, y + 1).lineTo(OPTS.RIGHT_X_COL1, y + 1).stroke(OPTS.STROKE_COLOR);
  y += 5;

// *** Stufenleiter ***
  doc.fontSize(OPTS.FONT_HEAD_SIZE);
  doc.text('Stufenleiter: ', OPTS.LEFT_X, y);
  y += OPTS.LINE_HEIGHT;
  doc.moveTo(OPTS.LEFT_X, y + 1).lineTo(OPTS.RIGHT_X_COL1, y + 1).stroke(OPTS.STROKE_COLOR);
  y += 3;
  doc.fontSize(OPTS.FONT_HEAD_SIZE - 3);
  var stufenleit = charData.stufenleiter;
  var strows = Math.ceil((charData.stufenleiterend - charData.stufenleiterstart + 1) / 3);
  for (var st=charData.stufenleiterstart, idx=0;
       st <= charData.stufenleiterend; st++, idx++) {
    if (stufenleit.hasOwnProperty(st)) {
      var xOff = (Math.ceil( (idx+0.0000001) / strows) - 1) * 100 + 5;
      var yOff = (idx % strows) * 12;
      var numb = st>0?"+"+st:""+st;
      var txtWidth = doc.widthOfString(numb);
      doc.text(numb, OPTS.LEFT_X + xOff - txtWidth + 8, y + yOff);
      doc.text(stufenleit[st], OPTS.LEFT_X + xOff + 15, y + yOff);
    }
  }
  y += doc.heightOfString("0") * (strows + 2);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  right column ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // *** Belastungspunkte ***
  yr = templateMalmsturm1_headline(doc, $translate.instant('MALMSTURM.BELASTUNG'), OPTS.LEFT_X_COL2, yr, OPTS.RIGHT_X, OPTS);

  for (var i=0; i<charData.belastungspunkte.length; i++) {
    var bel = charData.belastungspunkte[i];
    doc.text($translate.instant('MALMSTURM.'+bel.id), OPTS.LEFT_X_COL2, yr);
    yr += OPTS.LINE_HEIGHT;
    for (var j=0; j<bel.total; j++) {
      var runeX = OPTS.LEFT_X_COL2 + 12 + j * 8.5 /* distance */ + Math.floor(j / 5) * 3 /* distance every 5th */;
      doc.image(resLoaded['/images/malmsturm/rune.dataurl'], runeX, yr + 4, {width: 8});
    }
    yr += OPTS.LINE_HEIGHT;
  }
  yr += OPTS.LINE_HEIGHT;

  // === Konsequenzen
  yr = templateMalmsturm1_headline(doc, $translate.instant('MALMSTURM.KONSEQUENZEN'), OPTS.LEFT_X_COL2, yr, OPTS.RIGHT_X, OPTS);
  //doc.text($translate.instant('MALMSTURM.KONSEQUENZEN')+': ', OPTS.LEFT_X_COL2, yr);
  //yr += LINE_HEIGHT;
  //doc.line(LEFT_X_COL2, yr + 1, RIGHT_X, yr + 1);

  for (var i=0; i< charData.konsequenzen.length; i++) {
    doc.text($translate.instant('MALMSTURM.' + charData.konsequenzen[i])+":", OPTS.LEFT_X_COL2, yr + 2);
    for (var j = 0; j < 5; j++) {
      yr += OPTS.LINE_HEIGHT_1_5;
      doc.moveTo(OPTS.LEFT_X_COL2, yr).lineTo(OPTS.RIGHT_X, yr).stroke(OPTS.STROKE_COLOR);
    }
    yr += 5;
  }
  yr += OPTS.LINE_HEIGHT;


  if (charData.beute > 0) {
    // == Beute
    yr = templateMalmsturm1_headline(doc, $translate.instant('MALMSTURM.BEUTE'), OPTS.LEFT_X_COL2, yr, OPTS.RIGHT_X, OPTS);

    for (var i=0;i<charData.beute;i++) {
      var runeX = OPTS.LEFT_X_COL2 + 5 + i * 8.5 /* distance */ + Math.floor(i / 5) * 3 /* distance every 5th */;
      doc.image(resLoaded['/images/malmsturm/rune.dataurl'], runeX, yr + 4, {width: 8});
    }
    yr += OPTS.LINE_HEIGHT;
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  footer ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // *** Einsatz von Schicksalspunkten ***
  var footerCols = charData.pdffooter.length;
  var colWidth = (OPTS.RIGHT_X - OPTS.LEFT_X) / footerCols;
  console.log("footer colWidth="+colWidth);
  var maxHeaderHeight = 0;
  var maxContentHeight = 0;
  doc.fontSize(OPTS.FONT_HEAD_SIZE - 2).font(OPTS.FONT_HEAD);
  // get the height of headline+content
  for (var j=0; j<footerCols; j++) {
    var h = doc.heightOfString(charData.pdffooter[j].header, {width: colWidth - 1});
    if (h > maxHeaderHeight) {
      maxHeaderHeight = h;
    }
    h = 0;
    for (var k = 0; k < charData.pdffooter[j].content.length; k++) {
      h += doc.heightOfString("- "+charData.pdffooter[j].content[k], {width: colWidth - 6});
    }
    if (h > maxContentHeight) {
      maxContentHeight = h;
    }
  }

  // print all lines
  for (var i=0; i<footerCols; i++) {
    var yf = OPTS.BOTTOM_Y - maxHeaderHeight - 2 - maxContentHeight;
    doc.text(charData.pdffooter[i].header, OPTS.LEFT_X + i * colWidth, yf, {width: colWidth - 1});
    yf += maxHeaderHeight + 2;
    // content
    for (var k = 0; k < charData.pdffooter[i].content.length; k++) {
      doc.text("- "+charData.pdffooter[i].content[k], OPTS.LEFT_X + i * colWidth + 5, yf, {width: colWidth - 6});
      h = doc.heightOfString("- " + charData.pdffooter[i].content[k], {width: colWidth - 6});
      yf += h;
      console.log("content col "+i+" y="+yf+" h="+h);
    }
  }
  var lineYF = OPTS.BOTTOM_Y - maxContentHeight - 1;
  doc.moveTo(OPTS.LEFT_X, lineYF).lineTo(OPTS.RIGHT_X, lineYF).stroke(OPTS.STROKE_COLOR);

  yf = OPTS.BOTTOM_Y - maxHeaderHeight - 2 - maxContentHeight;
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  notizen ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // fill the space between left colum and footer
  // *** Notizen ***
  if (y < yf) {
    doc.fontSize(11);
    doc.text($translate.instant('MALMSTURM.NOTES')+':', OPTS.LEFT_X, y);
    y += OPTS.LINE_HEIGHT_1_5;
    for (;(y+OPTS.LINE_HEIGHT_1_5) < yf; y += OPTS.LINE_HEIGHT_1_5) {
      doc.moveTo(OPTS.LEFT_X, y + 1).lineTo(OPTS.RIGHT_X_COL1, y + 1).stroke(OPTS.STROKE_COLOR);
    }
  }
  // check with a small buffer, if the template can show all content
  if ((y-4) > yf) {
    alertService.danger("MSG.PDF_LAYOUT_TOO_MUCH_CONTENT");
  }

  return doc;
};

var templateMalmsturm1_1LineBlock = function(doc, y, title, contentArray, OPTS) {
  y = templateMalmsturm1_headline(doc, title, OPTS.LEFT_X, y, OPTS.RIGHT_X_COL1, OPTS);

  for (var i=0; i<contentArray.length; i++) {
    doc.font(OPTS.FONT_USER).fontSize(OPTS.FONT_USER_SIZE);
    var height = doc.heightOfString(contentArray[i].name, {width:OPTS.RIGHT_X_COL1 - OPTS.LEFT_X});
    doc.text(contentArray[i].name, OPTS.LEFT_X, y, {width:OPTS.RIGHT_X_COL1 - OPTS.LEFT_X});
    y += height + 1;
  }
  return y;
};

var templateMalmsturm1_headline = function(doc, title, x, y, lineX, OPTS) {
  doc.font(OPTS.FONT_HEAD).fontSize(OPTS.FONT_HEAD_SIZE);
  doc.text(title+': ', x, y);
  y += OPTS.LINE_HEIGHT;
  doc.moveTo(x, y).lineTo(lineX, y).stroke(OPTS.STROKE_COLOR);
  y += 5;
  return y;
};
