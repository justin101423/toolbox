/* ------------------------------------------------------------------
 * Google Analytics 4 — 측정 ID는 아래 GA_ID 한 곳에서만 관리한다.
 * 전 페이지가 이 파일 하나를 로드하므로, ID 교체·설정 변경은 여기서만.
 * GA_ID가 placeholder 상태면 아무것도 로드하지 않는다(요청 0).
 * ------------------------------------------------------------------ */
(function () {
  var GA_ID = "G-EQH5P4E001"; // GA4 측정 ID (2026-06-13 활성화)

  // placeholder이거나 형식이 아니면 무동작 — 외부 요청을 일절 보내지 않음
  if (GA_ID.indexOf("X") >= 0 || !/^G-[A-Z0-9]{6,}$/.test(GA_ID)) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());

  // 작업대(workbench) iframe 안에서 ?embed=1 로 열린 도구 페이지는, 실제 방문이
  // 아니므로 일반 페이지뷰(page_view)로 집계하지 않는다. 대신 별도 이벤트
  // "workbench_tool_open"(tool_slug 포함)으로 기록해, 방문 통계는 깨끗하게 두고
  // 작업대 사용량만 따로 볼 수 있게 한다.
  var isEmbed = false;
  try { isEmbed = new URLSearchParams(window.location.search).get("embed") === "1"; } catch (e) {}

  if (isEmbed) {
    gtag("config", GA_ID, { send_page_view: false });
    var slug = window.location.pathname.replace(/^\/+|\/+$/g, "").split("/")[0] || "(home)";
    gtag("event", "workbench_tool_open", { tool_slug: slug, page_path: window.location.pathname });
  } else {
    gtag("config", GA_ID);
  }
})();
