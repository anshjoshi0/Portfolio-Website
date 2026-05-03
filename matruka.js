 // ===== SCROLL PROGRESS =====
    window.addEventListener('scroll', () => {
      const bar = document.getElementById('scrollProgress');
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });

    // ===== REVEAL ON SCROLL =====
    const revEls = document.querySelectorAll('.reveal');
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revEls.forEach(el => revObs.observe(el));

    // ===== CURSOR =====
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursorRing');
    if (cursor && ring) {
      let mx = 0, my = 0, rx = 0, ry = 0;
      document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
      });
      (function loop() {
        rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(loop);
      })();
      document.querySelectorAll('a, button, .feature-card, .tech-card, .stat-box, .challenge-item, .sercard').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.style.width  = '18px'; cursor.style.height  = '18px';
          ring.style.width   = '54px'; ring.style.height   = '54px';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.width  = '10px'; cursor.style.height  = '10px';
          ring.style.width   = '36px'; ring.style.height   = '36px';
        });
      });
    }