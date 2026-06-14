#!/usr/bin/env node
/*
 * 도구상자 검증 하네스 (Stage 1 — 경고용)
 * ---------------------------------------------------------------------------
 * 로컬: `node scripts/validate.js`  /  CI: .github/workflows/validate.yml
 * 도구 추가 때 손으로 하던 점검을 자동화한다:
 *   ① 단일 출처(sidebar.js)의 모든 슬러그가 폴더·홈 카드·sitemap에 다 있는지
 *   ② 사이드바에 없는 "고아" 도구 폴더가 없는지
 *   ③ 보호 파일 존재 + 모든 도구 페이지에 AdSense 스크립트(404.html은 없어야)
 *   ④ 각 도구 페이지의 JSON-LD 가 유효한 JSON 인지
 *   ⑤ 내부 링크(href/src="/...")가 실제 존재하는 파일/폴더를 가리키는지
 * 실패가 하나라도 있으면 종료코드 1.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const ADS = "ca-pub-6448118773813567";

const errors = [];
let passed = 0;
const fail = (m) => errors.push(m);
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));

// ── 단일 출처: sidebar.js 슬러그 ──────────────────────────────────────────
const sidebar = read("sidebar.js");
const slugs = [...sidebar.matchAll(/\{\s*slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const slugSet = new Set(slugs);
if (slugs.length !== slugSet.size) fail("sidebar.js에 중복 슬러그가 있습니다");

// ── 보호 파일 ──────────────────────────────────────────────────────────────
for (const f of ["CNAME", "ads.txt", "robots.txt", "privacy.html"]) {
  if (!exists(f) || read(f).trim() === "") fail(`보호 파일 누락/빈 파일: ${f}`);
  else passed++;
}

// ── 슬러그별: 폴더·AdSense·JSON-LD·sitemap·홈 카드 ──────────────────────────
const indexHtml = exists("index.html") ? read("index.html") : "";
const sitemap = exists("sitemap.xml") ? read("sitemap.xml") : "";
for (const slug of slugs) {
  const page = `${slug}/index.html`;
  if (!exists(page)) { fail(`도구 폴더 누락: ${page}`); continue; }
  const html = read(page);
  if (!html.includes(ADS)) fail(`AdSense 스크립트 없음: ${page}`);
  if (!sitemap.includes(`https://dogubox.shop/${slug}/`)) fail(`sitemap에 없음: ${slug}`);
  if (!indexHtml.includes(`href="/${slug}/"`)) fail(`홈 허브 카드 없음: ${slug}`);
  for (const ld of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(ld[1]); } catch (e) { fail(`JSON-LD 파싱 실패: ${page}`); break; }
  }
  passed++;
}

// ── 고아 폴더(사이드바에 없는 도구 폴더) 탐지 ──────────────────────────────
const SKIP_DIRS = new Set(["guide", "scripts", "node_modules"]);
for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory() || ent.name.startsWith(".")) continue;
  if (SKIP_DIRS.has(ent.name)) continue;
  if (exists(`${ent.name}/index.html`) && !slugSet.has(ent.name))
    fail(`사이드바에 없는 도구 폴더(고아): ${ent.name}/`);
}

// ── 404.html 은 AdSense 없어야(오류 페이지 광고 금지 정책) ──────────────────
if (exists("404.html")) {
  if (read("404.html").includes(ADS)) fail("404.html에 AdSense 스크립트가 있습니다(정책 위반)");
  else passed++;
}

// ── 내부 링크 검사 ─────────────────────────────────────────────────────────
function collectHtml(dir, out) {
  for (const ent of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (ent.name.startsWith(".") || ent.name === "node_modules") continue;
    const rel = dir ? `${dir}/${ent.name}` : ent.name;
    if (ent.isDirectory()) collectHtml(rel, out);
    else if (ent.name.endsWith(".html")) out.push(rel);
  }
  return out;
}
// 내부 링크만(절대경로 "/...") 대상. 페이지(디렉터리) 링크는 항상 검사하고,
// 파일 링크는 구조 파일(.html/.css/.js)만 검사한다 — .ico/.png/.webmanifest 등은
// 도구·가이드의 "예시 코드"에 자주 등장(실제 링크 아님)해 오탐이 되므로 제외.
function checkable(href) {
  const h = href.split("#")[0].split("?")[0];
  if (!h.startsWith("/")) return false;
  const last = h.replace(/^\/+/, "").split("/").filter(Boolean).pop() || "";
  if (!last.includes(".")) return true; // 디렉터리(페이지) 링크
  const ext = last.slice(last.lastIndexOf(".")).toLowerCase();
  return ext === ".html" || ext === ".css" || ext === ".js";
}
function linkExists(href) {
  const h = href.split("#")[0].split("?")[0];
  if (h === "/") return exists("index.html");
  const rel = h.replace(/^\/+/, "");
  const last = rel.split("/").filter(Boolean).pop() || "";
  return last.includes(".") ? exists(rel) : exists(rel.replace(/\/$/, "") + "/index.html");
}
const htmlFiles = collectHtml("", []);
let brokenLinks = 0;
for (const file of htmlFiles) {
  const txt = read(file);
  for (const m of txt.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (checkable(m[1]) && !linkExists(m[1])) { fail(`깨진 내부 링크: ${file} → ${m[1]}`); brokenLinks++; }
  }
}
if (brokenLinks === 0) passed++;

// ── 결과 ──────────────────────────────────────────────────────────────────
console.log(`도구 슬러그: ${slugs.length}개 · HTML 파일: ${htmlFiles.length}개 · 통과 항목: ${passed}`);
if (errors.length) {
  console.error(`\n❌ 검증 실패 (${errors.length}건):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("✅ 모든 검증 통과");
