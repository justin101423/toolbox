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
  gtag("config", GA_ID);
})();
