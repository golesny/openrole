
registerTemplate("malmsturm", "templateMalmsturm1", "Default Template 1x A4");

function templateMalmsturm1(charData, imageLoaded, $translate) {
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

// Malmsturm Logo
  doc.addImage(imageLoaded[0], 'JPEG', 115, 2, 90, 45);
//doc.rect(LEFT_X, TOP_Y, RIGHT_X, BOTTOM_Y);

  doc.setFontSize(11);
  doc.setFont("times");
  doc.setFontType("italic");
// *** Character name ***
  var y = TOP_Y + LINE_HEIGHT;
  doc.text(LEFT_X, y, 'Spielerfigur: ' + charData.charactername);
  doc.line(LEFT_X, y + 1, 110, y + 1);
  y += LINE_HEIGHT + LINE_HEIGHT;

// *** Skills ***
  doc.text(LEFT_X, y, 'Fertigkeiten: ');
  doc.line(LEFT_X, y + 1, 110, y + 1);
  y += LINE_HEIGHT;

  doc.setFontSize(9);
  var imgRuneAlias = "";
  for (var i = 0; i < charData.skillpyramid.length; i++) {
    var lvl = charData.skillpyramidstartvalue - i;
    if (lvl > 0) {
      lvl = "+" + lvl;
    } else if (lvl == 0) {
      lvl = "+/-0";
    } else {
      lvl = "" + lvl;
    }
    doc.text(LEFT_X, y, lvl + " " + charData.stufenleiter[charData.skillpyramidstartvalue - i]);
    if (imgRuneAlias == "") {
      doc.addImage(imageLoaded[1], 'JPEG', 36, y - 3, 4, 3, "rune");
      imgRuneAlias = "rune";
    } else {
      doc.addImage(imgRuneAlias, 'JPEG', 36, y - 3, 4, 3);
    }
    var slotWidth = 27;
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
      doc.text(42, y, skillsLine);
      doc.line(LEFT_X, y + 3, 35 + charData.skillpyramid[i].length * slotWidth, y + 3);
    } else {
      // last line has many skills
      var lines = doc.splitTextToSize(skillsLine, RIGHT_X - 42);
      for (var j = 0; j < lines.length; j++) {
        var line = lines[j];
        doc.text(42, y, line);
        if (j < lines.length - 1) {
          y += 4;
        }
      }
      doc.line(LEFT_X, y + 3, RIGHT_X, y + 3);
    }
    y += LINE_HEIGHT + 2;
  }
  y += LINE_HEIGHT;

  var yr = y; // right y
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  left column ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// *** Aspects ***
  doc.setFontSize(11);
  doc.text(LEFT_X, y, 'Aspekte: ');
  doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
  y += LINE_HEIGHT;
  for (var i=0; i<charData.aspects.length; i++) {
    if (charData.aspects[i].name != undefined && charData.aspects[i].name.length > 0) {
      var lines = doc.setFontSize(11).splitTextToSize(charData.aspects[i].name, RIGHT_X_COL1 - LEFT_X);
      doc.text(LEFT_X, y, lines);
      y += lines.length * LINE_HEIGHT_8;
    }
    if (charData.aspects[i].description != undefined && charData.aspects[i].description.length > 0) {
      var lines = doc.setFontSize(8).splitTextToSize(charData.aspects[i].description, RIGHT_X_COL1 - LEFT_X);
      doc.text(LEFT_X, y, lines);
      y += lines.length * LINE_HEIGHT_8;
    }
    y += LINE_HEIGHT;
  }

// *** Talents ***
  y = templateMalmsturm1_1LineBlock(doc, LEFT_X, RIGHT_X_COL1, y, 'Talente und Gaben: ', charData.talents);

// *** Waffen und Rüstungen ***
  y = templateMalmsturm1_1LineBlock(doc, LEFT_X, RIGHT_X_COL1, y, 'Waffen und Rüstungen: ', charData.weapons);

// *** Schicksalspunkte ***
  doc.setFontSize(11);
  doc.text(LEFT_X, y, 'Schicksalspunkte   Gesamt:      Aktuell:');
  doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
  y += LINE_HEIGHT;

