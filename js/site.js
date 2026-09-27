(() => {
  'use strict';
  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ---------- Language ---------- */
  const TH = window.NAGA_TH || {};
  const EN = {};
  const i18nNodes = $$('[data-i18n]');
  i18nNodes.forEach(el => { const k = el.dataset.i18n; if (!(k in EN)) EN[k] = el.textContent; });
  let lang = store.get('naga-lang') || ((navigator.language || '').toLowerCase().startsWith('th') ? 'th' : 'en');
  const langBtn = $('#lang-toggle');

  const UI = {
    en: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      today: 'Today', all: 'All', to: 'to',
      rel: m => m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`,
      next: (n, t, off, day, rel) => off === 0 ? `Next class: ${n} today at ${t}, in ${rel}` : off === 1 ? `Next class: ${n} tomorrow at ${t}` : `Next class: ${n} on ${day} at ${t}`,
      cats: { crossfit: 'CrossFit', hyrox: 'Hyrox', lifting: 'Lifting', gym: 'Gymnastics', kids: 'Kids & teens', other: 'Open Gym & more' },
      toggle: 'ไทย', toggleLabel: 'เปลี่ยนเป็นภาษาไทย',
    },
    th: {
      days: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
      short: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
      today: 'วันนี้', all: 'ทั้งหมด', to: 'ถึง',
      rel: m => m < 60 ? `${m} นาที` : `${Math.floor(m / 60)} ชม. ${m % 60} นาที`,
      next: (n, t, off, day, rel) => off === 0 ? `คลาสถัดไป: ${n} วันนี้ ${t} น. (อีก ${rel})` : off === 1 ? `คลาสถัดไป: ${n} พรุ่งนี้ ${t} น.` : `คลาสถัดไป: ${n} วัน${day} ${t} น.`,
      cats: { crossfit: 'CrossFit', hyrox: 'Hyrox', lifting: 'ยกน้ำหนัก', gym: 'ยิมนาสติก', kids: 'เด็กและวัยรุ่น', other: 'Open Gym และอื่นๆ' },
      toggle: 'EN', toggleLabel: 'Switch to English',
    },
  };

  function applyLang(next) {
    lang = next;
    doc.lang = lang;
    const dict = lang === 'th' ? TH : EN;
    i18nNodes.forEach(el => { const v = dict[el.dataset.i18n]; if (v != null) el.textContent = v; });
    if (langBtn) {
      $('[data-lang-label]', langBtn).textContent = UI[lang].toggle;
      langBtn.setAttribute('aria-label', UI[lang].toggleLabel);
    }
    store.set('naga-lang', lang);
    renderTimetable();
    document.dispatchEvent(new Event('naga:lang'));
  }
  langBtn?.addEventListener('click', () => applyLang(lang === 'th' ? 'en' : 'th'));

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menu-btn'), sheet = $('#menu-sheet');
  function setMenu(open) {
    if (!menuBtn || !sheet) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    sheet.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (open) $('a', sheet)?.focus();
  }
  menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  sheet?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); } });

  /* ---------- Hero video ---------- */
  const heroVideo = $('#hero-video');
  if (heroVideo) {
    const tall = window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    heroVideo.poster = tall ? heroVideo.dataset.posterTall : heroVideo.poster;
    heroVideo.src = tall ? heroVideo.dataset.tall : heroVideo.dataset.wide;
    heroVideo.play?.().catch(() => {});
  }

  /* ---------- Scroll: nav, hero scale, dock, rail ---------- */
  const nav = $('.nav');
  const dock = $('#dock');
  const hero = $('.hero');
  const rail = $('.rail');
  const stops = $$('.rail__stops a');
  const sections = stops.map(a => document.getElementById(a.dataset.stop === 'top' ? 'main' : a.dataset.stop));
  const navLinks = $$('.nav__links a');
  let lastY = window.scrollY, ticking = false;

  function layoutRail() {
    if (!rail || getComputedStyle(rail).display === 'none') return;
    rail.style.setProperty('--h', rail.clientHeight + 'px');
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    stops.forEach((a, i) => {
      const sec = sections[i];
      const top = i === 0 ? 0 : Math.min(1, Math.max(0, (sec.offsetTop - window.innerHeight * 0.35) / docH));
      a.parentElement.style.setProperty('--t', (top * 100).toFixed(2) + '%');
      a.dataset.at = top;
    });
  }

  function onScroll() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    nav.classList.toggle('is-solid', y > 40);
    const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (y > vh * 0.9 && goingDown) nav.classList.add('is-hidden');
    else if (goingUp || y < vh * 0.9) nav.classList.remove('is-hidden');
    lastY = y;
    const closeEl = document.querySelector('.close');
    const nearEnd = closeEl && closeEl.getBoundingClientRect().top < vh * 0.9;
    dock?.classList.toggle('is-shown', y > vh * 0.75 && !nearEnd);

    if (heroVideo && !reduced && y < vh * 1.2) {
      const p = Math.min(1, y / vh);
      heroVideo.style.transform = `translate3d(0, ${p * 18}vh, 0) scale(${1 + p * 0.08})`;
    }

    if (rail && getComputedStyle(rail).display !== 'none') {
      const docH = document.documentElement.scrollHeight - vh;
      const p = docH > 0 ? y / docH : 0;
      rail.style.setProperty('--p', p.toFixed(4));
      let current = 0;
      sections.forEach((sec, i) => { if (sec && sec.getBoundingClientRect().top < vh * 0.4) current = i; });
      stops.forEach((a, i) => {
        a.classList.toggle('is-current', i === current);
        a.classList.toggle('is-passed', i < current);
      });
    }
    let navCurrent = '';
    ['classes', 'coaches', 'timetable', 'prices', 'visit'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < vh * 0.4) navCurrent = id;
    });
    navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + navCurrent));
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', () => { layoutRail(); onScroll(); });
  window.addEventListener('load', () => { layoutRail(); onScroll(); });

  /* ---------- Reveals and lazy video ---------- */
  // Observe containers, since a clip-path on the target hides it from IntersectionObserver.
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.classList.contains('mosaic')) $$('.reveal-img', el).forEach((t, i) => setTimeout(() => t.classList.add('is-in'), i * 110));
      else el.classList.add('is-in');
      revealObs.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  $$('.stair, .plans, .mosaic').forEach(el => revealObs.observe(el));

  function loadVideo(v) {
    if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); }
  }
  const videoObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { loadVideo(v); if (!v.closest('.stage__layer') || v.closest('.is-active')) v.play?.().catch(() => {}); }
      else v.pause?.();
    });
  }, { rootMargin: '200px 0px', threshold: 0.01 });
  $$('video[data-autoplay], .stage video').forEach(v => videoObs.observe(v));

  /* ---------- Classes ---------- */
  const items = $$('.program__item');
  const layers = $$('.stage__layer');
  const mobileClasses = window.matchMedia('(max-width: 860px)');

  function mountInline(item) {
    const holder = $('.program__inline', item);
    if (!holder || holder.childElementCount) return;
    const src = document.getElementById(item.dataset.media);
    const media = src && src.firstElementChild;
    if (!media) return;
    const clone = media.cloneNode(true);
    if (clone.tagName === 'VIDEO') { clone.src = clone.dataset.src; clone.muted = true; clone.autoplay = true; clone.setAttribute('playsinline', ''); }
    holder.appendChild(clone);
    if (clone.tagName === 'VIDEO') clone.play?.().catch(() => {});
  }

  function activate(item, fromHover) {
    if (item.classList.contains('is-active') && fromHover) return;
    const wasOpen = item.classList.contains('is-active');
    items.forEach(i => { i.classList.remove('is-active'); $('.program__btn', i).setAttribute('aria-expanded', 'false'); });
    if (wasOpen && !fromHover && mobileClasses.matches) return;
    item.classList.add('is-active');
    $('.program__btn', item).setAttribute('aria-expanded', 'true');
    const id = item.dataset.media;
    layers.forEach(l => {
      const on = l.id === id;
      if (l.classList.contains('is-active') && !on) {
        l.classList.add('is-leaving');
        setTimeout(() => l.classList.remove('is-leaving'), 900);
      }
      l.classList.toggle('is-active', on);
      const v = $('video', l);
      if (v) { if (on) { loadVideo(v); v.play?.().catch(() => {}); } else v.pause?.(); }
    });
    if (mobileClasses.matches) mountInline(item);
  }
  items.forEach(item => {
    const btn = $('.program__btn', item);
    btn.addEventListener('click', () => activate(item, false));
    btn.addEventListener('mouseenter', () => { if (!mobileClasses.matches && window.matchMedia('(hover: hover)').matches) activate(item, true); });
    btn.addEventListener('focus', () => { if (!mobileClasses.matches) activate(item, true); });
  });
  if (mobileClasses.matches && items[0]) mountInline(items[0]);

  /* ---------- Coach spotlight carousel ---------- */
  const cf = $('.cf');
  if (cf) {
    const stage = $('.cf__stage', cf);
    const cards = $$('.cf__card', cf);
    const dots = $$('.cf__dot', cf);
    const countEl = $('[data-count]');
    const pauseBtn = $('#cf-pause');
    const n = cards.length;
    const INTERVAL = 7000;
    let active = 0, timer = 0, userPaused = reduced, hover = false, focusIn = false, visible = false;
    cf.style.setProperty('--cf-time', INTERVAL + 'ms');

    function show(i) {
      active = (i + n) % n;
      const wide = window.matchMedia('(min-width: 861px)').matches;
      const cardW = cards[0].offsetWidth, cardH = cards[0].offsetHeight, photoW = cardH * 0.75;
      cards.forEach((c, k) => {
        let d = k - active;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        const ad = Math.abs(d), sign = Math.sign(d);
        const s = ad === 0 ? 1 : ad === 1 ? 0.84 : 0.72;
        let tx = 0;
        if (wide && ad) {
          // Side cards show only their photo, tucked slightly behind the open card.
          const vis1 = photoW * 0.84;
          const target = sign * (cardW / 2 + vis1 * 0.32 + (ad - 1) * vis1 * 0.62);
          tx = target + ((cardW - photoW) / 2) * s;
        } else if (ad) tx = d * cardW * 0.92;
        c.style.setProperty('--tx', tx.toFixed(1) + 'px');
        c.style.setProperty('--s', wide || !ad ? s : 1 - ad * 0.08);
        c.style.setProperty('--clip', wide && ad ? (cardW - photoW).toFixed(1) + 'px' : '0px');
        c.style.setProperty('--d', d);
        c.style.setProperty('--ad', ad);
        c.classList.toggle('is-active', d === 0);
        c.classList.toggle('is-far', ad > (wide ? 2 : 1));
        c.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
      });
      dots.forEach((d, k) => {
        d.classList.remove('is-active');
        d.classList.toggle('is-done', k < active);
        d.setAttribute('aria-current', k === active ? 'true' : 'false');
      });
      void dots[active].offsetWidth; // restart the fill animation
      dots[active].classList.add('is-active');
      if (countEl) countEl.textContent = active + 1;
      schedule();
    }
    function running() { return !userPaused && !hover && !focusIn && visible && !document.hidden; }
    function schedule() {
      clearTimeout(timer);
      cf.classList.toggle('is-paused', !running());
      cf.classList.toggle('is-still', userPaused);
      if (running()) timer = setTimeout(() => show(active + 1), INTERVAL);
    }
    // Pausing mid-way would restart the timer from zero, so resume re-runs the full interval.
    function refresh() { schedule(); }

    $$('.carousel__controls [data-dir]').forEach(b => b.addEventListener('click', () => show(active + +b.dataset.dir)));
    cards.forEach((c, k) => c.addEventListener('click', () => { if (!moved) show(k); }));
    dots.forEach((d, k) => d.addEventListener('click', () => show(k)));
    pauseBtn?.addEventListener('click', () => {
      userPaused = !userPaused;
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      pauseBtn.setAttribute('aria-label', userPaused ? 'Play the coach carousel' : 'Pause the coach carousel');
      $('use', pauseBtn).setAttribute('href', userPaused ? '#i-play' : '#i-pause');
      refresh();
    });
    if (pauseBtn && userPaused) { pauseBtn.setAttribute('aria-pressed', 'true'); $('use', pauseBtn).setAttribute('href', '#i-play'); }
    stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(active + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(active - 1); }
    });
    stage.addEventListener('mouseenter', () => { hover = true; refresh(); });
    stage.addEventListener('mouseleave', () => { hover = false; refresh(); });
    cf.addEventListener('focusin', () => { focusIn = true; refresh(); });
    cf.addEventListener('focusout', e => { if (!cf.contains(e.relatedTarget)) { focusIn = false; refresh(); } });
    document.addEventListener('visibilitychange', refresh);
    new IntersectionObserver(es => { visible = es[0].isIntersecting; refresh(); }, { threshold: 0.35 }).observe(stage);

    // Swipe on touch and drag with a mouse.
    let sx = 0, sy = 0, down = false, moved = false;
    stage.addEventListener('pointerdown', e => { down = true; moved = false; sx = e.clientX; sy = e.clientY; });
    stage.addEventListener('pointermove', e => { if (down && Math.abs(e.clientX - sx) > 8) moved = true; });
    const end = e => {
      if (!down) return;
      down = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(active + (dx < 0 ? 1 : -1));
      setTimeout(() => { moved = false; }, 0);
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', () => { down = false; });
    show(0);
    window.addEventListener('resize', () => show(active));
  }

  /* ---------- Timetable ---------- */
  // From the gym's posted schedule. Days: 0 = Monday.
  const T = (d, s, e, n, c) => ({ d, s, e, n, c });
  const WEEK = [
    T(0,'6:30','7:20','Hyrox','hyrox'), T(0,'7:30','8:30','CrossFit','crossfit'), T(0,'8:45','9:45','CrossFit','crossfit'), T(0,'12:30','16:30','Open Gym','other'), T(0,'17:00','18:00','Peach Camp','other'), T(0,'18:15','19:15','CrossFit','crossfit'), T(0,'19:30','20:30','Hyrox','hyrox'),
    T(1,'6:30','7:20','Hyrox','hyrox'), T(1,'7:30','8:30','CrossFit','crossfit'), T(1,'8:45','9:45','CrossFit','crossfit'), T(1,'11:00','12:00','Olympic Lifting','lifting'), T(1,'12:30','16:30','Open Gym','other'), T(1,'17:00','18:00','CrossFit','crossfit'), T(1,'18:15','19:15','CrossFit','crossfit'), T(1,'19:30','20:30','Hyrox','hyrox'),
    T(2,'6:30','7:20','CrossFit','crossfit'), T(2,'7:30','8:30','CrossFit','crossfit'), T(2,'8:45','9:45','Hyrox','hyrox'), T(2,'12:30','16:30','Open Gym','other'), T(2,'17:00','18:00','CrossFit Basics','crossfit'), T(2,'18:15','19:15','CrossFit','crossfit'), T(2,'19:30','20:30','Hyrox','hyrox'),
    T(3,'6:30','7:20','CrossFit','crossfit'), T(3,'7:30','8:30','CrossFit','crossfit'), T(3,'8:45','9:45','CrossFit','crossfit'), T(3,'11:00','12:00','Peach Camp','other'), T(3,'16:00','16:45','CrossFit Teens','kids'), T(3,'17:00','18:00','CrossFit','crossfit'), T(3,'18:15','19:15','CrossFit','crossfit'), T(3,'19:30','20:30','Calisthenics','gym'),
    T(4,'6:30','7:20','Hyrox','hyrox'), T(4,'7:30','8:30','CrossFit','crossfit'), T(4,'8:45','9:45','CrossFit Basics','crossfit'), T(4,'11:00','12:00','CrossFit Skills 101','gym'), T(4,'12:30','16:30','Open Gym','other'), T(4,'17:00','18:00','CrossFit','crossfit'), T(4,'18:15','19:15','CrossFit','crossfit'), T(4,'19:30','20:30','Peach Camp','other'),
    T(5,'8:30','9:30','Team WOD','crossfit'), T(5,'9:45','10:45','Olympic Lifting','lifting'), T(5,'11:00','12:00','Gymnastics','gym'), T(5,'12:00','14:00','Open Gym','other'), T(5,'14:00','15:00','Hyrox Team','hyrox'), T(5,'15:30','16:30','Chinese Lifting','lifting'),
    T(6,'8:30','9:30','Hyrox Team','hyrox'), T(6,'9:45','10:45','Olympic Lifting','lifting'), T(6,'11:00','12:00','CrossFit','crossfit'), T(6,'12:15','13:15','Mobility','other'), T(6,'13:30','15:00','Open Gym','other'),
  ];
  const CAT_COLOR = { crossfit: '#466a41', hyrox: '#0f2016', lifting: '#90a586', gym: '#c9a44c', kids: '#d98a6a', other: '#b9b397' };
  const grid = $('#tt-grid'), tabs = $('#tt-tabs'), filters = $('#tt-filters'), nextEl = $('#tt-next');
  let filter = 'all', shownDay = null;

  // Clock: the web server's Date header gives internet time, so a phone with the wrong clock still sees the right next class.
  let clockOffset = 0;
  function syncClock() {
    const t0 = Date.now();
    fetch(location.href.split('#')[0], { method: 'HEAD', cache: 'no-store' })
      .then(r => {
        const server = Date.parse(r.headers.get('date') || '');
        if (!isNaN(server)) { clockOffset = server - (t0 + Date.now()) / 2; renderTimetable(); }
      })
      .catch(() => {});
  }
  function bangkokNow() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(Date.now() + clockOffset));
    const get = t => parts.find(p => p.type === t)?.value;
    const map = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
    return { day: map[get('weekday')], mins: (+get('hour') % 24) * 60 + +get('minute') };
  }
  const toMins = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };

  // The first class after now that matches the filter, looking up to a week ahead. Open Gym is not a class.
  function findNext(now) {
    for (let off = 0; off < 8; off++) {
      const d = (now.day + off) % 7;
      const hit = WEEK.find(s => s.d === d && (off > 0 || toMins(s.s) > now.mins) &&
        (filter === 'all' ? s.c !== 'other' : s.c === filter));
      if (hit) return { slot: hit, off, mins: off * 1440 + toMins(hit.s) - now.mins };
    }
    return null;
  }

  let userPickedDay = false;
  function renderTimetable() {
    if (!grid) return;
    const ui = UI[lang];
    const now = bangkokNow();
    const found = findNext(now);
    const next = found ? found.slot : null;
    if (!userPickedDay) shownDay = next && found.off <= 1 && next.d !== now.day && !WEEK.some(s => s.d === now.day && toMins(s.s) > now.mins) ? next.d : now.day;

    if (nextEl) {
      nextEl.textContent = found ? ui.next(next.n, next.s, found.off, ui.days[next.d], ui.rel(found.mins)) : '';
      nextEl.hidden = !found;
    }

    filters.innerHTML = '';
    ['all', 'crossfit', 'hyrox', 'lifting', 'gym', 'kids', 'other'].forEach(k => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.setAttribute('aria-pressed', String(filter === k));
      b.innerHTML = (k === 'all' ? '' : `<span class="dot" style="--c:${CAT_COLOR[k]}"></span>`) + `<span>${k === 'all' ? ui.all : ui.cats[k]}</span>`;
      b.addEventListener('click', () => { filter = k; renderTimetable(); });
      filters.appendChild(b);
    });

    tabs.innerHTML = '';
    ui.short.forEach((name, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'tt__tab'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(i === shownDay));
      b.textContent = name;
      if (i === now.day) { b.classList.add('is-today'); b.setAttribute('aria-label', `${ui.days[i]}, ${ui.today}`); }
      b.addEventListener('click', () => { shownDay = i; userPickedDay = true; renderTimetable(); });
      tabs.appendChild(b);
    });

    grid.innerHTML = '';
    ui.days.forEach((dayName, d) => {
      const col = document.createElement('div');
      col.className = 'tt__day' + (d === now.day ? ' is-today' : '') + (d === shownDay ? ' is-shown' : '');
      col.innerHTML = `<h3 class="tt__dayname"><span>${dayName}</span>${d === now.day ? `<small>${ui.today}</small>` : ''}</h3>`;
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      WEEK.filter(s => s.d === d).forEach(s => {
        const li = document.createElement('li');
        li.className = 'slot' + (filter !== 'all' && s.c !== filter ? ' is-dim' : '') + (next && s === next ? ' is-next' : '');
        li.innerHTML = `<span class="slot__time">${s.s} ${ui.to} ${s.e}</span><span class="slot__name"><span class="dot" style="--c:${CAT_COLOR[s.c]}"></span>${s.n}</span>`;
        list.appendChild(li);
      });
      col.appendChild(list);
      grid.appendChild(col);
    });
  }

  /* ---------- Start ---------- */
  applyLang(lang);
  layoutRail();
  onScroll();
  setInterval(renderTimetable, 30000);
  syncClock();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncClock(); });

  // If the intro module never runs (old browser, blocked script), show the page anyway.
  setTimeout(() => {
    if (!window.__nagaBoot && !doc.classList.contains('hero-in')) {
      doc.classList.add('hero-in');
      $('#intro')?.classList.add('is-gone');
      document.body.classList.remove('intro-lock');
    }
  }, 4000);
})();
