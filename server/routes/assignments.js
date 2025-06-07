const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Create new assignment
router.post('/', async (req, res) => {
  const { title, description, deadline, year, branch, file_url, created_by, status } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO assignments (title, description, deadline, year, branch, file_url, created_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, deadline, year, branch, file_url, created_by, status || 'active']
    );
    res.status(201).json({ id: result.insertId, message: 'Assignment created' });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// ✅ Get all assignments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM assignments ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// ✅ Get a specific assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM assignments WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Assignment not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// ✅ Update assignment by ID
router.put('/:id', async (req, res) => {
  const { title, description, deadline, year, branch, file_url, status } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE assignments 
       SET title = ?, description = ?, deadline = ?, year = ?, branch = ?, file_url = ?, status = ? 
       WHERE id = ?`,
      [title, description, deadline, year, branch, file_url, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json({ message: 'Assignment updated' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// ✅ Delete assignment by ID
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM assignments WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

module.exports = router;
