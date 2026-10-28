const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('./models/Book');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/books', async (req, res, next) => {
  try {
    const books = await Book.find().sort({ bookId: 1 });
    res.json(books);
  } catch (error) {
    next(error);
  }
});

app.get('/api/books/:bookId', async (req, res, next) => {
  try {
    const book = await Book.findOne({ bookId: req.params.bookId });

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.json(book);
  } catch (error) {
    next(error);
  }
});

app.post('/api/books', async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: 'A book with this ID or ISBN already exists.' });
  }

  console.error('Request failed:', error);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

const startServer = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is required. Configure it in backend/.env.');
  }

  await mongoose.connect(uri, { dbName: '233734_DanhDangKhoa' });
  console.log('Connected to MongoDB database 233734_DanhDangKhoa.');

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Could not start backend:', error.message);
  process.exitCode = 1;
});
