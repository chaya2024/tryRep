const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

app.listen(3000, () => {
  console.log('Test server running on http://localhost:3000');
});