
// Import the required modules for the 'votes' table.

const express    = require('express');
const router     = express.Router();
const db         = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

//////////////////////////////////////////////////////////////////////////////////////
// Route to add a vote to the database

router.post('/vote', ({body}, res) => {

    // Data validation - neither ID (the voter or the candidate being voted on) can be blank
    const errors = inputCheck(body, 'voter_id', 'candidate_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
  
    // Prepare the terms for the SQL statement
    // The 'id=?' is a placeholder in  prepared statement.  When defining this value in the 
    // 'params' optional parameter, SQLite3 'escapes' the values to prevent an injection attack.
    const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)`;
    const params = [body.voter_id, body.candidate_id];         // optional parameter to specify the 'id=?' prepared statement
  
    // Execute the request
    db.run(sql, params, function(err, result) {                // the 'run' method does not retrieve any result data, 
      if (err) {                                               //   'result' will be undefined here.
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'Successfully added a vote.',
        data: body,
        id: this.lastID
      });
    });
  });


  
//////////////////////////////////////////////////////////////////////////////////////
// Route to sum the votes cast by candidate

router.get('/votes', (req, res) => {

    const sql = `SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id) AS count
FROM votes
LEFT JOIN candidates ON votes.candidate_id = candidates.id
LEFT JOIN parties ON candidates.party_id = parties.id
GROUP BY candidate_id ORDER BY count DESC`;
    const params = [];
  
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'Successfully counted votes.',
        data: rows
      });
    });
  });


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  module.exports = router;
