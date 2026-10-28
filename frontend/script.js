const API_URL = 'http://localhost:5000/api/books';

const bookList = document.getElementById('book-list');
const bookForm = document.getElementById('book-form');

const renderBooks = (books) => {
  if (!books || books.length === 0) {
    bookList.innerHTML = '<p>There are no books available.</p>';
    return;
  }

  bookList.replaceChildren();

  books.forEach((book) => {
    const card = document.createElement('article');
    card.className = 'book-card';

    const title = document.createElement('h3');
    title.textContent = book.title;
    const author = document.createElement('p');
    author.textContent = `Author: ${book.author}`;
    const category = document.createElement('p');
    category.textContent = `Category: ${book.category}`;
    const publisher = document.createElement('p');
    publisher.textContent = `Publisher: ${book.publisher}`;
    const year = document.createElement('p');
    year.textContent = `Year: ${book.publishYear}`;
    const quantity = document.createElement('p');
    quantity.textContent = `Quantity: ${book.quantity}`;

    card.append(title, author, category, publisher, year, quantity);
    bookList.append(card);
  });
};

const fetchBooks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
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
  const bookId = document.getElementById('bookId').value.trim();
  const category = document.getElementById('category').value.trim();
  const publisher = document.getElementById('publisher').value.trim();
  const publishYear = Number(document.getElementById('publishYear').value);
  const isbn = document.getElementById('isbn').value.trim();
  const quantity = Number(document.getElementById('quantity').value);
  const description = document.getElementById('description').value.trim();

  if (!bookId || !title || !author || !category || !publisher || !publishYear || !isbn || !description) {
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId,
        title,
        author,
        category,
        publisher,
        publishYear,
        isbn,
        quantity,
        description
      })
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || `Request failed with status ${response.status}`);
    }

    bookForm.reset();
    await fetchBooks();
  } catch (error) {
    console.error('Error adding book:', error);
  }
});

fetchBooks();
