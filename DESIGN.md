---
name: CrossFit Naga
description: The naga's temple staircase: deep lacquer green, cream paper, temple gilt ornament, one neon spark for action.
colors:
  lacquer: "#0c1a12"
  forest: "#11241a"
  pine: "#1a3d29"
  naga: "#466a41"
  naga-deep: "#3a5a36"
  sage: "#90a586"
  sage-lit: "#c3d5b2"
  cream: "#fbf7dc"
  cream-dim: "#d9dcc0"
  paper: "#f4efd2"
  paper-2: "#e9e3c1"
  ink: "#0f2016"
  ink-soft: "#2c4630"
  gold: "#c9a44c"
  neon: "#eef25c"
  neon-hot: "#f7fa8a"
typography:
  display:
    fontFamily: "\"Big Shoulders\", \"Kanit\", \"Anuphan\", system-ui, sans-serif"
    fontSize: "clamp(3.6rem, 10.5vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "\"Big Shoulders\", \"Kanit\", \"Anuphan\", system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6.2vw, 5.4rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.005em"
  title:
    fontFamily: "\"Big Shoulders\", \"Kanit\", \"Anuphan\", system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.1vw, 2.05rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.005em"
  body:
    fontFamily: "\"Anuphan\", system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "clamp(16px, 0.25vw + 15px, 18px)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "\"Anuphan\", system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "0.92rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.02em"
rounded:
  sm: "2px"
  md: "4px"
  pill: "999px"
  circle: "50%"
spacing:
  gutter: "clamp(20px, 4.2vw, 64px)"
  edge: "clamp(28px, 4vw, 64px)"
  section: "clamp(88px, 11vw, 168px)"
  nav-h: "72px"
components:
  button-primary:
    backgroundColor: "{colors.neon}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1.4em"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.neon-hot}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "rgba(251, 247, 220, 0.08)"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1.4em"
    height: "52px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1.4em"
    height: "52px"
  tag:
    backgroundColor: "{colors.neon}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.2em 0.6em"
---

# Design System: CrossFit Naga

## Overview

**Creative North Star: "The Naga's Staircase"**

The naga guards the stairs of every Thai temple, and this site is built as that staircase: a climb in named steps, the naga beside you the whole way up. The page runs in a lacquer-dark green that reads as temple wood at night, breaks into paper-cream bands for the practical sections (timetable, prices), and marks every stair-tread transition between bands with the same seven-notch diagonal cut that appears on the coach cards' slash mark. Gold is temple gilt, cut for ornament only, never for reading. One color is allowed to break the rule of restraint: the gym's own neon yellow, held back for the single action that matters (book a class) and for anything telling you where you are right now.

This is a climb, not a scroll. The right-edge rail tracks vertical progress like a staircase rail, its diamond stops lighting gold as you pass them and neon at the one you're on. The opening sequence literalizes the metaphor once: a lacquer-and-gold medallion spins to face you, then the camera dives through the open coil of the naga into the gym itself. The world refuses the default black-box gym site with a red CTA and stock athletes; every photo and video on the page is the real gym, in temple-inflected sage and gilt instead of gym-red.

**Key Characteristics:**
- Deep lacquer green and mid-sage green own the dark bands; cream paper owns the practical ones.
- Gold marks ornament and progress only: the medallion, the slash glyph, the climb rail.
- One neon spark, reserved for the primary action and for "you are here" / "this one's next" states.
- Condensed uppercase display type for every heading, name and number; a plain humanist sans for every sentence of reading.
- A single stepped diagonal seam, reused at every band change, on the coach photo's corner flag, and behind the coaches and Sathorn panels as a tiled scale arc.

## Colors

The palette is a temple-lacquer green scale carrying almost the whole page, cream and paper for the two reading-heavy bands, and two accents held to single jobs: gold for ornament, neon for action.

