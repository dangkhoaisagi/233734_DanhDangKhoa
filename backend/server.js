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
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const searchPattern = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const filter = search
      ? {
          $or: ['bookId', 'title', 'author', 'category', 'publisher', 'isbn', 'description'].map(
            (field) => ({ [field]: { $regex: searchPattern, $options: 'i' } })
          )
        }
      : {};
    const books = await Book.find(filter).sort({ bookId: 1 });
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
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Request body must be a JSON object.' });
    }

    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

app.put('/api/books/:bookId', async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Request body must be a JSON object.' });
    }

    const allowedFields = [
      'title',
      'author',
      'category',
      'publisher',
      'publishYear',
      'isbn',
      'quantity',
      'description'
    ];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([field]) => allowedFields.includes(field))
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Provide at least one valid book field to update.' });
    }

    const book = await Book.findOneAndUpdate(
      { bookId: req.params.bookId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.json(book);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/books/:bookId', async (req, res, next) => {
  try {
    const book = await Book.findOneAndDelete({ bookId: req.params.bookId });

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.json({ message: 'Book deleted successfully.', book });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ message: 'Request body must contain valid JSON.' });
  }

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
