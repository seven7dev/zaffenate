"""Build a minimal allowlisted static website directory for GitHub Pages.

No repository metadata, raw videos, source images, forms data, private keys,
login routes, internal documents or development assets are published.
Run: python3 scripts/build_public.py
"""
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / '_site_public'
ALLOWED_PAGES = [
    'index.html','404.html','500.html',
    'soldagem-industrial/index.html','solda-tig/index.html',
    'solda-mig/index.html','solda-inox/index.html','solda-aluminio/index.html',
    'estruturas-metalicas/index.html','serralheria/index.html',
    'parcerias-industriais/index.html','contato/index.html','privacidade/index.html'
]
ALLOWED_FILES = ['assets/site.css','assets/site.js','robots.txt','sitemap.xml','manifest.webmanifest','llms.txt']
ALLOWED_MEDIA = [
    'src/logo.webp','src/logo2.webp','src/logo2.png',
    'src/1.webp','src/2.webp','src/four.webp','src/og-industrial.jpg',
    'src/industrial/1.webp', 'src/serralheria/1.webp'
]
ALLOWED_MEDIA += [f'src/industrial/{i}.webp' for i in range(1,19)]
ALLOWED_MEDIA += [f'src/serralheria/{i}.webp' for i in range(1,13)]

if DEST.exists(): shutil.rmtree(DEST)
for relative in dict.fromkeys(ALLOWED_PAGES + ALLOWED_FILES + ALLOWED_MEDIA):
    src = ROOT / relative
    if not src.is_file(): sys.exit(f'ERROR missing public asset: {relative}')
    dest = DEST / relative
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
print(f'Built public site with {len(list(DEST.rglob("*")))} files/folders in {DEST}')
