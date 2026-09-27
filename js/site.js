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
      today: 'Today', all: 'All', to: 'to', nextToday: (n, t) => `Next class today: ${n} at ${t}`,
      nextTomorrow: (n, t) => `First class tomorrow: ${n} at ${t}`,
      cats: { crossfit: 'CrossFit', hyrox: 'Hyrox', lifting: 'Lifting', gym: 'Gymnastics', kids: 'Kids & teens', other: 'Open Gym & more' },
      toggle: 'ไทย', toggleLabel: 'เปลี่ยนเป็นภาษาไทย',
    },
    th: {
      days: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
      short: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
      today: 'วันนี้', all: 'ทั้งหมด', to: 'ถึง', nextToday: (n, t) => `คลาสถัดไปวันนี้: ${n} เวลา ${t}`,
      nextTomorrow: (n, t) => `คลาสแรกพรุ่งนี้: ${n} เวลา ${t}`,
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

  /* ---------- Coach carousel ---------- */
  const track = $('.carousel__track');
  if (track) {
    const cards = $$('.coach', track);
    const countEl = $('[data-count]');
    const prev = $('[data-dir="-1"]'), next = $('[data-dir="1"]');
    let raf = 0;

    const cardStep = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    function update() {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const anchor = rect.left + padLeft;
      let best = 0, bestD = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = (r.left - anchor) / r.width;
        if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
        if (!reduced) {
          const off = Math.max(-2, Math.min(3, d));
          const rot = off < 0 ? off * 16 : Math.max(0, off - 1.4) * -7;
          const z = off < 0 ? off * 90 : Math.max(0, off - 1.4) * -40;
          c.style.transform = `translateZ(${z.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg)`;
          c.style.opacity = off < -0.6 ? Math.max(0.25, 1 + (off + 0.6)).toFixed(2) : '1';
        }
      });
      if (countEl) countEl.textContent = best + 1;
      const max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

    [prev, next].forEach(b => b?.addEventListener('click', () => {
      track.scrollBy({ left: cardStep() * +b.dataset.dir, behavior: reduced ? 'auto' : 'smooth' });
    }));
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: cardStep(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -cardStep(), behavior: 'smooth' }); }
    });

    // Mouse drag with momentum. Touch keeps native scrolling.
    let down = false, startX = 0, startScroll = 0, lastX = 0, lastT = 0, vel = 0, moved = 0, glide = 0;
    track.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = 0; startX = lastX = e.clientX; startScroll = track.scrollLeft; lastT = performance.now(); vel = 0;
      cancelAnimationFrame(glide);
      track.setPointerCapture(e.pointerId);
      track.classList.add('is-dragging');
    });
    track.addEventListener('pointermove', e => {
      if (!down) return;
      const now = performance.now();
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      track.scrollLeft = startScroll - dx;
      const dt = Math.max(1, now - lastT);
      vel = 0.8 * vel + 0.2 * ((e.clientX - lastX) / dt);
      lastX = e.clientX; lastT = now;
    });
    const release = e => {
      if (!down) return;
      down = false;
      try { track.releasePointerCapture(e.pointerId); } catch (err) {}
      let v = -vel * 16;
      const stepFn = () => {
        v *= 0.94;
        track.scrollLeft += v;
        if (Math.abs(v) > 0.5) glide = requestAnimationFrame(stepFn);
        else {
          track.classList.remove('is-dragging');
          const s = cardStep();
          track.scrollTo({ left: Math.round(track.scrollLeft / s) * s, behavior: 'smooth' });
        }
      };
      glide = requestAnimationFrame(stepFn);
    };
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);
    track.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
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

  function bangkokNow() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t)?.value;
    const map = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
    return { day: map[get('weekday')], mins: (+get('hour') % 24) * 60 + +get('minute') };
  }
  const toMins = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };

  function renderTimetable() {
    if (!grid) return;
    const ui = UI[lang];
    const now = bangkokNow();
    if (shownDay == null) shownDay = now.day;

    const todays = WEEK.filter(s => s.d === now.day && toMins(s.s) > now.mins && s.c !== 'other');
    let next = todays[0] || null, nextMsg = '';
    if (next) nextMsg = ui.nextToday(next.n, next.s);
    else {
      const tmr = WEEK.filter(s => s.d === (now.day + 1) % 7 && s.c !== 'other')[0];
      if (tmr) nextMsg = ui.nextTomorrow(tmr.n, tmr.s);
    }
    if (nextEl) { nextEl.textContent = nextMsg; nextEl.hidden = !nextMsg; }

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
      b.addEventListener('click', () => { shownDay = i; renderTimetable(); });
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
  setInterval(renderTimetable, 60000);

  // If the intro module never runs (old browser, blocked script), show the page anyway.
  setTimeout(() => {
    if (!window.__nagaBoot && !doc.classList.contains('hero-in')) {
      doc.classList.add('hero-in');
      $('#intro')?.classList.add('is-gone');
      document.body.classList.remove('intro-lock');
    }
  }, 4000);
})();
