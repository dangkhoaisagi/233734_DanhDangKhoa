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
│   ├── package.json
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

```bash
# backend
cd backend
npm install
cp .env.example .env
npm run dev
```

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

```bash
docker-compose up --build
```

- Frontend: `http://localhost`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017/233734_DanhDangKhoa`

## 6. Lưu ý bảo mật

- Không đẩy file `.env` lên GitHub
- Không commit token, mật khẩu hoặc thông tin nhạy cảm
- Chỉ lưu thông tin cấu hình mẫu trong `.env.example`

## 7. GitHub workflow

1. Tạo repository GitHub theo quy ước đặt tên
2. Khởi tạo cấu trúc thư mục frontend/backend
3. Viết README, cấu hình .gitignore và mã nguồn
4. Commit và push từng phần công việc lên GitHub

## 8. Các API mẫu

- `GET /api/health` → kiểm tra trạng thái server
- `GET /api/books` → lấy danh sách sách
- `POST /api/books` → thêm sách mới

## 9. Dữ liệu mẫu

Sách mặc định bao gồm:
- Đắc Nhân Tâm
- Nhà Giả Kim
- Tư Duy Nhanh Và Chậm

---

Bài thực hành đã hoàn thành với mô hình full-stack đơn giản, rõ cấu trúc và sẵn sàng triển khai.
