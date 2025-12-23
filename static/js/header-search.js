document.addEventListener("DOMContentLoaded", () => {
  console.log("[header-search] loaded");

  // 1) tìm đúng menu link Search trong #menu
  const menu = document.querySelector("#menu");
  if (!menu) return;

  const links = Array.from(menu.querySelectorAll("a[href]"));
  const searchLink = links.find((a) => {
    try {
      const u = new URL(a.href, window.location.origin);
      return /\/search\/?$/.test(u.pathname);
    } catch {
      return /\/search\/?$/.test(a.getAttribute("href") || "");
    }
  });
  if (!searchLink) return;

  const hostLi = searchLink.closest("li") || searchLink.parentElement;
  if (!hostLi) return;

  hostLi.style.position = "relative";

  let inputEl = null;
  let dropdownEl = null;
  let indexData = null;
  let cleanupFns = [];
  let lastQuery = "";
  let debounceTimer = null;

  // ========= utils =========
  const escapeHtml = (s) =>
    (s ?? "")
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlight = (text, q) => {
    if (!q) return escapeHtml(text);
    const re = new RegExp(escapeRegExp(q), "gi");
    return escapeHtml(text).replace(re, (m) => `<mark>${m}</mark>`);
  };

  async function loadIndex() {
    if (indexData) return indexData;
    const res = await fetch("/index.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Cannot load /index.json");
    indexData = await res.json();
    return indexData;
  }

  function ensureDropdown() {
    if (dropdownEl) return dropdownEl;
    dropdownEl = document.createElement("div");
    dropdownEl.className = "header-search-dd";
    hostLi.appendChild(dropdownEl);
    return dropdownEl;
  }

  function clearDropdown() {
    if (dropdownEl) dropdownEl.innerHTML = "";
  }

  function closeSearch() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = null;
    lastQuery = "";

    if (dropdownEl) dropdownEl.remove();
    if (inputEl) inputEl.remove();

    dropdownEl = null;
    inputEl = null;

    // hiện lại chữ Search (NHƯNG giữ đúng layout)
    searchLink.style.visibility = "";
    searchLink.style.pointerEvents = "";

    cleanupFns.forEach((fn) => fn());
    cleanupFns = [];
  }

  function scoreItem(it, q) {
    const title = (it.title || "").toLowerCase();
    const summary = (it.summary || "").toLowerCase();
    const content = (it.content || "").toLowerCase();
    const tags = Array.isArray(it.tags) ? it.tags.join(" ").toLowerCase() : "";

    let s = 0;
    if (title.includes(q)) s += 5;
    if (tags.includes(q)) s += 3;
    if (summary.includes(q)) s += 2;
    if (content.includes(q)) s += 1;

    // ưu tiên match từ đầu title
    if (title.startsWith(q)) s += 2;

    return s;
  }

  function renderResults(qRaw, items) {
    const q = qRaw.trim();
    const dd = ensureDropdown();

    if (!q) {
      dd.innerHTML = "";
      return;
    }

    const top = items.slice(0, 8);
    if (!top.length) {
      dd.innerHTML = `<div class="hs-empty">Không có kết quả</div>`;
      return;
    }

    dd.innerHTML = top
      .map((it) => {
        const title = it.title || "(No title)";
        const url = it.relpermalink || it.permalink || "#";
        const tags = Array.isArray(it.tags) && it.tags.length ? it.tags : [];

        const titleHtml = highlight(title, q);

        const tagsHtml = tags.length
          ? `<div class="hs-tags">${escapeHtml(tags.join(" • "))}</div>`
          : "";

        return `
          <a class="hs-item" href="${escapeHtml(url)}">
            <div class="hs-title">${titleHtml}</div>
            ${tagsHtml}
          </a>
        `;
      })
      .join("");
  }

  async function doSearch(q) {
    const qLower = q.trim().toLowerCase();
    if (!qLower) {
      clearDropdown();
      return;
    }

    const data = await loadIndex();

    const results = data
      .map((it) => ({ it, s: scoreItem(it, qLower) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.it);

    renderResults(q, results);
  }

  function openSearch() {
    // toggle
    if (inputEl) return closeSearch();

    // ẨN nhưng GIỮ CHỖ -> nav không nhảy
    searchLink.style.visibility = "hidden";
    searchLink.style.pointerEvents = "none";

    inputEl = document.createElement("input");
    inputEl.type = "search";
    inputEl.className = "header-search-input";
    inputEl.placeholder = "Tìm bài viết...";
    inputEl.autocomplete = "off";
    inputEl.spellcheck = false;

    // Quan trọng: absolute để không làm menu bị đẩy / nhảy
    inputEl.style.position = "absolute";
    inputEl.style.right = "0";
    inputEl.style.top = "50%";
    inputEl.style.transform = "translateY(-50%)";
    inputEl.style.zIndex = "10000";

    hostLi.appendChild(inputEl);
    inputEl.focus();

    // input event (debounce)
    const onInput = () => {
      const q = inputEl.value;
      lastQuery = q;

      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        doSearch(lastQuery).catch((err) => {
          console.error("[header-search] search error:", err);
        });
      }, 80);
    };

    inputEl.addEventListener("input", onInput);

    // Enter -> vào kết quả đầu tiên
    inputEl.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        ev.preventDefault();
        closeSearch();
        return;
      }
      if (ev.key === "Enter") {
        const first = hostLi.querySelector(".header-search-dd a.hs-item");
        if (first) window.location.href = first.getAttribute("href");
      }
    });

    // Click outside -> close
    const onDocPointerDown = (e) => {
      if (!inputEl) return;
      const inside = hostLi.contains(e.target);
      if (!inside) closeSearch();
    };
    document.addEventListener("pointerdown", onDocPointerDown, true);
    cleanupFns.push(() =>
      document.removeEventListener("pointerdown", onDocPointerDown, true)
    );

    // Click vào item -> cho phép đi link (đừng bị close sớm)
    const onDdPointerDown = (e) => {
      const a = e.target.closest("a.hs-item");
      if (a) {
        // không đóng ngay, để browser xử lý navigate mượt
        // closeSearch(); // optional
      }
    };
    const dd = ensureDropdown();
    dd.addEventListener("pointerdown", onDdPointerDown, true);
    cleanupFns.push(() => dd.removeEventListener("pointerdown", onDdPointerDown, true));
  }

  // 2) chặn nhảy trang Search và mở input inline
  searchLink.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSearch();
    },
    true
  );
});
