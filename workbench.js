/*
 * 작업대(워크벤치) — workbench.css 와 한 쌍.
 * ---------------------------------------------------------------------------
 * 홈 화면(index.html) 위에 "떠 있는 창"으로 도구를 1~5칸 나란히 두고 동시에
 * 사용한다. 뒤 홈은 딤+블러 스크림으로 비친다. 각 칸은 도구 페이지를
 * /<슬러그>/?embed=1 로 <iframe>에 띄운다(임베드 모드 → 순수 도구 UI만;
 * theme.js/theme.css 의 html.embed 처리 참고).
 *
 * 기능: 검색 가능한 도구 피커 · 분할 수(1~5) 선택 · 칸 사이 너비 드래그 ·
 *       도구를 다른 칸으로 끌어 옮기기(드래그&드롭). 도구 목록은 sidebar.js 가
 *       노출한 window.DGB_TOOLS(단일 source of truth)를 그대로 쓴다.
 */
(function () {
  "use strict";

  var MAX_PANES = 5;       // 최대 분할 수
  var DEFAULT_PANES = 2;   // 처음 열 때(저장값 없을 때) 칸 수
  var LS_KEY = "dgb-workbench-tools";  // 마지막으로 고른 도구 슬러그 배열

  var overlay = null, paneRow = null, layoutSel = null;
  // vorder = 칸의 "시각적(좌→우) 순서" 배열 = 레이아웃의 source of truth.
  // DOM 순서는 칸 생성 순서로 고정하고, 화면 배치는 flex order 로만 바꾼다.
  // → 도구를 다른 칸으로 옮길 때 iframe 을 DOM 에서 이동시키지 않으므로(=reparent
  //   안 함) 브라우저가 iframe 을 새로고침하지 않는다 → 입력 상태가 보존된다.
  var vorder = [], dividers = [];
  var optsSuggest = null;
  var pop = null, popList = null, popSearch = null, activePickerPane = null;
  var toastEl = null, toastTimer = 0;

  // 드래그 상태
  var dragSrc = null, dragGhost = null, dropTarget = null;

  // 빈 칸에서 바로 시작할 "자주 쓰는 도구" 칩(런처). 슬러그만 두고 이름·아이콘은 조회.
  var SUGGESTED = ["word-counter", "qr-code", "color-picker", "json-formatter", "calculator", "unit-converter"];

  // ── 인라인 SVG ──────────────────────────────────────────────────────────
  var SVG = {
    split: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>',
    caret: '<svg class="wb-picker-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    grip: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="9" cy="5" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="9" cy="19" r="1.4"/><circle cx="15" cy="5" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="15" cy="19" r="1.4"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>'
  };

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
      localStorage.setItem(LS_KEY, JSON.stringify(vorder.map(function (p) { return p.dataset.slug || ""; })));
    } catch (e) {}
  }

  // ── 같은 도구 중복 방지 ─────────────────────────────────────────────────
  // 같은 도구를 두 칸에 띄우면 두 iframe이 같은 origin의 localStorage(같은 키)를
  // 공유해 서로의 작업 데이터를 덮어쓴다(예: 메모장·악기 설정). origin이 같아
  // 인스턴스별 저장소 격리가 불가능하므로, "한 도구는 한 칸"으로 충돌을 막는다.
  function paneWithSlug(slug, except) {
    for (var i = 0; i < vorder.length; i++) {
      if (vorder[i] !== except && vorder[i].dataset.slug === slug) return vorder[i];
    }
    return null;
  }
  function flashPane(pane) {
    if (!pane) return;
    pane.classList.remove("wb-flash"); void pane.offsetWidth; pane.classList.add("wb-flash");
    setTimeout(function () { pane.classList.remove("wb-flash"); }, 1100);
  }
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 1900);
  }
  // 중복이면 막고(기존 칸 강조 + 안내) false, 아니면 로드하고 true 반환
  function trySelect(pane, slug) {
    if (!slug) return false;
    var other = paneWithSlug(slug, pane);
    if (other) { toast("이미 다른 칸에 열려 있어요"); flashPane(other); return false; }
    loadTool(pane, slug);
    return true;
  }

  // 빈 칸 런처용 추천 도구 칩(아이콘 + 이름). 한 번만 만들어 재사용.
  function suggestHtml() {
    if (optsSuggest !== null) return optsSuggest;
    var h = "";
    SUGGESTED.forEach(function (slug) {
      var t = findTool(slug);
      if (!t) return;
      h += '<button type="button" class="wb-chip" data-slug="' + esc(slug) + '">' +
           '<span class="wb-chip-ic">' + iconHtml(t.icon) + "</span>" + esc(t.name) + "</button>";
    });
    optsSuggest = h;
    return h;
  }

  // ── 한 칸(pane) ────────────────────────────────────────────────────────
  function loadTool(pane, slug) {
    var frame = pane.querySelector(".wb-frame");
    var empty = pane.querySelector(".wb-empty");
    var t = findTool(slug);
    pane.dataset.slug = t ? slug : "";

    // 헤더(피커 버튼) 갱신: 아이콘 칩(전환 팝) · 이름 · 그립/새탭 노출
    var ic = pane.querySelector(".wb-pane-ic");
    var nm = pane.querySelector(".wb-picker-name");
    ic.innerHTML = t ? iconHtml(t.icon) : "";
    if (t) { ic.classList.remove("pop"); void ic.offsetWidth; ic.classList.add("pop"); }
    nm.textContent = t ? t.name : "도구 선택";
    pane.querySelector(".wb-picker").classList.toggle("empty", !t);
    pane.querySelector(".wb-grip").hidden = !t;
    var open = pane.querySelector(".wb-open");
    if (t) { open.hidden = false; open.href = "/" + slug + "/"; }
    else { open.hidden = true; open.removeAttribute("href"); }

    if (!t) {
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
        '<button type="button" class="wb-picker empty" aria-label="도구 선택·검색">' +
          '<span class="wb-pane-ic"></span>' +
          '<span class="wb-picker-name">도구 선택</span>' +
          SVG.caret +
        "</button>" +
        '<button type="button" class="wb-grip" title="드래그해서 다른 칸으로 이동" aria-label="다른 칸으로 이동" hidden>' + SVG.grip + "</button>" +
        '<a class="wb-open" target="_blank" rel="noopener" title="새 탭에서 열기" aria-label="새 탭에서 열기" hidden>↗</a>' +
        '<button type="button" class="wb-close-pane" title="이 칸 닫기" aria-label="이 칸 닫기" hidden>✕</button>' +
      "</div>" +
      '<div class="wb-pane-body">' +
        '<div class="wb-empty"><div class="wb-empty-card">' +
          '<div class="wb-empty-ic">' + SVG.split + "</div>" +
          '<div class="wb-empty-kick">빈 칸</div>' +
          '<div class="wb-empty-title">도구를 선택하세요</div>' +
          '<div class="wb-empty-sub">위 칸을 눌러 검색하거나,<br>자주 쓰는 도구로 바로 시작하세요</div>' +
          '<div class="wb-suggest">' + suggestHtml() + "</div>" +
        "</div></div>" +
        '<div class="wb-spin" aria-hidden="true"></div>' +
        '<div class="wb-drop-hint" aria-hidden="true"><span>여기에 놓기</span></div>' +
        '<iframe class="wb-frame" title="도구" loading="lazy"></iframe>' +
      "</div>";

    var frame = pane.querySelector(".wb-frame");
    frame.addEventListener("load", function () {
      pane.classList.remove("loading");
      if (pane.dataset.slug) frame.style.opacity = 1;
    });
    // 피커 버튼 → 검색 팝오버 토글
    pane.querySelector(".wb-picker").addEventListener("click", function (e) {
      if (pop && !pop.hidden && activePickerPane === pane) { closePicker(); return; }
      openPicker(pane, e.currentTarget);
    });
    // 빈 칸 런처 칩 → 선택 + 로드(중복 방지)
    pane.querySelectorAll(".wb-chip").forEach(function (chip) {
      chip.addEventListener("click", function () { trySelect(pane, chip.getAttribute("data-slug")); });
    });
    // 그립 → 다른 칸으로 끌어 옮기기
    pane.querySelector(".wb-grip").addEventListener("pointerdown", function (e) { startDrag(pane, e); });
    pane.querySelector(".wb-close-pane").addEventListener("click", function () { removePane(pane); });
    return pane;
  }

  function equalize() {
    vorder.forEach(function (p) { p.style.flex = "1 1 0"; });
  }

  // vorder(시각 순서)에 맞춰 각 칸의 flex order 를 부여하고, 칸 사이 분할 손잡이
  // 개수를 (칸-1)개로 맞춘다. DOM 순서는 건드리지 않는다(iframe 보존 핵심).
  function relayout() {
    var n = vorder.length;
    while (dividers.length < n - 1) {
      var d = document.createElement("div");
      d.className = "wb-divider";
      bindDivider(d);
      paneRow.appendChild(d);
      dividers.push(d);
    }
    while (dividers.length > n - 1) dividers.pop().remove();
    vorder.forEach(function (p, i) { p.style.order = i * 10; });
    dividers.forEach(function (d, i) { d.style.order = i * 10 + 5; });
  }

  function addPane(slug) {
    if (vorder.length >= MAX_PANES) return;
    var pane = makePane(slug || "");
    paneRow.appendChild(pane);   // DOM 끝에 추가(시각 위치는 relayout 의 order 가 결정)
    vorder.push(pane);
    relayout();
    if (slug) loadTool(pane, slug);
  }

  function removePane(pane) {
    if (vorder.length <= 1) return;  // 최소 1칸 유지
    var i = vorder.indexOf(pane);
    if (i < 0) return;
    vorder.splice(i, 1);
    pane.remove();
    relayout();
    equalize();
    updateChrome();
    saveState();
  }

  // 분할 수(1~5)를 직접 지정 — 늘리면 빈 칸 추가, 줄이면 끝(맨 오른쪽) 칸부터 제거.
  function setPaneCount(n) {
    n = Math.max(1, Math.min(MAX_PANES, n));
    while (vorder.length < n) addPane("");
    while (vorder.length > n) removePane(vorder[vorder.length - 1]);
    equalize();
    updateChrome();
    saveState();
  }

  // 두 칸의 시각 위치를 맞바꾼다(FLIP 애니메이션). order 만 바꾸고 iframe 은 그대로
  // 두므로 양쪽 도구의 입력 상태가 모두 보존된다.
  function movePane(a, b) {
    var i = vorder.indexOf(a), j = vorder.indexOf(b);
    if (i < 0 || j < 0 || i === j) return;
    var panes = vorder.slice();
    var first = panes.map(function (p) { return p.getBoundingClientRect().left; });
    vorder[i] = b; vorder[j] = a;
    relayout();
    panes.forEach(function (p, k) {
      var dx = first[k] - p.getBoundingClientRect().left;
      if (dx) { p.style.transition = "none"; p.style.transform = "translateX(" + dx + "px)"; }
    });
    requestAnimationFrame(function () {
      panes.forEach(function (p) {
        if (p.style.transform) {
          p.style.transition = "transform .28s cubic-bezier(.2,.7,.2,1)";
          p.style.transform = "";
        }
      });
    });
    saveState();
  }

  // 분할 세그먼트 active + 1칸일 땐 칸 닫기 숨김
  function updateChrome() {
    var n = vorder.length;
    if (layoutSel) {
      layoutSel.querySelectorAll(".wb-layout-btn").forEach(function (b) {
        b.classList.toggle("active", parseInt(b.getAttribute("data-n"), 10) === n);
      });
    }
    vorder.forEach(function (p) {
      var b = p.querySelector(".wb-close-pane"); if (b) b.hidden = n <= 1;
    });
  }

  // ── 검색 가능한 도구 피커(싱글턴 팝오버) ───────────────────────────────
  function buildPop() {
    pop = document.createElement("div");
    pop.className = "wb-pop";
    pop.hidden = true;
    pop.innerHTML =
      '<div class="wb-pop-search">' + SVG.search +
        '<input type="text" placeholder="도구 검색…" aria-label="도구 검색" autocomplete="off" spellcheck="false"></div>' +
      '<div class="wb-pop-list"></div>';
    document.body.appendChild(pop);
    popList = pop.querySelector(".wb-pop-list");
    popSearch = pop.querySelector(".wb-pop-search input");

    var h = "";
    cats().forEach(function (c) {
      h += '<div class="wb-pop-grp"><div class="wb-pop-kick">' + esc(c.label) + "</div>";
      c.tools.forEach(function (t) {
        h += '<button type="button" class="wb-pop-item" data-slug="' + esc(t.slug) + '" data-name="' + esc(t.name) + '">' +
             '<span class="wb-pop-ic">' + iconHtml(t.icon) + "</span>" +
             '<span class="wb-pop-nm">' + esc(t.name) + "</span></button>";
      });
      h += "</div>";
    });
    popList.innerHTML = h;

    popSearch.addEventListener("input", function () { filterPop(popSearch.value); });
    popSearch.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var first = popList.querySelector('.wb-pop-item:not([hidden])');
        if (first && activePickerPane && trySelect(activePickerPane, first.getAttribute("data-slug"))) closePicker();
      }
    });
    popList.addEventListener("click", function (e) {
      var it = e.target.closest(".wb-pop-item");
      if (!it || !activePickerPane) return;
      // 중복이면 trySelect가 안내만 하고 false → 팝오버는 열어둔다
      if (trySelect(activePickerPane, it.getAttribute("data-slug"))) closePicker();
    });
  }

  function filterPop(term) {
    term = (term || "").trim().toLowerCase();
    popList.querySelectorAll(".wb-pop-grp").forEach(function (g) {
      var any = false;
      g.querySelectorAll(".wb-pop-item").forEach(function (it) {
        var show = !term ||
          it.getAttribute("data-name").toLowerCase().indexOf(term) >= 0 ||
          it.getAttribute("data-slug").indexOf(term) >= 0;
        it.hidden = !show;
        if (show) any = true;
      });
      g.hidden = !any;
    });
    popList.scrollTop = 0;
  }

  function openPicker(pane, anchor) {
    if (!pop) buildPop();
    activePickerPane = pane;
    popSearch.value = "";
    filterPop("");
    // 현재 도구 표시 + 다른 칸에 이미 열린 도구는 "열림"으로 비활성 표시
    var cur = pane.dataset.slug || "";
    popList.querySelectorAll(".wb-pop-item").forEach(function (it) {
      var s = it.getAttribute("data-slug");
      it.classList.toggle("active", s === cur);
      it.classList.toggle("taken", !!paneWithSlug(s, pane));
    });
    pop.hidden = false;

    var r = anchor.getBoundingClientRect();
    var vw = window.innerWidth, vh = window.innerHeight;
    var w = Math.min(330, Math.max(238, r.width));
    var left = Math.max(8, Math.min(r.left, vw - 8 - w));
    var top = r.bottom + 6;
    pop.style.width = w + "px";
    pop.style.left = left + "px";
    pop.style.top = top + "px";
    pop.style.maxHeight = Math.max(180, vh - top - 14) + "px";
    setTimeout(function () { popSearch.focus(); }, 0);
  }

  function closePicker() {
    if (pop) pop.hidden = true;
    activePickerPane = null;
  }

  // ── 칸 사이 너비 드래그 손잡이 ──────────────────────────────────────────
  function bindDivider(div) {
    var startX, prevPane, nextPane, prevW, nextW;
    function move(e) {
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      var total = prevW + nextW, min = 220;
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
      if (window.matchMedia("(max-width:760px)").matches) return;  // 모바일(세로 적층) 비활성
      // DOM 형제가 아니라 "시각 순서(vorder)"의 양옆 칸을 조절한다(order 로 배치되므로)
      var idx = dividers.indexOf(div);
      prevPane = vorder[idx]; nextPane = vorder[idx + 1];
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

  // ── 도구를 다른 칸으로 끌어 옮기기 ─────────────────────────────────────
  function paneFromPoint(x, y) {
    var el = document.elementFromPoint(x, y);
    while (el && el !== document.body) {
      if (el.classList && el.classList.contains("wb-pane")) return el;
      el = el.parentElement;
    }
    return null;
  }
  function setDropTarget(pane) {
    if (dropTarget === pane) return;
    if (dropTarget) dropTarget.classList.remove("wb-drop-target");
    dropTarget = pane;
    if (dropTarget) dropTarget.classList.add("wb-drop-target");
  }
  function moveGhost(x, y) {
    dragGhost.style.left = x + "px";
    dragGhost.style.top = y + "px";
  }
  function onDragMove(e) {
    moveGhost(e.clientX, e.clientY);
    var target = paneFromPoint(e.clientX, e.clientY);
    setDropTarget(target && target !== dragSrc ? target : null);
  }
  function onDragUp() {
    window.removeEventListener("pointermove", onDragMove);
    // 옮기기 = 두 칸의 "시각 위치"를 맞바꿈(order 만 변경 → iframe 보존 → 입력 유지).
    // 대상이 비었으면 빈 칸이 출발 위치로 와 사실상 "이동"이 된다.
    if (dropTarget && dropTarget !== dragSrc) movePane(dragSrc, dropTarget);
    setDropTarget(null);
    if (dragGhost) { dragGhost.remove(); dragGhost = null; }
    if (dragSrc) dragSrc.classList.remove("wb-drag-source");
    document.body.classList.remove("wb-tool-dragging");
    dragSrc = null;
  }
  function startDrag(pane, e) {
    if (!pane.dataset.slug) return;
    var t = findTool(pane.dataset.slug);
    dragSrc = pane;
    var ghost = document.createElement("div");
    ghost.className = "wb-drag-ghost";
    ghost.innerHTML = '<span class="wb-pane-ic">' + (t ? iconHtml(t.icon) : "") + "</span>" +
                      "<span>" + (t ? esc(t.name) : "") + "</span>";
    document.body.appendChild(ghost);
    dragGhost = ghost;
    document.body.classList.add("wb-tool-dragging");
    pane.classList.add("wb-drag-source");
    moveGhost(e.clientX, e.clientY);
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragUp, { once: true });
    if (e.cancelable) e.preventDefault();
  }

  // ── 오버레이 열기/닫기 ─────────────────────────────────────────────────
  function build() {
    overlay = document.createElement("div");
    overlay.className = "wb-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "작업대");

    var layout = '<div class="wb-layout" role="group" aria-label="화면 분할 수"><span class="wb-layout-label">분할</span>';
    for (var n = 1; n <= MAX_PANES; n++) layout += '<button type="button" class="wb-layout-btn" data-n="' + n + '">' + n + "</button>";
    layout += "</div>";

    overlay.innerHTML =
      '<div class="wb-window">' +
        '<div class="wb-bar">' +
          '<div class="wb-title"><span class="wb-title-mark">' + SVG.split + "</span>작업대</div>" +
          '<div class="wb-hint">도구를 나란히 놓고 함께 사용하세요</div>' +
          '<div class="wb-bar-sp"></div>' +
          layout +
          '<button class="wb-close" type="button" aria-label="작업대 닫기">닫기 ✕</button>' +
        "</div>" +
        '<div class="wb-row"></div>' +
      "</div>";
    document.body.appendChild(overlay);
    paneRow = overlay.querySelector(".wb-row");
    layoutSel = overlay.querySelector(".wb-layout");
    toastEl = document.createElement("div");
    toastEl.className = "wb-toast";
    toastEl.hidden = true;
    paneRow.appendChild(toastEl);

    layoutSel.addEventListener("click", function (e) {
      var b = e.target.closest(".wb-layout-btn");
      if (b) setPaneCount(parseInt(b.getAttribute("data-n"), 10));
    });
    overlay.querySelector(".wb-close").addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });

    // 전역: Esc(피커 먼저 닫고, 없으면 오버레이), 바깥 클릭으로 피커 닫기
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (pop && !pop.hidden) { closePicker(); return; }
      if (overlay.classList.contains("open")) close();
    });
    document.addEventListener("pointerdown", function (e) {
      if (!pop || pop.hidden) return;
      if (pop.contains(e.target)) return;
      if (e.target.closest && e.target.closest(".wb-picker")) return;
      closePicker();
    });
  }

  function open() {
    if (!overlay) build();
    if (!vorder.length) {
      var saved = loadSaved();
      var n = Math.max(1, Math.min(MAX_PANES, saved.length || DEFAULT_PANES));
      var used = {};
      for (var i = 0; i < n; i++) {
        var s = saved[i] || "";
        if (s && used[s]) s = "";   // 저장값에 같은 도구가 중복돼 있으면 한 칸만 유지
        if (s) used[s] = 1;
        addPane(s);
      }
    }
    equalize();
    updateChrome();
    overlay.classList.add("open");
    document.documentElement.classList.add("wb-lock");
  }
  function close() {
    if (!overlay) return;
    closePicker();
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
