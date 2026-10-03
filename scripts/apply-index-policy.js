#!/usr/bin/env node
/*
 * 색인 정책 적용기 — scripts/indexed.json(단일 출처)을 실제 페이지·sitemap에 반영한다.
 * ---------------------------------------------------------------------------
 * 사용: `node scripts/apply-index-policy.js`  (여러 번 실행해도 결과 동일)
 *   ① indexed.json에 없는 도구·가이드 페이지 → canonical 다음 줄에
 *      <meta name="robots" content="noindex,follow"> 삽입 (있는 페이지는 제거)
 *   ② sitemap.xml 을 색인 대상 URL만 남기도록 재작성 (기존 lastmod 유지)
 * 페이지 자체는 삭제하지 않는다 — 사이드바·홈·가이드 허브에서 그대로 접근 가능.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://dogubox.shop";
const NOINDEX = '<meta name="robots" content="noindex,follow">';

const policy = JSON.parse(fs.readFileSync(path.join(__dirname, "indexed.json"), "utf8"));
const keepTools = new Set(policy.tools);
const keepGuides = new Set(policy.guides);

const sidebar = fs.readFileSync(path.join(ROOT, "sidebar.js"), "utf8");
const toolSlugs = [...sidebar.matchAll(/\{\s*slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const guideSlugs = fs.readdirSync(path.join(ROOT, "guide"), { withFileTypes: true })
  .filter((e) => e.isDirectory() && fs.existsSync(path.join(ROOT, "guide", e.name, "index.html")))
  .map((e) => e.name);

for (const s of keepTools) if (!toolSlugs.includes(s)) throw new Error(`indexed.json: 없는 도구 슬러그 ${s}`);
for (const s of keepGuides) if (!guideSlugs.includes(s)) throw new Error(`indexed.json: 없는 가이드 슬러그 ${s}`);

// ── ① 페이지별 robots 메타 ────────────────────────────────────────────────
let changed = 0;
function apply(rel, indexed) {
  const file = path.join(ROOT, rel);
  const before = fs.readFileSync(file, "utf8");
  const lines = before.split("\n").filter((l) => l.trim() !== NOINDEX);
  if (!indexed) {
    const i = lines.findIndex((l) => l.includes('<link rel="canonical"'));
    if (i < 0) throw new Error(`canonical 없음: ${rel}`);
    lines.splice(i + 1, 0, NOINDEX + (lines[i].endsWith("\r") ? "\r" : "")); // CRLF 파일은 줄 끝 유지
  }
  const html = lines.join("\n");
  if (html !== before) { fs.writeFileSync(file, html); changed++; }
}
for (const s of toolSlugs) apply(`${s}/index.html`, keepTools.has(s));
for (const s of guideSlugs) apply(`guide/${s}/index.html`, keepGuides.has(s));

// ── ② sitemap.xml 재작성 ──────────────────────────────────────────────────
const smPath = path.join(ROOT, "sitemap.xml");
const today = new Date().toISOString().slice(0, 10);
const lastmod = {};
for (const m of fs.readFileSync(smPath, "utf8").matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)) lastmod[m[1]] = m[2];

const urls = [
  `${SITE}/`,
  ...toolSlugs.filter((s) => keepTools.has(s)).map((s) => `${SITE}/${s}/`),
  `${SITE}/guide/`,
  ...policy.guides.map((s) => `${SITE}/guide/${s}/`),
  `${SITE}/about.html`, `${SITE}/privacy.html`, `${SITE}/terms.html`,
];
const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
  .concat(urls.map((u) => `  <url><loc>${u}</loc><lastmod>${lastmod[u] || today}</lastmod></url>`))
  .concat(["</urlset>", ""]).join("\n");
fs.writeFileSync(smPath, xml);

console.log(`색인 대상: 도구 ${keepTools.size}/${toolSlugs.length} · 가이드 ${keepGuides.size}/${guideSlugs.length} · sitemap ${urls.length} URL · 수정된 페이지 ${changed}`);
