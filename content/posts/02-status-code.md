---
title: "HTTP Status Code: 200, 404, 500 thật sự có nghĩa gì?"
date: 2025-12-23
tags: ["http", "status-code"]
draft: false

cover:
  image: "img/posts/02-http.png"
  alt: "HTTP Status Code: 200, 404, 500 thật sự có nghĩa gì?"
  relative: true
---

## Tại sao phải có Status Code?
Status code giúp client biết request:
- thành công
- lỗi do client
- hay lỗi do server

## Nhóm mã quan trọng
- **2xx**: OK (thành công)
- **3xx**: Redirect (chuyển hướng)
- **4xx**: Client lỗi (gửi sai)
- **5xx**: Server lỗi (xử lý hỏng)

## 5 status code hay gặp nhất
### 200 OK
Server trả về dữ liệu đúng.

### 201 Created
Tạo mới thành công (thường dùng khi POST tạo resource).

### 400 Bad Request
Dữ liệu gửi lên sai format / thiếu field.

### 401 Unauthorized
Chưa đăng nhập / thiếu token.

### 404 Not Found
Sai URL hoặc resource không tồn tại.

### 500 Internal Server Error
Server gặp lỗi runtime (exception, null, DB fail).

## Tip khi debug
- 4xx: kiểm tra request body, headers, URL
- 5xx: xem log server + thử request đơn giản hơn
