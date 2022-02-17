// Zoe Rudd rudd0083

// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT
const createError = require('http-errors');

// Include the express module
const express = require('express');

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// Path module - provides utilities for working with file and directory paths.
const path = require('path');

// Helps in managing user sessions
const session = require('express-session');

// include the mysql module
var mysql = require('mysql');

// Bcrypt library for comparing password hashes
const bcrypt = require('bcrypt');

// Include the express router.
const utilities = require('./api/utilities.js');
// console.log(utilities);
const port = 9001;

var xml2js = require('xml2js');
// create an express application
const app = express();

// const connection = require('./api/dbConnection.js');

/*
var connection = mysql.createConnection({
  host: "cse-mysql-classes-01.cse.umn.edu",
  user: "C4131S21U76",
  password: "5806",
  database: "C4131S21U76",
  port: 3306
});
*/
// Use express-session
// In-memory session is sufficient for this assignment
app.use(session({
        secret: "csci4131secretkey",
        saveUninitialized: true,
        resave: false
    }
));

// middle ware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// server listens on port 9002 for incoming connections
// app.listen(port, () => console.log('Listening on port', port));
app.listen(process.env.PORT || port,
 () => console.log('Listening...'));
 
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/welcome.html'));
});

// GET method route for the contacts page.
// It serves contact.html present in public folder
app.get('/contacts', function(req, res) {
    if (!req.session.value){
		res.redirect('/login');
	}
	else {
		res.sendFile(path.join(__dirname, 'public/contacts.html'));
	}
});

// routes to addContact page if logged in, or to login page
app.get('/addContact', function(req, res) {
	if (!req.session.value){
		res.redirect('/login');
	}
	else {
		res.sendFile(path.join(__dirname, 'public/addContact.html'));
	}
});

// routes to stock page if logged in, or to login page if not
app.get('/stock', function(req, res) {
	if (!req.session.value){
		res.redirect('/login');
	}
	else {
    res.sendFile(path.join(__dirname, 'public/stock.html'));
	}
});

// routes to login page or if logged in, to contacts page
app.get('/login', function(req, res) {
	if (!req.session.value){
		res.sendFile(path.join(__dirname, 'public/login.html'));
	}
	else {
		res.redirect('/contacts');
	}

});

// index = html pages
// utilities = everything else/json/sql

//These functions should be moved to utilties, but don't know how
app.use(bodyparser.urlencoded({extended: true}));


// TODO: Add implementation for other necessary end-points

// Makes Express use a router called utilities
app.use('/api', utilities);

// function to return the 404 message and error to client
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    res.send();
});
