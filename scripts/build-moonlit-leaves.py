"""
Builds public/frames/moonlit-leaves.svg: the Moonlit forest frame, a dense
border of leaves from Irish woodland trees (sessile oak, hazel, holly, ivy,
downy birch, rowan) on a twisting vine, lit by cool moonlight.

The SVG is a 9-slice border image (300×300, slice 75): the top edge band is
drawn once and rotated for the other three, likewise the top-left corner.
Edges repeat along their length (`round`), so every leaf near a tile end is
also drawn wrapped onto the other end: the tiles meet without seams.

Run: python3 scripts/build-moonlit-leaves.py  (seeded, so the output is stable)
"""

import math
import random

SIZE, SLICE = 300, 75
EDGE = SIZE - 2 * SLICE  # length of one edge tile
rng = random.Random(7)

# ------------------------------------------------------------------ leaf shapes
# Each leaf is drawn base at (0, 0), tip at (0, -1); half-widths are sampled
# along t = 0..1 and joined into a smooth closed path.


def outline(half, n=56, asym=0.06):
    right, left = [], []
    for i in range(n + 1):
        t = i / n
        w = half(t)
        right.append((w * (1 + asym * math.sin(t * 9)), -t))
        left.append((-w * (1 - asym * math.sin(t * 7)), -t))
    pts = right + left[::-1]
    d = f'M{pts[0][0]:.3f} {pts[0][1]:.3f}'
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        d += f' Q{x0:.3f} {y0:.3f} {(x0 + x1) / 2:.3f} {(y0 + y1) / 2:.3f}'
    return d + 'Z'


def oak(t):  # sessile oak: 4–5 rounded lobes a side, short stalk
    env = 0.42 * math.sin(math.pi * min(1, t ** 0.85)) * (1.08 - 0.25 * t)
    lobes = 0.5 + 0.5 * abs(math.sin(math.pi * 4.6 * t + 0.4)) ** 0.55
    return env * lobes if t > 0.06 else 0.03


def hazel(t):  # rounded, doubly toothed, with a short point
    env = 0.5 * math.sin(math.pi * t) ** 0.62 * (1 - 0.22 * t)
    teeth = 1 + 0.05 * (1 - abs((t * 26) % 2 - 1)) + 0.03 * (1 - abs((t * 9) % 2 - 1))
    return env * teeth if t > 0.04 else 0.03


def holly(t):  # glossy, wavy, spined
    env = 0.36 * math.sin(math.pi * t) ** 0.85
    spine = 1 + 0.32 * max(0, math.cos(math.pi * 6 * t)) ** 6
    return env * spine


def birch(t):  # small, triangular-ovate, fine teeth
    env = 0.46 * math.sin(math.pi * t ** 0.8) ** 0.6 * (1 - 0.45 * t)
    return env * (1 + 0.04 * (1 - abs((t * 30) % 2 - 1))) if t > 0.05 else 0.02


def leaflet(t):  # one rowan leaflet: narrow, toothed
    return 0.17 * math.sin(math.pi * t) ** 0.8 * (1 + 0.06 * (1 - abs((t * 22) % 2 - 1)))


def ivy_path(n=120):
    # Ivy: five pointed lobes around a heart-shaped base (polar outline).
    cx, cy = 0, -0.48
    pts = []
    for i in range(n + 1):
        a = 2 * math.pi * i / n
        lobes = 0.62 + 0.38 * abs(math.cos(2.5 * (a - math.pi / 2))) ** 2.4
        notch = 1 - 0.32 * math.exp(-((a - math.pi / 2) % (2 * math.pi) - 0) ** 2 * 8)
        r = 0.5 * lobes * notch
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a) * 1.05))
    d = f'M{pts[0][0]:.3f} {pts[0][1]:.3f}'
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        d += f' Q{x0:.3f} {y0:.3f} {(x0 + x1) / 2:.3f} {(y0 + y1) / 2:.3f}'
    return d + 'Z'


SHAPES = {
    'oak': outline(oak),
    'hazel': outline(hazel),
    'holly': outline(holly, asym=0.02),
    'birch': outline(birch),
    'leaflet': outline(leaflet, n=30, asym=0.02),
    'ivy': ivy_path(),
}

# Greens of a wet Irish wood by moonlight: [edge shadow, body, light along the midrib]
PALETTE = {
    'oak': ('#14251a', '#2f4e31', '#58795a'),
    'hazel': ('#17291b', '#3a5a34', '#6b8c5e'),
    'holly': ('#08150d', '#16301f', '#3e6250'),
    'birch': ('#1d3220', '#4b6a3c', '#86a374'),
    'leaflet': ('#15271b', '#33553a', '#628666'),
    'ivy': ('#0b1a10', '#1c3826', '#4a6b55'),
}
MOON = '#cfe2e6'  # the cold rim light

