# My Special Year Calendar — UX Design Doc

**Designer:** Senior Product Designer
**Status:** Draft v0.1
**Last updated:** 2026-08-07

---

## 1. The design bet

We are betting that a single-page, vertically scrollable 12-month calendar grid with rich glassmorphism aesthetics and warm ambient glows carries the entire emotional weight of the product. We spend 80% of our UX effort making the month transition and date-unfold animation feel serene and paper-like, keeping controls unobtrusive.

## 2. The defining interaction

> User taps on a highlighted personal date (e.g. "Oct 14 — Mom's 60th"). The calendar cell expands softly with a warm amber glow. A glassmorphism parchment card smoothly glides upward, rendering a 2-sentence AI poem written in serif typography alongside a subtle seasonal particle effect. Tapping anywhere outside gently dismisses the card with a fade. Total time: ~400ms. Feels like: opening a handwritten letter tucked inside a keepsake journal.

## 3. Screen inventory

- **Main Calendar View (Single Page App)** — Vertical 12-month scrollable view with top sticky header, date entry panel trigger, and modal date viewer card.

## 4. Screen-by-screen specs

### Main Calendar View

**Purpose:** Provide a seamless, scrollable year overview where personal dates are highlighted like glowing embers among standard days.

**Layout (top to bottom):**
1. **Header Bar:** Subtle title ("My Special Year 2026"), current year selector, and a warm floating "+ Add Personal Date" action button.
2. **Date Input Drawer (Collapsible):** Expandable panel with date picker (`<input type="date">`), milestone title text field, context note field, and "Generate Poem Note" submit button.
3. **12-Month Calendar Grid:** Vertical stack of 12 month cards (January through December). Each month contains a 7-column day layout.
4. **Highlighted Milestone Cells:** Date cells with personal entries feature an amber glow, custom icon/emoji badge, and subtle pulse on hover.
5. **Poetic Date Modal Card:** Centered overlay card displaying the date, milestone title, seasonal badge, and the AI-generated 2-sentence poem note.

**Key interactions:**
- Tap "+ Add Personal Date" → Input drawer slides down smoothly from the header.
- Fill form & tap "Generate Poem Note" → Drawer button transitions to a soft pulsing shimmer ("Weaving your poem..."); once complete, the calendar auto-scrolls to the target month cell.
- Tap a highlighted date cell → Poetic Date Modal opens with a scale-up glassmorphism animation.
- Tap close button / background overlay → Modal fades out softly (200ms).

**States:**
- **Default:** Scrollable 12 months with any saved personal dates glowing softly.
- **Empty / first-time:** On first visit, January features a translucent sample highlight ("Oct 14 — Mom's 60th") with a soft helper tooltip: *"Tap + to add your first milestone"*.
- **Loading:** During Gemini API poem generation (~2s), the target date cell displays a warm pulsing shimmer effect with microcopy: *"Weaving your seasonal note..."*.
- **Error:** If API fails or offline, the date cell renders the date with a fallback default note: *"A special day held in quiet warmth"* and a subtle retry button.
- **Edge / "too much":** If a user adds >5 dates to a single month, the month header shows a compact summary count and date cells stack gracefully without breaking grid alignment.

## 5. The user journey

> User opens the app on a quiet evening. They are greeted by an atmospheric, warm dark canvas with a subtle amber vignette. The current year (2026) is laid out in 12 elegant month blocks. A glowing golden "+ Add Personal Date" button sits softly in the header.
>
> They tap "+ Add Personal Date", selecting "October 14", typing "Mom's 60th Birthday", and context "She loves gardening and autumn leaves". Upon tapping "Generate Poem Note", the input panel collapses, and the calendar smoothly auto-scrolls to October. October 14 begins to glow like an ember.
>
> Tapping October 14 opens a glassmorphism card featuring a golden leaf motif and a bespoke AI note: *"As October's leaves turn to gold, sixty years of warmth unfold in her garden of love."* The user smiles, closes the card, and scrolls through their poetic year.

## 6. Component & visual notes

- **Typography:** Display titles and AI poem text set in Google Font *Lora* (serif). Interface controls set in *Inter* (sans-serif) for high legibility.
- **Color:** Rich atmospheric dark background (`#121016`) paired with warm amber/gold glows (`#F59E0B`, `#FCD34D`), deep plum accents, and glassmorphic card overlays (`rgba(30, 26, 38, 0.75)` with `backdrop-filter: blur(12px)`).
- **Motion:** Smooth spring transitions (cubic-bezier `(0.16, 1, 0.3, 1)`). No sharp snapping; everything moves like soft paper or warm light.
- **The signature visual:** The **Ember Glow Date Cell** — personal dates do not look like busy event blocks; they look like glowing stars/embers set inside the calendar grid.
- **Microcopy voice:** Gentle, lowercase, warm, poetic. *"weaving your note..."*, *"your year in poetry"*, *"held in quiet warmth"*.

## 7. Accessibility & inclusion

- **Screen readers:** All calendar grid cells use semantic HTML `<button>` elements with clear `aria-label`s (e.g., `aria-label="October 14: Mom's 60th Birthday. Tap to read poem note"`).
- **Contrast & focus:** All text meets WCAG AA contrast ratio standards against dark glassmorphism backgrounds. Focus outlines utilize glowing golden rings.
- **Motion sensitivity:** Supports `@media (prefers-reduced-motion: reduce)` by disabling scale/slide animations and defaulting to instant fade transitions.

## 8. What we are NOT designing

- **No multi-page navigation** — single view keep-it-simple canvas.
- **No settings or preferences screen** — default dark warm theme is tuned out-of-the-box.
- **No complex drag-and-drop calendar reshuffling** — simple tap to view/delete.
- **No print layout wizard** — default browser print CSS provides clean 1-page paper styling.

## 9. Open design questions

- [ ] Should date cards include custom AI-generated SVG icons per season or standard seasonal emoji badges?
- [ ] Should the calendar allow filtering by category (e.g., Birthdays vs Milestones)?

## 10. Handoff to engineering

> The Ember Glow Date Cell and glassmorphism modal open animation must maintain a smooth 60fps frame rate on mobile web browsers. Ensure modal backdrop blur uses GPU-accelerated CSS properties (`transform: translateZ(0)`).
