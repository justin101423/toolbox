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
2. **AdSense 스크립트 보존**: 모든 페이지 `<head>`의 Google AdSense 스크립트(`client=ca-pub-6448118773813567`)는 절대 제거하지 않습니다. (유일한 예외: `404.html` — 오류 페이지 광고 게재는 AdSense 정책 위반이라 의도적으로 스크립트를 넣지 않음.)
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
├── index.html          # 허브 페이지: 도구 카드 그리드 + 활용 가이드 카드 (소개·FAQ·문의는 about.html로 분리)
├── about.html          # 사이트 소개 페이지: 소개·이용 방법·FAQ(#faq)·문의(#contact) — FAQPage JSON-LD 포함
├── 404.html            # 404 페이지 (GitHub Pages 자동 사용) — noindex, ★유일하게 AdSense 스크립트 없음(오류 페이지 광고 금지 정책)
├── privacy.html        # 개인정보처리방침 (수정 주의)
├── terms.html          # 이용약관 (privacy와 동일 디자인, 전 페이지 푸터에서 링크)
├── ads.txt             # AdSense 게시자 인증 (수정 주의)
├── robots.txt          # 크롤러 정책 (수정 주의)
├── sitemap.xml         # 사이트맵 — 도구 추가 시 URL 추가 필요
├── CNAME               # 커스텀 도메인 dogubox.shop (수정 주의)
├── tool-page.css       # 공통 스타일시트 (최신 도구 페이지가 참조)
├── guide.css           # 가이드(블로그) 전용 스타일 (tool-page.css 위에 얹어 사용 — 아티클 프로즈·표·도구 CTA·허브 그리드)
├── guide/index.html    # ★ 가이드 허브(블로그 글 목록) — SEO/AdSense용 읽을거리 콘텐츠
├── guide/<슬러그>/index.html # 각 가이드 글 = 독립 페이지(독립 URL)
├── .nojekyll           # GitHub Pages의 Jekyll 빌드 생략(배포 속도↑, 닷·밑줄 경로 그대로 서빙)
├── .well-known/security.txt # 보안 제보 채널(RFC 9116) — Expires 매년 갱신 필요(현재 2027-06-12)
├── theme.css           # 다크모드 스타일 + 전 페이지 공통 보조 스타일(테마 토글, 사이드바 라벨 타이포 — 모든 페이지가 마지막에 로드하므로 구형 인라인 CSS도 덮어씀) + ★작업대 임베드 모드(html.embed) 규칙(?embed=1 로 열린 도구 페이지의 상단바·사이드바·푸터·.crumb·.lede·.content·h1·광고를 숨겨 순수 도구 UI만 남김)
├── theme.js            # 다크모드 토글 로직 (#darkModeToggle 버튼 제어) + 프레임버스터(★같은 출처=작업대 iframe이면 탈출 안 함, 외부 클릭재킹만 방어) + ?embed=1 감지 시 html에 .embed 클래스 부여(작업대 임베드 모드)
├── sidebar.js          # ★ 공통 사이드바 생성 + 전체 도구 목록 데이터(단일 출처). CATEGORIES·iconHtml을 window.DGB_TOOLS로 노출 → 작업대(workbench.js)가 같은 도구 목록을 재사용
├── workbench.js        # ★ 작업대 — 홈 상단 #workbenchToggle 버튼으로 홈 위에 "떠 있는 창"을 띄워 도구를 1~5칸 나란히 사용. 각 칸은 도구를 /<슬러그>/?embed=1 iframe으로 로드. 도구 목록은 window.DGB_TOOLS(단일 출처). 기능: 검색 가능한 도구 피커(.wb-pop)·분할 수(1~5) 선택·칸 사이 너비 드래그·도구를 다른 칸으로 끌어 옮기기(.wb-grip 드래그→"여기에 놓기"). ★배치는 flex order(vorder)로만 바꿔 iframe을 reparent하지 않음 → 옮겨도 입력 상태 보존. MAX_PANES=5. **index.html에서만 로드**
├── workbench.css       # 작업대 스타일(상단바 .wb-btn + 스크림 .wb-overlay + 떠 있는 창 .wb-window + 분할 칸 .wb-pane + 너비 손잡이 .wb-divider + 검색 팝오버 .wb-pop + 드래그 고스트 .wb-drag-ghost). workbench.js와 한 쌍, index.html에서만 로드
├── analytics.js        # GA4 로더 — 측정 ID(GA_ID)는 이 파일 한 곳에서만 관리. placeholder 상태면 무동작. 전 페이지가 theme.js 다음에 로드. ★?embed=1(작업대 iframe)이면 페이지뷰(page_view)를 끄고 대신 `workbench_tool_open`(tool_slug 포함) 이벤트로 기록 → 방문 통계는 깨끗하게 유지
├── instrument-audio.js # "악기" 도구 공통 모듈(DGBInstrument): Tone.js 지연 로드·SRI·오디오 활성화 + 키맵 엔진 + 누름 피드백 (drum-pad·piano가 사용, Tone SRI는 여기 한 곳에서 관리)
└── <슬러그>/index.html  # 각 도구 = 독립 페이지(독립 URL, SEO 목적)
```

- 각 도구는 `/<슬러그>/index.html` 형태의 독립 페이지입니다. 독립 URL을 가져 SEO에 유리합니다(예: `https://dogubox.shop/word-counter/`).
- 빌드 도구·번들러·패키지 매니저가 없습니다. 순수 HTML/CSS/JS이며 푸시 즉시 반영됩니다.

