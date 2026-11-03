# Landing page concept (ticket #39 / THI-37)

Status: concept only. `/` is untouched. Two first-screen directions live under `/concept/landing` (A) and `/concept/landing/b` (B); after their own first section both run the live landing's sections at full length (`Sections.tsx`: Inside Elysium, any character across games, the six themes, the dice, the final call) and its footer. A small switcher (bottom right, top right on phones) flips between them; on B a second one swaps the cover character (`?cover=trixx`). Both are review-only. Code: `app/concept/landing/` (`page.tsx`, `b/page.tsx`, `Sections.tsx`, `landing.css`, `layout.tsx`, `Footer.tsx`, `Switcher.tsx`). `/concept/landing` is added to `DARK_ONLY_PATHS` so a saved light theme never flashes.

Owner feedback (2026-10-28): A's direction is good, especially the parallax; B should resemble the original cover. Check in again with both at full length before building `/`.

## The two directions

Both open on the same promise ("A vault for the creatures of the dark."), give the three games exactly equal weight, and hand over to the same first section ("Three games. One night.").

**A. Three doors.** One dim night city (`public/locations/location-53.webp`) behind a centred headline, and three tall arches of identical size, one per game, bleeding off the bottom edge like doorways. Greyscale art with a faint game-colour tint at the base; hover/focus brings colour back and lights the arch ring in the game's colour (crimson, moss green, amber). The logo sits inside each arch. Calm, symmetrical, ceremonial: the front door of a product. On phones the arches become three narrow tall slits that fill the screen below the headline.

**B. The cover** (reworked 2026-10-30 as a copy of the original 2023 hero from the `legacy` branch, `HomePageArt.tsx` + `WelcomeText.tsx`, as `/vampire` rebuilt it; since 2026-11-03 a character picker, `b/CoverPicker.tsx`, data in `b/covers.ts`). Six cut-out characters, one per theme, stand in a ring: Masquerade (`public/art/cover-ventrue.webp`, red, the official Ventrue clan symbol), Moonlit forest (`cover-garou-2.webp`, the red-haired woman, green with the ember accent, the Glass Walkers glyph `public/werewolf/glass-walkers-mark.png`), the hideout (`cover-hunter.webp`, amber, the dice flame), Neon Nights (`cover-neon-close.webp`, the violet-haired woman cropped mid-thigh up from `cover-neon.webp` so she stands as close as the others, violet with the neon pink accent, the Malkavian clan symbol), the cave (`cover-garou.webp`, the bearded man, warm brown and orange, the claw marks from the Werewolf dice `public/dice/glyphs/wta-claw.svg`) and Hunter's second scene (`cover-hunter-2.webp`, the scarred man; amber for now, until the city theme replaces the inn). The ring order alternates games, so the three logos under the navbar are always three different games: the chosen one in the middle, larger and at full opacity, its neighbours smaller and dimmer either side. Choosing a side logo turns the ring one step: the logos slide one place (the chosen one into the middle, a new one in at the far edge), the character slides the same way and fades, and the next one slides in from the chosen side, with the theme's scene, glow and mark crossfading in. Colours follow the in-app themes (`app/games.css`, `globals.css`). The whole character fits between the logo row and the bottom of the screen; no visible title (the h1 is screen-reader only). Tagline and buttons at the foot: "Create a character" and "Learn more" (a down arrow; glides to the next section), both ghost buttons lit by the chosen scene's light (`.lc-btn-glow`, `--lc-scene-glow` on `<html>`); while the cover shows, the navbar's call to action takes the same style (`html[data-lc-cover]` over SiteIsland's `data-site-cta`). Hand-over (2026-11-03): the cover holds its stage (one sticky screen) for a full screen of scrolling while the next section (`b/GamesSection.tsx`, `-mt-[100svh]`) covers it completely, then the page scrolls on; three ways it can take over (moonrise, iris, slash; `landing.css`, timings from the portfolio's `src/lib/reveal.ts`) are compared in the lab at `/concept/landing/lab`; B uses moonrise until one is chosen. The logos, characters, marks, backdrop and spines all run on one clock (`--pick-*` in `landing.css`); the motion is "depth" (chosen 2026-11-03 over "track" and "baton" in a lab, since removed): logos travel furthest, marks less, characters least, sinking back and blurring as they leave. All six stay mounted so the art is loaded before it's picked; under reduced motion the swap is instant. `?cover=<theme id or game>` opens on that cover (ids in `covers.ts`). The provenance of the six portraits isn't recorded yet; note it before shipping.

