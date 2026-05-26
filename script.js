// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const burger = document.querySelector('.nav__burger');
const links = document.querySelector('.nav__links');
burger?.addEventListener('click', () => {
  if (!links) return;
  const willOpen = !links.classList.contains('is-open');
  links.classList.toggle('is-open', willOpen);
  burger.setAttribute('aria-expanded', String(willOpen));
});

window.addEventListener('resize', () => {
  if (!links) return;
  if (window.innerWidth > 720 && links.classList.contains('is-open')) {
    links.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('click', (event) => {
  if (!links || !burger || window.innerWidth > 720) return;
  if (!links.classList.contains('is-open')) return;
  const target = event.target;
  if (target instanceof Node && !links.contains(target) && !burger.contains(target)) {
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// Smooth scroll for anchor links closes mobile menu
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 720 && links) {
      links.classList.remove('is-open');
      burger?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Reveal on scroll
const reveals = document.querySelectorAll('.section, .hero__content, .card, .product, .quote, .steps li');
reveals.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => io.observe(el));

// Form handler
const form = document.getElementById('quoteForm');
const note = document.getElementById('formNote');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  note.textContent = `Merci ${data.name.split(' ')[0]} ! Votre demande a bien été envoyée. Nous vous recontactons sous 24h.`;
  form.reset();
  setTimeout(() => note.textContent = '', 6000);
});

// Testimonials slider
(function () {
  const items = document.querySelectorAll('.temoignage');
  const dots  = document.querySelectorAll('.tem-dot');
  const prev  = document.querySelector('.tem-btn--prev');
  const next  = document.querySelector('.tem-btn--next');
  if (!items.length) return;
  let current = 0;
  function goTo(n) {
    items[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + items.length) % items.length;
    items[current].classList.add('active');
    dots[current].classList.add('active');
  }
  prev?.addEventListener('click', () => goTo(current - 1));
  next?.addEventListener('click', () => goTo(current + 1));
})();

// Services carousel — CSS animation-based infinite loop
(function () {
  const carousel = document.getElementById('servicesCarousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel__track');
  const gap = 24;

  // Strip reveal classes so cards are always visible inside the carousel
  const origCards = [...track.querySelectorAll('.card')];
  origCards.forEach(c => { c.classList.remove('reveal'); c.classList.add('is-visible'); });

  // Clone all cards for the seamless loop
  origCards.forEach(c => {
    const clone = c.cloneNode(true);
    clone.classList.remove('reveal');
    clone.classList.add('is-visible');
    track.appendChild(clone);
  });

  function setup() {
    const mobile = window.innerWidth <= 720;
    const visible = mobile ? 1 : (window.innerWidth <= 1040 ? 2 : 3);
    const baseWidth = (carousel.offsetWidth - gap * (visible - 1)) / visible;
    const cardW = mobile
      ? Math.min(Math.max(baseWidth || 0, 280), 420)
      : baseWidth;

    track.style.animation = mobile ? 'none' : '';
    [...track.querySelectorAll('.card')].forEach(c => { c.style.width = cardW + 'px'; });

    // The slide distance = exactly half the track (the 6 original cards)
    const halfTrack = origCards.length * (cardW + gap);
    carousel.style.setProperty('--carousel-offset', `-${halfTrack}px`);
  }

  setup();
  window.addEventListener('resize', () => {
    // Restart animation cleanly on resize
    track.style.animation = 'none';
    track.getBoundingClientRect();
    track.style.animation = '';
    setup();
  });
})();
