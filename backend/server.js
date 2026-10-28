const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const books = [
  { id: 1, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', year: 1936 },
  { id: 2, title: 'Nhà Giả Kim', author: 'Paulo Coelho', year: 1988 },
  { id: 3, title: 'Tư Duy Nhanh Và Chậm', author: 'Daniel Kahneman', year: 2011 }
];

const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('MongoDB URI not provided. Running without database connection.');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running successfully.' });
});

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const book = books.find((item) => item.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  res.json(book);
});

app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res.status(400).json({ message: 'Title, author and year are required.' });
  }

  const newBook = {
    id: Date.now(),
    title,
    author,
    year
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
