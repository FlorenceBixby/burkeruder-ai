// Reunion Gazette — standalone Worker serving reunion.burkeruder.ai.
// Deliberately its own tiny Worker, not a route inside the main Next.js site: it needs to
// feel like a different publication, not another page in the ocean-themed portfolio. Talks
// to the existing /api/reunion Pages Function on burkeruder.ai (CORS already open) rather
// than duplicating that backend — this Worker is presentation only, no D1 binding of its own.

const API_BASE = "https://burkeruder.ai/api/reunion";

// Mirrors src/lib/reunion.ts on the main site — keep ids in sync with that file if the
// slate ever changes; renaming an id here without renaming it there orphans old votes.
const REUNION_YEAR = 2027;
const WINDOWS = [
  { id: "w-mar",  label: "MAR",   dates: "March 12–14",    days: "Fri–Sun", note: "Spring break for most districts", start: "2027-03-12" },
  { id: "w-may",  label: "MAY",   dates: "May 28–31",      days: "Fri–Mon", note: "Memorial Day — long weekend",     start: "2027-05-28" },
  { id: "w-jun",  label: "JUN",   dates: "June 18–20",     days: "Fri–Sun", note: "School's out, before vacations",  start: "2027-06-18" },
  { id: "w-jul4", label: "JUL 4", dates: "July 2–5",       days: "Fri–Mon", note: "Independence Day — long weekend", start: "2027-07-02" },
  { id: "w-jul",  label: "JUL",   dates: "July 23–25",     days: "Fri–Sun", note: "High summer",                     start: "2027-07-23" },
  { id: "w-sep",  label: "SEP",   dates: "September 3–6",  days: "Fri–Mon", note: "Labor Day — long weekend",        start: "2027-09-03" },
  { id: "w-nov",  label: "NOV",   dates: "November 24–28", days: "Wed–Sun", note: "Thanksgiving week",               start: "2027-11-24" },
];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== "/" && url.pathname !== "/index.html") {
      return new Response("Not found", { status: 404 });
    }
    return new Response(PAGE, {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
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
  --accent: #111111;
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
.wrap { max-width: 780px; margin: 0 auto; padding: 0 20px 100px; }

/* ── MASTHEAD ────────────────────────────────────────────── */
.masthead-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 22px 0 16px;
}
.wordmark { display: flex; align-items: center; gap: 9px; }
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
.masthead-tag {
  font-size: 0.8rem; color: var(--muted); margin-top: 10px;
}
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
  border: none; cursor: pointer; width: 100%; margin-top: 12px; border-radius: 4px; transition: transform 0.15s, opacity 0.15s;
}
.gate button:hover, .btn:hover:not(:disabled) { opacity: 0.82; }
.gate button:active, .btn:active:not(:disabled) { transform: scale(0.98); }
.gate-error { color: var(--loss); font-size: 0.82rem; margin-top: 12px; display: none; }

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