### Primary
- **Naga Green** (`#466a41`): the mid-tone brand green. Fills the Steps and Visit bands and the pricing tier cards; also the color of the naga mark itself.
- **Naga Deep** (`#3a5a36`): a darker step of the same green, used for the stair-step cards and the Thong Lo branch panel where Naga Green would be too light against cream text.

### Secondary
- **Temple Gilt** (`#c9a44c`): the ornament-only gold. Used on the medallion's lathed rim and its raised relief, the `///` slash glyph, and the climb rail's fill and passed-stop diamonds. It never colors body text or a button.

### Tertiary
- **Neon Spark** (`#eef25c`), hover **Neon Hot** (`#f7fa8a`): the gym's own sign color, held to the primary booking button and to live-state markers only: the timetable's next-class slot, the rail's current stop, the current nav link, text selection.

### Neutral
- **Lacquer** (`#0c1a12`): the page background and the hero/close band color; near-black green, the "temple at night" base.
- **Forest** (`#11241a`): one step lighter, the Coaches band.
- **Pine** (`#1a3d29`): media placeholder background behind videos and images before they load; also the medallion's lacquer face material.
- **Sage** (`#90a586`) / **Sage Lit** (`#c3d5b2`): muted mid-greens for secondary icons, chevrons, footer legal text, and the second line of the hero title.
- **Cream** (`#fbf7dc`): primary text and paper-panel white on dark bands.
- **Cream Dim** (`#d9dcc0`): body copy and captions on dark bands, dimmed a step below Cream.
- **Paper** (`#f4efd2`) / **Paper 2** (`#e9e3c1`): the Timetable and Prices band backgrounds and their card fills.
- **Ink** (`#0f2016`) / **Ink Soft** (`#2c4630`): text and button fills on the paper bands.

### Named Rules
**The One Spark Rule.** Neon yellow appears only on the primary booking action and on state markers that mean "now" or "next": the timetable's next-class slot, the rail's current stop, the current nav underline, `::selection`. Nowhere else on the page.

**Gilt Is Ornament Only.** Gold never fills a button, colors a paragraph, or marks a pressed or hover state outside the climb rail. Its jobs are the medallion, the slash glyph, and the rail's gold fill and passed-stop diamonds.

## Typography

**Display Font:** Big Shoulders (variable, weight 100 to 900), with Kanit as the Thai substitute and Anuphan then system-ui as fallback.
**Body Font:** Anuphan (variable, weight 100 to 700, Latin and Thai subsets), with system-ui, -apple-system, Segoe UI as fallback.

**Character:** Big Shoulders is a tall condensed athletic face, always set uppercase, carrying every heading, name and number on the page. Anuphan is a plain humanist sans that carries every sentence of reading copy and never goes uppercase.

### Hierarchy
- **Display** (900, clamp(3.6rem, 10.5vw, 6rem), line-height 0.88): the hero title and the closing section's "Book your first class" headline, uppercase, each line masked and sliding up on entrance.
- **Headline** (800, clamp(2.6rem, 6.2vw, 5.4rem), line-height 0.92): every section's `.h2` title, uppercase.
- **Title** (800, clamp(1.6rem, 2.1vw, 2.05rem) at this scale, up to clamp(2.4rem, 4vw, 3.6rem) for branch names): stair-step headings, class program names, branch names; uppercase.
- **Body** (400, clamp(16px, 0.25vw + 15px, 18px), line-height 1.6): all paragraph copy in Anuphan; Thai copy opens to line-height 1.75.
- **Label** (600 to 700, 0.78 to 0.95rem, letter-spacing 0.02 to 0.08em, often uppercase): nav links, buttons, tags, coach roles, chip filters, the timetable's "Today" badge.

### Named Rules
**Condensed Uppercase for Names, Plain Sans for Reading.** Anything that is a heading, a proper name, a number, or a short label is set in Big Shoulders, uppercase. Every sentence of reading copy is set in Anuphan, sentence case, never in the display face.

