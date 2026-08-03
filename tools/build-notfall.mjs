// Erzeugt notfall.html aus dem Fragenkatalog in index.html.
//
// Die Notfallseite muss ohne Netz funktionieren: kein Supabase, kein CDN, keine
// zweite Datei. Deshalb wird der Katalog hier hineinkopiert statt geladen. Damit
// beide nicht auseinanderlaufen, ist diese Datei die einzige erlaubte Quelle -
// nach jeder Aenderung an den Fragen neu ausfuehren:
//
//   node tools/build-notfall.mjs
//
// Die CI prueft mit --check, ob notfall.html zum aktuellen Katalog passt.

import { readFileSync, writeFileSync } from 'node:fs';

const START = 'const SELBSTVORSTELLUNG_CHECKS = [';
const END = 'const recruitingDb =';

const src = readFileSync('index.html', 'utf8');
const from = src.indexOf(START);
const to = src.indexOf(END);
if (from < 0 || to < 0 || to <= from) {
  console.error('Katalogblock nicht gefunden. Grenzen in build-notfall.mjs pruefen.');
  process.exit(2);
}
const catalog = src.slice(from, to).trimEnd();

// Nichts aus dem Katalog darf auf Netz oder Datenbank zeigen.
for (const forbidden of ['sb.', 'supabase', 'fetch(', 'https://']) {
  if (catalog.includes(forbidden)) {
    console.error(`Katalog enthaelt "${forbidden}" - die Notfallseite muss netzfrei bleiben.`);
    process.exit(3);
  }
}

const page = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ROOTS Recruiting · Notbetrieb</title>
<!--
  ERZEUGTE DATEI - nicht direkt bearbeiten.
  Quelle: index.html, Generator: tools/build-notfall.mjs
  Zweck: Gespraech fuehren, wenn Intranet, Supabase oder GitHub nicht erreichbar
  sind. Keine Netzwerkaufrufe, keine Datenbank, kein Login. Zwischenstand liegt
  im Local Storage, das Ergebnis wird als Markdown heruntergeladen.
