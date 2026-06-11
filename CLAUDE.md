# CLAUDE.md — 도구상자 프로젝트 지침

> 이 문서는 Claude Code가 매 세션 자동으로 읽고 따르는 지침서입니다. 작업 전 반드시 숙지하고, 이 문서와 실제 코드가 달라지게 되는 작업을 했다면 **같은 작업 안에서 이 문서도 갱신**하세요(→ "이 문서를 최신으로 유지하는 규칙" 참고).

## 1. 프로젝트 한 줄 요약

**도구상자**는 백엔드/서버 없이 100% 클라이언트 사이드(브라우저 JavaScript)로만 동작하는 무료 온라인 도구 모음 사이트입니다.

- **도메인**: https://dogubox.shop (`CNAME` 파일로 지정한 커스텀 도메인)
- **배포 방식**: GitHub Pages (정적 호스팅, 빌드 스텝 없음 — 푸시하면 그대로 서빙)
- **수익 모델**: Google AdSense 광고 (`client=ca-pub-6448118773813567`)
- **언어**: UI·콘텐츠 모두 한국어

## 2. 핵심 원칙 / 절대 규칙

1. **클라이언트 사이드 전용**: 모든 기능은 서버 없이 브라우저 JavaScript로만 구현합니다. 백엔드·DB가 필요한 기능(예: URL 단축, 서버 저장형 공유, 회원 기능, 서버 측 파일 변환 등)은 추가하지 않습니다. 사용자가 업로드/입력한 파일·텍스트는 서버로 전송하지 않고 브라우저 안에서만 처리합니다(개인정보 보호 + 정적 호스팅 제약).
2. **AdSense 스크립트 보존**: 모든 페이지 `<head>`의 Google AdSense 스크립트(`client=ca-pub-6448118773813567`)는 절대 제거하지 않습니다.
3. **민감 파일 보호**: `CNAME`, `ads.txt`, `robots.txt`, `privacy.html`은 함부로 수정/삭제하지 않습니다(각각 도메인·광고·크롤링·정책에 직결). 변경이 꼭 필요하면 이유를 명확히 하고 사용자에게 확인합니다.
4. **자동 커밋·푸시**: 작업을 마치면 Claude Code가 직접 `git add` → `commit` → `push`(브랜치 `main`)까지 수행합니다. 단, push 직전 보호 파일/스크립트 자가 점검을 반드시 거치며, 이상이 감지되면 push를 중단하고 보고합니다. 자세한 절차는 아래 **「자동 커밋·푸시 규칙」** 섹션을 따릅니다.

## 자동 커밋·푸시 규칙

- 작업(도구 추가, 콘텐츠 수정 등)을 마치면 Claude Code가 직접 `git add` → `commit` → `push`까지 수행한다. (브랜치는 `main`)
- 단, push 하기 **직전**에 반드시 아래 보호 파일들이 삭제되거나 의도치 않게 변경되지 않았는지 **자가 점검**한다:
  - `CNAME` (도메인 연결 — 삭제 시 dogubox.shop 끊김)
  - `ads.txt` (AdSense 소유권)
  - `robots.txt` (크롤링)
  - `privacy.html` (개인정보처리방침)
  - 각 페이지 `<head>`의 AdSense 스크립트(`ca-pub-6448118773813567`)
- 위 보호 파일/스크립트에 삭제나 비정상 변경이 감지되면 **push를 중단하고 사용자에게 즉시 보고**한다(임의로 복구하거나 강행하지 않는다).
- 커밋 메시지는 무엇을 했는지 **한국어로 명확하게** 작성한다(예: "이미지 자르기 도구 추가").
- push 완료 후, 무엇을 커밋·푸시했는지(**커밋 메시지 + 변경/추가된 파일 목록**)를 요약해 보고한다.
- git 인증 오류 등으로 push가 실패하면, 변경사항은 그대로 두고(**커밋까지는 한 상태로**) 사용자에게 오류 내용을 보고한다.

## 3. 디렉터리 / 파일 구조

