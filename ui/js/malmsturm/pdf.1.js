
function templateMalmsturm1(charData, imageLoaded) {
    var doc = new jsPDF();

// border
    var pageSize = doc.internal.pageSize;
    var LEFT_X = 8;
    var TOP_Y = 6;
    var RIGHT_X = pageSize.width - LEFT_X * 2;
    var RIGHT_X_COL1 = (RIGHT_X - LEFT_X) / 3 * 2;
    var BOTTOM_Y = pageSize.height - TOP_Y * 2;
    var LINE_HEIGHT = 6;

// Malmsturm Logo
    doc.addImage(imageLoaded[0], 'JPEG', 115, 2, 90, 45);
//doc.rect(LEFT_X, TOP_Y, RIGHT_X, BOTTOM_Y);

    doc.setFontSize(11);
    doc.setFont("times");
    doc.setFontType("italic");
// *** Character name ***
    var y = TOP_Y + LINE_HEIGHT;
    doc.text(LEFT_X, y, 'Spielerfigur: '+ charData.charactername);
    doc.line(LEFT_X, y + 1, 110, y + 1);
    y += LINE_HEIGHT + LINE_HEIGHT;

// *** Skills ***
    doc.text(LEFT_X, y, 'Fertigkeiten: ');
    doc.line(LEFT_X, y + 1, 110, y + 1);
    y += LINE_HEIGHT;

    doc.setFontSize(9);
    for (var i = 0; i < charData.skillpyramid.length; i++) {
        var lvl = charData.CONFIG.skillpyramidstartvalue - i;
        if (lvl > 0) {
            lvl = "+"+lvl;
        } else if (lvl == 0) {
            lvl = "+/-0";
        } else {
            lvl = ""+lvl;
        }
        doc.text(LEFT_X, y, lvl + " " + charData.CONFIG.stufenleiter[charData.CONFIG.skillpyramidstartvalue - i]);
        doc.addImage(imageLoaded[1], 'JPEG', 36, y - 3, 4, 3 ,"rune");
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
        }
        doc.line(LEFT_X, y + 3, 35 + charData.skillpyramid[i].length * slotWidth, y + 3);
        y += LINE_HEIGHT + 2;
    }
    y += LINE_HEIGHT;

// *** Aspects ***
    doc.setFontSize(11);
    doc.text(LEFT_X, y, 'Aspekte: ');
    doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
    y += LINE_HEIGHT;
// content
    y += LINE_HEIGHT;


// *** Talente & Gaben ***
    doc.setFontSize(11);
    doc.text(LEFT_X, y, 'Talente und Gaben: ');
    doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
    y += LINE_HEIGHT;
// content
    y += LINE_HEIGHT;


// *** Waffen und Rüstungen ***
    doc.setFontSize(11);
    doc.text(LEFT_X, y, 'Waffen und Rüstungen: ');
    doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
    y += LINE_HEIGHT;
// content
    y += LINE_HEIGHT;


// *** Schicksalspunkte ***
    doc.setFontSize(11);
    doc.text(LEFT_X, y, 'Schicksalspunkte: ');
    doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
    y += LINE_HEIGHT;
// content
    y += LINE_HEIGHT;


// *** Stufenleiter ***
    doc.setFontSize(11);
    doc.text(LEFT_X, y, 'Stufenleiter: ');
    doc.line(LEFT_X, y + 1, RIGHT_X_COL1, y + 1);
    y += LINE_HEIGHT;

    var stufenleit = charData.CONFIG.stufenleiter;
    var strows = Math.ceil((charData.CONFIG.stufenleiterend - charData.CONFIG.stufenleiterstart + 1) / 3);
    for (var st=charData.CONFIG.stufenleiterstart, idx=0;
         st <= charData.CONFIG.stufenleiterend; st++, idx++) {
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

    return doc;
};