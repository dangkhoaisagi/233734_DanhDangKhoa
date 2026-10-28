const API_URL = 'http://localhost:5000/api/books';

const bookList = document.getElementById('book-list');
const bookForm = document.getElementById('book-form');

const renderBooks = (books) => {
  if (!books || books.length === 0) {
    bookList.innerHTML = '<p>There are no books available.</p>';
    return;
  }

  bookList.innerHTML = books
    .map(
      (book) => `
        <article class="book-card">
          <h3>${book.title}</h3>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Year:</strong> ${book.year}</p>
        </article>
      `
    )
    .join('');
};

const fetchBooks = async () => {
  try {
    const response = await fetch(API_URL);
    const books = await response.json();
    renderBooks(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    bookList.innerHTML = '<p>Could not load books. Please start the backend service.</p>';
  }
};

bookForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const year = Number(document.getElementById('year').value);

  if (!title || !author || !year) {
    return;
  }

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, year })
    });

    bookForm.reset();
    fetchBooks();
  } catch (error) {
    console.error('Error adding book:', error);
  }
});

fetchBooks();