```
toolbox/
├── index.html          # 허브 페이지: 도구 카드 그리드 + 소개/이용방법/FAQ/문의 섹션(#about/#howto/#faq/#contact)
├── privacy.html        # 개인정보처리방침 (수정 주의)
├── ads.txt             # AdSense 게시자 인증 (수정 주의)
├── robots.txt          # 크롤러 정책 (수정 주의)
├── sitemap.xml         # 사이트맵 — 도구 추가 시 URL 추가 필요
├── CNAME               # 커스텀 도메인 dogubox.shop (수정 주의)
├── tool-page.css       # 공통 스타일시트 (최신 도구 페이지가 참조)
├── guide.css           # 가이드(블로그) 전용 스타일 (tool-page.css 위에 얹어 사용 — 아티클 프로즈·표·도구 CTA·허브 그리드)
├── guide/index.html    # ★ 가이드 허브(블로그 글 목록) — SEO/AdSense용 읽을거리 콘텐츠
├── guide/<슬러그>/index.html # 각 가이드 글 = 독립 페이지(독립 URL)
├── theme.css           # 다크모드 스타일
├── theme.js            # 다크모드 토글 로직 (#darkModeToggle 버튼 제어)
├── sidebar.js          # ★ 공통 사이드바 생성 + 전체 도구 목록 데이터(단일 출처)
├── instrument-audio.js # "악기" 도구 공통 모듈(DGBInstrument): Tone.js 지연 로드·SRI·오디오 활성화 + 키맵 엔진 + 누름 피드백 (drum-pad·piano가 사용, Tone SRI는 여기 한 곳에서 관리)
└── <슬러그>/index.html  # 각 도구 = 독립 페이지(독립 URL, SEO 목적)
```

- 각 도구는 `/<슬러그>/index.html` 형태의 독립 페이지입니다. 독립 URL을 가져 SEO에 유리합니다(예: `https://dogubox.shop/word-counter/`).
- 빌드 도구·번들러·패키지 매니저가 없습니다. 순수 HTML/CSS/JS이며 푸시 즉시 반영됩니다.

## 4. 현재 존재하는 모든 도구 목록

> **총 115개** (실제 도구 폴더 수와 일치해야 함). 도구를 추가/삭제/이름변경하면 이 표를 반드시 갱신하세요.

> **★ 정렬(순서) 규칙 — 새 도구는 아무 데나 끝에 붙이지 말고 아래 순서에 맞는 위치에 넣습니다.** 이 순서는 `sidebar.js`의 CATEGORIES, 허브 `index.html` 카드, 이 표(섹션 4), `README.md`가 **모두 동일**해야 합니다.
> - **카테고리 순서(일상 → 전문 → 재미)**: 이미지·PDF → 텍스트·생성 → 생활·편의 → 직장인·생산성 → 색상·디자인 → 개발자 도구 → 악기.
> - **카테고리 안 도구 순서**: 비슷한 기능끼리 묶고(예: 이미지편집 → 이미지변환·유틸 → PDF, 텍스트편집 → 변환 → 생성기, 계산 → 변환 → 날짜·시간 → 추첨·재미 등), 더 자주 쓰는 핵심 도구를 그 그룹 앞쪽에 둡니다.
> - 새 도구를 추가할 때는 같은 카테고리의 알맞은 그룹 위치에 끼워 넣고, 위 4곳(sidebar·허브·이 표·README)의 순서를 동일하게 맞춥니다.

### 이미지 · PDF (25)
| 슬러그 | 이름 |
|---|---|
| image-converter | 이미지 포맷 변환 |
| image-compressor | 이미지 압축·리사이즈 |
| image-resizer | 이미지 크기 조절 |
| image-crop | 이미지 자르기 |
| image-rotate | 이미지 회전·뒤집기 |
| image-adjust | 이미지 밝기·대비·채도 조절 |
| image-filter | 흑백·세피아 필터 |
| watermark | 이미지 워터마크 넣기 |
| image-blur | 이미지 모자이크·블러 |
| image-merge | 이미지 합치기·콜라주 |
| meme-generator | 밈·짤 생성기 |
| id-photo | 증명사진 규격 맞추기 |
| remove-exif | EXIF·위치정보 제거 |
| heic-to-jpg | HEIC → JPG 변환 |
| image-base64 | 이미지 ↔ Base64 |
| image-ocr | 이미지 OCR·글자 추출 |
| gif-maker | 이미지로 GIF 만들기 |
| pdf-merge | PDF 합치기 |
| pdf-split | PDF 페이지 분할 |
| pdf-organize | PDF 회전·페이지 정리 |
| pdf-compressor | PDF 용량 줄이기 |
| pdf-watermark | PDF 워터마크 |
| image-to-pdf | 이미지 → PDF |
| pdf-to-image | PDF → 이미지 |
| pdf-to-text | PDF → 텍스트 추출 |

