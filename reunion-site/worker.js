// Reunion Gazette — standalone Worker serving reunion.burkeruder.ai.
// Deliberately its own tiny Worker, not a route inside the main Next.js site: it needs to
// feel like a different publication, not another page in the ocean-themed portfolio. Talks
// to the existing /api/reunion Pages Function on burkeruder.ai (CORS already open) rather
// than duplicating that backend — this Worker is presentation only, no D1 binding of its own.

const API_BASE = "https://burkeruder.ai/api/reunion";
const REUNION_YEAR = 2027;

// Calendar months polled — JS month index (0-based): June=5, July=6, August=7.
// A day's pick is stored as { "2027-06-15": "yes" } — only selected days are ever sent,
// which fits the existing /api/reunion contract (picks is just Record<string, Vote>, any
// string key up to 40 chars) with zero backend changes.
const MONTHS = [
  { year: REUNION_YEAR, month: 5, name: "June" },
  { year: REUNION_YEAR, month: 6, name: "July" },
  { year: REUNION_YEAR, month: 7, name: "August" },
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

/* ── WHO-YOU-ARE CARD ────────────────────────────────────── */
.whoami {
  background: var(--bg-soft); border: 1px solid var(--line); border-radius: 8px; padding: clamp(16px,3vw,24px);
  margin-bottom: 28px;
}
.field { margin-bottom: 14px; }
.field:last-child { margin-bottom: 0; }
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
.save-status {
  font-size: 0.78rem; margin-top: 4px; min-height: 1.2em; color: var(--muted);
}
.save-status.ok { color: var(--win); }
.save-status.err { color: var(--loss); }

/* ── CALENDAR PICKER ─────────────────────────────────────── */
.cal-months { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
@media (max-width: 680px) { .cal-months { grid-template-columns: 1fr; max-width: 320px; margin: 0 auto; } }
.cal-month-name {
  font-weight: 700; font-size: 0.85rem; text-align: center; margin-bottom: 10px;
}
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
.cal-weekday { font-size: 0.6rem; color: var(--muted); text-align: center; padding-bottom: 4px; font-weight: 600; }
.cal-day {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  font-size: 0.78rem; border-radius: 5px; cursor: pointer; user-select: none;
  border: 1.5px solid var(--line); background: #fff; color: var(--ink); font-weight: 500;
  transition: transform 0.1s, background 0.15s, color 0.15s, border-color 0.15s;
}
.cal-day:hover { border-color: var(--ink); }
.cal-day:active { transform: scale(0.92); }
.cal-day.blank { visibility: hidden; cursor: default; }
.cal-day.selected { background: var(--ink); border-color: var(--ink); color: #fff; font-weight: 700; }
.cal-legend { display: flex; align-items: center; gap: 8px; margin-top: 16px; font-size: 0.75rem; color: var(--muted); }
.cal-legend .cal-day { width: 18px; height: 18px; aspect-ratio: unset; font-size: 0; flex-shrink: 0; cursor: default; }

/* ── HEAT CALENDAR (overlap) ─────────────────────────────── */
.heat-day { color: var(--ink); font-weight: 600; border-color: var(--line); cursor: default; }
.heat-day:hover { border-color: var(--line); }
.heat-day:active { transform: none; }
.heat-day.top1::after { content: '\\2605'; position: absolute; font-size: 0.55em; transform: translate(9px, -9px); color: var(--ink); }
.heat-day { position: relative; }
.heat-scale { display: flex; align-items: center; gap: 6px; margin-top: 16px; font-size: 0.72rem; color: var(--muted); }
.heat-scale .sw { width: 14px; height: 14px; border-radius: 3px; border: 1px solid var(--line); }

.top-days { margin-top: 28px; }
.top-days ol { list-style: none; counter-reset: rank; }
.top-days li {
  counter-increment: rank; padding: 10px 0; border-bottom: 1px solid var(--line);
  display: flex; align-items: baseline; gap: 12px; font-size: 0.9rem;
}
.top-days li:last-child { border-bottom: none; }
.top-days li::before {
  content: counter(rank); font-family: 'Source Serif 4', Georgia, serif; font-weight: 700;
  color: var(--muted); font-size: 0.85rem; width: 1.4em; flex-shrink: 0;
}
.top-days .td-date { font-weight: 600; flex-shrink: 0; }
.top-days .td-count { color: var(--muted); font-size: 0.82rem; }
.top-days-empty { color: var(--muted); font-size: 0.88rem; padding: 12px 0; }

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
    <div class="masthead-tag">Every Day Marked — Every Overlap Counted</div>
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
      Tap every day in June, July, or August you could make it — your picks save automatically. Scroll down to see where the family overlaps.
    </p>

    <div class="section">
      <div class="section-head">
        <h2>Mark Your Days</h2>
        <span class="kicker" id="saveKicker">Saves automatically</span>
      </div>

      <div class="whoami">
        <div class="field-row">
          <div class="field">
            <label for="fName">Name *</label>
            <input id="fName" maxlength="60" placeholder="Your name">
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
        <div class="field">
          <label for="fNote">Note (optional)</label>
          <textarea id="fNote" rows="2" maxlength="280" placeholder="Anything the committee should know…"></textarea>
        </div>
        <div class="save-status" id="saveStatus">Add your name above, then tap days on the calendar below.</div>
      </div>

      <div class="cal-months" id="pickerCal"></div>
      <div class="cal-legend">
        <span class="cal-day"></span> <span>open</span>
        <span class="cal-day selected" style="margin-left:10px;"></span> <span>you're in</span>
      </div>
    </div>

    <div class="section">
      <div class="section-head">
        <h2>Best Days</h2>
        <span class="kicker" id="heatKicker">— ballots</span>
      </div>
      <div class="cal-months" id="heatCal"></div>
      <div class="heat-scale">
        <span>Fewer</span>
        <span class="sw" style="background:rgba(var(--heat),0.08)"></span>
        <span class="sw" style="background:rgba(var(--heat),0.3)"></span>
        <span class="sw" style="background:rgba(var(--heat),0.55)"></span>
        <span class="sw" style="background:rgba(var(--heat),0.8)"></span>
        <span class="sw" style="background:rgba(var(--heat),1)"></span>
        <span>More people free</span>
      </div>
      <div class="top-days" id="topDays"></div>
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
  var MONTHS = ${JSON.stringify(MONTHS)};
  var codeKey = "reunion_code";
  var identityKey = "reunion_identity";
  var WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  document.getElementById("editionDate").textContent = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  function dateKey(year, month, day) { return year + "-" + pad2(month + 1) + "-" + pad2(day); }
  function fmtDateLabel(key) {
    var parts = key.split("-").map(Number);
    var d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  function buildCalGrid(containerEl, opts) {
    // opts: { onCellClick(key, cellEl) } — if omitted, cells render read-only (heat map).
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
        var cell = document.createElement("div");
        cell.className = opts.heat ? "cal-day heat-day" : "cal-day";
        cell.textContent = day;
        cell.setAttribute("data-date", key);
        if (opts.onCellClick) cell.addEventListener("click", function () { opts.onCellClick(this.getAttribute("data-date"), this); });
        grid.appendChild(cell);
      }
      wrap.appendChild(grid);
      containerEl.appendChild(wrap);
    });
  }

  // ── Picker calendar (my own picks) ──────────────────────────────────────
  var myPicks = {};
  var pickerEl = document.getElementById("pickerCal");
  buildCalGrid(pickerEl, {
    onCellClick: function (key, cellEl) {
      if (myPicks[key]) delete myPicks[key];
      else myPicks[key] = "yes";
      cellEl.classList.toggle("selected", !!myPicks[key]);
      scheduleSave();
    },
  });

  function refreshPickerSelection() {
    pickerEl.querySelectorAll(".cal-day[data-date]").forEach(function (cell) {
      cell.classList.toggle("selected", !!myPicks[cell.getAttribute("data-date")]);
    });
  }

  // ── Heat calendar (everyone's overlap) ──────────────────────────────────
  var heatEl = document.getElementById("heatCal");
  buildCalGrid(heatEl, { heat: true });

  function renderHeat(ballots) {
    var headsByDate = {}, housesByDate = {};
    ballots.forEach(function (b) {
      Object.keys(b.picks || {}).forEach(function (k) {
        if (b.picks[k] !== "yes") return;
        headsByDate[k] = (headsByDate[k] || 0) + (b.party_size || 1);
        housesByDate[k] = (housesByDate[k] || 0) + 1;
      });
    });
    var maxHeads = 0;
    Object.keys(headsByDate).forEach(function (k) { if (headsByDate[k] > maxHeads) maxHeads = headsByDate[k]; });

    heatEl.querySelectorAll(".cal-day[data-date]").forEach(function (cell) {
      var key = cell.getAttribute("data-date");
      var heads = headsByDate[key] || 0;
      cell.classList.remove("top1");
      if (heads > 0) {
        var ratio = maxHeads ? heads / maxHeads : 0;
        cell.style.background = "rgba(var(--heat), " + (0.08 + ratio * 0.87) + ")";
        cell.style.borderColor = "transparent";
        cell.style.color = ratio > 0.55 ? "#fff" : "var(--ink)";
        cell.textContent = heads;
        cell.title = fmtDateLabel(key) + " — " + heads + " available";
      } else {
        cell.style.background = "";
        cell.style.borderColor = "";
        cell.style.color = "";
        cell.textContent = cell.getAttribute("data-date").slice(-2).replace(/^0/, "");
        cell.title = "";
      }
    });

    var ranked = Object.keys(headsByDate)
      .map(function (k) { return { key: k, heads: headsByDate[k], houses: housesByDate[k] }; })
      .sort(function (a, b) { return b.heads - a.heads || b.houses - a.houses || a.key.localeCompare(b.key); })
      .slice(0, 8);

    if (ranked.length) {
      heatEl.querySelectorAll('.cal-day[data-date="' + ranked[0].key + '"]').forEach(function (c) { c.classList.add("top1"); });
    }

    var topDaysEl = document.getElementById("topDays");
    if (!ranked.length) {
      topDaysEl.innerHTML = '<div class="top-days-empty">No picks yet — be the first to mark a day.</div>';
    } else {
      topDaysEl.innerHTML = "<ol>" + ranked.map(function (r) {
        return "<li><span class=\\"td-date\\">" + fmtDateLabel(r.key) + "</span>" +
          "<span class=\\"td-count\\">" + r.heads + (r.heads === 1 ? " person" : " people") + " · " + r.houses + (r.houses === 1 ? " household" : " households") + "</span></li>";
      }).join("") + "</ol>";
    }
  }

  function renderRoster(ballots) {
    var el = document.getElementById("roster");
    document.getElementById("rosterKicker").textContent = ballots.length ? "In order of filing" : "";
    document.getElementById("heatKicker").textContent = ballots.length + (ballots.length === 1 ? " ballot cast" : " ballots cast");
    if (!ballots.length) {
      el.innerHTML = '<div class="roster-empty">No ballots filed yet. Be the first to mark a day.</div>';
      return;
    }
    el.innerHTML = ballots.map(function (b) {
      var dayCount = Object.values(b.picks || {}).filter(function (v) { return v === "yes"; }).length;
      return '<div class="roster-row">' +
        '<span class="roster-name">' + escapeHtml(b.name) + (b.household ? ' <span class="roster-meta">(' + escapeHtml(b.household) + ')</span>' : '') + '</span>' +
        '<span class="roster-meta">' + (b.party_size > 1 ? b.party_size + " people · " : "") + dayCount + " day" + (dayCount === 1 ? "" : "s") + " marked</span>" +
        '</div>';
    }).join("");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var currentCode = null;

  function findMyBallot(ballots) {
    var name = document.getElementById("fName").value.trim().toLowerCase();
    var household = document.getElementById("fHousehold").value.trim().toLowerCase();
    if (!name) return null;
    return ballots.filter(function (b) {
      return b.name.trim().toLowerCase() === name && (b.household || "").trim().toLowerCase() === household;
    })[0] || null;
  }

  function loadData() {
    return fetch(API + "?code=" + encodeURIComponent(currentCode))
      .then(function (r) { if (!r.ok) throw new Error("bad code"); return r.json(); })
      .then(function (data) {
        var ballots = data.ballots || [];
        renderHeat(ballots);
        renderRoster(ballots);
        return ballots;
      });
  }

  function enterGate(code) {
    currentCode = code;
    return loadData().then(function (ballots) {
      localStorage.setItem(codeKey, code);
      document.getElementById("gate").style.display = "none";
      document.getElementById("app").style.display = "block";

      var savedIdentity = JSON.parse(localStorage.getItem(identityKey) || "null");
      if (savedIdentity) {
        document.getElementById("fName").value = savedIdentity.name || "";
        document.getElementById("fHousehold").value = savedIdentity.household || "";
        document.getElementById("fParty").value = savedIdentity.partySize || 1;
        document.getElementById("fNote").value = savedIdentity.note || "";
      }
      var mine = findMyBallot(ballots);
      if (mine) {
        myPicks = Object.assign({}, mine.picks);
        refreshPickerSelection();
        setStatus("Welcome back — your picks are loaded. Tap a day to change it.", "ok");
      }
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

  // ── Auto-save ────────────────────────────────────────────────────────
  var saveTimer = null;
  var saving = false;
  var saveAgainAfter = false;

  function setStatus(text, cls) {
    var el = document.getElementById("saveStatus");
    el.textContent = text;
    el.className = "save-status" + (cls ? " " + cls : "");
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(doSave, 600);
  }

  function doSave() {
    var name = document.getElementById("fName").value.trim();
    if (!name) {
      setStatus("Add your name above, then tap days on the calendar below.");
      return;
    }
    if (Object.keys(myPicks).length === 0) {
      setStatus("Tap a day on the calendar below to save your availability.");
      return;
    }
    if (saving) { saveAgainAfter = true; return; }
    saving = true;

    var household = document.getElementById("fHousehold").value.trim();
    var partySize = parseInt(document.getElementById("fParty").value, 10) || 1;
    var note = document.getElementById("fNote").value.trim();

    localStorage.setItem(identityKey, JSON.stringify({ name: name, household: household, partySize: partySize, note: note }));
    setStatus("Saving…");

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: currentCode, name: name, household: household, partySize: partySize, picks: myPicks, note: note }),
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.body.error || "Something went wrong.");
        setStatus("Saved — " + Object.keys(myPicks).length + " day" + (Object.keys(myPicks).length === 1 ? "" : "s") + " marked.", "ok");
        return loadData();
      })
      .catch(function (err) {
        setStatus(err.message, "err");
      })
      .finally(function () {
        saving = false;
        if (saveAgainAfter) { saveAgainAfter = false; scheduleSave(); }
      });
  }

  ["fName", "fHousehold", "fParty", "fNote"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", function () {
      if (Object.keys(myPicks).length > 0) scheduleSave();
    });
  });
})();
</script>

