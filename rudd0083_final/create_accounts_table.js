/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/
// mysql://bd2c45c87c32f9:ad2f3e90@us-cdbr-east-03.cleardb.com/heroku_02c5269b9d2e472?reconnect=true
// Given to me from my professor
const mysql = require("mysql");

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

    const sql = `CREATE TABLE tbl_accounts (
        acc_id       INT NOT NULL AUTO_INCREMENT,
        acc_name     VARCHAR(20),
        acc_login    VARCHAR(20),
        acc_password VARCHAR(200),
        PRIMARY KEY (acc_id)
    )`;

    console.log("Attempting to create table: tbl_accounts");
    dbCon.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("Table tbl_accounts created");
    });

    dbCon.end();
});