### 텍스트 · 생성 (22)
| 슬러그 | 이름 |
|---|---|
| word-counter | 글자수 세기 |
| clean-text | 공백·줄바꿈 정리 |
| text-replace | 텍스트 찾기·바꾸기 |
| remove-duplicate-lines | 중복 줄 제거 |
| sort-lines | 텍스트 줄 정렬 |
| line-numbers | 줄 번호 매기기 |
| case-converter | 대소문자·표기 변환 |
| text-diff | 텍스트 비교(diff) |
| reading-time | 읽는 시간 계산기 |
| fancy-text | 유니코드 꾸미기 글자 변환 |
| special-characters | 특수문자·이모지 복사 |
| romanizer | 한글 → 로마자 변환 |
| keyboard-typo | 한/영 키보드 오타 변환 |
| number-to-korean | 숫자 → 한글 금액 변환 |
| tts | 텍스트 → 음성 (TTS) |
| qr-code | QR코드 생성 |
| qr-reader | QR코드 읽기 |
| barcode-generator | 바코드 생성기 |
| password-generator | 비밀번호 생성 |
| password-strength | 비밀번호 강도 검사기 |
| lorem-ipsum | 로렘 입숨 생성기 |
| json-formatter | JSON 포매터 |

### 생활 · 편의 (19)
| 슬러그 | 이름 |
|---|---|
| calculator | 계산기 (일반·공학용) |
| percentage-calculator | 퍼센트 계산기 |
| discount-calculator | 할인가 계산기 |
| unit-converter | 단위 변환 |
| pyeong-converter | 평 ↔ ㎡ 변환 |
| size-converter | 옷·신발 사이즈 변환 |
| age-calculator | 만 나이 계산기 |
| dday-calculator | D-Day · 날짜 계산 |
| lunar-solar-converter | 음력 ↔ 양력 변환 |
| timezone-converter | 세계 시간 변환 |
| stopwatch-timer | 스톱워치·타이머 |
| bmi-calculator | BMI 계산기 |
| gpa-calculator | 학점·GPA 계산기 |
| typing-speed | 타자 속도 측정 |
| zodiac-finder | 띠·별자리 찾기 |
| random-picker | 랜덤 추첨기 |
| spinner-wheel | 돌림판 추첨 (룰렛) |
| ladder-game | 사다리타기 |
| lotto-generator | 로또 번호 생성 |

### 직장인 · 생산성 (5)
| 슬러그 | 이름 |
|---|---|
| notepad | 임시 메모장 |
| pomodoro | 포모도로 타이머 |
| signature-maker | 서명 만들기 (전자서명) |
| utm-builder | UTM 빌더 |
| device-test | 마이크·웹캠 테스트 |

### 색상 · 디자인 (12)
| 슬러그 | 이름 |
|---|---|
| color-picker | 컬러 피커·색상 변환 |
| hex-rgb-converter | HEX ↔ RGB 변환 |
| color-palette | 컬러 팔레트 생성 |
| color-extractor | 이미지에서 색 추출 |
| gradient-generator | 그라데이션 생성기 |
| box-shadow-generator | 그림자(box-shadow) 생성기 |
| border-radius-generator | 테두리 둥글기 생성기 |
| cubic-bezier | cubic-bezier 이징 생성기 |
| css-unit-converter | CSS 단위 변환 (px↔rem↔em) |
| contrast-checker | 색상 대비 검사 |
| color-blindness | 색맹·색약 시뮬레이터 |
| favicon-generator | 파비콘 생성 |

### 개발자 도구 (17)
| 슬러그 | 이름 |
|---|---|
| encoder-decoder | 인코더 · 디코더 |
| hash-generator | Hash 생성 |
| jwt-decoder | JWT 디코더 |
| uuid-generator | UUID 생성 |
| base-converter | 진법 변환 |
| timestamp | 타임스탬프 변환 |
| cron-parser | cron 표현식 변환·설명 |
| regex-tester | 정규식 테스터 |
| json-yaml | JSON ↔ YAML 변환 |
| json-xml | JSON ↔ XML 변환 |
| csv-json | CSV ↔ JSON 변환 |
| json-to-types | JSON → 타입 변환 (TS/Python/Go) |
| json-to-java-dto | JSON → Java DTO |
| table-converter | 표 변환기 |
| sql-formatter | SQL 포매터 |
| markdown-preview | 마크다운 → HTML 변환 |
| http-status-codes | HTTP 상태 코드 치트시트 |

