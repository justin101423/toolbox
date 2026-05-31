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
4. **커밋/푸시 금지**: `git commit` / `git push`는 항상 사용자가 직접 합니다. Claude Code는 하지 않습니다. 작업 후 변경 파일 목록만 보고합니다.

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
├── theme.css           # 다크모드 스타일
├── theme.js            # 다크모드 토글 로직 (#darkModeToggle 버튼 제어)
└── <슬러그>/index.html  # 각 도구 = 독립 페이지(독립 URL, SEO 목적)
```

- 각 도구는 `/<슬러그>/index.html` 형태의 독립 페이지입니다. 독립 URL을 가져 SEO에 유리합니다(예: `https://dogubox.shop/word-counter/`).
- 빌드 도구·번들러·패키지 매니저가 없습니다. 순수 HTML/CSS/JS이며 푸시 즉시 반영됩니다.

## 4. 현재 존재하는 모든 도구 목록

> **총 27개** (실제 도구 폴더 수와 일치해야 함). 도구를 추가/삭제/이름변경하면 이 표를 반드시 갱신하세요.

### 이미지 · PDF (10)
| 슬러그 | 이름 |
|---|---|
| image-converter | 이미지 포맷 변환 |
| image-compressor | 이미지 압축·리사이즈 |
| image-resizer | 이미지 크기 조절 |
| id-photo | 증명사진 규격 맞추기 |
| remove-exif | EXIF·위치정보 제거 |
| pdf-compressor | PDF 용량 줄이기 |
| pdf-merge | PDF 합치기 |
| image-to-pdf | 이미지 → PDF |
| pdf-to-image | PDF → 이미지 |
| pdf-split | PDF 페이지 분할 |

### 텍스트 · 생성 (5)
| 슬러그 | 이름 |
|---|---|
| word-counter | 글자수 세기 |
| clean-text | 공백·줄바꿈 정리 |
| qr-code | QR코드 생성 |
| password-generator | 비밀번호 생성 |
| json-formatter | JSON 포매터 |

### 색상 · 디자인 (3)
| 슬러그 | 이름 |
|---|---|
| hex-rgb-converter | HEX ↔ RGB 변환 |
| color-palette | 컬러 팔레트 생성 |
| favicon-generator | 파비콘 생성 |

### 생활 · 편의 (2)
| 슬러그 | 이름 |
|---|---|
| dday-calculator | D-Day · 날짜 계산 |
| lotto-generator | 로또 번호 생성 |

### 직장인 · 생산성 (2)
| 슬러그 | 이름 |
|---|---|
| notepad | 임시 메모장 |
| utm-builder | UTM 빌더 |

### 개발자 도구 (5)
| 슬러그 | 이름 |
|---|---|
| encoder-decoder | 인코더 · 디코더 |
| jwt-decoder | JWT 디코더 |
| uuid-generator | UUID 생성 |
| hash-generator | Hash 생성 |
| json-to-java-dto | JSON → Java DTO |

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
- **좌측 사이드바(.side)**: 카테고리(`이미지·PDF / 텍스트·생성 / 색상·디자인 / 생활·편의 / 직장인·생산성 / 개발자 도구`)별로 **전체 도구 링크**를 나열. 모든 페이지가 동일한 사이드바를 가집니다. **현재 보고 있는 페이지의 링크는 `class="navlink active"`** 로 표시
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

1. **`/<슬러그>/index.html` 생성** — 기존 도구 페이지와 동일한 패턴(head · 상단바 · 사이드바 · 푸터 · 디자인). `/tool-page.css` 참조 패턴 권장.
2. **외부 라이브러리** — 그 도구에 꼭 필요한 라이브러리만 `<head>`에 추가.
3. **★ 사이드바 링크 추가(누락 주의)** — **모든 기존 도구 페이지 + 허브 `index.html`**의 사이드바에 새 도구 링크를 빠짐없이 추가. 알맞은 카테고리 그룹에 배치하고, 각 페이지에서 현재 페이지에만 `active`. (페이지가 많으므로 스크립트로 일괄 삽입 후 개수 검증 권장)
4. **허브 카드 추가** — `index.html`의 해당 카테고리 카드 그리드(`.grid`)에 새 카드 추가.
5. **`sitemap.xml`** — `<url><loc>https://dogubox.shop/<슬러그>/</loc><lastmod>오늘 날짜</lastmod></url>` 추가.
6. **콘텐츠 섹션** — 사용법(3~5단계) / 활용 팁(2~3개, 도구별 고유) / FAQ(3개). 한국어, 도구별 고유 내용, 합계 약 250~400단어. 고유 `<title>`·`<meta description>`.
7. **다크모드/모바일 반응형 확인** — `theme.css`/`theme.js` 연동, 좁은 화면에서 사이드바 토글 동작 확인.
8. **★ 문서 갱신** — 이 CLAUDE.md의 도구 목록(4번 섹션)에 새 도구를 추가하고, `README.md`의 도구 목록도 갱신.
9. **커밋/푸시는 사용자가 직접** — Claude Code는 푸시하지 않음.

> 검증 팁: 변경 후 `/<슬러그>/` 링크가 (도구 페이지 수)×1 + 허브 2(사이드바+카드) + sitemap 1 개수와 맞는지 확인하면 사이드바 누락을 잡을 수 있습니다.

## 7. 이 문서(CLAUDE.md)를 최신으로 유지하는 규칙

**이 문서는 항상 실제 코드 상태와 일치해야 합니다.** 다음을 반드시 지킵니다:

- 도구를 **추가/삭제/이름변경**할 때마다 이 문서의 도구 목록(4번 섹션)과 `README.md`의 도구 목록을 **함께** 갱신합니다(총 개수와 카테고리 분류 포함).
- 새 **규칙·구조 변경·새 공통 파일**이 생기면 관련 섹션(핵심 규칙, 파일 구조, 공통 구조 등)도 함께 갱신합니다.
- 즉, **어떤 작업으로 이 문서의 내용과 실제 코드가 달라지게 되면, 같은 작업 안에서 이 문서도 수정**해 항상 실제 상태와 일치시킵니다. 문서 갱신은 별도 작업이 아니라 해당 작업의 일부입니다.

## 8. 톤 / 언어

- 사이트 UI·콘텐츠는 **한국어**. 친절하고 간결하게.
- 도구 설명·FAQ는 실제 사용 맥락(자기소개서 글자 수, 엑셀 붙여넣기 정리, 인쇄용 QR 등)을 담아 구체적으로.
