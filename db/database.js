

// Import the 'express' module and the sqlite3 package

const sqlite3    = require( 'sqlite3' ).verbose();


////////////////////////////////////////////////////////////////////////////////////////////
// Setup the connection to the SQL database. This creates an object, an
// instance of the database file.

const db = new sqlite3.Database( './db/election.db', err => {
    if (err) {
      return console.error(err.message);
    }
  
    console.log('Connected to the election database.');
  });

module.exports = db;