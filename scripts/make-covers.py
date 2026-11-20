"""대표 이미지(표지) 생성 + 페이지 반영 — 멱등. 가이드 전부 + 색인 대상 도구.

- 가이드: /guide/<슬러그>/cover.png — 제목 = h1, 카테고리 = guide/index.html 허브의 주제 섹션.
  Article JSON-LD "image" · og:image · twitter:image를 표지로.
- 도구: /<슬러그>/cover.png — 제목 = h1, 카테고리·아이콘 = sidebar.js CATEGORIES(단일 출처).
  SoftwareApplication JSON-LD "image" · og:image(+alt) · twitter:image를 표지로.
  대상은 scripts/indexed.json의 tools(색인 대상)만. 색인에서 빠진 도구는 공통 og-image.png 유지.

사용: python scripts/make-covers.py              (가이드 전부 + 색인 대상 도구 전부)
      python scripts/make-covers.py <슬러그> ...   (일부만 — 가이드/도구 슬러그 자동 판별)
필요: pip install playwright (브라우저는 설치된 Chrome 사용)
"""
import html, json, os, re, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://dogubox.shop'
# theme.css 라이트 테마 --cat-* 값과 동일하게 유지
CAT_COLOR = {'image': '#cf4f3e', 'text': '#b1742a', 'life': '#4f9a5e', 'finance': '#2f8f86',
             'work': '#5a78c4', 'color': '#9a62bd', 'dev': '#4878a6', 'fun': '#d6479b', 'inst': '#c1568c'}
PRETENDARD = ('<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" '
              'integrity="sha384-ei/b2Mz3F5J8nqTvpKS89CkzDCuD7Cc+/F+OsaPUKItzHgLNKnGq3rjtYq/B7RnO" crossorigin="anonymous">')

TEMPLATE = '''<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">''' + PRETENDARD + '''
<style>
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
body{background:#f3eee3;color:#1b1a1e;font-family:Pretendard,sans-serif;position:relative;overflow:hidden}
.bar{position:absolute;inset:0 0 auto 0;height:16px;background:__CAT__}
.wrap{position:absolute;inset:16px 0 0 0;padding:70px 96px 64px;display:flex;flex-direction:column}
.eyebrow{display:flex;align-items:center;gap:14px;font-size:30px;font-weight:700;letter-spacing:-.01em;color:__CAT__}
.eyebrow i{display:block;width:18px;height:18px;background:__CAT__;border-radius:4px}
.eyebrow span{color:#8a8578;font-weight:600;margin-left:-4px}
.mid{flex:1;min-height:0;display:flex;align-items:center;gap:56px;padding:10px 0 26px}
h1{flex:1;min-width:0;max-height:100%;font-size:__SIZE__px;line-height:1.22;font-weight:800;letter-spacing:-.035em;word-break:keep-all;text-wrap:balance}
.sub{margin-top:22px;font-size:32px;font-weight:600;color:#6b665c;letter-spacing:-.02em}
.tile{flex:none;margin-left:auto;width:236px;height:236px;border-radius:52px;background:#fff;border:3px solid #1b1a1e;box-shadow:14px 14px 0 __CAT__;display:grid;place-items:center;color:__CAT__}
.tile svg{width:132px;height:132px;stroke-width:1.9}
.foot{display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:18px;font-size:34px;font-weight:800;letter-spacing:-.03em}
.logo{width:64px;height:64px;border-radius:16px;background:#1b1a1e;color:#f3eee3;display:grid;place-items:center;font-size:36px;font-weight:800;box-shadow:7px 7px 0 #df4324}
.url{font-size:30px;font-weight:700;color:#df4324}
</style></head><body><div class="bar"></div><div class="wrap">
<div class="eyebrow"><i></i>__CATNAME__ <span>· __KIND__</span></div>
<div class="mid"><div class="tx"><h1>__TITLE__</h1>__SUB__</div>__TILE__</div>
<div class="foot"><div class="brand"><div class="logo">도</div>도구상자</div><div class="url">dogubox.shop</div></div>
</div></body></html>'''


def guide_categories():
    """허브의 주제 섹션(sec-label + guide-grid[data-cat]) 순서대로 슬러그 → (cat, 섹션명)."""
    s = open(os.path.join(ROOT, 'guide', 'index.html'), encoding='utf-8').read()
    out, label, cat = {}, None, None
    for m in re.finditer(r'<div class="sec-label">([^<]+)</div>|<div class="guide-grid" data-cat="([a-z]+)"|href="/guide/([a-z0-9-]+)/"', s):
        if m.group(1):
            label = m.group(1).strip()
        elif m.group(2):
            cat = m.group(2)
        elif m.group(3) and label and cat:
            out.setdefault(m.group(3), (cat, label))
    return out


def tool_categories(pg):
    """sidebar.js를 실제로 실행해 window.DGB_TOOLS에서 슬러그 → (cat, 카테고리명, 아이콘 SVG)."""
    pg.set_content('<!DOCTYPE html><html><body></body></html>')
    pg.add_script_tag(path=os.path.join(ROOT, 'sidebar.js'))
    return pg.evaluate('''()=>{const T=window.DGB_TOOLS,o={};
      for(const c of T.categories)for(const t of c.tools)o[t.slug]=[c.key,c.label,T.iconHtml(t.icon)];return o}''')