-->
<style>
  :root { --ink:#111827; --muted:#6b7280; --line:#e5e7eb; --bg:#f9fafb; --card:#fff; --accent:#1d4ed8; --warn:#b45309; --warnbg:#fffbeb; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif; }
  .wrap { max-width:900px; margin:0 auto; padding:1.5rem 1.25rem 5rem; }
  .banner { background:var(--warnbg); border:1px solid #fcd34d; color:var(--warn); border-radius:10px; padding:.85rem 1rem; margin-bottom:1.25rem; font-size:.9rem; }
  .banner b { display:block; font-size:1rem; margin-bottom:.15rem; }
  h1 { font-size:1.35rem; margin:0 0 .35rem; }
  .sub { color:var(--muted); font-size:.9rem; margin:0 0 1.5rem; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:1.1rem 1.2rem; margin-bottom:1rem; }
  .card h2 { font-size:1.05rem; margin:0 0 .2rem; }
  .card .time { color:var(--muted); font-size:.82rem; margin:0 0 .9rem; }
  label { display:block; font-size:.82rem; color:var(--muted); margin:.7rem 0 .25rem; }
  input[type=text], input[type=date], select, textarea { width:100%; padding:.55rem .7rem; border:1px solid var(--line); border-radius:8px; font:inherit; background:#fff; color:var(--ink); }
  textarea { min-height:76px; resize:vertical; }
  .meta-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:.5rem 1rem; }
  .q { border-top:1px solid var(--line); padding-top:.9rem; margin-top:.9rem; }
  .q:first-of-type { border-top:0; padding-top:0; margin-top:0; }
  .q-text { font-weight:600; margin:0 0 .3rem; }
  .q-follow { color:var(--muted); font-size:.85rem; margin:0 0 .4rem; }
  .checks { margin:.4rem 0 0; padding:0; list-style:none; }
  .checks li { display:flex; gap:.45rem; align-items:flex-start; font-size:.88rem; margin:.2rem 0; }
  .eval { background:var(--bg); border-radius:8px; padding:.6rem .7rem; margin-top:.6rem; }
  .eval-label { font-size:.85rem; font-weight:600; margin:0 0 .35rem; }
  .scale { display:flex; gap:.3rem; flex-wrap:wrap; }
  .scale button { min-width:2.2rem; padding:.35rem .5rem; border:1px solid var(--line); background:#fff; border-radius:6px; cursor:pointer; font:inherit; }
  .scale button[aria-pressed=true] { background:var(--accent); color:#fff; border-color:var(--accent); }
  .anchors { font-size:.78rem; color:var(--muted); margin:.35rem 0 0; }
  .bar { position:fixed; left:0; right:0; bottom:0; background:#fff; border-top:1px solid var(--line); padding:.7rem 1rem; display:flex; gap:.6rem; align-items:center; justify-content:space-between; }
  .bar-status { font-size:.83rem; color:var(--muted); }
  .btn { padding:.55rem .9rem; border-radius:8px; border:1px solid var(--line); background:#fff; font:inherit; cursor:pointer; }
  .btn-primary { background:var(--accent); color:#fff; border-color:var(--accent); font-weight:600; }
  .hidden { display:none !important; }
</style>
</head>
<body>
<div class="wrap">
  <div class="banner">
    <b>Notbetrieb</b>
    Diese Seite arbeitet vollständig offline. Es werden keine Daten geladen oder gesendet. Der Zwischenstand bleibt in diesem Browser, das Ergebnis lädst du am Ende als Markdown herunter und trägst es später im Tool nach.
  </div>

  <h1>Gespräch im Notbetrieb</h1>

  <div class="card" id="setup">
    <h2>Gespräch anlegen</h2>
    <div class="meta-grid">
      <div><label for="m-kandidat">Bewerber</label><input type="text" id="m-kandidat" placeholder="Vor- und Nachname"></div>
      <div><label for="m-interviewer">Interviewer</label><input type="text" id="m-interviewer" placeholder="Dein Name"></div>
      <div><label for="m-datum">Datum</label><input type="date" id="m-datum"></div>
      <div><label for="m-runde">Runde</label><select id="m-runde"><option value="erst">Erstgespräch</option><option value="zweit">Zweitgespräch</option></select></div>
    </div>
    <p style="margin:1rem 0 0"><button class="btn btn-primary" id="btn-start">Gespräch starten</button>
    <button class="btn hidden" id="btn-resume">Gespeicherten Stand fortsetzen</button></p>
  </div>

  <div id="sections"></div>

  <div class="card hidden" id="closing">
    <h2>Abschluss</h2>
    <label for="c-note">Gesamtnote</label>
    <input type="text" id="c-note" placeholder="z. B. 4 von 5">
    <label for="c-reco">Empfehlung</label>
    <select id="c-reco"></select>
    <label for="c-remark">Freie Anmerkung</label>
    <textarea id="c-remark" placeholder="Alles, was sonst nirgends passt"></textarea>
  </div>
</div>

<div class="bar hidden" id="bar">
  <span class="bar-status" id="status">Nicht gespeichert</span>
  <span>
    <button class="btn" id="btn-md">Markdown jetzt herunterladen</button>
    <button class="btn btn-primary" id="btn-finish">Abschließen &amp; herunterladen</button>
  </span>
</div>

<script>
// ─── Fragenkatalog, kopiert aus index.html durch tools/build-notfall.mjs ───
${catalog}

// ─── Notbetrieb: Zustand, Speichern, Rendern, Markdown ───
const STORE_KEY = 'roots-notfall-interview';
const RECO = { erst: RECO_OPTIONS_ERST, zweit: RECO_OPTIONS_ZWEIT };
let data = null;

const esc = (v) => String(v == null ? '' : v);
const el = (id) => document.getElementById(id);

function blank() {
  return {
    meta: { kandidat: '', interviewer: '', datum: '', runde: 'erst' },
    notes: {}, ratings: {}, checks: {},
    gesamtNote: '', recommendation: '', anmerkung: '',
    startedAt: new Date().toISOString(),
  };
}

function save(label) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    el('status').textContent = label || ('Lokal gesichert · ' + new Date().toLocaleTimeString('de-DE'));
  } catch (e) {
    el('status').textContent = 'Lokales Speichern fehlgeschlagen – bitte Markdown herunterladen';
  }
}

function sectionsFor(runde) {
  return runde === 'zweit' ? SECTIONS_ZWEIT : SECTIONS_ERST;
}

function renderSections() {
  const host = el('sections');
  host.innerHTML = sectionsFor(data.meta.runde).map((s) => {
    const questions = Array.isArray(s.questions) ? s.questions : [];
    const blockEvals = s.blockEvaluation?.evaluations || [];
    const body = questions.map((q) => {
      const checks = Array.isArray(q.checks) ? q.checks : [];
      return '<div class="q">'
        + '<p class="q-text">' + esc(q.text) + '</p>'
        + (q.followUp ? '<p class="q-follow">' + esc(q.followUp) + '</p>' : '')
        + (checks.length ? '<ul class="checks">' + checks.map((c, i) => {
            const key = q.id + '::' + i;
            const text = typeof c === 'string' ? c : (c.text || c.label || '');
            return '<li><input type="checkbox" data-check="' + key + '"' + (data.checks[key] ? ' checked' : '') + '><span>' + esc(text) + '</span></li>';
          }).join('') + '</ul>' : '')
        + '<label>Notizen</label><textarea data-note="' + q.id + '">' + esc(data.notes[q.id]) + '</textarea>'
        + (q.evaluations || []).map((ev) => evalHtml(q.id, ev)).join('')
        + '</div>';
    }).join('');
    return '<div class="card">'
      + '<h2>' + esc(s.main) + '</h2>'
      + '<p class="time">' + esc(s.time || '') + '</p>'
      + body
      + blockEvals.map((ev) => evalHtml(s.blockEvaluation.id, ev)).join('')
      + '</div>';
  }).join('');
  bindSections();
}

function evalHtml(ownerId, ev) {
  const key = ownerId + '::' + (ev.dimension || ev.label);
  const current = data.ratings[key];
  const buttons = [1, 2, 3, 4, 5].map((n) =>
    '<button type="button" data-rate="' + key + '" data-value="' + n + '" aria-pressed="' + (current === n ? 'true' : 'false') + '">' + n + '</button>'
  ).join('');
  return '<div class="eval">'
    + '<p class="eval-label">' + esc(ev.label) + (ev.dimension && DIMENSIONS[ev.dimension] ? ' · ' + esc(DIMENSIONS[ev.dimension]) : '') + '</p>'
    + '<div class="scale">' + buttons + '</div>'
    + '<p class="anchors"><b>1</b> ' + esc(ev.anchor1) + ' &nbsp;·&nbsp; <b>3</b> ' + esc(ev.anchor3) + ' &nbsp;·&nbsp; <b>5</b> ' + esc(ev.anchor5) + '</p>'
    + '</div>';
}

function bindSections() {
  document.querySelectorAll('[data-note]').forEach((box) => {
    box.addEventListener('input', () => { data.notes[box.dataset.note] = box.value; save(); });
  });
  document.querySelectorAll('[data-check]').forEach((box) => {
    box.addEventListener('change', () => { data.checks[box.dataset.check] = box.checked; save(); });
  });
  document.querySelectorAll('[data-rate]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.rate;
      const value = Number(btn.dataset.value);
      data.ratings[key] = data.ratings[key] === value ? null : value;
      document.querySelectorAll('[data-rate="' + key + '"]').forEach((b) => {
        b.setAttribute('aria-pressed', Number(b.dataset.value) === data.ratings[key] ? 'true' : 'false');
      });
      save();
    });
  });
}

function renderClosing() {
  const sel = el('c-reco');
  const options = RECO[data.meta.runde] || [];
  sel.innerHTML = '<option value="">– bitte wählen –</option>' + options.map((o) =>
    '<option value="' + esc(o) + '"' + (data.recommendation === o ? ' selected' : '') + '>' + esc(o) + '</option>').join('');
  el('c-note').value = data.gesamtNote || '';
  el('c-remark').value = data.anmerkung || '';
}

function markdown() {
  const m = data.meta;
  const lines = [];
  lines.push('# Interview ' + (m.kandidat || 'ohne Namen'));
  lines.push('');
  lines.push('- Runde: ' + (m.runde === 'zweit' ? 'Zweitgespräch' : 'Erstgespräch'));
  lines.push('- Interviewer: ' + (m.interviewer || '–'));
  lines.push('- Datum: ' + (m.datum || '–'));
  lines.push('- Erfasst im Notbetrieb: ' + new Date().toLocaleString('de-DE'));
  lines.push('');
  for (const s of sectionsFor(m.runde)) {
    lines.push('## ' + s.main + (s.time ? ' (' + s.time + ')' : ''));
    lines.push('');
    for (const q of (s.questions || [])) {
      lines.push('### ' + q.text);
      const checks = Array.isArray(q.checks) ? q.checks : [];
      checks.forEach((c, i) => {
        const text = typeof c === 'string' ? c : (c.text || c.label || '');
        lines.push('- [' + (data.checks[q.id + '::' + i] ? 'x' : ' ') + '] ' + text);
      });
      const note = data.notes[q.id];
      lines.push('');
      lines.push(note ? note : '_keine Notiz_');
      for (const ev of (q.evaluations || [])) {
        const key = q.id + '::' + (ev.dimension || ev.label);
        lines.push('');
        lines.push('**' + ev.label + ':** ' + (data.ratings[key] ? data.ratings[key] + ' von 5' : 'nicht bewertet'));
      }
      lines.push('');
    }
    for (const ev of (s.blockEvaluation?.evaluations || [])) {
      const key = s.blockEvaluation.id + '::' + (ev.dimension || ev.label);
      lines.push('**' + ev.label + ':** ' + (data.ratings[key] ? data.ratings[key] + ' von 5' : 'nicht bewertet'));
      lines.push('');
    }
  }
  lines.push('## Abschluss');
  lines.push('');
  lines.push('- Gesamtnote: ' + (data.gesamtNote || '–'));
  lines.push('- Empfehlung: ' + (data.recommendation || '–'));
  lines.push('');
  lines.push(data.anmerkung || '_keine Anmerkung_');
  return lines.join('\\n');
}

function download() {
  const m = data.meta;
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  const name = 'ROOTS-Interview-Notbetrieb-' + (m.kandidat || 'ohne-Namen').replace(/[^\\wÀ-ž -]/g, '').trim().replace(/\\s+/g, '-') + '-' + stamp + '.md';
  const blob = new Blob([markdown()], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return name;
}

function begin(existing) {
  data = existing || blank();
  if (!existing) {
    data.meta = {
      kandidat: el('m-kandidat').value.trim(),
      interviewer: el('m-interviewer').value.trim(),
      datum: el('m-datum').value,
      runde: el('m-runde').value,
    };
  } else {
    el('m-kandidat').value = data.meta.kandidat || '';
    el('m-interviewer').value = data.meta.interviewer || '';
    el('m-datum').value = data.meta.datum || '';
    el('m-runde').value = data.meta.runde || 'erst';
  }
  el('closing').classList.remove('hidden');
  el('bar').classList.remove('hidden');
  renderSections();
  renderClosing();
  save('Gespräch gestartet · lokal gesichert');
}

el('btn-start').addEventListener('click', () => {
  if (!el('m-kandidat').value.trim()) { alert('Bitte den Namen des Bewerbers eintragen.'); return; }
  begin(null);
});

el('btn-resume').addEventListener('click', () => {
  try { begin(JSON.parse(localStorage.getItem(STORE_KEY))); }
  catch (e) { alert('Gespeicherter Stand konnte nicht gelesen werden.'); }
});

['m-kandidat', 'm-interviewer', 'm-datum'].forEach((id) => {
  el(id).addEventListener('input', () => {
    if (!data) return;
    data.meta.kandidat = el('m-kandidat').value.trim();
    data.meta.interviewer = el('m-interviewer').value.trim();
    data.meta.datum = el('m-datum').value;
    save();
  });
});

el('m-runde').addEventListener('change', () => {
  if (!data) return;
  data.meta.runde = el('m-runde').value;
  renderSections(); renderClosing(); save();
});

['c-note', 'c-remark'].forEach((id) => {
  el(id).addEventListener('input', () => {
    if (!data) return;
    data.gesamtNote = el('c-note').value;
    data.anmerkung = el('c-remark').value;
    save();
  });
});

el('c-reco').addEventListener('change', () => {
  if (!data) return;
  data.recommendation = el('c-reco').value;
  save();
});

el('btn-md').addEventListener('click', () => {
  if (!data) { alert('Erst ein Gespräch starten.'); return; }
  save('Markdown heruntergeladen: ' + download());
});

el('btn-finish').addEventListener('click', () => {
  if (!data) { alert('Erst ein Gespräch starten.'); return; }
  data.finishedAt = new Date().toISOString();
  const name = download();
  save('Abgeschlossen · ' + name + ' liegt in deinen Downloads');
  alert('Fertig. ' + name + ' wurde heruntergeladen.\\n\\nDer Stand bleibt zusätzlich in diesem Browser, bis du ihn im Tool nachträgst.');
});

// Vorhandenen Stand anbieten, ohne ihn ungefragt zu überschreiben.
(function () {
  el('m-datum').value = new Date().toISOString().slice(0, 10);
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { saved = null; }
  if (saved?.meta) {
    el('btn-resume').classList.remove('hidden');
    el('btn-resume').textContent = 'Stand fortsetzen: ' + (saved.meta.kandidat || 'ohne Namen');
  }
})();
</script>
</body>
</html>
`;

if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync('notfall.html', 'utf8'); } catch { current = ''; }
  if (current !== page) {
    console.error('notfall.html ist nicht aktuell. Bitte "node tools/build-notfall.mjs" ausfuehren und mitcommitten.');
    process.exit(1);
  }
  console.log('notfall.html ist aktuell.');
} else {
  writeFileSync('notfall.html', page);
  console.log('notfall.html geschrieben,', page.length, 'Zeichen, Katalog', catalog.length, 'Zeichen.');
}
