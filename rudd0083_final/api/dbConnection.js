// Zoe Rudd rudd0083

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');
// fs module - provides an API for interacting with the file system
var fs = require("fs");
// required for reading XML files
var xml2js = require('xml2js');

var parser = new xml2js.Parser();

// include the mysql module
var mysql = require('mysql');

var theinfo;
var dbCon;
fs.readFile(__dirname + '/dbconfig.xml', function(err, data) {
	if (err) throw err;
	// console.log("data: \n" + data);
    parser.parseString(data, function (err, result) {
		if (err) throw err;
		// console.log("The host: " + result.dbconfig.user[0]);
        theinfo = result;

	});
	// console.log(theinfo);
	dbCon = mysql.createConnection({
		host: theinfo.dbconfig.host[0],
		user: theinfo.dbconfig.user[0],
		password: theinfo.dbconfig.password[0],
		database: theinfo.dbconfig.database[0],
		port: theinfo.dbconfig.port[0]
	});

});
module.exports = {
	get() {
		return dbCon;
	}
}
//console.log(module);
