# 도구상자 (dogubox)

> 설치 없이 브라우저에서 바로 쓰는 무료 온라인 도구 모음

🔗 **https://dogubox.shop**

**도구상자**는 이미지·PDF 변환, 텍스트 처리, 색상 도구, 개발자 유틸리티 등 일상과 업무에 필요한 도구들을 한곳에 모은 무료 웹사이트입니다. 모든 처리는 사용자의 브라우저 안에서만 이루어집니다.

## 주요 특징

- **무료** — 모든 도구를 비용 없이 사용
- **설치 없음** — 웹 브라우저만 있으면 바로 사용
- **브라우저에서 처리** — 모든 기능이 클라이언트 사이드(브라우저 JavaScript)로 동작
- **파일이 서버로 전송되지 않음** — 업로드/입력한 이미지·문서·텍스트는 외부 서버로 보내지 않고 브라우저 안에서만 처리되어 개인정보에 안전
- **독립 URL** — 각 도구가 고유 주소를 가져 바로 접근·공유 가능

## 도구 목록

### 이미지 · PDF
- 이미지 포맷 변환 (`/image-converter/`)
- 이미지 압축·리사이즈 (`/image-compressor/`)
- 이미지 크기 조절 (`/image-resizer/`)
- 이미지 자르기 (`/image-crop/`)
- 증명사진 규격 맞추기 (`/id-photo/`)
- EXIF·위치정보 제거 (`/remove-exif/`)
- PDF 용량 줄이기 (`/pdf-compressor/`)
- PDF 합치기 (`/pdf-merge/`)
- 이미지 → PDF (`/image-to-pdf/`)
- PDF → 이미지 (`/pdf-to-image/`)
- PDF 페이지 분할 (`/pdf-split/`)

### 텍스트 · 생성
- 글자수 세기 (`/word-counter/`)
- 공백·줄바꿈 정리 (`/clean-text/`)
- QR코드 생성 (`/qr-code/`)
- 비밀번호 생성 (`/password-generator/`)
- JSON 포매터 (`/json-formatter/`)

### 색상 · 디자인
- HEX ↔ RGB 변환 (`/hex-rgb-converter/`)
- 컬러 팔레트 생성 (`/color-palette/`)
- 파비콘 생성 (`/favicon-generator/`)

### 생활 · 편의
- D-Day · 날짜 계산 (`/dday-calculator/`)
- 로또 번호 생성 (`/lotto-generator/`)

### 직장인 · 생산성
- 임시 메모장 (`/notepad/`)
- UTM 빌더 (`/utm-builder/`)

### 개발자 도구
- 인코더 · 디코더 (`/encoder-decoder/`)
- JWT 디코더 (`/jwt-decoder/`)
- UUID 생성 (`/uuid-generator/`)
- Hash 생성 (`/hash-generator/`)
- JSON → Java DTO (`/json-to-java-dto/`)

## 기술 스택

- **순수 정적 웹사이트** — HTML / CSS / JavaScript만 사용 (빌드 도구·프레임워크 없음)
- **호스팅** — GitHub Pages + 커스텀 도메인(`dogubox.shop`)
- **구조** — 각 도구는 `/<슬러그>/index.html` 독립 페이지, 루트 `index.html`은 도구를 모아 보여주는 허브
- 공통 스타일(`tool-page.css`)과 다크모드(`theme.css`, `theme.js`)를 모든 페이지가 공유

## 로컬 실행 방법

빌드 과정이 없으므로 정적 파일을 서빙하기만 하면 됩니다. 페이지가 절대경로(`/tool-page.css` 등)를 사용하므로 `file://`로 직접 열지 말고 로컬 서버를 띄워 주세요.

```bash
# 저장소 루트에서
python -m http.server 8000
# 또는
npx serve .
```

브라우저에서 `http://localhost:8000/` (허브) 또는 `http://localhost:8000/word-counter/` 처럼 개별 도구에 접속해 확인합니다.

## 라이선스 / 문의

- 문의: 사이트 내 [문의 섹션](https://dogubox.shop/#contact)
- 개인정보처리방침: https://dogubox.shop/privacy.html
