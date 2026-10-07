"""Make converted SVGs recolourable.

- Black and the brand reds become currentColor, so Tailwind text colours apply.
- White details become var(--knockout, #fff), so they can be recoloured too
  (e.g. set --knockout to the page background for a cut-out look).
- Files drawn only in white treat the white as the shape (currentColor).

Files that still contain other colours are listed so they can be checked by hand.
"""
import pathlib
import re
import sys

ATTR = re.compile(r'(fill|stroke)="rgb\(\s*([\d.]+)%\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)"')


def replace(match: re.Match) -> str:
    prop = match.group(1)
    r, g, b = (float(x) for x in match.groups()[1:])
    if max(r, g, b) <= 15 or (r >= 40 and g <= 30 and b <= 30):  # black or red
        return f'{prop}="currentColor"'
    if min(r, g, b) >= 95:  # white
        return f'style="{prop}:var(--knockout,#fff)"'
    return match.group(0)


root = pathlib.Path(sys.argv[1])
for path in sorted(root.rglob('*.svg')):
    text = ATTR.sub(replace, path.read_text())
    if 'currentColor' not in text:
        # Drawn entirely in white (a "for dark backgrounds" variant): the white
        # is the shape itself, not a detail.
        text = re.sub(r'style="(fill|stroke):var\(--knockout,#fff\)"', r'\1="currentColor"', text)
    path.write_text(text)
    others = sorted(set(m.group(0) for m in ATTR.finditer(text)))
    if others or '<image' in text:
        print(f'CHECK {path}: {others[:6]}{" +raster" if "<image" in text else ""}')
