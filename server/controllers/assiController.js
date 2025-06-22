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

const CreateNewAssignment = async (req, res) => {
  const { title, description, deadline, year, branch, file_url, created_by, status } = req.body;

  console.log("Received assignment data:", {
    title, description, deadline, year, branch, file_url, created_by, status
  });

  // 1. Validate required fields
  if (!title || !description || !deadline || !year || !branch || !created_by) {
    return res.status(400).json({
      error: 'All required fields must be provided',
      required_fields: ['title', 'description', 'deadline', 'year', 'branch', 'created_by']
    });
  }

  // 2. Format deadline
  const formattedDeadline = formatToMySQLDateTime(deadline);
  if (!formattedDeadline) {
    return res.status(400).json({ error: 'Invalid deadline format. Expected: YYYY-MM-DDTHH:mm or valid ISO string.' });
  }

  // 3. SQL query
  const sql = `
    INSERT INTO assignments 
    (title, description, deadline, year, branch, file_url, created_by, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    title,
    description,
    formattedDeadline,
    year,
    branch,
    file_url || null,
    created_by,
    status || 'active'
  ];

  try {
    // 4. Execute query using promise-based syntax
    const [result] = await db.query(sql, values);

    return res.status(201).json({
      id: result.insertId,
      message: '✅ Assignment created successfully',
      assignment: {
        title,
        description,
        deadline: formattedDeadline,
        year,
        branch,
        file_url: file_url || null,
        created_by,
        status: status || 'active'
      }
    });

  } catch (error) {
    console.error('❌ Assignment creation error:', error);

    if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
      return res.status(400).json({ error: 'Invalid data format for one or more fields' });
    }

    return res.status(500).json({
      error: '❌ Failed to create assignment',
      details: error.message
    });
  }
};


// ✅ Get all assignments with optional filters
const GetAllAssignments=async (req, res) => {
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
}

// 🔍 Search assignment by title (case-insensitive partial match)
const SearchAssiByTitle=async (req, res) => {
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
}

// ✅ Get assignment by ID
const GetAssiById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM assignments WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Assignment not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
}

// ✅ Update assignment by ID
const UpdateAssiById=async (req, res) => {
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

    const [updated] = await db.execute('SELECT * FROM assignments1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Assignment updated', data: updated[0] });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
}

// ✅ Delete assignment by ID
const deleteAssiById=async (req, res) => {
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
}

// ✅ Update only assignment deadline by ID
const UpdateAssignmentDeadline = async (req, res) => {
  const { deadline } = req.body;

  if (!deadline) {
    return res.status(400).json({ error: 'Deadline is required' });
  }

  const formattedDeadline = formatToMySQLDateTime(deadline);

  try {
    const [result] = await db.execute(
      `UPDATE assignments SET deadline = ? WHERE id = ?`,
      [formattedDeadline, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const [updated] = await db.execute('SELECT * FROM assignments WHERE id = ?', [req.params.id]);

    res.json({ message: 'Deadline updated', data: updated[0] });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update deadline' });
  }
};

const getWorkloadCnt = async (req, res) => {

  const { branch, year, filterType = 'all' } = req.body;

  // Define condition string and parameters
  let dateCondition = '1=1'; // default = no filter
  if (filterType === 'today') {
    dateCondition = `DATE(datetime) = CURDATE()`;
  } else if (filterType === 'week') {
    dateCondition = `YEARWEEK(datetime, 1) = YEARWEEK(CURDATE(), 1)`;
  } else if (filterType === 'month') {
    dateCondition = `MONTH(datetime) = MONTH(CURDATE()) AND YEAR(datetime) = YEAR(CURDATE())`;
  } else {
    dateCondition = `datetime > NOW()`; // default: upcoming
  }

  try {
    // Assignments (assuming deadline column)
    const [assignmentRows] = await db.execute(
      `SELECT COUNT(*) AS count FROM assignments WHERE deadline > NOW()`
    );
    const assignmentCount = assignmentRows[0]?.count || 0;
    if (assignmentCount === 0) {
      return res.status(404).json({ message: "Assignments not found >> 00" });
    }

    console.log("Hii assi cnt :",assignmentCount);
    // Seminars (with date filter + optional branch/year logic)
    const [seminarRows] = await db.execute(
      `SELECT COUNT(*) AS count FROM seminars 
       WHERE ${dateCondition}
       ${branch ? 'AND branch = ?' : ''} 
       ${year ? 'AND year = ?' : ''}`,
      [branch, year].filter(Boolean)
    );
    const seminarCount = seminarRows[0]?.count || 0;
  console.log("Hii semi cnt :",seminarCount);
    return res.status(200).json({
      assignmentCount,
      seminarCount,
      filterType
    });

  } catch (err) {
    return res.status(500).json({ error: `Failed to fetch counts → ${err.message}` });
  }
};




module.exports={CreateNewAssignment,GetAllAssignments,SearchAssiByTitle,GetAssiById,UpdateAssiById,deleteAssiById,UpdateAssignmentDeadline,getWorkloadCnt};
