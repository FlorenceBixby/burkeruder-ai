// Reunion Gazette — standalone Worker serving reunion.burkeruder.ai.
// Deliberately its own tiny Worker, not a route inside the main Next.js site: it needs to
// feel like a different publication, not another page in the ocean-themed portfolio. Talks
// to the existing /api/reunion Pages Function on burkeruder.ai (CORS already open) rather
// than duplicating that backend — this Worker is presentation only, no D1 binding of its own.

const API_BASE = "https://burkeruder.ai/api/reunion";
const REUNION_YEAR = 2027;

// Calendar months polled — JS month index (0-based): June=5, July=6.
// August came off the board once the committee ruled it out.
// A day's pick is stored as { "2027-06-15": "yes" } — only selected days are ever sent,
// which fits the existing /api/reunion contract (picks is just Record<string, Vote>, any
// string key up to 40 chars).
const MONTHS = [
  { year: REUNION_YEAR, month: 5, name: "June" },
  { year: REUNION_YEAR, month: 6, name: "July" },
];

// This page renders family-submitted names and notes into the DOM, so the response
// carries a real CSP as a second line of defence behind the escaping: script and style
// sources are pinned, and connect-src limits where the page could ever send data.
const API_ORIGIN = new URL(API_BASE).origin;
const CSP = [
  "default-src 'none'",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  `connect-src ${API_ORIGIN}`,
  "img-src 'self' data:",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = {
  "Content-Security-Policy": CSP,
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== "/" && url.pathname !== "/index.html") {
      return new Response("Not found", { status: 404, headers: SECURITY_HEADERS });
    }
    return new Response(PAGE, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        ...SECURITY_HEADERS,
      },
    });
  },
};

const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Reunion Gazette — ${REUNION_YEAR} Family Edition</title>
<meta name="robots" content="noindex">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23fff'/%3E%3Crect x='8' y='8' width='16' height='16' fill='none' stroke='%23111' stroke-width='3' transform='rotate(45 16 16)'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #FFFFFF;
  --bg-soft: #F6F6F4;
  --ink: #111111;
  --muted: #6B6B6B;
  --rule: #111111;
  --line: #DDDDDD;
  --win: #1D6B3A;
  --loss: #B3261E;
  --heat: 17, 107, 58;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Inter', -apple-system, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
  position: relative;
  font-feature-settings: 'tnum' 1;
}
.wrap { max-width: 900px; margin: 0 auto; padding: 0 20px 100px; }

/* Scroll-linked read-through bar. Decorative: starts at scaleX(0) but the page never
   depends on it moving. */
.scroll-progress {
  position: fixed; top: 0; left: 0; right: 0; height: 3px; background: var(--ink);
  transform: scaleX(0); transform-origin: 0 50%; z-index: 50;
}

/* ── MASTHEAD ────────────────────────────────────────────── */
.masthead-bar {
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  gap: 12px; padding: 22px 0 16px;
}
.masthead-bar .wordmark { grid-area: wm; justify-self: start; }
.masthead-bar .published-by { grid-area: pub; justify-self: center; }
.masthead-bar .edition-pill { grid-area: pill; justify-self: end; }
.published-by {
  font-size: 0.7rem; letter-spacing: 0.04em; color: var(--muted);
  text-align: center; white-space: nowrap;
}
.published-by a {
  color: var(--ink); font-weight: 700; text-decoration: none;
  border-bottom: 1px solid var(--line); padding-bottom: 1px;
}
.published-by a:hover { border-bottom-color: var(--ink); }
.published-by a:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

/* Too much for one line on a phone — the byline drops to its own centred row. */
@media (max-width: 640px) {
  .masthead-bar {
    grid-template-columns: auto auto;
    grid-template-areas: "wm pill" "pub pub";
    row-gap: 10px;
  }
}
@media (min-width: 641px) {
  .masthead-bar { grid-template-areas: "wm pub pill"; }
}
.wordmark { display: flex; align-items: center; gap: 9px; color: var(--ink); }
.wordmark .mark {
  width: 20px; height: 20px; border: 2px solid var(--ink);
  transform: rotate(45deg); flex-shrink: 0;
}
.wordmark span { font-weight: 700; font-size: 1.05rem; letter-spacing: -0.01em; }
.edition-pill {
  font-size: 0.68rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 5px 12px;
}
.rule-double { border-top: 2px solid var(--ink); border-bottom: 1px solid var(--ink); height: 3px; }

.masthead { padding: 30px 0 6px; text-align: center; }
.masthead-date {
  font-family: 'Source Serif 4', Georgia, serif; font-style: italic; font-size: 0.95rem;
  color: var(--muted); margin-bottom: 10px;
}
.masthead h1 {
  font-family: 'Source Serif 4', Georgia, serif; font-weight: 700;
  font-size: clamp(2rem, 6.5vw, 3.1rem); line-height: 1.05; letter-spacing: -0.01em;
}
.masthead-tag { font-size: 0.8rem; color: var(--muted); margin-top: 10px; }
.rule-thin { height: 1px; background: var(--ink); margin-top: 22px; margin-bottom: 0; }

/* ── GATE ────────────────────────────────────────────────── */
.gate { max-width: 400px; margin: 56px auto; text-align: center; }
.gate p { font-size: 0.9rem; line-height: 1.7; color: var(--muted); margin-bottom: 20px; }
.gate input {
  width: 100%; padding: 13px 16px; font-family: inherit; font-size: 0.95rem;
  letter-spacing: 0.03em; text-align: center;
  background: var(--bg-soft); border: 1.5px solid var(--ink); color: var(--ink); outline: none; border-radius: 4px;
}
.gate button, .btn {
  font-family: inherit; font-weight: 600; letter-spacing: 0.01em;
  font-size: 0.85rem; padding: 13px 20px; background: var(--ink); color: #fff;
  border: none; cursor: pointer; width: 100%; margin-top: 12px; border-radius: 4px;
  transition: opacity 0.15s;
}
.gate button:hover, .btn:hover:not(:disabled) { opacity: 0.82; }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.gate-error { color: var(--loss); font-size: 0.82rem; margin-top: 12px; display: none; }
.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

/* ── SECTIONS ────────────────────────────────────────────── */
#app { display: none; }
/* Visible by default — the inView reveal below is a bonus effect, never a requirement.
   #app starts as display:none until the async family-code check resolves, so a section
   already in the initial viewport can miss its IntersectionObserver callback entirely and
   get stuck at opacity 0 forever if visibility depended on that firing. */
