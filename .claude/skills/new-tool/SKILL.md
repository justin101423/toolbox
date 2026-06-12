---
name: new-tool
description: 도구상자에 새 도구 페이지를 추가한다 — CLAUDE.md 6번 체크리스트(페이지·sidebar.js·허브 카드·sitemap·JSON-LD·문서 갱신·커밋) 전체를 수행. 인자로 도구 이름/슬러그를 받는다.
---

# /new-tool — 새 도구 추가 전 절차

인자(`$ARGUMENTS`)로 받은 도구를 추가한다. 인자가 없으면 클라이언트 사이드로 구현 가능한(서버·API 불필요) 도구 후보 3개를 검색 수요와 함께 제안하고 사용자가 고르게 한다.

## 핵심 원칙 (CLAUDE.md 2번)

- **100% 클라이언트 사이드** — 서버·DB·외부 API 필요한 기능 금지. 파일·입력은 브라우저 안에서만 처리.
- AdSense 스크립트(`ca-pub-6448118773813567`) 필수 포함.
- 외부 라이브러리는 꼭 필요한 것만, **SRI(integrity+crossorigin) 필수** — cdnjs/jsdelivr에서 해시 확인.

## 절차 (CLAUDE.md 6번 체크리스트 — 모두 수행)

1. `/<슬러그>/index.html` 생성 — 최신 패턴 도구(예: `css-unit-converter/`)를 Read해서 골격을 따른다: `/tool-page.css` 참조, 사이드바는 빈 컨테이너+noscript만, canonical, h1 1개, 도구별 인라인 `<style>`은 도구 고유 UI만.
2. 본문 끝 스크립트 순서: 도구 로직 → `<script src="/sidebar.js">` → `<script src="/theme.js">` → `<script src="/analytics.js" defer>`.
3. **sidebar.js**: `CATEGORIES`의 알맞은 카테고리·그룹 위치에 `{ slug, name, icon }` 한 줄 추가 (정렬 규칙: 비슷한 기능끼리, 자주 쓰는 것 앞쪽 — CLAUDE.md 4번). 아이콘은 `ICONS`의 Lucide 이름, 없으면 inner path 추가.
4. **허브 카드**: `index.html`의 해당 카테고리 `.grid`에 같은 순서 위치로 카드 추가 (`<div class="ic" data-icon="...">`).
5. **sitemap.xml**: 도구 URL 추가 (가이드 블록 앞, 다른 도구들 사이).
6. **콘텐츠 섹션**: 사용법(3~5단계)/활용 팁(2~3)/FAQ(3) — 한국어, 도구 고유 내용 250~400단어.
7. **JSON-LD 3종**: SoftwareApplication(applicationCategory는 카테고리 매핑 — CLAUDE.md 6-7 참고) + FAQPage(본문과 글자 일치) + BreadcrumbList.
8. **문서 갱신**: CLAUDE.md 4번 표(총 개수 +1, 해당 카테고리 표)와 README.md 도구 목록 — sidebar·허브·CLAUDE.md·README 4곳의 순서가 동일해야 함.
9. **검증**: 다크모드 변수 사용 여부, 내부 링크 실존, 사이드바 링크 수 = 도구 폴더 수 = 허브 카드 수 = sitemap 도구 URL 수.
10. **보호 파일 점검 후 커밋·푸시** — 커밋 메시지 예: "OO 도구 추가".

가이드 1편을 함께 만들면 좋다(도구↔가이드 양방향 연결 관례) — 원하면 /new-guide로 이어서.
