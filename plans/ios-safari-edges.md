# A page and iPhone Safari's bars

What a page can and can't do behind the status bar and toolbar on iPhone, for Elysium and other projects (the portfolio). The measurements below come from a real iPhone 14 Pro in Safari with the floating toolbar, 2026-11-04. Chrome's device emulation can't show any of this.

## What Safari does (measured)

The screen is 852pt tall. At rest (scroll 0):

| Region | y (pt) | What shows |
|---|---|---|
| Status bar | 0–59 | The page's background colour, flat. **Nothing a page paints gets here.** |
| The page's viewport | 59–754 | The page (`innerHeight`, `svh`, `dvh` = 695) |
| Behind the toolbar | 754–852 | In-flow content shows; fixed layers stop at 754 |

- Five ways of painting above the page's top all stopped at 59pt: fixed and absolute with a negative `top`, each with and without a composited layer, and a fixed layer overhanging the screen.
- `env(safe-area-inset-top)` and `-bottom` are **0**, even with `viewport-fit=cover`.
- `lvh` is 735, which at rest reaches 794pt, not the bottom of the screen.
- `theme-color` is ignored by Safari 26, but still matters for Chrome on Android and older Safari.
- Once scrolled, in-flow content runs under both bars. Fixed layers stay inside the viewport (59–794pt with the toolbar collapsed), and the status bar then shows what's scrolling under it.

Safari's user agent string says `OS 18_7` here; don't read the iOS version from it.

## The recipe

1. Give html and body the page's colour, server-rendered so it's right from the first paint. It fills the status bar.
2. To blend a full-screen scene with the bar, fade the scene's top edge into that exact colour. The bar then reads as part of the scene, with no seam. This is the best available at rest; a photo can't go behind the status bar.
3. Fill the area behind the toolbar with in-flow content, not fixed or sticky layers: the same colour, as a background on the hero's section, with the scene's foot fading into it.
4. Whatever follows the hero should start below 852pt on touch screens (`calc(100lvh + 4rem)`), or its edge shows behind the toolbar.
5. Keep controls above the toolbar: `calc(100lvh - 100svh)` of extra space at the foot of an `lvh` tall layer.
6. Use `[@media(hover:none)]` for these touch-only fades, so desktop is unchanged.
7. `safe-area-inset-*` is still worth using for fixed bars (it's non-zero in landscape and in an installed web app), as `top: max(gap, env(...))`.

## Safari's solid edge bars

Separately, WebKit can paint a solid bar over an edge. From `LocalFrameView::fixedContainerEdges` in WebKit's source (not measured on a device):
- It hit-tests the middle of each edge, 4px in, walks up to the first fixed or sticky ancestor that counts, and paints a bar in that element's background or a sampled colour.
- These don't count: hidden elements, empty ones, a negative z-index at viewport size, more than about 105% of the screen in the other direction, or less than 90% of its width.
- If it skipped a `pointer-events: none` layer and found nothing, it tries again beneath that layer.

So fixed bars are offset rather than padded to the edge, closed backdrops and click-through overlays are `visibility: hidden`, and a sticky full-screen stage has a transparent in-flow overlay above it. On one test the bottom bar appeared solid and on another it didn't; I don't know what toggles it, and matching colours makes it harmless either way.

## Testing

Use the real phone. Your dev server listens on the LAN, so a static file in `public/` opens at `http://<mac-ip>:<port>/file.html` with no deploy: coloured strips, one per method, plus a readout of `innerHeight`, `svh`, `lvh`, the safe areas and `scrollY`.

## Where Elysium does this

`app/layout.tsx` (viewport), `app/globals.css` (`--page-bg`), `app/(landing)/page.tsx` (server-rendered colour), `app/ui/landing/CoverPicker.tsx` (fades, section colour, overlay), `app/ui/landing/GamesSection.tsx` (start point), `app/ui/ThemeColor.tsx`.