### 악기 (15)
| 슬러그 | 이름 |
|---|---|
| piano | 피아노 |
| synth | 신디사이저 |
| xylophone | 실로폰 |
| kalimba | 칼림바 |
| handpan | 핸드팬 |
| harp | 하프 |
| guitar | 기타 |
| gayageum | 가야금 |
| drum-pad | 드럼 패드 |
| launchpad | 런치패드 |
| sequencer | 스텝 시퀀서 |
| theremin | 테레민 |
| metronome | 메트로놈 |
| tuner | 튜너(조율기) |
| recorder | 녹음기 |

## 4-1. 가이드(블로그) 섹션 — `/guide/`

> **목적**: 순수 유틸리티만 있는 사이트는 AdSense·검색에서 "가치 없는 콘텐츠(thin content)"로 평가받기 쉽습니다. 이를 보완하려고 **읽을거리형 editorial 콘텐츠**(도구 활용 가이드)를 `/guide/` 하위에 둡니다. 도구 개수(115)에는 포함하지 않습니다.

- **허브**: `/guide/index.html` — 글 목록(`.guide-grid` 카드). canonical `https://dogubox.shop/guide/`. JSON-LD는 `CollectionPage` + `BreadcrumbList`.
- **각 글**: `/guide/<슬러그>/index.html` — `tool-page.css` + **`guide.css`** + `theme.css` 참조. 본문은 `<article class="inner">` 안에 `<h1>` 1개 + `<section class="content">`(h2 소제목·표·`.callout`·`.tool-cta`·`.toc`·FAQ·관련 글). JSON-LD는 **Article + FAQPage + BreadcrumbList**(홈>가이드>글). FAQPage 질문·답변은 본문 FAQ와 글자 단위로 동일해야 함.
- **도구로 연결**: 글마다 관련 도구로 가는 `.tool-cta` 카드(아이콘은 `data-icon`로 두면 `sidebar.js`가 채움)와 본문 내부 링크(`a.inlink`)를 넣습니다.
- **사이드바 노출**: `sidebar.js`의 `render()`가 즐겨찾기 그룹 다음에 **"가이드 · 사용법"** 링크(book-open 아이콘)를 자동 삽입 → 전 페이지(도구·허브)에서 노출. `/guide` 경로에서 active. (개별 페이지 수정 불필요)
- **허브(홈) 노출**: `index.html`에 "활용 가이드" 섹션(`.grid.guide-cards`)으로 6개 카드. **이 그리드는 도구 개수 카운트에서 제외**됩니다(홈 스크립트가 `.guide-cards` 부모를 가진 카드를 제외하고 셈). 푸터에도 `/guide/` 링크.
- **현재 글(60)**: `self-intro-character-count`(자기소개서 글자 수), `heic-to-jpg-guide`(HEIC→JPG), `reduce-image-size`(이미지 용량 줄이기), `merge-split-pdf`(PDF 합치기·분할), `make-qr-code`(QR코드 만들기), `strong-password`(안전한 비밀번호), `id-photo-size`(증명사진 규격), `remove-photo-location`(사진 EXIF 위치정보 제거), `pyeong-conversion`(평↔㎡ 변환), `unit-conversion`(단위 변환), `percentage-calculation`(퍼센트 계산법), `json-basics`(JSON 입문), `lunar-solar-conversion`(음력↔양력), `dday-calculation`(D-Day 계산), `hex-rgb-color-codes`(색상 코드 HEX·RGB·HSL), `markdown-syntax`(마크다운 문법), `bmi-calculation`(BMI 계산법), `age-calculation`(만 나이 계산법), `regex-basics`(정규식 입문), `timestamp-conversion`(유닉스 타임스탬프), `csv-json-conversion`(CSV·엑셀·JSON), `size-conversion`(옷·신발 사이즈), `base64-encoding`(Base64·URL 인코딩), `discount-calculation`(할인율 계산), `gpa-calculation`(학점·GPA 계산), `lotto-probability`(로또 확률), `timezone-difference`(시차 계산), `make-gif`(움짤 GIF 만들기), `extract-text-from-image`(사진 글자 추출 OCR), `zodiac-animal`(띠·별자리), `add-watermark`(워터마크 넣기), `what-is-jwt`(JWT 토큰), `pomodoro-technique`(포모도로 공부법), `what-is-hash`(해시·SHA-256), `utm-parameters`(UTM 파라미터), `number-base-conversion`(진법 변환), `electronic-signature`(전자서명), `cron-expression`(cron 표현식), `color-contrast-accessibility`(색상 대비·접근성), `text-comparison`(텍스트 비교 diff), `korean-romanization`(로마자 표기법), `what-is-favicon`(파비콘), `text-to-speech`(TTS 활용법), `barcode-types`(바코드 종류), `typing-speed-tips`(타자 속도), `what-is-lorem-ipsum`(로렘 입숨), `video-call-check`(화상 면접·회의 점검), `fair-random-draw`(공정한 추첨), `color-scheme-basics`(배색 기초), `make-meme`(밈·짤 만들기), `sql-formatting`(SQL 쿼리 정리), `markdown-table`(마크다운 표 만들기), `css-gradient`(CSS 그라데이션), `css-box-shadow`(box-shadow 그림자), `password-strength-check`(비밀번호 강도 점검), `study-timer`(순공시간·스톱워치 공부법), `http-error-codes`(404·500 에러 의미), `broken-text-encoding`(글자 깨짐·인코딩), `guitar-tuning`(기타 튜닝), `metronome-practice`(메트로놈 연습법).
- **새 글 추가 시**: ① `/guide/<슬러그>/index.html` 생성(위 패턴) → ② `guide/index.html` 허브에 카드 1개 추가 → ③ `sitemap.xml`에 URL 추가 → ④ 필요하면 홈 "활용 가이드" 카드 갱신 → ⑤ 이 목록 갱신. (사이드바 "가이드" 링크는 단일 진입점이라 글마다 수정 불필요.)

