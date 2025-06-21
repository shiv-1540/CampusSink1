const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");

const authRoutes=require('./routes/authRoutes');
const adminRoutes=require('./routes/adminRoutes');
const assiRoutes=require('./routes/assiRoutes');
const semiRoutes=require('./routes/semiRoutes');
const reviewRoutes=require('./routes/reviewsRoutes');


const app = express();
const PORT = 5000;


const allowedOrigins=['http://localhost:5173','https://campus-sink.vercel.app']

const corsOptions={
  origin:function (origin,callback){
    if(allowedOrigins.length!==-1 || !origin){
      callback(null,true);
    } 
    else{
      callback(new Error('Not Allowed by CORS'))
    }
  },
  credentials:true,
}
// Middleware
// Allow requests from frontend (localhost:5173)
// app.use(
//   cors({
//     origin: "https://campus-sink.vercel.app", // Your frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true, // If using cookies/sessions
//   })
// );

app.use(cors(corsOptions));


app.use(bodyParser.json());


// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Routes
app.use("/api/auth",authRoutes);
app.use("/api/assignments",assiRoutes);
app.use("/api/seminars",semiRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/reviews",reviewRoutes);

// 🔹Starting the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
