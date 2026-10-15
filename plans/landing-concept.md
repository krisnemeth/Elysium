# Landing page concept (ticket #39 / THI-37)

Status: concept only. `/` is untouched. Two first-screen directions, each with the opening scroll handover into the first section, live under `/concept/landing` (A) and `/concept/landing/b` (B). A small switcher (bottom right, top right on phones) flips between them; it is review-only. Code: `app/concept/landing/` (`page.tsx`, `b/page.tsx`, `landing.css`, `layout.tsx`, `Footer.tsx`, `Switcher.tsx`). `/concept/landing` is added to `DARK_ONLY_PATHS` so a saved light theme never flashes.

Check in with the owner: pick A, B or a mix before any section is built out.

## The two directions

Both open on the same promise ("A vault for the creatures of the dark."), give the three games exactly equal weight, and hand over to the same first section ("Three games. One night.").

**A. Three doors.** One dim night city (`public/locations/location-53.webp`) behind a centred headline, and three tall arches of identical size, one per game, bleeding off the bottom edge like doorways. Greyscale art with a faint game-colour tint at the base; hover/focus brings colour back and lights the arch ring in the game's colour (crimson, moss green, amber). The logo sits inside each arch. Calm, symmetrical, ceremonial: the front door of a product. On phones the arches become three narrow tall slits that fill the screen below the headline.

**B. The vigil.** One wide establishing shot (`public/art/city-night.webp`), the name set very large in the lower-left with the italic tagline, and the three games as an equal three-column strip along the bottom (Roman numeral, logo, one line each, a game-colour rule that grows on hover). Cinematic and editorial, closer to a film poster or a book title page. The art does the talking; the games are a quiet index.

Trade-off: A shows the characters (the product's subject) straight away and is the safer "equal weight" read. B is the more atmospheric and more "premium", but the three games are present as typography only until you scroll.

## Typography

- Display: Cormorant Garamond 500, tight tracking, balanced wrapping, italic for the second voice ("creatures", the tagline). Already the site's display face, so there is no new font cost.
- Body and UI: Josefin Sans 300/400/600. Eyebrows in uppercase at 0.34em tracking, small.
- Marks: the official World of Darkness and game logos (SVG, currentColor) are the only "logotype" moments; headlines never imitate them.
- Scale: fluid with `clamp()`, `text-wrap: balance` on headings, `pretty` on paragraphs. Text sits on darkened art with a text-shadow and a veil gradient so contrast stays above 4.5:1 over the brightest regions.
- Open question for the owner: a licensed display face for the wordmark would add polish; Cormorant is the free stand-in.

## Motion choreography

Opening sequence (CSS only, once, about 1.5 s): the scene settles (scale 1.12 to 1, fade in), then the logo, headline, buttons and games rise in staggered order; the doors in A arrive last, left to right.

Scroll (CSS scroll-driven animations on the pinned stage, 0 to 100svh):
- A: the background pushes in and dims; the head blurs and lifts away; the three doors lift at different speeds (parallax); from about 50svh the next section rises over the stage on a curved edge with a hairline highlight, so the doors disappear behind it. Then the section's own elements reveal on entry.
- B: the camera pushes in (scale 1 to 1.4, dimming and softening), the title lifts away, the strip drops out; a second scene (`public/acts/hook.webp`) wipes up from the bottom edge via `clip-path` while sitting on its own slow parallax; the three portrait cards then sit over it.

Everything moving is inside `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: scroll())`. Without them the stage is static and its extra 100svh of pin height collapses (no dead scroll). Hover effects only on `(hover: hover)`. No JavaScript drives any animation.

## Which art gets swapped in from brand-assets/

The concept uses what is in `public/`. Swaps for the real build (all from the Dark Pack asset pack, cropped per breakpoint):
- A backdrop: a wide, high-resolution night-city or rooftop location, exported at 2880 px wide (current one is 2400).
- A doors: three official character illustrations at 3:5 or taller with the subject in the upper two thirds: a Kindred, a Garou in war form, a hunter. The current hunter art is a headless torso crop and the werewolf is cropped to the head on phones, so better source art matters most here.
- B hero: a cleaner establishing shot; current `city-night.webp` is 2000 px and soft on a 2x phone.
- B second scene: a location with a lit building (a mansion or cathedral), 2400 px.
- Per-game accents (optional): official clan/tribe/creed symbols as small marks in the strip.

Provide separate art-directed crops (`<picture>`/`object-position`) rather than one image for all widths.

## Performance plan

- LCP is the backdrop image: `preload` via `next/image` (AVIF/WebP), correct `sizes`, one hero image per direction; game art is above the fold in A so the first door is preloaded too.
- No new dependencies and no JS animation; scroll effects run on the compositor (transform, opacity, clip-path, filter on a few layers).
- No layout shift: every image has fixed boxes (`fill` in aspect/height-defined parents), fonts load with `display: swap` through `next/font`, the sticky stage height is fixed in svh.
- Film grain is a 160 px inline SVG tile; blur filters are limited to the scroll-out of the hero.
- Target: LCP under 2.0 s on mid-range mobile (4G), CLS 0, INP unaffected. Measure with Lighthouse on the real build before sign-off. Keep total hero image weight under about 400 KB.
- Below the fold images are lazy.

## Accessibility

Dark only, as the other site pages. Headings in order (one h1, then h2 per section). Whole-card links carry an `aria-label` ("Enter Vampire: The Masquerade"); decorative layers are `aria-hidden`. Visible focus rings on every link. All motion is off under `prefers-reduced-motion`. Dark Pack notice, the not-official line and the link are rendered verbatim from `app/lib/dark-pack.ts` in the footer.

## Section-by-section plan for building it out (one at a time, check in after each)

1. First screen and handover (this concept, once a direction is chosen). Swap in brand-assets art, tune crops at 320, 390, 768, 1024, 1440, 1920 and ultrawide; add the real navbar behaviour and Lighthouse pass.
2. The three games ("Three games. One night."): one equal chapter per game with a signature detail each (a clan symbol row, the tribe glyphs, the creed marks) and the dashboard's two rooms named. Curated, not a feature list.
3. Rooms: the six atmospheres reduced to a directed sequence (one pinned scene per game that crossfades between its two rooms as you scroll) instead of a six-tile grid.
4. Dice: one hero moment: the 3D tray (`app/ui/dice3d/`) lazy-loaded when it enters the viewport, a single roll that plays once, with static official die art as the fallback and for reduced motion.
5. The vault: one framed product shot of a sheet and play mode (real UI at proper resolution), cross-game characters in a short row of portraits.
6. Closing call and footer: one line, one button, Dark Pack notices unchanged; page-level fade to the footer.

Cut from the current page: the portrait scroller, the two-column "cross" section and the six-tile atmosphere grid in their current form (curation over quantity).

## Review notes

Screenshots (desktop 1440x900 and phone 390x844, scroll positions 0, 25, 50, 80, 120, 170 % of the viewport height) are in the session scratchpad: `shots/landing-concept/`.