## 5. 모든 도구 페이지가 공유하는 공통 구조

각 `/<슬러그>/index.html`은 동일한 골격을 따릅니다(예: `word-counter/`, `clean-text/`, `qr-code/`).

### `<head>`
- `<meta charset>`, `<meta viewport>` — 모바일 반응형
- 고유 `<title>` 과 `<meta name="description">` (도구별로 다르게, SEO용)
- **Google AdSense 스크립트** (`adsbygoogle.js?client=ca-pub-6448118773813567`) — 제거 금지
- 폰트: Google Fonts(`Bricolage Grotesque`, `JetBrains Mono`) + Pretendard CDN
- 그 도구에 필요한 외부 라이브러리만 추가 (예: `qr-code`는 qrcodejs, PDF 도구는 pdf-lib 등). 불필요한 라이브러리는 넣지 않음
- **스타일**: 두 가지 패턴이 공존합니다 —
  - (최신) 외부 `<link rel="stylesheet" href="/tool-page.css">` 참조 (예: `clean-text`, `word-counter`)
  - (기존) 동일한 CSS를 페이지 내 `<style>`로 인라인 (예: `qr-code`)
  - **새 도구는 `/tool-page.css`를 참조하는 최신 패턴을 권장**합니다(중복 제거).
- `<link rel="stylesheet" href="/theme.css">` — 다크모드 스타일

### 상단바 / 사이드바 / 푸터
- **상단바(.topbar)**: 브랜드 로고(`.brand`, `href="/"`), 다크모드 토글 버튼(`#darkModeToggle`), 모바일 메뉴 버튼
- **좌측 사이드바(.side)**: 카테고리(`이미지·PDF / 텍스트·생성 / 색상·디자인 / 생활·편의 / 직장인·생산성 / 개발자 도구 / 악기`)별로 **전체 도구 링크**를 나열. **★ 사이드바는 더 이상 각 페이지에 하드코딩하지 않습니다.** 모든 페이지는 빈 컨테이너 `<aside class="side" id="sidebar">`(JS 비활성 대비 `<noscript>` "모든 도구" 폴백 포함)만 두고, 공통 스크립트 **`/sidebar.js`** 가 자신의 도구 목록 데이터 배열로부터 사이드바 HTML을 생성해 채웁니다. **전체 도구 목록의 단일 출처(source of truth)는 `sidebar.js`의 `CATEGORIES` 배열**입니다. **현재 페이지의 active 처리**는 `sidebar.js`가 경로(슬러그)로 자동 판별하므로 페이지마다 따로 표시하지 않습니다(`/sidebar.js`와 `<script src="/sidebar.js">`는 각 페이지에 포함).
- 본문 상단 `← 모든 도구` 링크(`.crumb`)는 `/` 로 연결
- **푸터**: `/#about`(소개) · `/#faq`(자주 묻는 질문) · `/#contact`(문의) · `/privacy.html`(개인정보처리방침)

