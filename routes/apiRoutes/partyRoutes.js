
const express = require('express');
const router  = express.Router();
const db      = require('../../db/database');

////////////////////////////////////////////////////////////////////////////////////////////
// Define the routes for the 'parties' table

// This will return all parties in the database.
// The 'all' method runs the SQL command and executes the call-back, with 
// matching data going to 'rows'.  'Rows' is the query response, an array of objects.
// This will return all the parties in the database.
router.get('/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    const params = [];                      // can be empty since there are no placeholders in the SQL statement
  
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });  // '500' indicates a server error
        return;
      }
  
      res.json({
        message: 'Successfully retrieved all rows from the parties table.',
        data: rows
      });
    });
  });
  
  
  ////////////////////////////////////////////////////////////////////////////////////////////
  // Return the data for a single party.
  router.get('/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
  
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'Successfully retrieved a party by ID.',
        data: row
      });
    });
  });
  
  
  ////////////////////////////////////////////////////////////////////////////////////////////
  // Delete a single party.
  router.delete('/party/:id', (req, res) => {
    // The 'id=?' is a placeholder in  prepared statement.  When defining this value in the 
    // 'params' optional parameter, SQLite3 'escapes' the values to prevent an injection attack.
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];                            // optional parameter to specify the 'id=?' prepared statement
  
    // Need to use ES5 'function' (instead of ES6) because we need to use the 'this' parameter.
    db.run(sql, params, function(err, result) {                // the 'run' method does not retrieve any result data, 
      if (err) {                                               //   'result' will be undefined here.
        res.status(400).json({ error: res.message });
        return;
      }
  
      res.json({ message: 'Party Successfully deleted', changes: this.changes });
    });
  });

  module.exports = router;