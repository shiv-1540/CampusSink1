const db = require('../db');

const getReportStats = async (req, res) => {
  try {
    const [students] = await db.query('SELECT COUNT(*) AS count FROM student');
    const [teachers] = await db.query('SELECT COUNT(*) AS count FROM teacher');
    const [departments] = await db.query('SELECT COUNT(*) AS count FROM department');
    const [seminars] = await db.query('SELECT COUNT(*) AS count FROM seminars');
    const [assignments] = await db.query('SELECT COUNT(*) AS count FROM assignments');
    const [reviews] = await db.query('SELECT COUNT(*) AS count FROM project_reviews');

    return res.json({
      students: students[0].count,
      teachers: teachers[0].count,
      departments: departments[0].count,
      seminars: seminars[0].count,
      assignments: assignments[0].count,
      reviews: reviews[0].count
    });
  } catch (err) {
    console.error('Error fetching report stats:', err);
    return res.status(500).json({ error: 'Failed to fetch report statistics' });
  }
};

module.exports = {
  getReportStats
};
