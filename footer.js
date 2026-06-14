/*
 * 공통 푸터 생성 스크립트 (도구상자) — sidebar.js와 같은 패턴.
 * ------------------------------------------------------------------
 * ★ 초안(미배포): 이 파일은 아직 어떤 페이지에도 연결돼 있지 않다.
 *   #site-footer 컨테이너가 있는 페이지에서만 동작하므로(없으면 무동작),
 *   지금 리포지토리에 있어도 사이트엔 아무 영향이 없다.
 *
 *   AdSense 승인 후 "빅스윕"에서 전 페이지의 기존 <footer>…</footer> 를
 *   아래 컨테이너 + 스크립트로 1회 치환하면 활성화된다. 이후 푸터 수정은
 *   이 파일 한 곳에서만 하면 된다(전 페이지 자동 반영).
 *
 *   ── 배포 시 각 페이지 치환 패턴 ──
 *     <footer id="site-footer"><noscript>
 *       <a href="/">도구상자</a> · <a href="/privacy.html">개인정보처리방침</a>
 *     </noscript></footer>
 *     <script src="/footer.js"></script>          (theme.js 근처, sidebar.js와 같은 위치)
 *
 *   현재 푸터는 형식이 2종(가이드형 여러 줄 / 구형 도구 인라인 체인)이지만 내용은
 *   동일하므로, 스윕은 "<footer> … </footer>" 블록을 위 컨테이너로 통째 치환하면 된다.
 * ------------------------------------------------------------------
 */
(function () {
  "use strict";

  // 푸터 링크(단일 출처). 새 정책/안내 페이지가 생기면 여기만 고친다.
  var LINKS = [
    { href: "/guide/",             text: "가이드" },
    { href: "/about.html",         text: "소개" },
    { href: "/about.html#faq",     text: "자주 묻는 질문" },
    { href: "/about.html#contact", text: "문의" },
    { href: "/privacy.html",       text: "개인정보처리방침" },
    { href: "/terms.html",         text: "이용약관" }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // 저작권 연도는 자동(매년 갱신). 접근 실패 시 폴백.
  function year() {
    try { return new Date().getFullYear() || 2026; } catch (e) { return 2026; }
  }

  function footerHtml() {
    var links = "";
    for (var i = 0; i < LINKS.length; i++) {
      links += '<a href="' + LINKS[i].href + '">' + esc(LINKS[i].text) + "</a>";
    }
    return '<div><b style="color:var(--ink-2)">도구상자</b> — 무료 온라인 도구 모음</div>' +
           '<div class="spacer"></div>' +
           links +
           '<span style="font-family:var(--mono);font-size:11px">© ' + year() + "</span>";
  }

  function render() {
    // 컨테이너가 있는 페이지에서만 채운다 → 미배포 페이지엔 영향 없음.
    var host = document.getElementById("site-footer");
    if (!host) return;
    host.innerHTML = footerHtml();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
