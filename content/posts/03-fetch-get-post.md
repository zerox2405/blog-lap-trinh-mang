---
title: "JavaScript fetch GET/POST chuẩn: JSON, headers, lỗi thường gặp"
date: 2025-12-23
tags: ["javascript", "fetch", "http", "api"]
draft: false

cover:
  image: "img/posts/03-http.png"
  alt: "JavaScript fetch GET/POST chuẩn: JSON, headers, lỗi thường gặp"
  relative: true
---

## Khi nào dùng fetch?
`fetch()` là cách phổ biến để JavaScript gọi **REST API** qua HTTP (GET/POST/PUT/DELETE).

---

## GET: lấy dữ liệu (JSON)
Ví dụ lấy danh sách bài viết:

```js
async function loadPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");

  if (!res.ok) {
    throw new Error("HTTP error: " + res.status);
  }

  const data = await res.json();
  console.log("Total:", data.length);
  console.log("First item:", data[0]);
}

loadPosts().catch(console.error);
