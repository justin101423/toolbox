#!/usr/bin/env node
/*
 * RSS 생성기 — 색인 대상 페이지(scripts/indexed.json의 tools·guides)만 담은 rss.xml을 만든다.
 * ---------------------------------------------------------------------------
 * 사용: `node scripts/make-rss.js` (apply-index-policy.js가 sitemap 재작성 후 자동 호출, 멱등)
 *   title       = 페이지 <title>에서 " | 도구상자" 앞부분
 *   description = meta description
 *   pubDate     = JSON-LD dateModified → datePublished → sitemap.xml lastmod (RFC 822)
 * 항목은 최신순 정렬. noindex 페이지는 넣지 않는다(네이버 서치어드바이저 제출용).
 */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://dogubox.shop";

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function makeRss() {
  const policy = JSON.parse(fs.readFileSync(path.join(__dirname, "indexed.json"), "utf8"));
  const lastmod = {};
  for (const m of fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)) lastmod[m[1]] = m[2];

  const pages = [...policy.tools, ...policy.guides.map((s) => `guide/${s}`)];
  const items = pages.map((rel) => {
    const html = fs.readFileSync(path.join(ROOT, rel, "index.html"), "utf8");
    const link = `${SITE}/${rel}/`;
    const title = html.match(/<title>([^<]*)<\/title>/);
    const desc = html.match(/<meta name="description" content="([^"]*)"/);
    if (!title || !desc) throw new Error(`title/description 없음: ${rel}`);
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n");
    const date = (ld.match(/"dateModified"\s*:\s*"([^"]+)"/) || ld.match(/"datePublished"\s*:\s*"([^"]+)"/) || [])[1] || lastmod[link];
    if (!date) throw new Error(`날짜 없음: ${rel}`);
    const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00Z` : date);
    if (isNaN(d)) throw new Error(`날짜 형식 오류(${date}): ${rel}`);
    return { title: decode(title[1]).replace(/\s*\|\s*도구상자\s*$/, ""), link, desc: decode(desc[1]), d };
  });
  items.sort((a, b) => b.d - a.d || a.link.localeCompare(b.link));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>도구상자</title>",
    `    <link>${SITE}/</link>`,
    "    <description>설치 없이 브라우저에서 바로 쓰는 무료 온라인 도구와 활용 가이드</description>",
    "    <language>ko</language>",
    `    <lastBuildDate>${items[0].d.toUTCString()}</lastBuildDate>`,
    ...items.map((it) => [
      "    <item>",
      `      <title>${esc(it.title)}</title>`,
      `      <link>${it.link}</link>`,
      `      <guid isPermaLink="true">${it.link}</guid>`,
      `      <description>${esc(it.desc)}</description>`,
      `      <pubDate>${it.d.toUTCString()}</pubDate>`,
      "    </item>",
    ].join("\n")),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(ROOT, "rss.xml"), xml);
  return items.length;
}

module.exports = makeRss;
if (require.main === module) console.log(`rss.xml: ${makeRss()}개 항목`);
