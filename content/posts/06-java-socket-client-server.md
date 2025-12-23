---
title: "Java Socket cơ bản: Client/Server chat mini (TCP)"
date: 2025-12-23
tags: ["java", "socket", "tcp", "network"]
draft: false

cover:
  image: "img/posts/06-http.png"
  alt: "Java Socket cơ bản: Client/Server chat mini (TCP)"
  relative: true
---

## Socket dùng để làm gì?
Socket giúp 2 chương trình giao tiếp qua mạng theo kiểu **TCP**:
- Server mở cổng (port) và lắng nghe
- Client kết nối vào server
- Hai bên gửi/nhận dữ liệu (stream)

---

## Server: nhận 1 client và echo lại
Tạo file `SimpleServer.java`:

```java
import java.io.*;
import java.net.*;

public class SimpleServer {
  public static void main(String[] args) throws Exception {
    ServerSocket server = new ServerSocket(9000);
    System.out.println("Server listening on port 9000...");

    Socket socket = server.accept(); // chờ client kết nối
    System.out.println("Client connected: " + socket.getInetAddress());

    BufferedReader in = new BufferedReader(
        new InputStreamReader(socket.getInputStream())
    );
    PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

    String line;
    while ((line = in.readLine()) != null) {
      System.out.println("Client says: " + line);
      out.println("Echo: " + line);
    }

    socket.close();
    server.close();
  }
}
