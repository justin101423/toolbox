"""가이드 대표 이미지(표지) 생성 + 페이지 반영 — 멱등.

각 가이드 /guide/<슬러그>/에 cover.png(1200×630)를 만들고, 그 페이지의
Article JSON-LD "image" · og:image · twitter:image를 이 표지로 맞춘다.
표지 글자 = 페이지 h1, 카테고리 = guide/index.html 허브에서 그 글이 속한 주제 섹션.

사용: python scripts/make-guide-covers.py            (전체)
      python scripts/make-guide-covers.py <슬러그> ...  (일부만 — 새 가이드 추가 시)
필요: pip install playwright (브라우저는 설치된 Chrome 사용)
"""
import html, os, re, sys
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
h1{flex:1;min-height:0;display:flex;align-items:center;padding:10px 0 26px;font-size:__SIZE__px;line-height:1.22;font-weight:800;letter-spacing:-.035em;word-break:keep-all;text-wrap:balance}
.foot{display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:18px;font-size:34px;font-weight:800;letter-spacing:-.03em}
.logo{width:64px;height:64px;border-radius:16px;background:#1b1a1e;color:#f3eee3;display:grid;place-items:center;font-size:36px;font-weight:800;box-shadow:7px 7px 0 #df4324}
.url{font-size:30px;font-weight:700;color:#df4324}
</style></head><body><div class="bar"></div><div class="wrap">
<div class="eyebrow"><i></i>__CATNAME__ <span>· 가이드</span></div>
<h1>__TITLE__</h1>
<div class="foot"><div class="brand"><div class="logo">도</div>도구상자</div><div class="url">dogubox.shop</div></div>
</div></body></html>'''


def hub_categories():
    """허브의 주제 섹션(sec-label + guide-grid[data-cat]) 순서대로 슬러그 → (cat, 섹션명)."""
    s = open(os.path.join(ROOT, 'guide', 'index.html'), encoding='utf-8').read()
    out, label = {}, None
    for m in re.finditer(r'<div class="sec-label">([^<]+)</div>|<div class="guide-grid" data-cat="([a-z]+)"|href="/guide/([a-z0-9-]+)/"', s):
        if m.group(1):
            label = m.group(1).strip()
        elif m.group(2):
            cat = m.group(2)
        elif m.group(3) and label:
            out.setdefault(m.group(3), (cat, label))
    return out


def patch_page(path, slug):
    s = open(path, encoding='utf-8', newline='').read()
    url = f'{SITE}/guide/{slug}/cover.png'
    o = s
    s = re.sub(r'(<meta property="og:image" content=")[^"]*(")', rf'\g<1>{url}\2', s)
    s = re.sub(r'(<meta name="twitter:image" content=")[^"]*(")', rf'\g<1>{url}\2', s)
    # Article JSON-LD: image가 없으면 headline 다음 줄에 추가, 있으면 값 교체
    art = re.search(r'"@type": "Article",(.*?)\n\}', s, re.S)
    if art and '"image"' in art.group(1):
        seg = re.sub(r'"image": "[^"]*"', f'"image": "{url}"', art.group(0))
    elif art:
        seg = re.sub(r'(\n(\s*)"headline": "[^\n]*",)(\r?)', rf'\1\3\n\2"image": "{url}",\3', art.group(0), count=1)
    if art:
        s = s[:art.start()] + seg + s[art.end():]
    if s != o:
        open(path, 'w', encoding='utf-8', newline='').write(s)
    return s != o


def main():
    cats = hub_categories()
    only = sys.argv[1:]
    slugs = [d for d in sorted(os.listdir(os.path.join(ROOT, 'guide')))
             if os.path.isfile(os.path.join(ROOT, 'guide', d, 'index.html')) and (not only or d in only)]
    missing = [d for d in slugs if d not in cats]
    if missing:
        sys.exit('허브에 카드가 없는 가이드: ' + ', '.join(missing))
    changed = 0
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True)
        pg = b.new_page(viewport={'width': 1200, 'height': 630})
        for slug in slugs:
            path = os.path.join(ROOT, 'guide', slug, 'index.html')
            src = open(path, encoding='utf-8').read()
            title = re.search(r'<h1[^>]*>(.*?)</h1>', src, re.S).group(1).strip()
            title = html.unescape(re.sub(r'<[^>]+>', '', title))
            cat, label = cats[slug]
            size = 88 if len(title) <= 16 else 78 if len(title) <= 24 else 70 if len(title) <= 32 else 62
            doc = (TEMPLATE.replace('__CAT__', CAT_COLOR[cat]).replace('__CATNAME__', html.escape(label))
                   .replace('__SIZE__', str(size)).replace('__TITLE__', html.escape(title)))
            pg.set_content(doc, wait_until='networkidle')
            pg.evaluate('document.fonts.ready')
            # 제목이 넘치면 글자 크기를 줄여 맞춤
            pg.evaluate('''()=>{const h=document.querySelector('h1');let s=parseFloat(getComputedStyle(h).fontSize);
              while(h.scrollHeight>h.clientHeight+2&&s>40){s-=2;h.style.fontSize=s+'px'}}''')
            pg.screenshot(path=os.path.join(ROOT, 'guide', slug, 'cover.png'))
            changed += patch_page(path, slug)
        b.close()
    print(f'표지 {len(slugs)}개 생성, 페이지 {changed}개 갱신')


if __name__ == '__main__':
    main()
