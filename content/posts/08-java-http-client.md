---
title: "Java 11 HttpClient: gọi REST API gọn và chuẩn"
date: 2025-12-23
tags: ["java", "httpclient", "rest"]
draft: false

cover:
  image: "img/posts/08-http.png"
  alt: "Java 11 HttpClient: gọi REST API gọn và chuẩn"
  relative: true
---

## HttpClient là gì?
Từ Java 11, `java.net.http.HttpClient` giúp gọi HTTP dễ hơn.

## GET ví dụ
```java
import java.net.URI;
import java.net.http.*;

public class GetDemo {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest req = HttpRequest.newBuilder()
      .uri(URI.create("https://jsonplaceholder.typicode.com/posts/1"))
      .GET()
      .build();

    HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
    System.out.println(res.statusCode());
    System.out.println(res.body());
  }
}
