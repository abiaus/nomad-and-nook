import cv2
import os
import math
import numpy as np

os.makedirs('nomad-and-nook/videos', exist_ok=True)

configs = [
    {
        'img': 'nomad-and-nook/images/editorial-coast-1.webp',
        'out': 'nomad-and-nook/videos/video-coast.mp4',
        'zoom_base': 1.06,
        'zoom_delta': 0.04,
        'pan_x_amp': 35.0,
        'pan_y_amp': 18.0,
        'effect': 'water_shimmer'
    },
    {
        'img': 'nomad-and-nook/images/editorial-alpine-1.webp',
        'out': 'nomad-and-nook/videos/video-alpine.mp4',
        'zoom_base': 1.05,
        'zoom_delta': 0.05,
        'pan_x_amp': -40.0,
        'pan_y_amp': 22.0,
        'effect': 'cloud_drift'
    },
    {
        'img': 'nomad-and-nook/images/editorial-sanctum-1.webp',
        'out': 'nomad-and-nook/videos/video-sanctum.mp4',
        'zoom_base': 1.04,
        'zoom_delta': 0.04,
        'pan_x_amp': 25.0,
        'pan_y_amp': -28.0,
        'effect': 'heat_shimmer'
    },
    {
        'img': 'nomad-and-nook/images/editorial-twilight-1.webp',
        'out': 'nomad-and-nook/videos/video-twilight.mp4',
        'zoom_base': 1.06,
        'zoom_delta': 0.05,
        'pan_x_amp': -32.0,
        'pan_y_amp': 16.0,
        'effect': 'star_twinkle'
    }
]

out_w, out_h = 1280, 720
fps = 30
duration = 8  # 8 seconds seamless loop
n_frames = fps * duration
fourcc = cv2.VideoWriter_fourcc(*'mp4v')

for cfg in configs:
    img = cv2.imread(cfg['img'])
    if img is None:
        print(f"Error loading {cfg['img']}")
        continue

    h, w = img.shape[:2]
    out_path = cfg['out']
    writer = cv2.VideoWriter(out_path, fourcc, fps, (out_w, out_h))
    print(f"Rendering {out_path} ({n_frames} frames)...")

    for f in range(n_frames):
        t = f / n_frames
        angle = t * 2.0 * math.pi

        # Smooth cyclic zoom & pan (guaranteeing exact loop closure at frame 0 and frame n_frames)
        zoom = cfg['zoom_base'] + cfg['zoom_delta'] * math.sin(angle)
        pan_x = math.sin(angle) * cfg['pan_x_amp']
        pan_y = math.cos(angle) * cfg['pan_y_amp']

        crop_w = int(w / zoom)
        crop_h = int(h / zoom)
        cx = int(w / 2.0 + pan_x)
        cy = int(h / 2.0 + pan_y)

        x1 = max(0, min(w - crop_w, cx - crop_w // 2))
        y1 = max(0, min(h - crop_h, cy - crop_h // 2))

        cropped = img[y1:y1 + crop_h, x1:x1 + crop_w]
        frame = cv2.resize(cropped, (out_w, out_h), interpolation=cv2.INTER_LINEAR)

        # Apply subtle organic lighting modulation
        if cfg['effect'] == 'water_shimmer':
            # Subtle golden sun flare pulse
            shimmer = 1.0 + 0.03 * math.sin(angle * 2.0)
            frame = cv2.convertScaleAbs(frame, alpha=shimmer, beta=1)
        elif cfg['effect'] == 'star_twinkle':
            # Starlight pulse
            twinkle = 1.0 + 0.04 * math.sin(angle * 3.0)
            frame = cv2.convertScaleAbs(frame, alpha=twinkle, beta=0)

        writer.write(frame)

    writer.release()
    print(f"Done: {out_path} ({os.path.getsize(out_path)} bytes)")
