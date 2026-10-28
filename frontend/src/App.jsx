import { useCallback, useEffect, useState } from 'react';

const configuredApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const apiOrigin = configuredApiUrl
  ? (/^https?:\/\//i.test(configuredApiUrl) ? configuredApiUrl : `https://${configuredApiUrl}`)
  : '';
const API_BASE_URL = apiOrigin
  ? `${apiOrigin.replace(/\/api$/i, '')}/api`
  : '/api';
const EMPTY_BOOK = {
  bookId: '',
  title: '',
  author: '',
  category: '',
  publisher: '',
  publishYear: '',
  isbn: '',
  quantity: '',
  description: ''
};

const BOOK_FIELDS = [
  { name: 'bookId', label: 'Mã sách', required: true },
  { name: 'title', label: 'Tên sách', required: true },
  { name: 'author', label: 'Tác giả', required: true },
  { name: 'category', label: 'Thể loại', required: true },
  { name: 'publisher', label: 'Nhà xuất bản', required: true },
  { name: 'publishYear', label: 'Năm xuất bản', type: 'number', min: 0, required: true },
  { name: 'isbn', label: 'ISBN', required: true },
  { name: 'quantity', label: 'Số lượng', type: 'number', min: 0, required: true },
  { name: 'description', label: 'Mô tả', wide: true, required: true }
];

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  const result = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || `Yêu cầu thất bại (${response.status}).`);
  }
  return result;
}

