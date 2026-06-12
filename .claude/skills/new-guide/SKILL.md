---
name: new-guide
description: 도구상자 가이드 글 신규 작성 — 글 작성부터 허브 카드·sitemap·문서·역링크·검증·커밋까지 전 절차를 수행한다. 인자로 주제(슬러그 제안 포함 가능)를 받는다.
---

# /new-guide — 가이드 글 추가 전 절차

인자(`$ARGUMENTS`)로 받은 주제로 가이드 글 1편을 추가한다. 인자가 없으면 먼저 검색 수요가 있고 기존 도구와 연결되는 주제 후보 3개를 제안하고 사용자가 고르게 한다.

## 작성 규칙 (요약 — 상세는 CLAUDE.md 4-1)

- 경로: `/guide/<슬러그>/index.html`, 슬러그는 영문 케밥케이스.
- **템플릿**: 최근 가이드(예: `guide/legal-ages/index.html`)를 Read해서 골격을 그대로 따른다 — head(고유 title·description·canonical·og/twitter), JSON-LD 3종(Article + FAQPage + BreadcrumbList), AdSense 스크립트, tool-page.css + guide.css + theme.css, topbar/사이드바 빈 컨테이너, `<article class="inner">` 안에 h1 1개 + `.article-meta`(가이드 · 약 N분 · 오늘 날짜) + `.toc` + 본문(h2 섹션 3~4개, 표/콜아웃 적극 활용) + `.tool-cta`(관련 도구, `data-icon`은 sidebar.js ICONS의 Lucide 이름) + FAQ 3개 + "함께 보면 좋은 가이드" rel-grid 2장.
- **★ FAQPage JSON-LD의 질문·답변은 본문 `.qa`와 글자 단위로 동일**해야 한다(이스케이프된 태그 포함). datePublished/dateModified는 오늘 날짜.
- 푸터에는 가이드/소개/자주 묻는 질문/개인정보처리방침/**이용약관** 링크 포함 (최근 가이드 푸터 그대로).
- 본문 끝에 `<script src="/sidebar.js">`, `<script src="/theme.js">`, `<script src="/analytics.js" defer>` 순서.

## 절차 (모두 수행)

1. 도구 연계 확인 — CTA로 보낼 도구의 슬러그·아이콘을 `sidebar.js`에서 확인.
2. 글 작성 (위 규칙).
3. **허브 카드**: `guide/index.html`의 해당 주제 섹션(8섹션 중 알맞은 곳) `.guide-grid` 끝에 카드 추가 (`gi-cat`은 기존 표기 관례 따름).
4. **sitemap.xml**: privacy.html 항목 직전에 `<url><loc>.../guide/<슬러그>/</loc><lastmod>오늘</lastmod></url>` 추가.
5. **CLAUDE.md** 4-1: "현재 글(N)" 카운트 +1, 목록 끝에 `슬러그`(짧은 설명) 추가.
6. **README.md**: 가이드 목록 끝에 한 줄 추가.
7. **도구 역링크**: CTA 대상 도구 페이지의 "함께 보면 좋은 가이드" rel-grid에 새 글 카드 추가 (카드 4개 이하 유지; 이미 많으면 생략 가능).
8. **검증**: ① 새로 만든/수정한 파일들의 내부 링크가 실존 경로인지, ② FAQ JSON-LD=본문 일치(node로 파싱·비교), ③ canonical=Article url, ④ AdSense 스크립트 존재, ⑤ 허브 카드 수 = 가이드 폴더 수 = sitemap 가이드 URL 수.
9. **보호 파일 점검 후 커밋·푸시**: CNAME·ads.txt·robots.txt·privacy.html 무변경 확인 → `git add -A && git commit -m "가이드 1편 추가(총 N편) — <제목>" && git push origin main`.

여러 편을 연달아 쓸 때는 2편 단위로 커밋한다.
