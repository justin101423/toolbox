---
name: site-audit
description: 도구상자 전수 점검 — 전 사이트 내부 링크, 폴더/허브/sitemap/문서 카운트 일치, 가이드 JSON-LD·FAQ 본문 일치, AdSense·보호 파일 검사를 한 번에 실행하고 발견 문제를 보고(요청 시 수정)한다.
---

# /site-audit — 전수 점검

아래 검사를 순서대로 실행하고 결과를 표로 보고한다. 문제가 발견되면 사용자에게 보고하되, 명백한 오류(깨진 링크, FAQ 불일치, 카운트 어긋남)는 바로 수정하고 커밋한다.

## 1. 전 사이트 내부 링크 (bash)

```bash
{ for d in */ guide/*/; do [ -f "$d/index.html" ] && echo "/$d"; done; echo "/"; echo "/guide/"; } | sort -u > /tmp/existing.txt
grep -rhoE 'href="/[a-z0-9-]+(/[a-z0-9-]+)?/"' --include='*.html' . | sed 's/href="//; s/"$//' | sort -u | while read u; do grep -qxF "$u" /tmp/existing.txt || echo "BROKEN: $u"; done
```

## 2. 카운트 일치

- 가이드: `ls -d guide/*/ | wc -l` = `guide/index.html`의 `class="guide-item"` 수 = sitemap의 `/guide/` URL 수(허브 제외) = README의 가이드 항목 수 = CLAUDE.md "현재 글(N)".
- 도구: 루트 도구 폴더 수 = sidebar.js `{ slug:` 수 = 홈 도구 카드 수(guide-cards 제외) = CLAUDE.md 4번 총 개수.

## 3. 가이드 JSON-LD 전수 (node)

```bash
node -e "
const fs=require('fs'),path=require('path');
let bad=0,checked=0;
for(const d of fs.readdirSync('guide')){
  const f=path.join('guide',d,'index.html');
  if(!fs.existsSync(f))continue;
  const s=fs.readFileSync(f,'utf8');
  const blocks=[...s.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  let faq=null,art=null,bc=null;
  for(const b of blocks){ try{ const j=JSON.parse(b); if(j['@type']==='FAQPage')faq=j; if(j['@type']==='Article')art=j; if(j['@type']==='BreadcrumbList')bc=j; }catch(e){ console.log('JSON parse error:',d); bad++; } }
  if(!faq||!art||!bc){ console.log('missing JSON-LD:',d); bad++; continue; }
  checked++;
  for(const q of faq.mainEntity){ if(q['@type']!=='Question'){console.log('bad Question:',d);bad++;} }
  const qas=[...s.matchAll(/<div class=\"qa\"><b>Q\. ([\s\S]*?)<\/b><p>([\s\S]*?)<\/p><\/div>/g)];
  const norm=t=>t.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
  const bm=new Map(qas.map(m=>[norm(m[1]),norm(m[2])]));
  for(const q of faq.mainEntity){
    const n=norm(q.name.replace(/^Q\. /,''));
    if(bm.get(n)!==norm(q.acceptedAnswer.text)){ console.log('FAQ mismatch:',d,'|',n.slice(0,35)); bad++; }
  }
  const can=(s.match(/rel=\"canonical\" href=\"([^\"]+)\"/)||[])[1];
  if(can!==art.mainEntityOfPage){ console.log('canonical mismatch:',d); bad++; }
}
console.log('checked',checked,'guides, issues:',bad);
"
```

## 4. 공통 요소

- AdSense 누락 페이지: `grep -rL 'ca-pub-6448118773813567' --include='index.html' .` → 0이어야 함 (404.html은 의도적 제외 — 별도 파일).
- analytics.js·theme.js·sidebar.js 로드 누락: `grep -rL '/analytics.js' --include='*.html' .` (google 인증 파일·terms 등 예외 확인).
- sitemap 중복: `grep -o '<loc>[^<]*' sitemap.xml | sort | uniq -d`.

## 5. 보호 파일 (CLAUDE.md 자동 커밋 규칙)

`git status --short`에서 CNAME, ads.txt, robots.txt, privacy.html에 의도치 않은 변경이 없는지 확인. AdSense 스크립트가 어떤 diff에서도 제거되지 않았는지 확인.

## 보고

결과를 항목별 표(검사 항목 / 결과 / 조치)로 요약하고, 수정 커밋이 있었다면 커밋 메시지와 함께 보고한다.
