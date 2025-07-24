const db = require("../db");

//Get All Events 
const GetAllEvents=async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM academic_calendar ORDER BY date ASC");
    res.json(rows);
  } 
  catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
}

//Post a new Event
const PostNewEvent=async (req, res) => {
  const { title, description, type, date } = req.body;
  try {
    const formattedDate = new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
    await db.query(
      "INSERT INTO academic_calendar (title, description, type, date) VALUES (?, ?, ?, ?)",
      [title, description, type, formattedDate]
    );
    res.status(201).json({ message: "Event added successfully" });
  } 
  catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ error: "Failed to add event" });
  }
}

//Update a event
const UpdateEvent=async (req, res) => {
  const { id } = req.params;
  const { title, description, type, date } = req.body;
  try {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    await db.query(
      "UPDATE academic_calendar SET title = ?, description = ?, type = ?, date = ? WHERE id = ?",
      [title, description, type, formattedDate, id]
    );
    res.json({ message: "Event updated successfully" });
  } 
  catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
}

//Delete a Event 
const DeleteEvent=async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM academic_calendar WHERE id = ?", [id]);
    res.json({ message: "Event deleted successfully" });
  } 
  catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
}

module.exports={GetAllEvents,PostNewEvent,UpdateEvent,DeleteEvent};
