/*
 * 용어 설명(말풍선) 자동화 — 도구상자
 * ---------------------------------------------------------------------------
 * 어려운 용어(특히 금융·세금)가 설명 글에 나오면 점선 밑줄로 표시하고,
 * 클릭/탭(데스크톱은 호버)하면 짧은 설명 말풍선을 띄운다. sidebar.js 가
 * "설명 글(.content/.lede)이 있는 페이지"에서만 이 파일을 지연 로드하므로,
 * 도구·가이드 페이지를 하나도 안 고치고 전 페이지에 자동 적용된다.
 * 새 용어가 필요하면 아래 GLOSSARY 한 곳에만 추가하면 된다.
 *
 * 안전장치: 설명 글(.content/.lede)의 텍스트만 훑고, 도구 입력창·결과 UI(.box)·
 * 링크·코드는 건드리지 않으며, 한 단어는 페이지에서 "첫 등장 한 번만" 표시한다.
 */
(function () {
  "use strict";
  if (window.__dgbGlossary) return;
  window.__dgbGlossary = true;

  // ── 용어 사전(단일 출처) — 짧고 쉬운 1~2문장 ──────────────────────────────
  var GLOSSARY = {
    "과세표준": "세금을 매기는 기준 금액. 소득이나 재산에서 각종 공제를 뺀, 세율을 곱하는 대상 금액입니다.",
    "누진공제": "누진세율 구간이 바뀔 때 세금이 갑자기 뛰지 않도록 빼주는 금액. ‘과세표준 × 세율 − 누진공제’로 한 번에 계산할 수 있게 해줍니다.",
    "누진세율": "소득·재산이 많을수록 더 높은 세율을 매기는 방식. 구간별로 단계적으로 올라갑니다.",
    "산출세액": "과세표준에 세율을 적용해 계산한 세금. 여기서 세액공제를 빼면 실제 낼 세금이 됩니다.",
    "신고세액공제": "세금을 기한 안에 스스로 신고하면 산출세액의 일정 비율(상속·증여세는 3%)을 깎아주는 혜택입니다.",
    "양도차익": "자산을 판 금액(양도가액)에서 살 때 든 금액(취득가액)과 필요경비를 뺀, 실제로 남은 이익입니다.",
    "장기보유특별공제": "부동산을 오래 보유했을 때 양도차익의 일부를 공제해 주는 제도. 일반은 3년 6%부터 15년 30%까지 늘어납니다.",
    "양도소득금액": "양도차익에서 장기보유특별공제를 뺀 금액. 여기서 기본공제를 더 빼면 과세표준이 됩니다.",
    "필요경비": "자산을 사고팔 때 든 비용. 취득세·중개보수·샷시 같은 자본적 지출 등이 인정되어 양도차익을 줄여 줍니다.",
    "비과세": "법에서 세금을 매기지 않도록 정한 것. 예: 1세대 1주택을 일정 요건으로 양도하면 양도세가 비과세됩니다.",
    "조정대상지역": "집값 과열을 막으려고 정부가 지정한 지역. 이 지역 주택은 양도세 거주요건 등 규제가 더 붙습니다.",
    "고가주택": "양도가액이 12억 원을 넘는 주택. 1세대 1주택이어도 12억 초과분에는 양도세가 매겨집니다.",
    "증여재산공제": "증여받을 때 일정 금액까지 세금을 매기지 않는 공제. 10년 합산 기준 배우자 6억, 성인 자녀 5천만 원 등입니다.",
    "일괄공제": "상속세에서 기초공제·인적공제를 따지는 대신 한 번에 5억 원을 공제해 주는 방식입니다.",
    "배우자공제": "배우자에게 적용되는 공제. 상속은 배우자가 실제 상속받은 금액에 따라 최소 5억~최대 30억 원까지 공제됩니다.",
    "기준소득월액": "국민연금 보험료를 매기는 기준 소득. 상한(2026년 637만 원)·하한(40만 원)이 있어 소득이 아주 높거나 낮으면 이 값으로 고정됩니다.",
    "보수월액": "건강보험료 등을 매기는 기준이 되는 월 보수. 보통 비과세를 뺀 과세 대상 급여를 말합니다.",
    "장기요양보험": "노인 등의 장기요양 비용을 위한 사회보험. 건강보험료에 일정 비율(2026년 12.95%)을 곱해 함께 냅니다.",
    "4대보험": "직장인이 의무로 가입하는 국민연금·건강보험·고용보험·산재보험을 묶어 부르는 말입니다.",
    "원천징수": "소득을 줄 때 지급자가 세금을 미리 떼어 국가에 내는 것. 나중에 정산할 때 기납부세액으로 반영됩니다.",
    "중간예납": "종합소득세를 한 번에 내기 부담되지 않도록 그 전에 일부를 미리 내는 제도입니다.",
    "실수령액": "세전 급여에서 4대보험과 소득세·지방소득세까지 모두 뺀, 실제로 통장에 들어오는 금액입니다.",
    "사전증여": "사망 전에 미리 한 증여. 상속개시 전 10년(상속인 외 5년) 이내 증여는 상속재산에 합산해 과세합니다.",
    "부담부증여": "빚(채무)을 함께 넘기는 증여. 넘긴 채무만큼은 양도로 보아 양도세가, 나머지는 증여세가 매겨집니다.",
    "세대생략": "조부모가 부모를 건너뛰고 손주에게 바로 증여·상속하는 것. 세금이 30%(미성년 고액은 40%) 더 붙습니다.",
    "공급가액": "부가세가 붙기 전의 물건·서비스 값. 여기에 10%를 더하면 부가세 포함 합계가 됩니다.",
    "영세율": "부가가치세율을 0%로 적용하는 것. 주로 수출 등에 적용되어 사실상 부가세 부담이 없습니다.",
    "EXIF": "사진 파일에 기록되는 촬영 정보. 카메라 기종·촬영 일시, 때로는 GPS 위치까지 담겨 공유 전 제거가 권장됩니다.",
    "해상도": "이미지의 가로×세로 픽셀 수. 클수록 더 선명하고 크게 표현되지만 파일 용량도 커집니다."
  };

  // ── 스타일 1회 주입 ───────────────────────────────────────────────────────
  var st = document.createElement("style");
  st.textContent =
    ".gl-term{border-bottom:1px dotted var(--accent,#df4324);cursor:help;-webkit-tap-highlight-color:transparent}" +
    ".gl-term:hover,.gl-term:focus-visible{background:rgba(223,67,36,.1);border-radius:3px;outline:none}" +
    ".gl-pop{position:fixed;z-index:300;max-width:300px;background:var(--ink,#1b1a1e);color:var(--paper,#F3EEE3);border-radius:10px;box-shadow:0 18px 44px -14px rgba(0,0,0,.55);padding:12px 15px;font-family:var(--kr,sans-serif)}" +
    ".gl-pop[hidden]{display:none}" +
    ".gl-pop b{display:block;font-size:13.5px;font-weight:800;color:var(--accent,#df4324);margin-bottom:5px;letter-spacing:-.01em}" +
    ".gl-pop p{font-size:13px;color:var(--paper,#F3EEE3);opacity:.93;line-height:1.62}";
  (document.head || document.documentElement).appendChild(st);

  // ── 용어 표시(첫 등장만) ──────────────────────────────────────────────────
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  var terms = Object.keys(GLOSSARY).sort(function (a, b) { return b.length - a.length; });
  var re = new RegExp("(" + terms.map(esc).join("|") + ")");
  var used = {};

  function ancestorSkip(node) {
    var p = node.parentNode;
    while (p && p.nodeType === 1) {
      var tag = p.nodeName.toLowerCase();
      if (tag === "a" || tag === "button" || tag === "code" || tag === "pre" || tag === "script" || tag === "style" || tag === "select" || tag === "textarea") return true;
      if (p.classList && (p.classList.contains("gl-term") || p.classList.contains("codebox"))) return true;
      p = p.parentNode;
    }
    return false;
  }

  function marker(term) {
    var s = document.createElement("span");
    s.className = "gl-term";
    s.setAttribute("role", "button");
    s.setAttribute("tabindex", "0");
    s.setAttribute("aria-label", term + " — 용어 설명 보기");
    s.setAttribute("data-term", term);
    s.textContent = term;
    return s;
  }

  function wrapTextNode(node) {
    var text = node.nodeValue, idx, frag = null, last = 0, search = text;
    var offset = 0;
    while ((idx = search.search(re)) !== -1) {
      var m = search.match(re)[0];
      var absStart = offset + idx;
      if (used[m]) { offset = absStart + m.length; search = text.slice(offset); continue; }
      used[m] = true;
      if (!frag) frag = document.createDocumentFragment();
      if (absStart > last) frag.appendChild(document.createTextNode(text.slice(last, absStart)));
      frag.appendChild(marker(m));
      last = absStart + m.length;
      offset = last; search = text.slice(offset);
    }
    if (frag) {
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    }
  }

  function scan() {
    var roots = document.querySelectorAll(".content, .lede");
    var textNodes = [];
    for (var i = 0; i < roots.length; i++) {
      var w = document.createTreeWalker(roots[i], NodeFilter.SHOW_TEXT, null, false);
      var n;
      while ((n = w.nextNode())) {
        if (n.nodeValue && n.nodeValue.trim() && !ancestorSkip(n)) textNodes.push(n);
      }
    }
    for (var j = 0; j < textNodes.length; j++) wrapTextNode(textNodes[j]);
  }

  // ── 말풍선 ────────────────────────────────────────────────────────────────
  var pop = document.createElement("div");
  pop.className = "gl-pop";
  pop.hidden = true;
  pop.innerHTML = "<b></b><p></p>";
  document.body.appendChild(pop);
  var current = null, hideTimer = 0;
  var hoverCapable = window.matchMedia && window.matchMedia("(hover: hover)").matches;

  function position(el) {
    var r = el.getBoundingClientRect();
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var vw = window.innerWidth, vh = window.innerHeight;
    var left = Math.max(8, Math.min(r.left + r.width / 2 - pw / 2, vw - 8 - pw));
    var top = r.bottom + 8;
    if (top + ph > vh - 8) top = Math.max(8, r.top - 8 - ph);
    pop.style.left = left + "px";
    pop.style.top = top + "px";
  }
  function show(el, pinned) {
    var t = el.getAttribute("data-term");
    if (!GLOSSARY[t]) return;
    current = el;
    pop.querySelector("b").textContent = t;
    pop.querySelector("p").textContent = GLOSSARY[t];
    pop.dataset.pinned = pinned ? "1" : "";
    pop.hidden = false;
    position(el);
  }
  function hide() { pop.hidden = true; pop.dataset.pinned = ""; current = null; }

  document.addEventListener("click", function (e) {
    var m = e.target.closest && e.target.closest(".gl-term");
    if (m) {
      e.preventDefault();
      if (!pop.hidden && current === m && pop.dataset.pinned) hide();
      else show(m, true);
      return;
    }
    if (!pop.hidden && !(e.target.closest && e.target.closest(".gl-pop"))) hide();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !pop.hidden) { hide(); return; }
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("gl-term")) {
      e.preventDefault(); show(e.target, true);
    }
  });
  if (hoverCapable) {
    document.addEventListener("mouseover", function (e) {
      var m = e.target.closest && e.target.closest(".gl-term");
      if (!m || pop.dataset.pinned) return;
      clearTimeout(hideTimer); show(m, false);
    });
    document.addEventListener("mouseout", function (e) {
      var m = e.target.closest && e.target.closest(".gl-term");
      if (!m || pop.dataset.pinned) return;
      hideTimer = setTimeout(hide, 140);
    });
    pop.addEventListener("mouseover", function () { clearTimeout(hideTimer); });
    pop.addEventListener("mouseout", function () { if (!pop.dataset.pinned) hideTimer = setTimeout(hide, 140); });
  }
  window.addEventListener("scroll", function () { if (!pop.hidden) hide(); }, true);
  window.addEventListener("resize", function () { if (!pop.hidden) hide(); });

  scan();
})();
