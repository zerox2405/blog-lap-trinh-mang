---
title: "Cookie vs Session vs LocalStorage: dùng cái nào cho đăng nhập?"
date: 2025-12-23
tags: ["auth", "cookie", "session", "browser"]
draft: false

cover:
  image: "img/posts/05-http.png"
  alt: "Cookie vs Session vs LocalStorage: dùng cái nào cho đăng nhập?"
  relative: true
---

## Cookie
- Lưu nhỏ, gửi kèm theo request (nếu cùng domain)  
- Có thể set `HttpOnly`, `Secure`, `SameSite`

✅ Hợp cho auth nếu làm đúng (HttpOnly giảm rủi ro XSS).

## Session
- Dữ liệu auth nằm ở server
- Client chỉ giữ session id (thường qua cookie)

✅ Hợp web truyền thống, cần server lưu trạng thái.

## LocalStorage
- Lưu ở browser
- JS đọc/ghi được dễ dàng

⚠️ Không nên lưu token quan trọng nếu lo XSS.

## Kết luận nhanh
- Web cần bảo mật cao: ưu tiên cookie HttpOnly + server-side session hoặc token
- Demo học tập: LocalStorage tiện nhưng phải hiểu rủi ro
