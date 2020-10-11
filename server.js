

// Import the 'express' module and the sqlite3 package

const sqlite3 = require( 'sqlite3' ).verbose();
const express = require( 'express' );
const PORT    = process.env.PORT || 3001;
const app     = express();

// Add the necessary 'middleware'

app.use(express.urlencoded( { extended: false } ));
app.use(express.json());


// Setup the connection to the SQL database. This creates an object, an
// instance of the database file.

const db = new sqlite3.Database( './db/election.db', err => {
    if (err) {
      return console.error(err.message);
    }
  
    console.log('Connected to the election database.');
  });

// Specific routes go here, before the "catch-all 404" response.


// The 'all' method runs the SQL command and executes the call-back, with 
// matching data going to 'rows'.  'Rows' is the query response, an array of objects.
// This will return all the candidates in the database.

app.get('/api/candidates', (req, res) => {        // 'api' indicates this is an API endpoint
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'Success',
        data: rows
      });
    });
  });

// GET the data for a single candidate based on their ID
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'Success',
        data: row
      });
    });
  });


// Delete a candidate from the database, based on their ID
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
  
      res.json({
        message: 'Successfully deleted',
        changes: this.changes
      });
    });
  });


// Create a record for a new candidate.
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];

// ES5 function is necessary, not an arrow function, to use 'this'
db.run(sql, params, function(err, result) {
  if (err) {
    console.log(err);
  }
  console.log(result, this.lastID);
});



  // Address non-supported requests
  app.use((req, res) => {
    res.status(404).end();
  });




// Start the express.js Server on port 3001.  Need to make sure this starts after 
// the database connection is established - put this in an event handler.

db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});