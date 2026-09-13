(() => {
  'use strict';
  const doc = document;
  const $ = (selector, root = doc) => root.querySelector(selector);
  const $$ = (selector, root = doc) => Array.from(root.querySelectorAll(selector));
  const PHONE = '255767602509';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const waUrl = (message = '') => `https://wa.me/${PHONE}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  $$('.js-wa').forEach((link) => {
    const message = link.dataset.message || 'Hello JVC Catering, I would like more information.';
    link.href = waUrl(message);
  });

  /* ---------- header / scroll spy / back-to-top ---------- */
  const header = $('#siteHeader');
  const backTop = $('#backTop');
  const navLinks = $$('.desktop-nav a, .mobile-links a');
  const sectionIds = ['about', 'menu', 'services', 'contact'];
  let scrollTicking = false;

  const updateScrollUI = () => {
    const y = window.scrollY || 0;
    header?.classList.toggle('scrolled', y > 18);
    backTop?.classList.toggle('show', y > 620);
    let active = '';
    sectionIds.forEach((id) => {
      const section = doc.getElementById(id);
      if (section && section.getBoundingClientRect().top <= 140) active = id;
    });
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${active}`;
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollTicking = false;
  };
  updateScrollUI();
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollUI);
  }, { passive: true });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- reveal on scroll (single orchestrated entrance per section) ---------- */
  const revealTargets = $$('.reveal');
  if (revealTargets.length && 'IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- mobile drawer ---------- */
  const drawer = $('#mobileDrawer');
  const scrim = $('#drawerScrim');
  const menuToggle = $('#menuToggle');
  const drawerClose = $('#drawerClose');
  let previousFocus = null;
  const focusables = () => drawer ? $$('a[href],button:not([disabled])', drawer).filter((el) => el.tabIndex !== -1) : [];
  const setDrawer = (open, restoreFocus = true) => {
    if (!drawer || !scrim || !menuToggle) return;
    if (open) previousFocus = doc.activeElement;
    drawer.inert = !open;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    doc.body.classList.toggle('menu-open', open);
    scrim.hidden = !open;
    if (open) drawerClose?.focus({ preventScroll: true });
    else if (restoreFocus && previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  };
  menuToggle?.addEventListener('click', () => setDrawer(true));
  drawerClose?.addEventListener('click', () => setDrawer(false));
  scrim?.addEventListener('click', () => setDrawer(false));
  doc.addEventListener('keydown', (event) => {
    if (!drawer?.classList.contains('open')) return;
    if (event.key === 'Escape') return setDrawer(false);
    if (event.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  $$('.mobile-links a').forEach((link) => link.addEventListener('click', () => setDrawer(false, false)));
  window.matchMedia('(min-width:901px)').addEventListener?.('change', (event) => { if (event.matches) setDrawer(false, false); });

  /* ---------- menu data + filtering ---------- */
  const menuItems = [
    { title: 'Signature Pilau', category: 'main', label: 'Main meal', image: '/menu/pilau.webp', alt: 'Tanzanian signature pilau', description: 'Fragrant spiced rice prepared with tender meat and traditional aromatics for a warm, celebratory centrepiece.', meta: ['Buffet friendly', 'Event favourite'], kicker: 'JVC favourite', featured: true },
    { title: 'Wali wa Nazi', category: 'main', label: 'Main meal', image: '/menu/walinazi.webp', alt: 'Coconut rice with chicken', description: 'Fragrant coconut rice with a soft coastal finish, ideal alongside chicken, grilled meats or rich sauces.', meta: ['Coastal'] },
    { title: 'Ndizi na Nyama', category: 'main', label: 'Main meal', image: '/menu/ndizinyama.webp', alt: 'Plantain and meat stew', description: 'Tender plantain and meat slowly cooked into a comforting Tanzanian classic with deep savoury flavour.', meta: ['Traditional'] },
    { title: 'Maharage', category: 'main', label: 'Main meal', image: '/menu/maharage.webp', alt: 'Slow cooked beans', description: 'Slow-cooked, well-seasoned beans that work beautifully as a hearty side or plant-based menu option.', meta: ['Plant based'] },
    { title: 'Nyama Choma', category: 'grill', label: 'From the grill', image: '/menu/nyamachoma.webp', alt: 'Nyama choma grilled meat', description: 'Char-grilled meat prepared for tenderness, bold flavour and the unmistakable finish of an open flame.', meta: ['Flame grilled'] },
    { title: 'Mishkaki', category: 'grill', label: 'From the grill', image: '/menu/mshikaki.webp', alt: 'Tanzanian mishkaki skewers', description: 'Seasoned meat skewers grilled over heat and served fresh, perfect for receptions and relaxed celebrations.', meta: ['Reception ready'] },
    { title: 'Classic Mandazi', category: 'bites', label: 'Fresh bite', image: '/menu/maandazi.webp', alt: 'Fresh mandazi', description: 'Soft, golden and gently sweet pastries suited to breakfast service, tea breaks and welcoming platters.', meta: ['Tea service'] },
    { title: 'Kitumbua', category: 'bites', label: 'Fresh bite', image: '/menu/kitumbua.webp', alt: 'Kitumbua rice cakes', description: 'Traditional rice cakes with lightly crisp edges and a soft centre, ideal for breakfast and snack service.', meta: ['Traditional'] },
    { title: 'Kachori', category: 'bites', label: 'Fresh bite', image: '/menu/kachori.webp', alt: 'Kachori snack', description: 'Crisp savoury bites filled with aromatic spice, designed for tea service, receptions and finger-food tables.', meta: ['Finger food'] },
    { title: 'Coconut Pudding', category: 'dessert', label: 'Dessert', image: '/menu/coconutpudding.webp', alt: 'Coconut pudding dessert', description: 'A smooth, creamy coconut dessert with a gentle tropical flavour to finish the meal on a lighter note.', meta: ['Coastal'] },
    { title: 'Traditional Halwa', category: 'dessert', label: 'Dessert', image: '/menu/halwa.webp', alt: 'Traditional halwa dessert', description: 'Rich, aromatic halwa prepared for celebrations, dessert tables and memorable special-occasion service.', meta: ['Celebration classic'] },
    { title: 'Sugarcane Juice', category: 'drink', label: 'Cold drink', image: '/menu/sugarcanejuice.webp', alt: 'Fresh sugarcane juice', description: 'Freshly pressed sugarcane with a naturally bright, refreshing finish for daytime and outdoor events.', meta: ['Fresh pressed'] },
    { title: 'Event Mocktails', category: 'drink', label: 'Cold drink', image: '/menu/cocktail.webp', alt: 'Event mocktails', description: 'Colourful non-alcoholic drinks that can be matched to the atmosphere and service style of your event.', meta: ['Event styled'] },
    { title: 'Spiced Chai', category: 'drink', label: 'Hot drink', image: '/menu/chai.webp', alt: 'Spiced tea', description: 'Warm tea infused with aromatic spices for breakfasts, meetings, afternoon service and celebrations.', meta: ['Hot service'] }
  ];
  const menuGrid = $('#menuGrid');
  const menuCount = $('#menuCount');
  const filterButtons = $$('.menu-filter');
  const cardTemplate = (item, allowFeatured = false) => {
    const featured = allowFeatured && item.featured;
    const meta = (item.meta || []).map((value) => `<span>${value}</span>`).join('');
    return `<article class="menu-card${featured ? ' menu-card--featured' : ''}">
      <div class="menu-card__media"><img src="${item.image}" alt="${item.alt}" width="${featured ? 720 : 480}" height="${featured ? 540 : 360}" loading="lazy" decoding="async"><span class="menu-card__tag">${item.label}</span></div>
      <div class="menu-card__body">${item.kicker && featured ? `<p class="menu-card__kicker">${item.kicker}</p>` : ''}<h3>${item.title}</h3><p>${item.description}</p>${meta ? `<div class="menu-card__meta">${meta}</div>` : ''}</div>
    </article>`;
  };
  const renderMenu = (filter = 'all') => {
    const items = filter === 'all' ? menuItems : menuItems.filter((item) => item.category === filter);
    if (menuCount) menuCount.textContent = `${items.length} ${items.length === 1 ? 'menu selection' : 'menu selections'}`;
    if (menuGrid) menuGrid.innerHTML = items.map((item) => cardTemplate(item, filter === 'all')).join('');
  };
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderMenu(button.dataset.filter || 'all');
  }));

  /* ---------- quote form: validation + honeypot/time-trap spam protection ---------- */
  const form = $('#quoteForm');
  const status = $('#formStatus');
  const startedAt = Date.now();
  const startedField = $('#formStartedAt');
  if (startedField) startedField.value = String(startedAt);
  const eventDate = $('#eventDate');
  if (eventDate) {
    const now = new Date();
    eventDate.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
  const rules = [
    ['fieldName', 'name', (v) => v.trim().length >= 2],
    ['fieldPhone', 'phone', (v) => /^[+\d][\d\s().-]{6,29}$/.test(v.trim())],
    ['fieldEventType', 'eventType', (v) => v.trim().length > 0],
    ['fieldGuests', 'guestCount', (v) => Number(v) > 0 && Number(v) <= 10000],
    ['fieldEmail', 'email', (v, el) => !v.trim() || el.validity.valid]
  ];
  const mark = (fieldId, inputId, valid) => {
    const field = $('#' + fieldId, form || doc);
    const input = $('#' + inputId, form || doc);
    if (!field || !input) return null;
    field.dataset.invalid = String(!valid);
    input.setAttribute('aria-invalid', String(!valid));
    return input;
  };
  const ICON_ERROR = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5v6M12 16.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const ICON_SUCCESS = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="m8 12.5 2.6 2.6L16.5 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const setStatus = (message, type = '') => {
    if (!status) return;
    const icon = type === 'error' ? ICON_ERROR : type === 'success' ? ICON_SUCCESS : '';
    status.innerHTML = `${icon}<span>${message}</span>`;
    status.className = 'form-status' + (type ? ` is-${type}` : '');
  };
  rules.forEach(([fieldId, inputId, test]) => {
    const input = $('#' + inputId, form || doc);
    if (!input) return;
    input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => mark(fieldId, inputId, test(String(input.value || ''), input)));
  });
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if ($('#companyWebsite', form)?.value) { setStatus('We could not submit this request. Please contact us directly.', 'error'); return; }
    if (Date.now() - startedAt < 1800) { setStatus('Please take a moment to review your event details before continuing.', 'error'); return; }
    const data = new FormData(form);
    let firstInvalid = null;
    rules.forEach(([fieldId, inputId, test]) => {
      const input = $('#' + inputId, form);
      const valid = input ? test(String(data.get(inputId) || ''), input) : false;
      const el = mark(fieldId, inputId, valid);
      if (!valid && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) { setStatus('Please correct the highlighted fields.', 'error'); firstInvalid.focus(); return; }
    setStatus('Your event brief is ready. Opening WhatsApp now.', 'success');
    const message = [
      'Hello JVC Catering,',
      'I would like to request a catering quotation.',
      '',
      'Event details',
      `Type: ${data.get('eventType')}`,
      `Guests: ${data.get('guestCount')}`,
      `Date: ${data.get('eventDate') || 'To be confirmed'}`,
      `Venue or area: ${data.get('location') || 'To be confirmed'}`,
      '',
      'Contact details',
      `Name: ${data.get('name')}`,
      `Phone: ${data.get('phone')}`,
      `Email: ${data.get('email') || 'Not provided'}`,
      '',
      `Menu preferences or notes: ${data.get('message') || 'Please advise on suitable options.'}`
    ].join('\n');
    window.setTimeout(() => { window.location.href = waUrl(message); }, 250);
  });

  /* ---------- client logo marquee ---------- */
  const logoTrack = $('#logoTrack');
  const marqueeToggle = $('#marqueeToggle');
  let paused = reduceMotion;
  const updateMarquee = () => {
    if (logoTrack) logoTrack.style.animationPlayState = (paused || doc.hidden) ? 'paused' : 'running';
    if (marqueeToggle) { marqueeToggle.textContent = paused ? 'Resume logos' : 'Pause logos'; marqueeToggle.setAttribute('aria-pressed', String(paused)); }
  };
  marqueeToggle?.addEventListener('click', () => { paused = !paused; updateMarquee(); });
  doc.addEventListener('visibilitychange', updateMarquee);
  updateMarquee();

  /* ---------- broken image fallback ---------- */
  const neutralFallback = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#efe4cd"/></svg>')}`;
  doc.addEventListener('error', (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = 'true';
    image.removeAttribute('srcset');
    image.closest('picture')?.querySelectorAll('source').forEach((source) => source.removeAttribute('srcset'));
    image.src = neutralFallback;
  }, true);

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
