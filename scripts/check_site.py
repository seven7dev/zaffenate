"""Quick structural checks, run after: python3 scripts/build_public.py."""
from pathlib import Path
from urllib.parse import urlsplit
from bs4 import BeautifulSoup
import json, re, sys, xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
PUB=ROOT/'_site_public'
errors=[]; checked=0
if not PUB.exists():sys.exit('Run python3 scripts/build_public.py first')
known={'#'}
for page in PUB.rglob('*.html'):
 checked+=1
 html=page.read_text(encoding='utf8')
 soup=BeautifulSoup(html,'html.parser')
 if len(soup.select('h1'))!=1:errors.append(f'{page}: must have one h1')
 if len(soup.select('link[rel="canonical"]'))!=1:errors.append(f'{page}: canonical')
 if soup.select('.reviews-wrap,[data-reviews-list]'):errors.append(f'{page}: reviews widget remains')
 if re.search(r'AIza[\w-]{20,}',html):errors.append(f'{page}: exposed Google API key')
 for el in soup.select('script[type="application/ld+json"]'):
  try:
   data=json.loads(el.get_text())
   if not data.get('@graph'): errors.append(f'{page}: empty JSON graph')
  except json.JSONDecodeError as exc: errors.append(f'{page}: invalid JSON-LD {exc}')
 for el in soup.select('img'):
  if not el.has_attr('alt'):errors.append(f'{page}: image missing alt attribute')
 for el in soup.select('a[href],link[rel="stylesheet"],script[src],img[src]'):
  url=el.get('href') or el.get('src') or ''
  if url.startswith('/') and not url.startswith('//'):
   parsed=urlsplit(url)
   target=PUB/parsed.path.lstrip('/')
   if not target.is_file() and not (target/'index.html').is_file():errors.append(f'{page}: broken {url}')
   if parsed.fragment and parsed.path in ('','/'):
    dest=PUB/'index.html'; ds=BeautifulSoup(dest.read_text(encoding='utf8'),'html.parser')
    if not ds.find(id=parsed.fragment):errors.append(f'{page}: nonexistent anchor {url}')
 if page.name not in ('404.html','500.html') and not soup.select_one('meta[name=description]'):errors.append(f'{page}: meta description missing')
# Verify sitemap entries resolve to actual public pages.
xml=ET.parse(PUB/'sitemap.xml')
for loc in xml.findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
 path=urlsplit(loc.text).path
 if not (PUB/path.lstrip('/')/'index.html').is_file():errors.append('Missing sitemap page: '+loc.text)
# production must include nothing outside allowlist
for ext in ('*.pem','*.env','*.log','*.sql','*.map','*.mp4','*.jpeg','*.txt'):
 for f in PUB.rglob(ext):
  if f.name not in ('llms.txt','robots.txt'):errors.append(f'Unexpected production artifact: {f.relative_to(PUB)}')
if errors:
 print('\n'.join(errors));sys.exit(1)
print('OK:',checked,'HTML pages, internal assets/links, JSON-LD, sitemap, no keys or extraneous media')
