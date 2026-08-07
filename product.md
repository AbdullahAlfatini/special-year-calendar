# My Special Year Calendar — Product Design Doc

**Author:** Senior Product Manager
**Status:** Draft v0.1
**Last updated:** 2026-08-07
**One-liner:** Turn your meaningful personal dates into a beautifully styled, poem-like scrollable year calendar enriched with warm AI notes.

---

## 1. The user & the moment

- **Who:** Someone reflecting solo on their upcoming year or gathering meaningful dates (birthdays, anniversaries, personal milestones) for a loved one.
- **When:** A quiet evening, sitting down to organize upcoming personal milestones, wanting to turn dates into a warm emotional visual artifact rather than a clinical productivity schedule.
- **Why now:** Standard calendar apps (Google Calendar, Outlook) feel like work and utility tools. No tool treats personal dates as poetic milestones for quiet reflection.

## 2. The contract (I/O)

- **Input:** A list of personal dates with an event title and brief personal note (e.g. "Oct 14 — Mom's 60th birthday, loves gardening").
- **Output:** A scrollable 12-month visual calendar where each personal date is illuminated with a custom 2-sentence warm AI poem/note and atmospheric visual motif.
- **The loop:** Enter dates → Tap "Generate My Year" → Unfold and scroll through the 12-month poem calendar → Reflect solo.

## 3. The magical moment

> "My whole year isn't just a list of tasks anymore — it's laid out like a poem."

## 4. Scope: what we ARE building (v1)

- Single-page web application with a date entry drawer/form (date selector + milestone title + optional detail).
- AI generation endpoint using Gemini structured JSON output to write a 2-sentence warm note per date.
- Vertical scrollable 12-month calendar grid with rich typography and glowing highlights on special dates.
- Interactive date inspection drawer/modal displaying the AI poem note and seasonal imagery.
- Local browser state persistence (`localStorage`) so added dates survive page reloads.

## 5. Scope: what we are NOT building

- **No user accounts or login** — device-local storage only, zero sign-up friction.
- **No Google Calendar / iCal sync** — avoids complex OAuth and sync edge cases in v1.
- **No backend database** — all state lives in browser local storage.
- **No notifications or email reminders** — this is a quiet reflection object, not a nagging alert system.
- **No social feed or public sharing server** — private by default.
- **No complex drag-and-drop or edit flows** — simple append/delete for entries.

## 6. The signature detail

**Poetic Date Cards**: When scrolling through months, personal dates glow with a subtle ambient warm ember effect. Tapping a date smoothly unfolds a glassmorphism parchment card with serif typography (*Lora*), displaying a bespoke 2-sentence poem written by Gemini that bridges the milestone to the season of the year.

## 7. Success: how we know it worked

- **Primary:** ≥60% of users who generate their calendar scroll through all 12 months and open at least 2 date cards in their first session.
- **Not measuring:** Signups, daily active users, app retention loops.

## 8. Open questions

- [ ] Can Gemini reliably return structured JSON notes for batch dates (up to 10 dates) in <3 seconds?
- [ ] How does the empty year calendar look on day 1 before any dates are added?

## 9. Handoff

- **For UX:** The transition from date input form to the 12-month calendar scroll must feel like unfolding an artistic manuscript.
- **For Eng:** Batching Gemini API prompt requests into a single structured JSON response to guarantee latency <3s.
