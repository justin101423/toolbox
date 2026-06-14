/*
 * 작업대(워크벤치) — workbench.css 와 한 쌍.
 * ---------------------------------------------------------------------------
 * 홈 화면(index.html) 위에 오버레이로 떠서, 도구를 여러 칸 나란히 두고
 * "동시에" 사용하기 위한 기능. 각 칸은 도구 페이지를 ?embed=1 로 <iframe> 에
 * 띄운다(임베드 모드 → 상단바·사이드바·설명 없이 순수 도구 UI만; theme.js/
 * theme.css 의 html.embed 처리 참고).
 *
 * 도구 목록은 sidebar.js 가 노출한 window.DGB_TOOLS(단일 source of truth)를
 * 그대로 쓴다 → 새 도구를 추가하면 작업대 선택기에도 자동 반영된다.
 *
 * 칸 수: 베타에서는 MAX_PANES=2 로 제한. 코드는 N칸으로 일반화돼 있으므로
 * 나중에 한도만 올리면(3·4칸) 그대로 확장된다(칸 추가/닫기·드래그 분할 포함).
 */
(function () {
  "use strict";

  var MAX_PANES = 2;       // 베타 한도 (나중에 3·4 로 올리면 확장됨)
  var DEFAULT_PANES = 2;   // 처음 열 때 만드는 칸 수
  var LS_KEY = "dgb-workbench-tools";  // 마지막으로 고른 도구 슬러그 배열

  var overlay = null, paneRow = null, addBtn = null;
  var paneCount = 0;
  var optsCache = null;

  // ── 데이터 헬퍼(단일 출처 = sidebar.js) ────────────────────────────────
  function cats() { return (window.DGB_TOOLS && window.DGB_TOOLS.categories) || []; }
  function iconHtml(name) {
    return (window.DGB_TOOLS && window.DGB_TOOLS.iconHtml) ? window.DGB_TOOLS.iconHtml(name) : "";
  }
  function findTool(slug) {
    var cs = cats();
    for (var i = 0; i < cs.length; i++) {
      for (var j = 0; j < cs[i].tools.length; j++) {
        if (cs[i].tools[j].slug === slug) return cs[i].tools[j];
      }
    }
    return null;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function loadSaved() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch (e) { return []; }
  }
  function saveState() {
    try {
      var arr = [];
      paneRow.querySelectorAll(".wb-pane").forEach(function (p) { arr.push(p.dataset.slug || ""); });
      localStorage.setItem(LS_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  // 카테고리별 <optgroup> 으로 묶은 도구 선택 옵션(한 번만 만들어 재사용)
  function optionsHtml() {
    if (optsCache) return optsCache;
    var h = '<option value="">도구 선택…</option>';
    cats().forEach(function (c) {
      h += '<optgroup label="' + esc(c.label) + '">';
      c.tools.forEach(function (t) {
        h += '<option value="' + esc(t.slug) + '">' + esc(t.name) + "</option>";
      });
      h += "</optgroup>";
    });
    optsCache = h;
    return h;
  }

  // ── 한 칸(pane) 동작 ───────────────────────────────────────────────────
  function loadTool(pane, slug) {
    var frame = pane.querySelector(".wb-frame");
    var empty = pane.querySelector(".wb-empty");
    pane.dataset.slug = slug || "";
    var t = findTool(slug);

    // 헤더 아이콘 · 새 탭 링크 갱신
    pane.querySelector(".wb-pane-ic").innerHTML = t ? iconHtml(t.icon) : "";
    var open = pane.querySelector(".wb-open");
    if (slug) { open.href = "/" + slug + "/"; open.style.display = ""; }
    else { open.removeAttribute("href"); open.style.display = "none"; }

    if (!slug) {
      pane.classList.remove("loading");
      frame.removeAttribute("src");
      frame.style.opacity = 0;
      empty.style.display = "";
      saveState();
      return;
    }
    empty.style.display = "none";
    frame.style.opacity = 0;
    pane.classList.add("loading");
    frame.src = "/" + slug + "/?embed=1";
    saveState();
  }

  function makePane(slug) {
    var pane = document.createElement("div");
    pane.className = "wb-pane";
    pane.innerHTML =
      '<div class="wb-pane-head">' +
        '<span class="wb-pane-ic"></span>' +
        '<select class="wb-select" aria-label="도구 선택">' + optionsHtml() + "</select>" +
        '<a class="wb-open" target="_blank" rel="noopener" title="새 탭에서 열기" aria-label="새 탭에서 열기" style="display:none">↗</a>' +
        '<button class="wb-close-pane" type="button" title="이 칸 닫기" aria-label="이 칸 닫기">✕</button>' +
      "</div>" +
      '<div class="wb-pane-body">' +
        '<div class="wb-empty"><div>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>' +
          "위에서 도구를 선택하세요" +
        "</div></div>" +
        '<div class="wb-spin" aria-hidden="true"></div>' +
        '<iframe class="wb-frame" title="도구" loading="lazy"></iframe>' +
      "</div>";

    var sel = pane.querySelector(".wb-select");
    var frame = pane.querySelector(".wb-frame");
    sel.value = slug || "";
    sel.addEventListener("change", function () { loadTool(pane, sel.value); });
    frame.addEventListener("load", function () {
      pane.classList.remove("loading");
      if (pane.dataset.slug) frame.style.opacity = 1;
    });
    pane.querySelector(".wb-close-pane").addEventListener("click", function () { removePane(pane); });
    return pane;
  }

  function equalize() {
    paneRow.querySelectorAll(".wb-pane").forEach(function (p) { p.style.flex = "1 1 0"; });
  }

  function addPane(slug) {
    if (paneCount >= MAX_PANES) return;
    if (paneCount > 0) {
      var div = document.createElement("div");
      div.className = "wb-divider";
      bindDivider(div);
      paneRow.appendChild(div);
    }
    var pane = makePane(slug || "");
    paneRow.appendChild(pane);
    paneCount++;
    if (slug) loadTool(pane, slug);
    equalize();
    updateChrome();
    saveState();
  }

  function removePane(pane) {
    if (paneCount <= 1) return;  // 최소 1칸은 유지
    var prev = pane.previousElementSibling, next = pane.nextElementSibling;
    if (prev && prev.classList.contains("wb-divider")) prev.remove();
    else if (next && next.classList.contains("wb-divider")) next.remove();
    pane.remove();
    paneCount--;
    equalize();
    updateChrome();
    saveState();
  }

  // "칸 추가" 버튼 상태 + 1칸일 땐 칸 닫기 숨김
  function updateChrome() {
    if (addBtn) {
      var full = paneCount >= MAX_PANES;
      addBtn.disabled = full;
      addBtn.title = full ? ("베타에서는 최대 " + MAX_PANES + "칸까지 가능해요") : "칸 추가";
    }
    var closers = paneRow.querySelectorAll(".wb-close-pane");
    closers.forEach(function (b) { b.style.display = paneCount <= 1 ? "none" : ""; });
  }

  // ── 칸 사이 드래그 분할(가로). 모바일(세로 적층)에선 비활성 ───────────
  function bindDivider(div) {
    var startX, prevPane, nextPane, prevW, nextW;
    function move(e) {
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      var total = prevW + nextW, min = 240;
      var np = Math.max(min, Math.min(total - min, prevW + (x - startX)));
      prevPane.style.flex = "0 0 " + np + "px";
      nextPane.style.flex = "1 1 0";
      if (e.cancelable) e.preventDefault();
    }
    function up() {
      document.body.classList.remove("wb-resizing");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    }
    function down(e) {
      if (window.matchMedia("(max-width:760px)").matches) return;  // 모바일 비활성
      prevPane = div.previousElementSibling; nextPane = div.nextElementSibling;
      if (!prevPane || !nextPane) return;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      prevW = prevPane.getBoundingClientRect().width;
      nextW = nextPane.getBoundingClientRect().width;
      document.body.classList.add("wb-resizing");
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", up);
      if (e.cancelable) e.preventDefault();
    }
    div.addEventListener("mousedown", down);
    div.addEventListener("touchstart", down, { passive: false });
  }

  // ── 오버레이 열기/닫기 ─────────────────────────────────────────────────
  function build() {
    overlay = document.createElement("div");
    overlay.className = "wb-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "작업대");
    overlay.innerHTML =
      '<div class="wb-bar">' +
        '<div class="wb-title">작업대 <span class="wb-beta">BETA</span></div>' +
        '<div class="wb-hint">도구를 나란히 놓고 함께 사용하세요</div>' +
        '<div class="wb-bar-sp"></div>' +
        '<button class="wb-add" type="button">칸 추가 +</button>' +
        '<button class="wb-close" type="button" aria-label="작업대 닫기">닫기 ✕</button>' +
      "</div>" +
      '<div class="wb-row"></div>';
    document.body.appendChild(overlay);
    paneRow = overlay.querySelector(".wb-row");
    addBtn = overlay.querySelector(".wb-add");
    addBtn.addEventListener("click", function () { addPane(""); });
    overlay.querySelector(".wb-close").addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) close();
    });
  }

  function open() {
    if (!overlay) build();
    if (!paneCount) {
      var saved = loadSaved();
      for (var i = 0; i < DEFAULT_PANES; i++) addPane(saved[i] || "");
    }
    overlay.classList.add("open");
    document.documentElement.classList.add("wb-lock");
  }
  function close() {
    if (!overlay) return;
    overlay.classList.remove("open");
    document.documentElement.classList.remove("wb-lock");
  }

  // ── 상단바 "작업대" 버튼과 연결 ────────────────────────────────────────
  function init() {
    var btn = document.getElementById("workbenchToggle");
    if (btn) btn.addEventListener("click", open);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
