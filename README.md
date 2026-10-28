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
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── vite.config.js
├── docker-compose.yml
├── .gitignore
├── README.md
└── .env.example
```

## 4. Công nghệ sử dụng

- Frontend: React, Vite, CSS
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
# frontend (mở terminal riêng)
cd frontend
npm install
npm run dev
```

Truy cập frontend tại `http://localhost:5173`. Vite chuyển tiếp `/api` đến backend đang chạy tại `http://localhost:5000`.

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

Frontend React có danh sách sách, tìm kiếm theo từ khóa, xem chi tiết, thêm, cập nhật và xóa sách. Khi triển khai frontend độc lập, đặt biến build `VITE_API_URL` thành URL backend kèm `/api` (ví dụ `https://api-example.onrender.com/api`). Docker Compose dùng Nginx chuyển tiếp `/api` tới dịch vụ backend.

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
- `GET /api/books` → lấy danh sách sách; thêm `?search=cloud` để tìm theo mã, tên, tác giả, thể loại, nhà xuất bản, ISBN hoặc mô tả
- `GET /api/books/:bookId` → lấy thông tin một sách theo mã
- `POST /api/books` → thêm sách mới (gửi đủ các trường theo schema)
- `PUT /api/books/:bookId` → cập nhật một hoặc nhiều trường sách
- `DELETE /api/books/:bookId` → xóa sách

## 10. Chức năng frontend (Câu 4)

- Hiển thị danh sách sách và thông tin chính
- Tìm kiếm theo từ khóa
- Xem chi tiết, thêm, cập nhật và xóa sách
- Hiển thị trạng thái tải, lỗi, kết quả thao tác và trạng thái danh sách trống

## 11. Đóng gói và đẩy backend image (Câu 5)

Backend image sử dụng tên `dangkhoaisagi/backend:latest`. File `backend/.dockerignore` loại trừ `.env` và `node_modules`; thông tin kết nối MongoDB chỉ được truyền lúc chạy container, không nằm trong image.

Mở Docker Desktop và đăng nhập Docker Hub (chạy `docker login -u dangkhoaisagi`; nhập mật khẩu/token khi Docker hỏi, không thêm vào lệnh). Đảm bảo `backend/.env` có `PORT=5000` và `MONGODB_URI` hợp lệ. Từ thư mục gốc dự án thực hiện:

```powershell
docker build -t dangkhoaisagi/backend:latest ./backend
docker run --rm --env-file backend/.env dangkhoaisagi/backend:latest npm run seed
docker run -d --name 233734-books-api --env-file backend/.env -p 5000:5000 dangkhoaisagi/backend:latest
docker logs 233734-books-api
docker push dangkhoaisagi/backend:latest
```

`backend/.env` chỉ được dùng lúc chạy container và bị loại khỏi build context; không ghi mật khẩu vào lệnh, README, Dockerfile hay Git. Kiểm tra API bằng `http://localhost:5000/api/health` và `http://localhost:5000/api/books`. Dừng container bằng `docker stop 233734-books-api`; xóa container bằng `docker rm 233734-books-api`.

Đường dẫn image để nộp: `https://hub.docker.com/r/dangkhoaisagi/backend` (tag `latest`).

---

Bài thực hành hiện có backend, frontend và cấu hình kết nối MongoDB. Cần tạo cluster/user/IP allowlist trên Atlas và điền URI bí mật vào `backend/.env` để kết nối cơ sở dữ liệu.
