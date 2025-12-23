document.addEventListener("DOMContentLoaded", () => {
  // Bắt link menu Search (thường là /search/)
  const links = document.querySelectorAll('a[href="/search/"], a[href="/search"]');
  if (!links.length) return;

  // Tạo overlay popup
  const overlay = document.createElement("div");
  overlay.className = "search-overlay";
  overlay.innerHTML = `
    <div class="search-modal">
      <button class="search-close" aria-label="Close">✕</button>
      <div class="search-embed">
        <iframe src="/search/" title="Search"></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const open = () => overlay.classList.add("open");
  const close = () => overlay.classList.remove("open");

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelector(".search-close").addEventListener("click", close);

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault(); // không chuyển trang
      open();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});
