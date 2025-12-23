---
title: "WebSocket là gì? Khi nào nên dùng thay HTTP?"
date: 2025-12-23
tags: ["websocket", "realtime", "network"]
draft: false

cover:
  image: "img/posts/09-http.png"
  alt: "WebSocket là gì? Khi nào nên dùng thay HTTP?"
  relative: true
---

## Vấn đề của HTTP
HTTP request/response phù hợp dữ liệu “theo lượt”.
Nhưng realtime (chat, live update) mà cứ polling liên tục thì tốn tài nguyên.

## WebSocket
WebSocket tạo kết nối 2 chiều:
- client và server có thể “push” dữ liệu qua lại liên tục

## Khi nào nên dùng
- Chat realtime
- Thông báo realtime
- Dashboard cập nhật liên tục

## Khi nào KHÔNG cần
- App chỉ load dữ liệu khi mở trang
- CRUD bình thường → HTTP/REST đủ

## Gợi ý học tiếp
- Node.js WebSocket (ws)
- Java Spring WebSocket
