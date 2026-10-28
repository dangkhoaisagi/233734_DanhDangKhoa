# 233734_DanhDangKhoa

Bài thực hành điện toán đám mây: xây dựng ứng dụng web full-stack với frontend, backend và MongoDB.

## 1. Quy ước đặt tên

- MSSV: `233734`
- Họ tên: `Danh Đăng Khoa`
- GitHub repository: `233734_DanhDangKhoa`
- MongoDB database: `233734_DanhDangKhoa`
- MongoDB collection: `books`
- Docker Hub backend image: `dangkhoaisagi/backend`
- Docker Hub frontend image: `dangkhoaisagi/frontend`
- Render service backend: `api-233734`
- Render service frontend: `web-233734`

## 2. Mục tiêu đề tài

Xây dựng một ứng dụng quản lý sách đơn giản, gồm:
- Backend API để quản lý dữ liệu sách
- Frontend hiển thị danh sách sách và cho phép thêm mới sách
- Cơ sở dữ liệu MongoDB để lưu trữ dữ liệu
- Triển khai bằng Docker và chạy local qua docker-compose

## 3. Cấu trúc dự án

```text
233734_DanhDangKhoa/
├── backend/
│   ├── .env.example
│   ├── Dockerfile
│   ├── models/
│   │   └── Book.js
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── docker-compose.yml
├── .gitignore
├── README.md
└── .env.example
```

## 4. Công nghệ sử dụng

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Container: Docker, Docker Compose

## 5. Cách chạy dự án

### 5.1 Chạy local bằng Node

Tạo MongoDB Atlas cluster, database user và cho phép địa chỉ IP hiện tại trong Network Access. Sao chép URI kết nối vào `backend/.env` (thay username, password và cluster URL; URL-encode ký tự đặc biệt trong password; không commit file này). Database `233734_DanhDangKhoa` và collection `books` sẽ được tạo khi chạy seed:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/233734_DanhDangKhoa?retryWrites=true&w=majority
```

```bash
# backend
cd backend
npm install
npm run seed
npm run dev
```

`npm run seed` thêm 3 sách mẫu vào collection `books`. Lệnh có thể chạy lại an toàn; sách đã tồn tại theo `bookId` sẽ không bị ghi đè.

Truy cập API tại:
- `http://localhost:5000/api/health`
- `http://localhost:5000/api/books`

```bash
# frontend
cd frontend
python -m http.server 8080
```

Truy cập frontend tại:
- `http://localhost:8080`

### 5.2 Chạy bằng Docker Compose

Để chạy với MongoDB local:

```bash
docker compose up --build
```

Để dùng Atlas, sau khi đã tạo `backend/.env` theo hướng dẫn ở trên:

```bash
docker compose --env-file backend/.env up --build
```

- Frontend: `http://localhost`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017/233734_DanhDangKhoa`

## 6. Cấu trúc dữ liệu MongoDB

Database `233734_DanhDangKhoa`, collection `books`. Mỗi tài liệu có các trường:

| Trường | Kiểu | Mô tả |
|---|---|---|
| `bookId` | String | Mã sách, duy nhất |
| `title` | String | Tên sách |
| `author` | String | Tác giả |
| `category` | String | Thể loại |
| `publisher` | String | Nhà xuất bản |
| `publishYear` | Number | Năm xuất bản |
| `isbn` | String | Mã ISBN, duy nhất |
| `quantity` | Number | Số lượng |
| `description` | String | Mô tả sách |

## 7. Lưu ý bảo mật

- Không đẩy file `.env` lên GitHub
- Không commit token, mật khẩu hoặc thông tin nhạy cảm
- Chỉ lưu thông tin cấu hình mẫu trong `.env.example`

## 8. GitHub workflow

1. Tạo repository GitHub theo quy ước đặt tên
2. Khởi tạo cấu trúc thư mục frontend/backend
3. Viết README, cấu hình .gitignore và mã nguồn
4. Commit và push từng phần công việc lên GitHub

## 9. Các API mẫu

- `GET /api/health` → kiểm tra trạng thái server
- `GET /api/books` → lấy danh sách sách
- `POST /api/books` → thêm sách mới

---

Bài thực hành hiện có backend, frontend và cấu hình kết nối MongoDB. Cần tạo cluster/user/IP allowlist trên Atlas và điền URI bí mật vào `backend/.env` để kết nối cơ sở dữ liệu.
