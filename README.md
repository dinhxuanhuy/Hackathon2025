# 🗺️ UTE MAP - University Navigation & Event Management System

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey.svg)](https://expressjs.com/)

Hệ thống quản lý bản đồ và sự kiện cho Đại học UTE (University of Technology and Education), giúp sinh viên và giảng viên dễ dàng tìm kiếm phòng học, xem lịch sự kiện và điều hướng trong khuôn viên trường.

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Endpoints](#-api-endpoints)
- [Đóng góp](#-đóng-góp)
- [Giấy phép](#-giấy-phép)

## ✨ Tính năng

### 🗺️ Bản đồ tương tác
- Hiển thị bản đồ campus sử dụng Leaflet
- Tìm kiếm và định vị phòng học
- Điều hướng từ vị trí hiện tại đến điểm đến
- Hiển thị thông tin chi tiết phòng học

### 📅 Quản lý sự kiện
- Xem danh sách sự kiện sắp tới
- Lọc sự kiện theo ngày, loại, địa điểm
- Tạo và chỉnh sửa sự kiện (dành cho admin)
- Trích xuất sự kiện từ dữ liệu có sẵn

### 🔐 Xác thực người dùng
- Đăng nhập an toàn
- Phân quyền admin/user
- Protected routes cho các tính năng nhạy cảm

### 🛠️ Công cụ quản trị
- Thêm/sửa/xóa phòng học
- Quản lý thông tin sự kiện
- Trích xuất và import dữ liệu

## 🚀 Công nghệ sử dụng

### Frontend
- **React 19.2.0** - Thư viện UI
- **React Router DOM 7.9.6** - Routing
- **Leaflet 1.9.4** - Bản đồ tương tác
- **Vite 7.2.2** - Build tool
- **TailwindCSS 4.1.17** - Styling
- **DaisyUI 5.5.4** - UI Components
- **Axios 1.13.2** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **MUI X Date Pickers** - Date/Time selection

### Backend
- **Node.js & Express 5.1.0** - Server framework
- **MongoDB & Mongoose 8.19.4** - Database
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **dotenv** - Environment variables
- **Nodemon** - Development auto-reload

## 📦 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **MongoDB**: >= 6.0 (hoặc MongoDB Atlas)
- **Git**: >= 2.0

## 🔧 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/dinhxuanhuy/Hackathon2025.git
cd Hackathon2025
```

### 2. Cài đặt dependencies

#### Cài đặt tất cả packages (root + backend + frontend):
```bash
npm run build
```

#### Hoặc cài đặt từng phần:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

## ⚙️ Cấu hình

### Backend Configuration

Tạo file `.env` trong thư mục `backend/`:

```env
# Database
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/mapsutedb

# Server
PORT=5001
NODE_ENV=development

# JWT (optional)
JWT_SECRET=your_jwt_secret_key
```

### Frontend Configuration

Tạo file `.env` trong thư mục `frontend/`:

```env
# API Base URL
VITE_API_URL=http://localhost:5001/api

# Map Configuration (if needed)
VITE_MAP_CENTER_LAT=10.8231
VITE_MAP_CENTER_LNG=106.6297
VITE_MAP_ZOOM=16
```

## 🏃 Chạy ứng dụng

### Development Mode

#### Chạy Backend:
```bash
cd backend
npm run dev
```
Server sẽ chạy tại: `http://localhost:5001`

#### Chạy Frontend:
```bash
cd frontend
npm run dev
```
Client sẽ chạy tại: `http://localhost:5173`

### Production Mode

#### Build frontend:
```bash
cd frontend
npm run build
```

#### Chạy production server:
```bash
npm start
```

Server sẽ serve cả backend API và frontend static files tại `http://localhost:5001`

## 📁 Cấu trúc dự án

```
Hackathon2025/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── eventsController.js
│   │   │   ├── roomsController.js
│   │   │   ├── scheduleController.js
│   │   │   └── usersController.js
│   │   ├── models/
│   │   │   ├── Event.js
│   │   │   ├── Room.js
│   │   │   ├── Schedule.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── eventRoutes.js
│   │   │   ├── roomRoutes.js
│   │   │   ├── scheduleRoute.js
│   │   │   └── userRoutes.js
│   │   └── server.js              # Express app entry
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/                # Images, icons
│   │   ├── components/
│   │   │   ├── map/               # Map components
│   │   │   │   ├── LocationSearch.jsx
│   │   │   │   ├── MapControlButton.jsx
│   │   │   │   ├── MapView.jsx
│   │   │   │   ├── RoutePanel.jsx
│   │   │   │   └── useMapInstance.js
│   │   │   ├── Card.jsx
│   │   │   ├── Dock.jsx
│   │   │   ├── Filter.jsx
│   │   │   ├── FilterOnly.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── config/
│   │   │   └── mapConfig.js       # Map configuration
│   │   ├── lib/
│   │   │   └── axios.js           # Axios instance
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Map.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Tools.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── CreatEvent.jsx
│   │   │   ├── EditEvent.jsx
│   │   │   ├── EditEventDetails.jsx
│   │   │   └── ExtractEvents.jsx
│   │   ├── service/
│   │   │   ├── geolocationService.js
│   │   │   ├── roomService.js
│   │   │   └── routingService.js
│   │   ├── styles/
│   │   │   └── map.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json                    # Root package.json
└── README.md
```

## 🔌 API Endpoints

### Events API (`/api/events`)
```
GET    /api/events           # Lấy danh sách tất cả sự kiện
GET    /api/events/:id       # Lấy chi tiết sự kiện
POST   /api/events           # Tạo sự kiện mới (Admin)
PUT    /api/events/:id       # Cập nhật sự kiện (Admin)
DELETE /api/events/:id       # Xóa sự kiện (Admin)
```

### Rooms API (`/api/rooms`)
```
GET    /api/rooms            # Lấy danh sách tất cả phòng
GET    /api/rooms/:id        # Lấy chi tiết phòng
POST   /api/rooms            # Thêm phòng mới (Admin)
PUT    /api/rooms/:id        # Cập nhật phòng (Admin)
DELETE /api/rooms/:id        # Xóa phòng (Admin)
```

### Users API (`/api/users`)
```
POST   /api/users/login      # Đăng nhập
POST   /api/users/register   # Đăng ký (nếu có)
GET    /api/users/profile    # Lấy thông tin người dùng
```

## 🎨 Screenshots

_Thêm screenshots của ứng dụng tại đây_

## 🧪 Testing

```bash
# Chạy tests (nếu có)
npm test
```

## 📝 Todo List

- [ ] Thêm tính năng tìm kiếm nâng cao
- [ ] Thêm hỗ trợ đa ngôn ngữ (Tiếng Việt/English)
- [ ] Thêm thông báo real-time cho sự kiện
- [ ] Tích hợp Google Calendar
- [ ] Thêm dark mode
- [ ] Mobile app với React Native

## 🤝 Đóng góp

Contributions, issues và feature requests luôn được chào đón!

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 👥 Nhóm phát triển

- **Đinh Xuân Huy** - [@dinhxuanhuy](https://github.com/dinhxuanhuy)
- **Đặng Gia Nguyên** - [@GERnguyen](https://github.com/GERnguyen)

## 📄 Giấy phép

Dự án này được cấp phép theo [ISC License](LICENSE).

## 🙏 Lời cảm ơn

- UTE - Đại học Sư phạm Kỹ thuật TP.HCM
- Hackathon 2025 organizers
- Tất cả contributors và supporters

## 📞 Liên hệ

- Repository: [https://github.com/dinhxuanhuy/Hackathon2025](https://github.com/dinhxuanhuy/Hackathon2025)
- Issues: [https://github.com/dinhxuanhuy/Hackathon2025/issues](https://github.com/dinhxuanhuy/Hackathon2025/issues)

---

Made with ❤️ by UTE Team
