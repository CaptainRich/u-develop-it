

// Import the sqlite3 package

const sqlite3    = require( 'sqlite3' ).verbose();    // 'verbose' produces messages for us


////////////////////////////////////////////////////////////////////////////////////////////
// Setup the connection to the SQL database. This creates an object, an
// instance of the database file.

const db = new sqlite3.Database( './db/election.db', err => {
    if (err) {
      return console.error(err.message);
    }
  
    console.log('Connected to the election database.');
  });

///////////////////////////////////////////////////////////////////////////////////////////////
// Export the database connection object.

module.exports = db;