### 본문 콘텐츠
- 기능 UI(`.box` 등) 아래에 한국어 콘텐츠 섹션(`.content`):
  - **사용법** (`.steps-list`, 순서 단계)
  - **활용 팁** (`.tips-list`)
  - **자주 묻는 질문 / FAQ** (`.faq-list` > `.qa`)
- `<script src="/theme.js"></script>` 로 다크모드 토글 로직 로드

## 6. 새 도구 추가 시 체크리스트

새 도구 `<슬러그>`를 추가할 때 아래를 **모두** 수행합니다:

1. **`/<슬러그>/index.html` 생성** — 기존 도구 페이지와 동일한 패턴(head · 상단바 · 푸터 · 디자인). `/tool-page.css` 참조 패턴 권장. **사이드바는 직접 작성하지 말고** 빈 컨테이너 `<aside class="side" id="sidebar"><noscript><a class="navlink" href="/"><span class="ic">←</span> 모든 도구</a></noscript></aside>` 만 두고, 본문 끝(`theme.js` 앞)에 `<script src="/sidebar.js"></script>`를 추가합니다.
   - **★ 표준 문서 구조(SEO)**: 파일 맨 첫 줄 `<!DOCTYPE html>`, 그다음 `<html lang="ko">`로 시작해 맨 끝을 `</html>`로 닫습니다. `<head>`에 `<link rel="canonical" href="https://dogubox.shop/<슬러그>/">`를 넣고, 페이지 **대표 제목은 `<h1>` 한 개**만 둡니다(콘텐츠 섹션 라벨은 `<div class="sec-label">` 유지 — h1/h2로 만들지 않음). h1 스타일은 `tool-page.css`의 `h1,h2{…}` 규칙이 담당합니다.
