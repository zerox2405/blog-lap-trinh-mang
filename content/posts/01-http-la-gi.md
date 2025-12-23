---
title: "HTTP là gì? Request/Response trong 5 phút"
date: 2025-12-23
tags: ["http", "network", "basics"]
draft: false

cover:
  image: "img/posts/01-http.png"
  alt: "HTTP là gì"
  relative: true
---

## HTTP là gì?
HTTP (HyperText Transfer Protocol) là “ngôn ngữ giao tiếp” phổ biến nhất giữa **client (trình duyệt/app)** và **server**.

Một vòng giao tiếp HTTP gồm:
- **Request**: client gửi yêu cầu
- **Response**: server trả dữ liệu + trạng thái

## 3 thứ luôn có trong Request
1) **Method**: GET/POST/PUT/DELETE  
2) **URL**: ví dụ `/api/users`  
3) **Headers**: metadata (Content-Type, Authorization…)

## Ví dụ request thô (ý tưởng)
- GET `/posts`
- Header: `Accept: application/json`

Server trả:
- Status: `200 OK`
- Body: JSON danh sách posts

## Vì sao HTTP quan trọng?
Vì REST API, Web API, gọi dữ liệu từ frontend… đều xoay quanh HTTP.

## Ghi nhớ nhanh
- HTTP = giao thức request/response
- Method quyết định “ý định”
- Status code nói server đang ổn hay lỗi
