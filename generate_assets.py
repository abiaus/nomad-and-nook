import math
import os
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

os.makedirs('nomad-and-nook/images', exist_ok=True)

def create_noise_texture(filename, width=256, height=256):
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    pixels = img.load()
    for y in range(height):
        for x in range(width):
            v = random.randint(0, 255)
            a = random.randint(15, 45)
            pixels[x, y] = (v, v, v, a)
    img.save(filename, 'PNG')
    print(f"Generated {filename}")

def create_star_particle(filename, size=64):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = size / 2
    for r in range(int(size / 2), 0, -1):
        alpha = int(255 * math.pow((1 - r / (size / 2)), 2.2))
        draw.ellipse([center - r, center - r, center + r, center + r], fill=(255, 255, 255, alpha))
    # Add cross flare
    for i in range(int(size * 0.8)):
        dist = abs(i - size * 0.4) / (size * 0.4)
        alpha = int(180 * (1 - dist))
        img.putpixel((int(center), int(size * 0.1 + i)), (255, 255, 255, alpha))
        img.putpixel((int(size * 0.1 + i), int(center)), (255, 255, 255, alpha))
    img = img.filter(ImageFilter.GaussianBlur(0.8))
    img.save(filename, 'PNG')
    print(f"Generated {filename}")

def create_editorial_image(filename, width=1200, height=800, theme="coast"):
    img = Image.new('RGBA', (width, height), (20, 24, 28, 255))
    draw = ImageDraw.Draw(img)
    
    if theme == "coast-1": # Amalfi coastal cliff & azure sea
        # Sky gradient
        for y in range(int(height * 0.55)):
            t = y / (height * 0.55)
            r = int(230 * (1 - t) + 180 * t)
            g = int(215 * (1 - t) + 195 * t)
            b = int(195 * (1 - t) + 215 * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        # Sea gradient
        for y in range(int(height * 0.5), height):
            t = (y - height * 0.5) / (height * 0.5)
            r = int(28 * (1 - t) + 12 * t)
            g = int(110 * (1 - t) + 55 * t)
            b = int(140 * (1 - t) + 80 * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        # Sun shimmer on water
        for _ in range(300):
            sx = int(random.gauss(width * 0.65, 120))
            sy = random.randint(int(height * 0.52), height - 20)
            if 0 <= sx < width:
                slen = random.randint(10, 60)
                draw.line([(sx - slen//2, sy), (sx + slen//2, sy)], fill=(245, 235, 200, random.randint(40, 160)), width=1)
        # Dramatic cliff on left
        cliff_points = [(0, int(height * 0.2))]
        for x in range(0, int(width * 0.55), 20):
            ny = int(height * 0.2 + (x / (width * 0.55)) ** 1.8 * height * 0.6 + random.randint(-15, 15))
            cliff_points.append((x, ny))
        cliff_points.extend([(int(width * 0.52), height), (0, height)])
        draw.polygon(cliff_points, fill=(62, 54, 46, 255))
        # Cliff textures & villa terraces
        for i in range(15):
            tx = random.randint(40, int(width * 0.4))
            ty = random.randint(int(height * 0.35), int(height * 0.75))
            draw.rectangle([tx, ty, tx + random.randint(30, 80), ty + random.randint(15, 40)], fill=(210, 195, 175, 200))
            draw.rectangle([tx + 5, ty - 8, tx + random.randint(15, 35), ty], fill=(180, 75, 55, 220)) # Terracotta roof
            
    elif theme == "coast-2": # Secluded cove sailing yacht
        for y in range(int(height * 0.45)):
            t = y / (height * 0.45)
            r = int(245 * (1 - t) + 210 * t)
            g = int(230 * (1 - t) + 200 * t)
            b = int(205 * (1 - t) + 190 * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        for y in range(int(height * 0.45), height):
            t = (y - height * 0.45) / (height * 0.55)
            r = int(18 * (1 - t) + 10 * t)
            g = int(85 * (1 - t) + 45 * t)
            b = int(115 * (1 - t) + 70 * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        # Twin headlands
        h1 = [(0, int(height * 0.35)), (int(width * 0.35), int(height * 0.55)), (0, height)]
        draw.polygon(h1, fill=(45, 42, 38, 255))
        h2 = [(width, int(height * 0.38)), (int(width * 0.6), int(height * 0.6)), (width, height)]
        draw.polygon(h2, fill=(55, 50, 42, 255))
        # Yacht silhouette in the cove
        yx, yy = int(width * 0.48), int(height * 0.58)
        draw.polygon([(yx - 35, yy + 5), (yx + 35, yy + 5), (yx + 25, yy + 14), (yx - 30, yy + 14)], fill=(240, 235, 225, 255))
        draw.line([(yx - 5, yy + 5), (yx - 5, yy - 45)], fill=(220, 215, 205, 255), width=2)
        draw.polygon([(yx - 5, yy - 40), (yx + 20, yy - 5), (yx - 5, yy - 5)], fill=(245, 240, 230, 210))

    elif theme == "alpine-1": # Karakoram alpine peaks & glacial sanctuary
        # Crisp alpine sky
        for y in range(height):
            t = y / height
            r = int(75 * (1 - t) + 185 * t)
            g = int(105 * (1 - t) + 205 * t)
            b = int(145 * (1 - t) + 225 * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        # Distant snow peaks
        pts_far = [(0, height)]
        for x in range(0, width + 40, 40):
            ny = int(height * 0.25 + math.sin(x * 0.008) * 120 + math.cos(x * 0.02) * 50)
            pts_far.append((x, ny))
        pts_far.append((width, height))
        draw.polygon(pts_far, fill=(220, 230, 242, 255))
        # Midground razor crags
        pts_mid = [(0, height)]
        for x in range(0, width + 30, 30):
            ny = int(height * 0.4 + math.sin(x * 0.012 + 1.2) * 140 + math.cos(x * 0.025) * 70)
            pts_mid.append((x, ny))
        pts_mid.append((width, height))
        draw.polygon(pts_mid, fill=(88, 96, 108, 255))
        # Foreground dark slate ridge with wooden refuge
        pts_fore = [(0, height)]
        for x in range(0, int(width * 0.75), 25):
            ny = int(height * 0.65 + (x / (width * 0.75)) * 120 + random.randint(-8, 8))
            pts_fore.append((x, ny))
        pts_fore.extend([(int(width * 0.75), height), (0, height)])
        draw.polygon(pts_fore, fill=(35, 40, 46, 255))
        # High altitude glass refuge cabin
        rx, ry = int(width * 0.3), int(height * 0.68)
        draw.rectangle([rx, ry - 25, rx + 65, ry + 10], fill=(18, 22, 26, 255))
        draw.rectangle([rx + 10, ry - 18, rx + 30, ry + 4], fill=(255, 215, 140, 230)) # Warm interior light
        draw.rectangle([rx + 36, ry - 18, rx + 56, ry + 4], fill=(255, 215, 140, 230))

    elif theme == "alpine-2": # Dolomites needle peaks at sunrise
        # Golden sunrise gradient
        for y in range(height):
            t = y / height
            r = int(240 * (1 - t) + 210 * t)
            g = int(140 * (1 - t) + 160 * t)
            b = int(110 * (1 - t) + 185 * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        # Towering limestone needles
        needles = [
            [(int(width * 0.2), height), (int(width * 0.32), int(height * 0.15)), (int(width * 0.42), height)],
            [(int(width * 0.4), height), (int(width * 0.52), int(height * 0.08)), (int(width * 0.65), height)],
            [(int(width * 0.62), height), (int(width * 0.72), int(height * 0.22)), (int(width * 0.85), height)],
        ]
        for poly in needles:
            draw.polygon(poly, fill=(185, 145, 130, 255))
        # Shadow side of needles
        for poly in needles:
            shadow_poly = [poly[1], (poly[1][0] + (poly[2][0]-poly[1][0])//2, poly[2][1]), poly[2]]
            draw.polygon(shadow_poly, fill=(105, 80, 85, 255))
        # Alpine mist layer
        for y in range(int(height * 0.6), int(height * 0.85)):
            a = int(120 * math.sin((y - height * 0.6) / (height * 0.25) * math.pi))
            draw.line([(0, y), (width, y)], fill=(245, 235, 230, a))

    elif theme == "sanctum-1": # Hegra & Petra carved sandstone canyon
        for y in range(height):
            t = y / height
            r = int(235 * (1 - t) + 190 * t)
            g = int(160 * (1 - t) + 110 * t)
            b = int(110 * (1 - t) + 70 * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        # Sandstone canyon walls on left and right
        c_left = [(0, 0), (int(width * 0.38), 0), (int(width * 0.28), height), (0, height)]
        draw.polygon(c_left, fill=(145, 75, 48, 255))
        c_right = [(width, 0), (int(width * 0.68), 0), (int(width * 0.78), height), (width, height)]
        draw.polygon(c_right, fill=(160, 85, 55, 255))
        # Carved monument in background center
        mx, my = int(width * 0.42), int(height * 0.35)
        mw, mh = int(width * 0.22), int(height * 0.45)
        draw.rectangle([mx, my, mx + mw, my + mh], fill=(195, 115, 75, 255))
        # Classical carved facade details
        draw.polygon([(mx - 10, my), (mx + mw + 10, my), (mx + mw//2, my - 40)], fill=(180, 100, 65, 255))
        draw.rectangle([mx + mw * 0.35, my + mh * 0.5, mx + mw * 0.65, my + mh], fill=(45, 25, 20, 255)) # Dark doorway
        # Sunbeam through canyon
        for y in range(height):
            draw.line([(int(width * 0.35 + y * 0.15), y), (int(width * 0.6 + y * 0.25), y)], fill=(255, 235, 190, 35))

    elif theme == "sanctum-2": # Kyoto bamboo shadow sanctuary
        for y in range(height):
            t = y / height
            r = int(35 * (1 - t) + 55 * t)
            g = int(50 * (1 - t) + 75 * t)
            b = int(45 * (1 - t) + 60 * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        # Bamboo stalks
        for _ in range(45):
            bx = random.randint(0, width)
            bw = random.randint(12, 36)
            col_g = random.randint(70, 130)
            draw.rectangle([bx, 0, bx + bw, height], fill=(int(col_g * 0.7), col_g, int(col_g * 0.6), 220))
            for seg in range(0, height, 90 + random.randint(-15, 15)):
                draw.line([(bx - 2, seg), (bx + bw + 2, seg)], fill=(30, 45, 30, 240), width=4)
        # Stone lantern in foreground
        lx, ly = int(width * 0.5), int(height * 0.55)
        draw.rectangle([lx - 30, ly, lx + 30, ly + 140], fill=(70, 75, 70, 255))
        draw.rectangle([lx - 45, ly - 50, lx + 45, ly], fill=(90, 95, 88, 255))
        draw.rectangle([lx - 20, ly - 40, lx + 20, ly - 10], fill=(255, 220, 130, 230)) # Glowing lantern core
        draw.polygon([(lx - 60, ly - 50), (lx + 60, ly - 50), (lx, ly - 85)], fill=(60, 65, 60, 255))

    elif theme == "twilight-1": # Patagonian fjord under starlight
        for y in range(height):
            t = y / height
            r = int(12 * (1 - t) + 24 * t)
            g = int(16 * (1 - t) + 38 * t)
            b = int(32 * (1 - t) + 64 * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        # Stars in upper half
        for _ in range(250):
            sx = random.randint(0, width)
            sy = random.randint(0, int(height * 0.5))
            sa = random.randint(100, 255)
            draw.point((sx, sy), fill=(240, 245, 255, sa))
        # Jagged granite peaks
        pts_m = [(0, int(height * 0.65))]
        for x in range(0, width + 50, 50):
            ny = int(height * 0.32 + math.sin(x * 0.007) * 90 + math.cos(x * 0.015) * 60)
            pts_m.append((x, ny))
        pts_m.extend([(width, int(height * 0.65)), (width, height), (0, height)])
        draw.polygon(pts_m, fill=(22, 28, 42, 255))
        # Serene reflective fjord lake
        for y in range(int(height * 0.65), height):
            t = (y - height * 0.65) / (height * 0.35)
            r = int(10 * (1 - t) + 8 * t)
            g = int(22 * (1 - t) + 16 * t)
            b = int(45 * (1 - t) + 32 * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        # Starlight reflection ripples
        for _ in range(80):
            rx = random.randint(int(width * 0.2), int(width * 0.8))
            ry = random.randint(int(height * 0.68), height - 10)
            draw.line([(rx - 15, ry), (rx + 15, ry)], fill=(120, 160, 210, 90), width=1)

    elif theme == "twilight-2": # Scottish Highlands misty glen & loch
        for y in range(height):
            t = y / height
            r = int(25 * (1 - t) + 40 * t)
            g = int(30 * (1 - t) + 45 * t)
            b = int(42 * (1 - t) + 55 * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        # Rolling mist hills
        for i, col in enumerate([(35, 42, 48), (28, 35, 40), (18, 24, 28)]):
            base_y = int(height * (0.35 + i * 0.18))
            pts = [(0, height)]
            for x in range(0, width + 40, 40):
                ny = int(base_y + math.sin(x * 0.005 + i) * 60)
                pts.append((x, ny))
            pts.extend([(width, height), (0, height)])
            draw.polygon(pts, fill=(*col, 255))
            # Mist streak
            for y in range(base_y - 20, base_y + 30):
                draw.line([(0, y), (width, y)], fill=(180, 195, 205, 25))

    elif theme == "curated-1": # Luxury sailing expedition
        for y in range(height):
            t = y / height
            draw.line([(0, y), (width, y)], fill=(int(210 - t*90), int(180 - t*60), int(150 - t*40), 255))
        # Sea
        draw.rectangle([0, int(height*0.5), width, height], fill=(16, 52, 70, 255))
        # Superyacht
        cx, cy = int(width*0.5), int(height*0.55)
        draw.polygon([(cx - 120, cy + 15), (cx + 140, cy + 15), (cx + 100, cy + 45), (cx - 100, cy + 45)], fill=(245, 242, 235, 255))
        draw.rectangle([cx - 40, cy - 25, cx + 50, cy + 15], fill=(230, 225, 215, 255))
        draw.line([(cx + 10, cy - 25), (cx + 10, cy - 70)], fill=(200, 195, 185, 255), width=3)

    elif theme == "curated-2": # Trans-Alps private train
        for y in range(height):
            t = y / height
            draw.line([(0, y), (width, y)], fill=(int(140 - t*60), int(165 - t*50), int(195 - t*40), 255))
        # Snow mountains
        draw.polygon([(0, int(height*0.6)), (int(width*0.4), int(height*0.2)), (int(width*0.8), int(height*0.7)), (width, int(height*0.5)), (width, height), (0, height)], fill=(225, 235, 245, 255))
        # Stone viaduct
        draw.rectangle([0, int(height*0.65), width, int(height*0.75)], fill=(50, 48, 46, 255))
        # Luxury midnight train
        draw.rectangle([int(width*0.2), int(height*0.61), int(width*0.8), int(height*0.65)], fill=(20, 28, 45, 255))
        for wx in range(int(width*0.22), int(width*0.78), 28):
            draw.rectangle([wx, int(height*0.62), wx + 16, int(height*0.64)], fill=(255, 215, 120, 240))

    elif theme == "curated-3": # Desert astronomical observatory
        for y in range(height):
            t = y / height
            draw.line([(0, y), (width, y)], fill=(int(15 - t*5), int(20 - t*5), int(35 - t*10), 255))
        # Stars & Milkyway arch
        for _ in range(400):
            sx = random.randint(0, width)
            sy = random.randint(0, int(height * 0.7))
            draw.point((sx, sy), fill=(255, 255, 255, random.randint(80, 255)))
        # Desert dune silhouette
        draw.polygon([(0, int(height*0.75)), (int(width*0.5), int(height*0.65)), (width, int(height*0.8)), (width, height), (0, height)], fill=(120, 55, 35, 255))
        # Bedouin luxury tent dome with warm light
        tx, ty = int(width*0.48), int(height*0.64)
        draw.ellipse([tx - 40, ty - 30, tx + 40, ty + 20], fill=(245, 180, 90, 240))
        draw.ellipse([tx - 35, ty - 26, tx + 35, ty + 18], fill=(255, 220, 130, 255))

    # Add slight editorial film grain & vignette
    img = img.filter(ImageFilter.GaussianBlur(0.4))
    img.save(filename, 'WEBP', quality=90)
    print(f"Generated {filename}")

def create_foreground_cutouts():
    # 1. Coastal foliage & sea cliff silhouette (pinned bottom)
    w, h = 1920, 600
    img_coast = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img_coast)
    
    # Rocky coastline base at bottom
    pts = [(0, h)]
    for x in range(0, w + 40, 40):
        # Higher cliff on left, tapering right
        ny = int(h * 0.45 + (x / w) * 220 + math.sin(x * 0.01) * 35 + random.randint(-8, 8))
        pts.append((x, ny))
    pts.extend([(w, h), (0, h)])
    draw.polygon(pts, fill=(18, 22, 24, 255))
    
    # Overhanging Mediterranean olive & cypress branches from bottom-left
    for branch_i in range(12):
        bx = random.randint(0, int(w * 0.35))
        by = random.randint(int(h * 0.3), int(h * 0.75))
        # Draw branch curve
        cur_x, cur_y = bx, by
        for seg in range(18):
            cur_x += random.randint(8, 25)
            cur_y -= random.randint(2, 14)
            draw.line([(bx, by), (cur_x, cur_y)], fill=(15, 18, 20, 255), width=max(1, 8 - seg//2))
            # Leaves
            for _ in range(4):
                lx = cur_x + random.randint(-15, 15)
                ly = cur_y + random.randint(-15, 15)
                draw.ellipse([lx - 8, ly - 4, lx + 8, ly + 4], fill=(22, 28, 26, 245))
    img_coast = img_coast.filter(ImageFilter.GaussianBlur(0.6))
    img_coast.save('nomad-and-nook/images/fg-coast.webp', 'WEBP', quality=92)
    print("Generated fg-coast.webp")

    # 2. Alpine stone pines & needle branches
    img_alpine = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img_alpine)
    # Ridge base
    pts = [(0, h)]
    for x in range(0, w + 40, 40):
        ny = int(h * 0.65 + math.sin(x * 0.008) * 45 + random.randint(-6, 6))
        pts.append((x, ny))
    pts.extend([(w, h), (0, h)])
    draw.polygon(pts, fill=(16, 20, 24, 255))
    # Alpine pine silhouettes rising
    for px in [int(w * 0.08), int(w * 0.18), int(w * 0.78), int(w * 0.88), int(w * 0.94)]:
        p_height = random.randint(int(h * 0.55), int(h * 0.85))
        draw.line([(px, h), (px, h - p_height)], fill=(12, 16, 20, 255), width=6)
        for layer in range(12):
            ly = h - p_height + layer * 28
            l_spread = int((layer / 12) * 90) + 15
            draw.polygon([(px, ly - 15), (px - l_spread, ly + 15), (px + l_spread, ly + 15)], fill=(18, 24, 26, 250))
    img_alpine = img_alpine.filter(ImageFilter.GaussianBlur(0.6))
    img_alpine.save('nomad-and-nook/images/fg-alpine.webp', 'WEBP', quality=92)
    print("Generated fg-alpine.webp")

    # 3. Ancient sandstone arch & monumental pillar
    img_sanctum = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img_sanctum)
    # Sandstone canyon bottom
    pts = [(0, h)]
    for x in range(0, w + 50, 50):
        ny = int(h * 0.7 + math.sin(x * 0.006) * 30 + random.randint(-4, 4))
        pts.append((x, ny))
    pts.extend([(w, h), (0, h)])
    draw.polygon(pts, fill=(28, 18, 14, 255))
    # Colossal ancient pillar on left
    draw.rectangle([int(w * 0.04), int(h * 0.15), int(w * 0.18), h], fill=(32, 20, 16, 255))
    draw.polygon([(int(w * 0.02), int(h * 0.15)), (int(w * 0.20), int(h * 0.15)), (int(w * 0.16), int(h * 0.10)), (int(w * 0.06), int(h * 0.10))], fill=(38, 24, 18, 255)) # Capital
    # Arch overhang extending across top
    arch_pts = [(0, 0), (int(w * 0.42), 0), (int(w * 0.35), int(h * 0.22)), (int(w * 0.12), int(h * 0.28)), (0, int(h * 0.35))]
    draw.polygon(arch_pts, fill=(26, 16, 12, 255))
    # Right framing rock face
    draw.polygon([(int(w * 0.85), int(h * 0.25)), (w, int(h * 0.1)), (w, h), (int(w * 0.82), h)], fill=(30, 18, 14, 255))
    img_sanctum = img_sanctum.filter(ImageFilter.GaussianBlur(0.6))
    img_sanctum.save('nomad-and-nook/images/fg-sanctum.webp', 'WEBP', quality=92)
    print("Generated fg-sanctum.webp")

    # 4. Twilight valley reeds & mountain firs
    img_twilight = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img_twilight)
    # Valley shore line
    pts = [(0, h)]
    for x in range(0, w + 40, 40):
        ny = int(h * 0.78 + math.sin(x * 0.01) * 20 + random.randint(-4, 4))
        pts.append((x, ny))
    pts.extend([(w, h), (0, h)])
    draw.polygon(pts, fill=(10, 14, 20, 255))
    # Lakeside reeds and grasses across bottom
    for rx in range(0, w, 8):
        rh = random.randint(int(h * 0.15), int(h * 0.38))
        bend = random.randint(-25, 25)
        draw.line([(rx, h), (rx + bend, h - rh)], fill=(14, 18, 26, 230), width=random.randint(2, 4))
    # Distant silhouetted cypress & fir trees on right
    for fx in range(int(w * 0.65), w, 45):
        fh = random.randint(int(h * 0.4), int(h * 0.7))
        draw.polygon([(fx, h - fh), (fx - 18, h), (fx + 18, h)], fill=(12, 16, 24, 255))
    img_twilight = img_twilight.filter(ImageFilter.GaussianBlur(0.6))
    img_twilight.save('nomad-and-nook/images/fg-twilight.webp', 'WEBP', quality=92)
    print("Generated fg-twilight.webp")

if __name__ == '__main__':
    create_noise_texture('nomad-and-nook/images/noise.png')
    create_star_particle('nomad-and-nook/images/particle-star.png')
    create_foreground_cutouts()
    
    # Editorial images
    create_editorial_image('nomad-and-nook/images/editorial-coast-1.webp', theme='coast-1')
    create_editorial_image('nomad-and-nook/images/editorial-coast-2.webp', theme='coast-2')
    create_editorial_image('nomad-and-nook/images/editorial-alpine-1.webp', theme='alpine-1')
    create_editorial_image('nomad-and-nook/images/editorial-alpine-2.webp', theme='alpine-2')
    create_editorial_image('nomad-and-nook/images/editorial-sanctum-1.webp', theme='sanctum-1')
    create_editorial_image('nomad-and-nook/images/editorial-sanctum-2.webp', theme='sanctum-2')
    create_editorial_image('nomad-and-nook/images/editorial-twilight-1.webp', theme='twilight-1')
    create_editorial_image('nomad-and-nook/images/editorial-twilight-2.webp', theme='twilight-2')
    create_editorial_image('nomad-and-nook/images/curated-1.webp', theme='curated-1')
    create_editorial_image('nomad-and-nook/images/curated-2.webp', theme='curated-2')
    create_editorial_image('nomad-and-nook/images/curated-3.webp', theme='curated-3')
    print("All image assets generated successfully.")