**Thai Swaps the Cut, Not the Voice.** `:lang(th)` moves `.h2`, `.hero__title`, `.close__title` and the name fields (program names, plan lengths, branch names) to Kanit at weight 800, tracking reset to normal and line-height opened to 1.15, because Big Shoulders has no Thai glyphs. The hierarchy and the uppercase rule stay the same.

## Layout

The page is a single column of full-bleed bands inside a `--maxw: 1320px` wrap with a fluid gutter (`clamp(20px, 4.2vw, 64px)`), stacked at a fluid section rhythm (`clamp(88px, 11vw, 168px)`). Bands alternate lacquer, forest, naga, and paper, and each change of color cuts a seven-notch diagonal seam (`--stair`, scaled by `--edge: clamp(28px, 4vw, 64px)`) into the top of the incoming band, undercutting the one before it.

The top nav is fixed at 72px, transparent over the hero video, going to an 82%-opacity lacquer bar with a 12px blur once the page scrolls past 40px, and hiding on scroll-down past 90% of viewport height (it reappears on any scroll-up). At 1180px and above, a fixed rail rides the right edge tracking scroll progress the length of the page; below that width it is not rendered. Below 700px, the nav's own booking button is replaced by a floating two-button dock pinned above the safe-area inset, shown once the visitor has scrolled 75% of a viewport height past the top and hidden again near the closing section.

Classes splits into a 1.15fr/0.85fr two-column grid with a `position: sticky` media stage on the right that crossfades to match whichever program is open; under 860px this collapses to one column and the stage becomes an inline media block under each open program instead. The coach carousel is a horizontal snap-scroll strip, card width `clamp(270px, 27vw, 372px)`, its padding matched to the page gutter so the first and last cards align with the wrap. The timetable is a 7-column grid on desktop and a day-tab single column under 980px.

## Elevation & Depth

The page is flat by default: almost nothing carries a box-shadow, and depth comes from solid color blocking between bands, the stepped clip-path seam at each band change, and two pieces of true 3D (the coach carousel's CSS perspective tilt and the intro's extruded medallion). Three floating elements are the exception, each carrying a soft drop-shadow because they sit over other content rather than in the flow of a band.

### Shadow Vocabulary
- **rail-rider-drop** (`filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6))`): under the small naga mark that rides the climb rail at scroll position.
- **emblem-drop** (`filter: drop-shadow(0 30px 50px rgba(0,0,0,0.5))`): under the rotated naga emblem beside the closing headline.
- **dock-lift** (`box-shadow: 0 10px 30px -10px rgba(0,0,0,0.6)`): under the fixed mobile CTA dock.

### Named Rules
**Flat Except the Floating Marks.** No card, tile, button, or band carries a shadow. Shadows exist only on the three elements above, each one riding over the page rather than sitting in it.

## Shapes

Corner radius is a single 4px token (`--radius`) used on buttons, cards, tiles, chips' inner elements, and the map embed. The two departures are round icon buttons (`50%`) and pill-shaped filter chips (`999px`). The recurring form language is diagonal, not curved: the coach photo carries a skewed cream flag in its top corner, the `///` slash glyph marks every section header and the media stage, the seven-notch stair seam cuts every band transition, and a naga-scale arc pattern (three overlapping arcs, tiled) sits low-opacity behind the Coaches band and the Sathorn "opening soon" card.

### Named Rules
**The Stair-Step Seam.** Any time one band meets a different-colored band, the seam is the same seven-notch diagonal cut (`var(--stair)`), scaled by `--edge`. It is the site's only transition device between bands, and it is not used anywhere a band meets itself.

## Components

