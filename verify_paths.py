import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

base_dir = "nomad-and-nook"

with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    html_content = f.read()

# Check relative CSS, JS, Image references in index.html
hrefs = [h for h in re.findall(r'href=["\'](?!#|mailto:|tel:)([^"\']+)["\']', html_content) if not h.startswith(('http://', 'https://', '//'))]
srcs = [s for s in re.findall(r'src=["\']([^"\']+)["\']', html_content) if not s.startswith(('http://', 'https://', '//'))]
links_to_check = set(hrefs + srcs)

# Check CSS files
for css_rel in ["css/main.css", "css/chapters.css", "css/components.css"]:
    css_path = os.path.join(base_dir, css_rel)
    with open(css_path, "r", encoding="utf-8") as f:
        css_content = f.read()
        css_urls = re.findall(r'url\(["\']?([^"\'\)]+)["\']?\)', css_content)
        for u in css_urls:
            # Resolve relative to the css file's directory
            full_rel = os.path.normpath(os.path.join(os.path.dirname(css_rel), u)).replace("\\", "/")
            links_to_check.add(full_rel)

# Check JS files
for js_rel in ["js/experience3d.js", "js/editorial.js", "js/scroll.js", "js/audio.js"]:
    js_path = os.path.join(base_dir, js_rel)
    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()
        js_imgs = re.findall(r'["\'](images/[^"\']+)["\']', js_content)
        for img in js_imgs:
            links_to_check.add(img)

print(f"Checking {len(links_to_check)} local file dependencies...")
passed = 0
failed = 0

for item in sorted(links_to_check):
    target = os.path.join(base_dir, item)
    if os.path.exists(target):
        size = os.path.getsize(target)
        print(f"[EXISTS - {size:>7} bytes] {item}")
        passed += 1
    else:
        print(f"[MISSING 404] {item}")
        failed += 1

print(f"\nResult: {passed} verified, {failed} missing.")
if failed > 0:
    sys.exit(1)
