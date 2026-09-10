// Small, dependency-free interactions.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // skill rulers: fill in once the skills section scrolls into view
  const rulerFills = document.querySelectorAll('.ruler .fill');
  rulerFills.forEach((el, i) => {
    el.style.width = '0%';
    el.style.transition = `width 1600ms cubic-bezier(.2,.8,.2,1) ${i * 140}ms`;
  });
  const skillsSection = document.getElementById('skills');
  if (skillsSection && rulerFills.length) {
    if ('IntersectionObserver' in window) {
      const rulerIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            rulerFills.forEach(el => { el.style.width = el.style.getPropertyValue('--w'); });
            rulerIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      rulerIo.observe(skillsSection);
    } else {
      rulerFills.forEach(el => { el.style.width = el.style.getPropertyValue('--w'); });
    }
  }

  // work list category filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      workCards.forEach(card => {
        const show = filter === 'All' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  // hero entrance animation (staggered, runs once on load)
  const heroCopy = document.querySelector('.hero-copy');
  const heroFigure = document.querySelector('.hero-figure');
  requestAnimationFrame(() => {
    if (heroCopy) heroCopy.classList.add('is-visible');
    if (heroFigure) heroFigure.classList.add('is-visible');
  });

  // scroll-triggered reveal for section content
  const revealTargets = document.querySelectorAll(
    '.section-head, .work-card, .work-more, .contact-panel, .about-grid, .skill-card, ' +
    '.proj-title-row, .spec-sheet, .proj-cover, .proj-block, .shot-grid .shot, .proj-nav'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  // small stagger for items inside the same grid
  document.querySelectorAll('.work-grid, .shot-grid, .skill-cards').forEach(grid => {
    [...grid.children].forEach((child, i) => child.style.setProperty('--i', i % 6));
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    // Content already on screen at load (e.g. the portfolio grid, which
    // sits right under the header) has no scroll distance to animate over —
    // trying to fade it in races the browser's first paint and is
    // inconsistent across reloads/scroll-restore. Show that instantly and
    // only animate what actually scrolls into view.
    const viewportH = window.innerHeight;
    revealTargets.forEach(el => {
      const rect = el.getBoundingClientRect();
      const alreadyVisible = rect.top < viewportH * 0.92 && rect.bottom > 0;
      if (alreadyVisible) {
        el.classList.add('is-visible');
      } else {
        io.observe(el);
      }
    });
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  // contact form: compose a pre-filled email instead of a server submit
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value;
      const email = contactForm.email.value;
      const message = contactForm.message.value;
      const subject = encodeURIComponent(`Hello from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:sijiez209@gmail.com?subject=${subject}&body=${body}`;
      const note = contactForm.querySelector('.contact-form-note');
      if (note) note.hidden = false;
    });
  }

  // project galleries: click a cover/shot image to open a full-screen,
  // paginated lightbox (cover image, then every shot, in page order)
  const galleryImgs = [...document.querySelectorAll('.proj-cover img, .shot img')];
  if (galleryImgs.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close"><svg viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
      <button class="lightbox-prev" aria-label="Previous"><svg viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <img class="lightbox-img" src="" alt="">
      <button class="lightbox-next" aria-label="Next"><svg viewBox="0 0 20 20" fill="none"><path d="M8 4L14 10L8 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <div class="lightbox-count"></div>
    `;
    document.body.appendChild(lightbox);

    const imgEl = lightbox.querySelector('.lightbox-img');
    const countEl = lightbox.querySelector('.lightbox-count');
    let current = 0;

    const show = (i) => {
      current = (i + galleryImgs.length) % galleryImgs.length;
      imgEl.src = galleryImgs[current].src;
      imgEl.alt = galleryImgs[current].alt || '';
      countEl.textContent = `${current + 1} / ${galleryImgs.length}`;
    };
    const open = (i) => {
      show(i);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    galleryImgs.forEach((img, i) => img.addEventListener('click', () => open(i)));
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    // swipe left/right to page through on touch devices
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) show(current + (dx > 0 ? -1 : 1));
    }, { passive: true });
  }
});