## 4. 현재 존재하는 모든 도구 목록

> **총 176개** (실제 도구 폴더 수와 일치해야 함). 도구를 추가/삭제/이름변경하면 이 표를 반드시 갱신하세요.

> **★ 정렬(순서) 규칙 — 새 도구는 아무 데나 끝에 붙이지 말고 아래 순서에 맞는 위치에 넣습니다.** 이 순서는 `sidebar.js`의 CATEGORIES, 허브 `index.html` 카드, 이 표(섹션 4), `README.md`가 **모두 동일**해야 합니다.
> - **카테고리 순서(일상 → 전문 → 재미)**: 이미지·PDF → 텍스트·생성 → 생활·편의 → 금융 → 직장인·생산성 → 색상·디자인 → 개발자 도구 → 악기.
> - **카테고리 안 도구 순서**: 비슷한 기능끼리 묶고(예: 이미지편집 → 이미지변환·유틸 → PDF, 텍스트편집 → 변환 → 생성기, 계산 → 변환 → 날짜·시간 → 추첨·재미 등), 더 자주 쓰는 핵심 도구를 그 그룹 앞쪽에 둡니다.
> - 새 도구를 추가할 때는 같은 카테고리의 알맞은 그룹 위치에 끼워 넣고, 위 4곳(sidebar·허브·이 표·README)의 순서를 동일하게 맞춥니다.

### 이미지 · PDF (30)
| 슬러그 | 이름 |
|---|---|
| image-converter | 이미지 포맷 변환 |
| image-compressor | 이미지 압축·리사이즈 |
| image-resizer | 이미지 크기 조절 |
| image-crop | 이미지 자르기 |
| image-border | 이미지 테두리·여백 추가 |
| image-rotate | 이미지 회전·뒤집기 |
| image-adjust | 이미지 밝기·대비·채도 조절 |
| image-filter | 흑백·세피아 필터 |
| image-invert | 이미지 색 반전 |
| watermark | 이미지 워터마크 넣기 |
| image-blur | 이미지 모자이크·블러 |
| image-merge | 이미지 합치기·콜라주 |
| meme-generator | 밈·짤 생성기 |
| id-photo | 증명사진 규격 맞추기 |
| remove-exif | EXIF·위치정보 제거 |
| image-info | 이미지 정보 보기 |
| heic-to-jpg | HEIC → JPG 변환 |
| image-base64 | 이미지 ↔ Base64 |
| image-ocr | 이미지 OCR·글자 추출 |
| image-ascii | 이미지 → ASCII 아트 |
| gif-maker | 이미지로 GIF 만들기 |
| pdf-merge | PDF 합치기 |
| pdf-split | PDF 페이지 분할 |
| pdf-organize | PDF 회전·페이지 정리 |
| pdf-compressor | PDF 용량 줄이기 |
| pdf-watermark | PDF 워터마크 |
| pdf-page-numbers | PDF 페이지 번호 넣기 |
| image-to-pdf | 이미지 → PDF |
| pdf-to-image | PDF → 이미지 |
| pdf-to-text | PDF → 텍스트 추출 |

### 텍스트 · 생성 (28)
| 슬러그 | 이름 |
|---|---|
| word-counter | 글자수 세기 |
| word-frequency | 단어 빈도 분석기 |
| clean-text | 공백·줄바꿈 정리 |
| text-replace | 텍스트 찾기·바꾸기 |
| remove-duplicate-lines | 중복 줄 제거 |
| sort-lines | 텍스트 줄 정렬 |
| list-converter | 줄바꿈 ↔ 쉼표 변환기 |
| line-numbers | 줄 번호 매기기 |
| case-converter | 대소문자·표기 변환 |
| text-reverser | 글자 거꾸로·뒤집기 |
| morse-code | 모스부호 변환기 |
| text-diff | 텍스트 비교(diff) |
| reading-time | 읽는 시간 계산기 |
| fancy-text | 유니코드 꾸미기 글자 변환 |
| nickname-generator | 랜덤 닉네임 생성기 |
| special-characters | 특수문자·이모지 복사 |
| romanizer | 한글 → 로마자 변환 |
| keyboard-typo | 한/영 키보드 오타 변환 |
| hangul-chosung | 초성 추출기 |
| number-to-korean | 숫자 → 한글 금액 변환 |
| tts | 텍스트 → 음성 (TTS) |
| qr-code | QR코드 생성 |
| qr-reader | QR코드 읽기 |
| barcode-generator | 바코드 생성기 |
| password-generator | 비밀번호 생성 |
| password-strength | 비밀번호 강도 검사기 |
| lorem-ipsum | 로렘 입숨 생성기 |
| json-formatter | JSON 포매터 |