.section { margin-top: 48px; opacity: 1; }
.section-head {
  display: flex; align-items: baseline; gap: 12px; border-bottom: 2px solid var(--ink); padding-bottom: 8px; margin-bottom: 20px;
}
.section-head h2 {
  font-family: 'Source Serif 4', Georgia, serif; font-weight: 700;
  font-size: clamp(1.3rem, 4vw, 1.6rem);
}
.section-head .kicker {
  font-size: 0.72rem; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--muted); margin-left: auto;
}
.lede {
  font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(1rem, 2.4vw, 1.15rem); line-height: 1.6;
  color: var(--muted); max-width: 640px;
}
.lede strong { color: var(--ink); font-weight: 700; }
.dateline {
  font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.78rem;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink);
  margin-right: 4px; white-space: nowrap;
}

/* ── WHO-YOU-ARE CARD ────────────────────────────────────── */
.whoami {
  background: var(--bg-soft); border: 1px solid var(--line); border-radius: 8px; padding: clamp(16px,3vw,24px);
  margin-bottom: 28px;
}
.field { margin-bottom: 14px; }
.field:last-child { margin-bottom: 0; }
.field label, .field-legend {
  display: block; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.03em;
  text-transform: uppercase; color: var(--muted); margin-bottom: 6px;
}
.field input, .field textarea {
  width: 100%; padding: 11px 13px; font-family: inherit; font-size: 0.92rem;
  background: #fff; border: 1.5px solid var(--line); color: var(--ink); outline: none; resize: vertical; border-radius: 4px;
}
.field input:focus, .field textarea:focus { border-color: var(--ink); }
.field-hint { font-size: 0.75rem; color: var(--muted); margin-top: 6px; }

/* ── ATTENDEE LIST ───────────────────────────────────────── */
.attendees { display: flex; flex-direction: column; gap: 8px; }
.att-row { display: flex; align-items: center; gap: 8px; overflow: hidden; }
.att-num {
  width: 22px; flex-shrink: 0; text-align: right;
  font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: 0.85rem; color: var(--muted);
}
.att-row input { flex: 1; min-width: 0; }
.att-remove {
  flex-shrink: 0; width: 34px; height: 38px; border: 1.5px solid var(--line); background: #fff;
  border-radius: 4px; cursor: pointer; color: var(--muted); font-size: 1rem; line-height: 1;
  font-family: inherit;
}
.att-remove:hover { border-color: var(--loss); color: var(--loss); }
.att-remove[data-locked="1"] { visibility: hidden; }
.att-add {
  margin-top: 10px; font-family: inherit; font-size: 0.8rem; font-weight: 600;
  background: none; border: 1.5px dashed var(--line); border-radius: 4px;
  padding: 9px 14px; cursor: pointer; color: var(--ink);
}
.att-add:hover { border-color: var(--ink); border-style: solid; }