defs = []
# Shapes once; every leaf is a <use> of one of them.
for name, d in SHAPES.items():
    defs.append(f'<path id="s-{name}" d="{d}"/>')
for name, (dark, body, light) in PALETTE.items():
    # Lighter along the midrib, darker toward the margin and the base.
    defs.append(
        f'<radialGradient id="g-{name}" cx="0" cy="-.55" r=".62" fx=".04" fy="-.62" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 -.55) scale(.62 1) translate(0 .55)">'
        f'<stop offset="0" stop-color="{light}"/><stop offset=".55" stop-color="{body}"/><stop offset="1" stop-color="{dark}"/></radialGradient>'
    )
# Soft shadows where leaves lie over one another.
defs.append('<filter id="shade" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.4" stdDeviation="1.6" flood-color="#000" flood-opacity=".75"/></filter>')


def leaf(kind, x, y, angle, length, layer):
    """One leaf at (x, y), pointing at `angle` degrees (0 = up), `length` units long."""
    s = length
    # Foreshortened and slightly skewed, as leaves turned at different tilts.
    sx = s * rng.uniform(0.62, 1.0)
    skew = rng.uniform(-10, 10)
    dim = ('', ' opacity=".78"', '')[layer]  # the back layer sits in shadow
    head = f'<g transform="translate({x:.1f} {y:.1f}) rotate({angle:.1f}) skewX({skew:.1f}) scale({sx:.1f} {s:.1f})"{dim}>'
    w = 1 / s
    if kind == 'rowan':
        out = [head, f'<path d="M0 .05L0 -1" stroke="{PALETTE["leaflet"][0]}" stroke-width="{1.1 * w:.3f}"/>']
        for j in range(4):
            ty = -0.2 - j * 0.2
            for side in (-1, 1):
                out.append(f'<use href="#s-leaflet" fill="url(#g-leaflet)" transform="translate(0 {ty:.2f}) rotate({side * rng.uniform(55, 70):.0f}) scale(.42)"/>')
        out.append('<use href="#s-leaflet" fill="url(#g-leaflet)" transform="translate(0 -.98) scale(.45)"/></g>')
        return ''.join(out)
    out = [head, f'<use href="#s-{kind}" fill="url(#g-{kind})"/>']
    # Moonlight along one margin (the side facing the moon), and the veins.
    out.append(f'<use href="#s-{kind}" fill="none" stroke="{MOON}" stroke-opacity="{0.2 if kind in ("holly", "ivy") else 0.14}" stroke-width="{0.9 * w:.3f}" clip-path="url(#lit)"/>')
    vein = PALETTE[kind][2]
    if kind == 'ivy':
        for a in (-64, -30, 0, 30, 64):
            out.append(f'<path d="M0 -.04L{0.38 * math.sin(math.radians(a)):.3f} {-0.05 - 0.42 * math.cos(math.radians(a)):.3f}" stroke="{MOON}" stroke-opacity=".3" stroke-width="{0.55 * w:.3f}"/>')
    else:
        out.append(f'<path d="M0 .04Q.025 -.5 0 -.93" fill="none" stroke="{vein}" stroke-opacity=".9" stroke-width="{0.7 * w:.3f}"/>')
        if kind in ('oak', 'hazel', 'birch', 'holly'):
            n = 5 if kind != 'holly' else 3
            for j in range(1, n + 1):
                ty = -0.82 * j / (n + 1) - 0.04
                for side in (-1, 1):
                    out.append(f'<path d="M0 {ty:.2f}Q{side * .12:.2f} {ty - .06:.2f} {side * .24:.2f} {ty - .16:.2f}" fill="none" stroke="{vein}" stroke-opacity=".55" stroke-width="{0.45 * w:.3f}"/>')
    if kind == 'holly':  # the glossy sheen
        out.append(f'<path d="M-.06 -.18Q-.1 -.5 -.03 -.8" fill="none" stroke="{MOON}" stroke-opacity=".35" stroke-width="{1.6 * w:.3f}" stroke-linecap="round"/>')
    out.append('</g>')
    return ''.join(out)


defs.append('<clipPath id="lit" clipPathUnits="objectBoundingBox"><rect x="-1" y="-1" width="1.5" height="3"/></clipPath>')

# ------------------------------------------------------------------ the edge tile
# The top edge: x from SLICE to SLICE + EDGE, outer edge at y = 0, inner at y = SLICE.
# The vine runs along y ≈ 40 (inside the border); leaves spill both ways.

KINDS = ['oak', 'oak', 'hazel', 'hazel', 'holly', 'ivy', 'ivy', 'birch', 'rowan']


def vine(x0, length, y, amp, phase):
    pts = [(x0 + length * i / 40, y + amp * math.sin(2 * math.pi * (i / 40) * 2 + phase)) for i in range(41)]
    d = f'M{pts[0][0]:.1f} {pts[0][1]:.1f}'
    for (a, b), (c, e) in zip(pts, pts[1:]):
        d += f' Q{a:.1f} {b:.1f} {(a + c) / 2:.1f} {(b + e) / 2:.1f}'
    return d


