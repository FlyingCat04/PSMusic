# PSMusic

PSMusic là một nền tảng streaming nhạc hiện đại được xây dựng bằng React.js và ASP.NET Core, mang đến trải nghiệm nghe nhạc tuyệt vời với giao diện thân thiện và các tính năng đa dạng.

## Tính năng chính

- Streaming nhạc chất lượng cao
- Hệ thống xác thực và quản lý người dùng
- Giao diện hiện đại, responsive
- Bảo mật với JWT Authentication
- Phân loại nhạc theo thể loại

## Công nghệ sử dụng

### Frontend
- **React 19.1.1** - Thư viện JavaScript cho UI
- **Vite 7.1.7** - Build tool hiện đại
- **Lucide React** - Bộ icon đẹp mắt
- **CSS Modules** - Styling component-based

### Backend
- **.NET 8.0** - Framework backend mạnh mẽ
- **ASP.NET Core Web API** - RESTful API
- **Entity Framework Core 9.0** - ORM cho database
- **PostgreSQL** - Hệ quản trị cơ sở dữ liệu
- **JWT Bearer Authentication** - Xác thực bảo mật
- **AutoMapper** - Object mapping
- **BCrypt.Net** - Mã hóa mật khẩu
- **Swagger** - API documentation

### DevOps & Tools
- **Docker** - Containerization
- **ESLint** - Code linting
- **HTTPS** - Bảo mật kết nối

## Scripts có sẵn

### Frontend
- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

### Backend
- `dotnet run` - Chạy server
- `dotnet build` - Build project
- `dotnet ef database update` - Update database
- `dotnet ef migrations add <name>` - Tạo migration mới

## Xác thực

Dự án sử dụng JWT Authentication với các endpoint:
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/user/profile` - Lấy thông tin người dùng (cần token)

## API Documentation

Khi chạy server, truy cập Swagger UI tại: `https://localhost:7120/swagger`