/* ── CALENDAR PICKER ─────────────────────────────────────── */
.cal-months { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; max-width: 620px; }
@media (max-width: 680px) { .cal-months { grid-template-columns: 1fr; max-width: 320px; margin: 0 auto; } }
.cal-month-name { font-weight: 700; font-size: 0.85rem; text-align: center; margin-bottom: 10px; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
.cal-weekday { font-size: 0.6rem; color: var(--muted); text-align: center; padding-bottom: 4px; font-weight: 600; }
.cal-day {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  font-size: 0.78rem; border-radius: 5px; cursor: pointer; user-select: none;
  border: 1.5px solid var(--line); background: #fff; color: var(--ink); font-weight: 500;
  font-family: inherit; padding: 0; -webkit-appearance: none; appearance: none;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.cal-day:focus-visible, .btn:focus-visible, .att-add:focus-visible,
.att-remove:focus-visible, .win-toggle:focus-visible, .gate button:focus-visible {
  outline: 2px solid var(--ink); outline-offset: 2px;
}
.field input:focus-visible, .field textarea:focus-visible, .gate input:focus-visible {
  outline: 2px solid var(--ink); outline-offset: 1px;
}
.cal-day:hover { border-color: var(--ink); }
.cal-day.blank { visibility: hidden; cursor: default; }
.cal-day.selected { background: var(--ink); border-color: var(--ink); color: #fff; font-weight: 700; }
.cal-legend { display: flex; align-items: center; gap: 8px; margin-top: 16px; font-size: 0.75rem; color: var(--muted); }
.cal-legend .cal-day { width: 18px; height: 18px; aspect-ratio: unset; font-size: 0; flex-shrink: 0; cursor: default; }

/* ── SUBMIT ──────────────────────────────────────────────── */
.submit-bar { margin-top: 26px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.submit-bar .btn { width: auto; min-width: 220px; margin-top: 0; }
.save-status { font-size: 0.8rem; color: var(--muted); flex: 1; min-width: 180px; }
.save-status.ok { color: var(--win); }
.save-status.err { color: var(--loss); }
.stamp {
  display: none; margin-top: 18px; border: 2px solid var(--win); color: var(--win);
  border-radius: 6px; padding: 12px 18px; font-weight: 700; font-size: 0.85rem;
  letter-spacing: 0.04em; text-transform: uppercase; text-align: center;
}

/* ── BEST WINDOWS (list, not a calendar) ─────────────────── */
.win-list { list-style: none; }
.win-row {
  display: grid; grid-template-columns: 2rem 1fr auto; gap: 14px; align-items: start;
  padding: 16px 0; border-bottom: 1px solid var(--line);
}
.win-row:last-child { border-bottom: none; }
.win-rank {
  font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: 1.1rem; color: var(--muted);
  line-height: 1.3;
}
.win-row.is-top .win-rank { color: var(--ink); }
.win-dates { font-weight: 700; font-size: 1rem; letter-spacing: -0.01em; }
.win-row.is-top .win-dates { font-size: 1.08rem; }
.win-sub { font-size: 0.8rem; color: var(--muted); margin-top: 3px; }
.win-bar { height: 6px; background: var(--bg-soft); border-radius: 3px; margin-top: 10px; overflow: hidden; }
.win-bar > i { display: block; height: 100%; width: 0; background: rgba(var(--heat), 0.85); border-radius: 3px; }
.win-count {
  font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: 1.35rem;
  text-align: right; line-height: 1; white-space: nowrap;
}
.win-count small { display: block; font-family: 'Inter', sans-serif; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--muted); margin-top: 5px; }
.win-toggle {
  grid-column: 2 / -1; justify-self: start; margin-top: 10px;
  font-family: inherit; font-size: 0.74rem; font-weight: 600; color: var(--muted);
  background: none; border: none; padding: 0; cursor: pointer; text-decoration: underline; text-underline-offset: 3px;
}
.win-toggle:hover { color: var(--ink); }
.win-who { grid-column: 2 / -1; overflow: hidden; height: 0; }
.win-who[data-open="1"] { height: auto; }
.win-who-inner { padding-top: 10px; font-size: 0.8rem; line-height: 1.7; }
.win-who-inner .lbl { font-weight: 600; }
.win-who-inner .out { color: var(--muted); }
.win-empty { color: var(--muted); font-size: 0.88rem; padding: 20px 0; }

/* ── ROSTER (everyone's selections) ──────────────────────── */
.roster { display: flex; flex-direction: column; gap: 0; border-top: 1px solid var(--line); }
.roster-card { padding: 18px 0; border-bottom: 1px solid var(--line); }
.roster-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.roster-name { font-weight: 700; font-size: 0.98rem; }
.roster-meta { font-size: 0.75rem; color: var(--muted); }
.roster-people { list-style: none; margin-top: 10px; display: flex; flex-direction: column; gap: 2px; }
.roster-people li {
  font-size: 0.86rem; display: flex; align-items: baseline; gap: 8px;
  padding: 3px 0;
}
.roster-people li::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--ink);
  flex-shrink: 0; transform: translateY(-2px);
}
.roster-dates { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.roster-chip {
  font-size: 0.74rem; font-weight: 600; padding: 4px 9px; border-radius: 999px;
  background: var(--bg-soft); border: 1px solid var(--line); white-space: nowrap;
}
.roster-note {
  font-family: 'Source Serif 4', Georgia, serif; font-style: italic; font-size: 0.88rem;
  color: var(--muted); margin-top: 11px; line-height: 1.6;
}
.roster-empty { font-size: 0.88rem; color: var(--muted); padding: 24px 0; text-align: center; }

footer { text-align: center; margin-top: 72px; padding-top: 18px; border-top: 1px solid var(--line); }
footer p { font-size: 0.7rem; color: var(--muted); }


@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .scroll-progress { display: none; }
}
</style>
</head>
<body>

<div class="scroll-progress" id="scrollProgress"></div>

<div class="wrap">
  <div class="masthead-bar">
    <div class="wordmark"><span class="mark"></span><span>Reunion Gazette</span></div>
    <div class="published-by">Published by <a href="https://burkeruder.ai" target="_blank" rel="noopener noreferrer">burkeruder.ai</a></div>
    <span class="edition-pill">Family Edition · ${REUNION_YEAR}</span>
  </div>
  <div class="rule-double"></div>

  <div class="masthead">
    <div class="masthead-date" id="editionDate">--</div>
    <h1>The Reunion Gazette</h1>
    <div class="masthead-tag">Schlitterbahn · New Braunfels, Texas — Every Day Marked, Every Overlap Counted</div>
  </div>
  <div class="rule-thin"></div>

  <div class="gate" id="gate">
    <p>This edition is for family eyes only. Enter the word to get in.</p>
    <label for="codeInput" class="visually-hidden">Family word</label>
    <input id="codeInput" type="text" placeholder="FAMILY WORD" autocomplete="off" autocapitalize="characters">
    <button id="gateBtn" type="button">→ Enter the Newsroom</button>
    <div class="gate-error" id="gateError" role="alert">That word isn't on the guest list. Ask Burke or your aunt for it.</div>
  </div>

  <div id="app">
    <p class="lede" id="lede">
      <span class="dateline">New Braunfels, Tex. —</span>
      The venue is settled. <strong>Schlitterbahn</strong>: some seventy acres of engineered river in the
      Texas Hill Country, one tube per person, no exceptions. The committee has reserved nothing, promised
      everything, and is now polling the field before <strong>locking the ${REUNION_YEAR} dates</strong>.
      Name everyone coming with you, tap every day in June or July you could make it, then hit submit.
      Scroll down for the stretches that work for the most people.
    </p>

    <div class="section">
      <div class="section-head">
        <h2>Mark Your Days</h2>
        <span class="kicker">One ballot per household</span>
      </div>

      <div class="whoami">
        <div class="field">
          <span class="field-legend">Who's coming *</span>
          <div class="attendees" id="attendees"></div>
          <button type="button" class="att-add" id="attAdd">+ Add another person</button>
          <div class="field-hint">First name on the list is you. Add a line for everyone coming with you — each one shows up by name on the roster below.</div>
        </div>
        <div class="field">
          <label for="fHousehold">Household (optional — helps us not double-count couples)</label>
          <input id="fHousehold" maxlength="60" placeholder="e.g. &quot;Burke &amp; family&quot;">
        </div>
        <div class="field">
          <label for="fNote">Note (optional)</label>
          <textarea id="fNote" rows="2" maxlength="280" placeholder="Anything the committee should know…"></textarea>
        </div>
      </div>

      <div class="cal-months" id="pickerCal"></div>
      <div class="cal-legend">
        <span class="cal-day"></span> <span>open</span>
        <span class="cal-day selected" style="margin-left:10px;"></span> <span>you're in</span>
      </div>

      <div class="submit-bar">
        <button type="button" class="btn" id="submitBtn">→ Submit My Dates</button>
        <div class="save-status" id="saveStatus" role="status" aria-live="polite">Add your name, tap your days, then submit.</div>
      </div>
      <div class="stamp" id="stamp">★ Filed — you're in the box score ★</div>
    </div>

    <div class="section">
      <div class="section-head">
        <h2>Best Stretches</h2>
        <span class="kicker" id="winKicker">— ballots</span>
      </div>
      <p class="lede" style="margin-bottom:18px;font-size:0.95rem;">
        Runs of consecutive days where the most people are free <strong>for every day in the run</strong>.
      </p>
      <ul class="win-list" id="winList"></ul>
    </div>

    <div class="section">
      <div class="section-head">
        <h2>Everyone's Picks</h2>
        <span class="kicker" id="rosterKicker"></span>
      </div>
      <div class="roster" id="roster"></div>
    </div>
  </div>

  <footer>
    <p>The Reunion Gazette · Not affiliated with any newspaper that could sue us</p>
  </footer>
</div>

<script>
// Plain script, no imports — owns everything the page actually needs to work. A separate
// module script below only adds decorative motion on top; if that CDN import ever fails,
// this script keeps working exactly as it does right now. The two talk one way only:
// this script dispatches CustomEvents, the motion script listens. Nothing here reads back.
(function () {
  var API = ${JSON.stringify(API_BASE)};
  var MONTHS = ${JSON.stringify(MONTHS)};
  var codeKey = "reunion_code";
  var identityKey = "reunion_identity";
  var WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  var MAX_ATTENDEES = 30;

  function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
  }

  // localStorage is not merely empty in some browsers — reading or writing it throws
  // (private windows, blocked site data). Losing a saved draft is fine; losing the page is not.
  function storeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function storeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* no draft persistence */ }
  }
  function storeDel(key) {
    try { localStorage.removeItem(key); } catch (e) { /* nothing to clear */ }
  }

  document.getElementById("editionDate").textContent = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  function dateKey(year, month, day) { return year + "-" + pad2(month + 1) + "-" + pad2(day); }
  function parseKey(key) {
    var p = key.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function fmtLong(key) {
    return parseKey(key).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }
  function fmtShort(key) {
    return parseKey(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  function fmtDayNum(key) { return String(parseKey(key).getDate()); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Every polled day, in calendar order. The window search below walks this list, so
  // consecutive entries are consecutive days even across the June/July boundary.
  var ALL_DAYS = (function () {
    var out = [];
    MONTHS.forEach(function (m) {
      var daysInMonth = new Date(m.year, m.month + 1, 0).getDate();
      for (var d = 1; d <= daysInMonth; d++) out.push(dateKey(m.year, m.month, d));
    });
    return out;
  })();

  // Collapse a sorted list of day keys into consecutive ranges, so a roster shows
  // "Jun 11–14" rather than four separate chips.
  function condense(keys) {
    var sorted = keys.slice().sort();
    var out = [];
    sorted.forEach(function (k) {
      var last = out[out.length - 1];
      if (last) {
        var p = parseKey(last.end);
        var next = new Date(p.getFullYear(), p.getMonth(), p.getDate() + 1);
        if (dateKey(next.getFullYear(), next.getMonth(), next.getDate()) === k) { last.end = k; return; }
      }
      out.push({ start: k, end: k });
    });
    return out;
  }
  function fmtRange(r) {
    if (r.start === r.end) return fmtShort(r.start);
    var a = parseKey(r.start), b = parseKey(r.end);
    if (a.getMonth() === b.getMonth()) return fmtShort(r.start) + "–" + b.getDate();
    return fmtShort(r.start) + " – " + fmtShort(r.end);
  }

  var POLLED_SET = null;
  function isPolledDay(k) {
    if (!POLLED_SET) {
      POLLED_SET = {};
      ALL_DAYS.forEach(function (d) { POLLED_SET[d] = true; });
    }
    return !!POLLED_SET[k];
  }

  function pickedDays(b) {
    return Object.keys(b.picks || {}).filter(function (k) {
      return b.picks[k] === "yes" && isPolledDay(k);
    });
  }

  function headsOf(b) {
    // Ballots filed before the roster switched to names have a real party_size but only
    // one synthesized name — trusting the name list alone would undercount them.
    var named = b.attendees && b.attendees.length ? b.attendees.length : 0;
    return Math.max(named, b.party_size || 0, 1);
  }
  function namesOf(b) {
    if (b.attendees && b.attendees.length) return b.attendees;
    return [b.name];
  }

  // ── Attendee rows ───────────────────────────────────────────────────────
  var attEl = document.getElementById("attendees");

  function addAttendeeRow(value, silent) {
    if (attEl.children.length >= MAX_ATTENDEES) return null;
    var row = document.createElement("div");
    row.className = "att-row";
    var num = document.createElement("span");
    num.className = "att-num";
    var input = document.createElement("input");
    input.maxLength = 60;
    input.autocomplete = "off";
    input.value = value || "";
    var del = document.createElement("button");
    del.type = "button";
    del.className = "att-remove";
    del.setAttribute("aria-label", "Remove this person");
    del.textContent = "×";
    del.addEventListener("click", function () {
      if (attEl.children.length <= 1) return;
      emit("gazette:attendee-removing", { el: row });
      row.remove();
      renumberAttendees();
      saveIdentity();
      refreshSubmitState();
    });
    input.addEventListener("input", saveIdentity);
    row.appendChild(num);
    row.appendChild(input);
    row.appendChild(del);
    attEl.appendChild(row);
    renumberAttendees();
    if (!silent) emit("gazette:attendee-added", { el: row });
    return input;
  }

  function renumberAttendees() {
    Array.prototype.forEach.call(attEl.children, function (row, i) {
      row.querySelector(".att-num").textContent = i + 1 + ".";
      var input = row.querySelector("input");
      input.placeholder = i === 0 ? "Your name" : "Name of person " + (i + 1);
      input.setAttribute("aria-label", i === 0 ? "Your name" : "Name of person " + (i + 1));
      // The first row is the ballot's identity key — removing it would orphan the ballot.
      row.querySelector(".att-remove").setAttribute("data-locked", i === 0 ? "1" : "0");
    });
  }

  function getAttendees() {
    return Array.prototype.map.call(attEl.querySelectorAll("input"), function (i) { return i.value.trim(); })
      .filter(function (v) { return v.length > 0; });
  }
  function setAttendees(list) {
    attEl.innerHTML = "";
    (list && list.length ? list : [""]).forEach(function (n) { addAttendeeRow(n, true); });
  }

  addAttendeeRow("", true);
  document.getElementById("attAdd").addEventListener("click", function () {
    var input = addAttendeeRow("");
    if (input) input.focus();
  });

  // ── Picker calendar ─────────────────────────────────────────────────────
  var myPicks = {};
  var pickerEl = document.getElementById("pickerCal");

  function buildCalGrid(containerEl, onCellClick) {
    containerEl.innerHTML = "";
    MONTHS.forEach(function (m) {
      var wrap = document.createElement("div");
      var firstDow = new Date(m.year, m.month, 1).getDay();
      var daysInMonth = new Date(m.year, m.month + 1, 0).getDate();

      var head = document.createElement("div");
      head.className = "cal-month-name";
      head.textContent = m.name + " " + m.year;
      wrap.appendChild(head);

      var grid = document.createElement("div");
      grid.className = "cal-grid";
      WEEKDAYS.forEach(function (wd) {
        var el = document.createElement("div");
        el.className = "cal-weekday";
        el.textContent = wd;
        grid.appendChild(el);
      });
      for (var i = 0; i < firstDow; i++) {
        var blank = document.createElement("div");
        blank.className = "cal-day blank";
        grid.appendChild(blank);
      }
      for (var day = 1; day <= daysInMonth; day++) {
        var key = dateKey(m.year, m.month, day);
        var cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cal-day";
        cell.textContent = day;
        cell.setAttribute("data-date", key);
        cell.setAttribute("aria-pressed", "false");
        cell.setAttribute("aria-label", fmtLong(key));
        cell.addEventListener("click", function () { onCellClick(this.getAttribute("data-date"), this); });
        grid.appendChild(cell);
      }
      wrap.appendChild(grid);
      containerEl.appendChild(wrap);
    });
  }

  buildCalGrid(pickerEl, function (key, cellEl) {
    if (myPicks[key]) delete myPicks[key]; else myPicks[key] = "yes";
    var on = !!myPicks[key];
    cellEl.classList.toggle("selected", on);
    cellEl.setAttribute("aria-pressed", on ? "true" : "false");
    emit("gazette:day-toggled", { el: cellEl, selected: on });
    saveIdentity();
    refreshSubmitState();
  });

  function refreshPickerSelection() {
    pickerEl.querySelectorAll(".cal-day[data-date]").forEach(function (cell) {
      var on = !!myPicks[cell.getAttribute("data-date")];
      cell.classList.toggle("selected", on);
      cell.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  // ── Best stretches ──────────────────────────────────────────────────────
  // Ranking purely by headcount fragments an obvious long weekend into separate
  // one-day entries, because a shorter run can only ever have more people in it.
  // So: seed on the single best day, then grow the run outward while the people who
  // can make *every* day of it stays within 80% of that peak. The result is a real
  // range someone can actually book, not a pile of adjacent single days.
  var GROW_FLOOR = 0.8;
  var MAX_RUN = 7;

  function computeWindows(ballots) {
    var totalHeads = 0;
    var voters = ballots.map(function (b) {
      var heads = headsOf(b);
      totalHeads += heads;
      var days = {};
      pickedDays(b).forEach(function (k) { days[k] = true; });
      return { heads: heads, days: days, names: namesOf(b) };
    }).filter(function (v) { return Object.keys(v.days).length > 0; });

    // Who is free for every day between indices i and j (inclusive).
    function freeAcross(i, j) {
      var span = ALL_DAYS.slice(i, j + 1);
      return voters.filter(function (v) {
        return span.every(function (d) { return v.days[d]; });
      });
    }
    function headsOfList(list) {
      return list.reduce(function (sum, v) { return sum + v.heads; }, 0);
    }

    var seeds = ALL_DAYS.map(function (d, i) { return { i: i, list: freeAcross(i, i) }; })
      .map(function (s2) { return { i: s2.i, heads: headsOfList(s2.list) }; })
      .filter(function (s2) { return s2.heads > 0; })
      .sort(function (a, b) { return b.heads - a.heads || a.i - b.i; });

    var used = {};
    var windows = [];

    seeds.forEach(function (seed) {
      if (windows.length >= 6 || used[seed.i]) return;
      var floor = Math.max(1, Math.ceil(seed.heads * GROW_FLOOR));
      var lo = seed.i, hi = seed.i;

      // Grow greedily, always taking whichever side keeps more people on board.
      for (;;) {
        if (hi - lo + 1 >= MAX_RUN) break;
        var left = lo > 0 && !used[lo - 1] ? headsOfList(freeAcross(lo - 1, hi)) : -1;
        var right = hi < ALL_DAYS.length - 1 && !used[hi + 1] ? headsOfList(freeAcross(lo, hi + 1)) : -1;
        if (left < floor && right < floor) break;
        if (right >= left) hi++; else lo--;
      }

      var inList = freeAcross(lo, hi);
      var outList = voters.filter(function (v) { return inList.indexOf(v) === -1; });
      for (var k = lo; k <= hi; k++) used[k] = true;

      windows.push({
        start: ALL_DAYS[lo], end: ALL_DAYS[hi], len: hi - lo + 1,
        heads: headsOfList(inList),
        inNames: inList.reduce(function (acc, v) { return acc.concat(v.names); }, []),
        outNames: outList.reduce(function (acc, v) { return acc.concat(v.names); }, []),
      });
    });

    windows.sort(function (a, b) { return b.heads - a.heads || b.len - a.len || a.start.localeCompare(b.start); });
    // Drop runs only a single person can make — they're noise next to the real overlaps,
    // unless a single person is genuinely all we have so far.
    var meaningful = windows.filter(function (w) { return w.heads > 1; });
    return { windows: meaningful.length ? meaningful : windows, totalHeads: totalHeads };
  }

  function renderWindows(ballots) {
    var el = document.getElementById("winList");
    var res = computeWindows(ballots);

    // Hand the motion layer the old geometry before the DOM changes, so it can FLIP
    // rows from where they were to where they land.
    var before = {};
    el.querySelectorAll(".win-row").forEach(function (row) {
      before[row.getAttribute("data-key")] = row.getBoundingClientRect();
    });
    emit("gazette:windows-before", { rects: before });

    if (!res.windows.length) {
      el.innerHTML = '<li class="win-empty">No stretches yet — once a couple of people submit their days, the overlaps show up here.</li>';
      emit("gazette:windows-after", { rects: before, count: 0 });
      return;
    }

    var top = res.windows[0].heads || 1;
    el.innerHTML = res.windows.map(function (w, idx) {
      var key = w.start + ":" + w.end;
      var pct = Math.round((w.heads / top) * 100);
      var label = w.len === 1 ? fmtLong(w.start) : fmtLong(w.start) + " – " + fmtLong(w.end);
      var nights = w.len === 1 ? "single day" : w.len + " days";
      return '<li class="win-row' + (idx === 0 ? " is-top" : "") + '" data-key="' + escapeHtml(key) + '">' +
        '<span class="win-rank">' + (idx + 1) + "</span>" +
        '<div class="win-main">' +
          '<div class="win-dates">' + escapeHtml(label) + "</div>" +
          '<div class="win-sub">' + nights + " · " + w.heads + " of " + res.totalHeads + " people free every day</div>" +
          '<div class="win-bar"><i data-fill="' + pct + '" style="width:' + pct + '%"></i></div>' +
        "</div>" +
        '<div class="win-count"><span data-countup="' + w.heads + '">' + w.heads + "</span><small>" + (w.heads === 1 ? "person" : "people") + "</small></div>" +
        '<button type="button" class="win-toggle" data-idx="' + idx + '">Who can make it</button>' +
        '<div class="win-who" data-idx="' + idx + '"><div class="win-who-inner">' +
          '<div><span class="lbl">In:</span> ' + (w.inNames.length ? escapeHtml(w.inNames.join(", ")) : "—") + "</div>" +
          '<div class="out"><span class="lbl">Can\\'t:</span> ' + (w.outNames.length ? escapeHtml(w.outNames.join(", ")) : "—") + "</div>" +
        "</div></div>" +
      "</li>";
    }).join("");

    el.querySelectorAll(".win-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var panel = el.querySelector('.win-who[data-idx="' + btn.getAttribute("data-idx") + '"]');
        var open = panel.getAttribute("data-open") === "1";
        panel.setAttribute("data-open", open ? "0" : "1");
        btn.textContent = open ? "Who can make it" : "Hide";
        emit("gazette:who-toggled", { el: panel, open: !open });
      });
    });

    emit("gazette:windows-after", { rects: before, count: res.windows.length });
  }

  // ── Roster ──────────────────────────────────────────────────────────────
  function renderRoster(ballots) {
    var el = document.getElementById("roster");
    var totalHeads = ballots.reduce(function (s, b) { return s + headsOf(b); }, 0);
    document.getElementById("rosterKicker").textContent = ballots.length ? totalHeads + (totalHeads === 1 ? " person" : " people") + " so far" : "";
    document.getElementById("winKicker").textContent = ballots.length + (ballots.length === 1 ? " ballot in" : " ballots in");

    if (!ballots.length) {
      el.innerHTML = '<div class="roster-empty">No ballots filed yet. Be the first to mark your days.</div>';
      emit("gazette:roster-rendered", {});
      return;
    }

    el.innerHTML = ballots.map(function (b) {
      var days = pickedDays(b);
      var chips = condense(days).map(function (r) {
        return '<span class="roster-chip">' + escapeHtml(fmtRange(r)) + "</span>";
      }).join("");
      var people = namesOf(b).map(function (n) { return "<li>" + escapeHtml(n) + "</li>"; }).join("");
      return '<div class="roster-card">' +
        '<div class="roster-top">' +
          '<span class="roster-name">' + escapeHtml(b.household || b.name) + "</span>" +
          '<span class="roster-meta">' + namesOf(b).length + (namesOf(b).length === 1 ? " person" : " people") +
            " · " + days.length + " day" + (days.length === 1 ? "" : "s") + " marked</span>" +
        "</div>" +
        '<ul class="roster-people">' + people + "</ul>" +
        (chips ? '<div class="roster-dates">' + chips + "</div>" : "") +
        (b.note ? '<div class="roster-note">“' + escapeHtml(b.note) + "”</div>" : "") +
      "</div>";
    }).join("");

    emit("gazette:roster-rendered", { count: ballots.length });
  }

  // ── Data ────────────────────────────────────────────────────────────────
  var currentCode = null;
  var myBallotId = null;

  function findMyBallot(ballots) {
    var mine = getAttendees()[0];
    if (!mine) return null;
    var name = mine.toLowerCase();
    var household = document.getElementById("fHousehold").value.trim().toLowerCase();
    return ballots.filter(function (b) {
      return b.name.trim().toLowerCase() === name && (b.household || "").trim().toLowerCase() === household;
    })[0] || null;
  }

  function fail(kind, message) {
    var e = new Error(message);
    e.kind = kind;
    return e;
  }

  function loadData() {
    // Every failure used to surface as "that word isn't on the guest list", which sends
    // someone hunting for a password when their wifi dropped. Each cause says its own name.
    return fetch(API + "?code=" + encodeURIComponent(currentCode))
      .catch(function () {
        throw fail("network", "Couldn't reach the newsroom — check your connection and try again.");
      })
      .then(function (r) {
        if (r.status === 401) throw fail("code", "That word isn't on the guest list. Ask Burke or your aunt for it.");
        if (r.status === 503) throw fail("config", "The poll isn't switched on yet. Tell Burke the family word needs setting.");
        if (!r.ok) throw fail("server", "The newsroom is having trouble (error " + r.status + "). Try again in a minute.");
        return r.json();
      })
      .then(function (data) {
        var ballots = data.ballots || [];
        renderWindows(ballots);
        renderRoster(ballots);
        emit("gazette:data", { ballots: ballots });
        return ballots;
      });
  }

  function saveIdentity() {
    storeSet(identityKey, JSON.stringify({
      attendees: getAttendees(),
      household: document.getElementById("fHousehold").value.trim(),
      note: document.getElementById("fNote").value.trim(),
      picks: myPicks,
    }));
  }

  function enterGate(code) {
    currentCode = code;
    return loadData().then(function (ballots) {
      storeSet(codeKey, code);
      document.getElementById("gate").style.display = "none";
      document.getElementById("app").style.display = "block";
      emit("gazette:entered", {});

      // A corrupted draft must not take the whole page down with it.
      var saved = null;
      try { saved = JSON.parse(storeGet(identityKey) || "null"); } catch (e) { saved = null; }
      myBallotId = null;
      if (saved) {
        setAttendees(saved.attendees && saved.attendees.length ? saved.attendees : [saved.name || ""]);
        document.getElementById("fHousehold").value = saved.household || "";
        document.getElementById("fNote").value = saved.note || "";
        if (saved.picks) { myPicks = Object.assign({}, saved.picks); refreshPickerSelection(); }
      }
      // The server is the source of truth if this household already filed.
      var mine = findMyBallot(ballots);
      if (mine) {
        myBallotId = mine.id;
        myPicks = Object.assign({}, mine.picks);
        setAttendees(namesOf(mine));
        document.getElementById("fNote").value = mine.note || "";
        refreshPickerSelection();
        refreshSubmitState();
        setStatus("Welcome back — your ballot is loaded. Change anything and submit again.", "ok");
      } else {
        refreshSubmitState();
      }
    });
  }

  document.getElementById("gateBtn").addEventListener("click", function () {
    var code = document.getElementById("codeInput").value.trim();
    if (!code) return;
    document.getElementById("gateError").style.display = "none";
    enterGate(code).catch(function (err) {
      var el = document.getElementById("gateError");
      el.textContent = (err && err.message) || "Something went wrong. Try again.";
      el.style.display = "block";
      emit("gazette:gate-rejected", {});
    });
  });
  document.getElementById("codeInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") document.getElementById("gateBtn").click();
  });

  var savedCode = storeGet(codeKey);
  if (savedCode) {
    document.getElementById("codeInput").value = savedCode;
    enterGate(savedCode).catch(function (err) {
      // Only a rejected word should clear the saved code — a flaky connection shouldn't
      // log the whole family back out.
      if (err && err.kind === "code") storeDel(codeKey);
      var el = document.getElementById("gateError");
      el.textContent = (err && err.message) || "Something went wrong. Try again.";
      el.style.display = "block";
    });
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  var submitBtn = document.getElementById("submitBtn");
  var submitting = false;

  function setStatus(text, cls) {
    var el = document.getElementById("saveStatus");
    el.textContent = text;
    el.className = "save-status" + (cls ? " " + cls : "");
  }

  function refreshSubmitState() {
    var ready = getAttendees().length > 0 && Object.keys(myPicks).length > 0;
    submitBtn.disabled = submitting || !ready;
    if (submitting) return;
    if (!getAttendees().length) setStatus("Add your name, tap your days, then submit.");
    else if (!Object.keys(myPicks).length) setStatus("Tap every day you could make it, then submit.");
    else setStatus(Object.keys(myPicks).length + " day" + (Object.keys(myPicks).length === 1 ? "" : "s") + " marked — ready to submit.");
  }

  submitBtn.addEventListener("click", function () {
    var attendees = getAttendees();
    if (!attendees.length || !Object.keys(myPicks).length || submitting) return;

    submitting = true;
    submitBtn.disabled = true;
    setStatus("Filing your ballot…");
    saveIdentity();
    emit("gazette:submitting", {});

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: currentCode,
        ballotId: myBallotId,
        name: attendees[0],
        attendees: attendees,
        household: document.getElementById("fHousehold").value.trim(),
        picks: myPicks,
        note: document.getElementById("fNote").value.trim(),
      }),
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.body.error || "Something went wrong.");
        if (res.body.id) myBallotId = res.body.id;
        var stamp = document.getElementById("stamp");
        stamp.textContent = res.body.amended ? "★ Ballot updated — the stretches have been recounted ★" : "★ Filed — you're on the roster ★";
        stamp.style.display = "block";
        emit("gazette:submitted", { amended: !!res.body.amended });
        setStatus(res.body.message || "Filed.", "ok");
        return loadData();
      })
      .catch(function (err) {
        setStatus(err.message, "err");
        emit("gazette:submit-failed", {});
      })
      .finally(function () {
        submitting = false;
        refreshSubmitState();
      });
  });

  ["fHousehold", "fNote"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", saveIdentity);
  });
  attEl.addEventListener("input", refreshSubmitState);
  refreshSubmitState();
})();
</script>

