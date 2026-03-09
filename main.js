/* ============================================
   DevOps AI Roadmap — Shared JavaScript
   ============================================ */

// ── NEURAL NETWORK CANVAS ──
function initNeural(canvasId = 'nc') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let nodes = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initNodes() {
    nodes = [];
    const count = Math.floor(canvas.width * canvas.height / 20000);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r:  Math.random() * 1.5 + 0.5
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const maxDist = 130;

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${(1 - d/maxDist) * 0.07})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99,102,241,0.22)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize(); initNodes(); draw();
  window.addEventListener('resize', () => { resize(); initNodes(); });
}

// ── TOAST NOTIFICATION ──
let toastTimeout;
function showToast(icon = '✅', msg = 'Done!') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('tIcon').textContent = icon;
  document.getElementById('tMsg').textContent  = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ── NAV PROGRESS ──
function updateNavProgress(pct) {
  const fill = document.getElementById('navFill');
  const txt  = document.getElementById('navPct');
  if (fill) fill.style.width = pct + '%';
  if (txt)  txt.textContent  = pct + '%';
}

// ── SESSION STORAGE HELPERS ──
const Store = {
  get(key) {
    try { return JSON.parse(sessionStorage.getItem(key)) || null; }
    catch { return null; }
  },
  set(key, val) {
    try { sessionStorage.setItem(key, JSON.stringify(val)); }
    catch {}
  }
};

// ── MINI RING UPDATER ──
function updateMiniRing(ringId, txtId, pct, circ = 119.4) {
  const ring = document.getElementById(ringId);
  const txt  = document.getElementById(txtId);
  if (ring) ring.style.strokeDashoffset = circ - circ * pct / 100;
  if (txt)  txt.textContent = pct + '%';
}

// ── SIDEBAR DOT UPDATER ──
function updateSidebarDot(dotId, pct) {
  const dot = document.getElementById(dotId);
  if (!dot) return;
  dot.className = 'sb-dot' + (pct === 100 ? ' done' : pct > 0 ? ' partial' : '');
}

// ── MODULE TOGGLE ──
function toggleMod(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}
function openMod(id) {
  const el = document.getElementById(id);
  if (el && !el.classList.contains('open')) el.classList.add('open');
}

// ── MARK ACTIVE NAV ──
function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
}

// ── INIT ON LOAD ──
document.addEventListener('DOMContentLoaded', () => {
  initNeural();
  markActiveNav();
});