### Buttons
- **Shape:** 4px radius, pill-free rectangular, min-height 52px (60px `--lg`, 42px `--sm`), horizontal padding `1.4em`.
- **Primary (`.btn--neon`):** neon fill, ink text, the only button carrying the spark color; reserved for "Book a class." Hovers to Neon Hot.
- **Ghost (`.btn--ghost`):** 8%-opacity cream fill with a 1.5px cream inset ring and a 6px backdrop blur, used over video and photo for the LINE chat action.
- **Secondary:** `.btn--ink` (ink fill, cream text, hovers to Pine) and `.btn--line-ink` (transparent, ink outline) on paper bands; `.btn--cream` (solid cream) on green cards.
- **Hover / Focus:** the trailing arrow icon slides 3px right on hover (fine-pointer devices only); every button scales to 0.97 on press; the focus ring is a 2px neon outline offset 3px, switching to ink on the paper and closing bands.

### Chips (filter pills)
- **Style:** 999px pill, ink-toned inset ring on the paper background, a small rotated-square dot in the class category color.
- **State:** `aria-pressed="true"` fills the chip ink with cream text; unpressed chips gain the ink ring on hover only.

### Cards / Panels
- **Corner Style:** 4px.
- **Background:** Naga Deep for the stair-step cards and the Thong Lo branch card; Lacquer for the last stair step and the Sathorn "opening soon" card; Paper 2 for the three lower pricing tiers, Naga Green for the top tier.
- **Shadow Strategy:** none, per Elevation & Depth.
- **Border:** none; adjacent panels separate by color contrast alone.
- **Internal Padding:** 24 to 40px, scaling with a per-card `--i` custom property that also staggers stair-step and pricing-tier heights into a rising line.

### Navigation
- **Style:** fixed top bar, transparent-to-solid-lacquer on scroll, hides on scroll-down past 90vh.
- **Typography:** Label scale at weight 500, an animated 2px neon underline drawing in on hover and on the current section.
- **Mobile (< 960px):** nav links and the wordmark's text hide behind a menu button that opens a full-screen lacquer sheet; sheet links are Display-scale and stagger in on open.
- **Signature: the climb rail (≥ 1180px).** a vertical line on the right edge, gold fill tracking scroll progress, diamond stop markers per section that go gold once passed and neon at the current one, with a small naga glyph riding at the exact scroll position.

### Signature Component: The Medallion Intro
A canvas overlay (`.intro`) plays once per session before the page: a lacquer-green disc (`MeshPhysicalMaterial`, clearcoat 1) with a gold lathed rim (`metalness 1, roughness 0.28`) and a cream raised relief of the naga and wordmark (`metalness 0.35, roughness 0.38`) spins into frame, then the camera dives toward the open loop of the naga's coil. A CSS radial mask (`--ox`, `--oy`, `--open` custom properties, driven from the camera's projected screen position each frame) opens the page through that same point, so the dive and the reveal are the same motion. `prefers-reduced-motion` and a missing WebGL context both skip straight to the page.

## Do's and Don'ts

### Do:
- **Do** reserve neon yellow for the primary booking action and for any "you are here" or "this one's next" marker (timetable's next-class slot, rail's current stop, nav's current link).
- **Do** use the stepped stair clip-path (`var(--stair)`) for every band-to-band color change; it is the only transition device between bands.
- **Do** set every heading, proper name, and numeral in the display face, uppercase; keep every sentence of reading copy in Anuphan, sentence case.
- **Do** hold every rectangular surface to a 4px radius; round only icon buttons (circle) and filter chips (pill).
- **Do** draw icons as 2px-stroke line glyphs from the page's own inline `<symbol>` sprite; never a third-party icon font or filled glyph.

### Don't:
- **Don't** give gold a second job. It never colors body text, fills a button, or marks a hover or pressed state outside the climb rail.
- **Don't** add a shadow to a card, tile, or button. The only shadows on the page are the rail-rider mark, the closing emblem, and the mobile dock.
- **Don't** apply the hero's green color-grade (`mix-blend-mode: color` over the video) to any other photo or video; it is reserved for the hero background so the coaches, mosaic, and stage media stay true color.
- **Don't** curve a corner past 4px, except the two named exceptions (round icon buttons, pill chips).