2. **외부 라이브러리** — 그 도구에 꼭 필요한 라이브러리만 `<head>`에 추가.
3. **★ 사이드바 = `sidebar.js` 데이터에 한 줄 추가** — `sidebar.js`의 `CATEGORIES`에서 알맞은 카테고리의 `tools` 배열에 `{ slug, name, icon }` 한 줄만 추가하면 **전 페이지 사이드바와 active 처리가 자동 반영**됩니다. (더 이상 개별 페이지 사이드바를 수정하지 않습니다.) **아이콘은 Lucide 인라인 SVG로 통일**되어 있습니다 — `icon` 값은 `sidebar.js`의 `ICONS` 매핑에 있는 Lucide 아이콘 이름(예: `"crop"`)을 쓰고, 새 아이콘이 필요하면 `ICONS`에 해당 Lucide SVG의 inner path를 추가합니다(`stroke="currentColor"`라 다크모드 자동 대응, 외부 CDN·SRI 불필요).
4. **허브 카드 추가** — `index.html`의 해당 카테고리 카드 그리드(`.grid`)에 새 카드 추가. 아이콘은 이모지 대신 `<div class="ic" data-icon="<Lucide이름>">`로 두면 `sidebar.js`가 같은 `ICONS` 매핑으로 채웁니다(사이드바와 허브가 단일 아이콘 세트 공유).
5. **`sitemap.xml`** — `<url><loc>https://dogubox.shop/<슬러그>/</loc><lastmod>오늘 날짜</lastmod></url>` 추가.
6. **콘텐츠 섹션** — 사용법(3~5단계) / 활용 팁(2~3개, 도구별 고유) / FAQ(3개). 한국어, 도구별 고유 내용, 합계 약 250~400단어. 고유 `<title>`·`<meta description>`.
7. **★ JSON-LD 구조화 데이터(SEO)** — `<head>`에 `<script type="application/ld+json">` 블록으로 **SoftwareApplication + FAQPage + BreadcrumbList**(홈 > 도구명) 3개를 추가합니다(화면 표시 없음, 검색 리치 스니펫용). 모든 값은 그 페이지의 **실제 내용과 일치**해야 합니다 — `name`=h1 도구명, `description`=meta description, `url`=canonical, `applicationCategory`=카테고리에 맞는 값(이미지·PDF→`MultimediaApplication`, 텍스트/생활·편의→`UtilityApplication`, 색상·디자인→`DesignApplication`, 직장인·생산성→`BusinessApplication`, 개발자→`DeveloperApplication`), `operatingSystem`="Web", `inLanguage`="ko", `offers`(price 0, KRW), `provider`(도구상자, https://dogubox.shop/). **FAQPage의 질문·답변은 페이지 본문 FAQ와 글자 단위로 동일**해야 합니다(페이지에 없는 FAQ를 넣으면 구글 정책 위반). 허브(`index.html`)는 `WebSite`(검색이 클라이언트 필터라 `SearchAction`은 넣지 않음)만 둡니다. 구글 Rich Results Test로 검증.
8. **다크모드/모바일 반응형 확인** — `theme.css`/`theme.js` 연동, 좁은 화면에서 사이드바 토글 동작 확인.
9. **★ 문서 갱신** — 이 CLAUDE.md의 도구 목록(4번 섹션)에 새 도구를 추가하고, `README.md`의 도구 목록도 갱신.
10. **커밋·푸시** — 작업 완료 후 「자동 커밋·푸시 규칙」에 따라 Claude Code가 직접 `add`→`commit`→`push`(`main`). push 직전 보호 파일/AdSense 스크립트 자가 점검, 이상 시 중단·보고.

> 검증 팁: `sidebar.js`가 그리는 사이드바 링크 수 == 실제 도구 폴더 수 == 허브 카드 수 == `sitemap.xml`의 도구 URL 수 가 모두 일치하는지 확인합니다. (사이드바는 `sidebar.js` 한 곳에서 그리므로 페이지별 누락은 발생하지 않지만, 데이터·카드·sitemap 간 불일치는 확인 대상입니다.)

## 7. 이 문서(CLAUDE.md)를 최신으로 유지하는 규칙

**이 문서는 항상 실제 코드 상태와 일치해야 합니다.** 다음을 반드시 지킵니다:

- 도구를 **추가/삭제/이름변경**할 때마다 **`sidebar.js`의 `CATEGORIES` 배열**(실제 사이드바를 그리는 단일 출처), 이 문서의 도구 목록(4번 섹션), `README.md`의 도구 목록을 **모두 함께** 갱신합니다(총 개수와 카테고리 분류 포함).
- 새 **규칙·구조 변경·새 공통 파일**이 생기면 관련 섹션(핵심 규칙, 파일 구조, 공통 구조 등)도 함께 갱신합니다.
- 즉, **어떤 작업으로 이 문서의 내용과 실제 코드가 달라지게 되면, 같은 작업 안에서 이 문서도 수정**해 항상 실제 상태와 일치시킵니다. 문서 갱신은 별도 작업이 아니라 해당 작업의 일부입니다.

## 8. 톤 / 언어

- 사이트 UI·콘텐츠는 **한국어**. 친절하고 간결하게.
- 도구 설명·FAQ는 실제 사용 맥락(자기소개서 글자 수, 엑셀 붙여넣기 정리, 인쇄용 QR 등)을 담아 구체적으로.

## 9. 향후 작업 (보류 중)

- **도구 폴더를 루트 → `tools/` 하위로 이전 예정**(예: `/qr-code/` → `/tools/qr-code/`). **단, (1) AdSense 승인 완료 + (2) 구글 색인이 어느 정도 안정화된 이후에만 진행.** URL이 전부 바뀌는 작업이므로 이전 시 반드시 함께 처리: ① 기존 URL→새 URL **301 리다이렉트** 설정, ② `sitemap.xml`의 전 URL 갱신, ③ 각 페이지 **canonical·JSON-LD(`url`·`BreadcrumbList`)** 갱신, ④ `sidebar.js`·허브 카드 링크 갱신, ⑤ 서치 콘솔에 **새 sitemap 재제출**. **색인/심사 안정화 전에는 절대 진행 금지.**