<script type="module">
// Decoration only — isolated from the functional script above on purpose. If this CDN
// import ever fails, the calendar and standings above still work perfectly; only the
// motion is lost. See reunion-site/worker.js's own history for why this split matters.
import { animate, stagger, inView } from 'https://cdn.jsdelivr.net/npm/motion@11/+esm';

animate(".masthead h1", { opacity: [0, 1], y: [-16, 0] }, { duration: 0.6, easing: "ease-out" });
animate(".masthead-tag", { opacity: [0, 1] }, { duration: 0.6, delay: 0.2 });

inView(".section", function (el) {
  // Fades from partial, not 0 — CSS already keeps this at opacity:1 by default (see
  // worker.js's own comment on .section), so this is purely a bonus flourish that can
  // never leave a section looking blank even if it fires at an odd moment.
  animate(el, { opacity: [0.4, 1], y: [24, 0] }, { duration: 0.5, easing: "ease-out" });
}, { margin: "-60px" });

// Stagger each month's grid in once, on first paint.
document.querySelectorAll(".cal-months").forEach(function (group) {
  animate(group.querySelectorAll(".cal-month-name"), { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.08), duration: 0.4 });
});

document.addEventListener("click", function (e) {
  var day = e.target.closest(".cal-day:not(.blank):not(.heat-day)");
  if (day) animate(day, { scale: [0.8, 1] }, { duration: 0.25, easing: [0.34, 1.56, 0.64, 1] });
});

// Re-flash the roster whenever it updates.
var roster = document.getElementById("roster");
if (roster) {
  var mo = new MutationObserver(function () {
    animate(roster.querySelectorAll(".roster-row"), { opacity: [0, 1] }, { delay: stagger(0.03), duration: 0.3 });
  });
  mo.observe(roster, { childList: true });
}
</script>

</body>
</html>`;
