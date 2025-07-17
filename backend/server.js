const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config');
const authRoutes = require('./routes/auth');
const roundRoutes = require('./routes/rounds');
const courseRoutes = require('./routes/courses');
const utilityRoutes = require('./routes/utility');

// Load .env file with explicit path
const result = dotenv.config({ path: path.join(__dirname, '.env') });
console.log('Dotenv result:', result);
console.log('Current directory:', __dirname);

// Set environment variables directly if .env loading fails
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb+srv://mattmayerr:%21Buster1326@cluster0.at5rajz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  console.log('Set MONGO_URI directly');
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
  console.log('Set JWT_SECRET directly');
}

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/utility', utilityRoutes);

app.get('/', (req, res) => {
  res.send('Golf App API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 