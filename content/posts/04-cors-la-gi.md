---
title: "CORS là gì? Vì sao gọi API bị chặn trên trình duyệt?"
date: 2025-12-23
tags: ["cors", "browser", "http", "security"]
draft: false

cover:
  image: "img/posts/04-http.png"
  alt: "CORS là gì? Vì sao gọi API bị chặn trên trình duyệt?"
  relative: true
---

## Tình huống hay gặp
Bạn gọi API bằng **Postman** thì chạy bình thường,
nhưng khi gọi bằng **fetch trên trình duyệt** thì báo lỗi kiểu:

- “blocked by CORS policy…”
- request fail dù server vẫn đang chạy

---

## CORS là gì?
CORS (Cross-Origin Resource Sharing) là cơ chế bảo mật của trình duyệt.

Nếu:
- Frontend chạy ở **origin A** (ví dụ `http://localhost:3000`)
- API chạy ở **origin B** (ví dụ `http://localhost:8080`)

=> Browser sẽ **chặn** nếu server không cho phép CORS.

**Origin =** protocol + domain + port.

---

## Vì sao Postman không bị CORS?
Vì CORS là luật **của trình duyệt**. Postman không bị ràng buộc bởi luật này.

---

## Preflight (OPTIONS) là gì?
Với các request “nhạy” (ví dụ POST JSON, có custom headers...), trình duyệt sẽ gửi trước 1 request:

✅ `OPTIONS /api/...`

để hỏi server:
- Có cho phép origin này không?
- Cho phép method nào?
- Cho phép header nào?

Nếu server trả không đúng → browser chặn request thật.

---

## Server cần trả header gì?
Các header hay gặp:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

Ví dụ (ý tưởng):
- Allow-Origin: `http://localhost:3000`
- Allow-Methods: `GET,POST,PUT,DELETE`
- Allow-Headers: `Content-Type, Authorization`

---

## Cách debug nhanh
1) Mở DevTools → tab **Network**
2) Xem có request **OPTIONS** không
3) Nếu OPTIONS fail → gần như chắc chắn là lỗi CORS

---

## Ghi nhớ
- CORS không phải lỗi “mạng”, mà là **chính sách bảo mật của browser**
- Fix đúng nằm ở **server config** (backend)