### 생활 · 편의 (35)
| 슬러그 | 이름 |
|---|---|
| calculator | 계산기 (일반·공학용) |
| percentage-calculator | 퍼센트 계산기 |
| statistics-calculator | 통계 계산기 |
| gcd-lcm | 최대공약수·최소공배수 계산기 |
| area-calculator | 도형 면적 계산기 |
| quadratic-equation | 이차방정식 계산기 |
| electricity-bill | 전기요금 계산기 |
| fuel-cost | 유류비·연비 계산기 |
| parcel-weight | 택배 부피무게 계산기 |
| unit-converter | 단위 변환 |
| pyeong-converter | 평 ↔ ㎡ 변환 |
| size-converter | 옷·신발 사이즈 변환 |
| roman-numerals | 로마 숫자 변환기 |
| cooking-converter | 요리 계량 변환기 |
| age-calculator | 만 나이 계산기 |
| dday-calculator | D-Day · 날짜 계산 |
| due-date-calculator | 출산 예정일 계산기 |
| ovulation-calculator | 배란일·가임기 계산기 |
| business-days | 근무일수·영업일 계산기 |
| lunar-solar-converter | 음력 ↔ 양력 변환 |
| timezone-converter | 세계 시간 변환 |
| stopwatch-timer | 스톱워치·타이머 |
| sleep-calculator | 수면 시간 계산기 |
| bmi-calculator | BMI 계산기 |
| calorie-calculator | 기초대사량·칼로리 계산기 |
| exercise-calories | 운동 칼로리 소모 계산기 |
| gpa-calculator | 학점·GPA 계산기 |
| typing-speed | 타자 속도 측정 |
| zodiac-finder | 띠·별자리 찾기 |
| random-picker | 랜덤 추첨기 |
| team-generator | 랜덤 팀 나누기 |
| dice-roller | 주사위·동전 던지기 |
| spinner-wheel | 돌림판 추첨 (룰렛) |
| ladder-game | 사다리타기 |
| lotto-generator | 로또 번호 생성 |

### 금융 (19)
| 슬러그 | 이름 |
|---|---|
| salary-calculator | 연봉 실수령액 계산기 |
| wage-calculator | 시급·주휴수당 계산기 |
| unemployment-benefit | 실업급여 계산기 |
| health-insurance | 건강보험료 계산기 |
| severance-pay | 퇴직금 계산기 |
| loan-calculator | 대출 이자 계산기 |
| savings-calculator | 적금·예금 이자 계산기 |
| dsr-calculator | DSR·DTI 계산기 |
| jeonse-conversion | 전월세 전환 계산기 |
| compound-interest | 복리 계산기 |
| stock-average | 물타기(평단가) 계산기 |
| stock-profit | 주식 수익률·손익 계산기 |
| dividend-calculator | 배당금 계산기 |
| target-price | 목표가·손절가 계산기 |
| car-tax | 자동차세 계산기 |
| acquisition-tax | 취득세 계산기 |
| vat-calculator | 부가가치세 계산기 |
| discount-calculator | 할인가 계산기 |
| installment-calculator | 할부 계산기 |

### 직장인 · 생산성 (8)
| 슬러그 | 이름 |
|---|---|
| notepad | 임시 메모장 |
| todo-list | 할 일 체크리스트 |
| pomodoro | 포모도로 타이머 |
| annual-leave | 연차 계산기 |
| work-hours | 근무시간 계산기 |
| signature-maker | 서명 만들기 (전자서명) |
| utm-builder | UTM 빌더 |
| device-test | 마이크·웹캠 테스트 |

### 색상 · 디자인 (15)
| 슬러그 | 이름 |
|---|---|
| color-picker | 컬러 피커·색상 변환 |
| hex-rgb-converter | HEX ↔ RGB 변환 |
| color-palette | 컬러 팔레트 생성 |
| color-shades | 색상 명암 생성기 |
| color-extractor | 이미지에서 색 추출 |
| gradient-generator | 그라데이션 생성기 |
| glassmorphism | 글래스모피즘 생성기 |
| box-shadow-generator | 그림자(box-shadow) 생성기 |
| text-shadow-generator | text-shadow 생성기 |
| border-radius-generator | 테두리 둥글기 생성기 |
| cubic-bezier | cubic-bezier 이징 생성기 |
| css-unit-converter | CSS 단위 변환 (px↔rem↔em) |
| contrast-checker | 색상 대비 검사 |
| color-blindness | 색맹·색약 시뮬레이터 |
| favicon-generator | 파비콘 생성 |

### 개발자 도구 (26)
| 슬러그 | 이름 |
|---|---|
| encoder-decoder | 인코더 · 디코더 |
| url-parser | URL 쿼리스트링 파서 |
| slug-generator | 슬러그(URL) 생성기 |
| case-style-converter | 개발 표기법 변환 |
| html-entities | HTML 엔티티 변환기 |
| hash-generator | Hash 생성 |
| jwt-decoder | JWT 디코더 |
| uuid-generator | UUID 생성 |
| luhn-validator | 신용카드 번호 검증 |
| base-converter | 진법 변환 |
| subnet-calculator | 서브넷 계산기 |
| chmod-calculator | chmod 권한 계산기 |
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
| ascii-table | 아스키 코드표·유니코드 변환 |
| unicode-escape | 유니코드 이스케이프 변환 |

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

