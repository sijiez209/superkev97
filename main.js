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
    revealTargets.forEach(el => io.observe(el));
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
});