**Spines (2026-11-03), the same for every character:** the 16 official clan symbols down the left, the 11 tribe glyphs down the right (CSS masks over `public/werewolf/*.png`), each column as long as its list. Hunter has no marks in the packs.

**Scenes and weather (2026-11-03):** each cover stands in its theme's scene (`scene` in `covers.ts`: Masquerade `city-night.webp`, Neon Nights an alley under an arched bridge (`location-1.webp`, the pack's Locations1), the forest `ww-forest.webp`, the cave `ww-cave.webp`, the hideout `htr-den.webp` mirrored, Hunter's second `location-3.webp`), darkened and washed in the theme's colour, sliding a little with the picker. Over it, WebGL weather (`b/Atmosphere.tsx`, `fx` in `covers.ts`), one canvas behind the character and one in front, every particle's path computed in its vertex shader: on both Vampire scenes black smoke rolling up off the floor and in from the sides, its thin edges catching the theme's light, thinning away before it reaches the middle of the screen (a swirl round the Neon Nights character was tried and dropped); the Moonlit forest's low fog drifting across, with a few slow painted leaves (an atlas drawn once on a canvas: six shapes, nine autumn colours, veins and blight; each leaf cupped and curled, lit by the moon across its curve with light through it from behind, the nearest a little out of focus), twigs and grit tumbling past in 3D; the cave only a faint dusty fog; Hunter's steam rising, and on the hideout a curl of smoke from the match. The call to action's glow (resting and hover) is the scene's light (`glow`: Masquerade red, Neon Nights violet, the forest's moonlit green, the cave's fire, the hideout's lamp), and the next section's glow and rim follow the chosen cover. The weather fades with the picker and thins out during the hand-over; it isn't loaded under reduced motion and stops drawing once the cover has scrolled away.

Asset pack findings for per-game marks: Werewolf has plenty (tribe and auspice glyphs, already in `public/werewolf/`, and ~42 other glyphs: Luna, Gaia, Garou Nation, First Change, Crinos, Rage, Wyrm, Caern…). Hunter has none beyond its logo and the dice symbols (flame, flame-critical, the "!" overreach); there are no creed symbols in either pack. Vampire also has the Anarch/Camarilla/Sabbat marks and the clan symbols.

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
- B: the backdrop, character and mark stay pinned for 160svh; the mark rises 8svh and brightens over the first 70svh (`lc-mark-rise`, with the global `ankh-wake` glow), the character recedes (`portrait-recede`), the cover text fades by 26svh, and the first section slides up over the character on a rounded edge (negative margin, no animation needed).

Everything moving is inside `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: scroll())`. Without them the stage is static and its extra 100svh of pin height collapses (no dead scroll). Hover effects only on `(hover: hover)`. No JavaScript drives any animation.

## Which art gets swapped in from brand-assets/

The concept uses what is in `public/`. Swaps for the real build (all from the Dark Pack asset pack, cropped per breakpoint):
- A backdrop: a wide, high-resolution night-city or rooftop location, exported at 2880 px wide (current one is 2400).
- A doors: three official character illustrations at 3:5 or taller with the subject in the upper two thirds: a Kindred, a Garou in war form, a hunter. The current hunter art is a headless torso crop and the werewolf is cropped to the head on phones, so better source art matters most here.
- B cover: a cut-out version of the cover character (transparent background) so the mark can sit behind the head as a halo; Claire's and Trixx's portraits are 700–735 px wide, soft on large screens. Their provenance is not recorded (see the image-library note), so check it before shipping either.
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