edge = []
# Two twisted stems (periodic: two full waves per tile, so ends meet).
for (y, amp, ph, col, wd) in ((44, 6, 0, '#2e2a16', 3.2), (40, 5, math.pi, '#3a3a1c', 2.2)):
    for k in (-1, 0, 1):
        edge.append(f'<path d="{vine(SLICE + k * EDGE, EDGE, y, amp, ph)}" fill="none" stroke="{col}" stroke-width="{wd}" stroke-linecap="round"/>')

leaves = []
for layer, count, size in ((0, 22, (30, 42)), (1, 18, (26, 38)), (2, 14, (20, 30))):
    for i in range(count):
        x = SLICE + EDGE * (i + rng.random() * 0.8) / count
        side = rng.choice((-1, 1))
        y = 40 + side * rng.uniform(1, 9)
        # Mostly along the band, some reaching outward.
        angle = rng.choice((90, -90)) + rng.uniform(-38, 38) + (side * -18)
        leaves.append((layer, rng.choice(KINDS), x, y, angle, rng.uniform(*size)))

for layer in (0, 1, 2):
    edge.append('<g filter="url(#shade)">')
    for (l, kind, x, y, angle, length) in leaves:
        if l != layer:
            continue
        for k in (-1, 0, 1):  # wrapped copies, so the tile repeats seamlessly
            edge.append(leaf(kind, x + k * EDGE, y, angle, length, layer))
    edge.append('</g>')

# ------------------------------------------------------------------ the corner
corner = []
for (y, amp, ph, col, wd) in ((44, 4, 0, '#2e2a16', 3.2),):
    corner.append(f'<path d="M{SLICE + 2} 44Q46 46 44 {SLICE + 2}" fill="none" stroke="{col}" stroke-width="{wd}" stroke-linecap="round"/>')
# Kept inside the corner tile (leaves crossing its edges would be cut), with
# the edges' wrapped leaves meeting it on both sides.
cluster = [
    ('oak', 62, 44, 95, 30, 0), ('oak', 44, 62, 175, 30, 0), ('hazel', 22, 34, -25, 30, 0), ('hazel', 34, 22, -65, 30, 0),
    ('ivy', 60, 24, -55, 26, 0), ('ivy', 24, 60, -35, 26, 0), ('oak', 64, 64, 135, 24, 0),
    ('holly', 36, 40, -45, 34, 1), ('oak', 52, 36, -100, 28, 1), ('oak', 36, 54, 10, 28, 1), ('rowan', 16, 50, -6, 28, 1), ('rowan', 50, 16, -84, 28, 1),
    ('birch', 62, 56, 130, 20, 1), ('birch', 56, 62, 140, 20, 1), ('ivy', 24, 24, -45, 24, 2), ('holly', 44, 44, -55, 24, 2), ('hazel', 58, 46, 115, 18, 2), ('hazel', 46, 58, 155, 18, 2),
]
for layer in (0, 1, 2):
    corner.append('<g filter="url(#shade)">')
    for (kind, x, y, a, s, l) in cluster:
        if l == layer:
            corner.append(leaf(kind, x, y, a, s, l))
    corner.append('</g>')
# Holly berries: a few red drops in the corners.
for (bx, by) in ((37, 35), (41, 31), (34, 30)):
    corner.append(f'<circle cx="{bx}" cy="{by}" r="3" fill="#7d1016"/><circle cx="{bx}" cy="{by}" r="2.6" fill="#a8161f"/><circle cx="{bx - 0.9}" cy="{by - 1}" r=".9" fill="#f0c4bc" opacity=".75"/>')

# ------------------------------------------------------------------ assemble
svg = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE}" height="{SIZE}" viewBox="0 0 {SIZE} {SIZE}">',
    '<defs>' + ''.join(defs),
    f'<clipPath id="edge-clip"><rect x="{SLICE}" y="0" width="{EDGE}" height="{SLICE}"/></clipPath>',
    f'<clipPath id="corner-clip"><rect x="0" y="0" width="{SLICE}" height="{SLICE}"/></clipPath>',
    f'<g id="edge" clip-path="url(#edge-clip)">' + ''.join(edge) + '</g>',
    f'<g id="corner" clip-path="url(#corner-clip)">' + ''.join(corner) + '</g>',
    '</defs>',
]
c = SIZE / 2
for rot in (0, 90, 180, 270):
    svg.append(f'<use href="#edge" transform="rotate({rot} {c} {c})"/>')
    svg.append(f'<use href="#corner" transform="rotate({rot} {c} {c})"/>')
svg.append('</svg>')

out = 'public/frames/moonlit-leaves.svg'
with open(out, 'w') as f:
    f.write(''.join(svg))
print(out, sum(len(s) for s in svg) // 1024, 'KB')
