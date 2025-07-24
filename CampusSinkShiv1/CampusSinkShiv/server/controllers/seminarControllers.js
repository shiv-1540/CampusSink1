const db=require('../db');


// Helper to validate required fields
const isValidSeminar = (data) => {
  const requiredFields = ['title', 'description', 'datetime', 'venue', 'speaker', 'branch', 'year', 'mode'];
  return requiredFields.every(field => data[field] && data[field].toString().trim() !== '');
};

// 01 Create a new Seminar
const CreateSeminar =async (req, res) => {
  const {
    title, description, datetime,
    venue, speaker, branch, year,
    mode, link
  } = req.body;

  if (!isValidSeminar(req.body)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO seminars 
       (title, description, datetime, venue, speaker, branch, year, mode, link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, datetime, venue, speaker, branch, year, mode, link || '']
    );
    res.status(201).json({ id: result.insertId, message: 'Seminar created successfully' });
  } catch (error) {
    console.error('Create Seminar Error:', error);
    res.status(500).json({ error: `Failed to create seminar ${error.message}`});
  }
}

//Get All Seminars 
const GetAllSeminars = async (_req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM seminars ORDER BY datetime DESC');
    res.json(rows);
  } catch (error) {
    console.error('Fetch Seminars Error:', error);
    res.status(500).json({ error: 'Failed to fetch seminars' });
  }
};


//Get Seminar By Id
const GetSeminarById=async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM seminars WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Seminar not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch Seminar by ID Error:', error);
    res.status(500).json({ error: 'Failed to fetch seminar' });
  }
}

const UpdateSeminarById = async (req, res) => {
  const {
    title, description, datetime,
    venue, speaker, branch, year,
    mode, link
  } = req.body;

  // ✅ Validation check
  if (!title || !description || !datetime || !venue || !speaker || !branch || !year || !mode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE seminars 
       SET title = ?, description = ?, datetime = ?, venue = ?, speaker = ?, branch = ?, year = ?, mode = ?, link = ?
       WHERE id = ?`,
      [
        title,
        description,
        datetime,
        venue,
        speaker,
        branch,
        year,
        mode,
        mode === 'online' ? link : '', // 🔄 Only include link if mode is online
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Seminar not found' });
    }

    res.json({ message: '✅ Seminar updated successfully' });

  } catch (error) {
    console.error('❌ Update Seminar Error:', error);
    res.status(500).json({ error: 'Failed to update seminar' });
  }
};


//Delete Seminar By Id
const DeleteSeminarById =async (req, res) => {
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
}

module.exports={CreateSeminar,GetAllSeminars,GetSeminarById,DeleteSeminarById,UpdateSeminarById};

