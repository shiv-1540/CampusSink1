const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test the database connection using async/await
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected to the database!');
    connection.release(); // always release the connection
  } catch (err) {
    console.error('❌ Error connecting to the database:', err.message);
  }
})();

module.exports = db;



// const mysql = require('mysql2');
// const dotenv = require('dotenv');
// dotenv.config();

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });


// db.connect((err) => {
// if (err) {
//    console.error('DB Connection Failed:', err.message);
// } else {
//    console.log('✅ MySQL Connected to', process.env.DB_NAME);
// }
// });

// module.exports = db;
