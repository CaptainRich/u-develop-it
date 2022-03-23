
// Routes for the "candidates' table.

const express    = require('express');
const router     = express.Router();
const db         = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');   // function to verify data when adding a candidate

///////////////////////////////////////////////////////////////////////////////////////////////////////
// The 'all' method runs the SQL command and executes the call-back, with 
// matching data going to 'rows'.  'Rows' is the query response, an array of objects.
// This will return all the candidates in the database.

router.get('/candidates', (req, res) => {               // 'api' (mapped to 'router') indicates this is an API endpoint
    // This SQL statement adds a candidates party name to the response, from the 'parties' table.
    // The "AS" parameter provides and alias for the 'parties.name' column
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id`;

    const params = [];                                  // can be empty since there are no placeholders in the SQL statement
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });   // '500' indicates a server error
        return;
      }
  
      // Return the retrieved data in 'rows'.
      res.json({
        message: 'Successfully retrieved all rows from the candidates table.',
        data: rows
      });
    });
  });


////////////////////////////////////////////////////////////////////////////////////////////
// GET the data for a single candidate based on their ID
router.get('/candidate/:id', (req, res) => {
    // This SQL statement adds a candidates party name to the response, from the 'parties' table, for a specific candidate id
    // The "AS" parameter provides and alias for the 'parties.name' column
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
router.delete('/candidate/:id', (req, res) => {

    // The 'id=?' is a placeholder in  prepared statement.  When defining this value in the 
    // 'params' optional parameter, SQLite3 'escapes' the values to prevent an injection attack.
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];                          // optional parameter to specify the 'id=?' prepared statement

    db.run(sql, params, function(err, result) {              // the 'run' method does not retrieve any result data, 
      if (err) {                                             //   'result' will be undefined here.
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

// Use object destructuring here to pull the 'body' property out of the 'req' (request).
router.post('/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;
    // optional parameters to specify the '?,?,?' prepared statement
    const params = [body.first_name, body.last_name, body.industry_connected];

    // ES5 function syntax, not arrow function, necessary to use `this`
    db.run(sql, params, function (err, result) {           // The 'run' method does not retrieve data to 'result'.
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: 'Success, candidate added.',
            data: body,
            id: this.lastID
        });
    });
});


////////////////////////////////////////////////////////////////////////////////////////////
// Update a candidate's data
router.put('/candidate/:id', (req, res) => {

  // Make sure the party_id was specified.
  const errors = inputCheck(req.body, 'party_id');

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE candidates SET party_id = ? 
               WHERE id = ?`;
  // Optional parameters to specify the '?,?' prepared statement   
  // Here the 'row id' should b part of the route (params), while the data being updated is part of the body.          
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

module.exports = router;