- **허브**: `/guide/index.html` — 글 목록을 **주제별 9개 섹션**(`.sec-label` + 섹션별 `.guide-grid`)으로 묶어 표시: 이미지·사진 / PDF·문서 / 텍스트·생성 / 생활·편의 / 금융 / 직장인·생산성 / 색상·디자인 / 개발자 / 악기·음악(도구 카테고리와 같은 순서). 새 글 카드는 해당 주제 섹션의 `.guide-grid` 안에 추가. 상단에 클라이언트 검색 필터(`#guide-search`, 카드 텍스트로 필터링·빈 섹션 라벨 숨김) 있음. canonical `https://dogubox.shop/guide/`. JSON-LD는 `CollectionPage` + `BreadcrumbList`.
- **각 글**: `/guide/<슬러그>/index.html` — `tool-page.css` + **`guide.css`** + `theme.css` 참조. 본문은 `<article class="inner">` 안에 `<h1>` 1개 + `<section class="content">`(h2 소제목·표·`.callout`·`.tool-cta`·`.toc`·FAQ·관련 글). JSON-LD는 **Article + FAQPage + BreadcrumbList**(홈>가이드>글). FAQPage 질문·답변은 본문 FAQ와 글자 단위로 동일해야 함(단 본문 질문 앞의 `Q. ` 같은 시각적 라벨 접두사는 비교에서 제외 — 질문 텍스트 자체만 일치하면 됨).
- **도구로 연결**: 글마다 관련 도구로 가는 `.tool-cta` 카드(아이콘은 `data-icon`로 두면 `sidebar.js`가 채움)와 본문 내부 링크(`a.inlink`)를 넣습니다.
- **사이드바 노출**: `sidebar.js`의 `render()`가 즐겨찾기 그룹 다음에 **"가이드 · 사용법"** 링크(book-open 아이콘)를 자동 삽입 → 전 페이지(도구·허브)에서 노출. `/guide` 경로에서 active. (개별 페이지 수정 불필요)
- **허브(홈) 노출**: `index.html`에 "활용 가이드" 섹션(`.grid.guide-cards`)으로 6개 카드. **이 그리드는 도구 개수 카운트에서 제외**됩니다(홈 스크립트가 `.guide-cards` 부모를 가진 카드를 제외하고 셈). 푸터에도 `/guide/` 링크.
- **현재 글(162)**: `self-intro-character-count`(자기소개서 글자 수), `heic-to-jpg-guide`(HEIC→JPG), `reduce-image-size`(이미지 용량 줄이기), `merge-split-pdf`(PDF 합치기·분할), `make-qr-code`(QR코드 만들기), `strong-password`(안전한 비밀번호), `id-photo-size`(증명사진 규격), `remove-photo-location`(사진 EXIF 위치정보 제거), `pyeong-conversion`(평↔㎡ 변환), `unit-conversion`(단위 변환), `percentage-calculation`(퍼센트 계산법), `json-basics`(JSON 입문), `lunar-solar-conversion`(음력↔양력), `dday-calculation`(D-Day 계산), `hex-rgb-color-codes`(색상 코드 HEX·RGB·HSL), `markdown-syntax`(마크다운 문법), `bmi-calculation`(BMI 계산법), `age-calculation`(만 나이 계산법), `regex-basics`(정규식 입문), `timestamp-conversion`(유닉스 타임스탬프), `csv-json-conversion`(CSV·엑셀·JSON), `size-conversion`(옷·신발 사이즈), `base64-encoding`(Base64·URL 인코딩), `discount-calculation`(할인율 계산), `gpa-calculation`(학점·GPA 계산), `lotto-probability`(로또 확률), `timezone-difference`(시차 계산), `make-gif`(움짤 GIF 만들기), `extract-text-from-image`(사진 글자 추출 OCR), `zodiac-animal`(띠·별자리), `add-watermark`(워터마크 넣기), `what-is-jwt`(JWT 토큰), `pomodoro-technique`(포모도로 공부법), `what-is-hash`(해시·SHA-256), `utm-parameters`(UTM 파라미터), `number-base-conversion`(진법 변환), `electronic-signature`(전자서명), `cron-expression`(cron 표현식), `color-contrast-accessibility`(색상 대비·접근성), `text-comparison`(텍스트 비교 diff), `korean-romanization`(로마자 표기법), `what-is-favicon`(파비콘), `text-to-speech`(TTS 활용법), `barcode-types`(바코드 종류), `typing-speed-tips`(타자 속도), `what-is-lorem-ipsum`(로렘 입숨), `video-call-check`(화상 면접·회의 점검), `fair-random-draw`(공정한 추첨), `color-scheme-basics`(배색 기초), `make-meme`(밈·짤 만들기), `sql-formatting`(SQL 쿼리 정리), `markdown-table`(마크다운 표 만들기), `css-gradient`(CSS 그라데이션), `css-box-shadow`(box-shadow 그림자), `password-strength-check`(비밀번호 강도 점검), `study-timer`(순공시간·스톱워치 공부법), `http-error-codes`(404·500 에러 의미), `broken-text-encoding`(글자 깨짐·인코딩), `guitar-tuning`(기타 튜닝), `metronome-practice`(메트로놈 연습법), `piano-keys`(피아노 건반 기초), `what-is-uuid`(UUID란?), `json-vs-yaml`(JSON vs YAML), `read-qr-code`(사진 속 QR 읽기), `find-color-code`(색상 코드 따기), `korean-english-typo`(한/영 오타 원리), `korean-money-notation`(금액 한글 표기), `type-special-characters`(특수문자 입력법), `compress-pdf`(PDF 용량 줄이기), `photo-adjust-basics`(사진 보정 기초), `photos-to-pdf`(사진→PDF 제출), `photo-collage`(사진 콜라주), `clean-text-list`(목록 정리 워크플로), `make-beat`(비트 만들기 입문), `speech-script-length`(발표 대본 분량), `fancy-nickname`(꾸미기 글자 원리), `extract-from-pdf`(PDF에서 글자·이미지 꺼내기), `browser-instruments`(브라우저 악기 둘러보기), `crop-aspect-ratio`(사진 비율 자르기), `voice-recording`(음성 녹음 요령), `blur-personal-info`(개인정보 모자이크), `photo-rotation-fix`(사진 회전 문제), `image-formats`(JPG·PNG·WebP 선택), `organize-pdf-pages`(PDF 페이지 정리), `watermark-pdf`(PDF 워터마크), `bw-sepia-filter`(흑백·세피아 활용), `browser-notepad`(브라우저 메모장), `image-data-uri`(Base64 데이터 URI), `regex-patterns`(정규식 패턴 모음), `finger-drumming`(손가락 드럼 입문), `kalimba-basics`(칼림바 입문), `launchpad-loops`(런치패드 입문), `synth-basics`(신디사이저 기초), `what-is-theremin`(테레민이란?), `harp-glissando`(하프 글리산도), `gayageum-basics`(가야금 이야기), `xylophone-play`(실로폰 음악놀이), `handpan-relax`(핸드팬이란?), `write-readme`(README 잘 쓰기), `json-to-types-guide`(JSON에서 타입 만들기), `naming-conventions`(개발 표기법), `line-endings`(LF·CRLF 줄바꿈), `percent-vs-percentpoint`(%와 %p), `what-is-xml`(XML이란?), `manuscript-paper`(원고지 매수), `html-table-basics`(HTML 표 기초), `wifi-qr-code`(와이파이 QR), `scientific-calculator`(공학용 계산기), `find-and-replace`(찾기·바꾸기), `wallpaper-resolution`(배경화면 해상도), `css-units`(px·rem·em 차이), `colorblind-design`(색맹·색약과 디자인), `css-easing`(이징 곡선 입문), `css-border-radius`(둥근 모서리 디자인), `passport-english-name`(여권 영문 이름), `cooking-measurements`(요리 계량 환산), `aspect-ratio`(화면 비율 계산), `photo-print-size`(사진 인화 사이즈), `internet-speed-units`(Mbps vs MB/s), `a4-paper-size`(A4 픽셀·dpi), `csv-excel-encoding`(CSV 한글 깨짐), `apartment-area-types`(아파트 면적 용어), `audio-file-formats`(MP3·WAV·M4A), `photo-storage-size`(사진 용량 계산), `qr-not-scanning`(QR 인식 실패), `ladder-game-fairness`(사다리타기 확률), `insurance-age`(보험 나이·상령일), `what-is-passkey`(패스키란?), `double-discount`(중복할인의 함정), `week-number`(주차 계산법), `byte-vs-character`(글자 수 vs 바이트), `rounding-methods`(반올림·올림·버림), `food-expiration-dates`(유통기한 vs 소비기한), `volumetric-weight`(택배 부피무게), `installment-fees`(할부 수수료), `monitor-inches`(모니터 인치), `screenshot-basics`(스크린샷 찍기), `wifi-bands`(와이파이 2.4 vs 5GHz), `leap-year-month`(윤년 vs 윤달), `fahrenheit-celsius`(화씨 온도), `streaming-data-usage`(스트리밍 데이터), `solar-terms-24`(24절기), `raw-vs-jpg`(RAW vs JPG), `fullwidth-halfwidth`(전각·반각 문자), `usb-versions`(USB 속도), `korean-keyboard-layouts`(두벌식·세벌식), `messenger-photo-quality`(카톡 사진 화질), `emoji-not-showing`(이모지 두부 현상), `print-to-pdf`(PDF로 저장), `legal-ages`(법정 나이 기준), `take-home-pay`(연봉 실수령액 계산법), `loan-repayment-methods`(대출 상환 방식), `upside-down-text`(거꾸로 글자 원리), `url-structure`(URL 구조), `savings-interest`(적금·예금 이자 계산법), `compound-effect`(복리의 힘·72 법칙), `what-is-vat`(부가가치세란), `severance-pay-guide`(퇴직금 계산법), `stock-averaging-down`(물타기·평단가), `stock-tax-fees`(주식 수수료·세금), `dividend-investing`(배당 투자 기초), `stop-loss-take-profit`(손절·익절 원칙).
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
- **푸터**: `/guide/`(가이드) · `/about.html`(소개) · `/about.html#faq`(자주 묻는 질문) · `/about.html#contact`(문의) · `/privacy.html`(개인정보처리방침) · `/terms.html`(이용약관)

