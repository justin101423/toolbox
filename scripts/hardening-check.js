// 굳히기 캠페인 전용 검증기 — node scripts/hardening-check.js slug1 slug2 ...
// 검사: sec-label>=5, body FAQ==5, JSON-LD FAQ==5, body↔JSON-LD 글자단위 일치, 내부링크 폴더 존재
const fs = require("fs");

function stripQ(s){ return s.replace(/^Q\.\s*/, "").trim(); }

function checkSlug(slug){
  const f = slug + "/index.html";
  const errs = [];
  if(!fs.existsSync(f)) return ["파일 없음"];
  const h = fs.readFileSync(f, "utf8");

  // sec-labels
  const secs = (h.match(/<div class="sec-label">/g)||[]).length;
  if(secs < 5) errs.push("sec-label "+secs+"개 (<5)");

  // body FAQ
  const qas = [...h.matchAll(/<div class="qa"><b>(Q\.[^<]*)<\/b><p>([\s\S]*?)<\/p><\/div>/g)]
    .map(m => [stripQ(m[1]), m[2].trim()]);
  if(qas.length !== 5) errs.push("body FAQ "+qas.length+"개 (!=5)");
  // body 답변에 태그 금지
  qas.forEach(([q,a]) => { if(/<[a-z]/i.test(a)) errs.push("body 답변에 태그: "+q.slice(0,20)); });

  // JSON-LD FAQ
  const ld = [...h.matchAll(/"@type":\s*"Question",\s*"name":\s*"((?:[^"\\]|\\.)*)",\s*"acceptedAnswer":\s*\{\s*"@type":\s*"Answer",\s*"text":\s*"((?:[^"\\]|\\.)*)"/g)]
    .map(m => [stripQ(m[1].replace(/\\"/g,'"')), m[2].replace(/\\"/g,'"').trim()]);
  if(ld.length !== 5) errs.push("JSON-LD FAQ "+ld.length+"개 (!=5)");

  // 일치
  qas.forEach(([q,a]) => {
    const hit = ld.find(([lq,la]) => lq===q);
    if(!hit) errs.push("JSON-LD에 없는 질문: "+q.slice(0,24));
    else if(hit[1] !== a) errs.push("답변 불일치: "+q.slice(0,24));
  });

  // 내부링크
  const links = [...h.matchAll(/href="(\/[a-z0-9-]+(?:\/[a-z0-9-]+)?\/)"/g)].map(m=>m[1]);
  links.forEach(l => {
    const p = l.replace(/^\//,"").replace(/\/$/,"") + "/index.html";
    if(!fs.existsSync(p)) errs.push("깨진 링크: "+l);
  });

  return errs;
}

const slugs = process.argv.slice(2);
let bad = 0;
for(const s of slugs){
  const e = checkSlug(s);
  if(e.length){ bad++; console.log("✗ "+s+"\n   "+e.join("\n   ")); }
  else console.log("✓ "+s);
}
console.log("\n"+(slugs.length-bad)+"/"+slugs.length+" 통과");
process.exit(bad ? 1 : 0);