/* ── BOX SCORE TABLE ─────────────────────────────────────── */
.boxscore { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.boxscore th, .boxscore td { padding: 11px 8px; text-align: center; }
.boxscore thead th { border-bottom: 2px solid var(--ink); }
.boxscore tbody tr { border-bottom: 1px solid var(--line); }
.boxscore tbody tr:last-child { border-bottom: none; }
.boxscore th {
  font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; font-size: 0.68rem; color: var(--muted);
}
.boxscore td.window-cell { text-align: left; }
.boxscore td.window-cell .w-label { font-weight: 700; letter-spacing: 0.01em; }
.boxscore td.window-cell .w-dates { display: block; font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
.boxscore tr.leader td.window-cell .w-label::before { content: '\\2605  '; color: var(--ink); }
.boxscore .pct { font-weight: 700; }
.boxscore .w-count { color: var(--win); font-weight: 600; }
.boxscore .l-count { color: var(--loss); }
.bs-scroll { overflow-x: auto; }
.bs-note { font-size: 0.72rem; color: var(--muted); margin-top: 12px; line-height: 1.6; }

/* ── BALLOT FORM ─────────────────────────────────────────── */
.ballot {
  background: var(--bg-soft); border: 1px solid var(--line); border-radius: 8px; padding: clamp(18px,4vw,32px);
}
.field { margin-bottom: 18px; }
.field label {
  display: block; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.03em;
  text-transform: uppercase; color: var(--muted); margin-bottom: 6px;
}
.field input, .field textarea {
  width: 100%; padding: 11px 13px; font-family: inherit; font-size: 0.92rem;
  background: #fff; border: 1.5px solid var(--line); color: var(--ink); outline: none; resize: vertical; border-radius: 4px;
}
.field input:focus, .field textarea:focus { border-color: var(--ink); }
.field-row { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }
@media (max-width: 520px) { .field-row { grid-template-columns: 1fr; } }

.pick-row {
  display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px;
  padding: 11px 0; border-bottom: 1px solid var(--line);
}
.pick-row:last-of-type { border-bottom: none; }
.pick-info .w-label { font-weight: 600; }
.pick-info .w-meta { display: block; font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
.pick-toggle { display: flex; gap: 4px; }
.pick-toggle button {
  font-family: inherit; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.01em;
  padding: 8px 12px; background: #fff; border: 1.5px solid var(--line); border-radius: 4px;
  color: var(--muted); cursor: pointer; min-width: 52px; transition: all 0.12s;
}
.pick-toggle button[data-v="yes"].active { background: var(--win); border-color: var(--win); color: #fff; }
.pick-toggle button[data-v="maybe"].active { background: var(--ink); border-color: var(--ink); color: #fff; }
.pick-toggle button[data-v="no"].active { background: var(--loss); border-color: var(--loss); color: #fff; }

.ballot-msg { font-size: 0.85rem; padding: 12px 14px; margin-top: 16px; display: none; border-radius: 4px; }
.ballot-msg.ok { display: block; background: #EAF4EC; border: 1px solid var(--win); color: var(--win); }
.ballot-msg.err { display: block; background: #FBEAE9; border: 1px solid var(--loss); color: var(--loss); }

/* ── ROSTER ──────────────────────────────────────────────── */
.roster { border-top: 1px solid var(--line); }
.roster-row { padding: 13px 0; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; gap: 12px; align-items: baseline; flex-wrap: wrap; }
.roster-name { font-weight: 600; }
.roster-meta { font-size: 0.75rem; color: var(--muted); }
.roster-empty { font-size: 0.88rem; color: var(--muted); padding: 24px 0; text-align: center; }

footer { text-align: center; margin-top: 72px; padding-top: 18px; border-top: 1px solid var(--line); }
footer p { font-size: 0.7rem; color: var(--muted); }
</style>
</head>
<body>

<div class="wrap">
  <div class="masthead-bar">
    <div class="wordmark"><span class="mark"></span><span>Reunion Gazette</span></div>
    <span class="edition-pill">Family Edition · ${REUNION_YEAR}</span>
  </div>
  <div class="rule-double"></div>

  <div class="masthead">
    <div class="masthead-date" id="editionDate">--</div>
    <h1>The Reunion Gazette</h1>
    <div class="masthead-tag">Every Vote Filed — Every Date Contested</div>
  </div>
  <div class="rule-thin"></div>

  <div class="gate" id="gate">
    <p>This edition is for family eyes only. Enter the word to get in.</p>
    <input id="codeInput" type="text" placeholder="FAMILY WORD" autocomplete="off" autocapitalize="characters">
    <button id="gateBtn" type="button">→ Enter the Newsroom</button>
    <div class="gate-error" id="gateError">That word isn't on the guest list. Ask Burke or your aunt for it.</div>
  </div>

  <div id="app">
    <p class="lede" id="lede">
      The committee is polling the field before <strong>locking the ${REUNION_YEAR} reunion dates</strong>.
      Mark every window you could make it, file your ballot, and check back — the box score updates live as the family weighs in.
    </p>

    <div class="section">
      <div class="section-head">
        <h2>File Your Ballot</h2>
        <span class="kicker" id="ballotKicker">Amend anytime</span>
      </div>
      <form class="ballot" id="ballotForm">
        <div class="field-row">
          <div class="field">
            <label for="fName">Name *</label>
            <input id="fName" required maxlength="60" placeholder="Your name">
          </div>
          <div class="field">
            <label for="fParty">Party Size</label>
            <input id="fParty" type="number" min="1" max="30" value="1">
          </div>
        </div>
        <div class="field">
          <label for="fHousehold">Household (optional — helps us not double-count couples)</label>
          <input id="fHousehold" maxlength="60" placeholder="e.g. &quot;Burke &amp; family&quot;">
        </div>

        <div class="field" style="margin-top:26px;">
          <label style="margin-bottom:2px;">Mark Every Window You Could Make It</label>
        </div>
        <div id="pickRows"></div>

        <div class="field" style="margin-top:18px;">
          <label for="fNote">Note (optional)</label>
          <textarea id="fNote" rows="2" maxlength="280" placeholder="Anything the committee should know…"></textarea>
        </div>

        <button class="btn" type="submit" id="submitBtn">→ File Ballot</button>
        <div class="ballot-msg" id="ballotMsg"></div>
      </form>
    </div>

    <div class="section">
      <div class="section-head">
        <h2>Standings</h2>
        <span class="kicker" id="standingsKicker">— ballots</span>
      </div>
      <div class="bs-scroll">
        <table class="boxscore" id="boxscore">
          <thead>
            <tr><th>Window</th><th>W</th><th>T</th><th>L</th><th>PCT</th><th>Heads</th></tr>
          </thead>
          <tbody id="boxscoreBody"></tbody>
        </table>
      </div>
      <p class="bs-note">W = can make it · T = maybe · L = can't make it · PCT = (W + T&frasl;2) &divide; ballots cast, same math as a real standings page. Heads = confirmed attendees (party size included) for that window.</p>
    </div>

    <div class="section">
      <div class="section-head">
        <h2>Who's Filed</h2>
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
// this script keeps working exactly as it does right now.
(function () {
  var API = ${JSON.stringify(API_BASE)};
  var WINDOWS = ${JSON.stringify(WINDOWS)};
  var codeKey = "reunion_code";
  var picks = {};

  document.getElementById("editionDate").textContent = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();

  function buildPickRows() {
    var wrap = document.getElementById("pickRows");
    wrap.innerHTML = WINDOWS.map(function (w) {
      return '<div class="pick-row" data-id="' + w.id + '">' +
        '<div class="pick-info"><span class="w-label">' + w.label + ' — ' + w.dates + '</span>' +
        '<span class="w-meta">' + w.days + ' · ' + w.note + '</span></div>' +
        '<div class="pick-toggle">' +
          '<button type="button" data-v="yes">Yes</button>' +
          '<button type="button" data-v="maybe">Maybe</button>' +
          '<button type="button" data-v="no">No</button>' +
        '</div></div>';
    }).join("");

    wrap.querySelectorAll(".pick-toggle button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var row = btn.closest(".pick-row");
        var id = row.getAttribute("data-id");
        var v = btn.getAttribute("data-v");
        picks[id] = picks[id] === v ? null : v;
        row.querySelectorAll("button").forEach(function (b) {
          b.classList.toggle("active", picks[id] === b.getAttribute("data-v"));
        });
      });
    });
  }
  buildPickRows();

  function fmtPct(pct) {
    var s = pct.toFixed(3);
    return pct < 1 ? s.replace(/^0/, "") : s;
  }

  function computeStandings(ballots) {
    return WINDOWS.map(function (w) {
      var yes = 0, maybe = 0, no = 0, heads = 0;
      ballots.forEach(function (b) {
        var v = b.picks && b.picks[w.id];
        if (v === "yes") { yes++; heads += b.party_size || 1; }
        else if (v === "maybe") { maybe++; }
        else if (v === "no") { no++; }
      });
      var cast = yes + maybe + no;
      var pct = cast ? (yes + maybe / 2) / cast : 0;
      return { window: w, yes: yes, maybe: maybe, no: no, cast: cast, heads: heads, pct: pct };
    }).sort(function (a, b) {
      return b.pct - a.pct || b.heads - a.heads || a.window.start.localeCompare(b.window.start);
    });
  }

  function renderStandings(ballots) {
    var standings = computeStandings(ballots);
    var body = document.getElementById("boxscoreBody");
    var topPct = standings.length ? standings[0].pct : 0;
    body.innerHTML = standings.map(function (s, i) {
      var isLeader = s.cast > 0 && s.pct === topPct && i === 0;
      return '<tr class="' + (isLeader ? "leader" : "") + '">' +
        '<td class="window-cell"><span class="w-label">' + s.window.label + '</span>' +
        '<span class="w-dates">' + s.window.dates + '</span></td>' +
        '<td class="w-count">' + s.yes + '</td>' +
        '<td>' + s.maybe + '</td>' +
        '<td class="l-count">' + s.no + '</td>' +
        '<td class="pct">' + (s.cast ? fmtPct(s.pct) : '—') + '</td>' +
        '<td>' + s.heads + '</td></tr>';
    }).join("");
    document.getElementById("standingsKicker").textContent = ballots.length + (ballots.length === 1 ? " ballot cast" : " ballots cast");
  }

  function renderRoster(ballots) {
    var el = document.getElementById("roster");
    document.getElementById("rosterKicker").textContent = ballots.length ? "In order of filing" : "";
    if (!ballots.length) {
      el.innerHTML = '<div class="roster-empty">No ballots filed yet. Be the first in the box score.</div>';
      return;
    }
    el.innerHTML = ballots.map(function (b) {
      var yesCount = Object.values(b.picks || {}).filter(function (v) { return v === "yes"; }).length;
      return '<div class="roster-row">' +
        '<span class="roster-name">' + escapeHtml(b.name) + (b.household ? ' <span class="roster-meta">(' + escapeHtml(b.household) + ')</span>' : '') + '</span>' +
        '<span class="roster-meta">' + (b.party_size > 1 ? b.party_size + " people · " : "") + yesCount + " window" + (yesCount === 1 ? "" : "s") + " marked yes</span>" +
        '</div>';
    }).join("");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var currentCode = null;

  function loadData() {
    return fetch(API + "?code=" + encodeURIComponent(currentCode))
      .then(function (r) { if (!r.ok) throw new Error("bad code"); return r.json(); })
      .then(function (data) {
        renderStandings(data.ballots || []);
        renderRoster(data.ballots || []);
      });
  }

  function enterGate(code) {
    currentCode = code;
    return loadData().then(function () {
      localStorage.setItem(codeKey, code);
      document.getElementById("gate").style.display = "none";
      document.getElementById("app").style.display = "block";
    });
  }

  document.getElementById("gateBtn").addEventListener("click", function () {
    var code = document.getElementById("codeInput").value.trim();
    if (!code) return;
    document.getElementById("gateError").style.display = "none";
    enterGate(code).catch(function () {
      document.getElementById("gateError").style.display = "block";
    });
  });
  document.getElementById("codeInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") document.getElementById("gateBtn").click();
  });

  var savedCode = localStorage.getItem(codeKey);
  if (savedCode) {
    document.getElementById("codeInput").value = savedCode;
    enterGate(savedCode).catch(function () { localStorage.removeItem(codeKey); });
  }

  document.getElementById("ballotForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = document.getElementById("ballotMsg");
    var btn = document.getElementById("submitBtn");
    var name = document.getElementById("fName").value.trim();
    var household = document.getElementById("fHousehold").value.trim();
    var partySize = parseInt(document.getElementById("fParty").value, 10) || 1;
    var note = document.getElementById("fNote").value.trim();

    var cleanPicks = {};
    Object.keys(picks).forEach(function (k) { if (picks[k]) cleanPicks[k] = picks[k]; });

    msg.className = "ballot-msg";
    btn.disabled = true;
    btn.textContent = "Filing…";

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: currentCode, name: name, household: household, partySize: partySize, picks: cleanPicks, note: note }),
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.body.error || "Something went wrong.");
        msg.textContent = res.body.message || "Filed.";
        msg.className = "ballot-msg ok";
        return loadData();
      })
      .catch(function (err) {
        msg.textContent = err.message;
        msg.className = "ballot-msg err";
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = "→ File Ballot";
      });
  });
})();
</script>

