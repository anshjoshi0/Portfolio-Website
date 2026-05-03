// ===== DOM REFERENCES =====
const toggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const hero = document.querySelector(".hero");
const homeContent = document.querySelector(".home-content");
const heroImage = document.querySelector(".image-wrapper");
const cards = document.querySelectorAll(".project-card");
const servicesGrid = document.querySelector(".card-grid");

// ===== MOBILE NAVIGATION =====
if (toggle && navMenu) {
  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      navMenu.classList.remove("active");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Close nav on link click (mobile)
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ===== HERO PARALLAX (DESKTOP ONLY) =====
if (hero && homeContent && window.innerWidth > 768) {
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const moveX = (x / rect.width - 0.5) * 16;
    const moveY = (y / rect.height - 0.5) * 16;

    homeContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  hero.addEventListener("mouseleave", () => {
    homeContent.style.transform = "translate(0, 0)";
  });
}

// ===== 3D TILT PROJECT CARDS (PERF-SAFE) =====
if (cards.length && window.innerWidth > 768) {
  cards.forEach((card) => {
    let rect = null;
    let rafId = null;
    let latestEvent = null;

    const update = () => {
      if (!latestEvent || !rect) { rafId = null; return; }

      const x = latestEvent.clientX - rect.left;
      const y = latestEvent.clientY - rect.top;

      const rotateX = (y / rect.height - 0.5) * 8;
      const rotateY = (x / rect.width - 0.5) * -8;

      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      rafId = null;
    };

    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();
      card.style.willChange = "transform";
    });

    card.addEventListener("mousemove", (e) => {
      latestEvent = e;
      if (rafId === null) rafId = requestAnimationFrame(update);
    });

    card.addEventListener("mouseleave", () => {
      rect = null;
      latestEvent = null;
      card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
      card.style.willChange = "auto";
    });
  });
}

// ===== CURSOR =====
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursorRing");

if (cursor && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll("a, button, .work-skill-pill, .sercard, .project-card, .about-card").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "18px";
      cursor.style.height = "18px";
      ring.style.width = "54px";
      ring.style.height = "54px";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width = "10px";
      cursor.style.height = "10px";
      ring.style.width = "36px";
      ring.style.height = "36px";
    });
  });
}

// ===== AUTO-SCROLL SERVICES ROW =====
if (servicesGrid && servicesGrid.children.length && window.innerWidth >= 1024) {
  const originals = Array.from(servicesGrid.children);
  originals.forEach((card) => servicesGrid.appendChild(card.cloneNode(true)));

  let pos = 0;
  const base = 0.4;
  let target = base;
  let speed = base;
  const half = servicesGrid.scrollWidth / 2;
  let rafId = null;

  servicesGrid.style.willChange = "transform";

  const tick = () => {
    speed += (target - speed) * 0.06;
    pos -= speed;
    if (Math.abs(pos) >= half) pos = 0;
    servicesGrid.style.transform = `translate3d(${pos}px, 0, 0)`;
    rafId = requestAnimationFrame(tick);
  };

  servicesGrid.addEventListener("mouseenter", () => (target = base * 0.2));
  servicesGrid.addEventListener("mouseleave", () => (target = base));

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && rafId === null) {
        rafId = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    { threshold: 0.1 }
  );

  io.observe(servicesGrid);
}

// ===== STAGGER REVEAL for about cards =====
const aboutCards = document.querySelectorAll('.about-card');
if (aboutCards.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  aboutCards.forEach(el => {
    el.classList.add('reveal-up');
    obs.observe(el);
  });
}

// ===== ACTIVE NAV LINK on scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const activateNav = () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active-nav');
  });
};

window.addEventListener('scroll', activateNav, { passive: true });
