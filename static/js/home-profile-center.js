document.addEventListener("DOMContentLoaded", () => {
  // chỉ áp dụng đúng trang chủ "/"
  if (location.pathname !== "/") return;

  // chỉ khi có profileMode
  if (document.querySelector(".profile")) {
    document.body.classList.add("home-profile");
  }
  
  // nếu có ToC thì thêm class lên body để CSS có thể target (dùng cho About, Page, Post...)
  if (document.querySelector('.toc')) {
    document.body.classList.add('has-toc');
  }

  // cố định style client-side để đảm bảo profile nằm giữa bất kể stylesheet nào
  function applyInlineCenter() {
    const main = document.querySelector('.main');
    const profile = document.querySelector('.main > .profile') || document.querySelector('.profile');
    if (!main || !profile) return;

    // đảm bảo main có positioning để profile absolute lấy làm ref
    const mainPos = getComputedStyle(main).position;
    if (mainPos === 'static') main.style.position = 'relative';

    profile.style.position = 'absolute';
    profile.style.left = '50%';
    profile.style.transform = 'translateX(-50%)';
    profile.style.top = 'calc(var(--header-height, 80px) + 40px)';
    profile.style.maxWidth = '420px';
    profile.style.width = 'auto';
    profile.style.zIndex = '10';
  }

  // apply immediately and after short delays (layout may change)
  applyInlineCenter();
  setTimeout(applyInlineCenter, 300);
  setTimeout(applyInlineCenter, 1000);
  window.addEventListener('resize', applyInlineCenter);
});
