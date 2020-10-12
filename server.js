

// Import the 'express' module and the sqlite3 package

const sqlite3    = require( 'sqlite3' ).verbose();
const express    = require( 'express' );
const inputCheck = require( './utils/inputCheck' );    // import the validation routine

const PORT       = process.env.PORT || 3001;
const app        = express();

// Add the necessary 'middleware'

app.use(express.urlencoded( { extended: false } ));
app.use(express.json());


////////////////////////////////////////////////////////////////////////////////////////////
// Setup the connection to the SQL database. This creates an object, an
// instance of the database file.

const db = new sqlite3.Database( './db/election.db', err => {
    if (err) {
      return console.error(err.message);
    }
  
    console.log('Connected to the election database.');
  });


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
// Specific routes go here, before the "catch-all 404" response.


// The 'all' method runs the SQL command and executes the call-back, with 
// matching data going to 'rows'.  'Rows' is the query response, an array of objects.
// This will return all the candidates in the database.

app.get('/api/candidates', (req, res) => {        // 'api' indicates this is an API endpoint
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id`;

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


////////////////////////////////////////////////////////////////////////////////////////////
// GET the data for a single candidate based on their ID
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id 
                WHERE candidates.id = ?`;

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


////////////////////////////////////////////////////////////////////////////////////////////
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
        message: 'Candidate successfully deleted',
        changes: this.changes
      });
    });
  });


////////////////////////////////////////////////////////////////////////////////////////////  
// Create a record for a new candidate.

app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    // ES5 function syntax, not arrow function, necessary to use `this`
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: 'Success',
            data: body,
            id: this.lastID
        });
    });
});


////////////////////////////////////////////////////////////////////////////////////////////
// Update a candidate's data
app.put('/api/candidate/:id', (req, res) => {

  // Make sure the party_id was specified.
  const errors = inputCheck(req.body, 'party_id');

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE candidates SET party_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];

  // As above, the ES5 'function' is used because we employ 'this'.
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'Successful update of party_id ',
      data: req.body,
      changes: this.changes
    });
  });
});


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
// Define the routes for the 'parties' table

// This will return all parties in the database.
app.get('/api/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
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


////////////////////////////////////////////////////////////////////////////////////////////
// Return the data for a single party.
app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
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


////////////////////////////////////////////////////////////////////////////////////////////
// Delete a single party.
app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];

  // Need to use ES5 'function' (instead of ES6) because we need to use the 'this' parameter.
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({ message: 'Party Successfully deleted', changes: this.changes });
  });
});



////////////////////////////////////////////////////////////////////////////////////////////
// Address non-supported requests
app.use((req, res) => {
    res.status(404).end();
});



////////////////////////////////////////////////////////////////////////////////////////////
// Start the express.js Server on port 3001.  Need to make sure this starts after 
// the database connection is established - put this in an event handler.

db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});