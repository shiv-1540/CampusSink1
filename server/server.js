const express = require('express');
const app = express();
const PORT = 3000;

const assignmentRoutes = require('./routes/assignments');
const seminarsRoute = require('./routes/seminars');
app.use(express.json());
app.use('/api/assignments', assignmentRoutes);
app.use('/api/seminars', seminarsRoute);



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
