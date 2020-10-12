

// Import the required modules
const express    = require('express');
const router     = express.Router();
const db         = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

//////////////////////////////////////////////////////////////////////////////////////

router.get('/voters', (req, res) => {
    const sql = `SELECT * FROM voters ORDER BY last_name`;
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

//////////////////////////////////////////////////////////////////////////////////////
router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
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
  
////////////////////////////////////////////////////////////////////////////////////
// Route routine to add voters

  router.post('/voter', ({ body }, res) => {

    // Make sure there are no blank records being added.
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');

    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }

    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.email];
  
    db.run(sql, params, function(err, data) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'Successfully added voter.',
        data: body,
        id: this.lastID
      });
    });
  });

////////////////////////////////////////////////////////////////////////////////////
// Route routine to allow voters to update their email address
router.put('/voter/:id', (req, res) => {

  // Validate incoming data
  const errors = inputCheck(req.body, 'email');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  // Prepare statement
  const sql = `UPDATE voters SET email = ? WHERE id = ?`;
  const params = [req.body.email, req.params.id];

  // Execute
  db.run(sql, params, function(err, data) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'Successfully updated email address.',
      data: req.body,
      changes: this.changes
    });
  });
});


////////////////////////////////////////////////////////////////////////////////////
// Route routine to allow voters to delete their entry from the database.
router.delete('/voter/:id', (req, res) => {

  const sql = `DELETE FROM voters WHERE id = ?`;

  db.run(sql, req.params.id, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({ message: 'Deleted voter.', changes: this.changes });
  });
});


  module.exports = router;