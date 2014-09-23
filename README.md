
How to create a new module:

 * Add a new entry to webapp/app/app.js
    * You need a short unique <id> only containing lower case a-z
	* A name
	* if you want to allow custom configurations (you should do it)
 * Create the <id>.html
    * use another html page as template (e.g. malmsturm.html)
 * Create a logo into webapp/app/images/<id>/logo.jpg
    * image height should be 200px
	* and the width maximum 600px
 * Add the module scripts to webapp/app/scripts/<id>/
 * locale.js must use <id> as prefix (uppercase)
 * pdf.?.js
    * must register for the <id>
    * the second parameter is the method name
	* the API is TODO
 * You should add <div or-shares></div> if you want to implement sharing characters
 * Your page MUST have the navigation and footer part (check other pages)
 * in the locale.js you need a block DEFAULT_EMPTY_CONFIG_BLOCK with the default configuration
   * at least with the fields docId="", file_version=1 and pdftemplate="registeredName"
   * for a nice format, separate ech line with \n\ as you can see in other module-locale.js
 * Every variable that should be saved must be in context openrole --> openrole.charactername