// *** Stufenleiter ***
  doc.setFontSize(11);
  doc.text(LEFT_X, y, 'Stufenleiter: ');
  doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
  y += LINE_HEIGHT;

  var stufenleit = charData.stufenleiter;
  var strows = Math.ceil((charData.stufenleiterend - charData.stufenleiterstart + 1) / 3);
  for (var st=charData.stufenleiterstart, idx=0;
       st <= charData.stufenleiterend; st++, idx++) {
    if (stufenleit.hasOwnProperty(st)) {
      var xOff = (Math.ceil( (idx+0.0000001) / strows) - 1) * 40 + 2;
      var yOff = (idx % strows) * LINE_HEIGHT;
      var numb = st>0?"+"+st:""+st;
      var txtWidth = doc.myGetTextWidth(numb);
      doc.text(LEFT_X + xOff - txtWidth + 3, y + yOff, numb);
      doc.text(LEFT_X + xOff + 6, y + yOff, stufenleit[st]);
    }
  }
  y += LINE_HEIGHT * strows;

  y += LINE_HEIGHT;



  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  right column ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  // *** Belastungspunkte ***
  doc.setFontSize(11);
  doc.text(LEFT_X_COL2, yr, $translate.instant('MALMSTURM.BELASTUNG')+': ');
  doc.line(LEFT_X_COL2, yr + 1, RIGHT_X, yr + 1);
  yr += LINE_HEIGHT;
  for (var i=0; i<charData.belastungspunkte.length; i++) {
    var bel = charData.belastungspunkte[i];
    doc.text(LEFT_X_COL2, yr, $translate.instant('MALMSTURM.'+bel.id));
    yr += LINE_HEIGHT;
    for (var j=0; j<bel.total; j++) {
      var runeX = LEFT_X_COL2 + 5 + j * 4.5 + Math.floor(j / 5) * 2;
      doc.addImage(imgRuneAlias, 'JPEG', runeX, yr - 3, 4, 3, imgRuneAlias);
    }
    yr += LINE_HEIGHT;
  }
  yr += LINE_HEIGHT;

  /* Konsequenzen */
  doc.text(LEFT_X_COL2, yr, $translate.instant('MALMSTURM.KONSEQUENZEN')+': ');
  doc.line(LEFT_X_COL2, yr + 1, RIGHT_X, yr + 1);
  yr += LINE_HEIGHT;
  for (var i=0; i< charData.konsequenzen.length; i++) {
    doc.text(LEFT_X_COL2, yr, $translate.instant('MALMSTURM.' + charData.konsequenzen[i])+":");
    for (var j = 0; j < 5; j++) {
      doc.line(LEFT_X_COL2, yr + 1, RIGHT_X, yr + 1);
      yr += LINE_HEIGHT;
    }
  }
  yr += LINE_HEIGHT;

  if (charData.beute > 0) {
    /* Beute */
    doc.text(LEFT_X_COL2, yr, $translate.instant('MALMSTURM.BEUTE')+': ');
    doc.line(LEFT_X_COL2, yr + 1, RIGHT_X, yr + 1);
    yr += LINE_HEIGHT;
    for (var i=0;i<charData.beute;i++) {
      var runeX = LEFT_X_COL2 + 5 + i * 4.5 + Math.floor(i / 5) * 2;
      doc.addImage(imgRuneAlias, 'JPEG', runeX, yr - 3, 4, 3, imgRuneAlias);
    }
    yr += LINE_HEIGHT;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  footer ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  // *** Einsatz von Schicksalspunkten ***
  var footerCols = charData.pdffooter.length;
  var colWidth = (RIGHT_X - LEFT_X) / footerCols;
  var maxHeaderLines = 1;
  var yf = BOTTOM_Y - 3 * LINE_HEIGHT;
  var footerLines = new Array(footerCols);
  doc.setFontSize(8);
  // collect the headers
  for (var i=0; i<footerCols; i++) {
    footerLines[i] = doc.splitTextToSize(charData.pdffooter[i].header, colWidth - 1);
    var headerLines = footerLines[i].length;
    if (headerLines > maxHeaderLines) {
      maxHeaderLines = headerLines;
    }
  }
  // add the content
  for (var i=0; i<footerCols; i++) {
    // expand the headers
    for (var j=footerLines[i].length-1; j<maxHeaderLines; j++) {
      footerLines[i].push("");
    }
    for (var j=0; j<charData.pdffooter[i].content.length; j++) {
      var contentLines = doc.splitTextToSize(charData.pdffooter[i].content[j], colWidth - 4);
      for (var k=0; k<contentLines.length; k++) {
        var line = contentLines[k];
        if (k==0) {
          line = "- "+line;
        } else {
          line = "   "+line;
        }
        footerLines[i].push(line);
      }
    }
    var newY = BOTTOM_Y - 3 * LINE_HEIGHT - footerLines[i].length * LINE_HEIGHT_8;
    if (newY > yf) {
      yf = newY;
    }
  }
  // print all lines
  for (var i=0; i<footerCols; i++) {
    doc.text(LEFT_X + i * colWidth, yf, footerLines[i]);
  }
  var lineYF = yf + (headerLines - 1) * LINE_HEIGHT_8 + 1;
  doc.line(LEFT_X, lineYF, RIGHT_X, lineYF);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  notizen ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* fill the space between left colum and footer*/
  // *** Notizen ***
  if (y < yf) {
    doc.setFontSize(11);
    doc.text(LEFT_X, y, 'Notizen:');
    for (;(y+LINE_HEIGHT) < yf; y += LINE_HEIGHT) {
      doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
    }
  }
  return doc;
};

var templateMalmsturm1_1LineBlock = function(doc, LEFT_X, RIGHT_X_COL1, y, title, contentArray) {
  doc.setFontSize(11);
  doc.text(LEFT_X, y, title);
  doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
  y += 11/2.54 + 2;
  for (var i=0; i<contentArray.length; i++) {
    var lines = doc.splitTextToSize(contentArray[i].name, RIGHT_X_COL1 - LEFT_X);
    doc.text(LEFT_X, y, lines);
    y += lines.length * 11/2.54 + 2;
  }
  y += 11/2.54 + 2;
  return y;
}