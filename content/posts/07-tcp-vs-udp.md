---
title: "TCP vs UDP: khác nhau đúng bản chất (dễ nhớ)"
date: 2025-12-23
tags: ["network", "tcp", "udp"]
draft: false

cover:
  image: "img/posts/07-http.png"
  alt: "TCP vs UDP: khác nhau đúng bản chất (dễ nhớ)"
  relative: true
---

## TCP
- Có kết nối (connection)
- Đảm bảo thứ tự, đảm bảo nhận đủ
- Chậm hơn UDP nhưng ổn định hơn

Ví dụ: HTTP/HTTPS, chat cần đúng dữ liệu, truyền file.

## UDP
- Không kết nối
- Không đảm bảo đủ/gần như “bắn gói tin”
- Nhanh, phù hợp realtime

Ví dụ: game realtime, video call (thường có cơ chế bù ở tầng ứng dụng).

## Mẹo nhớ nhanh
- TCP = “chắc ăn”
- UDP = “tốc độ”
