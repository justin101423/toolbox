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
      { slug: "image-converter",  name: "이미지 포맷 변환",     icon: "image" },
      { slug: "image-compressor", name: "이미지 압축·리사이즈", icon: "shrink" },
      { slug: "image-resizer",    name: "이미지 크기 조절",     icon: "scaling" },
      { slug: "image-crop",       name: "이미지 자르기",        icon: "crop" },
      { slug: "image-border",     name: "이미지 테두리·여백",   icon: "frame" },
      { slug: "image-rotate",     name: "이미지 회전·뒤집기",   icon: "rotate-cw" },
      { slug: "image-adjust",     name: "밝기·대비·채도 조절",  icon: "sliders-horizontal" },
      { slug: "image-filter",     name: "흑백·세피아 필터",     icon: "contrast" },
      { slug: "watermark",        name: "이미지 워터마크",      icon: "stamp" },
      { slug: "image-blur",       name: "이미지 모자이크·블러", icon: "eye-off" },
      { slug: "image-merge",      name: "이미지 합치기·콜라주", icon: "grid-2x2" },
      { slug: "meme-generator",   name: "밈·짤 생성기",         icon: "sticker" },
      { slug: "id-photo",         name: "증명사진 규격 맞추기", icon: "id-card" },
      { slug: "remove-exif",      name: "EXIF·위치정보 제거",   icon: "map-pin-off" },
      { slug: "heic-to-jpg",      name: "HEIC → JPG 변환",      icon: "image-down" },
      { slug: "image-base64",     name: "이미지 ↔ Base64",      icon: "image-up" },
      { slug: "image-ocr",        name: "이미지 OCR·글자 추출", icon: "scan-text" },
      { slug: "image-ascii",      name: "이미지 → ASCII 아트",  icon: "grid-3x3" },
      { slug: "gif-maker",        name: "이미지로 GIF 만들기",  icon: "film" },
      { slug: "pdf-merge",        name: "PDF 합치기",           icon: "files" },
      { slug: "pdf-split",        name: "PDF 페이지 분할",      icon: "scissors" },
      { slug: "pdf-organize",     name: "PDF 회전·페이지 정리", icon: "file-cog" },
      { slug: "pdf-compressor",   name: "PDF 용량 줄이기",      icon: "file-archive" },
      { slug: "pdf-watermark",    name: "PDF 워터마크",         icon: "copyright" },
      { slug: "image-to-pdf",     name: "이미지 → PDF",         icon: "file-image" },
      { slug: "pdf-to-image",     name: "PDF → 이미지",         icon: "images" },
      { slug: "pdf-to-text",      name: "PDF → 텍스트 추출",    icon: "file-search" }
    ]},
    { label: "텍스트 · 생성", tools: [
      { slug: "word-counter",       name: "글자수 세기",        icon: "type" },
      { slug: "clean-text",         name: "공백·줄바꿈 정리",   icon: "remove-formatting" },
      { slug: "text-replace",       name: "텍스트 찾기·바꾸기", icon: "replace" },
      { slug: "remove-duplicate-lines", name: "중복 줄 제거",   icon: "list-x" },
      { slug: "sort-lines",         name: "텍스트 줄 정렬",     icon: "arrow-down-up" },
      { slug: "line-numbers",       name: "줄 번호 매기기",     icon: "list-ordered" },
      { slug: "case-converter",     name: "대소문자 변환",      icon: "case-sensitive" },
      { slug: "text-reverser",      name: "글자 거꾸로·뒤집기", icon: "arrow-left-right" },
      { slug: "text-diff",          name: "텍스트 비교(diff)",  icon: "diff" },
      { slug: "reading-time",       name: "읽는 시간 계산",     icon: "book-open" },
      { slug: "fancy-text",         name: "꾸미기 글자 변환",   icon: "wand-sparkles" },
      { slug: "special-characters", name: "특수문자·이모지",    icon: "smile" },
      { slug: "romanizer",          name: "한글 → 로마자",      icon: "spell-check" },
      { slug: "keyboard-typo",      name: "한/영 오타 변환",    icon: "languages" },
      { slug: "number-to-korean",   name: "숫자 → 한글 금액",   icon: "banknote" },
      { slug: "tts",                name: "텍스트 → 음성(TTS)", icon: "volume-2" },
      { slug: "qr-code",            name: "QR코드 생성",        icon: "qr-code" },
      { slug: "qr-reader",          name: "QR코드 읽기",        icon: "scan-line" },
      { slug: "barcode-generator",  name: "바코드 생성기",      icon: "barcode" },
      { slug: "password-generator", name: "비밀번호 생성",      icon: "key-round" },
      { slug: "password-strength",  name: "비밀번호 강도 검사", icon: "shield-check" },
      { slug: "lorem-ipsum",        name: "로렘 입숨 생성",     icon: "pilcrow" },
      { slug: "json-formatter",     name: "JSON 포매터",        icon: "braces" }
    ]},
    { label: "생활 · 편의", tools: [
      { slug: "calculator",      name: "계산기(공학용)",    icon: "calculator" },
      { slug: "percentage-calculator", name: "퍼센트 계산기", icon: "percent" },
      { slug: "unit-converter",  name: "단위 변환",         icon: "ruler" },
      { slug: "pyeong-converter", name: "평 ↔ ㎡ 변환",     icon: "house" },
      { slug: "size-converter",  name: "옷·신발 사이즈 변환", icon: "shirt" },
      { slug: "age-calculator",  name: "만 나이 계산기",    icon: "cake" },
      { slug: "dday-calculator", name: "D-Day · 날짜 계산", icon: "calendar-days" },
      { slug: "business-days",   name: "근무일수·영업일 계산기", icon: "calendar-check" },
      { slug: "lunar-solar-converter", name: "음력 ↔ 양력", icon: "moon" },
      { slug: "timezone-converter", name: "세계 시간 변환", icon: "globe" },
      { slug: "stopwatch-timer", name: "스톱워치·타이머",   icon: "timer" },
      { slug: "bmi-calculator",  name: "BMI 계산기",        icon: "scale" },
      { slug: "calorie-calculator", name: "기초대사량·칼로리 계산기", icon: "flame" },
      { slug: "gpa-calculator",  name: "학점·GPA 계산기",   icon: "graduation-cap" },
      { slug: "typing-speed",    name: "타자 속도 측정",    icon: "keyboard" },
      { slug: "zodiac-finder",   name: "띠·별자리 찾기",    icon: "sparkles" },
      { slug: "random-picker",   name: "랜덤 추첨기",       icon: "dices" },
      { slug: "spinner-wheel",   name: "돌림판 추첨",       icon: "pie-chart" },
      { slug: "ladder-game",     name: "사다리타기",        icon: "ladder" },
      { slug: "lotto-generator", name: "로또 번호 생성",    icon: "ticket" }
    ]},
    { label: "금융", tools: [
      { slug: "salary-calculator", name: "연봉 실수령액 계산기", icon: "wallet" },
      { slug: "severance-pay",   name: "퇴직금 계산기",      icon: "briefcase" },
      { slug: "loan-calculator", name: "대출 이자 계산기",   icon: "landmark" },
      { slug: "savings-calculator", name: "적금·예금 이자 계산기", icon: "piggy-bank" },
      { slug: "compound-interest", name: "복리 계산기",      icon: "trending-up" },
      { slug: "vat-calculator",  name: "부가가치세 계산기",  icon: "receipt" },
      { slug: "discount-calculator", name: "할인가 계산기",  icon: "tag" }
    ]},
    { label: "직장인 · 생산성", tools: [
      { slug: "notepad",     name: "임시 메모장", icon: "sticky-note" },
      { slug: "pomodoro",    name: "포모도로 타이머", icon: "alarm-clock" },
      { slug: "signature-maker", name: "서명 만들기", icon: "pen-tool" },
      { slug: "utm-builder", name: "UTM 빌더",    icon: "link" },
      { slug: "device-test", name: "마이크·웹캠 테스트", icon: "video" }
    ]},
    { label: "색상 · 디자인", tools: [
      { slug: "color-picker",      name: "컬러 피커·변환",   icon: "pipette" },
      { slug: "hex-rgb-converter", name: "HEX ↔ RGB 변환",   icon: "arrow-right-left" },
      { slug: "color-palette",     name: "컬러 팔레트 생성", icon: "palette" },
      { slug: "color-extractor",   name: "이미지 색 추출",   icon: "swatch-book" },
      { slug: "gradient-generator", name: "그라데이션 생성기", icon: "blend" },
      { slug: "glassmorphism",    name: "글래스모피즘 생성기", icon: "layers" },
      { slug: "box-shadow-generator", name: "box-shadow 생성기", icon: "box" },
      { slug: "text-shadow-generator", name: "text-shadow 생성기", icon: "baseline" },
      { slug: "border-radius-generator", name: "border-radius 생성기", icon: "squircle" },
      { slug: "cubic-bezier",    name: "cubic-bezier 생성기", icon: "spline" },
      { slug: "css-unit-converter", name: "CSS 단위 변환", icon: "ruler-dimension-line" },
      { slug: "contrast-checker",  name: "색상 대비 검사",   icon: "eye" },
      { slug: "color-blindness", name: "색맹 시뮬레이터", icon: "glasses" },
      { slug: "favicon-generator", name: "파비콘 생성",      icon: "app-window" }
    ]},
    { label: "개발자 도구", tools: [
      { slug: "encoder-decoder",  name: "인코더 · 디코더", icon: "file-code" },
      { slug: "url-parser",       name: "URL 쿼리스트링 파서", icon: "link" },
      { slug: "slug-generator",   name: "슬러그(URL) 생성기",  icon: "link-2" },
      { slug: "html-entities",    name: "HTML 엔티티 변환기",  icon: "code-xml" },
      { slug: "hash-generator",   name: "Hash 생성",       icon: "hash" },
      { slug: "jwt-decoder",      name: "JWT 디코더",      icon: "key-square" },
      { slug: "uuid-generator",   name: "UUID 생성",       icon: "fingerprint" },
      { slug: "base-converter",   name: "진법 변환",       icon: "binary" },
      { slug: "timestamp",        name: "타임스탬프 변환", icon: "clock" },
      { slug: "cron-parser",      name: "cron 표현식 변환", icon: "calendar-clock" },
      { slug: "regex-tester",     name: "정규식 테스터",   icon: "regex" },
      { slug: "json-yaml",        name: "JSON ↔ YAML",     icon: "arrow-left-right" },
      { slug: "json-xml",         name: "JSON ↔ XML 변환", icon: "code-xml" },
      { slug: "csv-json",         name: "CSV ↔ JSON 변환", icon: "table" },
      { slug: "json-to-types",    name: "JSON → 타입 변환", icon: "file-json" },
      { slug: "json-to-java-dto", name: "JSON → Java DTO", icon: "coffee" },
      { slug: "table-converter",  name: "표 변환기",        icon: "table-2" },
      { slug: "sql-formatter",    name: "SQL 포매터",      icon: "database" },
      { slug: "markdown-preview", name: "마크다운 변환",   icon: "file-text" },
      { slug: "http-status-codes", name: "HTTP 상태 코드",  icon: "server" }
    ]},
    { label: "악기", tools: [
      { slug: "piano",    name: "피아노",    icon: "piano" },
      { slug: "synth",     name: "신디사이저", icon: "sliders" },
      { slug: "xylophone", name: "실로폰",   icon: "xylophone" },
      { slug: "kalimba",   name: "칼림바",   icon: "kalimba" },
      { slug: "handpan",   name: "핸드팬",   icon: "handpan" },
      { slug: "harp",      name: "하프",      icon: "harp" },
      { slug: "guitar",   name: "기타",      icon: "guitar" },
      { slug: "gayageum",  name: "가야금",    icon: "gayageum" },
      { slug: "drum-pad", name: "드럼 패드", icon: "drum" },
      { slug: "launchpad", name: "런치패드", icon: "grid-3x3" },
      { slug: "sequencer", name: "스텝 시퀀서", icon: "sequencer" },
      { slug: "theremin",  name: "테레민",    icon: "theremin" },
      { slug: "metronome", name: "메트로놈", icon: "metronome" },
      { slug: "tuner",     name: "튜너(조율기)", icon: "tuner" },
      { slug: "recorder",  name: "녹음기",    icon: "mic" }
    ]}
  ];

  // ------------------------------------------------------------------
  // SVG 아이콘 세트 (Lucide v1.17.0, ISC License — https://lucide.dev)
  // 외부 의존성 없이 path 데이터를 인라인으로 보관한다. stroke="currentColor"
  // 라서 라이트/다크 테마 글자색을 자동으로 따른다. CDN/SRI 불필요(1차 코드).
  // 사이드바(sidebar.js 데이터의 icon 이름)와 허브 카드([data-icon])가
  // 이 한 곳의 매핑을 공유한다. icon 이름이 여기 없으면 기존 이모지/문자로 폴백.
  // ------------------------------------------------------------------
  var ICONS = {
    "image": '<rect width="18" height="18" x="3" y="3" rx="2" ry="2" /> <circle cx="9" cy="9" r="2" /> <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />',
    "shrink": '<path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8" /> <path d="M9 19.8V15m0 0H4.2M9 15l-6 6" /> <path d="M15 4.2V9m0 0h4.8M15 9l6-6" /> <path d="M9 4.2V9m0 0H4.2M9 9 3 3" />',
    "scaling": '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /> <path d="M14 15H9v-5" /> <path d="M16 3h5v5" /> <path d="M21 3 9 15" />',
    "crop": '<path d="M6 2v14a2 2 0 0 0 2 2h14" /> <path d="M18 22V8a2 2 0 0 0-2-2H2" />',
    "rotate-cw": '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /> <path d="M21 3v5h-5" />',
    "stamp": '<path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13" /> <path d="M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z" /> <path d="M5 22h14" />',
    "contrast": '<circle cx="12" cy="12" r="10" /> <path d="M12 18a6 6 0 0 0 0-12v12z" />',
    "grid-2x2": '<path d="M12 3v18" /> <path d="M3 12h18" /> <rect x="3" y="3" width="18" height="18" rx="2" />',
    "id-card": '<path d="M16 10h2" /> <path d="M16 14h2" /> <path d="M6.17 15a3 3 0 0 1 5.66 0" /> <circle cx="9" cy="11" r="2" /> <rect x="2" y="5" width="20" height="14" rx="2" />',
    "map-pin-off": '<path d="M12.75 7.09a3 3 0 0 1 2.16 2.16" /> <path d="M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568" /> <path d="m2 2 20 20" /> <path d="M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533" /> <path d="M9.13 9.13a3 3 0 0 0 3.74 3.74" />',
    "file-archive": '<path d="M13.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v11.5" /> <path d="M14 2v5a1 1 0 0 0 1 1h5" /> <path d="M8 12v-1" /> <path d="M8 18v-2" /> <path d="M8 7V6" /> <circle cx="8" cy="20" r="2" />',
    "files": '<path d="M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" /> <path d="M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z" /> <path d="M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1" />',
    "file-image": '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /> <path d="M14 2v5a1 1 0 0 0 1 1h5" /> <circle cx="10" cy="12" r="2" /> <path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" />',
    "images": '<path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16" /> <path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" /> <circle cx="13" cy="7" r="1" fill="currentColor" /> <rect x="8" y="2" width="14" height="14" rx="2" />',
    "scissors": '<circle cx="6" cy="6" r="3" /> <path d="M8.12 8.12 12 12" /> <path d="M20 4 8.12 15.88" /> <circle cx="6" cy="18" r="3" /> <path d="M14.8 14.8 20 20" />',
    "type": '<path d="M12 4v16" /> <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" /> <path d="M9 20h6" />',
    "remove-formatting": '<path d="M4 7V4h16v3" /> <path d="M5 20h6" /> <path d="M13 4 8 20" /> <path d="m15 15 5 5" /> <path d="m20 15-5 5" />',
    "list-x": '<path d="M16 5H3" /> <path d="M11 12H3" /> <path d="M16 19H3" /> <path d="m15.5 9.5 5 5" /> <path d="m20.5 9.5-5 5" />',
    "case-sensitive": '<path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" /> <path d="M22 9v7" /> <path d="M3.304 13h6.392" /> <circle cx="18.5" cy="12.5" r="3.5" />',
    "arrow-down-up": '<path d="m3 16 4 4 4-4" /> <path d="M7 20V4" /> <path d="m21 8-4-4-4 4" /> <path d="M17 4v16" />',
    "list-ordered": '<path d="M11 5h10" /> <path d="M11 12h10" /> <path d="M11 19h10" /> <path d="M4 4h1v5" /> <path d="M4 9h2" /> <path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" />',
    "qr-code": '<rect width="5" height="5" x="3" y="3" rx="1" /> <rect width="5" height="5" x="16" y="3" rx="1" /> <rect width="5" height="5" x="3" y="16" rx="1" /> <path d="M21 16h-3a2 2 0 0 0-2 2v3" /> <path d="M21 21v.01" /> <path d="M12 7v3a2 2 0 0 1-2 2H7" /> <path d="M3 12h.01" /> <path d="M12 3h.01" /> <path d="M12 16v.01" /> <path d="M16 12h1" /> <path d="M21 12v.01" /> <path d="M12 21v-1" />',
    "key-round": '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /> <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />',
    "braces": '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" /> <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />',
    "arrow-right-left": '<path d="m16 3 4 4-4 4" /> <path d="M20 7H4" /> <path d="m8 21-4-4 4-4" /> <path d="M4 17h16" />',
    "palette": '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /> <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /> <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /> <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /> <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />',
    "app-window": '<rect x="2" y="4" width="20" height="16" rx="2" /> <path d="M10 4v4" /> <path d="M2 8h20" /> <path d="M6 4v4" />',
    "blend": '<circle cx="9" cy="9" r="7" /> <circle cx="15" cy="15" r="7" />',
    "swatch-book": '<path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z" /> <path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7" /> <path d="M 7 17h.01" /> <path d="m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8" />',
    "eye": '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /> <circle cx="12" cy="12" r="3" />',
    "pipette": '<path d="m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12" /> <path d="m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z" /> <path d="m2 22 .414-.414" />',
    "box": '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /> <path d="m3.3 7 8.7 5 8.7-5" /> <path d="M12 22V12" />',
    "squircle": '<path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9" />',
    "calendar-days": '<path d="M8 2v4" /> <path d="M16 2v4" /> <rect width="18" height="18" x="3" y="4" rx="2" /> <path d="M3 10h18" /> <path d="M8 14h.01" /> <path d="M12 14h.01" /> <path d="M16 14h.01" /> <path d="M8 18h.01" /> <path d="M12 18h.01" /> <path d="M16 18h.01" />',
    "ticket": '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /> <path d="M13 5v2" /> <path d="M13 17v2" /> <path d="M13 11v2" />',
    "cake": '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /> <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" /> <path d="M2 21h20" /> <path d="M7 8v3" /> <path d="M12 8v3" /> <path d="M17 8v3" /> <path d="M7 4h.01" /> <path d="M12 4h.01" /> <path d="M17 4h.01" />',
    "percent": '<line x1="19" x2="5" y1="5" y2="19" /> <circle cx="6.5" cy="6.5" r="2.5" /> <circle cx="17.5" cy="17.5" r="2.5" />',
    "ruler": '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /> <path d="m14.5 12.5 2-2" /> <path d="m11.5 9.5 2-2" /> <path d="m8.5 6.5 2-2" /> <path d="m17.5 15.5 2-2" />',
    "globe": '<circle cx="12" cy="12" r="10" /> <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /> <path d="M2 12h20" />',
    "tag": '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /> <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />',
    "dices": '<rect width="12" height="12" x="2" y="10" rx="2" ry="2" /> <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" /> <path d="M6 18h.01" /> <path d="M10 14h.01" /> <path d="M15 6h.01" /> <path d="M18 9h.01" />',
    "sticky-note": '<path d="M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" /> <path d="M15 3v5a1 1 0 0 0 1 1h5" />',
    "link": '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /> <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />',
    "file-code": '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /> <path d="M14 2v5a1 1 0 0 0 1 1h5" /> <path d="M10 12.5 8 15l2 2.5" /> <path d="m14 12.5 2 2.5-2 2.5" />',
    "key-square": '<path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z" /> <path d="m14 7 3 3" /> <path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814" />',
    "fingerprint": '<path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /> <path d="M14 13.12c0 2.38 0 6.38-1 8.88" /> <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /> <path d="M2 12a10 10 0 0 1 18-6" /> <path d="M2 16h.01" /> <path d="M21.8 16c.2-2 .131-5.354 0-6" /> <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" /> <path d="M8.65 22c.21-.66.45-1.32.57-2" /> <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />',
    "hash": '<line x1="4" x2="20" y1="9" y2="9" /> <line x1="4" x2="20" y1="15" y2="15" /> <line x1="10" x2="8" y1="3" y2="21" /> <line x1="16" x2="14" y1="3" y2="21" />',
    "coffee": '<path d="M10 2v2" /> <path d="M14 2v2" /> <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" /> <path d="M6 2v2" />',
    "table": '<path d="M12 3v18" /> <rect width="18" height="18" x="3" y="3" rx="2" /> <path d="M3 9h18" /> <path d="M3 15h18" />',
    "clock": '<circle cx="12" cy="12" r="10" /> <path d="M12 6v6l4 2" />',
    "binary": '<rect x="14" y="14" width="4" height="6" rx="2" /> <rect x="6" y="4" width="4" height="6" rx="2" /> <path d="M6 20h4" /> <path d="M14 10h4" /> <path d="M6 14h2v6" /> <path d="M14 4h2v6" />',
    "regex": '<path d="M17 3v10" /> <path d="m12.67 5.5 8.66 5" /> <path d="m12.67 10.5 8.66-5" /> <path d="M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z" />',
    "scan-line": '<path d="M3 7V5a2 2 0 0 1 2-2h2" /> <path d="M17 3h2a2 2 0 0 1 2 2v2" /> <path d="M21 17v2a2 2 0 0 1-2 2h-2" /> <path d="M7 21H5a2 2 0 0 1-2-2v-2" /> <path d="M7 12h10" />',
    "barcode": '<path d="M3 5v14" /> <path d="M8 5v14" /> <path d="M12 5v14" /> <path d="M17 5v14" /> <path d="M21 5v14" />',
    "film": '<rect width="18" height="18" x="3" y="3" rx="2" /> <path d="M7 3v18" /> <path d="M3 7.5h4" /> <path d="M3 12h18" /> <path d="M3 16.5h4" /> <path d="M17 3v18" /> <path d="M17 7.5h4" /> <path d="M17 16.5h4" />',
    "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /> <path d="M14 2v4a2 2 0 0 0 2 2h4" /> <path d="M16 13H8" /> <path d="M16 17H8" /> <path d="M10 9H8" />',
    "arrow-left-right": '<path d="M8 3 4 7l4 4" /> <path d="M4 7h16" /> <path d="m16 21 4-4-4-4" /> <path d="M20 17H4" />',
    "pie-chart": '<path d="M21.21 15.89A10 10 0 1 1 8 2.83" /> <path d="M22 12A10 10 0 0 0 12 2v10z" />',
    "pilcrow": '<path d="M13 4v16" /> <path d="M17 4v16" /> <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" />',
    "table-2": '<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />',
    "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /> <path d="m9 12 2 2 4-4" />',
    "sparkles": '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" /> <path d="M20 3v4" /> <path d="M22 5h-4" /> <path d="M4 17v2" /> <path d="M5 18H3" />',
    "wand-sparkles": '<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" /> <path d="m14 7 3 3" /> <path d="M5 6v4" /> <path d="M19 14v4" /> <path d="M10 2v2" /> <path d="M7 8H3" /> <path d="M21 16h-4" /> <path d="M11 3H9" />',
    "book-open": '<path d="M12 7v14" /> <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />',
    "house": '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /> <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />',
    "scale": '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /> <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /> <path d="M7 21h10" /> <path d="M12 3v18" /> <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />',
    "ladder": '<path d="M8 3v18" /> <path d="M16 3v18" /> <path d="M8 7h8" /> <path d="M8 12h8" /> <path d="M8 17h8" />',
    "image-down": '<path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" /> <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /> <circle cx="9" cy="9" r="2" /> <path d="M19 16v6" /> <path d="m22 19-3 3-3-3" />',
    "moon": '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />',
    "keyboard": '<path d="M10 8h.01" /> <path d="M12 12h.01" /> <path d="M14 8h.01" /> <path d="M16 12h.01" /> <path d="M18 8h.01" /> <path d="M6 8h.01" /> <path d="M7 16h10" /> <path d="M8 12h.01" /> <rect width="20" height="16" x="2" y="4" rx="2" />',
    "pen-tool": '<path d="m12 19 7-7 3 3-7 7-3-3z" /> <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /> <path d="m2 2 7.586 7.586" /> <circle cx="11" cy="11" r="2" />',
    "diff": '<path d="M12 3v14" /> <path d="M5 10h14" /> <path d="M5 21h14" />',
    "scan-text": '<path d="M3 7V5a2 2 0 0 1 2-2h2" /> <path d="M17 3h2a2 2 0 0 1 2 2v2" /> <path d="M21 17v2a2 2 0 0 1-2 2h-2" /> <path d="M7 21H5a2 2 0 0 1-2-2v-2" /> <path d="M7 8h8" /> <path d="M7 12h10" /> <path d="M7 16h6" />',
    "smile": '<circle cx="12" cy="12" r="10" /> <path d="M8 14s1.5 2 4 2 4-2 4-2" /> <line x1="9" x2="9.01" y1="9" y2="9" /> <line x1="15" x2="15.01" y1="9" y2="9" />',
    "video": '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" /> <rect x="2" y="6" width="14" height="12" rx="2" />',
    "file-cog": '<path d="M14 2v4a2 2 0 0 0 2 2h4" /> <path d="m3.2 12.9-.9-.4" /> <path d="m3.2 15.1-.9.4" /> <path d="M4.677 21.5a2 2 0 0 0 1.313.5H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2.5" /> <path d="m4.9 11.2-.4-.9" /> <path d="m4.9 16.8-.4.9" /> <path d="m7.5 10.3-.4.9" /> <path d="m7.5 17.7-.4-.9" /> <path d="m9.7 12.5-.9.4" /> <path d="m9.7 15.5-.9-.4" /> <circle cx="6" cy="14" r="3" />',
    "eye-off": '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /> <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /> <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /> <path d="m2 2 20 20" />',
    "sticker": '<path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" /> <path d="M14 3v4a2 2 0 0 0 2 2h4" /> <path d="M8 13h.01" /> <path d="M16 13h.01" /> <path d="M10 16s.8 1 2 1c1.3 0 2-1 2-1" />',
    "languages": '<path d="m5 8 6 6" /> <path d="m4 14 6-6 2-3" /> <path d="M2 5h12" /> <path d="M7 2h1" /> <path d="m22 22-5-10-5 10" /> <path d="M14 18h6" />',
    "calendar-clock": '<path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /> <path d="M16 2v4" /> <path d="M8 2v4" /> <path d="M3 10h5" /> <path d="M17.5 17.5 16 16.3V14" /> <circle cx="16" cy="16" r="6" />',
    "file-json": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /> <path d="M14 2v4a2 2 0 0 0 2 2h4" /> <path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" /> <path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" />',
    "ruler-dimension-line": '<path d="M10 15v-3" /> <path d="M14 15v-3" /> <path d="M18 15v-3" /> <path d="M2 8V4" /> <path d="M22 6H2" /> <path d="M22 8V4" /> <path d="M6 15v-3" /> <rect x="2" y="12" width="20" height="8" rx="2" />',
    "server": '<rect width="20" height="8" x="2" y="2" rx="2" ry="2" /> <rect width="20" height="8" x="2" y="14" rx="2" ry="2" /> <line x1="6" x2="6.01" y1="6" y2="6" /> <line x1="6" x2="6.01" y1="18" y2="18" />',
    "file-search": '<path d="M14 2v4a2 2 0 0 0 2 2h4" /> <path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" /> <path d="m9 18-1.5-1.5" /> <circle cx="5" cy="14" r="3" />',
    "replace": '<path d="M14 4a2 2 0 0 1 2-2" /> <path d="M16 10a2 2 0 0 1-2-2" /> <path d="M20 2a2 2 0 0 1 2 2" /> <path d="M22 8a2 2 0 0 1-2 2" /> <path d="m3 7 3 3 3-3" /> <path d="M6 10V5a3 3 0 0 1 3-3h1" /> <rect x="2" y="14" width="8" height="8" rx="2" />',
    "volume-2": '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /> <path d="M16 9a5 5 0 0 1 0 6" /> <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />',
    "spell-check": '<path d="m6 16 6-12 6 12" /> <path d="M8 12h8" /> <path d="m16 20 2 2 4-4" />',
    "code-xml": '<path d="m18 16 4-4-4-4" /> <path d="m6 8-4 4 4 4" /> <path d="m14.5 4-5 16" />',
    "database": '<ellipse cx="12" cy="5" rx="9" ry="3" /> <path d="M3 5V19A9 3 0 0 0 21 19V5" /> <path d="M3 12A9 3 0 0 0 21 12" />',
    "sliders-horizontal": '<line x1="21" x2="14" y1="4" y2="4" /> <line x1="10" x2="3" y1="4" y2="4" /> <line x1="21" x2="12" y1="12" y2="12" /> <line x1="8" x2="3" y1="12" y2="12" /> <line x1="21" x2="16" y1="20" y2="20" /> <line x1="12" x2="3" y1="20" y2="20" /> <line x1="14" x2="14" y1="2" y2="6" /> <line x1="8" x2="8" y1="10" y2="14" /> <line x1="16" x2="16" y1="18" y2="22" />',
    "image-up": '<path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" /> <path d="m14 19.5 3-3 3 3" /> <path d="M17 22v-5.5" /> <circle cx="9" cy="9" r="2" />',
    "copyright": '<circle cx="12" cy="12" r="10" /> <path d="M14.83 14.83a4 4 0 1 1 0-5.66" />',
    "glasses": '<circle cx="6" cy="15" r="4" /> <circle cx="18" cy="15" r="4" /> <path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2" /> <path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2" /> <path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2" />',
    "spline": '<circle cx="19" cy="5" r="2" /> <circle cx="5" cy="19" r="2" /> <path d="M5 17A12 12 0 0 1 17 5" />',
    "calculator": '<rect width="16" height="20" x="4" y="2" rx="2" /> <line x1="8" x2="16" y1="6" y2="6" /> <line x1="16" x2="16" y1="14" y2="18" /> <path d="M16 10h.01" /> <path d="M12 10h.01" /> <path d="M8 10h.01" /> <path d="M12 14h.01" /> <path d="M8 14h.01" /> <path d="M12 18h.01" /> <path d="M8 18h.01" />',
    "timer": '<line x1="10" x2="14" y1="2" y2="2" /> <line x1="12" x2="15" y1="14" y2="11" /> <circle cx="12" cy="14" r="8" />',
    "alarm-clock": '<circle cx="12" cy="13" r="8" /> <path d="M12 9v4l2 2" /> <path d="M5 3 2 6" /> <path d="m22 6-3-3" /> <path d="M6.38 18.7 4 21" /> <path d="M17.64 18.67 20 21" />',
    "graduation-cap": '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /> <path d="M22 10v6" /> <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />',
    "shirt": '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />',
    "banknote": '<rect width="20" height="12" x="2" y="6" rx="2" /> <circle cx="12" cy="12" r="2" /> <path d="M6 12h.01M18 12h.01" />',
    "wallet": '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /> <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />',
    "landmark": '<line x1="3" x2="21" y1="22" y2="22" /> <line x1="6" x2="6" y1="18" y2="11" /> <line x1="10" x2="10" y1="18" y2="11" /> <line x1="14" x2="14" y1="18" y2="11" /> <line x1="18" x2="18" y1="18" y2="11" /> <polygon points="12 2 20 7 4 7" />',
    "piggy-bank": '<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" /> <path d="M2 9v1c0 1.1.9 2 2 2h1" /> <path d="M16 11h.01" />',
    "receipt": '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /> <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /> <path d="M12 17.5v-11" />',
    "trending-up": '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /> <polyline points="16 7 22 7 22 13" />',
    "briefcase": '<rect width="20" height="14" x="2" y="7" rx="2" ry="2" /> <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />',
    "flame": '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />',
    "layers": '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /> <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /> <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />',
    "link-2": '<path d="M9 17H7A5 5 0 0 1 7 7h2" /> <path d="M15 7h2a5 5 0 1 1 0 10h-2" /> <line x1="8" x2="16" y1="12" y2="12" />',
    "frame": '<line x1="22" x2="2" y1="6" y2="6" /> <line x1="22" x2="2" y1="18" y2="18" /> <line x1="6" x2="6" y1="2" y2="22" /> <line x1="18" x2="18" y1="2" y2="22" />',
    "calendar-check": '<path d="M8 2v4" /> <path d="M16 2v4" /> <rect width="18" height="18" x="3" y="4" rx="2" /> <path d="M3 10h18" /> <path d="m9 16 2 2 4-4" />',
    "baseline": '<path d="M4 20h16" /> <path d="m6 16 6-12 6 12" /> <path d="M8 12h8" />',
    "star": '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />',
    "drum": '<path d="m2 2 8 8" /> <path d="m22 2-8 8" /> <ellipse cx="12" cy="9" rx="10" ry="5" /> <path d="M7 13.4v7.9" /> <path d="M12 14v8" /> <path d="M17 13.4v7.9" /> <path d="M2 9v8a10 5 0 0 0 20 0V9" />',
    "piano": '<path d="M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8" /> <path d="M2 14h20" /> <path d="M6 14v4" /> <path d="M10 14v4" /> <path d="M14 14v4" /> <path d="M18 14v4" />',
    "guitar": '<path d="m11.9 12.1 4.514-4.514" /> <path d="M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z" /> <path d="m6 16 2 2" /> <path d="M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z" />',
    "grid-3x3": '<rect width="18" height="18" x="3" y="3" rx="2" /> <path d="M3 9h18" /> <path d="M3 15h18" /> <path d="M9 3v18" /> <path d="M15 3v18" />',
    "xylophone": '<rect x="3" y="10" width="3" height="10" rx="1" /> <rect x="8" y="7" width="3" height="13" rx="1" /> <rect x="13" y="5" width="3" height="15" rx="1" /> <rect x="18" y="3" width="3" height="17" rx="1" />',
    "kalimba": '<rect x="4" y="3" width="16" height="18" rx="3" /> <path d="M8 9v8" /> <path d="M12 7v10" /> <path d="M16 9v8" /> <circle cx="12" cy="13" r="1.6" />',
    "handpan": '<circle cx="12" cy="12" r="9" /> <circle cx="12" cy="12" r="1.6" /> <circle cx="12" cy="6.6" r="1" /> <circle cx="16.4" cy="9.8" r="1" /> <circle cx="15" cy="15.4" r="1" /> <circle cx="9" cy="15.4" r="1" /> <circle cx="7.6" cy="9.8" r="1" />',
    "metronome": '<path d="M9 3h6l4 18H5z" /> <path d="M12 19V7" /> <rect x="10.4" y="8.6" width="3.2" height="2.6" rx=".6" /> <path d="M7 16h10" />',
    "tuner": '<path d="M4 17a8 8 0 0 1 16 0" /> <path d="M12 17l3.4-5.2" /> <circle cx="12" cy="17" r="1.4" /> <path d="M3 20.5h18" />',
    "harp": '<path d="M6 3v18" /> <path d="M6 3c7 1 11 7 12 16" /> <path d="M5 21h14" /> <path d="M9 7v13" /> <path d="M12 10v10" /> <path d="M15 14v6" />',
    "gayageum": '<rect x="2" y="7" width="20" height="10" rx="2" /> <path d="M2 10h20" /> <path d="M2 12h20" /> <path d="M2 14h20" /> <path d="M8 7v10" /> <path d="M14 7v10" />',
    "theremin": '<rect x="5" y="13" width="11" height="6" rx="1.5" /> <path d="M13 13V4" /> <circle cx="13" cy="3.4" r="1" /> <path d="M18 7c1.5 1.5 1.5 8 0 9.5" /> <path d="M20.5 5c2.5 2.5 2.5 11 0 13.5" />',
    "mic": '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /> <path d="M19 10v2a7 7 0 0 1-14 0v-2" /> <line x1="12" x2="12" y1="19" y2="22" />',
    "sliders": '<line x1="4" x2="4" y1="21" y2="14" /> <line x1="4" x2="4" y1="10" y2="3" /> <line x1="12" x2="12" y1="21" y2="12" /> <line x1="12" x2="12" y1="8" y2="3" /> <line x1="20" x2="20" y1="21" y2="16" /> <line x1="20" x2="20" y1="12" y2="3" /> <line x1="2" x2="6" y1="14" y2="14" /> <line x1="10" x2="14" y1="8" y2="8" /> <line x1="18" x2="22" y1="16" y2="16" />',
    "sequencer": '<rect x="3" y="5" width="3.5" height="5" rx="1" /> <rect x="8" y="5" width="3.5" height="5" rx="1" /> <rect x="13" y="5" width="3.5" height="5" rx="1" /> <rect x="18" y="5" width="3.5" height="5" rx="1" /> <rect x="3" y="14" width="3.5" height="5" rx="1" /> <rect x="8" y="14" width="3.5" height="5" rx="1" /> <rect x="13" y="14" width="3.5" height="5" rx="1" /> <rect x="18" y="14" width="3.5" height="5" rx="1" />'
  };
  var SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';

  // 아이콘 이름이면 인라인 SVG를, 아니면 기존 이모지/문자(이스케이프)를 반환
  function iconHtml(name) {
    return ICONS[name] ? SVG_OPEN + ICONS[name] + "</svg>" : esc(name);
  }

  // 아이콘 크기 스타일 1회 주입 + 허브 카드 등 [data-icon] 자리 채우기
  function applyIcons() {
    if (!document.getElementById("dgb-icon-style")) {
      var st = document.createElement("style");
      st.id = "dgb-icon-style";
      st.textContent = ".navlink .ic svg{width:18px;height:18px;display:block}.card .ic svg{width:22px;height:22px;display:block}" +
        ".dgb-fav-btn{display:inline-flex;align-items:center;justify-content:center;background:transparent;border:0;cursor:pointer;padding:6px;margin-right:2px;border-radius:8px;color:inherit;-webkit-tap-highlight-color:transparent}" +
        ".dgb-fav-btn svg{width:22px;height:22px;display:block}" +
        ".dgb-fav-btn:hover{background:rgba(127,127,127,.14)}" +
        ".quick-links .ql-hint{font-size:12px;color:var(--ink-3);width:100%;margin-top:2px}";
      (document.head || document.documentElement).appendChild(st);
    }
    var els = document.querySelectorAll("[data-icon]");
    for (var i = 0; i < els.length; i++) {
      var n = els[i].getAttribute("data-icon");
      if (ICONS[n]) els[i].innerHTML = iconHtml(n);
    }
  }

  // 현재 경로에서 슬러그 추출: "/word-counter/" 또는 "/word-counter/index.html" → "word-counter"
  function currentSlug() {
    var path = location.pathname.replace(/index\.html$/, "").replace(/\/+$/, "");
    return path.substring(path.lastIndexOf("/") + 1);
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ------------------------------------------------------------------
  // 즐겨찾기(★) — localStorage("dgb-favorites")에 슬러그 배열만 저장한다.
  // 이름·아이콘은 CATEGORIES에서 조회하므로 데이터 중복이 없다.
  // 관련 코드는 모두 try/catch로 감싸 실패해도 기본 사이드바 렌더가
  // 깨지지 않게 한다(우아한 폴백).
  // ------------------------------------------------------------------
  var FAV_KEY = "dgb-favorites";

  function getFavs() {
    try {
      var v = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      return Array.isArray(v) ? v.filter(function (s) { return typeof s === "string"; }) : [];
    } catch (e) { return []; }
  }
  function setFavs(arr) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); } catch (e) {}
  }
  function isFav(slug) { return getFavs().indexOf(slug) >= 0; }
  function toggleFav(slug) {
    var favs = getFavs(), i = favs.indexOf(slug);
    if (i >= 0) favs.splice(i, 1); else favs.push(slug);
    setFavs(favs);
    return i < 0; // 새로 추가됐으면 true
  }
  // 슬러그로 CATEGORIES에서 도구 {slug,name,icon} 조회 (단일 출처)
  function findTool(slug) {
    if (!slug) return null;
    for (var i = 0; i < CATEGORIES.length; i++) {
      var tools = CATEGORIES[i].tools;
      for (var j = 0; j < tools.length; j++) if (tools[j].slug === slug) return tools[j];
    }
    return null;
  }

  // 즐겨찾기 별 SVG (채움=골드, 비움=현재 글자색). 라이트/다크 모두 잘 보임.
  function starSvg(fav) {
    var f = fav ? "#f5b301" : "none", s = fav ? "#f5b301" : "currentColor";
    return '<svg viewBox="0 0 24 24" fill="' + f + '" stroke="' + s + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICONS.star + "</svg>";
  }
  function updateStarBtn(btn, fav) {
    btn.innerHTML = starSvg(fav);
    btn.setAttribute("aria-pressed", fav ? "true" : "false");
    btn.setAttribute("aria-label", fav ? "즐겨찾기 해제" : "즐겨찾기 추가");
    btn.setAttribute("title", fav ? "즐겨찾기 해제" : "즐겨찾기 추가");
  }

  // 도구 페이지의 .topbar(#darkModeToggle 옆)에 별 버튼을 주입한다.
  // 현재 슬러그가 CATEGORIES에 있는 도구일 때만 주입(허브/기타 페이지 제외).
  function injectStarButton() {
    try {
      var slug = currentSlug();
      if (!findTool(slug)) return;                 // 도구 페이지가 아니면 주입 안 함
      var bar = document.querySelector(".topbar");
      if (!bar || document.getElementById("dgb-fav-btn")) return;
      var toggle = document.getElementById("darkModeToggle");
      var btn = document.createElement("button");
      btn.id = "dgb-fav-btn";
      btn.type = "button";
      btn.className = "dgb-fav-btn";
      updateStarBtn(btn, isFav(slug));
      btn.addEventListener("click", function () {
        try {
          var nowFav = toggleFav(slug);
          updateStarBtn(btn, nowFav);
          var host = document.getElementById("sidebar");
          var sc = host ? host.scrollTop : 0;
          render(); applyIcons();                  // 사이드바 즐겨찾기 그룹 즉시 갱신
          if (host) host.scrollTop = sc;           // 스크롤 위치 보존
        } catch (e) {}
      });
      if (toggle && toggle.parentNode) toggle.parentNode.insertBefore(btn, toggle);
      else bar.appendChild(btn);
    } catch (e) {}
  }

  // 사이드바 최상단 "⭐ 즐겨찾기" 그룹 HTML (즐겨찾기 0개면 빈 문자열).
  // 즐겨찾기한 도구는 원래 카테고리에도 그대로 남는다(복제 표시).
  function favGroupHtml(active) {
    try {
      var favs = getFavs();
      if (!favs.length) return "";
      var items = "";
      for (var i = 0; i < favs.length; i++) {
        var t = findTool(favs[i]); if (!t) continue;
        var cls = "navlink" + (t.slug === active ? " active" : "");
        items += '<a class="' + cls + '" href="/' + t.slug + '/">' +
                 '<span class="ic">' + iconHtml(t.icon) + "</span> " + esc(t.name) + "</a>";
      }
      if (!items) return "";
      return '<div class="grp"><div class="kick">⭐ 즐겨찾기</div>' + items + "</div>";
    } catch (e) { return ""; }
  }

  // 허브의 바로가기 칩 영역(#fav-shortcuts)을 즐겨찾기로 채운다.
  // 비었으면 안내 문구 + 기본 바로가기로 폴백. (도구 페이지엔 이 컨테이너가 없음)
  function defaultShortcuts() {
    var defs = [["image-compressor","이미지 압축"],["pdf-merge","PDF 합치기"],["qr-code","QR코드"],["word-counter","글자수 세기"],["age-calculator","만 나이"],["color-picker","컬러 피커"]];
    var h = '<span class="ql-label">바로가기</span>';
    for (var i = 0; i < defs.length; i++) h += '<a class="chip" href="/' + defs[i][0] + '/">' + esc(defs[i][1]) + "</a>";
    h += '<span class="ql-hint">도구 페이지에서 ★를 눌러 즐겨찾기에 추가하세요</span>';
    return h;
  }
  function renderFavShortcuts() {
    try {
      var box = document.getElementById("fav-shortcuts");
      if (!box) return;
      var favs = getFavs(), html = "", count = 0;
      if (favs.length) {
        html = '<span class="ql-label">⭐ 즐겨찾기</span>';
        for (var i = 0; i < favs.length; i++) {
          var t = findTool(favs[i]); if (!t) continue;
          html += '<a class="chip" href="/' + t.slug + '/">' + esc(t.name) + "</a>";
          count++;
        }
      }
      box.innerHTML = count ? html : defaultShortcuts();
    } catch (e) {}
  }

  function render() {
    var host = document.getElementById("sidebar");
    if (!host) return;
    var active = currentSlug();
    var html = favGroupHtml(active);   // 최상단 즐겨찾기 그룹(없으면 "")
    // 가이드(블로그) 링크 — 도구가 아니라 별도 섹션. /guide/ 하위 어디서든 active.
    var onGuide = location.pathname.indexOf("/guide") === 0;
    html += '<div class="grp"><a class="navlink' + (onGuide ? " active" : "") + '" href="/guide/">' +
            '<span class="ic">' + iconHtml("book-open") + "</span> 가이드 · 사용법</a></div>";
    for (var i = 0; i < CATEGORIES.length; i++) {
      var cat = CATEGORIES[i];
      html += '<div class="grp"><div class="kick">' + esc(cat.label) + "</div>";
      for (var j = 0; j < cat.tools.length; j++) {
        var t = cat.tools[j];
        var cls = "navlink" + (t.slug === active ? " active" : "");
        html += '<a class="' + cls + '" href="/' + t.slug + '/">' +
                '<span class="ic">' + iconHtml(t.icon) + "</span> " + esc(t.name) + "</a>";
      }
      html += "</div>";
    }
    host.innerHTML = html;
  }

  // ------------------------------------------------------------------
  // 사이드바 스크롤 위치 유지 (도구가 많아 사이드바가 길어짐)
  // 실제 스크롤 컨테이너는 #sidebar(.side, overflow:auto) 자신이다.
  // 페이지 이동 시에도 사용자가 보던 스크롤 위치를 그대로 유지한다.
  // sessionStorage(탭 단위, 비민감) 사용. 모바일(.side가 static·overflow 없음)에선
  // 내부 스크롤이 없어 저장값이 0으로 덮이지 않도록 overflow가 있을 때만 저장한다.
  // ------------------------------------------------------------------
  var SCROLL_KEY = "dgb-sidebar-scroll";

  function saveScroll(el) {
    try {
      if (el.scrollHeight > el.clientHeight) // 실제 스크롤되는 경우(데스크톱)만 저장
        sessionStorage.setItem(SCROLL_KEY, String(el.scrollTop));
    } catch (e) {}
  }
  function restoreScroll(el) {
    try {
      var v = sessionStorage.getItem(SCROLL_KEY);
      if (v !== null) el.scrollTop = parseInt(v, 10) || 0;
    } catch (e) {}
  }

  function boot() {
    render();
    applyIcons();
    try { injectStarButton(); } catch (e) {}   // 도구 페이지 topbar 별 버튼
    try { renderFavShortcuts(); } catch (e) {}  // 허브 #fav-shortcuts 채우기
    var host = document.getElementById("sidebar");
    if (!host) return;
    restoreScroll(host); // DOM·아이콘 생성 직후 동기 복원(페인트 전 → 튐 최소화)
    var ticking = false;
    host.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { saveScroll(host); ticking = false; });
    });
    // 이동/탭 전환 직전 한 번 더 확정 저장(스크롤 이벤트 누락 대비)
    window.addEventListener("pagehide", function () { saveScroll(host); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
