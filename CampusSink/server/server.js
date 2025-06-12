const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const assignmentRoutes = require("./routes/assignments");
const seminarsRoute = require("./routes/seminars");

const app = express();
const PORT = 5000; // Unified port

// Middleware
app.use(cors());
app.use(bodyParser.json()); // You can also use: app.use(express.json())

// Firebase Admin Initialization
const serviceAccount = require("./campusink-firebase-adminsdk-fbsvc-c9ed6af2f3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🔹 Signup Route
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 🔻 Add role field here:
    await usersRef.add({
      name,
      email,
      password: hashedPassword,
      role: "student", // or determine from frontend input
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔹 Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", user: userData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// 🔹 Other Routes
app.use("/api/assignments", assignmentRoutes);
app.use("/api/seminars", seminarsRoute);

// 🔹 Server Start
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
