/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

const mysql = require("mysql");
const bcrypt = require('bcrypt');

const dbCon = mysql.createConnection({
    host: "us-cdbr-east-03.cleardb.com",
    user: "bd2c45c87c32f9",               // replace with the database user provided to you
    password: "ad2f3e90",                  // replace with the database password provided to you
    database: "heroku_02c5269b9d2e472",           // replace with the database user provided to you
    port: 3306
});

console.log("Attempting database connection");
dbCon.connect(function (err) {
    if (err) {
        throw err;
    }

    console.log("Connected to database!");

    const saltRounds = 10;
    const myPlaintextPassword = 'admin%'; // replace with password chosen by you OR retain the same value
    const passwordHash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

    const rowToBeInserted = {
        acc_name: 'admin$',            // replace with acc_name chosen by you OR retain the same value
        acc_login: 'admin$',           // replace with acc_login chosen by you OR retain the same value
        acc_password: passwordHash
    };

    console.log("Attempting to insert record into tbl_accounts");
    dbCon.query('INSERT tbl_accounts SET ?', rowToBeInserted, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("Table record inserted!");
    });

    dbCon.end();
});
