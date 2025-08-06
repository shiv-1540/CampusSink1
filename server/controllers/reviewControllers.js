const db=require('../db')

//Create a review 
const CreateReview= async (req, res) => {
  const { title, year, branch, date,description } = req.body;
  console.log(title,year, branch,date,description);
  
  try {
    const [result] = await db.execute(
      'INSERT INTO project_reviews (title, year, branch, date, completed,description) VALUES (?, ?, ?, ?, ?,?)',
      [title, year, branch, date, false,description]
    );
    res.status(201).json({ message: 'Review created successfully', id: result.insertId });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

//Get All Reviews
const GetAllReviews=async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM project_reviews');
    res.json(results);
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//Update a Review By Id 
const UpdateReviewById=async (req, res) => {
  const { id } = req.params;
  const { title, year, branch, date,description } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE project_reviews SET title = ?, year = ?, branch = ?, date = ?,description=? WHERE id = ?',
      [title, year, branch, date, description,id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review updated successfully' });
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//Mark Review as Completed 
const MarkReviewAsCompleted=async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      'UPDATE project_reviews SET completed = ? WHERE id = ?',
      [true, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review marked as completed' });
  } 
  catch (err) {
    res.status(500).json({ error: 'Failed to complete review' });
  }
}

//Delete a review By Id
const DeleteReviewById= async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM project_reviews WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports={CreateReview,GetAllReviews,UpdateReviewById,DeleteReviewById,MarkReviewAsCompleted}
