from pathlib import Path
import json
import re
import html
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[1]
page = (root / 'index.html').read_text()
assert page.count('<title>') == 1 and page.count('<h1 ') == 1
assert '<title>Felicitas Amulets | Roman-Inspired Silver Pendants</title>' in page
assert '<link rel="canonical" href="https://feclicitasamulets.com/">' in page
assert 'hV52fCJ4aKBrudCzSk0uukU2D56Q_z1bTInavsvmIb0' in page
assert page.count('src="/analytics.js"') == 1
assert 'googletagmanager.com/gtag' not in page
assert 'Owner visitor dashboard' in page
data = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', page, re.S)[1])
graph = data['@graph']
faq = next(n for n in graph if n['@type'] == 'FAQPage')
visible = re.search(r'<div class="faq">(.*?)</div>\s*</div>\s*</section>', page, re.S)[1]
clean = lambda value: ' '.join(html.unescape(re.sub('<[^>]+>', '', value)).split())
answers = re.findall(r'<summary>(.*?)</summary>\s*<div class="ans">(.*?)</div>', visible, re.S)
assert len(answers) == len(faq['mainEntity']) == 6
for (q, a), entry in zip(answers, faq['mainEntity']):
    assert entry['name'] == clean(q)
    assert entry['acceptedAnswer']['text'] == clean(a)
for entry in graph:
    if entry['@type'] == 'Product':
        assert not any(key in entry for key in ('offers', 'aggregateRating', 'review'))
        assert 'id="' + entry['url'].split('#')[1] + '"' in page
for src in re.findall(r'<img[^>]+src="([^"]+)"', page):
    assert (root / src).is_file(), src
sitemap = ET.fromstring((root / 'sitemap.xml').read_text())
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'i': 'http://www.google.com/schemas/sitemap-image/1.1'}
assert [x.text for x in sitemap.findall('s:url/s:loc', ns)] == ['https://feclicitasamulets.com/']
for loc in sitemap.findall('.//i:loc', ns):
    assert (root / loc.text.removeprefix('https://feclicitasamulets.com/')).is_file()
for name in ['design-cabinet.html', 'design-warm.html']:
    draft = (root / name).read_text()
    assert '<meta name="robots" content="noindex, follow">' in draft
    assert 'googletagmanager.com/gtag' not in draft
config = json.loads((root / 'vercel.json').read_text())
assert config['redirects'][0]['destination'] == '/'
print('SEO checks passed: metadata, canonical, six matching FAQs, product anchors, assets, sitemap and draft indexing.')