function Icon({ name, size = 18 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
    trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 14H6L5 6" /><path d="M10 11v5M14 11v5" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function BookForm({ book, busy, error, onClose, onSubmit }) {
  const [values, setValues] = useState(book || EMPTY_BOOK);

  useEffect(() => {
    setValues(book || EMPTY_BOOK);
  }, [book]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...values,
      publishYear: Number(values.publishYear),
      quantity: Number(values.quantity)
    });
  };

  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !busy) onClose();
    }}>
      <section className="dialog form-dialog" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">{book ? 'CHỈNH SỬA THÔNG TIN' : 'THÊM VÀO BỘ SƯU TẬP'}</span>
            <h2 id="form-title">{book ? 'Cập nhật sách' : 'Thêm sách mới'}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Đóng" onClick={onClose} disabled={busy}>
            <Icon name="close" />
          </button>
        </div>
        {error && <div className="form-error" role="alert">{error}</div>}
        <form className="book-form" onSubmit={submit}>
          {BOOK_FIELDS.map((field) => (
            <label className={field.wide ? 'field field-wide' : 'field'} key={field.name}>
              <span>{field.label}</span>
              {field.name === 'description' ? (
                <textarea
                  name={field.name}
                  value={values[field.name] || ''}
                  onChange={updateField}
                  required={field.required}
                  rows="3"
                />
              ) : (
                <input
                  name={field.name}
                  type={field.type || 'text'}
                  min={field.min}
                  value={values[field.name] ?? ''}
                  onChange={updateField}
                  required={field.required}
                  readOnly={Boolean(book && field.name === 'bookId')}
                />
              )}
            </label>
          ))}
          <div className="dialog-actions field-wide">
            <button className="button button-quiet" type="button" onClick={onClose} disabled={busy}>Hủy</button>
            <button className="button button-primary" type="submit" disabled={busy}>
              {busy ? <><span className="button-spinner" /> Đang lưu...</> : book ? 'Lưu thay đổi' : 'Thêm sách'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function BookDetails({ book, loading, onClose, onEdit }) {
  if (loading) {
    return (
      <div className="overlay" role="presentation">
        <section className="dialog detail-dialog" role="dialog" aria-modal="true" aria-label="Đang tải chi tiết sách">
          <div className="loading-detail"><span className="button-spinner dark-spinner" /> Đang tải chi tiết sách...</div>
        </section>
      </div>
    );
  }

  if (!book) return null;

  const details = [
    ['Mã sách', book.bookId],
    ['Tác giả', book.author],
    ['Thể loại', book.category],
    ['Nhà xuất bản', book.publisher],
    ['Năm xuất bản', book.publishYear],
    ['ISBN', book.isbn],
    ['Số lượng', book.quantity]
  ];

  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="dialog detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">CHI TIẾT SÁCH</span>
            <h2 id="detail-title">{book.title}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Đóng" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <dl className="detail-grid">
          {details.map(([label, value]) => (
            <div className="detail-item" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <div className="detail-item detail-wide">
            <dt>Mô tả</dt>
            <dd>{book.description}</dd>
          </div>
        </dl>
        <div className="dialog-actions">
          <button className="button button-quiet" type="button" onClick={onClose}>Đóng</button>
          <button className="button button-primary" type="button" onClick={() => onEdit(book)}>
            <Icon name="edit" size={16} /> Chỉnh sửa
          </button>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [formBook, setFormBook] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const loadBooks = useCallback(async (query = '', signal) => {
    setLoading(true);
    setError('');
    try {
      const suffix = query.trim() ? `?search=${encodeURIComponent(query.trim())}` : '';
      const result = await request(`/books${suffix}`, { signal });
      setBooks(result);
    } catch (loadError) {
      if (loadError.name !== 'AbortError') setError(loadError.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => loadBooks(search, controller.signal), 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadBooks, search]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const showCreateForm = () => {
    setFormError('');
    setFormBook(null);
    setFormOpen(true);
  };

  const showEditForm = (book) => {
    setFormError('');
    setSelectedBook(null);
    setFormBook(book);
    setFormOpen(true);
  };

  const showBookDetails = async (book) => {
    setSelectedBook(null);
    setDetailLoading(true);
    try {
      const details = await request(`/books/${encodeURIComponent(book.bookId)}`);
      setSelectedBook(details);
    } catch (detailError) {
      setError(detailError.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const saveBook = async (values) => {
    setSaving(true);
    setFormError('');
    try {
      if (formBook) {
        await request(`/books/${encodeURIComponent(formBook.bookId)}`, {
          method: 'PUT',
          body: JSON.stringify(values)
        });
        setNotice('Đã cập nhật thông tin sách.');
      } else {
        await request('/books', { method: 'POST', body: JSON.stringify(values) });
        setNotice('Đã thêm sách mới.');
      }
      setFormOpen(false);
      setFormBook(null);
      await loadBooks(search);
    } catch (saveError) {
      setFormError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteBook = async (book) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sách "${book.title}"?`)) return;
    setDeletingId(book.bookId);
    setError('');
    try {
      await request(`/books/${encodeURIComponent(book.bookId)}`, { method: 'DELETE' });
      if (selectedBook?.bookId === book.bookId) setSelectedBook(null);
      setNotice('Đã xóa sách.');
      await loadBooks(search);
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId('');
    }
  };

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Trang chủ thư viện">
          <span className="brand-mark"><Icon name="book" size={20} /></span>
          <span>THƯ VIỆN <strong>233734</strong></span>
        </a>
        <span className="topbar-caption">HỆ THỐNG QUẢN LÝ SÁCH</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">KHÔNG GIAN ĐỌC CỦA BẠN</span>
          <h1>Mỗi cuốn sách,<br /><em>một thế giới mới.</em></h1>
          <p>Quản lý bộ sưu tập, khám phá và tìm lại những cuốn sách yêu thích.</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun-shape" />
          <div className="book-stack stack-one" />
          <div className="book-stack stack-two" />
          <div className="book-stack stack-three" />
          <span className="art-sparkle sparkle-one">✳</span>
          <span className="art-sparkle sparkle-two">✦</span>
        </div>
      </section>

      <section className="library-section" aria-labelledby="library-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BỘ SƯU TẬP CỦA BẠN</span>
            <h2 id="library-title">Tủ sách</h2>
          </div>
          <button className="button button-primary add-button" type="button" onClick={showCreateForm}>
            <Icon name="plus" /> Thêm sách
          </button>
        </div>

        <div className="toolbar">
          <label className="search-box">
            <Icon name="search" />
            <input
              type="search"
              placeholder="Tìm theo tên, tác giả, mã sách..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Tìm kiếm sách"
            />
            {search && <button type="button" className="clear-search" onClick={() => setSearch('')}>Xóa</button>}
          </label>
          <span className="book-count">{loading ? 'Đang tải...' : `${books.length} cuốn sách`}</span>
        </div>

        {error && (
          <div className="state-message state-error" role="alert">
            <div><strong>Không thể hoàn tất yêu cầu</strong><span>{error}</span></div>
            <button className="button button-quiet" type="button" onClick={() => loadBooks(search)}>Thử lại</button>
          </div>
        )}

        {loading ? (
          <div className="book-grid" aria-label="Đang tải sách" aria-busy="true">
            {Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index} />)}
          </div>
        ) : !error && books.length > 0 ? (
          <div className="book-grid">
            {books.map((book, index) => (
              <article className={`book-card cover-${index % 5}`} key={book._id || book.bookId}>
                <div className="book-cover">
                  <span className="cover-label">{book.category}</span>
                  <div className="cover-ornament"><Icon name="book" size={28} /></div>
                  <span className="cover-title">{book.title}</span>
                  <span className="cover-author">{book.author}</span>
                  <span className="cover-number">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="card-content">
                  <div className="card-meta"><span>{book.bookId}</span><span>{book.publishYear}</span></div>
                  <h3>{book.title}</h3>
                  <p className="card-author">{book.author}</p>
                  <div className="card-footer">
                    <span className={`stock ${book.quantity > 0 ? '' : 'stock-empty'}`}>
                      <i /> {book.quantity > 0 ? `Còn ${book.quantity} cuốn` : 'Hết sách'}
                    </span>
                    <div className="card-actions">
                      <button className="icon-button" type="button" aria-label={`Xem ${book.title}`} title="Xem chi tiết" onClick={() => showBookDetails(book)}>
                        <Icon name="eye" size={17} />
                      </button>
                      <button className="icon-button" type="button" aria-label={`Sửa ${book.title}`} title="Chỉnh sửa" onClick={() => showEditForm(book)}>
                        <Icon name="edit" size={17} />
                      </button>
                      <button className="icon-button danger-hover" type="button" aria-label={`Xóa ${book.title}`} title="Xóa sách" disabled={deletingId === book.bookId} onClick={() => deleteBook(book)}>
                        {deletingId === book.bookId ? <span className="button-spinner dark-spinner" /> : <Icon name="trash" size={17} />}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : !error ? (
          <div className="empty-state">
            <span className="empty-icon"><Icon name="book" size={28} /></span>
            <h3>{search ? 'Không tìm thấy sách phù hợp' : 'Tủ sách đang trống'}</h3>
            <p>{search ? 'Thử từ khóa khác để tìm trong bộ sưu tập.' : 'Thêm cuốn sách đầu tiên để bắt đầu bộ sưu tập của bạn.'}</p>
            {search ? (
              <button className="button button-quiet" type="button" onClick={() => setSearch('')}>Xóa từ khóa</button>
            ) : (
              <button className="button button-primary" type="button" onClick={showCreateForm}><Icon name="plus" /> Thêm sách đầu tiên</button>
            )}
          </div>
        ) : null}
      </section>

      <footer className="footer">
        <span>THƯ VIỆN 233734</span>
        <span>Được tạo để lưu giữ những câu chuyện hay.</span>
      </footer>

      {notice && <div className="toast" role="status">{notice}</div>}
      {formOpen && (
        <BookForm
          book={formBook}
          busy={saving}
          error={formError}
          onClose={() => setFormOpen(false)}
          onSubmit={saveBook}
        />
      )}
      {(selectedBook || detailLoading) && (
        <BookDetails
          book={selectedBook}
          loading={detailLoading}
          onClose={() => setSelectedBook(null)}
          onEdit={showEditForm}
        />
      )}
    </main>
  );
}

export default App;
