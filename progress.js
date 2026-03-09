/* ============================================
   DevOps AI Roadmap — Progress Tracker
   ============================================ */

const MODS = ['m1','m2','m3','m4','m5','m6','m7','m8','m9'];

// ── TOGGLE DAY CARD ──
function toggleDay(card, modId) {
  card.classList.toggle('is-done');
  const done  = card.classList.contains('is-done');
  const title = card.querySelector('.d-title')?.textContent || 'Topic';
  showToast(done ? '✅' : '↩️', done ? `"${title.substring(0,28)}…" complete!` : 'Marked incomplete');
  updateModRing(modId);
  updateGlobal();
  saveProgress();
}

// ── TOGGLE PROJECT ──
function toggleProj(card) {
  card.classList.toggle('is-done');
  const done  = card.classList.contains('is-done');
  const title = card.querySelector('.proj-title')?.textContent || 'Project';
  showToast(done ? '🏆' : '↩️', done ? `${title.substring(0,26)}… done!` : 'Unmarked');
  saveProgress();
}

// ── TOGGLE TECH ITEM ──
function toggleTech(item) {
  item.classList.toggle('is-done');
  const done = item.classList.contains('is-done');
  const name = item.querySelector('.tech-name')?.textContent || 'Tool';
  showToast(done ? '🎯' : '↩️', done ? `${name} — learned!` : `${name} — unmarked`);
  saveProgress();
}

// ── UPDATE MODULE RING ──
function updateModRing(id) {
  const mod = document.getElementById(id);
  if (!mod) return;
  const cards = mod.querySelectorAll('.day-card');
  const done  = mod.querySelectorAll('.day-card.is-done').length;
  const pct   = cards.length ? Math.round(done / cards.length * 100) : 0;
  updateMiniRing('mr-' + id, 'mp-' + id, pct);
  updateSidebarDot('sd-' + id, pct);
}

// ── UPDATE GLOBAL PROGRESS ──
function updateGlobal() {
  const all  = document.querySelectorAll('.day-card');
  const done = document.querySelectorAll('.day-card.is-done');
  const pct  = all.length ? Math.round(done.length / all.length * 100) : 0;

  updateNavProgress(pct);

  // Hero ring
  const circ  = 879.6;
  const ring  = document.getElementById('heroRing');
  const bPct  = document.getElementById('bPct');
  const bSub  = document.getElementById('bSub');
  if (ring) ring.style.strokeDashoffset = circ - circ * pct / 100;
  if (bPct) bPct.textContent = pct + '%';
  if (bSub) bSub.textContent = `${done.length} of ${all.length} topics`;
}

// ── SAVE ──
function saveProgress() {
  const days = [];
  MODS.forEach(m => {
    const mod = document.getElementById(m);
    if (!mod) return;
    mod.querySelectorAll('.day-card').forEach((c, i) => {
      if (c.classList.contains('is-done')) days.push({ m, i });
    });
  });

  const projs = [];
  document.querySelectorAll('.proj-card').forEach((c, i) => {
    if (c.classList.contains('is-done')) projs.push(i);
  });

  const techs = [];
  document.querySelectorAll('.tech-item').forEach((c, i) => {
    if (c.classList.contains('is-done')) techs.push(i);
  });

  Store.set('dvp', { days, projs, techs });
}

// ── RESTORE ──
function restoreProgress() {
  const data = Store.get('dvp');
  if (!data) return;

  if (data.days) {
    data.days.forEach(({ m, i }) => {
      const mod = document.getElementById(m);
      if (!mod) return;
      const cards = mod.querySelectorAll('.day-card');
      if (cards[i]) cards[i].classList.add('is-done');
    });
  }

  if (data.projs) {
    const projCards = document.querySelectorAll('.proj-card');
    data.projs.forEach(i => { if (projCards[i]) projCards[i].classList.add('is-done'); });
  }

  if (data.techs) {
    const techItems = document.querySelectorAll('.tech-item');
    data.techs.forEach(i => { if (techItems[i]) techItems[i].classList.add('is-done'); });
  }

  MODS.forEach(updateModRing);
  updateGlobal();
}

// ── RESET ALL ──
function resetAll() {
  if (!confirm('Reset all progress? This cannot be undone.')) return;
  document.querySelectorAll('.day-card, .proj-card, .tech-item').forEach(el => el.classList.remove('is-done'));
  Store.set('dvp', {});
  MODS.forEach(updateModRing);
  updateGlobal();
  showToast('🔄', 'Progress reset');
}

// ── STATS ──
function getStats() {
  const all     = document.querySelectorAll('.day-card').length;
  const done    = document.querySelectorAll('.day-card.is-done').length;
  const mods    = MODS.filter(m => {
    const mod = document.getElementById(m);
    return mod && mod.querySelectorAll('.day-card').length === mod.querySelectorAll('.day-card.is-done').length;
  }).length;
  return { all, done, mods, pct: all ? Math.round(done/all*100) : 0 };
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', restoreProgress);
