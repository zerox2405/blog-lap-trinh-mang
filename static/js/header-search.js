document.addEventListener("DOMContentLoaded", () => {
  console.log("[header-search] loaded");

  const base = (window.__SITE_BASE__ || "/").replace(/\/?$/, "/"); // luôn có dấu / cuối

  // tìm menu + link Search
  const menu = document.querySelector("#menu");
  if (!menu) return;

  const links = Array.from(menu.querySelectorAll("a[href]"));
  const searchLink = links.find((a) => {
    const href = a.getAttribute("href") || "";
    // match /search/ hoặc .../search/
    return /(^|\/)search\/?$/.test(href);
  });
  if (!searchLink) return;

  const hostLi = searchLink.closest("li") || searchLink.parentElement;
  if (!hostLi) return;
  hostLi.classList.add("search-li"); // để CSS bám đúng LI
  hostLi.style.position = "relative";

  let inputEl = null;
  let dropdownEl = null;
  let indexData = null;
  let debounceTimer = null;

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

    // QUAN TRỌNG: dùng base + index.json (không dùng /index.json)
    const url = base + "index.json";
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) throw new Error(`Cannot load ${url} (${res.status})`);
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
    if (title.includes(q)) s += 5;
    if (title.startsWith(q)) s += 2;
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
        return `
          <a class="hs-item" href="${escapeHtml(url)}">
            ${highlight(title, q)}
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

    // ẩn chữ Search nhưng giữ chỗ để menu không nhảy
    searchLink.style.visibility = "hidden";
    searchLink.style.pointerEvents = "none";

    inputEl = document.createElement("input");
    inputEl.type = "search";
    inputEl.className = "header-search-input";
    inputEl.placeholder = "Tìm bài viết...";
    inputEl.autocomplete = "off";
    inputEl.spellcheck = false;

    // không làm menu wrap/nhảy
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
        doSearch(q).catch((err) => console.error("[header-search]", err));
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

    // cleanup khi đóng
    const oldClose = closeSearch;
    closeSearch = () => {
      document.removeEventListener("pointerdown", onDocDown, true);
      oldClose();
    };
  }

  // CHẶN NHẢY TRANG SEARCH: bắt click CAPTURE toàn document
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const href = (a.getAttribute("href") || "").trim();
      if (!/(^|\/)search\/?$/.test(href)) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openSearch();
    },
    true
  );
});
