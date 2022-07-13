const passport = require('passport');
const passportLocal = require('passport-local');
const connection = require('./dbsql')
const dotenv = require('dotenv');
const conn = require('./dbsql');
//-----------------------------------
const dbname = process.env.DB_NAME;
const tablename = process.env.TABLE_NAME;
//-----------------------------------


customFields = {
    usernameField: 'uname',
    passwordField: 'pword' //or whatever you will be calling the username and password in the JSON reqs that are sent
}; //this allows passport-local to know where to look for the username and password field
// verifyCallback = (username, password, done)=>{//doesn't matter what database you choose or how you verify the credentials, all that matters is that the return values that you provide to the return callback are what passport expects


//     connection.query((`SELECT * FROM ${tablename} WHERE username="${uname}" AND password="${pword}"`), (err, results, fields) => {
//         if (err) return done(err);
//         if (results.length <= 0) {
//             return done(null,false);// null->no error | false->error wasn't found
//         }
//         else {
//             return done(null,true)
//         }
//     })
// }
verifyCallback = (username, password, done) => {
    connection.query('SELECT * FROM users WHERE username = ?', [username], function (err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

        crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, row);
        });
    });
}






const strategy = new LocalStrategy(customFields, verifyCallback);


//-----------------------------------
module.exports = strategy