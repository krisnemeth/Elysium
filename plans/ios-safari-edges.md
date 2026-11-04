# Letting the page run under iPhone Safari's bars

How to make a page's own background (art, animation) show behind the status bar and the toolbar on iPhone, and pick the bar colour where it doesn't. Written for Elysium; nothing here is specific to it, so other projects (the portfolio) can follow the same steps.

## How Safari decides (iOS 26)

- `<meta name="theme-color">` is **ignored** by Safari 26. It still matters for Chrome on Android and for Safari before iOS 26.
- With `viewport-fit=cover`, the page is laid out under the status bar and toolbar, and by default Safari shows it there (with its soft edge blur).
- Safari paints a **solid bar** over an edge instead when it finds a fixed container at that edge. The rule, from WebKit's `LocalFrameView::fixedContainerEdges` (Source/WebCore/page/LocalFrameView.cpp):
  - It hit-tests one point per edge: the middle of the edge, 4px in (`fixedContainerSampleRectMargin`). The hit test ignores `pointer-events: none` at first, so those elements count.
  - From the element it hits, it walks up the ancestors to the first `position: fixed` or `sticky` one that counts as a container.
  - That element **doesn't count** when it is:
    - `visibility: hidden` or `opacity: 0` (nearly transparent);
    - empty, meaning no background, no backdrop filter, no children;
    - viewport-sized with a **negative z-index**;
    - more than about **105% of the screen** along the other side, e.g. taller than the screen for the top edge;
    - less than 90% of the screen's width, so a narrow pill doesn't count.
  - It **does count** otherwise, and the walk stops there. The bar's colour is the container's background colour, or a colour sampled from a 2px strip of the page at the edge. When the container is the same as last time, Safari keeps the old colour, so the bar freezes in the colour it had at load.
  - A fixed full-screen layer with a translucent background and no children counts as a dimming layer, such as an open menu backdrop.
  - **Second pass:** if no container is found and the last fixed layer it skipped has `pointer-events: none`, Safari hit-tests again, this time honouring `pointer-events`, so it reaches what's underneath that layer. A transparent, click-through fixed overlay (weather, grain, glow) above a sticky hero therefore leads Safari to the hero's stage anyway. Hide such overlays with `visibility: hidden` while they're off; the hit test doesn't see hidden elements at all.
- With no container, the area outside the page (overscroll) shows the html/body background colour.

## The recipe

1. `viewport-fit=cover` in the viewport (Next: `export const viewport = { viewportFit: 'cover' }`).
2. Give html/body the page's colour, set from the first paint, i.e. server-rendered rather than set in an effect.
3. Keep fixed bars **off** the edges: position them with `top: max(0.5rem, env(safe-area-inset-top))` (or `bottom: …inset-bottom`), not `top: 0` plus padding. A bar padded to the edge is a fixed container at the edge.
4. Menu or dialog backdrops that stay mounted: `visibility: hidden` when closed, not just `opacity: 0`. Transition `opacity, visibility` so the fade still runs. A closed backdrop inside a fixed bar would otherwise lead the walk up to the bar.
5. Full-screen fixed backgrounds or effects: use a negative z-index (Elysium's `Ambience` uses `-z-10`), or let them overhang the screen (`inset: -6lvh 0`). If they're click-through and may sit over a sticky element, also give them `visibility: hidden` whenever they aren't showing (see the second pass above).
6. A sticky full-screen stage (scroll-driven heroes) is a container too. Put a transparent, `pointer-events: none` overlay above it, `absolute inset-0` in the section that holds it. Safari then hits the overlay, which has no fixed or sticky ancestor.
7. To reach the bottom of the screen, a hero has to be `100lvh` tall, not `svh` or `dvh`. With Safari 26's floating tab bar, `dvh` stops at its top. Keep its controls clear with `calc(100lvh - 100svh)` of extra space at the foot, and start whatever follows at `100lvh`, or it shows behind the toolbar instead.
8. Want a solid colour on purpose? Put a fixed element with that background at the edge.

## Where Elysium does this

- `app/layout.tsx` (viewport), `app/globals.css` (`--page-bg` on html/body), `app/ui/ThemeColor.tsx` (theme-color for other browsers)
- `app/ui/SiteIsland.tsx`, `app/ui/dashboard/PhoneIsland.tsx`, `app/ui/dashboard/sidenav.tsx` (bars offset from the edges)
- `app/ui/kit/Island.tsx` (backdrop hidden when closed)
- `app/ui/landing/CoverPicker.tsx` (lvh stage, the overlay, the page colour), `app/(landing)/page.tsx` (the colour server-rendered), `app/ui/landing/landing.css` (`.lc-bx-weather` overhangs)

## Checking without an iPhone

`scratchpad`-style check, run in the page (Chrome at phone size is enough; it emulates the rule, not Safari): hit-test `(innerWidth / 2, 4)` and `(innerWidth / 2, innerHeight - 4)`, first with `pointer-events` overridden to `auto` on everything, then honouring it if the walk skipped a click-through fixed layer, and walk up the ancestors applying the rules above. Any fixed or sticky container it reports means a solid bar there. Real-device testing still has the last word.

Not yet checked: the chronicle table's `ActBackdrop` (fixed, full-screen, no negative z-index) probably gets solid bars; it's a game screen with its own bars, so it was left alone.
