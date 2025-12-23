document.addEventListener("DOMContentLoaded", () => {
  console.log("[header-search] loaded");

  // ===== 1) Tìm link Search trong menu =====
  const menu = document.querySelector("#menu");
  if (!menu) return;

  const searchLink = Array.from(menu.querySelectorAll("a[href]")).find((a) => {
    try {
      const u = new URL(a.getAttribute("href"), window.location.origin);
      return /\/search\/?$/.test(u.pathname);
    } catch {
      return false;
    }
  });
  if (!searchLink) return;

  const hostLi = searchLink.closest("li") || searchLink.parentElement;
  if (!hostLi) return;

  hostLi.classList.add("search-li");
  hostLi.style.position = "relative";

  // ===== 2) Tính basePath & indexUrl đúng cho GH Pages + local =====
  // ví dụ: https://.../blog-lap-trinh-mang/search/  -> basePath = /blog-lap-trinh-mang/
  const basePath = (() => {
    try {
      const u = new URL(searchLink.getAttribute("href"), window.location.origin);
      return u.pathname.replace(/\/search\/?$/, "/");
    } catch {
      return (window.__SITE_BASE__ || "/").replace(/\/?$/, "/");
    }
  })();

  const indexUrl = basePath + "index.json";

  let inputEl = null;
  let dropdownEl = null;
  let indexData = null;
  let debounceTimer = null;

  // ===== Utils =====
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

    const res = await fetch(indexUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`Cannot load ${indexUrl} (${res.status})`);

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

  function closeSearch() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = null;

    if (dropdownEl) dropdownEl.remove();
    if (inputEl) inputEl.remove();
    dropdownEl = null;
    inputEl = null;

    searchLink.style.visibility = "";
    searchLink.style.pointerEvents = "";
  }

  function scoreItem(it, q) {
    const title = (it.title || "").toLowerCase();
    const summary = (it.summary || "").toLowerCase();
    const content = (it.content || "").toLowerCase();
    const tags = Array.isArray(it.tags) ? it.tags.join(" ").toLowerCase() : "";

    let s = 0;
    if (title.includes(q)) s += 6;
    if (title.startsWith(q)) s += 3;
    if (tags.includes(q)) s += 3;
    if (summary.includes(q)) s += 2;
    if (content.includes(q)) s += 1;
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
        const tags = Array.isArray(it.tags) ? it.tags : [];

        return `
          <a class="hs-item" href="${escapeHtml(url)}">
            <div class="hs-title">${highlight(title, q)}</div>
            ${
              tags.length
                ? `<div class="hs-tags">${escapeHtml(tags.join(" • "))}</div>`
                : ""
            }
          </a>
        `;
      })
      .join("");
  }

  async function doSearch(q) {
    const qLower = q.trim().toLowerCase();
    if (!qLower) {
      if (dropdownEl) dropdownEl.innerHTML = "";
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
    if (inputEl) return closeSearch();

    // Ẩn chữ Search nhưng giữ chỗ (không nhảy layout)
    searchLink.style.visibility = "hidden";
    searchLink.style.pointerEvents = "none";

    inputEl = document.createElement("input");
    inputEl.type = "search";
    inputEl.className = "header-search-input";
    inputEl.placeholder = "Tìm bài viết...";
    inputEl.autocomplete = "off";
    inputEl.spellcheck = false;

    inputEl.style.position = "absolute";
    inputEl.style.right = "0";
    inputEl.style.top = "50%";
    inputEl.style.transform = "translateY(-50%)";
    inputEl.style.zIndex = "10000";

    hostLi.appendChild(inputEl);
    inputEl.focus();

    inputEl.addEventListener("input", () => {
      const q = inputEl.value;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        doSearch(q).catch((err) =>
          console.error("[header-search] search error:", err)
        );
      }, 80);
    });

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

    // click ra ngoài => đóng
    const onDocDown = (e) => {
      if (!inputEl) return;
      if (!hostLi.contains(e.target)) closeSearch();
    };
    document.addEventListener("pointerdown", onDocDown, true);

    // gỡ listener khi đóng
    const _close = closeSearch;
    closeSearch = () => {
      document.removeEventListener("pointerdown", onDocDown, true);
      _close();
    };
  }

  // ===== 4) Chặn nhảy sang /search/ (capture) =====
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest("a[href]");
      if (!a) return;

      let path = "";
      try {
        const u = new URL(a.getAttribute("href"), window.location.origin);
        path = u.pathname;
      } catch {
        return;
      }

      if (!/\/search\/?$/.test(path)) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openSearch();
    },
    true
  );

  // log để bạn debug nhanh
  console.log("[header-search] indexUrl =", indexUrl);
});
