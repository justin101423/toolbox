/*
 * 공통 사이드바 생성 스크립트 (도구상자)
 * ------------------------------------------------------------------
 * 모든 도구 페이지/허브의 좌측 사이드바를 이 한 곳에서 생성합니다.
 * 새 도구를 추가할 때는 아래 CATEGORIES 의 해당 카테고리 tools 배열에
 * { slug, name, icon } 한 줄만 추가하면 전 페이지 사이드바에 자동 반영됩니다.
 *
 * 사용법: 각 페이지의 사이드바 자리에 빈 컨테이너를 두고
 *   <aside class="side" id="sidebar"></aside>
 * 본문 끝(또는 theme.js 근처)에서 이 파일을 불러옵니다.
 *   <script src="/sidebar.js"></script>
 *
 * 현재 페이지(슬러그)는 경로에서 자동 판별해 active 처리합니다.
 */
(function () {
  "use strict";

  var CATEGORIES = [
    { label: "이미지 · PDF", tools: [
      { slug: "image-converter",  name: "이미지 포맷 변환",     icon: "🖼" },
      { slug: "image-compressor", name: "이미지 압축·리사이즈", icon: "📉" },
      { slug: "image-resizer",    name: "이미지 크기 조절",     icon: "↔" },
      { slug: "id-photo",         name: "증명사진 규격 맞추기", icon: "🪪" },
      { slug: "remove-exif",      name: "EXIF·위치정보 제거",   icon: "🛡" },
      { slug: "pdf-compressor",   name: "PDF 용량 줄이기",      icon: "🗜" },
      { slug: "pdf-merge",        name: "PDF 합치기",           icon: "📄" },
      { slug: "image-to-pdf",     name: "이미지 → PDF",         icon: "🖼" },
      { slug: "pdf-to-image",     name: "PDF → 이미지",         icon: "▧" },
      { slug: "pdf-split",        name: "PDF 페이지 분할",      icon: "✂" }
    ]},
    { label: "텍스트 · 생성", tools: [
      { slug: "word-counter",       name: "글자수 세기",        icon: "🔤" },
      { slug: "clean-text",         name: "공백·줄바꿈 정리",   icon: "🧹" },
      { slug: "qr-code",            name: "QR코드 생성",        icon: "▦" },
      { slug: "password-generator", name: "비밀번호 생성",      icon: "🔑" },
      { slug: "json-formatter",     name: "JSON 포매터",        icon: "{ }" }
    ]},
    { label: "색상 · 디자인", tools: [
      { slug: "hex-rgb-converter", name: "HEX ↔ RGB 변환",   icon: "◑" },
      { slug: "color-palette",     name: "컬러 팔레트 생성", icon: "🎨" },
      { slug: "favicon-generator", name: "파비콘 생성",      icon: "★" }
    ]},
    { label: "생활 · 편의", tools: [
      { slug: "dday-calculator", name: "D-Day · 날짜 계산", icon: "📅" },
      { slug: "lotto-generator", name: "로또 번호 생성",    icon: "🎱" }
    ]},
    { label: "직장인 · 생산성", tools: [
      { slug: "notepad",     name: "임시 메모장", icon: "📝" },
      { slug: "utm-builder", name: "UTM 빌더",    icon: "🔗" }
    ]},
    { label: "개발자 도구", tools: [
      { slug: "encoder-decoder",  name: "인코더 · 디코더", icon: "⇄" },
      { slug: "jwt-decoder",      name: "JWT 디코더",      icon: "🔓" },
      { slug: "uuid-generator",   name: "UUID 생성",       icon: "#" },
      { slug: "hash-generator",   name: "Hash 생성",       icon: "🔒" },
      { slug: "json-to-java-dto", name: "JSON → Java DTO", icon: "☕" }
    ]}
  ];

  // 현재 경로에서 슬러그 추출: "/word-counter/" 또는 "/word-counter/index.html" → "word-counter"
  function currentSlug() {
    var path = location.pathname.replace(/index\.html$/, "").replace(/\/+$/, "");
    return path.substring(path.lastIndexOf("/") + 1);
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function render() {
    var host = document.getElementById("sidebar");
    if (!host) return;
    var active = currentSlug();
    var html = "";
    for (var i = 0; i < CATEGORIES.length; i++) {
      var cat = CATEGORIES[i];
      html += '<div class="grp"><div class="kick">' + esc(cat.label) + "</div>";
      for (var j = 0; j < cat.tools.length; j++) {
        var t = cat.tools[j];
        var cls = "navlink" + (t.slug === active ? " active" : "");
        html += '<a class="' + cls + '" href="/' + t.slug + '/">' +
                '<span class="ic">' + esc(t.icon) + "</span> " + esc(t.name) + "</a>";
      }
      html += "</div>";
    }
    host.innerHTML = html;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
