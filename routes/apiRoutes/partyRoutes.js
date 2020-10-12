
const express = require('express');
const router  = express.Router();
const db      = require('../../db/database');

////////////////////////////////////////////////////////////////////////////////////////////
// Define the routes for the 'parties' table

// This will return all parties in the database.
router.get('/parties', (req, res) => {
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
  router.get('/party/:id', (req, res) => {
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
  router.delete('/party/:id', (req, res) => {
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

  module.exports = router;