# Landing page concepts (#39)

Static mockups of the landing's first screen, made 2026-10-09 with official
Dark Pack art (exported from `brand-assets/` as WebP) and the inlined official
logos. Desktop-first (1440×790), placeholder copy (see the copy review, #38).
Open the HTML files in a browser, e.g. `python3 -m http.server` in this folder.

## Decisions

- **Hero: concept A, reversed** (`chosen-hero-a.html`). A cinematic title card:
  one full-bleed painting (Scenes 24, mirrored so the figures stand on the
  right), type on the left in the fog: the World of Darkness mark, "Your
  coterie. Your pack. *Your cell.*", the three game logos along the bottom
  and a thin title-card frame. When built, the painting slowly crossfades
  through one scene per game ("I / III") so all three get equal weight.
- **Concept C, "the city", as a section further down** (`chosen-section-city.html`).
  The skyline (Locations 43) with each game pinned to a district like a map
  callout: Vampire in the old town, Werewolf at the waterfront, Hunter in the
  towers. Not the hero.

## Alternatives (not chosen)

- `alternatives/a.html`: A with the type on the right.
- `alternatives/b.html`: three doors, each game in its card silhouette
  (gothic arch, standing stone, instant photo).
- `alternatives/d.html`: an editorial "monograph" cover around a close-up face.

## Art used

| File | Source (brand-assets/…/Illustrations) |
|---|---|
| `a-hero.webp` | Scenes 24 |
| `c-city.webp` | Locations 43 |
| `d-face.webp` | Scenes 83 |
| `v.webp`, `w.webp`, `h.webp` | Scenes 81, 23, 65 |

Next: build the hero for real on a branch, then the other sections one at a
time, checking in after each.
