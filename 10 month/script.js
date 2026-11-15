/**
 * For You ♡ - 10 Months Celebration
 * JavaScript Interactions, Canvas Particle System & Dynamic Counter
 */

document.addEventListener('DOMContentLoaded', () => {
  initCanvasParticles();
  initScrollReveal();
  initFlipCards();
  initLoveCounter();
  initHeartBurst();
  initSmoothScroll();
});

/* ========================================================
   1. HTML5 Canvas Glowing Heart & Sparkle Particle System
   ======================================================== */
function initCanvasParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Track mouse for subtle particle reaction
  const mouse = { x: -1000, y: -1000, radius: 90 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  const particles = [];
  const particleCount = Math.min(55, Math.floor((width * height) / 18000));
  const heartShapes = ['♥', '♡', '✦', '•'];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = Math.random() * 11 + 7;
      this.speedY = Math.random() * 0.75 + 0.35;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.opacity = Math.random() * 0.45 + 0.25;
      this.char = heartShapes[Math.floor(Math.random() * heartShapes.length)];
      this.rotation = (Math.random() - 0.5) * 0.5;
      this.rotSpeed = (Math.random() - 0.5) * 0.015;
      this.color = Math.random() > 0.4 ? '#f4a9c3' : '#ffc3d8';
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
      this.rotation += this.rotSpeed;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x += (dx / dist) * force * 3;
        this.y += (dy / dist) * force * 3;
      }

      // Reset when floating off top
      if (this.y < -30 || this.x < -30 || this.x > width + 30) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(244, 169, 195, 0.6)';

      if (this.char === '•') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.char, 0, 0);
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ========================================================
   2. IntersectionObserver Scroll Reveal
   ======================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ========================================================
   3. 3D Flip Cards & Progress Counter
   ======================================================== */
function initFlipCards() {
  const cards = document.querySelectorAll('.reason');
  const counterEl = document.getElementById('revealedCounter');

  function updateCounter() {
    if (!counterEl) return;
    const openedCount = document.querySelectorAll('.reason.open').length;
    if (openedCount === 0) {
      counterEl.textContent = 'Tap each card to reveal what I love about you ♡';
    } else if (openedCount === cards.length) {
      counterEl.textContent = 'All 10 reasons revealed! Every single one is from my heart ♡';
      counterEl.style.color = '#f4a9c3';
    } else {
      counterEl.textContent = `${openedCount} of 10 reasons revealed ♡`;
    }
  }

  cards.forEach((card) => {
    const toggle = () => {
      card.classList.toggle('open');
      updateCounter();
    };

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

/* ========================================================
   4. Live 10-Month Relationship Counter
   ======================================================== */
function initLoveCounter() {
  const counterContainer = document.getElementById('loveTimer');
  if (!counterContainer) return;

  // Approximate 10 months back (304 days ~ 10 months)
  const approxTenMonthsMs = 10 * 30.4375 * 24 * 60 * 60 * 1000;
  const startDate = new Date(Date.now() - approxTenMonthsMs);

  function updateTimer() {
    const now = new Date();
    const diff = Math.max(0, now - startDate);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const dEl = document.getElementById('timerDays');
    const hEl = document.getElementById('timerHours');
    const mEl = document.getElementById('timerMinutes');
    const sEl = document.getElementById('timerSeconds');

    if (dEl) dEl.textContent = days;
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ========================================================
   5. Interactive Heart Confetti Shower & Sweet Toasts
   ======================================================== */
function initHeartBurst() {
  const heart = document.getElementById('mainHeart');
  const toast = document.getElementById('loveToast');
  if (!heart) return;

  const messages = [
    'I love you more than words can say ♡',
    "You're my favourite person in the entire world ✨",
    'Thank you for 10 beautiful, unforgettable months 💕',
    'I promise to always make you feel special 🌹',
    'Here is to forever and many more months together ♡'
  ];
  let msgIndex = 0;
  let toastTimer;

  function burst(e) {
    const rect = heart.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const symbols = ['♥', '♡', '✨', '🌸', '💖', '💐', '💫'];
    const count = 20;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'flying-heart';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = originX + 'px';
      el.style.top = originY + 'px';
      el.style.setProperty('--dx', (Math.random() - 0.5) * 280 + 'px');
      el.style.setProperty('--rot', (Math.random() - 0.5) * 70 + 'deg');
      el.style.animationDuration = (1.2 + Math.random() * 0.9) + 's';
      el.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2100);
    }

    if (toast) {
      toast.textContent = messages[msgIndex];
      msgIndex = (msgIndex + 1) % messages.length;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
    }
  }

  heart.addEventListener('click', burst);
  heart.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      burst(e);
    }
  });
}

/* ========================================================
   6. Smooth Scrolling for Navigation
   ======================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

