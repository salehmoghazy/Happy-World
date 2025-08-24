(function () {
  const welcomeEl = document.querySelector('.message-welcome');
  const arEl = document.querySelector('.message-ar');
  const cardEl = document.getElementById('card');
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');

  // Resize canvas
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Message sequence
  function runSequence() {
    if (!welcomeEl || !arEl) return;
    welcomeEl.classList.add('show');
    setTimeout(() => {
      welcomeEl.classList.remove('show');
      setTimeout(() => {
        arEl.classList.add('show');
        triggerCelebration();
      }, 500);
    }, 1800);
  }

  // Confetti particles
  const colors = ['#ff2a4f', '#2ad0ff', '#ffd166', '#baffc9', '#f8c0ff', '#ffffff'];
  const confetti = [];
  function spawnConfetti(count) {
    for (let i = 0; i < count; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 40,
        r: 4 + Math.random() * 6,
        c: colors[Math.floor(Math.random() * colors.length)],
        vx: -2 + Math.random() * 4,
        vy: 2 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2,
        vr: -0.2 + Math.random() * 0.4,
        life: 180 + Math.random() * 120
      });
    }
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = confetti.length - 1; i >= 0; i--) {
      const p = confetti[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // gravity
      p.rot += p.vr;
      p.life--;
      if (p.y > canvas.height + 40 || p.life <= 0) {
        confetti.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(-p.r, -p.r * 0.3, p.r * 2, p.r * 0.6);
      ctx.restore();
    }
  }

  let rafId;
  function loop() {
    drawConfetti();
    rafId = requestAnimationFrame(loop);
  }

  function burst(centerX, centerY, rings = 3, perRing = 30) {
    for (let r = 0; r < rings; r++) {
      const radius = 40 + r * 30;
      for (let i = 0; i < perRing; i++) {
        const angle = (i / perRing) * Math.PI * 2 + Math.random() * 0.1;
        confetti.push({
          x: centerX,
          y: centerY,
          r: 3 + Math.random() * 5,
          c: colors[Math.floor(Math.random() * colors.length)],
          vx: Math.cos(angle) * (2 + r * 0.7) + (Math.random() - 0.5),
          vy: Math.sin(angle) * (2 + r * 0.7) + (Math.random() - 0.5),
          rot: Math.random() * Math.PI * 2,
          vr: -0.25 + Math.random() * 0.5,
          life: 220 + Math.random() * 100
        });
      }
    }
  }

  function triggerCelebration() {
    // Initial big burst
    const rect = cardEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.35;
    burst(cx, cy, 4, 36);
    spawnConfetti(160);

    // Subsequent bursts
    setTimeout(() => burst(cx - 160, cy + 40, 3, 28), 300);
    setTimeout(() => burst(cx + 160, cy + 40, 3, 28), 600);
    setTimeout(() => spawnConfetti(120), 900);
  }

  // Start
  loop();
  runSequence();

  // Re-run sequence on click/tap
  document.addEventListener('click', () => {
    confetti.length = 0;
    welcomeEl.classList.remove('show');
    arEl.classList.remove('show');
    setTimeout(runSequence, 80);
  });
})();