### 본문 콘텐츠
- 기능 UI(`.box` 등) 아래에 한국어 콘텐츠 섹션(`.content`):
  - **사용법** (`.steps-list`, 순서 단계)
  - **활용 팁** (`.tips-list`)
  - **자주 묻는 질문 / FAQ** (`.faq-list` > `.qa`)
- `<script src="/theme.js"></script>` 로 다크모드 토글 로직 로드

## 5-1. 작업대(워크벤치) — 도구 1~5칸 동시 사용

> **목적**: 사용자가 도구 하나만 쓰는 게 아니라 **여러 개를 동시에** 쓰고 싶을 때(예: 글자수 세기 + 컬러 피커). 홈 화면 위에 **떠 있는 창**을 띄워 도구를 나란히 놓는다. **새 페이지로 이동하지 않는다.**

- **진입점**: 홈(`index.html`) 상단바의 `#workbenchToggle`(`.wb-btn`, "작업대") 버튼 — **홈에서만 노출**. 누르면 `workbench.js`가 `.wb-overlay`(z-index 200)를 띄운다(Esc·"닫기"·스크림 클릭으로 종료).
- **떠 있는 창 구조**: `.wb-overlay`는 **딤+블러 스크림**(뒤 홈이 비침), 그 안의 `.wb-window`가 **둥근 모서리·그림자를 가진 플로팅 창**(종이 노이즈 텍스처 + 상단 액센트 글로우). 창은 `.wb-bar`(상단바) + `.wb-row`(분할 영역)로 구성.
- **분할 수(1~5) 선택**: 상단바의 `.wb-layout` 세그먼트(1·2·3·4·5)로 칸 수를 직접 지정한다(`setPaneCount`). 늘리면 빈 칸 추가, 줄이면 끝 칸부터 제거(기존 칸 유지). `MAX_PANES=5`. 칸 사이 `.wb-divider`는 드래그로 너비 조절(모바일은 세로 적층·드래그 비활성).
- **칸 구조**: 각 칸(`.wb-pane`)은 상단에 **검색 피커 버튼**(`.wb-picker` — 아이콘 칩 + 도구명) + **이동 그립**(`.wb-grip`) + 새 탭 링크 + 칸 닫기, 아래에 도구를 띄우는 `<iframe>`.
- **검색 가능한 도구 피커**: 피커 버튼을 누르면 `body`에 붙는 싱글턴 팝오버 `.wb-pop`(검색 입력 + 카테고리별 도구 목록)이 버튼 아래에 뜬다. 입력하면 이름·슬러그로 즉시 필터(`filterPop`), 클릭/Enter로 선택. 도구가 많아져도 스크롤 대신 검색으로 빠르게 고른다.
- **도구 끌어 옮기기(드래그&드롭) — 입력 상태 보존**: 칸 헤더의 `.wb-grip`을 잡아 끌면, 커서 위로 살짝 떠오른 고스트(`.wb-drag-ghost`)가 따라오고 출발 칸은 흐려진다(`.wb-drag-source`). 마우스가 올라간 대상 칸에 **"여기에 놓기"** 힌트(`.wb-drop-hint` + `.wb-drop-target` 점선)가 뜨고, 놓으면 두 칸의 **시각 위치를 맞바꾼다**(대상이 비었으면 이동). 드래그 중 `body.wb-tool-dragging`이 iframe 포인터를 꺼 대상 칸 감지를 가능하게 한다.
- **★ 레이아웃 모델(입력 보존의 핵심)**: 칸의 배치는 **DOM 순서가 아니라 flex `order`** 로만 바꾼다. `vorder`(칸의 시각 좌→우 순서 배열)가 source of truth이고, `relayout()`이 각 칸에 `order`를, 칸 사이 분할 손잡이(`.wb-divider`, `(칸-1)`개 재사용 풀)에 그 사이 `order`를 부여한다. 도구를 옮길 때(`movePane`)는 `vorder`의 두 항목만 swap하고 `order`만 다시 매긴다 → **iframe을 DOM에서 이동(reparent)하지 않으므로 새로고침되지 않아 양쪽 도구의 입력 상태가 모두 보존**된다(브라우저는 iframe을 reparent하면 무조건 reload함). 위치 이동은 FLIP 트랜지션으로 부드럽게. 분할 손잡이 너비조절도 DOM 형제가 아니라 `vorder` 기준 양옆 칸을 조절한다.
- **빈 칸 런처**: 도구 미선택 칸(`.wb-empty`)은 "자주 쓰는 도구" 칩(`.wb-chip`)을 보여줘 바로 시작하게 한다. 칩 목록은 `workbench.js`의 `SUGGESTED`(슬러그 배열) 큐레이션, 이름·아이콘은 `DGB_TOOLS`에서 조회.
- **임베드 모드(핵심)**: iframe은 도구를 **`/<슬러그>/?embed=1`** 로 로드한다. 그러면 `theme.js`가 `<html>`에 `.embed` 클래스를 붙이고, `theme.css`의 `html.embed` 규칙이 **상단바·사이드바·푸터·`.crumb`·`.lede`·`.content`·`h1`·광고를 숨겨** 순수 도구 UI(`.box`)만 남긴다 → "설명 없이 순수 도구만". **별도 페이지 작업이 필요 없다.**
- **프레임버스터 주의**: `theme.js`의 클릭재킹 방어는 **같은 출처(우리 작업대 iframe)면 탈출하지 않도록** 되어 있다(외부 사이트 프레임만 탈출). 이 동작을 깨면 작업대 iframe이 통째로 튕겨 나가므로 수정 시 주의.
- **도구 목록 단일 출처**: 피커는 `sidebar.js`가 노출하는 `window.DGB_TOOLS`(= `CATEGORIES`)를 그대로 쓴다 → **새 도구를 추가하면 작업대 피커에도 자동 반영**된다. 단, 그 도구 페이지가 표준 구조(`.box` 기능 UI + `.lede`/`.content` 설명, `theme.js` 로드)를 따라야 임베드 모드가 크롬을 깔끔히 걷어낸다.
- **다듬기(frontend-design 적용)**: 등장은 스크림 페이드 + 창 팝인 + 칸 스태거 상승으로 오케스트레이션, "밤의 종이" 무드·`#df4324` 액센트 안에서 라이트/다크 동일 동작. (`prefers-reduced-motion`은 홈 인라인 규칙이 전역 처리)
- **로드 위치**: `index.html`만 `<link rel="stylesheet" href="/workbench.css">`(head) + `<script src="/workbench.js">`(sidebar.js 다음, theme.js 앞)를 포함한다. 다른 페이지는 포함하지 않는다.
- **애널리틱스**: 작업대 iframe(`?embed=1`)으로 열린 도구는 GA4 페이지뷰로 집계하지 않고 `analytics.js`가 `workbench_tool_open`(tool_slug) 이벤트로만 기록한다 → 실제 방문 통계는 부풀지 않고, 작업대 사용량은 따로 추적된다.

