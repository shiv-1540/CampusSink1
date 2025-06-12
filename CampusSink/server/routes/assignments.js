const express = require('express');
const router = express.Router();
const db = require('../db');

// Convert ISO to MySQL DATETIME
function formatToMySQLDateTime(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  const pad = (n) => (n < 10 ? '0' + n : n);
  return (
    date.getFullYear() + '-' +
    pad(date.getMonth() + 1) + '-' +
    pad(date.getDate()) + ' ' +
    pad(date.getHours()) + ':' +
    pad(date.getMinutes()) + ':' +
    pad(date.getSeconds())
  );
}

// ✅ Create new assignment
router.post('/', async (req, res) => {
  const { title, description, deadline, year, branch, file_url, created_by, status } = req.body;

  if (!title || !description || !deadline || !year || !branch || !created_by) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  const formattedDeadline = formatToMySQLDateTime(deadline);

  try {
    const [result] = await db.execute(
      `INSERT INTO assignments (title, description, deadline, year, branch, file_url, created_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, formattedDeadline, year, branch, file_url, created_by, status || 'active']
    );
    res.status(201).json({ id: result.insertId, message: 'Assignment created' });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// ✅ Get all assignments with optional filters
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM assignments';
    const filters = [];
    const values = [];

    if (req.query.year) {
      filters.push('year = ?');
      values.push(req.query.year);
    }
    if (req.query.branch) {
      filters.push('branch = ?');
      values.push(req.query.branch);
    }

    if (filters.length > 0) {
      query += ' WHERE ' + filters.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.execute(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// 🔍 Search assignment by title (case-insensitive partial match)
router.get('/search', async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: 'Title query parameter is required' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT * FROM assignments WHERE LOWER(title) LIKE LOWER(?)`,
      [`%${title}%`]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No assignments found with that title' });
    }

    res.json(rows); // return all matching results
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search assignments' });
  }
});

// ✅ Get assignment by ID
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
  const formattedDeadline = formatToMySQLDateTime(deadline);

  try {
    const [result] = await db.execute(
      `UPDATE assignments 
       SET title = ?, description = ?, deadline = ?, year = ?, branch = ?, file_url = ?, status = ? 
       WHERE id = ?`,
      [title, description, formattedDeadline, year, branch, file_url, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const [updated] = await db.execute('SELECT * FROM assignments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Assignment updated', data: updated[0] });
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