def h1_text(src):
    t = re.search(r'<h1[^>]*>(.*?)</h1>', src, re.S).group(1).strip()
    return html.unescape(re.sub(r'<[^>]+>', '', t))


def add_or_replace_image(s, type_name, first_key, url):
    """JSON-LD 블록(type_name)에 "image"가 없으면 first_key 줄 다음에 추가, 있으면 값 교체."""
    blk = re.search(r'"@type": "' + type_name + r'",(.*?)\n\}', s, re.S)
    if not blk:
        return s
    if '"image"' in blk.group(1):
        seg = re.sub(r'"image": "[^"]*"', f'"image": "{url}"', blk.group(0), count=1)
    else:
        seg = re.sub(r'(\n(\s*)"' + first_key + r'": "[^\n]*",)(\r?)', rf'\1\3\n\2"image": "{url}",\3', blk.group(0), count=1)
    return s[:blk.start()] + seg + s[blk.end():]


def patch_page(path, url, type_name, first_key, alt=None):
    s = open(path, encoding='utf-8', newline='').read()
    o = s
    s = re.sub(r'(<meta property="og:image" content=")[^"]*(")', rf'\g<1>{url}\2', s)
    s = re.sub(r'(<meta name="twitter:image" content=")[^"]*(")', rf'\g<1>{url}\2', s)
    if alt:
        s = re.sub(r'(<meta property="og:image:alt" content=")[^"]*(")', lambda m: m.group(1) + html.escape(alt, quote=True) + m.group(2), s)
    s = add_or_replace_image(s, type_name, first_key, url)
    if s != o:
        open(path, 'w', encoding='utf-8', newline='').write(s)
    return s != o


def render(pg, out_path, cat, label, kind, title, icon_svg=None):
    if icon_svg:  # 도구: 짧은 이름 + 부제 + 아이콘 타일
        size = 96 if len(title) <= 8 else 84 if len(title) <= 12 else 72
        sub = '<div class="sub">설치 없이 브라우저에서 바로 · 무료</div>'
        tile = f'<div class="tile">{icon_svg}</div>'
    else:         # 가이드: 긴 제목
        size = 88 if len(title) <= 16 else 78 if len(title) <= 24 else 70 if len(title) <= 32 else 62
        sub = tile = ''
    doc = (TEMPLATE.replace('__CAT__', CAT_COLOR[cat]).replace('__CATNAME__', html.escape(label))
           .replace('__KIND__', kind).replace('__SIZE__', str(size)).replace('__TITLE__', html.escape(title))
           .replace('__SUB__', sub).replace('__TILE__', tile))
    pg.set_content(doc, wait_until='networkidle')
    pg.evaluate('document.fonts.ready')
    # 제목 블록이 가운데 영역을 넘치면 글자 크기를 줄여 맞춤
    pg.evaluate('''()=>{const m=document.querySelector('.mid'),t=document.querySelector('.tx'),h=document.querySelector('h1');
      let s=parseFloat(getComputedStyle(h).fontSize);
      while(t.scrollHeight>m.clientHeight-36&&s>40){s-=2;h.style.fontSize=s+'px'}}''')
    pg.screenshot(path=out_path)


def main():
    only = set(sys.argv[1:])
    gcats = guide_categories()
    guides = [d for d in sorted(os.listdir(os.path.join(ROOT, 'guide')))
              if os.path.isfile(os.path.join(ROOT, 'guide', d, 'index.html')) and (not only or d in only)]
    indexed_tools = json.load(open(os.path.join(ROOT, 'scripts', 'indexed.json'), encoding='utf-8'))['tools']
    tools = [t for t in indexed_tools if not only or t in only]
    unknown = only - set(guides) - set(tools)
    if unknown:
        sys.exit('가이드도 색인 대상 도구도 아닌 슬러그(도구는 indexed.json에 있어야 함): ' + ', '.join(sorted(unknown)))
    missing = [d for d in guides if d not in gcats]
    if missing:
        sys.exit('허브에 카드가 없는 가이드: ' + ', '.join(missing))
    changed = 0
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True)
        pg = b.new_page(viewport={'width': 1200, 'height': 630})
        tcats = tool_categories(pg) if tools else {}
        for slug in guides:
            path = os.path.join(ROOT, 'guide', slug, 'index.html')
            cat, label = gcats[slug]
            render(pg, os.path.join(ROOT, 'guide', slug, 'cover.png'), cat, label, '가이드',
                   h1_text(open(path, encoding='utf-8').read()))
            changed += patch_page(path, f'{SITE}/guide/{slug}/cover.png', 'Article', 'headline')
        for slug in tools:
            if slug not in tcats:
                sys.exit(f'sidebar.js에 없는 도구: {slug}')
            path = os.path.join(ROOT, slug, 'index.html')
            title = h1_text(open(path, encoding='utf-8').read())
            cat, label, svg = tcats[slug]
            render(pg, os.path.join(ROOT, slug, 'cover.png'), cat, label, '무료 도구', title, svg)
            changed += patch_page(path, f'{SITE}/{slug}/cover.png', 'SoftwareApplication', 'name',
                                  alt=f'{title} — 도구상자')
        b.close()
    print(f'표지 가이드 {len(guides)}개 · 도구 {len(tools)}개 생성, 페이지 {changed}개 갱신')


if __name__ == '__main__':
    main()
