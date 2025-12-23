document.addEventListener("DOMContentLoaded", () => {
  // chỉ áp dụng đúng trang chủ "/"
  if (location.pathname !== "/") return;

  // chỉ khi có profileMode
  if (document.querySelector(".profile")) {
    document.body.classList.add("home-profile");
  }
});