<script type="module">
// Decoration only — isolated from the functional script above on purpose. If this CDN
// import ever fails, the ballot form and standings table above still work perfectly; only
// the motion is lost. See reunion-site/worker.js's own history for why this split matters.
import { animate, stagger, inView } from 'https://cdn.jsdelivr.net/npm/motion@11/+esm';

animate(".masthead h1", { opacity: [0, 1], y: [-16, 0] }, { duration: 0.6, easing: "ease-out" });
animate(".masthead-tag", { opacity: [0, 1] }, { duration: 0.6, delay: 0.2 });

inView(".section", function (el) {
  // Fades from partial, not 0 — CSS already keeps this at opacity:1 by default (see
  // worker.js's own comment on .section), so this is purely a bonus flourish that can
  // never leave a section looking blank even if it fires at an odd moment.
  animate(el, { opacity: [0.4, 1], y: [24, 0] }, { duration: 0.5, easing: "ease-out" });
}, { margin: "-60px" });

// Stagger box score rows in whenever the table's contents change.
var boxscoreBody = document.getElementById("boxscoreBody");
if (boxscoreBody) {
  var mo = new MutationObserver(function () {
    animate(boxscoreBody.querySelectorAll("tr"), { opacity: [0, 1], x: [-8, 0] }, { delay: stagger(0.04), duration: 0.35 });
  });
  mo.observe(boxscoreBody, { childList: true });
}

var roster = document.getElementById("roster");
if (roster) {
  var mo2 = new MutationObserver(function () {
    animate(roster.querySelectorAll(".roster-row"), { opacity: [0, 1] }, { delay: stagger(0.03), duration: 0.3 });
  });
  mo2.observe(roster, { childList: true });
}

document.querySelectorAll(".pick-toggle button").forEach(function (btn) {
  btn.addEventListener("click", function () {
    animate(btn, { scale: [0.85, 1] }, { duration: 0.25, easing: [0.34, 1.56, 0.64, 1] });
  });
});
</script>

</body>
</html>`;
