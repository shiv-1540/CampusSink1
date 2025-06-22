// routes/academicCalendar.js
const express = require("express");
const { jwtAuthMiddleware } = require("../middlewares/auth");
const { GetAllEvents, PostNewEvent, UpdateEvent, DeleteEvent } = require("../controllers/acaCalControllers");
const router = express.Router();


// ✅ GET all events
router.get("/", jwtAuthMiddleware,GetAllEvents);

// ✅ POST new event
router.post("/", jwtAuthMiddleware,PostNewEvent);

// ✅ PUT update event
router.put("/:id",jwtAuthMiddleware,UpdateEvent );

// ✅ DELETE event
router.delete("/:id", jwtAuthMiddleware,DeleteEvent);

module.exports = router;
