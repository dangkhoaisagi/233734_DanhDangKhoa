require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

const sampleBooks = [
  {
    bookId: 'BOOK001',
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    category: 'Kỹ năng sống',
    publisher: 'NXB Tổng hợp TP.HCM',
    publishYear: 1936,
    isbn: '9786045851137',
    quantity: 12,
    description: 'Những nguyên tắc ứng xử và giao tiếp trong cuộc sống.'
  },
  {
    bookId: 'BOOK002',
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    category: 'Tiểu thuyết',
    publisher: 'NXB Hội Nhà Văn',
    publishYear: 1988,
    isbn: '9786044910125',
    quantity: 8,
    description: 'Câu chuyện về hành trình theo đuổi ước mơ của Santiago.'
  },
  {
    bookId: 'BOOK003',
    title: 'Tư Duy Nhanh Và Chậm',
    author: 'Daniel Kahneman',
    category: 'Tâm lý học',
    publisher: 'NXB Thế Giới',
    publishYear: 2011,
    isbn: '9786047733104',
    quantity: 5,
    description: 'Khám phá hai hệ thống tư duy chi phối cách con người ra quyết định.'
  }
];

const seedDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Configure it in backend/.env.');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: '233734_DanhDangKhoa'
  });

  for (const book of sampleBooks) {
    await Book.updateOne({ bookId: book.bookId }, { $setOnInsert: book }, { upsert: true });
  }

  console.log(`Seeded ${sampleBooks.length} sample books into the books collection.`);
};

seedDatabase()
  .catch((error) => {
    console.error('Could not seed MongoDB:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