<script type="module">
// Decoration only — isolated from the functional script above on purpose. If this CDN
// import ever fails, the calendar, submit button and standings above still work exactly
// as they do now; only the motion is lost. Everything here is driven by CustomEvents the
// functional script fires, so this file never needs to know how any of that works.
import { animate, stagger, inView, scroll, spring } from 'https://cdn.jsdelivr.net/npm/motion@11.18.2/+esm';

var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Motion must never own whether something is *visible*. A page loaded into a background
// tab — which is exactly what happens when someone opens the link from Facebook and
// doesn't switch to it — starts its entrance animations and then freezes them at the
// first keyframe. For an opacity:[0,1] entrance that leaves the masthead and the gate
// sitting at opacity 0 on a blank white page until the tab is focused. So entrances only
// run when the page is actually being looked at; otherwise the CSS defaults stand and
// everything is simply there.
var hiddenAtLoad = document.hidden;
var softSpring = { type: spring, stiffness: 320, damping: 26 };
var popSpring = { type: spring, stiffness: 520, damping: 18 };

function motionOn(name, fn) { document.addEventListener(name, fn); }

if (!reduced && !hiddenAtLoad) {
  // ── Scroll-linked read-through bar ─────────────────────────────────────
  scroll(animate("#scrollProgress", { scaleX: [0, 1] }, { ease: "linear" }));

  // ── Masthead entrance ──────────────────────────────────────────────────
  animate(".wordmark .mark", { rotate: [0, 225], scale: [0.4, 1] }, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
  animate(".wordmark span", { opacity: [0, 1], x: [-10, 0] }, { duration: 0.5, delay: 0.15 });
  animate(".edition-pill", { opacity: [0, 1], x: [10, 0] }, { duration: 0.5, delay: 0.2 });
  animate(".published-by", { opacity: [0, 1], y: [-6, 0] }, { duration: 0.5, delay: 0.28 });
  animate(".rule-double", { scaleX: [0, 1] }, { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] });
  document.querySelector(".rule-double").style.transformOrigin = "0 50%";
  animate(".masthead-date", { opacity: [0, 1] }, { duration: 0.5, delay: 0.3 });
  animate(".masthead h1", { opacity: [0, 1], y: [-16, 0] }, { duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] });
  animate(".masthead-tag", { opacity: [0, 1] }, { duration: 0.6, delay: 0.45 });
  animate(".rule-thin", { scaleX: [0, 1] }, { duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] });
  document.querySelector(".rule-thin").style.transformOrigin = "0 50%";

  // Gate card floats in, and shakes its head at a bad word.
  animate("#gate", { opacity: [0, 1], y: [18, 0] }, { duration: 0.6, delay: 0.4 });
  motionOn("gazette:gate-rejected", function () {
    animate("#gate input", { x: [0, -9, 8, -6, 4, 0] }, { duration: 0.42 });
  });

  // ── Section reveals ────────────────────────────────────────────────────
  // Fades from partial, not 0 — CSS already keeps sections at opacity:1 by default, so
  // this is purely a flourish that can never leave a section looking blank.
  // Motion hands this callback an IntersectionObserverEntry, not the element itself.
  inView(".section", function (entry) {
    var el = entry && entry.target ? entry.target : entry;
    animate(el, { opacity: [0.4, 1], y: [24, 0] }, { duration: 0.5, ease: "ease-out" });
    var head = el.querySelector(".section-head");
    if (head) animate(head, { borderBottomColor: ["rgba(17,17,17,0)", "rgba(17,17,17,1)"] }, { duration: 0.6 });
  }, { margin: "-60px" });

  // ── Entering the newsroom ──────────────────────────────────────────────
  motionOn("gazette:entered", function () {
    if (document.hidden) return;
    animate("#app", { opacity: [0, 1] }, { duration: 0.45 });
    animate("#lede", { opacity: [0, 1], y: [12, 0] }, { duration: 0.5, delay: 0.05 });
    animate(".dateline", { opacity: [0, 1], x: [-10, 0] }, Object.assign({ delay: 0.25 }, softSpring));
    animate(".whoami", { opacity: [0, 1], y: [16, 0], scale: [0.985, 1] }, Object.assign({ delay: 0.1 }, softSpring));
    // Wave the calendar in, month by month and day by day.
    document.querySelectorAll("#pickerCal .cal-month-name").forEach(function (el, i) {
      animate(el, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, delay: 0.15 + i * 0.08 });
    });
    var cells = document.querySelectorAll("#pickerCal .cal-day[data-date]");
    if (cells.length) {
      animate(cells, { opacity: [0, 1], scale: [0.6, 1] },
        { delay: stagger(0.006, { startDelay: 0.2 }), duration: 0.35, ease: [0.34, 1.56, 0.64, 1] });
    }
    animate(".submit-bar", { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, delay: 0.5 });
  });

  // ── Day cells ──────────────────────────────────────────────────────────
  motionOn("gazette:day-toggled", function (e) {
    animate(e.detail.el, { scale: e.detail.selected ? [0.72, 1.12, 1] : [1, 0.85, 1] },
      { duration: 0.36, ease: [0.34, 1.56, 0.64, 1] });
  });
  document.addEventListener("pointerdown", function (e) {
    var day = e.target.closest("#pickerCal .cal-day:not(.blank)");
    if (day) animate(day, { scale: 0.9 }, { duration: 0.09 });
  });
  document.addEventListener("pointerup", function (e) {
    var day = e.target.closest("#pickerCal .cal-day:not(.blank)");
    if (day) animate(day, { scale: 1 }, popSpring);
  });

  // ── Attendee rows ──────────────────────────────────────────────────────
  motionOn("gazette:attendee-added", function (e) {
    var el = e.detail.el;
    animate(el, { opacity: [0, 1], height: ["0px", el.offsetHeight + "px"], x: [-14, 0] },
      { duration: 0.4, ease: [0.22, 1, 0.36, 1] }).then(function () { el.style.height = ""; });
  });
  motionOn("gazette:attendee-removing", function (e) {
    animate(e.detail.el, { opacity: [1, 0], x: [0, 24] }, { duration: 0.18 });
  });
  document.addEventListener("click", function (e) {
    var add = e.target.closest(".att-add");
    if (add) animate(add, { scale: [0.94, 1] }, popSpring);
  });

  // ── Submit ─────────────────────────────────────────────────────────────
  motionOn("gazette:submitting", function () {
    animate("#submitBtn", { scale: [1, 0.96, 1] }, { duration: 0.25 });
  });
  motionOn("gazette:submitted", function () {
    var stamp = document.getElementById("stamp");
    animate(stamp, { opacity: [0, 1], scale: [0.55, 1], rotate: [-7, 0] },
      Object.assign({}, popSpring, { duration: 0.6 }));
    animate("#submitBtn", { scale: [1, 1.05, 1] }, { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] });
  });
  motionOn("gazette:submit-failed", function () {
    animate("#submitBtn", { x: [0, -8, 7, -5, 0] }, { duration: 0.38 });
  });

  // ── Best stretches: FLIP the rows when the ranking changes ─────────────
  var prevRects = {};
  motionOn("gazette:windows-before", function (e) { prevRects = e.detail.rects || {}; });
  motionOn("gazette:windows-after", function () {
    var rows = document.querySelectorAll("#winList .win-row");
    rows.forEach(function (row, i) {
      var key = row.getAttribute("data-key");
      var was = prevRects[key];
      if (was) {
        // Row already existed — slide it from its old position to its new one.
        var dy = was.top - row.getBoundingClientRect().top;
        if (Math.abs(dy) > 1) animate(row, { y: [dy, 0] }, softSpring);
      } else {
        animate(row, { opacity: [0, 1], y: [18, 0] },
          { duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] });
      }
    });

    // Bars grow to their share of the leader. The markup already carries the final width,
    // so this only replays the growth — it never supplies the value.
    document.querySelectorAll("#winList .win-bar > i").forEach(function (bar, i) {
      animate(bar, { width: ["0%", bar.getAttribute("data-fill") + "%"] },
        { duration: 0.8, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] });
    });

    // Headcounts tick up rather than snapping, and land back on the rendered number.
    document.querySelectorAll("#winList [data-countup]").forEach(function (el, i) {
      var target = Number(el.getAttribute("data-countup")) || 0;
      animate(0, target, {
        duration: 0.9, delay: 0.15 + i * 0.06, ease: "ease-out",
        onUpdate: function (v) { el.textContent = Math.round(v); },
        onComplete: function () { el.textContent = target; },
      });
    });

    // The leader gets a beat of its own.
    var top = document.querySelector("#winList .win-row.is-top .win-dates");
    if (top) animate(top, { scale: [0.96, 1], opacity: [0.5, 1] }, { duration: 0.5, delay: 0.3 });
  });

  // Expand/collapse the who-can-make-it panel to its real height.
  motionOn("gazette:who-toggled", function (e) {
    var panel = e.detail.el;
    var inner = panel.querySelector(".win-who-inner");
    if (e.detail.open) {
      animate(panel, { height: ["0px", inner.offsetHeight + "px"] }, { duration: 0.32, ease: [0.22, 1, 0.36, 1] });
      animate(inner, { opacity: [0, 1], y: [-6, 0] }, { duration: 0.32, delay: 0.05 });
    } else {
      animate(panel, { height: [panel.offsetHeight + "px", "0px"] }, { duration: 0.24, ease: "ease-in" });
    }
  });

  // Hover lift on rows, done in JS so it can spring rather than tween.
  document.addEventListener("pointerover", function (e) {
    var row = e.target.closest("#winList .win-row");
    if (row && !row.dataset.hovering) { row.dataset.hovering = "1"; animate(row, { x: 4 }, softSpring); }
  });
  document.addEventListener("pointerout", function (e) {
    var row = e.target.closest("#winList .win-row");
    if (row && !row.contains(e.relatedTarget)) { delete row.dataset.hovering; animate(row, { x: 0 }, softSpring); }
  });

  // ── Roster ─────────────────────────────────────────────────────────────
  motionOn("gazette:roster-rendered", function () {
    animate("#roster .roster-card", { opacity: [0, 1], y: [14, 0] },
      { delay: stagger(0.06), duration: 0.45, ease: [0.22, 1, 0.36, 1] });
    var people = document.querySelectorAll("#roster .roster-people li");
    if (people.length) animate(people, { opacity: [0, 1], x: [-8, 0] }, { delay: stagger(0.02, { startDelay: 0.12 }), duration: 0.3 });
    var chips = document.querySelectorAll("#roster .roster-chip");
    if (chips.length) animate(chips, { opacity: [0, 1], scale: [0.8, 1] },
      { delay: stagger(0.025, { startDelay: 0.2 }), duration: 0.35, ease: [0.34, 1.56, 0.64, 1] });
  });

  // The way back to the main site gets a hover nudge.
  document.addEventListener("pointerover", function (e) {
    var a = e.target.closest(".published-by a");
    if (a && !a.dataset.hovering) { a.dataset.hovering = "1"; animate(a, { y: -2 }, softSpring); }
  });
  document.addEventListener("pointerout", function (e) {
    var a = e.target.closest(".published-by a");
    if (a && !a.contains(e.relatedTarget)) { delete a.dataset.hovering; animate(a, { y: 0 }, softSpring); }
  });
  inView("footer", function (entry) {
    var el = entry && entry.target ? entry.target : entry;
    animate(el.querySelectorAll("p"), { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.08), duration: 0.5 });
  });

  // Kickers re-count themselves whenever fresh data lands.
  motionOn("gazette:data", function () {
    document.querySelectorAll(".section-head .kicker").forEach(function (el) {
      animate(el, { opacity: [0.3, 1] }, { duration: 0.5 });
    });
  });
}
</script>

</body>
</html>`;
