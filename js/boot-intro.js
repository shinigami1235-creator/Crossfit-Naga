// Decides whether the logo intro plays, loads the 3D version, and falls back to a flat one.
const doc = document.documentElement;
window.__nagaBoot = true;
const intro = document.getElementById('intro');
const canvas = document.getElementById('intro-canvas');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function heroIn() { doc.classList.add('hero-in'); document.body.classList.remove('intro-lock'); }
function gone() {
  intro.classList.add('is-gone');
}

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

// Flat fallback: the emblem holds, then the page opens from the centre.
function flatOpen(delay = 500) {
  intro.classList.add('is-loading');
  const dur = reduced ? 1 : 900;
  setTimeout(() => {
    const t0 = performance.now();
    let revealed = false;
    const tick = now => {
      const t = Math.min(1, (now - t0) / dur);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      intro.style.setProperty('--open', (e * 150).toFixed(2) + 'vmax');
      if (!revealed && t > 0.05) { revealed = true; heroIn(); }
      if (t < 1) requestAnimationFrame(tick); else gone();
    };
    requestAnimationFrame(tick);
  }, delay);
}

let skipped = false;
function skip() {
  if (skipped) return;
  skipped = true;
  if (intro._stopIntro) intro._stopIntro();
  else { heroIn(); gone(); }
}

if (!intro || doc.classList.contains('intro-seen')) {
  heroIn();
  intro?.classList.add('is-gone');
} else if (reduced) {
  heroIn();
  gone();
} else {
  document.body.classList.add('intro-lock');
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => window.addEventListener(ev, skip, { once: true, passive: true }));
  intro.querySelector('.intro__skip')?.addEventListener('click', skip);

  if (!hasWebGL()) flatOpen(700);
  else {
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 3500));
    Promise.race([import('./intro.js?v=20260927c'), timeout])
      .then(mod => {
        if (skipped) return;
        intro.classList.add('is-3d');
        return mod.playIntro({
          canvas, root: intro,
          onReveal: heroIn,
          onDone: gone,
        });
      })
      .catch(() => { if (!skipped) { intro.classList.remove('is-3d'); flatOpen(200); } });
  }
}
