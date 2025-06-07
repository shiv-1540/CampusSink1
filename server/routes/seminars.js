const express = require('express');
const router = express.Router();
const db = require('../db');

// Create Seminar
router.post('/', async (req, res) => {
  const { title, description, date, time, venue, speaker, branch, year } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO seminars (title, description, date, time, venue, speaker, branch, year)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, date, time, venue, speaker, branch, year]
    );
    res.status(201).json({ id: result.insertId, message: 'Seminar created successfully' });
  } catch (error) {
    console.error('Create Seminar Error:', error);
    res.status(500).json({ error: 'Failed to create seminar' });
  }
});

// Get All Seminars
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM seminars ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    console.error('Fetch Seminars Error:', error);
    res.status(500).json({ error: 'Failed to fetch seminars' });
  }
});

// Get Seminar by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM seminars WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Seminar not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch Seminar by ID Error:', error);
    res.status(500).json({ error: 'Failed to fetch seminar' });
  }
});

// Update Seminar by ID
router.put('/:id', async (req, res) => {
  const { title, description, date, time, venue, speaker, branch, year } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE seminars 
       SET title = ?, description = ?, date = ?, time = ?, venue = ?, speaker = ?, branch = ?, year = ?
       WHERE id = ?`,
      [title, description, date, time, venue, speaker, branch, year, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Seminar not found' });
    }

    res.json({ message: 'Seminar updated successfully' });
  } catch (error) {
    console.error('Update Seminar Error:', error);
    res.status(500).json({ error: 'Failed to update seminar' });
  }
});

// Delete Seminar by ID
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM seminars WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Seminar not found' });
    }

    res.json({ message: 'Seminar deleted successfully' });
  } catch (error) {
    console.error('Delete Seminar Error:', error);
    res.status(500).json({ error: 'Failed to delete seminar' });
  }
});

module.exports = router;
