(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav drawer
  const drawer = $('.nav-drawer');
  const toggle = $('.nav-toggle');
  if (drawer && toggle) {
    const setOpen = (open) => {
      drawer.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!drawer.classList.contains('open')));
    document.addEventListener('click', (e) => {
      if (!drawer.classList.contains('open')) return;
      const within = drawer.contains(e.target) || toggle.contains(e.target);
      if (!within) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Set active nav link
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  $$('a[data-nav]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.setAttribute('aria-current', 'page');
  });

  // Gallery lightbox
  const lightbox = $('.lightbox');
  if (lightbox) {
    const lbImg = $('.lightbox img', lightbox);
    const lbCap = $('.lightbox figcaption', lightbox);
    const closeBtn = $('.lightbox .close', lightbox);

    const open = (src, alt) => {
      lbImg.src = src;
      lbImg.alt = alt || 'Photo';
      lbCap.textContent = alt || '';
      lightbox.classList.add('open');
      closeBtn.focus();
    };
    const close = () => {
      lightbox.classList.remove('open');
      lbImg.src = '';
    };

    $$('[data-lightbox]')
      .forEach(el => el.addEventListener('click', (e) => {
        e.preventDefault();
        const img = $('img', el);
        const src = img?.getAttribute('data-full') || img?.src;
        const alt = img?.alt || '';
        if (src) open(src, alt);
      }));

    closeBtn?.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
    });
  }

  // Contact form (mailto fallback)
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      const subject = encodeURIComponent('Somerset Creamery website inquiry');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      // Replace if you later add a real business email
      const to = 'info@somersetcreamery.example';
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }
})();
