# Mobile plan

Agreed direction (2026-11-11): Elysium works properly on phones for what players need away from a desk, and says plainly when something is for larger screens. Measured at 390×844 on the dev server unless noted; everything below gets a final check on a real iPhone (Safari) and an Android phone, as `plans/ios-safari-edges.md` describes.

## What phones get

| Tier | What | Meaning |
|---|---|---|
| **Made for phones** | Character creation (guided and classic), sheet viewing, loresheets (view and edit), dice, character images, play mode | Designed and tested at phone size; nothing needs pinching, hovering or a keyboard |
| **Works on phones** | Landing, login and signup, the overview and each game's home, Coterie/Pack/Cell, Settings, Friends, XP spending | Reads and works well; no special phone design beyond fixing what's broken |
| **Larger screens only** | Chronicles (the table, the list, invitations) during the beta | A clear page saying so, with a way to do what's possible (accept an invite, copy the link) |
| **Not on phones** | Printable sheet, the theme lab, the capture route | Print opens from a desktop; the dev tools are dev-only anyway |

Breakpoints stay as they are: phones below `md` (768px), tablets `md` to `lg`, desktops `desk:` (1024px and up with a mouse). Tablets use the phone layouts where it's simpler, and the drawer below `desk:`.

## Already done (vault-home, uncommitted)

- **Bottom tab bar removed.** Phones use the drawer from the top bar, which has every link the tab bar had. Main content lost its extra bottom padding.
- **Dice page.** On phones the tray comes first, then the three steppers in one row, the result, the check, Willpower reroll, reset and Roll, then the history. Everything down to Roll fits in 821px at 390×844; real Safari's toolbars may make that a short scroll.
- **Site navbar** switches to the menu below 1024px (committed, d654fc9).

## Shared groundwork (do first, it helps every page)

1. **Tap targets.** Classic creation has 326 controls smaller than 32px (the rating dots are 20px buttons). Rule: every control gets a 44px hit area on touch, without changing how it looks: an invisible `::before` that extends the hit area, applied with a `pointer-coarse:` variant. Do it once in `DotRating` and the kit, then re-run the count.
2. **Tooltips without hover.** `Explain` shows on hover or focus, as a 16rem box anchored left, which runs off the right edge near the screen's side. On touch: tap the term to open it as a small sheet anchored to the bottom of the screen (the Island pattern), tap anywhere to close. Desktop stays as it is.
3. **Hover-only features.** Anything that only reveals on hover needs a touch equivalent: the landing's clips (play when scrolled into view instead), the neutral tints (already shown while pressed), card actions that appear on hover.
4. **Page header on phones.** The `compact` PageHeader (made for the dice page) is a good default for all app pages on phones: smaller title, description hidden or shortened. Big titles cost a third of the first screen.
5. **Safe areas and the keyboard.** Fixed bars and sticky save buttons must stay clear of the home indicator and the on-screen keyboard. Use `env(safe-area-inset-bottom)` and test editing a field near the bottom of the page on the real phone.
6. **A phone check script.** Keep the survey script (overflow, small targets, page height per route) as `scripts/mobile-check.mts` so each phase ends with numbers rather than impressions. It runs against the capture routes and sample data, never the real account.

## Made for phones

### Character creation
- **Guided** (11 steps) already reads well. Fix: the step's fields are long forms; keep Next and Back fixed at the bottom of the screen (above the safe area), so players don't scroll to find them. Dot choices need the tap-target rule. Lists of merits and flaws become a searchable list with the choice opening in a bottom sheet.
- **Classic** is the full printed sheet: about 10,500px tall on a phone, with a section tab strip that scrolls sideways. Approach: one section at a time (the tabs choose which section shows instead of scrolling to it), sticky tabs under the top bar, and attributes and skills as a single column of name + dots rows, at least 44px tall each. Suggest Guided on phones, but keep Classic available.

### Sheet viewing
- Same section-at-a-time approach as Classic, read-only: Profile, Attributes, Skills, Disciplines/Gifts/Edges, Advantages, Notes. The portrait goes at the top as a header image, cropped with `object-top`.
- Ratings show as dots plus the number, so they're legible at small sizes.
- Actions (Play, Edit, Print) move to one menu button in the header; Print is hidden on phones.

### Play mode
- Probably the most used feature at a real table. Phone-first: the trackers (Health, Willpower, Hunger/Rage/Desperation, Humanity) as large tap rows at the top, the dice roller under them (it already has the phone order), conditions and notes below.
- Marking damage: tap a box to cycle empty → Superficial → Aggravated, as on desktop, but with a 44px box. Use the heavy haptic for Aggravated, as now.
- Check that the sheet dialog and play mode don't stack two scroll areas.

### Loresheets
- List: already a simple list on neutral ground; check the filter by game chips fit in one row (or scroll sideways).
- Editor: one column of fields; autosave status fixed in the top bar; long text fields grow with their content rather than scrolling inside a small box.

### Dice
- Done, pending a check on the real phone. Remaining: the 3D tray's frame rate on older phones (test an older iPhone or a mid-range Android; if it struggles, lower the shadow resolution and pixel ratio on phones).

### Character images
- The picker opens as a full-screen sheet on phones: the art library as a two-column grid, then Upload, which offers the camera and the photo library (an `accept='image/*'` input already does).
- The automatic 3:4 crop is fine for a start; a drag-to-position step is a later improvement.
- Drag-and-drop doesn't exist on phones: make sure the upload button is visible without it.

## Works on phones

- **Landing.** Check each section at 390px. The clips play on hover, which phones don't have: play the clip when its card is mostly on screen, one at a time, and show the poster otherwise. The cover's sides (previous/next character) are hidden on touch; swiping the cover should turn it, if it doesn't already.
- **Login and signup.** They fit (signup is 950px tall, a short scroll). Check the keyboard doesn't cover the submit button and autofill works in Safari and Chrome.
- **Overview (neutral).** The game cards stack; the drafts and loresheets panels follow. Check the count's unfold on touch and that each card's tap area is obvious.
- **Game homes.** The Vampire home leads with a large greeting and three stat tiles; on phones put the characters list first and fold the stats into one line. Werewolf's home is 1,734px tall; check its moon pieces don't push the characters too far down.
- **Coterie/Pack/Cell.** Use the List view on phones by default (Grid's framed cards are large); keep the switch.
- **Settings and Friends.** Simple forms; check spacing and that the haptics switch is easy to reach.
- **XP spending.** Each purchase as a row with its cost; the add dialog as a bottom sheet.

## Larger screens only

- **Chronicles.** Below `lg`, the chronicle pages show a short page: what the chronicle is, who's in it, and "The table needs a larger screen during the beta." Invitations can still be accepted, so a player can join from their phone and play on a laptop. Chronicles stays marked Soon in the navigation, as now.
- **Printable sheet.** Hide the Print action on phones; the page itself stays reachable.

## Order of work

1. Groundwork: tap targets, tooltips, the check script (the biggest win across every page).
2. Sheet viewing and play mode (used during sessions).
3. Character creation: Guided first, then Classic.
4. Loresheets and character images.
5. The "works on phones" pages, as one pass with the check script.
6. Chronicles' larger-screens page.
7. Real-device pass on iPhone and Android, then one PR.

Each step ends with the check script's numbers, screenshots at 390×844 and 768×1024, and a real-phone check for anything involving the keyboard, safe areas or the browser's toolbars.
