"""Enhance project photos for the portfolio.

Reads originals from source-images/ (gitignored) and writes web-ready JPEGs to
assets/projects/. Re-run any time:  python3 tools/enhance_images.py

Pipeline (per photo, settings in PHOTOS below):
  1. light denoise        - soften phone noise / JPEG blocking before upscaling
  2. white balance        - partial grey-world correction (strength per photo)
  3. levels               - stretch luminance between the 0.5% / 99.5% percentiles
  4. tone curve           - gentle S-curve, lifted blacks, soft highlight roll-off
  5. theme grade          - slightly calmer saturation, a touch of warmth (cream page)
  6. upscale              - to >= 2x on-screen size for sharp Retina display
  7. sharpen              - unsharp mask tuned for the upscale
  8. vignette             - subtle edge darkening to draw focus to the subject
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source-images"
OUT = ROOT / "assets" / "projects"

# Photo frames are ~433 CSS px wide on desktop (~866 device px on Retina) and
# full-width (~343-800 px) on phones, so 1400 px on the long edge covers both.
TARGET_LONG_EDGE = 1400

DEFAULTS = dict(denoise=0.5, wb=0.5, contrast=1.10, saturation=0.94,
                warmth=0.012, vignette=0.10, sharpen=90)

PHOTOS = {
    # file stem: overrides
    "gpu-immersion-cooling": dict(wb=0.35),                    # keep green PCB + blue glove true
    "clp-inspection-robot-1": dict(wb=0.65, contrast=1.12),    # fluorescent lab light: stronger cast fix
    "clp-inspection-robot-2": dict(wb=0.65, contrast=1.12),
    "underwater-rov-1": dict(wb=0.2, saturation=0.97),         # warm wood table is part of the look
    "underwater-rov-2": dict(wb=0.5, denoise=0.7),             # small, noisy phone shot
    "generator-power-monitor-1": dict(wb=0.55, denoise=0.6),
    "generator-power-monitor-2": dict(wb=0.5, denoise=0.6),
    # CAD render: no grading or vignette, just a clean upscale on pure white
    "robotic-arm-cad": dict(render=True),
}


def to_float(img):
    return np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0


def to_image(arr):
    return Image.fromarray((np.clip(arr, 0, 1) * 255 + 0.5).astype(np.uint8))


def luminance(a):
    return a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722


def denoise(img, amount):
    if amount <= 0:
        return img
    soft = img.filter(ImageFilter.GaussianBlur(0.8))
    return Image.blend(img, soft, amount * 0.5)


def white_balance(a, strength):
    # Grey-world on mid-tones only (ignores clipped highlights / deep shadows)
    y = luminance(a)
    mask = (y > 0.15) & (y < 0.85)
    if mask.sum() < 1000:
        return a
    means = a[mask].mean(axis=0)
    gains = means.mean() / np.maximum(means, 1e-4)
    gains = 1 + (gains - 1) * strength
    return a * gains


def levels(a, lo_pct=0.5, hi_pct=99.5, max_gain=1.10):
    y = luminance(a)
    lo, hi = np.percentile(y, [lo_pct, hi_pct])
    lo = min(lo, 0.06)                       # set the black point, but never crush shadows
    gain = min(1 / max(hi - lo, 1e-3), max_gain)  # bright (high-key) shots barely get brighter
    a = (a - lo) * gain
    # soft shoulder: anything heading past 0.9 is eased in instead of clipping
    knee = 0.9
    over = np.clip(a - knee, 0, None)
    return np.where(a > knee, knee + (1 - knee) * (1 - np.exp(-over / (1 - knee))), a)


def tone_curve(a, contrast):
    a = np.clip(a, 0, 1)
    # S-curve around mid-grey, then lift blacks a little and roll off highlights
    s = 0.5 + (a - 0.5) * contrast
    s = s - (contrast - 1) * 0.5 * (a - 0.5) ** 3 * 4  # soften the extremes
    return 0.015 + np.clip(s, 0, 1) * (0.985 - 0.015)


def grade(a, saturation, warmth):
    y = luminance(a)[..., None]
    a = y + (a - y) * saturation
    a[..., 0] *= 1 + warmth
    a[..., 2] *= 1 - warmth
    return a


def vignette(a, amount):
    if amount <= 0:
        return a
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) / np.sqrt(2)
    falloff = 1 - amount * np.clip((d - 0.45) / 0.55, 0, 1) ** 2
    return a * falloff[..., None]


def upscale(img):
    scale = TARGET_LONG_EDGE / max(img.size)  # up for small photos, down for large ones
    size = (round(img.width * scale), round(img.height * scale))
    return img.resize(size, Image.LANCZOS)


def process(path):
    stem = path.stem
    cfg = {**DEFAULTS, **PHOTOS.get(stem, {})}
    img = ImageOps.exif_transpose(Image.open(path))

    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        bg = Image.new("RGB", img.size, "white")
        bg.paste(img, mask=img.split()[-1])
        img = bg
    img = img.convert("RGB")

    if cfg.get("render"):
        img = upscale(img)
        img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=70, threshold=1))
    else:
        img = denoise(img, cfg["denoise"])
        a = to_float(img)
        a = white_balance(a, cfg["wb"])
        a = levels(a)
        a = tone_curve(a, cfg["contrast"])
        a = grade(a, cfg["saturation"], cfg["warmth"])
        img = upscale(to_image(a))
        img = img.filter(ImageFilter.UnsharpMask(radius=1.8, percent=cfg["sharpen"], threshold=2))
        img = to_image(vignette(to_float(img), cfg["vignette"]))

    out = OUT / f"{stem}.jpg"
    # 4:4:4 chroma keeps coloured wires and PCB edges crisp; metadata not copied
    img.save(out, "JPEG", quality=86, optimize=True, progressive=True, subsampling=0)
    return out, img.size


if __name__ == "__main__":
    for src in sorted(SRC.iterdir()):
        if src.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"):
            out, size = process(src)
            print(f"{src.name:34s} -> {out.relative_to(ROOT)}  {size[0]}x{size[1]}")
