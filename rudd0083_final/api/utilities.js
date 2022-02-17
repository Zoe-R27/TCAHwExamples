// Zoe Rudd rudd0083

const express = require('express')
const router = express.Router()

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// Path module - provides utilities for working with file and directory paths.
const path = require('path');

// Helps in managing user sessions
const session = require('express-session');

// include the mysql module
var mysql = require('mysql');

var xml2js = require('xml2js');
// Bcrypt library for comparing password hashes
const bcrypt = require('bcrypt');

// connects to the database module
const connection = require('./dbConnection');
// console.log("connection " + connection);

/*
var connection = mysql.createConnection({
  host: "cse-mysql-classes-01.cse.umn.edu",
  user: "C4131S21U76",
  password: "5806",
  database: "C4131S21U76",
  port: 3306
});
*/
// console.log(connection);
// routes to login page if logged out, or to contacts page

// Logout and destory the session
router.get("/logout", function(req, res) {
	if (!req.session.value)
		res.redirect('/login');
    else {
		req.session.value = 0;
		req.session.destroy();
		res.redirect('/login');
	}
});

// Retrieves the contacts from the database
router.get('/getContacts', function(req, res) {
	if (req.session.value) {

		connection.get().query('SELECT * FROM tbl_contacts', function(err,rows,fields) {
			if (err) throw err;
			if (rows.length == 0)
				console.log("No entries in contacts table");
			else {
				var data = res.end(JSON.stringify(rows));
				// console.log(data);
			}
		});
	}

});

// Checks the login information sent from login page against the data in the database
router.post('/postLogin', function(req, res) {
	console.log(req.body);
	var loginInfo = req.body;
	var login = loginInfo.login;
	var pwd = loginInfo.password;
	// Query the database tbl_login with login and hashed password
	// Provided there is no error, and the results set is assigned to a variable named
	// dbConn.getConnection(function (err, connection) {
		// console.log(req);
	connection.get().query('SELECT * FROM tbl_accounts WHERE acc_login=?', [login], function(err,rows,fields) {
		if (err) throw err;
		console.log(rows[0]);
		if (rows.length == 1){  // the length should be 0 or 1, but this will work for now
			console.log(rows[0].acc_password);
			if (bcrypt.compareSync(pwd, rows[0].acc_password)) { // true

		   //success, set the session, return success
				req.session.user = login;
				req.session.value = 1;
				res.json({status: 'success'});
			}
			else {
				res.json({status: 'fail'});
			}
		}
		else {
			res.json({status: 'fail'});
		}
		// connection.release();
	});
	// });
});

router.get('/getLoginName', function(req, res){
  if (req.session.value) {
    res.send(req.session.user);
  }
});
// Receives information from addContact form and adds it to database
router.post('/postContact', function(req, res){
	if (req.session.value){
		// console.log(req.body);
		var info = req.body;
		var rowInsert = {
			name: info.name,
			category: info.cat,
			location: info.loc,
			contact_info: info.info,
			email: info.email,
			website: info.web,
			website_url: info.web
		};
    console.log("checking names because name is not primary key");

		// Check to see if name already exists in table
    connection.get().query('SELECT name FROM tbl_contacts', function(err, rows){
      if (err) throw err;
      var isIn = false;
      for (var i = 0; i < rows.length; i++){
				// Name is in the table
        if (rows[i].name === info.name){
          console.log("Duplicate Found");
          //res.json({flag: false});
          isIn = true;
        }
      }
			// If name not in table, add it
      if (!isIn) {
        connection.get().query('INSERT tbl_contacts SET ?', rowInsert, function(err, rows) {
    			if (err) throw err;
    			console.log("Values inserted");
    			res.json({flag: true});
    		});
    	}
    	else {
    		res.json({flag: false});
    	}

    });
    /*
    connection.get().query('INSERT tbl_contacts SET ?', rowInsert, function(err, rows) {
			if (err) throw err;
			console.log("Values inserted");
			res.json({flag: true});
		});
	}
	else {
		res.json({flag: false});
	}
*/
}
});

// Updates the infomation of a contact in the table based on the name
router.post('/updateContact', function(req, res) {
  if (req.session.value){
		 console.log("body " + req.body);
		var info = req.body;
		var rowInsert = [info.cat, info.loc, info.info, info.email, info.web, info.web, info.name];

		// Check to see if name is already in the table
    connection.get().query('SELECT name FROM tbl_contacts', function(err, rows){
      if (err) throw err;
      var isIn = false;
			// Name is in the table
      for (var i = 0; i < rows.length; i++){
        if (rows[i].name === info.name){
          isIn = true;
        }
      }

			// If name is not in table, name has been changed which is not allowed
      if (!isIn){
        console.log("Name does not exist, so changed");
        return res.json({flag: false});
      }
			// Name is in the table so not changed, can change the information
      else {
        console.log("Name not changed");
        var query = 'UPDATE tbl_contacts SET category=?, location=?, contact_info=?, email=?, website=?, website_url=? WHERE name=?';
        connection.get().query(query, rowInsert, function(err, rows) {
          if (err) throw err;
          console.log("Values updated");
          return res.json({flag: true});
         });
      }
    });

  }
	else {
		res.json({flag: false});
	}

});

// Deletes a contact from the database
router.post('/deleteContact', function(req, res) {
  if (req.session.value){
		 console.log("body " + req.body);
		var info = req.body;

		connection.get().query('DELETE FROM tbl_contacts WHERE name=?', [info.name], function(err, rows) {
			if (err) throw err;
			console.log("Value Deleted");
      res.json({flag: true});
		});
	}
	else {
		res.json({flag: false});
	}
});

// TODO: Add implementation for other necessary end-points

module.exports = router;
