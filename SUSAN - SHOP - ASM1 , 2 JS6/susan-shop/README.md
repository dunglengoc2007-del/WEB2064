# Susan Coffee & Tea - Website Cửa Hàng

Website bán cà phê và trà sữa với giao diện màu hồng chuyên nghiệp.

## Cách chạy

### Bước 1: Cài đặt json-server

```bash
npm install -g json-server
```

### Bước 2: Khởi động backend

Từ thư mục `susan-shop/`:

```bash
npx json-server --watch db.json --port 4000
```

### Bước 3: Mở website

Dùng Live Server (VS Code) hoặc bất kỳ web server tĩnh nào, trỏ vào thư mục `susan-shop/` và mở:

- **Trang chủ (Users):** `users/index.html`
- **Trang Admin:** `admin/index.html`

## Tài khoản mặc định

| Loại  | Email              | Mật khẩu |
|-------|--------------------|----------|
| Admin | admin@susan.com    | 123456   |
| User  | nguyen.an@email.com| 123456   |

## Cấu trúc thư mục

```
susan-shop/
├── db.json              # Dữ liệu json-server
├── users/               # Trang người dùng
│   ├── index.html       # Trang chủ + danh sách sản phẩm
│   ├── product_detail.html
│   ├── cart.html
│   ├── checkout.html
│   ├── thankyou.html
│   ├── order.html
│   ├── login.html
│   ├── register.html
│   ├── account.html
│   └── forgot_password.html
├── admin/               # Trang quản trị
│   ├── index.html       # Dashboard
│   ├── login.html
│   ├── products.html
│   ├── categories.html
│   ├── orders.html
│   ├── order_detail.html
│   ├── users.html
│   └── js/
├── js/                  # JavaScript người dùng
├── styles/              # CSS (pink theme)
└── images/
```

## Tính năng

### User
- Xem danh sách sản phẩm, lọc theo danh mục, tìm kiếm
- Xem chi tiết sản phẩm, chọn phiên bản
- Giỏ hàng (LocalStorage)
- Đặt hàng, xem lịch sử đơn hàng
- Đăng ký / đăng nhập / quên mật khẩu / cập nhật tài khoản

### Admin
- Dashboard tổng quan (Chart.js)
- CRUD sản phẩm, danh mục
- Quản lý đơn hàng, cập nhật trạng thái
- Quản lý người dùng
