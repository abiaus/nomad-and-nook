import http.server
import socketserver
import threading
import urllib.request
import re
import os
import sys

PORT = 8099
DIRECTORY = "nomad-and-nook"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    def log_message(self, format, *args):
        pass # Quiet

httpd = socketserver.TCPServer(("", PORT), Handler)
server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
server_thread.start()
print(f"Test server active on port {PORT}")

# Read index.html and find all local resource references
with open("nomad-and-nook/index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

# Extract css, js, images
hrefs = re.findall(r'href=["\'](?!#|mailto:|tel:)([^"\']+)["\']', html_content)
srcs = re.findall(r'src=["\']([^"\']+)["\']', html_content)
all_links = set(hrefs + srcs)

# Also check CSS files for url(...) references
for css_file in ["css/main.css", "css/chapters.css", "css/components.css"]:
    css_path = os.path.join("nomad-and-nook", css_file)
    with open(css_path, "r", encoding="utf-8") as f:
        css_content = f.read()
        css_urls = re.findall(r'url\(["\']?([^"\'\)]+)["\']?\)', css_content)
        for u in css_urls:
            # Resolve relative to css dir
            norm = os.path.normpath(os.path.join(os.path.dirname(css_file), u)).replace("\\", "/")
            all_links.add(norm)

# Also check JS files for asset strings
with open("nomad-and-nook/js/experience3d.js", "r", encoding="utf-8") as f:
    js_content = f.read()
    js_imgs = re.findall(r'["\'](images/[^"\']+)["\']', js_content)
    for img in js_imgs:
        all_links.add(img)

with open("nomad-and-nook/js/editorial.js", "r", encoding="utf-8") as f:
    js_content = f.read()
    js_imgs = re.findall(r'["\'](images/[^"\']+)["\']', js_content)
    for img in js_imgs:
        all_links.add(img)

print(f"Testing {len(all_links) + 1} resource URLs against local server...")
passed = 0
failed = 0

sys.stdout.reconfigure(encoding='utf-8')

# Check index.html itself
try:
    with urllib.request.urlopen(f"http://localhost:{PORT}/index.html") as response:
        if response.status == 200:
            print("[PASS 200 OK] /index.html")
            passed += 1
except Exception as e:
    print(f"[FAIL] /index.html : {e}")
    failed += 1

# Check all extracted assets
for link in sorted(all_links):
    url = f"http://localhost:{PORT}/{link}"
    try:
        with urllib.request.urlopen(url) as response:
            if response.status == 200:
                print(f"[PASS 200 OK] /{link}")
                passed += 1
            else:
                print(f"[FAIL {response.status}] /{link}")
                failed += 1
    except Exception as e:
        print(f"[FAIL] /{link} : {e}")
        failed += 1

httpd.shutdown()
print(f"\nVerification Results: {passed} passed, {failed} failed.")
if failed > 0:
    sys.exit(1)