## 6. 새 도구 추가 시 체크리스트

새 도구 `<슬러그>`를 추가할 때 아래를 **모두** 수행합니다:

1. **`/<슬러그>/index.html` 생성** — 기존 도구 페이지와 동일한 패턴(head · 상단바 · 푸터 · 디자인). `/tool-page.css` 참조 패턴 권장. **사이드바는 직접 작성하지 말고** 빈 컨테이너 `<aside class="side" id="sidebar"><noscript><a class="navlink" href="/"><span class="ic">←</span> 모든 도구</a></noscript></aside>` 만 두고, 본문 끝(`theme.js` 앞)에 `<script src="/sidebar.js"></script>`를 추가합니다. `theme.js` 다음 줄에는 `<script src="/analytics.js" defer></script>`도 추가합니다(전 페이지 공통).
   - **★ 표준 문서 구조(SEO)**: 파일 맨 첫 줄 `<!DOCTYPE html>`, 그다음 `<html lang="ko">`로 시작해 맨 끝을 `</html>`로 닫습니다. `<head>`에 `<link rel="canonical" href="https://dogubox.shop/<슬러그>/">`를 넣고, 페이지 **대표 제목은 `<h1>` 한 개**만 둡니다(콘텐츠 섹션 라벨은 `<div class="sec-label">` 유지 — h1/h2로 만들지 않음). h1 스타일은 `tool-page.css`의 `h1,h2{…}` 규칙이 담당합니다. (명시적 `<head>`·`<body>` 태그는 필수가 아닙니다 — meta·title·link를 `<html>` 바로 아래에 두면 브라우저가 자동으로 `<head>`/`<body>`를 보정하므로 기능·SEO 영향이 없습니다. 기존 페이지의 태그 생략 패턴도 정상으로 간주하며 별도 수정 대상이 아닙니다.)
2. **외부 라이브러리** — 그 도구에 꼭 필요한 라이브러리만 `<head>`에 추가.
3. **★ 사이드바 = `sidebar.js` 데이터에 한 줄 추가** — `sidebar.js`의 `CATEGORIES`에서 알맞은 카테고리의 `tools` 배열에 `{ slug, name, icon }` 한 줄만 추가하면 **전 페이지 사이드바와 active 처리가 자동 반영**됩니다. (더 이상 개별 페이지 사이드바를 수정하지 않습니다.) **아이콘은 Lucide 인라인 SVG로 통일**되어 있습니다 — `icon` 값은 `sidebar.js`의 `ICONS` 매핑에 있는 Lucide 아이콘 이름(예: `"crop"`)을 쓰고, 새 아이콘이 필요하면 `ICONS`에 해당 Lucide SVG의 inner path를 추가합니다(`stroke="currentColor"`라 다크모드 자동 대응, 외부 CDN·SRI 불필요).
4. **허브 카드 추가** — `index.html`의 해당 카테고리 카드 그리드(`.grid`)에 새 카드 추가. 아이콘은 이모지 대신 `<div class="ic" data-icon="<Lucide이름>">`로 두면 `sidebar.js`가 같은 `ICONS` 매핑으로 채웁니다(사이드바와 허브가 단일 아이콘 세트 공유).
5. **`sitemap.xml`** — `<url><loc>https://dogubox.shop/<슬러그>/</loc><lastmod>오늘 날짜</lastmod></url>` 추가.
6. **콘텐츠 섹션** — 사용법(3~5단계) / 활용 팁(2~3개, 도구별 고유) / FAQ(3개). 한국어, 도구별 고유 내용, 합계 약 250~400단어. 고유 `<title>`·`<meta description>`.
7. **★ JSON-LD 구조화 데이터(SEO)** — `<head>`에 `<script type="application/ld+json">` 블록으로 **SoftwareApplication + FAQPage + BreadcrumbList**(홈 > 도구명) 3개를 추가합니다(화면 표시 없음, 검색 리치 스니펫용). 모든 값은 그 페이지의 **실제 내용과 일치**해야 합니다 — `name`=h1 도구명, `description`=meta description, `url`=canonical, `applicationCategory`=카테고리에 맞는 값(이미지·PDF→`MultimediaApplication`, 텍스트/생활·편의→`UtilityApplication`, 색상·디자인→`DesignApplication`, 금융→`FinanceApplication`, 직장인·생산성→`BusinessApplication`, 개발자→`DeveloperApplication`), `operatingSystem`="Web", `inLanguage`="ko", `offers`(price 0, KRW), `provider`(도구상자, https://dogubox.shop/). **FAQPage의 질문·답변은 페이지 본문 FAQ와 글자 단위로 동일**해야 합니다(페이지에 없는 FAQ를 넣으면 구글 정책 위반 — 단 본문 질문 앞의 `Q. ` 같은 시각적 라벨 접두사는 제외하고 질문 텍스트 자체만 일치하면 됨). 허브(`index.html`)는 `WebSite`(검색이 클라이언트 필터라 `SearchAction`은 넣지 않음)만 둡니다. 구글 Rich Results Test로 검증.
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

## 9. 운영 현황 (2026-06-13 기준 — 상태 바뀌면 이 표를 갱신할 것)

| 채널 | 상태 | 다음 액션 |
|---|---|---|
| **애드센스** | 검토 요청 제출됨 — **심사 진행 중** | 결과 대기. **승인 시 → 아래 10번 footer.js 빅스윕 진행**, 거절 시 → 사유 분석부터 |
| 구글 Search Console | sitemap(270 URL) 제출됨, 색인 요청 1차분 8개 완료 | 2차분은 `double-discount`부터 (하루 한도 ~10개). 색인 추이 주 1회 확인 |
| 네이버 서치어드바이저 | 등록 완료 — 소유 확인(홈 head 메타) + sitemap 제출 + 홈·가이드 허브 수집 요청 | 며칠 뒤 "검증 → 사이트 최적화" 리포트 확인 |
| GA4 | 활성화됨 — 측정 ID `G-EQH5P4E001`, `/analytics.js` 한 곳에서 관리 | 데이터 1주 쌓이면 인기 콘텐츠 기반으로 다음 방향 결정 |

## 10. 향후 작업 (보류 중)

- **도구 폴더를 루트 → `tools/` 하위로 이전 예정**(예: `/qr-code/` → `/tools/qr-code/`). **단, (1) AdSense 승인 완료 + (2) 구글 색인이 어느 정도 안정화된 이후에만 진행.** URL이 전부 바뀌는 작업이므로 이전 시 반드시 함께 처리: ① 기존 URL→새 URL **301 리다이렉트** 설정, ② `sitemap.xml`의 전 URL 갱신, ③ 각 페이지 **canonical·JSON-LD(`url`·`BreadcrumbList`)** 갱신, ④ `sidebar.js`·허브 카드 링크 갱신, ⑤ 서치 콘솔에 **새 sitemap 재제출**. **색인/심사 안정화 전에는 절대 진행 금지.**
- **푸터 공통화(`footer.js`) — AdSense 승인 후 진행하기로 사용자와 합의(2026-06-12).** `sidebar.js`와 같은 패턴으로: 공통 스크립트가 푸터를 그리고, 각 페이지에는 빈 `<footer>` 컨테이너 + `<noscript>` 폴백(최소한 홈·개인정보처리방침 링크)만 남김. 전 페이지(270+) 1회 스윕 필요 — 푸터 형식이 2종(가이드형 여러 줄 / 구형 도구 인라인 체인)이므로 각각 패턴 매치로 치환. 이후 푸터 수정은 footer.js 한 곳에서. (전면 OOP 레이어링·빌드 도구 도입은 하지 않기로 함 — 정적 사이트 원칙 유지.) 같은 스윕에 함께 처리할 잔여 항목: ① 구형 페이지 인라인 `<style>` → `/tool-page.css` 참조로 통합, ② 일부 페이지의 `<meta http-equiv="Content-Security-Policy" content="frame-ancestors...">` 제거(meta로 전달된 frame-ancestors는 브라우저가 무시 — 콘솔 경고만 발생), ③ `<head>`에 AdSense 도메인 preconnect 추가 검토.
- **디자인 구조 개선 — 디자인 리뷰 후속(사용자가 시안 확인 후 AdSense 승인 전이라도 ②③ 적용 결정, 2026-06-13).** **적용 완료**: 아이콘 칩 배경·텍스트 대비(f96f498), 본문 줄글 폭 제한 해제(3034aea), 홈 카드 그리드 1320px 5열 확장 + 히어로 정렬(972b895), 홈 카테고리 섹션 헤더 강화+개수 배지(ee5ac3c), **② 도구 박스(.box) 상단 액센트 스트립+그림자 강조 / ③ 사용법 액센트 번호 원·팁 인라인 마커·FAQ만 테두리 카드(8c85ed5)** — tool-page.css·theme.css + 가이드 98편 steps-list 인라인 `list-style:decimal` 제거(번호 통일) + 구형 인라인 도구 20개 v2 CSS 주입. ★주의: `.steps-list`는 이제 CSS 카운터(`::before`)로 번호를 그림 → **steps 항목에 수동 번호(①②③)나 인라인 `list-style` 넣지 말 것**(중복됨). 새 도구/가이드도 이 규칙을 따름. **남은 잔여 항목**(footer.js 빅스윕 때): 홈 상단 "인기 도구" 6개 피처링 행, 카테고리별 아이콘 색조 차별화.
